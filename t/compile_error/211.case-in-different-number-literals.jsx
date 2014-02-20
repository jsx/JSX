class _Main {
	static function main(args : string[]) : void {
		switch (args.length) {
		// the following code is not actually a bug (since JSX allows expressions to be used in the case labels, and thus same value may appear more than once in the case statements)
		// but for users' convenience, conflicting __literals__ are detected and reported as bugs
		case 0:
		case 0x0:
		}
	}
}
