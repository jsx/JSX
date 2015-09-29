/*JSX_OPTS
--optimize lambda-lifting
*/
/*EXPECTED
4
*/
class _Main {
	static function main (args : string[]) : void {
		function square (n : number) : number {
			return n * n;
		}
		log square(2);
	}
}
