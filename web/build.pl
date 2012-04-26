#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Fatal          qw(open close);
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use File::Find     qw(find);
use File::Which    qw(which);
use String::ShellQuote qw(shell_quote);
use constant ROOT => abs_path(dirname(__FILE__));


my $root = ROOT;
my $template_dir = "$root/template";

process_top_page("$root/template/index.tmpl", "$root/index.html");
process_jsx("$root/../lib", "$root/jsx.combined.js");

sub make_list {
    my($prefix) = @_;
    return join "",
        qq{<li class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$prefix/$_">$_</a></li>\n} }
        map { basename($_) } glob("$root/../$prefix/*.jsx");
}

sub process_top_page {
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

sub process_jsx {
    my($src, $dest) = @_;
    my $build = do {
        local $ENV{PATH} = "node_modules/browserbuild/bin"
                           . ":" . $ENV{PATH};
        which('browserbuild');
    } or die "Cannot find browserbuild."
       . " Please install it with `npm install`\n";

   my @files;
   find {
        no_chdir => 1,
        wanted   => sub {
            push @files, $_ if $_ =~ /\.js$/;
        },
    }, $src;
    my $cmd = "$build --main compiler --global jsx --basepath '$src/' "
        . join(' ', map { shell_quote($_) } @files)
        . " > "
        . shell_quote($dest);

    system($cmd) == 0 or die "Failed to build jsx-web.js: $cmd\n";
}
