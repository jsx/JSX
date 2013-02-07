/*EXPECTED
abc
detected invalid cast, value is not a string
        _Main.say(_Main.ng() as __noconvert__ string);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return "abc";
    }
    static function ng() : variant {
        return [1];
    }
    static function say(s : string) : void {
        log s;
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ string);
        _Main.say(_Main.ng() as __noconvert__ string);
    }
}
// vim: set expandtab:
