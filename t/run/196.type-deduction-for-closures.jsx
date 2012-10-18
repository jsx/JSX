/*EXPECTED
ok
*/
class _Main {
	static function main(args : string[]) : void {
		var f = function (block : function():void) : void {
			block();
		};

		f( () -> { log "ok"; } );
	}
}
