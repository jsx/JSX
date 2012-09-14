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

/*

class CompleteCandidate {
	var word : string;
	var partialWord : string;

	var doc : Nullable.<string>;

	// type of the symobl: "function():void"
	// available for variables or functions
	var type : Nullable.<string>;

	var returnType : Nullable.<string>;   // function specific
	var args       : Nullable.<Symbol[]>; // function specific

	// where the symbol is defined
	var definedClass       : Nullable.<string>;
	var definedFilename    : Nullable.<string>;
	var definedLineNumber  : Nullable.<int>;
}

example:

{
	"word" : "stringify",
	"partialWord" : "ringify",

	"doc" : "serialize a value or object as a JSON string",

	"type" : "function (value : variant) : string",

	"returnType" : "string",
	"args" : [ { "name" : "value", "type" : "variant" } ],

	"definedClass" : "JSON",
	"definedFilename" : "lib/built-in/jsx",
	"definedLineNumber" : 903
}
 */

var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./expression"));
eval(Class.$import("./util"));

var CompletionRequest = exports.CompletionRequest = Class.extend({

	constructor: function (lineNumber, columnOffset) {
		this._lineNumber = lineNumber;
		this._columnOffest = columnOffset;
		this._candidates = [];
	},

	getLineNumber: function () {
		return this._lineNumber;
	},

	getColumnOffset: function () {
		return this._columnOffest;
	},

	isInRange: function (lineNumber, columnOffset, length) {
		if (lineNumber != this._lineNumber)
			return -1;
		if (columnOffset <= this._columnOffest && this._columnOffest <= columnOffset + length) {
			return this._columnOffest - columnOffset;
		}
		return -1;
	},

	pushCandidates: function (candidates) {
		this._candidates.push(candidates);
	},

	getCandidates: function () {
		var seen = {}; // for unique
		var results = [];
		// fetch the list
		this._candidates.forEach(function (candidates) {
			var rawCandidates = [];
			candidates.getCandidates(rawCandidates);
			var prefix = candidates.getPrefix();
			rawCandidates.forEach(function (s) {
				if (prefix == "" && s.word.substring(0, 2) == "__" && s.word != "__noconvert__" && s.word != "undefined") {
					// skip hidden keywords
				} else if (s.word.substring(0, prefix.length) == prefix) {
					var left = s.word.substring(prefix.length);
					if (left.length != 0 && ! seen.hasOwnProperty(left)) {
						seen[left] = true;

						if (s.word !== left) {
							s.partialWord = left;
						}
						results.push(s);
					}
				}
			}.bind(this));
		}.bind(this));

		return results;
	}

});

var CompletionCandidates = exports.CompletionCandidates = Class.extend({

	constructor: function () {
		this._prefix = null;
	},

	getCandidates: null, // function (CompletionCandidate[]) : void

	getPrefix: function () {
		return this._prefix;
	},

	setPrefix: function (prefix) {
		this._prefix = prefix;
		return this;
	},

	$makeClassCandidate: function (classDef) {
		var data = {
			word: classDef.className(),

			definedFilename:   classDef.getToken().getFilename(),
			definedLineNumber: classDef.getToken().getLineNumber(),
		};
		if ((classDef.flags() & ClassDefinition.IS_INTERFACE) != 0) {
			data.kind = "interface";
		} else if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
			data.kind = "mixin";
		}
		else {
			data.kind = "class";
		}

		var docComment = classDef.getDocComment();
		if (docComment) {
			data.doc = docComment.getDescription();
		}
		return data;
	},

	$_addClasses: function (candidates, parser, autoCompleteMatchCb) {
		parser.getClassDefs().forEach(function (classDef) {
			if (classDef instanceof InstantiatedClassDefinition) {
				// skip
			} else {
				if (autoCompleteMatchCb == null || autoCompleteMatchCb(classDef)) {
					candidates.push(CompletionCandidates.makeClassCandidate(classDef));
				}
			}
		});
		parser.getTemplateClassDefs().forEach(function (classDef) {
			if (autoCompleteMatchCb == null || autoCompleteMatchCb(classDef)) {
				candidates.push(CompletionCandidates.makeClassCandidate(classDef));
			}
		});
	},

	$_addImportedClasses: function (candidates, imprt, autoCompleteMatchCb) {
		var classNames = imprt.getClassNames();
		if (classNames != null) {
			classNames.forEach(function (className) {
				// FIXME can we refer to the classdefs of the classnames here?
				candidates.push({
					word: className,
					kind: "class",
				});
			});
		} else {
			imprt.getSources().forEach(function (parser) {
				CompletionCandidates._addClasses(candidates, parser, autoCompleteMatchCb);
			});
		}
	}

});

var KeywordCompletionCandidate = exports.KeywordCompletionCandidate = CompletionCandidates.extend({

	constructor: function (expected) {
		CompletionCandidates.prototype.constructor.call(this);
		this._expected = expected;
	},

	getCandidates: function (candidates) {
		candidates.push({
			word: this._expected,
			kind: 'keyword'
		});
	}

});

var CompletionCandidatesOfTopLevel = exports.CompletionCandidatesOfTopLevel = CompletionCandidates.extend({

	constructor: function (parser, autoCompleteMatchCb) {
		CompletionCandidates.prototype.constructor.call(this);
		this._parser = parser;
		this._autoCompleteMatchCb = autoCompleteMatchCb;
	},

	getCandidates: function (candidates) {
		CompletionCandidates._addClasses(candidates, this._parser, this._autoCompleteMatchCb);
		for (var i = 0; i < this._parser._imports.length; ++i) {
			var imprt = this._parser._imports[i];
			var alias = imprt.getAlias();
			if (alias != null) {
				candidates.push({
					word: alias,
					kind: 'alias'
				});
			} else {
				CompletionCandidates._addImportedClasses(candidates, imprt, this._autoCompleteMatchCb);
			}
		}
	}

});

var _CompletionCandidatesWithLocal = exports._CompletionCandidatesWithLocal = CompletionCandidatesOfTopLevel.extend({

	constructor: function (parser) {
		CompletionCandidatesOfTopLevel.prototype.constructor.call(this, parser, null);
		this._locals = [];
		parser._forEachScope(function (locals, args) {
			this._locals = this._locals.concat(locals, args);
			return true;
		}.bind(this));
	},

	getCandidates: function (candidates) {
		this._locals.forEach(function (local) {
			candidates.push({
				word: local.getName().getValue(),

				type: local.toString(),
				kind: 'variable',

				definedFilename:   local.getName().getFilename(),
				definedLineNumber: local.getName().getLineNumber()
			});
		});
		CompletionCandidatesOfTopLevel.prototype.getCandidates.call(this, candidates);
	}

});

var _CompletionCandidatesOfNamespace = exports._CompletionCandidatesOfNamespace = CompletionCandidates.extend({

	constructor: function (imprt, autoCompleteMatchCb) {
		CompletionCandidates.prototype.constructor.call(this);
		this._import = imprt;
		this._autoCompleteMatchCb = autoCompleteMatchCb;
	},

	getCandidates: function (candidates) {
		CompletionCandidates._addImportedClasses(this._import, this._autoCompleteMatchCb);
	}

});

var _CompletionCandidatesOfProperty = exports._CompletionCandidatesOfProperty = CompletionCandidates.extend({

	constructor: function (expr) {
		CompletionCandidates.prototype.constructor.call(this);
		this._expr = expr;
	},

	getCandidates: function (candidates) {
		var type = this._expr.getType();
		if (type == null)
			return;
		type = type.resolveIfNullable();
		if (type.equals(Type.voidType)
			|| type.equals(Type.nullType)
			|| type.equals(Type.variantType))
			return;
		// type with classdef
		var classDef = type.getClassDef();
		if (classDef == null)
			return;
		var isStatic = this._expr instanceof ClassExpression;
		classDef.forEachMember(function (member) {
			if (((member.flags() & ClassDefinition.IS_STATIC) != 0) == isStatic) {
				if (! isStatic && member.name() == "constructor") {
					// skip
				} else {
					var kind = isStatic ? "static member" : "member";
					kind += (member instanceof MemberFunctionDefinition) ? " function" : " variable";
					var data = {
						word: member.name(),
						type: member.getType().toString(),
						kind: kind,

						definedClass:      member.getClassDef().className(),
						definedFilename:   member.getToken().getFilename(),
						definedLineNumber: member.getToken().getLineNumber()
					};
					var docComment = member.getDocComment();
					if (docComment) {
						data.doc = docComment.getDescription();
					}

					if (member instanceof MemberFunctionDefinition) {
						data.returnType = member.getReturnType().toString();
						data.args = member.getArguments().map(function (arg) {
							return {
								name: arg.getName().getValue(),
								type: arg.getType().toString()
							};
						});
					}

					candidates.push(data);
				}
			}
			return true;
		});
	}

});

// vim: set noexpandtab:
