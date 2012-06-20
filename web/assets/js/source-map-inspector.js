window.addEventListener('load', function (e) {
	"use strict";

	var Lexer = require("jslexer");
	require("source-map");

	var SOURCE = "source"; // should have data-file="..."
	var ORIG   = "original";
	var GEN    = "generated";

	var colorMapping = {
		space:      "#ccc", // includes comments
		identifier: "#333",
		keyword:    "#09d",
		string:     "#d70",
		number:     "#f60",
		regexp:     "#660"
	};

	var DEBUG = false;

	function element(id) {
		var item = document.getElementById(id);
		if(!item) {
			throw new Error("Element not found for id " + id);
		}
		return item;
	}
	function elementOffset(elem) {
		// point to the center
		var valueL = elem.offsetWidth  >> 1;
		var valueT = elem.offsetHeight >> 1;

		// accumulate
		do {
		  valueT += elem.offsetTop  | 0;
		  valueL += elem.offsetLeft | 0;
		  elem = elem.offsetParent;
		} while (elem);

		return { x: valueL, y: valueT };
	}

	function load(name) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", name, false);
		xhr.send(null);
		return xhr.responseText;
	}

	function format(fmt, __va_args__) {
		var args = arguments;
		return fmt.replace(/%([0-9]+)/g, function (_unused, n) {
			return args[ n | 0 ];
		});
	}

	function asHTML(prefix, tokens) {
		var elements = tokens.map(function (tokenObject) {
			var s = tokenObject.token.
				replace(/&/g, "&amp;").
				replace(/</g, "&lt;").
				replace(/>/g, "&gt;");

			var t = tokenObject.type;

			var style = t in colorMapping ? "color:" + colorMapping[t] : "";

			return format('<span id="%1%2" style="%3;" class="%4">%5</span>',
						  prefix, tokenObject.id, style, t, s);
		});
		return "<code>" + elements.join("") + "</code>";
	}

	function initSourcePane(s, p) {
		p.style.padding = "0px";
		p.style.margin  = "1px";
		p.style.width = format("%1px", (s.offsetWidth >> 1) - 4);
	}

	var source = element(SOURCE);
	console.assert(source.dataset.file, "source.dataset.file");

	initSourcePane(source, element(ORIG));
	initSourcePane(source, element(GEN));

	var gen = Lexer.tokenize(source.dataset.file, load(source.dataset.file));

	var mappingURL;

	if(gen[gen.length-1].type === "space") {
		var m = gen[gen.length-1].token.
			match(/\@ *sourceMappingURL=([^ \t\r\n]+)/);
		if(!m) {
			alert("sourceMappingURL is not found");
			return;
		}
		mappingURL = m[1];
	}
	var mapping = JSON.parse(load(mappingURL));

	var orig = Lexer.tokenize(mapping.sources[0], load(mapping.sources[0]));

	element(ORIG).innerHTML = asHTML(ORIG, orig);
	element(GEN).innerHTML  = asHTML(GEN,  gen);

	var consumer = new sourceMap.SourceMapConsumer(mapping);

	var basePos = {
		x: source.offsetLeft,
		y: source.offsetTop
	};

	var cx = (function () {
		var c = document.createElement('canvas');

		if(DEBUG) {
			c.style.border = "solid 1px black";
		}

		c.style.position = "absolute";
		c.style.margin = "0px";
		c.style.padding = "0px";
		c.style.left = source.offsetLeft + "px";
		c.style.top  = source.offset + "px";

		c.width  = source.offsetWidth;
		c.height = source.offsetHeight;

		source.appendChild(c);

		return c.getContext("2d");
	}());

	console.assert(cx, "cx");

	var original = [];
	orig.forEach(function (tokenObject) {
		if(!original[tokenObject.line]) {
			original[tokenObject.line] = [];
		}
		original[tokenObject.line][tokenObject.column] = tokenObject;
	});

	// draw lines
	for(var i = 0; i < gen.length; ++i) {
		(function (genToken) {
			setTimeout(function() {
				if(genToken.type === "space") {
					return;
				}

				var origPos = consumer.originalPositionFor(genToken);
				console.assert(origPos);
				
				if(! (original[origPos.line] && original[origPos.line][origPos.column])) {
					return;
				}

				var origToken = original[origPos.line][origPos.column];

				if(origToken.done) {
					return;
				}
				origToken.done = true;

				cx.beginPath();

				// left pain
				var elem  = element(ORIG + origToken.id);
				var p = elementOffset(elem);
				cx.moveTo(p.x - basePos.x, p.y - basePos.y);

				// to right pain
				elem = element(GEN + genToken.id);
				p = elementOffset(elem);
				cx.lineTo(p.x - basePos.x, p.y - basePos.y);

				cx.strokeStyle = elem.style.color;
				cx.stroke();
			}, i * 2);
		}(gen[i]));
	}
});
