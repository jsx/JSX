NAME [![Build Status](https://secure.travis-ci.org/jsx/JSX.png)](http://travis-ci.org/jsx/JSX)
=======================

JSX - a faster, safer, easier JavaScript

INSTALLATION
=======================

The JSX compiler toolkit is released as a npm package, so you can install it with `npm install -g jsx`.

* https://npmjs.org/package/jsx

If you are interested in develop the JSX compiler, you should set up your environment after cloning the repo. Note that the SDK requires Perl 5.10.0 or later as well as NodeJS 0.8.0 or later.

To setup JSX SDK , type the following command:

    git clone --recursive git://github.com/jsx/JSX.git
    cd JSX
    make # to build bin/jsx

To install `jsx(1)` for development, just make a link of `bin/jsx` to `~/bin`.
    ln -s "$PWD/bin/jsx" ~/bin

COMPILATION
=======================

There's `jsx(1)` command to compile JSX source code into JavaScript.

Type the following commands and see what happens:

    # run Hello World in JSX
    jsx --run example/hello.jsx

    # display compiled code to stdout
    jsx example/hello.jsx

    # compile it with fully optimizations
    jsx --release example/hello.jsx

    # compile a program for node, execute it later
    jsx --executable node --output hello.jsx.js example/hello.jsx
    ./hello.jsx.js # displays "Hello, world!"

    # run a test, calling _Test#test*()
    jsx --test example/import.jsx # import.jsx has _Test

`jsx --help` shows how to to use the jsx command.

TESTING
=======================

There are unit tests in `t/` directory. For server side tests, just type the following command:

    make test

For developers:

Test cases are executed by `prove(1)` and dispatched by `t/util/test-runner`.
Be familiar with them!

DEVELOPMENT WEB SERVER
=======================

There's a web interface, which provides a web compiler and web application examples.
Type the following commands to run the server:

    make server # to run an HTTP daemon
    open http://localhost:5000/

This server is also used to show results of JSX profiler.
See [Using the Profiler](https://github.com/jsx/JSX/wiki/Using-the-Profiler) for details.

EXAMPLES
=======================

There are JSX source files in `example/` and `web/example/`, and the the test directory `t/`.

WINDOWS SUPPORT
=======================

TBD

RESOURCES
=======================

* [JSX web site](http://jsx.github.com/)
* [JSX wiki](https://github.com/jsx/JSX/wiki)

