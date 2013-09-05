/*EXPECTED
Hi
*/
native class K {
    delete function constructor () {}
    static function doit() : void;
} = "{ doit: function () { console.log('Hi'); } }";

class _Main {
    static function main (args : string[]) : void {
        K.doit();
    }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

