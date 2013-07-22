/*EXPECTED
str0
0str
*/
class _Main {
	static function main (args : string[]) : void {
		log "str" + 0;
		log 0 + "str";
	}
}