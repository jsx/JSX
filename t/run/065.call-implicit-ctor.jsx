/*EXPECTED
*/
class Base {
}
interface Interface {
}
class _Main extends Base implements Interface {
	function constructor() {
		Base();
		Interface();
	}
	static function main(args : string[]) : void {
		new _Main();
	}
}
