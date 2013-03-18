/*EXPECTED
null
*/
class _Main {
    static function main(args : string[]) : void {
        var a = new string[];
        a.push(_Main.b());
        log a[0];
    }

    static function b() : Nullable.<string> {
        return null;
    }
}
// vim: set expandtab:
