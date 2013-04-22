/*EXPECTED
hello
*/

import "js.jsx";

abstract class Base {
    __export__ abstract function say() : void;
}

mixin Mixin {
    override function say() : void {
        log "hello";
    }
}

class _Main extends Base implements Mixin {
    static function main(args : string[]) : void {
        js.eval("(new (JSX.require('t/run/minify.export-funcs-in-mixin.jsx')._Main$)).say()");
    }
}

