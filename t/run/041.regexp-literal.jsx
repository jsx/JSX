/*EXPECTED
ABcAB
*/
class Test {
	static function run() : void {
		log "abcab".replace(/ab/g, "AB");
	}
}
