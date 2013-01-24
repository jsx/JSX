class _Main {
	static function main(args : string[]) : void {
		var foo = [0,1,2,3];
		
		foo.forEach(function bang (n : number) : void {
			if (n == 0)
				return;
			else
				bang(n - 1);
		});
		
		bang();		// error
	}
}