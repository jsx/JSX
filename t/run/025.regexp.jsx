/*EXPECTED
--RegExp--
exec [0]: ar
exec [1]: r
test: true
test: false
source: a(.)
global: false
ignoreCase: false
multiline: false
lastIndex: 0
global: true
ignoreCase: true
multiline: true
*/
class _Main {
	static function main(args : string[]) : void {
		log "--RegExp--";

		var rx = new RegExp("a(.)");

		log 'exec [0]: ' + rx.exec("foobar")[0];
		log 'exec [1]: ' + rx.exec("foobar")[1];

		log 'test: ' + rx.test("foobar").toString();
		log 'test: ' + rx.test("xxx").toString();

		log 'source: ' + rx.source.toString();
		log 'global: ' + rx.global.toString();
		log 'ignoreCase: ' + rx.ignoreCase.toString();
		log 'multiline: ' + rx.multiline.toString();
		log 'lastIndex: ' + rx.lastIndex.toString();

		rx = new RegExp("abc", "gim");
		log 'global: ' + rx.global.toString();
		log 'ignoreCase: ' + rx.ignoreCase.toString();
		log 'multiline: ' + rx.multiline.toString();
	}
}
