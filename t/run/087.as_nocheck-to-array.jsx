/*EXPECTED
1,2,3
detected invalid cast, value is not an Array or null
        _Main.say(_Main.ng() as __noconvert__ number[]);
                             ^^
*/

class _Main {
    static function ok() : variant {
        return [ 1, 2, 3 ];
    }
    static function ng() : variant {
        return {} : Map.<string>;
    }
    static function say(a : number[]) : void {
        log a.join(",");
    }
    static function main(args : string[]) : void {
        _Main.say(_Main.ok() as __noconvert__ number[]);
        _Main.say(_Main.ng() as __noconvert__ number[]);
    }
}
// vim: set expandtab:
