/*EXPECTED
false
false
false
*/
class _Main {
    static var sv = 0 && 0;
    var mv = 0 && 0;
    static function main(args : string[]) : void {
        var l = 0 && 0;
        log l;
        log _Main.sv;
        log (new _Main).mv;
    }
}
