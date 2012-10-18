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

class _Main extends Base {
	function constructor() {
	}
	function constructor(value : string) {
		super(value);
	}
	static function main(args : string[]) : void {
		var b = new _Main();
		log b.value;
		b = new _Main("def");
		log b.value;
	}
}
