
JOBS:=4

OPTIMIZE_FLAGS := lto,unclassify,fold-const,return-if,inline,dce,unbox,fold-const,dce,lcse,array-length,unclassify

all: src/doc.js

setup: doc


doc: src/doc.js
	rm -rf doc
	find lib -name '*.jsx' | xargs -n 1 -- bin/jsx --mode doc --output doc

# e.g. make test JOBS=2
test:
	prove --jobs "$(JOBS)" t/*.t t/*/*.jsx

test-optimized:
	JSX_OPTS="--optimize $(OPTIMIZE_FLAGS)" prove --jobs "$(JOBS)" t/*/*.jsx

test-all: test test-optimized

optimize-bench:
	prove xt/optimize-bench/*.jsx

web:
	perl web/build.pl --clean
	time bin/jsx --executable web --profile --output web/profiler/fireworks.jsx.js web/profiler/fireworks.jsx
	time bin/jsx --executable web --release --output web/example/aobench/aobench.jsx.js web/example/aobench/aobench.jsx

server:
	node web/server.js

src/doc.js: src/_doc.js
	submodules/picotemplate/picotemplate.pl src/_doc.js

# for authors
web.jsx:
	idl2jsx/build.pl
	idl2jsx/maketest.pl > t/lib/010.web.jsx
	bin/jsx --test t/lib/010.web.jsx

update-assets: update-bootstrap update-codemirror

update-codemirror:
	curl -LO http://codemirror.net/codemirror.zip
	unzip -o codemirror.zip
	cp CodeMirror-*/lib/codemirror.css            web/assets/css
	cp CodeMirror-*/lib/codemirror.js             web/assets/js
	cp CodeMirror-*/mode/javascript/javascript.js web/assets/js/mode
	cp CodeMirror-*/mode/clike/clike.js           web/assets/js/mode

update-bootstrap:
	curl -LO http://twitter.github.com/bootstrap/assets/bootstrap.zip
	unzip -o bootstrap.zip
	cp bootstrap/css/*.* web/assets/css
	cp bootstrap/img/*.* web/assets/img
	cp bootstrap/js/*.*  web/assets/js


clean:
	rm -rf CodeMirror-* codemirror.zip
	rm -rf bootstrap*

.PHONY: test web server doc
