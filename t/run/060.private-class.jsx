/*EXPECTED
importing:say
imported:say
importing:initialize
importing:initialize
imported:initialize
imported:initialize
*/

import "060.private-class/imported.jsx";

class _Private {
	function initialize() {
		log "importing:initialize";
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
