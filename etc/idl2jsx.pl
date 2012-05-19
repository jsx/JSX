#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Fatal qw(open);

say "// generated from $_" for @ARGV;

@ARGV = map {
    /^https?:/ ? "w3m -dump $_ |" : $_;
} @ARGV;


my $content = do {
    local $/;
    <>;
};

my %fake = (
    Window => 1,
    DocumentEvent => 1,
);

my %skip = (
    EventListener => 1,
);

# NOTE: JSX's int is signed 32 bit integer
my %typemap = (
   'DOMString' => 'string',
   'DOMString?' => 'String',
   'DOMTimeStamp'=> 'number',
   'byte'  => 'int',
   'short' => 'int',
   'long'  => 'int',
   'long long' => 'number',
   'unsigned byte' => 'int',
   'unsigned short' => 'int',
   'unsigned int' => 'int',
   'unsigned long' => 'int',
   'unsigned long long' => 'number',
   'float' => 'number',
   'double' => 'number',

   'any' => 'variant',

   'EventListener' => 'function(:Event):void',
);

sub to_jsx_type {
    my($idl_type) = @_;
    $idl_type =~ s/.+://; # remove namespace
    if(exists $typemap{$idl_type}) {
        return $typemap{$idl_type} . "/*$idl_type*/";
    }
    else {
        return $idl_type;
    }
}

# the last ? means "nullable"
my $rx_type = qr{
    (?: [\:\w]+ (?: \s+ \w+)* [?]? )
}xms;


my %seen;

while($content =~ m{interface \s+ (?<class> \S+) \s+ (?: : \s+ (?<base> \S+) \s+)? \{ (?<members> .+?) \}}xmsg) {
    my $class = $+{class};

    if($skip{$class}) {
        next;
    }

    if($seen{$class}++) {
        warn "# duplicated definition of $class, skipped.\n";
        next;
    }

    my $classdecl = "native";
    if($fake{$class}) {
        $classdecl .= " __fake__";
    }
    $classdecl .= " class $class";

    if($+{base}) {
        $classdecl .= " extends $+{base}";
    }

    say "$classdecl {";

    foreach my $member(split /;/, $+{members}) {
        $member =~ s{(//[^\n]*)}{say "\t", $1; ""}ge; # remove comments
        $member =~ s{\s+}{ }g; # compress extra spaces

        if($member !~ /\S/) {
            next;
        }

        # member var
        if($member =~ m{
                (?<readonly> readonly \s+)? attribute
                \s+ (?<type> $rx_type) \s+ (?<ident> \w+)
            }xms) {

            my $decl = "var";
            if($+{readonly}) {
                $decl = "__readonly__ $decl";
            }
            my $type = to_jsx_type($+{type});
            say "\t", "$decl $+{ident} : $type;";
        }
        # member constant
        elsif($member =~ m{
                const \s+ (?<type> $rx_type) \s+ (?<ident> \w+)
            }xms) {

            my $type = to_jsx_type($+{type});
            say "\t", "static const $+{ident} : $type;";
        }
        # member function
        elsif($member =~ m{
                (?<ret_type> $rx_type)
                \s+
                (?<ident> \S+)
                \s*
                \(
                    (?<params> .*?)
                \)
            }xms) { # member function

            my $ident = $+{ident};
            my $ret_type = to_jsx_type($+{ret_type});

            my $params = join ", ", map {
                my($type, $id) = /(?: (?: in | optional ) \s+)* ($rx_type) \s+ (\w+) /xms
                    or die "Cannot parse line:  $_";
                "$id : " . to_jsx_type($type);
            } split /,/, $+{params};


            # prettify if needed
            my $line = "\t" . "function $ident($params) : $ret_type;";
            if(length $line > 70) {
                $params =~ s/, \s+/,\n/xmsg;
                $params =~ s/^/\t\t/xmsg;
                $line = "\t" . "function $ident(\n";
                $line .= $params . "\n";
                $line .= "\t) : $ret_type;";
            }
            say $line;
        }
        else {
            die "[BUG] canot parse member: $member\n";
        }
    }

    say "}\n";
}

