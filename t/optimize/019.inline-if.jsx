/*EXPECTED
Yes
*/
/*JSX_OPTS
--optimize inline,fold-const
*/

class Test {
	static function odd(n : number) : boolean {
		return n %2 != 0;
	}
	static function run() : void {
		if (Test.odd(1)) {
			log "Yes";
		} else {
			log "No";
		}
	}
}
