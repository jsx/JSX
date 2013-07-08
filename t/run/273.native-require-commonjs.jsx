/*EXPECTED
true
Hello, world!
*/
// issue #152

// with double-quoted
native class StringDecoder {
	function constructor(encodingName : string);
} = "require('string_decoder').StringDecoder";

// with single-quoted
native class util {
	static function format(format : string, ...args : variant) : string;
} = 'require("util")';

class _Main {
	static function main(args : string[]) : void {
		var sd = new StringDecoder('utf8');
		log sd instanceof StringDecoder;

		log util.format("Hello, %s!", "world");
	}
}
