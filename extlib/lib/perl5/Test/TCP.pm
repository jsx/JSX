package Test::TCP;
use strict;
use warnings;
use 5.00800;
our $VERSION = '1.18';
use base qw/Exporter/;
use IO::Socket::INET;
use Test::SharedFork 0.12;
use Test::More ();
use Config;
use POSIX;
use Time::HiRes ();
use Carp ();

our @EXPORT = qw/ empty_port test_tcp wait_port /;

# process does not die when received SIGTERM, on win32.
my $TERMSIG = $^O eq 'MSWin32' ? 'KILL' : 'TERM';

# get a empty port on 49152 .. 65535
# http://www.iana.org/assignments/port-numbers
sub empty_port {
    my $port = do {
        if (@_) {
            my $p = $_[0];
            $p = 49152 unless $p =~ /^[0-9]+$/ && $p < 49152;
            $p;
        } else {
            50000 + int(rand()*1000);
        }
    };

    while ( $port++ < 60000 ) {
        next if _check_port($port);
        my $sock = IO::Socket::INET->new(
            Listen    => 5,
            LocalAddr => '127.0.0.1',
            LocalPort => $port,
            Proto     => 'tcp',
            (($^O eq 'MSWin32') ? () : (ReuseAddr => 1)),
        );
        return $port if $sock;
    }
    die "empty port not found";
}

sub test_tcp {
    my %args = @_;
    for my $k (qw/client server/) {
        die "missing madatory parameter $k" unless exists $args{$k};
    }
    my $server = Test::TCP->new(
        code => $args{server},
        port => $args{port} || empty_port(),
    );
    $args{client}->($server->port, $server->pid);
    undef $server; # make sure
}

sub _check_port {
    my ($port) = @_;

    my $remote = IO::Socket::INET->new(
        Proto    => 'tcp',
        PeerAddr => '127.0.0.1',
        PeerPort => $port,
    );
    if ($remote) {
        close $remote;
        return 1;
    }
    else {
        return 0;
    }
}

sub wait_port {
    my $port = shift;

    my $retry = 100;
    while ( $retry-- ) {
        return if $^O eq 'MSWin32' ? `$^X -MTest::TCP::CheckPort -echeck_port $port` : _check_port( $port );
        Time::HiRes::sleep(0.1);
    }
    die "cannot open port: $port";
}

# ------------------------------------------------------------------------- 
# OO-ish interface

sub new {
    my $class = shift;
    my %args = @_==1 ? %{$_[0]} : @_;
    Carp::croak("missing mandatory parameter 'code'") unless exists $args{code};
    my $self = bless {
        auto_start => 1,
        _my_pid    => $$,
        %args,
    }, $class;
    $self->{port} = Test::TCP::empty_port() unless exists $self->{port};
    $self->start()
      if $self->{auto_start};
    return $self;
}

sub pid  { $_[0]->{pid} }
sub port { $_[0]->{port} }

sub start {
    my $self = shift;
    if ( my $pid = fork() ) {
        # parent.
        $self->{pid} = $pid;
        Test::TCP::wait_port($self->port);
        return;
    } elsif ($pid == 0) {
        # child process
        $self->{code}->($self->port);
        # should not reach here
        if (kill 0, $self->{_my_pid}) { # warn only parent process still exists
            warn("[Test::TCP] Child process does not block(PID: $$, PPID: $self->{_my_pid})");
        }
        exit 0;
    } else {
        die "fork failed: $!";
    }
}

sub stop {
    my $self = shift;

    return unless defined $self->{pid};
    return unless $self->{_my_pid} == $$;

    # This is a workaround for win32 fork emulation's bug.
    #
    # kill is inherently unsafe for pseudo-processes in Windows
    # and the process calling kill(9, $pid) may be destabilized
    # The call to Sleep will decrease the frequency of this problems
    #
    # SEE ALSO:
    #   http://www.gossamer-threads.com/lists/perl/porters/261805
    #   https://rt.cpan.org/Ticket/Display.html?id=67292
    Win32::Sleep(0) if $^O eq "MSWin32"; # will relinquish the remainder of its time slice

        kill $TERMSIG => $self->{pid};

    Win32::Sleep(0) if $^O eq "MSWin32"; # will relinquish the remainder of its time slice


    local $?; # waitpid modifies original $?.
    LOOP: while (1) {
        my $kid = waitpid( $self->{pid}, 0 );
        if ($^O ne 'MSWin32') { # i'm not in hell
            if (POSIX::WIFSIGNALED($?)) {
                my $signame = (split(' ', $Config{sig_name}))[POSIX::WTERMSIG($?)];
                if ($signame =~ /^(ABRT|PIPE)$/) {
                    Test::More::diag("your server received SIG$signame");
                }
            }
        }
        if ($kid == 0 || $kid == -1) {
            last LOOP;
        }
    }
    undef $self->{pid};
}

