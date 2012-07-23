/*EXPECTED
ok
*/
class Test {
	static function run() : void {
		try {
			log "ok";
		}
		catch (e : Error) {
			var foo = "";
		}
	}
}
