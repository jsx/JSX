/*EXPECTED
0
1
3
*/

class Test {
	var n = 0;
	function adder() : function (: number) : void {
		return function (x : number) : void {
			this.n += x;
		};
	}
	static function run() : void {
		var t = new Test();
		log t.n;
		var adder = t.adder();
		adder(1);
		log t.n;
		adder(2);
		log t.n;
	}
}
