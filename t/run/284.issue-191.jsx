/*EXPECTED
42
*/

native("{ bar: 42 }") class Foo {
	static const bar : number;
}

class _Main {
	static function main (args : string[]) : void {
		log Foo.bar;
	}
}
