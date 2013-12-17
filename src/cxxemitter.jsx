import "./emitter.jsx";
import "./platform.jsx";
import "./classdef.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./type.jsx";

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

class CplusplusEmitter implements Emitter {

	var _platform : Platform;

	var _outputFile : Nullable.<string>;
	var _output : string;

	var _runenv : string;
	var _enableRunTimeTypeCheck : boolean;

	function constructor (platform : Platform) {
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

	function _emit (str : string) : void {
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
		for (var i = 0; i < classDefs.length; ++i) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0) {
				continue;
			}
			if (classDefs[i] instanceof TemplateClassDefinition || classDefs[i] instanceof InstantiatedClassDefinition) {
				continue;
			}
			this._emit("class " + classDefs[i].className() + " : public " + this.getNameOfType(classDefs[i].extendType()) + " {\n");
			this._emittingClass = classDefs[i];
			try {
				this._emit("public:\n");
				this._advanceIndent();
				classDefs[i].forEachMemberFunction(function (funcDef) {
					this._emitMemberFunction(funcDef);
					return true;
				});
				this._reduceIndent();

				this._emit("private:\n");
				this._advanceIndent();
				classDefs[i].forEachMemberVariable(function (varDef) {
					this._emitMemberVariable(varDef);
					return true;
				});
				this._reduceIndent();
			} finally {
				this._emittingClass = null;
				this._emit("};\n\n");
			}
		}
		this._reduceIndent();
		this._emit("}\n");

