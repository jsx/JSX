/*EXPECTED
hello
null
*/
/*JSX_OPTS
--define msg=hello
*/
class _Main {
	static function main(args : string[]) : void {
		log JSX.ENV["msg"];
		log JSX.ENV["notfound"];
	}
}
