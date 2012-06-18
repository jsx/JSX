class T {
	static function f() : void {
		while (T.f())
			;
	}
}
