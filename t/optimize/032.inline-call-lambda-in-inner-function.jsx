/*EXPECTED
foo
*/

/*JSX_OPTS
--optimize inline
*/

class _Main {
	static function main(args : string[]) : void {
		function f():void {
			(function():void {
				log "foo".slice(0);
			}());
		}
		f();
	}
}
