class T {
	static function f() : void {
		var i;
		do {
			break;
		} while ((i = 0) != 0);
		log i;
	}
}
