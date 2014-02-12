class _Main {
	static function main (args : string[]) : void {
		// we cannot introduce "X -> Y" style type declaration, e.g.:
		var add = (x : number, y : number) : number -> x -> y;
	}
}
