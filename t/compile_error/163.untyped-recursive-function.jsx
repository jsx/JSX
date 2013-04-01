class _Main {
	static function main(args : string[]) : void {
		(function fact (n : number) {
			if (n == 0) {
				return 1;
			} else {
				return n * fact(n - 1);
			}
		})(10);
	}
}