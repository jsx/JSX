/*JSX_OPTS
--optimize release --minify
*/
/*EXPECTED
n:1
n:2
n:3
*/
import "console.jsx";

class Foo {
  static function log(n : number) : void {
    console.log("n:" + n as string);
  }
  var n = [1,2,3].map(function (n) { Foo.log(n); });
}
class _Main {
  static function main(args : string[]) : void {
    new Foo;
  }
}
