# modified for NanoA by kazuho, some modified by tokuhirom
# based on Mojo::Template. Copyright (C) 2008, Sebastian Riedel.

package Text::MicroTemplate;

require Exporter;

use strict;
use warnings;
use constant DEBUG => $ENV{MICRO_TEMPLATE_DEBUG} || 0;
use 5.00800;

use Carp 'croak';
use Scalar::Util;

our $VERSION = '0.20';
our @ISA = qw(Exporter);
our @EXPORT_OK = qw(encoded_string build_mt render_mt);
our %EXPORT_TAGS = (
    all => [ @EXPORT_OK ],
);
our $_mt_setter = '';

sub new {
    my $class = shift;
    my $self = bless {
        code                => undef,
        comment_mark        => '#',
        expression_mark     => '=',
        line_start          => '?',
        template            => undef,
        tree                => [],
        tag_start           => '<?',
        tag_end             => '?>',
        escape_func         => \&_inline_escape_html,
        package_name        => undef, # defaults to caller
        @_ == 1 ? ref($_[0]) ? %{$_[0]} : (template => $_[0]) : @_,
    }, $class;
    if (defined $self->{template}) {
        $self->parse($self->{template});
    }
    unless (defined $self->{package_name}) {
        $self->{package_name} = 'main';
        my $i = 0;
        while (my $c = caller(++$i)) {
            if ($c !~ /^Text::MicroTemplate\b/) {
                $self->{package_name} = $c;
                last;
            }
        }
    }
    $self;
}

sub escape_func {
    my $self = shift;
    if (@_) {
        $self->{escape_func} = shift;
    }
    $self->{escape_func};
}

sub package_name {
    my $self = shift;
    if (@_) {
        $self->{package_name} = shift;
    }
    $self->{package_name};
}

sub template { shift->{template} }

sub code {
    my $self = shift;
    unless (defined $self->{code}) {
        $self->_build();
    }
    $self->{code};
}

sub _build {
    my $self = shift;
    
    my $escape_func = $self->{escape_func} || '';

    my $embed_escape_func = ref($escape_func) eq 'CODE'
        ? $escape_func
        : sub{ $escape_func . "(@_)" };

    # Compile
    my @lines;
    my $last_was_code;
    my $last_text;
    for my $line (@{$self->{tree}}) {

        # New line
        push @lines, '';
        for (my $j = 0; $j < @{$line}; $j += 2) {
            my $type  = $line->[$j];
            my $value = $line->[$j + 1];

            if ($type ne 'text' && defined $last_text) {
                # do not mess the start of current line, since it might be
                # the start of "=pod", etc.
                $lines[
                    $j == 0 && @lines >= 2 ? -2 : -1
                ] .= "\$_MT .=\"$last_text\";";
                undef $last_text;
            }
            
            # Need to fix line ending?
            my $newline = chomp $value;

            # add semicolon to last line of code
            if ($last_was_code && $type ne 'code') {
                $lines[-1] .= ';';
                undef $last_was_code;
            }

            # Text
            if ($type eq 'text') {

                # Quote and fix line ending
                $value = quotemeta($value);
                $value .= '\n' if $newline;

                $last_text = defined $last_text ? "$last_text$value" : $value;
            }

            # Code
            if ($type eq 'code') {
                $lines[-1] .= $value;
                $last_was_code = 1;
            }

            # Expression
            if ($type eq 'expr') {
                my $escaped = $embed_escape_func->('$_MT_T');
                $lines[-1] .= "\$_MT_T = $value;\$_MT .= ref \$_MT_T eq 'Text::MicroTemplate::EncodedString' ? \$\$_MT_T : $escaped; \$_MT_T = '';";
            }
        }
    }

    # add semicolon to last line of code
    if ($last_was_code) {
        $lines[-1] .= "\n;";
    }
    # add last text line(s)
    if (defined $last_text) {
        $lines[-1] .= "\$_MT .=\"$last_text\";";
    }
    
    # Wrap
    $lines[0]   = q/sub { my $_MT = ''; local $/ . $self->{package_name} . q/::_MTREF = \$_MT; my $_MT_T = '';/ . (@lines ? $lines[0] : '');
    $lines[-1] .= q/return $_MT; }/;

    $self->{code} = join "\n", @lines;
    return $self;
}

# I am so smart! I am so smart! S-M-R-T! I mean S-M-A-R-T...
sub parse {
    my ($self, $tmpl) = @_;
    $self->{template} = $tmpl;

    # Clean start
    delete $self->{tree};
    delete $self->{code};

    # Tags
    my $line_start    = quotemeta $self->{line_start};
    my $tag_start     = quotemeta $self->{tag_start};
    my $tag_end       = quotemeta $self->{tag_end};
    my $cmnt_mark     = quotemeta $self->{comment_mark};
    my $expr_mark     = quotemeta $self->{expression_mark};

    # Tokenize
    my $state = 'text';
    my $multiline_expression = 0;
    my @lines = split /(\n)/, $tmpl;
    while (@lines) {
        my $line = shift @lines;
        my $newline = undef;
        if (@lines) {
            shift @lines;
            $newline = 1;
        }
        
        # Perl line without return value
        if ($line =~ /^$line_start\s+(.*)$/) {
            push @{$self->{tree}}, ['code', $1];
            $multiline_expression = 0;
            next;
        }

        # Perl line with return value
        if ($line =~ /^$line_start$expr_mark\s+(.+)$/) {
            push @{$self->{tree}}, [
                'expr', $1,
                $newline ? ('text', "\n") : (),
            ];
            $multiline_expression = 0;
            next;
        }

        # Comment line, dummy token needed for line count
        if ($line =~ /^$line_start$cmnt_mark/) {
            push @{$self->{tree}}, [];
            $multiline_expression = 0;
            next;
        }

        # Escaped line ending?
        if ($line =~ /(\\+)$/) {
            my $length = length $1;

            # Newline escaped
            if ($length == 1) {
                $line =~ s/\\$//;
            }

            # Backslash escaped
            if ($length >= 2) {
                $line =~ s/\\\\$/\\/;
                $line .= "\n";
            }
        }

        # Normal line ending
        else { $line .= "\n" if $newline }

        # Mixed line
        my @token;
        for my $token (split /
            (
                $tag_start$expr_mark     # Expression
            |
                $tag_start$cmnt_mark     # Comment
            |
                $tag_start               # Code
            |
                $tag_end                 # End
            )
        /x, $line) {

            # Garbage
            next if $token eq '';

            # End
            if ($token =~ /^$tag_end$/) {
                $state = 'text';
                $multiline_expression = 0;
            }

            # Code
            elsif ($token =~ /^$tag_start$/) { $state = 'code' }

            # Comment
            elsif ($token =~ /^$tag_start$cmnt_mark$/) { $state = 'cmnt' }

            # Expression
            elsif ($token =~ /^$tag_start$expr_mark$/) {
                $state = 'expr';
            }

            # Value
            else {

                # Comments are ignored
                next if $state eq 'cmnt';

                # Multiline expressions are a bit complicated,
                # only the first line can be compiled as 'expr'
                $state = 'code' if $multiline_expression;
                $multiline_expression = 1
                    if $state eq 'expr';

                # Store value
                push @token, $state, $token;
            }
        }
        push @{$self->{tree}}, \@token;
    }
    
    return $self;
}

sub _context {
    my ($self, $text, $line) = @_;
    my @lines  = split /\n/, $text;
    
    join '', map {
        0 < $_ && $_ <= @lines ? sprintf("%4d: %s\n", $_, $lines[$_ - 1]) : ''
    } ($line - 2) .. ($line + 2);
}

