/*EXPECTED
true
false
true
false
false
true
false
true
*/

class Test {
	static function run() : void {
		log "a" < "b";
		log "b" < "a";
		log "a" <= "b";
		log "b" <= "a";
		log "a" > "b";
		log "b" > "a";
		log "a" >= "b";
		log "b" >= "a";
	}
}
