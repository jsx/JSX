#!/usr/bin/perl
use strict;
use warnings;
use Fatal qw(open);

use tool::Util;

use Test::More tests => 6;
use Test::TCP;

my $server = Test::TCP->new(
    code => sub {
        my($port) = @_;

        my $server = "bin/jsx-profile-server $port .";
        note "[server] ", $server;
        exec($server);
    },
);

my $run = "--profile --run t/012/post-profile.jsx " . $server->port;
note "[client] $run";

my($ok, $stdout, $stderr) = jsx($run);
ok $ok, "jsx --profile";
is $stderr, "", "no error" or die "stopped";

my($n, $err, $url) = split /\n/, $stdout;
ok $n, "something working";
is $err, "null", "no error in postProfile()";
ok $url, "returned url";

my $json = do {
    my($file) = $url =~ /\?(\S+)$/;

    open my $fh, "./$file.json";
    local $/;
    my $s = <$fh>;
    close $fh;
    unlink "./$file.json";
    $s;
};
ok $json, "json file exists";
note $json;

undef $server;
done_testing;
