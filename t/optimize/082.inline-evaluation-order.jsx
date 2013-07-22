/*EXPECTED
rgb(25,30,35)
*/

/*JSX_OPTS
--optimize inline
*/
// taken from jsx-v8bench/raitrace.jsx


final class Color {

    var red     = 0.0;
    var green   = 0.0;
    var blue    = 0.0;

    function constructor() {
        this(0.0, 0.0, 0.0);
    }

    function constructor(r : number, g : number, b : number) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }

    static function add(c1 : Color, c2 : Color) : Color {
        var result = new Color(0,0,0);

        result.red = c1.red + c2.red;
        result.green = c1.green + c2.green;
        result.blue = c1.blue + c2.blue;

        return result;
    }

    static function addScalar(c1 : Color, s : number) : Color {
        var result = new Color(0,0,0);

        result.red = c1.red + s;
        result.green = c1.green + s;
        result.blue = c1.blue + s;

        result.limit();

        return result;
    }

    static function subtract(c1 : Color, c2 : Color) : Color {
        var result = new Color(0,0,0);

        result.red = c1.red - c2.red;
        result.green = c1.green - c2.green;
        result.blue = c1.blue - c2.blue;

        return result;
    }

    static function multiply(c1 : Color, c2 : Color) : Color {
        var result = new Color(0,0,0);

        result.red = c1.red * c2.red;
        result.green = c1.green * c2.green;
        result.blue = c1.blue * c2.blue;

        return result;
    }

    static function multiplyScalar(c1 : Color, f : number) : Color {
        _Main.global.color = new Color(0.5, 0.5, 0.5); // XXX affects global env
        var result = new Color(0,0,0);

        result.red = c1.red * f;
        result.green = c1.green * f;
        result.blue = c1.blue * f;

        return result;
    }

    static function divideFactor(c1 : Color, f : number) : Color {
        var result = new Color(0,0,0);

        result.red = c1.red / f;
        result.green = c1.green / f;
        result.blue = c1.blue / f;

        return result;
    }

    function limit() : void {
        this.red = (this.red > 0.0) ? ( (this.red > 1.0) ? 1.0 : this.red ) : 0.0;
        this.green = (this.green > 0.0) ? ( (this.green > 1.0) ? 1.0 : this.green ) : 0.0;
        this.blue = (this.blue > 0.0) ? ( (this.blue > 1.0) ? 1.0 : this.blue ) : 0.0;
    }

    function distance(color : Color) : number {
        var d = Math.abs(this.red - color.red) + Math.abs(this.green - color.green) + Math.abs(this.blue - color.blue);
        return d;
    }

    static function blend(c1 : Color, c2 : Color, w : number) : Color {
        var result = new Color(0,0,0);
        result = Color.add(
            Color.multiplyScalar(c1, 1 - w),
            Color.multiplyScalar(c2, w)
        );
        return result;
    }

    function brightness() : number {
        var r = Math.floor(this.red*255);
        var g = Math.floor(this.green*255);
        var b = Math.floor(this.blue*255);
        return (r * 77 + g * 150 + b * 29) >> 8;
    }

    override function toString() : string {
        var r = Math.floor(this.red*255);
        var g = Math.floor(this.green*255);
        var b = Math.floor(this.blue*255);

        return "rgb("+ r as string +","+ g as string +","+ b as string +")";
    }
}

final class _Main {
  var color = new Color(0.10, 0.20, 0.30);
  var reflection = 0.1;

  static var global : _Main;

  static function main(args : string[]) : void {
    var o = new _Main;
    _Main.global = o;

    var color = new Color(0.10, 0.11, 0.12);

    color = Color.blend(
        color,
        o.color,
        o.reflection
    );
    log color.toString();
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
