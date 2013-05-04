/*EXPECTED
hello from static function
hello from method
*/

import "js.jsx";

class _Main {
    __export__ static function say() : void {
        log "hello from static function";
    }
    __export__ function say() : void {
        log "hello from method";
    }
    static function main(args : string[]) : void {
        js.eval("JSX.require('t/run/258.export-funcs.jsx')._Main.say()");
        js.eval("(new (JSX.require('t/run/258.export-funcs.jsx')._Main)).say()");
    }
}

