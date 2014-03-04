/*EXPECTED
9
*/
class _Main {
	static function f (x : number, f : (number) -> number) : number {
		return f(x);
	}
	static function main (args : string[]) : void {
		var a = 3;
		log _Main.f(a, x => {
			return x * x;
		});
	}
}
