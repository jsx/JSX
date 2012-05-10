// WebGL
// http://www.khronos.org/webgl/
//

import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "js/dom/typedarray.jsx";

native class WebGLRenderingContext implements CanvasRenderingContext {

	 // constants
	//================

	const POINTS : number;
	const LINES : number;
	const LINE_LOOP : number;
	const LINE_STRIP : number;
	const TRIANGLES : number;
	const TRIANGLE_STRIP : number;
	const TRIANGLE_FAN : number;

	const ZERO : number;
	const ONE : number;
	const SRC_COLOR : number;
	const ONE_MINUS_SRC_COLOR : number;
	const SRC_ALPHA : number;
	const ONE_MINUS_SRC_ALPHA : number;
	const DST_ALPHA : number;
	const ONE_MINUS_DST_ALPHA : number;

	const DST_COLOR : number;
	const ONE_MINUS_DST_COLOR : number;
	const SRC_ALPHA_SATURATE : number;

	const FUNC_ADD : number;
	const BLEND_EQUATION : number;
	const BLEND_EQUATION_RGB : number;
	const BLEND_EQUATION_ALPHA : number;

	const FUNC_SUBTRACT : number;
	const FUNC_REVERSE_SUBTRACT : number;

	const BLEND_DST_RGB : number;
	const BLEND_SRC_RGB : number;
	const BLEND_DST_ALPHA : number;
	const BLEND_SRC_ALPHA : number;
	const CONSTANT_COLOR : number;
	const ONE_MINUS_CONSTANT_COLOR : number;
	const CONSTANT_ALPHA : number;
	const ONE_MINUS_CONSTANT_ALPHA : number;
	const BLEND_COLOR : number;

	const ARRAY_BUFFER : number;
	const ELEMENT_ARRAY_BUFFER : number;
	const ARRAY_BUFFER_BINDING : number;
	const ELEMENT_ARRAY_BUFFER_BINDING : number;

	const STREAM_DRAW : number;
	const STATIC_DRAW : number;
	const DYNAMIC_DRAW : number;

	const BUFFER_SIZE : number;
	const BUFFER_USAGE : number;

	const CURRENT_VERTEX_ATTRIB : number;

	const FRONT : number;
	const BACK : number;
	const FRONT_AND_BACK : number;

	const CULL_FACE : number;
	const BLEND : number;
	const DITHER : number;
	const STENCIL_TEST : number;
	const DEPTH_TEST : number;
	const SCISSOR_TEST : number;
	const POLYGON_OFFSET_FILL : number;
	const SAMPLE_ALPHA_TO_COVERAGE : number;
	const SAMPLE_COVERAGE : number;

	const NO_ERROR : number;
	const INVALID_ENUM : number;
	const INVALID_VALUE : number;
	const INVALID_OPERATION : number;
	const OUT_OF_MEMORY : number;

	const CW : number;
	const CCW : number;

	const LINE_WIDTH : number;
	const ALIASED_POINT_SIZE_RANGE : number;
	const ALIASED_LINE_WIDTH_RANGE : number;
	const CULL_FACE_MODE : number;
	const FRONT_FACE : number;
	const DEPTH_RANGE : number;
	const DEPTH_WRITEMASK : number;
	const DEPTH_CLEAR_VALUE : number;
	const DEPTH_FUNC : number;
	const STENCIL_CLEAR_VALUE : number;
	const STENCIL_FUNC : number;
	const STENCIL_FAIL : number;
	const STENCIL_PASS_DEPTH_FAIL : number;
	const STENCIL_PASS_DEPTH_PASS : number;
	const STENCIL_REF : number;
	const STENCIL_VALUE_MASK : number;
	const STENCIL_WRITEMASK : number;
	const STENCIL_BACK_FUNC : number;
	const STENCIL_BACK_FAIL : number;
	const STENCIL_BACK_PASS_DEPTH_FAIL : number;
	const STENCIL_BACK_PASS_DEPTH_PASS : number;
	const STENCIL_BACK_REF : number;
	const STENCIL_BACK_VALUE_MASK : number;
	const STENCIL_BACK_WRITEMASK : number;
	const VIEWPORT : number;
	const SCISSOR_BOX : number;
	const COLOR_CLEAR_VALUE : number;
	const COLOR_WRITEMASK : number;
	const UNPACK_ALIGNMENT : number;
	const PACK_ALIGNMENT : number;
	const MAX_TEXTURE_SIZE : number;
	const MAX_VIEWPORT_DIMS : number;
	const SUBPIXEL_BITS : number;
	const RED_BITS : number;
	const GREEN_BITS : number;
	const BLUE_BITS : number;
	const ALPHA_BITS : number;
	const DEPTH_BITS : number;
	const STENCIL_BITS : number;
	const POLYGON_OFFSET_UNITS : number;
	const POLYGON_OFFSET_FACTOR : number;
	const TEXTURE_BINDING_2D : number;
	const SAMPLE_BUFFERS : number;
	const SAMPLES : number;
	const SAMPLE_COVERAGE_VALUE : number;
	const SAMPLE_COVERAGE_INVERT : number;

	const NUM_COMPRESSED_TEXTURE_FORMATS : number;
	const COMPRESSED_TEXTURE_FORMATS : number;

	const DONT_CARE : number;
	const FASTEST : number;
	const NICEST : number;

	const GENERATE_MIPMAP_HINT : number;

	const BYTE : number;
	const UNSIGNED_BYTE : number;
	const SHORT : number;
	const UNSIGNED_SHORT : number;
	const INT : number;
	const UNSIGNED_INT : number;
	const FLOAT : number;

	const DEPTH_COMPONENT : number;
	const ALPHA : number;
	const RGB : number;
	const RGBA : number;
	const LUMINANCE : number;
	const LUMINANCE_ALPHA : number;

	const UNSIGNED_SHORT_4_4_4_4 : number;
	const UNSIGNED_SHORT_5_5_5_1 : number;
	const UNSIGNED_SHORT_5_6_5 : number;

	const FRAGMENT_SHADER : number;
	const VERTEX_SHADER : number;
	const MAX_VERTEX_ATTRIBS : number;
	const MAX_VERTEX_UNIFORM_VECTORS : number;
	const MAX_VARYING_VECTORS : number;
	const MAX_COMBINED_TEXTURE_IMAGE_UNITS : number;
	const MAX_VERTEX_TEXTURE_IMAGE_UNITS : number;
	const MAX_TEXTURE_IMAGE_UNITS : number;
	const MAX_FRAGMENT_UNIFORM_VECTORS : number;
	const SHADER_TYPE : number;
	const DELETE_STATUS : number;
	const LINK_STATUS : number;
	const VALIDATE_STATUS : number;
	const ATTACHED_SHADERS : number;
	const ACTIVE_UNIFORMS : number;
	const ACTIVE_ATTRIBUTES : number;
	const SHADING_LANGUAGE_VERSION : number;
	const CURRENT_PROGRAM : number;

	const NEVER : number;
	const LESS : number;
	const EQUAL : number;
	const LEQUAL : number;
	const GREATER : number;
	const NOTEQUAL : number;
	const GEQUAL : number;
	const ALWAYS : number;

	const KEEP : number;
	const REPLACE : number;
	const INCR : number;
	const DECR : number;
	const INVERT : number;
	const INCR_WRAP : number;
	const DECR_WRAP : number;

	const VENDOR : number;
	const RENDERER : number;
	const VERSION : number;

	const NEAREST : number;
	const LINEAR : number;

	const NEAREST_MIPMAP_NEAREST : number;
	const LINEAR_MIPMAP_NEAREST : number;
	const NEAREST_MIPMAP_LINEAR : number;
	const LINEAR_MIPMAP_LINEAR : number;

	const TEXTURE_MAG_FILTER : number;
	const TEXTURE_MIN_FILTER : number;
	const TEXTURE_WRAP_S : number;
	const TEXTURE_WRAP_T : number;

	const TEXTURE_2D : number;
	const TEXTURE : number;

	const TEXTURE_CUBE_MAP : number;
	const TEXTURE_BINDING_CUBE_MAP : number;
	const TEXTURE_CUBE_MAP_POSITIVE_X : number;
	const TEXTURE_CUBE_MAP_NEGATIVE_X : number;
	const TEXTURE_CUBE_MAP_POSITIVE_Y : number;
	const TEXTURE_CUBE_MAP_NEGATIVE_Y : number;
	const TEXTURE_CUBE_MAP_POSITIVE_Z : number;
	const TEXTURE_CUBE_MAP_NEGATIVE_Z : number;
	const MAX_CUBE_MAP_TEXTURE_SIZE : number;

	const TEXTURE0 : number;
	const TEXTURE1 : number;
	const TEXTURE2 : number;
	const TEXTURE3 : number;
	const TEXTURE4 : number;
	const TEXTURE5 : number;
	const TEXTURE6 : number;
	const TEXTURE7 : number;
	const TEXTURE8 : number;
	const TEXTURE9 : number;
	const TEXTURE10 : number;
	const TEXTURE11 : number;
	const TEXTURE12 : number;
	const TEXTURE13 : number;
	const TEXTURE14 : number;
	const TEXTURE15 : number;
	const TEXTURE16 : number;
	const TEXTURE17 : number;
	const TEXTURE18 : number;
	const TEXTURE19 : number;
	const TEXTURE20 : number;
	const TEXTURE21 : number;
	const TEXTURE22 : number;
	const TEXTURE23 : number;
	const TEXTURE24 : number;
	const TEXTURE25 : number;
	const TEXTURE26 : number;
	const TEXTURE27 : number;
	const TEXTURE28 : number;
	const TEXTURE29 : number;
	const TEXTURE30 : number;
	const TEXTURE31 : number;
	const ACTIVE_TEXTURE : number;

	const REPEAT : number;
	const CLAMP_TO_EDGE : number;
	const MIRRORED_REPEAT : number;

	const FLOAT_VEC2 : number;
	const FLOAT_VEC3 : number;
	const FLOAT_VEC4 : number;
	const INT_VEC2 : number;
	const INT_VEC3 : number;
	const INT_VEC4 : number;
	const BOOL : number;
	const BOOL_VEC2 : number;
	const BOOL_VEC3 : number;
	const BOOL_VEC4 : number;
	const FLOAT_MAT2 : number;
	const FLOAT_MAT3 : number;
	const FLOAT_MAT4 : number;
	const SAMPLER_2D : number;
	const SAMPLER_CUBE : number;

	const VERTEX_ATTRIB_ARRAY_ENABLED : number;
	const VERTEX_ATTRIB_ARRAY_SIZE : number;
	const VERTEX_ATTRIB_ARRAY_STRIDE : number;
	const VERTEX_ATTRIB_ARRAY_TYPE : number;
	const VERTEX_ATTRIB_ARRAY_NORMALIZED : number;
	const VERTEX_ATTRIB_ARRAY_POINTER : number;
	const VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : number;

	const COMPILE_STATUS : number;

	const LOW_FLOAT : number;
	const MEDIUM_FLOAT : number;
	const HIGH_FLOAT : number;
	const LOW_INT : number;
	const MEDIUM_INT : number;
	const HIGH_INT : number;

	const FRAMEBUFFER : number;
	const RENDERBUFFER : number;

	const RGBA4 : number;
	const RGB5_A1 : number;
	const RGB565 : number;
	const DEPTH_COMPONENT16 : number;
	const STENCIL_INDEX : number;
	const STENCIL_INDEX8 : number;
	const DEPTH_STENCIL : number;

	const RENDERBUFFER_WIDTH : number;
	const RENDERBUFFER_HEIGHT : number;
	const RENDERBUFFER_INTERNAL_FORMAT : number;
	const RENDERBUFFER_RED_SIZE : number;
	const RENDERBUFFER_GREEN_SIZE : number;
	const RENDERBUFFER_BLUE_SIZE : number;
	const RENDERBUFFER_ALPHA_SIZE : number;
	const RENDERBUFFER_DEPTH_SIZE : number;
	const RENDERBUFFER_STENCIL_SIZE : number;

	const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : number;
	const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : number;
	const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : number;
	const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : number;

	const COLOR_ATTACHMENT0 : number;
	const DEPTH_ATTACHMENT : number;
	const STENCIL_ATTACHMENT : number;
	const DEPTH_STENCIL_ATTACHMENT : number;

	const NONE : number;

	const FRAMEBUFFER_COMPLETE : number;
	const FRAMEBUFFER_INCOMPLETE_ATTACHMENT : number;
	const FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : number;
	const FRAMEBUFFER_INCOMPLETE_DIMENSIONS : number;
	const FRAMEBUFFER_UNSUPPORTED : number;

	const FRAMEBUFFER_BINDING : number;
	const RENDERBUFFER_BINDING : number;
	const MAX_RENDERBUFFER_SIZE : number;

	const INVALID_FRAMEBUFFER_OPERATION : number;

	const UNPACK_FLIP_Y_WEBGL : number;
	const UNPACK_PREMULTIPLY_ALPHA_WEBGL : number;
	const CONTEXT_LOST_WEBGL : number;
	const UNPACK_COLORSPACE_CONVERSION_WEBGL : number;
	const BROWSER_DEFAULT_WEBGL : number;


	 // attributes
	//================

	const canvas : HTMLCanvasElement;
	const drawingBufferWidth : number;
	const drawingBufferHeight : number;


	 // functions
	//================
	function getContextAttributes() : WebGLContextAttributes;
	function isContextLost() : boolean;

	function getSupportedExtensions() : string[];
	function getExtension(name : string) : Object;

	function activeTexture(texture : number/*GLenum*/) : void;
	function attachShader(program : WebGLProgram , shader : WebGLShader) : void;
	function bindAttribLocation(program : WebGLProgram, index : number/*GLuint*/, name : string) : void;
	function bindBuffer(target : number/*GLenum*/, buffer : WebGLBuffer) : void;
	function bindFramebuffer(target : number/*GLenum*/, framebuffer : WebGLFramebuffer) : void;
	function bindRenderbuffer(target : number/*GLenum*/, renderbuffer : WebGLRenderbuffer) : void;
	function bindTexture(target : number/*GLenum*/, texture : WebGLTexture) : void;
	function blendColor(red : number/*GLclampf*/, green : number/*GLclampf*/, blue : number/*GLclampf*/, alpha : number/*GLclampf*/) : void;
	function blendEquation(mode : number/*GLenum*/) : void;
	function blendEquationSeparate(modeRGB : number/*GLenum*/, modeAlpha : number/*GLenum*/) : void;
	function blendFunc(sfactor : number/*GLenum*/, dfactor : number/*GLenum*/) : void;
	function blendFuncSeparate(srcRGB : number/*GLenum*/, dstRGB : number/*GLenum*/, srcAlpha : number/*GLenum*/, dstAlpha : number/*GLenum*/) : void;

	function bufferData(target : number/*GLenum*/, size : number/*GLsizeiptr*/, usage : number/*GLenum*/) : void;
	function bufferData(target : number/*GLenum*/, data : ArrayBufferView, usage : number/*GLenum*/) : void;
	function bufferData(target : number/*GLenum*/, data : ArrayBuffer, usage : number/*GLenum*/) : void;
	function bufferSubData(target : number/*GLenum*/, offset : number/*GLintptr*/, data : ArrayBufferView) : void;
	function bufferSubData(target : number/*GLenum*/, offset : number/*GLintptr*/, data : ArrayBuffer) : void;

	function checkFramebufferStatus(target : number/*GLenum*/) : number/*GLenum*/;
	function clear(mask : number/*GLbitfield*/) : void;
	function clearColor(red : number/*GLclampf*/, green : number/*GLclampf*/, blue : number/*GLclampf*/, alpha : number/*GLclampf*/) : void;
	function clearDepth(depth : number/*GLclampf*/) : void;
	function clearStencil(s : number/*GLint*/) : void;
	function colorMask(red : boolean, green : boolean, blue : boolean, alpha : boolean) : void;
	function compileShader(shader : WebGLShader) : void;

	function compressedTexImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, width : number/*GLsizei*/, height : number/*GLsizei*/, border : number/*GLint*/, data : ArrayBufferView) : void;
	function compressedTexSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/, format : number/*GLenum*/, data : ArrayBufferView) : void;

	function copyTexImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, x : number/*GLint*/, y : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/, border : number/*GLint*/) : void;
	function copyTexSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, x : number/*GLint*/, y : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/) : void;

	function createBuffer() : WebGLBuffer;
	function createFramebuffer() : WebGLFramebuffer;
	function createProgram() : WebGLProgram;
	function createRenderbuffer() : WebGLRenderbuffer;
	function createShader(type : number/*GLenum*/) : WebGLShader;
	function createTexture() : WebGLTexture;

	function cullFace(mode : number/*GLenum*/) : void;

	function deleteBuffer(buffer : WebGLBuffer) : void;
	function deleteFramebuffer(framebuffer : WebGLFramebuffer) : void;
	function deleteProgram(program : WebGLProgram) : void;
	function deleteRenderbuffer(renderbuffer : WebGLRenderbuffer) : void;
	function deleteShader(shader : WebGLShader) : void;
	function deleteTexture(texture : WebGLTexture) : void;

	function depthFunc(func : number/*GLenum*/) : void;
	function depthMask(flag : boolean) : void;
	function depthRange(zNear : number/*GLclampf*/, zFar : number/*GLclampf*/) : void;
	function detachShader(program : WebGLProgram, shader : WebGLShader) : void;
	function disable(cap : number/*GLenum*/) : void;
	function disableVertexAttribArray(index : number/*GLuint*/) : void;
	function drawArrays(mode : number/*GLenum*/, first : number/*GLint*/, count : number/*GLsizei*/) : void;
	function drawElements(mode : number/*GLenum*/, count : number/*GLsizei*/, type : number/*GLenum*/, offset : number/*GLintptr*/) : void;

	function enable(cap : number/*GLenum*/) : void;
	function enableVertexAttribArray(index : number/*GLuint*/) : void;
	function finish() : void;
	function flush() : void;
	function framebufferRenderbuffer(target : number/*GLenum*/, attachment : number/*GLenum*/, renderbuffertarget : number/*GLenum*/, renderbuffer : WebGLRenderbuffer) : void;
	function framebufferTexture2D(target : number/*GLenum*/, attachment : number/*GLenum*/, textarget : number/*GLenum*/, texture : WebGLTexture, level : number/*GLint*/) : void;
	function frontFace(mode : number/*GLenum*/) : void;

	function generateMipmap(target : number/*GLenum*/) : void;

	function getActiveAttrib(program : WebGLProgram, index : number/*GLuint*/) : WebGLActiveInfo;
	function getActiveUniform(program : WebGLProgram, index : number/*GLuint*/) : WebGLActiveInfo;
	function getAttachedShaders(program : WebGLProgram) : WebGLShader[];

	function getAttribLocation(program : WebGLProgram, name : string) : number/*GLint*/;

	function getBufferParameter(target : number/*GLenum*/, pname : number/*GLenum*/) : variant;
	function getParameter(pname : number/*GLenum*/) : variant;

	function getError() : number/*GLenum*/;

	function getFramebufferAttachmentParameter(target : number/*GLenum*/, attachment : number/*GLenum*/, pname : number/*GLenum*/) : variant;
	function getProgramParameter(program : WebGLProgram, pname : number/*GLenum*/) : variant;
	function getProgramInfoLog(program : WebGLProgram) : string;
	function getRenderbufferParameter(target : number/*GLenum*/, pname : number/*GLenum*/) : variant;
	function getShaderParameter(shader : WebGLShader, pname : number/*GLenum*/) : variant;
	function getShaderPrecisionFormat(shadertype : number/*GLenum*/, precisiontype : number/*GLenum*/) : WebGLShaderPrecisionFormat;
	function getShaderInfoLog(shader : WebGLShader) : string;

	function getShaderSource(shader : WebGLShader) : string;

	function getTexParameter(target : number/*GLenum*/, pname : number/*GLenum*/) : variant;

	function getUniform(program : WebGLProgram, location : WebGLUniformLocation) : variant;

	function getUniformLocation(program : WebGLProgram, name : string) : WebGLUniformLocation;

	function getVertexAttrib(index : number/*GLuint*/, pname : number/*GLenum*/) : variant;

	function getVertexAttribOffset(index : number/*GLuint*/, pname : number/*GLenum*/) : number/*GLsizeiptr*/;

	function hint(target : number/*GLenum*/, mode : number/*GLenum*/) : void;
	function isBuffer(buffer : WebGLBuffer) : boolean;
	function isEnabled(cap : number/*GLenum*/) : boolean;
	function isFramebuffer(framebuffer : WebGLFramebuffer) : boolean;
	function isProgram(program : WebGLProgram) : boolean;
	function isRenderbuffer(renderbuffer : WebGLRenderbuffer) : boolean;
	function isShader(shader : WebGLShader) : boolean;
	function isTexture(texture : WebGLTexture) : boolean;
	function lineWidth(width : number/*GLfloat*/) : void;
	function linkProgram(program : WebGLProgram) : void;
	function pixelStorei(pname : number/*GLenum*/, param : number/*GLint*/) : void;
	function polygonOffset(factor : number/*GLfloat*/, units : number/*GLfloat*/) : void;

	function readPixels(x : number/*GLint*/, y : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/, format : number/*GLenum*/, type : number/*GLenum*/, pixels : ArrayBufferView) : void;

	function renderbufferStorage(target : number/*GLenum*/, internalformat : number/*GLenum*/, width : number/*GLsizei*/, height : number/*GLsizei*/) : void;
	function sampleCoverage(value : number/*GLclampf*/, invert : boolean) : void;
	function scissor(x : number/*GLint*/, y : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/) : void;

	function shaderSource(shader : WebGLShader, source : string) : void;

	function stencilFunc(func : number/*GLenum*/, ref : number/*GLint*/, mask : number/*GLuint*/) : void;
	function stencilFuncSeparate(face : number/*GLenum*/, func : number/*GLenum*/, ref : number/*GLint*/, mask : number/*GLuint*/) : void;
	function stencilMask(mask : number/*GLuint*/) : void;
	function stencilMaskSeparate(face : number/*GLenum*/, mask : number/*GLuint*/) : void;
	function stencilOp(fail : number/*GLenum*/, zfail : number/*GLenum*/, zpass : number/*GLenum*/) : void;
	function stencilOpSeparate(face : number/*GLenum*/, fail : number/*GLenum*/, zfail : number/*GLenum*/, zpass : number/*GLenum*/) : void;

	function texImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, width : number/*GLsizei*/, height : number/*GLsizei*/, border : number/*GLint*/, format : number/*GLenum*/, type : number/*GLenum*/, pixels : ArrayBufferView) : void;
	function texImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, format : number/*GLenum*/, type : number/*GLenum*/, pixels : ImageData) : void;
	function texImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, format : number/*GLenum*/, type : number/*GLenum*/, image : HTMLImageElement) : void;
	function texImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, format : number/*GLenum*/, type : number/*GLenum*/, canvas : HTMLCanvasElement) : void;
	function texImage2D(target : number/*GLenum*/, level : number/*GLint*/, internalformat : number/*GLenum*/, format : number/*GLenum*/, type : number/*GLenum*/, video : HTMLVideoElement) : void;

	function texParameterf(target : number/*GLenum*/, pname : number/*GLenum*/, param : number/*GLfloat*/) : void;
	function texParameteri(target : number/*GLenum*/, pname : number/*GLenum*/, param : number/*GLint*/) : void;

	function texSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/, format : number/*GLenum*/, type : number/*GLenum*/, pixels : ArrayBufferView) : void;
	function texSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, format : number/*GLenum*/, type : number/*GLenum*/, pixels : ImageData) : void;
	function texSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, format : number/*GLenum*/, type : number/*GLenum*/, image : HTMLImageElement) : void;
	function texSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, format : number/*GLenum*/, type : number/*GLenum*/, canvas : HTMLCanvasElement) : void;
	function texSubImage2D(target : number/*GLenum*/, level : number/*GLint*/, xoffset : number/*GLint*/, yoffset : number/*GLint*/, format : number/*GLenum*/, type : number/*GLenum*/, video : HTMLVideoElement) : void;

	function uniform1f(location : WebGLUniformLocation, x : number/*GLfloat*/) : void;
	function uniform1fv(location : WebGLUniformLocation, v : Float32Array) : void;
	function uniform1fv(location : WebGLUniformLocation, v : number/*GLfloat*/[]) : void;
	function uniform1i(location : WebGLUniformLocation, x : number/*GLint*/) : void;
	function uniform1iv(location : WebGLUniformLocation, v : Int32Array) : void;
	function uniform1iv(location : WebGLUniformLocation, v : number/*GLint*/[]) : void;
	function uniform2f(location : WebGLUniformLocation, x : number/*GLfloat*/, y : number/*GLfloat*/) : void;
	function uniform2fv(location : WebGLUniformLocation, v : Float32Array) : void;
	function uniform2fv(location : WebGLUniformLocation, v : number/*GLfloat*/[]) : void;
	function uniform2i(location : WebGLUniformLocation, x : number/*GLint*/, y : number/*GLint*/) : void;
	function uniform2iv(location : WebGLUniformLocation, v : Int32Array) : void;
	function uniform2iv(location : WebGLUniformLocation, v : number/*GLint*/[]) : void;
	function uniform3f(location : WebGLUniformLocation, x : number/*GLfloat*/, y : number/*GLfloat*/, z : number/*GLfloat*/) : void;
	function uniform3fv(location : WebGLUniformLocation, v : Float32Array) : void;
	function uniform3fv(location : WebGLUniformLocation, v : number/*GLfloat*/[]) : void;
	function uniform3i(location : WebGLUniformLocation, x : number/*GLint*/, y : number/*GLint*/, z : number/*GLint*/) : void;
	function uniform3iv(location : WebGLUniformLocation, v : Int32Array) : void;
	function uniform3iv(location : WebGLUniformLocation, v : number/*GLint*/[]) : void;
	function uniform4f(location : WebGLUniformLocation, x : number/*GLfloat*/, y : number/*GLfloat*/, z : number/*GLfloat*/, w : number/*GLfloat*/) : void;
	function uniform4fv(location : WebGLUniformLocation, v : Float32Array) : void;
	function uniform4fv(location : WebGLUniformLocation, v : number/*GLfloat*/[]) : void;
	function uniform4i(location : WebGLUniformLocation, x : number/*GLint*/, y : number/*GLint*/, z : number/*GLint*/, w : number/*GLint*/) : void;
	function uniform4iv(location : WebGLUniformLocation, v : Int32Array) : void;
	function uniform4iv(location : WebGLUniformLocation, v : number/*GLint*/[]) : void;

	function uniformMatrix2fv(location : WebGLUniformLocation, transpose : boolean, value : Float32Array) : void;
	function uniformMatrix2fv(location : WebGLUniformLocation, transpose : boolean, value : number/*GLfloat*/[]) : void;
	function uniformMatrix3fv(location : WebGLUniformLocation, transpose : boolean, value : Float32Array) : void;
	function uniformMatrix3fv(location : WebGLUniformLocation, transpose : boolean, value : number/*GLfloat*/[]) : void;
	function uniformMatrix4fv(location : WebGLUniformLocation, transpose : boolean, value : Float32Array) : void;
	function uniformMatrix4fv(location : WebGLUniformLocation, transpose : boolean, value : number/*GLfloat*/[]) : void;

	function useProgram(program : WebGLProgram) : void;
	function validateProgram(program : WebGLProgram) : void;

	function vertexAttrib1f(indx : number/*GLuint*/, x : number/*GLfloat*/) : void;
	function vertexAttrib1fv(indx : number/*GLuint*/, values : Float32Array) : void;
	function vertexAttrib1fv(indx : number/*GLuint*/, values : number/*GLfloat*/[]) : void;
	function vertexAttrib2f(indx : number/*GLuint*/, x : number/*GLfloat*/, y : number/*GLfloat*/) : void;
	function vertexAttrib2fv(indx : number/*GLuint*/, values : Float32Array) : void;
	function vertexAttrib2fv(indx : number/*GLuint*/, values : number/*GLfloat*/[]) : void;
	function vertexAttrib3f(indx : number/*GLuint*/, x : number/*GLfloat*/, y : number/*GLfloat*/, z : number/*GLfloat*/) : void;
	function vertexAttrib3fv(indx : number/*GLuint*/, values : Float32Array) : void;
	function vertexAttrib3fv(indx : number/*GLuint*/, values : number/*GLfloat*/[]) : void;
	function vertexAttrib4f(indx : number/*GLuint*/, x : number/*GLfloat*/, y : number/*GLfloat*/, z : number/*GLfloat*/, w : number/*GLfloat*/) : void;
	function vertexAttrib4fv(indx : number/*GLuint*/, values : Float32Array) : void;
	function vertexAttrib4fv(indx : number/*GLuint*/, values : number/*GLfloat*/[]) : void;
	function vertexAttribPointer(indx : number/*GLuint*/, size : number/*GLint*/, type : number/*GLenum*/, normalized : boolean, stride : number/*GLsizei*/, offset : number/*GLintptr*/) : void;

	function viewport(x : number/*GLint*/, y : number/*GLint*/, width : number/*GLsizei*/, height : number/*GLsizei*/) : void;

}

class WebGLContextAttributes {}

interface WebGLObject {}
interface WebGLBuffer implements WebGLObject {}
interface WebGLFramebuffer implements WebGLObject {}
interface WebGLProgram implements WebGLObject {}
interface WebGLRenderbuffer implements WebGLObject {}
interface WebGLShader implements WebGLObject {}
interface WebGLTexture implements WebGLObject {}
interface WebGLUniformLocation implements WebGLObject {}
interface WebGLActiveInfo implements WebGLObject {}

interface WebGLShaderPrecisionFormat {}


