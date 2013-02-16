#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

use tool::Util;

my @files = glob("example/*.jsx");
push @files, "submodules/v8bench/run.jsx" if -f "submodules/v8bench/run.jsx";
plan tests => 2 * scalar @files;

my $workdir = tempdir(CLEANUP => 1, DIR => ".");

for my $file(@files) {
    {
        my $cmd = qq{--executable node --output $workdir/compiled.js $file};
        my($ok, $stdout, $stderr) = jsx($cmd);

        ok $ok, $cmd or fail($stderr);
    }
    {
        my $cmd = qq{--run "$file"};
        my($ok, $stdout, $stderr) = jsx($cmd);

        ok $ok, $cmd or fail($stderr);
    }
}

