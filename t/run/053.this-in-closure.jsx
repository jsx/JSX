/*EXPECTED
0
1
3
*/

class _Main {
	var n = 0;
	function adder() : function (: number) : void {
		return function (x : number) : void {
			this.n += x;
		};
	}
	static function main(args : string[]) : void {
		var t = new _Main();
		log t.n;
		var adder = t.adder();
		adder(1);
		log t.n;
		adder(2);
		log t.n;
	}
}
