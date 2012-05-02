/*EXPECTED
importing#say
imported#say
*/

import "js.jsx"; // FIXME only run this test on js emitter
import "064.JSX_file/foo.jsx";

class _Private {
	static function say() : void {
		log "importing#say";
	}
}

class Test {
	static function run() : void {
		var doit = (function () : function (: string) : void {
			var jsx = js.global["JSX"] as __nocheck__ Hash.<variant>;
			var fileFunc = jsx["file"] as __nocheck__ function (: string) : Hash.<variant>;
			return function (path : string) : void {
				var klass = fileFunc(path)["_Private"] as __nocheck__ Hash.<variant>;
				var say = klass["say$"] as __nocheck__ function () : void;
				say();
			};
		})();
		doit("t/run/064.JSX_file.jsx");
		doit("t/run/064.JSX_file/foo.jsx");
	}
}
