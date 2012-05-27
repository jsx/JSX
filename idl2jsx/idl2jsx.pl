#!/usr/bin/env perl

use 5.10.0;
use strict;
#use warnings FATAL => 'all';
use warnings;
use Fatal qw(open);
use Tie::IxHash;
use Data::Dumper;
use constant WIDTH => 68;
# see http://dev.w3.org/2006/webapi/WebIDL/

my $test = ($ARGV[0] ~~ "--generate-test" && shift @ARGV);


info("parsing $_") for @ARGV;

@ARGV = map {
    if(/^https?:/) {
        /\.idl$/
            ? "curl -L $_ 2>/dev/null |"
            : "w3m -dump $_ |";
    }
    else {
        $_;
    }
} @ARGV;


my $content = do {
    local $/;
    <ARGV>;
};
close ARGV;

my %fake = (
    Window => 1,
    DocumentEvent => 1,
    DOMLocator => 1,
    DOMConfiguration => 1,
    TypeInfo => 1,
);

my %skip = (
    EventListener => 1,
    DOMErrorHandler => 1,
    UserDataHandler => 1,
    Example => 1,
    Function => 1,

    CanvasTransformation => 1,
    CanvasLineStyles => 1,
    CanvasText => 1,
    CanvasPathMethods => 1,
);

# NOTE: JSX's int is signed 32 bit integer

# WebIDL says, "Note also that null is not a value of type DOMString.
# To allow null, a nullable DOMString, written as DOMString? in IDL,
# needs to be used."
my %nullable = (
    string => 'String',
    number => 'Number',
    int    => 'Number',
    boolean => 'Boolean',
);

my %typemap = (
    'DOMObject' => 'Object',
    'DOMUserData' => 'variant',
    'DOMString' => 'string',

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

    'object' => 'Object',

    'any' => 'variant',

    'EventListener' => 'function(:Event):void',

    # http://www.w3.org/TR/websockets/
    'Function?' => 'function(:Event):void',
    'Function' => 'function(:Event):void',

    # http://www.w3.org/TR/XMLHttpRequest/
    'XMLHttpRequestResponseType' => 'string', # enum

    # http://www.w3.org/TR/DOM-Level-3-Core/idl-definitions.html
    'UserDataHandler' => 'function(operation:int,key:string,data:variant,src:Node,dst:Node):void',

);

sub to_jsx_type {
    my($idl_type, $may_be_undefined) = @_;
    $idl_type = trim($idl_type);

    my $original = $idl_type;

    $idl_type =~ s/.+://; # remove namespace

    my $array;
    if($idl_type =~ s{\A sequence < (.+?) >  }{$1}xms) {
        $array = 1;
    }

    $idl_type  =~ s{
        (?:
            (?<array> \[ \s* \] )
            |
            (?<vararg> \.\.\. )
            |
            (?<nullabble> \? )
        )*
        \z
    }{}xms;
    my $vararg   = $+{vararg} // ""; # not used yet
    my $nullable = $+{nullable} // "";
    $array //= $+{array};

    my $type;
    if(my $t = $typemap{$idl_type}) {
        $t = $nullable{$t} if $nullable && exists $nullable{$t};
        $type = $t;
        if($array) {
            $type .= "[]";
        }
        $type .= "/*$original*/";
    }
    else {
        my $t = $idl_type;
        $t = $nullable{$t} if $nullable && exists $nullable{$t};
        $type = $t;
        if($array) {
            $type .= "[]";
        }
    }

    if($may_be_undefined) {
        return "MayBeUndefined.<$type>";
    }
    else {
        return $type;
    }
}

sub info {
    state $count = 0;
    print STDERR sprintf("[%03d] ", $count++), join(" ", @_), "\n";
}

my $rx_constructors = qr{
    \[
        \s*
        (?: Constructor (?: \( .*? \) )? )
        (?: \s* , \s* Constructor \( .*? \) )*
        \s*
    \] \s*
}xms;

# the last ? means "nullable"
my $rx_simple_type = qr{
    (?: [\:\w]+ (?: \s+ \w+)* (?: < .*? > )?
        (?:
            \? # nullable
            |
            \[ \s* \] # array
            |
            \.\.\. # vararg
        )?
    )
}xms;

my $rx_type = qr{
    (?:
        (?:
            # union type
            \( \s* $rx_simple_type (?: \s+ or \s+ $rx_simple_type \s*)+ \)
        )
        |
        $rx_simple_type
    )
}xms;

my $rx_comments = qr{
    (?: // [^\n]*? \n | /\* .*? \*/ \n? )
}xms;

my %classdef;
tie %classdef, 'Tie::IxHash';

# typedef
while($content =~ m{
        ^ \s* \b typedef \b
        \s+
        (?<existing_type> $rx_simple_type)
        \s+
        (?<new_type> \w+) \s*
        ;
    }xmsg) {
    $typemap{$+{new_type}} = $typemap{$+{existing_type}} // $+{existing_type};
}

# class definition
while($content =~ m{
            (?<attrs> (?: \[ [^\]]+ \] \s+)* )
            (?<type> interface | exception | dictionary)
            \s+ (?<name> \S+)
            (?: \s* : \s* (?<base> \S+) )?
            \s*
            \{ (?<members> .*?) \} \s* ;
        }xmsg) {

    my $class = $+{name};


    my $attrs        = $+{attrs};
    my $type         = $+{type};
    my $base         = $+{base};
    my $members      = $+{members};

    info $type, $class;

    my $classdef = $classdef{$class} //= {};

    my $classdecl = "native";
    if($fake{$class}) {
        $classdecl .= " __fake__";
    }
    $classdecl .= " class $class";

    if($base) {
        $classdecl .= " extends $base";
    }

    my @members;
    my %decl; # name to array of members; to resolve override

    $classdef->{attrs}     = $attrs;
    $classdef->{name}      = $class;
    $classdef->{base}      = $base;
    $classdef->{classdecl} = $classdecl;
    $classdef->{members}   = \@members;
    $classdef->{decl}      = \%decl;

    if($attrs) {
        while($attrs =~ m{
            \b Constructor \s* (?: \(
                (?<params> .*?)
            \) )?
        }xmsg) {
            push @members, make_functions("constructor", undef, $+{params});
        }
    }


    while($members =~ m{
            (?<comments> $rx_comments)
            |
            (?<spaces> \s+)
            |
            (?<member> [^;]+;
                (?: \s+ | (?<member_comment> $rx_comments* ) \n)
            )
        }xmsg) {
        if($+{spaces}) {
            push @members, "" if $+{spaces} =~ /\n/;
            next;
        }

        if(my $comments = $+{comments}) {
            chomp $comments;
            push @members, $comments;
            next;
        }

        my $member = $+{member};

        push @members, $+{member_comment} if $+{member_comment};

        # compress extra spaces
        $member =~ s{\s+}{ }g;

        # member function
        if($member =~ m{
                (?<property>
                    (?: (?: stringifier | legacycaller | getter | setter | creator | deleter) \s+ )*
                )
                (?<ret_type> $rx_type)
                \s+
                (?<ident> \w*)
                \s*
                \(
                    (?<params> .*)
                \)
            }xms) { # member function

            my $id   = $+{ident};
            my $prop = trim($+{property});
            my $ret_type_may_be_undefined = 0;

            my $name = $id;

            if($prop) {
                if(index($prop, "getter") != -1) {
                    $ret_type_may_be_undefined = 1;
                    push @members, make_functions("__native_index_operator__",
                        $+{ret_type}, $+{params},
                        $ret_type_may_be_undefined);
                }
                if(!$name) {
                    warn "no name for $member, skipped.\n";
                    next;
                }
                $name = "/* $prop */ $name";
            }
            if(!$name) {
                die "unexpected no name for $member.\n";
            }
            my @funcs =  make_functions($name, $+{ret_type}, $+{params},
                $ret_type_may_be_undefined);

            $decl{$id} //= [];
            push @{$decl{$id}}, @funcs;
            push @members, map {
                +{
                    id => $id,
                    decl=> $_,
                };
            } @funcs;
        }
        # member constant
        elsif($member =~ m{
                const \s+ (?<type> $rx_type) \s+ (?<ident> \w+)
            }xms) {
            my $id = $+{ident};

            my $type = to_jsx_type($+{type});

            # WebIDL's constants are available both as class members
            # and instance members
            my @v;
            push @v, "static const     $id : $type;";
            push @v, "__readonly__ var $id : $type;";

            $decl{$id} //= [];
            push @{$decl{$id}}, @v;
            push @members, map {
                +{
                    id => $id,
                    decl => $_,
                };
            } @v;
        }
        # member var
        elsif($member =~ m{
                (?: \bstringifier\b \s+ )?
                (?<readonly> \breadonly\b \s+)? (?: \battribute\b \s+)?
                (?<type> $rx_type) \s+ (?<ident> \w+)
            }xms) {
            my $id = $+{ident};

            my $decl = "var";
            if($+{readonly}) {
                $decl = "__readonly__ $decl";
            }
            my $type = to_jsx_type($+{type});

            $decl .= " $id : $type;";

            $decl{$id} //= [];
            push @{$decl{$id}}, $decl;
            push @members, {
                id   => $id,
                decl => $decl,
            };
        }
        else {
            die "[BUG] canot parse member: $member\n";
        }
    }
}

# implements interfaces
{
    my $classes = join "|", keys %classdef;
    while($content =~ m{
        ^ \s* (?<class> $classes)
        \s+ implements
        \s+ (?<interface> $classes)
        \s* ;
        }xmsg) {

        my $def       = $classdef{$+{class}};
        my $interface = $classdef{$+{interface}};

        push @{ $def->{members} },
            "",
            "// implements $interface->{name}",
            @{$interface->{members}};
    }
}

# output
if(@ARGV) {
    say "/*";
    say "automatically generated from:\n$_" for @ARGV;
    say "*/";
}
foreach my $def(values %classdef) {
    if($skip{$def->{name}}) {
        next;
    }

    say $def->{classdecl}, " {";
    my @members = @{$def->{members}};

    # trim
    pop(@members)   while @members && $members[-1] !~ /\S/;
    shift(@members) while @members && $members[ 0] !~ /\S/;


    if(@members) {
        say "";

        foreach my $member(@members) {
            my $s;

            if(ref $member) {
                $s = $member->{decl};

                my @m = find_member_from_bases($def, $member->{id});

                if(@m) {
                    if($s =~ /\b var \b/xms) {
                        # cannot override member variables
                        next;
                    }
                    elsif(grep { $s eq $_ } @m) {
                        # ignore completely the same declaration
                        next;
                    }
                    elsif(grep { function_params($s) eq function_params($_) } @m) {
                        # has the same params, but not the same return value
                        $s = "override $s";
                    }
                }
                if(length $s > WIDTH) {
                    $s =~ s/ \( (.+) \) /prettify_params($1)/xmse;
                }
            }
            else {
                $s = $member;
            }

            $s =~ s/^/\t/xmsg;
            $s =~ s/\s+\z//xmsg;
            say $s;
        }

        say "";

        say "} // end of $def->{name}";
    }
    else {
        say "}";
    }

    say "";
}
exit;


sub make_functions {
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
        }xms or die "Cannot parse line:  $_\n";

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

            my $line = "function $name($p)$ret_type_decl;";
            unshift @optionals, $line;

            my $last = pop @{$params_ref};
            if(not defined $last or not $last->{optional}) {
                last;
            }
        }
        push @funcs, @optionals;
    }

    return uniq(@funcs);
}

sub resolve_overload {
    my @params = @_;

    my @o;
    if(@params) {
        my $head = shift @params;

        my $type = $head->{type};
        $type =~ s/\A \s* \(//xms;
        $type =~ s/\) \s* \z//xms;

        my @types = split /\b or \b/xms, $type;

        # parameter "int" also accepts "number"
        if(grep { to_jsx_type($_) =~ /\A int \[\]/xms } @types) {
            push @types, "number[]";
        }

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

sub find_member_from_bases {
    my($def, $id) = @_;

    my @m;
    my $base = $def->{base};

    while($base && exists $classdef{$base}) {
        $def = $classdef{$base};
        if($def->{decl}{$id}) {
            push @m, @{$def->{decl}{$id}};
        }

        $base = $def->{base};
    }

    return @m;
}

sub prettify_params {
    my($params) = @_;

    my $p = join ",\n", map { trim($_) } split /,/, $params;
    $p =~ s/^/\t/xmsg;
    return "(\n$p\n)";
}

sub function_params {
    my($decl) = @_;

    my($params) = $decl =~ /\( (.*) \)/xms;

    # remove names
    $params =~ s/\w+ \s* ://xmsg;
    # remove spaces
    $params =~ s/\s+//xmsg;

    return $params;
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

