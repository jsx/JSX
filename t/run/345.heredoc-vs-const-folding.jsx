/*JSX_OPTS
--optimize fold-const
*/
/*EXPECTED
abcdef
xyz
*/
import "console.jsx";
class _Main {
    static function main(args : string[]) : void {
        console.log("abc" + """def
xyz""");
    }
}
