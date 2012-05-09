/*EXPECTED
0,a
1,b
2,c
*/

class Test {
	static function run() : void {
		var a = [ "a", "b", "c" ];
		for (var i in a)
			log i as string + "," + a[i];
	}
}
