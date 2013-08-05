/*EXPECTED
[1],[2],[3]
2,3,4
*/

class C.<From, To> {
  static function mymap(a : From[], cb : function (:Nullable.<From>):Nullable.<To>) : To[] {
    return a.map.<To>(cb);
  }
}

class _Main {
  static function main(args : string[]) : void {
    var c : string[] = C.<number, string>.mymap([1, 2, 3], (v) -> "[" + v as string + "]");
    log c.join(",");

    var d : number[] = C.<string, number>.mymap(["1", "2", "3"], (v) -> v as number + 1);
    log d.join(",");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
