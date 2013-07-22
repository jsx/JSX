package Test::Difflet;
use strict;
use warnings;
use utf8;
use Test::More;
use Data::Difflet;
use Data::Dumper;

sub import {
    my $class = shift;
    my $pkg = caller(0);
    no strict 'refs';
    for (@_) {
        if ($_ eq 'is_deeply') {
            no warnings 'redefine';
            *{"${pkg}::is_deeply"} = \&difflet_is_deeply;
        }
    }
    *{"${pkg}::difflet_is_deeply"} = \&difflet_is_deeply;
}

sub difflet_is_deeply {
    my ($got, $expected, $msg) = @_;

    my $builder = Test::More->builder;
    local $Test::Builder::Level = $Test::Builder::Level + 1;
    if (-t *STDOUT) {
        if (_eq_deeply($got, $expected)) {
            $builder->ok(1, $msg);
        } else {
            my $difflet = Data::Difflet->new();
            $builder->ok(0, $msg);
            $builder->diag($difflet->compare($got, $expected));
        }
    } else {
        is_deeply($got, $expected, $msg);
    }
}

sub _eq_deeply {
    my ($a, $b) = @_;
    local $Data::Dumper::Terse = 1;
    local $Data::Dumper::Indent = 0;
    local $Data::Dumper::Sortkeys = 1;
    return Dumper($a) eq Dumper($b);
}

1;
__END__

=head1 NAME

Test::Difflet - testing with difflet

=head1 SYNOPSIS

    use Test::Difflet;
    difflet_is_deeply( { "foo" => [ 1, 2, 3 ] }, { "foo" => [ 4, 2, 3 ] } );

    # or override is_deeply
    use Test::Difflet qw/is_deeply/;
    is_deeply( { "foo" => [ 1, 2, 3 ] }, { "foo" => [ 4, 2, 3 ] }, 'test name');

=head1 DESCRIPTION

This is a drop-in replacement for Test::More::is_deeply.
You can use Data::Difflet for testing very easily.

=head1 SEE ALSO

L<Data::Difflet>