sub DESTROY {
    my $self = shift;
    local $@;
    $self->stop();
}

1;
__END__

=encoding utf8

=head1 NAME

Test::TCP - testing TCP program

=head1 SYNOPSIS

    use Test::TCP;

    my $server = Test::TCP->new(
        code => sub {
            my $port = shift;
            ...
        },
    );
    my $client = MyClient->new(host => '127.0.0.1', port => $server->port);
    undef $server; # kill child process on DESTROY

Using memcached:

    use Test::TCP;

    my $memcached = Test::TCP->new(
        code => sub {
            my $port = shift;

            exec $bin, '-p' => $port;
            die "cannot execute $bin: $!";
        },
    );
    my $memd = Cache::Memcached->new({servers => ['127.0.0.1:' . $memcached->port]});
    ...

And functional interface is available:

    use Test::TCP;
    test_tcp(
        client => sub {
            my ($port, $server_pid) = @_;
            # send request to the server
        },
        server => sub {
            my $port = shift;
            # run server
        },
    );

=head1 DESCRIPTION

Test::TCP is test utilities for TCP/IP programs.

=head1 METHODS

=over 4

=item empty_port

    my $port = empty_port();

Get the available port number, you can use.

Normally, empty_port() finds empty port number from 49152..65535.
See L<http://www.iana.org/assignments/port-numbers>

But you want to use another range, use a following form:

    # 5963..65535
    my $port = empty_port(5963);



=item test_tcp

Functional interface.

    test_tcp(
        client => sub {
            my $port = shift;
            # send request to the server
        },
        server => sub {
            my $port = shift;
            # run server
        },
        # optional
        port => 8080
    );

=item wait_port

    wait_port(8080);

Waits for a particular port is available for connect.

=back

=head1 OO-ish interface

=over 4

=item my $server = Test::TCP->new(%args);

Create new instance of Test::TCP.

Arguments are following:

=over 4

=item $args{auto_start}: Boolean

Call C<< $server->start() >> after create instance.

Default: true

=item $args{code}: CodeRef

The callback function. Argument for callback function is: C<< $code->($pid) >>.

This parameter is required.

=back

=item $server->start()

Start the server process. Normally, you don't need to call this method.

=item $server->stop()

Stop the server process.

=item my $pid = $server->pid();

Get the pid of child process.

=item my $port = $server->port();

Get the port number of child process.

=back

=head1 FAQ

=over 4

=item How to invoke two servers?

You can call test_tcp() twice!

    test_tcp(
        client => sub {
            my $port1 = shift;
            test_tcp(
                client => sub {
                    my $port2 = shift;
                    # some client code here
                },
                server => sub {
                    my $port2 = shift;
                    # some server2 code here
                },
            );
        },
        server => sub {
            my $port1 = shift;
            # some server1 code here
        },
    );

Or use OO-ish interface instead.

    my $server1 = Test::TCP->new(code => sub {
        my $port1 = shift;
        ...
    });
    my $server2 = Test::TCP->new(code => sub {
        my $port2 = shift;
        ...
    });

    # your client code here.
    ...

=item How do you test server program written in other languages like memcached?

You can use C<exec()> in child process.

    use strict;
    use warnings;
    use utf8;
    use Test::More;
    use Test::TCP 1.08;
    use File::Which;

    my $bin = scalar which 'memcached';
    plan skip_all => 'memcached binary is not found' unless defined $bin;

    my $memcached = Test::TCP->new(
        code => sub {
            my $port = shift;

            exec $bin, '-p' => $port;
            die "cannot execute $bin: $!";
        },
    );

    use Cache::Memcached;
    my $memd = Cache::Memcached->new({servers => ['127.0.0.1:' . $memcached->port]});
    $memd->set(foo => 'bar');
    is $memd->get('foo'), 'bar';

    done_testing;

=back

=head1 AUTHOR

Tokuhiro Matsuno E<lt>tokuhirom@gmail.comE<gt>

=head1 THANKS TO

kazuhooku

dragon3

charsbar

Tatsuhiko Miyagawa

lestrrat

=head1 SEE ALSO

=head1 LICENSE

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
