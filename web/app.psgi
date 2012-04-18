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
my $example = Plack::App::Directory->new({root => "$root/../example"})->to_app();
my $lib     = Plack::App::Directory->new({root => "$root/../lib"})->to_app();

my $build = "$root/build.pl";

my $app = builder {
    mount '/assets'  => $assets; # static css and js
    mount '/lib'     => $lib;
    mount '/example' => $example;
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

        my @examples = map { basename($_) } glob("$root/../example/*.jsx");

        my $src_list = join "", map { qq{<li class="source-file"><a href="#$_">$_</a></li>\n} } @examples;

        (my $main = $template) =~ s{<!-- \s* source-list \s* -->(.*)<!-- \s* /source-list \s* -->}{$src_list}xmsg;

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
