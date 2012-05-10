#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Fatal qw(open);

my $content = do {
    local $/;
    <>;
};

my $rx_type = qr/(?: long \s+ long | unsigned \s+ (?: short | int | long | char) | \S+)/xms;

my %typemap = (
   DOMString => 'string',
   long      => 'int',
   'unsigned long' => 'int',
   'long long' => 'number',
);

while($content =~ m{interface \s+ (?<class> \S+) \s+ (?: : \s+ (?<base> \S+) \s+) \{ (?<members> .+?) \}}xmsg) {
    say "native class $+{class} extends $+{base} {";

    foreach my $member(split /;/, $+{members}) {
        $member =~ s{//[^\n]*}{}g;
        if($member =~ m{
                (?<readonly> readonly \s+)? attribute
                \s+ (?<type> $rx_type) \s+ (?<ident> \S+)
            }xms) {

            my $decl = $+{readonly} ? "const" : "var";
            my $type = $typemap{$+{type}} // $+{type};
            say "\t", "$decl $+{ident} : $type;";
        }
        elsif($member =~ m{
                (?<ret_type> $rx_type)
                \s+
                (?<ident> \S+)
                \s*
                \(
                    (?<params> .*?)
                \)
            }xms) {
            my $ident = $+{ident};
            my $ret_type= $+{ret_type};

            my $params = join ", ", map {
                my($type, $id) = /(?: in \s+) ( \S+ ) \s+ ($rx_type) /xms;
                "$id : " . ($typemap{$type} // $type);
            } split /,/, $+{params};
            say "\t", "function $ident($params) : $ret_type;";
        }
    }

    say "}\n";
}

