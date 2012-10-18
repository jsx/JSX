/*EXPECTED
a
b
*/
import "199.template-arg-namespace/a.jsx" into A;
import "199.template-arg-namespace/b.jsx" into B;

class _Main {
	static function main(args : string[]) : void {
		A.Klass.doit();
		B.Klass.doit();
	}
}
