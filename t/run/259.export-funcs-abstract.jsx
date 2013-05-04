/*EXPECTED
hello
goodbye
*/

import "js.jsx";

abstract class BaseClass {
    abstract __export__ function hello() : void;
}

interface BaseInterface {
    __export__ function goodbye() : void;
}

class _Main extends BaseClass implements BaseInterface {
    override function hello() : void {
        log "hello";
    }
    override function goodbye() : void {
        log "goodbye";
    }
    static function main(args : string[]) : void {
        js.eval("(new (JSX.require('t/run/259.export-funcs-abstract.jsx')._Main)).hello()");
        js.eval("(new (JSX.require('t/run/259.export-funcs-abstract.jsx')._Main)).goodbye()");
    }
}

