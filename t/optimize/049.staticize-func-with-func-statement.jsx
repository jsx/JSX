/*EXPECTED
bar
*/
/*JSX_OPTS
--optimize staticize --minify
*/
class _Main {
	final function foo () : void {
		function bar () : void {
			log "bar";
		}
		bar();
	}
	static function main (args : string[]) : void {
		(new _Main).foo();
	}
}