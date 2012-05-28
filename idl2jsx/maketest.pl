#!/usr/bin/env perl
use 5.10.0;
use strict;
use warnings;
use Storable qw(lock_retrieve);
use Tie::IxHash;
use File::Basename qw(dirname);
use Text::Xslate;
use Data::Section::Simple;

my $classdef = lock_retrieve(dirname(__FILE__) . "/.idl2jsx.bin");

my @classes;
my %used_type;

# prepare
my $i = 0;
while(my($class, $def) = each %{$classdef}) {
    next if $def->{skip};

    push @classes, $def;

    my @tests;
    foreach my $member(@{$def->{members}}) {
        next unless ref $member;

        my $receiver;
        if($member->{static}) {
            $receiver = $class;
        }
        else {
            $receiver = "X.get$class()";
            $used_type{type2id($class)} = $class;
        }

        my $decl = $member->{decl};
        $decl =~ s{/\* .*? \*/}{}xmsg;

        if(exists $member->{type}) {
            push @tests, sprintf "var v%d : %s = %s.%s;",
                ++$i, $member->{type},
                $receiver, $member->{id};

            $used_type{type2id($member->{type})} = $member->{type};
        }
        elsif($member->{id} eq 'constructor') {
            # TODO
        }
        else {
            my $ret_type    = $member->{ret_type_decl};
            my $param_types = $member->{param_types};

            $ret_type =~ s/\A \s* : \s*//xms;

            if($ret_type eq 'void') {
                push @tests, sprintf "%s.%s(%s);",
                    $receiver, $member->{id}, join(", ", map { value_of($_) } @{$param_types});

                $used_type{type2id($_)} = $_ for @{$param_types};
            }
            else {
                push @tests, sprintf "var f%d : %s = %s.%s(%s);",
                    ++$i, $ret_type,
                    $receiver, $member->{id}, join(", ", map { value_of($_) } @{$param_types});

                $used_type{type2id($_)} = $_ for @{$param_types};
                $used_type{type2id($ret_type)} = $ret_type;
            }
        }
    }

    $def->{tests} = \@tests;

}
# build
my $xslate = Text::Xslate->new(
    type => "text",
    path => [ Data::Section::Simple->new->get_data_section ],
    function => {
        type2id => \&type2id,
    },
);

print $xslate->render("web.jsx", {
        classes => \@classes,
        types   => \%used_type,
    });

exit;

sub type2id {
    my($type) = @_;
    $type =~ s/\s+//xmsg;
    $type =~ s{/\* .*? \*/}{}xmsg;
    $type =~ s/ \W /_/xmsg;
    return $type;
}

sub value_of {
    my($type) = @_;
    return sprintf 'X.get%s()', type2id($type);
}

__DATA__
@@ web.jsx
import "test-case.jsx";
import "js/web.jsx";

class _Test extends TestCase {

: for $classes -> $class {

    function compile_<: $class.name :>(o : <: $class.name :>) : void {
    : for $class.tests -> $statement {
        <: $statement :>
    : }
    } // <: $class.name :>

: }

    function test_compile() : void {
        this.expect(true).toBe(true);
    }

}

native class X {
: for $types.kv() -> $pair {
    static function get<: $pair.key :>() : <: $pair.value :>;
: }
}

