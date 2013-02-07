/*EXPECTED
42
assertion failure
        assert i == 0;
                 ^^
*/
class _Main {
    static function main(args : string[]) : void {
        var i = 42;

        assert i == 42;

        log i;

        assert i == 0;

        log i;
    }
}
// vim: set expandtab:
