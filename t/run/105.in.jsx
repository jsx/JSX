/*EXPECTED
true
true
false
false
*/

class Test {
	static function run() : void {
		var h = { a: 1 };
		log "a" in h;
		var s = "a";
		log s in h;
		log "b" in h;
		log "a" in { e: 0 };
	}
}
