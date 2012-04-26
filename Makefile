
test:
	prove --timer

web:
	perl web/build.pl

server:
	plackup web/app.psgi

.PHONY: test web server
