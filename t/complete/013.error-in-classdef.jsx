/*EXPECTED
["harAt","harCodeAt","oncat"]
*/
/*JSX_OPTS
--complete 10:23
*/

class C extends String /* this is the error */ {
	static function f() : void {
		"abc".substring(0).c
