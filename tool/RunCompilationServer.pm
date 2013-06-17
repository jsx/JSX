package tool::RunCompilationServer;
use strict;
use warnings;

use tool::Util;

use Time::HiRes ();
use File::Basename ();

use Net::EmptyPort ();
use Proc::Guard ();

use constant ROOT => File::Basename::dirname(__FILE__);

my $home = $ENV{JSX_HOME} or die "no JSX_HOME";

my $jsx_compiler = ROOT . "/../bin/jsx";

my $app_jsx = ROOT . "/jsx.pl";
require $app_jsx; # App::jsx

our $server_guard;

if (! $ENV{JSX_TEST_NO_COMPILATION_SERVER}) {
    start();
}

sub start {
    my $p = Net::EmptyPort::empty_port();

    $server_guard = Proc::Guard->new(
        code => sub {
           $ENV{JSX_NO_AUTO_SHUTDOWN} = 1;
           open STDOUT, ">>$home/server.log" or die $!;
           open STDERR, ">&", \*STDOUT;
           exec $jsx_compiler, "--compilation-server", $p
              or die $!;
           },
    );

    # wait for running compilation server
    my $count = 0;
    while (1) {
        Time::HiRes::sleep(0.100);
        my($ok, $stdout, $stderr) = jsx("--version");
        if ($ok) {
            chomp $stdout;
            print "# $stdout\n";
            last;
        }
        if (++$count > 5) {
            die "Cannot run the compilation server.\n",
                "Run `npm install` first.\n";
        }
    }
}

1;
