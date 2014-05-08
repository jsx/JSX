JSX := jsx

all: fireworks.jsx fireworks.html
	$(JSX) --release --executable web --output fireworks.jsx.js $<

clean:
	rm -rf *.jsx.js
