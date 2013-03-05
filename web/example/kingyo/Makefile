
#OPTIMIZE=--optimize lto,no-assert,no-log,fold-const,return-if,inline,unbox,fold-const,lcse,fold-const,array-length,unclassify

all:
	jsx --release --executable web --output game.jsx.js game.jsx

debug:
	jsx --executable web --output game.jsx.js game.jsx

debug-with-source-map:
	jsx --enable-source-map --executable web --output game.jsx.js game.jsx

update-mvq:
	curl -LO https://raw.github.com/thaga/mvq.jsx/master/lib/mvq.jsx
	chmod -w mvq.jsx # make read only
