/*EXPECTED
42
*/

class Base {
	var x = 0;
}

class _Main extends Base {
	static function main(args : string[]) : void {
		var o : Nullable.<_Main> = new _Main;
		o.x = 42;
		log o.x;
	}
}
