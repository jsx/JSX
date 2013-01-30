package Test::Script;

=pod

=head1 NAME

Test::Script - Basic cross-platform tests for scripts

=head1 DESCRIPTION

The intent of this module is to provide a series of basic tests for 80%
of the testing you will need to do for scripts in the F<script> (or F<bin>
as is also commonly used) paths of your Perl distribution.

Further, it aims to provide this functionality with perfect
platform-compatibility, and in a way that is as unobtrusive as possible.

That is, if the program works on a platform, then B<Test::Script>
should always work on that platform as well. Anything less than 100% is
considered unacceptable.

In doing so, it is hoped that B<Test::Script> can become a module that
you can safely make a dependency of all your modules, without risking that
your module won't on some platform because of the dependency.

Where a clash exists between wanting more functionality and maintaining
platform safety, this module will err on the side of platform safety.

=head1 FUNCTIONS

=cut

use 5.005;
use strict;
use Carp             ();
use Exporter         ();
use File::Spec       ();
use File::Spec::Unix ();
use Probe::Perl      ();
use IPC::Run3        ();
use Test::Builder    ();

use vars qw{$VERSION @ISA @EXPORT};
BEGIN {
	$VERSION = '1.07';
	@ISA     = 'Exporter';
	@EXPORT  = qw{
		script_compiles
		script_compiles_ok
		script_runs
	};
}

sub import {
	my $self = shift;
	my $pack = caller;
	my $test = Test::Builder->new;
	$test->exported_to($pack);
	$test->plan(@_);
	foreach ( @EXPORT ) {
		$self->export_to_level(1, $self, $_);
	}
}

my $perl = undef;

sub perl () {
	$perl or
	$perl = Probe::Perl->find_perl_interpreter;
}

sub path ($) {
	my $path = shift;
	unless ( defined $path ) {
		Carp::croak("Did not provide a script name");
	}
	if ( File::Spec::Unix->file_name_is_absolute($path) ) {
		Carp::croak("Script name must be relative");
	}
	File::Spec->catfile(
		File::Spec->curdir,
		split /\//, $path
	);
}





#####################################################################
# Test Functions

=pod

=head2 script_compiles

    script_compiles( 'script/foo.pl', 'Main script compiles' );

The C<script_compiles> test calls the script with "perl -c script.pl",
and checks that it returns without error.

The path it should be passed is a relative unix-format script name. This
will be localised when running C<perl -c> and if the test fails the local
name used will be shown in the diagnostic output.

Note also that the test will be run with the same L<perl> interpreter that
is running the test script (and not with the default system perl). This
will also be shown in the diagnostic output on failure.

=cut

sub script_compiles {
	my $args   = _script(shift);
	my $unix   = shift @$args;
	my $path   = path( $unix );
	my $cmd    = [ perl, '-Mblib', '-c', $path, @$args ];
	my $stdin  = '';
	my $stdout = '';
	my $stderr = '';
	my $rv     = IPC::Run3::run3( $cmd, \$stdin, \$stdout, \$stderr );
	my $exit   = $? ? ($? >> 8) : 0;
	my $ok     = !! (
		$rv and $exit == 0 and $stderr =~ /syntax OK\s+\z/si
	);

	my $test = Test::Builder->new;
	$test->ok( $ok, $_[0] || "Script $unix compiles" );
	$test->diag( "$exit - $stderr" ) unless $ok;

	return $ok;
}

=pod

=head2 script_runs

    script_runs( 'script/foo.pl', 'Main script runs' );

The C<script_runs> test executes the script with "perl script.pl" and checks
that it returns success.

The path it should be passed is a relative unix-format script name. This
will be localised when running C<perl -c> and if the test fails the local
name used will be shown in the diagnostic output.

The test will be run with the same L<perl> interpreter that is running the
test script (and not with the default system perl). This will also be shown
in the diagnostic output on failure.

=cut

sub script_runs {
	my $args   = _script(shift);
	my $unix   = shift @$args;
	my $path   = path( $unix );
	my $cmd    = [ perl, '-Mblib', $path, @$args ];
	my $stdin  = '';
	my $stdout = '';
	my $stderr = '';
	my $rv     = IPC::Run3::run3( $cmd, \$stdin, \$stdout, \$stderr );
	my $exit   = $? ? ($? >> 8) : 0;
	my $ok     = !! ( $rv and $exit == 0 );

	my $test = Test::Builder->new;
	$test->ok( $ok, $_[0] || "Script $unix runs" );
	$test->diag( "$exit - $stderr" ) unless $ok;

	return $ok;
}





######################################################################
# Support Functions

# Script params must be either a simple non-null string with the script
# name, or an array reference with one or more non-null strings.
sub _script {
	my $in = shift;
	if ( defined _STRING($in) ) {
		return [ $in ];
	}
	if ( _ARRAY($in) ) {
		unless ( scalar grep { not defined _STRING($_) } @$in ) {
			return $in;			
		}
	}
	Carp::croak("Invalid command parameter");
}

# Inline some basic Params::Util functions

sub _ARRAY ($) {
	(ref $_[0] eq 'ARRAY' and @{$_[0]}) ? $_[0] : undef;
}

sub _STRING ($) {
	(defined $_[0] and ! ref $_[0] and length($_[0])) ? $_[0] : undef;
}

BEGIN {
	# Alias to old name
	*script_compiles_ok = *script_compiles;
}

1;

=pod

=head1 SUPPORT

All bugs should be filed via the bug tracker at

L<http://rt.cpan.org/NoAuth/ReportBug.html?Queue=Test-Script>

For other issues, or commercial enhancement and support, contact the author.

=head1 AUTHOR

Adam Kennedy E<lt>adamk@cpan.orgE<gt>

=head1 SEE ALSO

L<prove>, L<http://ali.as/>

=head1 COPYRIGHT

Copyright 2006 - 2009 Adam Kennedy.

This program is free software; you can redistribute
it and/or modify it under the same terms as Perl itself.

The full text of the license can be found in the
LICENSE file included with this module.

=cut
