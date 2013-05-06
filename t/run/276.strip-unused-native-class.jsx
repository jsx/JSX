/*EXPECTED
*/
/*JSX_OPTS
--optimize strip
*/
native("console.log('should never be called')") class Native {
}
class _Main {
    static function main(args : string[]) : void {
    }
}
