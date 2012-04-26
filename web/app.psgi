#!perl
use 5.10.0;
use strict;
use warnings;
use Fatal          qw(chdir open);
use Cwd            qw(abs_path);
use File::Basename qw(basename dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT . "/extlib/lib/perl5";

use Plack::App::Directory;
use Plack::Builder;
use Plack::Runner;

my $root = ROOT;

my $assets  = Plack::App::Directory->new({root => "$root/assets"})->to_app();
my $src     = Plack::App::Directory->new({root => "$root/.."})->to_app();


my $app = builder {
    mount '/assets'  => $assets; # static css and js

    mount '/' => sub {
        my($env) = @_;

        if($env->{REQUEST_URI} ~~ '/') {
            $env->{PATH_INFO}   = 'web/index.html';
        }

        return $src->($env);
    };
};

# bootstrap myself
if(!caller) {
    Plack::Runner->new()->run($app);
}
else {
    return $app;
}
