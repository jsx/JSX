class _Main {
	static function main(args :string[]) : void {
		for (var i = 1; i <= 100; ++i) {
			if (i % 15 == 0)
				log "FizzBuzz";
			else if (i % 3 == 0)
				log "Fizz";
			else if (i % 5 == 0)
				log "Buzz";
			else
				log i;
		}
	}
}

