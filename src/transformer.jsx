/*
 * Copyright (c) 2012-2014 DeNA Co., Ltd. et al.
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
import "./compiler.jsx";
import "./expression.jsx";
import "./parser.jsx";
import "./statement.jsx";
import "./type.jsx";
import "./util.jsx";

class _Util {

	static var _numUniqVar = 0;

	static function _createFreshArgumentDeclaration (type : Type) : ArgumentDeclaration {
		var id = _Util._numUniqVar++;
		return new ArgumentDeclaration(new Token("$a" + id, true), type);
	}

	static function _createFreshLocalVariable (type : Type) : LocalVariable {
		var id = _Util._numUniqVar++;
		return new LocalVariable(new Token("$a" + id, true), type, false);
	}

	static function _createAnonymousFunction (parent : MemberFunctionDefinition, token : Token /* null for auto-gen */, args : ArgumentDeclaration[], returnType : Type) : MemberFunctionDefinition {
		return _Util._createNamedFunction(parent, token, null, args, returnType);
	}

	static function _createNamedFunction (parent : MemberFunctionDefinition, token : Token /* null for auto-gen */, nameToken : Token, args : ArgumentDeclaration[], returnType : Type) : MemberFunctionDefinition {
		if (token == null) {
			token = new Token("function", false);
		}
		var funcDef = new MemberFunctionDefinition(
			token,
			nameToken,
			ClassDefinition.IS_STATIC,
			returnType,
			args,
			[], // locals
			[], // statements
			[], // closures
			null,
			null
		);
		Util.linkFunction(funcDef, parent);
		return funcDef;
	}

	static function _createIdentityFunction (parent : MemberFunctionDefinition, type : Type) : FunctionExpression {
		assert ! type.equals(Type.voidType);

		var arg = _Util._createFreshArgumentDeclaration(type);
		var identity = new MemberFunctionDefinition(
			new Token("function", false),
			null,	// name
			ClassDefinition.IS_STATIC,
			type,
			[ arg ],
			[],	// locals
			[ new ReturnStatement(new Token("return", false), new LocalExpression(new Token(arg.getName().getValue(), true), arg)) ] : Statement[],
			[],	// closures
			null,	// lastToken
			null
		);
		Util.linkFunction(identity, parent);
		return new FunctionExpression(identity.getToken(), identity);
	}

	static function instantiateBuiltinTemplate (compiler : Compiler, name : string, typeArgs : Type[]) : ClassDefinition {

		function createContext(parser : Parser) : AnalysisContext {
			return new AnalysisContext(
				[], // errors
				parser,
				function (parser : Parser, classDef : ClassDefinition) : ClassDefinition {
					classDef.setAnalysisContextOfVariables(createContext(parser));
					classDef.analyze(createContext(parser));
					return classDef;
				});
		};

		var context = createContext(compiler.getBuiltinParsers()[0]);

		return Util.instantiateTemplate(context, null, name, typeArgs);
	}

}

abstract class TransformCommand {

	var _compiler : Compiler;
	var _identifier : string;
	var errors : CompileError[];

	function constructor (compiler : Compiler, identifier : string) {
		this._compiler = compiler;
		this._identifier = identifier;
	}

	function setup (errors : CompileError[]) : void {
		this.errors = errors;
	}

	function getCompiler() : Compiler {
		return this._compiler;
	}

	abstract function performTransformation () : void;

}

abstract class FunctionTransformCommand extends TransformCommand {

	function constructor (compiler : Compiler, identifier : string) {
		super(compiler, identifier);
	}

	override function performTransformation () : void {
		this._getAllClosures().forEach((funcDef) -> {
			this.transformFunction(funcDef);
		});
	}

	abstract function transformFunction (funcDef : MemberFunctionDefinition) : void;

	function _getAllClosures () : MemberFunctionDefinition[] {
		var closures = new MemberFunctionDefinition[];
		// deeper is first
		this._compiler.forEachClassDef(function (parser, classDef) {
			return classDef.forEachMember(function onMember(member) {
				member.forEachClosure(function (funcDef) {
					return onMember(funcDef);
				});
				if (member instanceof MemberFunctionDefinition) {
					closures.push(member as MemberFunctionDefinition);
				}
				return true;
			});
		});
		return closures;
	}

}

abstract class ExpressionTransformCommand extends TransformCommand {

	function constructor(compiler : Compiler, identifier : string) {
		super(compiler, identifier);
	}

	override function performTransformation() : void {
		function touchMemberFunction(member : MemberFunctionDefinition) : void {
			member.forEachStatement((stmt) -> this.touchStatement(stmt));
		}

		function touchMemberVariable(member : MemberVariableDefinition) : void {
			var expr = member.getInitialValue();
			if (expr != null) {
				this.touchExpression(expr, (expr) -> member.setInitialValue(expr));
			}
		}

		this._compiler.forEachClassDef(function (parser, classDef) {
			if (! (classDef instanceof TemplateClassDefinition)) {
				classDef.forEachMember(function (member) {
					if (! (classDef instanceof TemplateFunctionDefinition)) {
						if (member instanceof MemberFunctionDefinition) {
							touchMemberFunction(member as MemberFunctionDefinition);
						} else {
							assert member instanceof MemberVariableDefinition;
							touchMemberVariable(member as MemberVariableDefinition);
						}
					}
					return true;
				});
			}
			return true;
		});
	}

