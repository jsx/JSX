/*EXPECTED
hello
*/
class _Main {
	static function f() : void {
		log "hello";
	}
	static function main(args : string[]) : void {
		__CLASS__.f();
	}
}
