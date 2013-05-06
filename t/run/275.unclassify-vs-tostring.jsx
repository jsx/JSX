/*EXPECTED
true
*/
/*JSX_OPTS
--optimize unclassify
*/
final class Foo {
  function constructor() {
  }
}
class _Main {
  static function main(args : string[]) : void {
    var o = new Foo();
    log o.toString().length != 0;
  }
}
