(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("Class.js", function(module, exports, require, global){
"use strict";

var Class = module.exports = function () {
};

Class.extend = function (properties) {
	var ctor = properties.initialize;
	if (typeof ctor === "undefined")
		ctor = properties.initialize = function () {};
	function tmp() {};
	tmp.prototype = this.prototype;
	ctor.prototype = new tmp();
	ctor.extend = Class.extend;
	// assign properties
	for (var k in properties) {
		if (k.charAt(0) == '$') {
			ctor[k.substring(1)] = properties[k];
		} else {
			ctor.prototype[k] = properties[k];
		}
	}
	if (typeof ctor.initialize === "function") {
		ctor.initialize();
	}
	return ctor;
};

Class.prototype.initialize = function () {
};

Class.$import = function (name) {
	var module = require(name);
	var script = [];
	for (var i in module)
		if (module.hasOwnProperty(i) && i.match(/^[^_]/))
			script.push("var " + i + " = require(\"" + name + "\")." + i + ";\n");
	return script.join("");
};


});require.register("classdef.js", function(module, exports, require, global){
var Class = require("./Class");
var Type = require("./type");
eval(Class.$import("./util"));

"use strict";

var ClassDefinition = exports.ClassDefinition = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,

	$getClass: function (classDefs, name) {
		for (var i = 0; i < classDefs.length; ++i)
			if (name == classDefs[i].className().toString())
				return classDefs[i];
		return null;
	},

	initialize: function (className, flags, extendName, implementNames, members, objectTypesUsed) {
		this._className = className;
		this._flags = flags;
		this._extendName = extendName;
		this._extendClassDef = null;
		this._implementNames = implementNames;
		this._implementClassDefs = [];
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
	},

	serialize: function () {
		// FIXME implement in a way that is compatible with JSX
		return {
			"name"       : this._className.serialize(),
			"flags"      : this._flags,
			"extends"    : Util.serializeNullable(this._extendClassDef),
			"implements" : Util.serializeArray(this._implementClassDefs),
			"members"    : Util.serializeArray(this._members)
		};
	},

	className: function () {
		return this._className;
	},

	flags: function () {
		return this._flags;
	},

	extendName: function () {
		return this._extendName;
	},

	extendClassDef: function () {
		return tihs._extendClassDef;
	},

	implementNames: function () {
		return this._implementNames;
	},

	implementClassDefs: function () {
		return this._implementClassDefs;
	},

	members: function () {
		return this._members;
	},

	getMemberTypeByName: function (errors, classDefs, name) {
		// returns an array to support function overloading
		var types = [];
		this._getMemberTypesByName(errors, classDefs, types, name);
		switch (types.length) {
		case 0:
			return null;
		case 1:
			return types[0];
		default:
			throw new Error("return choice type");
		}
	},

	_getMemberTypesByName: function (errors, classDefs, types, name) {
		if (this._extendClassDef != null)
			this._extendClassDef._getMemberTypesByName(errors, classDefs, types, name);
		for (var i = 0; i < this._implementClassDefs.length; ++i)
			this._implementClassDefs[i]._getMemberTypesByName(errors, classDefs, types, name);
		for (var i = 0; i < this._members.length; ++i)
			if (name == this._members[i].name())
				ClassDefinition._addTypeToArrayIfNotExists(errors, classDefs, types, this._members[i]);
	},

	$_addTypeToArrayIfNotExists: function (errors, classDefs, types, member) {
		if (member instanceof MemberVariableDefinition) {
			var type = member.getType(errors, classDefs);
			// ignore member variables that failed in type deduction
			if (type != null)
				types.push(type);
			return;
		} else {
			// member function
			// skip if already in list (happens if the function is overridden)
			var newType = member.getType();
			for (var i = 0; i < types.length; ++i)
				if (newType.equalsIgnoringClassName(types[i]))
					return;
			types.push(newType);
		}
	},

	resolveTypes: function (errors, classDefs) {
		// resolve extends
		if (this._extendName != null) {
			var baseClassName = IdentifierToken.toString(this._extendName);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._extendName[0], "class '" + baseClassName + "' is not defined"));
			this._extendClassDef = baseClass;
		}
		// resolve implements
		for (var i = 0; i < this._implementNames.length; ++i) {
			var baseClassName = IdentifierToken.toString(this._implementNames[i]);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._implementNames[i][0], "interface '" + baseClassName + "' is not defined"));
			this._implementsClassDefs.push(baseClass);
		}
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveTypes(errors, classDefs);
	},

	analyze: function (errors, classDefs) {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			// analysis of member variables are delayed (and those that where never analyzed will be removed by dead code elimination)
			if (member instanceof MemberFunctionDefinition)
				member.analyze(errors, classDefs, this);
		}
	},
});

var MemberDefinition = exports.MemberDefinition = Class.extend({

	initialize: function (identifierToken, flags) {
		this._identifierToken = identifierToken;
		this._flags = flags;
	},

	name: function () {
		return this._identifierToken.identifier;
	},

	flags: function () {
		return this._flags;
	}

});

var MemberVariableDefinition = exports.MemberVariableDefinition = MemberDefinition.extend({

	$NOT_ANALYZED: 0,
	$IS_ANALYZING: 1,
	$ANALYZE_SUCEEDED: 2,
	$ANALYZE_FAILED: 3,

	initialize: function (identifierToken, flags, type, initialValue) {
		MemberDefinition.call(this, identifierToken, flags);
		this._type = type; // may be null
		this._initialValue = initialValue; // may be null
		this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
	},

	serialize: function () {
		return {
			"name"         : this.name(),
			"flags"        : this.flags(),
			"type"         : this._type().serialize(),
			"initialValue" : Util.serializeNullable(this._initialValue)
		};
	},

	getType: function (errors, classDefs) {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			try {
				this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
				if (this._type != null)
					if (! this._type.assertExistence(classDefs))
						return;
				if (this._initialValue != null) {
					if (! this._initialValue.analyze(errors, classDefs, null))
						return;
					var ivType = this._initialValue.getType();
					if (this._type == null) {
						this._type = ivType;
					} else if (! this._type.equals(ivType)) {
						errors.push(new CompileError(this._initialValue,
							"conflicting types for variable '" + this.name + "', expected '" + this._type.toString(), "' but got '" + ivType.toString()));
					}
				}
				this._analyzeState = MemberVariableDefinition.ANALYZE_SUCEEDED;
			} finally {
				if (this._analyzeState != MemberVariableDefinition.ANALYZE_SUCEEDED)
					this._analyzeState = MemberVariableDefinition.ANALYZE_FAILED;
			}
			break;
		case MemberVariableDefinition.IS_ANALYZING:
			errors.push(new CompileError(this._identifierToken,
				"please declare type of variable '" + this._identifierToken.identifier + "' (detected recursion while trying to reduce type)"));
			break;
		default:
			break;
		}
		return this._type;
	}

});

var MemberFunctionDefinition = exports.MemberFunctionDefinition = MemberDefinition.extend({

	initialize: function (identifierToken, flags, returnType, args, locals, statements) {
		MemberDefinition.call(this, identifierToken, flags);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
		this._classDef = null;
	},

	serialize: function () {
		return {
			"name"       : this.name(),
			"flags"      : this.flags(),
			"returnType" : this._returnType.serialize(),
			"args"       : Util.serializeArray(this._args),
			"locals"     : Util.serializeArray(this._locals),
			"statements" : Util.serializeArray(this._statements)
		};
	},

	analyze: function (errors, classDefs, classDef) {
		this._classDef = classDef;
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, this);
	},

	getClassDef: function () {
		return this._classDef;
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArguments: function () {
		return this._args;
	},

	getArgumentTypes: function () {
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i)
			argTypes[i] = this._args[i].getType();
		return argTypes;
	},

	// return list of local variables (omitting arguments)
	getLocals: function () {
		return this._locals;
	},

	getStatements: function () {
		return this._statements;
	},

	// return an argument or a local variable
	getLocal: function (name) {
		for (var i = 0; i < this._locals.length; ++i) {
			var local = this._locals[i];
			if (local.getName() == name)
				return local;
		}
		for (var i = 0; i < this._args.length; ++i) {
			var arg = this._args[i];
			if (arg.getName() == name)
				return arg;
		}
		return null;
	},

	getType: function () {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? new Type.StaticFunctionType(this._returnType, this.getArgumentTypes(), false)
			: new Type.MemberFunctionType(new ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false);
	}

});

var LocalVariable = exports.LocalVariable = Class.extend({

	initialize: function (name, type) {
		this._name = name;
		this._type = type;
	},

	serialize: function () {
		return [
			this._name,
			Util.serializeNullable(this._type)
		];
	},

	getName: function () {
		return this._name;
	},

	getType: function () {
		return this._type;
	},

	setType: function (type) {
		if (this._type != null)
			throw Error("type is already set");
		this._type = type;
	},

	toString: function () {
		return this._name + " : " + this._type;
	}
});

var ArgumentDeclaration = exports.ArgumentDeclaration = LocalVariable.extend({

	initialize: function (name, type) {
		LocalVariable.prototype.initialize.call(this, name, type);
	}

});

});require.register("compiler.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./lexer"));
eval(Class.$import("./parser"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./os"));

"use strict";

var Compiler = module.exports = Class.extend({

	initialize: function () {
		this._sourceFiles = []; // [ file, parsedOrNotParsed ] do not use hash, to always compile deep-first
		this._classDefs = [];
	},

	addSourceFile: function (file) {
		for (var i = 0; i < this._sourceFiles.length; ++i)
			if (this._sourceFiles[i][0] === file)
				return;
		this._sourceFiles.push([ file, false ]);
	},

	compile: function () {

		// parse all files
		for (var i = 0; i < this._sourceFiles.length; ++i) {
			if (! this._sourceFiles[i][1]) {
				if (! this._parseFile(this._sourceFiles[i][0]))
					return false;
				this._sourceFiles[i][1] = true;
			}
		}

		// semantic analysis
		if (! this._resolveTypes())
			return false;
		if (! this._analyze())
			return false;

		// TODO control flow analysis

		// TODO optimize

		if (! this._generateCode())
			return false;

		return true;
	},

    getOutput: function() {
        return this._output;
    },

	_parseFile: function (filename) {

		var errors = [];

		// read file
		var content = OS.readFile(filename);
		if (content == null) {
			errors.push("could not open the file");
		}

		// tokenize
		if (errors.length == 0) {
			var lexer = new Lexer(filename, content);
			var tokens = lexer.tokenize(errors);
		}

		// parse
		if (errors.length == 0) {
			var parser = new Parser(tokens, errors);
			parser.parse();
			if (errors.length == 0) {
				// get the imported files from parser and set to _sourceFiles
				this._classDefs = this._classDefs.concat(parser.getClassDefs());
			}
		}

		this._printErrors(errors);
		return errors.length == 0;
	},

	_resolveTypes: function () {
		var errors = [];
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].resolveTypes(errors, this._classDefs);
		this._printErrors(errors);
		return errors.length == 0;
	},

	_analyze: function () {
		var errors = [];
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].analyze(errors, this._classDefs);
		this._printErrors(errors);
		return errors.length == 0;
	},

	_generateCode: function () {
		var emitter = new JavaScriptEmitter();
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitClassDefinition(this._classDefs[i]);
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitStaticInitializationCode(this._classDefs[i]);
		this._output = emitter.getOutput();
		return true;
	},

	_printErrors: function (errors) {
		for (var i = 0; i < errors.length; ++i)
			OS.errprint(errors[i].toString());
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
	var compiler = new Compiler();
	for (var i = 2; i < process.argv.length; i++)
		compiler.addSourceFile(process.argv[i]);
	if (compiler.compile()) {
        console.log(compiler.getOutput());
        var util = require('util');
		var classes = [];
		for (var i = 0; i < compiler._classDefs.length; ++i)
			classes[i] = compiler._classDefs[i].serialize();
		console.log(util.inspect(classes, false, 100));
	}
}

});require.register("dump.js", function(module, exports, require, global){
"use strict;"
/*
# NAME

dump - Dump data structures

# SYNOPSIS

var dump = require('path/to/dump');

dump.p(data);               # outputs to console
foo.innerHTML = dump(data); # as string

*/

var dump;
try {
    dump = function() {
        var u = require('util');

        return function(data) {
            return u.inspect(data, false, 255);
        };
    }();
}
catch(e) {
    dump = function(data) {
        return JSON.stringify(data, null, 2);
    };
}

module.exports = dump;
dump.p = function(__va_args__) {
    Array.prototype.map.call(arguments, dump);
};


});require.register("emitter.js", function(module, exports, require, global){
var Class = require("./Class");

"use strict";

var Emitter = exports.Emitter = Class.extend({

	emitClassDefinition: null, // abstract function emitClassDefinition(:ClassDefinition):void

	emitStaticInitializationCode: null, // abstract function emitStaticInitializationCode(:ClassDefinition):void

	getOutput: null // abstract function getOutput() : String

});

});require.register("expression.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Expression = exports.Expression = Class.extend({

	analyze: null, // bool analyze(errors, classDefs, funcDef)

	getType: null, // string getType()

	getHolderType: function () {
		return null;
	},

	isAssignable: function (type) {
		return false;
	},

	assertTypeIsPrimitive: function (errors, token) {
		if (getType() instanceof PrimitiveType)
			return true;
		errors.push(new CompileError(token, "result of expression should be a primitive"));
		return false;
	}
			
});

var OperatorExpression = exports.OperatorExpression = Expression.extend({

	initialize: function (operatorToken) {
		this._operatorToken = operatorToken;
	},

	assertIsConvertibleTo: function (errors, expr, type) {
		var exprType = expr.getType();
		if (! exprType.isConvertibleTo(type)) {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' to type '" + exprType.toString()));
			return false;
		}
		return true;
	}

});

// primary expressions

var IdentifierExpression = exports.IdentifierExpression = Expression.extend({

	initialize: function (identifierToken) {
		this._identifierToken = identifierToken;
		this._local = null;
		this._classDefType = null;
	},

	serialize: function () {
		if (this._local != null)
			return [
				"IdentifierExpression",
				this._identifierToken.serialize(),
				"local",
				Util.serializeNullable(this._local)
			];
		else
			return [
				"IdentifierExpression",
				this._identifierToken.serialize(),
				"classDef"
			];
	},

	analyze: function (errors, classDefs, funcDef) {
		if ((this._local = funcDef.getLocal(this._identifierToken.identifier)) != null) {
			// ok
		} else {
			var classDef = ClassDefinition.getClass(classDefs, this._identifierToken.identifier);
			if (classDef == null) {
				errors.push(new CompileError(this._identifierToken, "local variable '" + this._identifierToken.identifier + "' is not declared"));
				return false;
			}
			this._classDefType = new ClassDefType(classDef);
		}
		return true;
	},

	getType: function () {
		if (this._local != null)
			return this._local.getType();
		else
			return this._classDefType;
	},

	isAssignable: function (type) {
		if (this._local != null) {
			if (this._local.getType() == null) {
				this._local.setType(type.asAssignableType());
				return true;
			} else if (! type.isConvertibleTo(this._local.getType())) {
				return false;
			}
		} else {
			return this._classDefType.isAssignable();
		}
		return true;
	}

});

var NumberLiteralExpression = exports.NumberLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"NumberLiteralExpression",
			this.token.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return true;
	},

	getType: function () {
		return Type.numberType;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"StringLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return true;
	},

	getType: function () {
		return Type.stringType;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
		this._funcDef = null;
	},

	serialize: function () {
		return [
			"ThisExpression",
			this._token.serialize(),
			Util.serializeNullable(this._funcDef)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._funcDef = funcDef;
		return true;
	},

	getType: function () {
		if ((this._funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
			return new ClassDefType(this._funcDef.getClass());
		else
			return new ObjectType(this._funcDef.getClass());
	}

});

// unary expressions

var UnaryExpression = exports.UnaryExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
	},

	serialize: function () {
		return [
			"UnaryExpression",
			this._operatorToken.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return false;
		if (this._expr.getType().equals(Type.voidType)) {
			errors.push(new Error(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' against void"));
			return false;
		}
		return true;
	}

});

var BitwiseNotExpression = exports.BitwiseNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	getType: function () {
		return Type.booleanType;
	}

});

var DeleteExpression = exports.DeleteExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	getType: function () {
		throw new Error("FIXME");
	}

});

var InstanceofExpression = exports.InstanceofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr1, expectedType) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr1);
		this._expectedType = expectedType;
	},

	serialize: function () {
		return [
			"InstanceofExpression",
			this._expr.serialize(),
			expectedType.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! (this._expr.getType() instanceof ObjectType)) {
			errors.push(new CompileError(this._operatorToken, "operator 'instanceof' is only applicable to an object"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr, Type.booleanType))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var IncrementExpression = exports.IncrementExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	serialize: function () {
		return [
			this._getClassName(),
			this._operatorToken.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var exprType = this._expr.getType();
		if (exprType == null) {
			errors.push(new CompileError(this._operatorToken, "type unknown"));
			return false;
		} else if (exprType.equals(Type.integerType) || exprType.equals(Type.numberType)) {
			// ok
		} else {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' to a non-number"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr.getType();
	}

});

var PostIncrementExpression = exports.PostIncrementExpression = IncrementExpression.extend({

	initialize: function (operatorToken, expr) {
		IncrementExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PostIncrementExpression";
	}

});

var PreIncrementExpression = exports.PreIncrementExpression = IncrementExpression.extend({

	initialize: function (operatorToken, expr) {
		IncrementExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PreIncrementExpression";
	}

});

var PropertyExpression = exports.PropertyExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr1, identifierToken) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr1);
		this._identifierToken = identifierToken;
		this._type = null;
	},

	serialize: function () {
		return [
			"PropertyExpression",
			this._expr.serialize(),
			this._identifierToken.serialize(),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType)) {
			errors.push(new CompileError(this._identifierToken, "cannot obtain a member of void"));
			return false;
		}
		if (exprType.equals(Type.nullType)) {
			errors.push(new CompileError(this._identifierToken, "cannot obtain a member of null"));
			return false;
		}
		var classDef = exprType.getClassDef();
		if ((this._type = classDef.getMemberTypeByName(errors, classDefs, this._identifierToken.identifier)) == null) {
			errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have property named '" + this._identifierToken.identifier) + "'");
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	},

	getHolderType: function () {
		return this._expr1.getType();
	},

	isAssignable: function (type) {
		if (! this._type.isAssignable())
			return false;
		if (! type.isConvertibleTo(this._type))
			return false;
		return true;
	},

});

var TypeofExpression = exports.TypeofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDef, funcDef) {
		throw new Error("FIXME");
	},

});

var SignExpression = exports.SignExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDef, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDef, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr, Type.numberType))
			return false;
	},

	getType: function () {
		var type = this._expr.getType();
		if (type.equals(Type.numberType))
			return type;
		else
			return Type.integerType;
	}

});

// binary expressions

var BinaryExpression = exports.BinaryExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr1 = expr1;
		this._expr2 = expr2;
	},

	serialize: function () {
		return [
			"BinaryExpression",
			this._operatorToken.serialize(),
			this._expr1.serialize(),
			this._expr2.serialize()/*,
			Util.serializeNullable(this.getType())*/
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr1.analyze(errors, classDefs, funcDef))
			return false;
		if (! this._expr2.analyze(errors, classDefs, funcDef))
			return false;
		return true;
	}

});

var AdditiveExpression = exports.AdditiveExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
		this._type = null;
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.isConvertibleTo(Type.numberType) && expr2Type.isConvertibleTo(Type.numberType)) {
			// ok
			this._type = (expr1Type instanceof NumberType) || (expr2Type instanceof NumberType)
				? Type.numberType : Type.integerType;
		} else if (expr1Type instanceof StringType && expr2Type instanceof StringType) {
			// ok
			this._type = expr1Type;
		} else {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var ArrayExpression = exports.ArrayExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		throw new Error("FIXME");
	},

	getType: function () {
		throw new Error("FIXME");
	}

});

var AssignmentExpression = exports.AssignmentExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var rhsType = this._expr2.getType();
		if (rhsType == null)
			return false;
		if (rhsType.equals(Type.voidType)) {
			errors.push(new CompileError(this._operatorToken, "cannot assign void"));
			return false;
		}
		if (rhsType.equals(Type.nullType) && this._expr1.getType() == null) {
			errors.push(new CompileError(this._operatorToken, "cannot assign null to an unknown type"));
			return false;
		}
		if (! this._expr1.isAssignable(rhsType)) {
			errors.push(new CompileError(this._operatorToken, "cannot assign '" + rhsType.toString() + "' to '" + this._expr1.getType().toString()));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr1.getType();
	}

});

// + - * / % < <= > >= & | ^
var BinaryNumberExpression = exports.BinaryNumberExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.numberType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.numberType))
			return false;
		return true;
	},

	getType: function () {
		switch (this._operatorToken.keyword) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "%":
			if (this._expr1.getType().equals(Type.numberType) || this._expr2.getType().equals(Type.numberType))
				return Type.numberType;
			else
				return Type.integerType;
			break;
		case "<":
		case "<=":
		case ">":
		case ">=":
			return Type.booleanType;
		case "&":
		case "|":
		case "^":
			return Type.integerType;
		default:
			throw new Error("unexpected operator:" + this._operatorToken.keyword);
		}
	}

});

var EqualityExpression = exports.EqualityExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.equals(expr2Type)) {
			// ok
		} else if (expr1Type.isConvertibleTo(expr2Type) || expr2Type.isConvertibleTo(expr1Type)) {
			// ok
		} else {
			errors.push(new CompileError(this._operatorToken, "either side of operator == should be convertible from the other"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var InExpression = exports.InExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		throw new Error("FIXME");
	},

	getType: function () {
		return Type.booleanType;
	}

});

var LogicalExpression = exports.LogicalExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.booleanType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.booleanType))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var ShiftExpression = exports.ShiftExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.integerType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.integerType))
			return false;
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});

// (the only) tertary expression

var ConditionalExpression = exports.ConditionalExpression = OperatorExpression.extend({

	initialize: function (operatorToken, condExpr, ifTrueExpr, ifFalseExpr) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
	},

	serialize: function () {
		return [
			"ConditionalExpression",
			this._operatorToken.serialize(),
			this._condExpr.serialize(),
			Util.serializeNullable(this._ifTrueExpr),
			this._ifFalseExpr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._condExpr.analyze(errors, classDefs, funcDef))
			return false;
		var condExprType = this._condExpr.getType();
		if (! condExprType.isConvertibleTo(Type.booleanType)) {
			errors.push(new CompileError(this._operatorToken, "condition should be convertible to bool"));
			return false;
		}
		var typeIfTrue;
		if (this._ifTrueExpr != null) {
			if (! this._ifTrueExpr.analyze(errors, classDefs, funcDef))
				return false;
			typeIfTrue = this._ifTrueExpr.getType();
		} else {
			typeIfTrue = condExprType;
		}
		if (! this._ifFalseExpr.analyze(errors, classDefs, funcDef))
			return false;
		var typeIfFalse = this._ifFalseExpr.getType();
		if (! typeIfTrue.equals(typeIfFalse)) {
			errors.push(new CompileError(this._operatorToken, "returned types should be the same for operator ?: but got '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._ifFalseExpr.getType();
	}

});

// invocation expressions

var CallExpression = exports.CallExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
		this._args = args;
	},

	serialize: function () {
		return [
			"CallExpression",
			this._operatorToken.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return false;
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i) {
			if (! this._args[i].analyze(errors, classDefs, funcDef))
				return false;
			argTypes[i] = this._args[i].getType();
		}
		var exprType = this._expr.getType();
		if (! (exprType instanceof FunctionType)) {
			errors.push(new CompileError(this._operatorToken, "cannot call a non-function"));
			return false;
		}
		if (! exprType.isCallableWith(argTypes, false)) {
			errors.push(new CompileError(this._operatorToken, "cannot call function, arguments mismatch"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr.getType().getReturnType();
	}

});

var NewExpression = exports.NewExpression = OperatorExpression.extend({

	initialize: function (operatorToken, name, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._operatorToken = operatorToken;
		this._name = name;
		this._args = args;
	}

});

// comma expression is not treated as a binary expression

var CommaExpression = exports.CommaExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	},

	serialize: function () {
		return [
			"CommaExpression",
			this._expr1.serialize(),
			this._expr2.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return this._expr1.analyze(errors, classDefs, funcDef)
			&& this._expr2.analyze(errors, classDefs, funcDef);
	},

	getType: function () {
		return this._expr2.getType();
	}

});

});require.register("jsemitter.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./emitter"));

// statement emitter

var _StatementEmitter = exports._StatementEmitter = Class.extend({

	initialize: function (emitter) {
		this._emitter = emitter;
	}

});

var _ExpressionStatementEmitter = exports._ExpressionStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._getExpressionEmitterFor(statement.getExpr()).emit();
		this._emitter._emit(null, ";\n");
	}

});

var _ReturnStatementEmitter = exports._ReturnStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		var expr = this._statement.getExpr();
		if (expr != null) {
			this._emitter._emit("return ", null);
			this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit();
			this._emitter._emit(";\n", null);
		} else {
			this._emitter._emit("return;\n", this._statement.getToken());
		}
	}

});

var _BreakStatementEmitter = exports._BreakStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _BreakStatementEmitter.emit");
	}

});

var _ContinueStatementEmitter = exports._ContinueStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _ContinueStatementEmitter.emit");
	}

});

var _LabelStatementEmitter = exports._LabelStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _LabelStatementEmitter.emit");
	}

});

var _DoWhileStatementEmitter = exports._DoWhileStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _DoWhileStatementEmitter.emit");
	}

});

var _ForInStatementEmitter = exports._ForInStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _ForInStatementEmitter.emit");
	}

});

var _ForStatementEmitter = exports._ForStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _ForStatementEmitter.emit");
	}

});

var _IfStatementEmitter = exports._IfStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("if (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit();
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getIfTrueStatements());
		var ifFalseStatements = this._statement.getIfFalseStatements();
		if (ifFalseStatements != null) {
			this._emitter._emit("} else {", null);
			this._emitter._emitStatements(ifFalseStatements);
		}
		this._emitter.emit("}\n", null);
	}

});

var _SwitchStatementEmitter = exports._SwitchStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _SwitchStatementEmitter.emit");
	}

});

var _WhileStatementEmitter = exports._WhileStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _WhileStatementEmitter.emit");
	}

});

var _TryStatementEmitter = exports._TryStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _TryStatementEmitter.emit");
	}

});

var _AssertStatementEmitter = exports._AssertStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _AssertStatementEmitter.emit");
	}

});

var _LogStatementEmitter = exports._LogStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("console.log(", null);
		var exprs = this._statement.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit();
		}
		this._emitter._emit(");\n", null);
	}

});

// expression emitter

var _ExpressionEmitter = exports._ExpressionEmitter = Class.extend({

	initialize: function (emitter) {
		this._emitter = emitter;
	}

});

var _IdentifierExpressionEmitter = exports._IdentifierExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _IdentifierExpressionEmitter.emit");
	}

});

var _NumberLiteralExpressionEmitter = exports._NumberLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.number, token);
	}

});

var _StringLiteralExpressionEmitter = exports._StringLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		// FIXME escape
		this._emitter._emit("\"" + token.string + "\"", token);
	}

});

var _ThisExpressionEmitter = exports._ThisExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _ThisExpressionEmitter.emit");
	}

});

var _UnaryExpressionEmitter = exports._UnaryExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var opPrecedence = this._getPrecedence();
		if (opPrecedence < outerOpPrecedence) {
			this._emitter._emit("(", null);
			this._emit();
			this._emitter._emit(")", null);
		}
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._emit(opToken.keyword + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
	},

	_getPrecedence: function () {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _PostfixExpressionEmitter = exports._PostfixExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
		this._emitter._emit(opToken.keyword + " ", opToken);
	},

	_getPrecedence: function () {
		return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
	}	

});

var _InstanceofExpressionEmitter = exports._InstanceofExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
		this._emitter._emit(" instanceof ", opToken);
		var expectedType = this._expr.getExpectedType();
		this._emitter._emit(expectedType.toString(), expectedType);
	},

	_getPrecedence: function () {
		return _InstanceofExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_InstanceofExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _PropertyExpressionEmitter = exports._PropertyExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
		this._emitter._emit(".", opToken);
		var identifierToken = this._expr.getIdentifierToken();
		this._emitter._emit(identifierToken.toString(), identifierToken);
	},

	_getPrecedence: function () {
		return _PropertyExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _BinaryExpressionEmitter = exports._BinaryExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var opPrecedence = this._getPrecedence();
		if (opPrecedence < outerOpPrecedence) {
			this._emitter._emit("(", null);
			this._emit();
			this._emitter._emit(")", null);
		} else {
			this._emit();
		}
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit();
		this._emitter._emit(" " + opToken.keyword + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit();
	},

	_getPrecedence: function () {
		return _BinaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_BinaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}	

});

var _ArrayExpressionEmitter = exports._ArrayExpressionEmitter = _BinaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_BinaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
		this._expr = expr;
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit();
		this._emitter._emit("[", this._expr.getOperatorToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit();
		this._emitter._emit("]", null);
	},

	_getPrecedence: function () {
		return _ArrayExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_ArrayExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _ConditionalExpressionEmitter = exports._ConditionalExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _ConditionalExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_ConditionalExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _CallExpressionEmitter = exports._CallExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _CallExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _NewExpressionEmitter = exports._NewExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _NewExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_NewExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _CommaExpressionEmitter = exports._CommaExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _CommaExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CommaExpressionEmitter._operatorPrecedence = precedence;
	}

});

// the global emitter

var JavaScriptEmitter = exports.JavaScriptEmitter = Class.extend({

	initialize: function () {
		this._output = "";
		this._indent = 0;
	},

	emitClassDefinition: function (classDef) {

		var className = classDef.className().identifier;

		// emit constructor
		var ctors = this._findFunctions(classDef, "initialize");
		switch (ctors.length) {
		case 0:
			this._emitConstructor(classDef, null);
			break;
		case 1:
			this._emitConstructor(classDef, ctors[0]);
			break;
		default:
			throw new Error("FIXME");
		}

		// emit functions
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if (member instanceof MemberFunctionDefinition) {
				this._emit("\n", null);
				this._emitFunction(member);
			}
		}

	},

	emitStaticInitializationCode: function (classDef) {
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & ClassDefinition.IS_STATIC) != 0) {
				throw new Error("FIXME");
			}
		}
	},

	getOutput: function () {
		return this._output;
	},

	_emitConstructor: function (classDef, funcDef) {
		// emit prologue
		this._emit("function " + classDef.className().identifier + "(", null);
		if (funcDef != null)
			this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		// emit member variable initialization code
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & ClassDefinition.IS_STATIC) == 0) {
				this._emit("this." + member.name().identifier + " = ");
				var initialValue = member.getInitialValue();
				if (initialValue != null)
					this._getExpressionEmitterFor(initialValue).emit();
				else
					this._emitDefaultValueOf(member.getType());
				this._emit(";\n", null);
			}
		}
		// emit function body
		if (funcDef != null)
			this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("}\n", null);
	},

	_emitFunction: function (funcDef) {
		this._emit(funcDef.getClassDef().className().identifier, null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
			this._emit(".prototype", null);
		this._emit("." + this._mangleFunctionName(funcDef) + " = function (", null);
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		this._emitFunctionBody(funcDef);
		this._reduceIndent();
		this._emit("};\n", null);
	},

	_emitFunctionArguments: function (funcDef) {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emit(", ");
			this._emit(args[i].getName().identifier);
		}
	},

	_emitFunctionBody: function (funcDef) {
		// emit local variable declarations
		var locals = funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i) {
			this._emit("var " + locals[i].name().identifier + " = ");
			this._emitDefaultValueOf(locals[i].getType());
			this._emit(";")
		}
		// emit code
		var statements = funcDef.getStatements();
		for (var i = 0; i < statements.length; ++i)
			this._getStatementEmitterFor(statements[i]).emit();
	},

	_emitDefaultValueOf: function (type) {
		if (type.equals(Type.booleanType))
			this._emit("false", null);
		else if (type.equals(Type.integerType) || type.equals(Type.numberType))
			this._emit("0", null);
		else
			this._emit("null", null);
	},

	_emitStatements: function (statements) {
		this._advanceIndent();
		for (var i = 0; i < statements.length; ++i)
			this._getStatementEmitterFor(statements[i]).emit();
		this._reduceIndent();
	},

	_emit: function (str, token) {
		if (this._output.match(/\n$/))
			this._output += this._getIdent();
		this._output += str.replace(/\n(.)/g, function (a, m) { "\n" + this._getIdent() + m; });
	},

	_advanceIndent: function () {
		++this._indent;
	},

	_reduceIndent: function () {
		if (--this._indent < 0)
			throw new Error("indent mistach");
	},

	_getIdent: function () {
		var s = "";
		for (var i = 0; i < this._indent; ++i)
			s += "\t";
		return s;
	},

	_getStatementEmitterFor: function (statement) {
		if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement);
		else if (statement instanceof BreakStatement)
			return new _BreakStatementEmitter(this, statement);
		else if (statement instanceof ContinueStatement)
			return new _ContinueStatementEmitter(this, statement);
		else if (statement instanceof LabelStatement)
			return new _LabelStatementEmitter(this, statement);
		else if (statement instanceof DoWhileStatement)
			return new _DoWhileStatementEmitter(this, statement);
		else if (statement instanceof ForInStatement)
			return new _ForInStatementEmitter(this, statement);
		else if (statement instanceof ForStatement)
			return new _ForStatementEmitter(this, statement);
		else if (statement instanceof IfStatement)
			return new _IfStatementEmitter(this, statement);
		else if (statement instanceof SwitchStatement)
			return new _SwitchStatementEmitter(this, statement);
		else if (statement instanceof WhileStatement)
			return new _WhileStatementEmitter(this, statement);
		else if (statement instanceof TryStatement)
			return new _TryStatementEmitter(this, statement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementEmitter(this, statement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	},

	_getExpressionEmitterFor: function (expr) {
		if (expr instanceof IdentifierExpression)
			return new _IdentifierExpressionEmitter(this, expr);
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof DeleteExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof PostIncrementExpression)
			return new _PostfixExpressionEmitter(this, expr);
		else if (expr instanceof PreIncrementExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionEmitter(this, expr);
		else if (expr instanceof TypeofExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof SignExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof AdditiveExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ArrayExpression)
			return new _ArrayExpressionEmitter(this, expr);
		else if (expr instanceof AssignmentExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof EqualityExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof InExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof LogicalExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ShiftExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ConditionalExpression)
			return new _ConditionalExpressionEmitter(this, expr);
		else if (expr instanceof CallExpression)
			return new _CallExpressionEmitter(this, expr);
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionEmitter(this, expr);
		throw new Error("got unexpected type of expression: " + JSON.stringify(expr.serialize()));
	},

	_mangleFunctionName: function (funcDef) {
		return funcDef.name() + this._mangleFunctionArguments(funcDef.getArgumentTypes());
	},

	_mangleTypeName: function (type) {
		if (type.equals(Type.voidType))
			return "V";
		else if (type.equals(Type.booleanType))
			return "B";
		else if (type.equals(Type.integerType))
			return "I";
		else if (type.equals(Type.numberType))
			return "N";
		else if (type.equals(Type.stringType))
			return "S";
		else if (type instanceof ArrayType)
			return "A" + this._mangleTypeName(type.getElementType());
		else if (type instanceof ObjectType)
			return "L" + this._mangleTypeString(type.toString());
		else if (type instanceof StaticFunctionType)
			return "F" + this._mangleFunctionArguments(type.getArgumentTypes());
		else if (type instanceof MemberFunctionType)
			return "M" + this._mangleTypeName(type.getObjectType()) + this._mangleFunctionArguments(type.getArgumentTypes());
		else
			throw new Error("FIXME " + type.toString());
	},

	_mangleFunctionArguments: function (argTypes) {
		var s = argTypes.length;
		for (var i = 0; i < argTypes.length; ++i)
			s += this._mangleTypeName(argTypes[i]);
		return s;
	},

	_mangleTypeString: function (s) {
		return s.length + s;
	},

	_findFunctions: function (classDef, name, isStatic) {
		var functions = [];
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberFunctionDefinition) && member.name() == name
				&& (member.flags() & IS_STATIC) == (isStatic ? IS_STATIC : 0))
				functions.push(member);
		}
		return functions;
	},

	$initialize: function () {
		var precedence = [
			[
				[ "new",        _NewExpressionEmitter._setOperatorPrecedence ],
				[ "[",          _ArrayExpressionEmitter._setOperatorPrecedence ],
				[ ".",          _PropertyExpressionEmitter._setOperatorPrecedence ],
			], [
				[ "++",         _PostfixExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _PostfixExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "delete",     _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "void",       _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "typeof",     _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "++",         _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "+",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "-",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "~",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "!",          _UnaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "*",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "/",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "%",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "+",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "-",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "<<",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>>",        _BinaryExpressionEmitter._setOperatorPrecedence ],
			], [
				[ "<",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "<=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "instanceof", _InstanceofExpressionEmitter._setOperatorPrecedence ],
				[ "in",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "==",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "!=",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "&",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "^",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "|",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "&&",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "||",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "=",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "*=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "/=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "%=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "+=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "-=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "<<=",        _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>=",        _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>>=",       _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "&=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "^=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "|=",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "?",          _ConditionalExpressionEmitter._setOperatorPrecedence ]
			], [
				[ ",",          _CommaExpressionEmitter._setOperatorPrecedence ]
			]
		];
		for (var i = 0; i < precedence.length; ++i) {
			var opTypeList = precedence[i];
			for (var j = 0; j < opTypeList.length; ++j)
				opTypeList[j][1](opTypeList[j][0], -i);
		}
	}

});

});require.register("lexer.js", function(module, exports, require, global){
/*
 * JSX tokanizer
 */

var Class = require("./Class");
eval(Class.$import("./token"));
eval(Class.$import("./util"));

"use strict";

var Lexer = exports.Lexer = Class.extend({

	$makeAlt: function (patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	},

	$quoteMeta: function (pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	},

	$asHash: function (array) {
		var hash = {};
		for (var i = 0; i < array.length; ++i)
			hash[array[i]] = 1;
		return hash;
	},

	/// compile a regular expression
	$rx: function (pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	},

	// static variables
	$initialize: function () {
		this.ident             = " [a-zA-Z_] [a-zA-Z0-9_]* ";
		this.doubleQuoted      = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
		this.singleQuoted      = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
		this.stringLiteral     = this.makeAlt([this.singleQuoted, this.doubleQuoted]);
		this.regexpLiteral     = this.doubleQuoted.replace(/"/g, "/");

        // ECMA 262 compatible,
        // but allows binaries (e.g. 0b1010) and octals (e.g. 0755).
        // see also ECMA 262 5th (7.8.3) Numeric Literals
        var decimalIntegerLiteral = "(?: 0 | [1-9][0-9_]* )";
        var exponentPart = "(?: [eE] [+-]? [0-9_]+ )";
		var decimal   = this.makeAlt([
                "(?: " + decimalIntegerLiteral + " \. " +
                    "[0-9_]* " + exponentPart + "? )",
                "(?: \. [0-9]+ " + exponentPart + "? )",
                "(?: " + decimalIntegerLiteral + exponentPart + "? )"
            ]) + "\\b";
		var integral = this.makeAlt([
				"(?: 0      [0-7_]+ )",       // octal
				"(?: 0 [xX] [0-9a-fA-F_]+ )", // hex
				"(?: 0 [bB] [01_]+ )",        // binary
                decimalIntegerLiteral
			]);

		this.numberLiteral     = this.makeAlt([decimal, integral]);
		this.multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\/]) )* \\*+/)";
		this.singleLineComment = "(?: // [^\\r\\n]* )";
		this.comment           = this.makeAlt([this.multiLineComment, this.singleLineComment]);
		this.whiteSpace        = "[\\x20\\t\\r\\n]+";

		this.keyword           = this.asHash([
			// literals shared with ECMA 262
			"null",     "true",     "false",
			// keywords shared with ECMA 262
			"break",    "do",       "instanceof", "typeof",
			"case",     "else",     "new",        "var",
			"catch",    "finally",  "return",     "void",
			"continue", "for",      "switch",     "while",
			"function", "this",
			"default",  "if",       "throw",
			"delete",   "in",       "try",
			// keywords of JSX
			"class",    "extends",  "super",
			"import",   "implements",
			"interface",	"static",
			"assert", "log",
			"__FILE__",	"__LINE__"
		]);
		this.reserved          = this.asHash([
			// literals of ECMA 262 but not used by JSX
			"debugger", "with",
			// future reserved words of ECMA 262
			"const", "export",
			// future reserved words within strict mode of ECMA 262
			"let",     "private",   "public", "yield",
			"protected",

			// JSX specific reserved words
			"extern", "native",
			"trait", "using",
			"as", "is",
			"operator", "package"
		]);

		// some operators are not used, but recognized
		// in order to make error massages helpful.
		// e.g. "operator -> is not defined. Do you mean this.foo()?"
		var ops = [
			"{",  "}",  "(",  ")",  "[",  "]",
			".",  ";",  ",",  ":",  "?",  "@",
			"->", "\\", "::", "..", "...",

			"<",  ">",  "<=",  ">=",
			"==", "!=", "<=>", "=~", "~!",

			"=",
			"+",  "-",  "*",  "/",  "%",
			"+=", "-=", "*=", "/=", "%=",
			"&",  "|",  "^",
			"&=", "|=", "^=",
			"~",  "!",
			"++", "--",
			"||", "&&"
		];
		for (var i = 0; i < ops.length; i++)
			ops[i] = this.quoteMeta(ops[i]);
		this.operator = this.makeAlt(ops.sort().reverse());

		// regular expressions
		this.rxOperator      = this.rx("^" + this.operator);
		this.rxIdent         = this.rx("^" + this.ident);
		this.rxStringLiteral = this.rx("^" + this.stringLiteral);
		this.rxNumberLiteral = this.rx("^" + this.numberLiteral);
		this.rxRegExpLiteral = this.rx("^" + this.regexpLiteral);
		this.rxSpace         = this.rx("^" + this.makeAlt([this.comment, this.whiteSpace]));
	},

	initialize: function (filename, input, errors) {
		this._filename = filename;
		this._input = input;
		this._pos = 0;
		this._errors = errors;
	},

	tokenize: function() {

		var tokens = [];

		while (this._pos < this._input.length) {

			var start = this._input.substring(this._pos);
			var matched;
			if (matched = start.match(Lexer.rxSpace)) {
				// skip tokens.push(new SpaceToken(this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxStringLiteral)) {
				tokens.push(new StringToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxNumberLiteral)) {
				tokens.push(new NumberToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxRegExpLiteral)) {
				tokens.push(new RegExpToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxOperator)) {
				tokens.push(new KeywordToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxIdent)) {
				if (Lexer.keyword.hasOwnProperty(matched[0])) {
					tokens.push(new KeywordToken(matched[0], this._filename, this._pos));
				} else if (Lexer.reserved.hasOwnProperty(matched[0])) {
					this._newError("keyword " + matched[0] + " is not supported under current version of JSX");
				} else {
					tokens.push(new IdentifierToken(matched[0], this._filename, this._pos));
				}
			}
			else {
				this._newError("unexpected character");
				matched = start.match(/^.?(?:\r\n?|\n|$)/); // skip to the end of line
			}

			this._pos += matched[0].length;
		}

		return tokens;
	},

	_newError: function (message) {
        var e = new CompileError(this._filename, this._pos, message);
        if(this._errors) {
            this._errors.push(e);
        }
        else {
            throw e;
        }
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
    process.argv.slice(2).map(function(file) {
        console.log(file);
        var fs   = require("fs");
        var content = fs.readFileSync(file).toString();
		var errors = [];

		var lexer = new Lexer(file, content, errors);

        var t0 = Date.now();

        var tokens = lexer.tokenize();
		console.log("*** Errors ***");
		for (var i = 0; i < errors.length; ++i) {
			console.log(errors.toString());
		}
		console.log("*** Tokens ***");
		for (var i = 0; i < tokens.length; ++i) {
			console.log(JSON.stringify(tokens[i].serialize()));
        }
        console.log("elapsed %s ms.", Date.now() - t0);
    });
}

});require.register("os.js", function(module, exports, require, global){
var Class = require("./Class");

"use strict";

var fs;

if(typeof(process) !== 'undefined') { // node
    fs = require("fs");
}
else {
    fs = {};
    fs.readFileSync = function(id) {
        var element = document.getElementById(id);
        return element.value;
    };
}

var OS = exports.OS = Class.extend({

	$readFile: function (filename) {
		return fs.readFileSync(filename).toString();
	},

	$errprint: function (str) {
		console.error(str);
	}

});

});require.register("parser.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./token"));
eval(Class.$import("./type"));
eval(Class.$import("./classdef"));
eval(Class.$import("./statement"));
eval(Class.$import("./expression"));
eval(Class.$import("./util"));

"use strict";

var Parser = exports.Parser = Class.extend({

	initialize: function (tokens, errors) {
		this._tokens = tokens;
		this._curToken = 0;
		this._errors = errors;
		this._classDefs = [];
		// use for function parsing
		this._locals = [];
		this._statements = [];
		this._objectTypesUsed = [];
	},

	parse: function () {

		/* FIXME decide the syntax and implement
		while (this._importStatementOpt())
			;
		if (this._hasErrors())
			return false;
		*/

		var classDef = this._classDefinition();
		if (classDef == null || this._errors.length != 0)
			return false;
		this._classDefs.push(classDef);

		if (! this._isEOF()) {
			this._newError("expected EOF");
			return false;
		}
		return true;
	},

	getClassDefs: function () {
		return this._classDefs;
	},

	_registerLocal: function (identifierToken, type) {
		for (var i = 0; i < this._locals.length; i++) {
			if (this._locals[i].getName() == identifierToken.identifier) {
				if (type != null && ! this._locals[i].getType().equals(type))
					this._newError("conflicting types for variable " + identifierToken.identifier);
				return;
			}
		}
		this._locals.push(new LocalVariable(identifierToken, type));
	},

	_preserveState: function () {
		return {
			curToken: this._curToken,
			numErrors: this._errors.length
		};
	},

	_restoreState: function (state) {
		this._curToken = state.curToken;
		this._errors.length = state.numErrors;
	},

	_isEOF: function () {
		return this._curToken >= this._tokens.length;
	},

	_nextToken: function () {
		if (this._curToken < this._tokens.length)
			return this._tokens[this._curToken++];
		return null;
	},

	_ungetToken: function () {
		--this._curToken;
	},

	_newError: function (message) {
		this._ungetToken();
		var token = this._nextToken();
		this._errors.push(new CompileError(token, message));
	},

	_expectKeywordOpt: function (expected) {
		var token = this._nextToken();
		if (token == null)
			return null;
		if (token instanceof KeywordToken) {
			if (typeof expected == "string")
				expected = [ expected ];
			for (var i = 0; i < expected.length; i++) {
				if (token.keyword == expected[i])
					return token;
			}
		} 
		this._ungetToken();
		return null;
	},

	_expectKeyword: function (expected, messageOpt) {
		var token = this._expectKeywordOpt(expected);
		if (token != null)
			return token;
		token = this._nextToken(); // revert the unget
		this._newError("expected " + expected + " but got " + token.toString() + (messageOpt ? messageOpt : ""));
		return null;
	},

	_expectIdentifierOpt: function () {
		var token = this._nextToken();
		if (token != null && token instanceof IdentifierToken)
			return token;
		this._ungetToken();
		return null;
	},

	_expectIdentifier: function () {
		var token = this._expectIdentifierOpt();
		if (token != null)
			return token;
		token = this._nextToken(); // revert the unget
		this._newError("expected identifier but got " + token.toString());
		return null;
	},

	_expectIsNotEOF: function () {
		if (this._isEOF()) {
			this._newError("unexpected EOF");
			return false;
		}
		return true;
	},

	_skipStatement: function () {
		var token;
		while ((token = this._nextToken()) != null) {
			if (token instanceof KeywordToken && token.keyword == ";")
					break;
		}
	},

	_qualifiedName: function () {
		var name = [];
		while (1) {
			var identifierToken;
			if ((identifierToken = this._expectIdentifier()) == null)
				return null;
			name.push(identifierToken);
			if (this._expectKeywordOpt(".") == null)
				break;
		}
		return name;
	},

	_classDefinition: function () {
		this._objectTypesUsed = [];
		// attributes
		var flags = 0;
		if (this._expectKeywordOpt("final") != null) {
			flags |= ClassDefinition.IS_FINAL;
		}
		// class
		if (this._expectKeyword("class") == null) {
			return null;
		}
		var className = this._expectIdentifier();
		if (className == null)
			return null;
		// extends
		var extendName = null;
		if (this._expectKeywordOpt("extends") != null)
			if ((extendName = this._qualifiedName()) == null)
				return null;
		// implements
		var implementNames = [];
		if (this._expectKeywordOpt("implements") != null) {
			do {
				var name = this._qualifiedName();
				if (name == null)
					return null;
				implementNames.push(name);
			} while (this._expectKeywordOpt(",") != null);
		}
		// body
		if (this._expectKeyword("{") == null)
			return null;
		var members = [];
		while (this._expectKeywordOpt("}") == null) {
			var member = this._memberDefinition();
			if (member == null)
				return null;
			members.push(member);
		}
		// done
		return new ClassDefinition(className, flags, extendName, implementNames, members, this._objectTypesUsed);
	},

	_memberDefinition: function () {
		var flags = 0;
		while (true) {
			var newFlag = 0;
			if (this._expectKeywordOpt("static") != null)
				newFlag = ClassDefinition.IS_STATIC;
			else if (this._expectKeywordOpt("abstract") != null)
				newFlag = ClassDefinition.IS_ABSTRACT;
			else if (this._expectKeywordOpt("final") != null)
				newFlag = ClassDefinition.IS_FINAL;
			else if (this._expectKeywordOpt("const") != null)
				newFlag = ClassDefinition.IS_CONST;
			else
				break;
			if ((flags & newFlag) != 0) {
				this._newError("cannot declare same attribute more than once");
				return null;
			}
			flags |= newFlag;
		}
		var functionOrVar = this._expectKeyword([ "function", "var" ]);
		if (functionOrVar == null)
			return false;
		if (functionOrVar.keyword == "function")
			return this._functionDefinition(flags);
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		if (this._expectKeywordOpt("=") != null)
			if ((initialValue = this._rhsExpression()) == null)
				return null;
		return new MemberVariableDefinition(name, flags, type, initialValue);
	},

	_functionDefinition: function (flags) {
		if ((flags & ClassDefinition.IS_CONST) != 0) {
			this._newError("cannot declare a const function");
			return null;
		}
		// name
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (this._expectKeyword("(") == null)
			return null;
		// arguments
		var args = [];
		if (this._expectKeywordOpt(")") != null) {
		} else {
			while (true) {
				var argName = this._expectIdentifier();
				if (argName == null)
					return null;
				if (this._expectKeyword(":") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				// FIXME KAZUHO support default arguments
				args.push(new ArgumentDeclaration(argName, argType));
				if (this._expectKeywordOpt(")") != null)
					break;
				if (this._expectKeyword(",") == null)
					return null;
			}
		}
		// return type
		if (this._expectKeyword(":") == null)
			return null;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		// take care of abstract function
		if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
			if (this._expectKeyword(";", " for abstract function definition") == null)
				return null;
			return new MemberFunctionDefinition(name, flags, returnType, args, null);
		}
		// body
		if (this._expectKeyword("{") == null)
			return null;
		this._locals = [];
		this._statements = [];
		this._block();
		// done
		return new MemberFunctionDefinition(name, flags, returnType, args, this._locals, this._statements);
	},

	_typeDeclaration: function (allowVoid) {
		// FIXME support arrays and parameterized types
		if (allowVoid) {
			var keywordToken = this._expectKeywordOpt("void");
			if (keywordToken != null)
				return Type.voidType;
		}
		var typeDecl = this._primaryTypeDeclaration();
		// []
		while (this._expectKeywordOpt("[") != null) {
			if (this._expectKeyword("]") == null)
				return false;
			typeDecl = new ArrayType(typeDecl);
		}
		return typeDecl;
	},
	
	_primaryTypeDeclaration: function (allowVoid) {
		var keywordToken;
		if ((keywordToken = this._expectKeywordOpt("function")) != null)
			return _functionTypeDeclaration(null);
		var identifierToken = this._expectIdentifier();
		if (identifierToken == null)
			return null;
		switch (identifierToken.identifier) {
		case "boolean":
			return Type.booleanType;
		case "int":
			return Type.integerType;
		case "number":
			return Type.numberType;
		case "String":
			return Type.stringType;
		default:
			// is object (or member function)
			var className = identifierToken.identifier;
			while (this._expectKeywordOpt(".") != null) {
				if ((keywordToken = this._expectKeywordOpt("function")) != null)
					break;
				var t = this._expectIdentifier();
				if (t == null)
					return null;
				className += "." + t.identifier;
			}
			var objectType = new ObjectType(className, identifierToken);
			this._objectTypesUsed.push(objectType);
			if (keywordToken != null)
				return this._functionTypeDeclaration(objectType); // function type
			return objectType;
		}
	},

	_functionTypeDeclaration: function (objectType) {
		// parse args
		if(this._expectKeyword("(") == null)
			return null;
		var argTypes = [];
		if (this._expectKeywordOpt(")") == null) {
			// no args
		} else {
			while (true) {
				this._expectIdentifierOpt(); // may have identifiers
				if (this._expectKeyword(":") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				argTypes.push(argType);
				var keywordToken = this_expectKeyword([ ")", "," ]);
				if (keywordToken == null)
					return null;
				if (keywordToken.keyword == ")")
					break;
			}
		}
		// parse return type
		if (this._expectKeyword(":") == null)
			return false;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (className != null)
			return new MemberFunctionType(objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(returnType, argTypes, true);
	},

	_block: function () {
		while (this._expectKeywordOpt("}") == null) {
			if (! this._expectIsNotEOF())
				break;
			if (! this._statement())
				this._skipStatement();
		}
		return true;
	},

	_statement: function () {
		var token;
		if (this._expectKeywordOpt("{") != null)
			return this._block();
		else if (this._expectKeywordOpt("var") != null)
			return this._variableStatement();
		else if (this._expectKeywordOpt(";") != null)
			return true;
		else if (this._expectKeywordOpt("if") != null)
			return this._ifStatement();
		else if (this._expectKeywordOpt("do") != null)
			return this._doWhileStatement();
		else if (this._expectKeywordOpt("while") != null)
			return this._whileStatement();
		else if (this._expectKeywordOpt("for") != null)
			return this._forStatement();
		else if (this._expectKeywordOpt("continue") != null)
			return this._continueStatement();
		else if (this._expectKeywordOpt("break") != null)
			return this._breakStatement();
		else if ((token = this._expectKeywordOpt("return")) != null)
			return this._returnStatement(token);
		else if (this._expectKeywordOpt("switch") != null)
			return this._switchStatement();
		else if (this._expectKeywordOpt("throw") != null)
			return this._throwStatement();
		else if (this._expectKeywordOpt("try") != null)
			return this._tryStatement();
		else if (this._expectKeywordOpt("assert") != null)
			return this._assertStatement();
		else if (this._expectKeywordOpt("log") != null)
			return this._logStatement();
		// labelled or expression statement
		var identifier = this._expectIdentifierOpt();
		if (identifier != null && this._expectKeywordOpt(":") != null) {
			// label is treated as a separate statement (FIXME should label be an attribute of a statement?)
			this._statements.push(new LabelStatement(identifier));
			return true;
		}
		this._ungetToken();
		// expression statement
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_variableStatement: function () {
		var exprs = this._variableDeclarations(false);
		if (exprs == null)
			return false;
		if (this._expectKeyword(";") == null)
			return false;
		var mergedExpr = this._mergeExprs(exprs);
		if (mergedExpr == null)
			return true;
		this._statements.push(new ExpressionStatement(mergedExpr));
		return true;
	},

	_ifStatement: function () {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
			return false;
		var onTrueStatements = this._subStatements();
		var onFalseStatements = [];
		if (this._expectKeywordOpt("else") != null) {
			onFalseStatements = this._subStatements();
		}
		this._statements.push(new IfStatement(expr, onTrueStatements, onFalseStatements));
		return true;
	},

	_doStatement: function () {
		var statements = this._subStatements();
		if (this._expectKeyword("while") == null)
			return false;
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
			return false;
		this._statements.push(new DoWhileStatement(expr, statements));
		return true;
	},

	_whileStatement: function () {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
			return false;
		var statements = this._subStatements();
		this._statements.push(new WhileStatement(expr, statements));
		return true;
	},

	_forStatement: function () {
		var state = this._preserveState();
		// first try to parse as for .. in, and fallback to the other
		switch (this._forInStatement()) {
		case -1: // try for (;;)
			break;
		case 0: // error
			return false;
		case 1:
			return true;
		}
		this._restoreState(state);
		if (! this._expectKeyword("(") == null)
			return false;
		// parse initialization expression
		var initExpr = null;
		if (this._expectKeywordOpt(";") != null) {
			// empty expression
		} else if (this._expectKeywordOpt("var") != null) {
			var exprs = this._variableDeclarations(true);
			if (exprs == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
			if (exprs.length != 0)
				initExpr = this._mergeExprs(exprs);
		} else {
			if ((initExpr = this._expr(true)) == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
		}
		// parse conditional expression
		var condExpr = null;
		if (this._expectKeywordOpt(";") != null) {
			// empty expression
		} else {
			if ((condExpr = this._expr(false)) == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
		}
		// parse post expression
		var postExpr = null;
		if (this._expectKeywordOpt(")") != null) {
			// empty expression
		} else {
			if ((postExpr = this._expr(false)) == null)
				return false;
			if (this._expectKeyword(")") == null)
				return false;
		}
		// statements
		var statements = this._subStatements();
		this._statements.push(new ForStatement(initExpr, condExpr, postExpr, statements));
		return true;
	},

	_forInStatement: function () {
		if (! this._expectKeyword("(") == null)
			return 0; // failure
		var lhsExpr;
		if (this._expectKeywordOpt("var") != null) {
			if ((lhsExpr = this._variableDeclaration(true)) == null)
				return -1; // retry the other
		} else {
			if ((lhsExpr = this._lhsExpr()) == null)
				return -1; // retry the other
		}
		if (this._expectKeyword("in") == null)
			return -1; // retry the other
		var expr = this._expr(false);
		if (expr == null)
			return 0;
		if (this._expectKeyword(")") != null)
			return 0;
		var statements = this._subStatements();
		this._statements.push(new ForInStatement(identifier, expr, statements));
		return 1;
	},

	_continueStatement: function () {
		var label = this._expectIdentifierOpt();
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new ContinueStatement(label));
	},

	_breakStatement: function () {
		var label = this._expectIdentifierOpt();
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new BreakStatement(label));
	},

	_returnStatement: function (token) {
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new ReturnStatement(token, expr));
		return true;
	},

	_switchStatement: function () {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null
			|| this._expectKeyword("{") == null)
			return null;
		var caseExprs = []; // array of [ label, statementIndex ]
		var defaultStatementIndex = -1;
		// caseblock
		var statementBase = this._statements.length;
		while (this._expectKeywordOpt("}") == null) {
			if (! this._expectIsNotEOF())
				return false;
			var caseOrDefault;
			if (caseExprs.length == 0 && defaultStatementIndex == 1) {
				// first statement within the block should start with a label
				if ((caseOrDefault = this._expectKeyword([ "case", "default" ])) == null)
					return false;
			} else {
				caseOrDefault = this._expectKeywordOpt([ "case", "default" ]);
			}
			if (caseOrDefault != null) {
				if (caseOrDefault.keyword == "case") {
					var labelExpr = this._expr();
					if (labelExpr == null)
						return false;
					if (this._expectKeyword(":") == null)
						return false;
					caseExprs.push([ labelExpr, this._statements.length - statementBase ]);
				} else { // "default"
					if (this._expectKeyword(":") == null)
						return false;
					if (defaultStatementIndex != -1) {
						this._newError("cannot have more than one default statement within one switch block");
						return false;
					}
					defaultStatementIndex = this._statements.length - statementBase;
				}
			} else {
				if (! this._statement())
					this._skipStatement();
			}
		}
		// done
		var subStatements = this._statements.splice(statementBase);
		this._statements.push(new SwitchStatement(expr, caseExprs, defaultStatementIndex, subStatements));
		return true;
	},

	_throwStatement: function () {
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statements.push(new ThrowStatement(expr));
		return true;
	},

	_tryStatement: function () {
		if (this._expectKeyword("{") == null)
			return false;
		var startIndex = this._statements.length;
		if (! this._block())
			return false;
		var tryStatements = this._statements.splice(startIndex);
		var catchIdentifier = null;
		var catchStatements = null;
		if (this._expectKeywordOpt("catch") != null) {
			if (this._expectKeyword("(") == null
				|| (catchIdentifier = this._expectIdentifier()) == null
				|| this._expectKeyword(")") == null
				|| this._expectKeyword("{") == null)
				return false;
			if (! this._block())
				return false;
			catchStatements = this._statements.splice(startIndex);
		}
		var finallyStatements = null;
		if (this._expectKeywordOpt("finally") != null) {
			if (this._expectKeyword("{") == null)
				return false;
			finallyStatements = this._statements.splice(startIndex);
		}
		this._statements.push(new TryStatement(tryStatements, catchIdentifier, catchStatements, finallyStatements));
		return true;
	},

	_assertStatement: function () {
		var expr = this._expr();
		if (expr == null)
			return false;
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new AssertStatement(expr));
	},

	_logStatement: function () {
		var expr = this._commaSeparatedExprs(false);
		if (expr == null) {
			return false;
		}
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new LogStatement(expr));
		return true;
	},

	_subStatements: function () {
		var statementIndex = this._statements.length;
		if (! this._statement())
			this._skipStatement();
		return this._statements.splice(statementIndex);
	},

	_variableDeclarations: function (noIn) {
		var exprs = [];
		do {
			var expr = this._variableDeclaration(noIn);
			if (expr == null)
				return null;
			// do not push variable declarations wo. assignment
			if (! (expr instanceof IdentifierExpression))
				exprs.push(expr);
		} while (this._expectKeywordOpt(",") != null);
		return exprs;
	},

	_variableDeclaration: function (noIn) {
		var identifier = this._expectIdentifier();
		if (identifier == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":"))
			if ((type = _typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		var assignToken;
		if ((assignToken = this._expectKeywordOpt("=")) != null)
			if ((initialValue = this._assignExpr(noIn)) == null)
				return null;
		this._registerLocal(identifier, type);
		var expr = new IdentifierExpression(identifier);
		if (initialValue != null)
			expr = new AssignmentExpression(assignToken, expr, initialValue);
		return expr;
	},

	_mergeExprs: function (exprs) {
		if (exprs.length == 0)
			return null;
		var expr = exprs.shift();
		while (exprs.length != 0)
			expr = new CommaExpression(expr, exprs.shift());
		return expr;
	},

	_expr: function (noIn) {
		var exprs = this._commaSeparatedExprs(noIn);
		if (exprs == null)
			return exprs;
		var expr = exprs.shift();
		while (exprs.length != 0)
			expr = new CommaExpression(expr, expr.shift());
		return expr;
	},

	_commaSeparatedExprs: function (noIn) {
		var expr = [];
		do {
			var assignExpr = this._assignExpr(noIn);
			if (assignExpr == null)
				return null;
			expr.push(assignExpr);
		} while (this._expectKeywordOpt(",") != null);
		return expr;
	},

	_assignExpr: function (noIn) {
		var state = this._preserveState();
		// FIXME contrary to ECMA 262, we first try lhs op assignExpr, and then condExpr; does this have any problem?
		// lhs
		var lhsExpr = this._lhsExpr();
		if (lhsExpr != null) {
			var op = this._expectKeyword([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ]);
			if (op != null) {
				var assignExpr = this._assignExpr(noIn);
				if (assignExpr != null)
					return new AssignmentExpression(op, lhsExpr, assignExpr);
			}
		}
		// failed to parse as lhs op assignExpr, try condExpr
		this._restoreState(state);
		return this._condExpr(noIn);
	},

	_condExpr: function (noIn) {
		var lorExpr = this._lorExpr(noIn);
		if (lorExpr == null)
			return null;
		var operatorToken;
		if ((operatorToken = this._expectKeywordOpt("?")) == null)
			return lorExpr;
		var ifTrueExpr = null;
		var ifFalseExpr = null;
		if (this._expectKeywordOpt(":") == null) {
			ifTrueExpr = this._assignExpr(noIn);
			if (ifTrueExpr == null)
				return null;
			if (this._expectKeyword(":") == null)
				return null;
		}
		ifFalseExpr = this._assignExpr(noIn);
		if (ifFalseExpr == null)
			return null;
		return new ConditionalExpression(operatorToken, lorExpr, ifTrueExpr, ifFalseExpr);
	},

	_binaryOpExpr: function (ops, parseFunc, noIn, builderFunc) {
		var expr = parseFunc.call(this, noIn);
		if (expr == null)
			return null;
		while (true) {
			var op = this._expectKeywordOpt(ops);
			if (op == null)
				break;
			var rightExpr = parseFunc.call(this);
			if (rightExpr == null)
				return null;
			expr = builderFunc(op, expr, rightExpr);
		}
		return expr;
	},

	_lorExpr: function (noIn) {
		return this._binaryOpExpr([ "||" ], this._landExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_landExpr: function (noIn) {
		return this._binaryOpExpr([ "&&" ], this._borExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_borExpr: function (noIn) {
		return this._binaryOpExpr([ "|" ], this._bxorExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bxorExpr: function (noIn) {
		return this._binaryOpExpr([ "^" ], this._bandExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bandExpr: function (noIn) {
		return this._binaryOpExpr([ "&" ], this._eqExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_eqExpr: function (noIn) {
		return this._binaryOpExpr([ "==", "!=" ], this._relExpr, noIn, function (op, e1, e2) {
			return new EqualityExpression(op, e1, e2);
		});
	},

	_relExpr: function (noIn) {
		var ops = [ "<", ">", "<=", ">=" ];
		if (! noIn)
			ops.push("in");
		return this._binaryOpExpr(ops, this._shiftExpr, noIn, function (op, e1, e2) {
			if (op.keyword == "in")
				return new InExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_shiftExpr: function () {
		var expr = this._binaryOpExpr([ "<<", ">>", ">>>" ], this._addExpr, false, function (op, e1, e2) {
			return new ShiftExpression(op, e1, e2);
		});
		return expr;
	},

	_addExpr: function () {
		return this._binaryOpExpr([ "+", "-" ], this._mulExpr, false, function (op, e1, e2) {
			if (op.keyword == "+")
				return new AdditiveExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_mulExpr: function () {
		return this._binaryOpExpr([ "*", "/", "%" ], this._unaryExpr, false, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_unaryExpr: function () {
		// simply remove "void"
		this._expectKeywordOpt("void");
		// read other unary operators
		var op = this._expectKeywordOpt([ "delete", "typeof", "++", "--", "+", "-", "~", "!" ]);
		if (op == null)
			return this._postfixExpr();
		var expr = this._unaryExpr();
		if (expr == null)
			return null;
		switch (op.keyword) {
		case "delete":
			return new DeleteExpression(expr);
			break;
		case "typeof":
			return new TypeofExpression(expr);
		case "++":
		case "--":
			return new PreIncrementExpression(op, expr);
		case "+":
		case "-":
			return new SignExpression(op, expr);
		case "~":
			return new BitwiseNotExpression(expr);
		case "!":
			return new LogicalNotExpression(expr);
		}
	},

	_postfixExpr: function () {
		var expr = this._lhsExpr();
		var op = this._expectKeywordOpt([ "++", "--", "instanceof" ]);
		if (op == null)
			return expr;
		if (op.keyword == "instanceof") {
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			return new InstanceofExpression(op, expr, type);
		}
		return new PostIncrementExpression(op, expr);
	},

	_lhsExpr: function () {
		var expr;
		var newToken;
		if ((newToken = this._expectKeywordOpt("new")) != null) {
			var name = this._qualifiedName();
			if (this._expectKeyword("(") == null)
				return null;
			var args = this._argsExpr();
			if (this._expectKeyword(")") == null)
				return null;
			if (args == null)
				return null;
			expr = new NewExpression(newToken, name, args);
		} else {
			expr = this._primaryExpr();
		}
		if (expr == null)
			return null;
		var op;
		while ((op = this._expectKeywordOpt([ "(", "[", "." ])) != null) {
			switch (op.keyword) {
			case "(":
				if ((args = this._argsExpr()) == null)
					return null;
				if (this._expectKeyword(")") == null)
					return null;
				expr = new CallExpression(op, expr, args);
				break;
			case "[":
				var index = this._expr(false);
				if (index == null)
					return null;
				if (this._expectKeyword("]") == null)
					return null;
				expr = new ArrayExpression(op, expr, index);
				break;
			case ".":
				var identifier = this._expectIdentifier();
				if (identifier == null)
					return null;
				expr = new PropertyExpression(op, expr, identifier);
				break;
			}
		}
		return expr;
	},

	_primaryExpr: function () {
		var op = this._expectKeywordOpt([ "this", "[", "{", "(" ]);
		switch (op) {
		case "this":
			return new ThisExpression(op);
		case "[":
			return this._arrayLiteral();
		case "{":
			return this._objectLiteral();
		case "(":
			var expr = this._expr(false);
			if (this._expectKeyword(")") == null)
				return null;
			return expr;
		default:
			var token = this._nextToken();
			if (token instanceof StringToken)
				return new StringLiteralExpression(token);
			else if (token instanceof NumberToken) {
				return new NumberLiteralExpression(token);
			}
			else if (token instanceof IdentifierToken)
				return new IdentifierExpression(token);
			else {
				this._newError("expected primary expression, but got " + token.toString());
				return null;
			}
		}
	},

	_argsExpr: function () {
		var args = [];
		if (this._expectKeywordOpt(")") != null) {
			this._ungetToken();
		} else {
			do {
				var arg = this._assignExpr(false);
				if (arg == null)
					return null;
				args.push(arg);
			} while (this._expectKeywordOpt(",") != null);
		}
		return args;
	}

});

});require.register("statement.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./expression.js"));
eval(Class.$import("./util.js"));

"use strict";

var Statement = exports.Statement = Class.extend({

	analyze: null, // void analyze(errors, classDefs, funcDef)
	serialize: null
});

// statements that take one expression

var UnaryExpressionStatement = exports.UnaryExpressionStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	},

	getExpr: function () {
		return this._expr;
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
	}

});
		
var ExpressionStatement = exports.ExpressionStatement = UnaryExpressionStatement.extend({

	initialize: function (expr) {
		UnaryExpressionStatement.prototype.initialize.call(this, expr);
	},

	serialize: function () {
		return [
			"ExpressionStatement",
			this._expr.serialize()
		];
	}

});

var ReturnStatement = exports.ReturnStatement = UnaryExpressionStatement.extend({

	initialize: function (token, expr) {
		UnaryExpressionStatement.prototype.initialize.call(this, expr);
		this._token = token;
	},

	serialize: function () {
		return [
			"ReturnStatement",
			this._expr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return;
		var exprType = this._expr.getType();
		var returnType = funcDef.getReturnType();
		if (! exprType.isConvertibleTo(returnType))
			errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
	}

});

// break and continue

var JumpStatement = exports.JumpStatement = Statement.extend({

	initialize: function (identifierToken) {
		this._identifierToken = identifierToken;
	},

	analyze: function (errors, classDefs, funcDef) {
		// FIXME check the existence of destination
	}

});

var BreakStatement = exports.BreakStatement = JumpStatement.extend({

	initialize: function (identifierToken) {
		JumpStatement.prototype.initialize.call(this, identifierToken);
	},

	serialize: function () {
		return [
			"BreakStatement",
			Util.serializeNullable(this._identifierToken)
		];
	}

});

var ContinueStatement = exports.ContinueStatement = JumpStatement.extend({

	initialize: function (label) {
		this._label = label;
	},

	serialize: function () {
		return [
			"ContinueStatement",
			Util.serializeNullable(this._identifierToken)
		];
	}

});

// label

var LabelStatement = exports.LabelStatement = Statement.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	},

	serialize: function () {
		return [
			"LabelStatement",
			this._identifier.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
	}

});

// control flow statements

var DoWhileStatement = exports.DoWhileStatement = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"DoWhileStatement",
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements.analyze(errors, classDefs, funcDef);
	}

});

var ForInStatement = exports.ForInStatement = Statement.extend({

	initialize: function (identifier, expr, statements) {
		this._identifier = identifier;
		this._expr = expr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"ForInStatement",
			this._identifier.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements.analyze(errors, classDefs, funcDef);
	}

});

var ForStatement = exports.ForStatement = Statement.extend({

	initialize: function (initExpr, condExpr, postExpr, statements) {
		this._initExpr = initExpr;
		this._condExpr = condExpr;
		this._postExpr = postExpr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"ForStatement",
			Util.serializeNullable(this._initExpr),
			Util.serializeNullable(this._condExpr),
			Util.serializeNullable(this._postExpr),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (this._initExpr != null)
			this._initExpr.analyze(errors, classDefs, funcDef);
		if (this._condExpr != null)
			this._condExpr.analyze(errors, classDefs, funcDef);
		if (this._postExpr != null)
			this._postExpr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
	}

});

var IfStatement = exports.IfStatement = Statement.extend({

	initialize: function (expr, onTrueStatements, onFalseStatements) {
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	},

	serialize: function () {
		return [
			"IfStatement",
			this._expr.serialize(),
			Util.serializeArray(this._onTrueStatements),
			Util.serializeArray(this._onFalseStatements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._onTrueStatements.length; ++i)
			this._onTrueStatements[i].analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._onFalseStatements.length; ++i)
			this._onFalseStatements[i].analyze(errors, classDefs, funcDef);
	}

});

var SwitchStatement = exports.SwitchStatement = Statement.extend({

	initialize: function (expr, caseExpr, defaultStatementIndex, statements) {
		this._expr = expr;
		this._caseExpr = caseExpr;
		this._defaultStatementIndex = defaultStatementIndex;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"SwitchStatement",
			this._expr.serialize(),
			(function (a) {
				var ret = 0;
				for (var i = 0; i < a.length; ++i)
					ret[i] = [ a[i][0].serialize(), a[i][1] ];
				return ret;
			})(this._caseExpr),
			this._defaultStatementIndex,
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._caseExpr.length; ++i)
			this._caseExpr[i][0].analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
	}

});

var WhileStatement = exports.WhileStatement = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"WhileStatement",
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
	}

});

var TryStatement = exports.TryStatement = Statement.extend({

	initialize: function (tryStatements, catchIdentifier, catchStatements, finallyStatements) {
		this._tryStatements = tryStatements;
		this._catchIdentifier = catchIdentifier; // FIXME type?
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
	},

	serialize: function () {
		return [
			"TryStatement",
			Util.serializeArray(this._tryStatements),
			Util.serializeNullable(this._catchIdentifier),
			Util.serializeArray(this._catchStatements),
			Util.serializeArray(this._finallyStatements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		for (var i = 0; i < this._tryStatements.length; ++i)
			this._tryStatements[i].analyze(errors, classDefs, funcDef);
		if (this._catchStatements != null)
			for (var i = 0; i < this._catchStatements.length; ++i)
				this._catchStatements[i].analyze(errors, classDefs, funcDef);
		if (this._finallyStatements != null)
			for (var i = 0; i < this._finallyStatements.length; ++i)
				this._finallyStatements[i].analyze(errors, classDefs, funcDef);
	}

});

// information statements

var InformationStatement = exports.InformationStatement = Statement.extend({

	initialize: function (exprs) {
		this._exprs = exprs;
	},

	getExprs: function () {
		return this._exprs;
	},

	analyze: function (errors, classDefs, funcDef) {
		for (var i = 0; i < this._exprs.length; ++i)
			this._exprs[i].analyze(errors, classDefs, funcDef);
	}

});

var AssertStatement = exports.AssertStatement = InformationStatement.extend({

	initialize: function (exprs) {
		InformationStatement.prototype.initialize.call(this, exprs);
	},

	serialize: function () {
		return [
			"AssertStatement",
			Util.serializeArray(this._exprs)
		];
	}

});

var LogStatement = exports.LogStatement = InformationStatement.extend({

	initialize: function (exprs) {
		InformationStatement.prototype.initialize.call(this, exprs);
	},

	serialize: function () {
		return [
			"LogStatement",
			Util.serializeArray(this._exprs)
		];
	}

});

});require.register("Test.js", function(module, exports, require, global){
"use strict";
/*
# NAME

Test - Nestable Testing libraries

# SYNOPSIS

    var Test = require('/path/to/Test');

    var test = new Test(__filename); // create a test case

    test.beforeEach(function() { ... });
    test.afterEach(function() { ... });

    test.describe('first test case', function(t) {
        var x = 42;

        t.expect(x).toBe(42);
        t.expect(x).notToBe(3.14);
        t.expect(x).toBeFalsy('message');

        return 'foo';
    }).next('second test case', function(t, value) {
        t.expect(vallue).toBe('foo');
    });

    test.done();
*/


var Class = require("./Class");
var dump  = require("./dump");

var Test = module.exports = Class.extend({
    initialize: function(filename, parent) {
        this._parent  = parent;
        this._name    = filename;
        this._count   = 0;
        this._pass    = 0;
        this._start   = Date.now();
        this._status  = 0; // exit code

        this.verbose = true;
        if(typeof(process) !== 'undefined' && !process.stdout.isTTY) {
            this.verbose = false;
        }

        this.note('Testing', this.toString());
    },

    toString: function() {
        return 'Test(' + dump(this._name) + ')';
    },

    describe: function(name, block) {
        this._doBlock(name, block);
        return this;
    },

    next: function(name, block) {
        if(this._nextArg == null) {
            this._ok(false, name);
        }
        else {
            this._doBlock(name, block, this._nextArg);
        }
        return this;
    },

    setNextArg: function(nextArg) {
        this._nextArg = nextArg;
    },

    _doBlock: function(name, block, nextArg) {
        var subtest = new Test.Subtest(name, this);
        this.note(name);
        try {
            if(nextArg != null) {
                block(subtest, nextArg);
            }
            else {
                block(subtest);
            }
        } catch(e) {
            this._status = 1;

            this.fail('subtest ' + name + "\n" + e.stack);

            subtest.done(null);
        }
    },

    expect: function(value, message) {
        ++this._count;
        return new Test.Matcher(this, value, message);
    },

    fail: function(message) {
        ++this._count;
        this._ok(false, message);
    },

    _ok: function(result, message) {
        var args = [];

        if(result) {
            ++this._pass;
            args.push('ok');
        }
        else {
            args.push('not ok');
            message =  (new Error(message)).stack;
        }

        args.push(this._count);

        if(message != null) {
            args.push('-', this._makeMessage(message));
        }
        this.log.apply(this, args);
    },

    done: function() {
        this.log('1..' + this._count);

        if(this._count !== this._pass) {
            this.diag('Looks like you failed',
                      (this._count - this._pass),
                      'test of', this._count);
            this._status = 1;
        }
        this.note('elapsed', Date.now() - this._start, 'ms.');

        process.exit(this._status);
    },

    // format mes
    // sages
    _makeMessage: function(__va_args__) {
        var m = Array.prototype.join.call(arguments, ' ');
        var s = m.split(/\n/);
        var first = s.shift();

        if(s.length === 0) {
            return first;
        }
        else {
            return first + "\n" + s.join("\n").replace(/^/mg, '# ');
        }
    },

    explain: function(v) {
        return dump(v);
    },

    note: function(__va_args__) {
        if(!this.verbose) return;

        var m = Array.prototype.join.call(arguments, ' ');
        console.warn('# ' + this._makeMessage(m));
    },
    diag: function(__va_args__) {
        var m = Array.prototype.join.call(arguments, ' ');
        console.error('# ' + this._makeMessage(m));
    },
    log: function(__va_args__) {
        var m = Array.prototype.join.call(arguments, ' ');
        console.log(m);
    },
});

Test.Subtest = Class.extend({
    initialize: function(name, parent) {
        this._name   = name;
        this._parent = parent;
    },
    toString: function() {
        return this._parent.toString() + '.' +
            'Subtest(' + dump(this._name) + ')';
    },

    done: function(nextArg) {
        this._parent.setNextArg(nextArg);
    },

    describe: function(_) {
        this._parent.describe.apply(this._parent, arguments);
    },
    next: function(_) {
        this._parent.next.apply(this._parent, arguments);
    },

    expect: function(_) {
        return this._parent.expect.apply(this._parent, arguments);
    },

    explain: function(_) {
        return this._parent.explain.apply(this._parent, arguments);
    },
    note: function(_) {
        this._parent.note.apply(this._parent, arguments);
    },
    diag: function(_) {
        this._parent.diag.apply(this._parent, arguments);
    },
    log: function(_) {
        this._parent.log.apply(this._parent, arguments);
    },
});

Test.Matcher = Class.extend({
    initialize: function(context, value, message) {
        this._context = context;
        this._value   = value;
        this._message = message;
    },
    toString: function() {
        return 'Test.Matcher(' + dump(this._value) +  ')';
    },

    // matchers
    toBe: function(expected) {
        if(this._value === expected) {
            this._context._ok(true, this._message);
        }
        else {
            this._context._ok(false,
                "Failed to " + (this._message || 'test') + "\n" +
                "Expected: " + dump(expected) + "\n" +
                "Got:      " + dump(this._value) + "\n"
            );
        }
    },
    toBeInstanceOf: function(expectedClass) {
        if(this._value instanceof expectedClass) {
            this._context._ok(true, this._message);
        }
        else {
            this._context._ok(false,
                "Failed to " + (this._message || 'test') + "\n" +
                "Expected class: " + expectedClass + "\n" +
                "Got instance:   " + this._value + "\n"
            );
        }
    },
    toBeTruthy: function() {
        if(this._value) {
            this._context._ok(true, this._message);
        }
        else {
            this._context._ok(false,
                "Failed to " + (this._message || 'test') + "\n" +
                "Expected: truthy\n" +
                "Got:      " + dump(this._value) + "\n"
            );
        }
    },
    toBeFalsy: function() {
        if(!this._value) {
            this._context._ok(true, this._message);
        }
        else {
            this._context._ok(false,
                "Failed to " + (this._message || 'test') + "\n" +
                "Expected: falsy\n" +
                "Got:      " + dump(this._value) + "\n"
            );
        }
    },
});

});require.register("token.js", function(module, exports, require, global){
"use strict";

var Class = require("./Class");

var Token = exports.Token = Class.extend({

	initialize: function (filename, pos) {
		this.filename = filename;
		this.pos = pos;
	},

	// abstract function serialize()

	_serialize: function (name, properties) {
		return [name, this.filename, this.pos, properties];
	},
});

var IdentifierToken = exports.IdentifierToken = Token.extend({

	initialize: function (identifier, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.identifier = identifier;
	},

	serialize: function () {
		return this._serialize("identifier", this.identifier);
	},

	toString: function () {
		return this.identifier;
	},

	$toString: function (identifiers) {
        if(identifiers instanceof Array) {
            var s = [];
            for (var i = 0; i < identifiers.length; ++i)
                s[i] = identifiers[i].identifier;
            return s.join(".");
        }
        else {
            return Class.prototype.toString.call(this);
        }
	}

});

var KeywordToken = exports.KeywordToken = Token.extend({

	initialize: function (keyword, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.keyword = keyword;
	},

	serialize: function () {
		return this._serialize("keyword", this.keyword);
	},

	toString: function () {
		return this.keyword;
	}

});

var NumberToken = exports.NumberToken = Token.extend({

	initialize: function (number, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.number = +number;
	},

	serialize: function () {
		return this._serialize("number", this.number);
	}
});

var RegExpToken = exports.RegExpToken = Token.extend({

	initialize: function (expr, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.expr = expr;
	},

	serialize: function () {
		return this._serialize("RegExp", this.expr);
	}
});

var StringToken = exports.StringToken = Token.extend({

	initialize: function (string, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.string = string.substring(1, string.length - 1).replace(/\\(.)/g, "$1"); // FIXME add support for \x, \u, etc.
	},

	serialize: function () {
		return this._serialize("string", this.string);
	}

});

});require.register("type.js", function(module, exports, require, global){
var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./util"));

"use strict";

// FIXME add support for arrays and parameterized types
var Type = exports.Type = Class.extend({

	$_initialize: function () {
		this.voidType = new VoidType();
		this.nullType = new NullType();
		this.booleanType = new BooleanType();
		this.integerType = new IntegerType();
		this.numberType = new NumberType();
		this.stringType = new StringType();
	},

	serialize: function () {
		return this.toString();
	},

	isAssignable: null, // bool isAssignable()
	isConvertibleTo: null, // bool isConvertibleTo(type)
	getClassDef: null, // ClassDefinition getClassDef()

	equals: function (x) {
		return this == x || ((x instanceof Type) && this.toString() == x.toString());
	},

	asAssignableType: function () {
		return this;
	}

});

// void and null are special types

var VoidType = exports.VoidType = Type.extend({

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		return false;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "void";
	}

});

var NullType = exports.NullType = Type.extend({

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		return type instanceof StringType || type instanceof ObjectType;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "null";
	}

});

// primitive types

var PrimitiveType = exports.PrimitiveType = Type.extend({

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	}

});

var BooleanType = exports.BooleanType = PrimitiveType.extend({

	isConvertibleTo: function (type) {
		return type instanceof BooleanType || type instanceof IntegerType || type instanceof NumberType;
	},

	getClassDef: function () {
		throw new Error("FIXME");
	},

	toString: function () {
		return "boolean";
	}

});

var IntegerType = exports.IntegerType = PrimitiveType.extend({

	isConvertibleTo: function (type) {
		return type instanceof IntegerType || type instanceof NumberType;
	},

	getClassDef: function () {
		throw new Error("FIXME");
	},

	toString: function () {
		return "int";
	}

});

var NumberType = exports.NumberType = PrimitiveType.extend({

	isConvertibleTo: function (type) {
		return type instanceof IntegerType || type instanceof NumberType;
	},

	getClassDef: function () {
		throw new Error("FIXME");
	},

	toString: function () {
		return "number";
	}

});

var StringType = exports.StringType = PrimitiveType.extend({

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
		if (type instanceof StringType)
			return true;
		return false;
	},

	getClassDef: function () {
		throw new Error("FIXME");
	},

	toString: function () {
		return "String";
	}

});

// array type

var ArrayType = exports.ArrayType = Type.extend({

	initialize: function (elementType) {
		this._elementType = elementType;
	},

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
		if (type instanceof ArrayType && type._elementType.equals(this._elementType))
			return true;
		return false;
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	},
	
	getClassDef: function () {
		throw new Error("FIXME");
	},

	getElementType: function () {
		return this._elementType;
	},

	toString: function () {
		return this._elementType.toString() + "[]";
	}

});

// class and object types

var ClassDefType = exports.ClassDefType = Type.extend({

	initialize: function (classDef) {
		this._classDef = classDef;
	},

	isConvertibleTo: function (type) {
		return false;
	},

	isAssignable: function () {
		return false;
	},

	getClassDef: function () {
		return this._classDef;
	},

	toString: function () {
		return this._classDef.className();
	}

});

var ObjectType = exports.ObjectType = Type.extend({

	initialize: function () {
		switch (arguments.length) {
		case 1:
			this._classDef = arguments[0];
			this._className = this._classDef.className().toString();
			this._token = null;
			break;
		case 2:
			this._classDef = null;
			this._className = arguments[0];
			this._token = arguments[1];
			break;
		}
	},

	resolveTypes: function (errors, classDefs) {
		if ((this._classDef = ClassDefinition.getClass(classDefs, this.toString())) == null)
			errors.push(new CompileError(this._token, "'" + this.toString() + "' is not defined"));
	},

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
		if (! (type instanceof ObjectType))
			return false;
		return this._classDef.isConvertibleTo(type._classDef);
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	},

	getClassDef: function () {
		return this._classDef;
	},

	toString: function () {
		return this._className;
	}

});

// function types

var FunctionType = exports.FunctionType = Type.extend({

	initialize: function (returnType, argTypes, isAssignable) {
		this._returnType = returnType;
		this._argTypes = argTypes;
		this._isAssignable = isAssignable;
	},

	setIsAssignable: function (isAssignable) {
		this._isAssignable = isAssignable;
		return this;
	},

	isAssignable: function () {
		return this._isAssignable;
	},

	asAssignableType: function () {
	console.log("UHUHU");
		return this._clone().setIsAssignable(true);
	},

	getClassDef: function () {
		throw new Error("FIXME");
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArgumentTypes: function () {
		return this._argTypes;
	},

	isCallableWith: function (argTypes, exact) {
		if (this._argTypes.length != argTypes.length)
			return false;
		for (var i = 0; i < argTypes.length; i++) {
			if (this._argTypes[i].equals(argTypes[i])) {
				// ok
			} else {
				if (exact)
					return false;
				if (! argTypes[i].isConvertibleTo(this._argTypes[i]))
					return false;
			}
		}
		return true;
	},

	toString: function () {
		var args = [];
		for (var i = 0; i < this._argTypes.length; ++i)
			args[i] = " : " + this._argTypes[i].toString();
		return this._toStringPrefix() + "function (" + args.join(", ") + ") : " + this._returnType.toString();
	}

});

var StaticFunctionType = exports.StaticFunctionType = FunctionType.extend({

	initialize: function (returnType, argTypes, isAssignable) {
		FunctionType.prototype.initialize.call(this, returnType, argTypes, isAssignable);
	},

	_clone: function () {
		return new StaticFunctionType(this._returnType, this._argTypes, this._isAssignable);
	},

	_toStringPrefix: function () {
		return "static ";
	}

});

var MemberFunctionType = exports.MemberFunctionType = FunctionType.extend({

	initialize: function (objectType, returnType, argTypes, isAssignable) {
		FunctionType.prototype.initialize.call(this, returnType, argTypes, isAssignable);
		this._objectType = objectType;
	},

	_clone: function () {
		return new MemberFunctionType(this._objectType, this._returnType, this._argTypes, this._isAssignable);
	},

	_toStringPrefix: function () {
		return this._objectType.toString() + ".";
	},

	

});

Type._initialize();

});require.register("util.js", function(module, exports, require, global){
"use strict";

var Class = require("./Class");

var CompileError = exports.CompileError = Class.extend({

	initialize: function () {
		switch (arguments.length) {
		case 2: // token, text
			this._filename = arguments[0].filename;
			this._pos = arguments[0].pos;
			this._message = arguments[1];
			break;
		case 3: // filename, pos, text
			this._filename = arguments[0];
			this._pos = arguments[1];
			this._message = arguments[2];
			break;
		default:
			throw new Error("Unrecognized arguments for CompileError: " + JSON.stringify( Array.prototype.slice.call(arguments) ));
		}
	},

	getFilename: function () {
		return this._filename;
	},

	getPosition: function () {
		return this._pos;
	},

	toString: function () {
		return this._filename + "(" + this._pos + "):" + this._message;
	}

});

var Util = exports.Util = Class.extend({

	$serializeArray: function (a) {
		if (a == null)
			return null;
		var ret = [];
		for (var i = 0; i < a.length; ++i)
			ret[i] = a[i].serialize();
		return ret;
	},

	$serializeNullable: function (v) {
		if (v == null)
			return null;
		return v.serialize();
	}

});
// vim: set noexpandtab:

});require.register("validate.js", function(module, exports, require, global){
"use strict";

var inspect;
try {
    inspect = require("util").inspect; // on node
}
catch(e) {
    inspect = function(x) { return x };
}


function isa(expr, t) {
    if(expr == null) {
        throw new Error("Assertion failed: expected " +
                       t +
                       " but got " + inspect(expr));
    }
    if(typeof(t) === "string") {
        if(!(typeof(expr) === t)) {
            throw new Error("Assertion failed: " +
                            inspect(expr) +
                            " is not a type of " + t);
        }
    }
    else {
        if(!(expr instanceof t)) {
            throw new Error("Assertion failed: " +
                            inspect(expr) +
                            " is not an instance of " + t.name || t);
        }
    }
};

exports.isa = isa;


});compiler = require('compiler');
})();
