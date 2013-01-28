package Test::Requires;
use strict;
use warnings;
our $VERSION = '0.06';
use base 'Test::Builder::Module';
use 5.006000;

sub import {
    my $class = shift;
    my $caller = caller(0);

    # export methods
    {
        no strict 'refs';
        *{"$caller\::test_requires"} = \&test_requires;
    }

    # test arguments
    if (@_ == 1 && ref $_[0] && ref $_[0] eq 'HASH') {
        while (my ($mod, $ver) = each %{$_[0]}) {
            test_requires($mod, $ver, $caller);
        }
    } else {
        for my $mod (@_) {
            test_requires($mod, undef, $caller);
        }
    }
}

sub test_requires {
    my ( $mod, $ver, $caller ) = @_;
    return if $mod eq __PACKAGE__;
    if (@_ != 3) {
        $caller = caller(0);
    }
    $ver ||= '';

    eval qq{package $caller; use $mod $ver}; ## no critic.
    if (my $e = $@) {
        my $skip_all = sub {
            my $builder = __PACKAGE__->builder;

            if (not defined $builder->has_plan) {
                $builder->skip_all(@_);
            } elsif ($builder->has_plan eq 'no_plan') {
                $builder->skip(@_);
                if ( $builder->can('parent') && $builder->parent ) {
                    die bless {} => 'Test::Builder::Exception';
                }
                exit 0;
            } else {
                for (1..$builder->has_plan) {
                    $builder->skip(@_);
                }
                if ( $builder->can('parent') && $builder->parent ) {
                    die bless {} => 'Test::Builder::Exception';
                }
                exit 0;
            }
        };
        if ( $e =~ /^Can't locate/ ) {
            $skip_all->("Test requires module '$mod' but it's not found");
        }
        else {
            $skip_all->("$e");
        }
    }
}

1;
__END__

=head1 NAME

Test::Requires - Checks to see if the module can be loaded

=head1 SYNOPSIS

    # in your Makefile.PL
    use inc::Module::Install;
    test_requires 'Test::Requires';

    # in your test
    use Test::More tests => 10;
    use Test::Requires {
        'HTTP::MobileAttribute' => 0.01, # skip all if HTTP::MobileAttribute doesn't installed
    };
    isa_ok HTTP::MobileAttribute->new, 'HTTP::MobileAttribute::NonMobile';

    # or
    use Test::More tests => 10;
    use Test::Requires qw( 
        HTTP::MobileAttribute
    );
    isa_ok HTTP::MobileAttribute->new, 'HTTP::MobileAttribute::NonMobile';

    # or
    use Test::More tests => 10;
    use Test::Requires;
    test_requires 'Some::Optional::Test::Required::Modules';
    isa_ok HTTP::MobileAttribute->new, 'HTTP::MobileAttribute::NonMobile';

=head1 DESCRIPTION

Test::Requires checks to see if the module can be loaded.

If this fails rather than failing tests this B<skips all tests>.

=head1 AUTHOR

Tokuhiro Matsuno E<lt>tokuhirom @*(#RJKLFHFSDLJF gmail.comE<gt>

=head1 THANKS TO

    kazuho++ # some tricky stuff
    miyagawa++ # original code from t/TestPlagger.pm
    tomyhero++ # reported issue related older test::builder

=head1 SEE ALSO

L<t/TestPlagger.pm>

=head1 LICENSE

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
