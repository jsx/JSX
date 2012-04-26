/*EXPECTED
C#initialize
M#initialize
*/
class C {
	function initialize() {
		log "C#initialize";
	}
}
interface I {
}
mixin M {
	function initialize() {
		log "M#initialize";
	}
}
class Test extends C implements I, M {
	static function run() : void {
		new Test();
	}
}
