/*EXPECTED
ok
*/

class Foo {
  static function print(arg : string) : void { }
  static function print(arg : number) : void { }
}

class _Main
{
  static function f.<T>(x : T) : void { }

  static function main(argv : string[]) : void
  {
    var a = [Foo.print];
    var m = { foo: Foo.print };
  }
}

// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
