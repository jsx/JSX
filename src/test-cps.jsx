import "./instruments.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./classdef.jsx";
import "./parser.jsx";
import "./type.jsx";

class _Main {

	static var indent = 0;

	static function reduceIndent() : void {
		_Main.indent -= 4;
	}

	static function advanceIndent () : void {
		_Main.indent += 4;
	}

	static function getCurrentIndent () : string {
		var s = "";
		for (var i = 0; i < _Main.indent; ++i) {
			s += " ";
		}
		return s;
	}

	static function stringifyStatement (stmt : Statement) : string {
		var output = "";
		output += _Main.getCurrentIndent();
		if (stmt instanceof ReturnStatement) {
			var returnStmt = stmt as ReturnStatement;
			output += "return ";
			output += _Main.stringifyExpression(returnStmt.getExpr());
			output += ";";
		} else {
			throw new Error("logic flaw");
		}
		return output;
	}

	static function stringifyExpression (expr : Expression) : string {
		if (expr instanceof LeafExpression) {
			return expr.getToken().getValue();
		} else if (expr instanceof AdditiveExpression) {
			var additiveExpr = expr as AdditiveExpression;
			return _Main.stringifyExpression(additiveExpr.getFirstExpr()) + " + " + _Main.stringifyExpression(additiveExpr.getSecondExpr());
		} else if (expr instanceof FunctionExpression) {
			var funcExpr = expr as FunctionExpression;
			var args = funcExpr.getFuncDef().getArguments().map.<string>((a) -> a.getName().getValue()).join(", ");
			var output = "function (" + args + ") {\n";
			_Main.advanceIndent();
			for (var i in funcExpr.getFuncDef().getStatements()) {
				output += _Main.stringifyStatement(funcExpr.getFuncDef().getStatements()[i]);
				output += "\n";
			}
			_Main.reduceIndent();
			output += _Main.getCurrentIndent();
			output += "}";
			return output;
		} else if (expr instanceof CallExpression) {
			var callExpr = expr as CallExpression;
			var callee = _Main.stringifyExpression(callExpr.getExpr());
			var args = callExpr.getArguments().map.<string>((a) -> _Main.stringifyExpression(a)).join(", ");
			return callee + "(" + args + ")";
		} else {
			throw new Error("logic flaw");
		}
	}

	static function printExpression (expr : Expression) : void {
		log _Main.stringifyExpression(expr);
	}

	static function main(args : string[]) : void {
		var _arg0 = new ArgumentDeclaration(new Token("$halt", false), Type.variantType);
		var id = CodeTransformer._makeSimpleAnonymousClosure(
			null,
			[ _arg0 ],
			new LocalExpression(new Token("$halt", false), _arg0)
		);

		// 1 + 2
		var e1 = new AdditiveExpression(
			new Token("+", false),
			new NumberLiteralExpression(
				new Token("1", false)
			),
			new NumberLiteralExpression(
				new Token("2", false)
			)
		);
		e1._type = Type.numberType;
		_Main.printExpression(CodeTransformer._doCPSConvertExpression(e1, id));

		// f(0, 1, 2)
		// x = 1
		// 0 ? 1 : 2
	}
}