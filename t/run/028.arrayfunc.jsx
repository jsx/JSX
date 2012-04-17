/*EXPECTED
3,1,4
1,2,3
a,b,c
1:2:3
2
1
undefined
1
5
undefined
*/
class Test {
	static function run() : void {
		log [ 3, 1, 4 ].toString();
		log [ 1 ].concat([ 2, 3 ]).toString();
		log [ "a", "b", "c" ].join();
		log [ 1, 2, 3 ].join(":");
		var a = [ 1, 2 ];
		log a.pop();
		log a.pop();
		log a.pop();
		log a.push(5);
		log a.shift();
		log a.shift();
	}
}
