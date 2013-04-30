/*EXPECTED
Hi!
*/

import "js.jsx";

__export__ class _Main {
    function constructor() {
        log "Hi!";
    }
    static function main(args : string[]) : void {
        js.eval("new (JSX.require('t/run/257.export-class.jsx')._Main)");
    }
}

