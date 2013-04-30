/*JSX_OPTS
--minify
*/
/*EXPECTED
function
undefined
undefined
function
number
undefined
undefined
number
function
undefined
undefined
function
number
undefined
undefined
number
*/
import "js.jsx";

__export__ class C {
  function mf() : void {
  }
  __noexport__ function mf2() : void {
  }
  function _mf() : void {
  }
  __export__ function _mf2() : void {
  }

  var mv = 123;
  __noexport__ var mv2 = "not accessible";
  var _mv = "not accessible";
  __export__ var _mv2 = 456;

  static function sf() : void {
  }
  __noexport__ function sf2() : void {
  }
  static function _sf() : void {
  }
  __export__ static function _sf2() : void {
  }

  static var sv = 123;
  __noexport__ static var sv2 = "not accessible";
  static var _sv = "not accessible";
  __export__ static var _sv2 = 123;
}

class _Main {
  static function main(args : string[]) : void {
    var o = js.eval("new (JSX.require('t/run/261.export-rule.jsx').C)");
    log typeof o["mf"];
    log typeof o["mf2"];
    log typeof o["_mf"];
    log typeof o["_mf2"];
    log typeof o["mv"];
    log typeof o["mv2"];
    log typeof o["_mv"];
    log typeof o["_mv2"];
    var c = js.eval("JSX.require('t/run/261.export-rule.jsx').C");
    log typeof c["sf"];
    log typeof c["sf2"];
    log typeof c["_sf"];
    log typeof c["_sf2"];
    log typeof c["sv"];
    log typeof c["sv2"];
    log typeof c["_sv"];
    log typeof c["_sv2"];
  }
}
