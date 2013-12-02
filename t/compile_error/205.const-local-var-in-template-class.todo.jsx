class Foo.<T> {
	function foo () : void {
		const a = 2;
		(function () : void {
			a = 10;
		}());
		log a;
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Foo.<string>().foo();
	}
}
