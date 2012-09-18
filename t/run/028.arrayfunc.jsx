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
0,1,2,3,4,5,6,7
7,6,5,4,3,2,1,0
*/
class _Main {
	static function reverse_cmp(x : Nullable.<number>, y : Nullable.<number>) : number {
		return y - x;
	}

	static function main(args : string[]) : void {
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
		log [ 0, 2, 4, 6, 7, 5, 3, 1 ].sort().join();
		log [ 0, 2, 4, 6, 7, 5, 3, 1 ].sort(_Main.reverse_cmp).join();
	}
}
