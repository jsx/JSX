
JOBS:=4

OPTIMIZE_FLAGS := lto,unclassify,fold-const,return-if,inline,dce,unbox,fold-const,dce,lcse,array-length,unclassify

setup: compiler doc

## compiler stuff

compiler: src/doc.jsx
	node bootstrap/jsx-compiler.js --executable node --output bin/jsx src/jsx-node-front.jsx

src/doc.jsx: src/_doc.jsx
	submodules/picotemplate/picotemplate.pl $<


doc: src/doc.jsx
	rm -rf doc
	find lib -name '*.jsx' | xargs -n 1 -- bin/jsx --mode doc --output doc

self-hosting-compiler: compiler
	cp bin/jsx bootstrap/jsx-compiler.js

## test stuff

# e.g. make test JOBS=2
test: compiler
	prove --jobs "$(JOBS)" t/*.t t/*/*.jsx

test-optimized: compiler
	JSX_OPTS="--optimize $(OPTIMIZE_FLAGS)" prove --jobs "$(JOBS)" t/*/*.jsx

test-all: test test-optimized

optimize-bench:
	prove xt/optimize-bench/*.jsx

## web stuff

web: compiler
	perl web/build.pl --clean
	time bin/jsx --executable web --profile --output web/profiler/fireworks.jsx.js web/profiler/fireworks.jsx
	time bin/jsx --executable web --release --output web/example/aobench/aobench.jsx.js web/example/aobench/aobench.jsx

server: compiler
	node web/server.js

# for authors
web.jsx:
	idl2jsx/build.pl
	idl2jsx/maketest.pl > t/lib/010.web.jsx
	bin/jsx --test t/lib/010.web.jsx

update-assets: update-bootstrap update-codemirror

update-codemirror:
	rm -rf codemirror*
	curl -LO http://codemirror.net/codemirror.zip
	unzip -o codemirror.zip
	cp codemirror-*/lib/codemirror.css            web/assets/css
	cp codemirror-*/lib/codemirror.js             web/assets/js
	cp codemirror-*/lib/util/simple-hint.css      web/assets/css
	cp codemirror-*/lib/util/simple-hint.js       web/assets/js
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
	rm -rf bin

.PHONY: test web server doc
