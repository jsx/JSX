/*EXPECTED
10
3
*/
class _Main {
	var n : number;
	function constructor() {
		this(10);
	}
	function constructor(n : number) {
		this.n = n;
	}
	function constructor(b : boolean) {
		_Main(b ? 3 : 0);
	}
	static function main(args : string[]) : void {
		var t = new _Main();
		log t.n;
		t = new _Main(true);
		log t.n;
	}
}
