#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

use t::util::Util;

my @files = <example/*.jsx>;
plan tests => 4 * scalar @files;

my $workdir = tempdir(CLEANUP => 1);

for my $file(@files) {
    my $expected = get_expected($file); # may be undef

    {
        note '--run';

        my $cmd = qq{bin/jsx --run "$file"};
        my $got = `$cmd`;

        is $?, 0, $cmd;
        if(defined $expected) {
            is $got, $expected, "output";
        }
        else {
            pass "skipped output test";
        }
    }

    {
        note '--executable';

        my $cmd = qq{bin/jsx --executable --output $workdir/compiled "$file"};
        system $cmd;

        is $?, 0, $cmd;

        if(defined $expected) {
            is scalar(`$workdir/compiled`), $expected, "output";
        }
        else {
            pass "skip output test";
        }
    }
}

