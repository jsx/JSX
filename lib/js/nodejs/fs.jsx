/***
 * NodeJS FileSystem module
 *
 * @see http://nodejs.org/api/fs.html
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

import "nodejs/global.jsx";
import "nodejs/events.jsx";

native class fs {
	delete function constructor();

	static function statSync(path : string) : Stats;

	static function existsSync(path : string) : boolean;

	static function mkdirSync(path : string) : void;
	static function mkdirSync(path : string, mode : string) : void;

	static function readdirSync(path : string) : string[];

	static function unlinkSync(path : string) : void;

	static function chmodSync(path : string, mode : string) : void;

	static function openSync(path : string, flags : string) : int;
	static function openSync(path : string, flags : string, mode : int) : int;
	static function closeSync(fd : int) : void;

	static function readSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	static function readSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	static function readFileSync(filename : string) : Buffer;
	static function readFileSync(filename : string, encoding : string) : string;

	static function writeSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	static function writeSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	static function writeFileSync(filename : string, data : Buffer) : void;
	static function writeFileSync(filename : string, data : string) : void;
	static function writeFileSync(filename : string, data : string, encoding : string) : void;

	static function watch(filename : string, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
	static function watch(filename : string, options : Map.<variant>, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
} = "require('fs')";

final native class Stats {
	delete function constructor();

	function isFile() : boolean;
	function isDirectory() : boolean;
	function isBlockDevice() : boolean;
	function isCharacterDevice() : boolean;
	function isSymbolickLink() : boolean;
	function isFIFO() : boolean;
	function isSocket() : boolean;
} = "require('fs').Stats";

native __fake__ class FSWatcher extends EventEmitter {
	delete function constructor();

	function close() : void;
}
