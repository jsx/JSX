/*EXPECTED
meth
meth
meth
meth
meth
*/
class _Main {
	function meth() : void {
		log "meth";
	}
	function clone() : __CLASS__ {
		return new __CLASS__();
	}
	function cloneAsArray() : Array.<__CLASS__> {
		return [ new __CLASS__() ];
	}
	static function doit(ref : __CLASS__) : void {
		ref.meth();
	}
	static function main(args : string[]) : void {
		var m1 : __CLASS__;
		var m1 = new _Main();
		m1 = new __CLASS__();
		m1.meth();
		m1 = m1.clone();
		__CLASS__.doit(m1);
		m1.clone().meth();
		([ new __CLASS__() ])[0].meth();
		m1.cloneAsArray()[0].meth();
	}
}
