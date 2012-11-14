/*
    This program is originated from http://nmi.jp/archives/386
    Copyright (c) 2012, Kihira Takuo. All rights reserved.

    Image resources are copied from the following web site:
    http://homepage2.nifty.com/hamcorossam/
    Copyright (c) 2012, HamCorossam. All rights reserved.
*/

var Config = {
    cols: 10,
    rows: 15,
    cellWidth : 32,
    cellHeight: 32,
    bulletWidth : 4,
    bulletHeight: 4,
    bulletSpeed: 20,
    reloadCount: 3,
    initialNumRocks: 5,

    FPS: 30,


    imagePath: "img"
};
Config.width  = Config.cols * Config.cellWidth;
Config.height = Config.rows * Config.cellHeight;

var Class = function () { };

Class.extend = function (properties) {
    var ctor = properties.constructor;
    if (ctor === Object) {
        var superCtor = this.prototype.constructor;
        ctor = properties.constructor = function () {
            superCtor.call(this);
        };
    }
    function tmp() {}
    tmp.prototype = this.prototype;
    ctor.prototype = new tmp();
    ctor.extend = Class.extend;
    // assign properties
    for (var k in properties) {
        if (k.charAt(0) == '$') {
            ctor[k.substring(1)] = properties[k];
        } else {
            ctor.prototype[k] = properties[k];
        }
    }
    if (typeof ctor.constructor === "function") {
        ctor.constructor();
    }
    return ctor;
};

Class.prototype.constructor = function () { };

var Sprite = Class.extend({
    x : 0,
    y : 0,

    width : 0,
    height : 0,

    image : null,

    detectCollision: function (other) {
        return Math.abs(this.x - other.x) < (Config.cellWidth  >> 1)
            && Math.abs(this.y - other.y) < (Config.cellHeight >> 1);

    },

    draw : function (context) {
        context.drawImage(this.image,
            this.x - (this.width  >> 1),
            this.y - (this.height >> 1));
    }
});

var MovingObject = Sprite.extend({
    x : 0,
    y : 0,

    dx : 0,
    dy : 0,

    image : null,

    constructor : function (x, y, dx, dy, image) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.image = image;
    },

    update : function () {
        this.x += this.dx;
        this.y += this.dy;
        return this._inDisplay();
    },

    _inDisplay : function () {
        return !( this.x <= 0 || this.x >= Config.width
            || this.y <= 0 || this.y >= Config.height);

    },
});

var Bullet = MovingObject.extend({
    width : 0,
    height : 0,

    constructor : function (x, y, dx, dy, image) {
        MovingObject.call(this, x, y, dx, dy, image);
    },

    update : function (st) {
        var inDisplay = MovingObject.prototype.update.call(this);

        this.draw(st.ctx);

        for(var rockKey in st.rocks) {
            var rock = st.rocks[rockKey];

            if(this.detectCollision(rock)) {
                if(rock.hp == 0) return false;

                inDisplay = false;

                if(--rock.hp == 0) {
                    st.score = Math.min(st.score + rock.score, 999999999);

                    st.updateScore();

                    rock.dx = rock.dy = 0;
                    rock.setState(st, "bomb1");
                }
                else {
                    var newState = (rock.state +  "w").substring(0, 6);
                    rock.setState(st, newState);
                }
            }
        }
        return inDisplay;
    }
});

var Rock = MovingObject.extend({
    width : Config.cellWidth,
    height : Config.cellHeight,

    hp : 0,
    score : 0,
    state : "",

    constructor : function (
        x, y, dx, dy,
        hp, score, state,
        image
        ) {
        MovingObject.call(this, x, y, dx, dy, image);
        this.hp = hp;
        this.score = score;
        this.state = state;
    },

    update : function (st) {
        var inDisplay = MovingObject.prototype.update.call(this);

        this.draw(st.ctx);

        if(this.hp == 0) {
            var next = (this.state.substring(4) | 0) + 1;
            if(next > 10) {
                return false;
            }
            else {
                this.setState(st, "bomb" + next);
            }
        }
        else {
            this.setState(st, this.state.substring(0, 5));

            if(st.isGaming() && this.detectCollision(st.ship)) {
                st.changeStateToBeDying();
                st.dying = 1;
            }
        }
        return inDisplay;
    },

    setState : function (stage, state) {
        this.state = state;
        this.image = stage.images[state];
    }
});

