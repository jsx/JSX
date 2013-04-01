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

import "./expression.jsx";
import "./statement.jsx";
import "./classdef.jsx";
import "./type.jsx";
import "./platform.jsx";
import Token from "./parser.jsx";

class Cloner.<T> {

	static function cloneArray (a : T[]) : T[] {
		var r = [] : T[];
		for (var i = 0; i < a.length; ++i)
			r[i] = a[i].clone() as T;
		return r;
	}

	static function cloneNullable (o : T) : T {
		return o == null ? (null) : (o.clone() as T);
	}

}

class Serializer.<T> {

	static function serializeArray (a : T[]) : variant {
		if (a == null)
			return null;
		var ret = [] : variant[];
		for (var i = 0; i < a.length; ++i)
			ret[i] = a[i].serialize();
		return ret;
	}

	static function serializeNullable (v : T) : variant {
		if (v == null)
			return null;
		return v.serialize();
	}

}

class Util {

	static function repeat (c : string, n : number) : string {
		var s = "";
		for(var i = 0; i < n; ++i) {
			s += c;
		}
		return s;
	}

	/**
	 * Usage: Util.format("%1 %% %2", ["foo", "bar"]) -> "foo % bar"
     * @param fmt format template
	 * @param args parameters which are expanded into <code>fmt</code>
	 */
	static function format (fmt : string, args : string[]) : string {
		assert args != null;
		var i = 0;
		return fmt.replace(/%(\d+|%)/g, function(m) {
			if (m == "%%") {
				return "%";
			}
			else {
				var arg = args[(m.substring(1) as int) - 1];
				return arg == null ? "null" : arg;
			}
		});
	}

