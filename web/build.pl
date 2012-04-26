#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Fatal          qw(open close);
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));

my $root = ROOT;
my $template_dir = "$root/template";

process("$root/template/index.tmpl", "$root/index.html");

sub make_list {
    my($prefix) = @_;
    return join "",
        qq{<li class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$prefix/$_">$_</a></li>\n} }
        map { basename($_) } glob("$root/../$prefix/*.jsx");
}

sub process {
    my($src, $dest) = @_;

    my $template = do {
        open my($fh), '<', $src;
        local $/;
        <$fh>;
    };

    # listing tests
    my $run = make_list("t/run");
    my $err = make_list("t/compile_error");

    (my $content = $template) =~ s{
        <!-- \s* source-list \s* -->
        (.*)
        <!-- \s* /source-list \s* -->
    }{$run$err}xmsg;

    open my($fh), '>', $dest;
    print $fh $content;
    close $fh;
}
