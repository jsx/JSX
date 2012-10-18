/*EXPECTED
hello
*/

native __fake__ class Foo {
	var name : string;
}

class _Main {
	static function main(args : string[]) : void {
		var f : Foo = { name: "hello" } as __noconvert__ Foo;
		log f.name;
	}
}
