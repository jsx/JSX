/*EXPECTED
ok
*/
class C.<T> {
	var a : Nullable.<T>;
}
class C2 {
	var a : C.<void>;
}
class _Main {
	static function main (args : string[]) : void {
		log "ok";
	}
}
