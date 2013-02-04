class _Main {
	static function main(args : string[]) : void {
		var foo = function bar () {
		};

		bar;		// error
	}
}