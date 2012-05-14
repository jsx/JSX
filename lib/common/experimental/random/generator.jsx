// see also random/mt.jsx

mixin RandomGenerator {

	/**
	 * generates a random number on [0,0xffffffff]-interval
	 */
	abstract function nextInt32() : number;

	/**
	 * generates a random number on [0,1)-real-interval
	 */
	function nextReal32() : number {
		return this.nextInt32() * (1.0/4294967296.0); // devided by 2^32
	}

	/**
	 * generates a random number on [0,1) with 53-bit resolution
	 */
	function nextReal53() : number {
		var a = this.nextInt32() >>> 5;
		var b = this.nextInt32() >>> 6;
		return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
	}
}

