/*EXPECTED
3
1
4
a
b
true
true
3
1
4
3
1
4
*/
class Test {
	static function run() : void {
		var a = [ 3, 1, 4 ];
		log a[0];
		log a[1];
		log a[2];
		var b = [ "a", "b", null ];
		log b[0];
		log b[1];
		log b[2] == null;
		log b[3] == undefined;
		var c = [ 3, 1, 4 ] : number[];
		log c[0];
		log c[1];
		log c[2];
		var d = [ 3, 1, 4 ] : Array.<number>;
		log d[0];
		log d[1];
		log d[2];
	}
}
