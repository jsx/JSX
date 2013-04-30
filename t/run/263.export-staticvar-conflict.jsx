/*JSX_OPTS
--minify
*/
/*EXPECTED
123
abc
*/
class _Main {
  __export__ static var _ = 123;
  static var abc = "abc";
  static function main(args : string[]) : void {
    log _Main._;
    log _Main.abc;
  }
}
