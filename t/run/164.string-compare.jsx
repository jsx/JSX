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

class _Main {
	static function main(args : string[]) : void {
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
