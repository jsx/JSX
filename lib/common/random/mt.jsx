/**

Mersenne-Twister pseude-random generator ported from mt19937ar.c

SYNOPSIS:

	// constructor
	var mt = new MT(42);
	var mt = new MT([0x123, 0x234, 0x345, 0x456]);

	// re-initialization
	mt.initalize(Date.now());
	mt.initialize([Date.now(), Date.now()]);

	// get the next 32-bit integer (0 < x < 0xffffffff)
	log mt.nextInt32();

	// get the next 53-bit floating point number (0.0 < x < 1.0)
	log mt.nextReal53();

 */

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

import "random/generator.jsx";

final class MT implements RandomGenerator {
	// Period parameters
	static const _N = 624;
	static const _M = 397;
	static const _MATRIX_A = 0x9908b0df;   // constant vector a
	static const _UPPER_MASK = 0x80000000; // most significant w-r bits
	static const _LOWER_MASK = 0x7fffffff; // least significant r bits

	// multiplies uint32_t
	static function _mul(a : number, b : number) : number {
		var a1 = a >>> 16;
		var a2 = a & 0xffff;
		var b1 = b >>> 16;
		var b2 = b & 0xffff;

		return (((a1 * b2 + a2 * b1) << 16) + a2 * b2) >>> 0;
	}

	var _mt = [] : number[]; // the state vector
	var _mti = 0;          // mti == N+1 means mt[N] is not initialized

	function constructor() {
		this.init(5489); // default initial seed
	}

	function constructor(seed : number) {
		this.init(seed);
	}
	function constructor(seeds : number[]) {
		this.init(seeds);
	}

	function init(s : number) : void {
		var mt = this._mt;
		mt[0] = s >>> 0;

		for(var i = 1; i < MT._N; ++i) {
			mt[i] = MT._mul(1812433253, mt[i-1] ^ (mt[i-1] >>> 30)) + i;
		}
		this._mti = i;
	}

	function init(seeds : number[]) : void {
		this.init(19650218);

		var mt = this._mt;

		var i = 1;
		var j = 0;
		var k = MT._N > seeds.length ? MT._N : seeds.length;

		for (; k > 0; --k) {
			mt[i] = (mt[i] ^ MT._mul(mt[i-1] ^ (mt[i-1] >>> 30), 1664525))
				+ (seeds[j] >>> 0) + j;

			++i;
			++j;

			if (i >= MT._N) {
				mt[0] = mt[MT._N-1];
				i = 1;
			}
			if (j >= seeds.length) {
				j = 0;
			}
		}
		for (k = MT._N-1; k > 0; --k) {
			mt[i] = (mt[i] ^ MT._mul(mt[i-1] ^ (mt[i-1] >>> 30), 1566083941))
				- i;

			++i;
			if (i >= MT._N) {
				mt[0] = mt[MT._N-1];
				i = 1;
			}
		}
		mt[0] = 0x80000000; // MSB is 1; assuring non-zero initial array
	}

	static const _mag01 = [ 0x0, MT._MATRIX_A ];
	/**
	 * generates a random number on [0,0xffffffff]-interval
	 */
	override function nextInt32() : number {
		var mt = this._mt;
		if (this._mti >= MT._N) {
			var kk = 0;
			for (; kk < MT._N - MT._M; ++kk) {
				var y = (mt[kk] & MT._UPPER_MASK) | (mt[kk+1] & MT._LOWER_MASK);
				mt[kk] = (mt[kk+MT._M] ^ (y >>> 1) ^ MT._mag01[y & 0x1]) >>> 0;
			}
			for (; kk < MT._N - 1; ++kk) {
				var y = (mt[kk] & MT._UPPER_MASK) | (mt[kk+1] & MT._LOWER_MASK);
				mt[kk] = (mt[kk+(MT._M-MT._N)] ^ (y >>> 1) ^ MT._mag01[y & 0x1]) >>> 0;
			}
			var y = (mt[MT._N-1] & MT._UPPER_MASK) | (mt[0] & MT._LOWER_MASK);
			mt[MT._N-1] = (mt[MT._M-1] ^ (y >>> 1) ^ MT._mag01[y & 0x1]) >>> 0;

			this._mti = 0;
		}

		var y = mt[this._mti++];

		// Tempering
		y ^= (y >>> 11);
		y ^= (y <<  7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var mt = new MT([0x123, 0x234, 0x345, 0x456]);
		//log mt._mt[1];
		var row = [] : number[];
		for (var i = 0; i < 10; ++i) {
			row.push(mt.nextInt32());
			if(row.length == 5) {
				log row.join(" ");
				row.length = 0;
			}
		}
	}
}

