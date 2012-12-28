import "js.jsx";

/**
 * Set of PhantomJSX APIs
 */
native final class phantom {
  static const version : Version;

  static function exit() : void;
  static function exit(returnValue : int) : void;

  //static const libraryPath : string;
  //static function injectJs(filename : string) : boolean;
}


final class _CommonJS {
  static function require(name : string) : variant {
    var jsEval = js.global["eval"] as __noconvert__ function(:string):variant;
    return jsEval("require('" + name.replace(/'/g, "\\'") + "')");
  }
}

/**
 * PhantomJS System module
 */
final class system {
  static const _delegate = _CommonJS.require("system") as __noconvert__ _System;
  static const platform = system._delegate.platform;
  static const os       = system._delegate.os;
  static const env      = system._delegate.env;
  static const args     = system._delegate.args;
}

final native __fake__ class _System {
  var platform : string;
  var os : OS;
  var env : Map.<string>;
  var args : Array.<string>;
}

/**
 * PhantomJS WebPage module
 */
final class webpage {
  static const _delegate = _CommonJS.require("webpage") as __noconvert__ _WebPage;

  static function create() : WebPage {
    return webpage._delegate.create();
  }
}

final native __fake__ class _WebPage {
  function create() : WebPage;
}

final native class WebPage {
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

final class fs {
  static const _delegate = _CommonJS.require("fs") as __noconvert__ _FileSystem;
  static const separator        = fs._delegate.separator;
  static const workingDirectory = fs._delegate.workingDirectory;

  // Query Functions

  static function list(path : string) : Array.<string> {
    return fs._delegate.list(path);
  }

  static function absolute(path : string) : string {
    return fs._delegate.absolute(path);
  }

  static function exists(path : string) : boolean {
    return fs._delegate.exists(path);
  }


  // Directory Functions

  static function changeWorkingDirectory(path : string) : void {
    fs._delegate.changeWorkingDirectory(path);
  }
  static function makeDirectory(path : string) : void {
    fs._delegate.makeDirectory(path);
  }
  static function makeTree(path : string) : void {
    fs._delegate.makeTree(path);
  }
  static function removeDirectory(path : string) : void {
    fs._delegate.removeDirectory(path);
  }
  static function removeTree(path : string) : void {
    fs._delegate.removeTree(path);
  }
  static function copyTree(source : string, destination : string) : void {
    fs._delegate.copyTree(source, destination);
  }

  // File Functions

  static function open(path : string, mode : string) : Stream {
    return fs._delegate.open(path, mode);
  }
  static function read(path : string) : string {
    return fs._delegate.read(path);
  }
  static function write(path : string, content : string, mode : string) : void {
    fs._delegate.write(path, content, mode);
  }
  static function write(path : string, content : string) : void {
    fs._delegate.write(path, content);
  }

  static function remove(path : string) : void {
    fs._delegate.remove(path);
  }
}

final native __fake__ class _FileSystem {
  var separator : string;
  var workingDirectory : string;

  function list(path : string) : Array.<string>;
  function absolute (path : string) : string;
  function exists(path : string) : boolean;

  function changeWorkingDirectory(path : string) : void;
  function makeDirectory(path : string) : void;
  function makeTree(path : string) : void;
  function removeDirectory(path : string) : void;
  function removeTree(path : string) : void;
  function copyTree(source : string, destination : string) : void;

  function open(path : string, mode : string) : Stream;
  function read(path : string) : string;
  function write(path : string, content : string, mode : string) : void;
  function write(path : string, content : string) : void;
  function size(path : string) : void;
  function remove(path : string) : void;
  function copy(source : string, destination : string) : void;
  function move(source : string, destination : string) : void;
  function touch(path : string) : void;
}

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
final class webserver {
  static const _delegate = _CommonJS.require("webserver") as __noconvert__ _webserver;

  static function create() : WebServer {
    return webserver._delegate.create();
  }
}

final native __fake__ class _webserver{
  function create() : WebServer;
}

final native class WebServer {
  function listen(port : int,       listener : function(:Request, :Response):void) : void;
  function listen(address : string, listener : function(:Request, :Response):void) : void;
}

final native __fake__ class Request {
  var method : string;
  var url    : string;
  var httpVersion : string;
  var headers : Map.<string>;
  var post : Nullable.<string>; // when POST and PUT
  var postRaw : Nullable.<string>;
}

final native __fake__ class Response {
  var headers : Map.<string>;
  var statusCode : int;

  function writeHead(statusCode : int, headers : Map.<string>) : void;
  function write(data : string) : void;
  function close() : void;
}


// helper PODs

final native __fake__ class Version {
  var major : int;
  var minor : int;
  var patch : int;
}

final native __fake__ class OS {
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
