use 5.10.0;
use strict;
use warnings;
use Storable qw(lock_retrieve);
use Tie::IxHash;
use File::Basename qw(dirname);
use Data::Dumper;

my $classdef = lock_retrieve(dirname(__FILE__) . "/.idl2jsx.bin");

my $dd = Data::Dumper->new([$classdef], ['*classdef']);
$dd->Indent(1);
print $dd->Dump();
