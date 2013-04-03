JSX HACKING GUIDE
=================================================

Bootstrap
=================================================

JSX compiler is self-hosted. `tool/bootstrap-compiler.js` is the bootstrap compiler, which is a version of pre-compiled JSX compiler.

To update the bootstrap compiler, type `make bootstrap-compiler`.

JSX compilation server
=================================================

JSX has a compilation server, or persistent compilation daemon, to accelerate compilation.

* bin/jsx - a wrapper script which runs compilation server automatically and requests compilation to the server
* bin/jsx-compiler.js - the entity of JSX compiler

Testing JSX compiler
=================================================

`t/util/test-runner` dispatches test according to the test directory.

* `t/run/*.jsx` are JSX language specification to test how JSX works
* `t/compile_error/*.jsx` are also specification to test what should be errors
* `t/complete/*.jsx` tests `--mode complete`
* `t/web/*.jsx` are web stuff tested with `phantomjs`
* `t/lib/*.jsx` and `t/src/*.jsx` are libraries and JSX sources tested with `test-case.jsx`

Profiling JSX compiler with V8Profiler
=================================================

NodeJS can profile applications with V8Profiler.

* [V8Profiler](http://code.google.com/p/v8/wiki/V8Profiler)
* [node-tick-profiler](https://github.com/sidorares/node-tick)

Profiling
-------------------------------------------------

1. Run JSX compiler with `node --prof`
    e.g. `node --prof bin/jsx-compiler.js example/hello.jsx > /dev/null`
2. Parse v8.log with node-tick-processor
    e.g. `node-tick-processor > prof.txt`
3. Look into the result.

