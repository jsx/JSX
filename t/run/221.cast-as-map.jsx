/*EXPECTED
true
*/

class _Main {
	static function main(args : string[]) : void {
		var a : variant  = function() : void {};

		log "toString" in (a as Map.<variant>);
	}
}
