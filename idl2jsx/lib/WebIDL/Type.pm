package WebIDL::Type;
use 5.12.0;
use strict;
use warnings;
use overload
    '""' => 'as_string',
    '0+' => '_refaddr',
;

use Scalar::Util ();
use Mouse;

has name => (
    is  => 'ro',
    isa => 'Str',

    required => 1,
);

has resolved_name => (
    is => 'rw',
    isa => 'Maybe[Str]',
);


sub _refaddr {
    my($self) = @_;
    return Scalar::Util::refaddr($self);
}


sub as_string {
    my($self) = @_;

    return $self->resolved_name // sprintf "<unresolved:%s>", $self->name;
}

no Mouse;
__PACKAGE__->meta->make_immutable();
