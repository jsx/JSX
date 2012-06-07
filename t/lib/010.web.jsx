import "test-case.jsx";
import "js/web.jsx";

class _Test extends TestCase {

    // #1
    function compile_DOMException(o : DOMException) : void {
        var v1 : int/*unsigned short*/ = DOMException.INDEX_SIZE_ERR;
        var v2 : int/*unsigned short*/ = o.INDEX_SIZE_ERR;
        var v3 : int/*unsigned short*/ = DOMException.DOMSTRING_SIZE_ERR;
        var v4 : int/*unsigned short*/ = o.DOMSTRING_SIZE_ERR;
        var v5 : int/*unsigned short*/ = DOMException.HIERARCHY_REQUEST_ERR;
        var v6 : int/*unsigned short*/ = o.HIERARCHY_REQUEST_ERR;
        var v7 : int/*unsigned short*/ = DOMException.WRONG_DOCUMENT_ERR;
        var v8 : int/*unsigned short*/ = o.WRONG_DOCUMENT_ERR;
        var v9 : int/*unsigned short*/ = DOMException.INVALID_CHARACTER_ERR;
        var v10 : int/*unsigned short*/ = o.INVALID_CHARACTER_ERR;
        var v11 : int/*unsigned short*/ = DOMException.NO_DATA_ALLOWED_ERR;
        var v12 : int/*unsigned short*/ = o.NO_DATA_ALLOWED_ERR;
        var v13 : int/*unsigned short*/ = DOMException.NO_MODIFICATION_ALLOWED_ERR;
        var v14 : int/*unsigned short*/ = o.NO_MODIFICATION_ALLOWED_ERR;
        var v15 : int/*unsigned short*/ = DOMException.NOT_FOUND_ERR;
        var v16 : int/*unsigned short*/ = o.NOT_FOUND_ERR;
        var v17 : int/*unsigned short*/ = DOMException.NOT_SUPPORTED_ERR;
        var v18 : int/*unsigned short*/ = o.NOT_SUPPORTED_ERR;
        var v19 : int/*unsigned short*/ = DOMException.INUSE_ATTRIBUTE_ERR;
        var v20 : int/*unsigned short*/ = o.INUSE_ATTRIBUTE_ERR;
        var v21 : int/*unsigned short*/ = DOMException.INVALID_STATE_ERR;
        var v22 : int/*unsigned short*/ = o.INVALID_STATE_ERR;
        var v23 : int/*unsigned short*/ = DOMException.SYNTAX_ERR;
        var v24 : int/*unsigned short*/ = o.SYNTAX_ERR;
        var v25 : int/*unsigned short*/ = DOMException.INVALID_MODIFICATION_ERR;
        var v26 : int/*unsigned short*/ = o.INVALID_MODIFICATION_ERR;
        var v27 : int/*unsigned short*/ = DOMException.NAMESPACE_ERR;
        var v28 : int/*unsigned short*/ = o.NAMESPACE_ERR;
        var v29 : int/*unsigned short*/ = DOMException.INVALID_ACCESS_ERR;
        var v30 : int/*unsigned short*/ = o.INVALID_ACCESS_ERR;
        var v31 : int/*unsigned short*/ = DOMException.VALIDATION_ERR;
        var v32 : int/*unsigned short*/ = o.VALIDATION_ERR;
        var v33 : int/*unsigned short*/ = DOMException.TYPE_MISMATCH_ERR;
        var v34 : int/*unsigned short*/ = o.TYPE_MISMATCH_ERR;
        var v35 : int/*unsigned short*/ = DOMException.SECURITY_ERR;
        var v36 : int/*unsigned short*/ = o.SECURITY_ERR;
        var v37 : int/*unsigned short*/ = DOMException.NETWORK_ERR;
        var v38 : int/*unsigned short*/ = o.NETWORK_ERR;
        var v39 : int/*unsigned short*/ = DOMException.ABORT_ERR;
        var v40 : int/*unsigned short*/ = o.ABORT_ERR;
        var v41 : int/*unsigned short*/ = DOMException.URL_MISMATCH_ERR;
        var v42 : int/*unsigned short*/ = o.URL_MISMATCH_ERR;
        var v43 : int/*unsigned short*/ = DOMException.QUOTA_EXCEEDED_ERR;
        var v44 : int/*unsigned short*/ = o.QUOTA_EXCEEDED_ERR;
        var v45 : int/*unsigned short*/ = DOMException.TIMEOUT_ERR;
        var v46 : int/*unsigned short*/ = o.TIMEOUT_ERR;
        var v47 : int/*unsigned short*/ = DOMException.INVALID_NODE_TYPE_ERR;
        var v48 : int/*unsigned short*/ = o.INVALID_NODE_TYPE_ERR;
        var v49 : int/*unsigned short*/ = DOMException.DATA_CLONE_ERR;
        var v50 : int/*unsigned short*/ = o.DATA_CLONE_ERR;
        var v51 : int/*unsigned short*/ = o.code;
    } // DOMException

    // #2
    function compile_DOMError(o : DOMError) : void {
        var v1 : string/*DOMString*/ = o.name;
    } // DOMError

    // #3
    function compile_Event(o : Event) : void {
        var v1 : string/*DOMString*/ = o.type;
        var v2 : EventTarget = o.target;
        var v3 : EventTarget = o.currentTarget;
        var v4 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v5 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v6 : int/*unsigned short*/ = Event.AT_TARGET;
        var v7 : int/*unsigned short*/ = o.AT_TARGET;
        var v8 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v9 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v10 : int/*unsigned short*/ = o.eventPhase;
        o.stopPropagation();
        o.stopImmediatePropagation();
        var v11 : boolean = o.bubbles;
        var v12 : boolean = o.cancelable;
        o.preventDefault();
        var v13 : boolean = o.defaultPrevented;
        var v14 : boolean = o.isTrusted;
        var v15 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        var v16 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v17 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v18 : int/*unsigned short*/ = Event.AT_TARGET;
        var v19 : int/*unsigned short*/ = o.AT_TARGET;
        var v20 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v21 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v22 : string/*DOMString*/ = o.type;
        var v23 : EventTarget = o.target;
        var v24 : EventTarget = o.currentTarget;
        var v25 : int/*unsigned short*/ = o.eventPhase;
        var v26 : boolean = o.bubbles;
        var v27 : boolean = o.cancelable;
        var v28 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.stopPropagation();
        o.preventDefault();
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        o.stopImmediatePropagation();
        var v29 : boolean = o.defaultPrevented;
        var v30 : boolean = o.isTrusted;
        var v31 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v32 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v33 : int/*unsigned short*/ = Event.AT_TARGET;
        var v34 : int/*unsigned short*/ = o.AT_TARGET;
        var v35 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v36 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v37 : string/*DOMString*/ = o.type;
        var v38 : EventTarget = o.target;
        var v39 : EventTarget = o.currentTarget;
        var v40 : int/*unsigned short*/ = o.eventPhase;
        var v41 : boolean = o.bubbles;
        var v42 : boolean = o.cancelable;
        var v43 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.stopPropagation();
        o.preventDefault();
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        o.stopImmediatePropagation();
        var v44 : boolean = o.defaultPrevented;
        var v45 : boolean = o.isTrusted;
    } // Event

    // #4
    function compile_EventInit(o : EventInit) : void {
        var v1 : boolean = o.bubbles;
        var v2 : boolean = o.cancelable;
    } // EventInit

    // #5
    function compile_CustomEvent(o : CustomEvent) : void {
        var v1 : variant/*any*/ = o.detail;
        var v2 : variant/*any*/ = o.detail;
        o.initCustomEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getvariant());
        var v3 : variant/*any*/ = o.detail;
        o.initCustomEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getvariant());
    } // CustomEvent

    // #6
    function compile_CustomEventInit(o : CustomEventInit) : void {
        var v1 : variant/*any*/ = o.detail;
    } // CustomEventInit

    // #7
    function compile_EventTarget(o : EventTarget) : void {
        o.addEventListener(X.getstring(), X.getfunction__Event__void());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f1 : boolean = o.dispatchEvent(X.getEvent());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f2 : boolean = o.dispatchEvent(X.getEvent());
        o.addEventListener(X.getstring(), X.getfunction__Event__void());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f3 : boolean = o.dispatchEvent(X.getEvent());
    } // EventTarget

    // #8
    function compile_MutationObserver(o : MutationObserver) : void {
        o.observe(X.getNode(), X.getMutationObserverInit());
        o.disconnect();
    } // MutationObserver

    // #9
    function compile_MutationObserverInit(o : MutationObserverInit) : void {
        var v1 : boolean = o.childList;
        var v2 : boolean = o.attributes;
        var v3 : boolean = o.characterData;
        var v4 : boolean = o.subtree;
        var v5 : boolean = o.attributeOldValue;
        var v6 : boolean = o.characterDataOldValue;
        var v7 : string[]/*DOMString[]*/ = o.attributeFilter;
    } // MutationObserverInit

    // #10
    function compile_MutationRecord(o : MutationRecord) : void {
        var v1 : string/*DOMString*/ = o.type;
        var v2 : Node = o.target;
        var v3 : NodeList = o.addedNodes;
        var v4 : NodeList = o.removedNodes;
        var v5 : Node = o.previousSibling;
        var v6 : Node = o.nextSibling;
        var v7 : string/*DOMString?*/ = o.attributeName;
        var v8 : string/*DOMString?*/ = o.attributeNamespace;
        var v9 : string/*DOMString?*/ = o.oldValue;
    } // MutationRecord

    // #11
    function compile_Node(o : Node) : void {
        var v1 : int/*unsigned short*/ = Node.ELEMENT_NODE;
        var v2 : int/*unsigned short*/ = o.ELEMENT_NODE;
        var v3 : int/*unsigned short*/ = Node.ATTRIBUTE_NODE;
        var v4 : int/*unsigned short*/ = o.ATTRIBUTE_NODE;
        var v5 : int/*unsigned short*/ = Node.TEXT_NODE;
        var v6 : int/*unsigned short*/ = o.TEXT_NODE;
        var v7 : int/*unsigned short*/ = Node.CDATA_SECTION_NODE;
        var v8 : int/*unsigned short*/ = o.CDATA_SECTION_NODE;
        var v9 : int/*unsigned short*/ = Node.ENTITY_REFERENCE_NODE;
        var v10 : int/*unsigned short*/ = o.ENTITY_REFERENCE_NODE;
        var v11 : int/*unsigned short*/ = Node.ENTITY_NODE;
        var v12 : int/*unsigned short*/ = o.ENTITY_NODE;
        var v13 : int/*unsigned short*/ = Node.PROCESSING_INSTRUCTION_NODE;
        var v14 : int/*unsigned short*/ = o.PROCESSING_INSTRUCTION_NODE;
        var v15 : int/*unsigned short*/ = Node.COMMENT_NODE;
        var v16 : int/*unsigned short*/ = o.COMMENT_NODE;
        var v17 : int/*unsigned short*/ = Node.DOCUMENT_NODE;
        var v18 : int/*unsigned short*/ = o.DOCUMENT_NODE;
        var v19 : int/*unsigned short*/ = Node.DOCUMENT_TYPE_NODE;
        var v20 : int/*unsigned short*/ = o.DOCUMENT_TYPE_NODE;
        var v21 : int/*unsigned short*/ = Node.DOCUMENT_FRAGMENT_NODE;
        var v22 : int/*unsigned short*/ = o.DOCUMENT_FRAGMENT_NODE;
        var v23 : int/*unsigned short*/ = Node.NOTATION_NODE;
        var v24 : int/*unsigned short*/ = o.NOTATION_NODE;
        var v25 : int/*unsigned short*/ = o.nodeType;
        var v26 : string/*DOMString*/ = o.nodeName;
        var v27 : string/*DOMString?*/ = o.baseURI;
        var v28 : Document = o.ownerDocument;
        var v29 : Node = o.parentNode;
        var v30 : Element = o.parentElement;
        var f31 : boolean = o.hasChildNodes();
        var v32 : NodeList = o.childNodes;
        var v33 : Node = o.firstChild;
        var v34 : Node = o.lastChild;
        var v35 : Node = o.previousSibling;
        var v36 : Node = o.nextSibling;
        var v37 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_DISCONNECTED;
        var v38 : int/*unsigned short*/ = o.DOCUMENT_POSITION_DISCONNECTED;
        var v39 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_PRECEDING;
        var v40 : int/*unsigned short*/ = o.DOCUMENT_POSITION_PRECEDING;
        var v41 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_FOLLOWING;
        var v42 : int/*unsigned short*/ = o.DOCUMENT_POSITION_FOLLOWING;
        var v43 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_CONTAINS;
        var v44 : int/*unsigned short*/ = o.DOCUMENT_POSITION_CONTAINS;
        var v45 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_CONTAINED_BY;
        var v46 : int/*unsigned short*/ = o.DOCUMENT_POSITION_CONTAINED_BY;
        var v47 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        var v48 : int/*unsigned short*/ = o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        var f49 : int/*unsigned short*/ = o.compareDocumentPosition(X.getNode());
        var f50 : boolean = o.contains(X.getNode());
        var v51 : string/*DOMString?*/ = o.nodeValue;
        var v52 : string/*DOMString?*/ = o.textContent;
        var f53 : Node = o.insertBefore(X.getNode(), X.getNode());
        var f54 : Node = o.appendChild(X.getNode());
        var f55 : Node = o.replaceChild(X.getNode(), X.getNode());
        var f56 : Node = o.removeChild(X.getNode());
        o.normalize();
        var f57 : Node = o.cloneNode();
        var f58 : Node = o.cloneNode(X.getboolean());
        var f59 : boolean = o.isEqualNode(X.getNode());
        var f60 : string/*DOMString*/ = o.lookupPrefix(X.getstring());
        var f61 : string/*DOMString*/ = o.lookupNamespaceURI(X.getstring());
        var f62 : boolean = o.isDefaultNamespace(X.getstring());
    } // Node

    // #12
    function compile_Document(o : Document) : void {
        var v1 : DOMImplementation = o.implementation;
        var v2 : string/*DOMString*/ = o.URL;
        var v3 : string/*DOMString*/ = o.documentURI;
        var v4 : string/*DOMString*/ = o.compatMode;
        var v5 : string/*DOMString*/ = o.characterSet;
        var v6 : string/*DOMString*/ = o.contentType;
        var v7 : DocumentType = o.doctype;
        var v8 : Element = o.documentElement;
        var f9 : HTMLCollection = o.getElementsByTagName(X.getstring());
        var f10 : HTMLCollection = o.getElementsByTagNameNS(X.getstring(), X.getstring());
        var f11 : HTMLCollection = o.getElementsByClassName(X.getstring());
        var f12 : Element = o.getElementById(X.getstring());
        var f13 : Element = o.createElement(X.getstring());
        var f14 : Element = o.createElementNS(X.getstring(), X.getstring());
        var f15 : DocumentFragment = o.createDocumentFragment();
        var f16 : Text = o.createTextNode(X.getstring());
        var f17 : Comment = o.createComment(X.getstring());
        var f18 : ProcessingInstruction = o.createProcessingInstruction(X.getstring(), X.getstring());
        var f19 : Node = o.importNode(X.getNode());
        var f20 : Node = o.importNode(X.getNode(), X.getboolean());
        var f21 : Node = o.adoptNode(X.getNode());
        var f22 : Event = o.createEvent(X.getstring());
        var f23 : Range = o.createRange();
        var f24 : NodeIterator = o.createNodeIterator(X.getNode());
        var f25 : NodeIterator = o.createNodeIterator(X.getNode(), X.getint());
        var f26 : NodeIterator = o.createNodeIterator(X.getNode(), X.getint(), X.getNodeFilter());
        var f27 : TreeWalker = o.createTreeWalker(X.getNode());
        var f28 : TreeWalker = o.createTreeWalker(X.getNode(), X.getint());
        var f29 : TreeWalker = o.createTreeWalker(X.getNode(), X.getint(), X.getNodeFilter());
        o.prepend();
        o.prepend(X.getNode());
        o.prepend();
        o.prepend(X.getstring());
        o.append();
        o.append(X.getNode());
        o.append();
        o.append(X.getstring());
        var f30 : Event = o.createEvent(X.getstring());
        var f31 : Event = o.createEvent(X.getstring());
        var v32 : StyleSheet[]/*StyleSheetList*/ = o.styleSheets;
        var v33 : string/*DOMString?*/ = o.selectedStyleSheetSet;
        var v34 : string/*DOMString?*/ = o.lastStyleSheetSet;
        var v35 : string/*DOMString?*/ = o.preferredStyleSheetSet;
        var v36 : DOMStringList = o.styleSheetSets;
        o.enableStyleSheetsForSet(X.getstring());
        var f37 : Element = o.elementFromPoint(X.getnumber(), X.getnumber());
        var f38 : CaretPosition = o.caretPositionFromPoint(X.getnumber(), X.getnumber());
        var f39 : Touch = o.createTouch(X.getAbstractView(), X.getEventTarget(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint());
        var f40 : TouchList = o.createTouchList(X.getTouch__());
        var f41 : TouchList = o.createTouchList(X.getTouch());
        var f42 : Element = o.querySelector(X.getstring());
        var f43 : NodeList = o.querySelectorAll(X.getstring());
    } // Document

    // #13
    function compile_XMLDocument(o : XMLDocument) : void {
        var f1 : boolean = o.load(X.getstring());
    } // XMLDocument

    // #14
    function compile_DOMImplementation(o : DOMImplementation) : void {
        var f1 : DocumentType = o.createDocumentType(X.getstring(), X.getstring(), X.getstring());
        var f2 : XMLDocument = o.createDocument(X.getstring(), X.getstring(), X.getDocumentType());
        var f3 : Document = o.createHTMLDocument(X.getstring());
        var f4 : boolean = o.hasFeature(X.getstring(), X.getstring());
    } // DOMImplementation

    // #15
    function compile_DocumentFragment(o : DocumentFragment) : void {
        o.prepend();
        o.prepend(X.getNode());
        o.prepend();
        o.prepend(X.getstring());
        o.append();
        o.append(X.getNode());
        o.append();
        o.append(X.getstring());
        var f1 : Element = o.querySelector(X.getstring());
        var f2 : NodeList = o.querySelectorAll(X.getstring());
    } // DocumentFragment

    // #16
    function compile_DocumentType(o : DocumentType) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : string/*DOMString*/ = o.publicId;
        var v3 : string/*DOMString*/ = o.systemId;
        o.before();
        o.before(X.getNode());
        o.before();
        o.before(X.getstring());
        o.after();
        o.after(X.getNode());
        o.after();
        o.after(X.getstring());
        o.replace();
        o.replace(X.getNode());
        o.replace();
        o.replace(X.getstring());
        o.remove();
    } // DocumentType

    // #17
    function compile_Element(o : Element) : void {
        var v1 : string/*DOMString?*/ = o.namespaceURI;
        var v2 : string/*DOMString?*/ = o.prefix;
        var v3 : string/*DOMString*/ = o.localName;
        var v4 : string/*DOMString*/ = o.tagName;
        var v5 : string/*DOMString*/ = o.id;
        var v6 : string/*DOMString*/ = o.className;
        var v7 : DOMTokenList = o.classList;
        var v8 : Attr[] = o.attributes;
        var f9 : string/*DOMString?*/ = o.getAttribute(X.getstring());
        var f10 : string/*DOMString?*/ = o.getAttributeNS(X.getstring(), X.getstring());
        o.setAttribute(X.getstring(), X.getstring());
        o.setAttributeNS(X.getstring(), X.getstring(), X.getstring());
        o.removeAttribute(X.getstring());
        o.removeAttributeNS(X.getstring(), X.getstring());
        var f11 : boolean = o.hasAttribute(X.getstring());
        var f12 : boolean = o.hasAttributeNS(X.getstring(), X.getstring());
        var f13 : HTMLCollection = o.getElementsByTagName(X.getstring());
        var f14 : HTMLCollection = o.getElementsByTagNameNS(X.getstring(), X.getstring());
        var f15 : HTMLCollection = o.getElementsByClassName(X.getstring());
        var v16 : HTMLCollection = o.children;
        var v17 : Element = o.firstElementChild;
        var v18 : Element = o.lastElementChild;
        var v19 : Element = o.previousElementSibling;
        var v20 : Element = o.nextElementSibling;
        var v21 : int/*unsigned long*/ = o.childElementCount;
        o.prepend();
        o.prepend(X.getNode());
        o.prepend();
        o.prepend(X.getstring());
        o.append();
        o.append(X.getNode());
        o.append();
        o.append(X.getstring());
        o.before();
        o.before(X.getNode());
        o.before();
        o.before(X.getstring());
        o.after();
        o.after(X.getNode());
        o.after();
        o.after(X.getstring());
        o.replace();
        o.replace(X.getNode());
        o.replace();
        o.replace(X.getstring());
        o.remove();
        var f22 : ClientRectList = o.getClientRects();
        var f23 : ClientRect = o.getBoundingClientRect();
        o.scrollIntoView();
        o.scrollIntoView(X.getboolean());
        var v24 : int/*long*/ = o.scrollTop;
        var v25 : int/*long*/ = o.scrollLeft;
        var v26 : int/*long*/ = o.scrollWidth;
        var v27 : int/*long*/ = o.scrollHeight;
        var v28 : int/*long*/ = o.clientTop;
        var v29 : int/*long*/ = o.clientLeft;
        var v30 : int/*long*/ = o.clientWidth;
        var v31 : int/*long*/ = o.clientHeight;
        var f32 : Element = o.querySelector(X.getstring());
        var f33 : NodeList = o.querySelectorAll(X.getstring());
        var v34 : string/*DOMString*/ = o.innerHTML;
        var v35 : string/*DOMString*/ = o.outerHTML;
        o.insertAdjacentHTML(X.getstring(), X.getstring());
    } // Element

    // #18
    function compile_Attr(o : Attr) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : string/*DOMString*/ = o.value;
        var v3 : string/*DOMString?*/ = o.namespaceURI;
        var v4 : string/*DOMString?*/ = o.prefix;
        var v5 : string/*DOMString*/ = o.localName;
    } // Attr

    // #19
    function compile_CharacterData(o : CharacterData) : void {
        var v1 : string/*DOMString*/ = o.data;
        var v2 : int/*unsigned long*/ = o.length;
        var f3 : string/*DOMString*/ = o.substringData(X.getint(), X.getint());
        o.appendData(X.getstring());
        o.insertData(X.getint(), X.getstring());
        o.deleteData(X.getint(), X.getint());
        o.replaceData(X.getint(), X.getint(), X.getstring());
        o.before();
        o.before(X.getNode());
        o.before();
        o.before(X.getstring());
        o.after();
        o.after(X.getNode());
        o.after();
        o.after(X.getstring());
        o.replace();
        o.replace(X.getNode());
        o.replace();
        o.replace(X.getstring());
        o.remove();
    } // CharacterData

    // #20
    function compile_Text(o : Text) : void {
        var f1 : Text = o.splitText(X.getint());
        var v2 : string/*DOMString*/ = o.wholeText;
        var v3 : boolean = o.serializeAsCDATA;
    } // Text

    // #21
    function compile_ProcessingInstruction(o : ProcessingInstruction) : void {
        var v1 : string/*DOMString*/ = o.target;
        var v2 : StyleSheet = o.sheet;
    } // ProcessingInstruction

    // #22
    function compile_Comment(o : Comment) : void {
    } // Comment

    // #23
    function compile_Range(o : Range) : void {
        var v1 : Node = o.startContainer;
        var v2 : int/*unsigned long*/ = o.startOffset;
        var v3 : Node = o.endContainer;
        var v4 : int/*unsigned long*/ = o.endOffset;
        var v5 : boolean = o.collapsed;
        var v6 : Node = o.commonAncestorContainer;
        o.setStart(X.getNode(), X.getint());
        o.setEnd(X.getNode(), X.getint());
        o.setStartBefore(X.getNode());
        o.setStartAfter(X.getNode());
        o.setEndBefore(X.getNode());
        o.setEndAfter(X.getNode());
        o.collapse(X.getboolean());
        o.selectNode(X.getNode());
        o.selectNodeContents(X.getNode());
        var v7 : int/*unsigned short*/ = Range.START_TO_START;
        var v8 : int/*unsigned short*/ = o.START_TO_START;
        var v9 : int/*unsigned short*/ = Range.START_TO_END;
        var v10 : int/*unsigned short*/ = o.START_TO_END;
        var v11 : int/*unsigned short*/ = Range.END_TO_END;
        var v12 : int/*unsigned short*/ = o.END_TO_END;
        var v13 : int/*unsigned short*/ = Range.END_TO_START;
        var v14 : int/*unsigned short*/ = o.END_TO_START;
        var f15 : int/*short*/ = o.compareBoundaryPoints(X.getint(), X.getRange());
        o.deleteContents();
        var f16 : DocumentFragment = o.extractContents();
        var f17 : DocumentFragment = o.cloneContents();
        o.insertNode(X.getNode());
        o.surroundContents(X.getNode());
        var f18 : Range = o.cloneRange();
        o.detach();
        var f19 : boolean = o.isPointInRange(X.getNode(), X.getint());
        var f20 : int/*short*/ = o.comparePoint(X.getNode(), X.getint());
        var f21 : boolean = o.intersectsNode(X.getNode());
        var f22 : ClientRectList = o.getClientRects();
        var f23 : ClientRect = o.getBoundingClientRect();
        var f24 : DocumentFragment = o.createContextualFragment(X.getstring());
    } // Range

    // #24
    function compile_NodeIterator(o : NodeIterator) : void {
        var v1 : Node = o.root;
        var v2 : Node = o.referenceNode;
        var v3 : boolean = o.pointerBeforeReferenceNode;
        var v4 : int/*unsigned long*/ = o.whatToShow;
        var v5 : NodeFilter = o.filter;
        var f6 : Node = o.nextNode();
        var f7 : Node = o.previousNode();
        o.detach();
    } // NodeIterator

    // #25
    function compile_TreeWalker(o : TreeWalker) : void {
        var v1 : Node = o.root;
        var v2 : int/*unsigned long*/ = o.whatToShow;
        var v3 : NodeFilter = o.filter;
        var v4 : Node = o.currentNode;
        var f5 : Node = o.parentNode();
        var f6 : Node = o.firstChild();
        var f7 : Node = o.lastChild();
        var f8 : Node = o.previousSibling();
        var f9 : Node = o.nextSibling();
        var f10 : Node = o.previousNode();
        var f11 : Node = o.nextNode();
    } // TreeWalker

    // #26
    function compile_NodeFilter(o : NodeFilter) : void {
        var v1 : int/*unsigned short*/ = NodeFilter.FILTER_ACCEPT;
        var v2 : int/*unsigned short*/ = o.FILTER_ACCEPT;
        var v3 : int/*unsigned short*/ = NodeFilter.FILTER_REJECT;
        var v4 : int/*unsigned short*/ = o.FILTER_REJECT;
        var v5 : int/*unsigned short*/ = NodeFilter.FILTER_SKIP;
        var v6 : int/*unsigned short*/ = o.FILTER_SKIP;
        var v7 : int/*unsigned long*/ = NodeFilter.SHOW_ALL;
        var v8 : int/*unsigned long*/ = o.SHOW_ALL;
        var v9 : int/*unsigned long*/ = NodeFilter.SHOW_ELEMENT;
        var v10 : int/*unsigned long*/ = o.SHOW_ELEMENT;
        var v11 : int/*unsigned long*/ = NodeFilter.SHOW_ATTRIBUTE;
        var v12 : int/*unsigned long*/ = o.SHOW_ATTRIBUTE;
        var v13 : int/*unsigned long*/ = NodeFilter.SHOW_TEXT;
        var v14 : int/*unsigned long*/ = o.SHOW_TEXT;
        var v15 : int/*unsigned long*/ = NodeFilter.SHOW_CDATA_SECTION;
        var v16 : int/*unsigned long*/ = o.SHOW_CDATA_SECTION;
        var v17 : int/*unsigned long*/ = NodeFilter.SHOW_ENTITY_REFERENCE;
        var v18 : int/*unsigned long*/ = o.SHOW_ENTITY_REFERENCE;
        var v19 : int/*unsigned long*/ = NodeFilter.SHOW_ENTITY;
        var v20 : int/*unsigned long*/ = o.SHOW_ENTITY;
        var v21 : int/*unsigned long*/ = NodeFilter.SHOW_PROCESSING_INSTRUCTION;
        var v22 : int/*unsigned long*/ = o.SHOW_PROCESSING_INSTRUCTION;
        var v23 : int/*unsigned long*/ = NodeFilter.SHOW_COMMENT;
        var v24 : int/*unsigned long*/ = o.SHOW_COMMENT;
        var v25 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT;
        var v26 : int/*unsigned long*/ = o.SHOW_DOCUMENT;
        var v27 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT_TYPE;
        var v28 : int/*unsigned long*/ = o.SHOW_DOCUMENT_TYPE;
        var v29 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT_FRAGMENT;
        var v30 : int/*unsigned long*/ = o.SHOW_DOCUMENT_FRAGMENT;
        var v31 : int/*unsigned long*/ = NodeFilter.SHOW_NOTATION;
        var v32 : int/*unsigned long*/ = o.SHOW_NOTATION;
        var f33 : int/*unsigned short*/ = o.acceptNode(X.getNode());
    } // NodeFilter

    // #27
    function compile_NodeList(o : NodeList) : void {
        var f1 : MayBeUndefined.<Node> = o.__native_index_operator__(X.getint());
        var f2 : MayBeUndefined.<Node> = o.item(X.getint());
        var v3 : int/*unsigned long*/ = o.length;
    } // NodeList

    // #28
    function compile_HTMLCollection(o : HTMLCollection) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f3 : MayBeUndefined.<Element> = o.item(X.getint());
        var f4 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f5 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
    } // HTMLCollection

    // #29
    function compile_DOMStringList(o : DOMStringList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<string/*DOMString?*/> = o.__native_index_operator__(X.getint());
        var f3 : MayBeUndefined.<string/*DOMString?*/> = o.item(X.getint());
        var f4 : boolean = o.contains(X.getstring());
    } // DOMStringList

    // #30
    function compile_DOMTokenList(o : DOMTokenList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<string/*DOMString?*/> = o.__native_index_operator__(X.getint());
        var f3 : MayBeUndefined.<string/*DOMString?*/> = o.item(X.getint());
        var f4 : boolean = o.contains(X.getstring());
        o.add(X.getstring());
        o.remove(X.getstring());
        var f5 : boolean = o.toggle(X.getstring());
    } // DOMTokenList

    // #31
    function compile_DOMSettableTokenList(o : DOMSettableTokenList) : void {
        var v1 : string/*DOMString*/ = o.value;
    } // DOMSettableTokenList

    // #32
    function compile_AbstractView(o : AbstractView) : void {
        var v1 : DocumentView = o.document;
    } // AbstractView

    // #33
    function compile_DocumentView(o : DocumentView) : void {
        var v1 : AbstractView = o.defaultView;
    } // DocumentView

    // #34
    function compile_EventException(o : EventException) : void {
        var v1 : int/*unsigned short*/ = EventException.UNSPECIFIED_EVENT_TYPE_ERR;
        var v2 : int/*unsigned short*/ = o.UNSPECIFIED_EVENT_TYPE_ERR;
        var v3 : int/*unsigned short*/ = EventException.DISPATCH_REQUEST_ERR;
        var v4 : int/*unsigned short*/ = o.DISPATCH_REQUEST_ERR;
        var v5 : int/*unsigned short*/ = o.code;
        var v6 : int/*unsigned short*/ = EventException.UNSPECIFIED_EVENT_TYPE_ERR;
        var v7 : int/*unsigned short*/ = o.UNSPECIFIED_EVENT_TYPE_ERR;
        var v8 : int/*unsigned short*/ = EventException.DISPATCH_REQUEST_ERR;
        var v9 : int/*unsigned short*/ = o.DISPATCH_REQUEST_ERR;
        var v10 : int/*unsigned short*/ = o.code;
    } // EventException

    // #35
    function compile_DocumentEvent(o : DocumentEvent) : void {
        var f1 : Event = o.createEvent(X.getstring());
        var f2 : Event = o.createEvent(X.getstring());
    } // DocumentEvent

    // #36
    function compile_UIEvent(o : UIEvent) : void {
        var v1 : AbstractView = o.view;
        var v2 : int/*long*/ = o.detail;
        o.initUIEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint());
        var v3 : AbstractView = o.view;
        var v4 : int/*long*/ = o.detail;
        o.initUIEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint());
    } // UIEvent

    // #37
    function compile_FocusEvent(o : FocusEvent) : void {
        var v1 : EventTarget = o.relatedTarget;
        o.initFocusEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getEventTarget());
        var v2 : EventTarget = o.relatedTarget;
        o.initFocusEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getEventTarget());
    } // FocusEvent

    // #38
    function compile_MouseEvent(o : MouseEvent) : void {
        var v1 : int/*long*/ = o.screenX;
        var v2 : int/*long*/ = o.screenY;
        var v3 : int/*long*/ = o.clientX;
        var v4 : int/*long*/ = o.clientY;
        var v5 : boolean = o.ctrlKey;
        var v6 : boolean = o.shiftKey;
        var v7 : boolean = o.altKey;
        var v8 : boolean = o.metaKey;
        var v9 : int/*unsigned short*/ = o.button;
        var v10 : int/*unsigned short*/ = o.buttons;
        var v11 : EventTarget = o.relatedTarget;
        o.initMouseEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getboolean(), X.getboolean(), X.getboolean(), X.getboolean(), X.getint(), X.getEventTarget());
        var f12 : boolean = o.getModifierState(X.getstring());
        var v13 : int/*long*/ = o.screenX;
        var v14 : int/*long*/ = o.screenY;
        var v15 : int/*long*/ = o.clientX;
        var v16 : int/*long*/ = o.clientY;
        var v17 : boolean = o.ctrlKey;
        var v18 : boolean = o.shiftKey;
        var v19 : boolean = o.altKey;
        var v20 : boolean = o.metaKey;
        var v21 : int/*unsigned short*/ = o.button;
        var v22 : int/*unsigned short*/ = o.buttons;
        var v23 : EventTarget = o.relatedTarget;
        o.initMouseEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getboolean(), X.getboolean(), X.getboolean(), X.getboolean(), X.getint(), X.getEventTarget());
        var f24 : boolean = o.getModifierState(X.getstring());
        var v25 : int/*long*/ = o.screenX;
        var v26 : int/*long*/ = o.screenY;
        var v27 : int/*long*/ = o.pageX;
        var v28 : int/*long*/ = o.pageY;
        var v29 : int/*long*/ = o.clientX;
        var v30 : int/*long*/ = o.clientY;
        var v31 : int/*long*/ = o.x;
        var v32 : int/*long*/ = o.y;
        var v33 : int/*long*/ = o.offsetX;
        var v34 : int/*long*/ = o.offsetY;
    } // MouseEvent

    // #39
    function compile_WheelEvent(o : WheelEvent) : void {
        var v1 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PIXEL;
        var v2 : int/*unsigned long*/ = o.DOM_DELTA_PIXEL;
        var v3 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_LINE;
        var v4 : int/*unsigned long*/ = o.DOM_DELTA_LINE;
        var v5 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PAGE;
        var v6 : int/*unsigned long*/ = o.DOM_DELTA_PAGE;
        var v7 : number/*float*/ = o.deltaX;
        var v8 : number/*float*/ = o.deltaY;
        var v9 : number/*float*/ = o.deltaZ;
        var v10 : int/*unsigned long*/ = o.deltaMode;
        o.initWheelEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getEventTarget(), X.getstring(), X.getnumber(), X.getnumber(), X.getnumber(), X.getint());
        var v11 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PIXEL;
        var v12 : int/*unsigned long*/ = o.DOM_DELTA_PIXEL;
        var v13 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_LINE;
        var v14 : int/*unsigned long*/ = o.DOM_DELTA_LINE;
        var v15 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PAGE;
        var v16 : int/*unsigned long*/ = o.DOM_DELTA_PAGE;
        var v17 : number/*float*/ = o.deltaX;
        var v18 : number/*float*/ = o.deltaY;
        var v19 : number/*float*/ = o.deltaZ;
        var v20 : int/*unsigned long*/ = o.deltaMode;
        o.initWheelEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getEventTarget(), X.getstring(), X.getnumber(), X.getnumber(), X.getnumber(), X.getint());
    } // WheelEvent

    // #40
    function compile_TextEvent(o : TextEvent) : void {
        var v1 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_UNKNOWN;
        var v2 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_UNKNOWN;
        var v3 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_KEYBOARD;
        var v4 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_KEYBOARD;
        var v5 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_PASTE;
        var v6 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_PASTE;
        var v7 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_DROP;
        var v8 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_DROP;
        var v9 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_IME;
        var v10 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_IME;
        var v11 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_OPTION;
        var v12 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_OPTION;
        var v13 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_HANDWRITING;
        var v14 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_HANDWRITING;
        var v15 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_VOICE;
        var v16 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_VOICE;
        var v17 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_MULTIMODAL;
        var v18 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_MULTIMODAL;
        var v19 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_SCRIPT;
        var v20 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_SCRIPT;
        var v21 : string/*DOMString*/ = o.data;
        var v22 : int/*unsigned long*/ = o.inputMethod;
        var v23 : string/*DOMString*/ = o.locale;
        o.initTextEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getint(), X.getstring());
        var v24 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_UNKNOWN;
        var v25 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_UNKNOWN;
        var v26 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_KEYBOARD;
        var v27 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_KEYBOARD;
        var v28 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_PASTE;
        var v29 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_PASTE;
        var v30 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_DROP;
        var v31 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_DROP;
        var v32 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_IME;
        var v33 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_IME;
        var v34 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_OPTION;
        var v35 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_OPTION;
        var v36 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_HANDWRITING;
        var v37 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_HANDWRITING;
        var v38 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_VOICE;
        var v39 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_VOICE;
        var v40 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_MULTIMODAL;
        var v41 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_MULTIMODAL;
        var v42 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_SCRIPT;
        var v43 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_SCRIPT;
        var v44 : string/*DOMString*/ = o.data;
        var v45 : int/*unsigned long*/ = o.inputMethod;
        var v46 : string/*DOMString*/ = o.locale;
        o.initTextEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getint(), X.getstring());
    } // TextEvent

    // #41
    function compile_KeyboardEvent(o : KeyboardEvent) : void {
        var v1 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
        var v2 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_STANDARD;
        var v3 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_LEFT;
        var v4 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_LEFT;
        var v5 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        var v6 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_RIGHT;
        var v7 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;
        var v8 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_NUMPAD;
        var v9 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_MOBILE;
        var v10 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_MOBILE;
        var v11 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_JOYSTICK;
        var v12 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_JOYSTICK;
        var v13 : string/*DOMString*/ = o.char;
        var v14 : string/*DOMString*/ = o.key;
        var v15 : int/*unsigned long*/ = o.location;
        var v16 : boolean = o.ctrlKey;
        var v17 : boolean = o.shiftKey;
        var v18 : boolean = o.altKey;
        var v19 : boolean = o.metaKey;
        var v20 : boolean = o.repeat;
        var v21 : string/*DOMString*/ = o.locale;
        var f22 : boolean = o.getModifierState(X.getstring());
        o.initKeyboardEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring(), X.getint(), X.getstring(), X.getboolean(), X.getstring());
        var v23 : int/*unsigned long*/ = o.charCode;
        var v24 : int/*unsigned long*/ = o.keyCode;
        var v25 : int/*unsigned long*/ = o.which;
        var v26 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
        var v27 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_STANDARD;
        var v28 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_LEFT;
        var v29 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_LEFT;
        var v30 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        var v31 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_RIGHT;
        var v32 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;
        var v33 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_NUMPAD;
        var v34 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_MOBILE;
        var v35 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_MOBILE;
        var v36 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_JOYSTICK;
        var v37 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_JOYSTICK;
        var v38 : string/*DOMString*/ = o.char;
        var v39 : string/*DOMString*/ = o.key;
        var v40 : int/*unsigned long*/ = o.location;
        var v41 : boolean = o.ctrlKey;
        var v42 : boolean = o.shiftKey;
        var v43 : boolean = o.altKey;
        var v44 : boolean = o.metaKey;
        var v45 : boolean = o.repeat;
        var v46 : string/*DOMString*/ = o.locale;
        var f47 : boolean = o.getModifierState(X.getstring());
        o.initKeyboardEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring(), X.getint(), X.getstring(), X.getboolean(), X.getstring());
    } // KeyboardEvent

    // #42
    function compile_CompositionEvent(o : CompositionEvent) : void {
        var v1 : string/*DOMString*/ = o.data;
        var v2 : string/*DOMString*/ = o.locale;
        o.initCompositionEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring());
        var v3 : string/*DOMString*/ = o.data;
        var v4 : string/*DOMString*/ = o.locale;
        o.initCompositionEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring());
    } // CompositionEvent

    // #43
    function compile_MutationEvent(o : MutationEvent) : void {
        var v1 : int/*unsigned short*/ = MutationEvent.MODIFICATION;
        var v2 : int/*unsigned short*/ = o.MODIFICATION;
        var v3 : int/*unsigned short*/ = MutationEvent.ADDITION;
        var v4 : int/*unsigned short*/ = o.ADDITION;
        var v5 : int/*unsigned short*/ = MutationEvent.REMOVAL;
        var v6 : int/*unsigned short*/ = o.REMOVAL;
        var v7 : Node = o.relatedNode;
        var v8 : string/*DOMString*/ = o.prevValue;
        var v9 : string/*DOMString*/ = o.newValue;
        var v10 : string/*DOMString*/ = o.attrName;
        var v11 : int/*unsigned short*/ = o.attrChange;
        o.initMutationEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring(), X.getstring(), X.getint());
        var v12 : int/*unsigned short*/ = MutationEvent.MODIFICATION;
        var v13 : int/*unsigned short*/ = o.MODIFICATION;
        var v14 : int/*unsigned short*/ = MutationEvent.ADDITION;
        var v15 : int/*unsigned short*/ = o.ADDITION;
        var v16 : int/*unsigned short*/ = MutationEvent.REMOVAL;
        var v17 : int/*unsigned short*/ = o.REMOVAL;
        var v18 : Node = o.relatedNode;
        var v19 : string/*DOMString*/ = o.prevValue;
        var v20 : string/*DOMString*/ = o.newValue;
        var v21 : string/*DOMString*/ = o.attrName;
        var v22 : int/*unsigned short*/ = o.attrChange;
        o.initMutationEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring(), X.getstring(), X.getint());
    } // MutationEvent

    // #44
    function compile_MutationNameEvent(o : MutationNameEvent) : void {
        var v1 : string/*DOMString*/ = o.prevNamespaceURI;
        var v2 : string/*DOMString*/ = o.prevNodeName;
        o.initMutationNameEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring());
        var v3 : string/*DOMString*/ = o.prevNamespaceURI;
        var v4 : string/*DOMString*/ = o.prevNodeName;
        o.initMutationNameEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring());
    } // MutationNameEvent

    // #45
    function compile_UIEventInit(o : UIEventInit) : void {
    } // UIEventInit

    // #46
    function compile_MouseEventInit(o : MouseEventInit) : void {
    } // MouseEventInit

    // #47
    function compile_XMLHttpRequestEventTarget(o : XMLHttpRequestEventTarget) : void {
        var v1 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v2 : function(:Event):void/*Function?*/ = o.onprogress;
        var v3 : function(:Event):void/*Function?*/ = o.onabort;
        var v4 : function(:Event):void/*Function?*/ = o.onerror;
        var v5 : function(:Event):void/*Function?*/ = o.onload;
        var v6 : function(:Event):void/*Function?*/ = o.ontimeout;
        var v7 : function(:Event):void/*Function?*/ = o.onloadend;
    } // XMLHttpRequestEventTarget

    // #48
    function compile_XMLHttpRequestUpload(o : XMLHttpRequestUpload) : void {
    } // XMLHttpRequestUpload

    // #49
    function compile_XMLHttpRequest(o : XMLHttpRequest) : void {
        var v1 : function(:Event):void/*Function?*/ = o.onreadystatechange;
        var v2 : int/*unsigned short*/ = XMLHttpRequest.UNSENT;
        var v3 : int/*unsigned short*/ = o.UNSENT;
        var v4 : int/*unsigned short*/ = XMLHttpRequest.OPENED;
        var v5 : int/*unsigned short*/ = o.OPENED;
        var v6 : int/*unsigned short*/ = XMLHttpRequest.HEADERS_RECEIVED;
        var v7 : int/*unsigned short*/ = o.HEADERS_RECEIVED;
        var v8 : int/*unsigned short*/ = XMLHttpRequest.LOADING;
        var v9 : int/*unsigned short*/ = o.LOADING;
        var v10 : int/*unsigned short*/ = XMLHttpRequest.DONE;
        var v11 : int/*unsigned short*/ = o.DONE;
        var v12 : int/*unsigned short*/ = o.readyState;
        o.open(X.getstring(), X.getstring());
        o.open(X.getstring(), X.getstring(), X.getboolean());
        o.open(X.getstring(), X.getstring(), X.getboolean(), X.getstring());
        o.open(X.getstring(), X.getstring(), X.getboolean(), X.getstring(), X.getstring());
        o.setRequestHeader(X.getstring(), X.getstring());
        var v13 : int/*unsigned long*/ = o.timeout;
        var v14 : boolean = o.withCredentials;
        var v15 : XMLHttpRequestUpload = o.upload;
        o.send();
        o.send(X.getArrayBuffer());
        o.send(X.getBlob());
        o.send(X.getDocument());
        o.send(X.getstring());
        o.send(X.getFormData());
        o.abort();
        var v16 : int/*unsigned short*/ = o.status;
        var v17 : string/*DOMString*/ = o.statusText;
        var f18 : string/*DOMString*/ = o.getResponseHeader(X.getstring());
        var f19 : string/*DOMString*/ = o.getAllResponseHeaders();
        o.overrideMimeType(X.getstring());
        var v20 : string/*XMLHttpRequestResponseType*/ = o.responseType;
        var v21 : variant/*any*/ = o.response;
        var v22 : string/*DOMString*/ = o.responseText;
        var v23 : Document = o.responseXML;
    } // XMLHttpRequest

    // #50
    function compile_AnonXMLHttpRequest(o : AnonXMLHttpRequest) : void {
    } // AnonXMLHttpRequest

    // #51
    function compile_FormData(o : FormData) : void {
        o.append(X.getstring(), X.getBlob());
        o.append(X.getstring(), X.getBlob(), X.getstring());
        o.append(X.getstring(), X.getstring());
    } // FormData

    // #52
    function compile_MediaList(o : MediaList) : void {
        var v1 : string/*DOMString*/ = o.mediaText;
        var v2 : int/*unsigned long*/ = o.length;
        var f3 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getint());
        var f4 : MayBeUndefined.<string/*DOMString*/> = o.item(X.getint());
        o.appendMedium(X.getstring());
        o.deleteMedium(X.getstring());
    } // MediaList

    // #53
    function compile_StyleSheet(o : StyleSheet) : void {
        var v1 : string/*DOMString*/ = o.type;
        var v2 : string/*DOMString*/ = o.href;
        var v3 : Node = o.ownerNode;
        var v4 : StyleSheet = o.parentStyleSheet;
        var v5 : string/*DOMString*/ = o.title;
        var v6 : MediaList = o.media;
        var v7 : boolean = o.disabled;
    } // StyleSheet

    // #54
    function compile_CSSStyleSheet(o : CSSStyleSheet) : void {
        var v1 : CSSRule = o.ownerRule;
        var v2 : CSSRule[]/*CSSRuleList*/ = o.cssRules;
        var f3 : int/*unsigned long*/ = o.insertRule(X.getstring(), X.getint());
        o.deleteRule(X.getint());
    } // CSSStyleSheet

    // #55
    function compile_LinkStyle(o : LinkStyle) : void {
        var v1 : StyleSheet = o.sheet;
    } // LinkStyle

    // #56
    function compile_CSSRule(o : CSSRule) : void {
        var v1 : int/*unsigned short*/ = CSSRule.STYLE_RULE;
        var v2 : int/*unsigned short*/ = o.STYLE_RULE;
        var v3 : int/*unsigned short*/ = CSSRule.IMPORT_RULE;
        var v4 : int/*unsigned short*/ = o.IMPORT_RULE;
        var v5 : int/*unsigned short*/ = CSSRule.MEDIA_RULE;
        var v6 : int/*unsigned short*/ = o.MEDIA_RULE;
        var v7 : int/*unsigned short*/ = CSSRule.FONT_FACE_RULE;
        var v8 : int/*unsigned short*/ = o.FONT_FACE_RULE;
        var v9 : int/*unsigned short*/ = CSSRule.PAGE_RULE;
        var v10 : int/*unsigned short*/ = o.PAGE_RULE;
        var v11 : int/*unsigned short*/ = CSSRule.NAMESPACE_RULE;
        var v12 : int/*unsigned short*/ = o.NAMESPACE_RULE;
        var v13 : int/*unsigned short*/ = o.type;
        var v14 : string/*DOMString*/ = o.cssText;
        var v15 : CSSRule = o.parentRule;
        var v16 : CSSStyleSheet = o.parentStyleSheet;
    } // CSSRule

    // #57
    function compile_CSSStyleRule(o : CSSStyleRule) : void {
        var v1 : string/*DOMString*/ = o.selectorText;
        var v2 : CSSStyleDeclaration = o.style;
    } // CSSStyleRule

    // #58
    function compile_CSSImportRule(o : CSSImportRule) : void {
        var v1 : string/*DOMString*/ = o.href;
        var v2 : MediaList = o.media;
        var v3 : CSSStyleSheet = o.styleSheet;
    } // CSSImportRule

    // #59
    function compile_CSSMediaRule(o : CSSMediaRule) : void {
        var v1 : MediaList = o.media;
        var v2 : CSSRule[]/*CSSRuleList*/ = o.cssRules;
        var f3 : int/*unsigned long*/ = o.insertRule(X.getstring(), X.getint());
        o.deleteRule(X.getint());
    } // CSSMediaRule

    // #60
    function compile_CSSFontFaceRule(o : CSSFontFaceRule) : void {
        var v1 : CSSStyleDeclaration = o.style;
    } // CSSFontFaceRule

    // #61
    function compile_CSSPageRule(o : CSSPageRule) : void {
        var v1 : string/*DOMString*/ = o.selectorText;
        var v2 : CSSStyleDeclaration = o.style;
    } // CSSPageRule

    // #62
    function compile_CSSNamespaceRule(o : CSSNamespaceRule) : void {
        var v1 : string/*DOMString*/ = o.namespaceURI;
        var v2 : string/*DOMString?*/ = o.prefix;
    } // CSSNamespaceRule

    // #63
    function compile_CSSStyleDeclaration(o : CSSStyleDeclaration) : void {
        var v1 : string/*DOMString*/ = o.cssText;
        var v2 : int/*unsigned long*/ = o.length;
        var f3 : string/*DOMString*/ = o.item(X.getint());
        var f4 : string/*DOMString*/ = o.getPropertyValue(X.getstring());
        var f5 : string/*DOMString*/ = o.getPropertyPriority(X.getstring());
        o.setProperty(X.getstring(), X.getstring());
        o.setProperty(X.getstring(), X.getstring(), X.getstring());
        var f6 : string/*DOMString*/ = o.removeProperty(X.getstring());
        var v7 : CSSRule = o.parentRule;
        var v8 : string/*DOMString*/ = o.azimuth;
        var v9 : string/*DOMString*/ = o.background;
        var v10 : string/*DOMString*/ = o.backgroundAttachment;
        var v11 : string/*DOMString*/ = o.backgroundColor;
        var v12 : string/*DOMString*/ = o.backgroundImage;
        var v13 : string/*DOMString*/ = o.backgroundPosition;
        var v14 : string/*DOMString*/ = o.backgroundRepeat;
        var v15 : string/*DOMString*/ = o.border;
        var v16 : string/*DOMString*/ = o.borderCollapse;
        var v17 : string/*DOMString*/ = o.borderColor;
        var v18 : string/*DOMString*/ = o.borderSpacing;
        var v19 : string/*DOMString*/ = o.borderStyle;
        var v20 : string/*DOMString*/ = o.borderTop;
        var v21 : string/*DOMString*/ = o.borderRight;
        var v22 : string/*DOMString*/ = o.borderBottom;
        var v23 : string/*DOMString*/ = o.borderLeft;
        var v24 : string/*DOMString*/ = o.borderTopColor;
        var v25 : string/*DOMString*/ = o.borderRightColor;
        var v26 : string/*DOMString*/ = o.borderBottomColor;
        var v27 : string/*DOMString*/ = o.borderLeftColor;
        var v28 : string/*DOMString*/ = o.borderTopStyle;
        var v29 : string/*DOMString*/ = o.borderRightStyle;
        var v30 : string/*DOMString*/ = o.borderBottomStyle;
        var v31 : string/*DOMString*/ = o.borderLeftStyle;
        var v32 : string/*DOMString*/ = o.borderTopWidth;
        var v33 : string/*DOMString*/ = o.borderRightWidth;
        var v34 : string/*DOMString*/ = o.borderBottomWidth;
        var v35 : string/*DOMString*/ = o.borderLeftWidth;
        var v36 : string/*DOMString*/ = o.borderWidth;
        var v37 : string/*DOMString*/ = o.bottom;
        var v38 : string/*DOMString*/ = o.captionSide;
        var v39 : string/*DOMString*/ = o.clear;
        var v40 : string/*DOMString*/ = o.clip;
        var v41 : string/*DOMString*/ = o.color;
        var v42 : string/*DOMString*/ = o.content;
        var v43 : string/*DOMString*/ = o.counterIncrement;
        var v44 : string/*DOMString*/ = o.counterReset;
        var v45 : string/*DOMString*/ = o.cue;
        var v46 : string/*DOMString*/ = o.cueAfter;
        var v47 : string/*DOMString*/ = o.cueBefore;
        var v48 : string/*DOMString*/ = o.cursor;
        var v49 : string/*DOMString*/ = o.direction;
        var v50 : string/*DOMString*/ = o.display;
        var v51 : string/*DOMString*/ = o.elevation;
        var v52 : string/*DOMString*/ = o.emptyCells;
        var v53 : string/*DOMString*/ = o.cssFloat;
        var v54 : string/*DOMString*/ = o.font;
        var v55 : string/*DOMString*/ = o.fontFamily;
        var v56 : string/*DOMString*/ = o.fontSize;
        var v57 : string/*DOMString*/ = o.fontSizeAdjust;
        var v58 : string/*DOMString*/ = o.fontStretch;
        var v59 : string/*DOMString*/ = o.fontStyle;
        var v60 : string/*DOMString*/ = o.fontVariant;
        var v61 : string/*DOMString*/ = o.fontWeight;
        var v62 : string/*DOMString*/ = o.height;
        var v63 : string/*DOMString*/ = o.left;
        var v64 : string/*DOMString*/ = o.letterSpacing;
        var v65 : string/*DOMString*/ = o.lineHeight;
        var v66 : string/*DOMString*/ = o.listStyle;
        var v67 : string/*DOMString*/ = o.listStyleImage;
        var v68 : string/*DOMString*/ = o.listStylePosition;
        var v69 : string/*DOMString*/ = o.listStyleType;
        var v70 : string/*DOMString*/ = o.margin;
        var v71 : string/*DOMString*/ = o.marginTop;
        var v72 : string/*DOMString*/ = o.marginRight;
        var v73 : string/*DOMString*/ = o.marginBottom;
        var v74 : string/*DOMString*/ = o.marginLeft;
        var v75 : string/*DOMString*/ = o.markerOffset;
        var v76 : string/*DOMString*/ = o.marks;
        var v77 : string/*DOMString*/ = o.maxHeight;
        var v78 : string/*DOMString*/ = o.maxWidth;
        var v79 : string/*DOMString*/ = o.minHeight;
        var v80 : string/*DOMString*/ = o.minWidth;
        var v81 : string/*DOMString*/ = o.orphans;
        var v82 : string/*DOMString*/ = o.outline;
        var v83 : string/*DOMString*/ = o.outlineColor;
        var v84 : string/*DOMString*/ = o.outlineStyle;
        var v85 : string/*DOMString*/ = o.outlineWidth;
        var v86 : string/*DOMString*/ = o.overflow;
        var v87 : string/*DOMString*/ = o.padding;
        var v88 : string/*DOMString*/ = o.paddingTop;
        var v89 : string/*DOMString*/ = o.paddingRight;
        var v90 : string/*DOMString*/ = o.paddingBottom;
        var v91 : string/*DOMString*/ = o.paddingLeft;
        var v92 : string/*DOMString*/ = o.page;
        var v93 : string/*DOMString*/ = o.pageBreakAfter;
        var v94 : string/*DOMString*/ = o.pageBreakBefore;
        var v95 : string/*DOMString*/ = o.pageBreakInside;
        var v96 : string/*DOMString*/ = o.pause;
        var v97 : string/*DOMString*/ = o.pauseAfter;
        var v98 : string/*DOMString*/ = o.pauseBefore;
        var v99 : string/*DOMString*/ = o.pitch;
        var v100 : string/*DOMString*/ = o.pitchRange;
        var v101 : string/*DOMString*/ = o.playDuring;
        var v102 : string/*DOMString*/ = o.position;
        var v103 : string/*DOMString*/ = o.quotes;
        var v104 : string/*DOMString*/ = o.richness;
        var v105 : string/*DOMString*/ = o.right;
        var v106 : string/*DOMString*/ = o.size;
        var v107 : string/*DOMString*/ = o.speak;
        var v108 : string/*DOMString*/ = o.speakHeader;
        var v109 : string/*DOMString*/ = o.speakNumeral;
        var v110 : string/*DOMString*/ = o.speakPunctuation;
        var v111 : string/*DOMString*/ = o.speechRate;
        var v112 : string/*DOMString*/ = o.stress;
        var v113 : string/*DOMString*/ = o.tableLayout;
        var v114 : string/*DOMString*/ = o.textAlign;
        var v115 : string/*DOMString*/ = o.textDecoration;
        var v116 : string/*DOMString*/ = o.textIndent;
        var v117 : string/*DOMString*/ = o.textShadow;
        var v118 : string/*DOMString*/ = o.textTransform;
        var v119 : string/*DOMString*/ = o.top;
        var v120 : string/*DOMString*/ = o.unicodeBidi;
        var v121 : string/*DOMString*/ = o.verticalAlign;
        var v122 : string/*DOMString*/ = o.visibility;
        var v123 : string/*DOMString*/ = o.voiceFamily;
        var v124 : string/*DOMString*/ = o.volume;
        var v125 : string/*DOMString*/ = o.whiteSpace;
        var v126 : string/*DOMString*/ = o.widows;
        var v127 : string/*DOMString*/ = o.width;
        var v128 : string/*DOMString*/ = o.wordSpacing;
        var v129 : string/*DOMString*/ = o.zIndex;
        var v130 : MayBeUndefined.<number> = o.length;
        var v131 : MayBeUndefined.<Object/*Maybe<object>*/> = o.parentRule;
        var v132 : MayBeUndefined.<string> = o.alignmentBaseline;
        var v133 : MayBeUndefined.<string> = o.background;
        var v134 : MayBeUndefined.<string> = o.backgroundAttachment;
        var v135 : MayBeUndefined.<string> = o.backgroundClip;
        var v136 : MayBeUndefined.<string> = o.backgroundColor;
        var v137 : MayBeUndefined.<string> = o.backgroundImage;
        var v138 : MayBeUndefined.<string> = o.backgroundOrigin;
        var v139 : MayBeUndefined.<string> = o.backgroundPosition;
        var v140 : MayBeUndefined.<string> = o.backgroundPositionX;
        var v141 : MayBeUndefined.<string> = o.backgroundPositionY;
        var v142 : MayBeUndefined.<string> = o.backgroundRepeat;
        var v143 : MayBeUndefined.<string> = o.backgroundRepeatX;
        var v144 : MayBeUndefined.<string> = o.backgroundRepeatY;
        var v145 : MayBeUndefined.<string> = o.backgroundSize;
        var v146 : MayBeUndefined.<string> = o.baselineShift;
        var v147 : MayBeUndefined.<string> = o.border;
        var v148 : MayBeUndefined.<string> = o.borderBottom;
        var v149 : MayBeUndefined.<string> = o.borderBottomColor;
        var v150 : MayBeUndefined.<string> = o.borderBottomLeftRadius;
        var v151 : MayBeUndefined.<string> = o.borderBottomRightRadius;
        var v152 : MayBeUndefined.<string> = o.borderBottomStyle;
        var v153 : MayBeUndefined.<string> = o.borderBottomWidth;
        var v154 : MayBeUndefined.<string> = o.borderCollapse;
        var v155 : MayBeUndefined.<string> = o.borderColor;
        var v156 : MayBeUndefined.<string> = o.borderImage;
        var v157 : MayBeUndefined.<string> = o.borderImageOutset;
        var v158 : MayBeUndefined.<string> = o.borderImageRepeat;
        var v159 : MayBeUndefined.<string> = o.borderImageSlice;
        var v160 : MayBeUndefined.<string> = o.borderImageSource;
        var v161 : MayBeUndefined.<string> = o.borderImageWidth;
        var v162 : MayBeUndefined.<string> = o.borderLeft;
        var v163 : MayBeUndefined.<string> = o.borderLeftColor;
        var v164 : MayBeUndefined.<string> = o.borderLeftStyle;
        var v165 : MayBeUndefined.<string> = o.borderLeftWidth;
        var v166 : MayBeUndefined.<string> = o.borderRadius;
        var v167 : MayBeUndefined.<string> = o.borderRight;
        var v168 : MayBeUndefined.<string> = o.borderRightColor;
        var v169 : MayBeUndefined.<string> = o.borderRightStyle;
        var v170 : MayBeUndefined.<string> = o.borderRightWidth;
        var v171 : MayBeUndefined.<string> = o.borderSpacing;
        var v172 : MayBeUndefined.<string> = o.borderStyle;
        var v173 : MayBeUndefined.<string> = o.borderTop;
        var v174 : MayBeUndefined.<string> = o.borderTopColor;
        var v175 : MayBeUndefined.<string> = o.borderTopLeftRadius;
        var v176 : MayBeUndefined.<string> = o.borderTopRightRadius;
        var v177 : MayBeUndefined.<string> = o.borderTopStyle;
        var v178 : MayBeUndefined.<string> = o.borderTopWidth;
        var v179 : MayBeUndefined.<string> = o.borderWidth;
        var v180 : MayBeUndefined.<string> = o.bottom;
        var v181 : MayBeUndefined.<string> = o.boxShadow;
        var v182 : MayBeUndefined.<string> = o.boxSizing;
        var v183 : MayBeUndefined.<string> = o.captionSide;
        var v184 : MayBeUndefined.<string> = o.clear;
        var v185 : MayBeUndefined.<string> = o.clip;
        var v186 : MayBeUndefined.<string> = o.clipPath;
        var v187 : MayBeUndefined.<string> = o.clipRule;
        var v188 : MayBeUndefined.<string> = o.color;
        var v189 : MayBeUndefined.<string> = o.colorInterpolation;
        var v190 : MayBeUndefined.<string> = o.colorInterpolationFilters;
        var v191 : MayBeUndefined.<string> = o.colorProfile;
        var v192 : MayBeUndefined.<string> = o.colorRendering;
        var v193 : MayBeUndefined.<string> = o.content;
        var v194 : MayBeUndefined.<string> = o.counterIncrement;
        var v195 : MayBeUndefined.<string> = o.counterReset;
        var v196 : MayBeUndefined.<string> = o.cssText;
        var v197 : MayBeUndefined.<string> = o.cursor;
        var v198 : MayBeUndefined.<string> = o.direction;
        var v199 : MayBeUndefined.<string> = o.display;
        var v200 : MayBeUndefined.<string> = o.dominantBaseline;
        var v201 : MayBeUndefined.<string> = o.emptyCells;
        var v202 : MayBeUndefined.<string> = o.enableBackground;
        var v203 : MayBeUndefined.<string> = o.fill;
        var v204 : MayBeUndefined.<string> = o.fillOpacity;
        var v205 : MayBeUndefined.<string> = o.fillRule;
        var v206 : MayBeUndefined.<string> = o.filter;
        var v207 : MayBeUndefined.<string> = o.float;
        var v208 : MayBeUndefined.<string> = o.floodColor;
        var v209 : MayBeUndefined.<string> = o.floodOpacity;
        var v210 : MayBeUndefined.<string> = o.font;
        var v211 : MayBeUndefined.<string> = o.fontFamily;
        var v212 : MayBeUndefined.<string> = o.fontSize;
        var v213 : MayBeUndefined.<string> = o.fontStretch;
        var v214 : MayBeUndefined.<string> = o.fontStyle;
        var v215 : MayBeUndefined.<string> = o.fontVariant;
        var v216 : MayBeUndefined.<string> = o.fontWeight;
        var v217 : MayBeUndefined.<string> = o.glyphOrientationHorizontal;
        var v218 : MayBeUndefined.<string> = o.glyphOrientationVertical;
        var v219 : MayBeUndefined.<string> = o.height;
        var v220 : MayBeUndefined.<string> = o.imageRendering;
        var v221 : MayBeUndefined.<string> = o.kerning;
        var v222 : MayBeUndefined.<string> = o.left;
        var v223 : MayBeUndefined.<string> = o.letterSpacing;
        var v224 : MayBeUndefined.<string> = o.lightingColor;
        var v225 : MayBeUndefined.<string> = o.lineHeight;
        var v226 : MayBeUndefined.<string> = o.listStyle;
        var v227 : MayBeUndefined.<string> = o.listStyleImage;
        var v228 : MayBeUndefined.<string> = o.listStylePosition;
        var v229 : MayBeUndefined.<string> = o.listStyleType;
        var v230 : MayBeUndefined.<string> = o.margin;
        var v231 : MayBeUndefined.<string> = o.marginBottom;
        var v232 : MayBeUndefined.<string> = o.marginLeft;
        var v233 : MayBeUndefined.<string> = o.marginRight;
        var v234 : MayBeUndefined.<string> = o.marginTop;
        var v235 : MayBeUndefined.<string> = o.marker;
        var v236 : MayBeUndefined.<string> = o.markerEnd;
        var v237 : MayBeUndefined.<string> = o.markerMid;
        var v238 : MayBeUndefined.<string> = o.markerStart;
        var v239 : MayBeUndefined.<string> = o.mask;
        var v240 : MayBeUndefined.<string> = o.maxHeight;
        var v241 : MayBeUndefined.<string> = o.maxWidth;
        var v242 : MayBeUndefined.<string> = o.minHeight;
        var v243 : MayBeUndefined.<string> = o.minWidth;
        var v244 : MayBeUndefined.<string> = o.opacity;
        var v245 : MayBeUndefined.<string> = o.orphans;
        var v246 : MayBeUndefined.<string> = o.outline;
        var v247 : MayBeUndefined.<string> = o.outlineColor;
        var v248 : MayBeUndefined.<string> = o.outlineOffset;
        var v249 : MayBeUndefined.<string> = o.outlineStyle;
        var v250 : MayBeUndefined.<string> = o.outlineWidth;
        var v251 : MayBeUndefined.<string> = o.overflow;
        var v252 : MayBeUndefined.<string> = o.overflowX;
        var v253 : MayBeUndefined.<string> = o.overflowY;
        var v254 : MayBeUndefined.<string> = o.padding;
        var v255 : MayBeUndefined.<string> = o.paddingBottom;
        var v256 : MayBeUndefined.<string> = o.paddingLeft;
        var v257 : MayBeUndefined.<string> = o.paddingRight;
        var v258 : MayBeUndefined.<string> = o.paddingTop;
        var v259 : MayBeUndefined.<string> = o.page;
        var v260 : MayBeUndefined.<string> = o.pageBreakAfter;
        var v261 : MayBeUndefined.<string> = o.pageBreakBefore;
        var v262 : MayBeUndefined.<string> = o.pageBreakInside;
        var v263 : MayBeUndefined.<string> = o.pointerEvents;
        var v264 : MayBeUndefined.<string> = o.position;
        var v265 : MayBeUndefined.<string> = o.quotes;
        var v266 : MayBeUndefined.<string> = o.resize;
        var v267 : MayBeUndefined.<string> = o.right;
        var v268 : MayBeUndefined.<string> = o.shapeRendering;
        var v269 : MayBeUndefined.<string> = o.size;
        var v270 : MayBeUndefined.<string> = o.speak;
        var v271 : MayBeUndefined.<string> = o.src;
        var v272 : MayBeUndefined.<string> = o.stopColor;
        var v273 : MayBeUndefined.<string> = o.stopOpacity;
        var v274 : MayBeUndefined.<string> = o.stroke;
        var v275 : MayBeUndefined.<string> = o.strokeDasharray;
        var v276 : MayBeUndefined.<string> = o.strokeDashoffset;
        var v277 : MayBeUndefined.<string> = o.strokeLinecap;
        var v278 : MayBeUndefined.<string> = o.strokeLinejoin;
        var v279 : MayBeUndefined.<string> = o.strokeMiterlimit;
        var v280 : MayBeUndefined.<string> = o.strokeOpacity;
        var v281 : MayBeUndefined.<string> = o.strokeWidth;
        var v282 : MayBeUndefined.<string> = o.tableLayout;
        var v283 : MayBeUndefined.<string> = o.textAlign;
        var v284 : MayBeUndefined.<string> = o.textAnchor;
        var v285 : MayBeUndefined.<string> = o.textDecoration;
        var v286 : MayBeUndefined.<string> = o.textIndent;
        var v287 : MayBeUndefined.<string> = o.textLineThrough;
        var v288 : MayBeUndefined.<string> = o.textLineThroughColor;
        var v289 : MayBeUndefined.<string> = o.textLineThroughMode;
        var v290 : MayBeUndefined.<string> = o.textLineThroughStyle;
        var v291 : MayBeUndefined.<string> = o.textLineThroughWidth;
        var v292 : MayBeUndefined.<string> = o.textOverflow;
        var v293 : MayBeUndefined.<string> = o.textOverline;
        var v294 : MayBeUndefined.<string> = o.textOverlineColor;
        var v295 : MayBeUndefined.<string> = o.textOverlineMode;
        var v296 : MayBeUndefined.<string> = o.textOverlineStyle;
        var v297 : MayBeUndefined.<string> = o.textOverlineWidth;
        var v298 : MayBeUndefined.<string> = o.textRendering;
        var v299 : MayBeUndefined.<string> = o.textShadow;
        var v300 : MayBeUndefined.<string> = o.textTransform;
        var v301 : MayBeUndefined.<string> = o.textUnderline;
        var v302 : MayBeUndefined.<string> = o.textUnderlineColor;
        var v303 : MayBeUndefined.<string> = o.textUnderlineMode;
        var v304 : MayBeUndefined.<string> = o.textUnderlineStyle;
        var v305 : MayBeUndefined.<string> = o.textUnderlineWidth;
        var v306 : MayBeUndefined.<string> = o.top;
        var v307 : MayBeUndefined.<string> = o.unicodeBidi;
        var v308 : MayBeUndefined.<string> = o.unicodeRange;
        var v309 : MayBeUndefined.<string> = o.vectorEffect;
        var v310 : MayBeUndefined.<string> = o.verticalAlign;
        var v311 : MayBeUndefined.<string> = o.visibility;
        var v312 : MayBeUndefined.<string> = o.webkitAnimation;
        var v313 : MayBeUndefined.<string> = o.webkitAnimationDelay;
        var v314 : MayBeUndefined.<string> = o.webkitAnimationDirection;
        var v315 : MayBeUndefined.<string> = o.webkitAnimationDuration;
        var v316 : MayBeUndefined.<string> = o.webkitAnimationFillMode;
        var v317 : MayBeUndefined.<string> = o.webkitAnimationIterationCount;
        var v318 : MayBeUndefined.<string> = o.webkitAnimationName;
        var v319 : MayBeUndefined.<string> = o.webkitAnimationPlayState;
        var v320 : MayBeUndefined.<string> = o.webkitAnimationTimingFunction;
        var v321 : MayBeUndefined.<string> = o.webkitAppearance;
        var v322 : MayBeUndefined.<string> = o.webkitAspectRatio;
        var v323 : MayBeUndefined.<string> = o.webkitBackfaceVisibility;
        var v324 : MayBeUndefined.<string> = o.webkitBackgroundClip;
        var v325 : MayBeUndefined.<string> = o.webkitBackgroundComposite;
        var v326 : MayBeUndefined.<string> = o.webkitBackgroundOrigin;
        var v327 : MayBeUndefined.<string> = o.webkitBackgroundSize;
        var v328 : MayBeUndefined.<string> = o.webkitBorderAfter;
        var v329 : MayBeUndefined.<string> = o.webkitBorderAfterColor;
        var v330 : MayBeUndefined.<string> = o.webkitBorderAfterStyle;
        var v331 : MayBeUndefined.<string> = o.webkitBorderAfterWidth;
        var v332 : MayBeUndefined.<string> = o.webkitBorderBefore;
        var v333 : MayBeUndefined.<string> = o.webkitBorderBeforeColor;
        var v334 : MayBeUndefined.<string> = o.webkitBorderBeforeStyle;
        var v335 : MayBeUndefined.<string> = o.webkitBorderBeforeWidth;
        var v336 : MayBeUndefined.<string> = o.webkitBorderEnd;
        var v337 : MayBeUndefined.<string> = o.webkitBorderEndColor;
        var v338 : MayBeUndefined.<string> = o.webkitBorderEndStyle;
        var v339 : MayBeUndefined.<string> = o.webkitBorderEndWidth;
        var v340 : MayBeUndefined.<string> = o.webkitBorderFit;
        var v341 : MayBeUndefined.<string> = o.webkitBorderHorizontalSpacing;
        var v342 : MayBeUndefined.<string> = o.webkitBorderImage;
        var v343 : MayBeUndefined.<string> = o.webkitBorderRadius;
        var v344 : MayBeUndefined.<string> = o.webkitBorderStart;
        var v345 : MayBeUndefined.<string> = o.webkitBorderStartColor;
        var v346 : MayBeUndefined.<string> = o.webkitBorderStartStyle;
        var v347 : MayBeUndefined.<string> = o.webkitBorderStartWidth;
        var v348 : MayBeUndefined.<string> = o.webkitBorderVerticalSpacing;
        var v349 : MayBeUndefined.<string> = o.webkitBoxAlign;
        var v350 : MayBeUndefined.<string> = o.webkitBoxDirection;
        var v351 : MayBeUndefined.<string> = o.webkitBoxFlex;
        var v352 : MayBeUndefined.<string> = o.webkitBoxFlexGroup;
        var v353 : MayBeUndefined.<string> = o.webkitBoxLines;
        var v354 : MayBeUndefined.<string> = o.webkitBoxOrdinalGroup;
        var v355 : MayBeUndefined.<string> = o.webkitBoxOrient;
        var v356 : MayBeUndefined.<string> = o.webkitBoxPack;
        var v357 : MayBeUndefined.<string> = o.webkitBoxReflect;
        var v358 : MayBeUndefined.<string> = o.webkitBoxShadow;
        var v359 : MayBeUndefined.<string> = o.webkitColorCorrection;
        var v360 : MayBeUndefined.<string> = o.webkitColumnAxis;
        var v361 : MayBeUndefined.<string> = o.webkitColumnBreakAfter;
        var v362 : MayBeUndefined.<string> = o.webkitColumnBreakBefore;
        var v363 : MayBeUndefined.<string> = o.webkitColumnBreakInside;
        var v364 : MayBeUndefined.<string> = o.webkitColumnCount;
        var v365 : MayBeUndefined.<string> = o.webkitColumnGap;
        var v366 : MayBeUndefined.<string> = o.webkitColumnRule;
        var v367 : MayBeUndefined.<string> = o.webkitColumnRuleColor;
        var v368 : MayBeUndefined.<string> = o.webkitColumnRuleStyle;
        var v369 : MayBeUndefined.<string> = o.webkitColumnRuleWidth;
        var v370 : MayBeUndefined.<string> = o.webkitColumnSpan;
        var v371 : MayBeUndefined.<string> = o.webkitColumnWidth;
        var v372 : MayBeUndefined.<string> = o.webkitColumns;
        var v373 : MayBeUndefined.<string> = o.webkitFilter;
        var v374 : MayBeUndefined.<string> = o.webkitFlexAlign;
        var v375 : MayBeUndefined.<string> = o.webkitFlexDirection;
        var v376 : MayBeUndefined.<string> = o.webkitFlexFlow;
        var v377 : MayBeUndefined.<string> = o.webkitFlexItemAlign;
        var v378 : MayBeUndefined.<string> = o.webkitFlexLinePack;
        var v379 : MayBeUndefined.<string> = o.webkitFlexOrder;
        var v380 : MayBeUndefined.<string> = o.webkitFlexPack;
        var v381 : MayBeUndefined.<string> = o.webkitFlexWrap;
        var v382 : MayBeUndefined.<string> = o.webkitFlowFrom;
        var v383 : MayBeUndefined.<string> = o.webkitFlowInto;
        var v384 : MayBeUndefined.<string> = o.webkitFontFeatureSettings;
        var v385 : MayBeUndefined.<string> = o.webkitFontKerning;
        var v386 : MayBeUndefined.<string> = o.webkitFontSizeDelta;
        var v387 : MayBeUndefined.<string> = o.webkitFontSmoothing;
        var v388 : MayBeUndefined.<string> = o.webkitFontVariantLigatures;
        var v389 : MayBeUndefined.<string> = o.webkitHighlight;
        var v390 : MayBeUndefined.<string> = o.webkitHyphenateCharacter;
        var v391 : MayBeUndefined.<string> = o.webkitHyphenateLimitAfter;
        var v392 : MayBeUndefined.<string> = o.webkitHyphenateLimitBefore;
        var v393 : MayBeUndefined.<string> = o.webkitHyphenateLimitLines;
        var v394 : MayBeUndefined.<string> = o.webkitHyphens;
        var v395 : MayBeUndefined.<string> = o.webkitLineAlign;
        var v396 : MayBeUndefined.<string> = o.webkitLineBoxContain;
        var v397 : MayBeUndefined.<string> = o.webkitLineBreak;
        var v398 : MayBeUndefined.<string> = o.webkitLineClamp;
        var v399 : MayBeUndefined.<string> = o.webkitLineGrid;
        var v400 : MayBeUndefined.<string> = o.webkitLineSnap;
        var v401 : MayBeUndefined.<string> = o.webkitLocale;
        var v402 : MayBeUndefined.<string> = o.webkitLogicalHeight;
        var v403 : MayBeUndefined.<string> = o.webkitLogicalWidth;
        var v404 : MayBeUndefined.<string> = o.webkitMarginAfter;
        var v405 : MayBeUndefined.<string> = o.webkitMarginAfterCollapse;
        var v406 : MayBeUndefined.<string> = o.webkitMarginBefore;
        var v407 : MayBeUndefined.<string> = o.webkitMarginBeforeCollapse;
        var v408 : MayBeUndefined.<string> = o.webkitMarginBottomCollapse;
        var v409 : MayBeUndefined.<string> = o.webkitMarginCollapse;
        var v410 : MayBeUndefined.<string> = o.webkitMarginEnd;
        var v411 : MayBeUndefined.<string> = o.webkitMarginStart;
        var v412 : MayBeUndefined.<string> = o.webkitMarginTopCollapse;
        var v413 : MayBeUndefined.<string> = o.webkitMarquee;
        var v414 : MayBeUndefined.<string> = o.webkitMarqueeDirection;
        var v415 : MayBeUndefined.<string> = o.webkitMarqueeIncrement;
        var v416 : MayBeUndefined.<string> = o.webkitMarqueeRepetition;
        var v417 : MayBeUndefined.<string> = o.webkitMarqueeSpeed;
        var v418 : MayBeUndefined.<string> = o.webkitMarqueeStyle;
        var v419 : MayBeUndefined.<string> = o.webkitMask;
        var v420 : MayBeUndefined.<string> = o.webkitMaskAttachment;
        var v421 : MayBeUndefined.<string> = o.webkitMaskBoxImage;
        var v422 : MayBeUndefined.<string> = o.webkitMaskBoxImageOutset;
        var v423 : MayBeUndefined.<string> = o.webkitMaskBoxImageRepeat;
        var v424 : MayBeUndefined.<string> = o.webkitMaskBoxImageSlice;
        var v425 : MayBeUndefined.<string> = o.webkitMaskBoxImageSource;
        var v426 : MayBeUndefined.<string> = o.webkitMaskBoxImageWidth;
        var v427 : MayBeUndefined.<string> = o.webkitMaskClip;
        var v428 : MayBeUndefined.<string> = o.webkitMaskComposite;
        var v429 : MayBeUndefined.<string> = o.webkitMaskImage;
        var v430 : MayBeUndefined.<string> = o.webkitMaskOrigin;
        var v431 : MayBeUndefined.<string> = o.webkitMaskPosition;
        var v432 : MayBeUndefined.<string> = o.webkitMaskPositionX;
        var v433 : MayBeUndefined.<string> = o.webkitMaskPositionY;
        var v434 : MayBeUndefined.<string> = o.webkitMaskRepeat;
        var v435 : MayBeUndefined.<string> = o.webkitMaskRepeatX;
        var v436 : MayBeUndefined.<string> = o.webkitMaskRepeatY;
        var v437 : MayBeUndefined.<string> = o.webkitMaskSize;
        var v438 : MayBeUndefined.<string> = o.webkitMatchNearestMailBlockquoteColor;
        var v439 : MayBeUndefined.<string> = o.webkitMaxLogicalHeight;
        var v440 : MayBeUndefined.<string> = o.webkitMaxLogicalWidth;
        var v441 : MayBeUndefined.<string> = o.webkitMinLogicalHeight;
        var v442 : MayBeUndefined.<string> = o.webkitMinLogicalWidth;
        var v443 : MayBeUndefined.<string> = o.webkitNbspMode;
        var v444 : MayBeUndefined.<string> = o.webkitOverflowScrolling;
        var v445 : MayBeUndefined.<string> = o.webkitPaddingAfter;
        var v446 : MayBeUndefined.<string> = o.webkitPaddingBefore;
        var v447 : MayBeUndefined.<string> = o.webkitPaddingEnd;
        var v448 : MayBeUndefined.<string> = o.webkitPaddingStart;
        var v449 : MayBeUndefined.<string> = o.webkitPerspective;
        var v450 : MayBeUndefined.<string> = o.webkitPerspectiveOrigin;
        var v451 : MayBeUndefined.<string> = o.webkitPerspectiveOriginX;
        var v452 : MayBeUndefined.<string> = o.webkitPerspectiveOriginY;
        var v453 : MayBeUndefined.<string> = o.webkitPrintColorAdjust;
        var v454 : MayBeUndefined.<string> = o.webkitRegionBreakAfter;
        var v455 : MayBeUndefined.<string> = o.webkitRegionBreakBefore;
        var v456 : MayBeUndefined.<string> = o.webkitRegionBreakInside;
        var v457 : MayBeUndefined.<string> = o.webkitRegionOverflow;
        var v458 : MayBeUndefined.<string> = o.webkitRtlOrdering;
        var v459 : MayBeUndefined.<string> = o.webkitSvgShadow;
        var v460 : MayBeUndefined.<string> = o.webkitTapHighlightColor;
        var v461 : MayBeUndefined.<string> = o.webkitTextCombine;
        var v462 : MayBeUndefined.<string> = o.webkitTextDecorationsInEffect;
        var v463 : MayBeUndefined.<string> = o.webkitTextEmphasis;
        var v464 : MayBeUndefined.<string> = o.webkitTextEmphasisColor;
        var v465 : MayBeUndefined.<string> = o.webkitTextEmphasisPosition;
        var v466 : MayBeUndefined.<string> = o.webkitTextEmphasisStyle;
        var v467 : MayBeUndefined.<string> = o.webkitTextFillColor;
        var v468 : MayBeUndefined.<string> = o.webkitTextOrientation;
        var v469 : MayBeUndefined.<string> = o.webkitTextSecurity;
        var v470 : MayBeUndefined.<string> = o.webkitTextSizeAdjust;
        var v471 : MayBeUndefined.<string> = o.webkitTextStroke;
        var v472 : MayBeUndefined.<string> = o.webkitTextStrokeColor;
        var v473 : MayBeUndefined.<string> = o.webkitTextStrokeWidth;
        var v474 : MayBeUndefined.<string> = o.webkitTransform;
        var v475 : MayBeUndefined.<string> = o.webkitTransformOrigin;
        var v476 : MayBeUndefined.<string> = o.webkitTransformOriginX;
        var v477 : MayBeUndefined.<string> = o.webkitTransformOriginY;
        var v478 : MayBeUndefined.<string> = o.webkitTransformOriginZ;
        var v479 : MayBeUndefined.<string> = o.webkitTransformStyle;
        var v480 : MayBeUndefined.<string> = o.webkitTransition;
        var v481 : MayBeUndefined.<string> = o.webkitTransitionDelay;
        var v482 : MayBeUndefined.<string> = o.webkitTransitionDuration;
        var v483 : MayBeUndefined.<string> = o.webkitTransitionProperty;
        var v484 : MayBeUndefined.<string> = o.webkitTransitionTimingFunction;
        var v485 : MayBeUndefined.<string> = o.webkitUserDrag;
        var v486 : MayBeUndefined.<string> = o.webkitUserModify;
        var v487 : MayBeUndefined.<string> = o.webkitUserSelect;
        var v488 : MayBeUndefined.<string> = o.webkitWrap;
        var v489 : MayBeUndefined.<string> = o.webkitWrapFlow;
        var v490 : MayBeUndefined.<string> = o.webkitWrapMargin;
        var v491 : MayBeUndefined.<string> = o.webkitWrapPadding;
        var v492 : MayBeUndefined.<string> = o.webkitWrapShapeInside;
        var v493 : MayBeUndefined.<string> = o.webkitWrapShapeOutside;
        var v494 : MayBeUndefined.<string> = o.webkitWrapThrough;
        var v495 : MayBeUndefined.<string> = o.webkitWritingMode;
        var v496 : MayBeUndefined.<string> = o.whiteSpace;
        var v497 : MayBeUndefined.<string> = o.widows;
        var v498 : MayBeUndefined.<string> = o.width;
        var v499 : MayBeUndefined.<string> = o.wordBreak;
        var v500 : MayBeUndefined.<string> = o.wordSpacing;
        var v501 : MayBeUndefined.<string> = o.wordWrap;
        var v502 : MayBeUndefined.<string> = o.writingMode;
        var v503 : MayBeUndefined.<string> = o.zIndex;
        var v504 : MayBeUndefined.<string> = o.zoom;
        var v505 : MayBeUndefined.<number> = o.length;
        var v506 : MayBeUndefined.<Object/*Maybe<object>*/> = o.parentRule;
        var v507 : MayBeUndefined.<string> = o.MozAnimation;
        var v508 : MayBeUndefined.<string> = o.MozAnimationDelay;
        var v509 : MayBeUndefined.<string> = o.MozAnimationDirection;
        var v510 : MayBeUndefined.<string> = o.MozAnimationDuration;
        var v511 : MayBeUndefined.<string> = o.MozAnimationFillMode;
        var v512 : MayBeUndefined.<string> = o.MozAnimationIterationCount;
        var v513 : MayBeUndefined.<string> = o.MozAnimationName;
        var v514 : MayBeUndefined.<string> = o.MozAnimationPlayState;
        var v515 : MayBeUndefined.<string> = o.MozAnimationTimingFunction;
        var v516 : MayBeUndefined.<string> = o.MozAppearance;
        var v517 : MayBeUndefined.<string> = o.MozBackfaceVisibility;
        var v518 : MayBeUndefined.<string> = o.MozBackgroundInlinePolicy;
        var v519 : MayBeUndefined.<string> = o.MozBinding;
        var v520 : MayBeUndefined.<string> = o.MozBorderBottomColors;
        var v521 : MayBeUndefined.<string> = o.MozBorderEnd;
        var v522 : MayBeUndefined.<string> = o.MozBorderEndColor;
        var v523 : MayBeUndefined.<string> = o.MozBorderEndStyle;
        var v524 : MayBeUndefined.<string> = o.MozBorderEndWidth;
        var v525 : MayBeUndefined.<string> = o.MozBorderImage;
        var v526 : MayBeUndefined.<string> = o.MozBorderLeftColors;
        var v527 : MayBeUndefined.<string> = o.MozBorderRightColors;
        var v528 : MayBeUndefined.<string> = o.MozBorderStart;
        var v529 : MayBeUndefined.<string> = o.MozBorderStartColor;
        var v530 : MayBeUndefined.<string> = o.MozBorderStartStyle;
        var v531 : MayBeUndefined.<string> = o.MozBorderStartWidth;
        var v532 : MayBeUndefined.<string> = o.MozBorderTopColors;
        var v533 : MayBeUndefined.<string> = o.MozBoxAlign;
        var v534 : MayBeUndefined.<string> = o.MozBoxDirection;
        var v535 : MayBeUndefined.<string> = o.MozBoxFlex;
        var v536 : MayBeUndefined.<string> = o.MozBoxOrdinalGroup;
        var v537 : MayBeUndefined.<string> = o.MozBoxOrient;
        var v538 : MayBeUndefined.<string> = o.MozBoxPack;
        var v539 : MayBeUndefined.<string> = o.MozBoxSizing;
        var v540 : MayBeUndefined.<string> = o.MozColumnCount;
        var v541 : MayBeUndefined.<string> = o.MozColumnGap;
        var v542 : MayBeUndefined.<string> = o.MozColumnRule;
        var v543 : MayBeUndefined.<string> = o.MozColumnRuleColor;
        var v544 : MayBeUndefined.<string> = o.MozColumnRuleStyle;
        var v545 : MayBeUndefined.<string> = o.MozColumnRuleWidth;
        var v546 : MayBeUndefined.<string> = o.MozColumnWidth;
        var v547 : MayBeUndefined.<string> = o.MozColumns;
        var v548 : MayBeUndefined.<string> = o.MozFloatEdge;
        var v549 : MayBeUndefined.<string> = o.MozFontFeatureSettings;
        var v550 : MayBeUndefined.<string> = o.MozFontLanguageOverride;
        var v551 : MayBeUndefined.<string> = o.MozForceBrokenImageIcon;
        var v552 : MayBeUndefined.<string> = o.MozHyphens;
        var v553 : MayBeUndefined.<string> = o.MozImageRegion;
        var v554 : MayBeUndefined.<string> = o.MozMarginEnd;
        var v555 : MayBeUndefined.<string> = o.MozMarginStart;
        var v556 : MayBeUndefined.<string> = o.MozOpacity;
        var v557 : MayBeUndefined.<string> = o.MozOrient;
        var v558 : MayBeUndefined.<string> = o.MozOutline;
        var v559 : MayBeUndefined.<string> = o.MozOutlineColor;
        var v560 : MayBeUndefined.<string> = o.MozOutlineOffset;
        var v561 : MayBeUndefined.<string> = o.MozOutlineRadius;
        var v562 : MayBeUndefined.<string> = o.MozOutlineRadiusBottomleft;
        var v563 : MayBeUndefined.<string> = o.MozOutlineRadiusBottomright;
        var v564 : MayBeUndefined.<string> = o.MozOutlineRadiusTopleft;
        var v565 : MayBeUndefined.<string> = o.MozOutlineRadiusTopright;
        var v566 : MayBeUndefined.<string> = o.MozOutlineStyle;
        var v567 : MayBeUndefined.<string> = o.MozOutlineWidth;
        var v568 : MayBeUndefined.<string> = o.MozPaddingEnd;
        var v569 : MayBeUndefined.<string> = o.MozPaddingStart;
        var v570 : MayBeUndefined.<string> = o.MozPerspective;
        var v571 : MayBeUndefined.<string> = o.MozPerspectiveOrigin;
        var v572 : MayBeUndefined.<string> = o.MozStackSizing;
        var v573 : MayBeUndefined.<string> = o.MozTabSize;
        var v574 : MayBeUndefined.<string> = o.MozTextAlignLast;
        var v575 : MayBeUndefined.<string> = o.MozTextBlink;
        var v576 : MayBeUndefined.<string> = o.MozTextDecorationColor;
        var v577 : MayBeUndefined.<string> = o.MozTextDecorationLine;
        var v578 : MayBeUndefined.<string> = o.MozTextDecorationStyle;
        var v579 : MayBeUndefined.<string> = o.MozTextSizeAdjust;
        var v580 : MayBeUndefined.<string> = o.MozTransform;
        var v581 : MayBeUndefined.<string> = o.MozTransformOrigin;
        var v582 : MayBeUndefined.<string> = o.MozTransformStyle;
        var v583 : MayBeUndefined.<string> = o.MozTransition;
        var v584 : MayBeUndefined.<string> = o.MozTransitionDelay;
        var v585 : MayBeUndefined.<string> = o.MozTransitionDuration;
        var v586 : MayBeUndefined.<string> = o.MozTransitionProperty;
        var v587 : MayBeUndefined.<string> = o.MozTransitionTimingFunction;
        var v588 : MayBeUndefined.<string> = o.MozUserFocus;
        var v589 : MayBeUndefined.<string> = o.MozUserInput;
        var v590 : MayBeUndefined.<string> = o.MozUserModify;
        var v591 : MayBeUndefined.<string> = o.MozUserSelect;
        var v592 : MayBeUndefined.<string> = o.MozWindowShadow;
        var v593 : MayBeUndefined.<string> = o.background;
        var v594 : MayBeUndefined.<string> = o.backgroundAttachment;
        var v595 : MayBeUndefined.<string> = o.backgroundClip;
        var v596 : MayBeUndefined.<string> = o.backgroundColor;
        var v597 : MayBeUndefined.<string> = o.backgroundImage;
        var v598 : MayBeUndefined.<string> = o.backgroundOrigin;
        var v599 : MayBeUndefined.<string> = o.backgroundPosition;
        var v600 : MayBeUndefined.<string> = o.backgroundRepeat;
        var v601 : MayBeUndefined.<string> = o.backgroundSize;
        var v602 : MayBeUndefined.<string> = o.border;
        var v603 : MayBeUndefined.<string> = o.borderBottom;
        var v604 : MayBeUndefined.<string> = o.borderBottomColor;
        var v605 : MayBeUndefined.<string> = o.borderBottomLeftRadius;
        var v606 : MayBeUndefined.<string> = o.borderBottomRightRadius;
        var v607 : MayBeUndefined.<string> = o.borderBottomStyle;
        var v608 : MayBeUndefined.<string> = o.borderBottomWidth;
        var v609 : MayBeUndefined.<string> = o.borderCollapse;
        var v610 : MayBeUndefined.<string> = o.borderColor;
        var v611 : MayBeUndefined.<string> = o.borderLeft;
        var v612 : MayBeUndefined.<string> = o.borderLeftColor;
        var v613 : MayBeUndefined.<string> = o.borderLeftStyle;
        var v614 : MayBeUndefined.<string> = o.borderLeftWidth;
        var v615 : MayBeUndefined.<string> = o.borderRadius;
        var v616 : MayBeUndefined.<string> = o.borderRight;
        var v617 : MayBeUndefined.<string> = o.borderRightColor;
        var v618 : MayBeUndefined.<string> = o.borderRightStyle;
        var v619 : MayBeUndefined.<string> = o.borderRightWidth;
        var v620 : MayBeUndefined.<string> = o.borderSpacing;
        var v621 : MayBeUndefined.<string> = o.borderStyle;
        var v622 : MayBeUndefined.<string> = o.borderTop;
        var v623 : MayBeUndefined.<string> = o.borderTopColor;
        var v624 : MayBeUndefined.<string> = o.borderTopLeftRadius;
        var v625 : MayBeUndefined.<string> = o.borderTopRightRadius;
        var v626 : MayBeUndefined.<string> = o.borderTopStyle;
        var v627 : MayBeUndefined.<string> = o.borderTopWidth;
        var v628 : MayBeUndefined.<string> = o.borderWidth;
        var v629 : MayBeUndefined.<string> = o.bottom;
        var v630 : MayBeUndefined.<string> = o.boxShadow;
        var v631 : MayBeUndefined.<string> = o.captionSide;
        var v632 : MayBeUndefined.<string> = o.clear;
        var v633 : MayBeUndefined.<string> = o.clip;
        var v634 : MayBeUndefined.<string> = o.clipPath;
        var v635 : MayBeUndefined.<string> = o.clipRule;
        var v636 : MayBeUndefined.<string> = o.color;
        var v637 : MayBeUndefined.<string> = o.colorInterpolation;
        var v638 : MayBeUndefined.<string> = o.colorInterpolationFilters;
        var v639 : MayBeUndefined.<string> = o.content;
        var v640 : MayBeUndefined.<string> = o.counterIncrement;
        var v641 : MayBeUndefined.<string> = o.counterReset;
        var v642 : MayBeUndefined.<string> = o.cssFloat;
        var v643 : MayBeUndefined.<string> = o.cssText;
        var v644 : MayBeUndefined.<string> = o.cursor;
        var v645 : MayBeUndefined.<string> = o.direction;
        var v646 : MayBeUndefined.<string> = o.display;
        var v647 : MayBeUndefined.<string> = o.dominantBaseline;
        var v648 : MayBeUndefined.<string> = o.emptyCells;
        var v649 : MayBeUndefined.<string> = o.fill;
        var v650 : MayBeUndefined.<string> = o.fillOpacity;
        var v651 : MayBeUndefined.<string> = o.fillRule;
        var v652 : MayBeUndefined.<string> = o.filter;
        var v653 : MayBeUndefined.<string> = o.floodColor;
        var v654 : MayBeUndefined.<string> = o.floodOpacity;
        var v655 : MayBeUndefined.<string> = o.font;
        var v656 : MayBeUndefined.<string> = o.fontFamily;
        var v657 : MayBeUndefined.<string> = o.fontSize;
        var v658 : MayBeUndefined.<string> = o.fontSizeAdjust;
        var v659 : MayBeUndefined.<string> = o.fontStretch;
        var v660 : MayBeUndefined.<string> = o.fontStyle;
        var v661 : MayBeUndefined.<string> = o.fontVariant;
        var v662 : MayBeUndefined.<string> = o.fontWeight;
        var v663 : MayBeUndefined.<string> = o.height;
        var v664 : MayBeUndefined.<string> = o.imageRendering;
        var v665 : MayBeUndefined.<string> = o.imeMode;
        var v666 : MayBeUndefined.<string> = o.left;
        var v667 : MayBeUndefined.<string> = o.letterSpacing;
        var v668 : MayBeUndefined.<string> = o.lightingColor;
        var v669 : MayBeUndefined.<string> = o.lineHeight;
        var v670 : MayBeUndefined.<string> = o.listStyle;
        var v671 : MayBeUndefined.<string> = o.listStyleImage;
        var v672 : MayBeUndefined.<string> = o.listStylePosition;
        var v673 : MayBeUndefined.<string> = o.listStyleType;
        var v674 : MayBeUndefined.<string> = o.margin;
        var v675 : MayBeUndefined.<string> = o.marginBottom;
        var v676 : MayBeUndefined.<string> = o.marginLeft;
        var v677 : MayBeUndefined.<string> = o.marginRight;
        var v678 : MayBeUndefined.<string> = o.marginTop;
        var v679 : MayBeUndefined.<string> = o.marker;
        var v680 : MayBeUndefined.<string> = o.markerEnd;
        var v681 : MayBeUndefined.<string> = o.markerMid;
        var v682 : MayBeUndefined.<string> = o.markerOffset;
        var v683 : MayBeUndefined.<string> = o.markerStart;
        var v684 : MayBeUndefined.<string> = o.marks;
        var v685 : MayBeUndefined.<string> = o.mask;
        var v686 : MayBeUndefined.<string> = o.maxHeight;
        var v687 : MayBeUndefined.<string> = o.maxWidth;
        var v688 : MayBeUndefined.<string> = o.minHeight;
        var v689 : MayBeUndefined.<string> = o.minWidth;
        var v690 : MayBeUndefined.<string> = o.opacity;
        var v691 : MayBeUndefined.<string> = o.orphans;
        var v692 : MayBeUndefined.<string> = o.outline;
        var v693 : MayBeUndefined.<string> = o.outlineColor;
        var v694 : MayBeUndefined.<string> = o.outlineOffset;
        var v695 : MayBeUndefined.<string> = o.outlineStyle;
        var v696 : MayBeUndefined.<string> = o.outlineWidth;
        var v697 : MayBeUndefined.<string> = o.overflow;
        var v698 : MayBeUndefined.<string> = o.overflowX;
        var v699 : MayBeUndefined.<string> = o.overflowY;
        var v700 : MayBeUndefined.<string> = o.padding;
        var v701 : MayBeUndefined.<string> = o.paddingBottom;
        var v702 : MayBeUndefined.<string> = o.paddingLeft;
        var v703 : MayBeUndefined.<string> = o.paddingRight;
        var v704 : MayBeUndefined.<string> = o.paddingTop;
        var v705 : MayBeUndefined.<string> = o.page;
        var v706 : MayBeUndefined.<string> = o.pageBreakAfter;
        var v707 : MayBeUndefined.<string> = o.pageBreakBefore;
        var v708 : MayBeUndefined.<string> = o.pageBreakInside;
        var v709 : MayBeUndefined.<string> = o.pointerEvents;
        var v710 : MayBeUndefined.<string> = o.position;
        var v711 : MayBeUndefined.<string> = o.quotes;
        var v712 : MayBeUndefined.<string> = o.resize;
        var v713 : MayBeUndefined.<string> = o.right;
        var v714 : MayBeUndefined.<string> = o.shapeRendering;
        var v715 : MayBeUndefined.<string> = o.size;
        var v716 : MayBeUndefined.<string> = o.stopColor;
        var v717 : MayBeUndefined.<string> = o.stopOpacity;
        var v718 : MayBeUndefined.<string> = o.stroke;
        var v719 : MayBeUndefined.<string> = o.strokeDasharray;
        var v720 : MayBeUndefined.<string> = o.strokeDashoffset;
        var v721 : MayBeUndefined.<string> = o.strokeLinecap;
        var v722 : MayBeUndefined.<string> = o.strokeLinejoin;
        var v723 : MayBeUndefined.<string> = o.strokeMiterlimit;
        var v724 : MayBeUndefined.<string> = o.strokeOpacity;
        var v725 : MayBeUndefined.<string> = o.strokeWidth;
        var v726 : MayBeUndefined.<string> = o.tableLayout;
        var v727 : MayBeUndefined.<string> = o.textAlign;
        var v728 : MayBeUndefined.<string> = o.textAnchor;
        var v729 : MayBeUndefined.<string> = o.textDecoration;
        var v730 : MayBeUndefined.<string> = o.textIndent;
        var v731 : MayBeUndefined.<string> = o.textOverflow;
        var v732 : MayBeUndefined.<string> = o.textRendering;
        var v733 : MayBeUndefined.<string> = o.textShadow;
        var v734 : MayBeUndefined.<string> = o.textTransform;
        var v735 : MayBeUndefined.<string> = o.top;
        var v736 : MayBeUndefined.<string> = o.unicodeBidi;
        var v737 : MayBeUndefined.<string> = o.verticalAlign;
        var v738 : MayBeUndefined.<string> = o.visibility;
        var v739 : MayBeUndefined.<string> = o.whiteSpace;
        var v740 : MayBeUndefined.<string> = o.widows;
        var v741 : MayBeUndefined.<string> = o.width;
        var v742 : MayBeUndefined.<string> = o.wordSpacing;
        var v743 : MayBeUndefined.<string> = o.wordWrap;
        var v744 : MayBeUndefined.<string> = o.zIndex;
    } // CSSStyleDeclaration

    // #64
    function compile_ElementCSSInlineStyle(o : ElementCSSInlineStyle) : void {
        var v1 : CSSStyleDeclaration = o.style;
    } // ElementCSSInlineStyle

    // #65
    function compile_Window(o : Window) : void {
        var f1 : CSSStyleDeclaration = o.getComputedStyle(X.getElement());
        var f2 : CSSStyleDeclaration = o.getComputedStyle(X.getElement(), X.getstring());
        var f3 : MediaQueryList = o.matchMedia(X.getstring());
        var v4 : Screen = o.screen;
        var v5 : int/*long*/ = o.innerWidth;
        var v6 : int/*long*/ = o.innerHeight;
        var v7 : int/*long*/ = o.scrollX;
        var v8 : int/*long*/ = o.pageXOffset;
        var v9 : int/*long*/ = o.scrollY;
        var v10 : int/*long*/ = o.pageYOffset;
        o.scroll(X.getint(), X.getint());
        o.scrollTo(X.getint(), X.getint());
        o.scrollBy(X.getint(), X.getint());
        var v11 : int/*long*/ = o.screenX;
        var v12 : int/*long*/ = o.screenY;
        var v13 : int/*long*/ = o.outerWidth;
        var v14 : int/*long*/ = o.outerHeight;
        var v15 : Window/*WindowProxy*/ = o.window;
        var v16 : Window/*WindowProxy*/ = o.self;
        var v17 : HTMLDocument/*Document*/ = o.document;
        var v18 : string/*DOMString*/ = o.name;
        var v19 : Location = o.location;
        var v20 : History = o.history;
        var v21 : BarProp = o.locationbar;
        var v22 : BarProp = o.menubar;
        var v23 : BarProp = o.personalbar;
        var v24 : BarProp = o.scrollbars;
        var v25 : BarProp = o.statusbar;
        var v26 : BarProp = o.toolbar;
        var v27 : string/*DOMString*/ = o.status;
        o.close();
        o.stop();
        o.focus();
        o.blur();
        var v28 : Window/*WindowProxy*/ = o.frames;
        var v29 : int/*unsigned long*/ = o.length;
        var v30 : Window/*WindowProxy*/ = o.top;
        var v31 : Window/*WindowProxy?*/ = o.opener;
        var v32 : Window/*WindowProxy*/ = o.parent;
        var v33 : Element = o.frameElement;
        var f34 : Window/*WindowProxy*/ = o.open();
        var f35 : Window/*WindowProxy*/ = o.open(X.getstring());
        var f36 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring());
        var f37 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring());
        var f38 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring(), X.getboolean());
        var f39 : MayBeUndefined.<Window/*WindowProxy*/> = o.__native_index_operator__(X.getint());
        var f40 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        var v41 : Navigator = o.navigator;
        var v42 : External = o.external;
        var v43 : ApplicationCache = o.applicationCache;
        o.alert(X.getstring());
        var f44 : boolean = o.confirm(X.getstring());
        var f45 : string/*DOMString?*/ = o.prompt(X.getstring());
        var f46 : string/*DOMString?*/ = o.prompt(X.getstring(), X.getstring());
        o.print();
        var f47 : variant/*any*/ = o.showModalDialog(X.getstring());
        var f48 : variant/*any*/ = o.showModalDialog(X.getstring(), X.getvariant());
        var v49 : function(:Event):void/*Function?*/ = o.onabort;
        var v50 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v51 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v52 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v53 : function(:Event):void/*Function?*/ = o.onblur;
        var v54 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v55 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v56 : function(:Event):void/*Function?*/ = o.onchange;
        var v57 : function(:Event):void/*Function?*/ = o.onclick;
        var v58 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v59 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v60 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v61 : function(:Event):void/*Function?*/ = o.ondrag;
        var v62 : function(:Event):void/*Function?*/ = o.ondragend;
        var v63 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v64 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v65 : function(:Event):void/*Function?*/ = o.ondragover;
        var v66 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v67 : function(:Event):void/*Function?*/ = o.ondrop;
        var v68 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v69 : function(:Event):void/*Function?*/ = o.onemptied;
        var v70 : function(:Event):void/*Function?*/ = o.onended;
        var v71 : function(:Event):void/*Function?*/ = o.onerror;
        var v72 : function(:Event):void/*Function?*/ = o.onfocus;
        var v73 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v74 : function(:Event):void/*Function?*/ = o.oninput;
        var v75 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v76 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v77 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v78 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v79 : function(:Event):void/*Function?*/ = o.onload;
        var v80 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v81 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v82 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v83 : function(:Event):void/*Function?*/ = o.onmessage;
        var v84 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v85 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v86 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v87 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v88 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v89 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v90 : function(:Event):void/*Function?*/ = o.onoffline;
        var v91 : function(:Event):void/*Function?*/ = o.ononline;
        var v92 : function(:Event):void/*Function?*/ = o.onpause;
        var v93 : function(:Event):void/*Function?*/ = o.onplay;
        var v94 : function(:Event):void/*Function?*/ = o.onplaying;
        var v95 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v96 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v97 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v98 : function(:Event):void/*Function?*/ = o.onprogress;
        var v99 : function(:Event):void/*Function?*/ = o.onratechange;
        var v100 : function(:Event):void/*Function?*/ = o.onreset;
        var v101 : function(:Event):void/*Function?*/ = o.onresize;
        var v102 : function(:Event):void/*Function?*/ = o.onscroll;
        var v103 : function(:Event):void/*Function?*/ = o.onseeked;
        var v104 : function(:Event):void/*Function?*/ = o.onseeking;
        var v105 : function(:Event):void/*Function?*/ = o.onselect;
        var v106 : function(:Event):void/*Function?*/ = o.onshow;
        var v107 : function(:Event):void/*Function?*/ = o.onstalled;
        var v108 : function(:Event):void/*Function?*/ = o.onstorage;
        var v109 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v110 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v111 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v112 : function(:Event):void/*Function?*/ = o.onunload;
        var v113 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v114 : function(:Event):void/*Function?*/ = o.onwaiting;
        var f115 : string/*DOMString*/ = o.btoa(X.getstring());
        var f116 : string/*DOMString*/ = o.atob(X.getstring());
        var v117 : Storage = o.sessionStorage;
        var v118 : Storage = o.localStorage;
        var f119 : int/*long*/ = o.setTimeout(X.getfunction___void());
        var f120 : int/*long*/ = o.setTimeout(X.getfunction___void(), X.getint());
        o.clearTimeout(X.getint());
        var f121 : int/*long*/ = o.setInterval(X.getfunction___void());
        var f122 : int/*long*/ = o.setInterval(X.getfunction___void(), X.getint());
        o.clearInterval(X.getint());
        var f123 : int/*long*/ = o.requestAnimationFrame(X.getfunction__number__void());
        o.cancelAnimationFrame(X.getint());
        var f124 : int/*long*/ = o.webkitRequestAnimationFrame(X.getfunction__number__void());
        o.webkitCancelAnimationFrame(X.getint());
        var f125 : int/*long*/ = o.mozRequestAnimationFrame(X.getfunction__number__void());
        o.mozCancelAnimationFrame(X.getint());
    } // Window

    // #66
    function compile_MediaQueryList(o : MediaQueryList) : void {
        var v1 : string/*DOMString*/ = o.media;
        var v2 : boolean = o.matches;
        o.addListener(X.getfunction__MediaQueryList__void());
        o.removeListener(X.getfunction__MediaQueryList__void());
    } // MediaQueryList

    // #67
    function compile_Screen(o : Screen) : void {
        var v1 : int/*unsigned long*/ = o.availWidth;
        var v2 : int/*unsigned long*/ = o.availHeight;
        var v3 : int/*unsigned long*/ = o.width;
        var v4 : int/*unsigned long*/ = o.height;
        var v5 : int/*unsigned long*/ = o.colorDepth;
        var v6 : int/*unsigned long*/ = o.pixelDepth;
    } // Screen

    // #68
    function compile_CaretPosition(o : CaretPosition) : void {
        var v1 : Node = o.offsetNode;
        var v2 : int/*unsigned long*/ = o.offset;
    } // CaretPosition

    // #69
    function compile_HTMLElement(o : HTMLElement) : void {
        var v1 : Element = o.offsetParent;
        var v2 : int/*long*/ = o.offsetTop;
        var v3 : int/*long*/ = o.offsetLeft;
        var v4 : int/*long*/ = o.offsetWidth;
        var v5 : int/*long*/ = o.offsetHeight;
        var v6 : string/*DOMString*/ = o.title;
        var v7 : string/*DOMString*/ = o.lang;
        var v8 : boolean = o.translate;
        var v9 : string/*DOMString*/ = o.dir;
        var v10 : string/*DOMString*/ = o.className;
        var v11 : DOMTokenList = o.classList;
        var v12 : DOMStringMap = o.dataset;
        var v13 : boolean = o.hidden;
        o.click();
        var v14 : int/*long*/ = o.tabIndex;
        o.focus();
        o.blur();
        var v15 : string/*DOMString*/ = o.accessKey;
        var v16 : string/*DOMString*/ = o.accessKeyLabel;
        var v17 : boolean = o.draggable;
        var v18 : DOMSettableTokenList = o.dropzone;
        var v19 : string/*DOMString*/ = o.contentEditable;
        var v20 : boolean = o.isContentEditable;
        var v21 : HTMLMenuElement = o.contextMenu;
        var v22 : boolean = o.spellcheck;
        var v23 : string/*DOMString?*/ = o.commandType;
        var v24 : string/*DOMString?*/ = o.commandLabel;
        var v25 : string/*DOMString?*/ = o.commandIcon;
        var v26 : boolean = o.commandHidden;
        var v27 : boolean = o.commandDisabled;
        var v28 : boolean = o.commandChecked;
        var v29 : CSSStyleDeclaration = o.style;
        var v30 : function(:Event):void/*Function?*/ = o.onabort;
        var v31 : function(:Event):void/*Function?*/ = o.onblur;
        var v32 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v33 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v34 : function(:Event):void/*Function?*/ = o.onchange;
        var v35 : function(:Event):void/*Function?*/ = o.onclick;
        var v36 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v37 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v38 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v39 : function(:Event):void/*Function?*/ = o.ondrag;
        var v40 : function(:Event):void/*Function?*/ = o.ondragend;
        var v41 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v42 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v43 : function(:Event):void/*Function?*/ = o.ondragover;
        var v44 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v45 : function(:Event):void/*Function?*/ = o.ondrop;
        var v46 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v47 : function(:Event):void/*Function?*/ = o.onemptied;
        var v48 : function(:Event):void/*Function?*/ = o.onended;
        var v49 : function(:Event):void/*Function?*/ = o.onerror;
        var v50 : function(:Event):void/*Function?*/ = o.onfocus;
        var v51 : function(:Event):void/*Function?*/ = o.oninput;
        var v52 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v53 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v54 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v55 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v56 : function(:Event):void/*Function?*/ = o.onload;
        var v57 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v58 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v59 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v60 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v61 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v62 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v63 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v64 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v65 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v66 : function(:Event):void/*Function?*/ = o.onpause;
        var v67 : function(:Event):void/*Function?*/ = o.onplay;
        var v68 : function(:Event):void/*Function?*/ = o.onplaying;
        var v69 : function(:Event):void/*Function?*/ = o.onprogress;
        var v70 : function(:Event):void/*Function?*/ = o.onratechange;
        var v71 : function(:Event):void/*Function?*/ = o.onreset;
        var v72 : function(:Event):void/*Function?*/ = o.onscroll;
        var v73 : function(:Event):void/*Function?*/ = o.onseeked;
        var v74 : function(:Event):void/*Function?*/ = o.onseeking;
        var v75 : function(:Event):void/*Function?*/ = o.onselect;
        var v76 : function(:Event):void/*Function?*/ = o.onshow;
        var v77 : function(:Event):void/*Function?*/ = o.onstalled;
        var v78 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v79 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v80 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v81 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v82 : function(:Event):void/*Function?*/ = o.onwaiting;
    } // HTMLElement

    // #70
    function compile_ClientRectList(o : ClientRectList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<ClientRect> = o.__native_index_operator__(X.getint());
        var f3 : MayBeUndefined.<ClientRect> = o.item(X.getint());
    } // ClientRectList

    // #71
    function compile_ClientRect(o : ClientRect) : void {
        var v1 : number/*float*/ = o.top;
        var v2 : number/*float*/ = o.right;
        var v3 : number/*float*/ = o.bottom;
        var v4 : number/*float*/ = o.left;
        var v5 : number/*float*/ = o.width;
        var v6 : number/*float*/ = o.height;
    } // ClientRect

    // #72
    function compile_HTMLAllCollection(o : HTMLAllCollection) : void {
        var f1 : Object/*object?*/ = o.item(X.getstring());
        var f2 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f3 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
        var f4 : HTMLAllCollection = o.tags(X.getstring());
    } // HTMLAllCollection

    // #73
    function compile_HTMLFormControlsCollection(o : HTMLFormControlsCollection) : void {
        var f1 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f2 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
    } // HTMLFormControlsCollection

    // #74
    function compile_RadioNodeList(o : RadioNodeList) : void {
        var v1 : string/*DOMString*/ = o.value;
    } // RadioNodeList

    // #75
    function compile_HTMLOptionsCollection(o : HTMLOptionsCollection) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f3 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getHTMLElement());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getint());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getHTMLElement());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getint());
        o.remove(X.getint());
        var v4 : int/*long*/ = o.selectedIndex;
    } // HTMLOptionsCollection

    // #76
    function compile_DOMStringMap(o : DOMStringMap) : void {
        var f1 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getstring());
    } // DOMStringMap

    // #77
    function compile_Transferable(o : Transferable) : void {
    } // Transferable

    // #78
    function compile_HTMLDocument(o : HTMLDocument) : void {
        var v1 : Location = o.location;
        var v2 : string/*DOMString*/ = o.URL;
        var v3 : string/*DOMString*/ = o.domain;
        var v4 : string/*DOMString*/ = o.referrer;
        var v5 : string/*DOMString*/ = o.cookie;
        var v6 : string/*DOMString*/ = o.lastModified;
        var v7 : string/*DOMString*/ = o.readyState;
        var f8 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        var v9 : string/*DOMString*/ = o.title;
        var v10 : string/*DOMString*/ = o.dir;
        var v11 : HTMLElement = o.body;
        var v12 : HTMLHeadElement = o.head;
        var v13 : HTMLCollection = o.images;
        var v14 : HTMLCollection = o.embeds;
        var v15 : HTMLCollection = o.plugins;
        var v16 : HTMLCollection = o.links;
        var v17 : HTMLCollection = o.forms;
        var v18 : HTMLCollection = o.scripts;
        var f19 : NodeList = o.getElementsByName(X.getstring());
        var f20 : HTMLDocument/*Document*/ = o.open();
        var f21 : HTMLDocument/*Document*/ = o.open(X.getstring());
        var f22 : HTMLDocument/*Document*/ = o.open(X.getstring(), X.getstring());
        var f23 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring());
        var f24 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring(), X.getboolean());
        o.close();
        o.write();
        o.write(X.getstring());
        o.writeln();
        o.writeln(X.getstring());
        var v25 : Window/*WindowProxy?*/ = o.defaultView;
        var v26 : Element = o.activeElement;
        var f27 : boolean = o.hasFocus();
        var v28 : string/*DOMString*/ = o.designMode;
        var f29 : boolean = o.execCommand(X.getstring());
        var f30 : boolean = o.execCommand(X.getstring(), X.getboolean());
        var f31 : boolean = o.execCommand(X.getstring(), X.getboolean(), X.getstring());
        var f32 : boolean = o.queryCommandEnabled(X.getstring());
        var f33 : boolean = o.queryCommandIndeterm(X.getstring());
        var f34 : boolean = o.queryCommandState(X.getstring());
        var f35 : boolean = o.queryCommandSupported(X.getstring());
        var f36 : string/*DOMString*/ = o.queryCommandValue(X.getstring());
        var v37 : HTMLCollection = o.commands;
        var v38 : function(:Event):void/*Function?*/ = o.onabort;
        var v39 : function(:Event):void/*Function?*/ = o.onblur;
        var v40 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v41 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v42 : function(:Event):void/*Function?*/ = o.onchange;
        var v43 : function(:Event):void/*Function?*/ = o.onclick;
        var v44 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v45 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v46 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v47 : function(:Event):void/*Function?*/ = o.ondrag;
        var v48 : function(:Event):void/*Function?*/ = o.ondragend;
        var v49 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v50 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v51 : function(:Event):void/*Function?*/ = o.ondragover;
        var v52 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v53 : function(:Event):void/*Function?*/ = o.ondrop;
        var v54 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v55 : function(:Event):void/*Function?*/ = o.onemptied;
        var v56 : function(:Event):void/*Function?*/ = o.onended;
        var v57 : function(:Event):void/*Function?*/ = o.onerror;
        var v58 : function(:Event):void/*Function?*/ = o.onfocus;
        var v59 : function(:Event):void/*Function?*/ = o.oninput;
        var v60 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v61 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v62 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v63 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v64 : function(:Event):void/*Function?*/ = o.onload;
        var v65 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v66 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v67 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v68 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v69 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v70 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v71 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v72 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v73 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v74 : function(:Event):void/*Function?*/ = o.onpause;
        var v75 : function(:Event):void/*Function?*/ = o.onplay;
        var v76 : function(:Event):void/*Function?*/ = o.onplaying;
        var v77 : function(:Event):void/*Function?*/ = o.onprogress;
        var v78 : function(:Event):void/*Function?*/ = o.onratechange;
        var v79 : function(:Event):void/*Function?*/ = o.onreset;
        var v80 : function(:Event):void/*Function?*/ = o.onscroll;
        var v81 : function(:Event):void/*Function?*/ = o.onseeked;
        var v82 : function(:Event):void/*Function?*/ = o.onseeking;
        var v83 : function(:Event):void/*Function?*/ = o.onselect;
        var v84 : function(:Event):void/*Function?*/ = o.onshow;
        var v85 : function(:Event):void/*Function?*/ = o.onstalled;
        var v86 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v87 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v88 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v89 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v90 : function(:Event):void/*Function?*/ = o.onwaiting;
        var v91 : function(:Event):void/*Function?*/ = o.onreadystatechange;
        var v92 : string/*DOMString*/ = o.fgColor;
        var v93 : string/*DOMString*/ = o.linkColor;
        var v94 : string/*DOMString*/ = o.vlinkColor;
        var v95 : string/*DOMString*/ = o.alinkColor;
        var v96 : string/*DOMString*/ = o.bgColor;
        var v97 : HTMLCollection = o.anchors;
        var v98 : HTMLCollection = o.applets;
        o.clear();
        var v99 : HTMLAllCollection = o.all;
    } // HTMLDocument

    // #79
    function compile_HTMLUnknownElement(o : HTMLUnknownElement) : void {
    } // HTMLUnknownElement

    // #80
    function compile_HTMLHtmlElement(o : HTMLHtmlElement) : void {
        var v1 : string/*DOMString*/ = o.version;
    } // HTMLHtmlElement

    // #81
    function compile_HTMLHeadElement(o : HTMLHeadElement) : void {
    } // HTMLHeadElement

    // #82
    function compile_HTMLTitleElement(o : HTMLTitleElement) : void {
        var v1 : string/*DOMString*/ = o.text;
    } // HTMLTitleElement

    // #83
    function compile_HTMLBaseElement(o : HTMLBaseElement) : void {
        var v1 : string/*DOMString*/ = o.href;
        var v2 : string/*DOMString*/ = o.target;
    } // HTMLBaseElement

    // #84
    function compile_HTMLLinkElement(o : HTMLLinkElement) : void {
        var v1 : boolean = o.disabled;
        var v2 : string/*DOMString*/ = o.href;
        var v3 : string/*DOMString*/ = o.rel;
        var v4 : DOMTokenList = o.relList;
        var v5 : string/*DOMString*/ = o.media;
        var v6 : string/*DOMString*/ = o.hreflang;
        var v7 : string/*DOMString*/ = o.type;
        var v8 : DOMSettableTokenList = o.sizes;
        var v9 : string/*DOMString*/ = o.charset;
        var v10 : string/*DOMString*/ = o.rev;
        var v11 : string/*DOMString*/ = o.target;
        var v12 : StyleSheet = o.sheet;
    } // HTMLLinkElement

    // #85
    function compile_HTMLMetaElement(o : HTMLMetaElement) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : string/*DOMString*/ = o.httpEquiv;
        var v3 : string/*DOMString*/ = o.content;
        var v4 : string/*DOMString*/ = o.scheme;
    } // HTMLMetaElement

    // #86
    function compile_HTMLStyleElement(o : HTMLStyleElement) : void {
        var v1 : boolean = o.disabled;
        var v2 : string/*DOMString*/ = o.media;
        var v3 : string/*DOMString*/ = o.type;
        var v4 : boolean = o.scoped;
        var v5 : StyleSheet = o.sheet;
    } // HTMLStyleElement

    // #87
    function compile_HTMLScriptElement(o : HTMLScriptElement) : void {
        var v1 : string/*DOMString*/ = o.src;
        var v2 : boolean = o.async;
        var v3 : boolean = o.defer;
        var v4 : string/*DOMString*/ = o.type;
        var v5 : string/*DOMString*/ = o.charset;
        var v6 : string/*DOMString*/ = o.text;
        var v7 : string/*DOMString*/ = o.event;
        var v8 : string/*DOMString*/ = o.htmlFor;
    } // HTMLScriptElement

    // #88
    function compile_HTMLBodyElement(o : HTMLBodyElement) : void {
        var v1 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v2 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v3 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v4 : function(:Event):void/*Function?*/ = o.onblur;
        var v5 : function(:Event):void/*Function?*/ = o.onerror;
        var v6 : function(:Event):void/*Function?*/ = o.onfocus;
        var v7 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v8 : function(:Event):void/*Function?*/ = o.onload;
        var v9 : function(:Event):void/*Function?*/ = o.onmessage;
        var v10 : function(:Event):void/*Function?*/ = o.onoffline;
        var v11 : function(:Event):void/*Function?*/ = o.ononline;
        var v12 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v13 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v14 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v15 : function(:Event):void/*Function?*/ = o.onresize;
        var v16 : function(:Event):void/*Function?*/ = o.onscroll;
        var v17 : function(:Event):void/*Function?*/ = o.onstorage;
        var v18 : function(:Event):void/*Function?*/ = o.onunload;
        var v19 : string/*DOMString*/ = o.text;
        var v20 : string/*DOMString*/ = o.link;
        var v21 : string/*DOMString*/ = o.vLink;
        var v22 : string/*DOMString*/ = o.aLink;
        var v23 : string/*DOMString*/ = o.bgColor;
        var v24 : string/*DOMString*/ = o.background;
    } // HTMLBodyElement

    // #89
    function compile_HTMLHeadingElement(o : HTMLHeadingElement) : void {
        var v1 : string/*DOMString*/ = o.align;
    } // HTMLHeadingElement

    // #90
    function compile_HTMLParagraphElement(o : HTMLParagraphElement) : void {
        var v1 : string/*DOMString*/ = o.align;
    } // HTMLParagraphElement

    // #91
    function compile_HTMLHRElement(o : HTMLHRElement) : void {
        var v1 : string/*DOMString*/ = o.align;
        var v2 : string/*DOMString*/ = o.color;
        var v3 : boolean = o.noShade;
        var v4 : string/*DOMString*/ = o.size;
        var v5 : string/*DOMString*/ = o.width;
    } // HTMLHRElement

    // #92
    function compile_HTMLPreElement(o : HTMLPreElement) : void {
        var v1 : int/*long*/ = o.width;
    } // HTMLPreElement

    // #93
    function compile_HTMLQuoteElement(o : HTMLQuoteElement) : void {
        var v1 : string/*DOMString*/ = o.cite;
    } // HTMLQuoteElement

    // #94
    function compile_HTMLOListElement(o : HTMLOListElement) : void {
        var v1 : boolean = o.reversed;
        var v2 : int/*long*/ = o.start;
        var v3 : string/*DOMString*/ = o.type;
        var v4 : boolean = o.compact;
    } // HTMLOListElement

    // #95
    function compile_HTMLUListElement(o : HTMLUListElement) : void {
        var v1 : boolean = o.compact;
        var v2 : string/*DOMString*/ = o.type;
    } // HTMLUListElement

    // #96
    function compile_HTMLLIElement(o : HTMLLIElement) : void {
        var v1 : int/*long*/ = o.value;
        var v2 : string/*DOMString*/ = o.type;
    } // HTMLLIElement

    // #97
    function compile_HTMLDListElement(o : HTMLDListElement) : void {
        var v1 : boolean = o.compact;
    } // HTMLDListElement

    // #98
    function compile_HTMLDivElement(o : HTMLDivElement) : void {
        var v1 : string/*DOMString*/ = o.align;
    } // HTMLDivElement

    // #99
    function compile_HTMLAnchorElement(o : HTMLAnchorElement) : void {
        var v1 : string/*DOMString*/ = o.href;
        var v2 : string/*DOMString*/ = o.target;
        var v3 : string/*DOMString*/ = o.rel;
        var v4 : DOMTokenList = o.relList;
        var v5 : string/*DOMString*/ = o.media;
        var v6 : string/*DOMString*/ = o.hreflang;
        var v7 : string/*DOMString*/ = o.type;
        var v8 : string/*DOMString*/ = o.text;
        var v9 : string/*DOMString*/ = o.protocol;
        var v10 : string/*DOMString*/ = o.host;
        var v11 : string/*DOMString*/ = o.hostname;
        var v12 : string/*DOMString*/ = o.port;
        var v13 : string/*DOMString*/ = o.pathname;
        var v14 : string/*DOMString*/ = o.search;
        var v15 : string/*DOMString*/ = o.hash;
        var v16 : string/*DOMString*/ = o.coords;
        var v17 : string/*DOMString*/ = o.charset;
        var v18 : string/*DOMString*/ = o.name;
        var v19 : string/*DOMString*/ = o.rev;
        var v20 : string/*DOMString*/ = o.shape;
    } // HTMLAnchorElement

    // #100
    function compile_HTMLTimeElement(o : HTMLTimeElement) : void {
        var v1 : string/*DOMString*/ = o.datetime;
    } // HTMLTimeElement

    // #101
    function compile_HTMLSpanElement(o : HTMLSpanElement) : void {
    } // HTMLSpanElement

    // #102
    function compile_HTMLBRElement(o : HTMLBRElement) : void {
        var v1 : string/*DOMString*/ = o.clear;
    } // HTMLBRElement

    // #103
    function compile_HTMLModElement(o : HTMLModElement) : void {
        var v1 : string/*DOMString*/ = o.cite;
        var v2 : string/*DOMString*/ = o.dateTime;
    } // HTMLModElement

    // #104
    function compile_HTMLImageElement(o : HTMLImageElement) : void {
        var v1 : string/*DOMString*/ = o.alt;
        var v2 : string/*DOMString*/ = o.src;
        var v3 : string/*DOMString*/ = o.crossOrigin;
        var v4 : string/*DOMString*/ = o.useMap;
        var v5 : boolean = o.isMap;
        var v6 : int/*unsigned long*/ = o.width;
        var v7 : int/*unsigned long*/ = o.height;
        var v8 : int/*unsigned long*/ = o.naturalWidth;
        var v9 : int/*unsigned long*/ = o.naturalHeight;
        var v10 : boolean = o.complete;
        var v11 : string/*DOMString*/ = o.name;
        var v12 : string/*DOMString*/ = o.align;
        var v13 : int/*unsigned long*/ = o.hspace;
        var v14 : int/*unsigned long*/ = o.vspace;
        var v15 : string/*DOMString*/ = o.longDesc;
        var v16 : string/*DOMString*/ = o.border;
    } // HTMLImageElement

    // #105
    function compile_HTMLIFrameElement(o : HTMLIFrameElement) : void {
        var v1 : string/*DOMString*/ = o.src;
        var v2 : string/*DOMString*/ = o.srcdoc;
        var v3 : string/*DOMString*/ = o.name;
        var v4 : DOMSettableTokenList = o.sandbox;
        var v5 : boolean = o.seamless;
        var v6 : string/*DOMString*/ = o.width;
        var v7 : string/*DOMString*/ = o.height;
        var v8 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v9 : Window/*WindowProxy?*/ = o.contentWindow;
        var v10 : string/*DOMString*/ = o.align;
        var v11 : string/*DOMString*/ = o.scrolling;
        var v12 : string/*DOMString*/ = o.frameBorder;
        var v13 : string/*DOMString*/ = o.longDesc;
        var v14 : string/*DOMString*/ = o.marginHeight;
        var v15 : string/*DOMString*/ = o.marginWidth;
    } // HTMLIFrameElement

    // #106
    function compile_HTMLEmbedElement(o : HTMLEmbedElement) : void {
        var v1 : string/*DOMString*/ = o.src;
        var v2 : string/*DOMString*/ = o.type;
        var v3 : string/*DOMString*/ = o.width;
        var v4 : string/*DOMString*/ = o.height;
        var v5 : string/*DOMString*/ = o.align;
        var v6 : string/*DOMString*/ = o.name;
    } // HTMLEmbedElement

    // #107
    function compile_HTMLObjectElement(o : HTMLObjectElement) : void {
        var v1 : string/*DOMString*/ = o.data;
        var v2 : string/*DOMString*/ = o.type;
        var v3 : boolean = o.typeMustMatch;
        var v4 : string/*DOMString*/ = o.name;
        var v5 : string/*DOMString*/ = o.useMap;
        var v6 : HTMLFormElement = o.form;
        var v7 : string/*DOMString*/ = o.width;
        var v8 : string/*DOMString*/ = o.height;
        var v9 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v10 : Window/*WindowProxy?*/ = o.contentWindow;
        var v11 : boolean = o.willValidate;
        var v12 : ValidityState = o.validity;
        var v13 : string/*DOMString*/ = o.validationMessage;
        var f14 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v15 : string/*DOMString*/ = o.align;
        var v16 : string/*DOMString*/ = o.archive;
        var v17 : string/*DOMString*/ = o.code;
        var v18 : boolean = o.declare;
        var v19 : int/*unsigned long*/ = o.hspace;
        var v20 : string/*DOMString*/ = o.standby;
        var v21 : int/*unsigned long*/ = o.vspace;
        var v22 : string/*DOMString*/ = o.codeBase;
        var v23 : string/*DOMString*/ = o.codeType;
        var v24 : string/*DOMString*/ = o.border;
    } // HTMLObjectElement

    // #108
    function compile_HTMLParamElement(o : HTMLParamElement) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : string/*DOMString*/ = o.value;
        var v3 : string/*DOMString*/ = o.type;
        var v4 : string/*DOMString*/ = o.valueType;
    } // HTMLParamElement

    // #109
    function compile_HTMLVideoElement(o : HTMLVideoElement) : void {
        var v1 : int/*unsigned long*/ = o.width;
        var v2 : int/*unsigned long*/ = o.height;
        var v3 : int/*unsigned long*/ = o.videoWidth;
        var v4 : int/*unsigned long*/ = o.videoHeight;
        var v5 : string/*DOMString*/ = o.poster;
    } // HTMLVideoElement

    // #110
    function compile_HTMLAudioElement(o : HTMLAudioElement) : void {
    } // HTMLAudioElement

    // #111
    function compile_HTMLSourceElement(o : HTMLSourceElement) : void {
        var v1 : string/*DOMString*/ = o.src;
        var v2 : string/*DOMString*/ = o.type;
        var v3 : string/*DOMString*/ = o.media;
    } // HTMLSourceElement

    // #112
    function compile_HTMLTrackElement(o : HTMLTrackElement) : void {
        var v1 : string/*DOMString*/ = o.kind;
        var v2 : string/*DOMString*/ = o.src;
        var v3 : string/*DOMString*/ = o.srclang;
        var v4 : string/*DOMString*/ = o.label;
        var v5 : boolean = o.default;
        var v6 : int/*unsigned short*/ = HTMLTrackElement.NONE;
        var v7 : int/*unsigned short*/ = o.NONE;
        var v8 : int/*unsigned short*/ = HTMLTrackElement.LOADING;
        var v9 : int/*unsigned short*/ = o.LOADING;
        var v10 : int/*unsigned short*/ = HTMLTrackElement.LOADED;
        var v11 : int/*unsigned short*/ = o.LOADED;
        var v12 : int/*unsigned short*/ = HTMLTrackElement.ERROR;
        var v13 : int/*unsigned short*/ = o.ERROR;
        var v14 : int/*unsigned short*/ = o.readyState;
        var v15 : TextTrack = o.track;
    } // HTMLTrackElement

    // #113
    function compile_HTMLMediaElement(o : HTMLMediaElement) : void {
        var v1 : MediaError = o.error;
        var v2 : string/*DOMString*/ = o.src;
        var v3 : string/*DOMString*/ = o.currentSrc;
        var v4 : string/*DOMString*/ = o.crossOrigin;
        var v5 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_EMPTY;
        var v6 : int/*unsigned short*/ = o.NETWORK_EMPTY;
        var v7 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_IDLE;
        var v8 : int/*unsigned short*/ = o.NETWORK_IDLE;
        var v9 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_LOADING;
        var v10 : int/*unsigned short*/ = o.NETWORK_LOADING;
        var v11 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_NO_SOURCE;
        var v12 : int/*unsigned short*/ = o.NETWORK_NO_SOURCE;
        var v13 : int/*unsigned short*/ = o.networkState;
        var v14 : string/*DOMString*/ = o.preload;
        var v15 : TimeRanges = o.buffered;
        o.load();
        var f16 : string/*DOMString*/ = o.canPlayType(X.getstring());
        var v17 : int/*unsigned short*/ = HTMLMediaElement.HAVE_NOTHING;
        var v18 : int/*unsigned short*/ = o.HAVE_NOTHING;
        var v19 : int/*unsigned short*/ = HTMLMediaElement.HAVE_METADATA;
        var v20 : int/*unsigned short*/ = o.HAVE_METADATA;
        var v21 : int/*unsigned short*/ = HTMLMediaElement.HAVE_CURRENT_DATA;
        var v22 : int/*unsigned short*/ = o.HAVE_CURRENT_DATA;
        var v23 : int/*unsigned short*/ = HTMLMediaElement.HAVE_FUTURE_DATA;
        var v24 : int/*unsigned short*/ = o.HAVE_FUTURE_DATA;
        var v25 : int/*unsigned short*/ = HTMLMediaElement.HAVE_ENOUGH_DATA;
        var v26 : int/*unsigned short*/ = o.HAVE_ENOUGH_DATA;
        var v27 : int/*unsigned short*/ = o.readyState;
        var v28 : boolean = o.seeking;
        var v29 : number/*double*/ = o.currentTime;
        var v30 : number/*double*/ = o.initialTime;
        var v31 : number/*double*/ = o.duration;
        var v32 : Date = o.startOffsetTime;
        var v33 : boolean = o.paused;
        var v34 : number/*double*/ = o.defaultPlaybackRate;
        var v35 : number/*double*/ = o.playbackRate;
        var v36 : TimeRanges = o.played;
        var v37 : TimeRanges = o.seekable;
        var v38 : boolean = o.ended;
        var v39 : boolean = o.autoplay;
        var v40 : boolean = o.loop;
        o.play();
        o.pause();
        var v41 : string/*DOMString*/ = o.mediaGroup;
        var v42 : MediaController = o.controller;
        var v43 : boolean = o.controls;
        var v44 : number/*double*/ = o.volume;
        var v45 : boolean = o.muted;
        var v46 : boolean = o.defaultMuted;
        var v47 : AudioTrackList = o.audioTracks;
        var v48 : VideoTrackList = o.videoTracks;
        var v49 : TextTrackList = o.textTracks;
        var f50 : TextTrack = o.addTextTrack(X.getstring());
        var f51 : TextTrack = o.addTextTrack(X.getstring(), X.getstring());
        var f52 : TextTrack = o.addTextTrack(X.getstring(), X.getstring(), X.getstring());
    } // HTMLMediaElement

    // #114
    function compile_MediaError(o : MediaError) : void {
        var v1 : int/*unsigned short*/ = MediaError.MEDIA_ERR_ABORTED;
        var v2 : int/*unsigned short*/ = o.MEDIA_ERR_ABORTED;
        var v3 : int/*unsigned short*/ = MediaError.MEDIA_ERR_NETWORK;
        var v4 : int/*unsigned short*/ = o.MEDIA_ERR_NETWORK;
        var v5 : int/*unsigned short*/ = MediaError.MEDIA_ERR_DECODE;
        var v6 : int/*unsigned short*/ = o.MEDIA_ERR_DECODE;
        var v7 : int/*unsigned short*/ = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;
        var v8 : int/*unsigned short*/ = o.MEDIA_ERR_SRC_NOT_SUPPORTED;
        var v9 : int/*unsigned short*/ = o.code;
    } // MediaError

    // #115
    function compile_AudioTrackList(o : AudioTrackList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<AudioTrack> = o.__native_index_operator__(X.getint());
        var f3 : AudioTrack = o.getTrackById(X.getstring());
        var v4 : function(:Event):void/*Function?*/ = o.onchange;
        var v5 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // AudioTrackList

    // #116
    function compile_AudioTrack(o : AudioTrack) : void {
        var v1 : string/*DOMString*/ = o.id;
        var v2 : string/*DOMString*/ = o.kind;
        var v3 : string/*DOMString*/ = o.label;
        var v4 : string/*DOMString*/ = o.language;
        var v5 : boolean = o.enabled;
    } // AudioTrack

    // #117
    function compile_VideoTrackList(o : VideoTrackList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<VideoTrack> = o.__native_index_operator__(X.getint());
        var f3 : VideoTrack = o.getTrackById(X.getstring());
        var v4 : int/*long*/ = o.selectedIndex;
        var v5 : function(:Event):void/*Function?*/ = o.onchange;
        var v6 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // VideoTrackList

    // #118
    function compile_VideoTrack(o : VideoTrack) : void {
        var v1 : string/*DOMString*/ = o.id;
        var v2 : string/*DOMString*/ = o.kind;
        var v3 : string/*DOMString*/ = o.label;
        var v4 : string/*DOMString*/ = o.language;
        var v5 : boolean = o.selected;
    } // VideoTrack

    // #119
    function compile_MediaController(o : MediaController) : void {
        var v1 : TimeRanges = o.buffered;
        var v2 : TimeRanges = o.seekable;
        var v3 : number/*double*/ = o.duration;
        var v4 : number/*double*/ = o.currentTime;
        var v5 : boolean = o.paused;
        var v6 : TimeRanges = o.played;
        o.play();
        o.pause();
        var v7 : number/*double*/ = o.defaultPlaybackRate;
        var v8 : number/*double*/ = o.playbackRate;
        var v9 : number/*double*/ = o.volume;
        var v10 : boolean = o.muted;
        var v11 : function(:Event):void/*Function?*/ = o.onemptied;
        var v12 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v13 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v14 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v15 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v16 : function(:Event):void/*Function?*/ = o.onplaying;
        var v17 : function(:Event):void/*Function?*/ = o.onended;
        var v18 : function(:Event):void/*Function?*/ = o.onwaiting;
        var v19 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v20 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v21 : function(:Event):void/*Function?*/ = o.onplay;
        var v22 : function(:Event):void/*Function?*/ = o.onpause;
        var v23 : function(:Event):void/*Function?*/ = o.onratechange;
        var v24 : function(:Event):void/*Function?*/ = o.onvolumechange;
    } // MediaController

    // #120
    function compile_TextTrackList(o : TextTrackList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<TextTrack> = o.__native_index_operator__(X.getint());
        var v3 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // TextTrackList

    // #121
    function compile_TextTrack(o : TextTrack) : void {
        var v1 : string/*DOMString*/ = o.kind;
        var v2 : string/*DOMString*/ = o.label;
        var v3 : string/*DOMString*/ = o.language;
        var v4 : int/*unsigned short*/ = TextTrack.DISABLED;
        var v5 : int/*unsigned short*/ = o.DISABLED;
        var v6 : int/*unsigned short*/ = TextTrack.HIDDEN;
        var v7 : int/*unsigned short*/ = o.HIDDEN;
        var v8 : int/*unsigned short*/ = TextTrack.SHOWING;
        var v9 : int/*unsigned short*/ = o.SHOWING;
        var v10 : int/*unsigned short*/ = o.mode;
        var v11 : TextTrackCueList = o.cues;
        var v12 : TextTrackCueList = o.activeCues;
        o.addCue(X.getTextTrackCue());
        o.removeCue(X.getTextTrackCue());
        var v13 : function(:Event):void/*Function?*/ = o.oncuechange;
    } // TextTrack

    // #122
    function compile_TextTrackCueList(o : TextTrackCueList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<TextTrackCue> = o.__native_index_operator__(X.getint());
        var f3 : TextTrackCue = o.getCueById(X.getstring());
    } // TextTrackCueList

    // #123
    function compile_TextTrackCue(o : TextTrackCue) : void {
        var v1 : TextTrack = o.track;
        var v2 : string/*DOMString*/ = o.id;
        var v3 : number/*double*/ = o.startTime;
        var v4 : number/*double*/ = o.endTime;
        var v5 : boolean = o.pauseOnExit;
        var v6 : string/*DOMString*/ = o.vertical;
        var v7 : boolean = o.snapToLines;
        var v8 : int/*long*/ = o.line;
        var v9 : int/*long*/ = o.position;
        var v10 : int/*long*/ = o.size;
        var v11 : string/*DOMString*/ = o.align;
        var v12 : string/*DOMString*/ = o.text;
        var f13 : DocumentFragment = o.getCueAsHTML();
        var v14 : function(:Event):void/*Function?*/ = o.onenter;
        var v15 : function(:Event):void/*Function?*/ = o.onexit;
    } // TextTrackCue

    // #124
    function compile_TimeRanges(o : TimeRanges) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : number/*double*/ = o.start(X.getint());
        var f3 : number/*double*/ = o.end(X.getint());
    } // TimeRanges

    // #125
    function compile_TrackEvent(o : TrackEvent) : void {
        var v1 : Object/*object?*/ = o.track;
    } // TrackEvent

    // #126
    function compile_TrackEventInit(o : TrackEventInit) : void {
        var v1 : Object/*object?*/ = o.track;
    } // TrackEventInit

    // #127
    function compile_HTMLCanvasElement(o : HTMLCanvasElement) : void {
        var v1 : int/*unsigned long*/ = o.width;
        var v2 : int/*unsigned long*/ = o.height;
        var f3 : string/*DOMString*/ = o.toDataURL();
        var f4 : string/*DOMString*/ = o.toDataURL(X.getstring());
        var f5 : string/*DOMString*/ = o.toDataURL(X.getstring(), X.getvariant());
        o.toBlob(X.getfunction__File__void());
        o.toBlob(X.getfunction__File__void(), X.getstring());
        o.toBlob(X.getfunction__File__void(), X.getstring(), X.getvariant());
        var f6 : Object/*object?*/ = o.getContext(X.getstring());
        var f7 : Object/*object?*/ = o.getContext(X.getstring(), X.getvariant());
    } // HTMLCanvasElement

    // #128
    function compile_HTMLMapElement(o : HTMLMapElement) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : HTMLCollection = o.areas;
        var v3 : HTMLCollection = o.images;
    } // HTMLMapElement

    // #129
    function compile_HTMLAreaElement(o : HTMLAreaElement) : void {
        var v1 : string/*DOMString*/ = o.alt;
        var v2 : string/*DOMString*/ = o.coords;
        var v3 : string/*DOMString*/ = o.shape;
        var v4 : string/*DOMString*/ = o.href;
        var v5 : string/*DOMString*/ = o.target;
        var v6 : string/*DOMString*/ = o.rel;
        var v7 : DOMTokenList = o.relList;
        var v8 : string/*DOMString*/ = o.media;
        var v9 : string/*DOMString*/ = o.hreflang;
        var v10 : string/*DOMString*/ = o.type;
        var v11 : string/*DOMString*/ = o.protocol;
        var v12 : string/*DOMString*/ = o.host;
        var v13 : string/*DOMString*/ = o.hostname;
        var v14 : string/*DOMString*/ = o.port;
        var v15 : string/*DOMString*/ = o.pathname;
        var v16 : string/*DOMString*/ = o.search;
        var v17 : string/*DOMString*/ = o.hash;
        var v18 : boolean = o.noHref;
    } // HTMLAreaElement

    // #130
    function compile_HTMLTableElement(o : HTMLTableElement) : void {
        var v1 : HTMLTableCaptionElement = o.caption;
        var f2 : HTMLElement = o.createCaption();
        o.deleteCaption();
        var v3 : HTMLTableSectionElement = o.tHead;
        var f4 : HTMLElement = o.createTHead();
        o.deleteTHead();
        var v5 : HTMLTableSectionElement = o.tFoot;
        var f6 : HTMLElement = o.createTFoot();
        o.deleteTFoot();
        var v7 : HTMLCollection = o.tBodies;
        var f8 : HTMLElement = o.createTBody();
        var v9 : HTMLCollection = o.rows;
        var f10 : HTMLElement = o.insertRow();
        var f11 : HTMLElement = o.insertRow(X.getint());
        o.deleteRow(X.getint());
        var v12 : string/*DOMString*/ = o.border;
        var v13 : string/*DOMString*/ = o.align;
        var v14 : string/*DOMString*/ = o.frame;
        var v15 : string/*DOMString*/ = o.rules;
        var v16 : string/*DOMString*/ = o.summary;
        var v17 : string/*DOMString*/ = o.width;
        var v18 : string/*DOMString*/ = o.bgColor;
        var v19 : string/*DOMString*/ = o.cellPadding;
        var v20 : string/*DOMString*/ = o.cellSpacing;
    } // HTMLTableElement

    // #131
    function compile_HTMLTableCaptionElement(o : HTMLTableCaptionElement) : void {
        var v1 : string/*DOMString*/ = o.align;
    } // HTMLTableCaptionElement

    // #132
    function compile_HTMLTableColElement(o : HTMLTableColElement) : void {
        var v1 : int/*unsigned long*/ = o.span;
        var v2 : string/*DOMString*/ = o.align;
        var v3 : string/*DOMString*/ = o.ch;
        var v4 : string/*DOMString*/ = o.chOff;
        var v5 : string/*DOMString*/ = o.vAlign;
        var v6 : string/*DOMString*/ = o.width;
    } // HTMLTableColElement

    // #133
    function compile_HTMLTableSectionElement(o : HTMLTableSectionElement) : void {
        var v1 : HTMLCollection = o.rows;
        var f2 : HTMLElement = o.insertRow();
        var f3 : HTMLElement = o.insertRow(X.getint());
        o.deleteRow(X.getint());
        var v4 : string/*DOMString*/ = o.align;
        var v5 : string/*DOMString*/ = o.ch;
        var v6 : string/*DOMString*/ = o.chOff;
        var v7 : string/*DOMString*/ = o.vAlign;
    } // HTMLTableSectionElement

    // #134
    function compile_HTMLTableRowElement(o : HTMLTableRowElement) : void {
        var v1 : int/*long*/ = o.rowIndex;
        var v2 : int/*long*/ = o.sectionRowIndex;
        var v3 : HTMLCollection = o.cells;
        var f4 : HTMLElement = o.insertCell();
        var f5 : HTMLElement = o.insertCell(X.getint());
        o.deleteCell(X.getint());
        var v6 : string/*DOMString*/ = o.align;
        var v7 : string/*DOMString*/ = o.ch;
        var v8 : string/*DOMString*/ = o.chOff;
        var v9 : string/*DOMString*/ = o.vAlign;
        var v10 : string/*DOMString*/ = o.bgColor;
    } // HTMLTableRowElement

    // #135
    function compile_HTMLTableDataCellElement(o : HTMLTableDataCellElement) : void {
    } // HTMLTableDataCellElement

    // #136
    function compile_HTMLTableHeaderCellElement(o : HTMLTableHeaderCellElement) : void {
        var v1 : string/*DOMString*/ = o.scope;
    } // HTMLTableHeaderCellElement

    // #137
    function compile_HTMLTableCellElement(o : HTMLTableCellElement) : void {
        var v1 : int/*unsigned long*/ = o.colSpan;
        var v2 : int/*unsigned long*/ = o.rowSpan;
        var v3 : DOMSettableTokenList = o.headers;
        var v4 : int/*long*/ = o.cellIndex;
        var v5 : string/*DOMString*/ = o.abbr;
        var v6 : string/*DOMString*/ = o.align;
        var v7 : string/*DOMString*/ = o.axis;
        var v8 : string/*DOMString*/ = o.height;
        var v9 : string/*DOMString*/ = o.width;
        var v10 : string/*DOMString*/ = o.ch;
        var v11 : string/*DOMString*/ = o.chOff;
        var v12 : boolean = o.noWrap;
        var v13 : string/*DOMString*/ = o.vAlign;
        var v14 : string/*DOMString*/ = o.bgColor;
    } // HTMLTableCellElement

    // #138
    function compile_HTMLFormElement(o : HTMLFormElement) : void {
        var v1 : string/*DOMString*/ = o.acceptCharset;
        var v2 : string/*DOMString*/ = o.action;
        var v3 : string/*DOMString*/ = o.autocomplete;
        var v4 : string/*DOMString*/ = o.enctype;
        var v5 : string/*DOMString*/ = o.encoding;
        var v6 : string/*DOMString*/ = o.method;
        var v7 : string/*DOMString*/ = o.name;
        var v8 : boolean = o.noValidate;
        var v9 : string/*DOMString*/ = o.target;
        var v10 : HTMLFormControlsCollection = o.elements;
        var v11 : int/*long*/ = o.length;
        var f12 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f13 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        o.submit();
        o.reset();
        var f14 : boolean = o.checkValidity();
    } // HTMLFormElement

    // #139
    function compile_HTMLFieldSetElement(o : HTMLFieldSetElement) : void {
        var v1 : boolean = o.disabled;
        var v2 : HTMLFormElement = o.form;
        var v3 : string/*DOMString*/ = o.name;
        var v4 : string/*DOMString*/ = o.type;
        var v5 : HTMLFormControlsCollection = o.elements;
        var v6 : boolean = o.willValidate;
        var v7 : ValidityState = o.validity;
        var v8 : string/*DOMString*/ = o.validationMessage;
        var f9 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
    } // HTMLFieldSetElement

    // #140
    function compile_HTMLLegendElement(o : HTMLLegendElement) : void {
        var v1 : HTMLFormElement = o.form;
        var v2 : string/*DOMString*/ = o.align;
    } // HTMLLegendElement

    // #141
    function compile_HTMLLabelElement(o : HTMLLabelElement) : void {
        var v1 : HTMLFormElement = o.form;
        var v2 : string/*DOMString*/ = o.htmlFor;
        var v3 : HTMLElement = o.control;
    } // HTMLLabelElement

    // #142
    function compile_HTMLInputElement(o : HTMLInputElement) : void {
        var v1 : string/*DOMString*/ = o.accept;
        var v2 : string/*DOMString*/ = o.alt;
        var v3 : string/*DOMString*/ = o.autocomplete;
        var v4 : boolean = o.autofocus;
        var v5 : boolean = o.defaultChecked;
        var v6 : boolean = o.checked;
        var v7 : string/*DOMString*/ = o.dirName;
        var v8 : boolean = o.disabled;
        var v9 : HTMLFormElement = o.form;
        var v10 : FileList = o.files;
        var v11 : string/*DOMString*/ = o.formAction;
        var v12 : string/*DOMString*/ = o.formEnctype;
        var v13 : string/*DOMString*/ = o.formMethod;
        var v14 : boolean = o.formNoValidate;
        var v15 : string/*DOMString*/ = o.formTarget;
        var v16 : int/*unsigned long*/ = o.height;
        var v17 : boolean = o.indeterminate;
        var v18 : HTMLElement = o.list;
        var v19 : string/*DOMString*/ = o.max;
        var v20 : int/*long*/ = o.maxLength;
        var v21 : string/*DOMString*/ = o.min;
        var v22 : boolean = o.multiple;
        var v23 : string/*DOMString*/ = o.name;
        var v24 : string/*DOMString*/ = o.pattern;
        var v25 : string/*DOMString*/ = o.placeholder;
        var v26 : boolean = o.readOnly;
        var v27 : boolean = o.required;
        var v28 : int/*unsigned long*/ = o.size;
        var v29 : string/*DOMString*/ = o.src;
        var v30 : string/*DOMString*/ = o.step;
        var v31 : string/*DOMString*/ = o.type;
        var v32 : string/*DOMString*/ = o.defaultValue;
        var v33 : string/*DOMString*/ = o.value;
        var v34 : Date = o.valueAsDate;
        var v35 : number/*double*/ = o.valueAsNumber;
        var v36 : int/*unsigned long*/ = o.width;
        o.stepUp();
        o.stepUp(X.getint());
        o.stepDown();
        o.stepDown(X.getint());
        var v37 : boolean = o.willValidate;
        var v38 : ValidityState = o.validity;
        var v39 : string/*DOMString*/ = o.validationMessage;
        var f40 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v41 : NodeList = o.labels;
        o.select();
        var v42 : int/*unsigned long*/ = o.selectionStart;
        var v43 : int/*unsigned long*/ = o.selectionEnd;
        var v44 : string/*DOMString*/ = o.selectionDirection;
        o.setSelectionRange(X.getint(), X.getint());
        o.setSelectionRange(X.getint(), X.getint(), X.getstring());
        var v45 : string/*DOMString*/ = o.align;
        var v46 : string/*DOMString*/ = o.useMap;
    } // HTMLInputElement

    // #143
    function compile_HTMLButtonElement(o : HTMLButtonElement) : void {
        var v1 : boolean = o.autofocus;
        var v2 : boolean = o.disabled;
        var v3 : HTMLFormElement = o.form;
        var v4 : string/*DOMString*/ = o.formAction;
        var v5 : string/*DOMString*/ = o.formEnctype;
        var v6 : string/*DOMString*/ = o.formMethod;
        var v7 : boolean = o.formNoValidate;
        var v8 : string/*DOMString*/ = o.formTarget;
        var v9 : string/*DOMString*/ = o.name;
        var v10 : string/*DOMString*/ = o.type;
        var v11 : string/*DOMString*/ = o.value;
        var v12 : boolean = o.willValidate;
        var v13 : ValidityState = o.validity;
        var v14 : string/*DOMString*/ = o.validationMessage;
        var f15 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v16 : NodeList = o.labels;
    } // HTMLButtonElement

    // #144
    function compile_HTMLSelectElement(o : HTMLSelectElement) : void {
        var v1 : boolean = o.autofocus;
        var v2 : boolean = o.disabled;
        var v3 : HTMLFormElement = o.form;
        var v4 : boolean = o.multiple;
        var v5 : string/*DOMString*/ = o.name;
        var v6 : boolean = o.required;
        var v7 : int/*unsigned long*/ = o.size;
        var v8 : string/*DOMString*/ = o.type;
        var v9 : HTMLOptionsCollection = o.options;
        var v10 : int/*unsigned long*/ = o.length;
        var f11 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f12 : MayBeUndefined.<Element> = o.item(X.getint());
        var f13 : Object/*object*/ = o.namedItem(X.getstring());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getHTMLElement());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getint());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getHTMLElement());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getint());
        o.remove(X.getint());
        var v14 : HTMLCollection = o.selectedOptions;
        var v15 : int/*long*/ = o.selectedIndex;
        var v16 : string/*DOMString*/ = o.value;
        var v17 : boolean = o.willValidate;
        var v18 : ValidityState = o.validity;
        var v19 : string/*DOMString*/ = o.validationMessage;
        var f20 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v21 : NodeList = o.labels;
    } // HTMLSelectElement

    // #145
    function compile_HTMLDataListElement(o : HTMLDataListElement) : void {
        var v1 : HTMLCollection = o.options;
    } // HTMLDataListElement

    // #146
    function compile_HTMLOptGroupElement(o : HTMLOptGroupElement) : void {
        var v1 : boolean = o.disabled;
        var v2 : string/*DOMString*/ = o.label;
    } // HTMLOptGroupElement

    // #147
    function compile_HTMLOptionElement(o : HTMLOptionElement) : void {
        var v1 : boolean = o.disabled;
        var v2 : HTMLFormElement = o.form;
        var v3 : string/*DOMString*/ = o.label;
        var v4 : boolean = o.defaultSelected;
        var v5 : boolean = o.selected;
        var v6 : string/*DOMString*/ = o.value;
        var v7 : string/*DOMString*/ = o.text;
        var v8 : int/*long*/ = o.index;
    } // HTMLOptionElement

    // #148
    function compile_HTMLTextAreaElement(o : HTMLTextAreaElement) : void {
        var v1 : boolean = o.autofocus;
        var v2 : int/*unsigned long*/ = o.cols;
        var v3 : string/*DOMString*/ = o.dirName;
        var v4 : boolean = o.disabled;
        var v5 : HTMLFormElement = o.form;
        var v6 : int/*long*/ = o.maxLength;
        var v7 : string/*DOMString*/ = o.name;
        var v8 : string/*DOMString*/ = o.placeholder;
        var v9 : boolean = o.readOnly;
        var v10 : boolean = o.required;
        var v11 : int/*unsigned long*/ = o.rows;
        var v12 : string/*DOMString*/ = o.wrap;
        var v13 : string/*DOMString*/ = o.type;
        var v14 : string/*DOMString*/ = o.defaultValue;
        var v15 : string/*DOMString*/ = o.value;
        var v16 : int/*unsigned long*/ = o.textLength;
        var v17 : boolean = o.willValidate;
        var v18 : ValidityState = o.validity;
        var v19 : string/*DOMString*/ = o.validationMessage;
        var f20 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v21 : NodeList = o.labels;
        o.select();
        var v22 : int/*unsigned long*/ = o.selectionStart;
        var v23 : int/*unsigned long*/ = o.selectionEnd;
        var v24 : string/*DOMString*/ = o.selectionDirection;
        o.setSelectionRange(X.getint(), X.getint());
        o.setSelectionRange(X.getint(), X.getint(), X.getstring());
    } // HTMLTextAreaElement

    // #149
    function compile_HTMLKeygenElement(o : HTMLKeygenElement) : void {
        var v1 : boolean = o.autofocus;
        var v2 : string/*DOMString*/ = o.challenge;
        var v3 : boolean = o.disabled;
        var v4 : HTMLFormElement = o.form;
        var v5 : string/*DOMString*/ = o.keytype;
        var v6 : string/*DOMString*/ = o.name;
        var v7 : string/*DOMString*/ = o.type;
        var v8 : boolean = o.willValidate;
        var v9 : ValidityState = o.validity;
        var v10 : string/*DOMString*/ = o.validationMessage;
        var f11 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v12 : NodeList = o.labels;
    } // HTMLKeygenElement

    // #150
    function compile_HTMLOutputElement(o : HTMLOutputElement) : void {
        var v1 : DOMSettableTokenList = o.htmlFor;
        var v2 : HTMLFormElement = o.form;
        var v3 : string/*DOMString*/ = o.name;
        var v4 : string/*DOMString*/ = o.type;
        var v5 : string/*DOMString*/ = o.defaultValue;
        var v6 : string/*DOMString*/ = o.value;
        var v7 : boolean = o.willValidate;
        var v8 : ValidityState = o.validity;
        var v9 : string/*DOMString*/ = o.validationMessage;
        var f10 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v11 : NodeList = o.labels;
    } // HTMLOutputElement

    // #151
    function compile_HTMLProgressElement(o : HTMLProgressElement) : void {
        var v1 : number/*double*/ = o.value;
        var v2 : number/*double*/ = o.max;
        var v3 : number/*double*/ = o.position;
        var v4 : NodeList = o.labels;
    } // HTMLProgressElement

    // #152
    function compile_HTMLMeterElement(o : HTMLMeterElement) : void {
        var v1 : number/*double*/ = o.value;
        var v2 : number/*double*/ = o.min;
        var v3 : number/*double*/ = o.max;
        var v4 : number/*double*/ = o.low;
        var v5 : number/*double*/ = o.high;
        var v6 : number/*double*/ = o.optimum;
        var v7 : NodeList = o.labels;
    } // HTMLMeterElement

    // #153
    function compile_ValidityState(o : ValidityState) : void {
        var v1 : boolean = o.valueMissing;
        var v2 : boolean = o.typeMismatch;
        var v3 : boolean = o.patternMismatch;
        var v4 : boolean = o.tooLong;
        var v5 : boolean = o.rangeUnderflow;
        var v6 : boolean = o.rangeOverflow;
        var v7 : boolean = o.stepMismatch;
        var v8 : boolean = o.customError;
        var v9 : boolean = o.valid;
    } // ValidityState

    // #154
    function compile_HTMLDetailsElement(o : HTMLDetailsElement) : void {
        var v1 : boolean = o.open;
    } // HTMLDetailsElement

    // #155
    function compile_HTMLCommandElement(o : HTMLCommandElement) : void {
        var v1 : string/*DOMString*/ = o.type;
        var v2 : string/*DOMString*/ = o.label;
        var v3 : string/*DOMString*/ = o.icon;
        var v4 : boolean = o.disabled;
        var v5 : boolean = o.checked;
        var v6 : string/*DOMString*/ = o.radiogroup;
        var v7 : HTMLElement = o.command;
    } // HTMLCommandElement

    // #156
    function compile_HTMLMenuElement(o : HTMLMenuElement) : void {
        var v1 : string/*DOMString*/ = o.type;
        var v2 : string/*DOMString*/ = o.label;
        var v3 : boolean = o.compact;
    } // HTMLMenuElement

    // #157
    function compile_BarProp(o : BarProp) : void {
        var v1 : boolean = o.visible;
    } // BarProp

    // #158
    function compile_History(o : History) : void {
        var v1 : int/*long*/ = o.length;
        var v2 : variant/*any*/ = o.state;
        o.go();
        o.go(X.getint());
        o.back();
        o.forward();
        o.pushState(X.getvariant(), X.getstring());
        o.pushState(X.getvariant(), X.getstring(), X.getstring());
        o.replaceState(X.getvariant(), X.getstring());
        o.replaceState(X.getvariant(), X.getstring(), X.getstring());
    } // History

    // #159
    function compile_Location(o : Location) : void {
        var v1 : string/*DOMString*/ = o.href;
        o.assign(X.getstring());
        o.replace(X.getstring());
        o.reload();
        var v2 : string/*DOMString*/ = o.protocol;
        var v3 : string/*DOMString*/ = o.host;
        var v4 : string/*DOMString*/ = o.hostname;
        var v5 : string/*DOMString*/ = o.port;
        var v6 : string/*DOMString*/ = o.pathname;
        var v7 : string/*DOMString*/ = o.search;
        var v8 : string/*DOMString*/ = o.hash;
    } // Location

    // #160
    function compile_PopStateEvent(o : PopStateEvent) : void {
        var v1 : variant/*any*/ = o.state;
    } // PopStateEvent

    // #161
    function compile_PopStateEventInit(o : PopStateEventInit) : void {
        var v1 : variant/*any*/ = o.state;
    } // PopStateEventInit

    // #162
    function compile_HashChangeEvent(o : HashChangeEvent) : void {
        var v1 : string/*DOMString*/ = o.oldURL;
        var v2 : string/*DOMString*/ = o.newURL;
    } // HashChangeEvent

    // #163
    function compile_HashChangeEventInit(o : HashChangeEventInit) : void {
        var v1 : string/*DOMString*/ = o.oldURL;
        var v2 : string/*DOMString*/ = o.newURL;
    } // HashChangeEventInit

    // #164
    function compile_PageTransitionEvent(o : PageTransitionEvent) : void {
        var v1 : boolean = o.persisted;
    } // PageTransitionEvent

    // #165
    function compile_PageTransitionEventInit(o : PageTransitionEventInit) : void {
        var v1 : boolean = o.persisted;
    } // PageTransitionEventInit

    // #166
    function compile_BeforeUnloadEvent(o : BeforeUnloadEvent) : void {
        var v1 : string/*DOMString*/ = o.returnValue;
    } // BeforeUnloadEvent

    // #167
    function compile_ApplicationCache(o : ApplicationCache) : void {
        var v1 : int/*unsigned short*/ = ApplicationCache.UNCACHED;
        var v2 : int/*unsigned short*/ = o.UNCACHED;
        var v3 : int/*unsigned short*/ = ApplicationCache.IDLE;
        var v4 : int/*unsigned short*/ = o.IDLE;
        var v5 : int/*unsigned short*/ = ApplicationCache.CHECKING;
        var v6 : int/*unsigned short*/ = o.CHECKING;
        var v7 : int/*unsigned short*/ = ApplicationCache.DOWNLOADING;
        var v8 : int/*unsigned short*/ = o.DOWNLOADING;
        var v9 : int/*unsigned short*/ = ApplicationCache.UPDATEREADY;
        var v10 : int/*unsigned short*/ = o.UPDATEREADY;
        var v11 : int/*unsigned short*/ = ApplicationCache.OBSOLETE;
        var v12 : int/*unsigned short*/ = o.OBSOLETE;
        var v13 : int/*unsigned short*/ = o.status;
        o.update();
        o.abort();
        o.swapCache();
        var v14 : function(:Event):void/*Function?*/ = o.onchecking;
        var v15 : function(:Event):void/*Function?*/ = o.onerror;
        var v16 : function(:Event):void/*Function?*/ = o.onnoupdate;
        var v17 : function(:Event):void/*Function?*/ = o.ondownloading;
        var v18 : function(:Event):void/*Function?*/ = o.onprogress;
        var v19 : function(:Event):void/*Function?*/ = o.onupdateready;
        var v20 : function(:Event):void/*Function?*/ = o.oncached;
        var v21 : function(:Event):void/*Function?*/ = o.onobsolete;
    } // ApplicationCache

    // #168
    function compile_NavigatorOnLine(o : NavigatorOnLine) : void {
        var v1 : boolean = o.onLine;
    } // NavigatorOnLine

    // #169
    function compile_WindowBase64(o : WindowBase64) : void {
        var f1 : string/*DOMString*/ = o.btoa(X.getstring());
        var f2 : string/*DOMString*/ = o.atob(X.getstring());
    } // WindowBase64

    // #170
    function compile_WindowModal(o : WindowModal) : void {
        var v1 : variant/*any*/ = o.dialogArguments;
        var v2 : string/*DOMString*/ = o.returnValue;
    } // WindowModal

    // #171
    function compile_Navigator(o : Navigator) : void {
        var v1 : string/*DOMString*/ = o.appName;
        var v2 : string/*DOMString*/ = o.appVersion;
        var v3 : string/*DOMString*/ = o.platform;
        var v4 : string/*DOMString*/ = o.userAgent;
        var v5 : boolean = o.onLine;
        o.registerProtocolHandler(X.getstring(), X.getstring(), X.getstring());
        o.registerContentHandler(X.getstring(), X.getstring(), X.getstring());
        var f6 : string/*DOMString*/ = o.isProtocolHandlerRegistered(X.getstring(), X.getstring());
        var f7 : string/*DOMString*/ = o.isContentHandlerRegistered(X.getstring(), X.getstring());
        o.unregisterProtocolHandler(X.getstring(), X.getstring());
        o.unregisterContentHandler(X.getstring(), X.getstring());
        o.yieldForStorageUpdates();
        var v8 : Geolocation = o.geolocation;
    } // Navigator

    // #172
    function compile_NavigatorID(o : NavigatorID) : void {
        var v1 : string/*DOMString*/ = o.appName;
        var v2 : string/*DOMString*/ = o.appVersion;
        var v3 : string/*DOMString*/ = o.platform;
        var v4 : string/*DOMString*/ = o.userAgent;
    } // NavigatorID

    // #173
    function compile_NavigatorContentUtils(o : NavigatorContentUtils) : void {
        o.registerProtocolHandler(X.getstring(), X.getstring(), X.getstring());
        o.registerContentHandler(X.getstring(), X.getstring(), X.getstring());
        var f1 : string/*DOMString*/ = o.isProtocolHandlerRegistered(X.getstring(), X.getstring());
        var f2 : string/*DOMString*/ = o.isContentHandlerRegistered(X.getstring(), X.getstring());
        o.unregisterProtocolHandler(X.getstring(), X.getstring());
        o.unregisterContentHandler(X.getstring(), X.getstring());
    } // NavigatorContentUtils

    // #174
    function compile_NavigatorStorageUtils(o : NavigatorStorageUtils) : void {
        o.yieldForStorageUpdates();
    } // NavigatorStorageUtils

    // #175
    function compile_External(o : External) : void {
        o.AddSearchProvider(X.getstring());
        var f1 : int/*unsigned long*/ = o.IsSearchProviderInstalled(X.getstring());
    } // External

    // #176
    function compile_DataTransfer(o : DataTransfer) : void {
        var v1 : string/*DOMString*/ = o.dropEffect;
        var v2 : string/*DOMString*/ = o.effectAllowed;
        var v3 : DataTransferItemList = o.items;
        o.setDragImage(X.getElement(), X.getint(), X.getint());
        o.addElement(X.getElement());
        var v4 : DOMStringList = o.types;
        var f5 : string/*DOMString*/ = o.getData(X.getstring());
        o.setData(X.getstring(), X.getstring());
        o.clearData();
        o.clearData(X.getstring());
        var v6 : FileList = o.files;
    } // DataTransfer

    // #177
    function compile_DataTransferItemList(o : DataTransferItemList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<DataTransferItem> = o.__native_index_operator__(X.getint());
        o.clear();
        var f3 : DataTransferItem = o.add(X.getstring(), X.getstring());
        var f4 : DataTransferItem = o.add(X.getFile());
    } // DataTransferItemList

    // #178
    function compile_DataTransferItem(o : DataTransferItem) : void {
        var v1 : string/*DOMString*/ = o.kind;
        var v2 : string/*DOMString*/ = o.type;
        o.getAsString(X.getFunctionStringCallback());
        var f3 : File = o.getAsFile();
    } // DataTransferItem

    // #179
    function compile_FunctionStringCallback(o : FunctionStringCallback) : void {
        o.handleEvent(X.getstring());
    } // FunctionStringCallback

    // #180
    function compile_DragEvent(o : DragEvent) : void {
        var v1 : DataTransfer = o.dataTransfer;
    } // DragEvent

    // #181
    function compile_DragEventInit(o : DragEventInit) : void {
        var v1 : DataTransfer = o.dataTransfer;
    } // DragEventInit

    // #182
    function compile_HTMLAppletElement(o : HTMLAppletElement) : void {
        var v1 : string/*DOMString*/ = o.align;
        var v2 : string/*DOMString*/ = o.alt;
        var v3 : string/*DOMString*/ = o.archive;
        var v4 : string/*DOMString*/ = o.code;
        var v5 : string/*DOMString*/ = o.codeBase;
        var v6 : string/*DOMString*/ = o.height;
        var v7 : int/*unsigned long*/ = o.hspace;
        var v8 : string/*DOMString*/ = o.name;
        var v9 : string/*DOMString*/ = o._object;
        var v10 : int/*unsigned long*/ = o.vspace;
        var v11 : string/*DOMString*/ = o.width;
    } // HTMLAppletElement

    // #183
    function compile_HTMLMarqueeElement(o : HTMLMarqueeElement) : void {
        var v1 : string/*DOMString*/ = o.behavior;
        var v2 : string/*DOMString*/ = o.bgColor;
        var v3 : string/*DOMString*/ = o.direction;
        var v4 : string/*DOMString*/ = o.height;
        var v5 : int/*unsigned long*/ = o.hspace;
        var v6 : int/*long*/ = o.loop;
        var v7 : int/*unsigned long*/ = o.scrollAmount;
        var v8 : int/*unsigned long*/ = o.scrollDelay;
        var v9 : boolean = o.trueSpeed;
        var v10 : int/*unsigned long*/ = o.vspace;
        var v11 : string/*DOMString*/ = o.width;
        var v12 : function(:Event):void/*Function?*/ = o.onbounce;
        var v13 : function(:Event):void/*Function?*/ = o.onfinish;
        var v14 : function(:Event):void/*Function?*/ = o.onstart;
        o.start();
        o.stop();
    } // HTMLMarqueeElement

    // #184
    function compile_HTMLFrameSetElement(o : HTMLFrameSetElement) : void {
        var v1 : string/*DOMString*/ = o.cols;
        var v2 : string/*DOMString*/ = o.rows;
        var v3 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v4 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v5 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v6 : function(:Event):void/*Function?*/ = o.onblur;
        var v7 : function(:Event):void/*Function?*/ = o.onerror;
        var v8 : function(:Event):void/*Function?*/ = o.onfocus;
        var v9 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v10 : function(:Event):void/*Function?*/ = o.onload;
        var v11 : function(:Event):void/*Function?*/ = o.onmessage;
        var v12 : function(:Event):void/*Function?*/ = o.onoffline;
        var v13 : function(:Event):void/*Function?*/ = o.ononline;
        var v14 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v15 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v16 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v17 : function(:Event):void/*Function?*/ = o.onresize;
        var v18 : function(:Event):void/*Function?*/ = o.onscroll;
        var v19 : function(:Event):void/*Function?*/ = o.onstorage;
        var v20 : function(:Event):void/*Function?*/ = o.onunload;
    } // HTMLFrameSetElement

    // #185
    function compile_HTMLFrameElement(o : HTMLFrameElement) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : string/*DOMString*/ = o.scrolling;
        var v3 : string/*DOMString*/ = o.src;
        var v4 : string/*DOMString*/ = o.frameBorder;
        var v5 : string/*DOMString*/ = o.longDesc;
        var v6 : boolean = o.noResize;
        var v7 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v8 : Window/*WindowProxy?*/ = o.contentWindow;
        var v9 : string/*DOMString*/ = o.marginHeight;
        var v10 : string/*DOMString*/ = o.marginWidth;
    } // HTMLFrameElement

    // #186
    function compile_HTMLBaseFontElement(o : HTMLBaseFontElement) : void {
        var v1 : string/*DOMString*/ = o.color;
        var v2 : string/*DOMString*/ = o.face;
        var v3 : int/*long*/ = o.size;
    } // HTMLBaseFontElement

    // #187
    function compile_HTMLDirectoryElement(o : HTMLDirectoryElement) : void {
        var v1 : boolean = o.compact;
    } // HTMLDirectoryElement

    // #188
    function compile_HTMLFontElement(o : HTMLFontElement) : void {
        var v1 : string/*DOMString*/ = o.color;
        var v2 : string/*DOMString*/ = o.face;
        var v3 : string/*DOMString*/ = o.size;
    } // HTMLFontElement

    // #189
    function compile_FileList(o : FileList) : void {
        var f1 : MayBeUndefined.<File> = o.__native_index_operator__(X.getint());
        var f2 : MayBeUndefined.<File> = o.item(X.getint());
        var v3 : int/*unsigned long*/ = o.length;
    } // FileList

    // #190
    function compile_Blob(o : Blob) : void {
        var v1 : number/*unsigned long long*/ = o.size;
        var v2 : string/*DOMString*/ = o.type;
        var f3 : Blob = o.slice();
        var f4 : Blob = o.slice(X.getnumber());
        var f5 : Blob = o.slice(X.getnumber(), X.getnumber());
        var f6 : Blob = o.slice(X.getnumber(), X.getnumber(), X.getstring());
    } // Blob

    // #191
    function compile_File(o : File) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : Date = o.lastModifiedDate;
    } // File

    // #192
    function compile_FileReader(o : FileReader) : void {
        o.readAsArrayBuffer(X.getBlob());
        o.readAsBinaryString(X.getBlob());
        o.readAsText(X.getBlob());
        o.readAsText(X.getBlob(), X.getstring());
        o.readAsDataURL(X.getBlob());
        o.abort();
        var v1 : int/*unsigned short*/ = FileReader.EMPTY;
        var v2 : int/*unsigned short*/ = o.EMPTY;
        var v3 : int/*unsigned short*/ = FileReader.LOADING;
        var v4 : int/*unsigned short*/ = o.LOADING;
        var v5 : int/*unsigned short*/ = FileReader.DONE;
        var v6 : int/*unsigned short*/ = o.DONE;
        var v7 : int/*unsigned short*/ = o.readyState;
        var v8 : variant/*any*/ = o.result;
        var v9 : DOMError = o.error;
        var v10 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v11 : function(:Event):void/*Function?*/ = o.onprogress;
        var v12 : function(:Event):void/*Function?*/ = o.onload;
        var v13 : function(:Event):void/*Function?*/ = o.onabort;
        var v14 : function(:Event):void/*Function?*/ = o.onerror;
        var v15 : function(:Event):void/*Function?*/ = o.onloadend;
    } // FileReader

    // #193
    function compile_FileReaderSync(o : FileReaderSync) : void {
        var f1 : ArrayBuffer = o.readAsArrayBuffer(X.getBlob());
        var f2 : string/*DOMString*/ = o.readAsBinaryString(X.getBlob());
        var f3 : string/*DOMString*/ = o.readAsText(X.getBlob());
        var f4 : string/*DOMString*/ = o.readAsText(X.getBlob(), X.getstring());
        var f5 : string/*DOMString*/ = o.readAsDataURL(X.getBlob());
    } // FileReaderSync

    // #194
    function compile_URL(o : URL) : void {
        var f1 : string/*DOMString*/ = URL.createObjectURL(X.getBlob());
        URL.revokeObjectURL(X.getstring());
    } // URL

    // #195
    function compile_webkitURL(o : webkitURL) : void {
    } // webkitURL

    // #196
    function compile_Touch(o : Touch) : void {
        var v1 : int/*long*/ = o.identifier;
        var v2 : EventTarget = o.target;
        var v3 : int/*long*/ = o.screenX;
        var v4 : int/*long*/ = o.screenY;
        var v5 : int/*long*/ = o.clientX;
        var v6 : int/*long*/ = o.clientY;
        var v7 : int/*long*/ = o.pageX;
        var v8 : int/*long*/ = o.pageY;
    } // Touch

    // #197
    function compile_TouchList(o : TouchList) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<Touch> = o.__native_index_operator__(X.getint());
        var f3 : MayBeUndefined.<Touch> = o.item(X.getint());
        var f4 : Touch = o.identifiedTouch(X.getint());
    } // TouchList

    // #198
    function compile_TouchEvent(o : TouchEvent) : void {
        var v1 : TouchList = o.touches;
        var v2 : TouchList = o.targetTouches;
        var v3 : TouchList = o.changedTouches;
        var v4 : boolean = o.altKey;
        var v5 : boolean = o.metaKey;
        var v6 : boolean = o.ctrlKey;
        var v7 : boolean = o.shiftKey;
    } // TouchEvent

    // #199
    function compile_WebSocket(o : WebSocket) : void {
        var v1 : string/*DOMString*/ = o.url;
        var v2 : int/*unsigned short*/ = WebSocket.CONNECTING;
        var v3 : int/*unsigned short*/ = o.CONNECTING;
        var v4 : int/*unsigned short*/ = WebSocket.OPEN;
        var v5 : int/*unsigned short*/ = o.OPEN;
        var v6 : int/*unsigned short*/ = WebSocket.CLOSING;
        var v7 : int/*unsigned short*/ = o.CLOSING;
        var v8 : int/*unsigned short*/ = WebSocket.CLOSED;
        var v9 : int/*unsigned short*/ = o.CLOSED;
        var v10 : int/*unsigned short*/ = o.readyState;
        var v11 : int/*unsigned long*/ = o.bufferedAmount;
        var v12 : function(:Event):void/*Function?*/ = o.onopen;
        var v13 : function(:Event):void/*Function?*/ = o.onerror;
        var v14 : function(:Event):void/*Function?*/ = o.onclose;
        var v15 : string/*DOMString*/ = o.extensions;
        var v16 : string/*DOMString*/ = o.protocol;
        o.close();
        o.close(X.getint());
        o.close(X.getint(), X.getstring());
        var v17 : function(:Event):void/*Function?*/ = o.onmessage;
        var v18 : string/*DOMString*/ = o.binaryType;
        o.send(X.getstring());
        o.send(X.getArrayBufferView());
        o.send(X.getBlob());
    } // WebSocket

    // #200
    function compile_CloseEvent(o : CloseEvent) : void {
        var v1 : boolean = o.wasClean;
        var v2 : int/*unsigned short*/ = o.code;
        var v3 : string/*DOMString*/ = o.reason;
    } // CloseEvent

    // #201
    function compile_CloseEventInit(o : CloseEventInit) : void {
        var v1 : boolean = o.wasClean;
        var v2 : int/*unsigned short*/ = o.code;
        var v3 : string/*DOMString*/ = o.reason;
    } // CloseEventInit

    // #202
    function compile_NavigatorGeolocation(o : NavigatorGeolocation) : void {
        var v1 : Geolocation = o.geolocation;
    } // NavigatorGeolocation

    // #203
    function compile_Geolocation(o : Geolocation) : void {
        o.getCurrentPosition(X.getPositionCallback());
        o.getCurrentPosition(X.getPositionCallback(), X.getPositionErrorCallback());
        o.getCurrentPosition(X.getPositionCallback(), X.getPositionErrorCallback(), X.getPositionOptions());
        var f1 : int/*long*/ = o.watchPosition(X.getPositionCallback());
        var f2 : int/*long*/ = o.watchPosition(X.getPositionCallback(), X.getPositionErrorCallback());
        var f3 : int/*long*/ = o.watchPosition(X.getPositionCallback(), X.getPositionErrorCallback(), X.getPositionOptions());
        o.clearWatch(X.getint());
    } // Geolocation

    // #204
    function compile_PositionCallback(o : PositionCallback) : void {
        o.handleEvent(X.getPosition());
    } // PositionCallback

    // #205
    function compile_PositionErrorCallback(o : PositionErrorCallback) : void {
        o.handleEvent(X.getPositionError());
    } // PositionErrorCallback

    // #206
    function compile_PositionOptions(o : PositionOptions) : void {
        var v1 : boolean = o.enableHighAccuracy;
        var v2 : int/*long*/ = o.timeout;
        var v3 : int/*long*/ = o.maximumAge;
        var v4 : boolean = o.requireCoords;
        var v5 : boolean = o.requestAddress;
    } // PositionOptions

    // #207
    function compile_Position(o : Position) : void {
        var v1 : Coordinates = o.coords;
        var v2 : Address = o.address;
        var v3 : number/*DOMTimeStamp*/ = o.timestamp;
    } // Position

    // #208
    function compile_Coordinates(o : Coordinates) : void {
        var v1 : number/*double?*/ = o.latitude;
        var v2 : number/*double?*/ = o.longitude;
        var v3 : number/*double?*/ = o.altitude;
        var v4 : number/*double?*/ = o.accuracy;
        var v5 : number/*double?*/ = o.altitudeAccuracy;
        var v6 : number/*double?*/ = o.heading;
        var v7 : number/*double?*/ = o.speed;
        var v8 : number/*double?*/ = o.verticalSpeed;
    } // Coordinates

    // #209
    function compile_Address(o : Address) : void {
        var v1 : string/*DOMString?*/ = o.country;
        var v2 : string/*DOMString?*/ = o.region;
        var v3 : string/*DOMString?*/ = o.county;
        var v4 : string/*DOMString?*/ = o.city;
        var v5 : string/*DOMString?*/ = o.street;
        var v6 : string/*DOMString?*/ = o.streetNumber;
        var v7 : string/*DOMString?*/ = o.premises;
        var v8 : string/*DOMString?*/ = o.postalCode;
    } // Address

    // #210
    function compile_PositionError(o : PositionError) : void {
        var v1 : int/*unsigned short*/ = PositionError.PERMISSION_DENIED;
        var v2 : int/*unsigned short*/ = o.PERMISSION_DENIED;
        var v3 : int/*unsigned short*/ = PositionError.POSITION_UNAVAILABLE;
        var v4 : int/*unsigned short*/ = o.POSITION_UNAVAILABLE;
        var v5 : int/*unsigned short*/ = PositionError.TIMEOUT;
        var v6 : int/*unsigned short*/ = o.TIMEOUT;
        var v7 : int/*unsigned short*/ = o.code;
        var v8 : string/*DOMString*/ = o.message;
    } // PositionError

    // #211
    function compile_Storage(o : Storage) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : string/*DOMString?*/ = o.key(X.getint());
        var f3 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getstring());
        var f4 : MayBeUndefined.<string/*DOMString*/> = o.getItem(X.getstring());
        o.setItem(X.getstring(), X.getstring());
        o.removeItem(X.getstring());
        o.clear();
    } // Storage

    // #212
    function compile_WindowSessionStorage(o : WindowSessionStorage) : void {
        var v1 : Storage = o.sessionStorage;
    } // WindowSessionStorage

    // #213
    function compile_WindowLocalStorage(o : WindowLocalStorage) : void {
        var v1 : Storage = o.localStorage;
    } // WindowLocalStorage

    // #214
    function compile_StorageEvent(o : StorageEvent) : void {
        var v1 : string/*DOMString?*/ = o.key;
        var v2 : string/*DOMString?*/ = o.oldValue;
        var v3 : string/*DOMString?*/ = o.newValue;
        var v4 : string/*DOMString*/ = o.url;
        var v5 : Storage = o.storageArea;
    } // StorageEvent

    // #215
    function compile_StorageEventInit(o : StorageEventInit) : void {
        var v1 : string/*DOMString?*/ = o.key;
        var v2 : string/*DOMString?*/ = o.oldValue;
        var v3 : string/*DOMString?*/ = o.newValue;
        var v4 : string/*DOMString*/ = o.url;
        var v5 : Storage = o.storageArea;
    } // StorageEventInit

    // #216
    function compile_NodeSelector(o : NodeSelector) : void {
        var f1 : Element = o.querySelector(X.getstring());
        var f2 : NodeList = o.querySelectorAll(X.getstring());
    } // NodeSelector

    // #217
    function compile_MessageEvent(o : MessageEvent) : void {
        var v1 : variant/*any*/ = o.data;
        var v2 : string/*DOMString*/ = o.origin;
        var v3 : string/*DOMString*/ = o.lastEventId;
        var v4 : Window/*WindowProxy?*/ = o.source;
        var v5 : MessagePort[] = o.ports;
    } // MessageEvent

    // #218
    function compile_MessageEventInit(o : MessageEventInit) : void {
        var v1 : variant/*any*/ = o.data;
        var v2 : string/*DOMString*/ = o.origin;
        var v3 : string/*DOMString*/ = o.lastEventId;
        var v4 : Window/*WindowProxy?*/ = o.source;
        var v5 : MessagePort[] = o.ports;
    } // MessageEventInit

    // #219
    function compile_MessageChannel(o : MessageChannel) : void {
        var v1 : MessagePort = o.port1;
        var v2 : MessagePort = o.port2;
    } // MessageChannel

    // #220
    function compile_MessagePort(o : MessagePort) : void {
        o.postMessage(X.getvariant());
        o.postMessage(X.getvariant(), X.getTransferable__());
        o.start();
        o.close();
        var v1 : function(:Event):void/*Function?*/ = o.onmessage;
    } // MessagePort

    // #221
    function compile_WorkerGlobalScope(o : WorkerGlobalScope) : void {
        var v1 : WorkerGlobalScope = o.self;
        var v2 : WorkerLocation = o.location;
        o.close();
        var v3 : function(:Event):void/*Function?*/ = o.onerror;
        var v4 : function(:Event):void/*Function?*/ = o.onoffline;
        var v5 : function(:Event):void/*Function?*/ = o.ononline;
        o.importScripts();
        o.importScripts(X.getstring());
        var v6 : WorkerNavigator = o.navigator;
    } // WorkerGlobalScope

    // #222
    function compile_DedicatedWorkerGlobalScope(o : DedicatedWorkerGlobalScope) : void {
        o.postMessage(X.getvariant());
        o.postMessage(X.getvariant(), X.getTransferable__());
        var v1 : function(:Event):void/*Function?*/ = o.onmessage;
    } // DedicatedWorkerGlobalScope

    // #223
    function compile_SharedWorkerGlobalScope(o : SharedWorkerGlobalScope) : void {
        var v1 : string/*DOMString*/ = o.name;
        var v2 : ApplicationCache = o.applicationCache;
        var v3 : function(:Event):void/*Function?*/ = o.onconnect;
    } // SharedWorkerGlobalScope

    // #224
    function compile_ErrorEvent(o : ErrorEvent) : void {
        var v1 : string/*DOMString*/ = o.message;
        var v2 : string/*DOMString*/ = o.filename;
        var v3 : int/*unsigned long*/ = o.lineno;
    } // ErrorEvent

    // #225
    function compile_ErrorEventInit(o : ErrorEventInit) : void {
        var v1 : string/*DOMString*/ = o.message;
        var v2 : string/*DOMString*/ = o.filename;
        var v3 : int/*unsigned long*/ = o.lineno;
    } // ErrorEventInit

    // #226
    function compile_AbstractWorker(o : AbstractWorker) : void {
        var v1 : function(:Event):void/*Function?*/ = o.onerror;
    } // AbstractWorker

    // #227
    function compile_Worker(o : Worker) : void {
        o.terminate();
        o.postMessage(X.getvariant());
        o.postMessage(X.getvariant(), X.getTransferable__());
        var v1 : function(:Event):void/*Function?*/ = o.onmessage;
        var v2 : function(:Event):void/*Function?*/ = o.onerror;
    } // Worker

    // #228
    function compile_SharedWorker(o : SharedWorker) : void {
        var v1 : MessagePort = o.port;
        var v2 : function(:Event):void/*Function?*/ = o.onerror;
    } // SharedWorker

    // #229
    function compile_WorkerUtils(o : WorkerUtils) : void {
        o.importScripts();
        o.importScripts(X.getstring());
        var v1 : WorkerNavigator = o.navigator;
        var f2 : string/*DOMString*/ = o.btoa(X.getstring());
        var f3 : string/*DOMString*/ = o.atob(X.getstring());
    } // WorkerUtils

    // #230
    function compile_WorkerNavigator(o : WorkerNavigator) : void {
        var v1 : string/*DOMString*/ = o.appName;
        var v2 : string/*DOMString*/ = o.appVersion;
        var v3 : string/*DOMString*/ = o.platform;
        var v4 : string/*DOMString*/ = o.userAgent;
        var v5 : boolean = o.onLine;
    } // WorkerNavigator

    // #231
    function compile_WorkerLocation(o : WorkerLocation) : void {
        var v1 : string/*DOMString*/ = o.href;
        var v2 : string/*DOMString*/ = o.protocol;
        var v3 : string/*DOMString*/ = o.host;
        var v4 : string/*DOMString*/ = o.hostname;
        var v5 : string/*DOMString*/ = o.port;
        var v6 : string/*DOMString*/ = o.pathname;
        var v7 : string/*DOMString*/ = o.search;
        var v8 : string/*DOMString*/ = o.hash;
    } // WorkerLocation

    // #232
    function compile_DOMParser(o : DOMParser) : void {
        var f1 : HTMLDocument/*Document*/ = o.parseFromString(X.getstring(), X.getstring());
    } // DOMParser

    // #233
    function compile_XMLSerializer(o : XMLSerializer) : void {
        var f1 : string/*DOMString*/ = o.serializeToString(X.getNode());
    } // XMLSerializer

    // #234
    function compile_ArrayBuffer(o : ArrayBuffer) : void {
        var v1 : int/*unsigned long*/ = o.byteLength;
        var f2 : ArrayBuffer = o.slice(X.getint());
        var f3 : ArrayBuffer = o.slice(X.getint(), X.getint());
    } // ArrayBuffer

    // #235
    function compile_ArrayBufferView(o : ArrayBufferView) : void {
        var v1 : ArrayBuffer = o.buffer;
        var v2 : int/*unsigned long*/ = o.byteOffset;
        var v3 : int/*unsigned long*/ = o.byteLength;
    } // ArrayBufferView

    // #236
    function compile_Int8Array(o : Int8Array) : void {
        var v1 : int/*long*/ = Int8Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*byte*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*byte*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt8Array());
        o.set(X.getInt8Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Int8Array = o.subarray(X.getint(), X.getint());
    } // Int8Array

    // #237
    function compile_Uint8Array(o : Uint8Array) : void {
        var v1 : int/*long*/ = Uint8Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*octet*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*octet*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint8Array());
        o.set(X.getUint8Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Uint8Array = o.subarray(X.getint(), X.getint());
    } // Uint8Array

    // #238
    function compile_Uint8ClampedArray(o : Uint8ClampedArray) : void {
        o.set(X.getint(), X.getint());
        o.set(X.getUint8ClampedArray());
        o.set(X.getUint8ClampedArray(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f1 : Uint8ClampedArray = o.subarray(X.getint(), X.getint());
    } // Uint8ClampedArray

    // #239
    function compile_Int16Array(o : Int16Array) : void {
        var v1 : int/*long*/ = Int16Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*short*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*short*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt16Array());
        o.set(X.getInt16Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Int16Array = o.subarray(X.getint(), X.getint());
    } // Int16Array

    // #240
    function compile_Uint16Array(o : Uint16Array) : void {
        var v1 : int/*long*/ = Uint16Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*unsigned short*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*unsigned short*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint16Array());
        o.set(X.getUint16Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Uint16Array = o.subarray(X.getint(), X.getint());
    } // Uint16Array

    // #241
    function compile_Int32Array(o : Int32Array) : void {
        var v1 : int/*long*/ = Int32Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*long*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*long*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt32Array());
        o.set(X.getInt32Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Int32Array = o.subarray(X.getint(), X.getint());
    } // Int32Array

    // #242
    function compile_Uint32Array(o : Uint32Array) : void {
        var v1 : int/*long*/ = Uint32Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<int/*unsigned long*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<int/*unsigned long*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint32Array());
        o.set(X.getUint32Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Uint32Array = o.subarray(X.getint(), X.getint());
    } // Uint32Array

    // #243
    function compile_Float32Array(o : Float32Array) : void {
        var v1 : int/*long*/ = Float32Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<number/*float*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<number/*float*/> = o.get(X.getint());
        o.set(X.getint(), X.getnumber());
        o.set(X.getFloat32Array());
        o.set(X.getFloat32Array(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Float32Array = o.subarray(X.getint(), X.getint());
    } // Float32Array

    // #244
    function compile_Float64Array(o : Float64Array) : void {
        var v1 : int/*long*/ = Float64Array.BYTES_PER_ELEMENT;
        var v2 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v3 : int/*unsigned long*/ = o.length;
        var f4 : MayBeUndefined.<number/*double*/> = o.__native_index_operator__(X.getint());
        var f5 : MayBeUndefined.<number/*double*/> = o.get(X.getint());
        o.set(X.getint(), X.getnumber());
        o.set(X.getFloat64Array());
        o.set(X.getFloat64Array(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f6 : Float64Array = o.subarray(X.getint(), X.getint());
    } // Float64Array

    // #245
    function compile_DataView(o : DataView) : void {
        var f1 : int/*byte*/ = o.getInt8(X.getint());
        var f2 : int/*octet*/ = o.getUint8(X.getint());
        var f3 : int/*short*/ = o.getInt16(X.getint());
        var f4 : int/*short*/ = o.getInt16(X.getint(), X.getboolean());
        var f5 : int/*unsigned short*/ = o.getUint16(X.getint());
        var f6 : int/*unsigned short*/ = o.getUint16(X.getint(), X.getboolean());
        var f7 : int/*long*/ = o.getInt32(X.getint());
        var f8 : int/*long*/ = o.getInt32(X.getint(), X.getboolean());
        var f9 : int/*unsigned long*/ = o.getUint32(X.getint());
        var f10 : int/*unsigned long*/ = o.getUint32(X.getint(), X.getboolean());
        var f11 : number/*float*/ = o.getFloat32(X.getint());
        var f12 : number/*float*/ = o.getFloat32(X.getint(), X.getboolean());
        var f13 : number/*double*/ = o.getFloat64(X.getint());
        var f14 : number/*double*/ = o.getFloat64(X.getint(), X.getboolean());
        o.setInt8(X.getint(), X.getint());
        o.setUint8(X.getint(), X.getint());
        o.setInt16(X.getint(), X.getint());
        o.setInt16(X.getint(), X.getint(), X.getboolean());
        o.setUint16(X.getint(), X.getint());
        o.setUint16(X.getint(), X.getint(), X.getboolean());
        o.setInt32(X.getint(), X.getint());
        o.setInt32(X.getint(), X.getint(), X.getboolean());
        o.setUint32(X.getint(), X.getint());
        o.setUint32(X.getint(), X.getint(), X.getboolean());
        o.setFloat32(X.getint(), X.getnumber());
        o.setFloat32(X.getint(), X.getnumber(), X.getboolean());
        o.setFloat64(X.getint(), X.getnumber());
        o.setFloat64(X.getint(), X.getnumber(), X.getboolean());
    } // DataView

    // #246
    function compile_CanvasRenderingContext2D(o : CanvasRenderingContext2D) : void {
        var v1 : HTMLCanvasElement = o.canvas;
        o.save();
        o.restore();
        var v2 : number/*double*/ = o.globalAlpha;
        var v3 : string/*DOMString*/ = o.globalCompositeOperation;
        var v4 : variant/*any*/ = o.strokeStyle;
        var v5 : variant/*any*/ = o.fillStyle;
        var f6 : CanvasGradient = o.createLinearGradient(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f7 : CanvasGradient = o.createRadialGradient(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f8 : CanvasPattern = o.createPattern(X.getHTMLImageElement(), X.getstring());
        var f9 : CanvasPattern = o.createPattern(X.getHTMLCanvasElement(), X.getstring());
        var f10 : CanvasPattern = o.createPattern(X.getHTMLVideoElement(), X.getstring());
        var v11 : number/*double*/ = o.shadowOffsetX;
        var v12 : number/*double*/ = o.shadowOffsetY;
        var v13 : number/*double*/ = o.shadowBlur;
        var v14 : string/*DOMString*/ = o.shadowColor;
        o.clearRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.fillRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.strokeRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.beginPath();
        o.fill();
        o.stroke();
        o.drawSystemFocusRing(X.getElement());
        var f15 : boolean = o.drawCustomFocusRing(X.getElement());
        o.scrollPathIntoView();
        o.clip();
        var f16 : boolean = o.isPointInPath(X.getnumber(), X.getnumber());
        o.fillText(X.getstring(), X.getnumber(), X.getnumber());
        o.fillText(X.getstring(), X.getnumber(), X.getnumber(), X.getnumber());
        o.strokeText(X.getstring(), X.getnumber(), X.getnumber());
        o.strokeText(X.getstring(), X.getnumber(), X.getnumber(), X.getnumber());
        var f17 : TextMetrics = o.measureText(X.getstring());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f18 : ImageData = o.createImageData(X.getnumber(), X.getnumber());
        var f19 : ImageData = o.createImageData(X.getImageData());
        var f20 : ImageData = o.getImageData(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.putImageData(X.getImageData(), X.getnumber(), X.getnumber());
        o.putImageData(X.getImageData(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.scale(X.getnumber(), X.getnumber());
        o.rotate(X.getnumber());
        o.translate(X.getnumber(), X.getnumber());
        o.transform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.setTransform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var v21 : number/*double*/ = o.lineWidth;
        var v22 : string/*DOMString*/ = o.lineCap;
        var v23 : string/*DOMString*/ = o.lineJoin;
        var v24 : number/*double*/ = o.miterLimit;
        o.closePath();
        o.moveTo(X.getnumber(), X.getnumber());
        o.lineTo(X.getnumber(), X.getnumber());
        o.quadraticCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.bezierCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arcTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.rect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getboolean());
        var v25 : string/*DOMString*/ = o.font;
        var v26 : string/*DOMString*/ = o.textAlign;
        var v27 : string/*DOMString*/ = o.textBaseline;
    } // CanvasRenderingContext2D

    // #247
    function compile_CanvasTransformation(o : CanvasTransformation) : void {
        o.scale(X.getnumber(), X.getnumber());
        o.rotate(X.getnumber());
        o.translate(X.getnumber(), X.getnumber());
        o.transform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.setTransform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
    } // CanvasTransformation

    // #248
    function compile_CanvasLineStyles(o : CanvasLineStyles) : void {
        var v1 : number/*double*/ = o.lineWidth;
        var v2 : string/*DOMString*/ = o.lineCap;
        var v3 : string/*DOMString*/ = o.lineJoin;
        var v4 : number/*double*/ = o.miterLimit;
    } // CanvasLineStyles

    // #249
    function compile_CanvasText(o : CanvasText) : void {
        var v1 : string/*DOMString*/ = o.font;
        var v2 : string/*DOMString*/ = o.textAlign;
        var v3 : string/*DOMString*/ = o.textBaseline;
    } // CanvasText

    // #250
    function compile_CanvasPathMethods(o : CanvasPathMethods) : void {
        o.closePath();
        o.moveTo(X.getnumber(), X.getnumber());
        o.lineTo(X.getnumber(), X.getnumber());
        o.quadraticCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.bezierCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arcTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.rect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getboolean());
    } // CanvasPathMethods

    // #251
    function compile_CanvasGradient(o : CanvasGradient) : void {
        o.addColorStop(X.getnumber(), X.getstring());
    } // CanvasGradient

    // #252
    function compile_CanvasPattern(o : CanvasPattern) : void {
    } // CanvasPattern

    // #253
    function compile_TextMetrics(o : TextMetrics) : void {
        var v1 : number/*double*/ = o.width;
    } // TextMetrics

    // #254
    function compile_ImageData(o : ImageData) : void {
        var v1 : int/*unsigned long*/ = o.width;
        var v2 : int/*unsigned long*/ = o.height;
        var v3 : Uint8ClampedArray = o.data;
    } // ImageData

    // #255
    function compile_WebGLContextAttributes(o : WebGLContextAttributes) : void {
        var v1 : boolean = o.alpha;
        var v2 : boolean = o.depth;
        var v3 : boolean = o.stencil;
        var v4 : boolean = o.antialias;
        var v5 : boolean = o.premultipliedAlpha;
        var v6 : boolean = o.preserveDrawingBuffer;
    } // WebGLContextAttributes

    // #256
    function compile_WebGLObject(o : WebGLObject) : void {
    } // WebGLObject

    // #257
    function compile_WebGLBuffer(o : WebGLBuffer) : void {
    } // WebGLBuffer

    // #258
    function compile_WebGLFramebuffer(o : WebGLFramebuffer) : void {
    } // WebGLFramebuffer

    // #259
    function compile_WebGLProgram(o : WebGLProgram) : void {
    } // WebGLProgram

    // #260
    function compile_WebGLRenderbuffer(o : WebGLRenderbuffer) : void {
    } // WebGLRenderbuffer

    // #261
    function compile_WebGLShader(o : WebGLShader) : void {
    } // WebGLShader

    // #262
    function compile_WebGLTexture(o : WebGLTexture) : void {
    } // WebGLTexture

    // #263
    function compile_WebGLUniformLocation(o : WebGLUniformLocation) : void {
    } // WebGLUniformLocation

    // #264
    function compile_WebGLActiveInfo(o : WebGLActiveInfo) : void {
        var v1 : int/*GLint*/ = o.size;
        var v2 : int/*GLenum*/ = o.type;
        var v3 : string/*DOMString*/ = o.name;
    } // WebGLActiveInfo

    // #265
    function compile_WebGLShaderPrecisionFormat(o : WebGLShaderPrecisionFormat) : void {
        var v1 : int/*GLint*/ = o.rangeMin;
        var v2 : int/*GLint*/ = o.rangeMax;
        var v3 : int/*GLint*/ = o.precision;
    } // WebGLShaderPrecisionFormat

    // #266
    function compile_WebGLRenderingContext(o : WebGLRenderingContext) : void {
        var v1 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_BUFFER_BIT;
        var v2 : int/*GLenum*/ = o.DEPTH_BUFFER_BIT;
        var v3 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BUFFER_BIT;
        var v4 : int/*GLenum*/ = o.STENCIL_BUFFER_BIT;
        var v5 : int/*GLenum*/ = WebGLRenderingContext.COLOR_BUFFER_BIT;
        var v6 : int/*GLenum*/ = o.COLOR_BUFFER_BIT;
        var v7 : int/*GLenum*/ = WebGLRenderingContext.POINTS;
        var v8 : int/*GLenum*/ = o.POINTS;
        var v9 : int/*GLenum*/ = WebGLRenderingContext.LINES;
        var v10 : int/*GLenum*/ = o.LINES;
        var v11 : int/*GLenum*/ = WebGLRenderingContext.LINE_LOOP;
        var v12 : int/*GLenum*/ = o.LINE_LOOP;
        var v13 : int/*GLenum*/ = WebGLRenderingContext.LINE_STRIP;
        var v14 : int/*GLenum*/ = o.LINE_STRIP;
        var v15 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLES;
        var v16 : int/*GLenum*/ = o.TRIANGLES;
        var v17 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLE_STRIP;
        var v18 : int/*GLenum*/ = o.TRIANGLE_STRIP;
        var v19 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLE_FAN;
        var v20 : int/*GLenum*/ = o.TRIANGLE_FAN;
        var v21 : int/*GLenum*/ = WebGLRenderingContext.ZERO;
        var v22 : int/*GLenum*/ = o.ZERO;
        var v23 : int/*GLenum*/ = WebGLRenderingContext.ONE;
        var v24 : int/*GLenum*/ = o.ONE;
        var v25 : int/*GLenum*/ = WebGLRenderingContext.SRC_COLOR;
        var v26 : int/*GLenum*/ = o.SRC_COLOR;
        var v27 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_SRC_COLOR;
        var v28 : int/*GLenum*/ = o.ONE_MINUS_SRC_COLOR;
        var v29 : int/*GLenum*/ = WebGLRenderingContext.SRC_ALPHA;
        var v30 : int/*GLenum*/ = o.SRC_ALPHA;
        var v31 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
        var v32 : int/*GLenum*/ = o.ONE_MINUS_SRC_ALPHA;
        var v33 : int/*GLenum*/ = WebGLRenderingContext.DST_ALPHA;
        var v34 : int/*GLenum*/ = o.DST_ALPHA;
        var v35 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_DST_ALPHA;
        var v36 : int/*GLenum*/ = o.ONE_MINUS_DST_ALPHA;
        var v37 : int/*GLenum*/ = WebGLRenderingContext.DST_COLOR;
        var v38 : int/*GLenum*/ = o.DST_COLOR;
        var v39 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_DST_COLOR;
        var v40 : int/*GLenum*/ = o.ONE_MINUS_DST_COLOR;
        var v41 : int/*GLenum*/ = WebGLRenderingContext.SRC_ALPHA_SATURATE;
        var v42 : int/*GLenum*/ = o.SRC_ALPHA_SATURATE;
        var v43 : int/*GLenum*/ = WebGLRenderingContext.FUNC_ADD;
        var v44 : int/*GLenum*/ = o.FUNC_ADD;
        var v45 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION;
        var v46 : int/*GLenum*/ = o.BLEND_EQUATION;
        var v47 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION_RGB;
        var v48 : int/*GLenum*/ = o.BLEND_EQUATION_RGB;
        var v49 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION_ALPHA;
        var v50 : int/*GLenum*/ = o.BLEND_EQUATION_ALPHA;
        var v51 : int/*GLenum*/ = WebGLRenderingContext.FUNC_SUBTRACT;
        var v52 : int/*GLenum*/ = o.FUNC_SUBTRACT;
        var v53 : int/*GLenum*/ = WebGLRenderingContext.FUNC_REVERSE_SUBTRACT;
        var v54 : int/*GLenum*/ = o.FUNC_REVERSE_SUBTRACT;
        var v55 : int/*GLenum*/ = WebGLRenderingContext.BLEND_DST_RGB;
        var v56 : int/*GLenum*/ = o.BLEND_DST_RGB;
        var v57 : int/*GLenum*/ = WebGLRenderingContext.BLEND_SRC_RGB;
        var v58 : int/*GLenum*/ = o.BLEND_SRC_RGB;
        var v59 : int/*GLenum*/ = WebGLRenderingContext.BLEND_DST_ALPHA;
        var v60 : int/*GLenum*/ = o.BLEND_DST_ALPHA;
        var v61 : int/*GLenum*/ = WebGLRenderingContext.BLEND_SRC_ALPHA;
        var v62 : int/*GLenum*/ = o.BLEND_SRC_ALPHA;
        var v63 : int/*GLenum*/ = WebGLRenderingContext.CONSTANT_COLOR;
        var v64 : int/*GLenum*/ = o.CONSTANT_COLOR;
        var v65 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR;
        var v66 : int/*GLenum*/ = o.ONE_MINUS_CONSTANT_COLOR;
        var v67 : int/*GLenum*/ = WebGLRenderingContext.CONSTANT_ALPHA;
        var v68 : int/*GLenum*/ = o.CONSTANT_ALPHA;
        var v69 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA;
        var v70 : int/*GLenum*/ = o.ONE_MINUS_CONSTANT_ALPHA;
        var v71 : int/*GLenum*/ = WebGLRenderingContext.BLEND_COLOR;
        var v72 : int/*GLenum*/ = o.BLEND_COLOR;
        var v73 : int/*GLenum*/ = WebGLRenderingContext.ARRAY_BUFFER;
        var v74 : int/*GLenum*/ = o.ARRAY_BUFFER;
        var v75 : int/*GLenum*/ = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;
        var v76 : int/*GLenum*/ = o.ELEMENT_ARRAY_BUFFER;
        var v77 : int/*GLenum*/ = WebGLRenderingContext.ARRAY_BUFFER_BINDING;
        var v78 : int/*GLenum*/ = o.ARRAY_BUFFER_BINDING;
        var v79 : int/*GLenum*/ = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING;
        var v80 : int/*GLenum*/ = o.ELEMENT_ARRAY_BUFFER_BINDING;
        var v81 : int/*GLenum*/ = WebGLRenderingContext.STREAM_DRAW;
        var v82 : int/*GLenum*/ = o.STREAM_DRAW;
        var v83 : int/*GLenum*/ = WebGLRenderingContext.STATIC_DRAW;
        var v84 : int/*GLenum*/ = o.STATIC_DRAW;
        var v85 : int/*GLenum*/ = WebGLRenderingContext.DYNAMIC_DRAW;
        var v86 : int/*GLenum*/ = o.DYNAMIC_DRAW;
        var v87 : int/*GLenum*/ = WebGLRenderingContext.BUFFER_SIZE;
        var v88 : int/*GLenum*/ = o.BUFFER_SIZE;
        var v89 : int/*GLenum*/ = WebGLRenderingContext.BUFFER_USAGE;
        var v90 : int/*GLenum*/ = o.BUFFER_USAGE;
        var v91 : int/*GLenum*/ = WebGLRenderingContext.CURRENT_VERTEX_ATTRIB;
        var v92 : int/*GLenum*/ = o.CURRENT_VERTEX_ATTRIB;
        var v93 : int/*GLenum*/ = WebGLRenderingContext.FRONT;
        var v94 : int/*GLenum*/ = o.FRONT;
        var v95 : int/*GLenum*/ = WebGLRenderingContext.BACK;
        var v96 : int/*GLenum*/ = o.BACK;
        var v97 : int/*GLenum*/ = WebGLRenderingContext.FRONT_AND_BACK;
        var v98 : int/*GLenum*/ = o.FRONT_AND_BACK;
        var v99 : int/*GLenum*/ = WebGLRenderingContext.CULL_FACE;
        var v100 : int/*GLenum*/ = o.CULL_FACE;
        var v101 : int/*GLenum*/ = WebGLRenderingContext.BLEND;
        var v102 : int/*GLenum*/ = o.BLEND;
        var v103 : int/*GLenum*/ = WebGLRenderingContext.DITHER;
        var v104 : int/*GLenum*/ = o.DITHER;
        var v105 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_TEST;
        var v106 : int/*GLenum*/ = o.STENCIL_TEST;
        var v107 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_TEST;
        var v108 : int/*GLenum*/ = o.DEPTH_TEST;
        var v109 : int/*GLenum*/ = WebGLRenderingContext.SCISSOR_TEST;
        var v110 : int/*GLenum*/ = o.SCISSOR_TEST;
        var v111 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_FILL;
        var v112 : int/*GLenum*/ = o.POLYGON_OFFSET_FILL;
        var v113 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE;
        var v114 : int/*GLenum*/ = o.SAMPLE_ALPHA_TO_COVERAGE;
        var v115 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE;
        var v116 : int/*GLenum*/ = o.SAMPLE_COVERAGE;
        var v117 : int/*GLenum*/ = WebGLRenderingContext.NO_ERROR;
        var v118 : int/*GLenum*/ = o.NO_ERROR;
        var v119 : int/*GLenum*/ = WebGLRenderingContext.INVALID_ENUM;
        var v120 : int/*GLenum*/ = o.INVALID_ENUM;
        var v121 : int/*GLenum*/ = WebGLRenderingContext.INVALID_VALUE;
        var v122 : int/*GLenum*/ = o.INVALID_VALUE;
        var v123 : int/*GLenum*/ = WebGLRenderingContext.INVALID_OPERATION;
        var v124 : int/*GLenum*/ = o.INVALID_OPERATION;
        var v125 : int/*GLenum*/ = WebGLRenderingContext.OUT_OF_MEMORY;
        var v126 : int/*GLenum*/ = o.OUT_OF_MEMORY;
        var v127 : int/*GLenum*/ = WebGLRenderingContext.CW;
        var v128 : int/*GLenum*/ = o.CW;
        var v129 : int/*GLenum*/ = WebGLRenderingContext.CCW;
        var v130 : int/*GLenum*/ = o.CCW;
        var v131 : int/*GLenum*/ = WebGLRenderingContext.LINE_WIDTH;
        var v132 : int/*GLenum*/ = o.LINE_WIDTH;
        var v133 : int/*GLenum*/ = WebGLRenderingContext.ALIASED_POINT_SIZE_RANGE;
        var v134 : int/*GLenum*/ = o.ALIASED_POINT_SIZE_RANGE;
        var v135 : int/*GLenum*/ = WebGLRenderingContext.ALIASED_LINE_WIDTH_RANGE;
        var v136 : int/*GLenum*/ = o.ALIASED_LINE_WIDTH_RANGE;
        var v137 : int/*GLenum*/ = WebGLRenderingContext.CULL_FACE_MODE;
        var v138 : int/*GLenum*/ = o.CULL_FACE_MODE;
        var v139 : int/*GLenum*/ = WebGLRenderingContext.FRONT_FACE;
        var v140 : int/*GLenum*/ = o.FRONT_FACE;
        var v141 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_RANGE;
        var v142 : int/*GLenum*/ = o.DEPTH_RANGE;
        var v143 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_WRITEMASK;
        var v144 : int/*GLenum*/ = o.DEPTH_WRITEMASK;
        var v145 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_CLEAR_VALUE;
        var v146 : int/*GLenum*/ = o.DEPTH_CLEAR_VALUE;
        var v147 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_FUNC;
        var v148 : int/*GLenum*/ = o.DEPTH_FUNC;
        var v149 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_CLEAR_VALUE;
        var v150 : int/*GLenum*/ = o.STENCIL_CLEAR_VALUE;
        var v151 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_FUNC;
        var v152 : int/*GLenum*/ = o.STENCIL_FUNC;
        var v153 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_FAIL;
        var v154 : int/*GLenum*/ = o.STENCIL_FAIL;
        var v155 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_PASS_DEPTH_FAIL;
        var v156 : int/*GLenum*/ = o.STENCIL_PASS_DEPTH_FAIL;
        var v157 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_PASS_DEPTH_PASS;
        var v158 : int/*GLenum*/ = o.STENCIL_PASS_DEPTH_PASS;
        var v159 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_REF;
        var v160 : int/*GLenum*/ = o.STENCIL_REF;
        var v161 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_VALUE_MASK;
        var v162 : int/*GLenum*/ = o.STENCIL_VALUE_MASK;
        var v163 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_WRITEMASK;
        var v164 : int/*GLenum*/ = o.STENCIL_WRITEMASK;
        var v165 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_FUNC;
        var v166 : int/*GLenum*/ = o.STENCIL_BACK_FUNC;
        var v167 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_FAIL;
        var v168 : int/*GLenum*/ = o.STENCIL_BACK_FAIL;
        var v169 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_FAIL;
        var v170 : int/*GLenum*/ = o.STENCIL_BACK_PASS_DEPTH_FAIL;
        var v171 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_PASS;
        var v172 : int/*GLenum*/ = o.STENCIL_BACK_PASS_DEPTH_PASS;
        var v173 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_REF;
        var v174 : int/*GLenum*/ = o.STENCIL_BACK_REF;
        var v175 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_VALUE_MASK;
        var v176 : int/*GLenum*/ = o.STENCIL_BACK_VALUE_MASK;
        var v177 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_WRITEMASK;
        var v178 : int/*GLenum*/ = o.STENCIL_BACK_WRITEMASK;
        var v179 : int/*GLenum*/ = WebGLRenderingContext.VIEWPORT;
        var v180 : int/*GLenum*/ = o.VIEWPORT;
        var v181 : int/*GLenum*/ = WebGLRenderingContext.SCISSOR_BOX;
        var v182 : int/*GLenum*/ = o.SCISSOR_BOX;
        var v183 : int/*GLenum*/ = WebGLRenderingContext.COLOR_CLEAR_VALUE;
        var v184 : int/*GLenum*/ = o.COLOR_CLEAR_VALUE;
        var v185 : int/*GLenum*/ = WebGLRenderingContext.COLOR_WRITEMASK;
        var v186 : int/*GLenum*/ = o.COLOR_WRITEMASK;
        var v187 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_ALIGNMENT;
        var v188 : int/*GLenum*/ = o.UNPACK_ALIGNMENT;
        var v189 : int/*GLenum*/ = WebGLRenderingContext.PACK_ALIGNMENT;
        var v190 : int/*GLenum*/ = o.PACK_ALIGNMENT;
        var v191 : int/*GLenum*/ = WebGLRenderingContext.MAX_TEXTURE_SIZE;
        var v192 : int/*GLenum*/ = o.MAX_TEXTURE_SIZE;
        var v193 : int/*GLenum*/ = WebGLRenderingContext.MAX_VIEWPORT_DIMS;
        var v194 : int/*GLenum*/ = o.MAX_VIEWPORT_DIMS;
        var v195 : int/*GLenum*/ = WebGLRenderingContext.SUBPIXEL_BITS;
        var v196 : int/*GLenum*/ = o.SUBPIXEL_BITS;
        var v197 : int/*GLenum*/ = WebGLRenderingContext.RED_BITS;
        var v198 : int/*GLenum*/ = o.RED_BITS;
        var v199 : int/*GLenum*/ = WebGLRenderingContext.GREEN_BITS;
        var v200 : int/*GLenum*/ = o.GREEN_BITS;
        var v201 : int/*GLenum*/ = WebGLRenderingContext.BLUE_BITS;
        var v202 : int/*GLenum*/ = o.BLUE_BITS;
        var v203 : int/*GLenum*/ = WebGLRenderingContext.ALPHA_BITS;
        var v204 : int/*GLenum*/ = o.ALPHA_BITS;
        var v205 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_BITS;
        var v206 : int/*GLenum*/ = o.DEPTH_BITS;
        var v207 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BITS;
        var v208 : int/*GLenum*/ = o.STENCIL_BITS;
        var v209 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_UNITS;
        var v210 : int/*GLenum*/ = o.POLYGON_OFFSET_UNITS;
        var v211 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_FACTOR;
        var v212 : int/*GLenum*/ = o.POLYGON_OFFSET_FACTOR;
        var v213 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_BINDING_2D;
        var v214 : int/*GLenum*/ = o.TEXTURE_BINDING_2D;
        var v215 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_BUFFERS;
        var v216 : int/*GLenum*/ = o.SAMPLE_BUFFERS;
        var v217 : int/*GLenum*/ = WebGLRenderingContext.SAMPLES;
        var v218 : int/*GLenum*/ = o.SAMPLES;
        var v219 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE_VALUE;
        var v220 : int/*GLenum*/ = o.SAMPLE_COVERAGE_VALUE;
        var v221 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE_INVERT;
        var v222 : int/*GLenum*/ = o.SAMPLE_COVERAGE_INVERT;
        var v223 : int/*GLenum*/ = WebGLRenderingContext.COMPRESSED_TEXTURE_FORMATS;
        var v224 : int/*GLenum*/ = o.COMPRESSED_TEXTURE_FORMATS;
        var v225 : int/*GLenum*/ = WebGLRenderingContext.DONT_CARE;
        var v226 : int/*GLenum*/ = o.DONT_CARE;
        var v227 : int/*GLenum*/ = WebGLRenderingContext.FASTEST;
        var v228 : int/*GLenum*/ = o.FASTEST;
        var v229 : int/*GLenum*/ = WebGLRenderingContext.NICEST;
        var v230 : int/*GLenum*/ = o.NICEST;
        var v231 : int/*GLenum*/ = WebGLRenderingContext.GENERATE_MIPMAP_HINT;
        var v232 : int/*GLenum*/ = o.GENERATE_MIPMAP_HINT;
        var v233 : int/*GLenum*/ = WebGLRenderingContext.BYTE;
        var v234 : int/*GLenum*/ = o.BYTE;
        var v235 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_BYTE;
        var v236 : int/*GLenum*/ = o.UNSIGNED_BYTE;
        var v237 : int/*GLenum*/ = WebGLRenderingContext.SHORT;
        var v238 : int/*GLenum*/ = o.SHORT;
        var v239 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT;
        var v240 : int/*GLenum*/ = o.UNSIGNED_SHORT;
        var v241 : int/*GLenum*/ = WebGLRenderingContext.INT;
        var v242 : int/*GLenum*/ = o.INT;
        var v243 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_INT;
        var v244 : int/*GLenum*/ = o.UNSIGNED_INT;
        var v245 : int/*GLenum*/ = WebGLRenderingContext.FLOAT;
        var v246 : int/*GLenum*/ = o.FLOAT;
        var v247 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_COMPONENT;
        var v248 : int/*GLenum*/ = o.DEPTH_COMPONENT;
        var v249 : int/*GLenum*/ = WebGLRenderingContext.ALPHA;
        var v250 : int/*GLenum*/ = o.ALPHA;
        var v251 : int/*GLenum*/ = WebGLRenderingContext.RGB;
        var v252 : int/*GLenum*/ = o.RGB;
        var v253 : int/*GLenum*/ = WebGLRenderingContext.RGBA;
        var v254 : int/*GLenum*/ = o.RGBA;
        var v255 : int/*GLenum*/ = WebGLRenderingContext.LUMINANCE;
        var v256 : int/*GLenum*/ = o.LUMINANCE;
        var v257 : int/*GLenum*/ = WebGLRenderingContext.LUMINANCE_ALPHA;
        var v258 : int/*GLenum*/ = o.LUMINANCE_ALPHA;
        var v259 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        var v260 : int/*GLenum*/ = o.UNSIGNED_SHORT_4_4_4_4;
        var v261 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        var v262 : int/*GLenum*/ = o.UNSIGNED_SHORT_5_5_5_1;
        var v263 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        var v264 : int/*GLenum*/ = o.UNSIGNED_SHORT_5_6_5;
        var v265 : int/*GLenum*/ = WebGLRenderingContext.FRAGMENT_SHADER;
        var v266 : int/*GLenum*/ = o.FRAGMENT_SHADER;
        var v267 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_SHADER;
        var v268 : int/*GLenum*/ = o.VERTEX_SHADER;
        var v269 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_ATTRIBS;
        var v270 : int/*GLenum*/ = o.MAX_VERTEX_ATTRIBS;
        var v271 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS;
        var v272 : int/*GLenum*/ = o.MAX_VERTEX_UNIFORM_VECTORS;
        var v273 : int/*GLenum*/ = WebGLRenderingContext.MAX_VARYING_VECTORS;
        var v274 : int/*GLenum*/ = o.MAX_VARYING_VECTORS;
        var v275 : int/*GLenum*/ = WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        var v276 : int/*GLenum*/ = o.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        var v277 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS;
        var v278 : int/*GLenum*/ = o.MAX_VERTEX_TEXTURE_IMAGE_UNITS;
        var v279 : int/*GLenum*/ = WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS;
        var v280 : int/*GLenum*/ = o.MAX_TEXTURE_IMAGE_UNITS;
        var v281 : int/*GLenum*/ = WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS;
        var v282 : int/*GLenum*/ = o.MAX_FRAGMENT_UNIFORM_VECTORS;
        var v283 : int/*GLenum*/ = WebGLRenderingContext.SHADER_TYPE;
        var v284 : int/*GLenum*/ = o.SHADER_TYPE;
        var v285 : int/*GLenum*/ = WebGLRenderingContext.DELETE_STATUS;
        var v286 : int/*GLenum*/ = o.DELETE_STATUS;
        var v287 : int/*GLenum*/ = WebGLRenderingContext.LINK_STATUS;
        var v288 : int/*GLenum*/ = o.LINK_STATUS;
        var v289 : int/*GLenum*/ = WebGLRenderingContext.VALIDATE_STATUS;
        var v290 : int/*GLenum*/ = o.VALIDATE_STATUS;
        var v291 : int/*GLenum*/ = WebGLRenderingContext.ATTACHED_SHADERS;
        var v292 : int/*GLenum*/ = o.ATTACHED_SHADERS;
        var v293 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_UNIFORMS;
        var v294 : int/*GLenum*/ = o.ACTIVE_UNIFORMS;
        var v295 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_ATTRIBUTES;
        var v296 : int/*GLenum*/ = o.ACTIVE_ATTRIBUTES;
        var v297 : int/*GLenum*/ = WebGLRenderingContext.SHADING_LANGUAGE_VERSION;
        var v298 : int/*GLenum*/ = o.SHADING_LANGUAGE_VERSION;
        var v299 : int/*GLenum*/ = WebGLRenderingContext.CURRENT_PROGRAM;
        var v300 : int/*GLenum*/ = o.CURRENT_PROGRAM;
        var v301 : int/*GLenum*/ = WebGLRenderingContext.NEVER;
        var v302 : int/*GLenum*/ = o.NEVER;
        var v303 : int/*GLenum*/ = WebGLRenderingContext.LESS;
        var v304 : int/*GLenum*/ = o.LESS;
        var v305 : int/*GLenum*/ = WebGLRenderingContext.EQUAL;
        var v306 : int/*GLenum*/ = o.EQUAL;
        var v307 : int/*GLenum*/ = WebGLRenderingContext.LEQUAL;
        var v308 : int/*GLenum*/ = o.LEQUAL;
        var v309 : int/*GLenum*/ = WebGLRenderingContext.GREATER;
        var v310 : int/*GLenum*/ = o.GREATER;
        var v311 : int/*GLenum*/ = WebGLRenderingContext.NOTEQUAL;
        var v312 : int/*GLenum*/ = o.NOTEQUAL;
        var v313 : int/*GLenum*/ = WebGLRenderingContext.GEQUAL;
        var v314 : int/*GLenum*/ = o.GEQUAL;
        var v315 : int/*GLenum*/ = WebGLRenderingContext.ALWAYS;
        var v316 : int/*GLenum*/ = o.ALWAYS;
        var v317 : int/*GLenum*/ = WebGLRenderingContext.KEEP;
        var v318 : int/*GLenum*/ = o.KEEP;
        var v319 : int/*GLenum*/ = WebGLRenderingContext.REPLACE;
        var v320 : int/*GLenum*/ = o.REPLACE;
        var v321 : int/*GLenum*/ = WebGLRenderingContext.INCR;
        var v322 : int/*GLenum*/ = o.INCR;
        var v323 : int/*GLenum*/ = WebGLRenderingContext.DECR;
        var v324 : int/*GLenum*/ = o.DECR;
        var v325 : int/*GLenum*/ = WebGLRenderingContext.INVERT;
        var v326 : int/*GLenum*/ = o.INVERT;
        var v327 : int/*GLenum*/ = WebGLRenderingContext.INCR_WRAP;
        var v328 : int/*GLenum*/ = o.INCR_WRAP;
        var v329 : int/*GLenum*/ = WebGLRenderingContext.DECR_WRAP;
        var v330 : int/*GLenum*/ = o.DECR_WRAP;
        var v331 : int/*GLenum*/ = WebGLRenderingContext.VENDOR;
        var v332 : int/*GLenum*/ = o.VENDOR;
        var v333 : int/*GLenum*/ = WebGLRenderingContext.RENDERER;
        var v334 : int/*GLenum*/ = o.RENDERER;
        var v335 : int/*GLenum*/ = WebGLRenderingContext.VERSION;
        var v336 : int/*GLenum*/ = o.VERSION;
        var v337 : int/*GLenum*/ = WebGLRenderingContext.NEAREST;
        var v338 : int/*GLenum*/ = o.NEAREST;
        var v339 : int/*GLenum*/ = WebGLRenderingContext.LINEAR;
        var v340 : int/*GLenum*/ = o.LINEAR;
        var v341 : int/*GLenum*/ = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
        var v342 : int/*GLenum*/ = o.NEAREST_MIPMAP_NEAREST;
        var v343 : int/*GLenum*/ = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
        var v344 : int/*GLenum*/ = o.LINEAR_MIPMAP_NEAREST;
        var v345 : int/*GLenum*/ = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
        var v346 : int/*GLenum*/ = o.NEAREST_MIPMAP_LINEAR;
        var v347 : int/*GLenum*/ = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
        var v348 : int/*GLenum*/ = o.LINEAR_MIPMAP_LINEAR;
        var v349 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_MAG_FILTER;
        var v350 : int/*GLenum*/ = o.TEXTURE_MAG_FILTER;
        var v351 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_MIN_FILTER;
        var v352 : int/*GLenum*/ = o.TEXTURE_MIN_FILTER;
        var v353 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_WRAP_S;
        var v354 : int/*GLenum*/ = o.TEXTURE_WRAP_S;
        var v355 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_WRAP_T;
        var v356 : int/*GLenum*/ = o.TEXTURE_WRAP_T;
        var v357 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_2D;
        var v358 : int/*GLenum*/ = o.TEXTURE_2D;
        var v359 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE;
        var v360 : int/*GLenum*/ = o.TEXTURE;
        var v361 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP;
        var v362 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP;
        var v363 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_BINDING_CUBE_MAP;
        var v364 : int/*GLenum*/ = o.TEXTURE_BINDING_CUBE_MAP;
        var v365 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X;
        var v366 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_X;
        var v367 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X;
        var v368 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_X;
        var v369 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y;
        var v370 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_Y;
        var v371 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        var v372 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        var v373 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z;
        var v374 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_Z;
        var v375 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        var v376 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        var v377 : int/*GLenum*/ = WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE;
        var v378 : int/*GLenum*/ = o.MAX_CUBE_MAP_TEXTURE_SIZE;
        var v379 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE0;
        var v380 : int/*GLenum*/ = o.TEXTURE0;
        var v381 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE1;
        var v382 : int/*GLenum*/ = o.TEXTURE1;
        var v383 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE2;
        var v384 : int/*GLenum*/ = o.TEXTURE2;
        var v385 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE3;
        var v386 : int/*GLenum*/ = o.TEXTURE3;
        var v387 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE4;
        var v388 : int/*GLenum*/ = o.TEXTURE4;
        var v389 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE5;
        var v390 : int/*GLenum*/ = o.TEXTURE5;
        var v391 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE6;
        var v392 : int/*GLenum*/ = o.TEXTURE6;
        var v393 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE7;
        var v394 : int/*GLenum*/ = o.TEXTURE7;
        var v395 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE8;
        var v396 : int/*GLenum*/ = o.TEXTURE8;
        var v397 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE9;
        var v398 : int/*GLenum*/ = o.TEXTURE9;
        var v399 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE10;
        var v400 : int/*GLenum*/ = o.TEXTURE10;
        var v401 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE11;
        var v402 : int/*GLenum*/ = o.TEXTURE11;
        var v403 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE12;
        var v404 : int/*GLenum*/ = o.TEXTURE12;
        var v405 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE13;
        var v406 : int/*GLenum*/ = o.TEXTURE13;
        var v407 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE14;
        var v408 : int/*GLenum*/ = o.TEXTURE14;
        var v409 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE15;
        var v410 : int/*GLenum*/ = o.TEXTURE15;
        var v411 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE16;
        var v412 : int/*GLenum*/ = o.TEXTURE16;
        var v413 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE17;
        var v414 : int/*GLenum*/ = o.TEXTURE17;
        var v415 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE18;
        var v416 : int/*GLenum*/ = o.TEXTURE18;
        var v417 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE19;
        var v418 : int/*GLenum*/ = o.TEXTURE19;
        var v419 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE20;
        var v420 : int/*GLenum*/ = o.TEXTURE20;
        var v421 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE21;
        var v422 : int/*GLenum*/ = o.TEXTURE21;
        var v423 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE22;
        var v424 : int/*GLenum*/ = o.TEXTURE22;
        var v425 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE23;
        var v426 : int/*GLenum*/ = o.TEXTURE23;
        var v427 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE24;
        var v428 : int/*GLenum*/ = o.TEXTURE24;
        var v429 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE25;
        var v430 : int/*GLenum*/ = o.TEXTURE25;
        var v431 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE26;
        var v432 : int/*GLenum*/ = o.TEXTURE26;
        var v433 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE27;
        var v434 : int/*GLenum*/ = o.TEXTURE27;
        var v435 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE28;
        var v436 : int/*GLenum*/ = o.TEXTURE28;
        var v437 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE29;
        var v438 : int/*GLenum*/ = o.TEXTURE29;
        var v439 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE30;
        var v440 : int/*GLenum*/ = o.TEXTURE30;
        var v441 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE31;
        var v442 : int/*GLenum*/ = o.TEXTURE31;
        var v443 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_TEXTURE;
        var v444 : int/*GLenum*/ = o.ACTIVE_TEXTURE;
        var v445 : int/*GLenum*/ = WebGLRenderingContext.REPEAT;
        var v446 : int/*GLenum*/ = o.REPEAT;
        var v447 : int/*GLenum*/ = WebGLRenderingContext.CLAMP_TO_EDGE;
        var v448 : int/*GLenum*/ = o.CLAMP_TO_EDGE;
        var v449 : int/*GLenum*/ = WebGLRenderingContext.MIRRORED_REPEAT;
        var v450 : int/*GLenum*/ = o.MIRRORED_REPEAT;
        var v451 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC2;
        var v452 : int/*GLenum*/ = o.FLOAT_VEC2;
        var v453 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC3;
        var v454 : int/*GLenum*/ = o.FLOAT_VEC3;
        var v455 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC4;
        var v456 : int/*GLenum*/ = o.FLOAT_VEC4;
        var v457 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC2;
        var v458 : int/*GLenum*/ = o.INT_VEC2;
        var v459 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC3;
        var v460 : int/*GLenum*/ = o.INT_VEC3;
        var v461 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC4;
        var v462 : int/*GLenum*/ = o.INT_VEC4;
        var v463 : int/*GLenum*/ = WebGLRenderingContext.BOOL;
        var v464 : int/*GLenum*/ = o.BOOL;
        var v465 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC2;
        var v466 : int/*GLenum*/ = o.BOOL_VEC2;
        var v467 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC3;
        var v468 : int/*GLenum*/ = o.BOOL_VEC3;
        var v469 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC4;
        var v470 : int/*GLenum*/ = o.BOOL_VEC4;
        var v471 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT2;
        var v472 : int/*GLenum*/ = o.FLOAT_MAT2;
        var v473 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT3;
        var v474 : int/*GLenum*/ = o.FLOAT_MAT3;
        var v475 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT4;
        var v476 : int/*GLenum*/ = o.FLOAT_MAT4;
        var v477 : int/*GLenum*/ = WebGLRenderingContext.SAMPLER_2D;
        var v478 : int/*GLenum*/ = o.SAMPLER_2D;
        var v479 : int/*GLenum*/ = WebGLRenderingContext.SAMPLER_CUBE;
        var v480 : int/*GLenum*/ = o.SAMPLER_CUBE;
        var v481 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_ENABLED;
        var v482 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_ENABLED;
        var v483 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_SIZE;
        var v484 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_SIZE;
        var v485 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_STRIDE;
        var v486 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_STRIDE;
        var v487 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_TYPE;
        var v488 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_TYPE;
        var v489 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_NORMALIZED;
        var v490 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_NORMALIZED;
        var v491 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_POINTER;
        var v492 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_POINTER;
        var v493 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
        var v494 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
        var v495 : int/*GLenum*/ = WebGLRenderingContext.COMPILE_STATUS;
        var v496 : int/*GLenum*/ = o.COMPILE_STATUS;
        var v497 : int/*GLenum*/ = WebGLRenderingContext.LOW_FLOAT;
        var v498 : int/*GLenum*/ = o.LOW_FLOAT;
        var v499 : int/*GLenum*/ = WebGLRenderingContext.MEDIUM_FLOAT;
        var v500 : int/*GLenum*/ = o.MEDIUM_FLOAT;
        var v501 : int/*GLenum*/ = WebGLRenderingContext.HIGH_FLOAT;
        var v502 : int/*GLenum*/ = o.HIGH_FLOAT;
        var v503 : int/*GLenum*/ = WebGLRenderingContext.LOW_INT;
        var v504 : int/*GLenum*/ = o.LOW_INT;
        var v505 : int/*GLenum*/ = WebGLRenderingContext.MEDIUM_INT;
        var v506 : int/*GLenum*/ = o.MEDIUM_INT;
        var v507 : int/*GLenum*/ = WebGLRenderingContext.HIGH_INT;
        var v508 : int/*GLenum*/ = o.HIGH_INT;
        var v509 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER;
        var v510 : int/*GLenum*/ = o.FRAMEBUFFER;
        var v511 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER;
        var v512 : int/*GLenum*/ = o.RENDERBUFFER;
        var v513 : int/*GLenum*/ = WebGLRenderingContext.RGBA4;
        var v514 : int/*GLenum*/ = o.RGBA4;
        var v515 : int/*GLenum*/ = WebGLRenderingContext.RGB5_A1;
        var v516 : int/*GLenum*/ = o.RGB5_A1;
        var v517 : int/*GLenum*/ = WebGLRenderingContext.RGB565;
        var v518 : int/*GLenum*/ = o.RGB565;
        var v519 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_COMPONENT16;
        var v520 : int/*GLenum*/ = o.DEPTH_COMPONENT16;
        var v521 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_INDEX;
        var v522 : int/*GLenum*/ = o.STENCIL_INDEX;
        var v523 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_INDEX8;
        var v524 : int/*GLenum*/ = o.STENCIL_INDEX8;
        var v525 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_STENCIL;
        var v526 : int/*GLenum*/ = o.DEPTH_STENCIL;
        var v527 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_WIDTH;
        var v528 : int/*GLenum*/ = o.RENDERBUFFER_WIDTH;
        var v529 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_HEIGHT;
        var v530 : int/*GLenum*/ = o.RENDERBUFFER_HEIGHT;
        var v531 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_INTERNAL_FORMAT;
        var v532 : int/*GLenum*/ = o.RENDERBUFFER_INTERNAL_FORMAT;
        var v533 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_RED_SIZE;
        var v534 : int/*GLenum*/ = o.RENDERBUFFER_RED_SIZE;
        var v535 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_GREEN_SIZE;
        var v536 : int/*GLenum*/ = o.RENDERBUFFER_GREEN_SIZE;
        var v537 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_BLUE_SIZE;
        var v538 : int/*GLenum*/ = o.RENDERBUFFER_BLUE_SIZE;
        var v539 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_ALPHA_SIZE;
        var v540 : int/*GLenum*/ = o.RENDERBUFFER_ALPHA_SIZE;
        var v541 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_DEPTH_SIZE;
        var v542 : int/*GLenum*/ = o.RENDERBUFFER_DEPTH_SIZE;
        var v543 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_STENCIL_SIZE;
        var v544 : int/*GLenum*/ = o.RENDERBUFFER_STENCIL_SIZE;
        var v545 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
        var v546 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
        var v547 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
        var v548 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
        var v549 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
        var v550 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
        var v551 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
        var v552 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
        var v553 : int/*GLenum*/ = WebGLRenderingContext.COLOR_ATTACHMENT0;
        var v554 : int/*GLenum*/ = o.COLOR_ATTACHMENT0;
        var v555 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_ATTACHMENT;
        var v556 : int/*GLenum*/ = o.DEPTH_ATTACHMENT;
        var v557 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_ATTACHMENT;
        var v558 : int/*GLenum*/ = o.STENCIL_ATTACHMENT;
        var v559 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT;
        var v560 : int/*GLenum*/ = o.DEPTH_STENCIL_ATTACHMENT;
        var v561 : int/*GLenum*/ = WebGLRenderingContext.NONE;
        var v562 : int/*GLenum*/ = o.NONE;
        var v563 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_COMPLETE;
        var v564 : int/*GLenum*/ = o.FRAMEBUFFER_COMPLETE;
        var v565 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
        var v566 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
        var v567 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
        var v568 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
        var v569 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
        var v570 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
        var v571 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_UNSUPPORTED;
        var v572 : int/*GLenum*/ = o.FRAMEBUFFER_UNSUPPORTED;
        var v573 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_BINDING;
        var v574 : int/*GLenum*/ = o.FRAMEBUFFER_BINDING;
        var v575 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_BINDING;
        var v576 : int/*GLenum*/ = o.RENDERBUFFER_BINDING;
        var v577 : int/*GLenum*/ = WebGLRenderingContext.MAX_RENDERBUFFER_SIZE;
        var v578 : int/*GLenum*/ = o.MAX_RENDERBUFFER_SIZE;
        var v579 : int/*GLenum*/ = WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION;
        var v580 : int/*GLenum*/ = o.INVALID_FRAMEBUFFER_OPERATION;
        var v581 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL;
        var v582 : int/*GLenum*/ = o.UNPACK_FLIP_Y_WEBGL;
        var v583 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        var v584 : int/*GLenum*/ = o.UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        var v585 : int/*GLenum*/ = WebGLRenderingContext.CONTEXT_LOST_WEBGL;
        var v586 : int/*GLenum*/ = o.CONTEXT_LOST_WEBGL;
        var v587 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL;
        var v588 : int/*GLenum*/ = o.UNPACK_COLORSPACE_CONVERSION_WEBGL;
        var v589 : int/*GLenum*/ = WebGLRenderingContext.BROWSER_DEFAULT_WEBGL;
        var v590 : int/*GLenum*/ = o.BROWSER_DEFAULT_WEBGL;
        var v591 : HTMLCanvasElement = o.canvas;
        var v592 : int/*GLsizei*/ = o.drawingBufferWidth;
        var v593 : int/*GLsizei*/ = o.drawingBufferHeight;
        var f594 : WebGLContextAttributes = o.getContextAttributes();
        var f595 : boolean = o.isContextLost();
        var f596 : string[]/*sequence<DOMString>?*/ = o.getSupportedExtensions();
        var f597 : Object/*object?*/ = o.getExtension(X.getstring());
        o.activeTexture(X.getint());
        o.attachShader(X.getWebGLProgram(), X.getWebGLShader());
        o.bindAttribLocation(X.getWebGLProgram(), X.getint(), X.getstring());
        o.bindBuffer(X.getint(), X.getWebGLBuffer());
        o.bindFramebuffer(X.getint(), X.getWebGLFramebuffer());
        o.bindRenderbuffer(X.getint(), X.getWebGLRenderbuffer());
        o.bindTexture(X.getint(), X.getWebGLTexture());
        o.blendColor(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.blendEquation(X.getint());
        o.blendEquationSeparate(X.getint(), X.getint());
        o.blendFunc(X.getint(), X.getint());
        o.blendFuncSeparate(X.getint(), X.getint(), X.getint(), X.getint());
        o.bufferData(X.getint(), X.getnumber(), X.getint());
        o.bufferData(X.getint(), X.getArrayBufferView(), X.getint());
        o.bufferData(X.getint(), X.getArrayBuffer(), X.getint());
        o.bufferSubData(X.getint(), X.getnumber(), X.getArrayBufferView());
        o.bufferSubData(X.getint(), X.getnumber(), X.getArrayBuffer());
        var f598 : int/*GLenum*/ = o.checkFramebufferStatus(X.getint());
        o.clear(X.getint());
        o.clearColor(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.clearDepth(X.getnumber());
        o.clearStencil(X.getint());
        o.colorMask(X.getboolean(), X.getboolean(), X.getboolean(), X.getboolean());
        o.compileShader(X.getWebGLShader());
        o.compressedTexImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getArrayBufferView());
        o.compressedTexSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getArrayBufferView());
        o.copyTexImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint());
        o.copyTexSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint());
        var f599 : WebGLBuffer = o.createBuffer();
        var f600 : WebGLFramebuffer = o.createFramebuffer();
        var f601 : WebGLProgram = o.createProgram();
        var f602 : WebGLRenderbuffer = o.createRenderbuffer();
        var f603 : WebGLShader = o.createShader(X.getint());
        var f604 : WebGLTexture = o.createTexture();
        o.cullFace(X.getint());
        o.deleteBuffer(X.getWebGLBuffer());
        o.deleteFramebuffer(X.getWebGLFramebuffer());
        o.deleteProgram(X.getWebGLProgram());
        o.deleteRenderbuffer(X.getWebGLRenderbuffer());
        o.deleteShader(X.getWebGLShader());
        o.deleteTexture(X.getWebGLTexture());
        o.depthFunc(X.getint());
        o.depthMask(X.getboolean());
        o.depthRange(X.getnumber(), X.getnumber());
        o.detachShader(X.getWebGLProgram(), X.getWebGLShader());
        o.disable(X.getint());
        o.disableVertexAttribArray(X.getint());
        o.drawArrays(X.getint(), X.getint(), X.getint());
        o.drawElements(X.getint(), X.getint(), X.getint(), X.getnumber());
        o.enable(X.getint());
        o.enableVertexAttribArray(X.getint());
        o.finish();
        o.flush();
        o.framebufferRenderbuffer(X.getint(), X.getint(), X.getint(), X.getWebGLRenderbuffer());
        o.framebufferTexture2D(X.getint(), X.getint(), X.getint(), X.getWebGLTexture(), X.getint());
        o.frontFace(X.getint());
        o.generateMipmap(X.getint());
        var f605 : WebGLActiveInfo = o.getActiveAttrib(X.getWebGLProgram(), X.getint());
        var f606 : WebGLActiveInfo = o.getActiveUniform(X.getWebGLProgram(), X.getint());
        var f607 : WebGLShader[] = o.getAttachedShaders(X.getWebGLProgram());
        var f608 : int/*GLint*/ = o.getAttribLocation(X.getWebGLProgram(), X.getstring());
        var f609 : variant/*any*/ = o.getBufferParameter(X.getint(), X.getint());
        var f610 : variant/*any*/ = o.getParameter(X.getint());
        var f611 : int/*GLenum*/ = o.getError();
        var f612 : variant/*any*/ = o.getFramebufferAttachmentParameter(X.getint(), X.getint(), X.getint());
        var f613 : variant/*any*/ = o.getProgramParameter(X.getWebGLProgram(), X.getint());
        var f614 : string/*DOMString?*/ = o.getProgramInfoLog(X.getWebGLProgram());
        var f615 : variant/*any*/ = o.getRenderbufferParameter(X.getint(), X.getint());
        var f616 : variant/*any*/ = o.getShaderParameter(X.getWebGLShader(), X.getint());
        var f617 : WebGLShaderPrecisionFormat = o.getShaderPrecisionFormat(X.getint(), X.getint());
        var f618 : string/*DOMString?*/ = o.getShaderInfoLog(X.getWebGLShader());
        var f619 : string/*DOMString?*/ = o.getShaderSource(X.getWebGLShader());
        var f620 : variant/*any*/ = o.getTexParameter(X.getint(), X.getint());
        var f621 : variant/*any*/ = o.getUniform(X.getWebGLProgram(), X.getWebGLUniformLocation());
        var f622 : WebGLUniformLocation = o.getUniformLocation(X.getWebGLProgram(), X.getstring());
        var f623 : variant/*any*/ = o.getVertexAttrib(X.getint(), X.getint());
        var f624 : number/*GLsizeiptr*/ = o.getVertexAttribOffset(X.getint(), X.getint());
        o.hint(X.getint(), X.getint());
        var f625 : boolean/*GLboolean*/ = o.isBuffer(X.getWebGLBuffer());
        var f626 : boolean/*GLboolean*/ = o.isEnabled(X.getint());
        var f627 : boolean/*GLboolean*/ = o.isFramebuffer(X.getWebGLFramebuffer());
        var f628 : boolean/*GLboolean*/ = o.isProgram(X.getWebGLProgram());
        var f629 : boolean/*GLboolean*/ = o.isRenderbuffer(X.getWebGLRenderbuffer());
        var f630 : boolean/*GLboolean*/ = o.isShader(X.getWebGLShader());
        var f631 : boolean/*GLboolean*/ = o.isTexture(X.getWebGLTexture());
        o.lineWidth(X.getnumber());
        o.linkProgram(X.getWebGLProgram());
        o.pixelStorei(X.getint(), X.getint());
        o.polygonOffset(X.getnumber(), X.getnumber());
        o.readPixels(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getArrayBufferView());
        o.renderbufferStorage(X.getint(), X.getint(), X.getint(), X.getint());
        o.sampleCoverage(X.getnumber(), X.getboolean());
        o.scissor(X.getint(), X.getint(), X.getint(), X.getint());
        o.shaderSource(X.getWebGLShader(), X.getstring());
        o.stencilFunc(X.getint(), X.getint(), X.getint());
        o.stencilFuncSeparate(X.getint(), X.getint(), X.getint(), X.getint());
        o.stencilMask(X.getint());
        o.stencilMaskSeparate(X.getint(), X.getint());
        o.stencilOp(X.getint(), X.getint(), X.getint());
        o.stencilOpSeparate(X.getint(), X.getint(), X.getint(), X.getint());
        o.texImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getArrayBufferView());
        o.texImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getImageData());
        o.texImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLImageElement());
        o.texImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLCanvasElement());
        o.texImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLVideoElement());
        o.texParameterf(X.getint(), X.getint(), X.getnumber());
        o.texParameteri(X.getint(), X.getint(), X.getint());
        o.texSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getArrayBufferView());
        o.texSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getImageData());
        o.texSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLImageElement());
        o.texSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLCanvasElement());
        o.texSubImage2D(X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getHTMLVideoElement());
        o.uniform1f(X.getWebGLUniformLocation(), X.getnumber());
        o.uniform1fv(X.getWebGLUniformLocation(), X.getFloat32Array());
        o.uniform1fv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform1i(X.getWebGLUniformLocation(), X.getint());
        o.uniform1iv(X.getWebGLUniformLocation(), X.getInt32Array());
        o.uniform1iv(X.getWebGLUniformLocation(), X.getint__());
        o.uniform1iv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform2f(X.getWebGLUniformLocation(), X.getnumber(), X.getnumber());
        o.uniform2fv(X.getWebGLUniformLocation(), X.getFloat32Array());
        o.uniform2fv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform2i(X.getWebGLUniformLocation(), X.getint(), X.getint());
        o.uniform2iv(X.getWebGLUniformLocation(), X.getInt32Array());
        o.uniform2iv(X.getWebGLUniformLocation(), X.getint__());
        o.uniform2iv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform3f(X.getWebGLUniformLocation(), X.getnumber(), X.getnumber(), X.getnumber());
        o.uniform3fv(X.getWebGLUniformLocation(), X.getFloat32Array());
        o.uniform3fv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform3i(X.getWebGLUniformLocation(), X.getint(), X.getint(), X.getint());
        o.uniform3iv(X.getWebGLUniformLocation(), X.getInt32Array());
        o.uniform3iv(X.getWebGLUniformLocation(), X.getint__());
        o.uniform3iv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform4f(X.getWebGLUniformLocation(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.uniform4fv(X.getWebGLUniformLocation(), X.getFloat32Array());
        o.uniform4fv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniform4i(X.getWebGLUniformLocation(), X.getint(), X.getint(), X.getint(), X.getint());
        o.uniform4iv(X.getWebGLUniformLocation(), X.getInt32Array());
        o.uniform4iv(X.getWebGLUniformLocation(), X.getint__());
        o.uniform4iv(X.getWebGLUniformLocation(), X.getnumber__());
        o.uniformMatrix2fv(X.getWebGLUniformLocation(), X.getboolean(), X.getFloat32Array());
        o.uniformMatrix2fv(X.getWebGLUniformLocation(), X.getboolean(), X.getnumber__());
        o.uniformMatrix3fv(X.getWebGLUniformLocation(), X.getboolean(), X.getFloat32Array());
        o.uniformMatrix3fv(X.getWebGLUniformLocation(), X.getboolean(), X.getnumber__());
        o.uniformMatrix4fv(X.getWebGLUniformLocation(), X.getboolean(), X.getFloat32Array());
        o.uniformMatrix4fv(X.getWebGLUniformLocation(), X.getboolean(), X.getnumber__());
        o.useProgram(X.getWebGLProgram());
        o.validateProgram(X.getWebGLProgram());
        o.vertexAttrib1f(X.getint(), X.getnumber());
        o.vertexAttrib1fv(X.getint(), X.getFloat32Array());
        o.vertexAttrib1fv(X.getint(), X.getnumber__());
        o.vertexAttrib2f(X.getint(), X.getnumber(), X.getnumber());
        o.vertexAttrib2fv(X.getint(), X.getFloat32Array());
        o.vertexAttrib2fv(X.getint(), X.getnumber__());
        o.vertexAttrib3f(X.getint(), X.getnumber(), X.getnumber(), X.getnumber());
        o.vertexAttrib3fv(X.getint(), X.getFloat32Array());
        o.vertexAttrib3fv(X.getint(), X.getnumber__());
        o.vertexAttrib4f(X.getint(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.vertexAttrib4fv(X.getint(), X.getFloat32Array());
        o.vertexAttrib4fv(X.getint(), X.getnumber__());
        o.vertexAttribPointer(X.getint(), X.getint(), X.getint(), X.getboolean(), X.getint(), X.getnumber());
        o.viewport(X.getint(), X.getint(), X.getint(), X.getint());
    } // WebGLRenderingContext

    // #267
    function compile_WebGLContextEvent(o : WebGLContextEvent) : void {
        var v1 : string/*DOMString*/ = o.statusMessage;
    } // WebGLContextEvent

    // #268
    function compile_WebGLContextEventInit(o : WebGLContextEventInit) : void {
        var v1 : string/*DOMString*/ = o.statusMessage;
    } // WebGLContextEventInit

    // #269
    function compile_WindowAnimationTiming(o : WindowAnimationTiming) : void {
        var f1 : int/*long*/ = o.requestAnimationFrame(X.getfunction__number__void());
        o.cancelAnimationFrame(X.getint());
        var f2 : int/*long*/ = o.webkitRequestAnimationFrame(X.getfunction__number__void());
        o.webkitCancelAnimationFrame(X.getint());
        var f3 : int/*long*/ = o.mozRequestAnimationFrame(X.getfunction__number__void());
        o.mozCancelAnimationFrame(X.getint());
    } // WindowAnimationTiming

    // #270
    function compile_CanvasPixelArray(o : CanvasPixelArray) : void {
        var v1 : int/*unsigned long*/ = o.length;
        var f2 : MayBeUndefined.<int/*octet*/> = o.__native_index_operator__(X.getint());
    } // CanvasPixelArray


    function test_compile() : void {
        this.expect(true).toBe(true);
    }

}

native class X {
    static function getAbstractView() : AbstractView;
    static function getAddress() : Address;
    static function getApplicationCache() : ApplicationCache;
    static function getArrayBuffer() : ArrayBuffer;
    static function getArrayBufferView() : ArrayBufferView;
    static function getAttr__() : Attr[];
    static function getAudioTrack() : AudioTrack;
    static function getAudioTrackList() : AudioTrackList;
    static function getBarProp() : BarProp;
    static function getBlob() : Blob;
    static function getCSSRule() : CSSRule;
    static function getCSSRule__() : CSSRule[]/*CSSRuleList*/;
    static function getCSSStyleDeclaration() : CSSStyleDeclaration;
    static function getCSSStyleSheet() : CSSStyleSheet;
    static function getCanvasGradient() : CanvasGradient;
    static function getCanvasPattern() : CanvasPattern;
    static function getCaretPosition() : CaretPosition;
    static function getClientRect() : ClientRect;
    static function getClientRectList() : ClientRectList;
    static function getComment() : Comment;
    static function getCoordinates() : Coordinates;
    static function getDOMError() : DOMError;
    static function getDOMImplementation() : DOMImplementation;
    static function getDOMSettableTokenList() : DOMSettableTokenList;
    static function getDOMStringList() : DOMStringList;
    static function getDOMStringMap() : DOMStringMap;
    static function getDOMTokenList() : DOMTokenList;
    static function getDataTransfer() : DataTransfer;
    static function getDataTransferItem() : DataTransferItem;
    static function getDataTransferItemList() : DataTransferItemList;
    static function getDate() : Date;
    static function getDocument() : Document;
    static function getDocumentFragment() : DocumentFragment;
    static function getDocumentType() : DocumentType;
    static function getDocumentView() : DocumentView;
    static function getElement() : Element;
    static function getEvent() : Event;
    static function getEventTarget() : EventTarget;
    static function getExternal() : External;
    static function getFile() : File;
    static function getFileList() : FileList;
    static function getFloat32Array() : Float32Array;
    static function getFloat64Array() : Float64Array;
    static function getFormData() : FormData;
    static function getFunctionStringCallback() : FunctionStringCallback;
    static function getGeolocation() : Geolocation;
    static function getHTMLAllCollection() : HTMLAllCollection;
    static function getHTMLCanvasElement() : HTMLCanvasElement;
    static function getHTMLCollection() : HTMLCollection;
    static function getHTMLDocument() : HTMLDocument/*Document*/;
    static function getHTMLElement() : HTMLElement;
    static function getHTMLFormControlsCollection() : HTMLFormControlsCollection;
    static function getHTMLFormElement() : HTMLFormElement;
    static function getHTMLHeadElement() : HTMLHeadElement;
    static function getHTMLImageElement() : HTMLImageElement;
    static function getHTMLMenuElement() : HTMLMenuElement;
    static function getHTMLOptGroupElement() : HTMLOptGroupElement;
    static function getHTMLOptionElement() : HTMLOptionElement;
    static function getHTMLOptionsCollection() : HTMLOptionsCollection;
    static function getHTMLTableCaptionElement() : HTMLTableCaptionElement;
    static function getHTMLTableSectionElement() : HTMLTableSectionElement;
    static function getHTMLVideoElement() : HTMLVideoElement;
    static function getHistory() : History;
    static function getImageData() : ImageData;
    static function getInt16Array() : Int16Array;
    static function getInt32Array() : Int32Array;
    static function getInt8Array() : Int8Array;
    static function getLocation() : Location;
    static function getMayBeUndefined__AudioTrack_() : MayBeUndefined.<AudioTrack>;
    static function getMayBeUndefined__ClientRect_() : MayBeUndefined.<ClientRect>;
    static function getMayBeUndefined__DataTransferItem_() : MayBeUndefined.<DataTransferItem>;
    static function getMayBeUndefined__Element_() : MayBeUndefined.<Element>;
    static function getMayBeUndefined__File_() : MayBeUndefined.<File>;
    static function getMayBeUndefined__Node_() : MayBeUndefined.<Node>;
    static function getMayBeUndefined__Object_() : MayBeUndefined.<Object/*object*/>;
    static function getMayBeUndefined__TextTrackCue_() : MayBeUndefined.<TextTrackCue>;
    static function getMayBeUndefined__TextTrack_() : MayBeUndefined.<TextTrack>;
    static function getMayBeUndefined__Touch_() : MayBeUndefined.<Touch>;
    static function getMayBeUndefined__VideoTrack_() : MayBeUndefined.<VideoTrack>;
    static function getMayBeUndefined__Window_() : MayBeUndefined.<Window/*WindowProxy*/>;
    static function getMayBeUndefined__int_() : MayBeUndefined.<int/*octet*/>;
    static function getMayBeUndefined__number_() : MayBeUndefined.<number/*double*/>;
    static function getMayBeUndefined__string_() : MayBeUndefined.<string/*DOMString*/>;
    static function getMediaController() : MediaController;
    static function getMediaError() : MediaError;
    static function getMediaList() : MediaList;
    static function getMediaQueryList() : MediaQueryList;
    static function getMessagePort() : MessagePort;
    static function getMessagePort__() : MessagePort[];
    static function getMutationObserverInit() : MutationObserverInit;
    static function getNavigator() : Navigator;
    static function getNode() : Node;
    static function getNodeFilter() : NodeFilter;
    static function getNodeIterator() : NodeIterator;
    static function getNodeList() : NodeList;
    static function getObject() : Object/*object?*/;
    static function getPosition() : Position;
    static function getPositionCallback() : PositionCallback;
    static function getPositionError() : PositionError;
    static function getPositionErrorCallback() : PositionErrorCallback;
    static function getPositionOptions() : PositionOptions;
    static function getProcessingInstruction() : ProcessingInstruction;
    static function getRange() : Range;
    static function getScreen() : Screen;
    static function getStorage() : Storage;
    static function getStyleSheet() : StyleSheet;
    static function getStyleSheet__() : StyleSheet[]/*StyleSheetList*/;
    static function getText() : Text;
    static function getTextMetrics() : TextMetrics;
    static function getTextTrack() : TextTrack;
    static function getTextTrackCue() : TextTrackCue;
    static function getTextTrackCueList() : TextTrackCueList;
    static function getTextTrackList() : TextTrackList;
    static function getTimeRanges() : TimeRanges;
    static function getTouch() : Touch;
    static function getTouchList() : TouchList;
    static function getTouch__() : Touch[];
    static function getTransferable__() : Transferable[];
    static function getTreeWalker() : TreeWalker;
    static function getUint16Array() : Uint16Array;
    static function getUint32Array() : Uint32Array;
    static function getUint8Array() : Uint8Array;
    static function getUint8ClampedArray() : Uint8ClampedArray;
    static function getValidityState() : ValidityState;
    static function getVideoTrack() : VideoTrack;
    static function getVideoTrackList() : VideoTrackList;
    static function getWebGLActiveInfo() : WebGLActiveInfo;
    static function getWebGLBuffer() : WebGLBuffer;
    static function getWebGLContextAttributes() : WebGLContextAttributes;
    static function getWebGLFramebuffer() : WebGLFramebuffer;
    static function getWebGLProgram() : WebGLProgram;
    static function getWebGLRenderbuffer() : WebGLRenderbuffer;
    static function getWebGLShader() : WebGLShader;
    static function getWebGLShaderPrecisionFormat() : WebGLShaderPrecisionFormat;
    static function getWebGLShader__() : WebGLShader[];
    static function getWebGLTexture() : WebGLTexture;
    static function getWebGLUniformLocation() : WebGLUniformLocation;
    static function getWindow() : Window/*WindowProxy?*/;
    static function getWorkerGlobalScope() : WorkerGlobalScope;
    static function getWorkerLocation() : WorkerLocation;
    static function getWorkerNavigator() : WorkerNavigator;
    static function getXMLDocument() : XMLDocument;
    static function getXMLHttpRequestUpload() : XMLHttpRequestUpload;
    static function getboolean() : boolean/*GLboolean*/;
    static function getfunction__Event__void() : function(:Event):void/*Function?*/;
    static function getfunction__File__void() : function(:File):void/*FileCallback?*/;
    static function getfunction__MediaQueryList__void() : function(:MediaQueryList):void/*MediaQueryListListener*/;
    static function getfunction___void() : function():void/*TimerHandler*/;
    static function getfunction__number__void() : function(:number):void/*FrameRequestCallback*/;
    static function getint() : int/*unsigned long*/;
    static function getint__() : int[]/*sequence<long>*/;
    static function getnumber() : number/*GLintptr*/;
    static function getnumber__() : number[]/*sequence<float>*/;
    static function getstring() : string/*DOMString*/;
    static function getstring__() : string[]/*sequence<DOMString>?*/;
    static function getvariant() : variant/*any*/;
}

