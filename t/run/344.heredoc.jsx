/*EXPECTED
hello world!
hello world!

hello world! 2

a
'''''
"b"\c"""
hmm""""
a
"""""
'b'\c'''
hmm''''
*/
class _Main {
	static function main(args : string[]) : void {
		log '''hello world!''';
		log """hello world!""";
		log """
hello world! 2
""";
		log """a
'''''
"b\"\\c\"""
hmm\"""\"""";
                log '''a
"""""
'b\'\\c\'''
hmm\'''\'''';

	}
}
