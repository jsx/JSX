/*EXPECTED
got error
got error
got error
got error
*/
/*JSX_OPTS
*/
class _T.<type> {
	function constructor(v : variant) {
		try {
			v as __noconvert__ type;
			log "function suceeded unexpected";
		} catch (e : Error) {
			log "got error";
		}
	}
}
class _Main {
	static function main(args : string[]) : void {
		new _T.<boolean>(null);
		new _T.<number>(null);
		new _T.<int>(null);
		new _T.<string>(null);
	}
}
