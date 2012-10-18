/*EXPECTED
0
*/
/*JSX_OPTS
--optimize return-if,inline
*/
class _Main {
	static function f(n : number) : number {
		if (n < 1)
			return 0;
		return n;
	}
	static function main(args : string[]) : void {
		var s = _Main.f(0) as string;
		log s;
	}
}
