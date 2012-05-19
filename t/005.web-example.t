#!/usr/bin/perl
use strict;
use warnings;
use Test::More;

my @files = <web/example/*.jsx>;
plan tests => 2 * scalar @files;

for my $file(@files) {
    {
        my $cmd = qq{bin/jsx "$file"};
        `$cmd`; # ensure it compiles

        is $?, 0, $cmd;
    }
    {
        my $cmd = qq{bin/jsx --mode parse "$file"};
        `$cmd`; # ensure it compiles

        is $?, 0, $cmd;
    }
}

