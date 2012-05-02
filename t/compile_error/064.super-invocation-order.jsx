interface I1 {
}
interface I2 {
}
class Foo implements I1, I2 {
	function initialize() {
		I2();
		I1();
	}
}
