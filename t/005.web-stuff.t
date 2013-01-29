#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Find;

use tool::Util;

my $jsx = "bin/jsx";

my @files = @ARGV;
if (! @files) {
    find {
        wanted => sub {
            return unless /\.jsx$/;

            push @files, $_;
        },
        no_chdir => 1,
    }, 'web';
}

plan tests => 3 * scalar @files;

for my $file(@files) {
    {
        my($ok, $stdout, $stderr) = jsx($file);
        ok $ok, "just compile $file" or diag($stderr);
    }
    {
        my $cmd = qq{--mode parse "$file"};
        my($ok, $stdout, $stderr) = jsx($file);

        ok $ok, $cmd or diag($stderr);
    }
    {
        my $cmd = qq{--mode parse "$file"};
        my($ok, $stdout, $stderr) = jsx($file);

        ok $ok, $cmd or diag($stderr);
    }
}

