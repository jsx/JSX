#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

my @files = <example/*.jsx>;
plan tests => 2 * scalar @files;

my $workdir = tempdir(CLEANUP => 1);

for my $file(@files) {
    {
        my $cmd = qq{bin/jsx --run "$file"};
        my $got = `$cmd`;

        is $?, 0, $cmd;
    }

    {
        my $cmd = qq{bin/jsx --executable node --output $workdir/compiled "$file"};
        system $cmd;

        is $?, 0, $cmd;
    }
}

