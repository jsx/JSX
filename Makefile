PROVE:=perl -Mlib=extlib/lib/perl5 extlib/bin/prove
JOBS:=4

BOOTSTRAP_COMPILER:=tool/bootstrap-compiler.js
COMPILER_TARGET:=bin/jsx
COMPILER_COMPILE_OPTS:=--executable node --warn none

PORT:=2012

all: deps compiler doc web

## compiler stuff

deps:
	git submodule update --init
	npm install .

compiler: meta src/doc.jsx
	$(MAKE) compiler-core
	cp -f "$$PWD/tool/jsx.pl" bin/jsx-with-server


compiler-core:
	node $(BOOTSTRAP_COMPILER) $(COMPILER_COMPILE_OPTS) --output $(COMPILER_TARGET) src/jsx-node-front.jsx

src/doc.jsx: src/_doc.jsx
	submodules/picotemplate/picotemplate.pl $<

meta:
	if [ -e .git ] ; then \
		tool/make-meta package.json src/meta.jsx ; \
	fi

doc: compiler
	rm -rf doc
	find lib -name '*.jsx' | xargs -n 1 -- bin/jsx --mode doc --output doc

bootstrap-compiler: compiler
	$(MAKE) compiler-core BOOTSTRAP_COMPILER=bin/jsx COMPILER_TARGET=$(BOOTSTRAP_COMPILER) COMPILER_COMPILE_OPTS="--disable-type-check --optimize no-assert --executable node" # again

## test stuff

# e.g. make test JOBS=2

test: all test-debug test-optimized-minified

test-all: test test-optimized

test-debug: test-core test-misc-core

test-optimized:
	JSX_OPTS="--optimize release --disable-optimize no-log,no-assert" $(MAKE) test-core

test-optimized-minified:
	JSX_OPTS="--optimize release --disable-optimize no-log,no-assert --minify" $(MAKE) test-core

test-core:
	$(PROVE) --jobs "$(JOBS)" t/run/*.jsx t/compile_error/*.jsx t/lib/*.jsx t/src/*.jsx t/web/*.jsx

test-misc-core:
	$(PROVE) --jobs "$(JOBS)" t/*.t t/optimize/*.jsx t/complete/*.jsx


test-bench:
	$(PROVE) -v xt/optimize-bench/*.jsx

v8bench: compiler
	cd submodules/v8bench && make


## web stuff

web: compiler
	perl web/build.pl

server: web
	node web/server.js $(PORT)

# for authors
web.jsx:
	idl2jsx/build.pl
	idl2jsx/maketest.pl > t/lib/010.web.jsx
	bin/jsx --test t/lib/010.web.jsx


show-todo:
	find t -name '*.todo.*' | grep -v '~'

publish:
	time $(MAKE) test-all COMPILER_COMPILE_OPTS="--release $(COMPILER_COMPILE_OPTS)"
	npm publish

update-assets: update-bootstrap update-codemirror

update-codemirror:
	rm -rf codemirror*
	curl -LO http://codemirror.net/codemirror.zip
	unzip -o codemirror.zip
	cp codemirror-*/lib/codemirror.css            web/assets/css
	cp codemirror-*/lib/codemirror.js             web/assets/js
	cp codemirror-*/addon/hint/show-hint.css    web/assets/css
	cp codemirror-*/addon/hint/show-hint.js     web/assets/js
	cp codemirror-*/mode/javascript/javascript.js web/assets/js/mode
	cp codemirror-*/mode/clike/clike.js           web/assets/js/mode

update-bootstrap:
	curl -LO http://twitter.github.com/bootstrap/assets/bootstrap.zip
	unzip -o bootstrap.zip
	cp bootstrap/css/*.* web/assets/css
	cp bootstrap/img/*.* web/assets/img
	cp bootstrap/js/*.*  web/assets/js

## cleanup

clean:
	rm -rf CodeMirror-* codemirror.zip
	rm -rf bootstrap*
	rm -rf bin/*
	rm -rf jsx-*.tgz

.PHONY: setup test test-debug test-release test-core test-misc-core web server doc meta instal-deps
