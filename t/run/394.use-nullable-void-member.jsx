/*EXPECTED
null
*/

class C {
	var m : Nullable.<void>;
}

class _Main {
	static function main (args : string[]) : void {
		var c = new C;

		log c.m;
	}
}
