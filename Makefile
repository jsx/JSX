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
	# jsx-with-server no longer provides additional functionality against bin/jsx but exists for compatibility
	cp -f bin/jsx bin/jsx-with-server

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

test: all test-debug test-optimized-minified show-todo

test-all: test test-optimized

test-debug: test-core test-misc

test-optimized:
	JSX_OPTS="--optimize release,-no-log,-no-assert" $(MAKE) test-core

test-optimized-minified:
	JSX_OPTS="--optimize release,-no-log,-no-assert --minify" $(MAKE) test-core

test-transformed:
	JSX_OPTS="--enable-cps-transform" $(MAKE) test-core

test-transformed-optimized:
	JSX_OPTS="--enable-cps-transform --optimize release,-no-log,-no-assert" $(MAKE) test-core

test-core:
	$(PROVE) --jobs "$(JOBS)" t/run/*.jsx t/compile_error/*.jsx t/lib/*.jsx t/optimize/*.jsx t/complete/*.jsx

test-misc:
	$(PROVE) --jobs "$(JOBS)" t/*.t t/src/*.jsx t/web/*.jsx

test-npm: all
	perl -MFile::Temp=tempdir -e 'system("make _test-npm NPM_TEMPDIR=" . tempdir(CLEANUP => 1)) == 0 or exit 1'

_test-npm:
	PKG=$(shell npm pack)
	PWD=$(shell pwd)
	echo '{}' > $(NPM_TEMPDIR)/package.json
	(cd $(NPM_TEMPDIR) && npm install $(PWD)/$(PKG))
	JSX_COMPILER=$(NPM_TEMPDIR)/node_modules/.bin/jsx $(MAKE) test-core
	rm -f $(PKG)

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
	bin/jsx --warn none --test t/lib/010.web.jsx


show-todo:
	find t -name '*.todo.*' | grep -v '~'

publish: publish-test
	npm publish

publish-test:
	time $(MAKE) test-all test-npm COMPILER_COMPILE_OPTS="--release $(COMPILER_COMPILE_OPTS)"

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

.PHONY: deps compiler compiler-core meta doc bootstrap-compiler test test-all test-debug test-optimized test-optimized-minified test-transformed test-transformed-optimized test-core test-misc test-npm _test-npm test-bench v8bench web server web.jsx show-todo publish publish-test update-assets update-codemirror update-bootstrap clean
