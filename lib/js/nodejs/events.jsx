/***
 * NodeJS Events Module
 *
 * @see http://nodejs.org/api/events.html
 */
native class EventEmitter {
	delete function constructor();

	function on(event : string, listener : function():void) : void;
	function on(event : string, listener : function(:variant):void) : void;
	function on(event : string, listener : function(:variant,:variant):void) : void;

	function once(event : string, listener : function():void) : void;
	function once(event : string, listener : function(:variant):void) : void;
	function once(event : string, listener : function(:variant,:variant):void) : void;

	function removeListener(event : string, listener : function():void) : void;
	function removeListener(event : string, listener : function(:variant):void) : void;
	function removeListener(event : string, listener : function(:variant,:variant):void) : void;

	function emit(event : string) : void;
	function emit(event : string, arg0 : variant) : void;
	function emit(event : string, arg0 : variant, arg1 : variant) : void;
} = "require('events').EventEmitter";
