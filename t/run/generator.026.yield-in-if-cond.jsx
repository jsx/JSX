/*EXPECTED
0
1
2
3
4
-1
*/
class _Main {
	static function main (args : string[]) : void {
		function * incr () : Generator.<number,number> {
			var i = 0;
			while ((yield i++) != 0)
				;
			yield -1;
		}

		var g = incr();
		log g.next().value;
		log g.next().value;
		log g.next().value;
		log g.next().value;
		log g.next().value;
		log g.next(0).value;	// stop
	}
}
