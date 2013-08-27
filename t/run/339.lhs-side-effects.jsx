/*EXPECTED
get foo
get foo
21
*/

native class N {
  static var foo : int;
} = "Object.defineProperty({_v: 43}, 'foo', { get: function() { console.log('get foo'); return this._v; }, set: function(v) { this._v = v; } })";

class _Main {
  static function main(args : string[]) : void {
    N.foo /= 2;
    log N.foo;
  }
}

// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
