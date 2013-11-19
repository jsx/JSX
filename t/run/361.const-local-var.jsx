/*EXPECTED
1
2
3
*/
class C {
}

class _Main {
	static function main (args : string[]) : void {
		const a = 1;

		log a;

		const b = "2", c = 3;

		log b;
		log c;
	}
}
