class MyError1 extends Error {
	function constructor(message : string) {
		super(message);
	}
}

class MyError2 extends MyError1 {
	function constructor() {
		super("MyError2");
	}
}

class Test {
	static function run() : void {
		try {
			throw new Error("Hi!");
		} catch (e : Error) {
			log e.message;
		}
		try {
			throw new MyError1("hello");
		} catch (e : MyError2) {
			log "unreachable:MyError2";
		} catch (e : MyError1) {
			log e.message; // hello
		} catch (e : Error) {
			log "unreachable:Error";
		} catch (e : variant) {
			log "unreachable:variant";
		}
	}
}
