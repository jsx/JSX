/*
 * Point class
 *
 * Usage:
 *  var p = new Point(10, 20);
 *  log p.getX(); // 10
 *  log p.getY(); // 20
 */
class Point {
    var _x;
    var _y;

    function initialize(x, y) {
        this._x = x;
        this._y = y;
    }

    // getters
    function getX() {
        return this._x;
    }
    function getY() {
        return this._y;
    }
    
    // setters
    function setX(value :number) {
        this._x = value;
    }
    function setY(value :number) {
        this._y = value;
    }
}
// vim: set ft=javascript:
