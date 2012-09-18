/*EXPECTED
hello
*/

class _Main {
	static function f() : void {
		log "hello";
	}
	static function main(args : string[]) : void {
		var a = [ _Main.f ];
		a[0]();
	}
}
