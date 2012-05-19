/*

The JSX DOM module consists of several parts of submodules:

Core - DOM Level 3 Core
HTML - DOM Level 3 HTML
Event - DOM Level 3 Event (Low level event model)
XHR - XMLHttpRequest
Window - The DOM Window

See also:
	http://www.w3.org/TR/DOM-Level-2-Core/
	http://www.w3.org/TR/DOM-Level-3-Core/
	http://dev.w3.org/html5/spec/
*/

import "js.jsx";
import "css.jsx";

// DOM-Core

// http://www.w3.org/TR/DOM-Level-3-Core/


native class DOMException {
	var code : int;
}

native class DOMImplementationList {
	// TODO
}
native class DOMImplementationSource {
	// TODO
}

native class DOMImplementation {
	function hasFeature(feature : string, version : string) : boolean;
	function createDocumentType(qualifiedName : string, publicId : string, systemId : string) :DocumentType;
	function createDocument(namespaceURI : string, qualifiedName : string, docType : string) :Document;
	function getFeature(feature : string, version : string) : Object;

}

native class Node extends EventTarget {
	static const ELEMENT_NODE : int;
	static const ATTRIBUTE_NODE : int;
	static const TEXT_NODE : int;
	static const CDATA_SECTION_NODE : int;
	static const ENTITY_REFERENCE_NODE : int;
	static const ENTITY_NODE : int;
	static const PROCESSING_INSTRUCTION_NODE : int;
	static const COMMENT_NODE : int;
	static const DOCUMENT_NODE : int;
	static const DOCUMENT_TYPE_NODE : int;
	static const DOCUMENT_FRAGMENT_NODE : int;
	static const NOTATION_NODE : int;

	__readonly__ var nodeName : string;
	var nodeValue : string;
	__readonly__ var nodeType : int;
	__readonly__ var parentNode : string;
	__readonly__ var childNodes : NodeList;
	__readonly__ var firstChild : Node;
	__readonly__ var lastChild : Node;
	__readonly__ var previousSibling : Node;
	__readonly__ var nextSibling : Node;
	__readonly__ var attributes : NamedNodeMap;

	function insertBefore(newChild : Node, refChild : Node) : Node;
	function replaceChild(newChild : Node, oldChild : Node) : Node;
	function removeChild(oldChild : Node) : Node;
	function appendChild(newChild : Node) : Node;

	function hasChildNodes() : boolean;
	function cloneNode(deep : boolean) : Node;

	function normalize() : void;

	function isSupported(feature : string, version : string) : boolean;
	__readonly__ var namespaceURI : string;
	__readonly__ var prefix : string;
	__readonly__ var localName : string;
	function hasAttributes() : boolean;
	__readonly__ var baseURI : string;

	// DocumentPosition
	static const DOCUMENT_POSITION_DISCONNECTED : int;
	static const DOCUMENT_POSITION_PRECEDING : int;
	static const DOCUMENT_POSITION_FOLLOWING : int;
	static const DOCUMENT_POSITION_CONTAINS : int;
	static const DOCUMENT_POSITION_CONTAINED_BY : int;
	static const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : int;
	function compareDocumentPosition(other : Node) : int;

	var textContent : string;

	function isSameNode(other : Node) : boolean;
	function lookupPrefix(namespaceURI : string) : string;
	function isDefaultNamespace(namespaceURI : string) : string;
	function lookupNamespaceURI(prefix : string) : string;
	function isEqualNode(arg : Node) : boolean;
	function getFeature(feature : string, version : string) : Object;

	// See also UserDataHandler
	function setUserData(key : string, data : variant, handler: function(:int,:string,:variant,:Node,:Node):void) : variant;
	function getUserData(key : string) : variant;

}

native class NodeList {
	function item(index : int) : Node;
	function __native_index_operator__(index : int) : Node;
	__readonly__ var length : int;
}

native class NamedNodeMap {
	function __native_index_operator__(key : string) : Node;
	// TODO
}

native class CharacterData extends Node {
	// TODO
}

native class Attr extends Node {
	__readonly__ var name : string;
	__readonly__ var specified : boolean;
	__readonly__ var value : string;
	__readonly__ var ownerElement : Element;
	__readonly__ var schemaTypeInfo : TypeInfo;
	__readonly__ var isId : boolean;
}

native class TypeInfo {
	// TODO
}

native class Element extends Node {
	__readonly__ var tagName : string;

	function getAttribute(name : string) : string;
	function setAttribute(name : string, value : string) : void;
	function removeAttribute(name : string) : void;

	function getAttributeNode(name : string) : Attr;
	function setAttributeNode(newAttr : Attr) : Attr;
	function removeAttributeNode(oldAttr : Attr) : Attr;

	function getElementsByTagName(name : string) : NodeList;

	// introduced in DOM level 2

	function getAttributeNS(namespaceURI : string, localName : string) : string;
	function setAttributeNS(namespaceURI : string, qualifiedName : string, value : string) : void;
	function removeAttributeNS(namespaceURI : string, localName : string) : string;
	function getAttributeNodeNS(namespaceURI : string, localName : string) : string;
	function setAttributeNS(newAttr : Attr) : Attr;
	function getElementsByTagNameNS(namespaceURI : string, localName : string) : NodeList;

	function hasAttribute(name : string) : boolean;
	function hasAttributeNS(namespaceURI : string, name : string) : boolean;

	// introduced in DOM level 3
	__readonly__ var schemaTypeInfo : TypeInfo;
	function setIdAttribute(name : string, isId : boolean) : void;
	function setIdAttributeNS(namespaceURI : string, localName : string, isId : boolean) : void;
	function setIdAttributeNode(idAttr : Attr, isId : boolean) : void;
}


native class Text extends CharacterData {
	function splitText(offset : number) : Text;
	// TODO
}

native class Comment extends CharacterData { }

native class UserDataHandler {
	static const NODE_CLONED : int;
	static const NODE_IMPORTED : int;
	static const NODE_DELETED : int;
	static const NODE_RENAMED : int;
	static const NODE_ADOPTED : int;
}

native class DOMError {
	// TODO
}

native class DOMLocator {
	// TODO
}
native class DOMConfiguration {
	// TODO
}

native class CDATASection extends Text { }

native class DocumentType extends Node {
	// TODO
}

native class Notation extends Node {
	// TODO
}

native class Entity extends Node {
	// TODO
}

native class EntityReference extends Node {
	// TODO
}

native class ProcessingInstruction extends Node {
	// TODO
}

native class DocumentFragment extends Node { }

native class Document extends Node /* implements DocumentEvent */ {
	__readonly__ var doctype : DocumentType;
	__readonly__ var implementation : DOMImplementation;
	__readonly__ var documentElement : Element;

	function createElement(tagname : string) : Element;
	function createDocumentFragment() : DocumentFragment;
	function createTextNode(data : string) : Text;
	function createComment(data : string) : Comment;
	function createCDATASection(data : string) : CDATASection;
	function createProcessingInstruction(target : string, data : string) : ProcessingInstruction;
	function createAttribute(name : string) : Attr;
	function createEntityReference(name : string) : EntityReference;

	function getElementsByTagName(tagname : string) : NodeList;

	// introduced in DOM level 2

	function importNode(importedNode : Node, deep : boolean) : Node;

	function createElementNS(namespaceURI : string, qualifiedName : string) : Element;
	function createAttributeNS(namespaceURI : string, qualifiedName : string) : Attr;

	function getElementsByTagNameNS(namespaceURI : string, localName : string) : NodeList;
	function getElementById(elementId : string) : Element;

	// introduced in DOM level 3

	__readonly__ var inputEncoding : string;
	__readonly__ var xmlEncoding : string; // FIXME: Chrome may return null
	var xmlStandalone : boolean;
	var xmlVersion : string;
	var strictErrorChecking : boolean;
	var documentURI : string;

	function adoptNode(source : Node) : Node;

	__readonly__ var domConfig : DOMConfiguration;
	function normalizeDocument() : void;
	function renameNode(n : Node, namespaceURI : string, qualifiedName : string) : Node;

	// implements interface DocumentEvent
	function createEvent(eventInterface : string) : Event;
}

// DOM-HTML
// http: //www.w3.org/TR/DOM-Level-2-HTML/
// (cf. http://www.w3.org/TR/html5-author/)

native class HTMLCollection {
	__readonly__ var length : int;
	function item(index : int) : Node;
	function __native_index_operator__(index : int) : Node;
	function namedItem(name : string) : Node;
}

native class HTMLOptionsCollection {
	// TODO
}

native class HTMLDocument extends Document {
	var title : string;

	__readonly__ var referrer : string;
	__readonly__ var domain : string;
	__readonly__ var URL : string;
	__readonly__ var body : HTMLElement;

	__readonly__ var images : HTMLCollection;
	__readonly__ var applets : HTMLCollection;
	__readonly__ var links : HTMLCollection;
	__readonly__ var forms : HTMLCollection;
	__readonly__ var anchors : HTMLCollection;

	var cookie : string;

	function open() : void;
	function close() : void;

	function write(text : string) : void;
	function writeln(text : string) : void;

	function getElementsByName(elementName : string) : NodeList;
}

native class DOMTokenList {
	__readonly__ var length : number;
	function __native_index_operator__(index : int) : String;
	function item(index : int) : String;
	function contains(value : string) : boolean;
	function add(token : string) : void;
	function remove(token : string) : void;
	function toggle(token : string) : boolean;

	override function toString() : string;
}

native class DOMSettableTokenList extends DOMTokenList {
	var value : string;
}

native class DOMStringList {
	__readonly__ var length : number;
	function __native_index_operator__(index : int) : String;
	function item(index : int) : String;
	function contains(str : string) : boolean;
}

native class DOMStringMap {
	function __native_index_operator__(key : string) : MayBeUndefined.<string>;
}

native class ClientRect {
	__readonly__ var top : number;
	__readonly__ var right : number;
	__readonly__ var bottom : number;
	__readonly__ var left : number;
	__readonly__ var width : number;
	__readonly__ var height : number;
}

native class ClientRectList {
	// TODO
}


// http://dev.w3.org/html5/spec/elements.html#htmlelement
native class HTMLElement extends Element {
	// metadata attributes

	var id : string;
	var title : string;
	var lang : string;
	var dir : string;
	var className : string;

	var classList : DOMTokenList;
	var dataset : DOMStringMap;


	// user interaction
	var hidden : boolean;
	var tabIndex : int;
	var accesKey : string;
	__readonly__ var accessKeyLabel : string;
	var draggable : boolean;
	__readonly__ var dropzone : DOMSettableTokenList;
	var contentEditable : string;
	__readonly__ var isContentEditable : boolean;
	var contextMenu : MayBeUndefined.<HTMLMenuElement>;
	var spellcheck : boolean;

	function click() : void;
	function focus() : void;
	function blur() : void;

	// command API
	__readonly__ var commandType : MayBeUndefined.<string>;
	__readonly__ var commandLabel : MayBeUndefined.<string>;
	__readonly__ var commandIcon : MayBeUndefined.<string>;
	__readonly__ var commandHidden : MayBeUndefined.<boolean>;
	__readonly__ var commandDisabled : MayBeUndefined.<boolean>;
	__readonly__ var commandChecked : MayBeUndefined.<boolean>;

	// styling
	__readonly__ var style : CSSStyleDeclaration;

	// event handler attributes
	// TODO

	// HTML5
	var innerHTML : string;

	// CSSOM
	function getBoundingClientRect() : ClientRect;
	function getClientRects() : ClientRectList;
}


// http://www.w3.org/TR/DOM-Level-2-HTML/idl-definitions.html

native class HTMLHtmlElement extends HTMLElement {
	var version : string;
}

native class HTMLHeadElement extends HTMLElement {
	var profile : string;
}

native class HTMLLinkElement extends HTMLElement {
	var disabled : boolean;
	var charset : string;
	var href : string;
	var hreflang : string;
	var media : string;
	var rel : string;
	var rev : string;
	var target : string;
	var type : string;
}

native class HTMLTitleElement extends HTMLElement {
	var text : string;
}

native class HTMLMetaElement extends HTMLElement {
	var content : string;
	var httpEquiv : string;
	var name : string;
	var scheme : string;
}

native class HTMLBaseElement extends HTMLElement {
	var href : string;
	var target : string;
}

native class HTMLIsIndexElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var prompt : string;
}

native class HTMLStyleElement extends HTMLElement {
	var disabled : boolean;
	var media : string;
	var type : string;
}

native class HTMLBodyElement extends HTMLElement {
	var aLink : string;
	var background : string;
	var bgColor : string;
	var link : string;
	var text : string;
	var vLink : string;
}

native class HTMLFormElement extends HTMLElement {
	__readonly__ var elements : HTMLCollection;
	__readonly__ var length : int;
	var name : string;
	var acceptCharset : string;
	var action : string;
	var enctype : string;
	var method : string;
	var target : string;
	function submit() : void;
	function reset() : void;
}

native class HTMLSelectElement extends HTMLElement {
	__readonly__ var type : string;
	var selectedIndex : int;
	var value : string;
	var length : int;
	__readonly__ var form : HTMLFormElement;
	__readonly__ var options : HTMLOptionsCollection;
	var disabled : boolean;
	var multiple : boolean;
	var name : string;
	var size : int;
	function add(element : HTMLElement, before : HTMLElement) : void;
	function remove(index : int) : void;
}

native class HTMLOptGroupElement extends HTMLElement {
	var disabled : boolean;
	var label : string;
}

native class HTMLOptionElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var defaultSelected : boolean;
	__readonly__ var text : string;
	__readonly__ var index : int;
	var disabled : boolean;
	var label : string;
	var selected : boolean;
	var value : string;
}

native class HTMLInputElement extends HTMLElement {
	var defaultValue : string;
	var defaultChecked : boolean;
	__readonly__ var form : HTMLFormElement;
	var accept : string;
	var accessKey : string;
	var align : string;
	var alt : string;
	var checked : boolean;
	var disabled : boolean;
	var maxLength : int;
	var name : string;
	var readOnly : boolean;
	var size : int;
	var src : string;
	var type : string;
	var useMap : string;
	var value : string;
	function select() : void;
}

native class HTMLTextAreaElement extends HTMLElement {
	var defaultValue : string;
	__readonly__ var form : HTMLFormElement;
	var accessKey : string;
	var cols : int;
	var disabled : boolean;
	var name : string;
	var readOnly : boolean;
	var rows : int;
	__readonly__ var type : string;
	var value : string;
	function select() : void;
}

native class HTMLButtonElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var accessKey : string;
	var disabled : boolean;
	var name : string;
	__readonly__ var type : string;
	var value : string;
}

native class HTMLLabelElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var accessKey : string;
	var htmlFor : string;
}

native class HTMLFieldSetElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
}

native class HTMLLegendElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var accessKey : string;
	var align : string;
}

native class HTMLUListElement extends HTMLElement {
	var compact : boolean;
	var type : string;
}

native class HTMLOListElement extends HTMLElement {
	var compact : boolean;
	var start : int;
	var type : string;
}

native class HTMLDListElement extends HTMLElement {
	var compact : boolean;
}

native class HTMLDirectoryElement extends HTMLElement {
	var compact : boolean;
}

native class HTMLMenuElement extends HTMLElement {
	var compact : boolean;
}

native class HTMLLIElement extends HTMLElement {
	var type : string;
	var value : int;
}

native class HTMLDivElement extends HTMLElement {
	var align : string;
}

native class HTMLParagraphElement extends HTMLElement {
	var align : string;
}

native class HTMLHeadingElement extends HTMLElement {
	var align : string;
}

native class HTMLQuoteElement extends HTMLElement {
	var cite : string;
}

native class HTMLPreElement extends HTMLElement {
	var width : int;
}

native class HTMLBRElement extends HTMLElement {
	var clear : string;
}

native class HTMLBaseFontElement extends HTMLElement {
	var color : string;
	var face : string;
	var size : int;
}

native class HTMLFontElement extends HTMLElement {
	var color : string;
	var face : string;
	var size : string;
}

native class HTMLHRElement extends HTMLElement {
	var align : string;
	var noShade : boolean;
	var size : string;
	var width : string;
}

native class HTMLModElement extends HTMLElement {
	var cite : string;
	var dateTime : string;
}

native class HTMLAnchorElement extends HTMLElement {
	var accessKey : string;
	var charset : string;
	var coords : string;
	var href : string;
	var hreflang : string;
	var name : string;
	var rel : string;
	var rev : string;
	var shape : string;
	var target : string;
	var type : string;
}

native class HTMLImageElement extends HTMLElement {
	var name : string;
	var align : string;
	var alt : string;
	var border : string;
	var height : int;
	var hspace : int;
	var isMap : boolean;
	var longDesc : string;
	var src : string;
	var useMap : string;
	var vspace : int;
	var width : int;

	// HTML5
	var crossOrigin : MayBeUndefined.<string>;
	__readonly__ var naturalWidth: MayBeUndefined.<int>;
	__readonly__ var naturalHeight: MayBeUndefined.<int>;
	__readonly__ var complete :MayBeUndefined.<int>;
}

native class HTMLObjectElement extends HTMLElement {
	__readonly__ var form : HTMLFormElement;
	var code : string;
	var align : string;
	var archive : string;
	var border : string;
	var codeBase : string;
	var codeType : string;
	var data : string;
	var declare : boolean;
	var height : string;
	var hspace : int;
	var name : string;
	var standby : string;
	var type : string;
	var useMap : string;
	var vspace : int;
	var width : string;
	__readonly__ var contentDocument : Document;
}

native class HTMLParamElement extends HTMLElement {
	var name : string;
	var type : string;
	var value : string;
	var valueType : string;
}

native class HTMLAppletElement extends HTMLElement {
	var align : string;
	var alt : string;
	var archive : string;
	var code : string;
	var codeBase : string;
	var height : string;
	var hspace : int;
	var name : string;
	var object : string;
	var vspace : int;
	var width : string;
}

native class HTMLMapElement extends HTMLElement {
	__readonly__ var areas : HTMLCollection;
	var name : string;
}

native class HTMLAreaElement extends HTMLElement {
	var accessKey : string;
	var alt : string;
	var coords : string;
	var href : string;
	var noHref : boolean;
	var shape : string;
	var target : string;
}

native class HTMLScriptElement extends HTMLElement {
	var text : string;
	var htmlFor : string;
	var event : string;
	var charset : string;
	var defer : boolean;
	var src : string;
	var type : string;
}