	static function analyzeArgs (context : AnalysisContext, args : Expression[], parentExpr : Expression, expectedTypes : Type[][]) : Type[] {
		var argTypes = [] : Type[];
		for (var i = 0; i < args.length; ++i) {
			if (args[i] instanceof FunctionExpression && ! (args[i] as FunctionExpression).argumentTypesAreIdentified()) {
				// find the only expected types, by counting the number of arguments
				var funcDef = (args[i] as FunctionExpression).getFuncDef();
				var expectedCallbackType = null : Type;
				for (var j = 0; j < expectedTypes.length; ++j) {
					if (expectedTypes[j][i] != null && expectedTypes[j][i] instanceof FunctionType && (expectedTypes[j][i] as ResolvedFunctionType).getArgumentTypes().length == funcDef.getArguments().length) {
						if (expectedCallbackType == null) {
							expectedCallbackType = expectedTypes[j][i];
						} else if (Util.typesAreEqual((expectedCallbackType as ResolvedFunctionType).getArgumentTypes(), (expectedTypes[j][i] as ResolvedFunctionType).getArgumentTypes())
							&& (expectedCallbackType as ResolvedFunctionType).getReturnType().equals((expectedTypes[j][i] as ResolvedFunctionType).getReturnType())) {
							// function signatures are equal
						} else {
							break;
						}
					}
				}
				if (j != expectedTypes.length) {
					// multiple canditates, skip
				} else if (expectedCallbackType != null) {
					if (! (args[i] as FunctionExpression).deductTypeIfUnknown(context, expectedCallbackType as ResolvedFunctionType))
						return null;
				}
			} else if (args[i] instanceof ArrayLiteralExpression && (args[i] as ArrayLiteralExpression).getExprs().length == 0 && (args[i] as ArrayLiteralExpression).getType() == null) {
				var arrayExpr = args[i] as ArrayLiteralExpression;
				var expectedArrayType = null : Type;
				for (var j = 0; j < expectedTypes.length; ++j) {
					if (expectedTypes[j][i] != null
						&& expectedTypes[j][i] instanceof ObjectType
						&& expectedTypes[j][i].getClassDef() instanceof InstantiatedClassDefinition
						&& (expectedTypes[j][i].getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == 'Array') {
						if (expectedArrayType == null) {
							expectedArrayType = expectedTypes[j][i];
						} else if (expectedArrayType.equals(expectedTypes[j][i])) {
							// type parameters are equal
						} else {
							break;
						}
					}
				}
				if (j != expectedTypes.length) {
					// multiple canditates, skip
				} else if (expectedArrayType != null) {
					arrayExpr.setType(expectedArrayType);
				}
			} else if (args[i] instanceof MapLiteralExpression && (args[i] as MapLiteralExpression).getElements().length == 0 && (args[i] as MapLiteralExpression).getType() == null) {
				var mapExpr = args[i] as MapLiteralExpression;
				var expectedMapType = null : Type;
				for (var j = 0; j < expectedTypes.length; ++j) {
					if (expectedTypes[j][i] != null
						&& expectedTypes[j][i] instanceof ObjectType
						&& expectedTypes[j][i].getClassDef() instanceof InstantiatedClassDefinition
						&& (expectedTypes[j][i].getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == 'Map') {
						if (expectedMapType == null) {
							expectedMapType = expectedTypes[j][i];
						} else if (expectedMapType.equals(expectedTypes[j][i])) {
							// type parameters are equal
						} else {
							break;
						}
					}
				}
				if (j != expectedTypes.length) {
					// multiple canditates, skip
				} else if (expectedMapType != null) {
					mapExpr.setType(expectedMapType);
				}
			}
			if (! args[i].analyze(context, parentExpr))
				return null;
			argTypes[i] = args[i].getType();
		}
		return argTypes;
	}

	static function typesAreEqual (x : Type[], y : Type[]) : boolean {
		if (x.length != y.length)
			return false;
		for (var i = 0; i < x.length; ++i)
			if (! x[i].equals(y[i]))
				return false;
		return true;
	}

	static function forEachStatement (cb : function(:Statement):boolean, statements : Statement[]) : boolean {
		if (statements != null)
			for (var i = 0; i < statements.length; ++i)
				if (! cb(statements[i]))
					return false;
		return true;
	}

	static function forEachExpression (cb : function(:Expression):boolean, exprs : Expression[]) : boolean {
		return Util.forEachExpression(function(expr, _) { return cb(expr); }, exprs);
	}

	static function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean, exprs : Expression[]) : boolean {
		if (exprs != null)
			for (var i = 0; i < exprs.length; ++i) {
				if (! cb(exprs[i], function (exprs : Expression[], index : number) : function(:Expression):void {
					return function (expr : Expression) : void {
						exprs[index] = expr;
					};
				}(exprs, i))) {
					return false;
				}
			}
		return true;
	}

	static function findFunctionInClass (classDef : ClassDefinition, funcName : string, argTypes : Type[], isStatic : boolean) : MemberFunctionDefinition {
		var found = null : MemberFunctionDefinition;
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
	}

	static const _stringLiteralEncodingMap = {
		"\0" : "\\0",
		"\r" : "\\r",
		"\n" : "\\n",
		"\t" : "\\t",
		"\"" : "\\\"",
		"\'" : "\\\'",
		"\\" : "\\\\"
	};

	static function encodeStringLiteral (str : string) : string {
		var escaped = str.replace(/[\0-\x19\\'"\u007f-\uffff]/g, function (ch) {
			if (ch in Util._stringLiteralEncodingMap) {
				return Util._stringLiteralEncodingMap[ch];
			} else {
				var t = "000" + ch.charCodeAt(0).toString(16);
				t = t.substring(t.length - 4);
				return "\\u" + t;
			}
		});
		return "\"" + escaped + "\"";
	}

	static function decodeStringLiteral (literal : string) : string {
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
				decoded += String.fromCharCode(Number.parseInt(matched[1], 16));
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
	}

	static function _resolvedPathParts(path : string) : string[] {
		var tokens = path.split(/[\\\/]+/);
		if (tokens.length == 1) {
			return tokens;
		}

		for (var i = 0; i < tokens.length;) {
			if (tokens[i] == ".") {
				tokens.splice(i, 1);
			} else if (tokens[i] == ".." && i != 0 && tokens[i - 1] != "..") {
				tokens.splice(i - 1, 2);
				i -= 1;
			} else {
				i++;
			}
		}
		return tokens;
	}

	/**
	 * Canonicalizes the given path. e.g. "a/x/../b" to "a/b"
	 */
	static function resolvePath (path : string) : string {
		return Util._resolvedPathParts(path).join("/");
	}

	/**
	 * Solves the relative path from <code>from</code> to <code>to</code>.
	 * e.g. relativePath("/a/b/c", "/a/d/e") to "../d/e"
	 */
	static function relativePath(fromPath : string, toPath: string, isFile : boolean) : string {
		var f = Util._resolvedPathParts(fromPath);
		var t = Util._resolvedPathParts(toPath);

		if (isFile) {
			f.pop(); // use dirname
		}

		// trim the root
		if (f[0] == "") {
			f.shift();
		}
		if (t[0] == "") {
			t.shift();
		}
		var minLen = Math.min(f.length, t.length);
		var samePartsIndex = minLen;
		for (var i = 0; i < minLen; ++i) {
			if (f[i] != t[i]) {
				samePartsIndex = i;
				break;
			}
		}

		var pathParts = new string[];
		for (var i = samePartsIndex; i < f.length; ++i) {
			pathParts.push("..");
		}
		return pathParts.concat(t.slice(samePartsIndex)).join("/");
	}

	static function basename(path : string) : string {
		var parts = Util._resolvedPathParts(path);
		return parts.pop();
	}

	static function dirname(path : string) : string {
		var parts = Util._resolvedPathParts(path);
		parts.pop();
		return parts.join("/");
	}

	static function toOrdinal(n : number) : string {
		if (10 < n && n < 14) {
			return n as string + 'th';
		}
		switch (n % 10) {
			case 1:  return n as string + 'st';
			case 2:  return n as string + 'nd';
			case 3:  return n as string + 'rd';
			default: return n as string + 'th';
		}
	}

	static function makeErrorMessage (platform : Platform, message : string, filename : Nullable.<string>, lineNumber : number, columnNumber : number, size : number) : string {
		if (filename == null) {
			return message + "\n";
		}

		var content = platform.load(filename);
		var sourceLine = content.split(/\n/)[ lineNumber - 1 ] + "\n";

		// fix visual width
		var TAB_WIDTH = 4;
		var tabs = sourceLine.slice(0, columnNumber).match(/\t/g);
		if(tabs != null) {
			columnNumber += (TAB_WIDTH-1) * tabs.length;
		}

		sourceLine  = sourceLine.replace(/\t/g, Util.repeat(" ", TAB_WIDTH));
		sourceLine += Util.repeat(" ", columnNumber);
		sourceLine += Util.repeat("^", size);

		return Util.format("[%1:%2:%3] %4\n%5\n", [filename, lineNumber as string, columnNumber as string, message, sourceLine]);
	}

}

/*
 * Tow-value data structure class
 */
class Pair.<T,U> {

	var first  : T;
	var second : U;

	function constructor(first : T, second : U) {
		this.first = first;
		this.second = second;
	}

}

/*
 * Three-value data structure class
 */
class Triple.<T,U,V> {

	var first  : T;
	var second : U;
	var third  : V;

	function constructor(first : T, second : U, third : V) {
		this.first = first;
		this.second = second;
		this.third = third;
	}

}

/**
 * Map-like container with specified type of keys.
 */
class TypedMap.<K,V> {

	var _list =  new Pair.<K,V>[];
	var _equalsCallback : function(:K,:K):boolean;

	function constructor() {
		this(function(x, y) { return x == y; });
	}

	function constructor(equalsCallback : function(:K,:K):boolean) {
		this._equalsCallback = equalsCallback;
	}

	function clone () : TypedMap.<K,V> {
		var x = new TypedMap.<K,V>(this._equalsCallback);
		x._list = this._list.concat([]);
		return x;
	}

	function has(key : K) : boolean {
		return ! this.forEach(function (entryKey, entryValue) {
			return ! this._equalsCallback(key, entryKey);
		});
	}

	function set(key : K, val : V) : void {
		for (var i = 0; i < this._list.length; ++i) {
			if (this._equalsCallback(this._list[i].first, key)) {
				this._list[i].second = val;
				return;
			}
		}
		this._list.push(new Pair.<K,V>(key, val));
	}

	function get(key : K) : Nullable.<V> {
		for (var i = 0; i < this._list.length; ++i) {
			if (this._equalsCallback(this._list[i].first, key)) {
				return this._list[i].second;
			}
		}
		return null;
	}

	function delete(key : K) : void {
		for (var i = 0; i < this._list.length; ++i) {
			if (this._equalsCallback(this._list[i].first, key)) {
				this._list.splice(i, 1);
				return;
			}
		}
	}

	function clear() : void {
		this._list.splice(0, this._list.length);
	}

	function forEach (cb : function(:K,:V):boolean) : boolean {
		for (var i = 0; i < this._list.length; ++i) {
			var e = this._list[i];
			if (! cb(e.first, e.second)) {
				return false;
			}
		}
		return true;
	}

	function reversedForEach (cb : function(:K,:V):boolean) : boolean {
		for (var i = this._list.length-1; i >= 0; --i) {
			var e = this._list[i];
			if (! cb(e.first, e.second)) {
				return false;
			}
		}
		return true;
	}

}

class TemplateInstantiationRequest {

	var _token : Token;
	var _className : string;
	var _typeArgs : Type[];

	function constructor (token : Token, className : string, typeArgs : Type[]) {
		this._token = token;
		this._className = className;
		this._typeArgs = typeArgs;
	}

	function getToken () : Token {
		return this._token;
	}

	function getClassName () : string {
		return this._className;
	}

	function getTypeArguments () : Type[] {
		return this._typeArgs;
	}

}

abstract class CompileIssue {

	var _filename : Nullable.<string>;
	var _lineNumber : number;
	var _columnNumber : number;
	var _message : string;
	var _size : number;

	function constructor (token : Token, message : string) {
		if(token != null) {
			this._filename = token.getFilename();
			this._lineNumber = token.getLineNumber();
			this._columnNumber = token.getColumnNumber();
			// FIXME: deal with visual width
			this._size = token.getValue().length;
			this._message = message;
		}
		else {
			this._filename = null;
			this._lineNumber = 0;
			this._columnNumber = -1;
			this._message = message;
			this._size = 1;
		}
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		this._filename = filename;
		this._lineNumber = lineNumber;
		this._columnNumber = columnNumber;
		this._message = message;
		this._size = 1;
	}

	function format (platform : Platform) : string {
		return Util.makeErrorMessage(platform, this.getPrefix() + this._message, this._filename, this._lineNumber, this._columnNumber, this._size);
	}

	abstract function getPrefix () : string;

}

class CompileError extends CompileIssue {

	var _notes : CompileNote[];

	function constructor (token : Token, message : string) {
		super(token, message);
		this._notes = new CompileNote[];
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
		this._notes = new CompileNote[];
	}

	function addCompileNote (note : CompileNote) : void {
		this._notes.push(note);
	}

	function addCompileNotes (notes : CompileNote[]) : void {
		notes.forEach( (note) -> {
			this.addCompileNote(note);
		});
	}

	function getCompileNotes () : CompileNote[] {
		return this._notes;
	}

	override function getPrefix () : string {
		return "";
	}

}

class CompileWarning extends CompileError {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

	override function getPrefix () : string {
		return "Warning: ";
	}

}

class DeprecatedWarning extends CompileWarning {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

}

class CompileNote extends CompileIssue {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

	override function getPrefix () : string {
		return "Note: ";
	}

}

// vim: set noexpandtab:
