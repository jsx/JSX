/*EXPECTED
hello
hello
*/

class Constructor.<T> {
	static function scalar() : T {
		return new T();
	}
	static function array(t : T) : Array.<T> {
		return [ t ];
	}
}

class Test {
	var msg = "hello";
	static function run() : void {
		var s = Constructor.<Test>.scalar();
		log s.msg;
		var a = Constructor.<Test>.array(null);
		a.push(new Test);
		log a[1].msg;
	}
}
