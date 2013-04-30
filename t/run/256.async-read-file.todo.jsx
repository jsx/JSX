/*EXPECTED
Hello
*/
import "js/nodejs.jsx";

class _Main {

	static function main (args : string[]) : void {

		var task = node.fs.readFileAsync("256.async-read-file/hello.txt", "utf-8");

		task.await();

		log task.getResult();

	}

}