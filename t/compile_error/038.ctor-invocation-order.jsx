mixin M1 {
	function constructor() {
	}
}
mixin M2 {
	function constructor() {
	}
}
class T implements M1, M2 {
	function constructor() {
		M2();
		M1();
	}
}
