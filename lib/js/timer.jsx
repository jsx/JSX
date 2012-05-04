import "js.jsx";

class TimerHandle {
	// implementation-defined object which identify listeners
}

class Timer {
	static function setTimeout(listener : function():void, milliseconds :int) : TimerHandle {
		var f = js.global["setTimeout"] as function(:function():void, :int): TimerHandle;
		return f(listener, milliseconds);
	}

	static function clearTimeout(timerID : TimerHandle) :void {
		var f = js.global["clearTimeout"] as function(:TimerHandle):void;
		f(timerID);
	}

	static function setInterval(listener : function():void, milliseconds :int) : TimerHandle {
		var f = js.global["setInterval"] as function(:function():void, :int): TimerHandle;
		return f(listener, milliseconds);
	}

	static function clearInterval(timerID : TimerHandle) :void {
		var f = js.global["clearInterval"] as function(:TimerHandle):void;
		f(timerID);
	}
}
