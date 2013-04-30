/*JSX_OPTS
--minify
*/
/*EXPECTED
abc
123
*/

import "js.jsx";

__export__ class _Main {
    __export__ var longlong = 123;
    __export__ static var longlong = "abc";
    static function main(args : string[]) : void {
        js.eval("console.log(JSX.require('t/run/262.export-vars.jsx')._Main.longlong)");
        js.eval("console.log((new (JSX.require('t/run/262.export-vars.jsx')._Main)).longlong)");
    }
}

