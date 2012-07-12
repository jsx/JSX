/*EXPECTED
2
4
6
6
8
2
*/
/*JSX_OPTS
--optimize lcse
*/
class Test {
	var n = 1;
	function constructor() {
		// test this.prop
		var r = this.n + this.n;
		log r;
		r = (this.n = 2) + this.n;
		log r;
		this.n = 3;
		r = this.n + this.n;
		log r;
	}
	function constructor(b : boolean) {
		// no test
	}
	static function run() : void {
		var t2 = new Test(false);
		// test this.prop
		var t = new Test;
		// test local.prop
		var r = t.n + t.n;
		log r;
		r = (t.n = 4) + t.n;
		log r;
		t = t2;
		r = t.n + t.n;
		log r;
	}
}	
