#!psgi
use 5.10.0;
use strict;
use warnings;
use Fatal              qw(chdir);
use Cwd                qw(getcwd abs_path);
use File::Basename     qw(dirname);
use File::Find         qw(find);
use String::ShellQuote qw(shell_quote);
use Plack::App::Directory;
use Plack::Builder;

my $root = abs_path(dirname(__FILE__));

my $main = do {
    local $/;
    <DATA>;
};
close DATA;

my $js  = Plack::App::Directory->new({root => "$root/js"})->to_app();
my $css = Plack::App::Directory->new({root => "$root/css"})->to_app();

mkdir "$root/js";
mkdir "$root/css";

my $build = abs_path("./node_modules/browserbuild/bin/browserbuild");

builder {
    mount '/css' => $css;
    mount '/js'  => sub {
        my @files;
        find {
            no_chdir => 1,
            wanted   => sub {
                push @files, $_ if $_ =~ /\.js$/;
            },
        }, "$root/../lib";
        my $cmd = "$build --main Compiler --basepath '$root/../lib/' "
            . join(' ', map { shell_quote($_) } @files)
            . " > " . shell_quote("$root/js/compiler.js");
        #print $cmd, "\n";

        system $cmd;

        return  $js->(@_);;
    };

    mount '/' => sub {
        return [
            200,
            [
                'content-type'   => 'text/html; charset=utf8',
                'content-length' => length($main),
            ],
            [ $main ]
        ];
    };
};

__DATA__
<!doctype html>
<html>
<head>
    <title>Spike Compiler</title>
    <script src="js/compiler.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function(e) {
            var run = document.getElementById('run');
            run.addEventListener('click', function(e) {
                var c = new Compiler();
                c.addSourceFile('editor');
                if(c.compile()) {
                    console.log(c);
                    console.log(JSON.stringify(c, null, 2));
                }
            });
        });
    </script>
</head>
<body>
<p>
<input type="button" value="compile" id="run"/>
</p>
<textarea id="editor" style="width: 50em; height: 14em">
package com.example.hello;

class Hello {
    static function main(/* JSX does not yet support array typedefs args : String[] */) : Int {
        log "Hello, world!";
        return 0;
    }
}
</textarea>
</body>
</html>

