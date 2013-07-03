/*EXPECTED
*/
/*JSX_OPTS
--optimize strip
*/
native class Native {
} = "console.log('should never be called')";

class _Main {
    static function main(args : string[]) : void {
    }
}
