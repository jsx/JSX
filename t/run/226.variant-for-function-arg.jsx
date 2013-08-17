/*EXPECTED
f
f
*/
class _Main {
	static function f(x : variant) : void {
		log "f";
	}
	static function main(args : string[]) : void {
		_Main.f([]);
		_Main.f({});
	}
}