# $Id: ShellQuote.pm,v 1.11 2010-06-11 20:08:57 roderick Exp $
#
# Copyright (c) 1997 Roderick Schertler.  All rights reserved.  This
# program is free software; you can redistribute it and/or modify it
# under the same terms as Perl itself.

=head1 NAME

String::ShellQuote - quote strings for passing through the shell

=head1 SYNOPSIS

    $string = shell_quote @list;
    $string = shell_quote_best_effort @list;
    $string = shell_comment_quote $string;

=head1 DESCRIPTION

This module contains some functions which are useful for quoting strings
which are going to pass through the shell or a shell-like object.

=over

=cut

package String::ShellQuote;

use strict;
use vars qw($VERSION @ISA @EXPORT);

require Exporter;

$VERSION	= '1.04';
@ISA		= qw(Exporter);
@EXPORT		= qw(shell_quote shell_quote_best_effort shell_comment_quote);

sub croak {
    require Carp;
    goto &Carp::croak;
}

sub _shell_quote_backend {
    my @in = @_;
    my @err = ();

    if (0) {
	require RS::Handy;
	print RS::Handy::data_dump(\@in);
    }

    return \@err, '' unless @in;

    my $ret = '';
    my $saw_non_equal = 0;
    foreach (@in) {
	if (!defined $_ or $_ eq '') {
	    $_ = "''";
	    next;
	}

	if (s/\x00//g) {
	    push @err, "No way to quote string containing null (\\000) bytes";
	}

    	my $escape = 0;

	# = needs quoting when it's the first element (or part of a
	# series of such elements), as in command position it's a
	# program-local environment setting

	if (/=/) {
	    if (!$saw_non_equal) {
	    	$escape = 1;
	    }
	}
	else {
	    $saw_non_equal = 1;
	}

	if (m|[^\w!%+,\-./:=@^]|) {
	    $escape = 1;
	}

	if ($escape
		|| (!$saw_non_equal && /=/)) {

	    # ' -> '\''
    	    s/'/'\\''/g;

	    # make multiple ' in a row look simpler
	    # '\'''\'''\'' -> '"'''"'
    	    s|((?:'\\''){2,})|q{'"} . (q{'} x (length($1) / 4)) . q{"'}|ge;

	    $_ = "'$_'";
	    s/^''//;
	    s/''$//;
	}
    }
    continue {
	$ret .= "$_ ";
    }

    chop $ret;
    return \@err, $ret;
}

=item B<shell_quote> [I<string>]...

B<shell_quote> quotes strings so they can be passed through the shell.
Each I<string> is quoted so that the shell will pass it along as a
single argument and without further interpretation.  If no I<string>s
are given an empty string is returned.

If any I<string> can't be safely quoted B<shell_quote> will B<croak>.

=cut

sub shell_quote {
    my ($rerr, $s) = _shell_quote_backend @_;

    if (@$rerr) {
    	my %seen;
    	@$rerr = grep { !$seen{$_}++ } @$rerr;
	my $s = join '', map { "shell_quote(): $_\n" } @$rerr;
	chomp $s;
	croak $s;
    }
    return $s;
}

=item B<shell_quote_best_effort> [I<string>]...

This is like B<shell_quote>, excpet if the string can't be safely quoted
it does the best it can and returns the result, instead of dying.

=cut

sub shell_quote_best_effort {
    my ($rerr, $s) = _shell_quote_backend @_;

    return $s;
}

=item B<shell_comment_quote> [I<string>]

B<shell_comment_quote> quotes the I<string> so that it can safely be
included in a shell-style comment (the current algorithm is that a sharp
character is placed after any newlines in the string).

This routine might be changed to accept multiple I<string> arguments
in the future.  I haven't done this yet because I'm not sure if the
I<string>s should be joined with blanks ($") or nothing ($,).  Cast
your vote today!  Be sure to justify your answer.

=cut

sub shell_comment_quote {
    return '' unless @_;
    unless (@_ == 1) {
	croak "Too many arguments to shell_comment_quote "
	    	    . "(got " . @_ . " expected 1)";
    }
    local $_ = shift;
    s/\n/\n#/g;
    return $_;
}

1;

__END__

=back

=head1 EXAMPLES

    $cmd = 'fuser 2>/dev/null ' . shell_quote @files;
    @pids = split ' ', `$cmd`;

    print CFG "# Configured by: ",
		shell_comment_quote($ENV{LOGNAME}), "\n";

=head1 BUGS

Only Bourne shell quoting is supported.  I'd like to add other shells
(particularly cmd.exe), but I'm not familiar with them.  It would be a
big help if somebody supplied the details.

=head1 AUTHOR

Roderick Schertler <F<roderick@argon.org>>

=head1 SEE ALSO

perl(1).

=cut
