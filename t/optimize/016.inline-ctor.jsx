/*EXPECTED
abc
def
*/
/*JSX_OPTS
--optimize inline
*/

class Base {
	var value : string = "abc";
	function constructor() {
	}
	function constructor(value : string) {
		this.value = value;
	}
}

class Test extends Base {
	function constructor() {
	}
	function constructor(value : string) {
		super(value);
	}
	static function run() : void {
		var b = new Test();
		log b.value;
		b = new Test("def");
		log b.value;
	}
}
