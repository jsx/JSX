#!/usr/bin/perl

=pod

build try/ directry for the web site

    try/
        t/          (jsx/t/)
        lib/        (jsx/lib/)
        example/    (jsx/web/example)
        assets/     (jsx/web/assets/)
        example/    (jsx/web/source-map/)
        source-map/ (jsx/web/source-map/)

=cut

use 5.10.0;
use strict;
use warnings;
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT."/extlib/lib/perl5";

use File::Path     qw(rmtree mkpath);
use File::Copy     qw(move copy);
use Fatal          qw(open close);
use File::Find     qw(find);
use File::stat     qw(stat);
use String::ShellQuote qw(shell_quote);
use JSON::PP qw();
use Time::HiRes qw();

my $clean = (grep { $_ eq "--clean" } @ARGV); # clean build

my $root = ROOT;
my $project_root = "$root/..";
my $dest_root    = "$project_root/try";
my $dest_src     = "$dest_root/src";
my $dest_build   = "$dest_root/build";

{
    my $t0 = [Time::HiRes::gettimeofday()];

    if($clean) {
        info('clean build');
        rmtree("$dest_root~") if -e "$dest_root~";

        rename $dest_root => "$dest_root~";
    }

    mkpath($_) for $dest_src, $dest_build;

    process_webfront();

    copy_r("$root/assets",  "$dest_root/assets");
    copy_r("$root/example", "$dest_root/example");

    copy_r("$project_root/t", "$dest_root/t");
    copy_r("$project_root/lib", "$dest_root/lib");

    process_page("$root/index.html", "$dest_root/index.html");

    process_jsx($dest_src, "$dest_build/jsx-compiler.js");

    process_source_map("$root/source-map", "$dest_root/source-map");

# process_tree must be called at the end of processes
    process_tree([$dest_root], "$dest_root/tree.generated.json");

    info(sprintf "done, elapsed %.03f sec.", Time::HiRes::tv_interval($t0));
}

sub info {
    say "[I] ", join " ", @_;
}

sub make_list {
    my($prefix) = @_;
    my $id = $prefix;
    $id =~ s/\W/-/g;

    return join "",
        qq{<li id="$id" class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$prefix/$_" data-path="$prefix/$_">$_</a></li>\n} }
        map { basename($_) } glob("$root/../$prefix/*.jsx");
}

sub process_page {
    my($src, $dest) = @_;

    info "process_page: $dest";

    my $template = do {
        open my($fh), '<', $src;
        local $/;
        <$fh>;
    };

    # listing tests
    my $run = make_list("t/run");
    my $lib = make_list("t/lib");
    my $err = make_list("t/compile_error");

    (my $content = $template) =~ s{
        <!-- \s* source-list \s* -->
        (.*)
        <!-- \s* /source-list \s* -->
    }{$run$lib$err}xmsg;

    open my($fh), '>', $dest;
    print $fh $content;
    close $fh;
}

sub process_webfront {
    my $cmd = "$project_root/bin/jsx --output $root/assets/js/jsx-web-front.jsx.js "
        . "$root/src/jsx-web-front.jsx";
    system($cmd) == 0 or die "Failed to compile: $cmd\n";
}

sub process_jsx {
    my($src, $dest) = @_;

    info "process_jsx: $dest";

    copy_r("$project_root/src", $dest_src);
    copy_r("$root/src", $dest_src);

    my $cmd = "$project_root/bin/jsx $root/src/jsx-web-compiler.jsx"
        . " > "
        . shell_quote($dest);

    system($cmd) == 0 or die "Failed to build jsx-compiler.js: $cmd\n";
}

sub process_tree {
    my($src, $dest) = @_;

    info "process_tree: $dest";

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

sub process_source_map {
    my($src, $dest) = @_;

    info "process_source_map: $dest";

    mkpath($dest);

    copy_r($src, $dest);

    my $old_cwd = Cwd::cwd();
    chdir "$project_root/example";
    foreach my $jsx_file(glob("*.jsx")) {
        next if not modified($jsx_file, "$dest/$jsx_file");

        my $t0 = [Time::HiRes::gettimeofday()];
        system("node", "$root/../bin/jsx",
            "--executable", "web",
            "--enable-source-map",
            "--output", "$jsx_file.js",
            $jsx_file) == 0 or die;

        move($jsx_file . ".js", $dest);
        move($jsx_file . ".js.mapping", $dest);

        copy($jsx_file, "$dest/$jsx_file");
        my $st = stat($jsx_file);
        utime $st->atime, $st->mtime, "$dest/$jsx_file";

        my $elapsed =  sprintf '%.03f', Time::HiRes::tv_interval($t0);
        info "compile $jsx_file with --enable-source-map ($elapsed sec.)";
    }
    chdir $old_cwd;
}

sub modified {
    my($src, $dest) = @_;
    my $s = stat($src);
    my $d = stat($dest);

    if($s && $d) {
        return ! ($s->mtime == $d->mtime && $s->size == $d->size);
    }
    else {
        return 1;
    }
}

sub copy_r {
    my($src, $dest) = @_;

    mkpath($dest);

    my $prefix = qr/\A \Q$src\E /xms;

    find {
        no_chdir => 1,
        wanted   => sub {
            return if /~$/;
            return if /\.swp$/;

            my $d = $_;
            $d =~ s/$prefix/$dest/xms;

            if(-d $_) {
                mkdir $d;
                return;
            }

            if(modified($_, $d)) {
                copy($_, $d);
                my $st = stat($_);
                utime $st->atime, $st->mtime, $d;
            }
        },
    }, $src;

}
# vim: set expandtab:
