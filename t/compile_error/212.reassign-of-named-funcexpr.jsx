class _Main {
	static function main(args : string[]) : void {
		log (function f() : number {
			f = null;
			return 123;
		})();
	}
}
