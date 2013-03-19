/*EXPECTED
6
*/
class _Main {
    static function main(args : string[]) : void {
        var a = new string[];
        a.push(_Main.b(), _Main.b());
        a.push(_Main.b(),"foo");
        a.push("foo", _Main.b());
        log a.length;
    }

    static function b() : Nullable.<string> {
        return null;
    }
}
// vim: set expandtab:
