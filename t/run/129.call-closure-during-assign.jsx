/*EXPECTED
hello
hell
hel
he
h

*/
class Test {
	static function run() : void {
		var f = function (s : string) : void {
			log s;
			if (s.length != 0)
				f(s.substring(0, s.length - 1));
		};
		f("hello");
	}
}
