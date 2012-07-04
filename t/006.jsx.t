#!/usr/bin/perl
use strict;
use warnings;
use Test::More tests => 16;

ok scalar(`bin/jsx --version`), "jsx --version shows something";
is $?, 0, "... exits with 0";

ok scalar(`bin/jsx --help`), "jsx --help shows something";
is $?, 0, "... exits with 0";

isnt system("bin/jsx --no-such-option >/dev/null 2>&1"), 0,
    "jsx --no-such-option exits with non-zero";

isnt system("bin/jsx --executable >/dev/null 2>&1"), 0,
    "jsx --executable (with no arg) exits with non-zero";
isnt system("bin/jsx --add-search-path >/dev/null 2>&1"), 0,
    "jsx --add-search-path (with no arg) exits with non-zero";
isnt system("bin/jsx --mode >/dev/null 2>&1"), 0,
    "jsx --mode (with no arg) exits with non-zero";
isnt system("bin/jsx --complete >/dev/null 2>&1"), 0,
    "jsx --complete (with no arg) exits with non-zero";
isnt system("bin/jsx --target >/dev/null 2>&1"), 0,
    "jsx --target (with no arg) exits with non-zero";

is scalar(`bin/jsx --run t/006.jsx/hello.jsx`), "Hello, world!\n", "jsx --run";
is $?, 0, "... exits with 0";

is scalar(`bin/jsx --run -- - < t/006.jsx/hello.jsx`), "Hello, world!\n", "jsx --run -- -";
is $?, 0, "... exits with 0";

is scalar(`bin/jsx --run t/006.jsx/dump-args.jsx foo bar`),
    qq{["foo","bar"]\n}, "jsx --run with args";
is $?, 0, "... exits with 0";

