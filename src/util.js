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

var Class = require("./Class");

var Util = exports.Util = Class.extend({

	$cloneArray: function (a) {
		var r = [];
		for (var i = 0; i < a.length; ++i)
			r[i] = a[i].clone();
		return r;
	},

	$cloneNullable: function (o) {
		return o == null ? null : o.clone();
	},

	$serializeArray: function (a) {
		if (a == null)
			return null;
		var ret = [];
		for (var i = 0; i < a.length; ++i)
			ret[i] = a[i].serialize();
		return ret;
	},

	$serializeNullable: function (v) {
		if (v == null)
			return null;
		return v.serialize();
	},

	$repeat: function(c, n) {
		var s = "";
		for(var i = 0; i < n; ++i) {
			s += c;
		}
		return s;
	},

	// Usage: format("%1 %% %2", ["foo", "bar"]) -> "foo % bar"
	$format: function(fmt, args) {
		if(!(args instanceof Array)) {
			throw new Error("args must be an Array");
		}

		var i = 0;
		return fmt.replace(/%(\d+|%)/g, function(s, f) {
			if (f === "%") {
				return "%";
			}
			else {
				return args[parseInt(f) - 1];
			}
		});
	},

	$analyzeArgs: function (context, args, parentExpr, expectedCallbackTypes) {
		var Expression = require("./expression");
		var argTypes = [];
		for (var i = 0; i < args.length; ++i) {
			if (args[i] instanceof Expression.FunctionExpression && ! args[i].typesAreIdentified()) {
				// find the only expected types, by counting the number of arguments
				var funcDef = args[i].getFuncDef();
				var expectedCallbackType = null;
				for (var j = 0; j < expectedCallbackTypes.length; ++j) {
					if (expectedCallbackTypes[j][i].getArgumentTypes().length == funcDef.getArguments().length) {
						if (expectedCallbackType == null) {
							expectedCallbackType = expectedCallbackTypes[j][i];
						} else if (Util.typesAreEqual(expectedCallbackType.getArgumentTypes(), expectedCallbackTypes[j][i].getArgumentTypes())
							&& expectedCallbackType.getReturnType().equals(expectedCallbackTypes[j][i].getReturnType())) {
							// function signatures are equal
						} else {
							break;
						}
					}
				}
				if (j != expectedCallbackTypes.length) {
					// multiple canditates, skip
				} else if (expectedCallbackType != null) {
					if (! funcDef.deductTypeIfUnknown(context, expectedCallbackType))
						return null;
				}
			}
			if (! args[i].analyze(context, parentExpr))
				return null;
			argTypes[i] = args[i].getType();
		}
		return argTypes;
	},

	$typesAreEqual : function (x, y) {
		if (x.length != y.length)
			return false;
		for (var i = 0; i < x.length; ++i)
			if (! x[i].equals(y[i]))
				return false;
		return true;
	},

	$forEachStatement: function (cb, statements) {
		if (statements != null)
			for (var i = 0; i < statements.length; ++i)
				if (! cb(statements[i]))
					return false;
		return true;
	},

	$forEachExpression: function (cb, exprs) {
		if (exprs != null)
			for (var i = 0; i < exprs.length; ++i) {
				if (! cb(exprs[i], function (exprs, index) {
					return function (expr) {
						exprs[index] = expr;
					};
				}(exprs, i))) {
					return false;
				}
			}
		return true;
	},

	$findFunctionInClass: function (classDef, funcName, argTypes, isStatic) {
		var ClassDefinition = require("./classdef.js").ClassDefinition;
		var found = null;
		classDef.forEachMemberFunction(function (funcDef) {
			if (isStatic == ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
				&& funcDef.name() == funcName
				&& Util.typesAreEqual(funcDef.getArgumentTypes(), argTypes)) {
				found = funcDef;
				return false;
			}
			return true;
		});
		return found;
	},

	$encodeStringLiteral: function (str) {
		var escaped = str.replace(/[\0- '"\\\u007f-\uffff]/g, function (ch) {
			if (ch == "\0") {
				return "\\0";
			} else if (ch == "'" || ch == "\"" || ch == "\\") {
				return "\\" + ch;
			} else {
				var t = "000" + ch.charCodeAt(0).toString(16);
				t = t.substring(t.length - 4);
				return "\\u" + t;
			}
		});
		return "\"" + escaped + "\"";
	},

	$decodeStringLiteral: function (literal) {
		var matched = literal.match(/^([\'\"]).*([\'\"])$/);
		if (matched == null || matched[1] != matched[2])
			throw new Error("input string is not quoted properly: " + literal);
		var src = literal.substring(1, literal.length - 1);
		var decoded = "";
		var pos = 0, backslashAt;
		while ((backslashAt = src.indexOf("\\", pos)) != -1) {
			// copy the string before backslash
			decoded += src.substring(pos, backslashAt);
			pos = backslashAt + 1;
			// decode
			if (pos == src.length)
				throw new Error("last character within a string literal cannot be a backslash: " + literal);
			var escapeChar = src.charAt(pos++);
			switch (escapeChar) {
			case "'":
			case "\"":
			case "\\":
				decoded += escapeChar;
				break;
			case "b": decoded += "\b"; break;
			case "f": decoded += "\f"; break;
			case "n": decoded += "\n"; break;
			case "r": decoded += "\r"; break;
			case "t": decoded += "\t"; break;
			case "v": decoded += "\v"; break;
			case "u":
				var matched = src.substring(pos).match(/^([0-9A-Fa-f]{4})/);
				if (matched == null)
					throw new Error("expected four hexdigits after \\u: " + literal);
				decoded += String.fromCharCode(parseInt(matched[1], 16));
				pos += 4;
				break;
			case "0":
				if (pos == src.length || src.charAt(pos).match(/[0-9]/) == null)
					decoded += "\0";
				else
					throw new Error("found a digit after '\\0': " + literal);
				break;
			}
		}
		decoded += src.substring(pos);
		return decoded;
	},

	$resolvePath: function (path) {
		var tokens = path.split("/");
		for (var i = 0; i < tokens.length;) {
			if (tokens[i] == ".") {
				tokens.splice(i, 1);
			} else if (tokens[i] == ".." && i != 0 && tokens[i - 1] != "..") {
				if (i == 1 && tokens[0] == "") {
					tokens.splice(i, 1);
				} else {
					tokens.splice(i - 1, 2);
					i -= 1;
				}
			} else {
				i++;
			}
		}
		return tokens.join("/");
	}

});

var TypedMap = exports.TypedMap = Class.extend({

	constructor: function (equalsCallback) {
		this._list = [];
		this._equalsCallback = equalsCallback;
	},

	exists: function (key) {
		return ! this.forEach(function (entryKey, entryValue) {
			return ! this._equalsCallback(key, entryKey);
		});
	},

	get: function (key) {
		for (var i = 0; i < this._list.length; ++i) {
			if (this._equalsCallback(this._list[i].key, key)) {
				return this._list[i].value;
			}
		}
		return null;
	},

	set: function (key, value) {
		for (var i = 0; i < this._list.length; ++i) {
			if (this._equalsCallback(this._list[i].key, key)) {
				this._list[i].value = value;
				return;
			}
		}
		this._list.push({ key: key, value: value });
	},

	forEach: function (cb) {
		for (var i = 0; i < this._list.length; ++i) {
			var e = this._list[i];
			if (! cb(e.key, e.value)) {
				return false;
			}
		}
		return true;
	}

});

var TemplateInstantiationRequest = exports.TemplateInstantiationRequest = Class.extend({

	constructor: function (token, className, typeArgs) {
		this._token = token;
		this._className = className;
		this._typeArgs = typeArgs;
	},

	getToken: function() {
		return this._token;
	},

	getClassName: function () {
		return this._className;
	},

	getTypeArguments: function () {
		return this._typeArgs;
	}

});

var CompileIssue = exports.CompileError = Class.extend({

	constructor: function () {
		switch (arguments.length) {
		case 2: // token, text
			var token = arguments[0];
			if(token != null) {
				this._filename = token.getFilename();
				this._lineNumber = token.getLineNumber();
				this._columnNumber = token.getColumnNumber();
				// FIXME: deal with visual width
				this._size = token.getValue().length;
				this._message = arguments[1];
			}
			else {
				CompileError.call(this, null, 0, -1, arguments[1]);
			}
			break;
		case 4: // filename, lineNumber, columnNumber, text
			this._filename = arguments[0];
			this._lineNumber = arguments[1];
			this._columnNumber = arguments[2];
			this._message = arguments[3];
			this._size = 1;
			break;
		default:
			throw new Error("Unrecognized arguments for CompileError: " + Array.prototype.join.call(arguments, ", ") );

		}
	},

	format: function (compiler) {
		if (this._filename == null) {
			return this._message + "\n";
		}

		var content = compiler.getFileContent([] /* ignore errors */, null, this._filename);
		var sourceLine = content.split(/\n/)[ this._lineNumber - 1 ] + "\n";

		// fix visual width
		var col = this._columnNumber;
		var TAB_WIDTH = 4;
		var tabs = sourceLine.slice(0, col).match(/\t/g);
		if(tabs != null) {
			col += (TAB_WIDTH-1) * tabs.length;
		}

		sourceLine  = sourceLine.replace(/\t/g, Util.repeat(" ", TAB_WIDTH));
		sourceLine += Util.repeat(" ", col);
		sourceLine += Util.repeat("^", this._size);

		return Util.format("[%1:%2:%3] %4%5\n%6\n",
						   [this._filename, this._lineNumber, col, this.getPrefix(), this._message, sourceLine]);
	}

});

var CompileError = exports.CompileError = CompileIssue.extend({

	constructor: function () {
		CompileIssue.prototype.constructor.apply(this, arguments);
	},

	getPrefix: function () {
		return "";
	}

});

var CompileWarning = exports.CompileWarning = CompileIssue.extend({

	constructor: function () {
		CompileIssue.prototype.constructor.apply(this, arguments);
	},

	getPrefix: function () {
		return "Warning: ";
	}

});

var DeprecatedWarning = exports.DeprecatedWarning = CompileWarning.extend({

	constructor: function () {
		CompileWarning.prototype.constructor.apply(this, arguments);
	}

});

// vim: set noexpandtab:
