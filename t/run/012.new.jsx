/*EXPECTED
1
*/
class _Main {

	var _n : number;

	function constructor(n : number) {
		this._n = n;
	}

	static function main(args : string[]) : void {
		var t = new _Main(1);
		log t._n;
	}
}
