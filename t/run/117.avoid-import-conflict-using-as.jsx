/*EXPECTED
foo.jsx
bar.jsx
foo.jsx
bar.jsx
foo.jsx
bar.jsx
*/

import "117.avoid-import-conflict-using-as/foo.jsx";
import "117.avoid-import-conflict-using-as/bar.jsx" into Bar;

class _Main {
	static function main(args : string[]) : void {
		new T();
		new Bar.T();
		T.f();
		Bar.T.f();
		log T.fld;
		log Bar.T.fld;
	}
}
