/*EXPECTED
t/run/378.macroic-literals.jsx:6
*/
class _Main {
	static function main(args : string[]) : void {
		log __FILE__ + ":" + __LINE__;
	}
}
