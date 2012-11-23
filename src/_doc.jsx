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

import "./classdef.jsx";
import "./type.jsx";
import "./parser.jsx";
import "./compiler.jsx";
import "./util.jsx";

class DocCommentNode {

	var _description : string;

	function constructor () {
		this._description = "";
	}

	function getDescription () : string {
		return this._description;
	}

	function appendDescription (s : string) : void {
		s = s.trim();
		// append
		if (s != "") {
			if (this._description != "") {
				this._description += " ";
			}
			this._description += s;
		}
	}

}

class DocCommentParameter extends DocCommentNode {

	var _token : Token;

	function constructor (token : Token) {
		super();
		this._token = token;
	}

	function getToken () : Token {
		return this._token;
	}

	function getParamName () : string {
		return this._token.getValue();
	}

}

class DocCommentTag extends DocCommentNode {

	var _tagName : string;

	function constructor (tagName : string) {
		super();
		this._tagName = tagName;
	}

	function getTagName () : string {
		return this._tagName;
	}

}

class DocComment extends DocCommentNode {

	var _params : DocCommentParameter[];
	var _tags : DocCommentTag[];

	function constructor () {
		super();
		this._params = new DocCommentParameter[];
		this._tags = new DocCommentTag[];
	}

	function getParams () : DocCommentParameter[] {
		return this._params;
	}

	function getTags () : DocCommentTag[] {
		return this._tags;
	}

	function getTagByName (tagName : string) : DocCommentTag {
		for (var i = 0; i < this._tags.length; ++i) {
			if (this._tags[i].getTagName() == tagName) {
				return this._tags[i];
			}
		}
		return null;
	}

}

class DocumentGenerator {

	var _compiler : Compiler;
	var _outputPath : Nullable.<string>;
	var _pathFilter : function(:string):boolean;
	var _templatePath : Nullable.<string>;
	var _classDefToHTMLCache : Tuple.<ClassDefinition,string>[];

	function constructor (compiler : Compiler) {
		this._compiler = compiler;
		this._outputPath = null;
		this._pathFilter = null;
		this._templatePath = null;
		this._classDefToHTMLCache = [] : Tuple.<ClassDefinition,string>[];
	}

	function setOutputPath (outputPath : string) : DocumentGenerator {
		this._outputPath = outputPath;
		return this;
	}

	function setPathFilter (pathFilter : function(:string):boolean) : DocumentGenerator {
		this._pathFilter = pathFilter;
		return this;
	}

	function setTemplatePath (path : string) : DocumentGenerator {
		this._templatePath = path;
		return this;
	}

	function buildDoc () : void {
		var platform = this._compiler.getPlatform();
		// CSS file is copied regardless of the template
		platform.mkpath(this._outputPath);
		platform.save(
			this._outputPath + "/style.css",
			platform.load(platform.getRoot() + "/src/doc/style.css"));
		// output each file
		this._compiler.getParsers().forEach(function (parser) {
			if (this._pathFilter(parser.getPath())) {
				var outputFile = this._outputPath + "/" + parser.getPath() + ".html";
				platform.mkpath(outputFile.replace(/\/[^\/]+$/, ""));
				var html = this._buildDocOfFile(parser);
				platform.save(outputFile, html);
			}
		});
	}

	function _buildDocOfFile (parser : Parser) : string {
		return this._compiler.getPlatform().load(this._templatePath).replace(
			/<%JSX:(.*?)%>/g,
			function (matched) {
				var key = matched.substring(6, matched.length-2);
				switch (key) {
				case "BASE_HREF":
					// convert each component of dirname to ..
					return parser.getPath().replace(/\/[^\/]+$/, "").replace(/[^\/]+/g, "..");
				case "TITLE":
					return this._escape(parser.getPath());
				case "BODY":
					return this._buildBodyOfFile(parser);
				case "FOOTER":
					return this._buildFooterOfFile(parser);
				default:
					throw new Error("unknown key:" + key + " in file: " + this._templatePath);
				}
			});
	}

	function _buildBodyOfFile (parser : Parser) : string {
		var _ = "";

?<div class="jsxdoc">
?<div class="file">
?<h1><?= this._escape(parser.getPath()) ?></h1>
		if (parser.getDocComment() != null) {
?<div class="description"><?= parser.getDocComment().getDescription() ?></div>
		}
?</div>
?<?= this._buildListOfClasses(parser) ?>
?</div>

		return _;
	}

	function _buildFooterOfFile (parser : Parser) : string {
		var _ = "";
		var docComment = parser.getDocComment();
		if (docComment) {
			var version = docComment.getTagByName("version");
			if (version) {
?<p>This is <strong><?= this._escape(parser.getPath()) ?> version <?= this._escape(version.getDescription()) ?></strong>.</p>
			}
			var author = docComment.getTagByName("author");
			if (author) {
				var d = author.getDescription();
				var endWithDot = (d.charAt(d.length - 1) == ".");
?<p>Copyright &copy; <?= this._escape(d) + (endWithDot ? "" : ".") ?></p>
			}
		}
?<p>This document was automatically generated by <a href="http://jsx.github.com/">JSX</a><br />
?at <?= this._escape( (new Date).toString() ) ?>.
		return _;
	}

	function _buildListOfClasses (parser : Parser) : string {
		var _ = "";

?<div class="classes">

		parser.getTemplateClassDefs().forEach(function (classDef) {
?<?= this._buildDocOfClass(parser, classDef) ?>
		});

		parser.getClassDefs().forEach(function (classDef) {
			if (! (classDef instanceof InstantiatedClassDefinition)) {
?<?= this._buildDocOfClass(parser, classDef) ?>
			}
		});

?</div>

		return _;
	}

	function _buildDocOfClass (parser : Parser, classDef : ClassDefinition) : string {
		var typeName = "class";
		if ((classDef.flags() & ClassDefinition.IS_INTERFACE) != 0) {
			typeName = "interface";
		} else if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
			typeName = "mixin";
		}
		var typeArgs = classDef instanceof TemplateClassDefinition ? (classDef as TemplateClassDefinition).getTypeArguments() : new Token[];

		var _ = "";

?<div class="class" id="class-<?= this._escape(classDef.className()) ?>">
?<h2><?= this._flagsToHTML(classDef.flags()) + " " + this._escape(typeName + " " + classDef.className()) + this._formalTypeArgsToHTML(typeArgs) ?></h2>
?<?= this._descriptionToHTML(classDef.getDocComment()) ?>

		if (this._hasPublicProperties(classDef)) {
			classDef.forEachMemberVariable(function (varDef) {
				if (! this._isPrivate(varDef)) {
?<div class="member property">
?<h3>
?<?= this._flagsToHTML(varDef.flags()) ?> var <?= varDef.name() ?> : <?= this._typeToHTML(parser, varDef.getType()) ?>
?</h3>
?<?= this._descriptionToHTML(varDef.getDocComment()) ?>
?</div>
				}
				return true;
			});
		}

		classDef.forEachMemberFunction(function (funcDef) {
			if (! (funcDef instanceof InstantiatedMemberFunctionDefinition) && this._isConstructor(funcDef) && (funcDef.flags() & ClassDefinition.IS_DELETE) == 0) {
?<?= this._buildDocOfFunction(parser, funcDef) ?>
			}
			return true;
		});

		if (this._hasPublicFunctions(classDef)) {
			classDef.forEachMemberFunction(function (funcDef) {
				if (! (funcDef instanceof InstantiatedMemberFunctionDefinition || this._isConstructor(funcDef) || this._isPrivate(funcDef))) {
?<?= this._buildDocOfFunction(parser, funcDef) ?>
				}
				return true;
			});
		}

?</div>

		return _;
	}

	function _buildDocOfFunction (parser : Parser, funcDef : MemberFunctionDefinition) : string {
		var _ = "";
		var funcName = this._isConstructor(funcDef) ? "new " + funcDef.getClassDef().className() : this._flagsToHTML(funcDef.flags()) + " function " + funcDef.name();
		var args = funcDef.getArguments();
		var argsHTML = args.map.<string>(function (arg) {
			return this._escape(arg.getName().getValue()) + " : " + this._typeToHTML(parser, arg.getType());
		}).join(", ");

?<div class="member function">
?<h3>
?<?= this._escape(funcName) + this._formalTypeArgsToHTML(funcDef instanceof TemplateFunctionDefinition ? (funcDef as TemplateFunctionDefinition).getTypeArguments() : new Token[]) ?>(<?= argsHTML ?>)
		if (! this._isConstructor(funcDef)) {
? : <?= this._typeToHTML(parser, funcDef.getReturnType()) ?>
		}
?</h3>
?<?= this._descriptionToHTML(funcDef.getDocComment()) ?>
		if (this._argsHasDocComment(funcDef)) {
?<table class="arguments">
			args.forEach(function (arg) {
				var argName = arg.getName().getValue();
?<tr>
?<td class="param-name"><?= this._escape(argName) ?></td>
?<td class="param-desc"><?= this._argumentDescriptionToHTML(argName, funcDef.getDocComment()) ?></td>
?</tr>
			});
?</table>

		}

?</div>

		return _;
	}

	function _descriptionToHTML (docComment : DocComment) : string {
		var _ = "";
		var desc = docComment != null ? docComment.getDescription() : "";
		if (desc != "") {
?<div class="description">
?<?= desc ?>
?</div>
		}
		return _;
	}

	function _argumentDescriptionToHTML (name : string, docComment : DocComment) : string {
		return docComment != null ? this._getDescriptionOfNamedArgument(docComment, name): "";
	}

	function _formalTypeArgsToHTML (typeArgs : Token[]) : string {
		if (typeArgs.length == 0) {
			return "";
		}
		return ".&lt;"
			+ typeArgs.map.<string>(function (typeArg) { return this._escape(typeArg.getValue()); }).join(", ")
			+ "&gt;";
	}

	function _typeToHTML (parser : Parser, type : Type) : string {
		// TODO create links for object types
		if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef != null) {
				return this._classDefToHTML(parser, classDef);
			} else if (type instanceof ParsedObjectType && (type as ParsedObjectType).getTypeArguments().length != 0) {
				classDef = (type as ParsedObjectType).getQualifiedName().getTemplateClass(parser);
				if (classDef != null) {
					return this._classDefToHTML(parser, classDef)
						+ ".&lt;"
						+ (type as ParsedObjectType).getTypeArguments().map.<string>(function (type) { return this._typeToHTML(parser, type); }).join(", ")
						+ "&gt;";
				}
			}
		} else if (type instanceof FunctionType) {
			return "function "
				+ "("
				+ (type as ResolvedFunctionType).getArgumentTypes().map.<string>(function (type) {
					return ":" + this._typeToHTML(parser, type);
				}).join(", ")
				+ ") : " + this._typeToHTML(parser, (type as ResolvedFunctionType).getReturnType());
		} else if (type instanceof VariableLengthArgumentType) {
			return "..." + this._typeToHTML(parser, (type as VariableLengthArgumentType).getBaseType());
		}
		return this._escape(type.toString());
	}

	function _classDefToHTML (parser : Parser, classDef : ClassDefinition) : string {
		// instantiated classes should be handled separately
		if (classDef instanceof InstantiatedClassDefinition) {
			return this._classDefToHTML(parser, (classDef as InstantiatedClassDefinition).getTemplateClass())
				+ ".&lt;"
				+ (classDef as InstantiatedClassDefinition).getTypeArguments().map.<string>(function (type) { return this._typeToHTML(parser, type); }).join(", ")
				+ "&gt;";
		}
		// lokup the cache
		for (var cacheIndex = 0; cacheIndex < this._classDefToHTMLCache.length; ++cacheIndex) {
			if (this._classDefToHTMLCache[cacheIndex].first == classDef) {
				return this._classDefToHTMLCache[cacheIndex].second;
			}
		}
		// determine the parser to which the classDef belongs
		function determineParserOfClassDef () : Parser {
			var parsers = this._compiler.getParsers();
			for (var i = 0; i < parsers.length; ++i) {
				if (parsers[i].getClassDefs().indexOf(classDef) != -1
					|| parsers[i].getTemplateClassDefs().indexOf(classDef as TemplateClassDefinition) != -1) {
					return parsers[i];
				}
			}
			throw new Error("could not determine the parser to which the class belongs:" + classDef.className());
		};
		var parserOfClassDef = determineParserOfClassDef();
		// return text if we cannot linkify the class name
		if (! this._pathFilter(parserOfClassDef.getPath())) {
			return this._escape(classDef.className());
		}
		// linkify and return
		var _ = "";
?<a href="<?= this._escape(parserOfClassDef.getPath()) ?>.html#class-<?= this._escape(classDef.className()) ?>"><?= this._escape(classDef.className()) ?></a>
		_ = _.trim();
		this._classDefToHTMLCache.push(new Tuple.<ClassDefinition,string>(classDef, _));
		return _;
	}

	function _flagsToHTML (flags : number) : string {
		var strs = new string[];
		// does not expose internal properties
		if ((flags & ClassDefinition.IS_STATIC) != 0)
			strs.push("static");
		if ((flags & ClassDefinition.IS_CONST) != 0)
			strs.push("const");
		if ((flags & ClassDefinition.IS_ABSTRACT) != 0)
			strs.push("abstract");
		if ((flags & ClassDefinition.IS_FINAL) != 0)
			strs.push("final");
		if ((flags & ClassDefinition.IS_OVERRIDE) != 0)
			strs.push("override");
		if ((flags & ClassDefinition.IS_INLINE) != 0)
			strs.push("inline");
		return strs.join(" ");
	}

	function _escape (str : string) : string {
		return str.replace(/[<>&'"]/g, function (ch) {
			return {
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				"'": "&#39;",
				"\"": "&quot;"
			}[ch];
		});
	}

	function _hasPublicProperties (classDef : ClassDefinition) : boolean {
		return ! classDef.forEachMemberVariable(function (varDef) {
			if (! this._isPrivate(varDef)) {
				return false;
			}
			return true;
		});
	}

	function _hasPublicFunctions (classDef : ClassDefinition) : boolean {
		return ! classDef.forEachMemberFunction(function (funcDef) {
			if (funcDef instanceof InstantiatedMemberFunctionDefinition
				|| this._isConstructor(funcDef)
				|| this._isPrivate(funcDef)) {
				return true;
			}
			return false;
		});
	}

	function _argsHasDocComment (funcDef : MemberFunctionDefinition) : boolean {
		var docComment = funcDef.getDocComment();
		if (docComment == null) {
			return false;
		}
		var args = funcDef.getArguments();
		for (var argIndex = 0; argIndex < args.length; ++argIndex) {
			if (this._getDescriptionOfNamedArgument(docComment, args[argIndex].getName().getValue()) != "") {
				return true;
			}
		}
		return false;
	}

	function _getDescriptionOfNamedArgument (docComment : DocComment, argName : string) : string {
		var params = docComment.getParams();
		for (var paramIndex = 0; paramIndex < params.length; ++paramIndex) {
			if (params[paramIndex].getParamName() == argName) {
				return params[paramIndex].getDescription();
			}
		}
		return "";
	}

	function _isConstructor (funcDef : MemberFunctionDefinition) : boolean {
		return funcDef.name() == "constructor"
			&& (funcDef.flags() & ClassDefinition.IS_STATIC) == 0;
	}

	function _isPrivate (memberDef : MemberDefinition) : boolean {
		return memberDef.name().charAt(0) == "_";
	}

}
