#!/usr/bin/env perl
use 5.10.0;
use strict;
#use warnings FATAL => 'all';
use warnings;
use Fatal qw(open);
use Tie::IxHash;
use Data::Dumper;
use File::Basename qw(dirname);
use Storable qw(lock_retrieve lock_store);
use constant WIDTH => 68;

# see http://dev.w3.org/2006/webapi/WebIDL/

my $continuous = ($ARGV[0] ~~ "--continuous" && shift @ARGV);

my $db = dirname(__FILE__) . '/.idl2jsx.bin';

my @files = @ARGV;

my %fake = (
    Window => 1,
    DocumentEvent => 1,
    DOMLocator => 1,
    DOMConfiguration => 1,
    TypeInfo => 1,
    AbstractView => 1,
    DocumentView => 1,

    EventTarget => 1,
    XMLHttpRequestEventTarget => 1,
);

my %skip = (
    EventListener => 1,
    MediaQueryListener => 1,
    DOMErrorHandler => 1,
    UserDataHandler => 1,
    MutationCallback => 1,
    FileCallback => 1,
    FrameRequestCallback => 1,

    Example => 1,
    Function => 1,

    WindowTimers => 1, # use JSXTimers instead
);

my %has_definition;

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
    'unrestricted float'  => 'number',
    'unrestricted double' => 'number',

    'object' => 'Object',

    'any' => 'variant',

    'TimerHandler' => 'function():void',

    'WindowProxy' => 'Window',

    # http://www.w3.org/TR/dom/
    'MutationCallback' => 'function(:MutationRecord[],:MutationObserver):void',

    # http://dev.w3.org/html5/spec/single-page.html
    'TextTrackMode' => 'string', # enum

    'EventListener' => 'function(:Event):void',

    # http://www.w3.org/TR/cssom-view/
    'MediaQueryListListener' => 'function(:MediaQueryList):void',

    # http://www.w3.org/TR/websockets/
    'Function?' => 'function(:Event):void',
    'Function' => 'function(:Event):void',

    # http://www.w3.org/TR/XMLHttpRequest/
    'XMLHttpRequestResponseType' => 'string', # enum

    # http://www.w3.org/TR/DOM-Level-3-Core/idl-definitions.html
    'UserDataHandler' => 'function(operation:int,key:string,data:variant,src:Node,dst:Node):void',

    # http://dev.w3.org/2009/dap/file-system/file-dir-sys.html
    'FileCallback' => 'function(:File):void',

    # http://html5.org/specs/dom-parsing.html#insertadjacenthtml()
    'SupportedType' => 'string', # enum
    'insertAdjacentHTMLPosition' => 'string', # enum

    # http://www.w3.org/TR/animation-timing/
    'FrameRequestCallback' => 'function(:number):void',
);



sub info {
    state $count = 0;
    print STDERR sprintf("[%03d] ", $count++), join(" ", @_), "\n";
}

my $rx_multiword_types = join("|", map { quotemeta($_) }
    'unsigned long long',
    'unsigned byte',
    'unsigned short',
    'unsigned int',
    'unsigned long',

    'long long',

    'unrestricted float',
    'unrestricted double',
);

my $rx_simple_type = qr{
    (?:
        \b
        (?: \w+ :: )? # optional namespace
        (?: (?:$rx_multiword_types) | \w+)
        (?: < [^>]+ > )? # type parameter
    )
}xms;

my $rx_type_modifier = qr{
    (?:
        \? # nullable
        |
        \[ \s* \] # array
        |
        \.\.\. # vararg
    )
}xms;
my $rx_type = qr{
    (?:
        (?:
            # union type
            \(
                \s*
                $rx_simple_type $rx_type_modifier?
                (?: \s+ or \s+ $rx_simple_type $rx_type_modifier? )+
                \s*
            \)
        )
        |
        $rx_simple_type
    )
    $rx_type_modifier?
}xms;

my $rx_params = qr{
    (?: $rx_type | [^\(\)]+ )*
}xms;

my $rx_comments = qr{
    (?: // [^\n]*? \n | /\* .*? \*/ \n? )
}xms;

my %classdef;
tie %classdef, 'Tie::IxHash';
%classdef = %{lock_retrieve($db)} if $continuous and -e $db;

foreach my $file(@files) {
    info "parsing $file";

    # XXX: spec bug?
    my $Document_is_HTMLDocument = ($file =~ / \b html5 \b/xms);

    local $typemap{Document} = "HTMLDocument" if $Document_is_HTMLDocument;

    my $content = do {
        my $arg = $file;
        if($arg =~ /^https?:/) {
            if($arg =~ /\.idl$/) {
                $arg = "curl -L $arg 2>/dev/null |";
            }
            else {
                $arg = "w3m -dump $arg |";
            }
        }
        open my($fh), $arg; # magic open!
        local $/;
        <$fh>;
    };

    # typedef
    while($content =~ m{
            ^ \s* \b typedef \b
            \s+
            (?<existing_type> $rx_simple_type)
            \s+
            (?<new_type> \w+) \s*
            ;
        }xmsg) {

        ($typemap{$+{new_type}} = to_jsx_type($+{existing_type})) =~ s/$rx_comments//xms;
    }

    # class definition
    while($content =~ m{
                (?<attrs> (?: \[ (?: [^\]]+ | \[ \s* \])+ \] \s+)* )
                (?<type> (?:partial \s+)? interface | exception | dictionary)
                \s+ (?<name> \w+)
                (?: \s* : \s* (?<base> [\w:]+) )?
                \s*
                \{ (?<members> [^\}]*? ) \}
                \s* ;
            }xmsg) {

        my $class   = $+{name};
        my $attrs   = $+{attrs};
        my $type    = $+{type};
        my $base    = $+{base};
        my $members = $+{members};

        if($Document_is_HTMLDocument && $class eq 'Document') {
            $type =~ s/partial \s+//xms;
            $class = "HTMLDocument";
            $base  = "Document";
        }

        info $type, $class, ($base ? ": $base" : ());

        if($type !~ /\b partial \b/xms) {
            $has_definition{$class} = 1;
        }


        my $def = $classdef{$class} //= {
            attrs => $attrs,
            name  => $class,
            implements => [],
            members => [],
            decl    => {},
            fake    => $fake{$class},
        };

        $def->{base} //= $base if $base;

        $def->{skip} = 1 if $skip{$class};

        my $members_ref = $def->{members};

        # name to array of members; to resolve override
        my $decl_ref = $def->{decl};

        if($attrs) {
            while($attrs =~ m{
                \b Constructor \s* (?: \(
                    (?<params> $rx_params)
                \) )?
            }xmsg) {
                make_functions(
                    $decl_ref, $members_ref,
                    "constructor",
                    undef, $+{params});
            }

            if($attrs =~ /\b NoInterfaceObject \b/xms) {
                #$def->{skip} = 1;
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
                push @{$members_ref}, "" if $+{spaces} =~ /\n/;
                next;
            }

            if(my $comments = $+{comments}) {
                chomp $comments;
                push @{$members_ref}, $comments;
                next;
            }

            my $member = $+{member};

            push @{$members_ref}, $+{member_comment} if $+{member_comment};

            # compress extra spaces
            $member =~ s{\s+}{ }g;

            # member constant
            if($member =~ m{
                    \b const \s+ (?<type> $rx_type) \s+ (?<ident> \w+)
                    [^;\(\)]* ;
                }xms) {
                my $id = $+{ident};

                my $type = to_jsx_type($+{type});

                # WebIDL's constants are available both as class members
                # and instance members
                my $static_const = "static __readonly__ var $id : $type;";
                my $readonly_var = "       __readonly__ var $id : $type;";

                $decl_ref->{$id} //= [];
                push @{$decl_ref->{$id}}, ($static_const, $readonly_var);
                push @{$members_ref}, {
                    id => $id,
                    decl => $static_const,
                    type => $type,
                    static => 1,
                };
                push @{$members_ref}, {
                    id => $id,
                    decl => $readonly_var,
                    type => $type,
                    static => 0,
                };
            }
            # member var
            elsif($member =~ m{
                    (?: \bstringifier\b \s+ )?
                    (?<readonly> \breadonly\b \s+)?
                    (?: \battribute\b \s+)?
                    (?: \[ [^\]]+ \])?
                    (?<type> $rx_type) \s+ (?<ident> \w+)
                    (?: \s+ setraises\( [^\)]+ \) )?
                    [^;\(\)]* ;
                }xms) {

                my $id = $+{ident};

                my $decl = "var";
                if($+{readonly}) {
                    $decl = "__readonly__ $decl";
                }
                my $type = to_jsx_type($+{type});

                $decl .= " $id : $type;";

                $decl_ref->{$id} //= [];
                push @{$decl_ref->{$id}}, $decl;
                push @{$members_ref}, {
                    id   => $id,
                    decl => $decl,
                    type => $type,
                    static => 0,
                };
            }
            # member function
            elsif($member =~ m{
                    (?<property>
                        (?: (?: stringifier | legacycaller | getter | setter | creator | deleter) \s+ )*
                    )
                    (?<static> \b static \b \s+)?
                    (?<ret_type> $rx_type)
                    \s+
                    (?<ident> \w*)
                    \s*
                    \(
                        (?<params> $rx_params)
                    \)
                    (?: \s* raises \s* \( $rx_params \) )?
                    ;
                }xms) { # member function

                my $id       = $+{ident};
                my $prop     = trim($+{property});
                my $static   = $+{static};
                my $ret_type = $+{ret_type};
                my $params   = $+{params};

                my $ret_type_may_be_undefined = 0;

                if($prop) {
                    if(index($prop, "getter") != -1) {
                        $ret_type_may_be_undefined = 1;
                        my $id = "__native_index_operator__";
                        make_functions(
                                $decl_ref, $members_ref,
                                $id,
                                $ret_type, $params,
                                $ret_type_may_be_undefined);
                    }
                    if(!$id) {
                        # no name
                        next;
                    }
                    push @{$members_ref}, "/* $prop */";
                }
                elsif(!$id) {
                    die "unexpected no name for $member.\n";
                }
                make_functions(
                    $decl_ref, $members_ref,
                    $id,
                    $ret_type, $params,
                    $ret_type_may_be_undefined, $static);
            }
            elsif($member =~ m{stringifier;}) {
                # ignore
            }
            else {
                die "[BUG] cannot parse member: $member\n";
            }
        }
    }

    # implements interfaces
    info 'process implements';
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

            next if $interface->{name} eq 'WindowTimers';

            info "$def->{name} implements $interface->{name}";

            # FIXME
            push @{ $def->{members} },
                "",
                "// implements $interface->{name}",
                @{$interface->{members}};

            $interface->{fake} = 1;
        }
    }
}


