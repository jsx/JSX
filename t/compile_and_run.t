#! /usr/bin/perl

use strict;
use warnings;
use File::Temp qw(tempdir);
use Test::More;

my @files = <t/compile_and_run/*.jsx>;

plan tests => scalar @files;

run($_)
    for @files;

sub run {
    my $file = shift;
    my $expected = get_expected($file);
    my $tempdir = tempdir(CLEANUP => 1);

    # compile (FIXME support C++)
    system("bin/jsx $file > $tempdir/compiled.js") == 0
        or die "compile failed: $?";

    # add the bootstrap code
    {
        open my $fh, ">>", "$tempdir/compiled.js"
            or die "failed to open file:$tempdir/compiled.js:$!";
        print $fh "\nTest.run0();\n";
    }

    # execute compiled node
    my $output = do {
        open my $fh, "-|", "node $tempdir/compiled.js"
            or die "failed to invoke node:$!";
        local $/;
        my $ret = join '', <$fh>;
        close $fh;
        die "failed to execute compiled script"
            if $? != 0;
        $ret;
    };

    # compare the results
    is $output, $expected, $file;
}

sub get_expected {
    my $file = shift;
    my $content = do {
        open my $fh, "<", $file
            or die "failed to open $file:$!";
        local $/;
        join '', <$fh>;
    };
    $content =~ m{/\*EXPECTED\n(.*?\n)\*/}s
        or die "could not find EXPECTED in file:$file\n";
    $1;
}
