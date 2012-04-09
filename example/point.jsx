/*
 * Point class
 *
 * Usage:
 *  var p = new Point(10, 20);
 *  log p.getX(); // 10
 *  log p.getY(); // 20
 */
class Point {
    var _x : number;
    var _y : number;

    function initialize() {
    }

    function initialize(x:number, y:number) {
        this._x = x;
        this._y = y;
    }

    // getters
    function getX():number {
        return this._x;
    }
    function getY():number {
        return this._y;
    }
    
    // setters
    function setX(value :number):void {
        this._x = value;
    }
    function setY(value :number):void {
        this._y = value;
    }
}
// vim: set ft=javascript:
