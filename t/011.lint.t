#!perl
# use Google Closure Compiler as a lint
use strict;
use warnings;

use tool::Util;

use Test::More;

use File::Which qw(which);
use File::Temp  qw(tempdir);

my $c = which("closure-compiler");

my @c_opts = ('--use_types_for_optimization');

plan skip_all => "no closure-compiler found" unless $c;

{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");

    my($ok, $stdout, $stderr) = jsx("--release", "--output", "$tmpdir/jsx", "src/jsx-node-front.jsx");
    $ok or die $stderr;

    my $original_size = -s "$tmpdir/jsx";

    my $warnings = `$c @c_opts --js_output_file $tmpdir/compressed $tmpdir/jsx`;
    ok $? == 0, "compile JSX with closure-compiler";
    if ($warnings) {
        diag $warnings;
    }

    my $compressed_size = -s "$tmpdir/compressed";

    diag sprintf("compress ratio: %.01f", 100*($compressed_size / $original_size));
}


done_testing;
