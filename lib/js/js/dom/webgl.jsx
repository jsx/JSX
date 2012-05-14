// WebGL
// http://www.khronos.org/webgl/
//

import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "js/dom/typedarray.jsx";

native class WebGLRenderingContext implements CanvasRenderingContext {

	 // constants
	//================

	const DEPTH_BUFFER_BIT : number/*GLenum*/;
	const STENCIL_BUFFER_BIT : number/*GLenum*/;
	const COLOR_BUFFER_BIT : number/*GLenum*/;

	const POINTS : number/*GLenum*/;
	const LINES : number/*GLenum*/;
	const LINE_LOOP : number/*GLenum*/;
	const LINE_STRIP : number/*GLenum*/;
	const TRIANGLES : number/*GLenum*/;
	const TRIANGLE_STRIP : number/*GLenum*/;
	const TRIANGLE_FAN : number/*GLenum*/;

	const ZERO : number/*GLenum*/;
	const ONE : number/*GLenum*/;
	const SRC_COLOR : number/*GLenum*/;
	const ONE_MINUS_SRC_COLOR : number/*GLenum*/;
	const SRC_ALPHA : number/*GLenum*/;
	const ONE_MINUS_SRC_ALPHA : number/*GLenum*/;
	const DST_ALPHA : number/*GLenum*/;
	const ONE_MINUS_DST_ALPHA : number/*GLenum*/;

	const DST_COLOR : number/*GLenum*/;
	const ONE_MINUS_DST_COLOR : number/*GLenum*/;
	const SRC_ALPHA_SATURATE : number/*GLenum*/;

	const FUNC_ADD : number/*GLenum*/;
	const BLEND_EQUATION : number/*GLenum*/;
	const BLEND_EQUATION_RGB : number/*GLenum*/;
	const BLEND_EQUATION_ALPHA : number/*GLenum*/;

	const FUNC_SUBTRACT : number/*GLenum*/;
	const FUNC_REVERSE_SUBTRACT : number/*GLenum*/;

	const BLEND_DST_RGB : number/*GLenum*/;
	const BLEND_SRC_RGB : number/*GLenum*/;
	const BLEND_DST_ALPHA : number/*GLenum*/;
	const BLEND_SRC_ALPHA : number/*GLenum*/;
	const CONSTANT_COLOR : number/*GLenum*/;
	const ONE_MINUS_CONSTANT_COLOR : number/*GLenum*/;
	const CONSTANT_ALPHA : number/*GLenum*/;
	const ONE_MINUS_CONSTANT_ALPHA : number/*GLenum*/;
	const BLEND_COLOR : number/*GLenum*/;

	const ARRAY_BUFFER : number/*GLenum*/;
	const ELEMENT_ARRAY_BUFFER : number/*GLenum*/;
	const ARRAY_BUFFER_BINDING : number/*GLenum*/;
	const ELEMENT_ARRAY_BUFFER_BINDING : number/*GLenum*/;

	const STREAM_DRAW : number/*GLenum*/;
	const STATIC_DRAW : number/*GLenum*/;
	const DYNAMIC_DRAW : number/*GLenum*/;

	const BUFFER_SIZE : number/*GLenum*/;
	const BUFFER_USAGE : number/*GLenum*/;

	const CURRENT_VERTEX_ATTRIB : number/*GLenum*/;

	const FRONT : number/*GLenum*/;
	const BACK : number/*GLenum*/;
	const FRONT_AND_BACK : number/*GLenum*/;

	const CULL_FACE : number/*GLenum*/;
	const BLEND : number/*GLenum*/;
	const DITHER : number/*GLenum*/;
	const STENCIL_TEST : number/*GLenum*/;
	const DEPTH_TEST : number/*GLenum*/;
	const SCISSOR_TEST : number/*GLenum*/;
	const POLYGON_OFFSET_FILL : number/*GLenum*/;
	const SAMPLE_ALPHA_TO_COVERAGE : number/*GLenum*/;
	const SAMPLE_COVERAGE : number/*GLenum*/;

	const NO_ERROR : number/*GLenum*/;
	const INVALID_ENUM : number/*GLenum*/;
	const INVALID_VALUE : number/*GLenum*/;
	const INVALID_OPERATION : number/*GLenum*/;
	const OUT_OF_MEMORY : number/*GLenum*/;

	const CW : number/*GLenum*/;
	const CCW : number/*GLenum*/;

	const LINE_WIDTH : number/*GLenum*/;
	const ALIASED_POINT_SIZE_RANGE : number/*GLenum*/;
	const ALIASED_LINE_WIDTH_RANGE : number/*GLenum*/;
	const CULL_FACE_MODE : number/*GLenum*/;
	const FRONT_FACE : number/*GLenum*/;
	const DEPTH_RANGE : number/*GLenum*/;
	const DEPTH_WRITEMASK : number/*GLenum*/;
	const DEPTH_CLEAR_VALUE : number/*GLenum*/;
	const DEPTH_FUNC : number/*GLenum*/;
	const STENCIL_CLEAR_VALUE : number/*GLenum*/;
	const STENCIL_FUNC : number/*GLenum*/;
	const STENCIL_FAIL : number/*GLenum*/;
	const STENCIL_PASS_DEPTH_FAIL : number/*GLenum*/;
	const STENCIL_PASS_DEPTH_PASS : number/*GLenum*/;
	const STENCIL_REF : number/*GLenum*/;
	const STENCIL_VALUE_MASK : number/*GLenum*/;
	const STENCIL_WRITEMASK : number/*GLenum*/;
	const STENCIL_BACK_FUNC : number/*GLenum*/;
	const STENCIL_BACK_FAIL : number/*GLenum*/;
	const STENCIL_BACK_PASS_DEPTH_FAIL : number/*GLenum*/;
	const STENCIL_BACK_PASS_DEPTH_PASS : number/*GLenum*/;
	const STENCIL_BACK_REF : number/*GLenum*/;
	const STENCIL_BACK_VALUE_MASK : number/*GLenum*/;
	const STENCIL_BACK_WRITEMASK : number/*GLenum*/;
	const VIEWPORT : number/*GLenum*/;
	const SCISSOR_BOX : number/*GLenum*/;
	const COLOR_CLEAR_VALUE : number/*GLenum*/;
	const COLOR_WRITEMASK : number/*GLenum*/;
	const UNPACK_ALIGNMENT : number/*GLenum*/;
	const PACK_ALIGNMENT : number/*GLenum*/;
	const MAX_TEXTURE_SIZE : number/*GLenum*/;
	const MAX_VIEWPORT_DIMS : number/*GLenum*/;
	const SUBPIXEL_BITS : number/*GLenum*/;
	const RED_BITS : number/*GLenum*/;
	const GREEN_BITS : number/*GLenum*/;
	const BLUE_BITS : number/*GLenum*/;
	const ALPHA_BITS : number/*GLenum*/;
	const DEPTH_BITS : number/*GLenum*/;
	const STENCIL_BITS : number/*GLenum*/;
	const POLYGON_OFFSET_UNITS : number/*GLenum*/;
	const POLYGON_OFFSET_FACTOR : number/*GLenum*/;
	const TEXTURE_BINDING_2D : number/*GLenum*/;
	const SAMPLE_BUFFERS : number/*GLenum*/;
	const SAMPLES : number/*GLenum*/;
	const SAMPLE_COVERAGE_VALUE : number/*GLenum*/;
	const SAMPLE_COVERAGE_INVERT : number/*GLenum*/;

	const NUM_COMPRESSED_TEXTURE_FORMATS : number/*GLenum*/;
	const COMPRESSED_TEXTURE_FORMATS : number/*GLenum*/;

	const DONT_CARE : number/*GLenum*/;
	const FASTEST : number/*GLenum*/;
	const NICEST : number/*GLenum*/;

	const GENERATE_MIPMAP_HINT : number/*GLenum*/;

	const BYTE : number/*GLenum*/;
	const UNSIGNED_BYTE : number/*GLenum*/;
	const SHORT : number/*GLenum*/;
	const UNSIGNED_SHORT : number/*GLenum*/;
	const INT : number/*GLenum*/;
	const UNSIGNED_INT : number/*GLenum*/;
	const FLOAT : number/*GLenum*/;

	const DEPTH_COMPONENT : number/*GLenum*/;
	const ALPHA : number/*GLenum*/;
	const RGB : number/*GLenum*/;
	const RGBA : number/*GLenum*/;
	const LUMINANCE : number/*GLenum*/;
	const LUMINANCE_ALPHA : number/*GLenum*/;

	const UNSIGNED_SHORT_4_4_4_4 : number/*GLenum*/;
	const UNSIGNED_SHORT_5_5_5_1 : number/*GLenum*/;
	const UNSIGNED_SHORT_5_6_5 : number/*GLenum*/;

	const FRAGMENT_SHADER : number/*GLenum*/;
	const VERTEX_SHADER : number/*GLenum*/;
	const MAX_VERTEX_ATTRIBS : number/*GLenum*/;
	const MAX_VERTEX_UNIFORM_VECTORS : number/*GLenum*/;
	const MAX_VARYING_VECTORS : number/*GLenum*/;
	const MAX_COMBINED_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	const MAX_VERTEX_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	const MAX_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	const MAX_FRAGMENT_UNIFORM_VECTORS : number/*GLenum*/;
	const SHADER_TYPE : number/*GLenum*/;
	const DELETE_STATUS : number/*GLenum*/;
	const LINK_STATUS : number/*GLenum*/;
	const VALIDATE_STATUS : number/*GLenum*/;
	const ATTACHED_SHADERS : number/*GLenum*/;
	const ACTIVE_UNIFORMS : number/*GLenum*/;
	const ACTIVE_ATTRIBUTES : number/*GLenum*/;
	const SHADING_LANGUAGE_VERSION : number/*GLenum*/;
	const CURRENT_PROGRAM : number/*GLenum*/;

	const NEVER : number/*GLenum*/;
	const LESS : number/*GLenum*/;
	const EQUAL : number/*GLenum*/;
	const LEQUAL : number/*GLenum*/;
	const GREATER : number/*GLenum*/;
	const NOTEQUAL : number/*GLenum*/;
	const GEQUAL : number/*GLenum*/;
	const ALWAYS : number/*GLenum*/;

	const KEEP : number/*GLenum*/;
	const REPLACE : number/*GLenum*/;
	const INCR : number/*GLenum*/;
	const DECR : number/*GLenum*/;
	const INVERT : number/*GLenum*/;
	const INCR_WRAP : number/*GLenum*/;
	const DECR_WRAP : number/*GLenum*/;

	const VENDOR : number/*GLenum*/;
	const RENDERER : number/*GLenum*/;
	const VERSION : number/*GLenum*/;

	const NEAREST : number/*GLenum*/;
	const LINEAR : number/*GLenum*/;

	const NEAREST_MIPMAP_NEAREST : number/*GLenum*/;
	const LINEAR_MIPMAP_NEAREST : number/*GLenum*/;
	const NEAREST_MIPMAP_LINEAR : number/*GLenum*/;
	const LINEAR_MIPMAP_LINEAR : number/*GLenum*/;

	const TEXTURE_MAG_FILTER : number/*GLenum*/;
	const TEXTURE_MIN_FILTER : number/*GLenum*/;
	const TEXTURE_WRAP_S : number/*GLenum*/;
	const TEXTURE_WRAP_T : number/*GLenum*/;

	const TEXTURE_2D : number/*GLenum*/;
	const TEXTURE : number/*GLenum*/;

	const TEXTURE_CUBE_MAP : number/*GLenum*/;
	const TEXTURE_BINDING_CUBE_MAP : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_POSITIVE_X : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_NEGATIVE_X : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_POSITIVE_Y : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_NEGATIVE_Y : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_POSITIVE_Z : number/*GLenum*/;
	const TEXTURE_CUBE_MAP_NEGATIVE_Z : number/*GLenum*/;
	const MAX_CUBE_MAP_TEXTURE_SIZE : number/*GLenum*/;

	const TEXTURE0 : number/*GLenum*/;
	const TEXTURE1 : number/*GLenum*/;
	const TEXTURE2 : number/*GLenum*/;
	const TEXTURE3 : number/*GLenum*/;
	const TEXTURE4 : number/*GLenum*/;
	const TEXTURE5 : number/*GLenum*/;
	const TEXTURE6 : number/*GLenum*/;
	const TEXTURE7 : number/*GLenum*/;
	const TEXTURE8 : number/*GLenum*/;
	const TEXTURE9 : number/*GLenum*/;
	const TEXTURE10 : number/*GLenum*/;
	const TEXTURE11 : number/*GLenum*/;
	const TEXTURE12 : number/*GLenum*/;
	const TEXTURE13 : number/*GLenum*/;
	const TEXTURE14 : number/*GLenum*/;
	const TEXTURE15 : number/*GLenum*/;
	const TEXTURE16 : number/*GLenum*/;
	const TEXTURE17 : number/*GLenum*/;
	const TEXTURE18 : number/*GLenum*/;
	const TEXTURE19 : number/*GLenum*/;
	const TEXTURE20 : number/*GLenum*/;
	const TEXTURE21 : number/*GLenum*/;
	const TEXTURE22 : number/*GLenum*/;
	const TEXTURE23 : number/*GLenum*/;
	const TEXTURE24 : number/*GLenum*/;
	const TEXTURE25 : number/*GLenum*/;
	const TEXTURE26 : number/*GLenum*/;
	const TEXTURE27 : number/*GLenum*/;
	const TEXTURE28 : number/*GLenum*/;
	const TEXTURE29 : number/*GLenum*/;
	const TEXTURE30 : number/*GLenum*/;
	const TEXTURE31 : number/*GLenum*/;
	const ACTIVE_TEXTURE : number/*GLenum*/;

	const REPEAT : number/*GLenum*/;
	const CLAMP_TO_EDGE : number/*GLenum*/;
	const MIRRORED_REPEAT : number/*GLenum*/;

	const FLOAT_VEC2 : number/*GLenum*/;
	const FLOAT_VEC3 : number/*GLenum*/;
	const FLOAT_VEC4 : number/*GLenum*/;
	const INT_VEC2 : number/*GLenum*/;
	const INT_VEC3 : number/*GLenum*/;
	const INT_VEC4 : number/*GLenum*/;
	const BOOL : number/*GLenum*/;
	const BOOL_VEC2 : number/*GLenum*/;
	const BOOL_VEC3 : number/*GLenum*/;
	const BOOL_VEC4 : number/*GLenum*/;
	const FLOAT_MAT2 : number/*GLenum*/;
	const FLOAT_MAT3 : number/*GLenum*/;
	const FLOAT_MAT4 : number/*GLenum*/;
	const SAMPLER_2D : number/*GLenum*/;
	const SAMPLER_CUBE : number/*GLenum*/;

	const VERTEX_ATTRIB_ARRAY_ENABLED : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_SIZE : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_STRIDE : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_TYPE : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_NORMALIZED : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_POINTER : number/*GLenum*/;
	const VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : number/*GLenum*/;

	const COMPILE_STATUS : number/*GLenum*/;

	const LOW_FLOAT : number/*GLenum*/;
	const MEDIUM_FLOAT : number/*GLenum*/;
	const HIGH_FLOAT : number/*GLenum*/;
	const LOW_INT : number/*GLenum*/;
	const MEDIUM_INT : number/*GLenum*/;
	const HIGH_INT : number/*GLenum*/;

	const FRAMEBUFFER : number/*GLenum*/;
	const RENDERBUFFER : number/*GLenum*/;

	const RGBA4 : number/*GLenum*/;
	const RGB5_A1 : number/*GLenum*/;
	const RGB565 : number/*GLenum*/;
	const DEPTH_COMPONENT16 : number/*GLenum*/;
	const STENCIL_INDEX : number/*GLenum*/;
	const STENCIL_INDEX8 : number/*GLenum*/;
	const DEPTH_STENCIL : number/*GLenum*/;

	const RENDERBUFFER_WIDTH : number/*GLenum*/;
	const RENDERBUFFER_HEIGHT : number/*GLenum*/;
	const RENDERBUFFER_INTERNAL_FORMAT : number/*GLenum*/;
	const RENDERBUFFER_RED_SIZE : number/*GLenum*/;
	const RENDERBUFFER_GREEN_SIZE : number/*GLenum*/;
	const RENDERBUFFER_BLUE_SIZE : number/*GLenum*/;
	const RENDERBUFFER_ALPHA_SIZE : number/*GLenum*/;
	const RENDERBUFFER_DEPTH_SIZE : number/*GLenum*/;
	const RENDERBUFFER_STENCIL_SIZE : number/*GLenum*/;

	const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : number/*GLenum*/;
	const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : number/*GLenum*/;
	const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : number/*GLenum*/;
	const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : number/*GLenum*/;

	const COLOR_ATTACHMENT0 : number/*GLenum*/;
	const DEPTH_ATTACHMENT : number/*GLenum*/;
	const STENCIL_ATTACHMENT : number/*GLenum*/;
	const DEPTH_STENCIL_ATTACHMENT : number/*GLenum*/;

	const NONE : number/*GLenum*/;

	const FRAMEBUFFER_COMPLETE : number/*GLenum*/;
	const FRAMEBUFFER_INCOMPLETE_ATTACHMENT : number/*GLenum*/;
	const FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : number/*GLenum*/;
	const FRAMEBUFFER_INCOMPLETE_DIMENSIONS : number/*GLenum*/;
	const FRAMEBUFFER_UNSUPPORTED : number/*GLenum*/;

	const FRAMEBUFFER_BINDING : number/*GLenum*/;
	const RENDERBUFFER_BINDING : number/*GLenum*/;
	const MAX_RENDERBUFFER_SIZE : number/*GLenum*/;

	const INVALID_FRAMEBUFFER_OPERATION : number/*GLenum*/;

	const UNPACK_FLIP_Y_WEBGL : number/*GLenum*/;
	const UNPACK_PREMULTIPLY_ALPHA_WEBGL : number/*GLenum*/;
	const CONTEXT_LOST_WEBGL : number/*GLenum*/;
	const UNPACK_COLORSPACE_CONVERSION_WEBGL : number/*GLenum*/;
	const BROWSER_DEFAULT_WEBGL : number/*GLenum*/;


	 // attributes
	//================

	const canvas : HTMLCanvasElement;
	const drawingBufferWidth : number/*GLenum*/;
	const drawingBufferHeight : number/*GLenum*/;


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


