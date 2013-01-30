/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize lto,unclassify
*/

class T {
	var v : string;
	function constructor() {
		this.v = "foo";
	}

	function getFoo() : string {
		return this.v;
	}
}

class D {
	var t = new T();

	function f() : string {
		if (this.t instanceof T) {
			return this.t.getFoo();
		}
		else {
			return "bar";
		}
	}
}

class _Main {
	static function main(args : string[]) : void {
		var o = new D();
		log o.f();
	}
}