native class HTMLTableElement extends HTMLElement {
	var caption : HTMLTableCaptionElement;
	var tHead : HTMLTableSectionElement;
	var tFoot : HTMLTableSectionElement;
	__readonly__ var rows : HTMLCollection;
	__readonly__ var tBodies : HTMLCollection;
	var align : string;
	var bgColor : string;
	var border : string;
	var cellPadding : string;
	var cellSpacing : string;
	var frame : string;
	var rules : string;
	var summary : string;
	var width : string;
	function createTHead() : HTMLElement;
	function deleteTHead() : void;
	function createTFoot() : HTMLElement;
	function deleteTFoot() : void;
	function createCaption() : HTMLElement;
	function deleteCaption() : void;
	function insertRow(index : int) : HTMLElement;
	function deleteRow(index : int) : void;
}

native class HTMLTableCaptionElement extends HTMLElement {
	var align : string;
}

native class HTMLTableColElement extends HTMLElement {
	var align : string;
	var ch : string;
	var chOff : string;
	var span : int;
	var vAlign : string;
	var width : string;
}

native class HTMLTableSectionElement extends HTMLElement {
	var align : string;
	var ch : string;
	var chOff : string;
	var vAlign : string;
	__readonly__ var rows : HTMLCollection;
	function insertRow(index : int) : HTMLElement;
	function deleteRow(index : int) : void;
}

native class HTMLTableRowElement extends HTMLElement {
	__readonly__ var rowIndex : int;
	__readonly__ var sectionRowIndex : int;
	__readonly__ var cells : HTMLCollection;
	var align : string;
	var bgColor : string;
	var ch : string;
	var chOff : string;
	var vAlign : string;
	function insertCell(index : int) : HTMLElement;
	function deleteCell(index : int) : void;
}

native class HTMLTableCellElement extends HTMLElement {
	__readonly__ var cellIndex : int;
	var abbr : string;
	var align : string;
	var axis : string;
	var bgColor : string;
	var ch : string;
	var chOff : string;
	var colSpan : int;
	var headers : string;
	var height : string;
	var noWrap : boolean;
	var rowSpan : int;
	var scope : string;
	var vAlign : string;
	var width : string;
}

native class HTMLFrameSetElement extends HTMLElement {
	var cols : string;
	var rows : string;
}

native class HTMLFrameElement extends HTMLElement {
	var frameBorder : string;
	var longDesc : string;
	var marginHeight : string;
	var marginWidth : string;
	var name : string;
	var noResize : boolean;
	var scrolling : string;
	var src : string;
	__readonly__ var contentDocument : Document;
}

native class HTMLIFrameElement extends HTMLElement {
	var align : string;
	var frameBorder : string;
	var height : string;
	var longDesc : string;
	var marginHeight : string;
	var marginWidth : string;
	var name : string;
	var scrolling : string;
	var src : string;
	var width : string;
	__readonly__ var contentDocument : Document;
}


native class HTMLVideoElement extends HTMLElement {
	// TODO
}


native class HTMLCanvasElement extends HTMLElement {

	var width : int;
	var height : int;

	function toDataURL() : string;
	function toDataURL(type : string) : string;

	function toBlob(callback : function(data :string):void) : void;
	function toBlob(callback : function(data :string):void, type : string) :void;

	function getContext(contextId : string) : MayBeUndefined.<CanvasRenderingContext>;

	function addEventListener(type : string, listener : function(:MouseEvent):void) : void;
	function addEventListener(type : string, listener : function(:TouchEvent):void) : void;
}

// TODO a lot of HTML element classes!

// DOM-Browser

// http://www.w3.org/TR/Window/
// https://developer.mozilla.org/en/DOM/window

// The Window Interface
final native __fake__ class Window extends EventTarget {

	__readonly__ var window :Window;
	__readonly__ var self :Window;

	var location :Location;

	var name :string;
	__readonly__ var parent :Window;
	__readonly__ var top :Window;
	__readonly__ var frameElement :Element;

	// timers

	function setTimeout(listener : function():void, milliseconds :int) :int;
	function clearTimeout(timerID :int) :void;
	function setInterval(listener : function():void, milliseconds :int) :int;
	function clearInterval(timerID :int) :void;

	__readonly__ var applicationCache : DOMApplicationCache;
	__readonly__ var closed : boolean;
	__readonly__ var content : HTMLElement;
	__readonly__ var crypto : Crypto;
	__readonly__ var document :HTMLDocument;
	__readonly__ var defaultStatus : string;
	__readonly__ var history : History;
	__readonly__ var innerHeight : int;
	__readonly__ var innerWidth : int;
	__readonly__ var length : int;
	__readonly__ var locationbar : BarInfo;
	__readonly__ var localStorage : Storage;
	__readonly__ var menubar : boolean;
	__readonly__ var navigator :Navigator;
	__readonly__ var opener : Window;
	__readonly__ var outerHeight : int;
	__readonly__ var outerWidth : int;
	__readonly__ var pageXOffset : int;
	__readonly__ var pageYOffset : int;
	__readonly__ var performance : Performance;
	__readonly__ var personalbar : BarInfo;
	__readonly__ var screen : Screen;
	__readonly__ var screenX : int;
	__readonly__ var screenY : int;
	__readonly__ var scrollbars : BarInfo;
	__readonly__ var scrollX : int;
	__readonly__ var sessionStorage : Storage;
	__readonly__ var status : string;
	__readonly__ var statusbar : BarInfo;
	__readonly__ var toolbar : BarInfo;

	function alert(message :string) :void;
	function atob(base64encoded : string) : string;
	function blur() : void;
	function btoa(binary : string) : string;
	function close() : void;
	function confirm(message : string) : boolean;
	function find(str : string) : boolean;
	function focus() : void;
	function matchMedia(mediaQueryString : string) : MediaQueryList;
	function moveBy(deltaX : int, deltaY : int) : void;
	function moveTo(x : int, y : int) : void;
	function open(url : string) : Window;
	function open(url : string, windowName : string) : Window;
	function open(url : string, windowName : string, windowFutures : string) : Window;
	function postMessage(message : string, targetOrigin : string) : void;
	function print() : void;
	function prompt(text : string, value : string) : string;
	function resizeBy(deltaX : int, deltaY : int) : void;
	function resizeTo(x : int, y : int) : void;
	function scrollBy(deltaX : int, deltaY : int) : void;
	function showModalDialog(uri : string, args : variant, options : variant) : variant; // FIXME
	function stop() : void;

}

native __fake__ class DOMApplicationCache {
	// TODO
}

native __fake__ class Crypto {
	// TODO
}

native __fake__ class BarInfo {
	__readonly__ var visible : boolean;
}

// generated from http://www.w3.org/TR/webstorage/
native class Storage {
	__readonly__ var length : int/*unsigned long*/;
	function key(index : int/*unsigned long*/) : String/*DOMString?*/;
	// XXX: DOM spec says getImte() returns not null, but Chrome does.
	// getter
	function getItem(key : string/*DOMString*/) : String/*DOMString*/;
	// setter creator
	function setItem(
		key : string/*DOMString*/,
		value : string/*DOMString*/
	) : void;
	// deleter
	function removeItem(key : string/*DOMString*/) : void;
	function clear() : void;
}

native __fake__ class History {
	// TODO
}

native __fake__ class Navigator {
	// TODO
}

native __fake__ class Performance {
	// TODO
}

native __fake__ class Screen {
	// TODO
}

native __fake__ class MediaQueryList {
	// TODO
}

// The Location Interface
final native class Location {
	var href :string;
	var hash :string;
	var host :string;
	var hostname :string;
	var pathname :string;
	var port :string;
	var protocol :string;
	var search :string;

	function assign(url :string) :void;
	function replace(url :string) :void;
	function reload() :void;

	override
	function toString() :string;
}

// DOM level 2 Views
// http://www.w3.org/TR/DOM-Level-2-Views/

interface AbstractView {
	// TODO
}
interface DocumentView {
	// TODO
}

// DOM  Events
// http://www.w3.org/TR/DOM-Level-3-Events/

// generated from http://www.w3.org/TR/DOM-Level-3-Events/
native class Event {
	// PhaseType
	static const CAPTURING_PHASE : int/*unsigned short*/;
	static const AT_TARGET : int/*unsigned short*/;
	static const BUBBLING_PHASE : int/*unsigned short*/;
	__readonly__ var type : string/*DOMString*/;
	__readonly__ var target : EventTarget;
	__readonly__ var currentTarget : EventTarget;
	__readonly__ var eventPhase : int/*unsigned short*/;
	__readonly__ var bubbles : boolean;
	__readonly__ var cancelable : boolean;
	__readonly__ var timeStamp : number/*DOMTimeStamp*/;
	function stopPropagation() : void;
	function preventDefault() : void;
	function initEvent(
		eventTypeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean
	) : void;
	// Introduced in DOM Level 3:
	function stopImmediatePropagation() : void;
	__readonly__ var defaultPrevented : boolean;
	__readonly__ var isTrusted : boolean;
}

native class CustomEvent extends Event {
	__readonly__ var detail : variant/*any*/;
	function initCustomEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		detailArg : variant/*any*/
	) : void;
}

native class EventTarget {
	// Modified in DOM Level 3:
	function addEventListener(
		type : string/*DOMString*/,
		listener : function(:Event):void/*EventListener*/
	) : void;
	function removeEventListener(
		type : string/*DOMString*/,
		listener : function(:Event):void/*EventListener*/
	) : void;
	function addEventListener(
		type : string/*DOMString*/,
		listener : function(:Event):void/*EventListener*/,
		useCapture : boolean
	) : void;
	function removeEventListener(
		type : string/*DOMString*/,
		listener : function(:Event):void/*EventListener*/,
		useCapture : boolean
	) : void;
	function dispatchEvent(evt : Event) : boolean;
}

native __fake__ class DocumentEvent {
	// Modified in DOM Level 3:
	function createEvent(eventInterface : string/*DOMString*/) : Event;
}

native class UIEvent extends Event {
	__readonly__ var view : AbstractView;
	__readonly__ var detail : int/*long*/;
	function initUIEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		detailArg : int/*long*/
	) : void;
}

native class FocusEvent extends UIEvent {
	__readonly__ var relatedTarget : EventTarget;
	function initFocusEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		detailArg : int/*long*/,
		relatedTargetArg : EventTarget
	) : void;
}

native class MouseEvent extends UIEvent {
	__readonly__ var screenX : int/*long*/;
	__readonly__ var screenY : int/*long*/;
	__readonly__ var clientX : int/*long*/;
	__readonly__ var clientY : int/*long*/;
	__readonly__ var ctrlKey : boolean;
	__readonly__ var shiftKey : boolean;
	__readonly__ var altKey : boolean;
	__readonly__ var metaKey : boolean;
	__readonly__ var button : int/*unsigned short*/;
	__readonly__ var buttons : int/*unsigned short*/;
	__readonly__ var relatedTarget : EventTarget;
	function initMouseEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		detailArg : int/*long*/,
		screenXArg : int/*long*/,
		screenYArg : int/*long*/,
		clientXArg : int/*long*/,
		clientYArg : int/*long*/,
		ctrlKeyArg : boolean,
		altKeyArg : boolean,
		shiftKeyArg : boolean,
		metaKeyArg : boolean,
		buttonArg : int/*unsigned short*/,
		relatedTargetArg : EventTarget
	) : void;
	// Introduced in DOM Level 3:
	function getModifierState(keyArg : string/*DOMString*/) : boolean;
}

native class WheelEvent extends MouseEvent {
	// DeltaModeCode
	static const DOM_DELTA_PIXEL : int/*unsigned long*/;
	static const DOM_DELTA_LINE : int/*unsigned long*/;
	static const DOM_DELTA_PAGE : int/*unsigned long*/;
	__readonly__ var deltaX : number/*float*/;
	__readonly__ var deltaY : number/*float*/;
	__readonly__ var deltaZ : number/*float*/;
	__readonly__ var deltaMode : int/*unsigned long*/;
	function initWheelEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		detailArg : int/*long*/,
		screenXArg : int/*long*/,
		screenYArg : int/*long*/,
		clientXArg : int/*long*/,
		clientYArg : int/*long*/,
		buttonArg : int/*unsigned short*/,
		relatedTargetArg : EventTarget,
		modifiersListArg : string/*DOMString*/,
		deltaXArg : number/*float*/,
		deltaYArg : number/*float*/,
		deltaZArg : number/*float*/,
		deltaMode : int/*unsigned long*/
	) : void;
}

native class TextEvent extends UIEvent {
	// InputMethodCode
	static const DOM_INPUT_METHOD_UNKNOWN : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_KEYBOARD : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_PASTE : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_DROP : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_IME : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_OPTION : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_HANDWRITING : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_VOICE : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_MULTIMODAL : int/*unsigned long*/;
	static const DOM_INPUT_METHOD_SCRIPT : int/*unsigned long*/;
	__readonly__ var data : string/*DOMString*/;
	__readonly__ var inputMethod : int/*unsigned long*/;
	__readonly__ var locale : string/*DOMString*/;
	function initTextEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		dataArg : string/*DOMString*/,
		inputMethod : int/*unsigned long*/,
		localeArg : string/*DOMString*/
	) : void;
}

native class KeyboardEvent extends UIEvent {
	// KeyLocationCode
	static const DOM_KEY_LOCATION_STANDARD : int/*unsigned long*/;
	static const DOM_KEY_LOCATION_LEFT : int/*unsigned long*/;
	static const DOM_KEY_LOCATION_RIGHT : int/*unsigned long*/;
	static const DOM_KEY_LOCATION_NUMPAD : int/*unsigned long*/;
	static const DOM_KEY_LOCATION_MOBILE : int/*unsigned long*/;
	static const DOM_KEY_LOCATION_JOYSTICK : int/*unsigned long*/;
	__readonly__ var char : string/*DOMString*/;
	__readonly__ var key : string/*DOMString*/;
	__readonly__ var location : int/*unsigned long*/;
	__readonly__ var ctrlKey : boolean;
	__readonly__ var shiftKey : boolean;
	__readonly__ var altKey : boolean;
	__readonly__ var metaKey : boolean;
	__readonly__ var repeat : boolean;
	__readonly__ var locale : string/*DOMString*/;
	function getModifierState(keyArg : string/*DOMString*/) : boolean;
	function initKeyboardEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		charArg : string/*DOMString*/,
		keyArg : string/*DOMString*/,
		locationArg : int/*unsigned long*/,
		modifiersListArg : string/*DOMString*/,
		repeat : boolean,
		localeArg : string/*DOMString*/
	) : void;
}

