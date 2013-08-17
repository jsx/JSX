/*EXPECTED
a   x
a   y
a   z
b   x
b   y
b   z
c   x
c   y
c   z
3
9
*/

class _Main {
	static function main(args : string[]) : void {
		var s = 0;
		var t = 0;
		var a = [ "a", "b", "c" ];
		var b = [ "x", "y", "z" ];
		for (var i in a) {
			s += i;
			for (var j in b) {
				log a[i], " ", b[j];
				t += j;
			}
		}
		log s; // 0 + 1 + 2
		log t; // (0 + 1 + 2) * 3
	}
}
