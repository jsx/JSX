#!perl
use strict;
use warnings;
use File::Temp qw(tempdir);
use File::Copy qw(copy);
use t::util::Util qw(slurp);

use Test::More tests => 2;
{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");

    my $jsx = "$tmpdir/jsx";
    copy "bootstrap/jsx-compiler.js", $jsx;

    is system("node", $jsx, "--executable", "node", "--output", $jsx, "src/jsx-node-front.jsx"), 0, 'make executable (from bootstrap/jsx-compiler.js)';
    is system("node", $jsx, "--executable", "node", "--output", $jsx, "src/jsx-node-front.jsx"), 0, 'make executable (from the new executable)';
}
done_testing;