native class CompositionEvent extends UIEvent {
	__readonly__ var data : string/*DOMString*/;
	__readonly__ var locale : string/*DOMString*/;
	function initCompositionEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		dataArg : string/*DOMString*/,
		localeArg : string/*DOMString*/
	) : void;
}

native class MutationEvent extends Event {
	// attrChangeType
	static const MODIFICATION : int/*unsigned short*/;
	static const ADDITION : int/*unsigned short*/;
	static const REMOVAL : int/*unsigned short*/;
	__readonly__ var relatedNode : Node;
	__readonly__ var prevValue : string/*DOMString*/;
	__readonly__ var newValue : string/*DOMString*/;
	__readonly__ var attrName : string/*DOMString*/;
	__readonly__ var attrChange : int/*unsigned short*/;
	function initMutationEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		relatedNodeArg : Node,
		prevValueArg : string/*DOMString*/,
		newValueArg : string/*DOMString*/,
		attrNameArg : string/*DOMString*/,
		attrChangeArg : int/*unsigned short*/
	) : void;
}

native class MutationNameEvent extends MutationEvent {
	__readonly__ var prevNamespaceURI : string/*DOMString*/;
	__readonly__ var prevNodeName : string/*DOMString*/;
	// Introduced in DOM Level 3:
	function initMutationNameEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		relatedNodeArg : Node,
		prevNamespaceURIArg : string/*DOMString*/,
		prevNodeNameArg : string/*DOMString*/
	) : void;
}


// http://www.w3.org/TR/touch-events/

native class Touch {
	__readonly__ var identifier : int;
	__readonly__ var target : EventTarget;
	__readonly__ var screenX : int;
	__readonly__ var screenY : int;
	__readonly__ var clientX : int;
	__readonly__ var clientY : int;
	__readonly__ var pageX : int;
	__readonly__ var pageY : int;
}

/*
native class TouchList {
	__readonly__ var length : int;
	function item(index : int) : Touch;
	function identifiedTouch(identifier : int) : Touch;
}
*/

native class TouchEvent extends UIEvent {
	__readonly__ var touches : Touch[];
	__readonly__ var targetTouches : Touch[];
	__readonly__ var changedTouches : Touch[];
	__readonly__ var altKey : boolean;
	__readonly__ var metaKey : boolean;
	__readonly__ var ctrlKey : boolean;
	__readonly__ var shiftKey : boolean;
}

// XHR
// http://www.w3.org/TR/XMLHttpRequest/

native class XMLHttpRequestEventTarget extends EventTarget {
	function addEventListener(target : string, listener : function(:ProgressEvent):void) : void;
	function removeEventListener(target : string, listener : function(:ProgressEvent):void) : void;
}

native class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
}

native class XMLHttpRequest extends XMLHttpRequestEventTarget {
	static const UNSENT : int;
	static const OPENED : int;
	static const HEADERS_RECEIVED : int;
	static const LOADING : int;
	static const DONE : int;

	function constructor();

	__readonly__ var readyState :int;

	// request

	function open(method : string, url : string) : void;
	function open(method : string, url : string, async : boolean) : void;

	function setRequestHeader(header : string, value : string) : void;

	__readonly__ var upload : XMLHttpRequestUpload;

	function send() : void;
	function send(data : string) : void;
	function send(data : String) : void;
	// FIXME function send(data : ArrayBuffer) : void;
	// FIXME function send(data : Blob) : void;
	function send(data : Document) : void;
	// FIXME function send(data : FormData) : void;

	function abort() : void;

	// response

	__readonly__ var status : int;
	__readonly__ var statusText : string;
	function getResponseHeader(header : string) : string;
	function getAllResponseHeaders() : string;
	function overrideMimeType(mime : string) :void;
	__readonly__ var responseType : string;
	__readonly__ var response : variant;
	__readonly__ var responseText : string;
	__readonly__ var responseXML : Document;
}

// http://dvcs.w3.org/hg/progress/raw-file/tip/Overview.html#progressevent

native class ProgressEvent extends Event {
	__readonly__ var lengthComputable : boolean;
	__readonly__ var loaded : number;
	__readonly__ var total : number;
}

// Canvas

interface CanvasRenderingContext { }

// JSX interface to DOM

final class dom {
	static const window = js.global["window"] as __noconvert__ Window;

	static function getWindow() : Window {
		return dom.window;
	}

	static function id(identifier : string) : HTMLElement {
		return dom.window.document.getElementById(identifier)
			as __noconvert__ HTMLElement;
	}
}
