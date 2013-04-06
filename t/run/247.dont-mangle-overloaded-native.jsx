/*EXPECTED
124
457
hello world
*/
/*JS_SETUP
function Native() {}
*/
import "js.jsx";

native class Native {
    function doit(n : number) : number;
}

class _Main extends Native {
    override function doit(n : number) : number {
        return n + 1;
    }
    function doit(s : string) : string {
        return s + " world";
    }
    static function main(args : string[]) : void {
        var o = new _Main;
        log o.doit(123);
        var n : Native = o;
        log n.doit(456);
        log o.doit("hello");
    }
}
