package Test::TCP::CheckPort;
use strict;
use warnings;
use base qw/Exporter/;
use Net::EmptyPort qw();

our @EXPORT = qw/ check_port /;

sub check_port { print Net::EmptyPort::check_port( @ARGV ) }

1;

__END__

=head1 NAME

Test::TCP::CheckPort - check if a port is open from command line

=head1 SYNOPSIS

  $^X -MTest::TCP::CheckPort -echeck_port 8080

=head1 DESCRIPTION

This is a wrapper for L<Net::EmptyPort> which checks if a given port
is open, from the command line argument (C<@ARGV>). Because it works
with port numbers in the argument list, you don't need to quote it
when running with the perl executable.

=head1 SEE ALSO

L<Test::TCP> L<Net::EmptyPort>

=cut
