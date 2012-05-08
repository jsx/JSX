// CanvasRenderingContext2D

// http://www.w3.org/TR/2dcontext/

import "js/dom.jsx";

native class CanvasRenderingContext2D implements CanvasRenderingContext
	/* implements CanvasTransformation, CanvasLineStyles, CanvasPathMethods, CanvasText */ {

	// back-reference to the canvas
	const canvas : HTMLCanvasElement;

	// state
	function save() : void;
	function restore() : void;

	// compositiong
	var globalAlpha : number;
	var globalCompositeOperation : string;

	// clors and styles
	var strokeStyle : variant;
	var fillStyle : variant;
	function createLinearGradient(x0 : number, y0 : number, x1 : number, y1 : number) :CanvasGradient;
	function createRadialGradient(x0 : number, y0 : number, r0 : number, x1 : number, y1 : number, r1 : number) :CanvasGradient;
	function createPattern(image : HTMLImageElement, repetition : string) : CanvasPattern;
	function createPattern(image : HTMLCanvasElement, repetition : string) : CanvasPattern;
	function createPattern(image : HTMLVideoElement, repetition : string) : CanvasPattern;

	// shadows
	var shadowOffsetX : number;
	var shadowOffsetY : number;
	var shadowBlur : number;
	var shadowColor : string;

	// rects
	function clearRect(x : number, y : number, w : number, h : number) :void;
	function fillRect(x : number, y : number, w : number, h : number) : void;
	function strokeRect(x : number, y : number, w : number, h : number) : void;

	// current default path API (see also CanvasPathMethods)
	function beginPath() : void;
	function fill() : void;
	function stroke() : void;
	function drawSystemFocusRing(element : Element) : void;
	function drawCustomFocusRing(element : Element) : boolean;
	function scrollPathIntoView() : void;
	function clip() : void;
	function isPointInPath(x : number, y : number) : void;

	// text (see also CanvasText interface)
	function fillText(text : string, x : number, y : number) : void;
	function fillText(text : string, x : number, y : number, maxWidth : number) : void;
	function strokeText(text : string, x : number, y : number) : void;
	function strokeText(text : string, x : number, y : number, maxWidth : number) : void;
	function measureText(text : string) : TextMetrics;

	// drawing images
	// (dx, dy)
	function drawImage( image : HTMLImageElement,  dx : number, dy : number) : void;
	function drawImage( image : HTMLCanvasElement, dx : number, dy : number) : void;
	function drawImage( image : HTMLVideoElement,  dx : number, dy : number) : void;
	// (dx, dy, dw, dh)
	function drawImage( image : HTMLImageElement,  dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLCanvasElement, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLVideoElement,  dx : number, dy : number, dw : number, dh : number) : void;
	// (sx, sy, sw, sh, dx, dy, dw, dh)
	function drawImage( image : HTMLImageElement,  sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLCanvasElement, sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;
	function drawImage( image : HTMLVideoElement,  sx : number, sy : number, sw : number, sh : number, dx : number, dy : number, dw : number, dh : number) : void;

	// pixel manipulation
	function createImageData(sw : number, sh : number) : ImageData;
	function createImageData(imageData : ImageData) : ImageData;
	function putImageData(imageData : ImageData, dx : number, dy : number) : ImageData;
	function putImageData(imageData : ImageData, dx : number, dy : number, dirtyX : number, dirtyY : number, dirtyWidth : number, dirtyHeight : number) : ImageData;

	// implements CanvasTransformation

	function scale(x : number, y : number) : void;
	function rotate(angle : number) : void;
	function translate(x : number, y : number) : void;
	function transform(a : number, b : number, c : number, d : number, e : number, f : number) : void;
	function setTransform(a : number, b : number, c : number, d : number, e : number, f : number) : void;

	// implements CanvasLineStyles

	var lineWidth : number;
	var lineCap : string;
	var lineJoin : string;
	var miterLimit : string;

	// implements CanvasText

	var font : string;
	var textAlign : string;
	var textBaseline : string;

	// implements CanvasPathMethods

	function closePath() : void;
	function moveTo(x : number, y : number) : void;
	function lineTo(x : number, y : number) : void;
	function quadraticCurveTo(cpx : number, cpy : number, x : number, y : number) : void;
	function bezierCurveTo(cp1x : number, cp1y : number, dp2x : number, cp2y : number, x : number, y : number) : void;
	function arcTo(x1 : number, y1 : number, x2 : number, y2 : number, radius : number) : void;
	function rect(x : number, y : number, w : number, h : number);
	function arc(x : number, y : number, radius : number, startAngle : number, endAngle : number, anticlockwise : boolean) : void;
	function arc(x : number, y : number, radius : number, startAngle : number, endAngle : number) : void;
}

native class TextMetrics {
	const width : number;
}

native class ImageData {
	const width : int;
	const height : int;
	const data : Array.<int>; // Uint8ClampedArray in reality

}

native class CanvasPattern {
	// todo
}

native class CanvasGradient {
	// todo
}

