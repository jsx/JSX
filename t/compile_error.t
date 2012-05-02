#! /usr/bin/perl

use strict;
use warnings;
use Test::More;

my @files = @ARGV;
@files = grep { $_ !~ /\.skip\.jsx$/ } <t/compile_error/*.jsx>
    unless @files;

plan tests => scalar @files;

for my $file (@files) {
    my $err = `bin/jsx $file 2>&1`;
    ok $? != 0 && $err !~ /process\.nextTick error/, $file;
    note $err;
}
