// from shibukawa:Octavia

/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize unclassify
*/

final class Char
{
	var whitespace : Map.<boolean>;

	function constructor()
	{
		this.whitespace = this._charClass();
	}

	function _charClass () : Map.<boolean>
	{
		return new Map.<boolean>;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var c = new Char;
		log "foo";
	}
}
