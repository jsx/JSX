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

/***
 * Timer utilities available both on browsers and node.js
 *
 * @author DeNA, Co., Ltd.
 */

import "js.jsx";


final class Timer {
	static function setTimeout(callback : function():void, intervalMS : number) : TimerHandle {
		return (js.global["setTimeout"] as __noconvert__ function(:function():void,:number) : TimerHandle)(callback, intervalMS);
	}

	static function clearTimeout(timer : TimerHandle) : void {
		(js.global["clearTimeout"] as __noconvert__ function(:TimerHandle) : void)(timer);
	}

	static function setInterval(callback : function():void, intervalMS : number) : TimerHandle {
		return (js.global["setInterval"] as __noconvert__ function(:function():void,:number) : TimerHandle)(callback, intervalMS);
	}

	static function clearInterval(timer : TimerHandle) : void {
		(js.global["clearInterval"] as __noconvert__ function(:TimerHandle) : void)(timer);
	}

	static function requestAnimationFrame(callback : function(:number):void) : TimerHandle {
		return Timer._requestAnimationFrame(callback);
	}

	static function cancelAnimationFrame(timer : TimerHandle) : void {
		Timer._cancelAnimationFrame(timer);
	}

	static function useNativeRAF(enable : boolean) : void {
		Timer._requestAnimationFrame = Timer._getRequestAnimationFrameImpl(enable);
		Timer._cancelAnimationFrame  = Timer._getCancelAnimationFrameImpl(enable);
	}

	// details

	static var _requestAnimationFrame = Timer._getRequestAnimationFrameImpl(true);
	static var _cancelAnimationFrame  = Timer._getCancelAnimationFrameImpl(true);

	static function _getRequestAnimationFrameImpl(useNativeImpl : boolean) : function(callback : function(:number):void) : TimerHandle {

		if (useNativeImpl) {
			var prefixes = ["r", "webkitR", "mozR", "oR", "msR"];
			for (var i = 0; i < prefixes.length; ++i) {
				var name = prefixes[i] + "equestAnimationFrame";
				if (js.global[name] instanceof Function) {
					return function (callback) {
						return (js.global[name] as __noconvert__
							 function(:function(:number):void) : TimerHandle)(callback);
					};
				}
			}
			// fall through
		}

		// fallback implemntation

		var lastTime = 0;
		return function(callback) {
			var now = Date.now();
			var timeToCall = Math.max(0, (16 - (now - lastTime)));
			lastTime = now + timeToCall;
			return Timer.setTimeout(function() {
				callback(now + timeToCall);
			}, timeToCall);
		};
	}

	static function _getCancelAnimationFrameImpl(useNativeImpl : boolean) : function(:TimerHandle):void {
		if (useNativeImpl) {
			var prefixes = ["c", "webkitC", "mozC", "oC", "msC"];
			for (var i = 0; i < prefixes.length; ++i) {
				var name = prefixes[i] + "ancelAnimationFrame";
				if (js.global[name] instanceof Function) {
					return function (timer) {
						(js.global[name] as __noconvert__
							 function(:TimerHandle) : void)(timer);
					};
				}
			}
			// fall through
		}

		// fallback implemntation
		return Timer.clearTimeout;
	}
}

/**
 * Implementation-defined object which setTimeout() and setInterval() return.
 */
final class TimerHandle {
	delete function constructor();
}

