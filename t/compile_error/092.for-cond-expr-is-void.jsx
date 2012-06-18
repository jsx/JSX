class T {
	static function f() : void {
		for (; T.f(); )
			;
	}
}
