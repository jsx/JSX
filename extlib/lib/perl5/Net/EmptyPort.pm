package Net::EmptyPort;
use strict;
use warnings;
use base qw/Exporter/;
use IO::Socket::INET;
use Time::HiRes ();

our @EXPORT = qw/ empty_port check_port /;

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
        next if check_port($port);
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

sub check_port {
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
    my ($port, $sleep, $retry) = @_;
    $retry ||= 100;
    $sleep ||= 0.1;

    while ( $retry-- ) {
        if ($^O eq 'MSWin32' ? `$^X -MNet::EmptyPort -echeck_port $port` : check_port( $port )) {
            return 1;
        }
        Time::HiRes::sleep($sleep);
    }
    return 0;
}

1;

__END__

=encoding utf8

=head1 NAME

Net::EmptyPort - find a free TCP port

=head1 SYNOPSIS

    use Net::EmptyPort qw(empty_port check_port);

    # get a random free port
    my $port = empty_port();

    # check if a port is already used
    if (check_port(5000)) {
        say "Port 5000 already in use";
    }

=head1 DESCRIPTION

Net::EmptyPort helps finding an empty TCP port.

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

=item check_port

    my $true_or_false = check_port(5000);

Checks if the given port is already in use. Returns true if it is in use (i.e. if the port is NOT free). Returns false if the port is free.

=item wait_port($port:Int[, $sleep:Number, $retry:Int])

Waits for a particular port is available for connect.

This method waits the C<< $port >> number is ready to accept a request.

C<$port> is a port number to check.

Sleep C<$sleep> seconds after check the port. You can specify C<$sleep> in floating number.

And, retry C<$retry> times.

I<Return value> : Return true if the port is available, false otherwise.

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
