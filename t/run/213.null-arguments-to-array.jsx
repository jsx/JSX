/*EXPECTED
-1
null
0
null
1
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ 0 ];
		a.push(null);
		a.push(1);
		a.unshift(null);
		a.unshift(-1);
		log a[0];
		log a[1];
		log a[2];
		log a[3];
		log a[4];
	}
}
