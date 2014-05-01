/***
 * JSX interface to JavaScript
 *
 * @author DeNA., Co., Ltd.
 */

/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

final native class js {
	delete function constructor();

	/**
	 * The JavaScript global object. You should cast the value to use it in JSX
	 */
	static var global : Map.<variant>;

	/**
	 * Invokes an arbitrary method of an object. <br />
	 * e.g. <code>js.invoke(js.global["Math"], "abs", [-10])</code> results in <code>10</code>
	 * @param invocant a JavaScript object
	 * @param methodName a name of JavaScript method that the invocant has
	 * @param args list of arguments passed to the method
	 */
	static function invoke(invocant : variant, methodName : string, args : Array.<variant>) : variant;

	/**
	 * Evaluates JavaScript source code
	 */
	static function eval(jsSource : string) : variant;

	/**
	 * new Function
	 */
	static function newFunction(...argsAndBody : string) : variant;

} = """(function () {
	var global = Function("return this")();
	return {
		global: global,
		eval: global.eval,
		invoke: function(invocant, methodName, args) {
			return invocant[methodName].apply(invocant, args);
		},
		newFunction: Function
	};
}())""";
