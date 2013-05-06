/*EXPECTED
false
*/
/*JSX_OPTS
--optimize unbox
*/
final class _Main {
    static function main(args : string[]) : void {
        var o = new Object;
        log o instanceof _Main; // side effect to preserve "o"
    }
}
