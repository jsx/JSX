class Test {
	static var foo = Test.x;
	static var bar = Unknown;

	static function run() : void {
		log Test.foo;
		log Test.bar;
	}
}
