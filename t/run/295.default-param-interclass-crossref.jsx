/*EXPECTED
A.f
_Main.f
A.g
_Main.f
A.g
*/
class A {
    static function f(a : number = 42) : void {
        log "A.f";
        _Main.f();
    }
    static function g() : void {
        log "A.g";
    }
}
class _Main {
    static function f(a : number = 42) : void {
        log "_Main.f";
        A.g();
    }
    static function main(args : string[]) : void {
        A.f();
        _Main.f();
    }
}
