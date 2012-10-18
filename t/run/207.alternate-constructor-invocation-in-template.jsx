/*EXPECTED
10
3
*/
class K.<T> {
	var n : number;
	function constructor() {
		this(10);
	}
	function constructor(n : number) {
		this.n = n;
	}
	function constructor(b : boolean) {
		K.<T>(b ? 3 : 0);
	}
}

class _Main {
	static function main(args : string[]) : void {
		var t = new K.<number>();
		log t.n;
		t = new K.<number>(true);
		log t.n;
	}
}
