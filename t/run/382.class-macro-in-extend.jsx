/*EXPECTED
hi
*/
class Foo.<T> {
	function doit() : void {
		T.doit();
	}
}

class _Main extends Foo.<__CLASS__> {
	static function doit() : void {
		log "hi";
	}
	static function main(args : string[]) : void {
		(new __CLASS__).doit();
	}
}
