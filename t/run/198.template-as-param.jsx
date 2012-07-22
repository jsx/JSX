/*EXPECTED
ok
ok
ok
*/

class C.<T, U> {
}

class Test {
	static function f(o : C.<string, number>) : void {
		log "ok";
	}
	static function f(o : C.<C.<string, number>, number>) : void {
		log "ok";
	}
	static function f(o : C.<string, C.<string, number>>) : void {
		log "ok";
	}

	static function run() : void {
		Test.f(new C.<string, number>());
		Test.f(new C.<C.<string, number>, number>());
		Test.f(new C.<string, C.<string, number>>());
	}
}

