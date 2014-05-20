/*EXPECTED
3
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {

    static function fn(a : number) : void {
        a += 2;
        log a;
    }

    static function main(args : string[]) : void {
        _Main.fn(1);
    }
}
