package t::util::Util;
use strict;
use warnings;

use parent qw(Exporter);
our @EXPORT = qw(slurp get_expected);

sub slurp {
    my($file) = @_;
    open my $fh, "<", $file
        or die "failed to open $file:$!";
    local $/;
    return <$fh>;
}

sub get_expected {
    my $file = shift;
    my $content = slurp($file);
    my($expected) = $content =~ m{/\*EXPECTED\n(.*?\n|)\*/}s;
    return $expected;
}

