#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Fatal qw(open);

# see http://dev.w3.org/2006/webapi/WebIDL/

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
   'DOMString[]' => 'string[]',
   # WebIDL says, "Note also that null is not a value of type DOMString.
   # To allow null, a nullable DOMString, written as DOMString? in IDL,
   # needs to be used."
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

    # http://www.w3.org/TR/websockets/
   'Function?' => 'function(:Event):void',

   # http://www.w3.org/TR/XMLHttpRequest/
   'XMLHttpRequestResponseType' => 'string', # enum
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

my $rx_constructors = qr{
    \[
        \s*
        (?: Constructor (?:\( [^\)]* \) )? )
        (?: \s* , \s* Constructor\( [^\)]* \) )*
        \s*
    \] \s*
}xms;

# the last ? means "nullable"
my $rx_type = qr{
    (?: [\:\w]+ (?: \s+ \w+)* (?: \? | \[\] )? )
}xms;


my %seen;

while($content =~ m{(?<constructors> $rx_constructors )? (?:interface|exception) \s+ (?<class> \S+) \s+ (?: : \s+ (?<base> \S+) \s+)? \{ (?<members> .+?) \}}xmsg) {
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

    if(my $constructors = $+{constructors}) {
        while($constructors =~ m{
            Constructor \s* (?: \(
                (?<params> .*?)
            \) )?
        }xmsg) {
            write_function("constructor", undef, $+{params});
        }
        say "";
    }
    else {
        say "\t", "// FIXME: delete function constructor();";
    }

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
                (?<property>
                    (?: (?:getter | setter | creator | deleter) \s+ )*
                )
                (?<ret_type> $rx_type)
                \s+
                (?<ident> \S+)
                \s*
                \(
                    (?<params> .*?)
                \)
            }xms) { # member function

            my $prop = $+{property};
            say "\t// $prop" if $prop;
            write_function($+{ident}, $+{ret_type}, $+{params});
        }
        else {
            die "[BUG] canot parse member: $member\n";
        }
    }

    say "}\n";
}

sub write_function {
    my($name, $ret_type, $src_params) = @_;

    my $ret_type_decl = defined($ret_type)
        ? " : " . to_jsx_type($ret_type)
        : "";

    my @params = map {
        m{
            (?:
                (?: in | (?<optional> optional) \s+)*
                (?<type> $rx_type) \s+
                (?<ident> \w+)
            )
        }xms or die "Cannot parse line:  $_";

        +{
            decl => "$+{ident} : " . to_jsx_type($+{type}),
            optional => !!$+{optional},
        };
    } split /,/, $src_params // "";

    my @funcs;

    while(1) {
        my $p = join ", ", map { $_->{decl} } @params;

        my $line = "\t" . "function $name($p)$ret_type_decl;";
        if(length $line > 70) { # prettify
            $p =~ s/, \s+/,\n/xmsg;
            $p =~ s/^/\t\t/xmsg;
            $line = "\t" . "function $name(\n";
            $line .= $p . "\n";
            $line .= "\t)$ret_type_decl;";
        }
        push @funcs, $line;

        my $last = pop @params;
        if(not defined $last or not $last->{optional}) {
            last;
        }
    };

    my $seen;
    say for reverse grep { !$seen{$_}++ } @funcs;
}

