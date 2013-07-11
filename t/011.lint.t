#!perl
use strict;
use warnings;

use tool::Util;

use Test::More;

use File::Which qw(which);
use File::Temp  qw(tempdir);
use JSON ();

my $c = do {
    local $ENV{PATH} = "node_modules/.bin:$ENV{PATH}";
    which("jshint");
};

plan skip_all => "no jshint found" unless $c;

my $config =  {
  node => JSON::true,

  boss => JSON::true,
  eqnull => JSON::true,
  loopfunc => JSON::true,
  debug => JSON::true,
  evil => JSON::true,

  -W086 => JSON::true,
  -W082 => JSON::true,
  -W032 => JSON::true,
  -W030 => JSON::true,
  -W018 => JSON::true,
  -W004 => JSON::true,
  -W092 => JSON::true,
};

{
    my $tmpdir = tempdir(CLEANUP => 1, DIR => ".");

    my($ok, $stdout, $stderr) = jsx("--executable", "node", "--output", "$tmpdir/jsx", "src/jsx-node-front.jsx");
    $ok or die $stderr;

    open my $fh, ">", "$tmpdir/jshint.json" or die $!;
    print $fh JSON::encode_json($config);
    close $fh;

    note $c;
    my $warnings = `$c --verbose --config $tmpdir/jshint.json $tmpdir/jsx`;
    ok $? == 0, "compile JSX with $c";
    ok !$warnings, "no warnings from lint" or diag $warnings;
}


done_testing;
