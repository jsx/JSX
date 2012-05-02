/*EXPECTED
importing:say
imported:say
importing:constructor
importing:constructor
imported:constructor
imported:constructor
*/

import "060.private-class/imported.jsx";

class _Private {
	function constructor() {
		log "importing:constructor";
	}
	static function say() : void {
		log "importing:say";
	}
}

class Test extends _Private {
	static function run() : void {
		_Private.say();
		Imported.say();
		new _Private();
		new Test();
		Imported.instantiatePrivate();
		new Imported();
	}
}
