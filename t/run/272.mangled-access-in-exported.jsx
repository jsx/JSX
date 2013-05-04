// checks that functions are exported in the old way even in __exported__ classes, unless --minify is specified

/*EXPECTED
constructor(:number)
mf()
constructor()
mf()
constructor(:number)
mf(:number)
sf()
sf()
sf(:number)
*/
/*JSX_OPTS
*/

import "js.jsx";

__export__ class _Main {
    __noexport__ function constructor() {
        log "constructor()";
    }
    function constructor(n : number) { // exported
        log "constructor(:number)";
    }
    function mf() : void { // exported
        log "mf()";
    }
    __noexport__ function mf(n : number) : void {
        log "mf(:number)";
    }
    static function sf() : void { // exported
        log "sf()";
    }
    __noexport__ static function sf(n : number) : void {
        log "sf(:number)";
    }
    static function main(args : string[]) : void {
        var fn = '"t/run/272.mangled-access-in-exported.jsx"';
        js.eval("(new (JSX.require(" + fn + ")._Main)).mf()");
        js.eval("(new (JSX.require(" + fn + ")._Main$)).mf$()");
        js.eval("(new (JSX.require(" + fn + ")._Main$N)(123)).mf$N()");
        js.eval("JSX.require(" + fn + ")._Main.sf()");
        js.eval("JSX.require(" + fn + ")._Main.sf$()");
        js.eval("JSX.require(" + fn + ")._Main.sf$N(123)");
    }
}
