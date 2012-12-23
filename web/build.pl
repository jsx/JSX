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
use warnings FATAL => qw(uninitialized recursion);
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT."/extlib/lib/perl5";

use File::Path     qw(rmtree mkpath);
use File::Copy     qw(move copy);
use Fatal          qw(open close);
use File::Find     qw(find);
use Fcntl          qw(S_ISDIR);
use File::stat     qw(stat);
use JSON::PP qw();
use Time::HiRes qw();

my $clean = (grep { $_ eq "--clean" } @ARGV); # clean build

my $root = ROOT;

{
    my $project_root = "$root/..";
    my $dest_root    = "$project_root/try";
    my $dest_src     = "$dest_root/src";

    my $g = info("build JSX web interface");

    if($clean) {
        rmtree("$dest_root~") if -e "$dest_root~";
        rename $dest_root => "$dest_root~";
    }

    mkpath("$dest_root/$_") for qw(src build assets/js example t lib);

    process_page("$root/index.html", "$dest_root/index.html");

    if (modified("$project_root/src", "$dest_root/src")) {
        process_jsx($project_root,
            "$root/src/jsx-web-front.jsx", "$dest_root/assets/js/jsx-web-front.jsx.js");
        process_jsx($project_root,
            "$root/src/jsx-web-compiler.jsx", "$dest_root/build/jsx-compiler.js");
    }

    process_source_map($project_root, "$root/source-map", "$dest_root/source-map");

    copy_r("$project_root/src", $dest_src);
    copy_r("$root/src", $dest_src);
    copy_r("$root/assets",  "$dest_root/assets");
    copy_r("$root/example", "$dest_root/example");
    copy_r("$project_root/t", "$dest_root/t");
    copy_r("$project_root/lib", "$dest_root/lib");

    # process_tree must be called at the end of processes
    process_tree([$dest_root], "$dest_root/tree.generated.json");
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
        printf "[I] %s (elapsed %.03f sec.)\n", $self->{message}, $elapsed;
        return;
    }
}

sub info {
    return ScopedReporter->new(join " ", @_);
}

sub make_list {
    my($prefix) = @_;
    my $id = $prefix;
    $id =~ s/\W/-/g;

    return join "",
        qq{<li id="$id" class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="$prefix/$_" data-path="$prefix/$_">$_</a></li>\n} }
        map { basename($_) } glob(ROOT."/../$prefix/*.jsx");
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

sub process_jsx {
    my($project_root, $src, $dest) = @_;

    my $g = info "process_jsx: $dest";

    my @cmd = ("$project_root/bin/jsx", "--output", $dest, $src);
    system(@cmd) == 0 or die "Failed to build: @cmd\n";
}

sub process_tree {
    my($src, $dest) = @_;

    my $g = info "process_tree: $dest";

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
    my($project_root, $src, $dest) = @_;

    my $g = info "process_source_map: $dest";

    mkpath($dest);

    copy_r($src, $dest);

    my $old_cwd = Cwd::cwd();
    chdir "$project_root/example";
    foreach my $jsx_file(glob("*.jsx")) {
        next if not modified($jsx_file, "$dest/$jsx_file");

        my $g = info "compile $jsx_file with --enable-source-map";

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
    }
    chdir $old_cwd;
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
        print "[W] ", $@;
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
                utime $st->atime, $st->mtime, $d;
            }
        },
    }, $src;

}
# vim: set expandtab:
