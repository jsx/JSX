class _Main {
	static function main (args : string[]) : void {
		(function foo () {
			if (true) {
				return 0;
			} else {
				return "foo";
			}
		})();
	}
}