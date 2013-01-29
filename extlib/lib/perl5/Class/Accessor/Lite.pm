package Class::Accessor::Lite;

use strict;

our $VERSION = '0.05';

use Carp ();

sub import {
    shift;
    my %args = @_;
    my $pkg = caller(0);
    my %key_ctor = (
        rw => \&_mk_accessors,
        ro => \&_mk_ro_accessors,
        wo => \&_mk_wo_accessors,
    );
    for my $key (sort keys %key_ctor) {
        if (defined $args{$key}) {
            Carp::croak "value of the '$key' parameter should be an arrayref"
                unless ref($args{$key}) eq 'ARRAY';
            $key_ctor{$key}->($pkg, @{$args{$key}});
        }
    }
    _mk_new($pkg)
        if $args{new};
    1;
}

sub mk_new_and_accessors {
    (undef, my @properties) = @_;
    my $pkg = caller(0);
    _mk_new($pkg);
    _mk_accessors($pkg, @properties);
}

sub mk_new {
    my $pkg = caller(0);
    _mk_new($pkg);
}

sub mk_accessors {
    (undef, my @properties) = @_;
    my $pkg = caller(0);
    _mk_accessors($pkg, @properties);
}

sub mk_ro_accessors {
    (undef, my @properties) = @_;
    my $pkg = caller(0);
    _mk_ro_accessors($pkg, @properties);
}

sub mk_wo_accessors {
    (undef, my @properties) = @_;
    my $pkg = caller(0);
    _mk_wo_accessors($pkg, @properties);
}

sub _mk_new {
    my $pkg = shift;
    no strict 'refs';
    *{$pkg . '::new'} = __m_new($pkg);
}

sub _mk_accessors {
    my $pkg = shift;
    no strict 'refs';
    for my $n (@_) {
        *{$pkg . '::' . $n} = __m($n);
    }
}

sub _mk_ro_accessors {
    my $pkg = shift;
    no strict 'refs';
    for my $n (@_) {
        *{$pkg . '::' . $n} = __m_ro($pkg, $n);
    }
}

sub _mk_wo_accessors {
    my $pkg = shift;
    no strict 'refs';
    for my $n (@_) {
        *{$pkg . '::' . $n} = __m_wo($pkg, $n);
    }
}

sub __m_new {
    my $pkg = shift;
    no strict 'refs';
    return sub {
        my $klass = shift;
        bless {
            (@_ == 1 && ref($_[0]) eq 'HASH' ? %{$_[0]} : @_),
        }, $klass;
    };
}

sub __m {
    my $n = shift;
    sub {
        return $_[0]->{$n} if @_ == 1;
        return $_[0]->{$n} = $_[1] if @_ == 2;
        shift->{$n} = \@_;
    };
}

sub __m_ro {
    my ($pkg, $n) = @_;
    sub {
        if (@_ == 1) {
            return $_[0]->{$n} if @_ == 1;
        } else {
            my $caller = caller(0);
            Carp::croak("'$caller' cannot access the value of '$n' on objects of class '$pkg'");
        }
    };
}

sub __m_wo {
    my ($pkg, $n) = @_;
    sub {
        if (@_ == 1) {
            my $caller = caller(0);
            Carp::croak( "'$caller' cannot alter the value of '$n' on objects of class '$pkg'")
        } else {
            return $_[0]->{$n} = $_[1] if @_ == 2;
            shift->{$n} = \@_;
        }
    };
}


1;

__END__

=head1 NAME

Class::Accessor::Lite - a minimalistic variant of Class::Accessor

=head1 SYNOPSIS

    package MyPackage;

    use Class::Accessor::Lite (
        new => 1,
        rw  => [ qw(foo bar) ],
        ro  => [ qw(baz) ],
        wo  => [ qw(hoge) ],
    );

=head1 DESCRIPTION

The module is a variant of C<Class::Accessor>.  It is fast and requires less typing, has no dependencies to other modules, and does not mess up the @ISA.

=head1 THE USE STATEMENT

The use statement (i.e. the C<import> function) of the module takes a single hash as an argument that specifies the types and the names of the properties.  Recognises the following keys.

=over 4

=item new => $true_or_false

the default constructor is created if the value evaluates to true, otherwise nothing is done (the default behaviour)

=item rw => \@name_of_the_properties

creates a read / write accessor for the name of the properties passed through as an arrayref

=item ro => \@name_of_the_properties

creates a write-only accessor for the name of the properties passed through as an arrayref

=item rw => \@name_of_the_properties

creates a read-only accessor for the name of the properties passed through as an arrayref

=back

For more detailed explanation read the following section describing the behaviour of each function that actually creates the accessors.

=head1 FUNCTIONS

As of version 0.04 the properties can be specified as the arguments to the C<use> statement (as can be seen in the SYNOPSIS) which is now the recommended way of using the module, but for compatibility the following functions are provided as well.

=head2 Class::Accessor::Lite->mk_accessors(@name_of_the_properties)

Creates an accessor in current package under the name specified by the arguments that access the properties (of a hashref) with the same name.

=head2 Class::Accessor::Lite->mk_ro_accessors(@name_of_the_properties)

Same as mk_accessors() except it will generate read-only accessors (i.e. true accessors).  If you attempt to set a value with these accessors it will throw an exception.

=head2 Class::Accessor::Lite->mk_wo_accessors(@name_of_the_properties)

Same as mk_accessors() except it will generate write-only accessors (i.e. mutators).  If you attempt to read a value with these accessors it will throw an exception.

=head2 Class::Accessor::Lite->mk_new()

Creates the C<new> function that accepts a hash or a hashref as the initial properties of the object.

=head2 Class::Accessor::Lite->mk_new_and_accessors(@name_of_the_properties)

DEPRECATED.  Use the new "use Class::Accessor::Lite (...)" style.

=head1 FAQ

=head2 Can I use C<Class::Accessor::Lite> in an inherited module?

Yes in most cases, when the class object in the super class is implemeted using a hashref.  However you _should_ _not_ create the constructor for the inherited class by calling C<Class::Accessor::Lite->new()> or by C<use Class::Accessor::Lite (new => 1).  The only other thing that C<Class::Accessor::Lite> does is to set up the accessor functions for given property names through a blessed hashref.

=head2 What happens when passing more than one arguments to the accessor?

When the accessor built by Class::Accessor::Lite is given more than one arguments, a reference to the arguments will be saved as an arrayref.  This behaviour might not be necessary but is implemented as is to maintain compatibility with L<Class::Accessor::Fast>.

    my @data = (1, 2, 3);
    $obj->someproperty(@data);

    $obj->someproperty->[2]++; # $data[3] is incremented

In general, you should pass an arrayref to set an arrayref to a property.

    my @data = (1, 2, 3);
    $obj->someproperty([ @data ]); # save a copy using arrayref

    $obj->someproper->[2]++; # @data is not modified

=head1 SEE ALSO

L<Class::Accessor>

L<Class::Accessor::Lite>

=head1 AUTHORS

Copyright (C) 2008 - 2010 Kazuho Oku

=head1 LICENSE

This library is free software; you can redistribute it and/or modify it under the same terms as Perl itself, either Perl version 5.8.6 or, at your option, any later version of Perl 5 you may have available.

=cut

