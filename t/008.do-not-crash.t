#!perl
# The JSX compiler must not crash with any options!
use strict;
use warnings;

use Data::Dumper ();
use Fatal qw(open);
use Test::More;
use tool::Util;

my @files = @ARGV;

if (! @files) {
    @files = glob('t/008/*.jsx');
}

my @commands = (
    ["no such file"],
    ["--complete", "1:1", "no such file"],
    ["--enable-source-map", "t/008/hello.jsx"],
);

plan tests => (scalar(@commands) + scalar(@files));

for my $command(@commands) {
    not_crash(@{$command});
}

for my $file(@files) {
    subtest "--complete for $file", sub {
        open my($fh), "<", $file;
        while (defined(my $line = <$fh>)) {
            for (my $c = 0; $c < length $line; ++$c) {
                not_crash("--complete", "$.:$c", $file);
            }
        }
        close $fh;
        not_crash("--complete", "9999:9999", $file);

        done_testing;
    }
}

sub dumper {
    local $Data::Dumper::Terse  = 1;
    local $Data::Dumper::Indent = 0;

    return Data::Dumper->new([\@_], ['*argv'])->Dump();
}

sub not_crash {
    local $Test::Builder::Level = $Test::Builder::Level + 1;

    my ($ok, $stdout, $stderr) = jsx(@_);
    unlike($stdout . $stderr, qr/^\s+ \b at \b \s+ \b Module \b/xms, dumper("jsx", @_));
}

done_testing;
