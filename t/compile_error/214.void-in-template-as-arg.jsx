class Foo.<T> {
	function f(v : T) : void {
		log "Hi";
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Foo.<void>;
	}
}
