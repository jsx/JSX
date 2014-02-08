NAME [![Build Status](https://secure.travis-ci.org/jsx/JSX.png)](http://travis-ci.org/jsx/JSX)
=======================

JSX - a faster, safer, easier JavaScript

INSTALLATION
=======================

The JSX compiler toolkit is released as a npm package, so you can install it with `npm install -g jsx`.

* https://npmjs.org/package/jsx

COMPILATION
=======================

There's `jsx(1)` command to compile JSX source code into JavaScript.

Type the following commands and see what happens:

    # run Hello World in JSX
    jsx --run example/hello.jsx

    # compile it and output the generated code to stdout
    jsx example/hello.jsx

    # compile it with fully optimizations
    jsx --release --output hello.jsx.js example/hello.jsx

    # compile it for node and execute it
    jsx --executable node --output hello.jsx.js example/hello.jsx
    ./hello.jsx.js # displays "Hello, world!"

    # run a test, calling _Test#test*()
    jsx --test example/import.jsx # import.jsx has _Test

`jsx --help` shows how to to use the jsx command.

INTRODUCTION
=======================

Here is a fizzbuzz problem, which can be executed by `jsx --run fizzbuzz.jsx`, showing a basic syntax of JSX.

```jsx
class _Main {
	static function main(args :string[]) : void {
		for (var i = 1; i <= 100; ++i) {
			if (i % 15 == 0)
				log "FizzBuzz";
			else if (i % 3 == 0)
				log "Fizz";
			else if (i % 5 == 0)
				log "Buzz";
			else
				log i;
		}
	}
}
```

See [the documentation](http://jsx.github.io/doc.html) for details.

EXAMPLES
=======================

There are JSX source files in `example/` and `web/example/`, and the the test directory `t/`.

DEVELOPMENT OF JSX COMPILER
=======================

If you are interested in development of the JSX compiler, you should set up your environment after cloning the repo. The SDK development requires LSB 4.1 (Perl 5.8.8 and some UNIX commands) as well as NodeJS 0.8.0 or later.

To setup JSX SDK, type the following command:

    git clone --recursive git://github.com/jsx/JSX.git
    cd JSX
    make # to build bin/jsx
    # edit JSX compiler source files
    make test # to make sure it works

We recommend to install `jsx(1)` as a link of `$JSX/bin/jsx` to `~/bin/jsx`.

    ln -s "$PWD/bin/jsx" ~/bin

DEVELOPMENT WEB SERVER
-----------------------

There's a web interface, which provides a web compiler and web application examples.
Type the following commands to run the server:

    make server # to run an HTTP daemon
    open http://localhost:2012/

This server is also used to show results of JSX profiler.
See [Using the Profiler](http://jsx.github.io/doc/profiler.html) for details.

TESTING
-----------------------

There are unit tests in `t/` directory. Just type the following command to run the tests:

    make test

These test cases are executed by `prove(1)` and dispatched by `t/util/test-runner`, and also requires `phantomjs(1)`

Note that if you make a pull-requst you have to make sure `make test-all` for complete tests.

NOTE: There are some TODO tests, which should be resolved in a future. `make show-todo` shows such TODOs.

WINDOWS SUPPORT
=======================

`npm install -g jsx` should work even on Windows.

RESOURCES
=======================

* [JSX web site](http://jsx.github.io/)
* [JSX wiki](https://github.com/jsx/JSX/wiki)

