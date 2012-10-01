/*EXPECTED
hello
*/
class _Main {
    static function f() : number {
        throw new Error("hello");
    }
    static function main(args : string[]) : void {
        try {
            _Main.f();
        } catch (e : Error) {
            log e.message;
        }
    }
}
