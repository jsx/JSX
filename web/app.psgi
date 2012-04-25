#!perl
use 5.10.0;
use strict;
use warnings;
use Fatal          qw(chdir open);
use Cwd            qw(getcwd abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT . "/extlib/lib/perl5";

use Plack::App::Directory;
use Plack::Builder;
use Plack::Runner;

my $root = ROOT;

mkdir "$root/js";

my $assets  = Plack::App::Directory->new({root => "$root/assets"})->to_app();
my $js      = Plack::App::Directory->new({root => "$root/js"})->to_app();
my $src     = Plack::App::Directory->new({root => "$root/.."})->to_app();
my $lib     = Plack::App::Directory->new({root => "$root/../lib"})->to_app();

my $build = "$root/build.pl";

sub make_list {
    my($prefix) = @_;
    return join "",
        qq{<li class="nav-header">$prefix</li>\n},
        map { qq{<li class="source-file"><a href="src/$prefix/$_">$_</a></li>\n} }
        map { basename($_) } glob("$root/../$prefix/*.jsx");
}

my $app = builder {
    mount '/assets'  => $assets; # static css and js
    mount '/lib'     => $lib;
    mount '/src'     => $src;
    mount '/js'      => sub {
        my($env) = @_;

        my @cmd = ($build, "$root/..", "$root/js/jsx-web.js");
        system(@cmd) == 0 or die "Failed to build: @cmd";

        return  $js->(@_);;
    };

    mount '/' => sub {
        my $template = do {
            open my $fh, '<', "$root/static/index.html";
            local $/;
            <$fh>;
        };

        # listing tests
        my $run = make_list("t/run");
        my $err = make_list("t/compile_error");

        (my $main = $template) =~ s{<!-- \s* source-list \s* -->(.*)<!-- \s* /source-list \s* -->}{$run$err}xmsg;

        return [
            200,
            [
                'content-type'   => 'text/html; charset=utf8',
                'content-length' => length($main),
            ],
            [ $main ]
        ];
    };
};

# bootstrap myself
if(!caller) {
    Plack::Runner->new()->run($app);
}
else {
    return $app;
}
