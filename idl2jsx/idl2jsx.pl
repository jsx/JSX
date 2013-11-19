#!/usr/bin/env perl
use 5.12.0;
use strict;
#use warnings FATAL => 'all';
use warnings;
use Fatal qw(open);

use File::Basename qw(dirname);
use lib dirname(__FILE__) . "/lib";

use Tie::IxHash;
use Data::Dumper;
use Storable qw(lock_retrieve lock_store);
use LWP::UserAgent;
use URI::Escape qw(uri_escape);
use Time::HiRes ();
use Getopt::Long;

use WebIDL::Type;
use WebIDL::TypeMap;

# see http://www.w3.org/TR/WebIDL/

GetOptions(
    "continuous"    => \my $continuous,
    "refresh-specs" => \my $refresh,
) or die;

my @files = @ARGV;

my $root = dirname(__FILE__);
my $db = "$root/.idl2jsx.bin";
mkdir "$root/spec";

{
    my $t0 = [Time::HiRes::gettimeofday()];
    END {
        info(sprintf "elapsed %.02f sec.", Time::HiRes::tv_interval($t0)) if $t0;
    }
}

my %fake = (
    Window => 1,
    DocumentEvent => 1,
    DOMLocator => 1,
    DOMConfiguration => 1,
    TypeInfo => 1,
    AbstractView => 1,
    DocumentView => 1,

    EventListener => 1,
    EventHandler => 1,
    EventTarget => 1,
    XMLHttpRequestEventTarget => 1,
);

my %skip = (
    Example => 1,

    EventListener => 1,
    WindowTimers => 1, # use JSXTimers instead

    Transferable => 1, # typed-array is moved to built-in.jsx (see #189)
);

# indicates a class has children classes
# classes which has no child are declared "final"
my %has_child;

my %has_definition;

# NOTE: JSX's int is signed 32 bit integer

# WebIDL says, "Note also that null is not a value of type DOMString.
# To allow null, a nullable DOMString, written as DOMString? in IDL,
# needs to be used."

WebIDL::TypeMap->define(
    'DOMObject'      => 'Object',
    'DOMUserData'    => 'variant',
    'DOMString'      => 'string',
    'nullable DOMString' => 'Nullable.<string>', # wrong syntax found in http://www.w3.org/TR/2012/WD-webrtc-20120821/
    'DOMTimeStamp'   => 'number',

    'octet'          => 'number',
    'byte'           => 'number',
    'short'          => 'number',
    'int'            => 'number',
    'long'           => 'number',
    'long long'      => 'number',
    'unsigned byte'  => 'number',
    'unsigned short' => 'number',
    'unsigned int'   => 'number',
    'unsigned long'  => 'number',
    'unsigned long long' => 'number',

    'float'               => 'number',
    'double'              => 'number',
    'unrestricted float'  => 'number',
    'unrestricted double' => 'number',

    'object' => 'Object',

    'any' => 'variant',

    'ByteString' => 'string', # used in the XMLHttpRequest specification

    'WindowProxy' => 'Window',

    # legacy callbacks / event listeners
    'Function' => 'function(:Event):void',

    # legacy EventListener defined as a class
    'EventListener' => 'function(:Event):void',

    # http://dev.w3.org/html5/spec/webappapis.html#eventhandler
    'EventHandlerNonNull'        => 'function(:Event):void',
    'EventHandler'               => 'Nullable.<function(:Event):void>',
    'OnErrorEventHandlerNonNull' => 'function(:Event):void',
    'OnErrorEventHandler'        => 'Nullable.<function(:Event):void>',

    # for DataTransferItem
    'FunctionStringCallback' => 'function(:string):void',

    # for MediaQueryList
    'MediaQueryListListener' => 'function(:MediaQueryList):void',

    # http://www.w3.org/TR/file-system-api/
    'FileCallback' => 'function(:File):void',

    # http://www.w3.org/TR/2012/WD-mediacapture-streams-20120628/#dictionary-mediatrackconstraints-members
    # http://datatracker.ietf.org/doc/draft-burnett-rtcweb-constraints-registry/
    'MediaTrackConstraintSet' => 'Map.<variant>',
    'MediaTrackConstraint'    => 'Map.<variant>',

    # http://www.w3.org/TR/2012/WD-IndexedDB-20120524/
    'IDBVersionChangeCallback' => 'function(:IDBTransactionSync,:number):void',
    'IDBTransactionCallback'   => 'function(:IDBTransactionSync):void',

    # http://www.w3.org/TR/webrtc/
    'MediaStreamConstraints' => 'Map.<variant>', # e.g. { video: true }
    'MediaConstraints'       => 'Map.<variant>',

    'Elements' => 'Array.<Element>',

    # https://wiki.mozilla.org/GamepadAPI
    'nsIVariant'  => 'variant',
    'nsIDOMEvent' => 'Event',
    'nsISupports' => 'Object',
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

    'nullable DOMString', # FIXME
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
                $rx_simple_type $rx_type_modifier*
                (?: \s+ or \s+ $rx_simple_type $rx_type_modifier* )+
                \s*
            \)
        )
        |
        $rx_simple_type
    )
    $rx_type_modifier*
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

foreach my $src(@files) {
    my($specname, $file) = split /\s*;\s*/, $src, 2;
    if (! $file) {
        $file = $src;
        $specname = uri_escape($file);
    }
    info "parsing $file";

    # XXX: looks a bug in http://www.w3.org/TR/html5/single-page.html
    my $Document_is_HTMLDocument = ($file =~ m{ /html5/single-page.html }xms);

    my $guard;
    if ($Document_is_HTMLDocument) {
        $guard = WebIDL::TypeMap->alias_temp("HTMLDocument" => "Document");
    }

    my $content;
    {
        my $arg = $file;
        if($arg =~ /^https?:/) {
            my $filename = "$root/spec/$specname";

            if ($refresh or not -e $filename) {
                info("GET $arg");
                state $ua = LWP::UserAgent->new();
                my $res = $ua->mirror($arg, $filename);

                if($res->header("Last-Modified")) {
                    info("Last-Modified: ", $res->header("Last-Modified"));
                }
            }

            if($arg =~ /\.idl$/) {
                $arg = $filename;
            }
            else {
                $arg = "w3m -T text/html -dump $filename |";
            }
        }
        open my($fh), $arg; # magic open!
        local $/;
        $content = <$fh>;
        close $fh;
        if ($? != 0) {
            die "'$arg' exited with non-zero ($?) status";
        }
    }

    my $spec_name = $file =~ /^https?:/ ? $file : "";

    info 'process typedefs (typedef, callback, enum)';
    while($content =~ m{
            (?: # typedef ExistingType NewType;
                ^ \s* \b (?<typedef> typedef) \b
                \s+
                (?<existing_type> $rx_type)
                \s+
                (?<new_type> \w+) \s*
                ;
            )
            |
            (?:  # callback NewType = RetType ( ParamTypes* )
                ^\s* (?<callback> callback)
                \s+ (?<name> \w+)
                \s* =
                \s* (?<ret_type> $rx_simple_type)
                \s*
                    \(
                        (?<params> $rx_params)
                    \)
                \s* ;
            )
            |
            (?: # enum T ... ;
                ^\s* (?<enum> enum)
                \s+ (?<name> \w+)
                \s*
                \{
            )
        }xmsg) {

        if ($+{typedef}) {
            my $new      = $+{new_type};
            my $existing = to_jsx_type($+{existing_type});
            info "typedef: $new = $existing";
            WebIDL::TypeMap->alias($existing => $new);
        }
        elsif($+{callback}) {
            my $name = $+{name};
            my $cb_type = make_function_type($+{ret_type}, $+{params});
            info "callback: $name = $cb_type";
            WebIDL::TypeMap->alias($cb_type => $name);
        }
        else {
            my $name = $+{name};
            info "enum: $name = DOMString";
            WebIDL::TypeMap->alias('DOMString' => $name);
        }
    }

    info 'process <class>';
    while($content =~ m{
                (?<attrs> (?: \[ (?: [^\]]+ | \[ \s* \])+ \] \s+)* )
                (?<type>
                    (?:partial \s+)? interface
                    | exception
                    | dictionary
                    )
                \s+ (?<name> \w+)
                (?: \s* : \s* (?<base> [\w:]+) )?
                \s*
                \{ (?<members> [^\}]*? ) \}
                \s* ;
            }xmsg) {

        my $class      = $+{name};
        my $attrs      = $+{attrs};
        my $class_type = $+{type};
        my $base       = $+{base};
        my $members    = $+{members};

        if($Document_is_HTMLDocument && $class eq 'Document') {
            $class_type =~ s/partial \s+//xms;
            $class = "HTMLDocument";
            $base  = "Document";
        }

        info $class_type, $class, ($base ? ": $base" : ());

        my $def = $classdef{$class} //= {
            attrs => $attrs,
            name  => $class,
            implements => [],
            members => [],
            decl    => {},
            fake    => $fake{$class},
        };

        if($class eq 'HTMLAllCollection' or $class eq 'HTMLFormControlsCollection') {
            # HTMLAllCollection and HTMLFormControlsCollection are
            # declared as a subclass of HTMLCollection,
            # but it is not compatible with HTMLCollection in terms of JSX.
            $base = "";
            push @{$def->{members}}, {
                id     => 'length',
                decl   => 'var length : number;',
                type   => 'number',
                static => 0,
                spec   => $spec_name,
            };
        }

        if($class_type !~ /\b partial \b/xms) {
            $has_definition{$class} = 1;
            $def->{spec} = $spec_name;
            $def->{class_type} = $class_type;
        }

        if($base) {
            $def->{base} //= $base;
            $has_child{$base}++;
        }

        $def->{skip} = 1 if $skip{$class};

        my $members_ref = $def->{members};

        # name to array of members; to resolve override
        my $decl_ref = $def->{decl};

        my $alias = 0;

        if($attrs) {
            while($attrs =~ m{
                \b Constructor \s* (?: \(
                    (?<params> $rx_params)
                \) )?
            }xmsg) {
                make_functions(
                    $decl_ref,
                    $members_ref,
                    "constructor",
                    $spec_name,
                    undef,
                    $+{params},
                );
            }

            if($attrs =~ /\b NoInterfaceObject \b/xms) {
                $def->{fake} = 1;
            }
            if($attrs =~ m{\b Callback \b}xms) {
                $alias = 1;
            }
        }

        # FIXME: Complex regular subexpression recursion limit (32766) exceeded

        while($members =~ m{
                (?<spaces> \s+)
                |
                (?<comments> $rx_comments)
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
                    id     => $id,
                    decl   => $static_const,
                    type   => $type,
                    static => 1,
                    spec   => $spec_name,
                };
                push @{$members_ref}, {
                    id     => $id,
                    decl   => $readonly_var,
                    type   => $type,
                    static => 0,
                    spec   => $spec_name,
                };
            }
            # member var
            elsif($member =~ m{
                    (?: \bstringifier\b \s+ )?
                    (?<static> \bstatic\b \s+ )?
                    (?<readonly> \breadonly\b \s+)?
                    (?: \binherit\b \s+)?
                    (?: \battribute\b \s+)?
                    (?: \bunrestricted\b \s+)?
                    (?: \[ [^\]]+ \])? # annotations
                    (?<type> $rx_type) \s+ (?<ident> \w+) # required
                    (?: \s+ setraises\( [^\)]+ \) )?
                    [^;\(\)\[\]]* ;
                }xms) {
                my $id = $+{ident};

                if ($id eq 'attribute') { # something's wrong
                    die "panic: $member";
                }

                my $decl = "";
                if ($+{static}) {
                    $decl .= "static ";
                }
                if ($+{readonly}) {
                    $decl = "__readonly__ ";
                }
                my $type = to_jsx_type($+{type});

                $decl .= "var $id : $type;";

                $decl_ref->{$id} //= [];
                push @{$decl_ref->{$id}}, $decl;
                push @{$members_ref}, {
                    id     => $id,
                    decl   => $decl,
                    type   => $type,
                    static => 0,
                    spec   => $spec_name,
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

                my $ret_type_nullable = 0;

                if($prop) {
                    if(index($prop, "getter") != -1) {
                        $ret_type_nullable = 1;
                        my $id = "__native_index_operator__";
                        make_functions(
                            $decl_ref,
                            $members_ref,
                            $id,
                            $spec_name,
                            $ret_type,
                            $params,
                            $ret_type_nullable,
                        );
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
                    $decl_ref,
                    $members_ref,
                    $id,
                    $spec_name,
                    $ret_type,
                    $params,
                    $ret_type_nullable,
                    $static
                );

                # redefine it as a callbackdefinition
                if($alias) {
                    $def->{alias} = make_function_type($ret_type, $params);
                    $def->{fake} = 1;
                }
            }
            elsif($member =~ m{stringifier;}) {
                # ignore
            }
            else {
                die "[BUG] cannot parse member: $member\n";
            }
        }
    }

    info 'process <implements>';
    {
        my $classes = join "|", map { quotemeta } keys %classdef;

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

            $has_child{$interface->{name}}++;

            if (not $def->{base}) {
                $def->{base} = $interface->{name};
            }
            else {
                # FIXME
                push @{ $def->{members} },
                    "",
                    "// implements $interface->{name}",
                    @{$interface->{members}};

                $interface->{fake} = 1;
            }
        }
    }
}


info 'output';
foreach my $def(values %classdef) {
    if($def->{skip} or $def->{done}) {
        next;
    }
    $def->{done} = 1 if $continuous;

    if($def->{alias}) { # type alias (a.k.a. typedef)
        say "// alias $def->{name} = $def->{alias}";
        say "";

        next;
    }

    if(!$has_definition{$def->{name}}) {
        # partial class only
        next;
    }

    my %seen;

    my $classdecl = "";

    if ($def->{class_type} eq "dictionary") {
        $classdecl .= "/* dictionary */";
    }
    else {
        $classdecl .= "native";

        if(!$has_child{$def->{name}}) {
            $classdecl .= " final";
        }
        if($def->{fake}) {
            $classdecl .= " __fake__";
        }
    }

    $classdecl .= " class $def->{name}";

    if($def->{base}) {
        $classdecl .= " extends " . to_jsx_type($def->{base});
    }

    say sprintf '/** @see %s */', $def->{spec} if $def->{spec};
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
                }
                else {
                    # skip if it is already defined
                    next if $seen{ join(";", $member->{id}, $member->{static}) }++;
                }

                say "\t", sprintf '/** @see %s */', $member->{spec} if $member->{spec} && $def->{spec} ne $member->{spec};
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

lock_store(\%classdef, $db) if $continuous;
exit;

sub to_jsx_type {
    my($idl_type, %attr) = @_;

    my $nullable = $attr{nullable};

    $idl_type = trim($idl_type);

    my $original = $idl_type;

    $idl_type =~ s/.+://; # remove namespace

    if ($idl_type =~ m{ \b or \b }xms) {
        if ($idl_type =~ /(?: byte | short | int | long | float | double | boolean | number | string | DOMString  )/xms) { # looks to include primitive types
            return "variant/*$idl_type*/";
        }
        else {
            return "Object/*$idl_type*/";
        }
    }

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
            (?<nullable> \? )
        )*
        \z
    }{}xms;

    $nullable ||= $+{nullable};
    $array //= $+{array};

    my $alias = WebIDL::TypeMap->get($idl_type);
    if(!$alias && exists $classdef{$idl_type}) {
        # callback definition is regarded as aliased type
        if(my $t = $classdef{$idl_type}{alias}) {
            $alias = WebIDL::TypeMap->get_or_create($t);
        }
    }

    my $type = $alias || WebIDL::TypeMap->get_or_create($idl_type);
    my $jsx_type = $type->resolved_name;

    if (!$jsx_type) {
        $jsx_type = $type->resolved_name($type->name);
    }

    my $is_aliased = ($jsx_type ne $idl_type);

    if($array) {
        $jsx_type .= "[]";
    }
    if ($nullable && $jsx_type !~ /\b variant \b/xms) {
        $jsx_type = "Nullable.<$jsx_type>";
    }

    if($is_aliased) {
        $jsx_type .= "/*$original*/";
    }

    return $jsx_type;
}

sub make_functions {
    my($decl_ref, $members_ref, $name, $spec, $ret_type, $src_params, $ret_type_nullable, $static) = @_;

    my $ret_type_decl = defined($ret_type)
        ? " : " . to_jsx_type($ret_type, nullable => $ret_type_nullable)
        : "";

    my @unresolved_params = parse_params($src_params);

    my @decls;
    my @funcs;

    foreach my $params_ref(resolve_overload(@unresolved_params)) {
        # resolve optional args
        my @d;
        my @f;
        while(1) {
            my $p = join ", ", map {
                my $vararg = $_->{vararg} ? "..." : "";
                "$vararg$_->{name} : $_->{jsx_type}"
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
                spec          => $spec,
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

sub parse_params {
    my($src_params) = @_;

    my @params;
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

        $t{vararg} = 1 if $t{type} =~ /\.\.\. \z/xms;

        push @params, \%t;
    }
    return @params;
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

        my @idl_types = split /\b or \b/xms, $type;
        my @jsx_types = map { to_jsx_type($_) } @idl_types;

        # "number[]" parameters also accept "int[]"
        for (my($i, $l) = (0, scalar @idl_types); $i < $l; $i++) {
            if ($jsx_types[$i] =~ /\A number \[\]/xms) {
                push @idl_types, $idl_types[$i];
                push @jsx_types, "int[]/*$idl_types[$i]*/";
            }
        }

        my @resolved = resolve_overload(@params);
        for (my($i, $l) = (0, scalar @idl_types); $i < $l; $i++) {
            my $p = {
                type     => $idl_types[$i],
                jsx_type => $jsx_types[$i],
                name     => $head->{name},
                optional => $head->{optional},
                vararg   => $head->{vararg},
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

sub function_params {
    my($decl) = @_;

    # remove comments
    $decl =~ s{/\* .*? \*/}{}xmsg;

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

sub make_function_type {
    my($ret_type, $params) = @_;
    my $callback_params = join ",", map {
            sprintf '%s:%s',
                $_->{name}, to_jsx_type($_->{type})
        } parse_params($params);

    return "function($callback_params):" . to_jsx_type($ret_type);
}

