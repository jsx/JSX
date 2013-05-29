#!/usr/bin/perl
use strict;
use warnings;
use tool::Util;
use Test::More tests => 106;

note "testing jsx(1)";

sub jsx_ok {
    my($opts, $expected_stdout) = @_;

    local $Test::Builder::Level = $Test::Builder::Level + 1;

    my($ok, $stdout, $stderr) = jsx($opts);

    ok  $ok, "`jsx $opts` exited successfully";
    if (defined $expected_stdout) {
        is $stdout, $expected_stdout, "... with expected stdout";
    }
    else {
        ok  $stdout, "... with    stdout output";
    }
    ok !$stderr, "... without stderr output" or diag $stderr;
}

sub jsx_fail_ok {
    my($opts) = @_;

    local $Test::Builder::Level = $Test::Builder::Level + 1;

    my($ok, $stdout, $stderr) = jsx($opts);

    ok !$ok, "`jsx $opts` failed";
    ok !$stdout, "... without stdout output" or diag $stdout;
    ok  $stderr, "... with    stderr output";
}

foreach my $jsx(qw(bin/jsx bin/jsx-with-server)) {
    local $tool::Util::JSX = $jsx;

    jsx_ok("--version");
    jsx_ok("--version");
    jsx_ok("--help");

    jsx_fail_ok("--no-such-option");

    # the following options require an argument

    jsx_fail_ok("--executable");
    jsx_fail_ok("--add-search-path");
    jsx_fail_ok("--mode");
    jsx_fail_ok("--complete");
    jsx_fail_ok("--target");

    jsx_fail_ok("--optimize no-such-optimize-command t/006.jsx/hello.jsx");

    # sanity check

    jsx_ok("--run t/006.jsx/hello.jsx", "Hello, world!\n");
    jsx_ok("--run --executable node t/006.jsx/hello.jsx", "Hello, world!\n");
    jsx_ok("--run --release t/006.jsx/hello.jsx", "");
    jsx_ok("--run --working-dir t/ 006.jsx/hello.jsx", "Hello, world!\n");

    jsx_ok("--run t/006.jsx/dump-args.jsx foo bar",    qq{["foo","bar"]\n});
    jsx_ok("--run t/006.jsx/dump-args.jsx 'foo bar'",  qq{["foo bar"]\n});
    jsx_ok("--run t/006.jsx/dump-args.jsx '/@~_+&=;'", qq{["/@~_+&=;"]\n});

    # real command

    is scalar(`$jsx --run --input-filename t/006.jsx/hello.jsx -- - < t/006.jsx/hello.jsx`), "Hello, world!\n", "jsx --run -- - (input from stdin)";
    is $?, 0, "... exited successfully";
}
