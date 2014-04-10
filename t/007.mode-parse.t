#!/usr/bin/perl
use strict;
use warnings;
use Test::More;

my @files = glob 't/run/*.jsx';

plan tests => 2 * scalar @files;

foreach my $file(@files) {
    local $TODO = "todo" if $file =~ / \.todo\. /xms;
    my $json = `bin/jsx --mode parse $file`;
    is $?, 0, "bin/jsx --mode parse $file";
    ok $json;
}