# Debug goodness
sub _error {
    my ($self, $error, $line_offset, $from) = @_;
    
    # Line
    if ($error =~ /^(.*)\s+at\s+\(eval\s+\d+\)\s+line\s+(\d+)/) {
        my $reason = $1;
        my $line   = $2 - $line_offset;
        my $delim  = '-' x 76;
        
        my $report = "$reason at line $line in template passed from $from.\n";
        my $template = $self->_context($self->{template}, $line);
        $report .= "$delim\n$template$delim\n";

        # Advanced debugging
        if (DEBUG) {
            my $code = $self->_context($self->code, $line);
            $report .= "$code$delim\n";
            $report .= $error;
        }

        return $report;
    }

    # No line found
    return "Template error: $error";
}

# create raw string (that does not need to be escaped)
sub encoded_string {
    Text::MicroTemplate::EncodedString->new($_[0]);
}


sub _inline_escape_html{
    my($variable) = @_;

    my $source = qq{
        do{
            $variable =~ s/([&><"'])/\$Text::MicroTemplate::_escape_table{\$1}/ge;
            $variable;
        }
    }; #" for poor editors
    $source =~ s/\n//g; # to keep line numbers
    return $source;
}

our %_escape_table = ( '&' => '&amp;', '>' => '&gt;', '<' => '&lt;', q{"} => '&quot;', q{'} => '&#39;' );
sub escape_html {
    my $str = shift;
    return ''
        unless defined $str;
    return $str->as_string
        if ref $str eq 'Text::MicroTemplate::EncodedString';
    $str =~ s/([&><"'])/$_escape_table{$1}/ge; #' for poor editors
    return $str;
}

sub build_mt {
    my $mt = Text::MicroTemplate->new(@_);
    $mt->build();
}

sub build {
    my $_mt = shift;
    Scalar::Util::weaken($_mt) if $_mt_setter;
    my $_code = $_mt->code;
    my $_from = sub {
        my $i = 0;
        while (my @c = caller(++$i)) {
            return "$c[1] at line $c[2]"
                if $c[0] ne __PACKAGE__;
        }
        '';
    }->();
    my $expr = << "...";
package $_mt->{package_name};
sub {
    ${_mt_setter}local \$SIG{__WARN__} = sub { print STDERR \$_mt->_error(shift, 4, \$_from) };
    Text::MicroTemplate::encoded_string((
        $_code
    )->(\@_));
}
...

    if(DEBUG >= 2){
        DEBUG >= 3 ? die $expr : warn $expr;
    }

    my $die_msg;
    {
        local $@;
        if (my $_builder = eval($expr)) {
            return $_builder;
        }
        $die_msg = $_mt->_error($@, 4, $_from);
    }
    die $die_msg;
}

sub render_mt {
    my $builder = build_mt(shift);
    $builder->(@_);
}

# ? $_mt->filter(sub { s/\s+//smg; s/[\r\n]//g; })->(sub { ... ? });
sub filter {
    my ($self, $callback) = @_;
    my $mtref = do {
        no strict 'refs';
        ${"$self->{package_name}::_MTREF"};
    };
    my $before = $$mtref;
    $$mtref = '';
    return sub {
        my $inner_func = shift;
        $inner_func->(@_);

        ## sub { s/foo/bar/g } is a valid filter
        ## sub { DateTime::Format::Foo->parse_string(shift) } is valid too
        local $_ = $$mtref;
        my $retval = $callback->($$mtref);
        no warnings 'uninitialized';
        if (($retval =~ /^\d+$/ and $_ ne $$mtref) or (defined $retval and !$retval)) {
            $$mtref = $before . $_;
        } else {
            $$mtref = $before . $retval;
        }
    }
}

package Text::MicroTemplate::EncodedString;

use strict;
use warnings;

use overload q{""} => sub { shift->as_string }, fallback => 1;

sub new {
    my ($klass, $str) = @_;
    bless \$str, $klass;
}

sub as_string {
    my $self = shift;
    $$self;
}

1;
__END__

=head1 NAME

Text::MicroTemplate - Micro template engine with Perl5 language

=head1 SYNOPSIS

    use Text::MicroTemplate qw(:all);

    # compile template, and render
    $renderer = build_mt('hello, <?= $_[0] ?>');
    $html = $renderer->('John')->as_string;

    # or in one line
    $html = render_mt('hello, <?= $_[0] ?>', 'John')->as_string;

    # complex form
    $mt = Text::MicroTemplate->new(
        template => 'hello, <?= $query->param('user') ?>',
    );
    $code = $mt->code;
    $renderer = eval << "..." or die $@;
    sub {
        my \$query = shift;
        $code->();
    }
    ...
    $html = $renderer->(CGI->new)->as_string;

=head1 DESCRIPTION

Text::MicroTemplate is a standalone, fast, intelligent, extensible template engine with following features.

=head2 standalone

Text::MicroTemplate does not rely on other CPAN modules.

=head2 fast

Based on L<Mojo::Template>, expressions in the template is perl code.

=head2 intelligent

Text::MicroTemplate automatically escapes variables when and only when necessary.

=head2 extensible

Text::MicroTemplate does not provide features like template cache or including other files by itself.  However, it is easy to add you own (that suites the most to your application), by wrapping the result of the module (which is a perl expression).

The module only provides basic building blocks for a template engine.  Refer to L<Text::MicroTemplate::File> for higher-level interface.

=head1 TEMPLATE SYNTAX

The template language is Perl5 itself!

    # output the result of expression with automatic escape
    <?= $expr ?>             (tag style)
    ?= $expr                 (per-line)

    # execute perl code (tag style)
    <? foo() ?>
    ? foo()

    # comment (tag style)
    <?# comment ?>
    ?# comment

    # loops
    <ul>
    ? for my $item (@list) {
    <li><?= $item ?></li>
    ? }
    </ul>

=head1 EXPORTABLE FUNCTIONS

=head2 build_mt($template)

Returns a subref that renders given template.  Parameters are equivalent to Text::MicroTemplate->new.

    # build template renderer at startup time and use it multiple times
    my $renderer = build_mt('hello, <?= $_[0] ?>!');

    sub run {
        ...
        my $hello = $renderer->($query->param('user'));
        ...
    }

=head2 render_mt($template, @args)

Utility function that combines build_mt and call to the generated template builder.

    # render
    $hello = render_mt('hello, <?= $_[0] ?>!', 'John');

    # print as HTML
    print $hello->as_string;

    # use the result in another template (no double-escapes)
    $enc = render_mt('<h1><?= $_[0] ?></h1>', $hello);

Intertally, the function is equivalent to:

    build_mt($template)->(@_);

=head2 encoded_string($str)

wraps given string to an object that will not be escaped by the template engine

=head1 OO-STYLE INTERFACE

Text::MicroTemplate provides OO-style interface to handle more complex cases.

=head2 new($template)

=head2 new(%args)

=head2 new(\%args)

Constructs template renderer.  In the second or third form, parameters below are recognized.

=head3 template

template string (mandatory)

=head3 escape_func

escape function (defaults to L<Text::MicroTemplate::escape_html>), no escape when set to undef

=head3 package_name

package under where the renderer is compiled (defaults to caller package)

=head2 code()

returns perl code that renders the template when evaluated

=head2 filter(sub filter_func { ... })->(sub { template lines })

filters given template lines

    ? $_mt->filter(sub { s/Hello/Good bye/g })->(sub {
    Hello, John!
    ? })

=head1 DEBUG

The C<MICRO_TEMPLATE_DEBUG> environment variable helps debugging.
The value C<1> extends debugging messages, C<2> reports compiled
Perl code with C<warn()>, C<3> is like C<2> but uses C<die()>.

=head1 SEE ALSO

L<Text::MicroTemplate::File>

L<Text::MicroTemplate::Extended>

=head1 AUTHOR

Kazuho Oku E<lt>kazuhooku gmail.comE<gt>

Tokuhiro Matsuno E<lt>tokuhirom AAJKLFJEF GMAIL COME<gt>

The module is based on L<Mojo::Template> by Sebastian Riedel.

=head1 LICENSE

This program is free software, you can redistribute it and/or modify it under the same terms as Perl itself.

=cut
