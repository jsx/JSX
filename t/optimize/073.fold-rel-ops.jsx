/*EXPECTED
true
false
true
false
true
false
true
false
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		log 0 < 1;
		log 1 < 1;

		log 1 <= 1;
		log 2 <= 1;

		log 1 > 0;
		log 1 > 1;

		log 1 >= 1;
		log 1 >= 2;
	}
}
