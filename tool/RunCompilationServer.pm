package tool::RunCompilationServer;
use strict;
use warnings;

use tool::Util;

use Time::HiRes ();
use File::Basename ();

use Proc::Guard ();

use constant ROOT => File::Basename::dirname(__FILE__);

use Cwd ();
my $home = $ENV{JSX_HOME} = Cwd::getcwd() . '/.jsx';

my $jsx_compiler = ROOT . "/../bin/jsx-compiler.js";

my $app_jsx = ROOT . "/jsx.pl";
require $app_jsx; # App::jsx

our $server_guard;

if (! $ENV{JSX_TEST_NO_COMPILATION_SERVER}) {
    my $p = App::jsx::empty_port();

    $server_guard = Proc::Guard->new(
        code => sub {
         open STDOUT, ">>$home/server.log" or die $!;
         open STDERR, ">&", \*STDOUT;
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
        Time::HiRes::sleep(0.100);
    }
}

1;
