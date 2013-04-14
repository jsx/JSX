// Reversi ported from https://bitbucket.org/7shi/ts-reversi

import "js/web.jsx";

class Config {
  static const STAGE_WIDTH  = 320;
  static const STAGE_HEIGHT = 260;
}

class Board {
  var canvas : HTMLCanvasElement;
  var cx : CanvasRenderingContext2D;
  var board : number[][];
  var win : number[][];
  var player : number;
  var black : number;
  var white : number;
  var message : string;
  var ignore = false;
  var showWin = false;
  var think  : () -> void;

  function constructor(canvas : HTMLCanvasElement) {
    this.init();

    if (! canvas) return;

    this.canvas = canvas;
    this.cx = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.draw();

    this.think = () -> { this.thinkMonteCarlo(); };

    canvas.addEventListener("mousedown",
        (e) -> { this.onMouseDown(e as MouseEvent); });
  }

  function init() : void {
    this.board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.win = [
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[]
    ];
    this.player = 1;
    this.message = "";
    this.count();
  }

  function draw() : void {
    var cx = this.cx;
    cx.fillStyle = "green";
    cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    cx.strokeStyle = "black";

    for (var i = 0; i <= 8; i++) {
      cx.beginPath();
      cx.moveTo(i * 30 + 10,  10);
      cx.lineTo(i * 30 + 10, 250);
      cx.moveTo( 10, i * 30 + 10);
      cx.lineTo(250, i * 30 + 10);
      cx.stroke();
    }
    cx.font = "10pt sans-serif";
    cx.textAlign = "center";
    cx.textBaseline = "middle";

    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        this.drawStone(x, y, this.board[y][x]);
        if (this.showWin && this.win != null && this.win[y][x] != null) {
          cx.fillStyle = "red";
          cx.fillText(this.win[y][x] as string,
            x * 30 + 25, y * 30 + 25);
        }
      }
    }
    this.drawStone(8.3, 6.5, this.player);
    cx.fillText("Turn", 275, 245);
    this.drawStone(8.3, 0, 1);
    cx.fillText(this.black as string, 275, 55);
    this.drawStone(8.3, 2, 2);
    cx.fillText(this.white as string, 275, 115);

    if (this.message != "") {
      cx.fillStyle = "white";
      cx.strokeStyle = "red";
      cx.beginPath();
      cx.rect(20, 120, 220, 20);
      cx.fill();
      cx.stroke();
      cx.fillStyle = "black";
      cx.fillText(this.message, 120, 130);
    }
  }

  function drawStone(x : number, y : number, c : number) : void {
    var cx = this.cx;
    if (c == 1) {
      cx.fillStyle = "black";
    } else if (c == 2) {
      cx.fillStyle = "white";
    } else {
      return;
    }
    cx.beginPath();
    cx.arc(x * 30 + 25, y * 30 + 25, 14, 0, 2 * Math.PI);
    cx.fill();
  }

  function next(x : number, y : number) : void {
    if (0 <= x && x <= 7 && 0 <= y && y <= 7) {
      this.board[y][x]++;
      if (this.board[y][x] == 3) {
        this.board[y][x] = 0;
      }
    }
  }

  function put(x : number, y : number) : number {
    var stone = 0;
    stone += this.putDirection(x, y,  1,  0);
    stone += this.putDirection(x, y, -1,  0);
    stone += this.putDirection(x, y,  0,  1);
    stone += this.putDirection(x, y,  0, -1);
    stone += this.putDirection(x, y,  1,  1);
    stone += this.putDirection(x, y,  1, -1);
    stone += this.putDirection(x, y, -1,  1);
    stone += this.putDirection(x, y, -1, -1);
    if (stone > 0) {
      this.board[y][x] = this.player;
      stone++;
      this.count();
    }
    return stone;
  }

  function putDirection(x : number, y : number, dx : number, dy : number) : number {
    var stone = this.countDirection(x, y, dx, dy);
    for (var i = 1; i <= stone; i++) {
      this.board[y + dy * i][x + dx * i] = this.player;
    }
    return stone;
  }

  function check(x : number, y : number, n : number) : boolean {
    return 0 <= x && x <= 7 && 0 <= y && y <= 7 && this.board[y][x] == n;
  }

  function change() : number {
    this.player = 3 - this.player;
    if (this.canPut()) return 1;
    this.player = 3 - this.player;
    if (this.canPut()) return 2;
    if (this.black > this.white) {
      this.message = "Black Wins!";
    } else if (this.black < this.white) {
      this.message = "White Wins!";
    } else {
      this.message = "Draw!";
    }
    return 3;
  }

  function count() : void {
    this.black = 0;
    this.white = 0;
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        if (this.board[y][x] == 1) {
          this.black++;
        } else if (this.board[y][x] == 2) {
          this.white++;
        }
      }
    }
  }

  function checkCount(x : number, y : number) : boolean {
    return this.countDirection(x, y,  1,  0) > 0 ||
           this.countDirection(x, y, -1,  0) > 0 ||
           this.countDirection(x, y,  0,  1) > 0 ||
           this.countDirection(x, y,  0, -1) > 0 ||
           this.countDirection(x, y,  1,  1) > 0 ||
           this.countDirection(x, y,  1, -1) > 0 ||
           this.countDirection(x, y, -1,  1) > 0 ||
           this.countDirection(x, y, -1, -1) > 0;
  }

  function countDirection(x : number, y : number, dx : number, dy : number) : number {
    if (this.check(x, y, 0)) {
      var rival = 3 - this.player;
      var stone = 0;
      var x1 = x + dx;
      var y1 = y + dy;
      while (this.check(x1, y1, rival)) {
        stone++;
        x1 += dx;
        y1 += dy;
      }
      if (stone > 0 && this.check(x1, y1, this.player)) {
        return stone;
      }
    }
    return 0;
  }

  function canPut() : boolean {
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        if (this.checkCount(x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  function thinkRandom() : number[] {
    var x, y;
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
    } while (this.put(x, y) == 0);
    return [x, y];
  }

  function countPut(x: number, y: number) : number {
    var stone = 0;
    if (this.check(x, y, 0)) {
      stone += this.countDirection(x, y,  1,  0);
      stone += this.countDirection(x, y, -1,  0);
      stone += this.countDirection(x, y,  0,  1);
      stone += this.countDirection(x, y,  0, -1);
      stone += this.countDirection(x, y,  1,  1);
      stone += this.countDirection(x, y,  1, -1);
      stone += this.countDirection(x, y, -1,  1);
      stone += this.countDirection(x, y, -1, -1);
    }
    return stone;
  }

  function thinkMost() : void {
    var max = 0, tx = 0, ty = 0;
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        var stone = this.countPut(x, y);
        if (max < stone) {
          max = stone;
          tx = x;
          ty = y;
        }
      }
    }
    if (max > 0) this.put(tx, ty);
  }

  function clone() : Board {
    var ret = new Board(null);
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        ret.board[y][x] = this.board[y][x];
      }
    }
    ret.player = this.player;
    ret.black  = this.black;
    ret.white  = this.white;
    return ret;
  }

  function thinkMonteCarlo() : void {
    this.win = [
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[],
      new number[]
    ];
    for (var i = 1; i <= 1000; i++) {
      var board = this.clone();
      var pt = board.thinkRandom();
      var x = pt[0], y = pt[1];
      while (board.change() != 3) {
        board.thinkRandom();
      }
      if ((this.player == 1 && board.black > board.white) ||
        (this.player == 2 && board.black < board.white)) {
        if (this.win[y][x] == null) {
          this.win[y][x] = 1;
        } else {
          this.win[y][x]++;
        }
      } else if (board.black != board.white) {
        if (this.win[y][x] == null) {
          this.win[y][x] = -1;
        } else {
          this.win[y][x]--;
        }
      }
    }

    var max = null : Nullable.<number>;
    var tx = 0;
    var ty = 0;
    for (var y = 0; y <= 7; y++) {
      for (var x = 0; x <= 7; x++) {
        if (this.win[y][x] != null &&
          (max == null || max < this.win[y][x])) {
          max = this.win[y][x];
          tx = x;
          ty = y;
        }
      }
    }
    if (max != null) {
      this.put(tx, ty);
    } else {
      this.thinkRandom();
    }
  }

  function onMouseDown(e : MouseEvent) : void {
    if (this.ignore) return;
    if (this.message != "") {
      this.init();
      this.draw();
      return;
    }
    var r = this.canvas.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left - 10) / 30);
    var y = Math.floor((e.clientY - r.top  - 10) / 30);
    if (this.put(x, y) == 0) return;
    this.win = null;
    var chg = this.change();
    this.draw();
    if (chg != 1) return;
    this.ignore = true;

    dom.window.setTimeout(function start() : void {
      this.think();
      var chg = this.change();
      this.draw();
      if (chg == 2) {
        start();
      }
      else {
        this.ignore = false;
      }
    }, 50);
  }

  function configureFromForm() : void {
    var levels = dom.document.getElementsByName('level');
    for (var i = 0; i < levels.length; i++) {
      var radio = levels[i] as HTMLInputElement;
      if (radio.checked) {
        switch (radio.value) {
          case "random":
            this.think = () -> { this.thinkRandom(); };
            break;
          case "most":
            this.think = () -> { this.thinkMost(); };
            break;
          case "montecarlo":
            this.think = () -> { this.thinkMonteCarlo(); };
            break;
          default:
            log "no such algorithm: " + radio.value;
        }
      }

      var showWinningRate = dom.id("show_winning_rate") as HTMLInputElement;
      assert showWinningRate != null;
      this.showWin = showWinningRate.checked;

      this.draw();
    }
  }
}

class _Main {
  static function createCanvas() : HTMLCanvasElement {
    var canvas = dom.createElement('canvas') as HTMLCanvasElement;
    canvas.width  = Config.STAGE_WIDTH;
    canvas.height = Config.STAGE_HEIGHT;
    dom.id('world').appendChild(canvas);
    return canvas;
  }

  static function main(args : string[]) : void {
    var board = new Board(_Main.createCanvas());

    board.configureFromForm();
    dom.id('configuration').addEventListener('click', (e) -> { board.configureFromForm(); });
  }
}
// vim: set expandtab :
// vim: set tabstop=2 :
// vim: set shiftwidth=2 :
