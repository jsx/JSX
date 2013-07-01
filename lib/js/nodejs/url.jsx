/***
 * NodeJS URL module
 *
 * @see http://nodejs.org/api/url.html
 */

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

native class url {
	delete function constructor();

	static function parse(urlStr : string) : Url;
	static function format(url : Url) : string;
	static function format(urlStr : string) : string;

	static function resolve(source : Url,    relative : Url)    : string;
	static function resolve(source : Url,    relative : string) : string;
	static function resolve(source : string, relative : Url)    : string;
	static function resolve(source : string, relative : string) : string;
} = "require('url')";

native class Url {
	var protocol : Nullable.<string>;
	var slashes  : Nullable.<boolean>;
	var auth     : Nullable.<string>;
	var host     : Nullable.<string>;
	var port     : Nullable.<string>;
	var hostname : Nullable.<string>;
	var hash     : Nullable.<string>;
	var search   : Nullable.<string>;
	var query    : Nullable.<string>;
	var pathname : Nullable.<string>;
	var path     : Nullable.<string>;

	//function format() : string;
	//function resolve(relative : string) : Url;
	//function resolve(relative : Url) : Url;
} = "require('url').Url";

