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

	cf.
	http://es-operating-system.googlecode.com/svn/trunk/esidl/dom/html5.idl
*/

import "js.jsx";
import "css.jsx";
import "typedarray.jsx";

// DOM-Core

// http://www.w3.org/TR/DOM-Level-3-Core/

// generated from http://www.w3.org/TR/DOM-Level-3-Core/idl-definitions.html
native class DOMException {
	// FIXME: delete function constructor();
	var code : int/*unsigned short*/;
}

native class DOMStringList {
	// FIXME: delete function constructor();
	function item(index : int/*unsigned long*/) : string/*DOMString*/;
	__readonly__ var length : int/*unsigned long*/;
	function contains(str : string/*DOMString*/) : boolean;
}

native class NameList {
	// FIXME: delete function constructor();
	function getName(index : int/*unsigned long*/) : string/*DOMString*/;
	function getNamespaceURI(
		index : int/*unsigned long*/
	) : string/*DOMString*/;
	__readonly__ var length : int/*unsigned long*/;
	function contains(str : string/*DOMString*/) : boolean;
	function containsNS(
		namespaceURI : string/*DOMString*/,
		name : string/*DOMString*/
	) : boolean;
}

native class DOMImplementationList {
	// FIXME: delete function constructor();
	function item(index : int/*unsigned long*/) : DOMImplementation;
	__readonly__ var length : int/*unsigned long*/;
}

native class DOMImplementationSource {
	// FIXME: delete function constructor();
	function getDOMImplementation(
		features : string/*DOMString*/
	) : DOMImplementation;
	function getDOMImplementationList(
		features : string/*DOMString*/
	) : DOMImplementationList;
}

native class DOMImplementation {
	// FIXME: delete function constructor();
	function hasFeature(
		feature : string/*DOMString*/,
		version : string/*DOMString*/
	) : boolean;
	// Introduced in DOM Level 2:
	function createDocumentType(
		qualifiedName : string/*DOMString*/,
		publicId : string/*DOMString*/,
		systemId : string/*DOMString*/
	) : DocumentType;
	// Introduced in DOM Level 2:
	function createDocument(
		namespaceURI : string/*DOMString*/,
		qualifiedName : string/*DOMString*/,
		doctype : DocumentType
	) : Document;
	// Introduced in DOM Level 3:
	function getFeature(
		feature : string/*DOMString*/,
		version : string/*DOMString*/
	) : Object/*DOMObject*/;
}

