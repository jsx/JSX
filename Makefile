
test: test-lang test-lib

test-lang:
	prove --timer

test-lib:
	prove --timer --exec t/util/run-jsx-test t/lib/

web:
	perl web/build.pl

server:
	plackup web/app.psgi

.PHONY: test test-lang test-lib web server
