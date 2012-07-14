/*
    AOBench (JSX version)
    2012/5/31
    ported by Twitter:@kioku_systemk

    aobench site: http://code.google.com/p/aobench/

    This code is public domain.
*/

import "js/web.jsx";

class Config {
    static const canvasId = "world";
    static const statusId = "status";
}

class vec3 {
    var x : number;
    var y : number;
    var z : number;
    function constructor(x:number, y:number, z:number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static function vadd(a:vec3, b:vec3) : vec3
    {
        return new vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static function vsub(a:vec3, b:vec3):vec3
    {
        return new vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static function vcross(a:vec3, b:vec3):vec3
    {
        return new vec3(a.y * b.z - a.z * b.y,
                       a.z * b.x - a.x * b.z,
                       a.x * b.y - a.y * b.x);
    }

    static function vdot(a:vec3, b:vec3):number
    {
        return (a.x * b.x + a.y * b.y + a.z * b.z);
    }

    static function vlength(a:vec3):number
    {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    }

    static function vnormalize(a:vec3):vec3
    {
        var len = vec3.vlength(a);
        var v   = new vec3(a.x, a.y, a.z);

        if (Math.abs(len) > 1.0e-17) {
            v.x /= len;
            v.y /= len;
            v.z /= len;
        }

        return v;
    }

} // class vec3


class Isect {
    var t   = 1000000.0;     // far away
    var hit = false;
    var p:vec3;
    var n:vec3;
    function constructor() {
        this.p = new vec3(0.0, 0.0, 0.0);
        this.n = new vec3(0.0, 0.0, 0.0);
    }
} // Isect


class Ray {
    var org : vec3;
    var dir : vec3;
    function constructor(org:vec3, dir:vec3)
    {
        this.org = org;
        this.dir = dir;
    }
} // Ray

class Sphere {
    var center : vec3;
    var radius : number;

    function constructor(center:vec3, radius:number)
    {
        this.center = center;
        this.radius = radius;
    }
    function intersect(ray:Ray, isect:Isect) : void {
        // rs = ray.org - sphere.center
        var rs = vec3.vsub(ray.org, this.center);
        var B  = vec3.vdot(rs, ray.dir);
        var C  = vec3.vdot(rs, rs) - (this.radius * this.radius);
        var D  = B * B - C;

        if (D > 0.0) {
            var t = -B - Math.sqrt(D);

            if ( (t > 0.0) && (t < isect.t) ) {
                isect.t   = t;
                isect.hit = true;

                isect.p = new vec3(ray.org.x + ray.dir.x * t,
                                  ray.org.y + ray.dir.y * t,
                                  ray.org.z + ray.dir.z * t);

                // calculate normal.
                var n = vec3.vsub(isect.p, this.center);
                isect.n = vec3.vnormalize(n);
            }
        }
    }
} // Sphere

class Plane {
    var p : vec3;
    var n : vec3;

    function constructor(p:vec3, n:vec3)
    {
        this.p = p;
        this.n = n;
    }
    function intersect (ray:Ray, isect:Isect) : void {
        var d = -vec3.vdot(this.p, this.n);
        var v =  vec3.vdot(ray.dir, this.n);
        if (Math.abs(v) < 1.0e-17) return;      // no hit
        var t = -(vec3.vdot(ray.org, this.n) + d) / v;
        if ( (t > 0.0) && (t < isect.t) ) {
            isect.hit = true;
            isect.t   = t;
            isect.n   = this.n;
            isect.p   = new vec3(ray.org.x + t * ray.dir.x,
                                 ray.org.y + t * ray.dir.y,
                                 ray.org.z + t * ray.dir.z );
        }
    }
} // Plane

class Random {
    static var _x= 0;
    static function next() : number {
        Random._x = Random._x * 0x5DEECE66D + 0xB;
        Random._x %= 0xFFFFFFFFFFFF;
        return Random._x * (1.0/(0xFFFFFFFFFFFF+1));
    }
}

class AOBench {

    static const NSUBSAMPLES  = 2;
    static const NAO_SAMPLES  = 8;
    static const EPS          = 0.0001;
    static const NPHI   = AOBench.NAO_SAMPLES;
    static const NTHETA = AOBench.NAO_SAMPLES;
    static const ALLRAY = AOBench.NAO_SAMPLES * AOBench.NAO_SAMPLES;

    static function clamp(f : number) : int
    {
        var i = f * 255.0;
        if (i > 255.0) i = 255.0;
        if (i < 0.0)   i = 0.0;
        return i as int;
    }

    function orthoBasis(basis : vec3[], n:vec3) : void
    {
        basis[2] = n;
        basis[1] = new vec3(0.0, 0.0, 0.0);

        if ((n.x < 0.6) && (n.x > -0.6)) {
            basis[1].x = 1.0;
        } else if ((n.y < 0.6) && (n.y > -0.6)) {
            basis[1].y = 1.0;
        } else if ((n.z < 0.6) && (n.z > -0.6)) {
            basis[1].z = 1.0;
        } else {
            basis[1].x = 1.0;
        }

        basis[0] = vec3.vcross(basis[1], basis[2]);
        basis[0] = vec3.vnormalize(basis[0]);

        basis[1] = vec3.vcross(basis[2], basis[0]);
        basis[1] = vec3.vnormalize(basis[1]);
    }

    // Scene

    var spheres : Sphere[] = [
        new Sphere(new vec3(-2.0, 0.0, -3.5), 0.5),
        new Sphere(new vec3(-0.5, 0.0, -3.0), 0.5),
        new Sphere(new vec3(1.0, 0.0, -2.2), 0.5)
    ];
    var plane = new Plane(new vec3(0.0, -0.5, 0.0), new vec3(0.0, 1.0, 0.0));
    /*
    function init_scene() : void
    {
        spheres = [
            new Sphere(new vec3(-2.0, 0.0, -3.5), 0.5),
            new Sphere(new vec3(-0.5, 0.0, -3.0), 0.5),
            new Sphere(new vec3(1.0, 0.0, -2.2), 0.5)
        ];
        plane = new Plane(new vec3(0.0, -0.5, 0.0), new vec3(0.0, 1.0, 0.0));
    }*/

    function ambient_occlusion(isect:Isect) : vec3
    {
        var basis = new Array.<vec3>(3);
        this.orthoBasis(basis,  isect.n);

        var p : vec3 = new vec3(
            isect.p.x + AOBench.EPS * isect.n.x,
            isect.p.y + AOBench.EPS * isect.n.y,
            isect.p.z + AOBench.EPS * isect.n.z);

        var occlusion : int = 0;

        for (var j = 0; j < AOBench.NPHI; j++) {
            for (var i = 0; i < AOBench.NTHETA; i++) {
                var r   = Random.next();
                var phi = 2.0 * Math.PI * Random.next();
                var x   = Math.cos(phi) * Math.sqrt(1.0 - r);
                var y   = Math.sin(phi) * Math.sqrt(1.0 - r);
                var z   = Math.sqrt(r);

                // local -> global
                var rx  = x * basis[0].x + y * basis[1].x + z * basis[2].x;
                var ry  = x * basis[0].y + y * basis[1].y + z * basis[2].y;
                var rz  = x * basis[0].z + y * basis[1].z + z * basis[2].z;

                var raydir = new vec3(rx, ry, rz);
                var ray    = new Ray(p, raydir);

                var occIsect : Isect = new Isect();
                this.spheres[0].intersect(ray, occIsect);
                this.spheres[1].intersect(ray, occIsect);
                this.spheres[2].intersect(ray, occIsect);
                this.plane.intersect(ray, occIsect);

                if (occIsect.hit)
                    occlusion++;
            }
        }

        // [0.0, 1.0]
        var occ_f = (AOBench.ALLRAY - occlusion) / AOBench.ALLRAY;

        return new vec3(occ_f, occ_f, occ_f);
    }


    function render(fill : function(x : int, y : int,  r : int, g : int, b : int) : void, w : int, h : int) : void {
        var half_w = w * .5;
        var half_h = h * .5;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var px =  (x - half_w)/half_w;
                var py = -(y - half_h)/half_h;

                var eye = vec3.vnormalize(new vec3(px, py, -1.0));
                var ray = new Ray(new vec3(0.0, 0.0, 0.0), eye);

                var isect = new Isect();
                this.spheres[0].intersect(ray, isect);
                this.spheres[1].intersect(ray, isect);
                this.spheres[2].intersect(ray, isect);
                this.plane.intersect(ray, isect);

                var col = new vec3(0.0,0.0,0.0);
                if (isect.hit)
                    col = this.ambient_occlusion(isect);

                var r = AOBench.clamp(col.x);
                var g = AOBench.clamp(col.y);
                var b = AOBench.clamp(col.z);

                // use fill rect
                fill(x, y, r, g, b);
            }
        }

    }

} // aobench

class _Main {
    static function main(args : string[]) : void {

        var canvas = dom.id(Config.canvasId) as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        var ao : AOBench = new AOBench();
        var t0 = Date.now();
        ao.render((x, y, r, g, b) -> {
            ctx.fillStyle = "rgb(" + r as string + "," + g as string + "," + b as string + ")";
            ctx.fillRect (x, y, 1, 1);
        }, canvas.width, canvas.height);
        var t1 = Date.now();
        var d = t1 - t0;
        dom.id(Config.statusId).innerHTML = "Time = " + d as string + "[ms]";
    }
}
// vim: set expandtab:

