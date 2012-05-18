/*EXPECTED
8
5
10
4
2
*/
class Test {
	static function run() : void {
		var i : int;
		var n : number;

		i = 7;
		n = 1.5;
		log (i += n);
		log (i -= n);
		log (i *= n);
		log (i /= n);

		i = 7;
		n = 2;
		log (i %= n);
	}
}
