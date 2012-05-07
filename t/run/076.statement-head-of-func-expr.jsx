/*EXPECTED
foo
bar
*/

class Test {
	static function run() : void {
		(function() : void { log "foo"; }());
		(function() : void { log "bar"; })();
	}
}
