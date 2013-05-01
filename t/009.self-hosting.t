#!perl
use strict;
use warnings;
use File::Temp qw(tempdir);
use File::Copy qw(copy);

use Test::More;

plan skip_all => 'JSX_OPTS specified' if $ENV{JSX_OPTS};

plan tests => 15;

{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");

    my $jsx = "$tmpdir/jsx";
    copy "tool/bootstrap-compiler.js", $jsx; # start

    my @make_executable_opts = ("--executable", "node", "--output", $jsx, "src/jsx-node-front.jsx");

    is system("node", $jsx, @make_executable_opts), 0,
        'compile self from bootstrap/jsx-compiler.js';

    is system("node", $jsx, @make_executable_opts), 0,
        'compile self from the new executable';

    # JavaScript outputs by non-optimized JSX compiler
    my $src_by_jsx_wo_optim           = `node $jsx src/jsx-node-front.jsx`;
    my $optimized_src_by_jsx_wo_optim = `node $jsx --release src/jsx-node-front.jsx`;

    foreach my $opts([qw(--release)], [qw(--minify)], [qw(--release --minify)]) {
        note "with: @{$opts}";

        is system("node", $jsx, @{$opts}, @make_executable_opts), 0,
            "compile self with @{$opts} release from the new executable";
        is system("node", $jsx, @{$opts}, @make_executable_opts), 0,
            "compile self with @{$opts} release from the new executable with --release";

        # JavaScript outputs by optimized and/or minified JSX compiler
        my $src_by_jsx_w_optim           = `node $jsx src/jsx-node-front.jsx`;
        my $optimized_src_by_jsx_w_optim = `node $jsx --release src/jsx-node-front.jsx`;

        ok $src_by_jsx_w_optim eq $src_by_jsx_wo_optim ,
            "outputs between with-optimization and without-optmization";
        ok $optimized_src_by_jsx_w_optim eq $optimized_src_by_jsx_wo_optim,
            "optimized outputs between with-optimization and without-optmization";
    }
}
done_testing;
