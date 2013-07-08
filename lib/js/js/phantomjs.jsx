/***
 * PhantomJS binding for JSX
 *
 * Usage: <code>JSX_RUNJS=phantomjs jsx --executable commonjs a.jsx</code>
 *
 * @see http://phantomjs.org/
 */

/**
 * Interface to <code>phantom</code>
 */
native final class phantom {
  delete function constructor();

  static __readonly__ var version : Version;

  static function exit() : void;
  static function exit(returnValue : int) : void;

  //static const libraryPath : string;
  //static function injectJs(filename : string) : boolean;
}


/**
 * PhantomJS System module
 */
final native class system {
  delete function constructor();

  static __readonly__ var platform : string;
  static __readonly__ var os : OS;
  static __readonly__ var env : Map.<string>;
  static __readonly__ var args : Array.<string>;
} = "require('system')";

/**
 * PhantomJS WebPage module
 */
final native class webpage {
  delete function constructor();

  static function create() : WebPage;
} = "require('webpage')";

final native __fake__ class WebPage {
  var clipRect : Rectangle;
  var content : string;
  var navigationLocked : boolean;
  var paperSize : variant;
  var settings : Settings;
  var viewportSize : Size;
  var zoomFactor : number;
  var customHeaders : Map.<string>;

  function close() : void;
  function evaluate(jsSource : string) : variant;
  function evaluateAsync(jsSource : string) : variant;
  function includeJS(url : string, cb : function():void) : void;
  function open(url : string, cb : function(status:string):void) : void;
  function render(filename : string) : void;
  function renderBase64(filename : string) : void;
  function sendEvent(type : string, mouseX : int, mouseY : int) : void;
  function uploadFile(selector : string, filename : string) : void;

  // Event listeners

  var onAlert : function(msg : string) : void;
  var onCallback : function(data : variant) : void;
  var onClosing : function(closingPage : WebPage) : void;
  var onConfirm : function(msg : string) : void;
  var onConsoleMessage : function(msg : string, lineNum : int, sourceId : string) : void;
  var onError : function(msg : string, trace : variant[]) : void;
  var onInitialized : function() : void;
  var onLoadFinished : function(status : string) : void;
  var onLoadStarted : function() : void;
  var onNavigationRequested : function(url : string, type : string, willNavigate : boolean, main : boolean) : void;
  var onPrompt : function(msg : string, defaultVal : variant) : variant;
  var onResourceRequested : function(request : variant) : void;
  var onResponseReceived : function(response : variant) : void;
  var onUrlChanged : function(targetUrl : string) : void;
}

/**
 * PhantomJS FileSystem module
 */
final native class fs {
  delete function constructor();

  static var separator : string;
  static var workingDirectory : string;

  static function list(path : string) : Array.<string>;
  static function absolute (path : string) : string;
  static function exists(path : string) : boolean;

  static function changeWorkingDirectory(path : string) : void;
  static function makeDirectory(path : string) : void;
  static function makeTree(path : string) : void;
  static function removeDirectory(path : string) : void;
  static function removeTree(path : string) : void;
  static function copyTree(source : string, destination : string) : void;

  static function open(path : string, mode : string) : Stream;
  static function read(path : string) : string;
  static function write(path : string, content : string, mode : string) : void;
  static function write(path : string, content : string) : void;
  static function size(path : string) : void;
  static function remove(path : string) : void;
  static function copy(source : string, destination : string) : void;
  static function move(source : string, destination : string) : void;
  static function touch(path : string) : void;
} = "require('fs')";

final native __fake__ class Stream {
  function read() : string;
  function readLine() : string;
  function write(data : string) : void ;
  function writeLine(data : string) : void ;
  function flush() : void;
  function close() : void;
}

/**
 * PhantomJS WebServer module
 */
final native class webserver {
  delete function constructor();

  static function create() : WebServer;
} = "require('webserver')";

final native __fake__ class WebServer {
  delete function constructor();

  function listen(port : int,       listener : function(:Request, :Response):void) : void;
  function listen(address : string, listener : function(:Request, :Response):void) : void;
}

final native __fake__ class Request {
  delete function constructor();

  var method : string;
  var url    : string;
  var httpVersion : string;
  var headers : Map.<string>;
  var post : Nullable.<string>; // when POST and PUT
  var postRaw : Nullable.<string>;
}

final native __fake__ class Response {
  delete function constructor();

  var headers : Map.<string>;
  var statusCode : int;

  function writeHead(statusCode : int, headers : Map.<string>) : void;
  function write(data : string) : void;
  function close() : void;
}

// helper PODs

final native __fake__ class Version {
  delete function constructor();

  var major : int;
  var minor : int;
  var patch : int;
}

final native __fake__ class OS {
  delete function constructor();

  var architecture : string;
  var name : string;
  var version : string;
}

final class Rectangle {
  var top : int;
  var left : int;
  var width : int;
  var height : int;

  function constructor(top : int, left : int, width : int, height : int) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }
}

final class Size {
  var width : int;
  var height : int;

  function constructor(width : int, height : int) {
    this.width = width;
    this.height = height;
  }
}

final class Settings {
  var javascriptEnabled : boolean;
  var loadImages : boolean;
  var localToRemoteUrlAccessEnabled : boolean;
  var userAgent : string;
  var userName : string;
  var password : string;
  var XSSAuditingEnabled : boolean;
  var webSecurityEnabled : boolean;
}

// vim: set tabstop=2 shiftwidth=2 expandtab:
