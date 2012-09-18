/*EXPECTED
ok
ok
ok
*/

class C.<T, U> {
}

class _Main {
	static function f(o : C.<string, number>) : void {
		log "ok";
	}
	static function f(o : C.<C.<string, number>, number>) : void {
		log "ok";
	}
	static function f(o : C.<string, C.<string, number>>) : void {
		log "ok";
	}

	static function main(args : string[]) : void {
		_Main.f(new C.<string, number>());
		_Main.f(new C.<C.<string, number>, number>());
		_Main.f(new C.<string, C.<string, number>>());
	}
}

