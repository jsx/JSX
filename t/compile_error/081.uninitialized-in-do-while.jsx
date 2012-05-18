class T {
	static function f(n : number) : boolean {
		var ret;
		do {
			if (n != 0)
				break;
			ret = true;
		} while (false);
		return ret;
	}
}
