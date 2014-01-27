import "A";
import "B";

class Importer {
	static function say() : void {
		A.say();
		B.say();
	}
}
