package tool::Util;
use strict;
use warnings;
use warnings FATAL => qw(uninitialized);
use Fatal qw(open close);

use File::Basename ();
use lib File::Basename::dirname(__FILE__) . "/../extlib/lib/perl5";


use base qw(Exporter);
our @EXPORT = qw(slurp get_section jsx numify_version xsystem);

use Cwd ();
$ENV{JSX_HOME} = Cwd::getcwd() . '/.jsx';

sub xsystem { # system() which returns (status code, stdout, stderr)
    my(@args) = @_;
    require IPC::Open3;
    require Symbol;
    my($wtr, $rdr, $err) = (Symbol::gensym(), Symbol::gensym(), Symbol::gensym());
    my $pid = IPC::Open3::open3($wtr, $rdr, $err, @args);
    close $wtr;
    local $/;
    my $stdout = <$rdr>;
    my $stderr = <$err>;
    close $rdr;
    close $err;
    waitpid $pid, 0;

    return ($? == 0, $stdout, $stderr);
}

sub jsx { # returns (status, stdout, stderr)
    my(@args) = @_;

    require IPC::Open3;
    require Symbol;
    my($wtr, $rdr, $err) = (Symbol::gensym(), Symbol::gensym(), Symbol::gensym());
    my $pid = IPC::Open3::open3($wtr, $rdr, $err, "bin/jsx @args");
    close $wtr;
    local $/;
    my $stdout = <$rdr>;
    my $stderr = <$err>;
    close $rdr;
    close $err;
    waitpid $pid, 0;

    return ($? == 0, $stdout, $stderr);
}

sub slurp {
    my($file) = @_;
    open my $fh, "<", $file
        or die "failed to open $file:$!";
    local $/;
    return <$fh>;
}


sub get_section {
    my ($file, $name) = @_;
    my $content = slurp($file);
    my($expected) = $content =~ m{/\*$name\n(|.*?\n)\*/}s;
    return $expected;
}

sub numify_version {
    my($v) = @_;
    $v =~ s/^v//;
    my($vnum, @others) = split /\./, $v;

    for (my $i = 0; $i < @others; ++$i) {
        $vnum += $others[$i] / (10 ** (3*($i+1)));
    }
    return $vnum;
}

1;
# vim: set expandtab:
