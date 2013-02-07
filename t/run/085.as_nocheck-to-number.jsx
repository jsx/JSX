/*EXPECTED
3
detected invalid cast, value is not a number
        _Main.say(_Main.ng() as __noconvert__ number);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return 3;
    }
    static function ng() : variant {
        return false;
    }
    static function say(b : number) : void {
        log b;
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ number);
        _Main.say(_Main.ng() as __noconvert__ number);
    }
}
// vim: set expandtab:
