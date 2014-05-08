package Text::MicroTemplate::File;

use strict;
use warnings;
use File::Spec;
use Text::MicroTemplate;

use Carp qw(croak);

our @ISA = qw(Text::MicroTemplate);

sub new {
    my $klass = shift;
    my $self = $klass->SUPER::new(@_);
    $self->{include_path} ||= [ '.' ];
    unless (defined $self->{open_layer}) {
        $self->{open_layer} = ':utf8';
    }
    unless (ref $self->{include_path}) {
        $self->{include_path} = [ $self->{include_path} ];
    }
    $self->{use_cache} ||= 0;
    $self->{cache} = {};  # file => { mtime, sub }
    $self;
}

sub include_path {
    my $self = shift;
    croak "This is readonly accessor" if @_;
    $self->{include_path};
}

sub open_layer {
    my $self = shift;
    $self->{open_layer} = $_[0]
        if @_;
    $self->{open_layer};
}

sub use_cache {
    my $self = shift;
    $self->{use_cache} = $_[0]
        if @_;
    $self->{use_cache};
}

sub build_file {
    my ($self, $file) = @_;
    # return cached entry
    if ($self->{use_cache} == 2) {
        if (my $e = $self->{cache}->{$file}) {
            return $e->[1];
        }
    }
    # setup ($filepath, @st)
    my ($filepath, @st);
    if (File::Spec->file_name_is_absolute($file)) {
        # absolute path
        $filepath = $file;
        @st = stat $filepath;
    } else {
        # relative path, search "include_path"s
        foreach my $path (@{$self->{include_path}}) {
            $filepath = $path . '/' . $file;
            @st = stat $filepath
                and last;
        }
    }
    croak "could not find template file: $file (include_path: @{$self->{include_path}})"
        unless @st;
    
    # return cached entry after comparing mtime
    if (my $e = $self->{cache}->{$file}) {
        return $e->[1]
            if $st[9] == $e->[0]; # compare mtime
    }

    # read the file, parse, build, cache the entry if necessary, and return
    open my $fh, "<$self->{open_layer}", $filepath
        or croak "failed to open:$filepath:$!";
    my $src = do { local $/; <$fh> };
    close $fh;
    $self->parse($src);
    local $Text::MicroTemplate::_mt_setter = 'my $_mt = shift;';
    my $f = $self->build();
    $self->{cache}->{$file} = [
        $st[9], # mtime
        $f,
    ] if $self->{use_cache};
    return $f;
}

sub render_file {
    my $self = shift;
    my $file = shift;
    $self->build_file($file)->($self, @_);
}

sub wrapper_file {
    my $self = shift;
    my $file = shift;
    my @args = @_;
    my $mtref = do {
        no strict 'refs';
        ${"$self->{package_name}::_MTREF"};
    };
    my $before = $$mtref;
    $$mtref = '';
    return sub {
        my $inner_func = shift;
        $inner_func->(@_);
        $$mtref =
            $before . $self->render_file($file, Text::MicroTemplate::encoded_string($$mtref), @args)->as_string;
    }
}

1;
__END__

=head1 NAME

Text::MicroTemplate::File - a file-based template manager

=head1 SYNOPSIS

    use Text::MicroTemplate::File;

    our $mtf = Text::MicroTemplate::File->new(
        include_path => [ $path1, $path2, ... ],
        use_cache    => 1,
    );

    # render
    $mtf->render_file('template.file', $arg1, $arg2, ...);

=head1 DESCRIPTION

Text::MicroTemplate::File is a file-based template manager for L<Text::MicroTemplate>.

=head1 PROPERTIES

Text::MicroTemplate provides OO-style interface with following properties.

=head2 include_path

include path (default: ['.'])

This accessor is readonly.

=head2 use_cache

cache mode (0: no cache (default), 1: cache with update check, 2: cache but do not check updates)

=head2 open_layer

layer passed to L<open> (default: ":utf8")

=head2 package_name

package under where template files are compiled (default: "main")

=head1 METHODS

=head2 build_file($file)

Returns a subref that renders given template file.

=head2 render_file($file, @args)

Renders the template file with given arguments.

=head2 wrapper_file($file, @args)->(sub { template lines })

Wraps given template with wrapper file.  Internally the processed template is passed as $_[0] to the wrapper template.

=head1 SEE ALSO

L<Text::MicroTemplate>

=head1 AUTHOR

Kazuho Oku E<lt>kazuhooku gmail.comE<gt>

=head1 LICENSE

This program is free software, you can redistribute it and/or modify it under the same terms as Perl 5.10.

=cut
