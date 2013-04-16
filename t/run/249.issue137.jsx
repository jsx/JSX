/*EXPECTED
mixin
*/
interface I {
  function message() : string;
}

mixin Mixin implements I {
  override function message() : string {
    return "mixin";
  }
}

class Concrete implements Mixin {
}

class _Main {
  static function main(args:string[]) : void {
    log new Concrete().message();
  }
}
