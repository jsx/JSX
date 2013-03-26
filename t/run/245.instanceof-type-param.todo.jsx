/*EXPECTED
false
*/
class A.<T> {
    static function test(a:variant):boolean {
        return a instanceof T;
    }
}
class _Main {
    static function main(args:string[]):void {
        var some_object = 0;
        log A.<_Main>.test(some_object);
    }
}
// vim: set expandtab:
