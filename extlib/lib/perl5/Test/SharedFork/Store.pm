package Test::SharedFork::Store;
use strict;
use warnings;
use Storable ();
use Fcntl ':seek', ':DEFAULT', ':flock';
use File::Temp ();
use IO::Handle;

sub new {
    my $class = shift;
    my %args = @_;
    my $filename = File::Temp::tmpnam();

    my $init = Storable::dclone($args{init} || +{});

    my $self = bless {
        callback_on_open => $args{cb},
        filename         => $filename,
        lock             => 0,
        pid              => $$,
        ppid             => $$,
    }, $class;
    $self->open();

    # initialize
    Storable::nstore_fd($init, $self->{fh}) or die "Cannot write initialize data to $filename";

    return $self;
}

sub open {
    my $self = shift;
    if (my $cb = $self->{callback_on_open}) {
        $cb->($self);
    }
    sysopen my $fh, $self->{filename}, O_RDWR|O_CREAT or die $!;
    $fh->autoflush(1);
    $self->{fh} = $fh;
}

sub close {
    my $self = shift;
    close $self->{fh};
    undef $self->{fh};
}

sub get {
    my ($self, $key) = @_;
    $self->_reopen_if_needed;
    seek $self->{fh}, 0, SEEK_SET or die $!;
    Storable::fd_retrieve($self->{fh})->{$key};
}

sub set {
    my ($self, $key, $val) = @_;

    $self->_reopen_if_needed;

    seek $self->{fh}, 0, SEEK_SET or die $!;
    my $dat = Storable::fd_retrieve($self->{fh});
    $dat->{$key} = $val;

    truncate $self->{fh}, 0;
    seek $self->{fh}, 0, SEEK_SET or die $!;
    Storable::nstore_fd($dat => $self->{fh}) or die "Cannot store data to $self->{filename}";
}

sub get_lock {
    my ($self, ) = @_;
    Test::SharedFork::Store::Locker->new($self);
}

sub _reopen_if_needed {
    my $self = shift;
    if ($self->{pid} != $$) { # forked, and I'm just a child.
        $self->{pid} = $$;
        if ($self->{lock} > 0) { # unlock! I'm not owner!
            flock $self->{fh}, LOCK_UN or die $!;
            $self->{lock} = 0;
        }
        $self->close();
        $self->open();
    }
}

sub DESTROY {
    my $self = shift;
    if ($self->{ppid} eq $$) { # cleanup method only run on original process.
        unlink $self->{filename};
    }
}

package # hide from pause
    Test::SharedFork::Store::Locker;

use Fcntl ':flock';

sub new {
    my ($class, $store) = @_;

    $store->_reopen_if_needed;

    if ($store->{lock}++ == 0) {
        flock $store->{fh}, LOCK_EX or die $!;
    }

    bless { store => $store }, $class;
}

sub DESTROY {
    my ($self) = @_;

    $self->{store}->{lock}--;
    if ($self->{store}->{lock} == 0) {
        flock $self->{store}->{fh}, LOCK_UN or die $!;
    }
}

1;
