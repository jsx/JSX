#! /usr/bin/perl

use strict;
use warnings;
use File::Temp qw(tempdir);
use Test::More;

my @files = grep { $_ !~ /\.skip\.jsx$/ } <t/compile_error/*.jsx>;

plan tests => scalar @files;

for my $file (@files) {
    ok system("bin/jsx $file > /dev/null 2>&1") != 0, $file;
}
