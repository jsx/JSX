// WebGL
// http://www.khronos.org/webgl/
//

import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "typedarray.jsx";

native class WebGLRenderingContext implements CanvasRenderingContext {

	 // constants
	//================

	__readonly__ var DEPTH_BUFFER_BIT : number/*GLenum*/;
	__readonly__ var STENCIL_BUFFER_BIT : number/*GLenum*/;
	__readonly__ var COLOR_BUFFER_BIT : number/*GLenum*/;

	__readonly__ var POINTS : number/*GLenum*/;
	__readonly__ var LINES : number/*GLenum*/;
	__readonly__ var LINE_LOOP : number/*GLenum*/;
	__readonly__ var LINE_STRIP : number/*GLenum*/;
	__readonly__ var TRIANGLES : number/*GLenum*/;
	__readonly__ var TRIANGLE_STRIP : number/*GLenum*/;
	__readonly__ var TRIANGLE_FAN : number/*GLenum*/;

	__readonly__ var ZERO : number/*GLenum*/;
	__readonly__ var ONE : number/*GLenum*/;
	__readonly__ var SRC_COLOR : number/*GLenum*/;
	__readonly__ var ONE_MINUS_SRC_COLOR : number/*GLenum*/;
	__readonly__ var SRC_ALPHA : number/*GLenum*/;
	__readonly__ var ONE_MINUS_SRC_ALPHA : number/*GLenum*/;
	__readonly__ var DST_ALPHA : number/*GLenum*/;
	__readonly__ var ONE_MINUS_DST_ALPHA : number/*GLenum*/;

	__readonly__ var DST_COLOR : number/*GLenum*/;
	__readonly__ var ONE_MINUS_DST_COLOR : number/*GLenum*/;
	__readonly__ var SRC_ALPHA_SATURATE : number/*GLenum*/;

	__readonly__ var FUNC_ADD : number/*GLenum*/;
	__readonly__ var BLEND_EQUATION : number/*GLenum*/;
	__readonly__ var BLEND_EQUATION_RGB : number/*GLenum*/;
	__readonly__ var BLEND_EQUATION_ALPHA : number/*GLenum*/;

	__readonly__ var FUNC_SUBTRACT : number/*GLenum*/;
	__readonly__ var FUNC_REVERSE_SUBTRACT : number/*GLenum*/;

	__readonly__ var BLEND_DST_RGB : number/*GLenum*/;
	__readonly__ var BLEND_SRC_RGB : number/*GLenum*/;
	__readonly__ var BLEND_DST_ALPHA : number/*GLenum*/;
	__readonly__ var BLEND_SRC_ALPHA : number/*GLenum*/;
	__readonly__ var CONSTANT_COLOR : number/*GLenum*/;
	__readonly__ var ONE_MINUS_CONSTANT_COLOR : number/*GLenum*/;
	__readonly__ var CONSTANT_ALPHA : number/*GLenum*/;
	__readonly__ var ONE_MINUS_CONSTANT_ALPHA : number/*GLenum*/;
	__readonly__ var BLEND_COLOR : number/*GLenum*/;

	__readonly__ var ARRAY_BUFFER : number/*GLenum*/;
	__readonly__ var ELEMENT_ARRAY_BUFFER : number/*GLenum*/;
	__readonly__ var ARRAY_BUFFER_BINDING : number/*GLenum*/;
	__readonly__ var ELEMENT_ARRAY_BUFFER_BINDING : number/*GLenum*/;

	__readonly__ var STREAM_DRAW : number/*GLenum*/;
	__readonly__ var STATIC_DRAW : number/*GLenum*/;
	__readonly__ var DYNAMIC_DRAW : number/*GLenum*/;

	__readonly__ var BUFFER_SIZE : number/*GLenum*/;
	__readonly__ var BUFFER_USAGE : number/*GLenum*/;

	__readonly__ var CURRENT_VERTEX_ATTRIB : number/*GLenum*/;

	__readonly__ var FRONT : number/*GLenum*/;
	__readonly__ var BACK : number/*GLenum*/;
	__readonly__ var FRONT_AND_BACK : number/*GLenum*/;

	__readonly__ var CULL_FACE : number/*GLenum*/;
	__readonly__ var BLEND : number/*GLenum*/;
	__readonly__ var DITHER : number/*GLenum*/;
	__readonly__ var STENCIL_TEST : number/*GLenum*/;
	__readonly__ var DEPTH_TEST : number/*GLenum*/;
	__readonly__ var SCISSOR_TEST : number/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_FILL : number/*GLenum*/;
	__readonly__ var SAMPLE_ALPHA_TO_COVERAGE : number/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE : number/*GLenum*/;

	__readonly__ var NO_ERROR : number/*GLenum*/;
	__readonly__ var INVALID_ENUM : number/*GLenum*/;
	__readonly__ var INVALID_VALUE : number/*GLenum*/;
	__readonly__ var INVALID_OPERATION : number/*GLenum*/;
	__readonly__ var OUT_OF_MEMORY : number/*GLenum*/;

	__readonly__ var CW : number/*GLenum*/;
	__readonly__ var CCW : number/*GLenum*/;

	__readonly__ var LINE_WIDTH : number/*GLenum*/;
	__readonly__ var ALIASED_POINT_SIZE_RANGE : number/*GLenum*/;
	__readonly__ var ALIASED_LINE_WIDTH_RANGE : number/*GLenum*/;
	__readonly__ var CULL_FACE_MODE : number/*GLenum*/;
	__readonly__ var FRONT_FACE : number/*GLenum*/;
	__readonly__ var DEPTH_RANGE : number/*GLenum*/;
	__readonly__ var DEPTH_WRITEMASK : number/*GLenum*/;
	__readonly__ var DEPTH_CLEAR_VALUE : number/*GLenum*/;
	__readonly__ var DEPTH_FUNC : number/*GLenum*/;
	__readonly__ var STENCIL_CLEAR_VALUE : number/*GLenum*/;
	__readonly__ var STENCIL_FUNC : number/*GLenum*/;
	__readonly__ var STENCIL_FAIL : number/*GLenum*/;
	__readonly__ var STENCIL_PASS_DEPTH_FAIL : number/*GLenum*/;
	__readonly__ var STENCIL_PASS_DEPTH_PASS : number/*GLenum*/;
	__readonly__ var STENCIL_REF : number/*GLenum*/;
	__readonly__ var STENCIL_VALUE_MASK : number/*GLenum*/;
	__readonly__ var STENCIL_WRITEMASK : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_FUNC : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_FAIL : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_PASS_DEPTH_FAIL : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_PASS_DEPTH_PASS : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_REF : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_VALUE_MASK : number/*GLenum*/;
	__readonly__ var STENCIL_BACK_WRITEMASK : number/*GLenum*/;
	__readonly__ var VIEWPORT : number/*GLenum*/;
	__readonly__ var SCISSOR_BOX : number/*GLenum*/;
	__readonly__ var COLOR_CLEAR_VALUE : number/*GLenum*/;
	__readonly__ var COLOR_WRITEMASK : number/*GLenum*/;
	__readonly__ var UNPACK_ALIGNMENT : number/*GLenum*/;
	__readonly__ var PACK_ALIGNMENT : number/*GLenum*/;
	__readonly__ var MAX_TEXTURE_SIZE : number/*GLenum*/;
	__readonly__ var MAX_VIEWPORT_DIMS : number/*GLenum*/;
	__readonly__ var SUBPIXEL_BITS : number/*GLenum*/;
	__readonly__ var RED_BITS : number/*GLenum*/;
	__readonly__ var GREEN_BITS : number/*GLenum*/;
	__readonly__ var BLUE_BITS : number/*GLenum*/;
	__readonly__ var ALPHA_BITS : number/*GLenum*/;
	__readonly__ var DEPTH_BITS : number/*GLenum*/;
	__readonly__ var STENCIL_BITS : number/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_UNITS : number/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_FACTOR : number/*GLenum*/;
	__readonly__ var TEXTURE_BINDING_2D : number/*GLenum*/;
	__readonly__ var SAMPLE_BUFFERS : number/*GLenum*/;
	__readonly__ var SAMPLES : number/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE_VALUE : number/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE_INVERT : number/*GLenum*/;

	__readonly__ var NUM_COMPRESSED_TEXTURE_FORMATS : number/*GLenum*/;
	__readonly__ var COMPRESSED_TEXTURE_FORMATS : number/*GLenum*/;

	__readonly__ var DONT_CARE : number/*GLenum*/;
	__readonly__ var FASTEST : number/*GLenum*/;
	__readonly__ var NICEST : number/*GLenum*/;

	__readonly__ var GENERATE_MIPMAP_HINT : number/*GLenum*/;

	__readonly__ var BYTE : number/*GLenum*/;
	__readonly__ var UNSIGNED_BYTE : number/*GLenum*/;
	__readonly__ var SHORT : number/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT : number/*GLenum*/;
	__readonly__ var INT : number/*GLenum*/;
	__readonly__ var UNSIGNED_INT : number/*GLenum*/;
	__readonly__ var FLOAT : number/*GLenum*/;

	__readonly__ var DEPTH_COMPONENT : number/*GLenum*/;
	__readonly__ var ALPHA : number/*GLenum*/;
	__readonly__ var RGB : number/*GLenum*/;
	__readonly__ var RGBA : number/*GLenum*/;
	__readonly__ var LUMINANCE : number/*GLenum*/;
	__readonly__ var LUMINANCE_ALPHA : number/*GLenum*/;

	__readonly__ var UNSIGNED_SHORT_4_4_4_4 : number/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT_5_5_5_1 : number/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT_5_6_5 : number/*GLenum*/;

	__readonly__ var FRAGMENT_SHADER : number/*GLenum*/;
	__readonly__ var VERTEX_SHADER : number/*GLenum*/;
	__readonly__ var MAX_VERTEX_ATTRIBS : number/*GLenum*/;
	__readonly__ var MAX_VERTEX_UNIFORM_VECTORS : number/*GLenum*/;
	__readonly__ var MAX_VARYING_VECTORS : number/*GLenum*/;
	__readonly__ var MAX_COMBINED_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	__readonly__ var MAX_VERTEX_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	__readonly__ var MAX_TEXTURE_IMAGE_UNITS : number/*GLenum*/;
	__readonly__ var MAX_FRAGMENT_UNIFORM_VECTORS : number/*GLenum*/;
	__readonly__ var SHADER_TYPE : number/*GLenum*/;
	__readonly__ var DELETE_STATUS : number/*GLenum*/;
	__readonly__ var LINK_STATUS : number/*GLenum*/;
	__readonly__ var VALIDATE_STATUS : number/*GLenum*/;
	__readonly__ var ATTACHED_SHADERS : number/*GLenum*/;
	__readonly__ var ACTIVE_UNIFORMS : number/*GLenum*/;
	__readonly__ var ACTIVE_ATTRIBUTES : number/*GLenum*/;
	__readonly__ var SHADING_LANGUAGE_VERSION : number/*GLenum*/;
	__readonly__ var CURRENT_PROGRAM : number/*GLenum*/;

	__readonly__ var NEVER : number/*GLenum*/;
	__readonly__ var LESS : number/*GLenum*/;
	__readonly__ var EQUAL : number/*GLenum*/;
	__readonly__ var LEQUAL : number/*GLenum*/;
	__readonly__ var GREATER : number/*GLenum*/;
	__readonly__ var NOTEQUAL : number/*GLenum*/;
	__readonly__ var GEQUAL : number/*GLenum*/;
	__readonly__ var ALWAYS : number/*GLenum*/;

	__readonly__ var KEEP : number/*GLenum*/;
	__readonly__ var REPLACE : number/*GLenum*/;
	__readonly__ var INCR : number/*GLenum*/;
	__readonly__ var DECR : number/*GLenum*/;
	__readonly__ var INVERT : number/*GLenum*/;
	__readonly__ var INCR_WRAP : number/*GLenum*/;
	__readonly__ var DECR_WRAP : number/*GLenum*/;

	__readonly__ var VENDOR : number/*GLenum*/;
	__readonly__ var RENDERER : number/*GLenum*/;
	__readonly__ var VERSION : number/*GLenum*/;

	__readonly__ var NEAREST : number/*GLenum*/;
	__readonly__ var LINEAR : number/*GLenum*/;

	__readonly__ var NEAREST_MIPMAP_NEAREST : number/*GLenum*/;
	__readonly__ var LINEAR_MIPMAP_NEAREST : number/*GLenum*/;
	__readonly__ var NEAREST_MIPMAP_LINEAR : number/*GLenum*/;
	__readonly__ var LINEAR_MIPMAP_LINEAR : number/*GLenum*/;

	__readonly__ var TEXTURE_MAG_FILTER : number/*GLenum*/;
	__readonly__ var TEXTURE_MIN_FILTER : number/*GLenum*/;
	__readonly__ var TEXTURE_WRAP_S : number/*GLenum*/;
	__readonly__ var TEXTURE_WRAP_T : number/*GLenum*/;

	__readonly__ var TEXTURE_2D : number/*GLenum*/;
	__readonly__ var TEXTURE : number/*GLenum*/;

	__readonly__ var TEXTURE_CUBE_MAP : number/*GLenum*/;
	__readonly__ var TEXTURE_BINDING_CUBE_MAP : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_X : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_X : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_Y : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_Y : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_Z : number/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_Z : number/*GLenum*/;
	__readonly__ var MAX_CUBE_MAP_TEXTURE_SIZE : number/*GLenum*/;

	__readonly__ var TEXTURE0 : number/*GLenum*/;
	__readonly__ var TEXTURE1 : number/*GLenum*/;
	__readonly__ var TEXTURE2 : number/*GLenum*/;
	__readonly__ var TEXTURE3 : number/*GLenum*/;
	__readonly__ var TEXTURE4 : number/*GLenum*/;
	__readonly__ var TEXTURE5 : number/*GLenum*/;
	__readonly__ var TEXTURE6 : number/*GLenum*/;
	__readonly__ var TEXTURE7 : number/*GLenum*/;
	__readonly__ var TEXTURE8 : number/*GLenum*/;
	__readonly__ var TEXTURE9 : number/*GLenum*/;
	__readonly__ var TEXTURE10 : number/*GLenum*/;
	__readonly__ var TEXTURE11 : number/*GLenum*/;
	__readonly__ var TEXTURE12 : number/*GLenum*/;
	__readonly__ var TEXTURE13 : number/*GLenum*/;
	__readonly__ var TEXTURE14 : number/*GLenum*/;
	__readonly__ var TEXTURE15 : number/*GLenum*/;
	__readonly__ var TEXTURE16 : number/*GLenum*/;
	__readonly__ var TEXTURE17 : number/*GLenum*/;
	__readonly__ var TEXTURE18 : number/*GLenum*/;
	__readonly__ var TEXTURE19 : number/*GLenum*/;
	__readonly__ var TEXTURE20 : number/*GLenum*/;
	__readonly__ var TEXTURE21 : number/*GLenum*/;
	__readonly__ var TEXTURE22 : number/*GLenum*/;
	__readonly__ var TEXTURE23 : number/*GLenum*/;
	__readonly__ var TEXTURE24 : number/*GLenum*/;
	__readonly__ var TEXTURE25 : number/*GLenum*/;
	__readonly__ var TEXTURE26 : number/*GLenum*/;
	__readonly__ var TEXTURE27 : number/*GLenum*/;
	__readonly__ var TEXTURE28 : number/*GLenum*/;
	__readonly__ var TEXTURE29 : number/*GLenum*/;
	__readonly__ var TEXTURE30 : number/*GLenum*/;
	__readonly__ var TEXTURE31 : number/*GLenum*/;
	__readonly__ var ACTIVE_TEXTURE : number/*GLenum*/;

	__readonly__ var REPEAT : number/*GLenum*/;
	__readonly__ var CLAMP_TO_EDGE : number/*GLenum*/;
	__readonly__ var MIRRORED_REPEAT : number/*GLenum*/;

	__readonly__ var FLOAT_VEC2 : number/*GLenum*/;
	__readonly__ var FLOAT_VEC3 : number/*GLenum*/;
	__readonly__ var FLOAT_VEC4 : number/*GLenum*/;
	__readonly__ var INT_VEC2 : number/*GLenum*/;
	__readonly__ var INT_VEC3 : number/*GLenum*/;
	__readonly__ var INT_VEC4 : number/*GLenum*/;
	__readonly__ var BOOL : number/*GLenum*/;
	__readonly__ var BOOL_VEC2 : number/*GLenum*/;
	__readonly__ var BOOL_VEC3 : number/*GLenum*/;
	__readonly__ var BOOL_VEC4 : number/*GLenum*/;
	__readonly__ var FLOAT_MAT2 : number/*GLenum*/;
	__readonly__ var FLOAT_MAT3 : number/*GLenum*/;
	__readonly__ var FLOAT_MAT4 : number/*GLenum*/;
	__readonly__ var SAMPLER_2D : number/*GLenum*/;
	__readonly__ var SAMPLER_CUBE : number/*GLenum*/;

	__readonly__ var VERTEX_ATTRIB_ARRAY_ENABLED : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_SIZE : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_STRIDE : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_TYPE : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_NORMALIZED : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_POINTER : number/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : number/*GLenum*/;

	__readonly__ var COMPILE_STATUS : number/*GLenum*/;

	__readonly__ var LOW_FLOAT : number/*GLenum*/;
	__readonly__ var MEDIUM_FLOAT : number/*GLenum*/;
	__readonly__ var HIGH_FLOAT : number/*GLenum*/;
	__readonly__ var LOW_INT : number/*GLenum*/;
	__readonly__ var MEDIUM_INT : number/*GLenum*/;
	__readonly__ var HIGH_INT : number/*GLenum*/;

	__readonly__ var FRAMEBUFFER : number/*GLenum*/;
	__readonly__ var RENDERBUFFER : number/*GLenum*/;

	__readonly__ var RGBA4 : number/*GLenum*/;
	__readonly__ var RGB5_A1 : number/*GLenum*/;
	__readonly__ var RGB565 : number/*GLenum*/;
	__readonly__ var DEPTH_COMPONENT16 : number/*GLenum*/;
	__readonly__ var STENCIL_INDEX : number/*GLenum*/;
	__readonly__ var STENCIL_INDEX8 : number/*GLenum*/;
	__readonly__ var DEPTH_STENCIL : number/*GLenum*/;

	__readonly__ var RENDERBUFFER_WIDTH : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_HEIGHT : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_INTERNAL_FORMAT : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_RED_SIZE : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_GREEN_SIZE : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_BLUE_SIZE : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_ALPHA_SIZE : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_DEPTH_SIZE : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_STENCIL_SIZE : number/*GLenum*/;

	__readonly__ var FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : number/*GLenum*/;

	__readonly__ var COLOR_ATTACHMENT0 : number/*GLenum*/;
	__readonly__ var DEPTH_ATTACHMENT : number/*GLenum*/;
	__readonly__ var STENCIL_ATTACHMENT : number/*GLenum*/;
	__readonly__ var DEPTH_STENCIL_ATTACHMENT : number/*GLenum*/;

	__readonly__ var NONE : number/*GLenum*/;

	__readonly__ var FRAMEBUFFER_COMPLETE : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_ATTACHMENT : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_DIMENSIONS : number/*GLenum*/;
	__readonly__ var FRAMEBUFFER_UNSUPPORTED : number/*GLenum*/;

	__readonly__ var FRAMEBUFFER_BINDING : number/*GLenum*/;
	__readonly__ var RENDERBUFFER_BINDING : number/*GLenum*/;
	__readonly__ var MAX_RENDERBUFFER_SIZE : number/*GLenum*/;

	__readonly__ var INVALID_FRAMEBUFFER_OPERATION : number/*GLenum*/;

	__readonly__ var UNPACK_FLIP_Y_WEBGL : number/*GLenum*/;
	__readonly__ var UNPACK_PREMULTIPLY_ALPHA_WEBGL : number/*GLenum*/;
	__readonly__ var CONTEXT_LOST_WEBGL : number/*GLenum*/;
	__readonly__ var UNPACK_COLORSPACE_CONVERSION_WEBGL : number/*GLenum*/;
	__readonly__ var BROWSER_DEFAULT_WEBGL : number/*GLenum*/;


	 // attributes
	//================

	__readonly__ var canvas : HTMLCanvasElement;
	__readonly__ var drawingBufferWidth : number/*GLenum*/;
	__readonly__ var drawingBufferHeight : number/*GLenum*/;


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