native class Node extends EventTarget {
	// FIXME: delete function constructor();
	// NodeType
	static const     ELEMENT_NODE : int/*unsigned short*/;
	__readonly__ var ELEMENT_NODE : int/*unsigned short*/;
	static const     ATTRIBUTE_NODE : int/*unsigned short*/;
	__readonly__ var ATTRIBUTE_NODE : int/*unsigned short*/;
	static const     TEXT_NODE : int/*unsigned short*/;
	__readonly__ var TEXT_NODE : int/*unsigned short*/;
	static const     CDATA_SECTION_NODE : int/*unsigned short*/;
	__readonly__ var CDATA_SECTION_NODE : int/*unsigned short*/;
	static const     ENTITY_REFERENCE_NODE : int/*unsigned short*/;
	__readonly__ var ENTITY_REFERENCE_NODE : int/*unsigned short*/;
	static const     ENTITY_NODE : int/*unsigned short*/;
	__readonly__ var ENTITY_NODE : int/*unsigned short*/;
	static const     PROCESSING_INSTRUCTION_NODE : int/*unsigned short*/;
	__readonly__ var PROCESSING_INSTRUCTION_NODE : int/*unsigned short*/;
	static const     COMMENT_NODE : int/*unsigned short*/;
	__readonly__ var COMMENT_NODE : int/*unsigned short*/;
	static const     DOCUMENT_NODE : int/*unsigned short*/;
	__readonly__ var DOCUMENT_NODE : int/*unsigned short*/;
	static const     DOCUMENT_TYPE_NODE : int/*unsigned short*/;
	__readonly__ var DOCUMENT_TYPE_NODE : int/*unsigned short*/;
	static const     DOCUMENT_FRAGMENT_NODE : int/*unsigned short*/;
	__readonly__ var DOCUMENT_FRAGMENT_NODE : int/*unsigned short*/;
	static const     NOTATION_NODE : int/*unsigned short*/;
	__readonly__ var NOTATION_NODE : int/*unsigned short*/;
	__readonly__ var nodeName : string/*DOMString*/;
	var nodeValue : string/*DOMString*/;
	// raises(DOMException) on setting
	// raises(DOMException) on retrieval
	__readonly__ var nodeType : int/*unsigned short*/;
	__readonly__ var parentNode : Node;
	__readonly__ var childNodes : NodeList;
	__readonly__ var firstChild : Node;
	__readonly__ var lastChild : Node;
	__readonly__ var previousSibling : Node;
	__readonly__ var nextSibling : Node;
	__readonly__ var attributes : NamedNodeMap;
	// Modified in DOM Level 2:
	__readonly__ var ownerDocument : Document;
	// Modified in DOM Level 3:
	function insertBefore(newChild : Node, refChild : Node) : Node;
	// Modified in DOM Level 3:
	function replaceChild(newChild : Node, oldChild : Node) : Node;
	// Modified in DOM Level 3:
	function removeChild(oldChild : Node) : Node;
	// Modified in DOM Level 3:
	function appendChild(newChild : Node) : Node;
	function hasChildNodes() : boolean;
	function cloneNode(deep : boolean) : Node;
	// Modified in DOM Level 3:
	function normalize() : void;
	// Introduced in DOM Level 2:
	function isSupported(
		feature : string/*DOMString*/,
		version : string/*DOMString*/
	) : boolean;
	// Introduced in DOM Level 2:
	__readonly__ var namespaceURI : string/*DOMString*/;
	// Introduced in DOM Level 2:
	var prefix : string/*DOMString*/;
	// raises(DOMException) on setting
	// Introduced in DOM Level 2:
	__readonly__ var localName : string/*DOMString*/;
	// Introduced in DOM Level 2:
	function hasAttributes() : boolean;
	// Introduced in DOM Level 3:
	__readonly__ var baseURI : string/*DOMString*/;
	// DocumentPosition
	static const     DOCUMENT_POSITION_DISCONNECTED : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_DISCONNECTED : int/*unsigned short*/;
	static const     DOCUMENT_POSITION_PRECEDING : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_PRECEDING : int/*unsigned short*/;
	static const     DOCUMENT_POSITION_FOLLOWING : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_FOLLOWING : int/*unsigned short*/;
	static const     DOCUMENT_POSITION_CONTAINS : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_CONTAINS : int/*unsigned short*/;
	static const     DOCUMENT_POSITION_CONTAINED_BY : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_CONTAINED_BY : int/*unsigned short*/;
	static const     DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : int/*unsigned short*/;
	__readonly__ var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : int/*unsigned short*/;
	// Introduced in DOM Level 3:
	function compareDocumentPosition(
		other : Node
	) : int/*unsigned short*/;
	// Introduced in DOM Level 3:
	var textContent : string/*DOMString*/;
	// raises(DOMException) on setting
	// raises(DOMException) on retrieval
	// Introduced in DOM Level 3:
	function isSameNode(other : Node) : boolean;
	// Introduced in DOM Level 3:
	function lookupPrefix(
		namespaceURI : string/*DOMString*/
	) : string/*DOMString*/;
	// Introduced in DOM Level 3:
	function isDefaultNamespace(
		namespaceURI : string/*DOMString*/
	) : boolean;
	// Introduced in DOM Level 3:
	function lookupNamespaceURI(
		prefix : string/*DOMString*/
	) : string/*DOMString*/;
	// Introduced in DOM Level 3:
	function isEqualNode(arg : Node) : boolean;
	// Introduced in DOM Level 3:
	function getFeature(
		feature : string/*DOMString*/,
		version : string/*DOMString*/
	) : Object/*DOMObject*/;
	// Introduced in DOM Level 3:
	function setUserData(
		key : string/*DOMString*/,
		data : variant/*DOMUserData*/,
		handler : function(operation:int,key:string,data:variant,src:Node,dst:Node):void/*UserDataHandler*/
	) : variant/*DOMUserData*/;
	// Introduced in DOM Level 3:
	function getUserData(
		key : string/*DOMString*/
	) : variant/*DOMUserData*/;
}

native class NodeList {
	// FIXME: delete function constructor();
	function item(index : int/*unsigned long*/) : Node;
	__readonly__ var length : int/*unsigned long*/;
}

native class NamedNodeMap {
	// FIXME: delete function constructor();
	function getNamedItem(name : string/*DOMString*/) : Node;
	function setNamedItem(arg : Node) : Node;
	function removeNamedItem(name : string/*DOMString*/) : Node;
	function item(index : int/*unsigned long*/) : Node;
	__readonly__ var length : int/*unsigned long*/;
	// Introduced in DOM Level 2:
	function getNamedItemNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : Node;
	// Introduced in DOM Level 2:
	function setNamedItemNS(arg : Node) : Node;
	// Introduced in DOM Level 2:
	function removeNamedItemNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : Node;
}

native class CharacterData extends Node {
	// FIXME: delete function constructor();
	var data : string/*DOMString*/;
	// raises(DOMException) on setting
	// raises(DOMException) on retrieval
	__readonly__ var length : int/*unsigned long*/;
	function substringData(
		offset : int/*unsigned long*/,
		count : int/*unsigned long*/
	) : string/*DOMString*/;
	function appendData(arg : string/*DOMString*/) : void;
	function insertData(
		offset : int/*unsigned long*/,
		arg : string/*DOMString*/
	) : void;
	function deleteData(
		offset : int/*unsigned long*/,
		count : int/*unsigned long*/
	) : void;
	function replaceData(
		offset : int/*unsigned long*/,
		count : int/*unsigned long*/,
		arg : string/*DOMString*/
	) : void;
}

native class Attr extends Node {
	// FIXME: delete function constructor();
	__readonly__ var name : string/*DOMString*/;
	__readonly__ var specified : boolean;
	var value : string/*DOMString*/;
	// raises(DOMException) on setting
	// Introduced in DOM Level 2:
	__readonly__ var ownerElement : Element;
	// Introduced in DOM Level 3:
	__readonly__ var schemaTypeInfo : TypeInfo;
	// Introduced in DOM Level 3:
	__readonly__ var isId : boolean;
}

native class Element extends Node {
	// FIXME: delete function constructor();
	__readonly__ var tagName : string/*DOMString*/;
	function getAttribute(
		name : string/*DOMString*/
	) : string/*DOMString*/;
	function setAttribute(
		name : string/*DOMString*/,
		value : string/*DOMString*/
	) : void;
	function removeAttribute(name : string/*DOMString*/) : void;
	function getAttributeNode(name : string/*DOMString*/) : Attr;
	function setAttributeNode(newAttr : Attr) : Attr;
	function removeAttributeNode(oldAttr : Attr) : Attr;
	function getElementsByTagName(name : string/*DOMString*/) : NodeList;
	// Introduced in DOM Level 2:
	function getAttributeNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : string/*DOMString*/;
	// Introduced in DOM Level 2:
	function setAttributeNS(
		namespaceURI : string/*DOMString*/,
		qualifiedName : string/*DOMString*/,
		value : string/*DOMString*/
	) : void;
	// Introduced in DOM Level 2:
	function removeAttributeNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : void;
	// Introduced in DOM Level 2:
	function getAttributeNodeNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : Attr;
	// Introduced in DOM Level 2:
	function setAttributeNodeNS(newAttr : Attr) : Attr;
	// Introduced in DOM Level 2:
	function getElementsByTagNameNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : NodeList;
	// Introduced in DOM Level 2:
	function hasAttribute(name : string/*DOMString*/) : boolean;
	// Introduced in DOM Level 2:
	function hasAttributeNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : boolean;
	// Introduced in DOM Level 3:
	__readonly__ var schemaTypeInfo : TypeInfo;
	// Introduced in DOM Level 3:
	function setIdAttribute(
		name : string/*DOMString*/,
		isId : boolean
	) : void;
	// Introduced in DOM Level 3:
	function setIdAttributeNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/,
		isId : boolean
	) : void;
	// Introduced in DOM Level 3:
	function setIdAttributeNode(idAttr : Attr, isId : boolean) : void;
}

native class Text extends CharacterData {
	// FIXME: delete function constructor();
	function splitText(offset : int/*unsigned long*/) : Text;
	// Introduced in DOM Level 3:
	__readonly__ var isElementContentWhitespace : boolean;
	// Introduced in DOM Level 3:
	__readonly__ var wholeText : string/*DOMString*/;
	// Introduced in DOM Level 3:
	function replaceWholeText(content : string/*DOMString*/) : Text;
}

native class Comment extends CharacterData {
	// FIXME: delete function constructor();
}

native __fake__ class TypeInfo {
	// FIXME: delete function constructor();
	__readonly__ var typeName : string/*DOMString*/;
	__readonly__ var typeNamespace : string/*DOMString*/;
	// DerivationMethods
	static const     DERIVATION_RESTRICTION : int/*unsigned long*/;
	__readonly__ var DERIVATION_RESTRICTION : int/*unsigned long*/;
	static const     DERIVATION_EXTENSION : int/*unsigned long*/;
	__readonly__ var DERIVATION_EXTENSION : int/*unsigned long*/;
	static const     DERIVATION_UNION : int/*unsigned long*/;
	__readonly__ var DERIVATION_UNION : int/*unsigned long*/;
	static const     DERIVATION_LIST : int/*unsigned long*/;
	__readonly__ var DERIVATION_LIST : int/*unsigned long*/;
	function isDerivedFrom(
		typeNamespaceArg : string/*DOMString*/,
		typeNameArg : string/*DOMString*/,
		derivationMethod : int/*unsigned long*/
	) : boolean;
}

native class DOMError {
	// FIXME: delete function constructor();
	// ErrorSeverity
	static const     SEVERITY_WARNING : int/*unsigned short*/;
	__readonly__ var SEVERITY_WARNING : int/*unsigned short*/;
	static const     SEVERITY_ERROR : int/*unsigned short*/;
	__readonly__ var SEVERITY_ERROR : int/*unsigned short*/;
	static const     SEVERITY_FATAL_ERROR : int/*unsigned short*/;
	__readonly__ var SEVERITY_FATAL_ERROR : int/*unsigned short*/;
	__readonly__ var severity : int/*unsigned short*/;
	__readonly__ var message : string/*DOMString*/;
	__readonly__ var type : string/*DOMString*/;
	__readonly__ var relatedException : Object/*DOMObject*/;
	__readonly__ var relatedData : Object/*DOMObject*/;
	__readonly__ var location : DOMLocator;
}

native __fake__ class DOMLocator {
	// FIXME: delete function constructor();
	__readonly__ var lineNumber : int/*long*/;
	__readonly__ var columnNumber : int/*long*/;
	__readonly__ var byteOffset : int/*long*/;
	__readonly__ var utf16Offset : int/*long*/;
	__readonly__ var relatedNode : Node;
	__readonly__ var uri : string/*DOMString*/;
}

native __fake__ class DOMConfiguration {
	// FIXME: delete function constructor();
	function setParameter(
		name : string/*DOMString*/,
		value : variant/*DOMUserData*/
	) : void;
	function getParameter(
		name : string/*DOMString*/
	) : variant/*DOMUserData*/;
	function canSetParameter(
		name : string/*DOMString*/,
		value : variant/*DOMUserData*/
	) : boolean;
	__readonly__ var parameterNames : DOMStringList;
}

native class CDATASection extends Text {
	// FIXME: delete function constructor();
}

native class DocumentType extends Node {
	// FIXME: delete function constructor();
	__readonly__ var name : string/*DOMString*/;
	__readonly__ var entities : NamedNodeMap;
	__readonly__ var notations : NamedNodeMap;
	// Introduced in DOM Level 2:
	__readonly__ var publicId : string/*DOMString*/;
	// Introduced in DOM Level 2:
	__readonly__ var systemId : string/*DOMString*/;
	// Introduced in DOM Level 2:
	__readonly__ var internalSubset : string/*DOMString*/;
}

native class Notation extends Node {
	// FIXME: delete function constructor();
	__readonly__ var publicId : string/*DOMString*/;
	__readonly__ var systemId : string/*DOMString*/;
}

native class Entity extends Node {
	// FIXME: delete function constructor();
	__readonly__ var publicId : string/*DOMString*/;
	__readonly__ var systemId : string/*DOMString*/;
	__readonly__ var notationName : string/*DOMString*/;
	// Introduced in DOM Level 3:
	__readonly__ var inputEncoding : string/*DOMString*/;
	// Introduced in DOM Level 3:
	__readonly__ var xmlEncoding : string/*DOMString*/;
	// Introduced in DOM Level 3:
	__readonly__ var xmlVersion : string/*DOMString*/;
}

native class EntityReference extends Node {
	// FIXME: delete function constructor();
}

native class ProcessingInstruction extends Node {
	// FIXME: delete function constructor();
	__readonly__ var target : string/*DOMString*/;
	var data : string/*DOMString*/;
	// raises(DOMException) on setting
}

native class DocumentFragment extends Node {
	// FIXME: delete function constructor();
}

native class Document extends Node {
	// FIXME: delete function constructor();
	// Modified in DOM Level 3:
	__readonly__ var doctype : DocumentType;
	__readonly__ var implementation : DOMImplementation;
	__readonly__ var documentElement : Element;
	function createElement(tagName : string/*DOMString*/) : Element;
	function createDocumentFragment() : DocumentFragment;
	function createTextNode(data : string/*DOMString*/) : Text;
	function createComment(data : string/*DOMString*/) : Comment;
	function createCDATASection(
		data : string/*DOMString*/
	) : CDATASection;
	function createProcessingInstruction(
		target : string/*DOMString*/,
		data : string/*DOMString*/
	) : ProcessingInstruction;
	function createAttribute(name : string/*DOMString*/) : Attr;
	function createEntityReference(
		name : string/*DOMString*/
	) : EntityReference;
	function getElementsByTagName(
		tagname : string/*DOMString*/
	) : NodeList;
	// Introduced in DOM Level 2:
	function importNode(importedNode : Node, deep : boolean) : Node;
	// Introduced in DOM Level 2:
	function createElementNS(
		namespaceURI : string/*DOMString*/,
		qualifiedName : string/*DOMString*/
	) : Element;
	// Introduced in DOM Level 2:
	function createAttributeNS(
		namespaceURI : string/*DOMString*/,
		qualifiedName : string/*DOMString*/
	) : Attr;
	// Introduced in DOM Level 2:
	function getElementsByTagNameNS(
		namespaceURI : string/*DOMString*/,
		localName : string/*DOMString*/
	) : NodeList;
	// Introduced in DOM Level 2:
	function getElementById(elementId : string/*DOMString*/) : Element;
	// Introduced in DOM Level 3:
	__readonly__ var inputEncoding : string/*DOMString*/;
	// Introduced in DOM Level 3:
	__readonly__ var xmlEncoding : string/*DOMString*/;
	// Introduced in DOM Level 3:
	var xmlStandalone : boolean;
	// raises(DOMException) on setting
	// Introduced in DOM Level 3:
	var xmlVersion : string/*DOMString*/;
	// raises(DOMException) on setting
	// Introduced in DOM Level 3:
	var strictErrorChecking : boolean;
	// Introduced in DOM Level 3:
	var documentURI : string/*DOMString*/;
	// Introduced in DOM Level 3:
	function adoptNode(source : Node) : Node;
	// Introduced in DOM Level 3:
	__readonly__ var domConfig : DOMConfiguration;
	// Introduced in DOM Level 3:
	function normalizeDocument() : void;
	// Introduced in DOM Level 3:
	function renameNode(
		n : Node,
		namespaceURI : string/*DOMString*/,
		qualifiedName : string/*DOMString*/
	) : Node;

	// implements interface DocumentEvent
	function createEvent(eventInterface : string) : Event;

	// implements touch events
	function createTouch(
		view : AbstractView,
		target : EventTarget,
		identifier : int/*long*/,
		pageX : int/*long*/,
		pageY : int/*long*/,
		screenX : int/*long*/,
		screenY : int/*long*/
	) : Touch;
	function createTouchList(touches : Touch[]) : TouchList;
	function createTouchList(touch : Touch) : TouchList;
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

	var onload : function(:Event):void;

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

	// getContext() returns null if the contextId is not supported
	function getContext(contextId : string) : CanvasRenderingContext;

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
	function scrollTo(x : int, y : int) : void;
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

native __fake__ class AbstractView {
	__readonly__ var docunent : DocumentView;
}
native __fake__ class DocumentView {
	__readonly__ var defaultView : AbstractView;
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

// generated from http://www.w3.org/TR/touch-events/
native class Touch {
	// FIXME: delete function constructor();
	__readonly__ var identifier : int/*long*/;
	__readonly__ var target : EventTarget;
	__readonly__ var screenX : int/*long*/;
	__readonly__ var screenY : int/*long*/;
	__readonly__ var clientX : int/*long*/;
	__readonly__ var clientY : int/*long*/;
	__readonly__ var pageX : int/*long*/;
	__readonly__ var pageY : int/*long*/;
}

native class TouchList {
	// FIXME: delete function constructor();
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<Touch>;
	function /* getter */ item(
		index : int/*unsigned long*/
	) : MayBeUndefined.<Touch>;
	function identifiedTouch(identifier : int/*long*/) : Touch;
}

native class TouchEvent extends UIEvent {
	// FIXME: delete function constructor();
	__readonly__ var touches : TouchList;
	__readonly__ var targetTouches : TouchList;
	__readonly__ var changedTouches : TouchList;
	__readonly__ var altKey : boolean;
	__readonly__ var metaKey : boolean;
	__readonly__ var ctrlKey : boolean;
	__readonly__ var shiftKey : boolean;
}


// XHR Level 2
// generated from http://www.w3.org/TR/XMLHttpRequest/
native class XMLHttpRequestEventTarget extends EventTarget {
	// FIXME: delete function constructor();
	// event handlers
	var onloadstart : function(:Event):void/*Function?*/;
	var onprogress : function(:Event):void/*Function?*/;
	var onabort : function(:Event):void/*Function?*/;
	var onerror : function(:Event):void/*Function?*/;
	var onload : function(:Event):void/*Function?*/;
	var ontimeout : function(:Event):void/*Function?*/;
	var onloadend : function(:Event):void/*Function?*/;
}

native class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	// FIXME: delete function constructor();
}

native class XMLHttpRequest extends XMLHttpRequestEventTarget {
	function constructor();

	// event handler
	var onreadystatechange : function(:Event):void/*Function?*/;
	// states
	static const UNSENT : int/*unsigned short*/;
	static const OPENED : int/*unsigned short*/;
	static const HEADERS_RECEIVED : int/*unsigned short*/;
	static const LOADING : int/*unsigned short*/;
	static const DONE : int/*unsigned short*/;
	__readonly__ var readyState : int/*unsigned short*/;
	// request
	function open(
		method : string/*DOMString*/,
		url : string/*DOMString*/
	) : void;
	function open(
		method : string/*DOMString*/,
		url : string/*DOMString*/,
		async : boolean
	) : void;
	function open(
		method : string/*DOMString*/,
		url : string/*DOMString*/,
		async : boolean,
		user : String/*DOMString?*/
	) : void;
	function open(
		method : string/*DOMString*/,
		url : string/*DOMString*/,
		async : boolean,
		user : String/*DOMString?*/,
		password : String/*DOMString?*/
	) : void;
	function setRequestHeader(
		header : string/*DOMString*/,
		value : string/*DOMString*/
	) : void;
	var timeout : int/*unsigned long*/;
	var withCredentials : boolean;
	__readonly__ var upload : XMLHttpRequestUpload;
	function send() : void;
	function send(data : ArrayBuffer) : void;
	function send(data : Blob) : void;
	function send(data : Document) : void;
	function send(data : string/*DOMString*/) : void;
	function send(data : String/*DOMString?*/) : void;
	function send(data : FormData) : void;
	function abort() : void;
	// response
	__readonly__ var status : int/*unsigned short*/;
	__readonly__ var statusText : string/*DOMString*/;
	function getResponseHeader(
		header : string/*DOMString*/
	) : string/*DOMString*/;
	function getAllResponseHeaders() : string/*DOMString*/;
	function overrideMimeType(mime : string/*DOMString*/) : void;
	var responseType : string/*XMLHttpRequestResponseType*/;
	__readonly__ var response : variant/*any*/;
	__readonly__ var responseText : string/*DOMString*/;
	__readonly__ var responseXML : Document;
}

native class AnonXMLHttpRequest extends XMLHttpRequest {

}

native class FormData {
	function constructor(form : HTMLFormElement);

	function append(name : string/*DOMString*/, value : Blob) : void;
	function append(
		name : string/*DOMString*/,
		value : Blob,
		filename : string/*DOMString*/
	) : void;
	function append(
		name : string/*DOMString*/,
		value : string/*DOMString*/
	) : void;
}


// http://dvcs.w3.org/hg/progress/raw-file/tip/Overview.html#progressevent

native class ProgressEvent extends Event {
	__readonly__ var lengthComputable : boolean;
	__readonly__ var loaded : number;
	__readonly__ var total : number;
}

// Canvas

interface CanvasRenderingContext { }

// FileAPI

native class Blob {
	// TODO
}

// WebSocket
// generated from http://www.w3.org/TR/websockets/
native class WebSocket extends EventTarget {
	function constructor(url : string/*DOMString*/);
	function constructor(
		url : string/*DOMString*/,
		protocols : string/*DOMString*/
	);
	function constructor(
		url : string/*DOMString*/,
		protocols : string[]/*DOMString[]*/
	);

	__readonly__ var url : string/*DOMString*/;
	// ready state
	static const CONNECTING : int/*unsigned short*/;
	static const OPEN : int/*unsigned short*/;
	static const CLOSING : int/*unsigned short*/;
	static const CLOSED : int/*unsigned short*/;
	__readonly__ var readyState : int/*unsigned short*/;
	__readonly__ var bufferedAmount : int/*unsigned long*/;
	// networking
	var onopen : function(:Event):void/*Function?*/;
	var onerror : function(:Event):void/*Function?*/;
	var onclose : function(:Event):void/*Function?*/;
	__readonly__ var extensions : string/*DOMString*/;
	__readonly__ var protocol : string/*DOMString*/;
	function close() : void;
	function close(code : int/*unsigned short*/) : void;
	function close(
		code : int/*unsigned short*/,
		reason : string/*DOMString*/
	) : void;
	// messaging
	var onmessage : function(:Event):void/*Function?*/;
	var binaryType : string/*DOMString*/;
	function send(data : string/*DOMString*/) : void;
	function send(data : ArrayBuffer) : void;
	function send(data : Blob) : void;
}

native class CloseEvent extends Event {
	function constructor(type : string/*DOMString*/);
	//function constructor(
	//	type : string/*DOMString*/,
	//	eventInitDict : CloseEventInit
	//);

	__readonly__ var wasClean : boolean;
	__readonly__ var code : int/*unsigned short*/;
	__readonly__ var reason : string/*DOMString*/;
}


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

	static function createCanvas() : HTMLCanvasElement {
		return dom.window.document.createElement("canvas")
			as __noconvert__ HTMLCanvasElement;
	}
	static function createImage() : HTMLImageElement {
		return dom.window.document.createElement("img")
			as __noconvert__ HTMLImageElement;
	}
}
