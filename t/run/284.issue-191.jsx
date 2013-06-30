/*EXPECTED
42
*/

native class Foo {
	static const bar : number;
} = "{ bar: 42 }";

class _Main {
	static function main (args : string[]) : void {
		log Foo.bar;
	}
}
