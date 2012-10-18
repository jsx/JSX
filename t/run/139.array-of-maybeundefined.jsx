/*EXPECTED
1,2,3,1
*/
class _Main {
	static function main(args : string[]) : void {
		var a1 = [ 1, 2, 3 ];
		var a2 = [ a1[0] ]; // should not become Array.<MBU.<number>>
		var a3 = a1.concat(a2); // a1 and a2 are Array.<number>
		log a3.join(",");
	}

}
