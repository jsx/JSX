#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Find;

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
        my $cmd = qq{$jsx "$file"};
        `$cmd`; # ensure it compiles

        is $?, 0, $cmd;
    }
    {
        my $cmd = qq{$jsx --mode parse "$file"};
        `$cmd`; # ensure it compiles

        is $?, 0, $cmd;
    }
    {
        local $TODO = "--release may fail in this moment" if $file =~ m{web/src/};
        my $cmd = qq{$jsx --release "$file"};
        `$cmd`; # ensure it compiles

        is $?, 0, $cmd;
    }
}

