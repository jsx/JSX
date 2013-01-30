#!perl
use strict;
use warnings;
use File::Temp qw(tempdir);
use File::Copy qw(copy);

use Test::More tests => 6;
{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");

    my $jsx = "$tmpdir/jsx";
    copy "tool/bootstrap-compiler.js", $jsx;

    my @make_executable_opts = ("--executable", "node", "--output", $jsx, "src/jsx-node-front.jsx");

    is system("node", $jsx, @make_executable_opts), 0,
        'compile self from bootstrap/jsx-compiler.js';

    is system("node", $jsx, @make_executable_opts), 0,
        'compile self from the new executable';

    my $src_by_jsx_wo_optimization           = `node $jsx src/jsx-node-front.jsx`;
    my $optimized_src_by_jsx_wo_optimization = `node $jsx --release src/jsx-node-front.jsx`;

    is system("node", $jsx, "--release", @make_executable_opts), 0,
        'compile self with --release from the new executable';
    is system("node", $jsx, "--release", @make_executable_opts), 0,
        'compile self with --release from the new executable with --release';

    my $src_by_jsx_w_optimization = `node $jsx src/jsx-node-front.jsx`;
    my $optimized_src_by_jsx_w_optimization = `node $jsx --release src/jsx-node-front.jsx`;

    ok $src_by_jsx_w_optimization eq $src_by_jsx_wo_optimization, "outputs between with-optimization and without-optmization";
    ok $optimized_src_by_jsx_w_optimization eq $optimized_src_by_jsx_wo_optimization, "optimized outputs between with-optimization and without-optmization";
}
done_testing;
