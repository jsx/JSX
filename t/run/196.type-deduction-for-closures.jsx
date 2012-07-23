/*EXPECTED
ok
*/
class Test {
	static function run() : void {
		var f = function (block : function():void) : void {
			block();
		};

		f( () -> { log "ok"; } );
	}
}
