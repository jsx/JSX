/*EXPECTED
foo
42
42
foo
*/

class Pair.<F, S> {
  var first : F;
  var second : S;

  function constructor(first : F, second : S) {
    this.first = first;
    this.second = second;
  }
}

class C {
  static function newPair.<F, S>(first : F, second : S) : Pair.<F, S> {
    return new Pair.<F, S>(first, second);
  }
}

class _Main {
  static function main(args : string[]) : void {
    var p = C.newPair.<string, number>("foo", 42);
    log p.first;
    log p.second;

    var q = C.newPair.<number, string>(42, "foo");
    log q.first;
    log q.second;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