var SpaceShip = Sprite.extend({
    x : 0,
    y : 0,

    width  : Config.cellWidth,
    height : Config.cellHeight,

    image : null,

    constructor : function (x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
});

var Stage = Class.extend({

    imageName : null,
    images : null,

    state : "loading",

    ship : null,
    dying : 0,

    lastX : -1,
    lastY : -1,
    frameCount : 0,
    currentTop : 0,

    ctx   : null,
    bgCtx : null,

    bullets : null,

    rocks : null,
    numRocks : 0,

    score : 0,
    scoreElement : null,

    changeStateToBeLoading : function () {
        this.state = "loading";
    },
    isLoading : function () {
        return this.state == "loading";
    },

    changeStateToBeGaming : function () {
        this.state = "gaming";
    },
    isGaming : function () {
        return this.state == "gaming";
    },

    changeStateToBeDying : function () {
        this.state = "dying";
    },
    isDying : function () {
        return this.state == "dying";
    },

    changeStateToBeGameOver : function () {
        this.state = "gameover";
    },
    isGameOver : function () {
        return this.state == "gameover";
    },

    level : function () {
        return this.frameCount / 500;
    },


    drawBackground : function () {
        var bottom = Config.height + Config.cellHeight - this.currentTop;
        if(bottom > 0) {
            this.ctx.drawImage(this.bgCtx.canvas, 0, this.currentTop,
                Config.width, bottom, 0, 0, Config.width, bottom);
        }
        if(Math.abs(Config.height - bottom) > 0) {
            this.ctx.drawImage(this.bgCtx.canvas, 0, bottom);
        }
    },

    draw : function () {
        this.drawBackground();

        var ship = this.ship;

        if(this.isGaming()) {
            ship.draw(this.ctx);
        }
        else if(this.isDying()) {
            ship.image = this.images["bomb" + this.dying];
            ship.draw(this.ctx);

            if(++this.dying > 10) {
                this.initialize(); // restart the game
                //this.changeStateToBeGameOver();
            }
        }
    },

    drawSpace : function (px, py) {
        var spaceType = (Math.random() * 10 + 1) | 0;
        var image = this.images["space" + spaceType];

        this.bgCtx.drawImage(image,
            px * Config.cellWidth,
            py * Config.cellHeight);
    },

    createBullet : function (dx, dy) {
        return new Bullet(
            this.ship.x, this.ship.y,
            dx * Config.bulletSpeed,
            dy * Config.bulletSpeed,
            this.images["bullet"]
        );
    },

    createRock : function () {
        var level = this.level();

        var px = this.ship.x + Math.random() * 100 - 50;
        var py = this.ship.y + Math.random() * 100 - 50;
        var fx = Math.random() * Config.width;
        var fy = (level >= 4) ? (Math.random() * 2) * Config.height : 0;

        var r = Math.atan2(py - fy, px - fx);
        var d = Math.max(Math.random() * (5.5 + level) + 1.5, 10);

        var hp = (Math.random() * Math.random() * ((5 + level / 4) | 0)) | 1;

        var rockId = (Math.random() * 3 + 1) | 0;
        return new Rock(
            fx,
            fy,
            Math.cos(r) * d,
            Math.sin(r) * d,
            hp,
            hp * hp * 100,
            "rock" + rockId,
            this.images["rock" + rockId]
        );
    },

    tick : function () {
        ++this.frameCount;

        window.setTimeout(function() {
            this.tick();
        }.bind(this), (1000 / Config.FPS) | 0);

        this.watchFPS();

        if(this.isLoading()) {
            return;
        }

        if(--this.currentTop == 0) {
            this.currentTop = Config.height + Config.cellHeight;
        }
        if( (this.currentTop % Config.cellHeight) == 0) {
            var line = this.currentTop / Config.cellHeight - 1;
            for(var px = 0; px < Config.cols; ++px) {
                this.drawSpace(px, line);
            }
        }

        this.draw();

        var fc = this.frameCount;
        if(this.isGaming() && (this.frameCount % Config.reloadCount) == 0) {
            this.bullets[fc + "a"] = this.createBullet(-1, -1);
            this.bullets[fc + "b"] = this.createBullet( 0, -1);
            this.bullets[fc + "c"] = this.createBullet( 1, -1);
            this.bullets[fc + "d"] = this.createBullet(-1,  1);
            this.bullets[fc + "e"] = this.createBullet( 1,  1);
        }

        if(this.numRocks < (Config.initialNumRocks + this.level())) {
            this.rocks[fc + "r"] = this.createRock();
            ++this.numRocks;
        }

        for(var bulletKey in this.bullets) {
            if(!this.bullets[bulletKey].update(this)) {
                delete this.bullets[bulletKey];
            }
        }

        for(var rockKey in this.rocks) {
            if(!this.rocks[rockKey].update(this)) {
                delete this.rocks[rockKey];
                --this.numRocks;
            }
        }
    },

    initialize : function () {

        for(var px = 0; px < Config.cols; ++px) {
            for(var py = 0; py < Config.rows + 1; ++py) {
                this.drawSpace(px, py);
            }
        }

        for(var i = 0; i < 3; ++i) {
            var canvas = window.document.createElement("canvas");

            canvas.width  = Config.cellWidth;
            canvas.height = Config.cellHeight;

            // prepare flashing rock images
            var rctx = canvas.getContext("2d");

            var k = "rock" + (i+1);
            rctx.drawImage(this.images[k], 0, 0);
            rctx.globalCompositeOperation = "source-in";
            rctx.fillStyle = "#fff";
            rctx.fillRect(0, 0, canvas.width, canvas.height);
            this.images[k + "w"] = canvas;
        }

        this.currentTop = Config.height + Config.cellHeight;

        this.ship = new SpaceShip(
             Config.width >> 2,
            (Config.height * 3/4) | 0,
            this.images["my"]);

        this.score      = 0;

        this.bullets = {};
        this.rocks   = {};
        this.numRocks = 0;

        this.changeStateToBeGaming();

        window.setTimeout(function() {
            window.scrollTo(0, 0);
        }, 250);
    },

    constructor : function (stageCanvas, scoreboard) {
        // initialize properties
        this.changeStateToBeLoading();

        this.imageName = ["my", "bullet", "rock1", "rock2", "rock3"];
        this.images    = {};

        scoreboard.style.width = Config.width + "px";
        this.scoreElement = scoreboard;

        stageCanvas.width  = Config.width;
        stageCanvas.height = Config.height;
        this.ctx = stageCanvas.getContext("2d");

        var bg = window.document.createElement("canvas");
        bg.width  = Config.width;
        bg.height = Config.height + Config.cellHeight;
        this.bgCtx = bg.getContext("2d");

        for(var i = 0; i < 10; ++i) {
            this.imageName.push("space" + (i + 1));
            this.imageName.push("bomb"  + (i + 1));
        }

        // preload
        var loadedCount = 0;
        var checkLoad = function(e) {
            var image = e.target;

            var canvas = window.document.createElement("canvas");
            var cx = canvas.getContext("2d");
            cx.drawImage(image, 0, 0);
            this.images[image.name] = canvas;

            if(++loadedCount == this.imageName.length) {
                this.initialize();
            }
        }.bind(this);
        for(var i = 0; i < this.imageName.length; ++i) {
            var name = this.imageName[i];
            var image = window.document.createElement("img");
            image.addEventListener("load", checkLoad);
            image.src = Config.imagePath + "/" + name + ".png";
            image.name = name;
        }

        var touchStart = function(e) {
            e.preventDefault();

            var p = this.getPoint(e);

            this.lastX = p[0];
            this.lastY = p[1];

            if(this.isGameOver()) {
                this.initialize();
            }
        }.bind(this);

        var body = window.document.body;

        body.addEventListener("mousedown",  touchStart);
        body.addEventListener("touchstart", touchStart);

        var touchMove = function(e) {
            e.preventDefault();

            var p = this.getPoint(e);

            if(this.isGaming() && this.lastX != -1) {
                var ship = this.ship;
                ship.x += ((p[0] - this.lastX) * 2.5) | 0;
                ship.y += ((p[1] - this.lastY) * 3.0) | 0;

                ship.x = Math.max(ship.x, 0);
                ship.x = Math.min(ship.x, Config.width);

                ship.y = Math.max(ship.y, 0);
                ship.y = Math.min(ship.y, Config.height);
            }

            this.lastX = p[0];
            this.lastY = p[1];
        }.bind(this);

        body.addEventListener("mousemove", touchMove);
        body.addEventListener("touchmove", touchMove);
    },

    getPoint : function (e) {
        var px = 0;
        var py = 0;
        if(e instanceof MouseEvent) {
            px = e.clientX;
            py = e.clientY;
        }
        else if(e instanceof TouchEvent) {
            px = e.touches[0].pageX;
            py = e.touches[0].pageY;
        }
        return [ px, py ];
    },

    start : Date.now(),
    fps : 0,
    watchFPS : function () {
        if((this.frameCount % Config.FPS) == 0) {
            this.fps = (this.frameCount / (Date.now() - this.start) * 1000) | 0;
            this.updateScore();
        }
    },

    updateScore : function () {
        var scoreStr = this.score + "";
        var fillz = "000000000".substring(
            0, 9 - scoreStr.length
        );
        this.scoreElement.innerHTML = fillz + scoreStr + "<br/>\n" + this.fps + " FPS";
    }

});

var _Main = Class.extend({
    $main : function (args) {
        console.log("shooting.js");
        var stageCanvas = document.getElementById(args[0]);
        var scoreboard  = document.getElementById(args[1]);

        var stage = new Stage(stageCanvas, scoreboard);
        stage.tick();
    }
});

// vim: set expandtab:
