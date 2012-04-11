/*EXPECTED
A
default
null
*/
class Test {
	static function f(s : String) : void {
		switch (s) {
		case "a":
			log "A";
			break;
		case null:
			log "null";
			break;
		default:
			log "default";
			break;
		}
	}
	static function run() : void {
		Test.f("a");
		Test.f("b");
		Test.f(null);
	}
}
