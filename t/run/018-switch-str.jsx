/*EXPECTED
A
default
*/
class Test {
	static function f(s : string) : void {
		switch (s) {
		case "a":
			log "A";
			break;
		default:
			log "default";
			break;
		}
	}
	static function run() : void {
		Test.f("a");
		Test.f("b");
	}
}
