/*EXPECTED
Hi!
*/
/*JSX_OPTS
--optimize strip
*/
native("(console.log('Hi!'), function () {})") class Native {
}
class _Main {
    static function main(args : string[]) : void {
        var a = [ new Object ];
        try {
            log (a[0] as Native) != null;
        } catch (e : Error) {
        }
    }
}