		this._emitMain();
	}

	function _emitMemberFunction (funcDef : MemberFunctionDefinition) : void {
		if (funcDef instanceof TemplateFunctionDefinition) {
			return;
		}
		if (funcDef.name() == "constructor") {
			this._emit(funcDef.getClassDef().className() + " (");
		}
		else {
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
		this._emit(")");
		// emit constructor delegations
		var statements = funcDef.getStatements();
		for (i = 0; i < statements.length; ++i) {
			if (! (statements[i] instanceof ConstructorInvocationStatement))
				break;
			if (i != 0) {
				this._emit(", ");
			} else {
				this._emit(" : ");
			}
			this._emitStatement(statements[i]);
		}
		// emit body
		this._emit(" {\n");
		this._advanceIndent();
		try {
			for (; i < statements.length; ++i) {
				this._emitStatement(statements[i]);
			}
		} finally {
			this._reduceIndent();
			this._emit("}\n\n");
		}
	}

	function _emitMemberVariable (varDef : MemberVariableDefinition) : void {
		// TODO
	}

	function _emitBootstrap () : void {
		this._output += this._platform.load(this._platform.getRoot() + "/src/cxx/bootstrap.h");
		this._output += "\n";
	}

	function _emitMain () : void {
		this._output += """
int main() {
  JSX::_Main::main(JSX::Array<JSX::string>());
}
""";
	}

	function _emitStatement (statement : Statement) : void {
		var emitter = this._getStatementEmitterFor(statement);
		emitter.emit();
	}

	function _getStatementEmitterFor (statement : Statement) : _StatementEmitter {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementEmitter(this, statement as ConstructorInvocationStatement);
		// else if (statement instanceof ExpressionStatement)
		// 	return new _ExpressionStatementEmitter(this, statement as ExpressionStatement);
		// else if (statement instanceof FunctionStatement)
		// 	return new _FunctionStatementEmitter(this, statement as FunctionStatement);
		// else if (statement instanceof ReturnStatement)
		// 	return new _ReturnStatementEmitter(this, statement as ReturnStatement);
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
		// else if (statement instanceof ForStatement)
		// 	return new _ForStatementEmitter(this, statement as ForStatement);
		// else if (statement instanceof IfStatement)
		// 	return new _IfStatementEmitter(this, statement as IfStatement);
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
		// else if (statement instanceof ThrowStatement)
		// 	return new _ThrowStatementEmitter(this, statement as ThrowStatement);
		// else if (statement instanceof AssertStatement)
		// 	return new _AssertStatementEmitter(this, statement as AssertStatement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement as LogStatement);
		// else if (statement instanceof DebuggerStatement)
		// 	return new _DebuggerStatementEmitter(this, statement as DebuggerStatement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	}

	function _getExpressionEmitterFor (expr : Expression) : _ExpressionEmitter {
		// if (expr instanceof LocalExpression)
		// 	return new _LocalExpressionEmitter(this, expr as LocalExpression);
		// else if (expr instanceof ClassExpression)
		// 	return new _ClassExpressionEmitter(this, expr as ClassExpression);
		// else if (expr instanceof NullExpression)
		// 	return new _NullExpressionEmitter(this, expr as NullExpression);
		// else if (expr instanceof BooleanLiteralExpression)
		// 	return new _BooleanLiteralExpressionEmitter(this, expr as BooleanLiteralExpression);
		// else if (expr instanceof IntegerLiteralExpression)
		// 	return new _IntegerLiteralExpressionEmitter(this, expr as IntegerLiteralExpression);
		// else if (expr instanceof NumberLiteralExpression)
		// 	return new _NumberLiteralExpressionEmitter(this, expr as NumberLiteralExpression);
		// else
		if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr as StringLiteralExpression);
		// else if (expr instanceof RegExpLiteralExpression)
		// 	return new _RegExpLiteralExpressionEmitter(this, expr as RegExpLiteralExpression);
		// else if (expr instanceof ArrayLiteralExpression)
		// 	return new _ArrayLiteralExpressionEmitter(this, expr as ArrayLiteralExpression);
		// else if (expr instanceof MapLiteralExpression)
		// 	return new _MapLiteralExpressionEmitter(this, expr as MapLiteralExpression);
		// else if (expr instanceof ThisExpression)
		// 	return new _ThisExpressionEmitter(this, expr as ThisExpression);
		// else if (expr instanceof BitwiseNotExpression)
		// 	return new _UnaryExpressionEmitter(this, expr as BitwiseNotExpression);
		// else if (expr instanceof InstanceofExpression)
		// 	return new _InstanceofExpressionEmitter(this, expr as InstanceofExpression);
		// else if (expr instanceof AsExpression)
		// 	return new _AsExpressionEmitter(this, expr as AsExpression);
		// else if (expr instanceof AsNoConvertExpression)
		// 	return new _AsNoConvertExpressionEmitter(this, expr as AsNoConvertExpression);
		// else if (expr instanceof LogicalNotExpression)
		// 	return new _UnaryExpressionEmitter(this, expr as LogicalNotExpression);
		// else if (expr instanceof TypeofExpression)
		// 	return new _UnaryExpressionEmitter(this, expr as TypeofExpression);
		// else if (expr instanceof PostIncrementExpression)
		// 	return new _PostfixExpressionEmitter(this, expr as PostIncrementExpression);
		// else if (expr instanceof PreIncrementExpression)
		// 	return new _UnaryExpressionEmitter(this, expr as PreIncrementExpression);
		// else if (expr instanceof PropertyExpression)
		// 	return new _PropertyExpressionEmitter(this, expr as PropertyExpression);
		// else if (expr instanceof SignExpression)
		// 	return new _UnaryExpressionEmitter(this, expr as SignExpression);
		// else if (expr instanceof AdditiveExpression)
		// 	return new _AdditiveExpressionEmitter(this, expr as AdditiveExpression);
		// else if (expr instanceof ArrayExpression)
		// 	return new _ArrayExpressionEmitter(this, expr as ArrayExpression);
		// else if (expr instanceof AssignmentExpression)
		// 	return new _AssignmentExpressionEmitter(this, expr as AssignmentExpression);
		// else if (expr instanceof FusedAssignmentExpression)
		// 	return new _FusedAssignmentExpressionEmitter(this, expr as FusedAssignmentExpression);
		// else if (expr instanceof BinaryNumberExpression)
		// 	return new _BinaryNumberExpressionEmitter(this, expr as BinaryNumberExpression);
		// else if (expr instanceof EqualityExpression)
		// 	return new _EqualityExpressionEmitter(this, expr as EqualityExpression);
		// else if (expr instanceof InExpression)
		// 	return new _InExpressionEmitter(this, expr as InExpression);
		// else if (expr instanceof LogicalExpression)
		// 	return new _LogicalExpressionEmitter(this, expr as LogicalExpression);
		// else if (expr instanceof ShiftExpression)
		// 	return new _ShiftExpressionEmitter(this, expr as ShiftExpression);
		// else if (expr instanceof ConditionalExpression)
		// 	return new _ConditionalExpressionEmitter(this, expr as ConditionalExpression);
		// else if (expr instanceof CallExpression)
		// 	return new _CallExpressionEmitter(this, expr as CallExpression);
		// else if (expr instanceof SuperExpression)
		// 	return new _SuperExpressionEmitter(this, expr as SuperExpression);
		// else if (expr instanceof NewExpression)
		// 	return new _NewExpressionEmitter(this, expr as NewExpression);
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
		if (type instanceof FunctionType) {
			return "void"; // FIXME
		}
		if (! (type instanceof ParsedObjectType)) {
			return type.toString();
		}
		var objectType = type as ParsedObjectType;
		if (objectType.getTypeArguments().length == 0) {
			return type.toString();
		}
		var s = objectType.getQualifiedName().getToken().getValue() + "<";
		for (var i = 0; i < objectType.getTypeArguments().length; ++i) {
			s += this.getNameOfType(objectType.getTypeArguments()[i]);
		}
		s += ">";
		return s;
	}

}
