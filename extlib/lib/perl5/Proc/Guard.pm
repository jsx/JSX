package Proc::Guard;
use strict;
use warnings;
use 5.00800;
our $VERSION = '0.06';
use Carp ();

our $EXIT_STATUS;

# functional interface
our @EXPORT = qw/proc_guard/;
use Exporter 'import';
sub proc_guard {
    return Proc::Guard->new(do {
        if (@_==1 && ref($_[0])  && ref($_[0]) eq 'CODE') {
            +{ code => $_[0] }
        } else {
            +{ command => [@_] }
        }
    });
}

# OOish interface
use POSIX;
use Class::Accessor::Lite 0.05 (
	rw => ['pid'],
);

sub new {
    my $class = shift;
    my %args = @_==1 ? %{$_[0]} : @_;

    my $self = bless {
        _owner_pid => $$,
        auto_start => 1,
        %args,
    }, $class;

    if ($self->{command} && !ref($self->{command})) {
        $self->{command} = [$self->{command}];
    }
    unless ($self->{command} || $self->{code}) {
        Carp::croak("'command' or 'code' is required.");
    }

    $self->start()
        if $self->{auto_start};

    return $self;
}

sub start {
    my $self = shift;

    my $pid = fork();
    die "fork failed: $!" unless defined $pid;
    if ($pid == 0) { # child
        if ($self->{command}) {
            exec @{$self->{command}};
            die "cannot exec @{$self->{command}}: $!";
        } else {
            $self->{code}->();
            exit(0); # exit after work
        }
    }
    $self->pid($pid);
}

sub stop {
    my ( $self, $sig ) = @_;
    return
        unless defined $self->pid;
    $sig ||= SIGTERM;

    kill $sig, $self->pid;
    1 while waitpid( $self->pid, 0 ) <= 0;
    $EXIT_STATUS = $?;

    $self->pid(undef);
}

sub DESTROY {
    my $self = shift;
    if (defined $self->pid && $$ == $self->{_owner_pid}) {
        local $?; # "END" function and destructors can change the exit status by modifying $?.(perldoc -f exit)
        $self->stop()
    }
}

1;
__END__

=encoding utf8

=head1 NAME

Proc::Guard - process runner with RAII pattern

=head1 SYNOPSIS

    use Test::TCP qw/empty_port wait_port/;
    use File::Which qw/which/;
    use Proc::Guard;

    my $port = empty_port();
    my $proc = proc_guard(scalar(which('memcached')), '-p', $port);
    wait_port($port);

    # your code here

    # --------------
    # or, use perl code
    my $proc = proc_guard(sub {
        ... # run this code in child process
    });
    ...

=head1 DESCRIPTION

Proc::Guard runs process, and destroys it when the perl script exits.

This is useful for testing code working with server process.

=head1 FUNCTIONS

=over 4

=item proc_guard(@cmdline|\&code)

This is shorthand for:

    Proc::Guard->new(
        command => \@cmdline,
    );

or

    Proc::Guard->new(
        code => \&code,
    );

=back

=head1 METHODS

=over 4

=item my $proc = Proc::Guard->new(%args);

Create and run a process. The process is terminated when the returned object is being DESTROYed.

=over 4

=item command

    Proc::Guard->new(command => '/path/to/memcached');
    # or
    Proc::Guard->new(command => ['/path/to/memcached', '-p', '11211']);

The command line.

=item code

    Proc::Guard->new(code => sub { ... });

'code' or 'command' is required.

=item auto_start

    Proc::Guard->new(auto_start => 0);

Start child process automatically or not(default: 1).

=back

=item pid

Returns process id (or undef if not running).

=item start

Starts process.

=item stop

Stops process.

=back

=head1 VARIABLES

=over 4

=item $Proc::Guard::EXIT_STATUS

The last exit status code by C<< $proc->stop >>.

=back

=head1 AUTHOR

Tokuhiro Matsuno E<lt>tokuhirom AAJKLFJEF GMAIL COME<gt>

=head1 LICENSE

Copyright (C) Tokuhiro Matsuno

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
