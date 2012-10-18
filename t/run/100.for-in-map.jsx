/*EXPECTED
a,1
b,2
c,3
a,b,c
*/

class _Main {
	static function main(args : string[]) : void {
		var m = { a: 1, b : 2, c : 3 };
		for (var k in m)
			log k + "," + m[k] as string;
		var a = [] : string[];
		var i = 0;
		for (a[i++] in m)
			;
		log a.sort().join(",");
	}
}
