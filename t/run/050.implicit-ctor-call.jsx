/*EXPECTED
C#constructor
M#constructor
*/
class C {
	function constructor() {
		log "C#constructor";
	}
}
interface I {
}
mixin M {
	function constructor() {
		log "M#constructor";
	}
}
class Test extends C implements I, M {
	static function run() : void {
		new Test();
	}
}
