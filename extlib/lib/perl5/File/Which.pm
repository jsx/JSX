package File::Which;

use 5.004;
use strict;
use Exporter   ();
use File::Spec ();

use vars qw{$VERSION @ISA @EXPORT @EXPORT_OK};
BEGIN {
	$VERSION   = '1.09';
	@ISA       = 'Exporter';
	@EXPORT    = 'which';
	@EXPORT_OK = 'where';
}

use constant IS_VMS => ($^O eq 'VMS');
use constant IS_MAC => ($^O eq 'MacOS');
use constant IS_DOS => ($^O eq 'MSWin32' or $^O eq 'dos' or $^O eq 'os2');

# For Win32 systems, stores the extensions used for
# executable files
# For others, the empty string is used
# because 'perl' . '' eq 'perl' => easier
my @PATHEXT = ('');
if ( IS_DOS ) {
	# WinNT. PATHEXT might be set on Cygwin, but not used.
	if ( $ENV{PATHEXT} ) {
		push @PATHEXT, split ';', $ENV{PATHEXT};
	} else {
		# Win9X or other: doesn't have PATHEXT, so needs hardcoded.
		push @PATHEXT, qw{.com .exe .bat};
	}
} elsif ( IS_VMS ) {
	push @PATHEXT, qw{.exe .com};
}

sub which {
	my ($exec) = @_;

	return undef unless $exec;

	my $all = wantarray;
	my @results = ();

	# check for aliases first
	if ( IS_VMS ) {
		my $symbol = `SHOW SYMBOL $exec`;
		chomp($symbol);
		unless ( $? ) {
			return $symbol unless $all;
			push @results, $symbol;
		}
	}
	if ( IS_MAC ) {
		my @aliases = split /\,/, $ENV{Aliases};
		foreach my $alias ( @aliases ) {
			# This has not been tested!!
			# PPT which says MPW-Perl cannot resolve `Alias $alias`,
			# let's just hope it's fixed
			if ( lc($alias) eq lc($exec) ) {
				chomp(my $file = `Alias $alias`);
				last unless $file;  # if it failed, just go on the normal way
				return $file unless $all;
				push @results, $file;
				# we can stop this loop as if it finds more aliases matching,
				# it'll just be the same result anyway
				last;
			}
		}
	}

	my @path = File::Spec->path;
	if ( IS_DOS or IS_VMS or IS_MAC ) {
		unshift @path, File::Spec->curdir;
	}

	foreach my $base ( map { File::Spec->catfile($_, $exec) } @path ) {
		for my $ext ( @PATHEXT ) {
			my $file = $base.$ext;

			# We don't want dirs (as they are -x)
			next if -d $file;

			if (
				# Executable, normal case
				-x _
				or (
					# MacOS doesn't mark as executable so we check -e
					IS_MAC
					||
					(
						IS_DOS
						and
						grep {
							$file =~ /$_\z/i
						} @PATHEXT[1..$#PATHEXT]
					)
					# DOSish systems don't pass -x on
					# non-exe/bat/com files. so we check -e.
					# However, we don't want to pass -e on files
					# that aren't in PATHEXT, like README.
					and -e _
				)
			) {
				return $file unless $all;
				push @results, $file;
			}
		}
	}

	if ( $all ) {
		return @results;
	} else {
		return undef;
	}
}

sub where {
	# force wantarray
	my @res = which($_[0]);
	return @res;
}

1;

__END__

=pod

=head1 NAME

File::Which - Portable implementation of the `which' utility

=head1 SYNOPSIS

  use File::Which;                  # exports which()
  use File::Which qw(which where);  # exports which() and where()
  
  my $exe_path = which('perldoc');
  
  my @paths = where('perl');
  - Or -
  my @paths = which('perl'); # an array forces search for all of them

=head1 DESCRIPTION

C<File::Which> was created to be able to get the paths to executable programs
on systems under which the `which' program wasn't implemented in the shell.

C<File::Which> searches the directories of the user's C<PATH> (as returned by
C<File::Spec-E<gt>path()>), looking for executable files having the name
specified as a parameter to C<which()>. Under Win32 systems, which do not have a
notion of directly executable files, but uses special extensions such as C<.exe>
and C<.bat> to identify them, C<File::Which> takes extra steps to assure that
you will find the correct file (so for example, you might be searching for
C<perl>, it'll try F<perl.exe>, F<perl.bat>, etc.)

=head1 Steps Used on Win32, DOS, OS2 and VMS

=head2 Windows NT

Windows NT has a special environment variable called C<PATHEXT>, which is used
by the shell to look for executable files. Usually, it will contain a list in
the form C<.EXE;.BAT;.COM;.JS;.VBS> etc. If C<File::Which> finds such an
environment variable, it parses the list and uses it as the different
extensions.

=head2 Windows 9x and other ancient Win/DOS/OS2

This set of operating systems don't have the C<PATHEXT> variable, and usually
you will find executable files there with the extensions C<.exe>, C<.bat> and
(less likely) C<.com>. C<File::Which> uses this hardcoded list if it's running
under Win32 but does not find a C<PATHEXT> variable.

=head2 VMS

Same case as Windows 9x: uses C<.exe> and C<.com> (in that order).

=head1 Functions

=head2 which($short_exe_name)

Exported by default.

C<$short_exe_name> is the name used in the shell to call the program (for
example, C<perl>).

If it finds an executable with the name you specified, C<which()> will return
the absolute path leading to this executable (for example, F</usr/bin/perl> or
F<C:\Perl\Bin\perl.exe>).

If it does I<not> find the executable, it returns C<undef>.

If C<which()> is called in list context, it will return I<all> the
matches.

=head2 where($short_exe_name)

Not exported by default.

Same as C<which($short_exe_name)> in array context. Same as the
C<`where'> utility, will return an array containing all the path names
matching C<$short_exe_name>.

=head1 BUGS AND CAVEATS

Not tested on VMS or MacOS, although there is platform specific code
for those. Anyone who haves a second would be very kind to send me a
report of how it went.

File::Spec adds the current directory to the front of PATH if on
Win32, VMS or MacOS. I have no knowledge of those so don't know if the
current directory is searced first or not. Could someone please tell
me?

=head1 SUPPORT

Bugs should be reported via the CPAN bug tracker at

L<http://rt.cpan.org/NoAuth/ReportBug.html?Queue=File-Which>

For other issues, contact the maintainer.

=head1 AUTHOR

Adam Kennedy E<lt>adamk@cpan.orgE<gt>

Per Einar Ellefsen E<lt>pereinar@cpan.orgE<gt>

Originated in F<modperl-2.0/lib/Apache/Build.pm>. Changed for use in DocSet
(for the mod_perl site) and Win32-awareness by me, with slight modifications
by Stas Bekman, then extracted to create C<File::Which>.

Version 0.04 had some significant platform-related changes, taken from
the Perl Power Tools C<`which'> implementation by Abigail with
enhancements from Peter Prymmer. See
L<http://www.perl.com/language/ppt/src/which/index.html> for more
information.

=head1 COPYRIGHT

Copyright 2002 Per Einar Ellefsen.

Some parts copyright 2009 Adam Kennedy.

This program is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=head1 SEE ALSO

L<File::Spec>, L<which(1)>, Perl Power Tools:
L<http://www.perl.com/language/ppt/index.html>.

=cut
