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
			var jsx = js.global["JSX"] as Hash.<variant>;
			var fileFunc = jsx["file"] as function (: string) : Hash.<variant>;
			return function (path : string) : void {
				var klass = fileFunc(path)["_Private"] as Hash.<variant>;
				var say = klass["say$"] as function () : void;
				say();
			};
		})();
		doit("t/run/064.JSX_file.jsx");
		doit("t/run/064.JSX_file/foo.jsx");
	}
}
