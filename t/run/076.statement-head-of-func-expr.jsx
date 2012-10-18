/*EXPECTED
foo
bar
*/

class _Main {
	static function main(args : string[]) : void {
		(function() : void { log "foo"; }());
		(function() : void { log "bar"; })();
	}
}
