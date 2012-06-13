#!/usr/bin/perl
use strict;
use warnings;
use Test::More tests => 8;

ok scalar(`bin/jsx --version`), "jsx --version shows something";
is $?, 0, "... exits with 0";

ok scalar(`bin/jsx --help`), "jsx --help shows something";
is $?, 0, "... exits with 0";


is scalar(`bin/jsx --run t/006.jsx/hello.jsx`), "Hello, world!\n", "jsx --run";
is $?, 0, "... exits with 0";

is scalar(`bin/jsx --run -- - < t/006.jsx/hello.jsx`), "Hello, world!\n", "jsx --run -- -";
is $?, 0, "... exits with 0";

