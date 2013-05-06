/*EXPECTED
Hi!
Ciao!
*/
/*JSX_OPTS
--optimize strip
*/
native("(console.log('Hi!'), console)") class Console {
    delete function constructor();
    static function log(s : string) : void {
        log s;
    }
}
class _Main {
    static function main(args : string[]) : void {
        Console.log("Ciao!");
    }
}
