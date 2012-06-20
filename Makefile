
JOBS:=4

all:

setup:
	npm install
	perl web/setup.pl

# e.g. make test JOBS=2
test:
	prove --jobs "$(JOBS)" t/*.t t/*/*.jsx

test-optimized:
		JSX_OPTS="--optimize lto,no-assert,fold-const,return-if,inline,fold-const" prove --jobs "$(JOBS)" t/*/*.jsx

test-all: test test-optimized

optimize-bench:
	prove xt/optimize-bench/*.jsx

web:
	perl web/build.pl --clean

server:
	node web/server.js

# for authors
web.jsx:
	idl2jsx/build.pl
	idl2jsx/maketest.pl > t/lib/010.web.jsx
	bin/jsx --test t/lib/010.web.jsx

.PHONY: test web server
