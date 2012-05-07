class T {
	static function f() : void {
	l:
		while (true) {
			do {
				continue l;
			} while (false);
		}
	}
}
