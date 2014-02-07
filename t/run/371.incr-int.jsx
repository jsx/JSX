/*EXPECTED
0
1
1
1
2
2147483647
2147483647
-2147483648
2147483647
-2147483648
-2147483648
-2147483648
-2147483648
2147483647
-2147483648
2147483647
2147483647
*/
class _Main {
    static function main(args : string[]) : void {
        var i : int = 0;
        log i;
        log ++i;
        log i;
        log i++;
        log i;
        i = 0x7fffffff;
        log i;
        log i++;
        log i;
        i = 0x7fffffff;
        log i;
        log ++i;
        log i;
        i = 0x80000000;
        log i;
        log i--;
        log i;
        i = 0x80000000;
        log i;
        log --i;
        log i;
    }
}
