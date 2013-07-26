/*EXPECTED
foo
42
*/

class Hoge.<T> {
  var a: T;
  var b: Map.<string>;

  function constructor(a: T, option: Map.<string> = {}) {
     this.a = a;
     this.b = option;
  }
}

class _Main {
  static function main(args: string[]) : void {
    var fuga = new Hoge.<string>("foo");
    log fuga.a;

    var hoge = new Hoge.<number>(42);
    log hoge.a;
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:
