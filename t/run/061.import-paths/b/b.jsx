import "../a/a.jsx";

class B {
	static function callA() : void {
		A.say();
	}
	static function say() : void {
		log "B";
	}
}
