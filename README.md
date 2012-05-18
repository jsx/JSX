NAME
=======================

JSX - Object-oriented, statically-typed programming language for browsers

INSTALLATION
=======================

Install development tools by the following command:

    make setup

COMPILATION
=======================

There's `bin/jsx` command to compile JSX source code into JavaScript.

Type the following command and see what happens:

    jsx$ bin/jsx --executable --output hello.js example/hello.jsx
    jsx$ node hello.js # displays "Hello, world!"

`jsx --help` shows how to to use the jsx command.

TESTING
=======================

For server side tests, just type the following command:

    make test
    # or
    make test JOBS=2

WEB INTERFACE
=======================

There's a web interface, which compiles JSX source on browsers.
Type the following commands to use the web interface.

    # setup at the first time
    perl web/setup.pl

    make web
    make server # to run a HTTP daemon
    open http://localhost:5000/

EXAMPLES
=======================

There are examples in `example/` and `web/example/`.

