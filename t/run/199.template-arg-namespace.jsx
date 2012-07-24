/*EXPECTED
a
b
*/
import "199.template-arg-namespace/a.jsx" into A;
import "199.template-arg-namespace/b.jsx" into B;

class Test {
	static function run() : void {
		A.Klass.doit();
		B.Klass.doit();
	}
}
