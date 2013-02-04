/*EXPECTED
bar,foo
hasOwnProperty,keys,toString
*/

class _Main {
  static function main(args : string[]) : void {
    var m = { foo : 10, bar : 20 };
    log m.keys().sort().join(",");

    log { keys : 1, toString : 2, hasOwnProperty : 3 }.keys().sort().join(",");
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

