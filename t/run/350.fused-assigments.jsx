/*EXPECTED
foo
bar
baz
*/

class _Main {
  var s = "";
  function constructor() {
    this.s += "foo\n";
    this.s += "bar\n";
    this.s += "baz";
  }

  static function main (args : string[]) : void {
    var x = new _Main;
    log x.s;
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

