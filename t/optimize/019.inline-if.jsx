/*EXPECTED
Yes
*/
/*JSX_OPTS
--optimize inline,fold-const
*/

class _Main {
	static function odd(n : number) : boolean {
		return n %2 != 0;
	}
	static function main(args : string[]) : void {
		if (_Main.odd(1)) {
			log "Yes";
		} else {
			log "No";
		}
	}
}
