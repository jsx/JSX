/*EXPECTED
1
hello
bar
2
hello
world
*/
class _Main {
	static function main(args : string[]) : void {
		var j = JSON.parse('{"n":1,"s":"hello","m":{"foo":"bar"},"a":["hello","world"]}');
		log j["n"];
		log j["s"];
		log j["m"]["foo"];
		log j["a"]["length"];
		for (var i = 0; i < j["a"]["length"] as number; ++i) {
			log j["a"][i];
		}
	}
}
