#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

use t::util::Util;

my @files = <example/*.jsx>;
plan tests => 2 * scalar @files;

my $workdir = tempdir(CLEANUP => 1);

for my $file(@files) {
    my $expected = get_expected($file); # may be undef

    {
        note '--run';

        my $cmd = qq{bin/jsx --run "$file"};
        my $got = `$cmd`;

        is $?, 0, $cmd;
    }

    {
        note '--executable';

        my $cmd = qq{bin/jsx --executable --output $workdir/compiled "$file"};
        system $cmd;

        is $?, 0, $cmd;
    }
}

