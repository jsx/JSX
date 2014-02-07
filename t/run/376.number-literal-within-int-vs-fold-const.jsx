/*JSX_OPTS
--optimize fold-const
*/
/*EXPECTED
2147483648
*/
class _Main {
	static function main(args : string[]) : void {
		// note: both literals are within in the range of INT, but they should be handled as number literals (IntegerLiteralExpression should never appear in source)
		log 2147483647 + 1;
	}
}
