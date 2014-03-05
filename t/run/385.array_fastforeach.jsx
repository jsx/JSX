/*EXPECTED
0,2,3
0,-1,2,3
*/
class _Main {
	static function main(args : string[]) : void {
		var input = [0];
		input[2] = 2;
		input[3] = 3;
		var output = new number[];
		input.forEach((n) -> {
			output.push(n);
		});
		log output.join(",");
		output.splice(0, output.length);
		input._forEach((n) -> {
			output.push(n != null ? n : -1);
		});
		log output.join(",");
	}
}
