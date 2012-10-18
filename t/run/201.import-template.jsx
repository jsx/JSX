/*EXPECTED
hidden
named
*/
import _Hidden from "201.import-template/hidden.jsx";
import "201.import-template/named.jsx" into ns;

class _Main {
	static function main(args : string[]) : void {
		_Hidden.<_Main>.say();
		ns.Named.<_Main>.say();
	}
}
