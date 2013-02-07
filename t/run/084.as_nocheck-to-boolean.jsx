/*EXPECTED
true
detected invalid cast, value is not a boolean
        _Main.say(_Main.ng() as __noconvert__ boolean);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return true;
    }
    static function ng() : variant {
        return null;
    }
    static function say(b : boolean) : void {
        log b;
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ boolean);
        _Main.say(_Main.ng() as __noconvert__ boolean);
    }
}
// vim: set expandtab:
