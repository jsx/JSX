#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use t::util::Util;

my @files = <example/*.jsx>;
plan tests => 2 * scalar @files;

for my $file(@files) {
    my $expected = get_expected($file); # may be undef

    my $cmd = qq{bin/jsx --run "$file"};
    my $got = `$cmd`;

    is $?, 0, $cmd;
    if(defined $expected) {
        is $got, $expected, 'output';
    }
    else {
        pass "skipped output test";
    }
}

