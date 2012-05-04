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

native class Node {
	static const var ELEMENT_NODE : int;
	static const var ATTRIBUTE_NODE : int;
	static const var TEXT_NODE : int;
	static const var CDATA_SECTION_NODE : int;
	static const var ENTITY_REFERENCE_NODE : int;
	static const var ENTITY_NODE : int;
	static const var PROCESSING_INSTRUCTION_NODE : int;
	static const var COMMENT_NODE : int;
	static const var DOCUMENT_NODE : int;
	static const var DOCUMENT_TYPE_NODE : int;
	static const var DOCUMENT_FRAGMENT_NODE : int;
	static const var NOTATION_NODE : int;

	const var nodeName : string;
	var nodeValue : string;
	const var nodeType : int;
	const var parentNode : string;
	const var childNodes : NodeList;
	const var firstChild : Node;
	const var lastChild : Node;
	const var previousSibling : Node;
	const var nextSibling : Node;
	const var attributes : NamedNodeMap;

	function insertBefore(newChild : Node, refChild : Node) : Node;
	function replaceChild(newChild : Node, oldChild : Node) : Node;
	function removeChild(oldChild : Node) : Node;
	function appendChild(newChild : Node) : Node;

	function hasChildNodes() : boolean;
	function cloneNode(deep : boolean) : Node;

	function normalize() : void;

	function isSupported(feature : string, version : string) : boolean;
	const var namespaceURI : string;
	const var prefix : string;
	const var localName : string;
	function hasAttributes() : boolean;
	const var baseURI : string;

	// DocumentPosition
	static const var DOCUMENT_POSITION_DISCONNECTED : int;
	static const var DOCUMENT_POSITION_PRECEDING : int;
	static const var DOCUMENT_POSITION_FOLLOWING : int;
	static const var DOCUMENT_POSITION_CONTAINS : int;
	static const var DOCUMENT_POSITION_CONTAINED_BY : int;
	static const var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : int;
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
	const var length : int;
}

native class NamedNodeMap {
	// TODO
}

native class CharacterData extends Node {
	// TODO
}

native class Attr extends Node {
	const var name : string;
	const var specified : boolean;
	const var value : string;
	const var ownerElement : Element;
	const var schemaTypeInfo : TypeInfo;
	const var isId : boolean;
}

native class TypeInfo {
	// TODO
}

native class Element extends Node {
	const var tagName : string;

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
	function removeAttributeNS(namespaceURI : string, localName : string) : string;
	function getElementsByTagNameNS(namespaceURI : string, localName : string) : NodeList;

	function hasAttribute(name : string) : boolean;
	function hasAttributeNS(namespaceURI : string, name : string) : boolean;

	// introduced in DOM level 3
	const var schemaTypeInfo : TypeInfo;
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
	static const var NODE_CLONED : int;
	static const var NODE_IMPORTED : int;
	static const var NODE_DELETED : int;
	static const var NODE_RENAMED : int;
	static const var NODE_ADOPTED : int;
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
	const var doctype : DocumentType;
	const var implementation : DOMImplementation;
	const var documentElement : Element;

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

	const var inputEncoding : string;
	const var xmlEncoding : string; // FIXME: Chrome may return null
	var xmlStandalone : boolean;
	var xmlVersion : string;
	var strictErrorChecking : boolean;
	var documentURI : string;

	function adoptNode(source : Node) : Node;

	const var domConfig : DOMConfiguration;
	function normalizeDocument() : void;
	function renameNode(n : Node, namespaceURI : string, qualifiedName : string) : Node;

	// implements interface DocumentEvent
	function createEvent(eventInterface : string) : Event;
}

// DOM-HTML
// http: //www.w3.org/TR/DOM-Level-2-HTML/
// (cf. http://www.w3.org/TR/html5-author/)

native class HTMLCollection {
	const var length : int;
	function item(index : int) : Node;
	function namedItem(name : string) : Node;
}

native class HTMLDocument extends Document {
	var title : string;

	const var referrer : string;
	const var domain : string;
	const var URL : string;
	const var body : HTMLElement;

	const var images : HTMLCollection;
	const var applets : HTMLCollection;
	const var links : HTMLCollection;
	const var forms : HTMLCollection;
	const var anchors : HTMLCollection;

	var cookie : string;

	function open() : void;
	function close() : void;

	function write(text : string) : void;
	function writeln(text : string) : void;

	function getElementsByName(elementName : string) : NodeList;
}

native class DOMTokenList {
	// TODO
}

native class DOMSettableTokenList {
	// TODO
}

native class DOMStringList {
	function item(index : int) : string;
	const var length : int;
	function contains(str : string) : boolean;
}

native class DOMStringMap {
	// TODO
}

native class CSSStyleDeclaration {
	// TODO
}

native class ClientRect {
	const var top : number;
	const var right : number;
	const var bottom : number;
	const var left : number;
	const var width : number;
	const var height : number;
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
	const var accessKeyLabel : string;
	var draggable : boolean;
	const var dropzone : DOMSettableTokenList;
	var contentEditable : string;
	const var isContentEditable : boolean;
	var contextMenu : MayBeUndefined.<HTMLMenuElement>;
	var spellcheck : boolean;

	function click() : void;
	function focus() : void;
	function blur() : void;

	// command API
	const var commandType : MayBeUndefined.<string>;
	const var commandLabel : MayBeUndefined.<string>;
	const var commandIcon : MayBeUndefined.<string>;
	const var commandHidden : MayBeUndefined.<boolean>;
	const var commandDisabled : MayBeUndefined.<boolean>;
	const var commandChecked : MayBeUndefined.<boolean>;

	// styling
	const var style : CSSStyleDeclaration;

	// event handler attributes
	// TODO

	// HTML5
	var innerHTML : string;

	// CSSOM
	function getBoundingClientRect() : ClientRect;
	function getClientRects() : ClientRectList;
}

native class HTMLHtmlElement extends HTMLElement {
	var version :string;
}

native class HTMLHeadElement extends HTMLElement {
	var profile :string;
}

native class HTMLLinkElement extends HTMLElement {
	// TODO
}

native class HTMLTitleElement extends HTMLElement {
	// TODO
}

native class HTMLMetaElement extends HTMLElement {
	// TODO
}

native class HTMLBaseElement extends HTMLElement {
	// TODO
}

native class HTMLImageElement extends HTMLElement {
	// TODO
}

native class HTMLVideoElement extends HTMLElement {
	// TODO
}

native class HTMLMenuElement extends HTMLElement {
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
}

// TODO a lot of HTML element classes!

// DOM-Browser

// http://www.w3.org/TR/Window/

// The Window Interface
final native class Window {

	const var window :Window;
	const var self :Window;

	var location :Location;

	var name :string;
	const var parent :Window;
	const var top :Window;
	const var frameElement :Element;

	// timers

	function setTimeout(listener : function():void, milliseconds :int) :int;
	function clearTimeout(timerID :int) :void;
	function setInterval(listener : function():void, milliseconds :int) :int;
	function clearInterval(timerID :int) :void;

	// browser-defined properties

	const var document :Document;
	const var navigator :variant; // FIXME

	function alert(message :string) :void;
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

native class Event {
	static const var CAPTURING_PHASE : int;
	static const var AT_TARGET : int;
	static const var BUBBLING_PHASE : int;

	const var type : string;
	const var target : EventTarget;
	const var currentTarget : EventTarget;
	const var eventPhase : int;
	const var bubbles : boolean;
	const var cancelable : boolean;
	const var timeStamp : int;

	function stopPropagation() : void;
	function preventDefault() : void;
	function initEvent(eventTypeArg : string, canBubbleArg : boolean, cancelableArg : boolean) : void;

	// DOM level 3

	function stopImmediatePropagation() : void;
	const var defaultPrevented : boolean;
	const var isTrusted : boolean;
}

native class CustomEvent extends Event {
	// TODO
}

native class EventTarget {
	// TODO

	function addEventListener(target : string, listener : function(:Event):void) : void;
	function addEventListener(target : string, listener : function(:Event):void, useCapture : boolean) : void;

	function removeEventListener(target : string, listener : function(:Event):void) : void;
	function removeEventListener(target : string, listener : function(:Event):void, useCapture : boolean) : void;

	function dispatchEvent(evt : Event) : void;
}

native class UIEvent extends Event {
	// TODO
}

native class ForcusEvent extends UIEvent {
	// TODO
}

native class MouseEvent extends UIEvent {
	const var screenX : int;
	const var screenY : int;
	const var clientX : int;
	const var clientY : int;
	const var ctrlKey : boolean;
	const var shiftKey : boolean;
	const var altKey : boolean;
	const var metaKey : boolean;
	const var button : int;
	const var buttons : int;
	const var relatedTarget : EventTarget;

	function initMouseEvent(
		typeArg : string,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		viewArg : AbstractView,
		detailArg : int,
		screenYArg : int,
		screenYArg : int,
		clientXArg : int,
		clientYArg : int,
		ctrlKeyArg : boolean,
		altKeyArg : boolean,
		shiftKeyArg : boolean,
		metaKeyArg : boolean,
		buttonArg : int,
		relatedTargetArg : EventTarget ) : void;

	function getModifierState(keyArg : string) : boolean;
}

native class WheelEvent extends MouseEvent {
	// TODO
}

native class TextEvent extends UIEvent {
	// TODO
}

native class KeyboardEvent extends UIEvent {
	// TODO
}

native class CompositionEvent extends UIEvent {
	// TODO
}

native class MutationEvent extends Event {
	// TODO
}

native class MutationNameEvent extends MutationEvent {
	// TODO
}

// http://www.w3.org/TR/touch-events/

native class Touch {
	const var identifier : int;
	const var target : EventTarget;
	const var screenX : int;
	const var screenY : int;
	const var clientX : int;
	const var clientY : int;
	const var pageX : int;
	const var pageY : int;
}

/*
native class TouchList {
	const var length : int;
	function item(index : int) : Touch;
	function identifiedTouch(identifier : int) : Touch;
}
*/

native class TouchEvent extends UIEvent {
	const var touches : Touch[];
	const var targetTouches : Touch[];
	const var changedTouches : Touch[];
	const var altKey : boolean;
	const var metaKey : boolean;
	const var ctrlKey : boolean;
	const var shiftKey : boolean;
}

// XHR
// http://www.w3.org/TR/XMLHttpRequest/

native class XMLHttpRequestEventTarget extends EventTarget {
	// TODO
}

native class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	// TODO
}

native class XMLHttpRequest extends XMLHttpRequestEventTarget {
	static const var UNSENT : int;
	static const var OPENED : int;
	static const var HEADERS_RECEIVED : int;
	static const var LOADING : int;
	static const var DONE : int;

	function constructor();

	const var readyState :int;

	// request

	function open(method : string, url : string) : void;
	function open(method : string, url : string, async : boolean) : void;

	function setRequestHeader(header : string, value : string) : void;

	const var upload : XMLHttpRequestUpload;

	function send() : void;
	function send(data : string) : void;
	function abort() : void;

	// response

	const var status : int;
	const var statusText : string;
	function getResponseHeader(header : string) : string;
	function getAllResponseHeaders() : string;
	function overrideMimeType(mime : string) :void;
	const var responseType : string;
	const var response : variant;
	const var responseText : string;
	const var responseXML : Document;
}

// CanvasRenderingContext

// http://www.w3.org/TR/2dcontext/

native class CanvasRenderingContext { }

native class CanvasRenderingContext2D extends CanvasRenderingContext
	/* implements CanvasTransformation, CanvasLineStyles, CanvasPathMethods, CanvasText */ {
	// back-reference to the canvas
	const var canvas : HTMLCanvasElement;

	// state
	function save() : void;
	function restore() : void;

	// compositiong
	var globalAlpha : number;
	var globalCompositeOperation : string;

	// clors and styles
	var strokeStyle : variant;
	var fillStyle : variant;
	function createLinearGradient(x0 : number, y0 : number, x1 : number, y1 : number) :CanvasGradient;
	function createRadialGradient(x0 : number, y0 : number, r0 : number, x1 : number, y1 : number, r1 : number) :CanvasGradient;
	function createPattern(image : HTMLImageElement, repetition : string) : CanvasPattern;
	function createPattern(image : HTMLCanvasElement, repetition : string) : CanvasPattern;
	function createPattern(image : HTMLVideoElement, repetition : string) : CanvasPattern;

	// shadows
	var shadowOffsetX : number;
	var shadowOffsetY : number;
	var shadowBlur : number;
	var shadowColor : string;

	// rects
	function clearRect(x : number, y : number, w : number, h : number) :void;
	function fillRect(x : number, y : number, w : number, h : number) : void;
	function strokeRect(x : number, y : number, w : number, h : number) : void;

	// current default path API (see also CanvasPathMethods)
	function beginPath() : void;
	function fill() : void;
	function stroke() : void;
	function drawSystemFocusRing(element : Element) : void;
	function drawCustomFocusRing(element : Element) : boolean;
	function scrollPathIntoView() : void;
	function clip() : void;
	function isPointInPath(x : number, y : number) : void;

	// text (see also CanvasText interface)
	function fillTdxt(text : string, x : number, y : number) : void;
	function fillTdxt(text : string, x : number, y : number, maxWidth : number) : void;
	function fillTdxt(text : string, x : number, y : number) : void;
	function fillTdxt(text : string, x : number, y : number, maxWidth : number) : void;
	function measureText(text : string) : TextMetrics;

	// drawing images
	// (dx, dy)
	function drawImage( image : HTMLImageElement,  dx : number, dy : number) : void;
	function drawImage( image : HTMLCanvasElement, dx : number, dy : number) : void;
	function drawImage( image : HTMLVideoElement,  dx : number, dy : number) : void;
	// (dx, dy, dw, dh)
	function drawImage( image : HTMLImageElement,  dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLCanvasElement, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLVideoElement,  dx : number, dy : number, dw : number, dh : number) : void;
	// (sx, sy, sw, sh, dx, dy, dw, dh)
	function drawImage( image : HTMLImageElement,  sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLCanvasElement, sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLVideoElement,  sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;

	// pixel manipulation
	function createImageData(sw : number, sh : number) : ImageData;
	function createImageData(imageData : ImageData) : ImageData;
	function putImageData(imageData : ImageData, dx : number, dy : number) : ImageData;
	function putImageData(imageData : ImageData, dx : number, dy : number, dirtyX : number, dirtyY : number, dirtyWidth : number, dirtyHeight : number) : ImageData;
}

native class CanvasTransformation {
	function scale(x : number, y : number) : void;
	function rotate(angle : number) : void;
	function translate(x : number, y : number) : void;
	function transform(a : number, b : number, c : number, d : number, e : number, f : number) : void;
	function SetTransform(a : number, b : number, c : number, d : number, e : number, f : number) : void;
}

native class CanvasPathMethods {
	// TODO
}

native class CanvasGradient {
	// TODO
}

native class CanvasPattern {
	// TODO
}

native class TextMetrics {
	// TODO
}

native class ImageData {
	// TODO
}

// End of CanvasRenderingContext

// JSX interface to DOM

final class dom {
	static function getWindow() :Window{
		// NOTE: the symbol Window doesn't exist; it's a virtual class.
		return js.global["window"] as __nocheck__ Window;
	}

	static function id(identifier : string) : HTMLElement {
		return dom.getWindow().document.getElementById(identifier)
			as __nocheck__ HTMLElement;
	}
}
