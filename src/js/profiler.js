(function () {

	var Profiler = $__jsx_profiler;

	var StackEntry = function (name, now) {
		this.name = name;
		this.inclusive = now;
		this.exclusive = now;
	};

	var stack = [ new StackEntry(null, 0, 0) /* dummy */ ];
	var functions = {};

	Profiler.enter = function (name) {
		var now = Date.now();
		stack[stack.length - 1].exclusive -= now;
		stack.push(new StackEntry(name, now));
		return stack.length;
	};

	Profiler.exit = function (retval) {
		var entry = stack.pop();
		var now = Date.now();
		Profiler._log(entry.name, now - entry.inclusive, now - entry.exclusive);
		stack[stack.length - 1].exclusive += now;
		return retval;
	};

	Profiler.resume = function (context) {
		while (context < stack.length) {
			Profiler.exit();
		}
	};

	Profiler._log = function (name, inclusive, exclusive) {
		var entry = functions[name];
		if (entry == null) {
			entry = functions[name] = {
				count: 0,
				inclusive: 0,
				exclusive: 0
			};
		}
		++entry.count;
		entry.inclusive += inclusive;
		entry.exclusive += exclusive;
	};

	Profiler.getResults = function () {
		return {
			functions: functions
		};
	};

})();
