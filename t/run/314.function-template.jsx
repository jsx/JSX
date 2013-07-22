/*EXPECTED
foo
42
[1],[2],[3]
*/

class C {
  function f.<T>(value : T) : T[] {
    var a = new T[];
    a.push(value);
    return a;
  }

  function mymap.<From, To>(a : From[], cb : function (:Nullable.<From>):To) : To[] {
    var result = new To[];
    for (var i = 0; i < a.length; ++i) {
      result.push(cb(a[i]));
    }
    return result;
  }
}

class _Main {
  static function main(args : string[]) : void {
    var x = new C;

    var a : string[] = x.f.<string>("foo");
    log a[0];

    var b : number[] = x.f.<number>(42);
    log b[0];

    var c : string[] = x.mymap.<number, string>([1, 2, 3], (v) -> "[" + v as string + "]");
    log c.join(",");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
