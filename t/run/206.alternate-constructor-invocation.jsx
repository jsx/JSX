/*EXPECTED
10
3
*/
class Test {
	var n : number;
	function constructor() {
		this(10);
	}
	function constructor(n : number) {
		this.n = n;
	}
	function constructor(b : boolean) {
		Test(b ? 3 : 0);
	}
	static function run() : void {
		var t = new Test();
		log t.n;
		t = new Test(true);
		log t.n;
	}
}
