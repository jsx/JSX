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

class _Main {
	var msg = "hello";
	static function main(args : string[]) : void {
		var s = Constructor.<_Main>.scalar();
		log s.msg;
		var a = Constructor.<_Main>.array(null);
		a.push(new _Main);
		log a[1].msg;
	}
}
