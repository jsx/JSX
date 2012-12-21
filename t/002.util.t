#!/usr/bin/perl
use strict;
use warnings;
use Test::More tests => 1;

my $file = 't/src/002.util.jsx';
my $src = `bin/jsx --test $file`;
is $?, 0, "bin/jsx --test $file";
exit;
