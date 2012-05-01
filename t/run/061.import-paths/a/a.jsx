import "../b/b.jsx";

class A {
	static function callB() : void {
		B.say();
	}
	static function say() : void {
		log "A";
	}
}
