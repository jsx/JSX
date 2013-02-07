/*EXPECTED
world
detected invalid cast, value is not a Map or null
        _Main.say(_Main.ng() as __noconvert__ Map.<string>);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return { hello: "world" };
    }
    static function ng() : variant {
        return "good bye";
    }
    static function say(h : Map.<string>) : void {
        log h["hello"];
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ Map.<string>);
        _Main.say(_Main.ng() as __noconvert__ Map.<string>);
    }
}
// vim: set expandtab:
