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

/***
 * <p>The file defines the APIs of the built-in objects of JSX, designed to be compatible to <a href="http://www.ecma-international.org/publications/standards/Ecma-262-arch.htm">the 3rd edition of the ECMA-262 standard</a> whenever possible.</p>
 *
 * <p>The description of the API is based on <a href="https://developer.mozilla.org/en/JavaScript/Reference/">the MDN JavaScript Reference</a> under the <a href="http://creativecommons.org/licenses/by-sa/2.5/">Creative Commons: Attribution-Sharealike license</a>.</p>
 *
 * @author DeNA., Co., Ltd.
 */

/**
 * The root class of all classes.
 */
native class Object {

	/**
	 * Returns a string representing the object.
	 */
	function toString() : string;

}

/**
 * Map is an associative container that contains a list of unique key-value pairs.  Type of the keys are strings, type of the values are Nullable.&lt;T&gt;.
 */
native final class Map.<T> {

	function __native_index_operator__(key : string) : Nullable.<T>;

	/**
	 * Returns a boolean indicating whether the object has the specified property.
	 *
	 * @param key The name of the property to test.
	 */
	function hasOwnProperty(key : string) : boolean;

}

/**
 * A class representing a static function.
 * Unlike JavaScript, JSX does not provide <em>Function#call()</em> or <em>Function#apply()</em> since it is a statically-typed language.
 */
native final class Function {

	delete function constructor();

}

/**
 * <p>Array is a sequence of Nullable.&lt;T&gt; values.  The size of an array is not fixed.</p>
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
 */
native final class Array.<T> {

	/**
	 * Constructs an empty array.
	 */
	function constructor();

	/**
	 * Constructs an array of given length.  The elements are initialized to null.
	 */
	function constructor(length : number);

	function __native_index_operator__(n : number) : Nullable.<T>;

	/**
	 * Returns a string representing the object.
	 */
	override function toString() : string;

	/**
	 * Returns a string representing the object.
	 */
	function toLocaleString() : string;

	/**
	 * Returns a new array comprised of this array joined with other array(s) and/or value(s).
	 *
	 * @param arrayN Arrays to concatenate to the resulting array.
	 */
	function concat(...arrayN : Array.<T>) : Array.<T>;

	/**
	 * Joins all elements of an array into a string, separating each element with a comma.
	 */
	function join() : string;

	/**
	 * Joins all elements of an array into a string.
	 *
	 * @param separator Specifies a string to separate each element of the array.
	 */
	function join(separator : string) : string;

	/**
	 * Removes the last element from an array and returns that element.
	 *
	 * @return The last element of the array that has been removed, or null if the array was empty.
	 */
	function pop() : Nullable.<T>;

	/**
	 * Mutates an array by appending the given elements and returning the new length of the array.
	 *
	 * @param itemN The elements to add to the end of the array.
	 */
	function push(...itemN : T) : int;

	/**
	 * Reverses an array in place.  The first array element becomes the last and the last becomes the first.
	 *
	 * @return Returns reference to itself.
	 */
	function reverse() : Array.<T>;

	/**
	 * Removes the first element from an array and returns that element. This method changes the length of the array.
	 *
	 * @return The first element of the array that has been removed, or null if the array was empty.
	 */
	function shift() : Nullable.<T>;

	/**
	 * Returns a one-level deep copy of a portion of an array.
	 *
	 * @param start Zero-based index at which to begin extraction.
	 */
	function slice(start : number) : Array.<T>;

	/**
	 * Returns a one-level deep copy of a portion of an array.
	 *
	 * @param start Zero-based index at which to begin extraction.
	 * @param end Zero-based index at which to end extraction. slice extracts up to but not including end.
	 */
	function slice(start : number, end : number) : Array.<T>;

	/**
	 * Sorts the elements of an array in place and returns the array.
	 * The sort is not necessarily stable.
	 * The array is sorted lexicographically (in dictionary order) according to the string conversion of each element.
	 */
	function sort() : Array.<T>;

	/**
	 * Sorts the elements of an array in place and returns the array.
	 * The sort is not necessarily stable.
	 *
	 * @param comparefn Specifies a function that defines the sort order.
	 */
	function sort(comparefn : function (x : Nullable.<T>, y : Nullable.<T>) : number) : Array.<T>;

	/**
	 * Changes the content of an array, adding new elements while removing old elements.
	 *
	 * @param start Index at which to start changing the array. If negative, will begin that many elements from the end.
	 * @param deleteCount An integer indicating the number of old array elements to remove.
	 * @param itemN The elements to add to the array.  If you don't specify any elements, <code>splice</code> simply removes elements from the array.
	 *
	 * @return An array containing the removed elements. If only one element is removed, an array of one element is returned.
	 */
	function splice(start : number, deleteCount : number, ...itemN : T) : Array.<T>;

	/**
	 * Adds one or more elements to the beginning of an array and returns the new length of the array.
	 *
	 * @param itemN The elements to add to the front of the array.
	 * @return The new <code>length</code> property of the object upon which the method was called.
	 */
	function unshift(...itemN : T) : int;

	// 15.4.4 (ES5)
	/**
	 * Returns the first index at which a given element can be found in the
	 * array, or -1 if it is not present.
	 */
	function indexOf(value : Nullable.<T>) : number;
	function indexOf(value : Nullable.<T>, fromIndex : number) : number;

	/**
	 * Returns the last index at which a given element can be found in the
	 * array, or -1 if it is not present. The array is searched backward.
	 */
	function lastIndexOf(value : Nullable.<T>) : number;
	function lastIndexOf(value : Nullable.<T>, fromIndex : number) : number;

	/**
	 * Tests whether all elements in the array pass the test implemented by
	 * the provided function.
	 *
	 * @callbackfn A function to test for each element.
	 */
	function every(callbackfn : function(value : Nullable.<T>) : boolean) : boolean;
	function every(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : boolean;
	function every(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : boolean;

	/**
	 * Tests whether some element in the array passes the test implemented
	 * by the provided function.
	 */
	function some(callbackfn : function(value : Nullable.<T>) : boolean) : boolean;
	function some(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : boolean;
	function some(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : boolean;

	/**
	 * Calls callbackfn once for each element in the array, in ascending
	 * order.
	 *
	 * @param callbackfn A function to call for each element.
	 */
	inline function forEach(callbackfn : function(value : Nullable.<T>) : void) : void {
		for (var i in this) {
			callbackfn(this[i]);
		}
	}
	function forEach(callbackfn : function(value : Nullable.<T>, index : number) : void) : void;
	function forEach(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : void) : void;

	/**
	 * Creates a new array with the results of calling a provided function
	 * on every element in this array.
	 *
	 * @param callbackfn A function that produces an element of the new
	 *        <code>Array.&lt;U&gt;</code> from an element of the current one.
	 */
	function map.<U>(callbackfn : function(value : Nullable.<T>) : Nullable.<U>) : Array.<U>;
	function map.<U>(callbackfn : function(value : Nullable.<T>, index : number) : Nullable.<U>) : Array.<U>;
	function map.<U>(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : Nullable.<U>) : Array.<U>;

	/**
	 * Creates a new array with all elements that pass the test implemented
	 * the provided function.
	 *
	 * @param callback A function to test each elements of the array.
	 */
	function filter(callbackfn : function(value : Nullable.<T>) : boolean) : Array.<T>;
	function filter(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : Array.<T>;
	function filter(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : Array.<T>;

	/**
	 * Apply a function against an accumulator and each value of the array
	 * (from left-to-right) as to reduce it to a single value.
	 *
	 * <code>reduce</code> will throw <code>TypeError</code> if the array
	 * contains no elements and no initialValue is suplied.
	 *
	 * @param callbackfn A function to execute on each value in the element,
	 *        taking four arguments: the previousValue (the value previously
	 *        returned in the last invocation of the callback), the
	 *        currentValue (the current element being processed in the array),
	 *        the currentIndex and the array.
	 */
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>) : Array.<T>;
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number) : Nullable.<T>) : Array.<T>;
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number, array : Array.<T>) : Nullable.<T>) : Array.<T>;
	/* with initial value; won't throw exception. */
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T) : Array.<T>;
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number) : Nullable.<T>, initialValue : T) : Array.<T>;
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number, array : Array.<T>) : Nullable.<T>, initialValue : T) : Array.<T>;


	/**
	 * Apply a function simultaneously against two values of the array
	 * (from right-to-left) as to reduce it to a single value.
	 */
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number) : Nullable.<T>) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>, currentIndex : number, array : Array.<T>) : Nullable.<T>) : Array.<T>;

	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T, currentIndex : number) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T, currentIndex : number, array : Array.<T>) : Array.<T>;

	/**
	 * <p>A positive integer between 0 and a value less than 2<sup>32</sup> that specifies the number of elements in an array.</p>
	 *
	 * <p>You can set the length property to truncate an array at any time. When you extend an array by changing its length property, the created elements are initialized to null.</p>
	 */
	var length : number;
}

/**
 * <p>A wrapper object for primitive <code>string</code>s.</p>
 *
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
 */
native final class String {

	/**
	 * Constructs a String object containing an empty string.
	 */
	function constructor();

	/**
	 * Constructs a String object wrapping the given string.
	 */
	function constructor(s : string);

	/**
	 * Constructs a String object wrapping the value wrapped by the given object.
	 */
	function constructor(s : String);

	/**
	 * Returns a string value containing as many characters as the number of arguments.
	 */
	static function fromCharCode(...charN : number) : string;

	/**
	 * Returns this string value. (Note that, for a String object, the toString method happens to return the same thing as the valueOf method.)
	 */
	override function toString() : string;

	/**
	 * Returns this string value.
	 */
	function valueOf() : string;

	/**
	 * Returns a string containing the character at position <code>pos</code> in the string resulting from converting this object to a string. If there is no character at that position, the result is the empty string. The result is a string value, not a String object.
	 */
	function charAt(pos : number) : string;

	/**
	 * Returns a number (a nonnegative integer less than 2<sup>16</sup>) representing the code point value of the character at position pos in the string resulting from converting this object to a string. If there is no character at that position, the result is NaN.
	 */
	function charCodeAt(pos : number) : number;

	/**
	 * When the <code>concat</code> method is called with zero or more arguments <code>string1</code>, <code>string2</code>, etc., it returns a string consisting of the characters of this object followed by the characters of each of string1, string2, etc. The result is a string value, not a String object.
	 */
	function concat(...stringN : string) : string;

	/**
	 * If searchString appears as a substring of the result of converting this object to a string then the index of the smallest such position is returned; otherwise, -1 is returned.
	 */
	function indexOf(searchString : string) : int;

	/**
	 * If searchString appears as a substring of the result of converting this object to a string, at one or more positions that are greater than or equal to position, then the index of the smallest such position is returned; otherwise, -1 is returned.
	 */
	function indexOf(searchString : string, position : number) : int;

	/**
	 * If searchString appears as a substring of the result of converting this object to a string then the index of the greatest such position is returned; otherwise, -1 is returned.
	 */
	function lastIndexOf(searchString : string) : int;

	/**
	 * If searchString appears as a substring of the result of converting this object to a string at one or more positions that are smaller than or equal to position, then the index of the greatest such position is returned; otherwise, -1 is returned.
	 */
	function lastIndexOf(searchString : string, position : number) : int;

	/**
	 * Returns a number indicating whether a reference string comes before or after or is the same as the given string in sort order.
	 *
	 * Returns a number indicating whether a reference string comes before or after or is the same as the given string in sort order. Returns a negative number if the string occurs earlier in a sort than compareString, returns a positive number if the string occurs afterwards in such a sort, and returns 0 if they occur at the same level.
	 *
	 * @param that The string against which the referring string is comparing.
	 */
	function localeCompare(that : string) : number;

	/**
	 * Used to retrieve the matches when matching a string against a regular expression.
	 *
	 * If the regular expression does not include the g flag, returns the same result as regexp.exec(string).  If the regular expression includes the g flag, the method returns an Array containing all matches. If there were no matches, the method returns null.  The returned Array has an extra input property, which contains the regexp that generated it as a result. In addition, it has an index property, which represents the zero-based index of the match in the string.
	 *
	 * @param regexp A regular expression object.
	 */
	function match(regexp : RegExp) : string [];

	/**
	 * Returns a new string with some or all matches of a pattern replaced by a replacement.
	 */
	function replace(searchValue : string, replaceValue : string) : string;

	/**
	 * Returns a new string with some or all matches of a pattern replaced by a replacement.
	 */
	function replace(searchValue : RegExp, replaceValue : string) : string;

	/**
	 * Returns a new string with some or all matches of a pattern replaced by a replacement.
	 */
	function replace(searchValue : string, replaceValue : function(matched :string):string) : string;

	/**
	 * Returns a new string with some or all matches of a pattern replaced by a replacement.
	 */
	function replace(searchValue : RegExp, replaceValue : function(matched :string):string) : string;

	/**
	 * Executes the search for a match between a regular expression and this <code>String</code> object.
	 */
	function search(searchValue : string) : int;

	/**
	 * Executes the search for a match between a regular expression and this <code>String</code> object.
	 */
	function search(searchValue : RegExp) : int;

	/**
	 * Extracts a section of a string and returns a new string.
	 *
	 * @param start The zero-based index at which to begin extraction.
	 */
	function slice(start : number) : string;

	/**
	 * Extracts a section of a string and returns a new string.
	 *
	 * @param start The zero-based index at which to begin extraction.
	 * @param end The zero-based index at which to end extraction.
	 */
	function slice(start : number, end : number) : string;

	/**
	 * Splits a String object into an array of strings by separating the string into substrings.
	 *
	 * @param separator Specifies the character sequence to use for separating the string.
	 */
	function split(separator : string) : string [];

	/**
	 * Splits a String object into an array of strings by separating the string into substrings.
	 *
	 * @param separator Specifies the character sequence to use for separating the string.
	 * @param limit Integer specifying a limit on the number of splits to be found.  The <code>split</code> method still splits on every match of <code>separator</code>, but it truncates the returned array to at most <code>limit</code> elements.
	 */
	function split(separator : string, limit : number) : string [];

	/**
	 * Splits a String object into an array of strings by separating the string into substrings.
	 *
	 * @param separator Specifies an regular expression to use for separating the string.
	 */
	function split(separator : RegExp) : string [];

	/**
	 * Splits a String object into an array of strings by separating the string into substrings.
	 *
	 * @param separator Specifies an regular expression to use for separating the string.
	 * @param limit Integer specifying a limit on the number of splits to be found.  The <code>split</code> method still splits on every match of <code>separator</code>, but it truncates the returned array to at most <code>limit</code> elements.
	 */
	function split(separator : RegExp, limit : number) : string [];

	/**
	 * Returns a subset of a <code>string</code> starting at the given offset.
	 *
	 * @param start The zero-based index at which to begin extraction.
	 */
	function substring(start : number) : string;

	/**
	 * Returns a subset of a <code>string</code> starting at the given offset.
	 *
	 * @param start The zero-based index at which to begin extraction.
	 * @param end The zero-based index at which to end extraction.
	 */
	function substring(start : number, end : number) : string;

	/**
	 * Returns the calling string value converted to lowercase.
	 */
	function toLowerCase() : string;

	/**
	 * Returns the calling string value converted to lowercase.
	 */
	function toLocaleLowerCase() : string;

	/**
	 * Returns the calling string value converted to uppercase.
	 */
	function toUpperCase() : string;

	/**
	 * Returns the calling string value converted to uppercase.
	 */
	function toLocaleUpperCase() : string;

	/**
	 * Removes whitespace from both ends of the string.
	 */
	function trim() : string;

	/**
	 * The length of a string.
	 */
	__readonly__ var length : int;

	// removed: use substring() instead
	// function substr(start : number) : string;
	// function substr(start : number, length : number) : string;

	/**
	 * Encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character.
	 *
	 * @param str A component of a URI.
	 */
	static function encodeURIComponent(str : string) : string;

	/**
	 * Decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent or by a similar routine.
	 *
	 * @param encodedURI An encoded component of a Uniform Resource Identifier.
	 */
	static function decodeURIComponent(encodedURI : string) : string;

	/**
	 * Encodes a Uniform Resource Identifier (URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character.
	 *
	 * @param str A complete Uniform Resource Identifier.
	 */
	static function encodeURI(str : string) : string;

	/**
	 * Decodes a Uniform Resource Identifier (URI) previously created by encodeURI or by a similar routine.
	 *
	 * @param encodedURI A complete, encoded Uniform Resuorce Identifier.
	 */
	static function decodeURI(encodedURI : string) : string;

}

/**
 * A wrapper object for primitive <code>boolean</code>s.
 */
native final class Boolean {

	/**
	 * Constructs a Boolean object containing a <code>false</code>.
	 */
	function constructor();

	/**
	 * Constructs a Boolean object wrapping the given value.
	 */
	function constructor(value : boolean);

	/**
	 * Constructs a Boolean object wrapping the value wrapped by the given object.
	 */
	function constructor(value : Boolean);

	/**
	 * Returns a string of either "true" or "false" depending upon the value of the object.
	 */
	override function toString() : string;

	/**
	 * Returns the wrapped <code>boolean</code> value.
	 */
	function valueOf() : boolean;
}


/**
 * A wrapper object for primitive <code>number</code>s.
 */
native final class Number {

	/**
	 * Constructs a Number object containing <code>0.0</code>.
	 */
	function constructor();

	/**
	 * Constructs a Number object wrapping the given value.
	 */
	function constructor(value : number);

	/**
	 * Constructs a Number object wrapping the value wrapped by the given object.
	 */
	function constructor(value : Number);

	/**
	 * The maximum numeric value representable.
	 */
	static const MAX_VALUE : number;

	/**
	 * The minimum numeric value representable.
	 */
	static const MIN_VALUE : number;

	// NOTE: NaN, POSITIVE_INFINITY and NEGATIVE_INFINITY are
	//       not provided. Use NaN, +Infinity, and -Infinity literals
	//       instead.

	/**
	 * Returns a string representing the number.
	 */
	override function toString() : string;

	/**
	 * Returns a string representing the specified Number object.
	 *
	 * @param An integer between 2 and 36 specifying the base to use for representing numeric values.
	 */
	function toString(radix : number) : string;

	/**
	 * This method available to numbers will convert the number into a string which is suitable for presentation in the given locale.
	 */
	function toLocaleString() : string;

	/**
	 * Returns the wrapped <code>number</code> value.
	 */
	function valueOf() : number;

	/**
	 * Formats a number using fixed-point notation.
	 */
	function toFixed(fractionDigits : number) : string;

	/**
	 * Returns a string representing the Number object in exponential notation.
	 */
	function toExponential(fractionDigits : number) : string;

	/**
	 * Returns a string representing the Number object to the specified precision.
	 */
	function toPrecision(precision : number) : string;

	/**
	 * Parses a string argument and returns an integer if successful, or <code>NaN</code> if failed.
	 *
	 * @param str The value to parse.  Leading whitespace in the string is ignored.
	 */
	static __pure__ function parseInt(str :string) : number;

	/**
	 * Parses a string argument and returns an integer if successful, or <code>NaN</code> if failed.
	 *
	 * @param str The value to parse.  Leading whitespace in the string is ignored.
	 * @param radix An integer that represents the radix of the above mentioned string.
	 */
	static __pure__ function parseInt(str :string, radix :number) : number;

	/**
	 * <p>Parses a string argument and returns a floating point number.</p>
	 *
	 * <p>If it encounters a character other than a sign (+ or -), numeral (0-9), a decimal point, or an exponent, it returns the value up to that point and ignores that character and all succeeding characters. Leading and trailing spaces are allowed.</p>
	 *
	 * <p>If the first character cannot be converted to a number, parseFloat returns <code>NaN</code>.</p>
	 */
	static __pure__ function parseFloat(str :string) : number;

	/**
	 * Determines whether a number is <code>NaN</code> or not.
	 */
	static __pure__ function isNaN(num :number) : boolean;

	/**
	 * Determines whether a number is finite or not.
	 */
	static __pure__ function isFinite(num :number) : boolean;

}

/**
 * <p>Provides mathmetical constants and functions.</p>
 *
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
 */
native final class Math {

	delete function constructor();

	/**
	 * Euler's constant and the base of natural logarithms, approximately 2.718.
	 */
	static const E = 2.718281828459045;

	/**
	 * Natural logarithm of 10, approximately 2.302.
	 */
	static const LN10 = 2.302585092994046;

	/**
	 * Natural logarithm of 2, approximately 0.693.
	 */
	static const LN2 = 0.6931471805599453;

	/**
	 * Base 2 logarithm of E, approximately 1.442.
	 */
	static const LOG2E = 1.4426950408889634;

	/**
	 * Base 10 logarithm of E, approximately 0.434.
	 */
	static const LOG10E = 0.4342944819032518;

	/**
	 * Ratio of the circumference of a circle to its diameter, approximately 3.14159.
	 */
	static const PI = 3.141592653589793;

	/**
	 * Square root of 1/2; equivalently, 1 over the square root of 2, approximately 0.707.
	 */
	static const SQRT1_2 = 0.7071067811865476;

	/**
	 * Square root of 2, approximately 1.414.
	 */
	static const SQRT2 = 1.4142135623730951;

	/**
	 * Returns the absolute value of a number.
	 */
	static __pure__ function abs(x :number) :number {
		return x >= 0 ? x : -x;
	}

	static __pure__ function acos(x :number) :number;
	static __pure__ function asin(x :number) :number;
	static __pure__ function atan(x :number) :number;
	static __pure__ function atan2(y :number, x :number) :number;
	static __pure__ function ceil(x :number) :number;
	static __pure__ function cos(x :number) :number;
	static __pure__ function exp(x :number) :number;
	static __pure__ function floor(x :number) :number;
	static __pure__ function log(x :number) :number;
	static __pure__ function max(value1 : number, value2 : number, value3 : number, ...valueN : number) : number;
	static __pure__ function max(value1 : number) : number;
	static __pure__ function min(value1 : number, value2 : number, value3 : number, ...valueN : number) : number;
	static __pure__ function min(value1 : number) : number;
	static __pure__ function pow(x :number, y :number) :number;
	static function random() :number;
	static __pure__ function round(x :number) :number;
	static __pure__ function sin(x :number) :number;
	static __pure__ function sqrt(x :number) :number;
	static __pure__ function tan(x :number) :number;

	// optimized (inlined) version for two-arg min/max
	static __pure__ function max(value1 :number, value2 :number) :number {
		return value1 >= value2 ? value1 : value2;
	}
	static __pure__ function min(value1 :number, value2 :number) :number {
		return value1 <= value2 ? value1 : value2;
	}
}

/**
 * <p>An object for working with dates and times.</p>
 *
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
 */
native final class Date {

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number);

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number, date :number);

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number, date :number,
						hours :number);

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number);

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number);

	/**
	 * Creates a Date object.
	 */
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number,
						ms :number);

	/**
	 * Creates a Date object.
	 *
	 * @param value String value representing a date. The string should be in a format recognized by the <code>parse</code> method (IETF-compliant RFC 2822 timestamps).
	 */
	function constructor(value :string);

	/**
	 * Creates a Date object.
	 *
	 * @param value Integer value representing the number of milliseconds since 1 January 1970 00:00:00 UTC (Unix Epoch).
	 */
	function constructor(value :number);

	/**
	 * Clones the given object.
	 */
	function constructor(value :Date);

	/**
	 * Creates a Date object for today's date and time according to local time.
	 */
	function constructor();

	static function parse(value :string) :number;

	static function UTC(year :number, month :number) : number;
	static function UTC(year :number, month :number, date :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number)
						: number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number,
						ms :number) : number;


	static function now() :number;

	// 15.9.5
	// NOTE: to*String is implementation-dependent
	override function toString() :string;
	function toDateString() :string;
	function toTimeString() :string;
	function toLocaleString() :string;
	function toLocaleDateString() :string;
	function toLocaleTimeString() :string;

	function valueOf() :number;

	function getTime() :number;
	function getFullYear() :number;
	function getUTCFullYear() :number;
	function getMonth() :number;
	function getUTCMonth() :number;
	function getDate() :number;
	function getUTCDate() :number;
	function getDay() :number;
	function getUTCDay() :number;
	function getHours() :number;
	function getUTCHours() :number;
	function getMinutes() :number;
	function getUTCMinutes() :number;
	function getSeconds() :number;
	function getUTCSeconds() :number;
	function getMilliseconds() :number;
	function getUTCMilliseconds() :number;
	function getTimezoneOffset() :number;

	// 15.9.3.28-
	function setTime(time :number) :number;
	function setMilliseconds(ms :number) :number;
	function setUTCMilliseconds(ms :number) :number;
	function setSeconds(sec :number) :number;
	function setUTCSeconds(sec :number) :number;
	function setMinutes(min :number) :number;
	function setUTCMinutes(min :number) :number;
	function setHours(hour :number) :number;
	function setUTCHours(hour :number) :number;
	function setDate(date :number) :number;
	function setUTCDate(date :number) :number;
	function setMonth(month :number) :number;
	function setUTCMonth(month :number) :number;
	function setFullYear(year :number) :number;
	function setUTCFullYear(year :number) :number;

	// 15.9.5.42- added in ECMA-262 5th
	function toUTCString() :string;
	function toISOString() :string;
	function toJSON() :string;
	function toJSON(key :string) :string; // key is given but ignored
}

/**
 * <p>An object that represents a regular-expression.</p>
 *
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
 */
native final class RegExp {

	function constructor(pattern :string, flags :string);
	function constructor(pattern :string);
	function constructor(pattern :RegExp);

	// FIXME: the matched object is a variation of string[],
	//        but has "index", "input" and "lastIndex" properties
	function exec(str :string) :string[];

	function test(str :string) :boolean;

	override function toString() :string;

	__readonly__ var source :string;
	__readonly__ var global :boolean;
	__readonly__ var ignoreCase :boolean;
	__readonly__ var multiline :boolean;
	__readonly__ var lastIndex :int;

}

native class Error {

	function constructor();
	function constructor(message : string);

	var name : string;
	var message : string;

}

native class EvalError extends Error {
	function constructor();
	function constructor(message : string);
}

native class RangeError extends Error {
	function constructor();
	function constructor(message : string);
}

native class ReferenceError extends Error {
	function constructor();
	function constructor(message : string);
}

native class SyntaxError extends Error {
	function constructor();
	function constructor(message : string);
}

native class TypeError extends Error {
	function constructor();
	function constructor(message : string);
}

// 5.12
/**
 * <p>Provides static functions to manipulate JSON.</p>
 *
 * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 5th edition.</p>
 */
native final class JSON {

	delete function constructor();

	static function parse(text : string) : variant;
	static function parse(text : string, reviver : function(key:string, value:variant):variant) : variant;

	static function stringify(value : variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant, space : number) : string;

}

/**
 * Provides static functions to control the behaviour of the JSX runtime.
 */
native final class JSX {

	delete function constructor();

	/**
	 * Returns whether or not the profiler is running.
	 */
	static function profilerIsRunning() : boolean;

	/**
	 * Returns the profiler results.
	 */
	static function getProfileResults() : variant;

	/**
	 * <p>Posts the profiler results to the given URL.</p>
	 *
	 * <p>Please refer to <a href="http://jsx.github.com/doc/profiler.html">the profiler document</a> for using the function.</p>
	 */
	static function postProfileResults(url : string) : void;

	/**
	 * Resets the collected profiler results.
	 */
	static function resetProfileResults() : void;

}

// vim: set noexpandtab:
