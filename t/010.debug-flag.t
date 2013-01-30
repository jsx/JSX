#!perl
use strict;
use warnings;

use tool::Util;
use Test::More;

plan skip_all => "skip if JSX_OPTS is defined" if $ENV{JSX_OPTS};

my $src = "t/010/debug-flag.jsx";

sub j {
    my($ok, $stdout, $stderr)  = jsx(@_, "--run", $src);
    local $Test::Builder::Level = $Test::Builder::Level + 1;
    $ok or diag($stderr);
    return $stdout;
}

is j(),                                    "true\n", "default";
is j("--optimize", "fold-const",        ), "true\n",  "--optimize fold-const";
is j("--optimize", "no-debug",          ), "false\n", "--optimize no-debug";
is j("--optimize", "no-debug,fold-const"), "false\n", "--optimize no-debug,fold-const";

done_testing;
