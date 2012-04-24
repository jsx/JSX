/*EXPECTED
1.5
2.5
true
null
false
3
2
*/
class Test {
	static function run() : void {
		var p : number = (1.5).valueOf();
		log p;
		var o = new Number(2.5);
		p = o.valueOf();
		log p;
		log p == o;
		o = null;
		log o;
		log p == o;
		log 1 + new Number(2);
		log new Number(3) - 1;
	}
}
