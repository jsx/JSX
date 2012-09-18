/*EXPECTED
for
while
do-while
*/

class _Main {
	static function main(args : string[]) : void {
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
