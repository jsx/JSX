mixin M1 {
	function initialize() {
	}
}
mixin M2 {
	function initialize() {
	}
}
class T implements M1, M2 {
	function initialize() {
		M2();
		M1();
	}
}
