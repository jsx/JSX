/*JSX_OPTS
--add-search-path t/run/367.npm-preference/1st --add-search-path t/run/367.npm-preference/2nd
*/
/*EXPECTED
I am 1st/B.jsx
I am 2nd/node_modules/A/node_modules/B
I am 2nd/node_modules/B
*/
import "B.jsx";
import "importer.jsx";

class _Main {
	static function main(args : string[]) : void {
		B.say();
		Importer.say();
	}
}
