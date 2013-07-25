#!/usr/bin/perl
use strict;
use warnings;
use Test::More;
use File::Temp qw(tempdir);

use tool::Util;


my @files = glob 't/run/*.jsx';

plan tests => 4 * scalar @files;

{
    local $ENV{JSX_HOME} = tempdir(".jsx.mode-parse-XXXXXXXX", CLEANUP => 1);

    require tool::RunCompilationServer;
    require "tool/jsx.pl"; # App::jsx

    my $port = do {
        open my $fh, "<", "$ENV{JSX_HOME}/port" or die $!;
        <$fh>;
    };

    foreach my $file(@files) {
        local $TODO = "todo" if $file =~ / \.todo\. /xms;

        my $res = App::jsx::request($port, "--mode", "parse", $file);

        ok !$res->{invalid_response}, "--mode parse $file";
        is $res->{statusCode}, 0, "statusCode";
        is $res->{stderr}, "", "stderr";
        ok $res->{stdout}, "stdout"
    }
}
