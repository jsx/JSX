/*EXPECTED
--Date--
new0: true
new1: 1336805439777
new2: 1335830400000
new3: 1336780800000
new4: 1336802400000
new5: 1336805400000
new6: 1336805439000
new7: 1336805439777
copy ctor: true
parse: true
UTC2: 1335830400000
UTC3: 1336780800000
UTC4: 1336802400000
UTC5: 1336805400000
UTC6: 1336805439000
UTC7: 1336805439777
toString: true
toDateString: true
toTimeString: true
toLocaleString: true
toLocaleDateString: true
toLocaleTimeString: true
getTime: true
getFullYear: 2012
getMonth: 4
getDate: 12
getDay: 6
getHours: 6
getMinutes: 50
getSeconds: 39
getMilliseconds: 777
getUTCFullYear: 2012
getUTCMonth: 4
getUTCDate: 12
getUTCDay: 6
getUTCHours: 6
getUTCMinutes: 50
getUTCSeconds: 39
getUTCMilliseconds: 777
setTime: true
setMilliseconds: true
setSeconds: true
setMinutes: true
setHours: true
setDate: true
setMonth: true
setFullYear: true
setUTCMilliseconds: true
setUTCSeconds: true
setUTCMinutes: true
setUTCHours: true
setUTCDate: true
setUTCMonth: true
setUTCFullYear: true
*/
class _Main {
	static function main(args : string[]) : void {
		var year  = 2012;
		var month = 4;
		var date  = 12;
		var hour  = 6;
		var min   = 50;
		var sec   = 39;
		var ms    = 777;

		var d = new Date(year, month, date, hour, min, sec, ms);
		var u = new Date(Date.UTC(year, month, date, hour, min, sec, ms));
		// e.g. 540 for JST-9
		var tz = d.getTimezoneOffset() * 60 * 1000;

		log "--Date--";
		log 'new0: '+((new Date()) != null).toString();
		log 'new1: '+((new Date(u)).valueOf()).toString();
		log 'new2: '+((new Date(year, month)).valueOf()-tz).toString();
		log 'new3: '+((new Date(year, month, date)).valueOf()-tz).toString();
		log 'new4: '+((new Date(year, month, date, hour)).valueOf()-tz).toString();
		log 'new5: '+((new Date(year, month, date, hour, min)).valueOf()-tz).toString();
		log 'new6: '+((new Date(year, month, date, hour, min, sec)).valueOf()-tz).toString();
		log 'new7: '+((new Date(year, month, date, hour, min, sec, ms)).valueOf()-tz).toString();

		log 'copy ctor: ' + (d.toString() == (new Date(d)).toString()).toString();

		log 'parse: ' + (Date.parse(d.toString()) > 0).toString();

		log 'UTC2: ' + ((Date.UTC(year, month)).valueOf()).toString();
		log 'UTC3: ' + ((Date.UTC(year, month, date)).valueOf()).toString();
		log 'UTC4: ' + ((Date.UTC(year, month, date, hour)).valueOf()).toString();
		log 'UTC5: ' + ((Date.UTC(year, month, date, hour, min)).valueOf()).toString();
		log 'UTC6: ' + ((Date.UTC(year, month, date, hour, min, sec)).valueOf()).toString();
		log 'UTC7: ' + ((Date.UTC(year, month, date, hour, min, sec, ms)).valueOf()).toString();

		log "toString: " + (d.toString().length != 0).toString();
		log "toDateString: " + (d.toDateString().length != 0).toString();
		log "toTimeString: " + (d.toTimeString().length != 0).toString();
		log "toLocaleString: " + (d.toLocaleString().length != 0).toString();
		log "toLocaleDateString: " + (d.toLocaleDateString().length != 0).toString();
		log "toLocaleTimeString: " + (d.toLocaleTimeString().length != 0).toString();

		log "getTime: " + (d.getTime() == d.valueOf()).toString();

		log 'getFullYear: ' + (d.getFullYear()).toString();
		log 'getMonth: ' + (d.getMonth()).toString();
		log 'getDate: ' + (d.getDate()).toString();

		log 'getDay: ' + (d.getDay()).toString();

		log 'getHours: ' + (d.getHours()).toString();
		log 'getMinutes: ' + (d.getMinutes()).toString();
		log 'getSeconds: ' + (d.getSeconds()).toString();
		log 'getMilliseconds: ' + (d.getMilliseconds()).toString();

		log 'getUTCFullYear: ' + (u.getUTCFullYear()).toString();
		log 'getUTCMonth: ' + (u.getUTCMonth()).toString();
		log 'getUTCDate: ' + (u.getUTCDate()).toString();

		log 'getUTCDay: ' + (u.getUTCDay()).toString();

		log 'getUTCHours: ' + (u.getUTCHours()).toString();
		log 'getUTCMinutes: ' + (u.getUTCMinutes()).toString();
		log 'getUTCSeconds: ' + (u.getUTCSeconds()).toString();
		log 'getUTCMilliseconds: ' + (u.getUTCMilliseconds()).toString();


		// setters
		// TODO: currently there're only signecure tests,
		//       threre have to feature tests when we have the
		//       native compiler
		log 'setTime: '+(d.setTime(d.valueOf()) > 0).toString();
		log 'setMilliseconds: '+(d.setMilliseconds(ms) > 0).toString();
		log 'setSeconds: '+(d.setSeconds(sec) > 0).toString();
		log 'setMinutes: '+(d.setMinutes(min) > 0).toString();
		log 'setHours: '+(d.setHours(hour) > 0).toString();
		log 'setDate: '+(d.setDate(date) > 0).toString();
		log 'setMonth: '+(d.setMonth(month) > 0).toString();
		log 'setFullYear: '+(d.setFullYear(year) > 0).toString();

		log 'setUTCMilliseconds: '+(d.setUTCMilliseconds(ms) > 0).toString();
		log 'setUTCSeconds: '+(d.setUTCSeconds(sec) > 0).toString();
		log 'setUTCMinutes: '+(d.setUTCMinutes(min) > 0).toString();
		log 'setUTCHours: '+(d.setUTCHours(hour) > 0).toString();
		log 'setUTCDate: '+(d.setUTCDate(date) > 0).toString();
		log 'setUTCMonth: '+(d.setUTCMonth(month) > 0).toString();
		log 'setUTCFullYear: '+(d.setUTCFullYear(year) > 0).toString();
	}
}
