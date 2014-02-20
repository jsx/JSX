/*EXPECTED
t/run/379.file-macro-vs-node-modules/node_modules/A.jsx/index.jsx
*/
/*JSX_OPTS
--add-search-path t/run/379.file-macro-vs-node-modules
*/
import "379.file-macro-vs-node-modules/importer.jsx";

class _Main {
	static function main(args : string[]) : void {
		Importer.doit();
	}
}
