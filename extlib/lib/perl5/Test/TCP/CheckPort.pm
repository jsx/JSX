package Test::TCP::CheckPort;
use strict;
use warnings;
use base qw/Exporter/;
use Net::EmptyPort qw();

our @EXPORT = qw/ check_port /;

sub check_port { print Net::EmptyPort::check_port( @ARGV ) }

1;
