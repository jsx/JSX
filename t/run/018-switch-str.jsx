/*EXPECTED
A
default
123
*/
class Test {
	static function f(s : string) : void {
		switch (s) {
		case "a":
			log "A";
			break;
		case 123 as string:
			log "123";
			break;
		default:
			log "default";
			break;
		}
	}
	static function run() : void {
		Test.f("a");
		Test.f("b");
		Test.f("123");
	}
}
