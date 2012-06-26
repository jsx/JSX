/*EXPECTED
1,2,
,2,
1,2,
,2,
1,2,
,2,
*/
class Test {
	static function run() : void {
		var a =  [ 1, 2, null ];
		log a.join(",");
		a[0] = null;
		log a.join(",");
		a = [ 1, 2, null ] : number[];
		log a.join(",");
		a[0] = null;
		log a.join(",");
		a = [ 1, 2, null ] : Array.<number>;
		log a.join(",");
		a[0] = null;
		log a.join(",");
	}
}
