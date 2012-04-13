#!perl
use 5.10.0;
use strict;
use warnings;
use lib::xi "-lextlib";
use Fatal              qw(chdir open);
use Cwd                qw(getcwd abs_path);
use File::Basename     qw(basename dirname);
use Plack::App::Directory;
use Plack::Builder;

my $root = abs_path(dirname(__FILE__));

mkdir "$root/js";

my $assets  = Plack::App::Directory->new({root => "$root/assets"})->to_app();
my $js      = Plack::App::Directory->new({root => "$root/js"})->to_app();
my $example = Plack::App::Directory->new({root => "$root/../example"})->to_app();


my $build = "$root/build.pl";

builder {
    mount '/assets'  => $assets; # static css and js
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

