class C.<T> {
	static function f() : T {
		return new T();
	}
}
class Test {
	static function run() : void {
		log C.<number>.f();
	}
}
