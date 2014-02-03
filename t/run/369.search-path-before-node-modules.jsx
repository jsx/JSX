/*JSX_OPTS
--add-search-path t/run/369.search-path-before-node-modules/search-path
*/
/*EXPECTED
from search-path
*/
import "369.search-path-before-node-modules/npm/importer.jsx";

class _Main {
	static function main(args : string[]) : void {
		Importer.main();
	}
}
