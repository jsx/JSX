#!perl
use strict;
use warnings;
use File::Temp qw(tempdir);
use File::Copy qw(copy);

use Test::More;

plan skip_all => 'JSX_OPTS specified' if $ENV{JSX_OPTS};

plan tests => 32;

my @opts = (
    "",
    "--release",
    "--minify",
    "--release --minify",
);

{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");
    my %expected_from_3rdgen;

    for my $gen2opts (@opts) {
        is compile(
            "bin/jsx",
            "$tmpdir/gen2",
            $gen2opts,
        ), 0, "create 2nd gen '$gen2opts'";
        for my $gen3opts (@opts) {
            is compile(
                "$tmpdir/gen2",
                "$tmpdir/gen3",
                $gen3opts,
            ), 0, "create 3rd gen '$gen2opts' => '$gen3opts'";
            my $gen3output = slurp("$tmpdir/gen3");
            if (defined $expected_from_3rdgen{$gen3opts}) {
                is(
                    $expected_from_3rdgen{$gen3opts},
                    $gen3output,
                    "output of 3rd gen are equal '$gen2opts' => '$gen3opts'",
                );
            } else {
                $expected_from_3rdgen{$gen3opts} = $gen3output;
            }
        }
    }
}
done_testing;

sub compile {
    my ($bootstrap, $target, @opts) = @_;
    system(
        "make",
        "compiler-core",
        "BOOTSTRAP_COMPILER=$bootstrap",
        "COMPILER_TARGET=$target",
        "COMPILER_COMPILE_OPTS=" . join(" ", @opts, "--executable", "node"),
    );
}

sub slurp {
    my $fn = shift;
    open my $fh, "<", $fn or die "could not open file:$fn:$!";
    do { local $/; <$fh> };
}
