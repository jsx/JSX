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
   # WebIDL says, "Note also that null is not a value of type DOMString.
   # To allow null, a nullable DOMString, written as DOMString? in IDL,
   # needs to be used."
   'DOMString?' => 'String',

   'DOMTimeStamp'=> 'number',
   'octet' => 'int',
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
    my($idl_type, $may_be_undefined) = @_;
    $idl_type =~ s/.+://; # remove namespace
    $idl_type  =~ s/(?<array> (?: \[\] )? )\z//xms;

    my $type;
    if(exists $typemap{$idl_type}) {
        $type = $typemap{$idl_type} . $+{array} . "/*$idl_type$+{array}*/";
    }
    else {
        $type = $idl_type . $+{array};
    }

    if($may_be_undefined) {
        return "MayBeUndefined.<$type>";
    }
    else {
        return $type;
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
my $rx_simple_type = qr{
    (?: [\:\w]+ (?: \s+ \w+)*
        (?:
            \? # nullable
            |
            \[\] # array
        )?
    )
}xms;
my $rx_type = qr{
    (?:
        (?:
            \( \s* $rx_simple_type (?: \s+ or \s+ $rx_simple_type \s*)+ \)
        )
        |
        $rx_simple_type
    )
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
    my @member_funcs;

    if(my $constructors = $+{constructors}) {
        while($constructors =~ m{
            Constructor \s* (?: \(
                (?<params> .*?)
            \) )?
        }xmsg) {
            write_functions("constructor", undef, $+{params});
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
                (?<ident> \w+)
                \s*
                \(
                    (?<params> .*)
                \)
            }xms) { # member function

            my $prop = trim($+{property});
            my $name = $+{ident};
            my $ret_type_may_be_undefined = 0;
            if($prop) {
                $name = "/* $prop */ $name";
                if($prop eq "getter") {
                    $ret_type_may_be_undefined = 1;
                    write_functions("__native_index_operator__",
                        $+{ret_type}, $+{params},
                        $ret_type_may_be_undefined);
                }
            }
            write_functions($name, $+{ret_type}, $+{params},
                $ret_type_may_be_undefined);
        }
        else {
            die "[BUG] canot parse member: $member\n";
        }
    }

    say "}\n";
}

sub write_functions {
    my($name, $ret_type, $src_params, $ret_type_may_be_undefined) = @_;

    my $ret_type_decl = defined($ret_type)
        ? " : " . to_jsx_type($ret_type, $ret_type_may_be_undefined)
        : "";

    my @unresolved_params = map {
        m{
            (?:
                (?: \b (?: in | (?<optional> optional)) \b \s+ )*
                (?<type> $rx_type) \s+
                (?<ident> \w+)
            )
        }xms or die "Cannot parse line:  $_";

        +{
            name => $+{ident},
            type => $+{type},
            optional => !!$+{optional},
        };
    } split /,/, $src_params // "";

    my @funcs;

    foreach my $params_ref(resolve_overload(@unresolved_params)) {
        # resolve optional args
        my @optionals;
        while(1) {
            my $p = join ", ", map {
                "$_->{name} : " . to_jsx_type($_->{type})
            } @{$params_ref};

            my $line = "\t" . "function $name($p)$ret_type_decl;";
            if(length $line > 70) { # prettify
                $p =~ s/, \s+/,\n/xmsg;
                $p =~ s/^/\t\t/xmsg;
                $line = "\t" . "function $name(\n";
                $line .= $p . "\n";
                $line .= "\t)$ret_type_decl;";
            }
            unshift @optionals, $line;

            my $last = pop @{$params_ref};
            if(not defined $last or not $last->{optional}) {
                last;
            }
        }
        push @funcs, @optionals;
    }

    say for uniq(@funcs);
}

sub resolve_overload {
    my @params = @_;

    my @o;
    if(@params) {
        my $head = shift @params;

        my $type = $head->{type};
        $type =~ s/\A \s* \(//xms;
        $type =~ s/\) \s* \z//xms;

        my @types = map { trim($_) } split /\b or \b/xms, $type;

        my @resolved = resolve_overload(@params);
        foreach my $t(@types) {
            my $p = {
                type => $t,
                name => $head->{name},
                optional => $head->{optional},
            };
            push @o, map { [ $p, @{$_} ] } @resolved;
        }
    }
    else {
        push @o, \@params;
    }
    return @o;
}

sub trim {
    my($s) = @_;
    $s =~ s/\A \s+//xms;
    $s =~ s/\s+ \z//xms;
    return $s;
}

sub uniq {
    my %seen;
    return grep { !$seen{$_}++ } @_;
}
