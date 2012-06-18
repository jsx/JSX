/*EXPECTED
for
while
do-while
*/

class Test {
	static function run() : void {
		for (var i = 1; i; i = 0)
			log "for";
		i = 1;
		while (i--)
			log "while";
		i = 0;
		do
			log "do-while";
		while (i);
	}
}
