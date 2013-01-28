Profiling JSX compiler with NodeJS/V8 profiler
=================================================

NodeJS can profile applications with V8 profiler.

Profiling
=================================================

1. Run JSX compiler with `node --prof`
    like `node --prof bin/jsx example/hello.jsx > /dev/null`
2. Parse v8.log with node-tick-processor \
    like `node-tick-processor > prof.txt`
3. Look into the result.

Prerequisites
=================================================

node-tick-processor
-------------------------------------------------

This is easy-to-use v8.log processor.

* https://github.com/sidorares/node-tick

See also
=================================================

* http://code.google.com/p/v8/wiki/V8Profiler

