/*EXPECTED
1,2,3
1,2,3,1,2,3
1,2,3,4,5
abc
*/

class _Main {
	static function main(args : string[]) : void {
		var a = [ 1, 2, 3 ];
		log a.concat().join(",");
		log a.concat(a).join(",");
		log a.concat([ 4 ], [ 5 ]).join(",");
		log String.fromCharCode(97, 98, 99);
	}
}
