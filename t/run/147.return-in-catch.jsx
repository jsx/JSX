/*EXPECTED
true
false
*/

class Test {
	static function f(b : boolean) : boolean {
    		try {
			if (b) throw new Error("Hmm");
    		} catch (e : Error) {
        		return false;
    		}
		return true;
	}
	static function run() : void {
		var b = Test.f(false);
		log b;
		var b = Test.f(true);
		log b;
	}
}
