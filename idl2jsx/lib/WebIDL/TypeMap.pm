package WebIDL::TypeMap;
use 5.12.0;
use strict;
use warnings;

use Scope::Guard;

use WebIDL::Type;

my %MAP;

sub define {
    my($class, @typemap) = @_;

    while (my($name, $resolved_name) = splice @typemap, 0, 2) {
        $MAP{$name} = WebIDL::Type->new(
            name          => $name,
            resolved_name => $resolved_name
        );
    }
    return;
}

sub get {
    my($class, $name) = @_;
    return $MAP{$name};
}

sub get_or_create {
    my($class, $name) = @_;
    return $MAP{$name} //= WebIDL::Type->new(
        name          => $name,
    );
}

sub alias {
    my($class, $existing, $new) = @_;

    if (exists $MAP{$new}) {
        warnings::warnif(misc => "ignore type alias $new = $existing; type $new already exists");
    }

    $MAP{$new} //= $class->get_or_create($existing);
    return;
}

sub alias_force {
    my($class, $existing, $new) = @_;
    $MAP{$new} = $class->get_or_create($existing);
    return;
}

sub alias_temp {
    my($class, $existing, $new) = @_;

    my $current = $MAP{$new};

    $class->alias_force($existing, $new);

    return Scope::Guard->new(sub {
            if (defined $current) {
                $MAP{$new} = $current;
            }
            else {
                delete $MAP{$new};
            }
        });
}

1;
