/*EXPECTED
check()
true
true
1
true
true
1
0
check()
true
true
1
true
true
1
0
undefined
0
0
1
undefined
*/
/*JSX_OPTS
--profile
*/

class _Main {
	static function spendTime() : void {
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
	}
	static function g(reset : boolean) : void {
		if (reset) {
			JSX.resetProfileResults();
		}
		_Main.spendTime();
		// spend time inline
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
	}
	static function h() : void {
		// spend time inline and in callee
		_Main.spendTime();
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
		// reset in callee
		(function () : void {
			JSX.resetProfileResults();
		})();
	}
	static function main(args : string[]) : void {
		function check() : void {
			log "check()";

			var m = JSX.getProfileResults();

			var exclusive = m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["_Main.spendTime()"]["$exclusive"] as number;
			log 10 <= exclusive && exclusive <= 11;
			var inclusive = m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["_Main.spendTime()"]["$inclusive"] as number;
			log 10 <= inclusive && inclusive <= 11;
			log m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["_Main.spendTime()"]["$count"];
			exclusive = m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["$exclusive"] as number;
			log 10 <= exclusive && exclusive <= 11;
			inclusive = m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["$inclusive"] as number;
			log 20 <= inclusive && inclusive <= 21;
			log m["_Main.main(:Array.<string>)"]["_Main.g(:boolean)"]["$count"];
			log m["_Main.main(:Array.<string>)"]["$count"]; // should be zero, since it has not exitted
		}
		// simple test
		_Main.g(false);
		check();
		// reset and test
		_Main.g(true);
		check();
		// check that callees are being reset
		JSX.resetProfileResults();
		var m = JSX.getProfileResults();
		log m["_Main.main(:Array.<string>)"]["_Main.g()"]; // should be undefined
		// check reset in callee
		_Main.h();
		var m = JSX.getProfileResults();
		log m["_Main.main(:Array.<string>)"]["_Main.h()"]["$exclusive"];
		log m["_Main.main(:Array.<string>)"]["_Main.h()"]["$inclusive"];
		log m["_Main.main(:Array.<string>)"]["_Main.h()"]["$count"];
		log m["_Main.main(:Array.<string>)"]["_Main.h()"]["_Main.spendTime()"]; // undefined
	}
}
