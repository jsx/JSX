/*EXPECTED
0
1
2
true
*/
mixin Enumerable.<T>  {
  abstract function each(f: (T) -> void): void;
  function forall(pred: (T) -> boolean): boolean {
    var result = true;
    this.each((x) -> {
      if (result && !pred(x)) {
        result = false;
      }
    });
    return result;
  }
}
class ArrayWrapper.<T> implements Enumerable.<T> {
  var _xs: T[];
  function constructor(xs: T[]) {
    this._xs = xs;
  }
  override function each(f: (T) -> void): void {
    for (var x in this._xs) f(x);
  }
}
class _Main {
  static function main(args : string[]): void {
    var xs = new ArrayWrapper.<number>([1, 2, 3]);
    xs.each((x) -> { log x; });
    log xs.forall((x) -> x < 10);
  }
}
