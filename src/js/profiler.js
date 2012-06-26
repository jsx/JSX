(function () {

	var Profiler = $__jsx_profiler;

	var stack = [ {
		$name: "<<root>>",
		$cur_exclusive: Date.now()
	} ];

	Profiler.enter = function (name) {
		var now = Date.now();
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive -= now;
		var callee = caller[name];
		if (callee) {
			callee.$cur_inclusive = now;
			callee.$cur_exclusive = now;
		} else {
			callee = caller[name] = {
				$name: name,
				$cur_inclusive: now,
				$cur_exclusive: now,
				$inclusive: 0,
				$exclusive: 0,
				$count: 0
			};
		}
		stack.push(callee);
		return stack.length;
	};

	Profiler.exit = function (retval) {
		var now = Date.now();
		var callee = stack.pop();
		++callee.$count;
		callee.$exclusive += now - callee.$cur_exclusive;
		callee.$inclusive += now - callee.$cur_inclusive;
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive += now;
		return retval;
	};

	Profiler.resume = function (context) {
		while (context < stack.length) {
			Profiler.exit();
		}
	};

	Profiler.getResults = function () {
		return stack[0];
	};

	Profiler.postResults = function (url) {
		// post target should support gist-style API
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.log(xhr.responseText);
				} else {
					console.log("failed to upload profiler results, received " + xhr.status + " response from server");
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(Profiler.getResults()));
	};

})();
