/*EXPECTED
undefined
3
undefined
0
3
0
undefined
3
undefined
*/
class Test {
	static function run() : void {
		var a = [ undefined, 3 ] : Array.<variant>;
		log a[0];
		log a[1];
		log a[2];
		log a[0] as int;
		log a[1] as int;
		log a[2] as int;
		log a.shift();
		log a.shift();
		log a.shift();
	}
}
