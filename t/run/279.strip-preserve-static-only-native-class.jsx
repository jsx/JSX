/*EXPECTED
Hi!
Ciao!
*/
/*JSX_OPTS
--optimize strip
*/
native class Console {
    delete function constructor();
    static function log(s : string) : void {
        log s;
    }
} = "(console.log('Hi!'), console)";
class _Main {
    static function main(args : string[]) : void {
        Console.log("Ciao!");
    }
}
