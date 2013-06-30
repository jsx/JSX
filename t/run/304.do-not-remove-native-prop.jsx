/*EXPECTED
foo
bar
*/
native class A {
	static __readonly__ var propWithSideEffect : string;
} = "{ get propWithSideEffect() { console.log('foo'); return 'xxx'; } }";

class _Main {
	static function main (args : string[]) : void {
		A.propWithSideEffect;
		log "bar";
	}
}
