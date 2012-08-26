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

class Test {
	static function spendTime() : void {
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
	}
	static function g(reset : boolean) : void {
		if (reset) {
			JSX.resetProfileResults();
		}
		Test.spendTime();
		// spend time inline
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
	}
	static function h() : void {
		// spend time inline and in callee
		Test.spendTime();
		var until = Date.now() + 10;
		while (Date.now() < until)
			;
		// reset in callee
		(function () : void {
			JSX.resetProfileResults();
		})();
	}
	static function run() : void {
		function check() : void {
			log "check()";

			var m = JSX.getProfileResults();

			var exclusive = m["Test.run()"]["Test.g(:boolean)"]["Test.spendTime()"]["$exclusive"] as number;
			log 10 <= exclusive && exclusive <= 11;
			var inclusive = m["Test.run()"]["Test.g(:boolean)"]["Test.spendTime()"]["$inclusive"] as number;
			log 10 <= inclusive && inclusive <= 11;
			log m["Test.run()"]["Test.g(:boolean)"]["Test.spendTime()"]["$count"];
			exclusive = m["Test.run()"]["Test.g(:boolean)"]["$exclusive"] as number;
			log 10 <= exclusive && exclusive <= 11;
			inclusive = m["Test.run()"]["Test.g(:boolean)"]["$inclusive"] as number;
			log 20 <= inclusive && inclusive <= 21;
			log m["Test.run()"]["Test.g(:boolean)"]["$count"];
			log m["Test.run()"]["$count"]; // should be zero, since it has not exitted
		}
		// simple test
		Test.g(false);
		check();
		// reset and test
		Test.g(true);
		check();
		// check that callees are being reset
		JSX.resetProfileResults();
		var m = JSX.getProfileResults();
		log m["Test.run()"]["Test.g()"]; // should be undefined
		// check reset in callee
		Test.h();
		var m = JSX.getProfileResults();
		log m["Test.run()"]["Test.h()"]["$exclusive"];
		log m["Test.run()"]["Test.h()"]["$inclusive"];
		log m["Test.run()"]["Test.h()"]["$count"];
		log m["Test.run()"]["Test.h()"]["Test.spendTime()"]; // undefined
	}
}
