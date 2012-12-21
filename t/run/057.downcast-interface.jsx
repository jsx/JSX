/*EXPECTED
true
error
*/
interface I1 {
}
interface I2 implements I1 {
}
class CTrue implements I2 {
}
class CFalse implements I1 {
}
class _Main {
	static function main(args : string[]) : void {
		var i1 : I1 = new CTrue();
		var i2 : I2 = i1 as I2;
		log i2 != null;
		i1 = new CFalse();
		try {
			i2 = i1 as I2;
		} catch (e : Error) {
			log "error";
		}
	}
}
