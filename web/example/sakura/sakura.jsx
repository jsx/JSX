// Curvature Sakura
//
// originated from http://jsdo.it/sasaplus1/yREo,
// which is forked from http://jsdo.it/totetero/sakura

import "js/web.jsx";
import "timer.jsx";

class Config {
  static const NUMBER_OF_PETALS = 24;

  // min/max size of a sakura petal
  static const MIN_SIZE   =  5;
  static const SIZE_RANGE = 15;

  static const TEXTURE_FILE = "sakura.png";

  static const STAGE_WIDTH  = 400; // dom.window.innerWidth
  static const STAGE_HEIGHT = 400; // dom.window.innerHeight

}

final class Sakura {

  var x : number;
  var y : number;
  var vx : number;
  var vy : number;
  var size : number;

  var rotq0 = [0, 0, 0, 1];
  var rotq1 = [0, 0, 0, 1];

  function constructor(size : int, width : int, height : int) {
    this.size = size;
    this.init(width, height);
  }

  function randq(q : Array.<number>, rot : number) : void {

    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;
    var r  = x * x + y * y + z * z;

    if (r == 0) {
      x = r = 1;
      y = z = 0;
    }

    var s = Math.sin(rot) / Math.sqrt(r);

    q[0] = x * s;
    q[1] = y * s;
    q[2] = z * s;
    q[3] = Math.cos(rot);
  }

  function init(width : int, height : int) : void {

    if (Math.random() > 0.5) {
      this.x = Math.random() * width;
      this.y = 0 - this.size;
    } else {
      this.x = 0 - this.size;
      this.y = Math.random() * height;
    }

    this.vx = (Math.random() * 1.5 + 2.5) * this.size / 20;
    this.vy = (Math.random() * 1.5 + 0.5) * this.size / 20;

    this.randq(this.rotq0, Math.random() * Math.PI);
    this.randq(this.rotq1, Math.random() * 0.1);
  }

  function update(width : int, height : int) : void {

    this.x += this.vx;
    this.y += this.vy;

    if (this.x > width + this.size || this.y > height + this.size) {
      this.init(width, height);
    }

    if (Math.random() > 0.95) {
      this.randq(this.rotq1, Math.random() * 0.1);
    }

    var qax = this.rotq0[0];
    var qay = this.rotq0[1];
    var qaz = this.rotq0[2];
    var qaw = this.rotq0[3];

    var qbx = this.rotq1[0];
    var qby = this.rotq1[1];
    var qbz = this.rotq1[2];
    var qbw = this.rotq1[3];

    this.rotq0[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
    this.rotq0[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
    this.rotq0[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
    this.rotq0[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;

  }

}

final class Stage {

  // the stage width and height
  var width : number;
  var height : number;

  // the render context of the stage
  var context: CanvasRenderingContext2D;

  // data of petal
  var canvasdat : ImageData;
  // data of texture
  var imgdat : ImageData;

  // petals for sakura-fubuki
  var sakura = new Array.<Sakura>();

  function constructor(canvas : HTMLCanvasElement, imgdat : ImageData) {
    assert canvas != null;
    assert imgdat != null;

    this.width  = canvas.width  = Config.STAGE_WIDTH;
    this.height = canvas.height = Config.STAGE_HEIGHT;

    this.context   = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasdat = this.context.createImageData(this.width, this.height);
    this.imgdat = imgdat;

    var sakuraPosXMax = 0;
    var sakuraPosYMax = 0;

    for (var i = 0; i < Config.NUMBER_OF_PETALS; ++i) {
      this.sakura[i] = new Sakura((
        (Math.random() * Config.SIZE_RANGE) + Config.MIN_SIZE) as int,
        this.width, this.height);

      if (this.sakura[i].x > sakuraPosXMax) {
        sakuraPosXMax = this.sakura[i].x;
      }

      if (this.sakura[i].y > sakuraPosYMax) {
        sakuraPosYMax = this.sakura[i].y;
      }
    }

    for (i = 0; i < Config.NUMBER_OF_PETALS; ++i) {
      this.sakura[i].x -= sakuraPosXMax + 50;
    }

    this.sakura.sort(function (a, b) {
      return a.size - b.size;
    });

  }

  function clear(): void {
    var data = this.canvasdat.data;
    for(var i = 0; i < this.height; i++){
      for(var j = 0; j < this.width; j++){
        var index = i * this.width + j;
        data[index * 4 + 0] = 0;
        data[index * 4 + 1] = 0;
        data[index * 4 + 2] = 0;
        data[index * 4 + 3] = 255;
      }
    }
  }

  function drawTexture(gray : number, x : number, y : number, z : number, q : Array.<number>, index: number) : void {

    var ix =  q[3] * x + q[1] * z - q[2] * y;
    var iy =  q[3] * y + q[2] * x - q[0] * z;
    var iz =  q[3] * z + q[0] * y - q[1] * x;
    var iw = -q[0] * x - q[1] * y - q[2] * z;

    x = ix * q[3] - iw * q[0] - iy * q[2] + iz * q[1];
    y = iy * q[3] - iw * q[1] - iz * q[0] + ix * q[2];
    z = iz * q[3] - iw * q[2] - ix * q[1] + iy * q[0];

    var u = Math.atan2(z, x) / Math.PI;

    if(0 <= u && u <= 1){

      var v = Math.acos(y) / Math.PI;

      u = ((1 - u) * this.imgdat.height) as int;
      v = ((1 - v) * this.imgdat.width) as int;

      var index2 = v * this.imgdat.width + u;

      if (this.imgdat.data[index2 * 4 + 3] > 128) {
        var dst = this.canvasdat.data;
        var src = this.imgdat.data;

        dst[index * 4 + 0] = src[index2 * 4 + 0] * gray;
        dst[index * 4 + 1] = src[index2 * 4 + 1] * gray;
        dst[index * 4 + 2] = src[index2 * 4 + 2] * gray;
      }
    }
  }

  function drawSakura(x0 : number, y0 : number, q : Array.<number>, size : number) : void {

    var xmin = x0 - size;
    var xmax = x0 + size;
    var ymin = y0 - size;
    var ymax = y0 + size;

    for (var i = ymin; i < ymax; i++) {

      if (i < 0) {
        continue;
      } else if (i >= this.height) {
        break;
      }

      for (var j = xmin; j < xmax; j++) {

        if (j < 0) {
          continue;
        } else if (j >= this.width) {
          break;
        }

        var index = i * this.width + j;
        var x = (j - x0) / size;
        var y = (i - y0) / size;
        var r = x * x + y * y;

        if (r <= 1) {
          var z = Math.sqrt(1 - r);
          this.drawTexture(0.4, x, y, -z, q, index);
          this.drawTexture(1.0, x, y,  z, q, index);
        }
      }
    }

    this.drawSphere(x0, y0, q, size);

  }

  function drawSphere(x0 : number, y0 : number, q : Array.<number>, size : number) : void {

    var x1 = x0 + (size * 1.6 * (q[0] * q[2] - q[1] * q[3])) as int;
    var y1 = y0 + (size * 1.6 * (q[0] * q[3] + q[1] * q[2])) as int;

    var xmin = x1 - size;
    var xmax = x1 + size;
    var ymin = y1 - size;
    var ymax = y1 + size;

    var data = this.canvasdat.data;
    for (var i = ymin; i < ymax; i++) {

      if (i < 0) {
        continue;
      } else if (i >= this.height) {
        break;
      }

      for (var j = xmin; j < xmax; j++) {

        if (j < 0) {
          continue;
        } else if (j >= this.width) {
          break;
        }

        var index = i * this.width + j;
        var x = (j - x1) / size;
        var y = (i - y1) / size;
        var r = 128 * (1 - (x * x + y * y));

        if (r > 0) {
          data[index * 4 + 0] += r;
          data[index * 4 + 1] += r;
          data[index * 4 + 2] += r;
        }
      }
    }
  }

  function tick(): void {

    this.clear();

    var len = this.sakura.length;
    for (var i = 0; i < len; ++i) {
      var s = this.sakura[i];
      s.update(this.width, this.height);

      this.drawSakura(
        s.x as int,
        s.y as int,
        s.rotq0,
        s.size);
    }

    this.context.putImageData(this.canvasdat, 0, 0);

  }

}

final class _Main {

  static function main(args : string[]) : void {
    // load textrue data and start main loop
    var img = dom.createElement('img') as HTMLImageElement;
    img.addEventListener("load", function (event) {

      var texture = dom.createElement('canvas') as HTMLCanvasElement;
      var context = texture.getContext('2d') as CanvasRenderingContext2D;

      texture.width = texture.height = 256;
      context.drawImage(img, 0, 0, texture.width, texture.height);

      var world      = dom.id("world") as HTMLCanvasElement;
      var texturedat = context.getImageData(0, 0, texture.width, texture.height);

      var stage = new Stage(world, texturedat);

      (function callTick(timeToCall : number) : void {
        stage.tick();

        Timer.requestAnimationFrame(callTick);
      }(0));
    });
    img.src = Config.TEXTURE_FILE;
  }

}

// vim: set expandtab :
// vim: set tabstop=2 :
// vim: set shiftwidth=2 :
