class T {
	static function f() : void {
		for (var i = 0; i < 2; ++i) {
			break l;
		}
	}
}
