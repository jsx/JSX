/*EXPECTED
*/
class Base {
}
interface Interface {
}
class Test extends Base implements Interface {
	function constructor() {
		Base();
		Interface();
	}
	static function run() : void {
		new Test();
	}
}
