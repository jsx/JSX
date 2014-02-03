/*EXPECTED
hello
*/
__export__ class Base {
	function constructor(s : string) {
		log s;
	}
}

__export__ class Derived extends Base {
	function constructor(s : string) {
		super(s);
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Derived("hello");
	}
}
