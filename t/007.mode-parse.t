#!/usr/bin/perl
use strict;
use warnings;
use Test::More;

use tool::Util;

my @files = glob 't/run/*.jsx';

plan tests => 2 * scalar @files;

foreach my $file(@files) {
    local $TODO = "todo" if $file =~ / \.todo\. /xms;
    my($ok, $json, $err) = jsx("--mode parse $file");
    ok $ok, "--mode parse $file";
    ok $json;
}

