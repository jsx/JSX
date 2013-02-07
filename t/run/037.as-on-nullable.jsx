/*EXPECTED
false
false
0
0
false

true
true
1
1
true

0
false
0
0
0

2
true
2
2
2

0
false
0
0
0

1.5
true
1
1.5
1.5


false
0
0


abc
true
0
NaN
abc

null access
        log s as string;
            ^

*/
class _Main {
    static function main(args : string[]) : void {
        var b : Nullable.<boolean> = false;
        log b;
        log b as boolean;
        log b as int;
        log b as number;
        log b as string;
        log "";
        b = true;
        log b;
        log b as boolean;
        log b as int;
        log b as number;
        log b as string;
        log "";
        var i : Nullable.<int> = 0;
        log i;
        log i as boolean;
        log i as int;
        log i as number;
        log i as string;
        log "";
        i = 2;
        log i;
        log i as boolean;
        log i as int;
        log i as number;
        log i as string;
        log "";
        var n : Nullable.<number> = 0;
        log n;
        log n as boolean;
        log n as int;
        log n as number;
        log n as string;
        log "";
        n = 1.5;
        log n;
        log n as boolean;
        log n as int;
        log n as number;
        log n as string;
        log "";
        var s : Nullable.<string> = "";
        log s;
        log s as boolean;
        log s as int;
        log s as number;
        log s as string;
        log "";
        s = "abc";
        log s;
        log s as boolean;
        log s as int;
        log s as number;
        log s as string;
        log "";
        s = null;
        // use of s should emit "null access" (as assertion)
        log s as string;
    }
}
// vim: set expandtab:
