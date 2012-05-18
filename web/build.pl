#!/usr/bin/perl
use 5.10.0;
use strict;
use warnings;
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT . "/extlib/lib/perl5";

use Fatal          qw(open close);
use File::Find     qw(find);
use String::ShellQuote qw(shell_quote);
use JSON::PP qw();

my $root = ROOT;
my $template_dir = "$root/template";

process_top_page("$root/template/index.tmpl", "$root/index.html");
process_jsx("$root/../src", "$root/jsx.combined.js");
process_tree(["$root/../example", "$root/../lib", "$root/../src", "$root/../t"], "$root/tree.generated.json");

sub make_list {
    my($prefix) = @_;
    return join "",
        qq{<li class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$prefix/$_" data-path="$prefix/$_">$_</a></li>\n} }
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
    local $ENV{PATH} = "node_modules/browserbuild/bin"
                       . ":" . $ENV{PATH};

    my @files = glob("$src/*.js");
    my $cmd = "browserbuild --main web-interface --global jsx --basepath '$src/' "
        . join(' ', map { shell_quote($_) } @files)
        . " > "
        . shell_quote($dest);

    system($cmd) == 0 or die "Failed to build jsx-web.js: $cmd\n";
}

sub process_tree {
    my($src, $dest) = @_;

    my %tree;
    find {
        no_chdir => 1,
        wanted   => sub {
            return if /~$/;
            return if /\.swp$/;
            return if -d $_;

            my $f = $_;
            $f =~ s{\\}{/}g;
            $f =~ s{^\Q$root/..}{};

            my @parts = split(qr{/}, $f);
            my $basename = pop @parts;

            return if $basename =~ /^\./;

            my $dir = \%tree;
            while(@parts) {
                my $d = shift @parts;
                $dir = $dir->{$d} //= {};
            }
            $dir->{$basename} = $f;
        },
    }, @{$src};

    open my($fh), ">", $dest;
    print $fh JSON::PP->new->utf8->pretty->encode(\%tree);
    close $fh;
}

