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
		var a =  [ 1, 2, undefined ];
		log a.join(",");
		a[0] = undefined;
		log a.join(",");
		a = [ 1, 2, undefined ] : number[];
		log a.join(",");
		a[0] = undefined;
		log a.join(",");
		a = [ 1, 2, undefined ] : Array.<number>;
		log a.join(",");
		a[0] = undefined;
		log a.join(",");
	}
}
