/*EXPECTED
false
false
false
false
false
false
false
false
false
false
false
*/

class Test {
	static function run() : void {
		var map = new Map.<string>;

		// defined in ECMA 262
		log "constructor" in map;
		log "toString" in map;
		log "toLocaleString" in map;
		log "valueOf"  in map;
		log "hasOwnProperty" in map;
		log "isPrototypeOf" in map;
		log "propertyIsEnumerable" in map;

		// not in ECMA 262
		log "__defineGetter__" in map;
		log "__defineSetter__" in map;
		log "__lookupGetter__" in map;
		log "__lookupSetter__" in map;
	}
}
