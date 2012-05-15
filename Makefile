
J:=4

# e.g. make test J=2
test:
	prove -j$(J) t/*.t t/*/*.jsx

web:
	perl web/build.pl
	bin/jsx --output fib.js example/fib.jsx
	mkdir -p web/source-map
	mv fib.js web/source-map/
	mv fib.js.mapping web/source-map/
	mkdir -p web/source-map/example
	cp example/fib.jsx web/source-map/example/

server:
	plackup web/app.psgi

.PHONY: test web server
