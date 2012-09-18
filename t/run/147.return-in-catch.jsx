/*EXPECTED
true
false
*/

class _Main {
	static function f(b : boolean) : boolean {
    		try {
			if (b) throw new Error("Hmm");
    		} catch (e : Error) {
        		return false;
    		}
		return true;
	}
	static function main(args : string[]) : void {
		var b = _Main.f(false);
		log b;
		var b = _Main.f(true);
		log b;
	}
}
