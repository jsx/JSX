#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

use tool::Util;

my @files = glob("example/*.jsx");
plan tests => 2 * scalar @files;

my $workdir = tempdir(CLEANUP => 1, DIR => ".");

for my $file(@files) {
    {
        my $cmd = qq{--executable node --output $workdir/compiled.js $file};
        my($ok, $stdout, $stderr) = jsx($cmd);

        ok $ok, $cmd or fail($stderr);
    }
    {
        my($ok, $stdout, $stderr) = xsystem("node", "$workdir/compiled.js");

        ok $ok, "run" or fail($stderr);
    }
}

