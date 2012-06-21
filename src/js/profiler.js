(function () {

	var Profiler = $__jsx_profiler;

	var StackEntry = function (name, now) {
		this.name = name;
		this.accumulated = now;
		this.only = now;
	};

	var stack = [ new StackEntry(null, 0, 0) /* dummy */ ];
	var functions = {};

	Profiler.enter = function (name) {
		var now = Date.now();
		stack[stack.length - 1].only -= now;
		stack.push(new StackEntry(name, now));
		return stack.length;
	};

	Profiler.exit = function (retval) {
		var entry = stack.pop();
		var now = Date.now();
		Profiler._log(entry.name, now - entry.accumulated, now - entry.only);
		stack[stack.length - 1].only += now;
		return retval;
	};

	Profiler.resume = function (context) {
		while (context < stack.length) {
			Profiler.exit();
		}
	};

	Profiler._log = function (name, accumulated, only) {
		var entry = functions[name];
		if (entry == null) {
			entry = functions[name] = {
				count: 0,
				accumulated: 0,
				only: 0
			};
		}
		++entry.count;
		entry.accumulated += accumulated;
		entry.only += only;
	};

	Profiler.getResults = function () {
		return {
			functions: functions
		};
	};

})();
