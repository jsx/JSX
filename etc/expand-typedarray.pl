#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;

my @map = (
    [qw(Int8Array int)],
    [qw(Uint8Array int)],
    [qw(Int16Array int)],
    [qw(Uint16Array int)],
    [qw(Int32Array int)],
    [qw(Uint32Array int)],
    [qw(Float32Array number)],
    [qw(Float64Array number)],
);

my $content = do {
    local $/;
    <>;
};

$content =~ s{
    ^ \Qnative class TypedArray extends ArrayBufferView\E \s+ \{
    (.+?)
    \}
}{
    expand($1);
}xmse;

print $content;

sub expand {
    my($content) = @_;

    my $expanded = "";
    foreach my $pair(@map) {
        my($class, $type) = @{$pair};

        $expanded .= "native class $class extends ArrayBufferView {\n";
        my $s = $content;

        $s =~ s/ \b TypedArray \b /$class/xmsg;
        $s =~ s/ \b type \b/$type/xmsg;

        $expanded .= $s;
        $expanded .= "}\n\n";
    }
    return $expanded;
}
