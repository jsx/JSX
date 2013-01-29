package Test::SharedFork::Array;
use strict;
use warnings;
use base 'Tie::Array';
use Storable ();

# create new tied array
sub TIEARRAY {
    my ($class, $share, $key) = @_;
    die "missing key" unless $key;
    my $self = bless { share => $share, key => $key }, $class;
    $self;
}


sub _get {
    my $self = shift;
    my $lock = $self->{share}->get_lock();
    return $self->{share}->get($self->{key});
}
sub FETCH {
    my ($self, $index) = @_;
    $self->_get()->[$index];
}
sub FETCHSIZE {
    my $self = shift;
    my $ary = $self->_get();
    scalar @$ary;
}

sub STORESIZE {
    my ($self, $size) = @_;
    my $lock = $self->{share}->get_lock();
    my $ary  = $self->_get();
    $#$ary   = $size - 1;
}

sub STORE {
    my ($self, $index, $val) = @_;

    my $lock = $self->{share}->get_lock();

    my $share = $self->{share};
    my $cur = $share->get($self->{key});
    $cur->[$index] = $val;
    $share->set($self->{key} => $cur);
}

1;
