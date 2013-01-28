package t::util::Util;
use strict;
use warnings;

use base qw(Exporter);
our @EXPORT = qw(slurp get_section jsx);

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
