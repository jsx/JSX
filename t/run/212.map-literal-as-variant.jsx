/*EXPECTED
1
abc
undefined
*/
class _Main {
    static function main(args : string[]) : void {
        var a = { a: 1, b: "abc" } : variant;
        log a["a"];
        log a["b"];
        log a["c"];
    }
}
