import "common.jsx";

class Klass {
	static function doit() : void {
		Template.<Klass>.doit();
	}
	static function say() : void {
		log "a";
	}
}
