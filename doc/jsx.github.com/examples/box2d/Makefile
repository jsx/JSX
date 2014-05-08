JSX := jsx

all:
	cd box2djsx/sample && make JSX="$(JSX)"
	cp box2djsx/sample/*.jsx.js box2djsx/sample/*.html .

box2djsx:
	git clone git://github.com/tkihira/box2djsx.git

clean:
	rm -rf *.jsx.js

.PHONY: all clean
