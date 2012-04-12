#!perl
use 5.10.0;
use strict;
use warnings;
use lib::xi "-lextlib";
use Fatal              qw(chdir open);
use Cwd                qw(getcwd abs_path);
use File::Basename     qw(basename dirname);
use File::Find         qw(find);
use File::Which        qw(which);
use String::ShellQuote qw(shell_quote);
use Plack::App::Directory;
use Plack::Builder;

my $root = abs_path(dirname(__FILE__));


my $assets  = Plack::App::Directory->new({root => "$root/assets"})->to_app();
my $js      = Plack::App::Directory->new({root => "$root/js"})->to_app();
my $example = Plack::App::Directory->new({root => "$root/../example"})->to_app();

mkdir "$root/js";

my $build = do {
    local $ENV{PATH} = "$root/../node_modules/browserbuild/bin" . ":" . $ENV{PATH};
    which('browserbuild');
} or die "Cannot find browserbuild. Please install it with `npm install`\n";

builder {
    mount '/assets'  => $assets; # static css and js
    mount '/example' => $example;
    mount '/js'      => sub {
        my($env) = @_;

        my @files;
        find {
            no_chdir => 1,
            wanted   => sub {
                push @files, $_ if $_ =~ /\.js$/;
            },
        }, "$root/../lib";
        my $cmd = "$build --main compiler --basepath '$root/../lib/' "
            . join(' ', map { shell_quote($_) } @files)
            . " > "
            . shell_quote("$root/js/compiler.js");

        system($cmd) == 0 or die "Failed to build: $cmd";

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

