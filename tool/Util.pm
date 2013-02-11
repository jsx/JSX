package tool::Util;
use strict;
use warnings;
use warnings FATAL => qw(uninitialized);
use Fatal qw(open close);

use File::Basename ();
use lib File::Basename::dirname(__FILE__) . "/../extlib/lib/perl5";


use base qw(Exporter);
our @EXPORT = qw(slurp get_section jsx);

use Cwd ();
$ENV{JSX_HOME} = Cwd::getcwd() . '/.jsx';

our $jsx_server_port = $ENV{JSX_COMPILATION_SERVER_PORT};

sub _system { # system() which returns (status code, stdout, stderr)
    my(@args) = @_;
    require IPC::Open3;
    require Symbol;
    my($wtr, $rdr, $err) = (Symbol::gensym(), Symbol::gensym(), Symbol::gensym());
    my $pid = IPC::Open3::open3($wtr, $rdr, $err, @args);
    close $wtr;
    local $/;
    my $stdout = <$rdr>;
    my $stderr = <$err>;
    close $rdr;
    close $err;
    waitpid $pid, 0;

    return ($? == 0, $stdout, $stderr);
}

sub jsx { # returns (status, stdout, stderr)
    my(@args) = @_;

    if (! $jsx_server_port) {
        return _system("bin/jsx @args");
    }
    else {
        my $app_jsx = File::Basename::dirname(__FILE__) . "/jsx.pl";
        require $app_jsx; # App::jsx

        require Text::ParseWords;
        require Cwd;

        my @real_args = ("--working-dir", Cwd::getcwd(), Text::ParseWords::shellwords(@args));

        my $c = App::jsx::request($jsx_server_port, @real_args);

        for my $filename(keys %{$c->{file}}) {
            open my $fh, ">", $filename;
            print $fh $c->{file}{$filename};
            close $fh;
        }
        for my $filename(keys %{$c->{executableFile}}) {
            if ($c->{executableFile}{$filename} eq "node") {
                chmod(0755, $filename);
            }
        }

        if ($c->{run}) {
            return _system(App::jsx::prepare_run_command($c->{run}));
        }
        return ($c->{statusCode} == 0, $c->{stdout}, $c->{stderr});
    }
}

sub slurp {
    my($file) = @_;
    open my $fh, "<", $file
        or die "failed to open $file:$!";
    local $/;
    return <$fh>;
}


sub get_section {
    my ($file, $name) = @_;
    my $content = slurp($file);
    my($expected) = $content =~ m{/\*$name\n(|.*?\n)\*/}s;
    return $expected;
}

1;
