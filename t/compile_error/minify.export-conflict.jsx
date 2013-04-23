class C {
  __export__ function f() : void {
  }
  function f(s : string) : void {
  }
}
interface I {
  __export__ function f(n : number) : void;
}
class D extends C implements I {
  override function f(n : number) : void {
  }
}
