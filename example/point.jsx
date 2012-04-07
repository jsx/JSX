/*
 * Point class
 *
 * Usage:
 *  var p = new Point(10, 20);
 *  log p.x; // 10
 *  log p.y; // 20
 */
class Point {
    var _x;
    var _y;

    function initialize(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    // getters
    function get x() {
        return this._x;
    }
    function get y() {
        return this._y;
    }
    
    // setters
    function set x(value :number) {
        this._x = value;
    }
    function set y(value :number) {
        this._y = value;
    }
}
// vim: set ft=javascript:
