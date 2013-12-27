import "./emitter.jsx";
import "./platform.jsx";
import "./classdef.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./type.jsx";
import "./util.jsx";
import "./parser.jsx";
import "./analysis.jsx";

abstract class _StatementEmitter {

	var _emitter : CplusplusEmitter;

	function constructor (emitter : CplusplusEmitter) {
		this._emitter = emitter;
	}

	abstract function emit () : void;

}

class _ConstructorInvocationStatementEmitter extends _StatementEmitter {

	var _statement : ConstructorInvocationStatement;

	function constructor (emitter : CplusplusEmitter, statement : ConstructorInvocationStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit(this._statement.getConstructingClassDef().className());
		this._emitter._emitCallArguments("(", this._statement.getArguments());
	}

}

class _ForStatementEmitter extends _StatementEmitter {

	var _statement : ForStatement;

	function constructor (emitter : CplusplusEmitter, statement : ForStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("for (", this._statement.getToken());
		var initExpr = this._statement.getInitExpr();
		if (initExpr != null)
			this._emitter._getExpressionEmitterFor(initExpr).emit(0);
		this._emitter._emit("; ", null);
		var condExpr = this._statement.getCondExpr();
		if (condExpr != null)
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		this._emitter._emit("; ", null);
		var postExpr = this._statement.getPostExpr();
		if (postExpr != null)
			this._emitter._getExpressionEmitterFor(postExpr).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _IfStatementEmitter extends _StatementEmitter {

	var _statement : IfStatement;

	function constructor (emitter : CplusplusEmitter, statement : IfStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("if (", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getOnTrueStatements());
		var ifFalseStatements = this._statement.getOnFalseStatements();

		if (ifFalseStatements.length == 1 && ifFalseStatements[0] instanceof IfStatement) {
			this._emitter._emit("} else ", null);
			this._emitter._emitStatement(ifFalseStatements[0]);
			ifFalseStatements = (ifFalseStatements[0] as IfStatement).getOnTrueStatements();
		}
		else {
			if (ifFalseStatements.length != 0) {
				this._emitter._emit("} else {\n", null);
				this._emitter._emitStatements(ifFalseStatements);
			}
			this._emitter._emit("}\n", null);
		}
	}

}

class _ReturnStatementEmitter extends _StatementEmitter {

	var _statement : ReturnStatement;

	function constructor (emitter : CplusplusEmitter, statement : ReturnStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var expr = this._statement.getExpr();
		if (expr != null) {
			this._emitter._emit("return ");
			this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
			this._emitter._emit(";\n");
		} else {
			this._emitter._emit("return;\n");
		}
	}

}

class _ThrowStatementEmitter extends _StatementEmitter {

	var _statement : ThrowStatement;

	function constructor (emitter : CplusplusEmitter, statement : ThrowStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("throw ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _LogStatementEmitter extends _StatementEmitter {

	var _statement : LogStatement;

	function constructor (emitter : CplusplusEmitter, statement : LogStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("console::log(");
		var exprs = this._statement.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0) {
				this._emitter._emit(", ");
			}
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(");\n");
	}

}

class _ExpressionStatementEmitter extends _StatementEmitter {

	var _statement : ExpressionStatement;

	function constructor (emitter : CplusplusEmitter, statement : ExpressionStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n");
	}

}

abstract class _ExpressionEmitter {

	var _emitter : CplusplusEmitter;

	function constructor (emitter : CplusplusEmitter) {
		this._emitter = emitter;
	}

	abstract function emit (outerOpPrecedence : number) : void;

	function emitWithPrecedence (outerOpPrecedence : number, precedence : number, callback : () -> void) : void {
		if (precedence > outerOpPrecedence) {
			this._emitter._emit("(");
			callback();
			this._emitter._emit(")");
		}
		else {
			callback();
		}
	}

}

class _LocalExpressionEmitter extends _ExpressionEmitter {

	var _expr : LocalExpression;

	function constructor (emitter : CplusplusEmitter, expr : LocalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit(this._expr.getLocal().getName().getValue());
	}

}

class _NullExpressionEmitter extends _ExpressionEmitter {

	var _expr : NullExpression;

	function constructor (emitter : CplusplusEmitter, expr : NullExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("nullptr");
	}

}

class _NumberLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : NumberLiteralExpression;

	function constructor (emitter : CplusplusEmitter, expr : NumberLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit(this._expr.getToken().getValue());
	}

}

class _StringLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : StringLiteralExpression;

	function constructor (emitter : CplusplusEmitter, expr : StringLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit(this._expr.getToken().getValue());
	}

}

class _ThisExpressionEmitter extends _ExpressionEmitter {

	var _expr : ThisExpression;

	function constructor (emitter : CplusplusEmitter, expr : ThisExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("this");
	}

}

class _AsExpressionEmitter extends _ExpressionEmitter {

	var _expr : AsExpression;

	function constructor (emitter : CplusplusEmitter, expr : AsExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("((" + this._emitter.getNameOfType(this._expr.getType()) + ")");
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
		this._emitter._emit(")");
	}

}

abstract class _OperatorExpressionEmitter extends _ExpressionEmitter {

	function constructor (emitter : CplusplusEmitter) {
		super(emitter);
	}

	override function emit (outerOpPrecedence : number) : void {
		this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), function () { this._emit(); });
	}

	function _emit () : void {
	}

	abstract function _getPrecedence () : number;

}

class _BinaryNumberExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : BinaryNumberExpression;

	function constructor (emitter : CplusplusEmitter, expr : BinaryNumberExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		if (op == "%" && (Type.numberType.equals(this._expr.getFirstExpr().getType()) || Type.numberType.equals(this._expr.getSecondExpr().getType()))) {
			var lhs = this._expr.getFirstExpr();
			var rhs = this._expr.getSecondExpr();
			this._emitter._emitCallArguments("fmod(", [ lhs, rhs ]);
			return;
		}
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_BinaryNumberExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _BinaryNumberExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_BinaryNumberExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _EqualityExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : EqualityExpression;

	function constructor (emitter : CplusplusEmitter, expr : EqualityExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _EqualityExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_EqualityExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _UnaryExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : UnaryExpression;

	function constructor (emitter : CplusplusEmitter, expr : UnaryExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var opToken = this._expr.getToken();
		this._emitter._emit(opToken.getValue() + " ");
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
	}

	override function _getPrecedence () : number {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _PropertyExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor (emitter : CplusplusEmitter, expr : PropertyExpression) {
		super(emitter, expr);
	}

	override function _emit () : void {
		var expr = this._expr as PropertyExpression;
		var exprType = expr.getType();
		var identifierToken = expr.getIdentifierToken();

		// emit, depending on the type
		if (expr.getExpr().isClassSpecifier()) {
			var name = identifierToken.getValue();
			this._emitter._getExpressionEmitterFor(expr.getExpr()).emit(_PropertyExpressionEmitter._operatorPrecedence - 1);
			this._emitter._emit("::" + name);
		} else {
			var name = identifierToken.getValue();
			this._emitter._getExpressionEmitterFor(expr.getExpr()).emit(_PropertyExpressionEmitter._operatorPrecedence - 1);
			this._emitter._emit("->" + name);
		}
	}

	override function _getPrecedence () : number {
		return _PropertyExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AdditiveExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AdditiveExpression;

	function constructor (emitter : CplusplusEmitter, expr : AdditiveExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_AdditiveExpressionEmitter._operatorPrecedence);
		this._emitter._emit(" + ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_AdditiveExpressionEmitter._operatorPrecedence - 1);
	}

	override function _getPrecedence () : number {
		return _AdditiveExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AdditiveExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AssignmentExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AssignmentExpression;

	function constructor (emitter : CplusplusEmitter, expr : AssignmentExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(this._getPrecedence());
		this._emitter._emit(" " + op + " ");
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(0);
	}

	override function _getPrecedence () : number {
		return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _CallExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : CallExpression;

	function constructor (emitter : CplusplusEmitter, expr : CallExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var calleeExpr = this._expr.getExpr();
		this._emitter._getExpressionEmitterFor(calleeExpr).emit(_CallExpressionEmitter._operatorPrecedence);
		this._emitter._emitCallArguments("(", this._expr.getArguments());
	}

	override function _getPrecedence () : number {
		return _CallExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _NewExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : NewExpression;

	function constructor (emitter : CplusplusEmitter, expr : NewExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._emitCallArguments("new " + this._emitter.getNameOfClassDef(this._expr.getType() as ObjectType) + "(", this._expr.getArguments());
	}

	override function _getPrecedence () : number {
		return _NewExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_NewExpressionEmitter._operatorPrecedence = precedence;
	}

}

class CplusplusEmitter implements Emitter {

	var _platform : Platform;

	var _outputFile : Nullable.<string>;
	var _output : string;

	var _runenv : string;
	var _enableRunTimeTypeCheck : boolean;

	function constructor (platform : Platform) {
		CplusplusEmitter._initialize();
		this._platform = platform;
	}

	override function setRunEnv (runenv : string) : void {
		this._runenv = runenv;
	}

	override function getSearchPaths () : string[] {
		return new string[];
	}

	override function setOutputFile (filename : Nullable.<string>) : void {
		this._outputFile = filename;
	}

	override function getSourceMappingFiles() : Map.<string> {
		return new Map.<string>;
	}

	override function setEnableRunTimeTypeCheck (flag : boolean) : void {
		this._enableRunTimeTypeCheck = flag;
	}

	override function getOutput () : string {
		return this._output;
	}

	override function getEnableSourceMap () : boolean {
		return false;
	}

	override function setEnableSourceMap (enable : boolean) : void {
		throw new Error("C++ emitter does not support source map");
	}

	override function setEnableProfiler (enable : boolean) : void {
		throw new Error("profiler is not provided");
	}

	override function getEnableMinifier () : boolean {
		return false;
	}

	override function setEnableMinifier (enable : boolean) : void {
		throw new Error("C++ emitter does not support minify");
	}

	override function isSpecialCall (callExpr : CallExpression) : boolean {
		return false;
	}

	var _outputEndsWithReturn = false;

	function _emit (str : string, token : Token = null) : void {
		if (str == "")
			return;

		if (this._outputEndsWithReturn && this._indent != 0) {
			this._output += this._getIndent();
			this._outputEndsWithReturn = false;
		}

		str = str.replace(/\n(.)/g, function (m) {
			return "\n" + this._getIndent() + m.substring(1);
		});
		this._output += str;
		this._outputEndsWithReturn = str.charAt(str.length - 1) == "\n";
	}

	var _indent = 0;

	function _advanceIndent () : void {
		this._indent++;
	}

	function _reduceIndent () : void {
		this._indent--;
	}

	function _getIndent () : string {
		var str = "";
		for (var i = 0; i < this._indent; ++i) {
			str += "  ";
		}
		return str;
	}

	var _emittingClass : ClassDefinition = null;

	override function emit (classDefs : ClassDefinition[]) : void {
		this._emitBootstrap();

		this._emit("namespace JSX {\n\n");
		this._advanceIndent();

		// pick out all template classes and replace instansiated classDefs with them
		var typedMap = new TypedMap.<TemplateClassDefinition, boolean>;
		for (var i = 0; i < classDefs.length; ) {
			if (classDefs[i] instanceof InstantiatedClassDefinition) {
				var template = (classDefs[i] as InstantiatedClassDefinition).getTemplateClass();
				if (typedMap.has(template)) {
					classDefs.splice(i, 1);
				} else {
					classDefs.splice(i, 1, template);
					typedMap.set(template, true);
					++i;
				}
			} else {
				++i;
			}
		}

		// class declarations
		classDefs.forEach((classDef) -> {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				return;
			}
			if (classDef instanceof TemplateClassDefinition) {
				var template = classDef as TemplateClassDefinition;
				this._emitTemplateSignature(template.getTypeArguments());
				this._emit(" class " + template.className() + ";\n");
			} else {
				this._emit("class " + classDef.className() + ";\n");
			}
		});
		this._emit("\n");

		// class definitions
		classDefs.forEach((classDef) -> {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				return;
			}
			if (classDef instanceof TemplateClassDefinition) {
				this._emitTemplateClass(classDef as TemplateClassDefinition);
			} else {
				this._emitClass(classDef);
			}
		});

		// method definitions
		classDefs.forEach((classDef) -> {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				return;
			}
			this._emittingClass = classDef;
			try {
				function onFuncDef (funcDef : MemberFunctionDefinition) : boolean {
					if (funcDef instanceof InstantiatedMemberFunctionDefinition) {
						return true;
					}
					if (funcDef.getStatements() == null) {
						return true;
					}
					if (funcDef.name() == "constructor")
						this._emitConstructor(funcDef);
					else
						this._emitMemberFunction(funcDef);
					return true;
				}
				classDef.forEachMemberFunction(onFuncDef);
				classDef.forEachTemplateFunction((funcDef) -> onFuncDef(funcDef));
			} finally {
				this._emittingClass = null;
			}
		});

		this._reduceIndent();
		this._emit("}\n");

		this._emitMain();
	}

	function _emitTemplateSignature (typeArgs : Token[]) : void {
		this._emit("template<");
		for (var i = 0; i < typeArgs.length; ++i) {
			if (i != 0)
				this._emit(", ");
			this._emit("typename " + typeArgs[i].getValue());
		}
		this._emit(">");
	}

	function _emitClass (classDef : ClassDefinition) : void {
		this._emit("class " + classDef.className() + " : public " + this.getNameOfClassDef(classDef.extendType()) + " {\n");
		try {
			this._emit("public:\n");
			this._advanceIndent();

			function onFuncDef (funcDef : MemberFunctionDefinition) : boolean {
				if (funcDef instanceof InstantiatedMemberFunctionDefinition) {
					return true;
				}
				if (funcDef instanceof TemplateFunctionDefinition) {
					this._emitTemplateSignature((funcDef as TemplateFunctionDefinition).getTypeArguments());
					this._emit(" ");
				}

				if (funcDef.name() == "constructor") {
					this._emit(funcDef.getClassDef().className() + " (");
				}
				else {
					if (funcDef.getStatements() == null)
						this._emit("virtual ");
					if ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
						this._emit("static ");
					this._emit(this.getNameOfType(funcDef.getReturnType()) + " " + funcDef.name() + " (");
				}
				for (var i = 0; i < funcDef.getArguments().length; ++i) {
					var arg = funcDef.getArguments()[i];
					if (i != 0) {
						this._emit(", ");
					}
					this._emit(this.getNameOfType(arg.getType()));
					this._emit(" ");
					this._emit(arg.getName().getValue());
				}
				if (funcDef.getStatements() == null) {
					this._emit(") = 0;\n");
				} else {
					this._emit(");\n");
				}
				return true;
			}

			// methods
			classDef.forEachMemberFunction(onFuncDef);
			classDef.forEachTemplateFunction((funcDef) -> onFuncDef(funcDef));
			this._reduceIndent();

			this._advanceIndent();
			// variables
			classDef.forEachMemberVariable(function (varDef) {
				this._emitMemberVariable(varDef);
				return true;
			});
			this._reduceIndent();
		} finally {
			this._emit("};\n\n");
		}
	}

	function _emitTemplateClass (classDef : TemplateClassDefinition) : void {
		this._emitTemplateSignature(classDef.getTypeArguments());
		this._emit("\n");
		this._emitClass(classDef);
	}

	function _emitArguments (args : ArgumentDeclaration[]) : void {
		this._emit("(");
		for (var i = 0; i < args.length; ++i) {
			var arg = args[i];
			if (i != 0) {
				this._emit(", ");
			}
			this._emit(this.getNameOfType(arg.getType()));
			this._emit(" ");
			this._emit(arg.getName().getValue());
		}
		this._emit(")");
	}

	function _emitConstructor (ctor : MemberFunctionDefinition) : void {
		if (this._emittingClass instanceof TemplateClassDefinition) {
			this._emitTemplateSignature((this._emittingClass as TemplateClassDefinition).getTypeArguments());
			this._emit("\n");
			var typeName = this.getNameOfTemplateClassDef(this._emittingClass as TemplateClassDefinition);
		} else {
			typeName = this._emittingClass.className();
		}

		this._emit(typeName + "::" + ctor.getClassDef().className() + " ");
		this._emitArguments(ctor.getArguments());
		// emit constructor delegations
		var statements = ctor.getStatements().concat([]);
		for (var i = 0; i < statements.length; ++i) {
			if (! (statements[i] instanceof ConstructorInvocationStatement))
				break;
			if (i != 0) {
				this._emit(", ");
			} else {
				this._emit(" : ");
			}
			this._emitStatement(statements[i]);
		}
		this._emittingClass.forEachMemberVariable((varDef) -> {
			if (varDef.getInitialValue() != null) {
				if (i == 0) {
					this._emit(" : ");
					i++;
				} else {
					this._emit(", ");
				}
				this._emit(varDef.name() + "(");
				this._getExpressionEmitterFor(varDef.getInitialValue()).emit(0);
				this._emit(")\n");
			}
			return true;
		});
		statements.splice(0, i);
		// emit body
		this._emit(" {\n");
		this._advanceIndent();
		try {
			// emit variable declarations
			var locals = ctor.getLocals();
			for (i = 0; i < locals.length; ++i) {
				this._emit(this.getNameOfType(locals[i].getType()) + " " + locals[i].getName().getValue() + ";\n");
			}
			if (i != 0)
				this._emit("\n");

			// emit statements
			for (i = 0; i < statements.length; ++i) {
				this._emitStatement(statements[i]);
			}
		} finally {
			this._reduceIndent();
			this._emit("}\n\n");
		}
	}

	function _emitMemberFunction (funcDef : MemberFunctionDefinition) : void {
		if (funcDef instanceof TemplateFunctionDefinition) {
			return;
		}
		if (this._emittingClass instanceof TemplateClassDefinition) {
			this._emitTemplateSignature((this._emittingClass as TemplateClassDefinition).getTypeArguments());
			this._emit("\n");
			var typeName = this.getNameOfTemplateClassDef(this._emittingClass as TemplateClassDefinition);
		} else {
			typeName = this._emittingClass.className();
		}

		this._emit(this.getNameOfType(funcDef.getReturnType()) + " ");
		this._emit(typeName + "::" + funcDef.name() + " ");
		this._emitArguments(funcDef.getArguments());
		var statements = funcDef.getStatements().concat([]);
		// emit body
		this._emit(" {\n");
		this._advanceIndent();
		try {
			// emit variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				this._emit(this.getNameOfType(locals[i].getType()) + " " + locals[i].getName().getValue() + ";\n");
			}
			if (i != 0)
				this._emit("\n");

			// emit statements
			for (i = 0; i < statements.length; ++i) {
				this._emitStatement(statements[i]);
			}
		} finally {
			this._reduceIndent();
			this._emit("}\n\n");
		}
	}

	function _emitMemberVariable (varDef : MemberVariableDefinition) : void {
		var type;
		if (varDef.getType() != null)
			this._emit(this.getNameOfType(varDef.getType()));
		else {
			/* variables in template classes may not explicitly typed,
			 * so we need infer the type of them */
			this._emit("decltype(");
			this._getExpressionEmitterFor(varDef.getInitialValue()).emit(0);
			this._emit(")");
		}
		this._emit(" " + varDef.name() + ";\n");
	}

	function _emitBootstrap () : void {
		this._output += this._platform.load(this._platform.getRoot() + "/src/cxx/bootstrap.h");
		this._output += "\n";
	}

	function _emitMain () : void {
		this._output += """
int main() {
  JSX::_Main::main(new JSX::Array<JSX::string>());
}
""";
	}

	function _emitStatements (statements : Statement[]) : void {
		this._advanceIndent();
		try {
			for (var i = 0; i < statements.length; ++i) {
				this._emitStatement(statements[i]);
			}
		} finally {
			this._reduceIndent();
		}
	}

	function _emitStatement (statement : Statement) : void {
		var emitter = this._getStatementEmitterFor(statement);
		emitter.emit();
	}

	function _getStatementEmitterFor (statement : Statement) : _StatementEmitter {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementEmitter(this, statement as ConstructorInvocationStatement);
		else if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement as ExpressionStatement);
		// else if (statement instanceof FunctionStatement)
		// 	return new _FunctionStatementEmitter(this, statement as FunctionStatement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement as ReturnStatement);
		// else if (statement instanceof DeleteStatement)
		// 	return new _DeleteStatementEmitter(this, statement as DeleteStatement);
		// else if (statement instanceof BreakStatement)
		// 	return new _BreakStatementEmitter(this, statement as BreakStatement);
		// else if (statement instanceof ContinueStatement)
		// 	return new _ContinueStatementEmitter(this, statement as ContinueStatement);
		// else if (statement instanceof DoWhileStatement)
		// 	return new _DoWhileStatementEmitter(this, statement as DoWhileStatement);
		// else if (statement instanceof ForInStatement)
		// 	return new _ForInStatementEmitter(this, statement as ForInStatement);
		else if (statement instanceof ForStatement)
			return new _ForStatementEmitter(this, statement as ForStatement);
		else if (statement instanceof IfStatement)
			return new _IfStatementEmitter(this, statement as IfStatement);
		// else if (statement instanceof SwitchStatement)
		// 	return new _SwitchStatementEmitter(this, statement as SwitchStatement);
		// else if (statement instanceof CaseStatement)
		// 	return new _CaseStatementEmitter(this, statement as CaseStatement);
		// else if (statement instanceof DefaultStatement)
		// 	return new _DefaultStatementEmitter(this, statement as DefaultStatement);
		// else if (statement instanceof WhileStatement)
		// 	return new _WhileStatementEmitter(this, statement as WhileStatement);
		// else if (statement instanceof TryStatement)
		// 	return new _TryStatementEmitter(this, statement as TryStatement);
		// else if (statement instanceof CatchStatement)
		// 	return new _CatchStatementEmitter(this, statement as CatchStatement);
		else if (statement instanceof ThrowStatement)
			return new _ThrowStatementEmitter(this, statement as ThrowStatement);
		// else if (statement instanceof AssertStatement)
		// 	return new _AssertStatementEmitter(this, statement as AssertStatement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement as LogStatement);
		// else if (statement instanceof DebuggerStatement)
		// 	return new _DebuggerStatementEmitter(this, statement as DebuggerStatement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	}

	function _getExpressionEmitterFor (expr : Expression) : _ExpressionEmitter {
		if (expr instanceof LocalExpression)
			return new _LocalExpressionEmitter(this, expr as LocalExpression);
		// else if (expr instanceof ClassExpression)
		// 	return new _ClassExpressionEmitter(this, expr as ClassExpression);
		else if (expr instanceof NullExpression)
			return new _NullExpressionEmitter(this, expr as NullExpression);
		// else if (expr instanceof BooleanLiteralExpression)
		// 	return new _BooleanLiteralExpressionEmitter(this, expr as BooleanLiteralExpression);
		// else if (expr instanceof IntegerLiteralExpression)
		// 	return new _IntegerLiteralExpressionEmitter(this, expr as IntegerLiteralExpression);
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr as NumberLiteralExpression);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr as StringLiteralExpression);
		// else if (expr instanceof RegExpLiteralExpression)
		// 	return new _RegExpLiteralExpressionEmitter(this, expr as RegExpLiteralExpression);
		// else if (expr instanceof ArrayLiteralExpression)
		// 	return new _ArrayLiteralExpressionEmitter(this, expr as ArrayLiteralExpression);
		// else if (expr instanceof MapLiteralExpression)
		// 	return new _MapLiteralExpressionEmitter(this, expr as MapLiteralExpression);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr as ThisExpression);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr as BitwiseNotExpression);
		// else if (expr instanceof InstanceofExpression)
		// 	return new _InstanceofExpressionEmitter(this, expr as InstanceofExpression);
		else if (expr instanceof AsExpression)
			return new _AsExpressionEmitter(this, expr as AsExpression);
		// else if (expr instanceof AsNoConvertExpression)
		// 	return new _AsNoConvertExpressionEmitter(this, expr as AsNoConvertExpression);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr as LogicalNotExpression);
		else if (expr instanceof TypeofExpression)
			return new _UnaryExpressionEmitter(this, expr as TypeofExpression);
		// else if (expr instanceof PostIncrementExpression)
		// 	return new _PostfixExpressionEmitter(this, expr as PostIncrementExpression);
		else if (expr instanceof PreIncrementExpression)
			return new _UnaryExpressionEmitter(this, expr as PreIncrementExpression);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionEmitter(this, expr as PropertyExpression);
		else if (expr instanceof SignExpression)
			return new _UnaryExpressionEmitter(this, expr as SignExpression);
		else if (expr instanceof AdditiveExpression)
			return new _AdditiveExpressionEmitter(this, expr as AdditiveExpression);
		// else if (expr instanceof ArrayExpression)
		// 	return new _ArrayExpressionEmitter(this, expr as ArrayExpression);
		else if (expr instanceof AssignmentExpression)
			return new _AssignmentExpressionEmitter(this, expr as AssignmentExpression);
		// else if (expr instanceof FusedAssignmentExpression)
		// 	return new _FusedAssignmentExpressionEmitter(this, expr as FusedAssignmentExpression);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryNumberExpressionEmitter(this, expr as BinaryNumberExpression);
		else if (expr instanceof EqualityExpression)
			return new _EqualityExpressionEmitter(this, expr as EqualityExpression);
		// else if (expr instanceof InExpression)
		// 	return new _InExpressionEmitter(this, expr as InExpression);
		// else if (expr instanceof LogicalExpression)
		// 	return new _LogicalExpressionEmitter(this, expr as LogicalExpression);
		// else if (expr instanceof ShiftExpression)
		// 	return new _ShiftExpressionEmitter(this, expr as ShiftExpression);
		// else if (expr instanceof ConditionalExpression)
		// 	return new _ConditionalExpressionEmitter(this, expr as ConditionalExpression);
		else if (expr instanceof CallExpression)
			return new _CallExpressionEmitter(this, expr as CallExpression);
		// else if (expr instanceof SuperExpression)
		// 	return new _SuperExpressionEmitter(this, expr as SuperExpression);
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr as NewExpression);
		// else if (expr instanceof FunctionExpression)
		// 	return new _FunctionExpressionEmitter(this, expr as FunctionExpression);
		// else if (expr instanceof CommaExpression)
		// 	return new _CommaExpressionEmitter(this, expr as CommaExpression);
		throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize()) : expr.toString()));
	}

	function _emitCallArguments (prefix : string, args : Expression[]) : void {
		this._emit(prefix);
		for (var i = 0 ; i < args.length; ++i) {
			if (i != 0 || prefix.charAt(prefix.length - 1) != '(')
				this._emit(", ");
			this._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emit(")");
	}

	function getNameOfType (type : Type) : string {
		assert type != null;

		if (type instanceof FunctionType) {
			return "void"; // FIXME
		}
		if (! (type instanceof ObjectType)) {
			return type.toString();
		}
		var objectType = type as ObjectType;
		if (objectType.getClassDef() == null) {
			return type.toString();
		}
		return this.getNameOfClassDef(type as ObjectType) + "*";
	}

	function getNameOfClassDef (objectType : ObjectType) : string {
		assert objectType != null;

		var classDef = objectType.getClassDef(); // maybe null
		if (classDef != null && ! (classDef instanceof InstantiatedClassDefinition)) {
			return classDef.className();
		}
		var instantiated = classDef as InstantiatedClassDefinition;
		if (classDef == null) {
			var name = (objectType as ParsedObjectType).getQualifiedName().getToken().getValue();
			var typeArgs = (objectType as ParsedObjectType).getTypeArguments();
		} else {
			name = instantiated.getTemplateClassName();
			typeArgs = instantiated.getTypeArguments();
		}
		var s = name + "<";
		for (var i = 0; i < typeArgs.length; ++i) {
			s += this.getNameOfType(typeArgs[i]);
		}
		s += ">";
		return s;
	}

	function getNameOfTemplateClassDef (template : TemplateClassDefinition) : string {
		var s = template.className();
		s += "<";
		for (var i = 0; i < template.getTypeArguments().length; ++i) {
			if (i != 0)
				s += ", ";
			s += template.getTypeArguments()[i].getValue();
		}
		s += ">";
		return s;
	}

	static var _initialized = false;

	static function _initialize () : void {
		if (CplusplusEmitter._initialized) {
			return;
		}
		CplusplusEmitter._initialized = true;

		var precedence = [
			[
			// 	{ "[":          _ArrayExpressionEmitter._setOperatorPrecedence },
				{ ".":          _PropertyExpressionEmitter._setOperatorPrecedence },
				{ "(":          _CallExpressionEmitter._setOperatorPrecedence },
			// 	{ "super":      _SuperExpressionEmitter._setOperatorPrecedence },
			// 	{ "function":   _FunctionExpressionEmitter._setOperatorPrecedence }
			], [
				{ "new":        _NewExpressionEmitter._setOperatorPrecedence },
			// 	{ "++":         _PostfixExpressionEmitter._setOperatorPrecedence },
			// 	{ "--":         _PostfixExpressionEmitter._setOperatorPrecedence }
			], [
				// delete is not used by JSX
				{ "void":       _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "typeof":     _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "++":         _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "--":         _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "+":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "-":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "~":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "!":          _UnaryExpressionEmitter._setOperatorPrecedence }
			], [
				{ "*":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "/":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "%":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "+":          _AdditiveExpressionEmitter._setOperatorPrecedence },
				{ "-":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
			// 	{ "<<":         _ShiftExpressionEmitter._setOperatorPrecedence },
			// 	{ ">>":         _ShiftExpressionEmitter._setOperatorPrecedence },
			// 	{ ">>>":        _ShiftExpressionEmitter._setOperatorPrecedence }
			// ], [
				{ "<":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ ">":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "<=":         _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ ">=":         _BinaryNumberExpressionEmitter._setOperatorPrecedence },
			// 	{ "instanceof": _InstanceofExpressionEmitter._setOperatorPrecedence },
			// 	{ "in":         _InExpressionEmitter._setOperatorPrecedence }
			], [
				{ "==":         _EqualityExpressionEmitter._setOperatorPrecedence },
				{ "!=":         _EqualityExpressionEmitter._setOperatorPrecedence }
			], [
				{ "&":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "^":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "|":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
			// 	{ "&&":         _LogicalExpressionEmitter._setOperatorPrecedence }
			// ], [
			// 	{ "||":         _LogicalExpressionEmitter._setOperatorPrecedence }
			// ], [
				{ "=":          _AssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "*=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "/=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "%=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "+=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "-=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "<<=":        _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ ">>=":        _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ ">>>=":       _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "&=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "^=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
			// 	{ "|=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence }
			// ], [
			// 	{ "?":          _ConditionalExpressionEmitter._setOperatorPrecedence }
			// ], [
			// 	{ ",":          _CommaExpressionEmitter._setOperatorPrecedence }
			]
		];
		for (var i = 0; i < precedence.length; ++i) {
			var opTypeList = precedence[i];
			for (var j = 0; j < opTypeList.length; ++j)
				for (var key in opTypeList[j])
					opTypeList[j][key](key, -(precedence.length - i));
		}
	}

}
