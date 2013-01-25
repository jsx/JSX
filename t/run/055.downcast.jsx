/*EXPECTED
true
error
error
true
*/
class Base {
}
interface I {
}
class D1 extends Base implements I {
	function say() : void {
		log "D1";
	}
}
class D2 extends Base implements I {
	function say() : void {
		log "D2";
	}
}
class _Main {
	static function main(args : string[]) : void {
		var b : Base = new D1();
		var d1 = b as D1;
		log d1 != null;
		try {
			var d2 = b as D2;
		} catch (e : Error) {
			log "error";
		}
		var i : I = new D2();
		try {
			d1 = i as D1;
		} catch (e : Error) {
			log "error";
		}
		d2 = i as D2;
		log d2 != null;
	}
}
