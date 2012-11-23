NAME [![Build Status](https://secure.travis-ci.org/jsx/JSX.png)](http://travis-ci.org/jsx/JSX)
=======================

JSX - a faster, safer, easier JavaScript

INSTALLATION
=======================

The JSX compiler requires `node.js` v0.8.0 or later, `npm`, and the SDK
also requires Perl 5.10.0 or later.

To setup JSX SDK , type the following command:

    git clone --recursive git://github.com/jsx/JSX.git
    cd JSX
    make # to build bin/jsx

To install jsx command, just make a link of `bin/jsx` to `~/bin`.

    ln -s "$PWD/bin/jsx" ~/bin

COMPILATION
=======================

There's `bin/jsx` command to compile JSX source code into JavaScript.

Type the following commands and see what happens:

    # run Hello World in JSX
    bin/jsx --run example/hello.jsx

    # display compiled code to stdout
    bin/jsx example/hello.jsx

    # compile it with fully optimizations
    bin/jsx --release example/hello.jsx

    # compile a program for node, execute it later
    bin/jsx --executable node --output hello.jsx.js example/hello.jsx
    ./hello.jsx.js # displays "Hello, world!"

    # run a test, calling _Test#test*()
    bin/jsx --test example/import.jsx # import.jsx has _Test

`jsx --help` shows how to to use the jsx command.

TESTING
=======================

There are unit tests in `t/` directory. For server side tests, just type the following command:

    make test
    # or
    make test JOBS=2

WEB INTERFACE
=======================

There's a web interface, which compiles JSX source on browsers.
Type the following commands to use the web interface.

    make web
    make server # to run an HTTP daemon
    open http://localhost:5000/

EXAMPLES
=======================

There are JSX source files in `example/` and `web/example/`, and the the test directory `t/`.

WINDOWS SUPPORT
=======================

you can install `jsx` command via `npm install -g .`, and then can invoke `jsx`.
For the web interface, you can run the server by the following commands:

    perl web/build.pl
    node web/server.js

Note that Windows environment is not completely supported yet.

RESOURCES
=======================

* [JSX Wiki](https://github.com/jsx/JSX/wiki)

