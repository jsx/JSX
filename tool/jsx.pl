#!/usr/bin/env perl
# JSX compiler wrapper working on POSIX compatible environment

use strict;
use warnings;
use warnings FATAL => 'uninitialized';

BEGIN {
}

package App::jsx;
{

    use File::Basename ();
    use File::Spec     ();

    my $DIR;
    BEGIN {
        my $linkTo = readlink(__FILE__);
        my $FILE;
        if ($linkTo) {
            if (File::Spec->file_name_is_absolute($linkTo)) {
                $FILE = $linkTo;
            }
            else {
                $FILE = File::Spec->catfile(File::Basename::dirname(__FILE__), $linkTo);
            }
        }
        else {
            $FILE = __FILE__;
        }

        $DIR = File::Basename::dirname($FILE);

        if ($ENV{IN_RELENG}) {
            # does the same as lib::core::only
            # to prevent to use locally-installed modules
            require Config;
            @INC = @Config::Config{qw(privlibexp archlibexp)};
            # do not use lib module; we don't want to use XS modules
            unshift @INC, "$DIR/../extlib/lib/perl5";
        }
        else {
            require lib;
            lib->import("$DIR/../extlib/lib/perl5");
        }
    }

    # required modules
    use Cwd         ();
    use Carp        ();
    use HTTP::Tiny  ();

    #use Time::HiRes      (); # lazy
    #use POSIX            (); # lazy
    #use File::Path       (); # lazy
    #use Text::ParseWords (); # lazy
    #use File::Temp       (); # lazy


    BEGIN {
        if (eval { require JSON::XS }) {
            *encode_json = \&JSON::XS::encode_json;
            *decode_json = \&JSON::XS::decode_json;
        }
        else {
            require JSON;
            *encode_json = \&JSON::encode_json;
            *decode_json = \&JSON::decode_json;
        }
    }

    my $jsx_compiler = "$DIR/../bin/jsx";

    my $home = $ENV{JSX_HOME} || (($ENV{HOME} || glob('~')) . "/.jsx");

    my $pid_file  = "$home/pid";
    my $port_file = "$home/port";
    my $log_file  = "$home/server.log";
    my $run_dir   = "$home/run";

    if (not -d $run_dir) {
        require File::Path;
        File::Path::mkpath($home . "/run");
    }

    my $ua = HTTP::Tiny->new(
        agent => __PACKAGE__,
    );

    my $localhost = '127.0.0.1';

    sub read_file {
        my($file) = @_;
        open my($fh), "<", $file or Carp::confess("cannot open file '$file' for reading: $!");
        local $/;
        return scalar <$fh>;
    }

    sub write_file {
        my($file, $content) = @_;
        if (not -e File::Basename::dirname($file)) {
            require File::Path;
            File::Path::mkpath(File::Basename::dirname($file));
        }
        open my($fh), ">", $file or Carp::confess("cannot open file '$file' for writing: $!");
        binmode $fh, ":utf8";
        print $fh $content;
        close $fh or Carp::confess("cannot close file '$file': $!");
        return;
    }

    sub server_living { # server process lives
        if (-f $pid_file) {
            chomp(my $pid = read_file($pid_file));
            return kill 0, $pid;
        }
        else {
            return 0;
        }
    }

    sub server_ready { # server is ready to accept requests
        if (-f $port_file) {
            chomp(my $port = read_file($port_file));
            my $res = $ua->request(GET => "http://$localhost:$port/ping");
            return $res->{success};
        }
        else {
            return 0;
        }
    }

    sub get_server_port {
        if (! server_living()) {
            my $parent_pid = $$;
            defined(my $pid = fork()) or Carp::confess("failed to fork: $!");

            if ($pid == 0) {
                if (not -e $jsx_compiler) {
                    kill TERM => $parent_pid;
                    Carp::confess("no $jsx_compiler found.");
                }

                # child process
                open STDOUT, ">>", $log_file or Carp::confess("cannot open '$log_file' for writing: $!");
                open STDERR, ">&", \*STDOUT or Carp::confess("cannot dup STDOUT: $!");

                require POSIX;
                POSIX::setsid();

                require Net::EmptyPort;

                my $port = Net::EmptyPort::empty_port();
                exec($jsx_compiler, "--compilation-server", $port)
                    or kill(TERM => $parent_pid), Carp::confess("failed to exec $jsx_compiler: $!");
                die "not reached";
            }
            # parent process

            my $elapsed = 0;
            until (server_ready()) {
                require Time::HiRes;
                $elapsed += Time::HiRes::sleep(0.100);
                if ($elapsed > 5) {
                    Carp::confess("compilation server is not available. see $log_file");
                }
            }
        }
        return read_file($port_file);
    }

    sub prepare_run_command {
        my($run) = @_;

        my $js = $ENV{JSX_RUNJS} || "node";

        require File::Temp;
        my($fh, $file) = File::Temp::tempfile(
            DIR    => $run_dir,
            SUFFIX => ".js",
            UNLINK => 1,
        );
        binmode $fh, ":utf8";
        print $fh $run->{scriptSource};
        close $fh;

        my $scriptArgs = $run->{scriptArgs};
        return ($js, $file, @{$scriptArgs});
    }

    sub request { # returns JSON response
        my($port, @args) = @_;

        my %options;

        # can read bytes from STDIN?
        my $rbits = '';
        vec($rbits, fileno(STDIN), 1) = 1;
        if (select($rbits, undef, undef, 0)) {
            local $/;
            $options{'headers'} = {'content-type' => 'text/plain'};
            $options{'content'} = <STDIN>;
        }

        my $query = encode_json(["--working-dir", Cwd::getcwd(), @args]);
        $query =~ s/(\W)/'%' . unpack('H2', $1)/eg; # urlencode

        my $res = $ua->request(POST =>
            "http://$localhost:$port/compiler?$query",
            \%options);

        if (!( $res->{success} && $res->{headers}{'content-type'} eq 'application/json')) {
            return {
                invalid_response => 1, # server down or invalid request

                statusCode => 2,
                stdout     => "",
                stderr     => $res->{content},
            };
        }
        return decode_json($res->{content});
    }

    sub shutdown_server {
        if (-f $pid_file) {
            kill TERM => read_file($pid_file);
        }
        unlink $pid_file, $port_file;
    }

    sub save_files {
        my($c) = @_;
        for my $filename(keys %{$c->{file}}) {
            write_file($filename, $c->{file}{$filename});
        }
        for my $filename(keys %{$c->{executableFile}}) {
            if ($c->{executableFile}{$filename} eq "node") {
                chmod(0755, $filename);
            }
        }
        return;
    }

    sub main {
        my(@argv) = @_;

        binmode STDOUT, ":utf8";
        binmode STDERR, ":utf8";
        local $| = 1;

        if (! @argv) {
            shutdown_server();
            print "no files\n";
            return 1;
        }

        my $port = get_server_port();
        my $c = request($port, @argv);
        if ($c->{invalid_response}) {
            shutdown_server();

            $port = get_server_port(); # retry
            $c = request($port, @argv);
        }

        print STDERR $c->{stderr};

        save_files($c);

        if ($c->{run}) {
            return system(prepare_run_command($c->{run}));
        }
        else {
            print STDOUT $c->{stdout};
            return $c->{statusCode};
        }
    }

} # App::jsx

package main;
exit(App::jsx::main(@ARGV)) if $0 eq __FILE__;
1;