info 'output';
if(@files) {
    say "/*";
    say "automatically generated from:";
    say "\t", $_ for @files;
    say "*/";
}
foreach my $def(values %classdef) {
    if($def->{skip} or $def->{done}) {
        next;
    }

    if(!$has_definition{$def->{name}}) {
        # partial class only
        next;
    }

    $def->{done} = 1 if $continuous;

    my %seen;

    my $classdecl = "native";
    if($def->{fake}) {
        $classdecl .= " __fake__";
    }
    $classdecl .= " class $def->{name}";

    if($def->{base}) {
        $classdecl .= " extends $def->{base}";
    }

    say $classdecl, " {";

    my @members = @{$def->{members}};

    # trim
    pop(@members)   while @members && $members[-1] !~ /\S/;
    shift(@members) while @members && $members[ 0] !~ /\S/;


    if(@members) {
        say "";

        foreach my $member(@members) {
            my $s;

            if(ref $member) { # var or func
                my $is_func = exists $member->{param_types};

                $s = $member->{decl};

                if(my @m = find_member_from_bases($def, $member->{id})) {
                    if(!$is_func) {
                        # cannot override member variables
                        say "\t", "// inherits $s";
                        next;
                    }
                    elsif(grep { $s eq $_ } @m) {
                        # ignore completely the same declaration
                        say "\t", "// inherits $s";
                        next;
                    }
                    elsif(grep { function_params($s) eq function_params($_) } @m) {
                        # has the same params, but not the same return value
                        $s = "override $s";
                    }
                }

                if($is_func) {
                    # used to remove duplicated things
                    my $serialized = join ";",
                        $member->{id}, $member->{ret_type_decl}, @{$member->{param_types}};

                    $serialized =~ s/$rx_comments//xmsg;
                    $serialized  =~ s/\s+/ /g;
                    next if $seen{$serialized}++;

                    # prettify if needed
                    if(length $s > WIDTH) {
                        $s =~ s/ \( (.+) \) /prettify_params($1)/xmse;
                    }

                }
                else {
                    # skip if it is already defined
                    next if $seen{ join(";", $member->{id}, $member->{static}) }++;
                }
            }
            else { # comments, etc.
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
if(@files) {
    say "/*";
    say "end of generated files from:";
    say "\t", $_ for @files;
    say "*/";
}

lock_store(\%classdef, $db) if $continuous;
exit;

sub to_jsx_type {
    my($idl_type, $may_be_undefined) = @_;
    $idl_type = trim($idl_type);

    my $original = $idl_type;

    $idl_type =~ s/.+://; # remove namespace

    my $array;
    if($idl_type =~ s{\A sequence < (.+?) >  }{$1}xms) {
        $array = 1;
    }
    elsif($idl_type =~ s{\A Maybe< (.+?) >  }{$1}xms) { # defined in idl2jsx/extra/*.idl
        $may_be_undefined = 1;
    }

    $idl_type  =~ s{
        (?:
            (?<array> \[ \s* \] )
            |
            (?<vararg> \.\.\. )
            |
            (?<nullable> \? )
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

sub make_functions {
    my($decl_ref, $members_ref, $name, $ret_type, $src_params, $ret_type_may_be_undefined, $static) = @_;

    my $ret_type_decl = defined($ret_type)
        ? " : " . to_jsx_type($ret_type, $ret_type_may_be_undefined)
        : "";

    my @unresolved_params;
    foreach my $param(split /,/, $src_params // "") {
        $param =~ m{
            (?:
                (?: \b (?: in | (?<optional> optional)) \b \s+ )*
                (?<type> $rx_type) \s+
                (?<ident> \w+)
            )
        }xms or die "Cannot parse line:  '$src_params'\n";

        my %t = (
            name => $+{ident},
            type => $+{type},
            optional => !!$+{optional},
        );

        # FIXME: support varargs
        $t{optional} = 1 if $t{type} =~ /\.\.\. \z/xms;

        push @unresolved_params, \%t;
    }

    my @decls;
    my @funcs;

    foreach my $params_ref(resolve_overload(@unresolved_params)) {
        # resolve optional args
        my @d;
        my @f;
        while(1) {
            my $p = join ", ", map {
                "$_->{name} : $_->{jsx_type}"
            } @{$params_ref};

            my $f = "function $name($p)$ret_type_decl;";
            if($static) {
                $f = "static $f";
            }

            unshift @d, $f;
            unshift @f, {
                id            => $name,
                decl          => $f,
                param_types   => [ map { $_->{jsx_type} } @{$params_ref} ],
                ret_type_decl => $ret_type_decl,
                static        => $static ? 1 : 0,
            };

            my $last = pop @{$params_ref};
            if(not defined $last or not $last->{optional}) {
                last;
            }
        }
        push @decls, @d;
        push @funcs, @f;
    }

    $decl_ref->{$name} //= [];
    push @{$decl_ref->{$name}}, @decls;
    push @{$members_ref},       @funcs;

    return;
}

sub resolve_overload {
    my @params = @_;

    my @o;
    if(@params) {
        my $head = shift @params;

        my $type = $head->{type};
        if($type =~ / \( (.+) \) /xms) {
            $type = $1;
        }

        my @types = split /\b or \b/xms, $type;

        # parameter "int" also accepts "number"
        if(grep { to_jsx_type($_) =~ /\A int \[\]/xms } @types) {
            push @types, "number[]";
        }

        my @resolved = resolve_overload(@params);
        foreach my $t(@types) {
            my $p = {
                type     => $t,
                jsx_type => to_jsx_type($t),
                name     => $head->{name},
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

    return if $id eq 'constructor';

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
    $params =~ s/\w+ \s* :/:/xmsg;

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

