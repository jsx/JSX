class Test {
	static const STATIC_VAR = "static";
	const INSTANCE_VAR = "instance";

	static function run() : void {
		Test.STATIC_VAR = "new value";
		(new Test()).INSTANCE_VAR + "new value";
	}
}

