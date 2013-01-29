package Test::SharedFork;
use strict;
use warnings;
use base 'Test::Builder::Module';
our $VERSION = '0.21';
use Test::Builder 0.32; # 0.32 or later is needed
use Test::SharedFork::Scalar;
use Test::SharedFork::Array;
use Test::SharedFork::Store;
use Config;
use 5.008000;

{
    package #
        Test::SharedFork::Contextual;

    sub call {
        my $code = shift;
        my $wantarray = [caller(1)]->[5];
        if ($wantarray) {
            my @result = $code->();
            bless {result => \@result, wantarray => $wantarray}, __PACKAGE__;
        } elsif (defined $wantarray) {
            my $result = $code->();
            bless {result => $result, wantarray => $wantarray}, __PACKAGE__;
        } else {
            { ; $code->(); } # void context
            bless {wantarray => $wantarray}, __PACKAGE__;
        }
    }

    sub result {
        my $self = shift;
        if ($self->{wantarray}) {
            return @{ $self->{result} };
        } elsif (defined $self->{wantarray}) {
            return $self->{result};
        } else {
            return;
        }
    }
}

my $STORE;

BEGIN {
    my $builder = __PACKAGE__->builder;

    if( $] >= 5.008001 && $Config{useithreads} && $INC{'threads.pm'} ) {
        die "# Current version of Test::SharedFork does not supports ithreads.";
    }

    if (Test::Builder->VERSION > 1.005) {
        # TODO: hook TB2::threads::shared::off instead of following hacks.
        # new Test::Builder
        $STORE = Test::SharedFork::Store->new();
        require TB2::History;

        # wrap the moriginal methods
        our $level = 0;
        for my $class (qw/TB2::History TB2::Counter/) {
            my $meta = $class->meta;
            my @methods = $meta->get_method_list;
            for my $method (@methods) {
                next if $method =~ /^_/;
                next if $method eq 'meta';
                next if $method eq 'create';
                next if $method eq 'singleton';
                next if $method eq 'buildstack';
                $meta->add_around_method_modifier(
                    $method => sub {
                        my ($code, $orig_self, @args) = @_;
                        return $orig_self->$code(@args) if (! ref $orig_self) || ! $orig_self->{test_sharedfork_hacked};

                        my $lock = $STORE->get_lock();
                        local $level = $level + 1;
                        my $self =
                          $level == 1 ? $STORE->get($class) : $orig_self;

                        my $ret = Test::SharedFork::Contextual::call(sub { $self->$code(@args) });
                        $STORE->set($class => $self);
                        return $ret->result;
                    },
                );
            }
        }
        for my $obj ( $builder->counter ) {
            my $klass = ref($obj);
            unless ($klass) {
                require Data::Dumper;
                die "Cannot fetch object: " . Data::Dumper::Dumper($builder);
            }
            $obj->{test_sharedfork_hacked}++;
            $STORE->set( $klass => $obj );
        }
    } else {
        # older Test::Builder
        $STORE = Test::SharedFork::Store->new(
            cb => sub {
                my $store = shift;
                tie $builder->{Curr_Test}, 'Test::SharedFork::Scalar',
                $store, 'Curr_Test';
                tie @{ $builder->{Test_Results} },
                'Test::SharedFork::Array', $store, 'Test_Results';
            },
            init => +{
                Test_Results => $builder->{Test_Results},
                Curr_Test    => $builder->{Curr_Test},
            },
        );
    }

    # make methods atomic.
    no strict 'refs';
    no warnings 'redefine';
    for my $name (qw/ok skip todo_skip current_test/) {
        my $orig = *{"Test::Builder::${name}"}{CODE};
        *{"Test::Builder::${name}"} = sub {
            local $Test::Builder::Level = $Test::Builder::Level + 1;
            my $lock = $STORE->get_lock(); # RAII
            $orig->(@_);
        };
    };

}

{
    # backward compatibility method
    sub parent { }
    sub child  { }
    sub fork   { fork() }
}

1;
__END__

=head1 NAME

Test::SharedFork - fork test

=head1 SYNOPSIS

    use Test::More tests => 200;
    use Test::SharedFork;

    my $pid = fork();
    if ($pid == 0) {
        # child
        ok 1, "child $_" for 1..100;
    } elsif ($pid) {
        # parent
        ok 1, "parent $_" for 1..100;
        waitpid($pid, 0);
    } else {
        die $!;
    }

=head1 DESCRIPTION

Test::SharedFork is utility module for Test::Builder.

This module makes L<fork(2)> safety in your test case.

This module merges test count with parent process & child process.

=head1 LIMITATIONS

This version of the Test::SharedFork does not support ithreads, because L<threads::shared> conflicts with L<Storable>.

=head1 AUTHOR

Tokuhiro Matsuno E<lt>tokuhirom  slkjfd gmail.comE<gt>

yappo

=head1 THANKS TO

kazuhooku

konbuizm

=head1 SEE ALSO

L<Test::TCP>, L<Test::Fork>, L<Test::MultipleFork>

=head1 LICENSE

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
