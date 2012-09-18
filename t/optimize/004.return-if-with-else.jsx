/*EXPECTED
0
1
*/
/*JSX_OPTS
--optimize return-if
*/

class _Main {
	static function f(b : boolean) : number {
		if (b)
			return 1;
		else
			return 0;
	}
	static function main(args : string[]) : void {
		log _Main.f(false);
		log _Main.f(true);
	}
}
