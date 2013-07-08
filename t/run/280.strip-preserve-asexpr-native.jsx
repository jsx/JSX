/*EXPECTED
Hi!
*/
/*JSX_OPTS
--optimize strip
*/
native class Native {
} = "(console.log('Hi!'), function () {})";

class _Main {
    static function main(args : string[]) : void {
        var a = [ new Object ];
        try {
            log (a[0] as Native) != null;
        } catch (e : Error) {
        }
    }
}
