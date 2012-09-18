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
class _Main extends C implements I, M {
	static function main(args : string[]) : void {
		new _Main();
	}
}
