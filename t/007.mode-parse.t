#!/usr/bin/perl
use strict;
use warnings;
use Test::More;

use File::Basename qw(dirname);
use lib dirname(__FILE__). "/../extlib/lib/perl5";
use t::util::Util;

my @files = glob 't/run/*.jsx';

plan tests => 2 * scalar @files;

foreach my $file(@files) {
    my($ok, $json, $err) = jsx("--mode parse $file");
    ok $ok, "--mode parse $file", or die $err;
    ok $json;
}

