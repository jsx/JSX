/*EXPECTED
ok
*/
class Base {
	function foo () : void {}
}
interface Iface {
	function foo () : void;
}
class Derived extends Base implements Iface {
	override function foo () : void {
		log "ok";
	}
}

class _Main {
	static function main (args : string[]) : void {
		(new Derived).foo();
	}
}