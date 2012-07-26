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

var Class = require("./Class");
eval(Class.$import("./classdef"));

var DocCommentNode = exports.DocCommentNode = Class.extend({

	constructor: function () {
		this._description = "";
	},

	getDescription: function () {
		return this._description;
	},

	appendDescription: function (s) {
		// strip surrounding whitespace
		s = s.replace(/^[ \t]*(.*)[ \t]*$/, function (_unused, m1) { return m1; });
		// append
		if (s != "") {
			if (this._description != "") {
				this._description += " ";
			}
			this._description += s;
		}
	}

});

var DocCommentParameter = exports.DocCommentParameter = DocCommentNode.extend({

	constructor: function (paramName) {
		DocCommentNode.prototype.constructor.call(this);
		this._paramName = paramName;
	},

	getParamName: function () {
		return this._paramName;
	}

});

var DocCommentTag = exports.DocCommentTag = DocCommentNode.extend({

	constructor: function (tagName) {
		DocCommentNode.prototype.constructor.call(this);
		this._tagName = tagName;
	},

	getTagName: function () {
		return this._tagName;
	}

});

var DocComment = exports.DocComment = DocCommentNode.extend({

	constructor: function () {
		DocCommentNode.prototype.constructor.call(this);
		this._params = [];
		this._tags = [];
	},

	getParams: function () {
		return this._params;
	},

	getTags: function () {
		return this._tags;
	},

	getTagByName: function (tagName) {
		for (var i = 0; i < this._tags.length; ++i) {
			if (this._tags[i].getTagName() == tagName) {
				return this._tags[i];
			}
		}
		return null;
	}

});

var DocumentGenerator = exports.DocumentGenerator = Class.extend({

	constructor: function (compiler, getOutputPath /* function (sourcePath) */) {
		this._compiler = compiler;
		this._getOutputPath = getOutputPath;
	},

	generateDoc: function () {
		this._compiler.getParsers().forEach(function (parser) {
			var outputFile = this._getOutputPath(parser.getPath());
			if (outputFile != null) {
				var html = this._generateDocOfFile(parser);
				this._compiler.getPlatform().save(this._getOutputPath(parser.getPath()), html);
			}
			return true;
		}.bind(this));
	},

	_generateHeader: function (parser) {
		var _ = "";
		return _;
	},

	_generateFooter: function (parser) {
		var _ = "";
		return _;
	},

	_generateDocOfFile: function (parser) {
		var _ = "";

?<?= this._generateHeader(parser) ?>
?<h2><?= this._escape(parser.getPath()) ?></h2>
?<div class="classes">

		parser.getClassDefs().forEach(function (classDef) {
			if (! (classDef instanceof InstantiatedClassDefinition)) {

				var typeName = "class";
				if ((classDef.flags() & ClassDefinition.IS_INTERFACE) != 0) {
					typeName = "interface";
				} else if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
					typeName = "mixin";
				}
?<div class="class">
?<h3><?= this._flagsToHTML(classDef.flags()) + " " + this._escape(typeName + " " + classDef.className()) ?></h3>
?<?= this._descriptionToHTML(classDef.getDocComment()) ?>
?<div class="member-section properties">
?<h3>Properties</h3>

				classDef.forEachMemberVariable(function (varDef) {
					if (! this._isPrivate(varDef)) {
?<div class="property">
?<h4 class="definition">
?<?= this._flagsToHTML(varDef.flags()) ?> var <?= varDef.name() ?> : <?= this._typeToHTML(varDef.getType()) ?>
?</h4>
?<?= this._descriptionToHTML(varDef.getDocComment()) ?>
?</div>
					}
					return true;
				}.bind(this));

?</div>
?<div class="member-section constructors">
?<h3>Constructor</h3>

				classDef.forEachMemberFunction(function (funcDef) {
					if (this._isConstructor(funcDef)) {
?<?= this._generateDocOfFunction(funcDef) ?>
					}
					return true;
				}.bind(this));

?</div>
?<div class="member-section functions">
?<h3>Functions</h3>

				classDef.forEachMemberFunction(function (funcDef) {
					if (! (this._isConstructor(funcDef) || this._isPrivate(funcDef))) {
?<?= this._generateDocOfFunction(funcDef) ?>
					}
					return true;
				}.bind(this));

?</div>
?</div>

			}
		}.bind(this));

?</div>
?<?= this._generateFooter(parser) ?>

		return _;
	},

	_generateDocOfFunction: function (funcDef) {
		var _ = "";
		var funcName = this._isConstructor(funcDef) ? "new " + funcDef.getClassDef().className() : this._flagsToHTML(funcDef) + " function " + funcDef.name();
		var args = funcDef.getArguments();
		var argsHTML = args.map(function (arg) {
			return this._escape(arg.getName().getValue()) + " : " + this._typeToHTML(arg.getType());
		}.bind(this)).join(", ");

?<div class="function">
?<h4>
?<?= this._escape(funcName) ?>(<?= argsHTML ?>)
		if (! this._isConstructor(funcDef)) {
? : <?= this._typeToHTML(funcDef.getReturnType()) ?>
		}
?</h4>
?<?= this._descriptionToHTML(funcDef.getDocComment()) ?>
		if (args.length != 0) {
?<table class="arguments">
?<caption>Arguments</caption>
?<tr><th>Name</th><th>Type</th><th>Description</th></tr>
			args.forEach(function (arg) {
				var argName = arg.getName().getValue();
?<tr>
?<td><?= this._escape(argName) ?></td>
?<td><?= this._typeToHTML(arg.getType()) ?></td>
?<td><?= this._argumentDescriptionToHTML(argName, funcDef.getDocComment()) ?></td>
?</tr>
			}.bind(this));
?</table>

		}

?</div>

		return _;
	},

	_descriptionToHTML: function (docComment) {
		var _ = "";
		var desc = docComment != null ? docComment.getDescription() : "";
		if (desc != "") {
?<div class="description">
?<?= desc ?>
?</div>
		}
		return _;
	},

	_argumentDescriptionToHTML: function (name, docComment) {
		var desc = "";
		if (docComment != null) {
			docComment.getParams().forEach(function (param) {
				if (param.getParamName() == name) {
					desc = param.getDescription();
				}
			});
		}
		return desc;
	},

	_typeToHTML: function (type) {
		// TODO create links for object types
		return this._escape(type.toString());
	},

	_flagsToHTML: function (flags) {
		var strs = [];
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
	},

	_escape: function (str) {
		return str.replace(/[<>&'"]/g, function (ch) {
			return {
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				"'": "&#39;",
				"\"": "&quot;"
			}[ch];
		});
	},

	_isConstructor: function (funcDef) {
		return funcDef.name() == "constructor"
			&& (funcDef.flags() & ClassDefinition.IS_STATIC) == 0;
	},

	_isPrivate: function (memberDef) {
		return memberDef.name().charAt(0) == "_";
	}

});
