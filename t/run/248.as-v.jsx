/*EXPECTED
123
*/
class v {
    var n = 123;
}
class _Main {
    static function main(args : string[]) : void {
        var o : Object = new v;
        log (o as v).n;
    }
}
