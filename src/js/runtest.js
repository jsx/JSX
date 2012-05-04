/*
	test launcher invoked by jsx --test
*/
function $__jsx_runTests(testClass, tests) {
	if (!testClass) return; // skip if there's no test class

	if(tests.length === 0) {
		var p = testClass.prototype;
		for (var m in p) {
			if (p[m] instanceof Function
				&& /^test.*[$]$/.test(m)) {
				tests.push(m);
			}
		}
	}

	if (tests.length === 0) {
		return;
	}

	var tasks = [];


	var test = new testClass();

	if (test.beforeClass$AS != null)
		test.beforeClass$AS(tests);

	for (var i = 0; i < tests.length; ++i) {
		(function (m) {
			tasks.push(function() {
				if (test.before$S != null)
					test.before$S(m);

				test.done$ = function () {
					if (test.after$S != null) 
						test.after$S(m);
					if (tasks.length !== 0) {
						var next = tasks.shift();
						next();
					}
					else { // all the tasks finished
						if (test.afterClass$ != null)
							test.afterClass$();
					}
				};

				test[m]();
			});
		}(tests[i]));
	}

	var start = tasks.shift();
	start();
}
