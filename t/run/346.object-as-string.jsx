/*EXPECTED
foo
null
*/

class _Main {
  override function toString() : string {
    return "foo";
  }

  static function main(args : string[]) : void {
    var object = new _Main;
    log object as string;
    object = null;
    log object as string;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
