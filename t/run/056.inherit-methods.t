/*EXPECTED
hello world!
*/

class Base {
    function hello() :string {
        return "hello world!";
    }
}

class Test {
	static function run() : void {
		log this.hello();
	}
}
