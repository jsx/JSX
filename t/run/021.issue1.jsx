// issues/1 [lexer] fix regexp vs. div

/*EXPECTED
ok
*/
class _Main {
	static function main(args : string[]) : void {
		var a = 4 / 2;
		//var b = /foo/; // FIXME

		var c = 4 / 2 / 1;
		//var d = 4 / 2 ? /foo/ : /bar/; // FIXME
		var e = (4) / 2 / 1;
		var e = a / 2 / 1;
		// var f = /foo/ / 2; // should be tokanized
		// var g = "foo" / 2; // should be tokenized

		log "ok";
	}
}
// vim: set noexpandtab:
