/*EXPECTED
true
true
true
true
true
true
false
true
true
*/
class Test {
	static function run() : void {
		var s1 = "abc", s2 = "abc";
		var S1 = new String(s1), S2 = new String(s2);
		log S1 <= S2;
		log s1 <= S2;
		log S1 <= s2;
		log S1 >= S2;
		log s1 >= S2;
		log S1 >= s2;
		log S1 == S2;
		log s1 == S2;
		log S1 == s2;
	}
}
