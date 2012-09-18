/*EXPECTED
3
1
4
a
b
3
1
4
3
1
4
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ 3, 1, 4 ];
		log a[0];
		log a[1];
		log a[2];
		var b = [ "a", "b" ];
		log b[0];
		log b[1];
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
