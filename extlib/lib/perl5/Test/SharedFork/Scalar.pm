package Test::SharedFork::Scalar;
use strict;
use warnings;
use base 'Tie::Scalar';

# create new tied scalar
sub TIESCALAR {
    my ($class, $share, $key) = @_;
    die "missing key" unless $key;
    bless { share => $share, key => $key }, $class;
}

sub FETCH {
    my $self = shift;
    my $lock = $self->{share}->get_lock();
    $self->{share}->get($self->{key});
}

sub STORE {
    my ($self, $val) = @_;
    my $share = $self->{share};
    my $lock = $self->{share}->get_lock();
    $share->set($self->{key} => $val);
}

1;
