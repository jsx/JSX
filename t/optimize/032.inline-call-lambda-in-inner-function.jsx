/*EXPECTED
*/

/*JSX_OPTS
--optimize inline
*/

class _Main {
	static function main(args : string[]) : void {
		function f():void {
			(function():void {
				"foo".slice(0);
			}());
		}
	}
}
