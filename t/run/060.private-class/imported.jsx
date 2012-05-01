class _Private {
	function initialize() {
		log "imported:initialize";
	}
	static function say() : void {
		log "imported:say";
	}
}

class Imported extends _Private {
	static function instantiatePrivate() : void {
		new _Private();
	}
	static function say() : void {
		_Private.say();
	}
}
