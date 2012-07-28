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

import "js.jsx";

final class Timer {
	static function setTimeout(callback : function():void, intervalMS : number) : TimerHandle {
		return Timer._setTimeout(callback, intervalMS);
	}

	static function clearTimeout(timer : TimerHandle) : void {
		Timer._clearTimeout(timer);
	}

	static function setInterval(callback : function():void, intervalMS : number) : TimerHandle {
		return Timer._setInterval(callback, intervalMS);
	}

	static function clearInterval(timer : TimerHandle) : void {
		Timer._clearInterval(timer);
	}

	static function requestAnimationFrame(callback : function(:number):void) : TimerHandle {
		return Timer._requestAnimationFrame(callback);
	}

	static function cancelAnimationFrame(timer : TimerHandle) : void {
		Timer._cancelAnimationFrame(timer);
	}

	static function useNativeImpl(enable : boolean) : void {
		Timer._requestAnimationFrame = Timer._getRequestAnimationFrameImpl(enable);
		Timer._cancelAnimationFrame  = Timer._getCancelAnimationFrameImpl(enable);
	}

	// details

	static const _setTimeout    = js.global["setTimeout"]    as function(:function():void, :int): TimerHandle;
	static const _clearTimeout  = js.global["clearTimeout"]  as function(:TimerHandle):void;
	static const _setInterval   = js.global["setInterval"]   as function(:function():void, :int): TimerHandle;
	static const _clearInterval = js.global["clearInterval"] as function(:TimerHandle):void;

	static var _requestAnimationFrame = Timer._getRequestAnimationFrameImpl(true);
	static var _cancelAnimationFrame  = Timer._getCancelAnimationFrameImpl(true);

	static function _getImplWithVenderPrefix(name : string) : variant {
		var impl = js.global[name];
		if (! impl) {
			var s = name.replace(/^./, function (c) {
				return c.toUpperCase();
			});
			impl =
				   js.global["webkit" + s]
				?: js.global["moz"    + s]
				?: js.global["o"      + s]
				?: js.global["ms"     + s];
		}
		return impl;
	}

	static function _getRequestAnimationFrameImpl(useNativeImpl : boolean) : function(callback : function(:number):void) : TimerHandle {
		var impl = Timer._getImplWithVenderPrefix("requestAnimationFrame");
		if (impl) {
			return impl as function (callback : function(:number):void) : TimerHandle;
		}
		else {
			var lastTime = 0;
			return function(callback : function(:number):void) : TimerHandle {
				var now = Date.now();
				var timeToCall = Math.max(0, (1000/16 - (now - lastTime)));
				lastTime = now + timeToCall;

				return Timer.setTimeout(function() : void {
					callback(now + timeToCall);
				}, timeToCall);
			};
		}
	}

	static function _getCancelAnimationFrameImpl(useNativeImpl : boolean) : function(:TimerHandle):void {
		var impl = Timer._getImplWithVenderPrefix("cancelAnimationFrame");
		if (impl) {
			return impl as function (timer : TimerHandle) : void;
		}
		else {
			return Timer._clearTimeout;
		}
	}

}

/**
 * Implementation-defined object which setTimeout() and setInterval() return.
 */
final class TimerHandle {
}

