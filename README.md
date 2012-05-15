NAME
=======================

JSX - Object-oriented, statically-typed programming language for browsers

INSTALLATION
=======================

Install development tools by the following command:

    npm install

TESTING
=======================

For server side tests, just type the following command:

    make test

WEB INTERFACE
=======================

A web interface, which compiles JSX source on browsers, is
provided by the following commands.

    # setup at the first time
    perl web/setup.pl

    make web
    make server # to run a HTTP daemon
    open http://localhost:5000/

EXAMPLES
=======================

There are examples in `example/` and `web/example/`.

