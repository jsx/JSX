/*EXPECTED
hello world!
*/

class Base {
    function hello() :string {
        return "hello world!";
    }
}

class Test extends Base {
	static function run() : void {
		var o = new Test();
		log o.hello();
	}
}
