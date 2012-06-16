NAME [![Build Status](https://secure.travis-ci.org/jsx/JSX.png)](http://travis-ci.org/jsx/JSX)
=======================

JSX - Object-oriented, statically-typed programming language

INSTALLATION
=======================

The JSX compiler requires `node.js` v0.6.0 or later.

To setup JSX SDK , type the following command:

    git clone git://github.com/jsx/JSX.git
    cd JSX
    make setup

To install jsx command, just make a link of `bin/jsx` to `~/bin`.

    ln -s "$PWD/bin/jsx" ~/bin

If you use Windows, `npm install -g .` might be better, though.

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

    # compile and execute a program
    bin/jsx --executable --output hello.js example/hello.jsx
    node hello.js # displays "Hello, world!"

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

There are examples in `example/` and `web/example/`.

SUPPORT
=======================

* JSX web page - http://jsx.github.com/
* JSX project page - https://github.com/jsx
* JSX compiler - https://github.com/jsx/JSX
* Issue Tracker https://github.com/jsx/JSX/issues

