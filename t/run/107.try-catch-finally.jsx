/*EXPECTED

Hi!
hello
string:all your base are belongs to us
in finally
finally after rethrow
from the deepness
*/

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

class _Main {
	static function main(args : string[]) : void {

		// simple
		try {
			throw new Error();
		} catch (e: Error) {
			log e.message;
		}
		try {
			throw new Error("Hi!");
		} catch (e : Error) {
			log e.message;
		}

		// should catch MyError1
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

		// variant only
		try {
			throw "all your base are belongs to us";
		} catch (e : variant) {
			log typeof e + ":" + e as string;
		}

		// try-finally
		var a;
		try {
		} finally {
			a = "in finally";
		}
		log a;

		// rethrow
		try {
			try {
				throw new Error("from the deepness");
			} catch (e : Error) {
				throw e;
			} finally {
				log "finally after rethrow";
			}
		} catch (e : Error) {
			log e.message;
		}
	}
}
