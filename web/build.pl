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

use strict;
use warnings;
use warnings FATAL => qw(uninitialized recursion);

use tool::Util;

use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));

use File::Spec     qw();
use File::Path     qw(rmtree mkpath);
use File::Copy     qw(move copy);
use Fatal          qw(open close);
use File::Find     qw(find);
use Fcntl          qw(S_ISDIR);
use File::stat     qw(stat);
use JSON           qw();
use Time::HiRes    qw();

our $g = info("build JSX web interface");

my $clean = (grep { $_ eq "--clean" } @ARGV); # clean build

my $web_root = ROOT;

{
    my $project_root = dirname($web_root);
    my $dest_root    = "$project_root/try";
    my $dest_src     = "$dest_root/src";

    if($clean) {
        rmtree("$dest_root~") if -e "$dest_root~";
        rename $dest_root => "$dest_root~";
    }

    mkpath("$dest_root/$_") for qw(src build assets/js example t lib);

    process_page("$web_root/index.html", "$dest_root/index.html");

    my($ok, $stdout, $stderr);
    process_jsx(
        "$web_root/profiler/fireworks.jsx",
        "$web_root/profiler/fireworks.jsx.js",
        "--executable", "web", "--profile");

    process_jsx(
        "$web_root/example/aobench/aobench.jsx",
        "$web_root/example/aobench/aobench.jsx.js",
        "--executable", "web", "--release");


    if (modified("$project_root/src", "$dest_root/src")) {
        process_jsx(
            "$project_root/src/web/playground.jsx",
            "$dest_root/build/playground.jsx.js",
            "--executable", "web",
            "--release"
        );
        process_jsx(
            "$project_root/src/web/jsx-script-loader.jsx",
            "$dest_root/build/jsx-script-loader.jsx.js",
            "--executable", "web",
            "--release"
        );
    }

    process_source_map($project_root, "$web_root/source-map", "$dest_root/source-map");

    copy_r("$project_root/src", $dest_src);
    copy_r("$web_root/assets",  "$dest_root/assets");
    copy_r("$web_root/example", "$dest_root/example");
    copy_r("$project_root/t", "$dest_root/t");
    copy_r("$project_root/lib", "$dest_root/lib");

    # process_tree must be called at the end of processes
    process_tree($project_root, [$dest_root], "$dest_root/tree.generated.json");
}

{
    package ScopedReporter;
    sub new {
        my($class, $message) = @_;
        my $t0 = [Time::HiRes::gettimeofday()];
        return bless { start => $t0, message => $message }, $class;
    }

    sub DESTROY {
        my($self) = @_;
        my $elapsed = Time::HiRes::tv_interval($self->{start});
        if ($elapsed > 0.001) {
            printf "[I] %s (elapsed %.03f sec.)\n", $self->{message}, $elapsed;
        }
        else {
            printf "[I] %s\n", $self->{message};
        }
        return;
    }
}

sub info {
    return ScopedReporter->new(join " ", @_);
}

sub make_list {
    my($prefix, $link_to) = @_;
    my $id = $prefix;
    $id =~ s/\W/-/g;

    $link_to ||= $prefix;

    return join "",
        qq{<li id="$id" class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$link_to/$_" data-path="$link_to/$_">$_</a></li>\n} }
        map { basename($_) } glob("$web_root/../$prefix/*.jsx");
}

sub process_page {
    my($src, $dest) = @_;

    my $g = info "process_page: $dest";

    my $template = do {
        open my($fh), '<', $src;
        local $/;
        <$fh>;
    };

    # listing tests
    my $eg  = make_list("example", "source-map");
    my $run = make_list("t/run");
    my $lib = make_list("t/lib");
    my $err = make_list("t/compile_error");

    (my $content = $template) =~ s{
        <!-- \s* source-list \s* -->
        (.*)
        <!-- \s* /source-list \s* -->
    }{$eg$run$lib$err}xmsg;

    open my($fh), '>', $dest;
    print $fh $content;
    close $fh;
}

sub process_jsx {
    my($src, $dest, @opts) = @_;

    my $g = info "process_jsx: $dest";

    my @cmd = (@opts, "--output", $dest, $src);
    my($ok, $stdout, $stderr) = jsx(@cmd);
    $ok or die "Failed to build: jsx @cmd\n$stderr";
}

sub process_tree {
    my($project_root, $src, $dest) = @_;

    my $g = info "process_tree: $dest";

    my %tree;
    for my $src_dir(@{$src}) {
        find {
            no_chdir => 1,
            wanted   => sub {
                return if /~$/;
                return if /\.swp$/;
                return if -d $_;

                my $f = $_;
                $f =~ s{\\}{/}g;
                $f =~ s{^\Q$src_dir/}{};
                my @parts = split(qr{/}, $f);
                my $basename = pop @parts;

                return if $basename =~ /^\./;

                my $dir = \%tree;
                while(@parts) {
                    my $d = shift @parts;
                    $dir = $dir->{$d} ||= {};
                }
                $dir->{$basename} = $f;
            },
        }, $src_dir;
    }

    open my($fh), ">", $dest;
    print $fh JSON->new->utf8->pretty->encode(\%tree);
    close $fh;
}

sub process_source_map {
    my($project_root, $src, $dest) = @_;

    my $g = info "process_source_map: $dest";

    mkpath($dest);

    copy_r($src, $dest); # source-map demo apps

    foreach my $jsx_file(map { basename($_) } glob("$project_root/example/*.jsx")) {
        next if not modified("$project_root/example/$jsx_file", "$dest/$jsx_file");

        my @args = (
            "--executable", "web",
            "--enable-source-map",
            "--output", "$dest/$jsx_file.js",
            "$project_root/example/$jsx_file");

        my $g = info "jsx @args";

        copy("$project_root/example/$jsx_file", "$dest/$jsx_file");
        my $st = stat("$project_root/example/$jsx_file");
        utime $st->atime, $st->mtime, "$dest/$jsx_file";

        my($ok, $stdout, $stderr) = jsx(@args);
        $ok or die $stderr;
    }
    return;
}

sub modified {
    my($src, $dest) = @_;
    my $s = stat($src);
    my $d = stat($dest);

    if($s && $d) {
        if ( S_ISDIR($s->mode) ) {
            return _modified_r($src, $dest);
        }
        return ! ($s->mtime == $d->mtime && $s->size == $d->size);
    }
    else {
        return 1;
    }
}

sub _modified_r {
    my($src, $dest) = @_;
    eval {
        find {
            wanted => sub {
                return if -d $_;
                return if /\~$/ or /\.swp$/;

                my $s = $_;
                my $d = $_;

                $d =~ s{^\Q$src\E}{$dest};
                if (modified($s, $d)) {
                    die "MODIFIED $d from $s\n";
                }
            },
            no_chdir => 1,
        }, $src;
    };
    if ($@) {
        print "[I] ", $@;
    }
    return $@ ? 1 : 0;
}

sub copy_r {
    my($src, $dest) = @_;

    my $g = info("copy $src to $dest");

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
                if ($st) {
                    utime $st->atime, $st->mtime, $d;
                }
                else {
                    warn "failed to stat($_): $!";
                }
            }
        },
    }, $src;

}

# vim: set expandtab:
