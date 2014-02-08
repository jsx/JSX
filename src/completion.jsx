/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

import "./analysis.jsx";
import "./classdef.jsx";
import "./type.jsx";
import "./expression.jsx";
import "./util.jsx";
import "./parser.jsx";

/*

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


class CompletionRequest {

	var _lineNumber : number;
	var _columnOffest : number;
	var _candidates : CompletionCandidates[];

	function constructor (lineNumber : number, columnOffset : number) {
		this._lineNumber = lineNumber;
		this._columnOffest = columnOffset;
		this._candidates = new CompletionCandidates[];
	}

	function getLineNumber () : number {
		return this._lineNumber;
	}

	function getColumnOffset () : number {
		return this._columnOffest;
	}

	function isInRange (lineNumber : number, columnOffset : number, length : number) : number {
		if (lineNumber != this._lineNumber)
			return -1;
		if (columnOffset <= this._columnOffest && this._columnOffest <= columnOffset + length) {
			return this._columnOffest - columnOffset;
		}
		return -1;
	}

	function pushCandidates (candidates : CompletionCandidates) : void {
		this._candidates.push(candidates);
	}

	function getCandidates () : Map.<variant>[] {
		var seen = new Map.<boolean>; // for unique
		var results = new Map.<variant>[];
		// fetch the list
		this._candidates.forEach(function (candidates : CompletionCandidates) : void {
			var rawCandidates = new Map.<variant>[];
			candidates.getCandidates(rawCandidates);
			var prefix = candidates.getPrefix();
			rawCandidates.forEach(function (s) {
				var word = s["word"] as string;
				if (prefix == "" && word.substring(0, 2) == "__" && word != "__noconvert__" && word != "undefined") {
					// skip hidden keywords
				} else if (word.substring(0, prefix.length) == prefix) {
					var left = word.substring(prefix.length);
					if (left.length == 0) {
						return;
					}

					var identity = JSON.stringify([left, s["args"]] : variant[]);
					if (! seen.hasOwnProperty(identity)) {
						seen[identity] = true;

						if (word != left) {
							s["partialWord"] = left;
						}

						// "kind" is useful for debugging --completion itself,
						// but unlikely to be used by editors
						delete s["kind"];
						results.push(s);
					}
				}
			});
		});

		return results;
	}

}

abstract class CompletionCandidates {

	var _prefix : Nullable.<string>;

	function constructor () {
		this._prefix = null;
	}

	abstract function getCandidates (candidates : Map.<variant>[]) : void;

	function getPrefix () : string {
		return this._prefix;
	}

	function setPrefix (prefix : string) : CompletionCandidates {
		this._prefix = prefix;
		return this;
	}

	static function makeClassCandidate (classDef : ClassDefinition) : Map.<variant> {
		var data = new Map.<variant>;

		data["word"] = classDef.className();
		data["definedFilename"] = classDef.getToken().getFilename();
		data["definedLineNumber"] = classDef.getToken().getLineNumber();

		if ((classDef.flags() & ClassDefinition.IS_INTERFACE) != 0) {
			data["kind"] = "interface";
		} else if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
			data["kind"] = "mixin";
		}
		else {
			data["kind"] = "class";
		}

		var docComment = classDef.getDocComment();
		if (docComment) {
			data["doc"] = docComment.getDescription();
		}
		return data;
	}

	static function _addClasses (candidates : Map.<variant>[], parser : Parser, autoCompleteMatchCb : function(:ClassDefinition):boolean) : void {
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
	}

	static function _addImportedClasses (candidates : Map.<variant>[], imprt : Import, autoCompleteMatchCb : function(:ClassDefinition):boolean) : void {
		var classNames = imprt.getClassNames();
		if (classNames != null) {
			classNames.forEach(function (className) {
				var data = new Map.<variant>;
				data["word"] = className;
				data["kind"] = "class";
				// FIXME can we refer to the classdefs of the classnames here?
				candidates.push(data);
			});
		} else {
			imprt.getSources().forEach(function (parser) {
				CompletionCandidates._addClasses(candidates, parser, autoCompleteMatchCb);
			});
		}
	}

}

class KeywordCompletionCandidate extends CompletionCandidates {

	var _expected : string;

	function constructor (expected : string) {
		super();
		this._expected = expected;
	}

	override function getCandidates (candidates : Map.<variant>[]) : void {
		var data = new Map.<variant>;
		data["word"] = this._expected;
		data["kind"] = "keyword";
		candidates.push(data);
	}

}

class CompletionCandidatesOfTopLevel extends CompletionCandidates {

	var _parser : Parser;
	var _autoCompleteMatchCb : function(:ClassDefinition):boolean;

	function constructor (parser : Parser, autoCompleteMatchCb : function(:ClassDefinition):boolean) {
		super();
		this._parser = parser;
		this._autoCompleteMatchCb = autoCompleteMatchCb;
	}

	override function getCandidates (candidates : Map.<variant>[]) : void {
		CompletionCandidates._addClasses(candidates, this._parser, this._autoCompleteMatchCb);
		for (var i = 0; i < this._parser._imports.length; ++i) {
			var imprt = this._parser._imports[i];
			var alias = imprt.getAlias();
			if (alias != null) {
				var data = new Map.<variant>;
				data["word"] = alias;
				data["kind"] = "alias";
				candidates.push(data);
			} else {
				CompletionCandidates._addImportedClasses(candidates, imprt, this._autoCompleteMatchCb);
			}
		}
	}

}

class _CompletionCandidatesWithLocal extends CompletionCandidatesOfTopLevel {

	var _locals : LocalVariable[];

	function constructor (parser : Parser) {
		super(parser, null);
		this._locals = new LocalVariable[];
		parser._forEachScope(function (funcName, locals, args) {
			if (funcName != null)
				this._locals = this._locals.concat([ funcName ]);
			this._locals = this._locals.concat(locals);
			for (var i in args) {
				this._locals.push(args[i]);
			}
			return true;
		});
	}

	override function getCandidates (candidates : Map.<variant>[]) : void {
		this._locals.forEach(function (local) {
			var data = new Map.<variant>;

			data["word"] = local.getName().getValue();
			data["kind"] = 'variable';
			data["definedFilename"]   = local.getName().getFilename();
			data["definedLineNumber"] = local.getName().getLineNumber();

			var type = local.getType();
			// type may be null when type deduction fails
			if (type != null) {
				data["type"] = type.toString();
			}

			candidates.push(data);
		});
		super.getCandidates(candidates);
	}

}

class _CompletionCandidatesOfNamespace extends CompletionCandidates {

	var _import : Import;
	var _autoCompleteMatchCb : function(:ClassDefinition):boolean;

	function constructor (imprt : Import, autoCompleteMatchCb : function(:ClassDefinition):boolean) {
		super();
		this._import = imprt;
		this._autoCompleteMatchCb = autoCompleteMatchCb;
	}

	override function getCandidates (candidates : Map.<variant>[]) : void {
		CompletionCandidates._addImportedClasses(candidates, this._import, this._autoCompleteMatchCb);
	}

}

class _CompletionCandidatesOfProperty extends CompletionCandidates {

	var _expr : Expression;

	function constructor (expr : Expression) {
		super();
		this._expr = expr;
	}

	override function getCandidates (candidates : Map.<variant>[]) : void {
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
		var isStatic = this._expr.isClassSpecifier();
		classDef.forEachClassToBase(function (c) {
			c.forEachMember(function (member) {
				if (((member.flags() & ClassDefinition.IS_STATIC) != 0) == isStatic) {
					if (! isStatic && member.name() == "constructor") {
						return true;
					}

					candidates.push(_CompletionCandidatesOfProperty._makeMemberCandidate(member));
				}
				return true;
			});
			return true;
		});
	}

	static function _makeMemberCandidate (member : MemberDefinition) : Map.<variant> {
		var kind = (member.flags() & ClassDefinition.IS_STATIC
			? "static member"
			: "member");
		kind += (member instanceof MemberFunctionDefinition
			? " function"
			: " variable");

		var data = new Map.<variant>;
		data["word"] = member.name();
		data["type"] = member.getType().toString();
		data["kind"] = kind;

		data["definedClass"]      = member.getClassDef().className();
		data["definedFilename"]   = member.getToken().getFilename();
		data["definedLineNumber"] = member.getToken().getLineNumber();

		var docComment = member.getDocComment();
		if (docComment) {
			data["doc"] = docComment.getDescription();
		}

		if (member instanceof MemberFunctionDefinition) {
			var mf = member as MemberFunctionDefinition;
			data["returnType"] = mf.getReturnType().toString();
			data["args"] = mf.getArguments().map.<Map.<string>>(function (arg) {
				var pair = new Map.<string>;
				pair["name"] = arg.getName().getValue();
				pair["type"] = arg.getType().toString();
				return pair;
			});
		}
		return data;
	}

}

// vim: set noexpandtab:
