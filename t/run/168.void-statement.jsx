/*EXPECTED
hello
*/
class Test {
	static function f() : number {
		log "hello";
		return 0;
	}
	static function run() : void {
		void Test.f();
	}
}
