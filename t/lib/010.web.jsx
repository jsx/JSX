import "test-case.jsx";
import "js/web.jsx";

class _Test extends TestCase {


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


    function compile_DOMError(o : DOMError) : void {
        var v52 : string/*DOMString*/ = o.name;
    } // DOMError


    function compile_Event(o : Event) : void {
        var v53 : string/*DOMString*/ = o.type;
        var v54 : EventTarget = o.target;
        var v55 : EventTarget = o.currentTarget;
        var v56 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v57 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v58 : int/*unsigned short*/ = Event.AT_TARGET;
        var v59 : int/*unsigned short*/ = o.AT_TARGET;
        var v60 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v61 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v62 : int/*unsigned short*/ = o.eventPhase;
        o.stopPropagation();
        o.stopImmediatePropagation();
        var v63 : boolean = o.bubbles;
        var v64 : boolean = o.cancelable;
        o.preventDefault();
        var v65 : boolean = o.defaultPrevented;
        var v66 : boolean = o.isTrusted;
        var v67 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        var v68 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v69 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v70 : int/*unsigned short*/ = Event.AT_TARGET;
        var v71 : int/*unsigned short*/ = o.AT_TARGET;
        var v72 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v73 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v74 : string/*DOMString*/ = o.type;
        var v75 : EventTarget = o.target;
        var v76 : EventTarget = o.currentTarget;
        var v77 : int/*unsigned short*/ = o.eventPhase;
        var v78 : boolean = o.bubbles;
        var v79 : boolean = o.cancelable;
        var v80 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.stopPropagation();
        o.preventDefault();
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        o.stopImmediatePropagation();
        var v81 : boolean = o.defaultPrevented;
        var v82 : boolean = o.isTrusted;
        var v83 : int/*unsigned short*/ = Event.CAPTURING_PHASE;
        var v84 : int/*unsigned short*/ = o.CAPTURING_PHASE;
        var v85 : int/*unsigned short*/ = Event.AT_TARGET;
        var v86 : int/*unsigned short*/ = o.AT_TARGET;
        var v87 : int/*unsigned short*/ = Event.BUBBLING_PHASE;
        var v88 : int/*unsigned short*/ = o.BUBBLING_PHASE;
        var v89 : string/*DOMString*/ = o.type;
        var v90 : EventTarget = o.target;
        var v91 : EventTarget = o.currentTarget;
        var v92 : int/*unsigned short*/ = o.eventPhase;
        var v93 : boolean = o.bubbles;
        var v94 : boolean = o.cancelable;
        var v95 : number/*DOMTimeStamp*/ = o.timeStamp;
        o.stopPropagation();
        o.preventDefault();
        o.initEvent(X.getstring(), X.getboolean(), X.getboolean());
        o.stopImmediatePropagation();
        var v96 : boolean = o.defaultPrevented;
        var v97 : boolean = o.isTrusted;
    } // Event


    function compile_EventInit(o : EventInit) : void {
        var v98 : boolean = o.bubbles;
        var v99 : boolean = o.cancelable;
    } // EventInit


    function compile_CustomEvent(o : CustomEvent) : void {
        var v100 : variant/*any*/ = o.detail;
        var v101 : variant/*any*/ = o.detail;
        o.initCustomEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getvariant());
        var v102 : variant/*any*/ = o.detail;
        o.initCustomEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getvariant());
    } // CustomEvent


    function compile_CustomEventInit(o : CustomEventInit) : void {
        var v103 : variant/*any*/ = o.detail;
    } // CustomEventInit


    function compile_EventTarget(o : EventTarget) : void {
        o.addEventListener(X.getstring(), X.getfunction__Event__void());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f104 : boolean = o.dispatchEvent(X.getEvent());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f105 : boolean = o.dispatchEvent(X.getEvent());
        o.addEventListener(X.getstring(), X.getfunction__Event__void());
        o.addEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void());
        o.removeEventListener(X.getstring(), X.getfunction__Event__void(), X.getboolean());
        var f106 : boolean = o.dispatchEvent(X.getEvent());
    } // EventTarget


    function compile_MutationObserver(o : MutationObserver) : void {
        o.observe(X.getNode(), X.getMutationObserverInit());
        o.disconnect();
    } // MutationObserver


    function compile_MutationObserverInit(o : MutationObserverInit) : void {
        var v107 : boolean = o.childList;
        var v108 : boolean = o.attributes;
        var v109 : boolean = o.characterData;
        var v110 : boolean = o.subtree;
        var v111 : boolean = o.attributeOldValue;
        var v112 : boolean = o.characterDataOldValue;
        var v113 : string[]/*DOMString[]*/ = o.attributeFilter;
    } // MutationObserverInit


    function compile_MutationRecord(o : MutationRecord) : void {
        var v114 : string/*DOMString*/ = o.type;
        var v115 : Node = o.target;
        var v116 : NodeList = o.addedNodes;
        var v117 : NodeList = o.removedNodes;
        var v118 : Node = o.previousSibling;
        var v119 : Node = o.nextSibling;
        var v120 : string/*DOMString?*/ = o.attributeName;
        var v121 : string/*DOMString?*/ = o.attributeNamespace;
        var v122 : string/*DOMString?*/ = o.oldValue;
    } // MutationRecord


    function compile_Node(o : Node) : void {
        var v123 : int/*unsigned short*/ = Node.ELEMENT_NODE;
        var v124 : int/*unsigned short*/ = o.ELEMENT_NODE;
        var v125 : int/*unsigned short*/ = Node.ATTRIBUTE_NODE;
        var v126 : int/*unsigned short*/ = o.ATTRIBUTE_NODE;
        var v127 : int/*unsigned short*/ = Node.TEXT_NODE;
        var v128 : int/*unsigned short*/ = o.TEXT_NODE;
        var v129 : int/*unsigned short*/ = Node.CDATA_SECTION_NODE;
        var v130 : int/*unsigned short*/ = o.CDATA_SECTION_NODE;
        var v131 : int/*unsigned short*/ = Node.ENTITY_REFERENCE_NODE;
        var v132 : int/*unsigned short*/ = o.ENTITY_REFERENCE_NODE;
        var v133 : int/*unsigned short*/ = Node.ENTITY_NODE;
        var v134 : int/*unsigned short*/ = o.ENTITY_NODE;
        var v135 : int/*unsigned short*/ = Node.PROCESSING_INSTRUCTION_NODE;
        var v136 : int/*unsigned short*/ = o.PROCESSING_INSTRUCTION_NODE;
        var v137 : int/*unsigned short*/ = Node.COMMENT_NODE;
        var v138 : int/*unsigned short*/ = o.COMMENT_NODE;
        var v139 : int/*unsigned short*/ = Node.DOCUMENT_NODE;
        var v140 : int/*unsigned short*/ = o.DOCUMENT_NODE;
        var v141 : int/*unsigned short*/ = Node.DOCUMENT_TYPE_NODE;
        var v142 : int/*unsigned short*/ = o.DOCUMENT_TYPE_NODE;
        var v143 : int/*unsigned short*/ = Node.DOCUMENT_FRAGMENT_NODE;
        var v144 : int/*unsigned short*/ = o.DOCUMENT_FRAGMENT_NODE;
        var v145 : int/*unsigned short*/ = Node.NOTATION_NODE;
        var v146 : int/*unsigned short*/ = o.NOTATION_NODE;
        var v147 : int/*unsigned short*/ = o.nodeType;
        var v148 : string/*DOMString*/ = o.nodeName;
        var v149 : string/*DOMString?*/ = o.baseURI;
        var v150 : Document = o.ownerDocument;
        var v151 : Node = o.parentNode;
        var v152 : Element = o.parentElement;
        var f153 : boolean = o.hasChildNodes();
        var v154 : NodeList = o.childNodes;
        var v155 : Node = o.firstChild;
        var v156 : Node = o.lastChild;
        var v157 : Node = o.previousSibling;
        var v158 : Node = o.nextSibling;
        var v159 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_DISCONNECTED;
        var v160 : int/*unsigned short*/ = o.DOCUMENT_POSITION_DISCONNECTED;
        var v161 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_PRECEDING;
        var v162 : int/*unsigned short*/ = o.DOCUMENT_POSITION_PRECEDING;
        var v163 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_FOLLOWING;
        var v164 : int/*unsigned short*/ = o.DOCUMENT_POSITION_FOLLOWING;
        var v165 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_CONTAINS;
        var v166 : int/*unsigned short*/ = o.DOCUMENT_POSITION_CONTAINS;
        var v167 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_CONTAINED_BY;
        var v168 : int/*unsigned short*/ = o.DOCUMENT_POSITION_CONTAINED_BY;
        var v169 : int/*unsigned short*/ = Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        var v170 : int/*unsigned short*/ = o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        var f171 : int/*unsigned short*/ = o.compareDocumentPosition(X.getNode());
        var f172 : boolean = o.contains(X.getNode());
        var v173 : string/*DOMString?*/ = o.nodeValue;
        var v174 : string/*DOMString?*/ = o.textContent;
        var f175 : Node = o.insertBefore(X.getNode(), X.getNode());
        var f176 : Node = o.appendChild(X.getNode());
        var f177 : Node = o.replaceChild(X.getNode(), X.getNode());
        var f178 : Node = o.removeChild(X.getNode());
        o.normalize();
        var f179 : Node = o.cloneNode();
        var f180 : Node = o.cloneNode(X.getboolean());
        var f181 : boolean = o.isEqualNode(X.getNode());
        var f182 : string/*DOMString*/ = o.lookupPrefix(X.getstring());
        var f183 : string/*DOMString*/ = o.lookupNamespaceURI(X.getstring());
        var f184 : boolean = o.isDefaultNamespace(X.getstring());
    } // Node


    function compile_Document(o : Document) : void {
        var v185 : DOMImplementation = o.implementation;
        var v186 : string/*DOMString*/ = o.URL;
        var v187 : string/*DOMString*/ = o.documentURI;
        var v188 : string/*DOMString*/ = o.compatMode;
        var v189 : string/*DOMString*/ = o.characterSet;
        var v190 : string/*DOMString*/ = o.contentType;
        var v191 : DocumentType = o.doctype;
        var v192 : Element = o.documentElement;
        var f193 : HTMLCollection = o.getElementsByTagName(X.getstring());
        var f194 : HTMLCollection = o.getElementsByTagNameNS(X.getstring(), X.getstring());
        var f195 : HTMLCollection = o.getElementsByClassName(X.getstring());
        var f196 : Element = o.getElementById(X.getstring());
        var f197 : Element = o.createElement(X.getstring());
        var f198 : Element = o.createElementNS(X.getstring(), X.getstring());
        var f199 : DocumentFragment = o.createDocumentFragment();
        var f200 : Text = o.createTextNode(X.getstring());
        var f201 : Comment = o.createComment(X.getstring());
        var f202 : ProcessingInstruction = o.createProcessingInstruction(X.getstring(), X.getstring());
        var f203 : Node = o.importNode(X.getNode());
        var f204 : Node = o.importNode(X.getNode(), X.getboolean());
        var f205 : Node = o.adoptNode(X.getNode());
        var f206 : Event = o.createEvent(X.getstring());
        var f207 : Range = o.createRange();
        var f208 : NodeIterator = o.createNodeIterator(X.getNode());
        var f209 : NodeIterator = o.createNodeIterator(X.getNode(), X.getint());
        var f210 : NodeIterator = o.createNodeIterator(X.getNode(), X.getint(), X.getNodeFilter());
        var f211 : TreeWalker = o.createTreeWalker(X.getNode());
        var f212 : TreeWalker = o.createTreeWalker(X.getNode(), X.getint());
        var f213 : TreeWalker = o.createTreeWalker(X.getNode(), X.getint(), X.getNodeFilter());
        o.prepend();
        o.prepend(X.getNode());
        o.prepend();
        o.prepend(X.getstring());
        o.append();
        o.append(X.getNode());
        o.append();
        o.append(X.getstring());
        var f214 : Event = o.createEvent(X.getstring());
        var f215 : Event = o.createEvent(X.getstring());
        var v216 : StyleSheet[]/*StyleSheetList*/ = o.styleSheets;
        var v217 : string/*DOMString?*/ = o.selectedStyleSheetSet;
        var v218 : string/*DOMString?*/ = o.lastStyleSheetSet;
        var v219 : string/*DOMString?*/ = o.preferredStyleSheetSet;
        var v220 : DOMStringList = o.styleSheetSets;
        o.enableStyleSheetsForSet(X.getstring());
        var f221 : Element = o.elementFromPoint(X.getnumber(), X.getnumber());
        var f222 : CaretPosition = o.caretPositionFromPoint(X.getnumber(), X.getnumber());
        var f223 : Touch = o.createTouch(X.getAbstractView(), X.getEventTarget(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint());
        var f224 : TouchList = o.createTouchList(X.getTouch__());
        var f225 : TouchList = o.createTouchList(X.getTouch());
        var f226 : Element = o.querySelector(X.getstring());
        var f227 : NodeList = o.querySelectorAll(X.getstring());
    } // Document


    function compile_XMLDocument(o : XMLDocument) : void {
        var f228 : boolean = o.load(X.getstring());
    } // XMLDocument


    function compile_DOMImplementation(o : DOMImplementation) : void {
        var f229 : DocumentType = o.createDocumentType(X.getstring(), X.getstring(), X.getstring());
        var f230 : XMLDocument = o.createDocument(X.getstring(), X.getstring(), X.getDocumentType());
        var f231 : Document = o.createHTMLDocument(X.getstring());
        var f232 : boolean = o.hasFeature(X.getstring(), X.getstring());
    } // DOMImplementation


    function compile_DocumentFragment(o : DocumentFragment) : void {
        o.prepend();
        o.prepend(X.getNode());
        o.prepend();
        o.prepend(X.getstring());
        o.append();
        o.append(X.getNode());
        o.append();
        o.append(X.getstring());
        var f233 : Element = o.querySelector(X.getstring());
        var f234 : NodeList = o.querySelectorAll(X.getstring());
    } // DocumentFragment


    function compile_DocumentType(o : DocumentType) : void {
        var v235 : string/*DOMString*/ = o.name;
        var v236 : string/*DOMString*/ = o.publicId;
        var v237 : string/*DOMString*/ = o.systemId;
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


    function compile_Element(o : Element) : void {
        var v238 : string/*DOMString?*/ = o.namespaceURI;
        var v239 : string/*DOMString?*/ = o.prefix;
        var v240 : string/*DOMString*/ = o.localName;
        var v241 : string/*DOMString*/ = o.tagName;
        var v242 : string/*DOMString*/ = o.id;
        var v243 : string/*DOMString*/ = o.className;
        var v244 : DOMTokenList = o.classList;
        var v245 : Attr[] = o.attributes;
        var f246 : string/*DOMString?*/ = o.getAttribute(X.getstring());
        var f247 : string/*DOMString?*/ = o.getAttributeNS(X.getstring(), X.getstring());
        o.setAttribute(X.getstring(), X.getstring());
        o.setAttributeNS(X.getstring(), X.getstring(), X.getstring());
        o.removeAttribute(X.getstring());
        o.removeAttributeNS(X.getstring(), X.getstring());
        var f248 : boolean = o.hasAttribute(X.getstring());
        var f249 : boolean = o.hasAttributeNS(X.getstring(), X.getstring());
        var f250 : HTMLCollection = o.getElementsByTagName(X.getstring());
        var f251 : HTMLCollection = o.getElementsByTagNameNS(X.getstring(), X.getstring());
        var f252 : HTMLCollection = o.getElementsByClassName(X.getstring());
        var v253 : HTMLCollection = o.children;
        var v254 : Element = o.firstElementChild;
        var v255 : Element = o.lastElementChild;
        var v256 : Element = o.previousElementSibling;
        var v257 : Element = o.nextElementSibling;
        var v258 : int/*unsigned long*/ = o.childElementCount;
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
        var f259 : ClientRectList = o.getClientRects();
        var f260 : ClientRect = o.getBoundingClientRect();
        o.scrollIntoView();
        o.scrollIntoView(X.getboolean());
        var v261 : int/*long*/ = o.scrollTop;
        var v262 : int/*long*/ = o.scrollLeft;
        var v263 : int/*long*/ = o.scrollWidth;
        var v264 : int/*long*/ = o.scrollHeight;
        var v265 : int/*long*/ = o.clientTop;
        var v266 : int/*long*/ = o.clientLeft;
        var v267 : int/*long*/ = o.clientWidth;
        var v268 : int/*long*/ = o.clientHeight;
        var f269 : Element = o.querySelector(X.getstring());
        var f270 : NodeList = o.querySelectorAll(X.getstring());
        var v271 : string/*DOMString*/ = o.innerHTML;
        var v272 : string/*DOMString*/ = o.outerHTML;
        o.insertAdjacentHTML(X.getstring(), X.getstring());
    } // Element


    function compile_Attr(o : Attr) : void {
        var v273 : string/*DOMString*/ = o.name;
        var v274 : string/*DOMString*/ = o.value;
        var v275 : string/*DOMString?*/ = o.namespaceURI;
        var v276 : string/*DOMString?*/ = o.prefix;
        var v277 : string/*DOMString*/ = o.localName;
    } // Attr


    function compile_CharacterData(o : CharacterData) : void {
        var v278 : string/*DOMString*/ = o.data;
        var v279 : int/*unsigned long*/ = o.length;
        var f280 : string/*DOMString*/ = o.substringData(X.getint(), X.getint());
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


    function compile_Text(o : Text) : void {
        var f281 : Text = o.splitText(X.getint());
        var v282 : string/*DOMString*/ = o.wholeText;
        var v283 : boolean = o.serializeAsCDATA;
    } // Text


    function compile_ProcessingInstruction(o : ProcessingInstruction) : void {
        var v284 : string/*DOMString*/ = o.target;
        var v285 : StyleSheet = o.sheet;
    } // ProcessingInstruction


    function compile_Comment(o : Comment) : void {
    } // Comment


    function compile_Range(o : Range) : void {
        var v286 : Node = o.startContainer;
        var v287 : int/*unsigned long*/ = o.startOffset;
        var v288 : Node = o.endContainer;
        var v289 : int/*unsigned long*/ = o.endOffset;
        var v290 : boolean = o.collapsed;
        var v291 : Node = o.commonAncestorContainer;
        o.setStart(X.getNode(), X.getint());
        o.setEnd(X.getNode(), X.getint());
        o.setStartBefore(X.getNode());
        o.setStartAfter(X.getNode());
        o.setEndBefore(X.getNode());
        o.setEndAfter(X.getNode());
        o.collapse(X.getboolean());
        o.selectNode(X.getNode());
        o.selectNodeContents(X.getNode());
        var v292 : int/*unsigned short*/ = Range.START_TO_START;
        var v293 : int/*unsigned short*/ = o.START_TO_START;
        var v294 : int/*unsigned short*/ = Range.START_TO_END;
        var v295 : int/*unsigned short*/ = o.START_TO_END;
        var v296 : int/*unsigned short*/ = Range.END_TO_END;
        var v297 : int/*unsigned short*/ = o.END_TO_END;
        var v298 : int/*unsigned short*/ = Range.END_TO_START;
        var v299 : int/*unsigned short*/ = o.END_TO_START;
        var f300 : int/*short*/ = o.compareBoundaryPoints(X.getint(), X.getRange());
        o.deleteContents();
        var f301 : DocumentFragment = o.extractContents();
        var f302 : DocumentFragment = o.cloneContents();
        o.insertNode(X.getNode());
        o.surroundContents(X.getNode());
        var f303 : Range = o.cloneRange();
        o.detach();
        var f304 : boolean = o.isPointInRange(X.getNode(), X.getint());
        var f305 : int/*short*/ = o.comparePoint(X.getNode(), X.getint());
        var f306 : boolean = o.intersectsNode(X.getNode());
        var f307 : ClientRectList = o.getClientRects();
        var f308 : ClientRect = o.getBoundingClientRect();
        var f309 : DocumentFragment = o.createContextualFragment(X.getstring());
    } // Range


    function compile_NodeIterator(o : NodeIterator) : void {
        var v310 : Node = o.root;
        var v311 : Node = o.referenceNode;
        var v312 : boolean = o.pointerBeforeReferenceNode;
        var v313 : int/*unsigned long*/ = o.whatToShow;
        var v314 : NodeFilter = o.filter;
        var f315 : Node = o.nextNode();
        var f316 : Node = o.previousNode();
        o.detach();
    } // NodeIterator


    function compile_TreeWalker(o : TreeWalker) : void {
        var v317 : Node = o.root;
        var v318 : int/*unsigned long*/ = o.whatToShow;
        var v319 : NodeFilter = o.filter;
        var v320 : Node = o.currentNode;
        var f321 : Node = o.parentNode();
        var f322 : Node = o.firstChild();
        var f323 : Node = o.lastChild();
        var f324 : Node = o.previousSibling();
        var f325 : Node = o.nextSibling();
        var f326 : Node = o.previousNode();
        var f327 : Node = o.nextNode();
    } // TreeWalker


    function compile_NodeFilter(o : NodeFilter) : void {
        var v328 : int/*unsigned short*/ = NodeFilter.FILTER_ACCEPT;
        var v329 : int/*unsigned short*/ = o.FILTER_ACCEPT;
        var v330 : int/*unsigned short*/ = NodeFilter.FILTER_REJECT;
        var v331 : int/*unsigned short*/ = o.FILTER_REJECT;
        var v332 : int/*unsigned short*/ = NodeFilter.FILTER_SKIP;
        var v333 : int/*unsigned short*/ = o.FILTER_SKIP;
        var v334 : int/*unsigned long*/ = NodeFilter.SHOW_ALL;
        var v335 : int/*unsigned long*/ = o.SHOW_ALL;
        var v336 : int/*unsigned long*/ = NodeFilter.SHOW_ELEMENT;
        var v337 : int/*unsigned long*/ = o.SHOW_ELEMENT;
        var v338 : int/*unsigned long*/ = NodeFilter.SHOW_ATTRIBUTE;
        var v339 : int/*unsigned long*/ = o.SHOW_ATTRIBUTE;
        var v340 : int/*unsigned long*/ = NodeFilter.SHOW_TEXT;
        var v341 : int/*unsigned long*/ = o.SHOW_TEXT;
        var v342 : int/*unsigned long*/ = NodeFilter.SHOW_CDATA_SECTION;
        var v343 : int/*unsigned long*/ = o.SHOW_CDATA_SECTION;
        var v344 : int/*unsigned long*/ = NodeFilter.SHOW_ENTITY_REFERENCE;
        var v345 : int/*unsigned long*/ = o.SHOW_ENTITY_REFERENCE;
        var v346 : int/*unsigned long*/ = NodeFilter.SHOW_ENTITY;
        var v347 : int/*unsigned long*/ = o.SHOW_ENTITY;
        var v348 : int/*unsigned long*/ = NodeFilter.SHOW_PROCESSING_INSTRUCTION;
        var v349 : int/*unsigned long*/ = o.SHOW_PROCESSING_INSTRUCTION;
        var v350 : int/*unsigned long*/ = NodeFilter.SHOW_COMMENT;
        var v351 : int/*unsigned long*/ = o.SHOW_COMMENT;
        var v352 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT;
        var v353 : int/*unsigned long*/ = o.SHOW_DOCUMENT;
        var v354 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT_TYPE;
        var v355 : int/*unsigned long*/ = o.SHOW_DOCUMENT_TYPE;
        var v356 : int/*unsigned long*/ = NodeFilter.SHOW_DOCUMENT_FRAGMENT;
        var v357 : int/*unsigned long*/ = o.SHOW_DOCUMENT_FRAGMENT;
        var v358 : int/*unsigned long*/ = NodeFilter.SHOW_NOTATION;
        var v359 : int/*unsigned long*/ = o.SHOW_NOTATION;
        var f360 : int/*unsigned short*/ = o.acceptNode(X.getNode());
    } // NodeFilter


    function compile_NodeList(o : NodeList) : void {
        var f361 : MayBeUndefined.<Node> = o.__native_index_operator__(X.getint());
        var f362 : MayBeUndefined.<Node> = o.item(X.getint());
        var v363 : int/*unsigned long*/ = o.length;
    } // NodeList


    function compile_HTMLCollection(o : HTMLCollection) : void {
        var v364 : int/*unsigned long*/ = o.length;
        var f365 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f366 : MayBeUndefined.<Element> = o.item(X.getint());
        var f367 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f368 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
    } // HTMLCollection


    function compile_DOMStringList(o : DOMStringList) : void {
        var v369 : int/*unsigned long*/ = o.length;
        var f370 : MayBeUndefined.<string/*DOMString?*/> = o.__native_index_operator__(X.getint());
        var f371 : MayBeUndefined.<string/*DOMString?*/> = o.item(X.getint());
        var f372 : boolean = o.contains(X.getstring());
    } // DOMStringList


    function compile_DOMTokenList(o : DOMTokenList) : void {
        var v373 : int/*unsigned long*/ = o.length;
        var f374 : MayBeUndefined.<string/*DOMString?*/> = o.__native_index_operator__(X.getint());
        var f375 : MayBeUndefined.<string/*DOMString?*/> = o.item(X.getint());
        var f376 : boolean = o.contains(X.getstring());
        o.add(X.getstring());
        o.remove(X.getstring());
        var f377 : boolean = o.toggle(X.getstring());
    } // DOMTokenList


    function compile_DOMSettableTokenList(o : DOMSettableTokenList) : void {
        var v378 : string/*DOMString*/ = o.value;
    } // DOMSettableTokenList


    function compile_AbstractView(o : AbstractView) : void {
        var v379 : DocumentView = o.document;
    } // AbstractView


    function compile_DocumentView(o : DocumentView) : void {
        var v380 : AbstractView = o.defaultView;
    } // DocumentView


    function compile_EventException(o : EventException) : void {
        var v381 : int/*unsigned short*/ = EventException.UNSPECIFIED_EVENT_TYPE_ERR;
        var v382 : int/*unsigned short*/ = o.UNSPECIFIED_EVENT_TYPE_ERR;
        var v383 : int/*unsigned short*/ = EventException.DISPATCH_REQUEST_ERR;
        var v384 : int/*unsigned short*/ = o.DISPATCH_REQUEST_ERR;
        var v385 : int/*unsigned short*/ = o.code;
        var v386 : int/*unsigned short*/ = EventException.UNSPECIFIED_EVENT_TYPE_ERR;
        var v387 : int/*unsigned short*/ = o.UNSPECIFIED_EVENT_TYPE_ERR;
        var v388 : int/*unsigned short*/ = EventException.DISPATCH_REQUEST_ERR;
        var v389 : int/*unsigned short*/ = o.DISPATCH_REQUEST_ERR;
        var v390 : int/*unsigned short*/ = o.code;
    } // EventException


    function compile_DocumentEvent(o : DocumentEvent) : void {
        var f391 : Event = o.createEvent(X.getstring());
        var f392 : Event = o.createEvent(X.getstring());
    } // DocumentEvent


    function compile_UIEvent(o : UIEvent) : void {
        var v393 : AbstractView = o.view;
        var v394 : int/*long*/ = o.detail;
        o.initUIEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint());
        var v395 : AbstractView = o.view;
        var v396 : int/*long*/ = o.detail;
        o.initUIEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint());
    } // UIEvent


    function compile_FocusEvent(o : FocusEvent) : void {
        var v397 : EventTarget = o.relatedTarget;
        o.initFocusEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getEventTarget());
        var v398 : EventTarget = o.relatedTarget;
        o.initFocusEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getEventTarget());
    } // FocusEvent


    function compile_MouseEvent(o : MouseEvent) : void {
        var v399 : int/*long*/ = o.screenX;
        var v400 : int/*long*/ = o.screenY;
        var v401 : int/*long*/ = o.clientX;
        var v402 : int/*long*/ = o.clientY;
        var v403 : boolean = o.ctrlKey;
        var v404 : boolean = o.shiftKey;
        var v405 : boolean = o.altKey;
        var v406 : boolean = o.metaKey;
        var v407 : int/*unsigned short*/ = o.button;
        var v408 : int/*unsigned short*/ = o.buttons;
        var v409 : EventTarget = o.relatedTarget;
        o.initMouseEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getboolean(), X.getboolean(), X.getboolean(), X.getboolean(), X.getint(), X.getEventTarget());
        var f410 : boolean = o.getModifierState(X.getstring());
        var v411 : int/*long*/ = o.screenX;
        var v412 : int/*long*/ = o.screenY;
        var v413 : int/*long*/ = o.clientX;
        var v414 : int/*long*/ = o.clientY;
        var v415 : boolean = o.ctrlKey;
        var v416 : boolean = o.shiftKey;
        var v417 : boolean = o.altKey;
        var v418 : boolean = o.metaKey;
        var v419 : int/*unsigned short*/ = o.button;
        var v420 : int/*unsigned short*/ = o.buttons;
        var v421 : EventTarget = o.relatedTarget;
        o.initMouseEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getboolean(), X.getboolean(), X.getboolean(), X.getboolean(), X.getint(), X.getEventTarget());
        var f422 : boolean = o.getModifierState(X.getstring());
        var v423 : int/*long*/ = o.screenX;
        var v424 : int/*long*/ = o.screenY;
        var v425 : int/*long*/ = o.pageX;
        var v426 : int/*long*/ = o.pageY;
        var v427 : int/*long*/ = o.clientX;
        var v428 : int/*long*/ = o.clientY;
        var v429 : int/*long*/ = o.x;
        var v430 : int/*long*/ = o.y;
        var v431 : int/*long*/ = o.offsetX;
        var v432 : int/*long*/ = o.offsetY;
    } // MouseEvent


    function compile_WheelEvent(o : WheelEvent) : void {
        var v433 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PIXEL;
        var v434 : int/*unsigned long*/ = o.DOM_DELTA_PIXEL;
        var v435 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_LINE;
        var v436 : int/*unsigned long*/ = o.DOM_DELTA_LINE;
        var v437 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PAGE;
        var v438 : int/*unsigned long*/ = o.DOM_DELTA_PAGE;
        var v439 : number/*float*/ = o.deltaX;
        var v440 : number/*float*/ = o.deltaY;
        var v441 : number/*float*/ = o.deltaZ;
        var v442 : int/*unsigned long*/ = o.deltaMode;
        o.initWheelEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getEventTarget(), X.getstring(), X.getnumber(), X.getnumber(), X.getnumber(), X.getint());
        var v443 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PIXEL;
        var v444 : int/*unsigned long*/ = o.DOM_DELTA_PIXEL;
        var v445 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_LINE;
        var v446 : int/*unsigned long*/ = o.DOM_DELTA_LINE;
        var v447 : int/*unsigned long*/ = WheelEvent.DOM_DELTA_PAGE;
        var v448 : int/*unsigned long*/ = o.DOM_DELTA_PAGE;
        var v449 : number/*float*/ = o.deltaX;
        var v450 : number/*float*/ = o.deltaY;
        var v451 : number/*float*/ = o.deltaZ;
        var v452 : int/*unsigned long*/ = o.deltaMode;
        o.initWheelEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getint(), X.getEventTarget(), X.getstring(), X.getnumber(), X.getnumber(), X.getnumber(), X.getint());
    } // WheelEvent


    function compile_TextEvent(o : TextEvent) : void {
        var v453 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_UNKNOWN;
        var v454 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_UNKNOWN;
        var v455 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_KEYBOARD;
        var v456 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_KEYBOARD;
        var v457 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_PASTE;
        var v458 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_PASTE;
        var v459 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_DROP;
        var v460 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_DROP;
        var v461 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_IME;
        var v462 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_IME;
        var v463 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_OPTION;
        var v464 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_OPTION;
        var v465 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_HANDWRITING;
        var v466 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_HANDWRITING;
        var v467 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_VOICE;
        var v468 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_VOICE;
        var v469 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_MULTIMODAL;
        var v470 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_MULTIMODAL;
        var v471 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_SCRIPT;
        var v472 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_SCRIPT;
        var v473 : string/*DOMString*/ = o.data;
        var v474 : int/*unsigned long*/ = o.inputMethod;
        var v475 : string/*DOMString*/ = o.locale;
        o.initTextEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getint(), X.getstring());
        var v476 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_UNKNOWN;
        var v477 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_UNKNOWN;
        var v478 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_KEYBOARD;
        var v479 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_KEYBOARD;
        var v480 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_PASTE;
        var v481 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_PASTE;
        var v482 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_DROP;
        var v483 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_DROP;
        var v484 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_IME;
        var v485 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_IME;
        var v486 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_OPTION;
        var v487 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_OPTION;
        var v488 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_HANDWRITING;
        var v489 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_HANDWRITING;
        var v490 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_VOICE;
        var v491 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_VOICE;
        var v492 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_MULTIMODAL;
        var v493 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_MULTIMODAL;
        var v494 : int/*unsigned long*/ = TextEvent.DOM_INPUT_METHOD_SCRIPT;
        var v495 : int/*unsigned long*/ = o.DOM_INPUT_METHOD_SCRIPT;
        var v496 : string/*DOMString*/ = o.data;
        var v497 : int/*unsigned long*/ = o.inputMethod;
        var v498 : string/*DOMString*/ = o.locale;
        o.initTextEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getint(), X.getstring());
    } // TextEvent


    function compile_KeyboardEvent(o : KeyboardEvent) : void {
        var v499 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
        var v500 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_STANDARD;
        var v501 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_LEFT;
        var v502 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_LEFT;
        var v503 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        var v504 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_RIGHT;
        var v505 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;
        var v506 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_NUMPAD;
        var v507 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_MOBILE;
        var v508 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_MOBILE;
        var v509 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_JOYSTICK;
        var v510 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_JOYSTICK;
        var v511 : string/*DOMString*/ = o.char;
        var v512 : string/*DOMString*/ = o.key;
        var v513 : int/*unsigned long*/ = o.location;
        var v514 : boolean = o.ctrlKey;
        var v515 : boolean = o.shiftKey;
        var v516 : boolean = o.altKey;
        var v517 : boolean = o.metaKey;
        var v518 : boolean = o.repeat;
        var v519 : string/*DOMString*/ = o.locale;
        var f520 : boolean = o.getModifierState(X.getstring());
        o.initKeyboardEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring(), X.getint(), X.getstring(), X.getboolean(), X.getstring());
        var v521 : int/*unsigned long*/ = o.charCode;
        var v522 : int/*unsigned long*/ = o.keyCode;
        var v523 : int/*unsigned long*/ = o.which;
        var v524 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
        var v525 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_STANDARD;
        var v526 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_LEFT;
        var v527 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_LEFT;
        var v528 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        var v529 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_RIGHT;
        var v530 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;
        var v531 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_NUMPAD;
        var v532 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_MOBILE;
        var v533 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_MOBILE;
        var v534 : int/*unsigned long*/ = KeyboardEvent.DOM_KEY_LOCATION_JOYSTICK;
        var v535 : int/*unsigned long*/ = o.DOM_KEY_LOCATION_JOYSTICK;
        var v536 : string/*DOMString*/ = o.char;
        var v537 : string/*DOMString*/ = o.key;
        var v538 : int/*unsigned long*/ = o.location;
        var v539 : boolean = o.ctrlKey;
        var v540 : boolean = o.shiftKey;
        var v541 : boolean = o.altKey;
        var v542 : boolean = o.metaKey;
        var v543 : boolean = o.repeat;
        var v544 : string/*DOMString*/ = o.locale;
        var f545 : boolean = o.getModifierState(X.getstring());
        o.initKeyboardEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring(), X.getint(), X.getstring(), X.getboolean(), X.getstring());
    } // KeyboardEvent


    function compile_CompositionEvent(o : CompositionEvent) : void {
        var v546 : string/*DOMString*/ = o.data;
        var v547 : string/*DOMString*/ = o.locale;
        o.initCompositionEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring());
        var v548 : string/*DOMString*/ = o.data;
        var v549 : string/*DOMString*/ = o.locale;
        o.initCompositionEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getAbstractView(), X.getstring(), X.getstring());
    } // CompositionEvent


    function compile_MutationEvent(o : MutationEvent) : void {
        var v550 : int/*unsigned short*/ = MutationEvent.MODIFICATION;
        var v551 : int/*unsigned short*/ = o.MODIFICATION;
        var v552 : int/*unsigned short*/ = MutationEvent.ADDITION;
        var v553 : int/*unsigned short*/ = o.ADDITION;
        var v554 : int/*unsigned short*/ = MutationEvent.REMOVAL;
        var v555 : int/*unsigned short*/ = o.REMOVAL;
        var v556 : Node = o.relatedNode;
        var v557 : string/*DOMString*/ = o.prevValue;
        var v558 : string/*DOMString*/ = o.newValue;
        var v559 : string/*DOMString*/ = o.attrName;
        var v560 : int/*unsigned short*/ = o.attrChange;
        o.initMutationEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring(), X.getstring(), X.getint());
        var v561 : int/*unsigned short*/ = MutationEvent.MODIFICATION;
        var v562 : int/*unsigned short*/ = o.MODIFICATION;
        var v563 : int/*unsigned short*/ = MutationEvent.ADDITION;
        var v564 : int/*unsigned short*/ = o.ADDITION;
        var v565 : int/*unsigned short*/ = MutationEvent.REMOVAL;
        var v566 : int/*unsigned short*/ = o.REMOVAL;
        var v567 : Node = o.relatedNode;
        var v568 : string/*DOMString*/ = o.prevValue;
        var v569 : string/*DOMString*/ = o.newValue;
        var v570 : string/*DOMString*/ = o.attrName;
        var v571 : int/*unsigned short*/ = o.attrChange;
        o.initMutationEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring(), X.getstring(), X.getint());
    } // MutationEvent


    function compile_MutationNameEvent(o : MutationNameEvent) : void {
        var v572 : string/*DOMString*/ = o.prevNamespaceURI;
        var v573 : string/*DOMString*/ = o.prevNodeName;
        o.initMutationNameEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring());
        var v574 : string/*DOMString*/ = o.prevNamespaceURI;
        var v575 : string/*DOMString*/ = o.prevNodeName;
        o.initMutationNameEvent(X.getstring(), X.getboolean(), X.getboolean(), X.getNode(), X.getstring(), X.getstring());
    } // MutationNameEvent


    function compile_UIEventInit(o : UIEventInit) : void {
    } // UIEventInit


    function compile_MouseEventInit(o : MouseEventInit) : void {
    } // MouseEventInit


    function compile_XMLHttpRequestEventTarget(o : XMLHttpRequestEventTarget) : void {
        var v576 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v577 : function(:Event):void/*Function?*/ = o.onprogress;
        var v578 : function(:Event):void/*Function?*/ = o.onabort;
        var v579 : function(:Event):void/*Function?*/ = o.onerror;
        var v580 : function(:Event):void/*Function?*/ = o.onload;
        var v581 : function(:Event):void/*Function?*/ = o.ontimeout;
        var v582 : function(:Event):void/*Function?*/ = o.onloadend;
    } // XMLHttpRequestEventTarget


    function compile_XMLHttpRequestUpload(o : XMLHttpRequestUpload) : void {
    } // XMLHttpRequestUpload


    function compile_XMLHttpRequest(o : XMLHttpRequest) : void {
        var v583 : function(:Event):void/*Function?*/ = o.onreadystatechange;
        var v584 : int/*unsigned short*/ = XMLHttpRequest.UNSENT;
        var v585 : int/*unsigned short*/ = o.UNSENT;
        var v586 : int/*unsigned short*/ = XMLHttpRequest.OPENED;
        var v587 : int/*unsigned short*/ = o.OPENED;
        var v588 : int/*unsigned short*/ = XMLHttpRequest.HEADERS_RECEIVED;
        var v589 : int/*unsigned short*/ = o.HEADERS_RECEIVED;
        var v590 : int/*unsigned short*/ = XMLHttpRequest.LOADING;
        var v591 : int/*unsigned short*/ = o.LOADING;
        var v592 : int/*unsigned short*/ = XMLHttpRequest.DONE;
        var v593 : int/*unsigned short*/ = o.DONE;
        var v594 : int/*unsigned short*/ = o.readyState;
        o.open(X.getstring(), X.getstring());
        o.open(X.getstring(), X.getstring(), X.getboolean());
        o.open(X.getstring(), X.getstring(), X.getboolean(), X.getstring());
        o.open(X.getstring(), X.getstring(), X.getboolean(), X.getstring(), X.getstring());
        o.setRequestHeader(X.getstring(), X.getstring());
        var v595 : int/*unsigned long*/ = o.timeout;
        var v596 : boolean = o.withCredentials;
        var v597 : XMLHttpRequestUpload = o.upload;
        o.send();
        o.send(X.getArrayBuffer());
        o.send(X.getBlob());
        o.send(X.getDocument());
        o.send(X.getstring());
        o.send(X.getFormData());
        o.abort();
        var v598 : int/*unsigned short*/ = o.status;
        var v599 : string/*DOMString*/ = o.statusText;
        var f600 : string/*DOMString*/ = o.getResponseHeader(X.getstring());
        var f601 : string/*DOMString*/ = o.getAllResponseHeaders();
        o.overrideMimeType(X.getstring());
        var v602 : string/*XMLHttpRequestResponseType*/ = o.responseType;
        var v603 : variant/*any*/ = o.response;
        var v604 : string/*DOMString*/ = o.responseText;
        var v605 : Document = o.responseXML;
    } // XMLHttpRequest


    function compile_AnonXMLHttpRequest(o : AnonXMLHttpRequest) : void {
    } // AnonXMLHttpRequest


    function compile_FormData(o : FormData) : void {
        o.append(X.getstring(), X.getBlob());
        o.append(X.getstring(), X.getBlob(), X.getstring());
        o.append(X.getstring(), X.getstring());
    } // FormData


    function compile_MediaList(o : MediaList) : void {
        var v606 : string/*DOMString*/ = o.mediaText;
        var v607 : int/*unsigned long*/ = o.length;
        var f608 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getint());
        var f609 : MayBeUndefined.<string/*DOMString*/> = o.item(X.getint());
        o.appendMedium(X.getstring());
        o.deleteMedium(X.getstring());
    } // MediaList


    function compile_StyleSheet(o : StyleSheet) : void {
        var v610 : string/*DOMString*/ = o.type;
        var v611 : string/*DOMString*/ = o.href;
        var v612 : Node = o.ownerNode;
        var v613 : StyleSheet = o.parentStyleSheet;
        var v614 : string/*DOMString*/ = o.title;
        var v615 : MediaList = o.media;
        var v616 : boolean = o.disabled;
    } // StyleSheet


    function compile_CSSStyleSheet(o : CSSStyleSheet) : void {
        var v617 : CSSRule = o.ownerRule;
        var v618 : CSSRule[]/*CSSRuleList*/ = o.cssRules;
        var f619 : int/*unsigned long*/ = o.insertRule(X.getstring(), X.getint());
        o.deleteRule(X.getint());
    } // CSSStyleSheet


    function compile_LinkStyle(o : LinkStyle) : void {
        var v620 : StyleSheet = o.sheet;
    } // LinkStyle


    function compile_CSSRule(o : CSSRule) : void {
        var v621 : int/*unsigned short*/ = CSSRule.STYLE_RULE;
        var v622 : int/*unsigned short*/ = o.STYLE_RULE;
        var v623 : int/*unsigned short*/ = CSSRule.IMPORT_RULE;
        var v624 : int/*unsigned short*/ = o.IMPORT_RULE;
        var v625 : int/*unsigned short*/ = CSSRule.MEDIA_RULE;
        var v626 : int/*unsigned short*/ = o.MEDIA_RULE;
        var v627 : int/*unsigned short*/ = CSSRule.FONT_FACE_RULE;
        var v628 : int/*unsigned short*/ = o.FONT_FACE_RULE;
        var v629 : int/*unsigned short*/ = CSSRule.PAGE_RULE;
        var v630 : int/*unsigned short*/ = o.PAGE_RULE;
        var v631 : int/*unsigned short*/ = CSSRule.NAMESPACE_RULE;
        var v632 : int/*unsigned short*/ = o.NAMESPACE_RULE;
        var v633 : int/*unsigned short*/ = o.type;
        var v634 : string/*DOMString*/ = o.cssText;
        var v635 : CSSRule = o.parentRule;
        var v636 : CSSStyleSheet = o.parentStyleSheet;
    } // CSSRule


    function compile_CSSStyleRule(o : CSSStyleRule) : void {
        var v637 : string/*DOMString*/ = o.selectorText;
        var v638 : CSSStyleDeclaration = o.style;
    } // CSSStyleRule


    function compile_CSSImportRule(o : CSSImportRule) : void {
        var v639 : string/*DOMString*/ = o.href;
        var v640 : MediaList = o.media;
        var v641 : CSSStyleSheet = o.styleSheet;
    } // CSSImportRule


    function compile_CSSMediaRule(o : CSSMediaRule) : void {
        var v642 : MediaList = o.media;
        var v643 : CSSRule[]/*CSSRuleList*/ = o.cssRules;
        var f644 : int/*unsigned long*/ = o.insertRule(X.getstring(), X.getint());
        o.deleteRule(X.getint());
    } // CSSMediaRule


    function compile_CSSFontFaceRule(o : CSSFontFaceRule) : void {
        var v645 : CSSStyleDeclaration = o.style;
    } // CSSFontFaceRule


    function compile_CSSPageRule(o : CSSPageRule) : void {
        var v646 : string/*DOMString*/ = o.selectorText;
        var v647 : CSSStyleDeclaration = o.style;
    } // CSSPageRule


    function compile_CSSNamespaceRule(o : CSSNamespaceRule) : void {
        var v648 : string/*DOMString*/ = o.namespaceURI;
        var v649 : string/*DOMString?*/ = o.prefix;
    } // CSSNamespaceRule


    function compile_CSSStyleDeclaration(o : CSSStyleDeclaration) : void {
        var v650 : string/*DOMString*/ = o.cssText;
        var v651 : int/*unsigned long*/ = o.length;
        var f652 : string/*DOMString*/ = o.item(X.getint());
        var f653 : string/*DOMString*/ = o.getPropertyValue(X.getstring());
        var f654 : string/*DOMString*/ = o.getPropertyPriority(X.getstring());
        o.setProperty(X.getstring(), X.getstring());
        o.setProperty(X.getstring(), X.getstring(), X.getstring());
        var f655 : string/*DOMString*/ = o.removeProperty(X.getstring());
        var v656 : CSSRule = o.parentRule;
        var v657 : string/*DOMString*/ = o.azimuth;
        var v658 : string/*DOMString*/ = o.background;
        var v659 : string/*DOMString*/ = o.backgroundAttachment;
        var v660 : string/*DOMString*/ = o.backgroundColor;
        var v661 : string/*DOMString*/ = o.backgroundImage;
        var v662 : string/*DOMString*/ = o.backgroundPosition;
        var v663 : string/*DOMString*/ = o.backgroundRepeat;
        var v664 : string/*DOMString*/ = o.border;
        var v665 : string/*DOMString*/ = o.borderCollapse;
        var v666 : string/*DOMString*/ = o.borderColor;
        var v667 : string/*DOMString*/ = o.borderSpacing;
        var v668 : string/*DOMString*/ = o.borderStyle;
        var v669 : string/*DOMString*/ = o.borderTop;
        var v670 : string/*DOMString*/ = o.borderRight;
        var v671 : string/*DOMString*/ = o.borderBottom;
        var v672 : string/*DOMString*/ = o.borderLeft;
        var v673 : string/*DOMString*/ = o.borderTopColor;
        var v674 : string/*DOMString*/ = o.borderRightColor;
        var v675 : string/*DOMString*/ = o.borderBottomColor;
        var v676 : string/*DOMString*/ = o.borderLeftColor;
        var v677 : string/*DOMString*/ = o.borderTopStyle;
        var v678 : string/*DOMString*/ = o.borderRightStyle;
        var v679 : string/*DOMString*/ = o.borderBottomStyle;
        var v680 : string/*DOMString*/ = o.borderLeftStyle;
        var v681 : string/*DOMString*/ = o.borderTopWidth;
        var v682 : string/*DOMString*/ = o.borderRightWidth;
        var v683 : string/*DOMString*/ = o.borderBottomWidth;
        var v684 : string/*DOMString*/ = o.borderLeftWidth;
        var v685 : string/*DOMString*/ = o.borderWidth;
        var v686 : string/*DOMString*/ = o.bottom;
        var v687 : string/*DOMString*/ = o.captionSide;
        var v688 : string/*DOMString*/ = o.clear;
        var v689 : string/*DOMString*/ = o.clip;
        var v690 : string/*DOMString*/ = o.color;
        var v691 : string/*DOMString*/ = o.content;
        var v692 : string/*DOMString*/ = o.counterIncrement;
        var v693 : string/*DOMString*/ = o.counterReset;
        var v694 : string/*DOMString*/ = o.cue;
        var v695 : string/*DOMString*/ = o.cueAfter;
        var v696 : string/*DOMString*/ = o.cueBefore;
        var v697 : string/*DOMString*/ = o.cursor;
        var v698 : string/*DOMString*/ = o.direction;
        var v699 : string/*DOMString*/ = o.display;
        var v700 : string/*DOMString*/ = o.elevation;
        var v701 : string/*DOMString*/ = o.emptyCells;
        var v702 : string/*DOMString*/ = o.cssFloat;
        var v703 : string/*DOMString*/ = o.font;
        var v704 : string/*DOMString*/ = o.fontFamily;
        var v705 : string/*DOMString*/ = o.fontSize;
        var v706 : string/*DOMString*/ = o.fontSizeAdjust;
        var v707 : string/*DOMString*/ = o.fontStretch;
        var v708 : string/*DOMString*/ = o.fontStyle;
        var v709 : string/*DOMString*/ = o.fontVariant;
        var v710 : string/*DOMString*/ = o.fontWeight;
        var v711 : string/*DOMString*/ = o.height;
        var v712 : string/*DOMString*/ = o.left;
        var v713 : string/*DOMString*/ = o.letterSpacing;
        var v714 : string/*DOMString*/ = o.lineHeight;
        var v715 : string/*DOMString*/ = o.listStyle;
        var v716 : string/*DOMString*/ = o.listStyleImage;
        var v717 : string/*DOMString*/ = o.listStylePosition;
        var v718 : string/*DOMString*/ = o.listStyleType;
        var v719 : string/*DOMString*/ = o.margin;
        var v720 : string/*DOMString*/ = o.marginTop;
        var v721 : string/*DOMString*/ = o.marginRight;
        var v722 : string/*DOMString*/ = o.marginBottom;
        var v723 : string/*DOMString*/ = o.marginLeft;
        var v724 : string/*DOMString*/ = o.markerOffset;
        var v725 : string/*DOMString*/ = o.marks;
        var v726 : string/*DOMString*/ = o.maxHeight;
        var v727 : string/*DOMString*/ = o.maxWidth;
        var v728 : string/*DOMString*/ = o.minHeight;
        var v729 : string/*DOMString*/ = o.minWidth;
        var v730 : string/*DOMString*/ = o.orphans;
        var v731 : string/*DOMString*/ = o.outline;
        var v732 : string/*DOMString*/ = o.outlineColor;
        var v733 : string/*DOMString*/ = o.outlineStyle;
        var v734 : string/*DOMString*/ = o.outlineWidth;
        var v735 : string/*DOMString*/ = o.overflow;
        var v736 : string/*DOMString*/ = o.padding;
        var v737 : string/*DOMString*/ = o.paddingTop;
        var v738 : string/*DOMString*/ = o.paddingRight;
        var v739 : string/*DOMString*/ = o.paddingBottom;
        var v740 : string/*DOMString*/ = o.paddingLeft;
        var v741 : string/*DOMString*/ = o.page;
        var v742 : string/*DOMString*/ = o.pageBreakAfter;
        var v743 : string/*DOMString*/ = o.pageBreakBefore;
        var v744 : string/*DOMString*/ = o.pageBreakInside;
        var v745 : string/*DOMString*/ = o.pause;
        var v746 : string/*DOMString*/ = o.pauseAfter;
        var v747 : string/*DOMString*/ = o.pauseBefore;
        var v748 : string/*DOMString*/ = o.pitch;
        var v749 : string/*DOMString*/ = o.pitchRange;
        var v750 : string/*DOMString*/ = o.playDuring;
        var v751 : string/*DOMString*/ = o.position;
        var v752 : string/*DOMString*/ = o.quotes;
        var v753 : string/*DOMString*/ = o.richness;
        var v754 : string/*DOMString*/ = o.right;
        var v755 : string/*DOMString*/ = o.size;
        var v756 : string/*DOMString*/ = o.speak;
        var v757 : string/*DOMString*/ = o.speakHeader;
        var v758 : string/*DOMString*/ = o.speakNumeral;
        var v759 : string/*DOMString*/ = o.speakPunctuation;
        var v760 : string/*DOMString*/ = o.speechRate;
        var v761 : string/*DOMString*/ = o.stress;
        var v762 : string/*DOMString*/ = o.tableLayout;
        var v763 : string/*DOMString*/ = o.textAlign;
        var v764 : string/*DOMString*/ = o.textDecoration;
        var v765 : string/*DOMString*/ = o.textIndent;
        var v766 : string/*DOMString*/ = o.textShadow;
        var v767 : string/*DOMString*/ = o.textTransform;
        var v768 : string/*DOMString*/ = o.top;
        var v769 : string/*DOMString*/ = o.unicodeBidi;
        var v770 : string/*DOMString*/ = o.verticalAlign;
        var v771 : string/*DOMString*/ = o.visibility;
        var v772 : string/*DOMString*/ = o.voiceFamily;
        var v773 : string/*DOMString*/ = o.volume;
        var v774 : string/*DOMString*/ = o.whiteSpace;
        var v775 : string/*DOMString*/ = o.widows;
        var v776 : string/*DOMString*/ = o.width;
        var v777 : string/*DOMString*/ = o.wordSpacing;
        var v778 : string/*DOMString*/ = o.zIndex;
        var v779 : MayBeUndefined.<number> = o.length;
        var v780 : MayBeUndefined.<Object/*Maybe<object>*/> = o.parentRule;
        var v781 : MayBeUndefined.<string> = o.alignmentBaseline;
        var v782 : MayBeUndefined.<string> = o.background;
        var v783 : MayBeUndefined.<string> = o.backgroundAttachment;
        var v784 : MayBeUndefined.<string> = o.backgroundClip;
        var v785 : MayBeUndefined.<string> = o.backgroundColor;
        var v786 : MayBeUndefined.<string> = o.backgroundImage;
        var v787 : MayBeUndefined.<string> = o.backgroundOrigin;
        var v788 : MayBeUndefined.<string> = o.backgroundPosition;
        var v789 : MayBeUndefined.<string> = o.backgroundPositionX;
        var v790 : MayBeUndefined.<string> = o.backgroundPositionY;
        var v791 : MayBeUndefined.<string> = o.backgroundRepeat;
        var v792 : MayBeUndefined.<string> = o.backgroundRepeatX;
        var v793 : MayBeUndefined.<string> = o.backgroundRepeatY;
        var v794 : MayBeUndefined.<string> = o.backgroundSize;
        var v795 : MayBeUndefined.<string> = o.baselineShift;
        var v796 : MayBeUndefined.<string> = o.border;
        var v797 : MayBeUndefined.<string> = o.borderBottom;
        var v798 : MayBeUndefined.<string> = o.borderBottomColor;
        var v799 : MayBeUndefined.<string> = o.borderBottomLeftRadius;
        var v800 : MayBeUndefined.<string> = o.borderBottomRightRadius;
        var v801 : MayBeUndefined.<string> = o.borderBottomStyle;
        var v802 : MayBeUndefined.<string> = o.borderBottomWidth;
        var v803 : MayBeUndefined.<string> = o.borderCollapse;
        var v804 : MayBeUndefined.<string> = o.borderColor;
        var v805 : MayBeUndefined.<string> = o.borderImage;
        var v806 : MayBeUndefined.<string> = o.borderImageOutset;
        var v807 : MayBeUndefined.<string> = o.borderImageRepeat;
        var v808 : MayBeUndefined.<string> = o.borderImageSlice;
        var v809 : MayBeUndefined.<string> = o.borderImageSource;
        var v810 : MayBeUndefined.<string> = o.borderImageWidth;
        var v811 : MayBeUndefined.<string> = o.borderLeft;
        var v812 : MayBeUndefined.<string> = o.borderLeftColor;
        var v813 : MayBeUndefined.<string> = o.borderLeftStyle;
        var v814 : MayBeUndefined.<string> = o.borderLeftWidth;
        var v815 : MayBeUndefined.<string> = o.borderRadius;
        var v816 : MayBeUndefined.<string> = o.borderRight;
        var v817 : MayBeUndefined.<string> = o.borderRightColor;
        var v818 : MayBeUndefined.<string> = o.borderRightStyle;
        var v819 : MayBeUndefined.<string> = o.borderRightWidth;
        var v820 : MayBeUndefined.<string> = o.borderSpacing;
        var v821 : MayBeUndefined.<string> = o.borderStyle;
        var v822 : MayBeUndefined.<string> = o.borderTop;
        var v823 : MayBeUndefined.<string> = o.borderTopColor;
        var v824 : MayBeUndefined.<string> = o.borderTopLeftRadius;
        var v825 : MayBeUndefined.<string> = o.borderTopRightRadius;
        var v826 : MayBeUndefined.<string> = o.borderTopStyle;
        var v827 : MayBeUndefined.<string> = o.borderTopWidth;
        var v828 : MayBeUndefined.<string> = o.borderWidth;
        var v829 : MayBeUndefined.<string> = o.bottom;
        var v830 : MayBeUndefined.<string> = o.boxShadow;
        var v831 : MayBeUndefined.<string> = o.boxSizing;
        var v832 : MayBeUndefined.<string> = o.captionSide;
        var v833 : MayBeUndefined.<string> = o.clear;
        var v834 : MayBeUndefined.<string> = o.clip;
        var v835 : MayBeUndefined.<string> = o.clipPath;
        var v836 : MayBeUndefined.<string> = o.clipRule;
        var v837 : MayBeUndefined.<string> = o.color;
        var v838 : MayBeUndefined.<string> = o.colorInterpolation;
        var v839 : MayBeUndefined.<string> = o.colorInterpolationFilters;
        var v840 : MayBeUndefined.<string> = o.colorProfile;
        var v841 : MayBeUndefined.<string> = o.colorRendering;
        var v842 : MayBeUndefined.<string> = o.content;
        var v843 : MayBeUndefined.<string> = o.counterIncrement;
        var v844 : MayBeUndefined.<string> = o.counterReset;
        var v845 : MayBeUndefined.<string> = o.cssText;
        var v846 : MayBeUndefined.<string> = o.cursor;
        var v847 : MayBeUndefined.<string> = o.direction;
        var v848 : MayBeUndefined.<string> = o.display;
        var v849 : MayBeUndefined.<string> = o.dominantBaseline;
        var v850 : MayBeUndefined.<string> = o.emptyCells;
        var v851 : MayBeUndefined.<string> = o.enableBackground;
        var v852 : MayBeUndefined.<string> = o.fill;
        var v853 : MayBeUndefined.<string> = o.fillOpacity;
        var v854 : MayBeUndefined.<string> = o.fillRule;
        var v855 : MayBeUndefined.<string> = o.filter;
        var v856 : MayBeUndefined.<string> = o.float;
        var v857 : MayBeUndefined.<string> = o.floodColor;
        var v858 : MayBeUndefined.<string> = o.floodOpacity;
        var v859 : MayBeUndefined.<string> = o.font;
        var v860 : MayBeUndefined.<string> = o.fontFamily;
        var v861 : MayBeUndefined.<string> = o.fontSize;
        var v862 : MayBeUndefined.<string> = o.fontStretch;
        var v863 : MayBeUndefined.<string> = o.fontStyle;
        var v864 : MayBeUndefined.<string> = o.fontVariant;
        var v865 : MayBeUndefined.<string> = o.fontWeight;
        var v866 : MayBeUndefined.<string> = o.glyphOrientationHorizontal;
        var v867 : MayBeUndefined.<string> = o.glyphOrientationVertical;
        var v868 : MayBeUndefined.<string> = o.height;
        var v869 : MayBeUndefined.<string> = o.imageRendering;
        var v870 : MayBeUndefined.<string> = o.kerning;
        var v871 : MayBeUndefined.<string> = o.left;
        var v872 : MayBeUndefined.<string> = o.letterSpacing;
        var v873 : MayBeUndefined.<string> = o.lightingColor;
        var v874 : MayBeUndefined.<string> = o.lineHeight;
        var v875 : MayBeUndefined.<string> = o.listStyle;
        var v876 : MayBeUndefined.<string> = o.listStyleImage;
        var v877 : MayBeUndefined.<string> = o.listStylePosition;
        var v878 : MayBeUndefined.<string> = o.listStyleType;
        var v879 : MayBeUndefined.<string> = o.margin;
        var v880 : MayBeUndefined.<string> = o.marginBottom;
        var v881 : MayBeUndefined.<string> = o.marginLeft;
        var v882 : MayBeUndefined.<string> = o.marginRight;
        var v883 : MayBeUndefined.<string> = o.marginTop;
        var v884 : MayBeUndefined.<string> = o.marker;
        var v885 : MayBeUndefined.<string> = o.markerEnd;
        var v886 : MayBeUndefined.<string> = o.markerMid;
        var v887 : MayBeUndefined.<string> = o.markerStart;
        var v888 : MayBeUndefined.<string> = o.mask;
        var v889 : MayBeUndefined.<string> = o.maxHeight;
        var v890 : MayBeUndefined.<string> = o.maxWidth;
        var v891 : MayBeUndefined.<string> = o.minHeight;
        var v892 : MayBeUndefined.<string> = o.minWidth;
        var v893 : MayBeUndefined.<string> = o.opacity;
        var v894 : MayBeUndefined.<string> = o.orphans;
        var v895 : MayBeUndefined.<string> = o.outline;
        var v896 : MayBeUndefined.<string> = o.outlineColor;
        var v897 : MayBeUndefined.<string> = o.outlineOffset;
        var v898 : MayBeUndefined.<string> = o.outlineStyle;
        var v899 : MayBeUndefined.<string> = o.outlineWidth;
        var v900 : MayBeUndefined.<string> = o.overflow;
        var v901 : MayBeUndefined.<string> = o.overflowX;
        var v902 : MayBeUndefined.<string> = o.overflowY;
        var v903 : MayBeUndefined.<string> = o.padding;
        var v904 : MayBeUndefined.<string> = o.paddingBottom;
        var v905 : MayBeUndefined.<string> = o.paddingLeft;
        var v906 : MayBeUndefined.<string> = o.paddingRight;
        var v907 : MayBeUndefined.<string> = o.paddingTop;
        var v908 : MayBeUndefined.<string> = o.page;
        var v909 : MayBeUndefined.<string> = o.pageBreakAfter;
        var v910 : MayBeUndefined.<string> = o.pageBreakBefore;
        var v911 : MayBeUndefined.<string> = o.pageBreakInside;
        var v912 : MayBeUndefined.<string> = o.pointerEvents;
        var v913 : MayBeUndefined.<string> = o.position;
        var v914 : MayBeUndefined.<string> = o.quotes;
        var v915 : MayBeUndefined.<string> = o.resize;
        var v916 : MayBeUndefined.<string> = o.right;
        var v917 : MayBeUndefined.<string> = o.shapeRendering;
        var v918 : MayBeUndefined.<string> = o.size;
        var v919 : MayBeUndefined.<string> = o.speak;
        var v920 : MayBeUndefined.<string> = o.src;
        var v921 : MayBeUndefined.<string> = o.stopColor;
        var v922 : MayBeUndefined.<string> = o.stopOpacity;
        var v923 : MayBeUndefined.<string> = o.stroke;
        var v924 : MayBeUndefined.<string> = o.strokeDasharray;
        var v925 : MayBeUndefined.<string> = o.strokeDashoffset;
        var v926 : MayBeUndefined.<string> = o.strokeLinecap;
        var v927 : MayBeUndefined.<string> = o.strokeLinejoin;
        var v928 : MayBeUndefined.<string> = o.strokeMiterlimit;
        var v929 : MayBeUndefined.<string> = o.strokeOpacity;
        var v930 : MayBeUndefined.<string> = o.strokeWidth;
        var v931 : MayBeUndefined.<string> = o.tableLayout;
        var v932 : MayBeUndefined.<string> = o.textAlign;
        var v933 : MayBeUndefined.<string> = o.textAnchor;
        var v934 : MayBeUndefined.<string> = o.textDecoration;
        var v935 : MayBeUndefined.<string> = o.textIndent;
        var v936 : MayBeUndefined.<string> = o.textLineThrough;
        var v937 : MayBeUndefined.<string> = o.textLineThroughColor;
        var v938 : MayBeUndefined.<string> = o.textLineThroughMode;
        var v939 : MayBeUndefined.<string> = o.textLineThroughStyle;
        var v940 : MayBeUndefined.<string> = o.textLineThroughWidth;
        var v941 : MayBeUndefined.<string> = o.textOverflow;
        var v942 : MayBeUndefined.<string> = o.textOverline;
        var v943 : MayBeUndefined.<string> = o.textOverlineColor;
        var v944 : MayBeUndefined.<string> = o.textOverlineMode;
        var v945 : MayBeUndefined.<string> = o.textOverlineStyle;
        var v946 : MayBeUndefined.<string> = o.textOverlineWidth;
        var v947 : MayBeUndefined.<string> = o.textRendering;
        var v948 : MayBeUndefined.<string> = o.textShadow;
        var v949 : MayBeUndefined.<string> = o.textTransform;
        var v950 : MayBeUndefined.<string> = o.textUnderline;
        var v951 : MayBeUndefined.<string> = o.textUnderlineColor;
        var v952 : MayBeUndefined.<string> = o.textUnderlineMode;
        var v953 : MayBeUndefined.<string> = o.textUnderlineStyle;
        var v954 : MayBeUndefined.<string> = o.textUnderlineWidth;
        var v955 : MayBeUndefined.<string> = o.top;
        var v956 : MayBeUndefined.<string> = o.unicodeBidi;
        var v957 : MayBeUndefined.<string> = o.unicodeRange;
        var v958 : MayBeUndefined.<string> = o.vectorEffect;
        var v959 : MayBeUndefined.<string> = o.verticalAlign;
        var v960 : MayBeUndefined.<string> = o.visibility;
        var v961 : MayBeUndefined.<string> = o.webkitAnimation;
        var v962 : MayBeUndefined.<string> = o.webkitAnimationDelay;
        var v963 : MayBeUndefined.<string> = o.webkitAnimationDirection;
        var v964 : MayBeUndefined.<string> = o.webkitAnimationDuration;
        var v965 : MayBeUndefined.<string> = o.webkitAnimationFillMode;
        var v966 : MayBeUndefined.<string> = o.webkitAnimationIterationCount;
        var v967 : MayBeUndefined.<string> = o.webkitAnimationName;
        var v968 : MayBeUndefined.<string> = o.webkitAnimationPlayState;
        var v969 : MayBeUndefined.<string> = o.webkitAnimationTimingFunction;
        var v970 : MayBeUndefined.<string> = o.webkitAppearance;
        var v971 : MayBeUndefined.<string> = o.webkitAspectRatio;
        var v972 : MayBeUndefined.<string> = o.webkitBackfaceVisibility;
        var v973 : MayBeUndefined.<string> = o.webkitBackgroundClip;
        var v974 : MayBeUndefined.<string> = o.webkitBackgroundComposite;
        var v975 : MayBeUndefined.<string> = o.webkitBackgroundOrigin;
        var v976 : MayBeUndefined.<string> = o.webkitBackgroundSize;
        var v977 : MayBeUndefined.<string> = o.webkitBorderAfter;
        var v978 : MayBeUndefined.<string> = o.webkitBorderAfterColor;
        var v979 : MayBeUndefined.<string> = o.webkitBorderAfterStyle;
        var v980 : MayBeUndefined.<string> = o.webkitBorderAfterWidth;
        var v981 : MayBeUndefined.<string> = o.webkitBorderBefore;
        var v982 : MayBeUndefined.<string> = o.webkitBorderBeforeColor;
        var v983 : MayBeUndefined.<string> = o.webkitBorderBeforeStyle;
        var v984 : MayBeUndefined.<string> = o.webkitBorderBeforeWidth;
        var v985 : MayBeUndefined.<string> = o.webkitBorderEnd;
        var v986 : MayBeUndefined.<string> = o.webkitBorderEndColor;
        var v987 : MayBeUndefined.<string> = o.webkitBorderEndStyle;
        var v988 : MayBeUndefined.<string> = o.webkitBorderEndWidth;
        var v989 : MayBeUndefined.<string> = o.webkitBorderFit;
        var v990 : MayBeUndefined.<string> = o.webkitBorderHorizontalSpacing;
        var v991 : MayBeUndefined.<string> = o.webkitBorderImage;
        var v992 : MayBeUndefined.<string> = o.webkitBorderRadius;
        var v993 : MayBeUndefined.<string> = o.webkitBorderStart;
        var v994 : MayBeUndefined.<string> = o.webkitBorderStartColor;
        var v995 : MayBeUndefined.<string> = o.webkitBorderStartStyle;
        var v996 : MayBeUndefined.<string> = o.webkitBorderStartWidth;
        var v997 : MayBeUndefined.<string> = o.webkitBorderVerticalSpacing;
        var v998 : MayBeUndefined.<string> = o.webkitBoxAlign;
        var v999 : MayBeUndefined.<string> = o.webkitBoxDirection;
        var v1000 : MayBeUndefined.<string> = o.webkitBoxFlex;
        var v1001 : MayBeUndefined.<string> = o.webkitBoxFlexGroup;
        var v1002 : MayBeUndefined.<string> = o.webkitBoxLines;
        var v1003 : MayBeUndefined.<string> = o.webkitBoxOrdinalGroup;
        var v1004 : MayBeUndefined.<string> = o.webkitBoxOrient;
        var v1005 : MayBeUndefined.<string> = o.webkitBoxPack;
        var v1006 : MayBeUndefined.<string> = o.webkitBoxReflect;
        var v1007 : MayBeUndefined.<string> = o.webkitBoxShadow;
        var v1008 : MayBeUndefined.<string> = o.webkitColorCorrection;
        var v1009 : MayBeUndefined.<string> = o.webkitColumnAxis;
        var v1010 : MayBeUndefined.<string> = o.webkitColumnBreakAfter;
        var v1011 : MayBeUndefined.<string> = o.webkitColumnBreakBefore;
        var v1012 : MayBeUndefined.<string> = o.webkitColumnBreakInside;
        var v1013 : MayBeUndefined.<string> = o.webkitColumnCount;
        var v1014 : MayBeUndefined.<string> = o.webkitColumnGap;
        var v1015 : MayBeUndefined.<string> = o.webkitColumnRule;
        var v1016 : MayBeUndefined.<string> = o.webkitColumnRuleColor;
        var v1017 : MayBeUndefined.<string> = o.webkitColumnRuleStyle;
        var v1018 : MayBeUndefined.<string> = o.webkitColumnRuleWidth;
        var v1019 : MayBeUndefined.<string> = o.webkitColumnSpan;
        var v1020 : MayBeUndefined.<string> = o.webkitColumnWidth;
        var v1021 : MayBeUndefined.<string> = o.webkitColumns;
        var v1022 : MayBeUndefined.<string> = o.webkitFilter;
        var v1023 : MayBeUndefined.<string> = o.webkitFlexAlign;
        var v1024 : MayBeUndefined.<string> = o.webkitFlexDirection;
        var v1025 : MayBeUndefined.<string> = o.webkitFlexFlow;
        var v1026 : MayBeUndefined.<string> = o.webkitFlexItemAlign;
        var v1027 : MayBeUndefined.<string> = o.webkitFlexLinePack;
        var v1028 : MayBeUndefined.<string> = o.webkitFlexOrder;
        var v1029 : MayBeUndefined.<string> = o.webkitFlexPack;
        var v1030 : MayBeUndefined.<string> = o.webkitFlexWrap;
        var v1031 : MayBeUndefined.<string> = o.webkitFlowFrom;
        var v1032 : MayBeUndefined.<string> = o.webkitFlowInto;
        var v1033 : MayBeUndefined.<string> = o.webkitFontFeatureSettings;
        var v1034 : MayBeUndefined.<string> = o.webkitFontKerning;
        var v1035 : MayBeUndefined.<string> = o.webkitFontSizeDelta;
        var v1036 : MayBeUndefined.<string> = o.webkitFontSmoothing;
        var v1037 : MayBeUndefined.<string> = o.webkitFontVariantLigatures;
        var v1038 : MayBeUndefined.<string> = o.webkitHighlight;
        var v1039 : MayBeUndefined.<string> = o.webkitHyphenateCharacter;
        var v1040 : MayBeUndefined.<string> = o.webkitHyphenateLimitAfter;
        var v1041 : MayBeUndefined.<string> = o.webkitHyphenateLimitBefore;
        var v1042 : MayBeUndefined.<string> = o.webkitHyphenateLimitLines;
        var v1043 : MayBeUndefined.<string> = o.webkitHyphens;
        var v1044 : MayBeUndefined.<string> = o.webkitLineAlign;
        var v1045 : MayBeUndefined.<string> = o.webkitLineBoxContain;
        var v1046 : MayBeUndefined.<string> = o.webkitLineBreak;
        var v1047 : MayBeUndefined.<string> = o.webkitLineClamp;
        var v1048 : MayBeUndefined.<string> = o.webkitLineGrid;
        var v1049 : MayBeUndefined.<string> = o.webkitLineSnap;
        var v1050 : MayBeUndefined.<string> = o.webkitLocale;
        var v1051 : MayBeUndefined.<string> = o.webkitLogicalHeight;
        var v1052 : MayBeUndefined.<string> = o.webkitLogicalWidth;
        var v1053 : MayBeUndefined.<string> = o.webkitMarginAfter;
        var v1054 : MayBeUndefined.<string> = o.webkitMarginAfterCollapse;
        var v1055 : MayBeUndefined.<string> = o.webkitMarginBefore;
        var v1056 : MayBeUndefined.<string> = o.webkitMarginBeforeCollapse;
        var v1057 : MayBeUndefined.<string> = o.webkitMarginBottomCollapse;
        var v1058 : MayBeUndefined.<string> = o.webkitMarginCollapse;
        var v1059 : MayBeUndefined.<string> = o.webkitMarginEnd;
        var v1060 : MayBeUndefined.<string> = o.webkitMarginStart;
        var v1061 : MayBeUndefined.<string> = o.webkitMarginTopCollapse;
        var v1062 : MayBeUndefined.<string> = o.webkitMarquee;
        var v1063 : MayBeUndefined.<string> = o.webkitMarqueeDirection;
        var v1064 : MayBeUndefined.<string> = o.webkitMarqueeIncrement;
        var v1065 : MayBeUndefined.<string> = o.webkitMarqueeRepetition;
        var v1066 : MayBeUndefined.<string> = o.webkitMarqueeSpeed;
        var v1067 : MayBeUndefined.<string> = o.webkitMarqueeStyle;
        var v1068 : MayBeUndefined.<string> = o.webkitMask;
        var v1069 : MayBeUndefined.<string> = o.webkitMaskAttachment;
        var v1070 : MayBeUndefined.<string> = o.webkitMaskBoxImage;
        var v1071 : MayBeUndefined.<string> = o.webkitMaskBoxImageOutset;
        var v1072 : MayBeUndefined.<string> = o.webkitMaskBoxImageRepeat;
        var v1073 : MayBeUndefined.<string> = o.webkitMaskBoxImageSlice;
        var v1074 : MayBeUndefined.<string> = o.webkitMaskBoxImageSource;
        var v1075 : MayBeUndefined.<string> = o.webkitMaskBoxImageWidth;
        var v1076 : MayBeUndefined.<string> = o.webkitMaskClip;
        var v1077 : MayBeUndefined.<string> = o.webkitMaskComposite;
        var v1078 : MayBeUndefined.<string> = o.webkitMaskImage;
        var v1079 : MayBeUndefined.<string> = o.webkitMaskOrigin;
        var v1080 : MayBeUndefined.<string> = o.webkitMaskPosition;
        var v1081 : MayBeUndefined.<string> = o.webkitMaskPositionX;
        var v1082 : MayBeUndefined.<string> = o.webkitMaskPositionY;
        var v1083 : MayBeUndefined.<string> = o.webkitMaskRepeat;
        var v1084 : MayBeUndefined.<string> = o.webkitMaskRepeatX;
        var v1085 : MayBeUndefined.<string> = o.webkitMaskRepeatY;
        var v1086 : MayBeUndefined.<string> = o.webkitMaskSize;
        var v1087 : MayBeUndefined.<string> = o.webkitMatchNearestMailBlockquoteColor;
        var v1088 : MayBeUndefined.<string> = o.webkitMaxLogicalHeight;
        var v1089 : MayBeUndefined.<string> = o.webkitMaxLogicalWidth;
        var v1090 : MayBeUndefined.<string> = o.webkitMinLogicalHeight;
        var v1091 : MayBeUndefined.<string> = o.webkitMinLogicalWidth;
        var v1092 : MayBeUndefined.<string> = o.webkitNbspMode;
        var v1093 : MayBeUndefined.<string> = o.webkitOverflowScrolling;
        var v1094 : MayBeUndefined.<string> = o.webkitPaddingAfter;
        var v1095 : MayBeUndefined.<string> = o.webkitPaddingBefore;
        var v1096 : MayBeUndefined.<string> = o.webkitPaddingEnd;
        var v1097 : MayBeUndefined.<string> = o.webkitPaddingStart;
        var v1098 : MayBeUndefined.<string> = o.webkitPerspective;
        var v1099 : MayBeUndefined.<string> = o.webkitPerspectiveOrigin;
        var v1100 : MayBeUndefined.<string> = o.webkitPerspectiveOriginX;
        var v1101 : MayBeUndefined.<string> = o.webkitPerspectiveOriginY;
        var v1102 : MayBeUndefined.<string> = o.webkitPrintColorAdjust;
        var v1103 : MayBeUndefined.<string> = o.webkitRegionBreakAfter;
        var v1104 : MayBeUndefined.<string> = o.webkitRegionBreakBefore;
        var v1105 : MayBeUndefined.<string> = o.webkitRegionBreakInside;
        var v1106 : MayBeUndefined.<string> = o.webkitRegionOverflow;
        var v1107 : MayBeUndefined.<string> = o.webkitRtlOrdering;
        var v1108 : MayBeUndefined.<string> = o.webkitSvgShadow;
        var v1109 : MayBeUndefined.<string> = o.webkitTapHighlightColor;
        var v1110 : MayBeUndefined.<string> = o.webkitTextCombine;
        var v1111 : MayBeUndefined.<string> = o.webkitTextDecorationsInEffect;
        var v1112 : MayBeUndefined.<string> = o.webkitTextEmphasis;
        var v1113 : MayBeUndefined.<string> = o.webkitTextEmphasisColor;
        var v1114 : MayBeUndefined.<string> = o.webkitTextEmphasisPosition;
        var v1115 : MayBeUndefined.<string> = o.webkitTextEmphasisStyle;
        var v1116 : MayBeUndefined.<string> = o.webkitTextFillColor;
        var v1117 : MayBeUndefined.<string> = o.webkitTextOrientation;
        var v1118 : MayBeUndefined.<string> = o.webkitTextSecurity;
        var v1119 : MayBeUndefined.<string> = o.webkitTextSizeAdjust;
        var v1120 : MayBeUndefined.<string> = o.webkitTextStroke;
        var v1121 : MayBeUndefined.<string> = o.webkitTextStrokeColor;
        var v1122 : MayBeUndefined.<string> = o.webkitTextStrokeWidth;
        var v1123 : MayBeUndefined.<string> = o.webkitTransform;
        var v1124 : MayBeUndefined.<string> = o.webkitTransformOrigin;
        var v1125 : MayBeUndefined.<string> = o.webkitTransformOriginX;
        var v1126 : MayBeUndefined.<string> = o.webkitTransformOriginY;
        var v1127 : MayBeUndefined.<string> = o.webkitTransformOriginZ;
        var v1128 : MayBeUndefined.<string> = o.webkitTransformStyle;
        var v1129 : MayBeUndefined.<string> = o.webkitTransition;
        var v1130 : MayBeUndefined.<string> = o.webkitTransitionDelay;
        var v1131 : MayBeUndefined.<string> = o.webkitTransitionDuration;
        var v1132 : MayBeUndefined.<string> = o.webkitTransitionProperty;
        var v1133 : MayBeUndefined.<string> = o.webkitTransitionTimingFunction;
        var v1134 : MayBeUndefined.<string> = o.webkitUserDrag;
        var v1135 : MayBeUndefined.<string> = o.webkitUserModify;
        var v1136 : MayBeUndefined.<string> = o.webkitUserSelect;
        var v1137 : MayBeUndefined.<string> = o.webkitWrap;
        var v1138 : MayBeUndefined.<string> = o.webkitWrapFlow;
        var v1139 : MayBeUndefined.<string> = o.webkitWrapMargin;
        var v1140 : MayBeUndefined.<string> = o.webkitWrapPadding;
        var v1141 : MayBeUndefined.<string> = o.webkitWrapShapeInside;
        var v1142 : MayBeUndefined.<string> = o.webkitWrapShapeOutside;
        var v1143 : MayBeUndefined.<string> = o.webkitWrapThrough;
        var v1144 : MayBeUndefined.<string> = o.webkitWritingMode;
        var v1145 : MayBeUndefined.<string> = o.whiteSpace;
        var v1146 : MayBeUndefined.<string> = o.widows;
        var v1147 : MayBeUndefined.<string> = o.width;
        var v1148 : MayBeUndefined.<string> = o.wordBreak;
        var v1149 : MayBeUndefined.<string> = o.wordSpacing;
        var v1150 : MayBeUndefined.<string> = o.wordWrap;
        var v1151 : MayBeUndefined.<string> = o.writingMode;
        var v1152 : MayBeUndefined.<string> = o.zIndex;
        var v1153 : MayBeUndefined.<string> = o.zoom;
        var v1154 : MayBeUndefined.<number> = o.length;
        var v1155 : MayBeUndefined.<Object/*Maybe<object>*/> = o.parentRule;
        var v1156 : MayBeUndefined.<string> = o.MozAnimation;
        var v1157 : MayBeUndefined.<string> = o.MozAnimationDelay;
        var v1158 : MayBeUndefined.<string> = o.MozAnimationDirection;
        var v1159 : MayBeUndefined.<string> = o.MozAnimationDuration;
        var v1160 : MayBeUndefined.<string> = o.MozAnimationFillMode;
        var v1161 : MayBeUndefined.<string> = o.MozAnimationIterationCount;
        var v1162 : MayBeUndefined.<string> = o.MozAnimationName;
        var v1163 : MayBeUndefined.<string> = o.MozAnimationPlayState;
        var v1164 : MayBeUndefined.<string> = o.MozAnimationTimingFunction;
        var v1165 : MayBeUndefined.<string> = o.MozAppearance;
        var v1166 : MayBeUndefined.<string> = o.MozBackfaceVisibility;
        var v1167 : MayBeUndefined.<string> = o.MozBackgroundInlinePolicy;
        var v1168 : MayBeUndefined.<string> = o.MozBinding;
        var v1169 : MayBeUndefined.<string> = o.MozBorderBottomColors;
        var v1170 : MayBeUndefined.<string> = o.MozBorderEnd;
        var v1171 : MayBeUndefined.<string> = o.MozBorderEndColor;
        var v1172 : MayBeUndefined.<string> = o.MozBorderEndStyle;
        var v1173 : MayBeUndefined.<string> = o.MozBorderEndWidth;
        var v1174 : MayBeUndefined.<string> = o.MozBorderImage;
        var v1175 : MayBeUndefined.<string> = o.MozBorderLeftColors;
        var v1176 : MayBeUndefined.<string> = o.MozBorderRightColors;
        var v1177 : MayBeUndefined.<string> = o.MozBorderStart;
        var v1178 : MayBeUndefined.<string> = o.MozBorderStartColor;
        var v1179 : MayBeUndefined.<string> = o.MozBorderStartStyle;
        var v1180 : MayBeUndefined.<string> = o.MozBorderStartWidth;
        var v1181 : MayBeUndefined.<string> = o.MozBorderTopColors;
        var v1182 : MayBeUndefined.<string> = o.MozBoxAlign;
        var v1183 : MayBeUndefined.<string> = o.MozBoxDirection;
        var v1184 : MayBeUndefined.<string> = o.MozBoxFlex;
        var v1185 : MayBeUndefined.<string> = o.MozBoxOrdinalGroup;
        var v1186 : MayBeUndefined.<string> = o.MozBoxOrient;
        var v1187 : MayBeUndefined.<string> = o.MozBoxPack;
        var v1188 : MayBeUndefined.<string> = o.MozBoxSizing;
        var v1189 : MayBeUndefined.<string> = o.MozColumnCount;
        var v1190 : MayBeUndefined.<string> = o.MozColumnGap;
        var v1191 : MayBeUndefined.<string> = o.MozColumnRule;
        var v1192 : MayBeUndefined.<string> = o.MozColumnRuleColor;
        var v1193 : MayBeUndefined.<string> = o.MozColumnRuleStyle;
        var v1194 : MayBeUndefined.<string> = o.MozColumnRuleWidth;
        var v1195 : MayBeUndefined.<string> = o.MozColumnWidth;
        var v1196 : MayBeUndefined.<string> = o.MozColumns;
        var v1197 : MayBeUndefined.<string> = o.MozFloatEdge;
        var v1198 : MayBeUndefined.<string> = o.MozFontFeatureSettings;
        var v1199 : MayBeUndefined.<string> = o.MozFontLanguageOverride;
        var v1200 : MayBeUndefined.<string> = o.MozForceBrokenImageIcon;
        var v1201 : MayBeUndefined.<string> = o.MozHyphens;
        var v1202 : MayBeUndefined.<string> = o.MozImageRegion;
        var v1203 : MayBeUndefined.<string> = o.MozMarginEnd;
        var v1204 : MayBeUndefined.<string> = o.MozMarginStart;
        var v1205 : MayBeUndefined.<string> = o.MozOpacity;
        var v1206 : MayBeUndefined.<string> = o.MozOrient;
        var v1207 : MayBeUndefined.<string> = o.MozOutline;
        var v1208 : MayBeUndefined.<string> = o.MozOutlineColor;
        var v1209 : MayBeUndefined.<string> = o.MozOutlineOffset;
        var v1210 : MayBeUndefined.<string> = o.MozOutlineRadius;
        var v1211 : MayBeUndefined.<string> = o.MozOutlineRadiusBottomleft;
        var v1212 : MayBeUndefined.<string> = o.MozOutlineRadiusBottomright;
        var v1213 : MayBeUndefined.<string> = o.MozOutlineRadiusTopleft;
        var v1214 : MayBeUndefined.<string> = o.MozOutlineRadiusTopright;
        var v1215 : MayBeUndefined.<string> = o.MozOutlineStyle;
        var v1216 : MayBeUndefined.<string> = o.MozOutlineWidth;
        var v1217 : MayBeUndefined.<string> = o.MozPaddingEnd;
        var v1218 : MayBeUndefined.<string> = o.MozPaddingStart;
        var v1219 : MayBeUndefined.<string> = o.MozPerspective;
        var v1220 : MayBeUndefined.<string> = o.MozPerspectiveOrigin;
        var v1221 : MayBeUndefined.<string> = o.MozStackSizing;
        var v1222 : MayBeUndefined.<string> = o.MozTabSize;
        var v1223 : MayBeUndefined.<string> = o.MozTextAlignLast;
        var v1224 : MayBeUndefined.<string> = o.MozTextBlink;
        var v1225 : MayBeUndefined.<string> = o.MozTextDecorationColor;
        var v1226 : MayBeUndefined.<string> = o.MozTextDecorationLine;
        var v1227 : MayBeUndefined.<string> = o.MozTextDecorationStyle;
        var v1228 : MayBeUndefined.<string> = o.MozTextSizeAdjust;
        var v1229 : MayBeUndefined.<string> = o.MozTransform;
        var v1230 : MayBeUndefined.<string> = o.MozTransformOrigin;
        var v1231 : MayBeUndefined.<string> = o.MozTransformStyle;
        var v1232 : MayBeUndefined.<string> = o.MozTransition;
        var v1233 : MayBeUndefined.<string> = o.MozTransitionDelay;
        var v1234 : MayBeUndefined.<string> = o.MozTransitionDuration;
        var v1235 : MayBeUndefined.<string> = o.MozTransitionProperty;
        var v1236 : MayBeUndefined.<string> = o.MozTransitionTimingFunction;
        var v1237 : MayBeUndefined.<string> = o.MozUserFocus;
        var v1238 : MayBeUndefined.<string> = o.MozUserInput;
        var v1239 : MayBeUndefined.<string> = o.MozUserModify;
        var v1240 : MayBeUndefined.<string> = o.MozUserSelect;
        var v1241 : MayBeUndefined.<string> = o.MozWindowShadow;
        var v1242 : MayBeUndefined.<string> = o.background;
        var v1243 : MayBeUndefined.<string> = o.backgroundAttachment;
        var v1244 : MayBeUndefined.<string> = o.backgroundClip;
        var v1245 : MayBeUndefined.<string> = o.backgroundColor;
        var v1246 : MayBeUndefined.<string> = o.backgroundImage;
        var v1247 : MayBeUndefined.<string> = o.backgroundOrigin;
        var v1248 : MayBeUndefined.<string> = o.backgroundPosition;
        var v1249 : MayBeUndefined.<string> = o.backgroundRepeat;
        var v1250 : MayBeUndefined.<string> = o.backgroundSize;
        var v1251 : MayBeUndefined.<string> = o.border;
        var v1252 : MayBeUndefined.<string> = o.borderBottom;
        var v1253 : MayBeUndefined.<string> = o.borderBottomColor;
        var v1254 : MayBeUndefined.<string> = o.borderBottomLeftRadius;
        var v1255 : MayBeUndefined.<string> = o.borderBottomRightRadius;
        var v1256 : MayBeUndefined.<string> = o.borderBottomStyle;
        var v1257 : MayBeUndefined.<string> = o.borderBottomWidth;
        var v1258 : MayBeUndefined.<string> = o.borderCollapse;
        var v1259 : MayBeUndefined.<string> = o.borderColor;
        var v1260 : MayBeUndefined.<string> = o.borderLeft;
        var v1261 : MayBeUndefined.<string> = o.borderLeftColor;
        var v1262 : MayBeUndefined.<string> = o.borderLeftStyle;
        var v1263 : MayBeUndefined.<string> = o.borderLeftWidth;
        var v1264 : MayBeUndefined.<string> = o.borderRadius;
        var v1265 : MayBeUndefined.<string> = o.borderRight;
        var v1266 : MayBeUndefined.<string> = o.borderRightColor;
        var v1267 : MayBeUndefined.<string> = o.borderRightStyle;
        var v1268 : MayBeUndefined.<string> = o.borderRightWidth;
        var v1269 : MayBeUndefined.<string> = o.borderSpacing;
        var v1270 : MayBeUndefined.<string> = o.borderStyle;
        var v1271 : MayBeUndefined.<string> = o.borderTop;
        var v1272 : MayBeUndefined.<string> = o.borderTopColor;
        var v1273 : MayBeUndefined.<string> = o.borderTopLeftRadius;
        var v1274 : MayBeUndefined.<string> = o.borderTopRightRadius;
        var v1275 : MayBeUndefined.<string> = o.borderTopStyle;
        var v1276 : MayBeUndefined.<string> = o.borderTopWidth;
        var v1277 : MayBeUndefined.<string> = o.borderWidth;
        var v1278 : MayBeUndefined.<string> = o.bottom;
        var v1279 : MayBeUndefined.<string> = o.boxShadow;
        var v1280 : MayBeUndefined.<string> = o.captionSide;
        var v1281 : MayBeUndefined.<string> = o.clear;
        var v1282 : MayBeUndefined.<string> = o.clip;
        var v1283 : MayBeUndefined.<string> = o.clipPath;
        var v1284 : MayBeUndefined.<string> = o.clipRule;
        var v1285 : MayBeUndefined.<string> = o.color;
        var v1286 : MayBeUndefined.<string> = o.colorInterpolation;
        var v1287 : MayBeUndefined.<string> = o.colorInterpolationFilters;
        var v1288 : MayBeUndefined.<string> = o.content;
        var v1289 : MayBeUndefined.<string> = o.counterIncrement;
        var v1290 : MayBeUndefined.<string> = o.counterReset;
        var v1291 : MayBeUndefined.<string> = o.cssFloat;
        var v1292 : MayBeUndefined.<string> = o.cssText;
        var v1293 : MayBeUndefined.<string> = o.cursor;
        var v1294 : MayBeUndefined.<string> = o.direction;
        var v1295 : MayBeUndefined.<string> = o.display;
        var v1296 : MayBeUndefined.<string> = o.dominantBaseline;
        var v1297 : MayBeUndefined.<string> = o.emptyCells;
        var v1298 : MayBeUndefined.<string> = o.fill;
        var v1299 : MayBeUndefined.<string> = o.fillOpacity;
        var v1300 : MayBeUndefined.<string> = o.fillRule;
        var v1301 : MayBeUndefined.<string> = o.filter;
        var v1302 : MayBeUndefined.<string> = o.floodColor;
        var v1303 : MayBeUndefined.<string> = o.floodOpacity;
        var v1304 : MayBeUndefined.<string> = o.font;
        var v1305 : MayBeUndefined.<string> = o.fontFamily;
        var v1306 : MayBeUndefined.<string> = o.fontSize;
        var v1307 : MayBeUndefined.<string> = o.fontSizeAdjust;
        var v1308 : MayBeUndefined.<string> = o.fontStretch;
        var v1309 : MayBeUndefined.<string> = o.fontStyle;
        var v1310 : MayBeUndefined.<string> = o.fontVariant;
        var v1311 : MayBeUndefined.<string> = o.fontWeight;
        var v1312 : MayBeUndefined.<string> = o.height;
        var v1313 : MayBeUndefined.<string> = o.imageRendering;
        var v1314 : MayBeUndefined.<string> = o.imeMode;
        var v1315 : MayBeUndefined.<string> = o.left;
        var v1316 : MayBeUndefined.<string> = o.letterSpacing;
        var v1317 : MayBeUndefined.<string> = o.lightingColor;
        var v1318 : MayBeUndefined.<string> = o.lineHeight;
        var v1319 : MayBeUndefined.<string> = o.listStyle;
        var v1320 : MayBeUndefined.<string> = o.listStyleImage;
        var v1321 : MayBeUndefined.<string> = o.listStylePosition;
        var v1322 : MayBeUndefined.<string> = o.listStyleType;
        var v1323 : MayBeUndefined.<string> = o.margin;
        var v1324 : MayBeUndefined.<string> = o.marginBottom;
        var v1325 : MayBeUndefined.<string> = o.marginLeft;
        var v1326 : MayBeUndefined.<string> = o.marginRight;
        var v1327 : MayBeUndefined.<string> = o.marginTop;
        var v1328 : MayBeUndefined.<string> = o.marker;
        var v1329 : MayBeUndefined.<string> = o.markerEnd;
        var v1330 : MayBeUndefined.<string> = o.markerMid;
        var v1331 : MayBeUndefined.<string> = o.markerOffset;
        var v1332 : MayBeUndefined.<string> = o.markerStart;
        var v1333 : MayBeUndefined.<string> = o.marks;
        var v1334 : MayBeUndefined.<string> = o.mask;
        var v1335 : MayBeUndefined.<string> = o.maxHeight;
        var v1336 : MayBeUndefined.<string> = o.maxWidth;
        var v1337 : MayBeUndefined.<string> = o.minHeight;
        var v1338 : MayBeUndefined.<string> = o.minWidth;
        var v1339 : MayBeUndefined.<string> = o.opacity;
        var v1340 : MayBeUndefined.<string> = o.orphans;
        var v1341 : MayBeUndefined.<string> = o.outline;
        var v1342 : MayBeUndefined.<string> = o.outlineColor;
        var v1343 : MayBeUndefined.<string> = o.outlineOffset;
        var v1344 : MayBeUndefined.<string> = o.outlineStyle;
        var v1345 : MayBeUndefined.<string> = o.outlineWidth;
        var v1346 : MayBeUndefined.<string> = o.overflow;
        var v1347 : MayBeUndefined.<string> = o.overflowX;
        var v1348 : MayBeUndefined.<string> = o.overflowY;
        var v1349 : MayBeUndefined.<string> = o.padding;
        var v1350 : MayBeUndefined.<string> = o.paddingBottom;
        var v1351 : MayBeUndefined.<string> = o.paddingLeft;
        var v1352 : MayBeUndefined.<string> = o.paddingRight;
        var v1353 : MayBeUndefined.<string> = o.paddingTop;
        var v1354 : MayBeUndefined.<string> = o.page;
        var v1355 : MayBeUndefined.<string> = o.pageBreakAfter;
        var v1356 : MayBeUndefined.<string> = o.pageBreakBefore;
        var v1357 : MayBeUndefined.<string> = o.pageBreakInside;
        var v1358 : MayBeUndefined.<string> = o.pointerEvents;
        var v1359 : MayBeUndefined.<string> = o.position;
        var v1360 : MayBeUndefined.<string> = o.quotes;
        var v1361 : MayBeUndefined.<string> = o.resize;
        var v1362 : MayBeUndefined.<string> = o.right;
        var v1363 : MayBeUndefined.<string> = o.shapeRendering;
        var v1364 : MayBeUndefined.<string> = o.size;
        var v1365 : MayBeUndefined.<string> = o.stopColor;
        var v1366 : MayBeUndefined.<string> = o.stopOpacity;
        var v1367 : MayBeUndefined.<string> = o.stroke;
        var v1368 : MayBeUndefined.<string> = o.strokeDasharray;
        var v1369 : MayBeUndefined.<string> = o.strokeDashoffset;
        var v1370 : MayBeUndefined.<string> = o.strokeLinecap;
        var v1371 : MayBeUndefined.<string> = o.strokeLinejoin;
        var v1372 : MayBeUndefined.<string> = o.strokeMiterlimit;
        var v1373 : MayBeUndefined.<string> = o.strokeOpacity;
        var v1374 : MayBeUndefined.<string> = o.strokeWidth;
        var v1375 : MayBeUndefined.<string> = o.tableLayout;
        var v1376 : MayBeUndefined.<string> = o.textAlign;
        var v1377 : MayBeUndefined.<string> = o.textAnchor;
        var v1378 : MayBeUndefined.<string> = o.textDecoration;
        var v1379 : MayBeUndefined.<string> = o.textIndent;
        var v1380 : MayBeUndefined.<string> = o.textOverflow;
        var v1381 : MayBeUndefined.<string> = o.textRendering;
        var v1382 : MayBeUndefined.<string> = o.textShadow;
        var v1383 : MayBeUndefined.<string> = o.textTransform;
        var v1384 : MayBeUndefined.<string> = o.top;
        var v1385 : MayBeUndefined.<string> = o.unicodeBidi;
        var v1386 : MayBeUndefined.<string> = o.verticalAlign;
        var v1387 : MayBeUndefined.<string> = o.visibility;
        var v1388 : MayBeUndefined.<string> = o.whiteSpace;
        var v1389 : MayBeUndefined.<string> = o.widows;
        var v1390 : MayBeUndefined.<string> = o.width;
        var v1391 : MayBeUndefined.<string> = o.wordSpacing;
        var v1392 : MayBeUndefined.<string> = o.wordWrap;
        var v1393 : MayBeUndefined.<string> = o.zIndex;
    } // CSSStyleDeclaration


    function compile_ElementCSSInlineStyle(o : ElementCSSInlineStyle) : void {
        var v1394 : CSSStyleDeclaration = o.style;
    } // ElementCSSInlineStyle


    function compile_Window(o : Window) : void {
        var f1395 : CSSStyleDeclaration = o.getComputedStyle(X.getElement());
        var f1396 : CSSStyleDeclaration = o.getComputedStyle(X.getElement(), X.getstring());
        var f1397 : MediaQueryList = o.matchMedia(X.getstring());
        var v1398 : Screen = o.screen;
        var v1399 : int/*long*/ = o.innerWidth;
        var v1400 : int/*long*/ = o.innerHeight;
        var v1401 : int/*long*/ = o.scrollX;
        var v1402 : int/*long*/ = o.pageXOffset;
        var v1403 : int/*long*/ = o.scrollY;
        var v1404 : int/*long*/ = o.pageYOffset;
        o.scroll(X.getint(), X.getint());
        o.scrollTo(X.getint(), X.getint());
        o.scrollBy(X.getint(), X.getint());
        var v1405 : int/*long*/ = o.screenX;
        var v1406 : int/*long*/ = o.screenY;
        var v1407 : int/*long*/ = o.outerWidth;
        var v1408 : int/*long*/ = o.outerHeight;
        var v1409 : Window/*WindowProxy*/ = o.window;
        var v1410 : Window/*WindowProxy*/ = o.self;
        var v1411 : HTMLDocument/*Document*/ = o.document;
        var v1412 : string/*DOMString*/ = o.name;
        var v1413 : Location = o.location;
        var v1414 : History = o.history;
        var v1415 : BarProp = o.locationbar;
        var v1416 : BarProp = o.menubar;
        var v1417 : BarProp = o.personalbar;
        var v1418 : BarProp = o.scrollbars;
        var v1419 : BarProp = o.statusbar;
        var v1420 : BarProp = o.toolbar;
        var v1421 : string/*DOMString*/ = o.status;
        o.close();
        o.stop();
        o.focus();
        o.blur();
        var v1422 : Window/*WindowProxy*/ = o.frames;
        var v1423 : int/*unsigned long*/ = o.length;
        var v1424 : Window/*WindowProxy*/ = o.top;
        var v1425 : Window/*WindowProxy?*/ = o.opener;
        var v1426 : Window/*WindowProxy*/ = o.parent;
        var v1427 : Element = o.frameElement;
        var f1428 : Window/*WindowProxy*/ = o.open();
        var f1429 : Window/*WindowProxy*/ = o.open(X.getstring());
        var f1430 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring());
        var f1431 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring());
        var f1432 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring(), X.getboolean());
        var f1433 : MayBeUndefined.<Window/*WindowProxy*/> = o.__native_index_operator__(X.getint());
        var f1434 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        var v1435 : Navigator = o.navigator;
        var v1436 : External = o.external;
        var v1437 : ApplicationCache = o.applicationCache;
        o.alert(X.getstring());
        var f1438 : boolean = o.confirm(X.getstring());
        var f1439 : string/*DOMString?*/ = o.prompt(X.getstring());
        var f1440 : string/*DOMString?*/ = o.prompt(X.getstring(), X.getstring());
        o.print();
        var f1441 : variant/*any*/ = o.showModalDialog(X.getstring());
        var f1442 : variant/*any*/ = o.showModalDialog(X.getstring(), X.getvariant());
        var v1443 : function(:Event):void/*Function?*/ = o.onabort;
        var v1444 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v1445 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v1446 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v1447 : function(:Event):void/*Function?*/ = o.onblur;
        var v1448 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v1449 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v1450 : function(:Event):void/*Function?*/ = o.onchange;
        var v1451 : function(:Event):void/*Function?*/ = o.onclick;
        var v1452 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v1453 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v1454 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v1455 : function(:Event):void/*Function?*/ = o.ondrag;
        var v1456 : function(:Event):void/*Function?*/ = o.ondragend;
        var v1457 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v1458 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v1459 : function(:Event):void/*Function?*/ = o.ondragover;
        var v1460 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v1461 : function(:Event):void/*Function?*/ = o.ondrop;
        var v1462 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v1463 : function(:Event):void/*Function?*/ = o.onemptied;
        var v1464 : function(:Event):void/*Function?*/ = o.onended;
        var v1465 : function(:Event):void/*Function?*/ = o.onerror;
        var v1466 : function(:Event):void/*Function?*/ = o.onfocus;
        var v1467 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v1468 : function(:Event):void/*Function?*/ = o.oninput;
        var v1469 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v1470 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v1471 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v1472 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v1473 : function(:Event):void/*Function?*/ = o.onload;
        var v1474 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v1475 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v1476 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v1477 : function(:Event):void/*Function?*/ = o.onmessage;
        var v1478 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v1479 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v1480 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v1481 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v1482 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v1483 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v1484 : function(:Event):void/*Function?*/ = o.onoffline;
        var v1485 : function(:Event):void/*Function?*/ = o.ononline;
        var v1486 : function(:Event):void/*Function?*/ = o.onpause;
        var v1487 : function(:Event):void/*Function?*/ = o.onplay;
        var v1488 : function(:Event):void/*Function?*/ = o.onplaying;
        var v1489 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v1490 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v1491 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v1492 : function(:Event):void/*Function?*/ = o.onprogress;
        var v1493 : function(:Event):void/*Function?*/ = o.onratechange;
        var v1494 : function(:Event):void/*Function?*/ = o.onreset;
        var v1495 : function(:Event):void/*Function?*/ = o.onresize;
        var v1496 : function(:Event):void/*Function?*/ = o.onscroll;
        var v1497 : function(:Event):void/*Function?*/ = o.onseeked;
        var v1498 : function(:Event):void/*Function?*/ = o.onseeking;
        var v1499 : function(:Event):void/*Function?*/ = o.onselect;
        var v1500 : function(:Event):void/*Function?*/ = o.onshow;
        var v1501 : function(:Event):void/*Function?*/ = o.onstalled;
        var v1502 : function(:Event):void/*Function?*/ = o.onstorage;
        var v1503 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v1504 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v1505 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v1506 : function(:Event):void/*Function?*/ = o.onunload;
        var v1507 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v1508 : function(:Event):void/*Function?*/ = o.onwaiting;
        var f1509 : string/*DOMString*/ = o.btoa(X.getstring());
        var f1510 : string/*DOMString*/ = o.atob(X.getstring());
        var v1511 : Storage = o.sessionStorage;
        var v1512 : Storage = o.localStorage;
        var f1513 : int/*long*/ = o.setTimeout(X.getfunction___void());
        var f1514 : int/*long*/ = o.setTimeout(X.getfunction___void(), X.getint());
        o.clearTimeout(X.getint());
        var f1515 : int/*long*/ = o.setInterval(X.getfunction___void());
        var f1516 : int/*long*/ = o.setInterval(X.getfunction___void(), X.getint());
        o.clearInterval(X.getint());
    } // Window


    function compile_MediaQueryList(o : MediaQueryList) : void {
        var v1517 : string/*DOMString*/ = o.media;
        var v1518 : boolean = o.matches;
        o.addListener(X.getfunction__MediaQueryList__void());
        o.removeListener(X.getfunction__MediaQueryList__void());
    } // MediaQueryList


    function compile_MediaQueryListListener(o : MediaQueryListListener) : void {
        o.handleChange(X.getMediaQueryList());
    } // MediaQueryListListener


    function compile_Screen(o : Screen) : void {
        var v1519 : int/*unsigned long*/ = o.availWidth;
        var v1520 : int/*unsigned long*/ = o.availHeight;
        var v1521 : int/*unsigned long*/ = o.width;
        var v1522 : int/*unsigned long*/ = o.height;
        var v1523 : int/*unsigned long*/ = o.colorDepth;
        var v1524 : int/*unsigned long*/ = o.pixelDepth;
    } // Screen


    function compile_CaretPosition(o : CaretPosition) : void {
        var v1525 : Node = o.offsetNode;
        var v1526 : int/*unsigned long*/ = o.offset;
    } // CaretPosition


    function compile_HTMLElement(o : HTMLElement) : void {
        var v1527 : Element = o.offsetParent;
        var v1528 : int/*long*/ = o.offsetTop;
        var v1529 : int/*long*/ = o.offsetLeft;
        var v1530 : int/*long*/ = o.offsetWidth;
        var v1531 : int/*long*/ = o.offsetHeight;
        var v1532 : string/*DOMString*/ = o.title;
        var v1533 : string/*DOMString*/ = o.lang;
        var v1534 : boolean = o.translate;
        var v1535 : string/*DOMString*/ = o.dir;
        var v1536 : string/*DOMString*/ = o.className;
        var v1537 : DOMTokenList = o.classList;
        var v1538 : DOMStringMap = o.dataset;
        var v1539 : boolean = o.hidden;
        o.click();
        var v1540 : int/*long*/ = o.tabIndex;
        o.focus();
        o.blur();
        var v1541 : string/*DOMString*/ = o.accessKey;
        var v1542 : string/*DOMString*/ = o.accessKeyLabel;
        var v1543 : boolean = o.draggable;
        var v1544 : DOMSettableTokenList = o.dropzone;
        var v1545 : string/*DOMString*/ = o.contentEditable;
        var v1546 : boolean = o.isContentEditable;
        var v1547 : HTMLMenuElement = o.contextMenu;
        var v1548 : boolean = o.spellcheck;
        var v1549 : string/*DOMString?*/ = o.commandType;
        var v1550 : string/*DOMString?*/ = o.commandLabel;
        var v1551 : string/*DOMString?*/ = o.commandIcon;
        var v1552 : boolean = o.commandHidden;
        var v1553 : boolean = o.commandDisabled;
        var v1554 : boolean = o.commandChecked;
        var v1555 : CSSStyleDeclaration = o.style;
        var v1556 : function(:Event):void/*Function?*/ = o.onabort;
        var v1557 : function(:Event):void/*Function?*/ = o.onblur;
        var v1558 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v1559 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v1560 : function(:Event):void/*Function?*/ = o.onchange;
        var v1561 : function(:Event):void/*Function?*/ = o.onclick;
        var v1562 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v1563 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v1564 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v1565 : function(:Event):void/*Function?*/ = o.ondrag;
        var v1566 : function(:Event):void/*Function?*/ = o.ondragend;
        var v1567 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v1568 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v1569 : function(:Event):void/*Function?*/ = o.ondragover;
        var v1570 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v1571 : function(:Event):void/*Function?*/ = o.ondrop;
        var v1572 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v1573 : function(:Event):void/*Function?*/ = o.onemptied;
        var v1574 : function(:Event):void/*Function?*/ = o.onended;
        var v1575 : function(:Event):void/*Function?*/ = o.onerror;
        var v1576 : function(:Event):void/*Function?*/ = o.onfocus;
        var v1577 : function(:Event):void/*Function?*/ = o.oninput;
        var v1578 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v1579 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v1580 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v1581 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v1582 : function(:Event):void/*Function?*/ = o.onload;
        var v1583 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v1584 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v1585 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v1586 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v1587 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v1588 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v1589 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v1590 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v1591 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v1592 : function(:Event):void/*Function?*/ = o.onpause;
        var v1593 : function(:Event):void/*Function?*/ = o.onplay;
        var v1594 : function(:Event):void/*Function?*/ = o.onplaying;
        var v1595 : function(:Event):void/*Function?*/ = o.onprogress;
        var v1596 : function(:Event):void/*Function?*/ = o.onratechange;
        var v1597 : function(:Event):void/*Function?*/ = o.onreset;
        var v1598 : function(:Event):void/*Function?*/ = o.onscroll;
        var v1599 : function(:Event):void/*Function?*/ = o.onseeked;
        var v1600 : function(:Event):void/*Function?*/ = o.onseeking;
        var v1601 : function(:Event):void/*Function?*/ = o.onselect;
        var v1602 : function(:Event):void/*Function?*/ = o.onshow;
        var v1603 : function(:Event):void/*Function?*/ = o.onstalled;
        var v1604 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v1605 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v1606 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v1607 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v1608 : function(:Event):void/*Function?*/ = o.onwaiting;
    } // HTMLElement


    function compile_ClientRectList(o : ClientRectList) : void {
        var v1609 : int/*unsigned long*/ = o.length;
        var f1610 : MayBeUndefined.<ClientRect> = o.__native_index_operator__(X.getint());
        var f1611 : MayBeUndefined.<ClientRect> = o.item(X.getint());
    } // ClientRectList


    function compile_ClientRect(o : ClientRect) : void {
        var v1612 : number/*float*/ = o.top;
        var v1613 : number/*float*/ = o.right;
        var v1614 : number/*float*/ = o.bottom;
        var v1615 : number/*float*/ = o.left;
        var v1616 : number/*float*/ = o.width;
        var v1617 : number/*float*/ = o.height;
    } // ClientRect


    function compile_HTMLAllCollection(o : HTMLAllCollection) : void {
        var f1618 : Object/*object?*/ = o.item(X.getstring());
        var f1619 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f1620 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
        var f1621 : HTMLAllCollection = o.tags(X.getstring());
    } // HTMLAllCollection


    function compile_HTMLFormControlsCollection(o : HTMLFormControlsCollection) : void {
        var f1622 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f1623 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
    } // HTMLFormControlsCollection


    function compile_RadioNodeList(o : RadioNodeList) : void {
        var v1624 : string/*DOMString*/ = o.value;
    } // RadioNodeList


    function compile_HTMLOptionsCollection(o : HTMLOptionsCollection) : void {
        var v1625 : int/*unsigned long*/ = o.length;
        var f1626 : MayBeUndefined.<Object/*object?*/> = o.__native_index_operator__(X.getstring());
        var f1627 : MayBeUndefined.<Object/*object?*/> = o.namedItem(X.getstring());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getHTMLElement());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getint());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getHTMLElement());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getint());
        o.remove(X.getint());
        var v1628 : int/*long*/ = o.selectedIndex;
    } // HTMLOptionsCollection


    function compile_DOMStringMap(o : DOMStringMap) : void {
        var f1629 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getstring());
    } // DOMStringMap


    function compile_Transferable(o : Transferable) : void {
    } // Transferable


    function compile_HTMLDocument(o : HTMLDocument) : void {
        var v1630 : Location = o.location;
        var v1631 : string/*DOMString*/ = o.URL;
        var v1632 : string/*DOMString*/ = o.domain;
        var v1633 : string/*DOMString*/ = o.referrer;
        var v1634 : string/*DOMString*/ = o.cookie;
        var v1635 : string/*DOMString*/ = o.lastModified;
        var v1636 : string/*DOMString*/ = o.readyState;
        var f1637 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        var v1638 : string/*DOMString*/ = o.title;
        var v1639 : string/*DOMString*/ = o.dir;
        var v1640 : HTMLElement = o.body;
        var v1641 : HTMLHeadElement = o.head;
        var v1642 : HTMLCollection = o.images;
        var v1643 : HTMLCollection = o.embeds;
        var v1644 : HTMLCollection = o.plugins;
        var v1645 : HTMLCollection = o.links;
        var v1646 : HTMLCollection = o.forms;
        var v1647 : HTMLCollection = o.scripts;
        var f1648 : NodeList = o.getElementsByName(X.getstring());
        var f1649 : HTMLDocument/*Document*/ = o.open();
        var f1650 : HTMLDocument/*Document*/ = o.open(X.getstring());
        var f1651 : HTMLDocument/*Document*/ = o.open(X.getstring(), X.getstring());
        var f1652 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring());
        var f1653 : Window/*WindowProxy*/ = o.open(X.getstring(), X.getstring(), X.getstring(), X.getboolean());
        o.close();
        o.write();
        o.write(X.getstring());
        o.writeln();
        o.writeln(X.getstring());
        var v1654 : Window/*WindowProxy?*/ = o.defaultView;
        var v1655 : Element = o.activeElement;
        var f1656 : boolean = o.hasFocus();
        var v1657 : string/*DOMString*/ = o.designMode;
        var f1658 : boolean = o.execCommand(X.getstring());
        var f1659 : boolean = o.execCommand(X.getstring(), X.getboolean());
        var f1660 : boolean = o.execCommand(X.getstring(), X.getboolean(), X.getstring());
        var f1661 : boolean = o.queryCommandEnabled(X.getstring());
        var f1662 : boolean = o.queryCommandIndeterm(X.getstring());
        var f1663 : boolean = o.queryCommandState(X.getstring());
        var f1664 : boolean = o.queryCommandSupported(X.getstring());
        var f1665 : string/*DOMString*/ = o.queryCommandValue(X.getstring());
        var v1666 : HTMLCollection = o.commands;
        var v1667 : function(:Event):void/*Function?*/ = o.onabort;
        var v1668 : function(:Event):void/*Function?*/ = o.onblur;
        var v1669 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v1670 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v1671 : function(:Event):void/*Function?*/ = o.onchange;
        var v1672 : function(:Event):void/*Function?*/ = o.onclick;
        var v1673 : function(:Event):void/*Function?*/ = o.oncontextmenu;
        var v1674 : function(:Event):void/*Function?*/ = o.oncuechange;
        var v1675 : function(:Event):void/*Function?*/ = o.ondblclick;
        var v1676 : function(:Event):void/*Function?*/ = o.ondrag;
        var v1677 : function(:Event):void/*Function?*/ = o.ondragend;
        var v1678 : function(:Event):void/*Function?*/ = o.ondragenter;
        var v1679 : function(:Event):void/*Function?*/ = o.ondragleave;
        var v1680 : function(:Event):void/*Function?*/ = o.ondragover;
        var v1681 : function(:Event):void/*Function?*/ = o.ondragstart;
        var v1682 : function(:Event):void/*Function?*/ = o.ondrop;
        var v1683 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v1684 : function(:Event):void/*Function?*/ = o.onemptied;
        var v1685 : function(:Event):void/*Function?*/ = o.onended;
        var v1686 : function(:Event):void/*Function?*/ = o.onerror;
        var v1687 : function(:Event):void/*Function?*/ = o.onfocus;
        var v1688 : function(:Event):void/*Function?*/ = o.oninput;
        var v1689 : function(:Event):void/*Function?*/ = o.oninvalid;
        var v1690 : function(:Event):void/*Function?*/ = o.onkeydown;
        var v1691 : function(:Event):void/*Function?*/ = o.onkeypress;
        var v1692 : function(:Event):void/*Function?*/ = o.onkeyup;
        var v1693 : function(:Event):void/*Function?*/ = o.onload;
        var v1694 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v1695 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v1696 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v1697 : function(:Event):void/*Function?*/ = o.onmousedown;
        var v1698 : function(:Event):void/*Function?*/ = o.onmousemove;
        var v1699 : function(:Event):void/*Function?*/ = o.onmouseout;
        var v1700 : function(:Event):void/*Function?*/ = o.onmouseover;
        var v1701 : function(:Event):void/*Function?*/ = o.onmouseup;
        var v1702 : function(:Event):void/*Function?*/ = o.onmousewheel;
        var v1703 : function(:Event):void/*Function?*/ = o.onpause;
        var v1704 : function(:Event):void/*Function?*/ = o.onplay;
        var v1705 : function(:Event):void/*Function?*/ = o.onplaying;
        var v1706 : function(:Event):void/*Function?*/ = o.onprogress;
        var v1707 : function(:Event):void/*Function?*/ = o.onratechange;
        var v1708 : function(:Event):void/*Function?*/ = o.onreset;
        var v1709 : function(:Event):void/*Function?*/ = o.onscroll;
        var v1710 : function(:Event):void/*Function?*/ = o.onseeked;
        var v1711 : function(:Event):void/*Function?*/ = o.onseeking;
        var v1712 : function(:Event):void/*Function?*/ = o.onselect;
        var v1713 : function(:Event):void/*Function?*/ = o.onshow;
        var v1714 : function(:Event):void/*Function?*/ = o.onstalled;
        var v1715 : function(:Event):void/*Function?*/ = o.onsubmit;
        var v1716 : function(:Event):void/*Function?*/ = o.onsuspend;
        var v1717 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v1718 : function(:Event):void/*Function?*/ = o.onvolumechange;
        var v1719 : function(:Event):void/*Function?*/ = o.onwaiting;
        var v1720 : function(:Event):void/*Function?*/ = o.onreadystatechange;
        var v1721 : string/*DOMString*/ = o.fgColor;
        var v1722 : string/*DOMString*/ = o.linkColor;
        var v1723 : string/*DOMString*/ = o.vlinkColor;
        var v1724 : string/*DOMString*/ = o.alinkColor;
        var v1725 : string/*DOMString*/ = o.bgColor;
        var v1726 : HTMLCollection = o.anchors;
        var v1727 : HTMLCollection = o.applets;
        o.clear();
        var v1728 : HTMLAllCollection = o.all;
    } // HTMLDocument


    function compile_HTMLUnknownElement(o : HTMLUnknownElement) : void {
    } // HTMLUnknownElement


    function compile_HTMLHtmlElement(o : HTMLHtmlElement) : void {
        var v1729 : string/*DOMString*/ = o.version;
    } // HTMLHtmlElement


    function compile_HTMLHeadElement(o : HTMLHeadElement) : void {
    } // HTMLHeadElement


    function compile_HTMLTitleElement(o : HTMLTitleElement) : void {
        var v1730 : string/*DOMString*/ = o.text;
    } // HTMLTitleElement


    function compile_HTMLBaseElement(o : HTMLBaseElement) : void {
        var v1731 : string/*DOMString*/ = o.href;
        var v1732 : string/*DOMString*/ = o.target;
    } // HTMLBaseElement


    function compile_HTMLLinkElement(o : HTMLLinkElement) : void {
        var v1733 : boolean = o.disabled;
        var v1734 : string/*DOMString*/ = o.href;
        var v1735 : string/*DOMString*/ = o.rel;
        var v1736 : DOMTokenList = o.relList;
        var v1737 : string/*DOMString*/ = o.media;
        var v1738 : string/*DOMString*/ = o.hreflang;
        var v1739 : string/*DOMString*/ = o.type;
        var v1740 : DOMSettableTokenList = o.sizes;
        var v1741 : string/*DOMString*/ = o.charset;
        var v1742 : string/*DOMString*/ = o.rev;
        var v1743 : string/*DOMString*/ = o.target;
        var v1744 : StyleSheet = o.sheet;
    } // HTMLLinkElement


    function compile_HTMLMetaElement(o : HTMLMetaElement) : void {
        var v1745 : string/*DOMString*/ = o.name;
        var v1746 : string/*DOMString*/ = o.httpEquiv;
        var v1747 : string/*DOMString*/ = o.content;
        var v1748 : string/*DOMString*/ = o.scheme;
    } // HTMLMetaElement


    function compile_HTMLStyleElement(o : HTMLStyleElement) : void {
        var v1749 : boolean = o.disabled;
        var v1750 : string/*DOMString*/ = o.media;
        var v1751 : string/*DOMString*/ = o.type;
        var v1752 : boolean = o.scoped;
        var v1753 : StyleSheet = o.sheet;
    } // HTMLStyleElement


    function compile_HTMLScriptElement(o : HTMLScriptElement) : void {
        var v1754 : string/*DOMString*/ = o.src;
        var v1755 : boolean = o.async;
        var v1756 : boolean = o.defer;
        var v1757 : string/*DOMString*/ = o.type;
        var v1758 : string/*DOMString*/ = o.charset;
        var v1759 : string/*DOMString*/ = o.text;
        var v1760 : string/*DOMString*/ = o.event;
        var v1761 : string/*DOMString*/ = o.htmlFor;
    } // HTMLScriptElement


    function compile_HTMLBodyElement(o : HTMLBodyElement) : void {
        var v1762 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v1763 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v1764 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v1765 : function(:Event):void/*Function?*/ = o.onblur;
        var v1766 : function(:Event):void/*Function?*/ = o.onerror;
        var v1767 : function(:Event):void/*Function?*/ = o.onfocus;
        var v1768 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v1769 : function(:Event):void/*Function?*/ = o.onload;
        var v1770 : function(:Event):void/*Function?*/ = o.onmessage;
        var v1771 : function(:Event):void/*Function?*/ = o.onoffline;
        var v1772 : function(:Event):void/*Function?*/ = o.ononline;
        var v1773 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v1774 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v1775 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v1776 : function(:Event):void/*Function?*/ = o.onresize;
        var v1777 : function(:Event):void/*Function?*/ = o.onscroll;
        var v1778 : function(:Event):void/*Function?*/ = o.onstorage;
        var v1779 : function(:Event):void/*Function?*/ = o.onunload;
        var v1780 : string/*DOMString*/ = o.text;
        var v1781 : string/*DOMString*/ = o.link;
        var v1782 : string/*DOMString*/ = o.vLink;
        var v1783 : string/*DOMString*/ = o.aLink;
        var v1784 : string/*DOMString*/ = o.bgColor;
        var v1785 : string/*DOMString*/ = o.background;
    } // HTMLBodyElement


    function compile_HTMLHeadingElement(o : HTMLHeadingElement) : void {
        var v1786 : string/*DOMString*/ = o.align;
    } // HTMLHeadingElement


    function compile_HTMLParagraphElement(o : HTMLParagraphElement) : void {
        var v1787 : string/*DOMString*/ = o.align;
    } // HTMLParagraphElement


    function compile_HTMLHRElement(o : HTMLHRElement) : void {
        var v1788 : string/*DOMString*/ = o.align;
        var v1789 : string/*DOMString*/ = o.color;
        var v1790 : boolean = o.noShade;
        var v1791 : string/*DOMString*/ = o.size;
        var v1792 : string/*DOMString*/ = o.width;
    } // HTMLHRElement


    function compile_HTMLPreElement(o : HTMLPreElement) : void {
        var v1793 : int/*long*/ = o.width;
    } // HTMLPreElement


    function compile_HTMLQuoteElement(o : HTMLQuoteElement) : void {
        var v1794 : string/*DOMString*/ = o.cite;
    } // HTMLQuoteElement


    function compile_HTMLOListElement(o : HTMLOListElement) : void {
        var v1795 : boolean = o.reversed;
        var v1796 : int/*long*/ = o.start;
        var v1797 : string/*DOMString*/ = o.type;
        var v1798 : boolean = o.compact;
    } // HTMLOListElement


    function compile_HTMLUListElement(o : HTMLUListElement) : void {
        var v1799 : boolean = o.compact;
        var v1800 : string/*DOMString*/ = o.type;
    } // HTMLUListElement


    function compile_HTMLLIElement(o : HTMLLIElement) : void {
        var v1801 : int/*long*/ = o.value;
        var v1802 : string/*DOMString*/ = o.type;
    } // HTMLLIElement


    function compile_HTMLDListElement(o : HTMLDListElement) : void {
        var v1803 : boolean = o.compact;
    } // HTMLDListElement


    function compile_HTMLDivElement(o : HTMLDivElement) : void {
        var v1804 : string/*DOMString*/ = o.align;
    } // HTMLDivElement


    function compile_HTMLAnchorElement(o : HTMLAnchorElement) : void {
        var v1805 : string/*DOMString*/ = o.href;
        var v1806 : string/*DOMString*/ = o.target;
        var v1807 : string/*DOMString*/ = o.rel;
        var v1808 : DOMTokenList = o.relList;
        var v1809 : string/*DOMString*/ = o.media;
        var v1810 : string/*DOMString*/ = o.hreflang;
        var v1811 : string/*DOMString*/ = o.type;
        var v1812 : string/*DOMString*/ = o.text;
        var v1813 : string/*DOMString*/ = o.protocol;
        var v1814 : string/*DOMString*/ = o.host;
        var v1815 : string/*DOMString*/ = o.hostname;
        var v1816 : string/*DOMString*/ = o.port;
        var v1817 : string/*DOMString*/ = o.pathname;
        var v1818 : string/*DOMString*/ = o.search;
        var v1819 : string/*DOMString*/ = o.hash;
        var v1820 : string/*DOMString*/ = o.coords;
        var v1821 : string/*DOMString*/ = o.charset;
        var v1822 : string/*DOMString*/ = o.name;
        var v1823 : string/*DOMString*/ = o.rev;
        var v1824 : string/*DOMString*/ = o.shape;
    } // HTMLAnchorElement


    function compile_HTMLTimeElement(o : HTMLTimeElement) : void {
        var v1825 : string/*DOMString*/ = o.datetime;
    } // HTMLTimeElement


    function compile_HTMLSpanElement(o : HTMLSpanElement) : void {
    } // HTMLSpanElement


    function compile_HTMLBRElement(o : HTMLBRElement) : void {
        var v1826 : string/*DOMString*/ = o.clear;
    } // HTMLBRElement


    function compile_HTMLModElement(o : HTMLModElement) : void {
        var v1827 : string/*DOMString*/ = o.cite;
        var v1828 : string/*DOMString*/ = o.dateTime;
    } // HTMLModElement


    function compile_HTMLImageElement(o : HTMLImageElement) : void {
        var v1829 : string/*DOMString*/ = o.alt;
        var v1830 : string/*DOMString*/ = o.src;
        var v1831 : string/*DOMString*/ = o.crossOrigin;
        var v1832 : string/*DOMString*/ = o.useMap;
        var v1833 : boolean = o.isMap;
        var v1834 : int/*unsigned long*/ = o.width;
        var v1835 : int/*unsigned long*/ = o.height;
        var v1836 : int/*unsigned long*/ = o.naturalWidth;
        var v1837 : int/*unsigned long*/ = o.naturalHeight;
        var v1838 : boolean = o.complete;
        var v1839 : string/*DOMString*/ = o.name;
        var v1840 : string/*DOMString*/ = o.align;
        var v1841 : int/*unsigned long*/ = o.hspace;
        var v1842 : int/*unsigned long*/ = o.vspace;
        var v1843 : string/*DOMString*/ = o.longDesc;
        var v1844 : string/*DOMString*/ = o.border;
    } // HTMLImageElement


    function compile_HTMLIFrameElement(o : HTMLIFrameElement) : void {
        var v1845 : string/*DOMString*/ = o.src;
        var v1846 : string/*DOMString*/ = o.srcdoc;
        var v1847 : string/*DOMString*/ = o.name;
        var v1848 : DOMSettableTokenList = o.sandbox;
        var v1849 : boolean = o.seamless;
        var v1850 : string/*DOMString*/ = o.width;
        var v1851 : string/*DOMString*/ = o.height;
        var v1852 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v1853 : Window/*WindowProxy?*/ = o.contentWindow;
        var v1854 : string/*DOMString*/ = o.align;
        var v1855 : string/*DOMString*/ = o.scrolling;
        var v1856 : string/*DOMString*/ = o.frameBorder;
        var v1857 : string/*DOMString*/ = o.longDesc;
        var v1858 : string/*DOMString*/ = o.marginHeight;
        var v1859 : string/*DOMString*/ = o.marginWidth;
    } // HTMLIFrameElement


    function compile_HTMLEmbedElement(o : HTMLEmbedElement) : void {
        var v1860 : string/*DOMString*/ = o.src;
        var v1861 : string/*DOMString*/ = o.type;
        var v1862 : string/*DOMString*/ = o.width;
        var v1863 : string/*DOMString*/ = o.height;
        var v1864 : string/*DOMString*/ = o.align;
        var v1865 : string/*DOMString*/ = o.name;
    } // HTMLEmbedElement


    function compile_HTMLObjectElement(o : HTMLObjectElement) : void {
        var v1866 : string/*DOMString*/ = o.data;
        var v1867 : string/*DOMString*/ = o.type;
        var v1868 : boolean = o.typeMustMatch;
        var v1869 : string/*DOMString*/ = o.name;
        var v1870 : string/*DOMString*/ = o.useMap;
        var v1871 : HTMLFormElement = o.form;
        var v1872 : string/*DOMString*/ = o.width;
        var v1873 : string/*DOMString*/ = o.height;
        var v1874 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v1875 : Window/*WindowProxy?*/ = o.contentWindow;
        var v1876 : boolean = o.willValidate;
        var v1877 : ValidityState = o.validity;
        var v1878 : string/*DOMString*/ = o.validationMessage;
        var f1879 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v1880 : string/*DOMString*/ = o.align;
        var v1881 : string/*DOMString*/ = o.archive;
        var v1882 : string/*DOMString*/ = o.code;
        var v1883 : boolean = o.declare;
        var v1884 : int/*unsigned long*/ = o.hspace;
        var v1885 : string/*DOMString*/ = o.standby;
        var v1886 : int/*unsigned long*/ = o.vspace;
        var v1887 : string/*DOMString*/ = o.codeBase;
        var v1888 : string/*DOMString*/ = o.codeType;
        var v1889 : string/*DOMString*/ = o.border;
    } // HTMLObjectElement


    function compile_HTMLParamElement(o : HTMLParamElement) : void {
        var v1890 : string/*DOMString*/ = o.name;
        var v1891 : string/*DOMString*/ = o.value;
        var v1892 : string/*DOMString*/ = o.type;
        var v1893 : string/*DOMString*/ = o.valueType;
    } // HTMLParamElement


    function compile_HTMLVideoElement(o : HTMLVideoElement) : void {
        var v1894 : int/*unsigned long*/ = o.width;
        var v1895 : int/*unsigned long*/ = o.height;
        var v1896 : int/*unsigned long*/ = o.videoWidth;
        var v1897 : int/*unsigned long*/ = o.videoHeight;
        var v1898 : string/*DOMString*/ = o.poster;
    } // HTMLVideoElement


    function compile_HTMLAudioElement(o : HTMLAudioElement) : void {
    } // HTMLAudioElement


    function compile_HTMLSourceElement(o : HTMLSourceElement) : void {
        var v1899 : string/*DOMString*/ = o.src;
        var v1900 : string/*DOMString*/ = o.type;
        var v1901 : string/*DOMString*/ = o.media;
    } // HTMLSourceElement


    function compile_HTMLTrackElement(o : HTMLTrackElement) : void {
        var v1902 : string/*DOMString*/ = o.kind;
        var v1903 : string/*DOMString*/ = o.src;
        var v1904 : string/*DOMString*/ = o.srclang;
        var v1905 : string/*DOMString*/ = o.label;
        var v1906 : boolean = o.default;
        var v1907 : int/*unsigned short*/ = HTMLTrackElement.NONE;
        var v1908 : int/*unsigned short*/ = o.NONE;
        var v1909 : int/*unsigned short*/ = HTMLTrackElement.LOADING;
        var v1910 : int/*unsigned short*/ = o.LOADING;
        var v1911 : int/*unsigned short*/ = HTMLTrackElement.LOADED;
        var v1912 : int/*unsigned short*/ = o.LOADED;
        var v1913 : int/*unsigned short*/ = HTMLTrackElement.ERROR;
        var v1914 : int/*unsigned short*/ = o.ERROR;
        var v1915 : int/*unsigned short*/ = o.readyState;
        var v1916 : TextTrack = o.track;
    } // HTMLTrackElement


    function compile_HTMLMediaElement(o : HTMLMediaElement) : void {
        var v1917 : MediaError = o.error;
        var v1918 : string/*DOMString*/ = o.src;
        var v1919 : string/*DOMString*/ = o.currentSrc;
        var v1920 : string/*DOMString*/ = o.crossOrigin;
        var v1921 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_EMPTY;
        var v1922 : int/*unsigned short*/ = o.NETWORK_EMPTY;
        var v1923 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_IDLE;
        var v1924 : int/*unsigned short*/ = o.NETWORK_IDLE;
        var v1925 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_LOADING;
        var v1926 : int/*unsigned short*/ = o.NETWORK_LOADING;
        var v1927 : int/*unsigned short*/ = HTMLMediaElement.NETWORK_NO_SOURCE;
        var v1928 : int/*unsigned short*/ = o.NETWORK_NO_SOURCE;
        var v1929 : int/*unsigned short*/ = o.networkState;
        var v1930 : string/*DOMString*/ = o.preload;
        var v1931 : TimeRanges = o.buffered;
        o.load();
        var f1932 : string/*DOMString*/ = o.canPlayType(X.getstring());
        var v1933 : int/*unsigned short*/ = HTMLMediaElement.HAVE_NOTHING;
        var v1934 : int/*unsigned short*/ = o.HAVE_NOTHING;
        var v1935 : int/*unsigned short*/ = HTMLMediaElement.HAVE_METADATA;
        var v1936 : int/*unsigned short*/ = o.HAVE_METADATA;
        var v1937 : int/*unsigned short*/ = HTMLMediaElement.HAVE_CURRENT_DATA;
        var v1938 : int/*unsigned short*/ = o.HAVE_CURRENT_DATA;
        var v1939 : int/*unsigned short*/ = HTMLMediaElement.HAVE_FUTURE_DATA;
        var v1940 : int/*unsigned short*/ = o.HAVE_FUTURE_DATA;
        var v1941 : int/*unsigned short*/ = HTMLMediaElement.HAVE_ENOUGH_DATA;
        var v1942 : int/*unsigned short*/ = o.HAVE_ENOUGH_DATA;
        var v1943 : int/*unsigned short*/ = o.readyState;
        var v1944 : boolean = o.seeking;
        var v1945 : number/*double*/ = o.currentTime;
        var v1946 : number/*double*/ = o.initialTime;
        var v1947 : number/*double*/ = o.duration;
        var v1948 : Date = o.startOffsetTime;
        var v1949 : boolean = o.paused;
        var v1950 : number/*double*/ = o.defaultPlaybackRate;
        var v1951 : number/*double*/ = o.playbackRate;
        var v1952 : TimeRanges = o.played;
        var v1953 : TimeRanges = o.seekable;
        var v1954 : boolean = o.ended;
        var v1955 : boolean = o.autoplay;
        var v1956 : boolean = o.loop;
        o.play();
        o.pause();
        var v1957 : string/*DOMString*/ = o.mediaGroup;
        var v1958 : MediaController = o.controller;
        var v1959 : boolean = o.controls;
        var v1960 : number/*double*/ = o.volume;
        var v1961 : boolean = o.muted;
        var v1962 : boolean = o.defaultMuted;
        var v1963 : AudioTrackList = o.audioTracks;
        var v1964 : VideoTrackList = o.videoTracks;
        var v1965 : TextTrackList = o.textTracks;
        var f1966 : TextTrack = o.addTextTrack(X.getstring());
        var f1967 : TextTrack = o.addTextTrack(X.getstring(), X.getstring());
        var f1968 : TextTrack = o.addTextTrack(X.getstring(), X.getstring(), X.getstring());
    } // HTMLMediaElement


    function compile_MediaError(o : MediaError) : void {
        var v1969 : int/*unsigned short*/ = MediaError.MEDIA_ERR_ABORTED;
        var v1970 : int/*unsigned short*/ = o.MEDIA_ERR_ABORTED;
        var v1971 : int/*unsigned short*/ = MediaError.MEDIA_ERR_NETWORK;
        var v1972 : int/*unsigned short*/ = o.MEDIA_ERR_NETWORK;
        var v1973 : int/*unsigned short*/ = MediaError.MEDIA_ERR_DECODE;
        var v1974 : int/*unsigned short*/ = o.MEDIA_ERR_DECODE;
        var v1975 : int/*unsigned short*/ = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;
        var v1976 : int/*unsigned short*/ = o.MEDIA_ERR_SRC_NOT_SUPPORTED;
        var v1977 : int/*unsigned short*/ = o.code;
    } // MediaError


    function compile_AudioTrackList(o : AudioTrackList) : void {
        var v1978 : int/*unsigned long*/ = o.length;
        var f1979 : MayBeUndefined.<AudioTrack> = o.__native_index_operator__(X.getint());
        var f1980 : AudioTrack = o.getTrackById(X.getstring());
        var v1981 : function(:Event):void/*Function?*/ = o.onchange;
        var v1982 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // AudioTrackList


    function compile_AudioTrack(o : AudioTrack) : void {
        var v1983 : string/*DOMString*/ = o.id;
        var v1984 : string/*DOMString*/ = o.kind;
        var v1985 : string/*DOMString*/ = o.label;
        var v1986 : string/*DOMString*/ = o.language;
        var v1987 : boolean = o.enabled;
    } // AudioTrack


    function compile_VideoTrackList(o : VideoTrackList) : void {
        var v1988 : int/*unsigned long*/ = o.length;
        var f1989 : MayBeUndefined.<VideoTrack> = o.__native_index_operator__(X.getint());
        var f1990 : VideoTrack = o.getTrackById(X.getstring());
        var v1991 : int/*long*/ = o.selectedIndex;
        var v1992 : function(:Event):void/*Function?*/ = o.onchange;
        var v1993 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // VideoTrackList


    function compile_VideoTrack(o : VideoTrack) : void {
        var v1994 : string/*DOMString*/ = o.id;
        var v1995 : string/*DOMString*/ = o.kind;
        var v1996 : string/*DOMString*/ = o.label;
        var v1997 : string/*DOMString*/ = o.language;
        var v1998 : boolean = o.selected;
    } // VideoTrack


    function compile_MediaController(o : MediaController) : void {
        var v1999 : TimeRanges = o.buffered;
        var v2000 : TimeRanges = o.seekable;
        var v2001 : number/*double*/ = o.duration;
        var v2002 : number/*double*/ = o.currentTime;
        var v2003 : boolean = o.paused;
        var v2004 : TimeRanges = o.played;
        o.play();
        o.pause();
        var v2005 : number/*double*/ = o.defaultPlaybackRate;
        var v2006 : number/*double*/ = o.playbackRate;
        var v2007 : number/*double*/ = o.volume;
        var v2008 : boolean = o.muted;
        var v2009 : function(:Event):void/*Function?*/ = o.onemptied;
        var v2010 : function(:Event):void/*Function?*/ = o.onloadedmetadata;
        var v2011 : function(:Event):void/*Function?*/ = o.onloadeddata;
        var v2012 : function(:Event):void/*Function?*/ = o.oncanplay;
        var v2013 : function(:Event):void/*Function?*/ = o.oncanplaythrough;
        var v2014 : function(:Event):void/*Function?*/ = o.onplaying;
        var v2015 : function(:Event):void/*Function?*/ = o.onended;
        var v2016 : function(:Event):void/*Function?*/ = o.onwaiting;
        var v2017 : function(:Event):void/*Function?*/ = o.ondurationchange;
        var v2018 : function(:Event):void/*Function?*/ = o.ontimeupdate;
        var v2019 : function(:Event):void/*Function?*/ = o.onplay;
        var v2020 : function(:Event):void/*Function?*/ = o.onpause;
        var v2021 : function(:Event):void/*Function?*/ = o.onratechange;
        var v2022 : function(:Event):void/*Function?*/ = o.onvolumechange;
    } // MediaController


    function compile_TextTrackList(o : TextTrackList) : void {
        var v2023 : int/*unsigned long*/ = o.length;
        var f2024 : MayBeUndefined.<TextTrack> = o.__native_index_operator__(X.getint());
        var v2025 : function(:Event):void/*Function?*/ = o.onaddtrack;
    } // TextTrackList


    function compile_TextTrack(o : TextTrack) : void {
        var v2026 : string/*DOMString*/ = o.kind;
        var v2027 : string/*DOMString*/ = o.label;
        var v2028 : string/*DOMString*/ = o.language;
        var v2029 : int/*unsigned short*/ = TextTrack.DISABLED;
        var v2030 : int/*unsigned short*/ = o.DISABLED;
        var v2031 : int/*unsigned short*/ = TextTrack.HIDDEN;
        var v2032 : int/*unsigned short*/ = o.HIDDEN;
        var v2033 : int/*unsigned short*/ = TextTrack.SHOWING;
        var v2034 : int/*unsigned short*/ = o.SHOWING;
        var v2035 : int/*unsigned short*/ = o.mode;
        var v2036 : TextTrackCueList = o.cues;
        var v2037 : TextTrackCueList = o.activeCues;
        o.addCue(X.getTextTrackCue());
        o.removeCue(X.getTextTrackCue());
        var v2038 : function(:Event):void/*Function?*/ = o.oncuechange;
    } // TextTrack


    function compile_TextTrackCueList(o : TextTrackCueList) : void {
        var v2039 : int/*unsigned long*/ = o.length;
        var f2040 : MayBeUndefined.<TextTrackCue> = o.__native_index_operator__(X.getint());
        var f2041 : TextTrackCue = o.getCueById(X.getstring());
    } // TextTrackCueList


    function compile_TextTrackCue(o : TextTrackCue) : void {
        var v2042 : TextTrack = o.track;
        var v2043 : string/*DOMString*/ = o.id;
        var v2044 : number/*double*/ = o.startTime;
        var v2045 : number/*double*/ = o.endTime;
        var v2046 : boolean = o.pauseOnExit;
        var v2047 : string/*DOMString*/ = o.vertical;
        var v2048 : boolean = o.snapToLines;
        var v2049 : int/*long*/ = o.line;
        var v2050 : int/*long*/ = o.position;
        var v2051 : int/*long*/ = o.size;
        var v2052 : string/*DOMString*/ = o.align;
        var v2053 : string/*DOMString*/ = o.text;
        var f2054 : DocumentFragment = o.getCueAsHTML();
        var v2055 : function(:Event):void/*Function?*/ = o.onenter;
        var v2056 : function(:Event):void/*Function?*/ = o.onexit;
    } // TextTrackCue


    function compile_TimeRanges(o : TimeRanges) : void {
        var v2057 : int/*unsigned long*/ = o.length;
        var f2058 : number/*double*/ = o.start(X.getint());
        var f2059 : number/*double*/ = o.end(X.getint());
    } // TimeRanges


    function compile_TrackEvent(o : TrackEvent) : void {
        var v2060 : Object/*object?*/ = o.track;
    } // TrackEvent


    function compile_TrackEventInit(o : TrackEventInit) : void {
        var v2061 : Object/*object?*/ = o.track;
    } // TrackEventInit


    function compile_HTMLCanvasElement(o : HTMLCanvasElement) : void {
        var v2062 : int/*unsigned long*/ = o.width;
        var v2063 : int/*unsigned long*/ = o.height;
        var f2064 : string/*DOMString*/ = o.toDataURL();
        var f2065 : string/*DOMString*/ = o.toDataURL(X.getstring());
        var f2066 : string/*DOMString*/ = o.toDataURL(X.getstring(), X.getvariant());
        o.toBlob(X.getfunction__File__void());
        o.toBlob(X.getfunction__File__void(), X.getstring());
        o.toBlob(X.getfunction__File__void(), X.getstring(), X.getvariant());
        var f2067 : Object/*object?*/ = o.getContext(X.getstring());
        var f2068 : Object/*object?*/ = o.getContext(X.getstring(), X.getvariant());
    } // HTMLCanvasElement


    function compile_HTMLMapElement(o : HTMLMapElement) : void {
        var v2069 : string/*DOMString*/ = o.name;
        var v2070 : HTMLCollection = o.areas;
        var v2071 : HTMLCollection = o.images;
    } // HTMLMapElement


    function compile_HTMLAreaElement(o : HTMLAreaElement) : void {
        var v2072 : string/*DOMString*/ = o.alt;
        var v2073 : string/*DOMString*/ = o.coords;
        var v2074 : string/*DOMString*/ = o.shape;
        var v2075 : string/*DOMString*/ = o.href;
        var v2076 : string/*DOMString*/ = o.target;
        var v2077 : string/*DOMString*/ = o.rel;
        var v2078 : DOMTokenList = o.relList;
        var v2079 : string/*DOMString*/ = o.media;
        var v2080 : string/*DOMString*/ = o.hreflang;
        var v2081 : string/*DOMString*/ = o.type;
        var v2082 : string/*DOMString*/ = o.protocol;
        var v2083 : string/*DOMString*/ = o.host;
        var v2084 : string/*DOMString*/ = o.hostname;
        var v2085 : string/*DOMString*/ = o.port;
        var v2086 : string/*DOMString*/ = o.pathname;
        var v2087 : string/*DOMString*/ = o.search;
        var v2088 : string/*DOMString*/ = o.hash;
        var v2089 : boolean = o.noHref;
    } // HTMLAreaElement


    function compile_HTMLTableElement(o : HTMLTableElement) : void {
        var v2090 : HTMLTableCaptionElement = o.caption;
        var f2091 : HTMLElement = o.createCaption();
        o.deleteCaption();
        var v2092 : HTMLTableSectionElement = o.tHead;
        var f2093 : HTMLElement = o.createTHead();
        o.deleteTHead();
        var v2094 : HTMLTableSectionElement = o.tFoot;
        var f2095 : HTMLElement = o.createTFoot();
        o.deleteTFoot();
        var v2096 : HTMLCollection = o.tBodies;
        var f2097 : HTMLElement = o.createTBody();
        var v2098 : HTMLCollection = o.rows;
        var f2099 : HTMLElement = o.insertRow();
        var f2100 : HTMLElement = o.insertRow(X.getint());
        o.deleteRow(X.getint());
        var v2101 : string/*DOMString*/ = o.border;
        var v2102 : string/*DOMString*/ = o.align;
        var v2103 : string/*DOMString*/ = o.frame;
        var v2104 : string/*DOMString*/ = o.rules;
        var v2105 : string/*DOMString*/ = o.summary;
        var v2106 : string/*DOMString*/ = o.width;
        var v2107 : string/*DOMString*/ = o.bgColor;
        var v2108 : string/*DOMString*/ = o.cellPadding;
        var v2109 : string/*DOMString*/ = o.cellSpacing;
    } // HTMLTableElement


    function compile_HTMLTableCaptionElement(o : HTMLTableCaptionElement) : void {
        var v2110 : string/*DOMString*/ = o.align;
    } // HTMLTableCaptionElement


    function compile_HTMLTableColElement(o : HTMLTableColElement) : void {
        var v2111 : int/*unsigned long*/ = o.span;
        var v2112 : string/*DOMString*/ = o.align;
        var v2113 : string/*DOMString*/ = o.ch;
        var v2114 : string/*DOMString*/ = o.chOff;
        var v2115 : string/*DOMString*/ = o.vAlign;
        var v2116 : string/*DOMString*/ = o.width;
    } // HTMLTableColElement


    function compile_HTMLTableSectionElement(o : HTMLTableSectionElement) : void {
        var v2117 : HTMLCollection = o.rows;
        var f2118 : HTMLElement = o.insertRow();
        var f2119 : HTMLElement = o.insertRow(X.getint());
        o.deleteRow(X.getint());
        var v2120 : string/*DOMString*/ = o.align;
        var v2121 : string/*DOMString*/ = o.ch;
        var v2122 : string/*DOMString*/ = o.chOff;
        var v2123 : string/*DOMString*/ = o.vAlign;
    } // HTMLTableSectionElement


    function compile_HTMLTableRowElement(o : HTMLTableRowElement) : void {
        var v2124 : int/*long*/ = o.rowIndex;
        var v2125 : int/*long*/ = o.sectionRowIndex;
        var v2126 : HTMLCollection = o.cells;
        var f2127 : HTMLElement = o.insertCell();
        var f2128 : HTMLElement = o.insertCell(X.getint());
        o.deleteCell(X.getint());
        var v2129 : string/*DOMString*/ = o.align;
        var v2130 : string/*DOMString*/ = o.ch;
        var v2131 : string/*DOMString*/ = o.chOff;
        var v2132 : string/*DOMString*/ = o.vAlign;
        var v2133 : string/*DOMString*/ = o.bgColor;
    } // HTMLTableRowElement


    function compile_HTMLTableDataCellElement(o : HTMLTableDataCellElement) : void {
    } // HTMLTableDataCellElement


    function compile_HTMLTableHeaderCellElement(o : HTMLTableHeaderCellElement) : void {
        var v2134 : string/*DOMString*/ = o.scope;
    } // HTMLTableHeaderCellElement


    function compile_HTMLTableCellElement(o : HTMLTableCellElement) : void {
        var v2135 : int/*unsigned long*/ = o.colSpan;
        var v2136 : int/*unsigned long*/ = o.rowSpan;
        var v2137 : DOMSettableTokenList = o.headers;
        var v2138 : int/*long*/ = o.cellIndex;
        var v2139 : string/*DOMString*/ = o.abbr;
        var v2140 : string/*DOMString*/ = o.align;
        var v2141 : string/*DOMString*/ = o.axis;
        var v2142 : string/*DOMString*/ = o.height;
        var v2143 : string/*DOMString*/ = o.width;
        var v2144 : string/*DOMString*/ = o.ch;
        var v2145 : string/*DOMString*/ = o.chOff;
        var v2146 : boolean = o.noWrap;
        var v2147 : string/*DOMString*/ = o.vAlign;
        var v2148 : string/*DOMString*/ = o.bgColor;
    } // HTMLTableCellElement


    function compile_HTMLFormElement(o : HTMLFormElement) : void {
        var v2149 : string/*DOMString*/ = o.acceptCharset;
        var v2150 : string/*DOMString*/ = o.action;
        var v2151 : string/*DOMString*/ = o.autocomplete;
        var v2152 : string/*DOMString*/ = o.enctype;
        var v2153 : string/*DOMString*/ = o.encoding;
        var v2154 : string/*DOMString*/ = o.method;
        var v2155 : string/*DOMString*/ = o.name;
        var v2156 : boolean = o.noValidate;
        var v2157 : string/*DOMString*/ = o.target;
        var v2158 : HTMLFormControlsCollection = o.elements;
        var v2159 : int/*long*/ = o.length;
        var f2160 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f2161 : MayBeUndefined.<Object/*object*/> = o.__native_index_operator__(X.getstring());
        o.submit();
        o.reset();
        var f2162 : boolean = o.checkValidity();
    } // HTMLFormElement


    function compile_HTMLFieldSetElement(o : HTMLFieldSetElement) : void {
        var v2163 : boolean = o.disabled;
        var v2164 : HTMLFormElement = o.form;
        var v2165 : string/*DOMString*/ = o.name;
        var v2166 : string/*DOMString*/ = o.type;
        var v2167 : HTMLFormControlsCollection = o.elements;
        var v2168 : boolean = o.willValidate;
        var v2169 : ValidityState = o.validity;
        var v2170 : string/*DOMString*/ = o.validationMessage;
        var f2171 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
    } // HTMLFieldSetElement


    function compile_HTMLLegendElement(o : HTMLLegendElement) : void {
        var v2172 : HTMLFormElement = o.form;
        var v2173 : string/*DOMString*/ = o.align;
    } // HTMLLegendElement


    function compile_HTMLLabelElement(o : HTMLLabelElement) : void {
        var v2174 : HTMLFormElement = o.form;
        var v2175 : string/*DOMString*/ = o.htmlFor;
        var v2176 : HTMLElement = o.control;
    } // HTMLLabelElement


    function compile_HTMLInputElement(o : HTMLInputElement) : void {
        var v2177 : string/*DOMString*/ = o.accept;
        var v2178 : string/*DOMString*/ = o.alt;
        var v2179 : string/*DOMString*/ = o.autocomplete;
        var v2180 : boolean = o.autofocus;
        var v2181 : boolean = o.defaultChecked;
        var v2182 : boolean = o.checked;
        var v2183 : string/*DOMString*/ = o.dirName;
        var v2184 : boolean = o.disabled;
        var v2185 : HTMLFormElement = o.form;
        var v2186 : FileList = o.files;
        var v2187 : string/*DOMString*/ = o.formAction;
        var v2188 : string/*DOMString*/ = o.formEnctype;
        var v2189 : string/*DOMString*/ = o.formMethod;
        var v2190 : boolean = o.formNoValidate;
        var v2191 : string/*DOMString*/ = o.formTarget;
        var v2192 : int/*unsigned long*/ = o.height;
        var v2193 : boolean = o.indeterminate;
        var v2194 : HTMLElement = o.list;
        var v2195 : string/*DOMString*/ = o.max;
        var v2196 : int/*long*/ = o.maxLength;
        var v2197 : string/*DOMString*/ = o.min;
        var v2198 : boolean = o.multiple;
        var v2199 : string/*DOMString*/ = o.name;
        var v2200 : string/*DOMString*/ = o.pattern;
        var v2201 : string/*DOMString*/ = o.placeholder;
        var v2202 : boolean = o.readOnly;
        var v2203 : boolean = o.required;
        var v2204 : int/*unsigned long*/ = o.size;
        var v2205 : string/*DOMString*/ = o.src;
        var v2206 : string/*DOMString*/ = o.step;
        var v2207 : string/*DOMString*/ = o.type;
        var v2208 : string/*DOMString*/ = o.defaultValue;
        var v2209 : string/*DOMString*/ = o.value;
        var v2210 : Date = o.valueAsDate;
        var v2211 : number/*double*/ = o.valueAsNumber;
        var v2212 : int/*unsigned long*/ = o.width;
        o.stepUp();
        o.stepUp(X.getint());
        o.stepDown();
        o.stepDown(X.getint());
        var v2213 : boolean = o.willValidate;
        var v2214 : ValidityState = o.validity;
        var v2215 : string/*DOMString*/ = o.validationMessage;
        var f2216 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2217 : NodeList = o.labels;
        o.select();
        var v2218 : int/*unsigned long*/ = o.selectionStart;
        var v2219 : int/*unsigned long*/ = o.selectionEnd;
        var v2220 : string/*DOMString*/ = o.selectionDirection;
        o.setSelectionRange(X.getint(), X.getint());
        o.setSelectionRange(X.getint(), X.getint(), X.getstring());
        var v2221 : string/*DOMString*/ = o.align;
        var v2222 : string/*DOMString*/ = o.useMap;
    } // HTMLInputElement


    function compile_HTMLButtonElement(o : HTMLButtonElement) : void {
        var v2223 : boolean = o.autofocus;
        var v2224 : boolean = o.disabled;
        var v2225 : HTMLFormElement = o.form;
        var v2226 : string/*DOMString*/ = o.formAction;
        var v2227 : string/*DOMString*/ = o.formEnctype;
        var v2228 : string/*DOMString*/ = o.formMethod;
        var v2229 : boolean = o.formNoValidate;
        var v2230 : string/*DOMString*/ = o.formTarget;
        var v2231 : string/*DOMString*/ = o.name;
        var v2232 : string/*DOMString*/ = o.type;
        var v2233 : string/*DOMString*/ = o.value;
        var v2234 : boolean = o.willValidate;
        var v2235 : ValidityState = o.validity;
        var v2236 : string/*DOMString*/ = o.validationMessage;
        var f2237 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2238 : NodeList = o.labels;
    } // HTMLButtonElement


    function compile_HTMLSelectElement(o : HTMLSelectElement) : void {
        var v2239 : boolean = o.autofocus;
        var v2240 : boolean = o.disabled;
        var v2241 : HTMLFormElement = o.form;
        var v2242 : boolean = o.multiple;
        var v2243 : string/*DOMString*/ = o.name;
        var v2244 : boolean = o.required;
        var v2245 : int/*unsigned long*/ = o.size;
        var v2246 : string/*DOMString*/ = o.type;
        var v2247 : HTMLOptionsCollection = o.options;
        var v2248 : int/*unsigned long*/ = o.length;
        var f2249 : MayBeUndefined.<Element> = o.__native_index_operator__(X.getint());
        var f2250 : MayBeUndefined.<Element> = o.item(X.getint());
        var f2251 : Object/*object*/ = o.namedItem(X.getstring());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getHTMLElement());
        o.add(X.getHTMLOptionElement());
        o.add(X.getHTMLOptionElement(), X.getint());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getHTMLElement());
        o.add(X.getHTMLOptGroupElement());
        o.add(X.getHTMLOptGroupElement(), X.getint());
        o.remove(X.getint());
        var v2252 : HTMLCollection = o.selectedOptions;
        var v2253 : int/*long*/ = o.selectedIndex;
        var v2254 : string/*DOMString*/ = o.value;
        var v2255 : boolean = o.willValidate;
        var v2256 : ValidityState = o.validity;
        var v2257 : string/*DOMString*/ = o.validationMessage;
        var f2258 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2259 : NodeList = o.labels;
    } // HTMLSelectElement


    function compile_HTMLDataListElement(o : HTMLDataListElement) : void {
        var v2260 : HTMLCollection = o.options;
    } // HTMLDataListElement


    function compile_HTMLOptGroupElement(o : HTMLOptGroupElement) : void {
        var v2261 : boolean = o.disabled;
        var v2262 : string/*DOMString*/ = o.label;
    } // HTMLOptGroupElement


    function compile_HTMLOptionElement(o : HTMLOptionElement) : void {
        var v2263 : boolean = o.disabled;
        var v2264 : HTMLFormElement = o.form;
        var v2265 : string/*DOMString*/ = o.label;
        var v2266 : boolean = o.defaultSelected;
        var v2267 : boolean = o.selected;
        var v2268 : string/*DOMString*/ = o.value;
        var v2269 : string/*DOMString*/ = o.text;
        var v2270 : int/*long*/ = o.index;
    } // HTMLOptionElement


    function compile_HTMLTextAreaElement(o : HTMLTextAreaElement) : void {
        var v2271 : boolean = o.autofocus;
        var v2272 : int/*unsigned long*/ = o.cols;
        var v2273 : string/*DOMString*/ = o.dirName;
        var v2274 : boolean = o.disabled;
        var v2275 : HTMLFormElement = o.form;
        var v2276 : int/*long*/ = o.maxLength;
        var v2277 : string/*DOMString*/ = o.name;
        var v2278 : string/*DOMString*/ = o.placeholder;
        var v2279 : boolean = o.readOnly;
        var v2280 : boolean = o.required;
        var v2281 : int/*unsigned long*/ = o.rows;
        var v2282 : string/*DOMString*/ = o.wrap;
        var v2283 : string/*DOMString*/ = o.type;
        var v2284 : string/*DOMString*/ = o.defaultValue;
        var v2285 : string/*DOMString*/ = o.value;
        var v2286 : int/*unsigned long*/ = o.textLength;
        var v2287 : boolean = o.willValidate;
        var v2288 : ValidityState = o.validity;
        var v2289 : string/*DOMString*/ = o.validationMessage;
        var f2290 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2291 : NodeList = o.labels;
        o.select();
        var v2292 : int/*unsigned long*/ = o.selectionStart;
        var v2293 : int/*unsigned long*/ = o.selectionEnd;
        var v2294 : string/*DOMString*/ = o.selectionDirection;
        o.setSelectionRange(X.getint(), X.getint());
        o.setSelectionRange(X.getint(), X.getint(), X.getstring());
    } // HTMLTextAreaElement


    function compile_HTMLKeygenElement(o : HTMLKeygenElement) : void {
        var v2295 : boolean = o.autofocus;
        var v2296 : string/*DOMString*/ = o.challenge;
        var v2297 : boolean = o.disabled;
        var v2298 : HTMLFormElement = o.form;
        var v2299 : string/*DOMString*/ = o.keytype;
        var v2300 : string/*DOMString*/ = o.name;
        var v2301 : string/*DOMString*/ = o.type;
        var v2302 : boolean = o.willValidate;
        var v2303 : ValidityState = o.validity;
        var v2304 : string/*DOMString*/ = o.validationMessage;
        var f2305 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2306 : NodeList = o.labels;
    } // HTMLKeygenElement


    function compile_HTMLOutputElement(o : HTMLOutputElement) : void {
        var v2307 : DOMSettableTokenList = o.htmlFor;
        var v2308 : HTMLFormElement = o.form;
        var v2309 : string/*DOMString*/ = o.name;
        var v2310 : string/*DOMString*/ = o.type;
        var v2311 : string/*DOMString*/ = o.defaultValue;
        var v2312 : string/*DOMString*/ = o.value;
        var v2313 : boolean = o.willValidate;
        var v2314 : ValidityState = o.validity;
        var v2315 : string/*DOMString*/ = o.validationMessage;
        var f2316 : boolean = o.checkValidity();
        o.setCustomValidity(X.getstring());
        var v2317 : NodeList = o.labels;
    } // HTMLOutputElement


    function compile_HTMLProgressElement(o : HTMLProgressElement) : void {
        var v2318 : number/*double*/ = o.value;
        var v2319 : number/*double*/ = o.max;
        var v2320 : number/*double*/ = o.position;
        var v2321 : NodeList = o.labels;
    } // HTMLProgressElement


    function compile_HTMLMeterElement(o : HTMLMeterElement) : void {
        var v2322 : number/*double*/ = o.value;
        var v2323 : number/*double*/ = o.min;
        var v2324 : number/*double*/ = o.max;
        var v2325 : number/*double*/ = o.low;
        var v2326 : number/*double*/ = o.high;
        var v2327 : number/*double*/ = o.optimum;
        var v2328 : NodeList = o.labels;
    } // HTMLMeterElement


    function compile_ValidityState(o : ValidityState) : void {
        var v2329 : boolean = o.valueMissing;
        var v2330 : boolean = o.typeMismatch;
        var v2331 : boolean = o.patternMismatch;
        var v2332 : boolean = o.tooLong;
        var v2333 : boolean = o.rangeUnderflow;
        var v2334 : boolean = o.rangeOverflow;
        var v2335 : boolean = o.stepMismatch;
        var v2336 : boolean = o.customError;
        var v2337 : boolean = o.valid;
    } // ValidityState


    function compile_HTMLDetailsElement(o : HTMLDetailsElement) : void {
        var v2338 : boolean = o.open;
    } // HTMLDetailsElement


    function compile_HTMLCommandElement(o : HTMLCommandElement) : void {
        var v2339 : string/*DOMString*/ = o.type;
        var v2340 : string/*DOMString*/ = o.label;
        var v2341 : string/*DOMString*/ = o.icon;
        var v2342 : boolean = o.disabled;
        var v2343 : boolean = o.checked;
        var v2344 : string/*DOMString*/ = o.radiogroup;
        var v2345 : HTMLElement = o.command;
    } // HTMLCommandElement


    function compile_HTMLMenuElement(o : HTMLMenuElement) : void {
        var v2346 : string/*DOMString*/ = o.type;
        var v2347 : string/*DOMString*/ = o.label;
        var v2348 : boolean = o.compact;
    } // HTMLMenuElement


    function compile_BarProp(o : BarProp) : void {
        var v2349 : boolean = o.visible;
    } // BarProp


    function compile_History(o : History) : void {
        var v2350 : int/*long*/ = o.length;
        var v2351 : variant/*any*/ = o.state;
        o.go();
        o.go(X.getint());
        o.back();
        o.forward();
        o.pushState(X.getvariant(), X.getstring());
        o.pushState(X.getvariant(), X.getstring(), X.getstring());
        o.replaceState(X.getvariant(), X.getstring());
        o.replaceState(X.getvariant(), X.getstring(), X.getstring());
    } // History


    function compile_Location(o : Location) : void {
        var v2352 : string/*DOMString*/ = o.href;
        o.assign(X.getstring());
        o.replace(X.getstring());
        o.reload();
        var v2353 : string/*DOMString*/ = o.protocol;
        var v2354 : string/*DOMString*/ = o.host;
        var v2355 : string/*DOMString*/ = o.hostname;
        var v2356 : string/*DOMString*/ = o.port;
        var v2357 : string/*DOMString*/ = o.pathname;
        var v2358 : string/*DOMString*/ = o.search;
        var v2359 : string/*DOMString*/ = o.hash;
    } // Location


    function compile_PopStateEvent(o : PopStateEvent) : void {
        var v2360 : variant/*any*/ = o.state;
    } // PopStateEvent


    function compile_PopStateEventInit(o : PopStateEventInit) : void {
        var v2361 : variant/*any*/ = o.state;
    } // PopStateEventInit


    function compile_HashChangeEvent(o : HashChangeEvent) : void {
        var v2362 : string/*DOMString*/ = o.oldURL;
        var v2363 : string/*DOMString*/ = o.newURL;
    } // HashChangeEvent


    function compile_HashChangeEventInit(o : HashChangeEventInit) : void {
        var v2364 : string/*DOMString*/ = o.oldURL;
        var v2365 : string/*DOMString*/ = o.newURL;
    } // HashChangeEventInit


    function compile_PageTransitionEvent(o : PageTransitionEvent) : void {
        var v2366 : boolean = o.persisted;
    } // PageTransitionEvent


    function compile_PageTransitionEventInit(o : PageTransitionEventInit) : void {
        var v2367 : boolean = o.persisted;
    } // PageTransitionEventInit


    function compile_BeforeUnloadEvent(o : BeforeUnloadEvent) : void {
        var v2368 : string/*DOMString*/ = o.returnValue;
    } // BeforeUnloadEvent


    function compile_ApplicationCache(o : ApplicationCache) : void {
        var v2369 : int/*unsigned short*/ = ApplicationCache.UNCACHED;
        var v2370 : int/*unsigned short*/ = o.UNCACHED;
        var v2371 : int/*unsigned short*/ = ApplicationCache.IDLE;
        var v2372 : int/*unsigned short*/ = o.IDLE;
        var v2373 : int/*unsigned short*/ = ApplicationCache.CHECKING;
        var v2374 : int/*unsigned short*/ = o.CHECKING;
        var v2375 : int/*unsigned short*/ = ApplicationCache.DOWNLOADING;
        var v2376 : int/*unsigned short*/ = o.DOWNLOADING;
        var v2377 : int/*unsigned short*/ = ApplicationCache.UPDATEREADY;
        var v2378 : int/*unsigned short*/ = o.UPDATEREADY;
        var v2379 : int/*unsigned short*/ = ApplicationCache.OBSOLETE;
        var v2380 : int/*unsigned short*/ = o.OBSOLETE;
        var v2381 : int/*unsigned short*/ = o.status;
        o.update();
        o.abort();
        o.swapCache();
        var v2382 : function(:Event):void/*Function?*/ = o.onchecking;
        var v2383 : function(:Event):void/*Function?*/ = o.onerror;
        var v2384 : function(:Event):void/*Function?*/ = o.onnoupdate;
        var v2385 : function(:Event):void/*Function?*/ = o.ondownloading;
        var v2386 : function(:Event):void/*Function?*/ = o.onprogress;
        var v2387 : function(:Event):void/*Function?*/ = o.onupdateready;
        var v2388 : function(:Event):void/*Function?*/ = o.oncached;
        var v2389 : function(:Event):void/*Function?*/ = o.onobsolete;
    } // ApplicationCache


    function compile_NavigatorOnLine(o : NavigatorOnLine) : void {
        var v2390 : boolean = o.onLine;
    } // NavigatorOnLine


    function compile_WindowBase64(o : WindowBase64) : void {
        var f2391 : string/*DOMString*/ = o.btoa(X.getstring());
        var f2392 : string/*DOMString*/ = o.atob(X.getstring());
    } // WindowBase64


    function compile_WindowModal(o : WindowModal) : void {
        var v2393 : variant/*any*/ = o.dialogArguments;
        var v2394 : string/*DOMString*/ = o.returnValue;
    } // WindowModal


    function compile_Navigator(o : Navigator) : void {
        var v2395 : string/*DOMString*/ = o.appName;
        var v2396 : string/*DOMString*/ = o.appVersion;
        var v2397 : string/*DOMString*/ = o.platform;
        var v2398 : string/*DOMString*/ = o.userAgent;
        var v2399 : boolean = o.onLine;
        o.registerProtocolHandler(X.getstring(), X.getstring(), X.getstring());
        o.registerContentHandler(X.getstring(), X.getstring(), X.getstring());
        var f2400 : string/*DOMString*/ = o.isProtocolHandlerRegistered(X.getstring(), X.getstring());
        var f2401 : string/*DOMString*/ = o.isContentHandlerRegistered(X.getstring(), X.getstring());
        o.unregisterProtocolHandler(X.getstring(), X.getstring());
        o.unregisterContentHandler(X.getstring(), X.getstring());
        o.yieldForStorageUpdates();
        var v2402 : Geolocation = o.geolocation;
    } // Navigator


    function compile_NavigatorID(o : NavigatorID) : void {
        var v2403 : string/*DOMString*/ = o.appName;
        var v2404 : string/*DOMString*/ = o.appVersion;
        var v2405 : string/*DOMString*/ = o.platform;
        var v2406 : string/*DOMString*/ = o.userAgent;
    } // NavigatorID


    function compile_NavigatorContentUtils(o : NavigatorContentUtils) : void {
        o.registerProtocolHandler(X.getstring(), X.getstring(), X.getstring());
        o.registerContentHandler(X.getstring(), X.getstring(), X.getstring());
        var f2407 : string/*DOMString*/ = o.isProtocolHandlerRegistered(X.getstring(), X.getstring());
        var f2408 : string/*DOMString*/ = o.isContentHandlerRegistered(X.getstring(), X.getstring());
        o.unregisterProtocolHandler(X.getstring(), X.getstring());
        o.unregisterContentHandler(X.getstring(), X.getstring());
    } // NavigatorContentUtils


    function compile_NavigatorStorageUtils(o : NavigatorStorageUtils) : void {
        o.yieldForStorageUpdates();
    } // NavigatorStorageUtils


    function compile_External(o : External) : void {
        o.AddSearchProvider(X.getstring());
        var f2409 : int/*unsigned long*/ = o.IsSearchProviderInstalled(X.getstring());
    } // External


    function compile_DataTransfer(o : DataTransfer) : void {
        var v2410 : string/*DOMString*/ = o.dropEffect;
        var v2411 : string/*DOMString*/ = o.effectAllowed;
        var v2412 : DataTransferItemList = o.items;
        o.setDragImage(X.getElement(), X.getint(), X.getint());
        o.addElement(X.getElement());
        var v2413 : DOMStringList = o.types;
        var f2414 : string/*DOMString*/ = o.getData(X.getstring());
        o.setData(X.getstring(), X.getstring());
        o.clearData();
        o.clearData(X.getstring());
        var v2415 : FileList = o.files;
    } // DataTransfer


    function compile_DataTransferItemList(o : DataTransferItemList) : void {
        var v2416 : int/*unsigned long*/ = o.length;
        var f2417 : MayBeUndefined.<DataTransferItem> = o.__native_index_operator__(X.getint());
        o.clear();
        var f2418 : DataTransferItem = o.add(X.getstring(), X.getstring());
        var f2419 : DataTransferItem = o.add(X.getFile());
    } // DataTransferItemList


    function compile_DataTransferItem(o : DataTransferItem) : void {
        var v2420 : string/*DOMString*/ = o.kind;
        var v2421 : string/*DOMString*/ = o.type;
        o.getAsString(X.getFunctionStringCallback());
        var f2422 : File = o.getAsFile();
    } // DataTransferItem


    function compile_FunctionStringCallback(o : FunctionStringCallback) : void {
        o.handleEvent(X.getstring());
    } // FunctionStringCallback


    function compile_DragEvent(o : DragEvent) : void {
        var v2423 : DataTransfer = o.dataTransfer;
    } // DragEvent


    function compile_DragEventInit(o : DragEventInit) : void {
        var v2424 : DataTransfer = o.dataTransfer;
    } // DragEventInit


    function compile_HTMLAppletElement(o : HTMLAppletElement) : void {
        var v2425 : string/*DOMString*/ = o.align;
        var v2426 : string/*DOMString*/ = o.alt;
        var v2427 : string/*DOMString*/ = o.archive;
        var v2428 : string/*DOMString*/ = o.code;
        var v2429 : string/*DOMString*/ = o.codeBase;
        var v2430 : string/*DOMString*/ = o.height;
        var v2431 : int/*unsigned long*/ = o.hspace;
        var v2432 : string/*DOMString*/ = o.name;
        var v2433 : string/*DOMString*/ = o._object;
        var v2434 : int/*unsigned long*/ = o.vspace;
        var v2435 : string/*DOMString*/ = o.width;
    } // HTMLAppletElement


    function compile_HTMLMarqueeElement(o : HTMLMarqueeElement) : void {
        var v2436 : string/*DOMString*/ = o.behavior;
        var v2437 : string/*DOMString*/ = o.bgColor;
        var v2438 : string/*DOMString*/ = o.direction;
        var v2439 : string/*DOMString*/ = o.height;
        var v2440 : int/*unsigned long*/ = o.hspace;
        var v2441 : int/*long*/ = o.loop;
        var v2442 : int/*unsigned long*/ = o.scrollAmount;
        var v2443 : int/*unsigned long*/ = o.scrollDelay;
        var v2444 : boolean = o.trueSpeed;
        var v2445 : int/*unsigned long*/ = o.vspace;
        var v2446 : string/*DOMString*/ = o.width;
        var v2447 : function(:Event):void/*Function?*/ = o.onbounce;
        var v2448 : function(:Event):void/*Function?*/ = o.onfinish;
        var v2449 : function(:Event):void/*Function?*/ = o.onstart;
        o.start();
        o.stop();
    } // HTMLMarqueeElement


    function compile_HTMLFrameSetElement(o : HTMLFrameSetElement) : void {
        var v2450 : string/*DOMString*/ = o.cols;
        var v2451 : string/*DOMString*/ = o.rows;
        var v2452 : function(:Event):void/*Function?*/ = o.onafterprint;
        var v2453 : function(:Event):void/*Function?*/ = o.onbeforeprint;
        var v2454 : function(:Event):void/*Function?*/ = o.onbeforeunload;
        var v2455 : function(:Event):void/*Function?*/ = o.onblur;
        var v2456 : function(:Event):void/*Function?*/ = o.onerror;
        var v2457 : function(:Event):void/*Function?*/ = o.onfocus;
        var v2458 : function(:Event):void/*Function?*/ = o.onhashchange;
        var v2459 : function(:Event):void/*Function?*/ = o.onload;
        var v2460 : function(:Event):void/*Function?*/ = o.onmessage;
        var v2461 : function(:Event):void/*Function?*/ = o.onoffline;
        var v2462 : function(:Event):void/*Function?*/ = o.ononline;
        var v2463 : function(:Event):void/*Function?*/ = o.onpagehide;
        var v2464 : function(:Event):void/*Function?*/ = o.onpageshow;
        var v2465 : function(:Event):void/*Function?*/ = o.onpopstate;
        var v2466 : function(:Event):void/*Function?*/ = o.onresize;
        var v2467 : function(:Event):void/*Function?*/ = o.onscroll;
        var v2468 : function(:Event):void/*Function?*/ = o.onstorage;
        var v2469 : function(:Event):void/*Function?*/ = o.onunload;
    } // HTMLFrameSetElement


    function compile_HTMLFrameElement(o : HTMLFrameElement) : void {
        var v2470 : string/*DOMString*/ = o.name;
        var v2471 : string/*DOMString*/ = o.scrolling;
        var v2472 : string/*DOMString*/ = o.src;
        var v2473 : string/*DOMString*/ = o.frameBorder;
        var v2474 : string/*DOMString*/ = o.longDesc;
        var v2475 : boolean = o.noResize;
        var v2476 : HTMLDocument/*Document?*/ = o.contentDocument;
        var v2477 : Window/*WindowProxy?*/ = o.contentWindow;
        var v2478 : string/*DOMString*/ = o.marginHeight;
        var v2479 : string/*DOMString*/ = o.marginWidth;
    } // HTMLFrameElement


    function compile_HTMLBaseFontElement(o : HTMLBaseFontElement) : void {
        var v2480 : string/*DOMString*/ = o.color;
        var v2481 : string/*DOMString*/ = o.face;
        var v2482 : int/*long*/ = o.size;
    } // HTMLBaseFontElement


    function compile_HTMLDirectoryElement(o : HTMLDirectoryElement) : void {
        var v2483 : boolean = o.compact;
    } // HTMLDirectoryElement


    function compile_HTMLFontElement(o : HTMLFontElement) : void {
        var v2484 : string/*DOMString*/ = o.color;
        var v2485 : string/*DOMString*/ = o.face;
        var v2486 : string/*DOMString*/ = o.size;
    } // HTMLFontElement


    function compile_FileList(o : FileList) : void {
        var f2487 : MayBeUndefined.<File> = o.__native_index_operator__(X.getint());
        var f2488 : MayBeUndefined.<File> = o.item(X.getint());
        var v2489 : int/*unsigned long*/ = o.length;
    } // FileList


    function compile_Blob(o : Blob) : void {
        var v2490 : number/*unsigned long long*/ = o.size;
        var v2491 : string/*DOMString*/ = o.type;
        var f2492 : Blob = o.slice();
        var f2493 : Blob = o.slice(X.getnumber());
        var f2494 : Blob = o.slice(X.getnumber(), X.getnumber());
        var f2495 : Blob = o.slice(X.getnumber(), X.getnumber(), X.getstring());
    } // Blob


    function compile_File(o : File) : void {
        var v2496 : string/*DOMString*/ = o.name;
        var v2497 : Date = o.lastModifiedDate;
    } // File


    function compile_FileReader(o : FileReader) : void {
        o.readAsArrayBuffer(X.getBlob());
        o.readAsBinaryString(X.getBlob());
        o.readAsText(X.getBlob());
        o.readAsText(X.getBlob(), X.getstring());
        o.readAsDataURL(X.getBlob());
        o.abort();
        var v2498 : int/*unsigned short*/ = FileReader.EMPTY;
        var v2499 : int/*unsigned short*/ = o.EMPTY;
        var v2500 : int/*unsigned short*/ = FileReader.LOADING;
        var v2501 : int/*unsigned short*/ = o.LOADING;
        var v2502 : int/*unsigned short*/ = FileReader.DONE;
        var v2503 : int/*unsigned short*/ = o.DONE;
        var v2504 : int/*unsigned short*/ = o.readyState;
        var v2505 : variant/*any*/ = o.result;
        var v2506 : DOMError = o.error;
        var v2507 : function(:Event):void/*Function?*/ = o.onloadstart;
        var v2508 : function(:Event):void/*Function?*/ = o.onprogress;
        var v2509 : function(:Event):void/*Function?*/ = o.onload;
        var v2510 : function(:Event):void/*Function?*/ = o.onabort;
        var v2511 : function(:Event):void/*Function?*/ = o.onerror;
        var v2512 : function(:Event):void/*Function?*/ = o.onloadend;
    } // FileReader


    function compile_FileReaderSync(o : FileReaderSync) : void {
        var f2513 : ArrayBuffer = o.readAsArrayBuffer(X.getBlob());
        var f2514 : string/*DOMString*/ = o.readAsBinaryString(X.getBlob());
        var f2515 : string/*DOMString*/ = o.readAsText(X.getBlob());
        var f2516 : string/*DOMString*/ = o.readAsText(X.getBlob(), X.getstring());
        var f2517 : string/*DOMString*/ = o.readAsDataURL(X.getBlob());
    } // FileReaderSync


    function compile_URL(o : URL) : void {
        var f2518 : string/*DOMString*/ = URL.createObjectURL(X.getBlob());
        URL.revokeObjectURL(X.getstring());
    } // URL


    function compile_webkitURL(o : webkitURL) : void {
    } // webkitURL


    function compile_Touch(o : Touch) : void {
        var v2519 : int/*long*/ = o.identifier;
        var v2520 : EventTarget = o.target;
        var v2521 : int/*long*/ = o.screenX;
        var v2522 : int/*long*/ = o.screenY;
        var v2523 : int/*long*/ = o.clientX;
        var v2524 : int/*long*/ = o.clientY;
        var v2525 : int/*long*/ = o.pageX;
        var v2526 : int/*long*/ = o.pageY;
    } // Touch


    function compile_TouchList(o : TouchList) : void {
        var v2527 : int/*unsigned long*/ = o.length;
        var f2528 : MayBeUndefined.<Touch> = o.__native_index_operator__(X.getint());
        var f2529 : MayBeUndefined.<Touch> = o.item(X.getint());
        var f2530 : Touch = o.identifiedTouch(X.getint());
    } // TouchList


    function compile_TouchEvent(o : TouchEvent) : void {
        var v2531 : TouchList = o.touches;
        var v2532 : TouchList = o.targetTouches;
        var v2533 : TouchList = o.changedTouches;
        var v2534 : boolean = o.altKey;
        var v2535 : boolean = o.metaKey;
        var v2536 : boolean = o.ctrlKey;
        var v2537 : boolean = o.shiftKey;
    } // TouchEvent


    function compile_WebSocket(o : WebSocket) : void {
        var v2538 : string/*DOMString*/ = o.url;
        var v2539 : int/*unsigned short*/ = WebSocket.CONNECTING;
        var v2540 : int/*unsigned short*/ = o.CONNECTING;
        var v2541 : int/*unsigned short*/ = WebSocket.OPEN;
        var v2542 : int/*unsigned short*/ = o.OPEN;
        var v2543 : int/*unsigned short*/ = WebSocket.CLOSING;
        var v2544 : int/*unsigned short*/ = o.CLOSING;
        var v2545 : int/*unsigned short*/ = WebSocket.CLOSED;
        var v2546 : int/*unsigned short*/ = o.CLOSED;
        var v2547 : int/*unsigned short*/ = o.readyState;
        var v2548 : int/*unsigned long*/ = o.bufferedAmount;
        var v2549 : function(:Event):void/*Function?*/ = o.onopen;
        var v2550 : function(:Event):void/*Function?*/ = o.onerror;
        var v2551 : function(:Event):void/*Function?*/ = o.onclose;
        var v2552 : string/*DOMString*/ = o.extensions;
        var v2553 : string/*DOMString*/ = o.protocol;
        o.close();
        o.close(X.getint());
        o.close(X.getint(), X.getstring());
        var v2554 : function(:Event):void/*Function?*/ = o.onmessage;
        var v2555 : string/*DOMString*/ = o.binaryType;
        o.send(X.getstring());
        o.send(X.getArrayBufferView());
        o.send(X.getBlob());
    } // WebSocket


    function compile_CloseEvent(o : CloseEvent) : void {
        var v2556 : boolean = o.wasClean;
        var v2557 : int/*unsigned short*/ = o.code;
        var v2558 : string/*DOMString*/ = o.reason;
    } // CloseEvent


    function compile_CloseEventInit(o : CloseEventInit) : void {
        var v2559 : boolean = o.wasClean;
        var v2560 : int/*unsigned short*/ = o.code;
        var v2561 : string/*DOMString*/ = o.reason;
    } // CloseEventInit


    function compile_NavigatorGeolocation(o : NavigatorGeolocation) : void {
        var v2562 : Geolocation = o.geolocation;
    } // NavigatorGeolocation


    function compile_Geolocation(o : Geolocation) : void {
        o.getCurrentPosition(X.getPositionCallback());
        o.getCurrentPosition(X.getPositionCallback(), X.getPositionErrorCallback());
        o.getCurrentPosition(X.getPositionCallback(), X.getPositionErrorCallback(), X.getPositionOptions());
        var f2563 : int/*long*/ = o.watchPosition(X.getPositionCallback());
        var f2564 : int/*long*/ = o.watchPosition(X.getPositionCallback(), X.getPositionErrorCallback());
        var f2565 : int/*long*/ = o.watchPosition(X.getPositionCallback(), X.getPositionErrorCallback(), X.getPositionOptions());
        o.clearWatch(X.getint());
    } // Geolocation


    function compile_PositionCallback(o : PositionCallback) : void {
        o.handleEvent(X.getPosition());
    } // PositionCallback


    function compile_PositionErrorCallback(o : PositionErrorCallback) : void {
        o.handleEvent(X.getPositionError());
    } // PositionErrorCallback


    function compile_PositionOptions(o : PositionOptions) : void {
        var v2566 : boolean = o.enableHighAccuracy;
        var v2567 : int/*long*/ = o.timeout;
        var v2568 : int/*long*/ = o.maximumAge;
        var v2569 : boolean = o.requireCoords;
        var v2570 : boolean = o.requestAddress;
    } // PositionOptions


    function compile_Position(o : Position) : void {
        var v2571 : Coordinates = o.coords;
        var v2572 : Address = o.address;
        var v2573 : number/*DOMTimeStamp*/ = o.timestamp;
    } // Position


    function compile_Coordinates(o : Coordinates) : void {
        var v2574 : number/*double?*/ = o.latitude;
        var v2575 : number/*double?*/ = o.longitude;
        var v2576 : number/*double?*/ = o.altitude;
        var v2577 : number/*double?*/ = o.accuracy;
        var v2578 : number/*double?*/ = o.altitudeAccuracy;
        var v2579 : number/*double?*/ = o.heading;
        var v2580 : number/*double?*/ = o.speed;
        var v2581 : number/*double?*/ = o.verticalSpeed;
    } // Coordinates


    function compile_Address(o : Address) : void {
        var v2582 : string/*DOMString?*/ = o.country;
        var v2583 : string/*DOMString?*/ = o.region;
        var v2584 : string/*DOMString?*/ = o.county;
        var v2585 : string/*DOMString?*/ = o.city;
        var v2586 : string/*DOMString?*/ = o.street;
        var v2587 : string/*DOMString?*/ = o.streetNumber;
        var v2588 : string/*DOMString?*/ = o.premises;
        var v2589 : string/*DOMString?*/ = o.postalCode;
    } // Address


    function compile_PositionError(o : PositionError) : void {
        var v2590 : int/*unsigned short*/ = PositionError.PERMISSION_DENIED;
        var v2591 : int/*unsigned short*/ = o.PERMISSION_DENIED;
        var v2592 : int/*unsigned short*/ = PositionError.POSITION_UNAVAILABLE;
        var v2593 : int/*unsigned short*/ = o.POSITION_UNAVAILABLE;
        var v2594 : int/*unsigned short*/ = PositionError.TIMEOUT;
        var v2595 : int/*unsigned short*/ = o.TIMEOUT;
        var v2596 : int/*unsigned short*/ = o.code;
        var v2597 : string/*DOMString*/ = o.message;
    } // PositionError


    function compile_Storage(o : Storage) : void {
        var v2598 : int/*unsigned long*/ = o.length;
        var f2599 : string/*DOMString?*/ = o.key(X.getint());
        var f2600 : MayBeUndefined.<string/*DOMString*/> = o.__native_index_operator__(X.getstring());
        var f2601 : MayBeUndefined.<string/*DOMString*/> = o.getItem(X.getstring());
        o.setItem(X.getstring(), X.getstring());
        o.removeItem(X.getstring());
        o.clear();
    } // Storage


    function compile_WindowSessionStorage(o : WindowSessionStorage) : void {
        var v2602 : Storage = o.sessionStorage;
    } // WindowSessionStorage


    function compile_WindowLocalStorage(o : WindowLocalStorage) : void {
        var v2603 : Storage = o.localStorage;
    } // WindowLocalStorage


    function compile_StorageEvent(o : StorageEvent) : void {
        var v2604 : string/*DOMString?*/ = o.key;
        var v2605 : string/*DOMString?*/ = o.oldValue;
        var v2606 : string/*DOMString?*/ = o.newValue;
        var v2607 : string/*DOMString*/ = o.url;
        var v2608 : Storage = o.storageArea;
    } // StorageEvent


    function compile_StorageEventInit(o : StorageEventInit) : void {
        var v2609 : string/*DOMString?*/ = o.key;
        var v2610 : string/*DOMString?*/ = o.oldValue;
        var v2611 : string/*DOMString?*/ = o.newValue;
        var v2612 : string/*DOMString*/ = o.url;
        var v2613 : Storage = o.storageArea;
    } // StorageEventInit


    function compile_NodeSelector(o : NodeSelector) : void {
        var f2614 : Element = o.querySelector(X.getstring());
        var f2615 : NodeList = o.querySelectorAll(X.getstring());
    } // NodeSelector


    function compile_DOMParser(o : DOMParser) : void {
        var f2616 : HTMLDocument/*Document*/ = o.parseFromString(X.getstring(), X.getstring());
    } // DOMParser


    function compile_XMLSerializer(o : XMLSerializer) : void {
        var f2617 : string/*DOMString*/ = o.serializeToString(X.getNode());
    } // XMLSerializer


    function compile_ArrayBuffer(o : ArrayBuffer) : void {
        var v2618 : int/*unsigned long*/ = o.byteLength;
        var f2619 : ArrayBuffer = o.slice(X.getint());
        var f2620 : ArrayBuffer = o.slice(X.getint(), X.getint());
    } // ArrayBuffer


    function compile_ArrayBufferView(o : ArrayBufferView) : void {
        var v2621 : ArrayBuffer = o.buffer;
        var v2622 : int/*unsigned long*/ = o.byteOffset;
        var v2623 : int/*unsigned long*/ = o.byteLength;
    } // ArrayBufferView


    function compile_Int8Array(o : Int8Array) : void {
        var v2624 : int/*long*/ = Int8Array.BYTES_PER_ELEMENT;
        var v2625 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2626 : int/*unsigned long*/ = o.length;
        var f2627 : MayBeUndefined.<int/*byte*/> = o.__native_index_operator__(X.getint());
        var f2628 : MayBeUndefined.<int/*byte*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt8Array());
        o.set(X.getInt8Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2629 : Int8Array = o.subarray(X.getint(), X.getint());
    } // Int8Array


    function compile_Uint8Array(o : Uint8Array) : void {
        var v2630 : int/*long*/ = Uint8Array.BYTES_PER_ELEMENT;
        var v2631 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2632 : int/*unsigned long*/ = o.length;
        var f2633 : MayBeUndefined.<int/*octet*/> = o.__native_index_operator__(X.getint());
        var f2634 : MayBeUndefined.<int/*octet*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint8Array());
        o.set(X.getUint8Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2635 : Uint8Array = o.subarray(X.getint(), X.getint());
    } // Uint8Array


    function compile_Uint8ClampedArray(o : Uint8ClampedArray) : void {
        o.set(X.getint(), X.getint());
        o.set(X.getUint8ClampedArray());
        o.set(X.getUint8ClampedArray(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2636 : Uint8ClampedArray = o.subarray(X.getint(), X.getint());
    } // Uint8ClampedArray


    function compile_Int16Array(o : Int16Array) : void {
        var v2637 : int/*long*/ = Int16Array.BYTES_PER_ELEMENT;
        var v2638 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2639 : int/*unsigned long*/ = o.length;
        var f2640 : MayBeUndefined.<int/*short*/> = o.__native_index_operator__(X.getint());
        var f2641 : MayBeUndefined.<int/*short*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt16Array());
        o.set(X.getInt16Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2642 : Int16Array = o.subarray(X.getint(), X.getint());
    } // Int16Array


    function compile_Uint16Array(o : Uint16Array) : void {
        var v2643 : int/*long*/ = Uint16Array.BYTES_PER_ELEMENT;
        var v2644 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2645 : int/*unsigned long*/ = o.length;
        var f2646 : MayBeUndefined.<int/*unsigned short*/> = o.__native_index_operator__(X.getint());
        var f2647 : MayBeUndefined.<int/*unsigned short*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint16Array());
        o.set(X.getUint16Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2648 : Uint16Array = o.subarray(X.getint(), X.getint());
    } // Uint16Array


    function compile_Int32Array(o : Int32Array) : void {
        var v2649 : int/*long*/ = Int32Array.BYTES_PER_ELEMENT;
        var v2650 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2651 : int/*unsigned long*/ = o.length;
        var f2652 : MayBeUndefined.<int/*long*/> = o.__native_index_operator__(X.getint());
        var f2653 : MayBeUndefined.<int/*long*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getInt32Array());
        o.set(X.getInt32Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2654 : Int32Array = o.subarray(X.getint(), X.getint());
    } // Int32Array


    function compile_Uint32Array(o : Uint32Array) : void {
        var v2655 : int/*long*/ = Uint32Array.BYTES_PER_ELEMENT;
        var v2656 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2657 : int/*unsigned long*/ = o.length;
        var f2658 : MayBeUndefined.<int/*unsigned long*/> = o.__native_index_operator__(X.getint());
        var f2659 : MayBeUndefined.<int/*unsigned long*/> = o.get(X.getint());
        o.set(X.getint(), X.getint());
        o.set(X.getUint32Array());
        o.set(X.getUint32Array(), X.getint());
        o.set(X.getint__());
        o.set(X.getint__(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2660 : Uint32Array = o.subarray(X.getint(), X.getint());
    } // Uint32Array


    function compile_Float32Array(o : Float32Array) : void {
        var v2661 : int/*long*/ = Float32Array.BYTES_PER_ELEMENT;
        var v2662 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2663 : int/*unsigned long*/ = o.length;
        var f2664 : MayBeUndefined.<number/*float*/> = o.__native_index_operator__(X.getint());
        var f2665 : MayBeUndefined.<number/*float*/> = o.get(X.getint());
        o.set(X.getint(), X.getnumber());
        o.set(X.getFloat32Array());
        o.set(X.getFloat32Array(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2666 : Float32Array = o.subarray(X.getint(), X.getint());
    } // Float32Array


    function compile_Float64Array(o : Float64Array) : void {
        var v2667 : int/*long*/ = Float64Array.BYTES_PER_ELEMENT;
        var v2668 : int/*long*/ = o.BYTES_PER_ELEMENT;
        var v2669 : int/*unsigned long*/ = o.length;
        var f2670 : MayBeUndefined.<number/*double*/> = o.__native_index_operator__(X.getint());
        var f2671 : MayBeUndefined.<number/*double*/> = o.get(X.getint());
        o.set(X.getint(), X.getnumber());
        o.set(X.getFloat64Array());
        o.set(X.getFloat64Array(), X.getint());
        o.set(X.getnumber__());
        o.set(X.getnumber__(), X.getint());
        var f2672 : Float64Array = o.subarray(X.getint(), X.getint());
    } // Float64Array


    function compile_DataView(o : DataView) : void {
        var f2673 : int/*byte*/ = o.getInt8(X.getint());
        var f2674 : int/*octet*/ = o.getUint8(X.getint());
        var f2675 : int/*short*/ = o.getInt16(X.getint());
        var f2676 : int/*short*/ = o.getInt16(X.getint(), X.getboolean());
        var f2677 : int/*unsigned short*/ = o.getUint16(X.getint());
        var f2678 : int/*unsigned short*/ = o.getUint16(X.getint(), X.getboolean());
        var f2679 : int/*long*/ = o.getInt32(X.getint());
        var f2680 : int/*long*/ = o.getInt32(X.getint(), X.getboolean());
        var f2681 : int/*unsigned long*/ = o.getUint32(X.getint());
        var f2682 : int/*unsigned long*/ = o.getUint32(X.getint(), X.getboolean());
        var f2683 : number/*float*/ = o.getFloat32(X.getint());
        var f2684 : number/*float*/ = o.getFloat32(X.getint(), X.getboolean());
        var f2685 : number/*double*/ = o.getFloat64(X.getint());
        var f2686 : number/*double*/ = o.getFloat64(X.getint(), X.getboolean());
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


    function compile_CanvasRenderingContext2D(o : CanvasRenderingContext2D) : void {
        var v2687 : HTMLCanvasElement = o.canvas;
        o.save();
        o.restore();
        var v2688 : number/*double*/ = o.globalAlpha;
        var v2689 : string/*DOMString*/ = o.globalCompositeOperation;
        var v2690 : variant/*any*/ = o.strokeStyle;
        var v2691 : variant/*any*/ = o.fillStyle;
        var f2692 : CanvasGradient = o.createLinearGradient(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f2693 : CanvasGradient = o.createRadialGradient(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f2694 : CanvasPattern = o.createPattern(X.getHTMLImageElement(), X.getstring());
        var f2695 : CanvasPattern = o.createPattern(X.getHTMLCanvasElement(), X.getstring());
        var f2696 : CanvasPattern = o.createPattern(X.getHTMLVideoElement(), X.getstring());
        var v2697 : number/*double*/ = o.shadowOffsetX;
        var v2698 : number/*double*/ = o.shadowOffsetY;
        var v2699 : number/*double*/ = o.shadowBlur;
        var v2700 : string/*DOMString*/ = o.shadowColor;
        o.clearRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.fillRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.strokeRect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.beginPath();
        o.fill();
        o.stroke();
        o.drawSystemFocusRing(X.getElement());
        var f2701 : boolean = o.drawCustomFocusRing(X.getElement());
        o.scrollPathIntoView();
        o.clip();
        var f2702 : boolean = o.isPointInPath(X.getnumber(), X.getnumber());
        o.fillText(X.getstring(), X.getnumber(), X.getnumber());
        o.fillText(X.getstring(), X.getnumber(), X.getnumber(), X.getnumber());
        o.strokeText(X.getstring(), X.getnumber(), X.getnumber());
        o.strokeText(X.getstring(), X.getnumber(), X.getnumber(), X.getnumber());
        var f2703 : TextMetrics = o.measureText(X.getstring());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLImageElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLCanvasElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.drawImage(X.getHTMLVideoElement(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var f2704 : ImageData = o.createImageData(X.getnumber(), X.getnumber());
        var f2705 : ImageData = o.createImageData(X.getImageData());
        var f2706 : ImageData = o.getImageData(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.putImageData(X.getImageData(), X.getnumber(), X.getnumber());
        o.putImageData(X.getImageData(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.scale(X.getnumber(), X.getnumber());
        o.rotate(X.getnumber());
        o.translate(X.getnumber(), X.getnumber());
        o.transform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.setTransform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        var v2707 : number/*double*/ = o.lineWidth;
        var v2708 : string/*DOMString*/ = o.lineCap;
        var v2709 : string/*DOMString*/ = o.lineJoin;
        var v2710 : number/*double*/ = o.miterLimit;
        o.closePath();
        o.moveTo(X.getnumber(), X.getnumber());
        o.lineTo(X.getnumber(), X.getnumber());
        o.quadraticCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.bezierCurveTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arcTo(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.rect(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.arc(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getboolean());
        var v2711 : string/*DOMString*/ = o.font;
        var v2712 : string/*DOMString*/ = o.textAlign;
        var v2713 : string/*DOMString*/ = o.textBaseline;
    } // CanvasRenderingContext2D


    function compile_CanvasTransformation(o : CanvasTransformation) : void {
        o.scale(X.getnumber(), X.getnumber());
        o.rotate(X.getnumber());
        o.translate(X.getnumber(), X.getnumber());
        o.transform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
        o.setTransform(X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber(), X.getnumber());
    } // CanvasTransformation


    function compile_CanvasLineStyles(o : CanvasLineStyles) : void {
        var v2714 : number/*double*/ = o.lineWidth;
        var v2715 : string/*DOMString*/ = o.lineCap;
        var v2716 : string/*DOMString*/ = o.lineJoin;
        var v2717 : number/*double*/ = o.miterLimit;
    } // CanvasLineStyles


    function compile_CanvasText(o : CanvasText) : void {
        var v2718 : string/*DOMString*/ = o.font;
        var v2719 : string/*DOMString*/ = o.textAlign;
        var v2720 : string/*DOMString*/ = o.textBaseline;
    } // CanvasText


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


    function compile_CanvasGradient(o : CanvasGradient) : void {
        o.addColorStop(X.getnumber(), X.getstring());
    } // CanvasGradient


    function compile_CanvasPattern(o : CanvasPattern) : void {
    } // CanvasPattern


    function compile_TextMetrics(o : TextMetrics) : void {
        var v2721 : number/*double*/ = o.width;
    } // TextMetrics


    function compile_ImageData(o : ImageData) : void {
        var v2722 : int/*unsigned long*/ = o.width;
        var v2723 : int/*unsigned long*/ = o.height;
        var v2724 : Uint8ClampedArray = o.data;
    } // ImageData


    function compile_WebGLContextAttributes(o : WebGLContextAttributes) : void {
        var v2725 : boolean = o.alpha;
        var v2726 : boolean = o.depth;
        var v2727 : boolean = o.stencil;
        var v2728 : boolean = o.antialias;
        var v2729 : boolean = o.premultipliedAlpha;
        var v2730 : boolean = o.preserveDrawingBuffer;
    } // WebGLContextAttributes


    function compile_WebGLObject(o : WebGLObject) : void {
    } // WebGLObject


    function compile_WebGLBuffer(o : WebGLBuffer) : void {
    } // WebGLBuffer


    function compile_WebGLFramebuffer(o : WebGLFramebuffer) : void {
    } // WebGLFramebuffer


    function compile_WebGLProgram(o : WebGLProgram) : void {
    } // WebGLProgram


    function compile_WebGLRenderbuffer(o : WebGLRenderbuffer) : void {
    } // WebGLRenderbuffer


    function compile_WebGLShader(o : WebGLShader) : void {
    } // WebGLShader


    function compile_WebGLTexture(o : WebGLTexture) : void {
    } // WebGLTexture


    function compile_WebGLUniformLocation(o : WebGLUniformLocation) : void {
    } // WebGLUniformLocation


    function compile_WebGLActiveInfo(o : WebGLActiveInfo) : void {
        var v2731 : int/*GLint*/ = o.size;
        var v2732 : int/*GLenum*/ = o.type;
        var v2733 : string/*DOMString*/ = o.name;
    } // WebGLActiveInfo


    function compile_WebGLShaderPrecisionFormat(o : WebGLShaderPrecisionFormat) : void {
        var v2734 : int/*GLint*/ = o.rangeMin;
        var v2735 : int/*GLint*/ = o.rangeMax;
        var v2736 : int/*GLint*/ = o.precision;
    } // WebGLShaderPrecisionFormat


    function compile_WebGLRenderingContext(o : WebGLRenderingContext) : void {
        var v2737 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_BUFFER_BIT;
        var v2738 : int/*GLenum*/ = o.DEPTH_BUFFER_BIT;
        var v2739 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BUFFER_BIT;
        var v2740 : int/*GLenum*/ = o.STENCIL_BUFFER_BIT;
        var v2741 : int/*GLenum*/ = WebGLRenderingContext.COLOR_BUFFER_BIT;
        var v2742 : int/*GLenum*/ = o.COLOR_BUFFER_BIT;
        var v2743 : int/*GLenum*/ = WebGLRenderingContext.POINTS;
        var v2744 : int/*GLenum*/ = o.POINTS;
        var v2745 : int/*GLenum*/ = WebGLRenderingContext.LINES;
        var v2746 : int/*GLenum*/ = o.LINES;
        var v2747 : int/*GLenum*/ = WebGLRenderingContext.LINE_LOOP;
        var v2748 : int/*GLenum*/ = o.LINE_LOOP;
        var v2749 : int/*GLenum*/ = WebGLRenderingContext.LINE_STRIP;
        var v2750 : int/*GLenum*/ = o.LINE_STRIP;
        var v2751 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLES;
        var v2752 : int/*GLenum*/ = o.TRIANGLES;
        var v2753 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLE_STRIP;
        var v2754 : int/*GLenum*/ = o.TRIANGLE_STRIP;
        var v2755 : int/*GLenum*/ = WebGLRenderingContext.TRIANGLE_FAN;
        var v2756 : int/*GLenum*/ = o.TRIANGLE_FAN;
        var v2757 : int/*GLenum*/ = WebGLRenderingContext.ZERO;
        var v2758 : int/*GLenum*/ = o.ZERO;
        var v2759 : int/*GLenum*/ = WebGLRenderingContext.ONE;
        var v2760 : int/*GLenum*/ = o.ONE;
        var v2761 : int/*GLenum*/ = WebGLRenderingContext.SRC_COLOR;
        var v2762 : int/*GLenum*/ = o.SRC_COLOR;
        var v2763 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_SRC_COLOR;
        var v2764 : int/*GLenum*/ = o.ONE_MINUS_SRC_COLOR;
        var v2765 : int/*GLenum*/ = WebGLRenderingContext.SRC_ALPHA;
        var v2766 : int/*GLenum*/ = o.SRC_ALPHA;
        var v2767 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
        var v2768 : int/*GLenum*/ = o.ONE_MINUS_SRC_ALPHA;
        var v2769 : int/*GLenum*/ = WebGLRenderingContext.DST_ALPHA;
        var v2770 : int/*GLenum*/ = o.DST_ALPHA;
        var v2771 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_DST_ALPHA;
        var v2772 : int/*GLenum*/ = o.ONE_MINUS_DST_ALPHA;
        var v2773 : int/*GLenum*/ = WebGLRenderingContext.DST_COLOR;
        var v2774 : int/*GLenum*/ = o.DST_COLOR;
        var v2775 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_DST_COLOR;
        var v2776 : int/*GLenum*/ = o.ONE_MINUS_DST_COLOR;
        var v2777 : int/*GLenum*/ = WebGLRenderingContext.SRC_ALPHA_SATURATE;
        var v2778 : int/*GLenum*/ = o.SRC_ALPHA_SATURATE;
        var v2779 : int/*GLenum*/ = WebGLRenderingContext.FUNC_ADD;
        var v2780 : int/*GLenum*/ = o.FUNC_ADD;
        var v2781 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION;
        var v2782 : int/*GLenum*/ = o.BLEND_EQUATION;
        var v2783 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION_RGB;
        var v2784 : int/*GLenum*/ = o.BLEND_EQUATION_RGB;
        var v2785 : int/*GLenum*/ = WebGLRenderingContext.BLEND_EQUATION_ALPHA;
        var v2786 : int/*GLenum*/ = o.BLEND_EQUATION_ALPHA;
        var v2787 : int/*GLenum*/ = WebGLRenderingContext.FUNC_SUBTRACT;
        var v2788 : int/*GLenum*/ = o.FUNC_SUBTRACT;
        var v2789 : int/*GLenum*/ = WebGLRenderingContext.FUNC_REVERSE_SUBTRACT;
        var v2790 : int/*GLenum*/ = o.FUNC_REVERSE_SUBTRACT;
        var v2791 : int/*GLenum*/ = WebGLRenderingContext.BLEND_DST_RGB;
        var v2792 : int/*GLenum*/ = o.BLEND_DST_RGB;
        var v2793 : int/*GLenum*/ = WebGLRenderingContext.BLEND_SRC_RGB;
        var v2794 : int/*GLenum*/ = o.BLEND_SRC_RGB;
        var v2795 : int/*GLenum*/ = WebGLRenderingContext.BLEND_DST_ALPHA;
        var v2796 : int/*GLenum*/ = o.BLEND_DST_ALPHA;
        var v2797 : int/*GLenum*/ = WebGLRenderingContext.BLEND_SRC_ALPHA;
        var v2798 : int/*GLenum*/ = o.BLEND_SRC_ALPHA;
        var v2799 : int/*GLenum*/ = WebGLRenderingContext.CONSTANT_COLOR;
        var v2800 : int/*GLenum*/ = o.CONSTANT_COLOR;
        var v2801 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR;
        var v2802 : int/*GLenum*/ = o.ONE_MINUS_CONSTANT_COLOR;
        var v2803 : int/*GLenum*/ = WebGLRenderingContext.CONSTANT_ALPHA;
        var v2804 : int/*GLenum*/ = o.CONSTANT_ALPHA;
        var v2805 : int/*GLenum*/ = WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA;
        var v2806 : int/*GLenum*/ = o.ONE_MINUS_CONSTANT_ALPHA;
        var v2807 : int/*GLenum*/ = WebGLRenderingContext.BLEND_COLOR;
        var v2808 : int/*GLenum*/ = o.BLEND_COLOR;
        var v2809 : int/*GLenum*/ = WebGLRenderingContext.ARRAY_BUFFER;
        var v2810 : int/*GLenum*/ = o.ARRAY_BUFFER;
        var v2811 : int/*GLenum*/ = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;
        var v2812 : int/*GLenum*/ = o.ELEMENT_ARRAY_BUFFER;
        var v2813 : int/*GLenum*/ = WebGLRenderingContext.ARRAY_BUFFER_BINDING;
        var v2814 : int/*GLenum*/ = o.ARRAY_BUFFER_BINDING;
        var v2815 : int/*GLenum*/ = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING;
        var v2816 : int/*GLenum*/ = o.ELEMENT_ARRAY_BUFFER_BINDING;
        var v2817 : int/*GLenum*/ = WebGLRenderingContext.STREAM_DRAW;
        var v2818 : int/*GLenum*/ = o.STREAM_DRAW;
        var v2819 : int/*GLenum*/ = WebGLRenderingContext.STATIC_DRAW;
        var v2820 : int/*GLenum*/ = o.STATIC_DRAW;
        var v2821 : int/*GLenum*/ = WebGLRenderingContext.DYNAMIC_DRAW;
        var v2822 : int/*GLenum*/ = o.DYNAMIC_DRAW;
        var v2823 : int/*GLenum*/ = WebGLRenderingContext.BUFFER_SIZE;
        var v2824 : int/*GLenum*/ = o.BUFFER_SIZE;
        var v2825 : int/*GLenum*/ = WebGLRenderingContext.BUFFER_USAGE;
        var v2826 : int/*GLenum*/ = o.BUFFER_USAGE;
        var v2827 : int/*GLenum*/ = WebGLRenderingContext.CURRENT_VERTEX_ATTRIB;
        var v2828 : int/*GLenum*/ = o.CURRENT_VERTEX_ATTRIB;
        var v2829 : int/*GLenum*/ = WebGLRenderingContext.FRONT;
        var v2830 : int/*GLenum*/ = o.FRONT;
        var v2831 : int/*GLenum*/ = WebGLRenderingContext.BACK;
        var v2832 : int/*GLenum*/ = o.BACK;
        var v2833 : int/*GLenum*/ = WebGLRenderingContext.FRONT_AND_BACK;
        var v2834 : int/*GLenum*/ = o.FRONT_AND_BACK;
        var v2835 : int/*GLenum*/ = WebGLRenderingContext.CULL_FACE;
        var v2836 : int/*GLenum*/ = o.CULL_FACE;
        var v2837 : int/*GLenum*/ = WebGLRenderingContext.BLEND;
        var v2838 : int/*GLenum*/ = o.BLEND;
        var v2839 : int/*GLenum*/ = WebGLRenderingContext.DITHER;
        var v2840 : int/*GLenum*/ = o.DITHER;
        var v2841 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_TEST;
        var v2842 : int/*GLenum*/ = o.STENCIL_TEST;
        var v2843 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_TEST;
        var v2844 : int/*GLenum*/ = o.DEPTH_TEST;
        var v2845 : int/*GLenum*/ = WebGLRenderingContext.SCISSOR_TEST;
        var v2846 : int/*GLenum*/ = o.SCISSOR_TEST;
        var v2847 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_FILL;
        var v2848 : int/*GLenum*/ = o.POLYGON_OFFSET_FILL;
        var v2849 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE;
        var v2850 : int/*GLenum*/ = o.SAMPLE_ALPHA_TO_COVERAGE;
        var v2851 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE;
        var v2852 : int/*GLenum*/ = o.SAMPLE_COVERAGE;
        var v2853 : int/*GLenum*/ = WebGLRenderingContext.NO_ERROR;
        var v2854 : int/*GLenum*/ = o.NO_ERROR;
        var v2855 : int/*GLenum*/ = WebGLRenderingContext.INVALID_ENUM;
        var v2856 : int/*GLenum*/ = o.INVALID_ENUM;
        var v2857 : int/*GLenum*/ = WebGLRenderingContext.INVALID_VALUE;
        var v2858 : int/*GLenum*/ = o.INVALID_VALUE;
        var v2859 : int/*GLenum*/ = WebGLRenderingContext.INVALID_OPERATION;
        var v2860 : int/*GLenum*/ = o.INVALID_OPERATION;
        var v2861 : int/*GLenum*/ = WebGLRenderingContext.OUT_OF_MEMORY;
        var v2862 : int/*GLenum*/ = o.OUT_OF_MEMORY;
        var v2863 : int/*GLenum*/ = WebGLRenderingContext.CW;
        var v2864 : int/*GLenum*/ = o.CW;
        var v2865 : int/*GLenum*/ = WebGLRenderingContext.CCW;
        var v2866 : int/*GLenum*/ = o.CCW;
        var v2867 : int/*GLenum*/ = WebGLRenderingContext.LINE_WIDTH;
        var v2868 : int/*GLenum*/ = o.LINE_WIDTH;
        var v2869 : int/*GLenum*/ = WebGLRenderingContext.ALIASED_POINT_SIZE_RANGE;
        var v2870 : int/*GLenum*/ = o.ALIASED_POINT_SIZE_RANGE;
        var v2871 : int/*GLenum*/ = WebGLRenderingContext.ALIASED_LINE_WIDTH_RANGE;
        var v2872 : int/*GLenum*/ = o.ALIASED_LINE_WIDTH_RANGE;
        var v2873 : int/*GLenum*/ = WebGLRenderingContext.CULL_FACE_MODE;
        var v2874 : int/*GLenum*/ = o.CULL_FACE_MODE;
        var v2875 : int/*GLenum*/ = WebGLRenderingContext.FRONT_FACE;
        var v2876 : int/*GLenum*/ = o.FRONT_FACE;
        var v2877 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_RANGE;
        var v2878 : int/*GLenum*/ = o.DEPTH_RANGE;
        var v2879 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_WRITEMASK;
        var v2880 : int/*GLenum*/ = o.DEPTH_WRITEMASK;
        var v2881 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_CLEAR_VALUE;
        var v2882 : int/*GLenum*/ = o.DEPTH_CLEAR_VALUE;
        var v2883 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_FUNC;
        var v2884 : int/*GLenum*/ = o.DEPTH_FUNC;
        var v2885 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_CLEAR_VALUE;
        var v2886 : int/*GLenum*/ = o.STENCIL_CLEAR_VALUE;
        var v2887 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_FUNC;
        var v2888 : int/*GLenum*/ = o.STENCIL_FUNC;
        var v2889 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_FAIL;
        var v2890 : int/*GLenum*/ = o.STENCIL_FAIL;
        var v2891 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_PASS_DEPTH_FAIL;
        var v2892 : int/*GLenum*/ = o.STENCIL_PASS_DEPTH_FAIL;
        var v2893 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_PASS_DEPTH_PASS;
        var v2894 : int/*GLenum*/ = o.STENCIL_PASS_DEPTH_PASS;
        var v2895 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_REF;
        var v2896 : int/*GLenum*/ = o.STENCIL_REF;
        var v2897 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_VALUE_MASK;
        var v2898 : int/*GLenum*/ = o.STENCIL_VALUE_MASK;
        var v2899 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_WRITEMASK;
        var v2900 : int/*GLenum*/ = o.STENCIL_WRITEMASK;
        var v2901 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_FUNC;
        var v2902 : int/*GLenum*/ = o.STENCIL_BACK_FUNC;
        var v2903 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_FAIL;
        var v2904 : int/*GLenum*/ = o.STENCIL_BACK_FAIL;
        var v2905 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_FAIL;
        var v2906 : int/*GLenum*/ = o.STENCIL_BACK_PASS_DEPTH_FAIL;
        var v2907 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_PASS;
        var v2908 : int/*GLenum*/ = o.STENCIL_BACK_PASS_DEPTH_PASS;
        var v2909 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_REF;
        var v2910 : int/*GLenum*/ = o.STENCIL_BACK_REF;
        var v2911 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_VALUE_MASK;
        var v2912 : int/*GLenum*/ = o.STENCIL_BACK_VALUE_MASK;
        var v2913 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BACK_WRITEMASK;
        var v2914 : int/*GLenum*/ = o.STENCIL_BACK_WRITEMASK;
        var v2915 : int/*GLenum*/ = WebGLRenderingContext.VIEWPORT;
        var v2916 : int/*GLenum*/ = o.VIEWPORT;
        var v2917 : int/*GLenum*/ = WebGLRenderingContext.SCISSOR_BOX;
        var v2918 : int/*GLenum*/ = o.SCISSOR_BOX;
        var v2919 : int/*GLenum*/ = WebGLRenderingContext.COLOR_CLEAR_VALUE;
        var v2920 : int/*GLenum*/ = o.COLOR_CLEAR_VALUE;
        var v2921 : int/*GLenum*/ = WebGLRenderingContext.COLOR_WRITEMASK;
        var v2922 : int/*GLenum*/ = o.COLOR_WRITEMASK;
        var v2923 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_ALIGNMENT;
        var v2924 : int/*GLenum*/ = o.UNPACK_ALIGNMENT;
        var v2925 : int/*GLenum*/ = WebGLRenderingContext.PACK_ALIGNMENT;
        var v2926 : int/*GLenum*/ = o.PACK_ALIGNMENT;
        var v2927 : int/*GLenum*/ = WebGLRenderingContext.MAX_TEXTURE_SIZE;
        var v2928 : int/*GLenum*/ = o.MAX_TEXTURE_SIZE;
        var v2929 : int/*GLenum*/ = WebGLRenderingContext.MAX_VIEWPORT_DIMS;
        var v2930 : int/*GLenum*/ = o.MAX_VIEWPORT_DIMS;
        var v2931 : int/*GLenum*/ = WebGLRenderingContext.SUBPIXEL_BITS;
        var v2932 : int/*GLenum*/ = o.SUBPIXEL_BITS;
        var v2933 : int/*GLenum*/ = WebGLRenderingContext.RED_BITS;
        var v2934 : int/*GLenum*/ = o.RED_BITS;
        var v2935 : int/*GLenum*/ = WebGLRenderingContext.GREEN_BITS;
        var v2936 : int/*GLenum*/ = o.GREEN_BITS;
        var v2937 : int/*GLenum*/ = WebGLRenderingContext.BLUE_BITS;
        var v2938 : int/*GLenum*/ = o.BLUE_BITS;
        var v2939 : int/*GLenum*/ = WebGLRenderingContext.ALPHA_BITS;
        var v2940 : int/*GLenum*/ = o.ALPHA_BITS;
        var v2941 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_BITS;
        var v2942 : int/*GLenum*/ = o.DEPTH_BITS;
        var v2943 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_BITS;
        var v2944 : int/*GLenum*/ = o.STENCIL_BITS;
        var v2945 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_UNITS;
        var v2946 : int/*GLenum*/ = o.POLYGON_OFFSET_UNITS;
        var v2947 : int/*GLenum*/ = WebGLRenderingContext.POLYGON_OFFSET_FACTOR;
        var v2948 : int/*GLenum*/ = o.POLYGON_OFFSET_FACTOR;
        var v2949 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_BINDING_2D;
        var v2950 : int/*GLenum*/ = o.TEXTURE_BINDING_2D;
        var v2951 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_BUFFERS;
        var v2952 : int/*GLenum*/ = o.SAMPLE_BUFFERS;
        var v2953 : int/*GLenum*/ = WebGLRenderingContext.SAMPLES;
        var v2954 : int/*GLenum*/ = o.SAMPLES;
        var v2955 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE_VALUE;
        var v2956 : int/*GLenum*/ = o.SAMPLE_COVERAGE_VALUE;
        var v2957 : int/*GLenum*/ = WebGLRenderingContext.SAMPLE_COVERAGE_INVERT;
        var v2958 : int/*GLenum*/ = o.SAMPLE_COVERAGE_INVERT;
        var v2959 : int/*GLenum*/ = WebGLRenderingContext.COMPRESSED_TEXTURE_FORMATS;
        var v2960 : int/*GLenum*/ = o.COMPRESSED_TEXTURE_FORMATS;
        var v2961 : int/*GLenum*/ = WebGLRenderingContext.DONT_CARE;
        var v2962 : int/*GLenum*/ = o.DONT_CARE;
        var v2963 : int/*GLenum*/ = WebGLRenderingContext.FASTEST;
        var v2964 : int/*GLenum*/ = o.FASTEST;
        var v2965 : int/*GLenum*/ = WebGLRenderingContext.NICEST;
        var v2966 : int/*GLenum*/ = o.NICEST;
        var v2967 : int/*GLenum*/ = WebGLRenderingContext.GENERATE_MIPMAP_HINT;
        var v2968 : int/*GLenum*/ = o.GENERATE_MIPMAP_HINT;
        var v2969 : int/*GLenum*/ = WebGLRenderingContext.BYTE;
        var v2970 : int/*GLenum*/ = o.BYTE;
        var v2971 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_BYTE;
        var v2972 : int/*GLenum*/ = o.UNSIGNED_BYTE;
        var v2973 : int/*GLenum*/ = WebGLRenderingContext.SHORT;
        var v2974 : int/*GLenum*/ = o.SHORT;
        var v2975 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT;
        var v2976 : int/*GLenum*/ = o.UNSIGNED_SHORT;
        var v2977 : int/*GLenum*/ = WebGLRenderingContext.INT;
        var v2978 : int/*GLenum*/ = o.INT;
        var v2979 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_INT;
        var v2980 : int/*GLenum*/ = o.UNSIGNED_INT;
        var v2981 : int/*GLenum*/ = WebGLRenderingContext.FLOAT;
        var v2982 : int/*GLenum*/ = o.FLOAT;
        var v2983 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_COMPONENT;
        var v2984 : int/*GLenum*/ = o.DEPTH_COMPONENT;
        var v2985 : int/*GLenum*/ = WebGLRenderingContext.ALPHA;
        var v2986 : int/*GLenum*/ = o.ALPHA;
        var v2987 : int/*GLenum*/ = WebGLRenderingContext.RGB;
        var v2988 : int/*GLenum*/ = o.RGB;
        var v2989 : int/*GLenum*/ = WebGLRenderingContext.RGBA;
        var v2990 : int/*GLenum*/ = o.RGBA;
        var v2991 : int/*GLenum*/ = WebGLRenderingContext.LUMINANCE;
        var v2992 : int/*GLenum*/ = o.LUMINANCE;
        var v2993 : int/*GLenum*/ = WebGLRenderingContext.LUMINANCE_ALPHA;
        var v2994 : int/*GLenum*/ = o.LUMINANCE_ALPHA;
        var v2995 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        var v2996 : int/*GLenum*/ = o.UNSIGNED_SHORT_4_4_4_4;
        var v2997 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        var v2998 : int/*GLenum*/ = o.UNSIGNED_SHORT_5_5_5_1;
        var v2999 : int/*GLenum*/ = WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        var v3000 : int/*GLenum*/ = o.UNSIGNED_SHORT_5_6_5;
        var v3001 : int/*GLenum*/ = WebGLRenderingContext.FRAGMENT_SHADER;
        var v3002 : int/*GLenum*/ = o.FRAGMENT_SHADER;
        var v3003 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_SHADER;
        var v3004 : int/*GLenum*/ = o.VERTEX_SHADER;
        var v3005 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_ATTRIBS;
        var v3006 : int/*GLenum*/ = o.MAX_VERTEX_ATTRIBS;
        var v3007 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS;
        var v3008 : int/*GLenum*/ = o.MAX_VERTEX_UNIFORM_VECTORS;
        var v3009 : int/*GLenum*/ = WebGLRenderingContext.MAX_VARYING_VECTORS;
        var v3010 : int/*GLenum*/ = o.MAX_VARYING_VECTORS;
        var v3011 : int/*GLenum*/ = WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        var v3012 : int/*GLenum*/ = o.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        var v3013 : int/*GLenum*/ = WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS;
        var v3014 : int/*GLenum*/ = o.MAX_VERTEX_TEXTURE_IMAGE_UNITS;
        var v3015 : int/*GLenum*/ = WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS;
        var v3016 : int/*GLenum*/ = o.MAX_TEXTURE_IMAGE_UNITS;
        var v3017 : int/*GLenum*/ = WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS;
        var v3018 : int/*GLenum*/ = o.MAX_FRAGMENT_UNIFORM_VECTORS;
        var v3019 : int/*GLenum*/ = WebGLRenderingContext.SHADER_TYPE;
        var v3020 : int/*GLenum*/ = o.SHADER_TYPE;
        var v3021 : int/*GLenum*/ = WebGLRenderingContext.DELETE_STATUS;
        var v3022 : int/*GLenum*/ = o.DELETE_STATUS;
        var v3023 : int/*GLenum*/ = WebGLRenderingContext.LINK_STATUS;
        var v3024 : int/*GLenum*/ = o.LINK_STATUS;
        var v3025 : int/*GLenum*/ = WebGLRenderingContext.VALIDATE_STATUS;
        var v3026 : int/*GLenum*/ = o.VALIDATE_STATUS;
        var v3027 : int/*GLenum*/ = WebGLRenderingContext.ATTACHED_SHADERS;
        var v3028 : int/*GLenum*/ = o.ATTACHED_SHADERS;
        var v3029 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_UNIFORMS;
        var v3030 : int/*GLenum*/ = o.ACTIVE_UNIFORMS;
        var v3031 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_ATTRIBUTES;
        var v3032 : int/*GLenum*/ = o.ACTIVE_ATTRIBUTES;
        var v3033 : int/*GLenum*/ = WebGLRenderingContext.SHADING_LANGUAGE_VERSION;
        var v3034 : int/*GLenum*/ = o.SHADING_LANGUAGE_VERSION;
        var v3035 : int/*GLenum*/ = WebGLRenderingContext.CURRENT_PROGRAM;
        var v3036 : int/*GLenum*/ = o.CURRENT_PROGRAM;
        var v3037 : int/*GLenum*/ = WebGLRenderingContext.NEVER;
        var v3038 : int/*GLenum*/ = o.NEVER;
        var v3039 : int/*GLenum*/ = WebGLRenderingContext.LESS;
        var v3040 : int/*GLenum*/ = o.LESS;
        var v3041 : int/*GLenum*/ = WebGLRenderingContext.EQUAL;
        var v3042 : int/*GLenum*/ = o.EQUAL;
        var v3043 : int/*GLenum*/ = WebGLRenderingContext.LEQUAL;
        var v3044 : int/*GLenum*/ = o.LEQUAL;
        var v3045 : int/*GLenum*/ = WebGLRenderingContext.GREATER;
        var v3046 : int/*GLenum*/ = o.GREATER;
        var v3047 : int/*GLenum*/ = WebGLRenderingContext.NOTEQUAL;
        var v3048 : int/*GLenum*/ = o.NOTEQUAL;
        var v3049 : int/*GLenum*/ = WebGLRenderingContext.GEQUAL;
        var v3050 : int/*GLenum*/ = o.GEQUAL;
        var v3051 : int/*GLenum*/ = WebGLRenderingContext.ALWAYS;
        var v3052 : int/*GLenum*/ = o.ALWAYS;
        var v3053 : int/*GLenum*/ = WebGLRenderingContext.KEEP;
        var v3054 : int/*GLenum*/ = o.KEEP;
        var v3055 : int/*GLenum*/ = WebGLRenderingContext.REPLACE;
        var v3056 : int/*GLenum*/ = o.REPLACE;
        var v3057 : int/*GLenum*/ = WebGLRenderingContext.INCR;
        var v3058 : int/*GLenum*/ = o.INCR;
        var v3059 : int/*GLenum*/ = WebGLRenderingContext.DECR;
        var v3060 : int/*GLenum*/ = o.DECR;
        var v3061 : int/*GLenum*/ = WebGLRenderingContext.INVERT;
        var v3062 : int/*GLenum*/ = o.INVERT;
        var v3063 : int/*GLenum*/ = WebGLRenderingContext.INCR_WRAP;
        var v3064 : int/*GLenum*/ = o.INCR_WRAP;
        var v3065 : int/*GLenum*/ = WebGLRenderingContext.DECR_WRAP;
        var v3066 : int/*GLenum*/ = o.DECR_WRAP;
        var v3067 : int/*GLenum*/ = WebGLRenderingContext.VENDOR;
        var v3068 : int/*GLenum*/ = o.VENDOR;
        var v3069 : int/*GLenum*/ = WebGLRenderingContext.RENDERER;
        var v3070 : int/*GLenum*/ = o.RENDERER;
        var v3071 : int/*GLenum*/ = WebGLRenderingContext.VERSION;
        var v3072 : int/*GLenum*/ = o.VERSION;
        var v3073 : int/*GLenum*/ = WebGLRenderingContext.NEAREST;
        var v3074 : int/*GLenum*/ = o.NEAREST;
        var v3075 : int/*GLenum*/ = WebGLRenderingContext.LINEAR;
        var v3076 : int/*GLenum*/ = o.LINEAR;
        var v3077 : int/*GLenum*/ = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
        var v3078 : int/*GLenum*/ = o.NEAREST_MIPMAP_NEAREST;
        var v3079 : int/*GLenum*/ = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
        var v3080 : int/*GLenum*/ = o.LINEAR_MIPMAP_NEAREST;
        var v3081 : int/*GLenum*/ = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
        var v3082 : int/*GLenum*/ = o.NEAREST_MIPMAP_LINEAR;
        var v3083 : int/*GLenum*/ = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
        var v3084 : int/*GLenum*/ = o.LINEAR_MIPMAP_LINEAR;
        var v3085 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_MAG_FILTER;
        var v3086 : int/*GLenum*/ = o.TEXTURE_MAG_FILTER;
        var v3087 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_MIN_FILTER;
        var v3088 : int/*GLenum*/ = o.TEXTURE_MIN_FILTER;
        var v3089 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_WRAP_S;
        var v3090 : int/*GLenum*/ = o.TEXTURE_WRAP_S;
        var v3091 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_WRAP_T;
        var v3092 : int/*GLenum*/ = o.TEXTURE_WRAP_T;
        var v3093 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_2D;
        var v3094 : int/*GLenum*/ = o.TEXTURE_2D;
        var v3095 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE;
        var v3096 : int/*GLenum*/ = o.TEXTURE;
        var v3097 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP;
        var v3098 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP;
        var v3099 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_BINDING_CUBE_MAP;
        var v3100 : int/*GLenum*/ = o.TEXTURE_BINDING_CUBE_MAP;
        var v3101 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X;
        var v3102 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_X;
        var v3103 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X;
        var v3104 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_X;
        var v3105 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y;
        var v3106 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_Y;
        var v3107 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        var v3108 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        var v3109 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z;
        var v3110 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_POSITIVE_Z;
        var v3111 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        var v3112 : int/*GLenum*/ = o.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        var v3113 : int/*GLenum*/ = WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE;
        var v3114 : int/*GLenum*/ = o.MAX_CUBE_MAP_TEXTURE_SIZE;
        var v3115 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE0;
        var v3116 : int/*GLenum*/ = o.TEXTURE0;
        var v3117 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE1;
        var v3118 : int/*GLenum*/ = o.TEXTURE1;
        var v3119 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE2;
        var v3120 : int/*GLenum*/ = o.TEXTURE2;
        var v3121 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE3;
        var v3122 : int/*GLenum*/ = o.TEXTURE3;
        var v3123 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE4;
        var v3124 : int/*GLenum*/ = o.TEXTURE4;
        var v3125 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE5;
        var v3126 : int/*GLenum*/ = o.TEXTURE5;
        var v3127 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE6;
        var v3128 : int/*GLenum*/ = o.TEXTURE6;
        var v3129 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE7;
        var v3130 : int/*GLenum*/ = o.TEXTURE7;
        var v3131 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE8;
        var v3132 : int/*GLenum*/ = o.TEXTURE8;
        var v3133 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE9;
        var v3134 : int/*GLenum*/ = o.TEXTURE9;
        var v3135 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE10;
        var v3136 : int/*GLenum*/ = o.TEXTURE10;
        var v3137 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE11;
        var v3138 : int/*GLenum*/ = o.TEXTURE11;
        var v3139 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE12;
        var v3140 : int/*GLenum*/ = o.TEXTURE12;
        var v3141 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE13;
        var v3142 : int/*GLenum*/ = o.TEXTURE13;
        var v3143 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE14;
        var v3144 : int/*GLenum*/ = o.TEXTURE14;
        var v3145 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE15;
        var v3146 : int/*GLenum*/ = o.TEXTURE15;
        var v3147 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE16;
        var v3148 : int/*GLenum*/ = o.TEXTURE16;
        var v3149 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE17;
        var v3150 : int/*GLenum*/ = o.TEXTURE17;
        var v3151 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE18;
        var v3152 : int/*GLenum*/ = o.TEXTURE18;
        var v3153 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE19;
        var v3154 : int/*GLenum*/ = o.TEXTURE19;
        var v3155 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE20;
        var v3156 : int/*GLenum*/ = o.TEXTURE20;
        var v3157 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE21;
        var v3158 : int/*GLenum*/ = o.TEXTURE21;
        var v3159 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE22;
        var v3160 : int/*GLenum*/ = o.TEXTURE22;
        var v3161 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE23;
        var v3162 : int/*GLenum*/ = o.TEXTURE23;
        var v3163 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE24;
        var v3164 : int/*GLenum*/ = o.TEXTURE24;
        var v3165 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE25;
        var v3166 : int/*GLenum*/ = o.TEXTURE25;
        var v3167 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE26;
        var v3168 : int/*GLenum*/ = o.TEXTURE26;
        var v3169 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE27;
        var v3170 : int/*GLenum*/ = o.TEXTURE27;
        var v3171 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE28;
        var v3172 : int/*GLenum*/ = o.TEXTURE28;
        var v3173 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE29;
        var v3174 : int/*GLenum*/ = o.TEXTURE29;
        var v3175 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE30;
        var v3176 : int/*GLenum*/ = o.TEXTURE30;
        var v3177 : int/*GLenum*/ = WebGLRenderingContext.TEXTURE31;
        var v3178 : int/*GLenum*/ = o.TEXTURE31;
        var v3179 : int/*GLenum*/ = WebGLRenderingContext.ACTIVE_TEXTURE;
        var v3180 : int/*GLenum*/ = o.ACTIVE_TEXTURE;
        var v3181 : int/*GLenum*/ = WebGLRenderingContext.REPEAT;
        var v3182 : int/*GLenum*/ = o.REPEAT;
        var v3183 : int/*GLenum*/ = WebGLRenderingContext.CLAMP_TO_EDGE;
        var v3184 : int/*GLenum*/ = o.CLAMP_TO_EDGE;
        var v3185 : int/*GLenum*/ = WebGLRenderingContext.MIRRORED_REPEAT;
        var v3186 : int/*GLenum*/ = o.MIRRORED_REPEAT;
        var v3187 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC2;
        var v3188 : int/*GLenum*/ = o.FLOAT_VEC2;
        var v3189 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC3;
        var v3190 : int/*GLenum*/ = o.FLOAT_VEC3;
        var v3191 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_VEC4;
        var v3192 : int/*GLenum*/ = o.FLOAT_VEC4;
        var v3193 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC2;
        var v3194 : int/*GLenum*/ = o.INT_VEC2;
        var v3195 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC3;
        var v3196 : int/*GLenum*/ = o.INT_VEC3;
        var v3197 : int/*GLenum*/ = WebGLRenderingContext.INT_VEC4;
        var v3198 : int/*GLenum*/ = o.INT_VEC4;
        var v3199 : int/*GLenum*/ = WebGLRenderingContext.BOOL;
        var v3200 : int/*GLenum*/ = o.BOOL;
        var v3201 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC2;
        var v3202 : int/*GLenum*/ = o.BOOL_VEC2;
        var v3203 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC3;
        var v3204 : int/*GLenum*/ = o.BOOL_VEC3;
        var v3205 : int/*GLenum*/ = WebGLRenderingContext.BOOL_VEC4;
        var v3206 : int/*GLenum*/ = o.BOOL_VEC4;
        var v3207 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT2;
        var v3208 : int/*GLenum*/ = o.FLOAT_MAT2;
        var v3209 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT3;
        var v3210 : int/*GLenum*/ = o.FLOAT_MAT3;
        var v3211 : int/*GLenum*/ = WebGLRenderingContext.FLOAT_MAT4;
        var v3212 : int/*GLenum*/ = o.FLOAT_MAT4;
        var v3213 : int/*GLenum*/ = WebGLRenderingContext.SAMPLER_2D;
        var v3214 : int/*GLenum*/ = o.SAMPLER_2D;
        var v3215 : int/*GLenum*/ = WebGLRenderingContext.SAMPLER_CUBE;
        var v3216 : int/*GLenum*/ = o.SAMPLER_CUBE;
        var v3217 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_ENABLED;
        var v3218 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_ENABLED;
        var v3219 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_SIZE;
        var v3220 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_SIZE;
        var v3221 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_STRIDE;
        var v3222 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_STRIDE;
        var v3223 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_TYPE;
        var v3224 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_TYPE;
        var v3225 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_NORMALIZED;
        var v3226 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_NORMALIZED;
        var v3227 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_POINTER;
        var v3228 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_POINTER;
        var v3229 : int/*GLenum*/ = WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
        var v3230 : int/*GLenum*/ = o.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
        var v3231 : int/*GLenum*/ = WebGLRenderingContext.COMPILE_STATUS;
        var v3232 : int/*GLenum*/ = o.COMPILE_STATUS;
        var v3233 : int/*GLenum*/ = WebGLRenderingContext.LOW_FLOAT;
        var v3234 : int/*GLenum*/ = o.LOW_FLOAT;
        var v3235 : int/*GLenum*/ = WebGLRenderingContext.MEDIUM_FLOAT;
        var v3236 : int/*GLenum*/ = o.MEDIUM_FLOAT;
        var v3237 : int/*GLenum*/ = WebGLRenderingContext.HIGH_FLOAT;
        var v3238 : int/*GLenum*/ = o.HIGH_FLOAT;
        var v3239 : int/*GLenum*/ = WebGLRenderingContext.LOW_INT;
        var v3240 : int/*GLenum*/ = o.LOW_INT;
        var v3241 : int/*GLenum*/ = WebGLRenderingContext.MEDIUM_INT;
        var v3242 : int/*GLenum*/ = o.MEDIUM_INT;
        var v3243 : int/*GLenum*/ = WebGLRenderingContext.HIGH_INT;
        var v3244 : int/*GLenum*/ = o.HIGH_INT;
        var v3245 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER;
        var v3246 : int/*GLenum*/ = o.FRAMEBUFFER;
        var v3247 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER;
        var v3248 : int/*GLenum*/ = o.RENDERBUFFER;
        var v3249 : int/*GLenum*/ = WebGLRenderingContext.RGBA4;
        var v3250 : int/*GLenum*/ = o.RGBA4;
        var v3251 : int/*GLenum*/ = WebGLRenderingContext.RGB5_A1;
        var v3252 : int/*GLenum*/ = o.RGB5_A1;
        var v3253 : int/*GLenum*/ = WebGLRenderingContext.RGB565;
        var v3254 : int/*GLenum*/ = o.RGB565;
        var v3255 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_COMPONENT16;
        var v3256 : int/*GLenum*/ = o.DEPTH_COMPONENT16;
        var v3257 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_INDEX;
        var v3258 : int/*GLenum*/ = o.STENCIL_INDEX;
        var v3259 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_INDEX8;
        var v3260 : int/*GLenum*/ = o.STENCIL_INDEX8;
        var v3261 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_STENCIL;
        var v3262 : int/*GLenum*/ = o.DEPTH_STENCIL;
        var v3263 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_WIDTH;
        var v3264 : int/*GLenum*/ = o.RENDERBUFFER_WIDTH;
        var v3265 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_HEIGHT;
        var v3266 : int/*GLenum*/ = o.RENDERBUFFER_HEIGHT;
        var v3267 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_INTERNAL_FORMAT;
        var v3268 : int/*GLenum*/ = o.RENDERBUFFER_INTERNAL_FORMAT;
        var v3269 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_RED_SIZE;
        var v3270 : int/*GLenum*/ = o.RENDERBUFFER_RED_SIZE;
        var v3271 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_GREEN_SIZE;
        var v3272 : int/*GLenum*/ = o.RENDERBUFFER_GREEN_SIZE;
        var v3273 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_BLUE_SIZE;
        var v3274 : int/*GLenum*/ = o.RENDERBUFFER_BLUE_SIZE;
        var v3275 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_ALPHA_SIZE;
        var v3276 : int/*GLenum*/ = o.RENDERBUFFER_ALPHA_SIZE;
        var v3277 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_DEPTH_SIZE;
        var v3278 : int/*GLenum*/ = o.RENDERBUFFER_DEPTH_SIZE;
        var v3279 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_STENCIL_SIZE;
        var v3280 : int/*GLenum*/ = o.RENDERBUFFER_STENCIL_SIZE;
        var v3281 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
        var v3282 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
        var v3283 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
        var v3284 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
        var v3285 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
        var v3286 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
        var v3287 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
        var v3288 : int/*GLenum*/ = o.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
        var v3289 : int/*GLenum*/ = WebGLRenderingContext.COLOR_ATTACHMENT0;
        var v3290 : int/*GLenum*/ = o.COLOR_ATTACHMENT0;
        var v3291 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_ATTACHMENT;
        var v3292 : int/*GLenum*/ = o.DEPTH_ATTACHMENT;
        var v3293 : int/*GLenum*/ = WebGLRenderingContext.STENCIL_ATTACHMENT;
        var v3294 : int/*GLenum*/ = o.STENCIL_ATTACHMENT;
        var v3295 : int/*GLenum*/ = WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT;
        var v3296 : int/*GLenum*/ = o.DEPTH_STENCIL_ATTACHMENT;
        var v3297 : int/*GLenum*/ = WebGLRenderingContext.NONE;
        var v3298 : int/*GLenum*/ = o.NONE;
        var v3299 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_COMPLETE;
        var v3300 : int/*GLenum*/ = o.FRAMEBUFFER_COMPLETE;
        var v3301 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
        var v3302 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
        var v3303 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
        var v3304 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
        var v3305 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
        var v3306 : int/*GLenum*/ = o.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
        var v3307 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_UNSUPPORTED;
        var v3308 : int/*GLenum*/ = o.FRAMEBUFFER_UNSUPPORTED;
        var v3309 : int/*GLenum*/ = WebGLRenderingContext.FRAMEBUFFER_BINDING;
        var v3310 : int/*GLenum*/ = o.FRAMEBUFFER_BINDING;
        var v3311 : int/*GLenum*/ = WebGLRenderingContext.RENDERBUFFER_BINDING;
        var v3312 : int/*GLenum*/ = o.RENDERBUFFER_BINDING;
        var v3313 : int/*GLenum*/ = WebGLRenderingContext.MAX_RENDERBUFFER_SIZE;
        var v3314 : int/*GLenum*/ = o.MAX_RENDERBUFFER_SIZE;
        var v3315 : int/*GLenum*/ = WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION;
        var v3316 : int/*GLenum*/ = o.INVALID_FRAMEBUFFER_OPERATION;
        var v3317 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL;
        var v3318 : int/*GLenum*/ = o.UNPACK_FLIP_Y_WEBGL;
        var v3319 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        var v3320 : int/*GLenum*/ = o.UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        var v3321 : int/*GLenum*/ = WebGLRenderingContext.CONTEXT_LOST_WEBGL;
        var v3322 : int/*GLenum*/ = o.CONTEXT_LOST_WEBGL;
        var v3323 : int/*GLenum*/ = WebGLRenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL;
        var v3324 : int/*GLenum*/ = o.UNPACK_COLORSPACE_CONVERSION_WEBGL;
        var v3325 : int/*GLenum*/ = WebGLRenderingContext.BROWSER_DEFAULT_WEBGL;
        var v3326 : int/*GLenum*/ = o.BROWSER_DEFAULT_WEBGL;
        var v3327 : HTMLCanvasElement = o.canvas;
        var v3328 : int/*GLsizei*/ = o.drawingBufferWidth;
        var v3329 : int/*GLsizei*/ = o.drawingBufferHeight;
        var f3330 : WebGLContextAttributes = o.getContextAttributes();
        var f3331 : boolean = o.isContextLost();
        var f3332 : string[]/*sequence<DOMString>?*/ = o.getSupportedExtensions();
        var f3333 : Object/*object?*/ = o.getExtension(X.getstring());
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
        var f3334 : int/*GLenum*/ = o.checkFramebufferStatus(X.getint());
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
        var f3335 : WebGLBuffer = o.createBuffer();
        var f3336 : WebGLFramebuffer = o.createFramebuffer();
        var f3337 : WebGLProgram = o.createProgram();
        var f3338 : WebGLRenderbuffer = o.createRenderbuffer();
        var f3339 : WebGLShader = o.createShader(X.getint());
        var f3340 : WebGLTexture = o.createTexture();
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
        var f3341 : WebGLActiveInfo = o.getActiveAttrib(X.getWebGLProgram(), X.getint());
        var f3342 : WebGLActiveInfo = o.getActiveUniform(X.getWebGLProgram(), X.getint());
        var f3343 : WebGLShader[] = o.getAttachedShaders(X.getWebGLProgram());
        var f3344 : int/*GLint*/ = o.getAttribLocation(X.getWebGLProgram(), X.getstring());
        var f3345 : variant/*any*/ = o.getBufferParameter(X.getint(), X.getint());
        var f3346 : variant/*any*/ = o.getParameter(X.getint());
        var f3347 : int/*GLenum*/ = o.getError();
        var f3348 : variant/*any*/ = o.getFramebufferAttachmentParameter(X.getint(), X.getint(), X.getint());
        var f3349 : variant/*any*/ = o.getProgramParameter(X.getWebGLProgram(), X.getint());
        var f3350 : string/*DOMString?*/ = o.getProgramInfoLog(X.getWebGLProgram());
        var f3351 : variant/*any*/ = o.getRenderbufferParameter(X.getint(), X.getint());
        var f3352 : variant/*any*/ = o.getShaderParameter(X.getWebGLShader(), X.getint());
        var f3353 : WebGLShaderPrecisionFormat = o.getShaderPrecisionFormat(X.getint(), X.getint());
        var f3354 : string/*DOMString?*/ = o.getShaderInfoLog(X.getWebGLShader());
        var f3355 : string/*DOMString?*/ = o.getShaderSource(X.getWebGLShader());
        var f3356 : variant/*any*/ = o.getTexParameter(X.getint(), X.getint());
        var f3357 : variant/*any*/ = o.getUniform(X.getWebGLProgram(), X.getWebGLUniformLocation());
        var f3358 : WebGLUniformLocation = o.getUniformLocation(X.getWebGLProgram(), X.getstring());
        var f3359 : variant/*any*/ = o.getVertexAttrib(X.getint(), X.getint());
        var f3360 : number/*GLsizeiptr*/ = o.getVertexAttribOffset(X.getint(), X.getint());
        o.hint(X.getint(), X.getint());
        var f3361 : boolean/*GLboolean*/ = o.isBuffer(X.getWebGLBuffer());
        var f3362 : boolean/*GLboolean*/ = o.isEnabled(X.getint());
        var f3363 : boolean/*GLboolean*/ = o.isFramebuffer(X.getWebGLFramebuffer());
        var f3364 : boolean/*GLboolean*/ = o.isProgram(X.getWebGLProgram());
        var f3365 : boolean/*GLboolean*/ = o.isRenderbuffer(X.getWebGLRenderbuffer());
        var f3366 : boolean/*GLboolean*/ = o.isShader(X.getWebGLShader());
        var f3367 : boolean/*GLboolean*/ = o.isTexture(X.getWebGLTexture());
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


    function compile_WebGLContextEvent(o : WebGLContextEvent) : void {
        var v3368 : string/*DOMString*/ = o.statusMessage;
    } // WebGLContextEvent


    function compile_WebGLContextEventInit(o : WebGLContextEventInit) : void {
        var v3369 : string/*DOMString*/ = o.statusMessage;
    } // WebGLContextEventInit


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
    static function getMayBeUndefined__int_() : MayBeUndefined.<int/*unsigned long*/>;
    static function getMayBeUndefined__number_() : MayBeUndefined.<number/*double*/>;
    static function getMayBeUndefined__string_() : MayBeUndefined.<string/*DOMString*/>;
    static function getMediaController() : MediaController;
    static function getMediaError() : MediaError;
    static function getMediaList() : MediaList;
    static function getMediaQueryList() : MediaQueryList;
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
    static function getXMLDocument() : XMLDocument;
    static function getXMLHttpRequestUpload() : XMLHttpRequestUpload;
    static function getboolean() : boolean/*GLboolean*/;
    static function getfunction__Event__void() : function(:Event):void/*Function?*/;
    static function getfunction__File__void() : function(:File):void/*FileCallback?*/;
    static function getfunction__MediaQueryList__void() : function(:MediaQueryList):void/*MediaQueryListListener*/;
    static function getfunction___void() : function():void/*TimerHandler*/;
    static function getint() : int/*GLsizei*/;
    static function getint__() : int[]/*sequence<long>*/;
    static function getnumber() : number/*GLintptr*/;
    static function getnumber__() : number[]/*sequence<float>*/;
    static function getstring() : string/*DOMString*/;
    static function getstring__() : string[]/*sequence<DOMString>?*/;
    static function getvariant() : variant/*any*/;
}

