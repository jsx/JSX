/*EXPECTED
caught
caught 2
*/
/*JSX_OPTS
*/
class _Main {
    static function main(args : string[]) : void {
		try {
			String.fromCharCode(_Main.b());
			log "failed";
		} catch (e : Error) {
			log "caught";
		}
		try {
			String.fromCharCode(97, _Main.b());
			log "failed 2";
		} catch (e : Error) {
			log "caught 2";
		}
    }

    static function b() : Nullable.<number> {
        return null;
    }
}
// vim: set expandtab:
