package tool::Util;
use 5.10.0;
use strict;
use warnings;
use Fatal qw(open close);

use File::Basename ();
use lib File::Basename::dirname(__FILE__) . "/../extlib/lib/perl5";

use base qw(Exporter);
our @EXPORT = qw(slurp get_section jsx);

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
        require Text::ParseWords;
        require HTTP::Tiny;
        require JSON;

        state $ua = HTTP::Tiny->new(
            agent => "JSX compiler client",
        );

        my $res = $ua->post("http://localhost:$jsx_server_port/", {
            'content-type' => 'application/json',
            'content'      => JSON::encode_json([ Text::ParseWords::shellwords(@args) ]),
        });

        if (!( $res->{success} && $res->{headers}{'content-type'} eq 'application/json')) {
            return (0, '', Data::Dumper::Dumper($res));
        }

        my $c = JSON::decode_json($res->{content});

        if ($c->{run}) {
            require File::Temp;
            my $js = $ENV{JSX_RUNJS} || "node";
            my $file = File::Temp->new(SUFFIX => ".js");
            $file->print($c->{run}{scriptSource});
            $file->close();
            my $scriptArgs = $c->{run}{scriptArgs};
            return _system($js, $file->filename, @{$scriptArgs});
        }
        for my $filename(keys %{$c->{file}}) {
            open my $fh, ">", $filename;
            print $fh $c->{file}{$filename};
            close $fh;
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
