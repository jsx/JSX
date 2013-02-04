/*EXPECTED
f
g1
*/
class _Main {
	static function f(x : number[]) : void {
		log "f";
	}
	static function g(x : number, y : number[]) : void {
		log "g1";
	}
	static function g(x : number, y : number) : void {
		log "g2";
	}
	static function main(args : string[]) : void {
		_Main.f([]);
		_Main.g(0, []);
	}
}