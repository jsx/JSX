/*EXPECTED
3
null
null access
        log a + b;
                ^

*/
class _Main {
    static function main(args : string[]) : void {
        var a : Nullable.<number> = 3;
        var b : Nullable.<number> = null;
        log a;
        log b; // check that something indicatinng "null" is being printed
        log a + b;
    }
}

// vim: set expandtab:
