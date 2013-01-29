package Test::TCP::CheckPort;
use strict;
use warnings;
use base qw/Exporter/;
use Test::TCP ();

our @EXPORT = qw/ check_port /;

sub check_port { print Test::TCP::_check_port( @ARGV ) }

1;