	function touchStatement(stmt : Statement) : boolean {
		if (stmt instanceof FunctionStatement) {
			(stmt as FunctionStatement).getFuncDef().forEachStatement((stmt) -> this.touchStatement(stmt));
		}
		stmt.forEachStatement((stmt) -> {
			return this.touchStatement(stmt);
		});
		stmt.forEachExpression((expr, replaceCb) -> {
			return this.touchExpression(expr, replaceCb);
		});
		return true;
	}

	function touchExpression(expr : Expression, replaceCb : (Expression) -> void) : boolean {
		if (expr instanceof FunctionExpression) {
			(expr as FunctionExpression).getFuncDef().forEachStatement((stmt) -> this.touchStatement(stmt));
		}

		// the default
		expr.forEachExpression((expr, replaceCb) -> this.touchExpression(expr, replaceCb));
		return true;
	}

}

class FixedExpressionTransformCommand extends ExpressionTransformCommand {

	static const IDENTIFIER = "fixed";

	function constructor(compiler : Compiler) {
		super(compiler, __CLASS__.IDENTIFIER);
	}

	override function touchExpression(expr : Expression, replaceCb : (Expression) -> void) : boolean {

		// check that JSX.ENV is only used in form of "JSX.ENV[string-literal]" and transform
		if (expr instanceof ArrayExpression
			&& (expr as ArrayExpression).getFirstExpr() instanceof PropertyExpression
			&& __CLASS__._refersToJSXENV((expr as ArrayExpression).getFirstExpr() as PropertyExpression)
			&& ((expr as ArrayExpression).getSecondExpr() instanceof StringLiteralExpression)) {
			// JSX.ENV["foo"] -> OK!
			var envName = ((expr as ArrayExpression).getSecondExpr() as StringLiteralExpression).getDecoded();
			var envVar = this.getCompiler().getUserEnvironment()[envName];
			if (envVar != null) {
				replaceCb(new StringLiteralExpression(new Token(Util.encodeStringLiteral(envVar), false)));
			} else {
				replaceCb(new NullExpression(new Token("null", false), new NullableType(Type.stringType)));
			}
			return true;
		} else if (expr instanceof PropertyExpression && __CLASS__._refersToJSXENV(expr as PropertyExpression)) {
			// fail!  is referring to JSX.ENV but not in the above form
			this.errors.push(new CompileError(expr.getToken(), "JSX.ENV can only be accessed via: JSX.ENV[\"string-literal\"]"));
		}

		// other transformations may go in here

		// default
		return super.touchExpression(expr, replaceCb);
	}

	static function _refersToJSXENV(expr : PropertyExpression) : boolean {
		return expr.getExpr() instanceof ClassExpression
			&& expr.getExpr().getToken().getValue() == "JSX"
			&& expr.getIdentifierToken().getValue() == "ENV";
	}

}

abstract class StatementTransformCommand extends FunctionTransformCommand {

	var _funcDef : MemberFunctionDefinition;

	function constructor(compiler : Compiler, identifier : string) {
		super(compiler, identifier);
	}

	override function transformFunction(funcDef : MemberFunctionDefinition) : void {
		var prev = this._funcDef;
		try {
			this._funcDef = funcDef;
			funcDef.forEachStatement((stmt, replaceCb) -> this.touchStatement(stmt, replaceCb));
		} finally {
			this._funcDef = prev;
		}
	}

	function touchStatement(stmt : Statement, replaceCb : (Statement) -> void) : boolean {
		// the default
		stmt.forEachStatement((stmt, replaceCb) -> {
			return this.touchStatement(stmt, replaceCb);
		});
		return true;
	}

	function getProcessingFuncDef () : MemberFunctionDefinition {
		return this._funcDef;
	}

}

class NormalizeTryStatementTransformCommand extends StatementTransformCommand {

	// normalized try statement always have single catch clause that captures a variable of variant type.

	static const IDENTIFIER = "normalize-try";

	function constructor(compiler : Compiler) {
		super(compiler, __CLASS__.IDENTIFIER);
	}

	override function touchStatement (statement : Statement, replaceCb : (Statement) -> void) : boolean {
		if (statement instanceof TryStatement) {
			var tryStatement = statement as TryStatement;
			var catchStatements = tryStatement.getCatchStatements();

			var newCaught = new CaughtVariable(new Token("e", true), Type.variantType);

			catchStatements.forEach(catchStmt => {
				catchStmt.forEachStatement(function onStmt (stmt) {
					return stmt.forEachExpression(function onExpr (expr, replaceCb) {
						if (expr instanceof LocalExpression) {
							var local = (expr as LocalExpression).getLocal();
							if (local  == catchStmt.getLocal()) {
								var expr = new AsNoConvertExpression(
									new Token("as", false),
									new LocalExpression(
										newCaught.getName(),
										newCaught),
									local.getType());
								replaceCb(expr);
								return true;
							}
						}
						return expr.forEachExpression(onExpr);
					}) && stmt.forEachStatement(onStmt);
				});
			});

			var newBody = catchStatements.reduceRight(function (elseStmts : Statement[], catchStmt) {

				var caughtVar = catchStmt.getLocal();
				if (caughtVar.getType() instanceof ObjectType) {
					return [
						new IfStatement(
							new Token("if", false),
							new InstanceofExpression(
								new Token("instanceof", false),
								new LocalExpression(
									newCaught.getName(),
									newCaught),
								caughtVar.getType()),
							catchStmt.getStatements(),
							elseStmts)
					] : Statement[];
				} else {
					assert Type.variantType.equals(caughtVar.getType());

					return catchStmt.getStatements();
				}

			}, [
				new ThrowStatement(
					new Token("throw", false),
					new LocalExpression(
						newCaught.getName(),
						newCaught))
			] : Statement[]);

			var newCatch = new CatchStatement(new Token("catch", false), newCaught, newBody);

			tryStatement.getCatchStatements().length = 0;
			tryStatement.getCatchStatements().push(newCatch);
		}

		// default handler
		return super.touchStatement(statement, replaceCb);
	}

}

class ForInStatementTransformCommand extends StatementTransformCommand {

	static const IDENTIFIER = "transform-for-in";

	function constructor(compiler : Compiler) {
		super(compiler, __CLASS__.IDENTIFIER);
	}

	override function touchStatement (statement : Statement, replaceCb : (Statement) -> void) : boolean {
		var funcDef = this.getProcessingFuncDef();

		if (statement instanceof ForInStatement) {
			super.touchStatement(statement, replaceCb);

			replaceCb(this._transformForIn(funcDef, statement as ForInStatement));

			return true;
		}

		// default handler
		return super.touchStatement(statement, replaceCb);
	}

	function _transformForIn (funcDef : MemberFunctionDefinition, forInStmt : ForInStatement) : Statement {

		var listExpr = forInStmt.getListExpr();
		var vLocal = (forInStmt.getLHSExpr() as LocalExpression).getLocal();

		/*

for (v in list) {
  ...
}

 ||
 \/

do {
  $list = list;
  $props = new string[];
  for (var $prop in $list) {
    $props.push($prop);
  }
  for (var $index = 0; $index < $props.length; $index++) {
    v = $props[$index];
    if (! (v in $list))
      continue;
    ...
  }
} while (0);

		*/

		var listLocal = _Util._createFreshLocalVariable(listExpr.getType());
		var propsLocal = _Util._createFreshLocalVariable(new ObjectType(_Util.instantiateBuiltinTemplate(this._compiler, "Array", [ Type.stringType ])));
		var propLocal = _Util._createFreshLocalVariable(Type.stringType);
		var indexLocal = _Util._createFreshLocalVariable(Type.integerType);

		funcDef.getLocals().push(listLocal, propsLocal, propLocal, indexLocal);

		var statements = [
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(listLocal.getName(), listLocal),
					listExpr)),
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(propsLocal.getName(), propsLocal),
					new ArrayLiteralExpression(
						new Token("[", false),
						[],
						propsLocal.getType()))),
			new ForInStatement(
				new Token("for", false),
				null,
				new LocalExpression(propLocal.getName(), propLocal),
				new LocalExpression(listLocal.getName(), listLocal),
				[
					new ExpressionStatement(
						new CallExpression(
							new Token("(", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(propsLocal.getName(), propsLocal),
								new Token("push", true),
								[],
								propsLocal.getType().getClassDef().getMemberTypeByName([], null, "push", false, [], ClassDefinition.GET_MEMBER_MODE_ALL)),
							[ new LocalExpression(propLocal.getName(), propLocal) ]))
				]),
			new ForStatement(
				new Token("for", false),
				null,
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(indexLocal.getName(), indexLocal),
					new IntegerLiteralExpression(new Token("0", false))),
				new BinaryNumberExpression(
					new Token("<", false),
					new LocalExpression(indexLocal.getName(), indexLocal),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(propsLocal.getName(), propsLocal),
						new Token("length", true),
						[],
						Type.integerType)),
				new PreIncrementExpression(
					new Token("++", false),
					new LocalExpression(indexLocal.getName(), indexLocal)),
				[
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new LocalExpression(vLocal.getName(), vLocal),
							new ArrayExpression(
								new Token("[", false),
								new LocalExpression(propsLocal.getName(), propsLocal),
								new LocalExpression(indexLocal.getName(), indexLocal),
								vLocal.getType()))),
					new IfStatement(
						new Token("if", false),
						new LogicalNotExpression(
							new Token("!", false),
							new InExpression(
								new Token("in", false),
								new LocalExpression(vLocal.getName(), vLocal),
								new LocalExpression(listLocal.getName(), listLocal))),
						[ new ContinueStatement(new Token("continue", false), null) ],
						[]),
				].concat(forInStmt.getStatements()))
		];

		return new DoWhileStatement(new Token("do", false), null, new BooleanLiteralExpression(new Token("false", false)), statements);
	}

}
