/*EXPECTED
hello
*/
class _Main {
	static function f() : number {
		log "hello";
		return 0;
	}
	static function main(args : string[]) : void {
		void _Main.f();
	}
}
