package tool::RunCompilationServer;
use strict;
use warnings;

use tool::Util;

use Time::HiRes ();
use File::Basename ();

use Test::TCP ();
use Proc::Guard ();

use constant ROOT => File::Basename::dirname(__FILE__);

use Cwd ();
$ENV{JSX_HOME} = Cwd::getcwd() . '/.jsx';

my $jsx_compiler = ROOT . "/../bin/jsx-compiler.js";

our $server_guard;

if (! -f ) { # server is not running
    my $p = Test::TCP::empty_port();
    $ENV{JSX_COMPILATION_SERVER_PORT} = $tool::Util::jsx_server_port = $p;

    $server_guard = Proc::Guard->new(
        code => sub {
         open STDOUT, ">compilation-server.log" or die $!;
         exec $jsx_compiler, "--compilation-server", $p
            or die $!;
         },
    );

    # wait for running compilation server
    while (1) {
        my($ok, $stdout, $stderr) = jsx("--version");
        if ($ok) {
            chomp $stdout;
            print "# $stdout\n";
            last;
        }
        Time::HiRes::sleep(0.1);
    }
}

1;
