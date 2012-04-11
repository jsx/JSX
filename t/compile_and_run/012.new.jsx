/*EXPECTED
1
*/
class Test {

	var _n : number;

	function initialize(n : number) {
		this._n = n;
	}

	static function run() : void {
		var t = new Test(1);
		log t._n;
	}
}
