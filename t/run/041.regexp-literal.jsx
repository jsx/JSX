/*EXPECTED
ABcAB
*/
class _Main {
	static function main(args : string[]) : void {
		log "abcab".replace(/ab/g, "AB");
	}
}
