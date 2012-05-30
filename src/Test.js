/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

"use strict";
/*
# NAME

Test - Nestable Testing libraries

# SYNOPSIS

	var Test = require('/path/to/Test');

	var test = new Test(__filename); // create a test case

	test.beforeEach(function() { ... });
	test.afterEach(function() { ... });

	test.describe('first test case', function(t) {
		var x = 42;

		t.expect(x).toBe(42);
		t.expect(x).notToBe(3.14);
		t.expect(x).toBeFalsy('message');

		return 'foo';
	}).next('second test case', function(t, value) {
		t.expect(vallue).toBe('foo');
	});

	test.done();
*/


var Class = require("./Class");
var dump  = require("./dump");

var Test = module.exports = Class.extend({
	constructor: function(filename, parent) {
		this._parent  = parent;
		this._name    = filename;
		this._count   = 0;
		this._pass    = 0;
		this._start   = Date.now();
		this._status  = 0; // exit code

		this.verbose = true;
		if(typeof(process) !== 'undefined' && !process.stdout.isTTY) {
			this.verbose = false;
		}

		this.note('Testing', this.toString());
	},

	toString: function() {
		return 'Test(' + dump(this._name) + ')';
	},

	describe: function(name, block) {
		this._doBlock(name, block);
		return this;
	},

	next: function(name, block) {
		if(this._nextArg == null) {
			this._ok(false, name);
		}
		else {
			this._doBlock(name, block, this._nextArg);
		}
		return this;
	},

	setNextArg: function(nextArg) {
		this._nextArg = nextArg;
	},

	_doBlock: function(name, block, nextArg) {
		var subtest = new Test.Subtest(name, this);
		this.note(name);
		try {
			if(nextArg != null) {
				block(subtest, nextArg);
			}
			else {
				block(subtest);
			}
		} catch(e) {
			this._status = 1;

			this.fail('subtest ' + name + "\n" + e.stack);

			subtest.done(null);
		}
	},

	expect: function(value, message) {
		return new Test.Matcher(this, ++this._count, value, message);
	},

	fail: function(message) {
		++this._count;
		this._ok(false, message);
	},

	_ok: function(result, message, diagnostics) {
		var args = [];

		if(result) {
			++this._pass;
			args.push('ok');
		}
		else {
			args.push('not ok');
		}

		args.push(this._count);

		args.push('-', message);
		this.log.apply(this, args);

		if(diagnostics != null) {
			this.diag((new Error(diagnostics)).stack);
		}
	},

	done: function() {
		this.log('1..' + this._count);

		if(this._count !== this._pass) {
			this.diag('Looks like you failed',
					  (this._count - this._pass),
					  'test of', this._count);
			this._status = 1;
		}
		this.note('elapsed', Date.now() - this._start, 'ms.');

		process.exit(this._status);
	},

	// format mes
	// sages
	_makeMessage: function(__va_args__) {
		var m = Array.prototype.join.call(arguments, ' ');
		var s = m.split(/\n/);
		var first = s.shift();

		if(s.length === 0) {
			return first;
		}
		else {
			return first + "\n" + s.join("\n").replace(/^/mg, '# ');
		}
	},

	explain: function(v) {
		return dump(v);
	},

	note: function(__va_args__) {
		if(!this.verbose) {
			return;
		}

		var m = Array.prototype.join.call(arguments, ' ');
		console.warn('# ' + this._makeMessage(m));
	},
	diag: function(__va_args__) {
		var m = Array.prototype.join.call(arguments, ' ');
		console.warn('# ' + this._makeMessage(m));
	},
	log: function(__va_args__) {
		var m = Array.prototype.join.call(arguments, ' ');
		console.log(m);
	}
});

Test.Subtest = Class.extend({
	constructor: function(name, parent) {
		this._name   = name;
		this._parent = parent;
	},
	toString: function() {
		return this._parent.toString() + '.' +
			'Subtest(' + dump(this._name) + ')';
	},

	done: function(nextArg) {
		this._parent.setNextArg(nextArg);
	},

	describe: function(_) {
		this._parent.describe.apply(this._parent, arguments);
	},
	next: function(_) {
		this._parent.next.apply(this._parent, arguments);
	},

	expect: function(_) {
		return this._parent.expect.apply(this._parent, arguments);
	},

	explain: function(_) {
		return this._parent.explain.apply(this._parent, arguments);
	},
	note: function(_) {
		this._parent.note.apply(this._parent, arguments);
	},
	diag: function(_) {
		this._parent.diag.apply(this._parent, arguments);
	},
	log: function(_) {
		this._parent.log.apply(this._parent, arguments);
	}
});

Test.Matcher = Class.extend({
	constructor: function(context, id, value, message) {
		this._context = context;
		this._id      = id;
		this._value   = value;
		this._message = message;
	},
	toString: function() {
		return 'Test.Matcher( #' + id + " "+ dump(this._value) +  ')';
	},

	// matchers
	toBe: function(expected) {
		if(this._value === expected) {
			this._context._ok(true, this._message);
		}
		else {
			this._context._ok(false, this._message,
				"Failed to test " + this._id + "\n" +
				"Expected: " + dump(expected) + "\n" +
				"Got:      " + dump(this._value)
			);
		}
	},
	toBeInstanceOf: function(expectedClass) {
		if(this._value instanceof expectedClass) {
			this._context._ok(true, this._message);
		}
		else {
			this._context._ok(false, this._message,
				"Failed to test " + this._id + "\n" +
				"Expected class: " + expectedClass + "\n" +
				"Got instance:   " + this._value
			);
		}
	},
	toBeTruthy: function() {
		if(this._value) {
			this._context._ok(true, this._message);
		}
		else {
			this._context._ok(false, this._message,
				"Failed to test " + this._id + " to be truthy\n" +
				"Got: " + dump(this._value)
			);
		}
	},
	toBeFalsy: function() {
		if(!this._value) {
			this._context._ok(true, this._message);
		}
		else {
			this._context._ok(false, this._message,
				"Failed to test " + this._id + " to be falsy\n" +
				"Got: " + dump(this._value)
			);
		}
	}
});
