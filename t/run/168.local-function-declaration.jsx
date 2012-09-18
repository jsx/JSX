/*EXPECTED
3
2
1
0
bang
3
2
1
0
bang
*/

class _Main {
	static function main(args : string[]) : void {
		function bang1(n : number) : string {
			log n;
			if ( n == 0 ) {
				return "bang";
			} else {
				return bang1(n-1);
			}
		}

		// function expression still alive
		var bang2 = function(n : number) : string {
			log n;
			if ( n == 0 ) {
				return "bang";
			} else {
				return bang2(n-1);
			}
		};

		log bang1(3);
		log bang2(3);
	}
}
