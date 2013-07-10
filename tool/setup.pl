#!/usr/bin/perl
# This script is provided for JSX core developers
use strict;
use warnings;
use File::Basename qw(dirname);
use Cwd            qw(abs_path);
use constant DIR => abs_path(dirname(__FILE__)) . "/..";
use lib DIR . "/extlib/lib/perl5";

my @modules = qw(
    String::ShellQuote
    HTTP::Tiny
    JSON
    Test::TCP
    Proc::Guard
    Data::Difflet
    File::Which
    App::Prove
    Test::More
);

my $dir= DIR;
my $cpanm = 'http://cpanmin.us/';

if (not -e "$dir/extlib/bin/cpanm") {
    system(qq{curl -L $cpanm > "$dir/extlib/bin/cpanm"});
}

system("$^X $dir/extlib/bin/cpanm --pp --no-man-pages --notest '-L$dir/extlib' @modules") == 0
    or die "Failed to setup!";

