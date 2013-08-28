#!perl
use strict;
use warnings;
use File::Copy qw(copy);

use Test::More;

plan skip_all => 'JSX_OPTS specified' if $ENV{JSX_OPTS};

plan tests => 36;

my @opts = (
    "",
    "--release",
    "--minify",
    "--release --minify",
);

{
    my $tmpdir = "tmp";
    my @expected_src;

    # compile 2nd gens, and store the expected source (to be compared with the result of 3rd gens)
    for (my $gen2 = 0; $gen2 < @opts; $gen2++) {
        is compile(
            "bin/jsx",
            "$tmpdir/gen2-$gen2.js",
            $opts[$gen2],
        ), 0, "create 2nd gen '$opts[$gen2]'";
        $expected_src[$gen2] = slurp("$tmpdir/gen2-$gen2.js");
    }

    # compile 3rd gens, and check their output
    for (my $gen2 = 0; $gen2 < @opts; $gen2++) {
        for (my $gen3 = 0; $gen3 < @opts; $gen3++) {
            is compile(
                "$tmpdir/gen2-$gen2.js",
                "$tmpdir/gen3-$gen2.js",
                $opts[$gen3],
            ), 0, "create 3rd gen '$opts[$gen3]' from 2nd gen '$opts[$gen2]'";
            ok(
                $expected_src[$gen3] eq slurp("$tmpdir/gen3-$gen2.js"),
                "output of 3rd gen is same for '$opts[$gen3]'"
            );
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
