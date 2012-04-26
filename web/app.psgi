#!perl
use 5.10.0;
use strict;
use warnings;
use Cwd            qw(abs_path);
use File::Basename qw(dirname);
use constant ROOT => abs_path(dirname(__FILE__));
use lib ROOT . "/extlib/lib/perl5";

use Plack::App::Directory;
use Plack::Runner;

my $root = ROOT;

my $src = Plack::App::Directory->new({root => "$root/.."})->to_app();

my $app = sub {
    my($env) = @_;

    if($env->{REQUEST_URI} eq '/') {
        $env->{PATH_INFO}   = 'web/index.html';
    }

    if($env->{PATH_INFO} =~ /index\.html$/) {
        system($^X, "$root/build.pl") == 0
            or die "Cannot build index.html";
    }

    return $src->($env);
};

# bootstrap myself
if(!caller) {
    Plack::Runner->new()->run($app);
}
else {
    return $app;
}
