/*EXPECTED
1
hello
bar
bar
bar
bar
2
hello
world
*/
class Test {
	static function run() : void {
		var j : variant = {
			n: 1,
			s: "hello",
			m: {
				foo: "bar"
			},
			a: [
				"hello",
				"world"
			]
		} : Map.<variant>;
		log j.n;
		log j["s"];
		log j.m.foo;
		log j.m["foo"];
		log j["m"].foo;
		log j["m"]["foo"];
		log j.a.length;
		for (var i = 0; i < j.a.length as number; ++i) {
			log j.a[i];
		}
	}
}
