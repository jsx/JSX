/*EXPECTED
hello
good-bye
yahoo
0
yahoo
false
*/
class ForVoid.<T> {
	static function f1() : T {
		log "hello";
	}
	static function f2() : T {
		log "good-bye";
		return;
	}
}

class ForNonVoid.<T> {
	static var t : T;
	static function f1() : T {
		log "yahoo";
		return __CLASS__.t;
	}
}

class _Main {
	static function main(args : string[]) : void {
		ForVoid.<void>.f1();
		ForVoid.<void>.f2();
		log ForNonVoid.<number>.f1();
		log ForNonVoid.<boolean>.f1();
	}
}
