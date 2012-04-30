/*EXPECTED
foo
42
*/

class Pair.<FirstType, SecondType> {
	var first  :FirstType;
	var second :SecondType;

    function initialize(first :FirstType, second :SecondType) {
        this.first  = first;
        this.second = second;
    }
}

class Test {
	static function run() : void {
		var pair = new Pair.<string, int>("foo", 42);

        log pair.first;
        log pair.second;
	}
}
