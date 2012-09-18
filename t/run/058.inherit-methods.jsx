/*EXPECTED
hello world!
*/

class Base {
    function hello() :string {
        return "hello world!";
    }
}

class _Main extends Base {
	static function main(args : string[]) : void {
		var o = new _Main();
		log o.hello();
	}
}
