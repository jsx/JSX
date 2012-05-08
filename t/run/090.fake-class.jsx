/*EXPECTED
hello
*/

native __fake__ class Foo {
	var name : string;
}

class Test {
	static function run() : void {
		var f : Foo = { name: "hello" } as __nocheck__ Foo;
		log f.name;
	}
}
