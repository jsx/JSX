/*EXPECTED
true
Hello, world!
*/
// issue #152

// with double-quoted
native("require('string_decoder').StringDecoder") class StringDecoder {
	function constructor(encodingName : string);
}

// with single-quoted
native('require("util")') class util {
	static function format(format : string, ...args : variant) : string;
}

class _Main {
	static function main(args : string[]) : void {
		var sd = new StringDecoder('utf8');
		log sd instanceof StringDecoder;

		log util.format("Hello, %s!", "world");
	}
}
