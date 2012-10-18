/*EXPECTED
mixin
base
mixin
*/

class Base {
	function message() : string {
		return "base";
	}
}

mixin Mixin {
	override function message() : string {
		return "mixin";
	}
}

class _Main extends Base implements Mixin {
	static function main(args : string[]) : void {
		var t = new _Main;
		var m = t.message(); // "mixin"
		log m;
		var b = new Base;
		m = b.message(); // "base"
		log m;
		b = t;
		m = b.message(); // "mixin"
		log m;
	}
}
