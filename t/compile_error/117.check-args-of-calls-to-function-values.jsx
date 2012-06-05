class Test {
	static function f() : void {
		(function(elem : number) : void { log elem; })();
	}
}
