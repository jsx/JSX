/*EXPECTED
A
default
123
*/
class _Main {
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
	static function main(args : string[]) : void {
		_Main.f("a");
		_Main.f("b");
		_Main.f("123");
	}
}
