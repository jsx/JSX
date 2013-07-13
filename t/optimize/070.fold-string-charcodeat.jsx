/*EXPECTED
102
111
111
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		log "foo".charCodeAt(0);
		log "foo".charCodeAt(1);
		log "foo".charCodeAt(2);
	}
}
