/*EXPECTED
hmm
*/
class _Main {
	static function main(args : string[]) : void {
		for (var i = 0; i < 10;) {
			++i;
		}
		log "hmm";
	}
}
