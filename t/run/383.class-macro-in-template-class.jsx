/*EXPECTED
hi
*/
class Foo.<T> {
	static function construct() : __CLASS__ {
		return new __CLASS__;
	}
	function doit() : void {
		T.doit();
	}
}
class _Main {
	static function doit() : void {
		log "hi";
	}
	static function main(args : string[]) : void {
		Foo.<_Main>.construct().doit();
	}
}
