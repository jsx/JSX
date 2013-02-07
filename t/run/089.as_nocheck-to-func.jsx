/*EXPECTED
hello
detected invalid cast, value is not a function or null
        _Main.say(_Main.ng() as __noconvert__ function () : void);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return function () : void {
            log "hello";
        };
    }
    static function ng() : variant {
        return {} : Map.<string>;
    }
    static function say(f : function () : void) : void {
        f();
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ function () : void);
        _Main.say(_Main.ng() as __noconvert__ function () : void);
    }
}
// vim: set expandtab:
