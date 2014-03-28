class Foo.<T> {
	function f() : void {
		var v : T;
		log "Hi";
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Foo.<void>;
	}
}
