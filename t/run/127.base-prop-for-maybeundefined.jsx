/*EXPECTED
42
*/

class Base {
	var x = 0;
}

class Test extends Base {
	static function run() : void {
		var o : MayBeUndefined.<Test> = new Test;
		o.x = 42;
		log o.x;
	}
}
