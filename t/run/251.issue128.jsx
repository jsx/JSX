/*EXPECTED
1
*/
class _Main {
    static function f(n : number) : number {
        try {
            return 1 / n;
        } catch (e : Error) {
            return NaN;
        }
    }
    static function main(args : string[]) : void {
        log _Main.f(1);
    }
}
