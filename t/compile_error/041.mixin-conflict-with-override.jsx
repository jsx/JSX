interface I {
	function f() : void;
}
mixin M1 implements I {
	override function f() : void {
	}
}
mixin M2 implements I {
	override function f() : void {
	}
}
class T implements M1, M2 {
}
