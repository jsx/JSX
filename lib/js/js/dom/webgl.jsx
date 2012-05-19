// WebGL
// http://www.khronos.org/webgl/
//

import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "typedarray.jsx";

// generated from https://www.khronos.org/registry/webgl/specs/1.0/
native class WebGLContextAttributes {
	// FIXME: delete function constructor();
	var alpha : boolean;
	var depth : boolean;
	var stencil : boolean;
	var antialias : boolean;
	var premultipliedAlpha : boolean;
	var preserveDrawingBuffer : boolean;
}

native class WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLBuffer extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLFramebuffer extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLProgram extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLRenderbuffer extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLShader extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLTexture extends WebGLObject {
	// FIXME: delete function constructor();
}

native class WebGLUniformLocation {
	// FIXME: delete function constructor();
}

native class WebGLActiveInfo {
	// FIXME: delete function constructor();
	__readonly__ var size : int/*GLint*/;
	__readonly__ var type : int/*GLenum*/;
	__readonly__ var name : string/*DOMString*/;
}

native class WebGLRenderingContext implements CanvasRenderingContext {
	// FIXME: delete function constructor();
	/* ClearBufferMask */
	static const     DEPTH_BUFFER_BIT : int/*GLenum*/;
	__readonly__ var DEPTH_BUFFER_BIT : int/*GLenum*/;
	static const     STENCIL_BUFFER_BIT : int/*GLenum*/;
	__readonly__ var STENCIL_BUFFER_BIT : int/*GLenum*/;
	static const     COLOR_BUFFER_BIT : int/*GLenum*/;
	__readonly__ var COLOR_BUFFER_BIT : int/*GLenum*/;
	/* BeginMode */
	static const     POINTS : int/*GLenum*/;
	__readonly__ var POINTS : int/*GLenum*/;
	static const     LINES : int/*GLenum*/;
	__readonly__ var LINES : int/*GLenum*/;
	static const     LINE_LOOP : int/*GLenum*/;
	__readonly__ var LINE_LOOP : int/*GLenum*/;
	static const     LINE_STRIP : int/*GLenum*/;
	__readonly__ var LINE_STRIP : int/*GLenum*/;
	static const     TRIANGLES : int/*GLenum*/;
	__readonly__ var TRIANGLES : int/*GLenum*/;
	static const     TRIANGLE_STRIP : int/*GLenum*/;
	__readonly__ var TRIANGLE_STRIP : int/*GLenum*/;
	static const     TRIANGLE_FAN : int/*GLenum*/;
	__readonly__ var TRIANGLE_FAN : int/*GLenum*/;
	/* AlphaFunction (not supported in ES20) */
	/*      NEVER */
	/*      LESS */
	/*      EQUAL */
	/*      LEQUAL */
	/*      GREATER */
	/*      NOTEQUAL */
	/*      GEQUAL */
	/*      ALWAYS */
	/* BlendingFactorDest */
	static const     ZERO : int/*GLenum*/;
	__readonly__ var ZERO : int/*GLenum*/;
	static const     ONE : int/*GLenum*/;
	__readonly__ var ONE : int/*GLenum*/;
	static const     SRC_COLOR : int/*GLenum*/;
	__readonly__ var SRC_COLOR : int/*GLenum*/;
	static const     ONE_MINUS_SRC_COLOR : int/*GLenum*/;
	__readonly__ var ONE_MINUS_SRC_COLOR : int/*GLenum*/;
	static const     SRC_ALPHA : int/*GLenum*/;
	__readonly__ var SRC_ALPHA : int/*GLenum*/;
	static const     ONE_MINUS_SRC_ALPHA : int/*GLenum*/;
	__readonly__ var ONE_MINUS_SRC_ALPHA : int/*GLenum*/;
	static const     DST_ALPHA : int/*GLenum*/;
	__readonly__ var DST_ALPHA : int/*GLenum*/;
	static const     ONE_MINUS_DST_ALPHA : int/*GLenum*/;
	__readonly__ var ONE_MINUS_DST_ALPHA : int/*GLenum*/;
	/* BlendingFactorSrc */
	/*      ZERO */
	/*      ONE */
	static const     DST_COLOR : int/*GLenum*/;
	__readonly__ var DST_COLOR : int/*GLenum*/;
	static const     ONE_MINUS_DST_COLOR : int/*GLenum*/;
	__readonly__ var ONE_MINUS_DST_COLOR : int/*GLenum*/;
	static const     SRC_ALPHA_SATURATE : int/*GLenum*/;
	__readonly__ var SRC_ALPHA_SATURATE : int/*GLenum*/;
	/*      SRC_ALPHA */
	/*      ONE_MINUS_SRC_ALPHA */
	/*      DST_ALPHA */
	/*      ONE_MINUS_DST_ALPHA */
	/* BlendEquationSeparate */
	static const     FUNC_ADD : int/*GLenum*/;
	__readonly__ var FUNC_ADD : int/*GLenum*/;
	static const     BLEND_EQUATION : int/*GLenum*/;
	__readonly__ var BLEND_EQUATION : int/*GLenum*/;
	static const     BLEND_EQUATION_RGB : int/*GLenum*/;
	__readonly__ var BLEND_EQUATION_RGB : int/*GLenum*/;
	/* same as BLEND_EQUATION */
	static const     BLEND_EQUATION_ALPHA : int/*GLenum*/;
	__readonly__ var BLEND_EQUATION_ALPHA : int/*GLenum*/;
	/* BlendSubtract */
	static const     FUNC_SUBTRACT : int/*GLenum*/;
	__readonly__ var FUNC_SUBTRACT : int/*GLenum*/;
	static const     FUNC_REVERSE_SUBTRACT : int/*GLenum*/;
	__readonly__ var FUNC_REVERSE_SUBTRACT : int/*GLenum*/;
	/* Separate Blend Functions */
	static const     BLEND_DST_RGB : int/*GLenum*/;
	__readonly__ var BLEND_DST_RGB : int/*GLenum*/;
	static const     BLEND_SRC_RGB : int/*GLenum*/;
	__readonly__ var BLEND_SRC_RGB : int/*GLenum*/;
	static const     BLEND_DST_ALPHA : int/*GLenum*/;
	__readonly__ var BLEND_DST_ALPHA : int/*GLenum*/;
	static const     BLEND_SRC_ALPHA : int/*GLenum*/;
	__readonly__ var BLEND_SRC_ALPHA : int/*GLenum*/;
	static const     CONSTANT_COLOR : int/*GLenum*/;
	__readonly__ var CONSTANT_COLOR : int/*GLenum*/;
	static const     ONE_MINUS_CONSTANT_COLOR : int/*GLenum*/;
	__readonly__ var ONE_MINUS_CONSTANT_COLOR : int/*GLenum*/;
	static const     CONSTANT_ALPHA : int/*GLenum*/;
	__readonly__ var CONSTANT_ALPHA : int/*GLenum*/;
	static const     ONE_MINUS_CONSTANT_ALPHA : int/*GLenum*/;
	__readonly__ var ONE_MINUS_CONSTANT_ALPHA : int/*GLenum*/;
	static const     BLEND_COLOR : int/*GLenum*/;
	__readonly__ var BLEND_COLOR : int/*GLenum*/;
	/* Buffer Objects */
	static const     ARRAY_BUFFER : int/*GLenum*/;
	__readonly__ var ARRAY_BUFFER : int/*GLenum*/;
	static const     ELEMENT_ARRAY_BUFFER : int/*GLenum*/;
	__readonly__ var ELEMENT_ARRAY_BUFFER : int/*GLenum*/;
	static const     ARRAY_BUFFER_BINDING : int/*GLenum*/;
	__readonly__ var ARRAY_BUFFER_BINDING : int/*GLenum*/;
	static const     ELEMENT_ARRAY_BUFFER_BINDING : int/*GLenum*/;
	__readonly__ var ELEMENT_ARRAY_BUFFER_BINDING : int/*GLenum*/;
	static const     STREAM_DRAW : int/*GLenum*/;
	__readonly__ var STREAM_DRAW : int/*GLenum*/;
	static const     STATIC_DRAW : int/*GLenum*/;
	__readonly__ var STATIC_DRAW : int/*GLenum*/;
	static const     DYNAMIC_DRAW : int/*GLenum*/;
	__readonly__ var DYNAMIC_DRAW : int/*GLenum*/;
	static const     BUFFER_SIZE : int/*GLenum*/;
	__readonly__ var BUFFER_SIZE : int/*GLenum*/;
	static const     BUFFER_USAGE : int/*GLenum*/;
	__readonly__ var BUFFER_USAGE : int/*GLenum*/;
	static const     CURRENT_VERTEX_ATTRIB : int/*GLenum*/;
	__readonly__ var CURRENT_VERTEX_ATTRIB : int/*GLenum*/;
	/* CullFaceMode */
	static const     FRONT : int/*GLenum*/;
	__readonly__ var FRONT : int/*GLenum*/;
	static const     BACK : int/*GLenum*/;
	__readonly__ var BACK : int/*GLenum*/;
	static const     FRONT_AND_BACK : int/*GLenum*/;
	__readonly__ var FRONT_AND_BACK : int/*GLenum*/;
	/* DepthFunction */
	/*      NEVER */
	/*      LESS */
	/*      EQUAL */
	/*      LEQUAL */
	/*      GREATER */
	/*      NOTEQUAL */
	/*      GEQUAL */
	/*      ALWAYS */
	/* EnableCap */
	/* TEXTURE_2D */
	static const     CULL_FACE : int/*GLenum*/;
	__readonly__ var CULL_FACE : int/*GLenum*/;
	static const     BLEND : int/*GLenum*/;
	__readonly__ var BLEND : int/*GLenum*/;
	static const     DITHER : int/*GLenum*/;
	__readonly__ var DITHER : int/*GLenum*/;
	static const     STENCIL_TEST : int/*GLenum*/;
	__readonly__ var STENCIL_TEST : int/*GLenum*/;
	static const     DEPTH_TEST : int/*GLenum*/;
	__readonly__ var DEPTH_TEST : int/*GLenum*/;
	static const     SCISSOR_TEST : int/*GLenum*/;
	__readonly__ var SCISSOR_TEST : int/*GLenum*/;
	static const     POLYGON_OFFSET_FILL : int/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_FILL : int/*GLenum*/;
	static const     SAMPLE_ALPHA_TO_COVERAGE : int/*GLenum*/;
	__readonly__ var SAMPLE_ALPHA_TO_COVERAGE : int/*GLenum*/;
	static const     SAMPLE_COVERAGE : int/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE : int/*GLenum*/;
	/* ErrorCode */
	static const     NO_ERROR : int/*GLenum*/;
	__readonly__ var NO_ERROR : int/*GLenum*/;
	static const     INVALID_ENUM : int/*GLenum*/;
	__readonly__ var INVALID_ENUM : int/*GLenum*/;
	static const     INVALID_VALUE : int/*GLenum*/;
	__readonly__ var INVALID_VALUE : int/*GLenum*/;
	static const     INVALID_OPERATION : int/*GLenum*/;
	__readonly__ var INVALID_OPERATION : int/*GLenum*/;
	static const     OUT_OF_MEMORY : int/*GLenum*/;
	__readonly__ var OUT_OF_MEMORY : int/*GLenum*/;
	/* FrontFaceDirection */
	static const     CW : int/*GLenum*/;
	__readonly__ var CW : int/*GLenum*/;
	static const     CCW : int/*GLenum*/;
	__readonly__ var CCW : int/*GLenum*/;
	/* GetPName */
	static const     LINE_WIDTH : int/*GLenum*/;
	__readonly__ var LINE_WIDTH : int/*GLenum*/;
	static const     ALIASED_POINT_SIZE_RANGE : int/*GLenum*/;
	__readonly__ var ALIASED_POINT_SIZE_RANGE : int/*GLenum*/;
	static const     ALIASED_LINE_WIDTH_RANGE : int/*GLenum*/;
	__readonly__ var ALIASED_LINE_WIDTH_RANGE : int/*GLenum*/;
	static const     CULL_FACE_MODE : int/*GLenum*/;
	__readonly__ var CULL_FACE_MODE : int/*GLenum*/;
	static const     FRONT_FACE : int/*GLenum*/;
	__readonly__ var FRONT_FACE : int/*GLenum*/;
	static const     DEPTH_RANGE : int/*GLenum*/;
	__readonly__ var DEPTH_RANGE : int/*GLenum*/;
	static const     DEPTH_WRITEMASK : int/*GLenum*/;
	__readonly__ var DEPTH_WRITEMASK : int/*GLenum*/;
	static const     DEPTH_CLEAR_VALUE : int/*GLenum*/;
	__readonly__ var DEPTH_CLEAR_VALUE : int/*GLenum*/;
	static const     DEPTH_FUNC : int/*GLenum*/;
	__readonly__ var DEPTH_FUNC : int/*GLenum*/;
	static const     STENCIL_CLEAR_VALUE : int/*GLenum*/;
	__readonly__ var STENCIL_CLEAR_VALUE : int/*GLenum*/;
	static const     STENCIL_FUNC : int/*GLenum*/;
	__readonly__ var STENCIL_FUNC : int/*GLenum*/;
	static const     STENCIL_FAIL : int/*GLenum*/;
	__readonly__ var STENCIL_FAIL : int/*GLenum*/;
	static const     STENCIL_PASS_DEPTH_FAIL : int/*GLenum*/;
	__readonly__ var STENCIL_PASS_DEPTH_FAIL : int/*GLenum*/;
	static const     STENCIL_PASS_DEPTH_PASS : int/*GLenum*/;
	__readonly__ var STENCIL_PASS_DEPTH_PASS : int/*GLenum*/;
	static const     STENCIL_REF : int/*GLenum*/;
	__readonly__ var STENCIL_REF : int/*GLenum*/;
	static const     STENCIL_VALUE_MASK : int/*GLenum*/;
	__readonly__ var STENCIL_VALUE_MASK : int/*GLenum*/;
	static const     STENCIL_WRITEMASK : int/*GLenum*/;
	__readonly__ var STENCIL_WRITEMASK : int/*GLenum*/;
	static const     STENCIL_BACK_FUNC : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_FUNC : int/*GLenum*/;
	static const     STENCIL_BACK_FAIL : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_FAIL : int/*GLenum*/;
	static const     STENCIL_BACK_PASS_DEPTH_FAIL : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_PASS_DEPTH_FAIL : int/*GLenum*/;
	static const     STENCIL_BACK_PASS_DEPTH_PASS : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_PASS_DEPTH_PASS : int/*GLenum*/;
	static const     STENCIL_BACK_REF : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_REF : int/*GLenum*/;
	static const     STENCIL_BACK_VALUE_MASK : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_VALUE_MASK : int/*GLenum*/;
	static const     STENCIL_BACK_WRITEMASK : int/*GLenum*/;
	__readonly__ var STENCIL_BACK_WRITEMASK : int/*GLenum*/;
	static const     VIEWPORT : int/*GLenum*/;
	__readonly__ var VIEWPORT : int/*GLenum*/;
	static const     SCISSOR_BOX : int/*GLenum*/;
	__readonly__ var SCISSOR_BOX : int/*GLenum*/;
	/*      SCISSOR_TEST */
	static const     COLOR_CLEAR_VALUE : int/*GLenum*/;
	__readonly__ var COLOR_CLEAR_VALUE : int/*GLenum*/;
	static const     COLOR_WRITEMASK : int/*GLenum*/;
	__readonly__ var COLOR_WRITEMASK : int/*GLenum*/;
	static const     UNPACK_ALIGNMENT : int/*GLenum*/;
	__readonly__ var UNPACK_ALIGNMENT : int/*GLenum*/;
	static const     PACK_ALIGNMENT : int/*GLenum*/;
	__readonly__ var PACK_ALIGNMENT : int/*GLenum*/;
	static const     MAX_TEXTURE_SIZE : int/*GLenum*/;
	__readonly__ var MAX_TEXTURE_SIZE : int/*GLenum*/;
	static const     MAX_VIEWPORT_DIMS : int/*GLenum*/;
	__readonly__ var MAX_VIEWPORT_DIMS : int/*GLenum*/;
	static const     SUBPIXEL_BITS : int/*GLenum*/;
	__readonly__ var SUBPIXEL_BITS : int/*GLenum*/;
	static const     RED_BITS : int/*GLenum*/;
	__readonly__ var RED_BITS : int/*GLenum*/;
	static const     GREEN_BITS : int/*GLenum*/;
	__readonly__ var GREEN_BITS : int/*GLenum*/;
	static const     BLUE_BITS : int/*GLenum*/;
	__readonly__ var BLUE_BITS : int/*GLenum*/;
	static const     ALPHA_BITS : int/*GLenum*/;
	__readonly__ var ALPHA_BITS : int/*GLenum*/;
	static const     DEPTH_BITS : int/*GLenum*/;
	__readonly__ var DEPTH_BITS : int/*GLenum*/;
	static const     STENCIL_BITS : int/*GLenum*/;
	__readonly__ var STENCIL_BITS : int/*GLenum*/;
	static const     POLYGON_OFFSET_UNITS : int/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_UNITS : int/*GLenum*/;
	/*      POLYGON_OFFSET_FILL */
	static const     POLYGON_OFFSET_FACTOR : int/*GLenum*/;
	__readonly__ var POLYGON_OFFSET_FACTOR : int/*GLenum*/;
	static const     TEXTURE_BINDING_2D : int/*GLenum*/;
	__readonly__ var TEXTURE_BINDING_2D : int/*GLenum*/;
	static const     SAMPLE_BUFFERS : int/*GLenum*/;
	__readonly__ var SAMPLE_BUFFERS : int/*GLenum*/;
	static const     SAMPLES : int/*GLenum*/;
	__readonly__ var SAMPLES : int/*GLenum*/;
	static const     SAMPLE_COVERAGE_VALUE : int/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE_VALUE : int/*GLenum*/;
	static const     SAMPLE_COVERAGE_INVERT : int/*GLenum*/;
	__readonly__ var SAMPLE_COVERAGE_INVERT : int/*GLenum*/;
	/* GetTextureParameter */
	/*      TEXTURE_MAG_FILTER */
	/*      TEXTURE_MIN_FILTER */
	/*      TEXTURE_WRAP_S */
	/*      TEXTURE_WRAP_T */
	static const     NUM_COMPRESSED_TEXTURE_FORMATS : int/*GLenum*/;
	__readonly__ var NUM_COMPRESSED_TEXTURE_FORMATS : int/*GLenum*/;
	static const     COMPRESSED_TEXTURE_FORMATS : int/*GLenum*/;
	__readonly__ var COMPRESSED_TEXTURE_FORMATS : int/*GLenum*/;
	/* HintMode */
	static const     DONT_CARE : int/*GLenum*/;
	__readonly__ var DONT_CARE : int/*GLenum*/;
	static const     FASTEST : int/*GLenum*/;
	__readonly__ var FASTEST : int/*GLenum*/;
	static const     NICEST : int/*GLenum*/;
	__readonly__ var NICEST : int/*GLenum*/;
	/* HintTarget */
	static const     GENERATE_MIPMAP_HINT : int/*GLenum*/;
	__readonly__ var GENERATE_MIPMAP_HINT : int/*GLenum*/;
	/* DataType */
	static const     BYTE : int/*GLenum*/;
	__readonly__ var BYTE : int/*GLenum*/;
	static const     UNSIGNED_BYTE : int/*GLenum*/;
	__readonly__ var UNSIGNED_BYTE : int/*GLenum*/;
	static const     SHORT : int/*GLenum*/;
	__readonly__ var SHORT : int/*GLenum*/;
	static const     UNSIGNED_SHORT : int/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT : int/*GLenum*/;
	static const     INT : int/*GLenum*/;
	__readonly__ var INT : int/*GLenum*/;
	static const     UNSIGNED_INT : int/*GLenum*/;
	__readonly__ var UNSIGNED_INT : int/*GLenum*/;
	static const     FLOAT : int/*GLenum*/;
	__readonly__ var FLOAT : int/*GLenum*/;
	/* PixelFormat */
	static const     DEPTH_COMPONENT : int/*GLenum*/;
	__readonly__ var DEPTH_COMPONENT : int/*GLenum*/;
	static const     ALPHA : int/*GLenum*/;
	__readonly__ var ALPHA : int/*GLenum*/;
	static const     RGB : int/*GLenum*/;
	__readonly__ var RGB : int/*GLenum*/;
	static const     RGBA : int/*GLenum*/;
	__readonly__ var RGBA : int/*GLenum*/;
	static const     LUMINANCE : int/*GLenum*/;
	__readonly__ var LUMINANCE : int/*GLenum*/;
	static const     LUMINANCE_ALPHA : int/*GLenum*/;
	__readonly__ var LUMINANCE_ALPHA : int/*GLenum*/;
	/* PixelType */
	/*      UNSIGNED_BYTE */
	static const     UNSIGNED_SHORT_4_4_4_4 : int/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT_4_4_4_4 : int/*GLenum*/;
	static const     UNSIGNED_SHORT_5_5_5_1 : int/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT_5_5_5_1 : int/*GLenum*/;
	static const     UNSIGNED_SHORT_5_6_5 : int/*GLenum*/;
	__readonly__ var UNSIGNED_SHORT_5_6_5 : int/*GLenum*/;
	/* Shaders */
	static const     FRAGMENT_SHADER : int/*GLenum*/;
	__readonly__ var FRAGMENT_SHADER : int/*GLenum*/;
	static const     VERTEX_SHADER : int/*GLenum*/;
	__readonly__ var VERTEX_SHADER : int/*GLenum*/;
	static const     MAX_VERTEX_ATTRIBS : int/*GLenum*/;
	__readonly__ var MAX_VERTEX_ATTRIBS : int/*GLenum*/;
	static const     MAX_VERTEX_UNIFORM_VECTORS : int/*GLenum*/;
	__readonly__ var MAX_VERTEX_UNIFORM_VECTORS : int/*GLenum*/;
	static const     MAX_VARYING_VECTORS : int/*GLenum*/;
	__readonly__ var MAX_VARYING_VECTORS : int/*GLenum*/;
	static const     MAX_COMBINED_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	__readonly__ var MAX_COMBINED_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	static const     MAX_VERTEX_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	__readonly__ var MAX_VERTEX_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	static const     MAX_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	__readonly__ var MAX_TEXTURE_IMAGE_UNITS : int/*GLenum*/;
	static const     MAX_FRAGMENT_UNIFORM_VECTORS : int/*GLenum*/;
	__readonly__ var MAX_FRAGMENT_UNIFORM_VECTORS : int/*GLenum*/;
	static const     SHADER_TYPE : int/*GLenum*/;
	__readonly__ var SHADER_TYPE : int/*GLenum*/;
	static const     DELETE_STATUS : int/*GLenum*/;
	__readonly__ var DELETE_STATUS : int/*GLenum*/;
	static const     LINK_STATUS : int/*GLenum*/;
	__readonly__ var LINK_STATUS : int/*GLenum*/;
	static const     VALIDATE_STATUS : int/*GLenum*/;
	__readonly__ var VALIDATE_STATUS : int/*GLenum*/;
	static const     ATTACHED_SHADERS : int/*GLenum*/;
	__readonly__ var ATTACHED_SHADERS : int/*GLenum*/;
	static const     ACTIVE_UNIFORMS : int/*GLenum*/;
	__readonly__ var ACTIVE_UNIFORMS : int/*GLenum*/;
	static const     ACTIVE_ATTRIBUTES : int/*GLenum*/;
	__readonly__ var ACTIVE_ATTRIBUTES : int/*GLenum*/;
	static const     SHADING_LANGUAGE_VERSION : int/*GLenum*/;
	__readonly__ var SHADING_LANGUAGE_VERSION : int/*GLenum*/;
	static const     CURRENT_PROGRAM : int/*GLenum*/;
	__readonly__ var CURRENT_PROGRAM : int/*GLenum*/;
	/* StencilFunction */
	static const     NEVER : int/*GLenum*/;
	__readonly__ var NEVER : int/*GLenum*/;
	static const     LESS : int/*GLenum*/;
	__readonly__ var LESS : int/*GLenum*/;
	static const     EQUAL : int/*GLenum*/;
	__readonly__ var EQUAL : int/*GLenum*/;
	static const     LEQUAL : int/*GLenum*/;
	__readonly__ var LEQUAL : int/*GLenum*/;
	static const     GREATER : int/*GLenum*/;
	__readonly__ var GREATER : int/*GLenum*/;
	static const     NOTEQUAL : int/*GLenum*/;
	__readonly__ var NOTEQUAL : int/*GLenum*/;
	static const     GEQUAL : int/*GLenum*/;
	__readonly__ var GEQUAL : int/*GLenum*/;
	static const     ALWAYS : int/*GLenum*/;
	__readonly__ var ALWAYS : int/*GLenum*/;
	/* StencilOp */
	/*      ZERO */
	static const     KEEP : int/*GLenum*/;
	__readonly__ var KEEP : int/*GLenum*/;
	static const     REPLACE : int/*GLenum*/;
	__readonly__ var REPLACE : int/*GLenum*/;
	static const     INCR : int/*GLenum*/;
	__readonly__ var INCR : int/*GLenum*/;
	static const     DECR : int/*GLenum*/;
	__readonly__ var DECR : int/*GLenum*/;
	static const     INVERT : int/*GLenum*/;
	__readonly__ var INVERT : int/*GLenum*/;
	static const     INCR_WRAP : int/*GLenum*/;
	__readonly__ var INCR_WRAP : int/*GLenum*/;
	static const     DECR_WRAP : int/*GLenum*/;
	__readonly__ var DECR_WRAP : int/*GLenum*/;
	/* StringName */
	static const     VENDOR : int/*GLenum*/;
	__readonly__ var VENDOR : int/*GLenum*/;
	static const     RENDERER : int/*GLenum*/;
	__readonly__ var RENDERER : int/*GLenum*/;
	static const     VERSION : int/*GLenum*/;
	__readonly__ var VERSION : int/*GLenum*/;
	/* TextureMagFilter */
	static const     NEAREST : int/*GLenum*/;
	__readonly__ var NEAREST : int/*GLenum*/;
	static const     LINEAR : int/*GLenum*/;
	__readonly__ var LINEAR : int/*GLenum*/;
	/* TextureMinFilter */
	/*      NEAREST */
	/*      LINEAR */
	static const     NEAREST_MIPMAP_NEAREST : int/*GLenum*/;
	__readonly__ var NEAREST_MIPMAP_NEAREST : int/*GLenum*/;
	static const     LINEAR_MIPMAP_NEAREST : int/*GLenum*/;
	__readonly__ var LINEAR_MIPMAP_NEAREST : int/*GLenum*/;
	static const     NEAREST_MIPMAP_LINEAR : int/*GLenum*/;
	__readonly__ var NEAREST_MIPMAP_LINEAR : int/*GLenum*/;
	static const     LINEAR_MIPMAP_LINEAR : int/*GLenum*/;
	__readonly__ var LINEAR_MIPMAP_LINEAR : int/*GLenum*/;
	/* TextureParameterName */
	static const     TEXTURE_MAG_FILTER : int/*GLenum*/;
	__readonly__ var TEXTURE_MAG_FILTER : int/*GLenum*/;
	static const     TEXTURE_MIN_FILTER : int/*GLenum*/;
	__readonly__ var TEXTURE_MIN_FILTER : int/*GLenum*/;
	static const     TEXTURE_WRAP_S : int/*GLenum*/;
	__readonly__ var TEXTURE_WRAP_S : int/*GLenum*/;
	static const     TEXTURE_WRAP_T : int/*GLenum*/;
	__readonly__ var TEXTURE_WRAP_T : int/*GLenum*/;
	/* TextureTarget */
	static const     TEXTURE_2D : int/*GLenum*/;
	__readonly__ var TEXTURE_2D : int/*GLenum*/;
	static const     TEXTURE : int/*GLenum*/;
	__readonly__ var TEXTURE : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP : int/*GLenum*/;
	static const     TEXTURE_BINDING_CUBE_MAP : int/*GLenum*/;
	__readonly__ var TEXTURE_BINDING_CUBE_MAP : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_POSITIVE_X : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_X : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_NEGATIVE_X : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_X : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_POSITIVE_Y : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_Y : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_NEGATIVE_Y : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_Y : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_POSITIVE_Z : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_POSITIVE_Z : int/*GLenum*/;
	static const     TEXTURE_CUBE_MAP_NEGATIVE_Z : int/*GLenum*/;
	__readonly__ var TEXTURE_CUBE_MAP_NEGATIVE_Z : int/*GLenum*/;
	static const     MAX_CUBE_MAP_TEXTURE_SIZE : int/*GLenum*/;
	__readonly__ var MAX_CUBE_MAP_TEXTURE_SIZE : int/*GLenum*/;
	/* TextureUnit */
	static const     TEXTURE0 : int/*GLenum*/;
	__readonly__ var TEXTURE0 : int/*GLenum*/;
	static const     TEXTURE1 : int/*GLenum*/;
	__readonly__ var TEXTURE1 : int/*GLenum*/;
	static const     TEXTURE2 : int/*GLenum*/;
	__readonly__ var TEXTURE2 : int/*GLenum*/;
	static const     TEXTURE3 : int/*GLenum*/;
	__readonly__ var TEXTURE3 : int/*GLenum*/;
	static const     TEXTURE4 : int/*GLenum*/;
	__readonly__ var TEXTURE4 : int/*GLenum*/;
	static const     TEXTURE5 : int/*GLenum*/;
	__readonly__ var TEXTURE5 : int/*GLenum*/;
	static const     TEXTURE6 : int/*GLenum*/;
	__readonly__ var TEXTURE6 : int/*GLenum*/;
	static const     TEXTURE7 : int/*GLenum*/;
	__readonly__ var TEXTURE7 : int/*GLenum*/;
	static const     TEXTURE8 : int/*GLenum*/;
	__readonly__ var TEXTURE8 : int/*GLenum*/;
	static const     TEXTURE9 : int/*GLenum*/;
	__readonly__ var TEXTURE9 : int/*GLenum*/;
	static const     TEXTURE10 : int/*GLenum*/;
	__readonly__ var TEXTURE10 : int/*GLenum*/;
	static const     TEXTURE11 : int/*GLenum*/;
	__readonly__ var TEXTURE11 : int/*GLenum*/;
	static const     TEXTURE12 : int/*GLenum*/;
	__readonly__ var TEXTURE12 : int/*GLenum*/;
	static const     TEXTURE13 : int/*GLenum*/;
	__readonly__ var TEXTURE13 : int/*GLenum*/;
	static const     TEXTURE14 : int/*GLenum*/;
	__readonly__ var TEXTURE14 : int/*GLenum*/;
	static const     TEXTURE15 : int/*GLenum*/;
	__readonly__ var TEXTURE15 : int/*GLenum*/;
	static const     TEXTURE16 : int/*GLenum*/;
	__readonly__ var TEXTURE16 : int/*GLenum*/;
	static const     TEXTURE17 : int/*GLenum*/;
	__readonly__ var TEXTURE17 : int/*GLenum*/;
	static const     TEXTURE18 : int/*GLenum*/;
	__readonly__ var TEXTURE18 : int/*GLenum*/;
	static const     TEXTURE19 : int/*GLenum*/;
	__readonly__ var TEXTURE19 : int/*GLenum*/;
	static const     TEXTURE20 : int/*GLenum*/;
	__readonly__ var TEXTURE20 : int/*GLenum*/;
	static const     TEXTURE21 : int/*GLenum*/;
	__readonly__ var TEXTURE21 : int/*GLenum*/;
	static const     TEXTURE22 : int/*GLenum*/;
	__readonly__ var TEXTURE22 : int/*GLenum*/;
	static const     TEXTURE23 : int/*GLenum*/;
	__readonly__ var TEXTURE23 : int/*GLenum*/;
	static const     TEXTURE24 : int/*GLenum*/;
	__readonly__ var TEXTURE24 : int/*GLenum*/;
	static const     TEXTURE25 : int/*GLenum*/;
	__readonly__ var TEXTURE25 : int/*GLenum*/;
	static const     TEXTURE26 : int/*GLenum*/;
	__readonly__ var TEXTURE26 : int/*GLenum*/;
	static const     TEXTURE27 : int/*GLenum*/;
	__readonly__ var TEXTURE27 : int/*GLenum*/;
	static const     TEXTURE28 : int/*GLenum*/;
	__readonly__ var TEXTURE28 : int/*GLenum*/;
	static const     TEXTURE29 : int/*GLenum*/;
	__readonly__ var TEXTURE29 : int/*GLenum*/;
	static const     TEXTURE30 : int/*GLenum*/;
	__readonly__ var TEXTURE30 : int/*GLenum*/;
	static const     TEXTURE31 : int/*GLenum*/;
	__readonly__ var TEXTURE31 : int/*GLenum*/;
	static const     ACTIVE_TEXTURE : int/*GLenum*/;
	__readonly__ var ACTIVE_TEXTURE : int/*GLenum*/;
	/* TextureWrapMode */
	static const     REPEAT : int/*GLenum*/;
	__readonly__ var REPEAT : int/*GLenum*/;
	static const     CLAMP_TO_EDGE : int/*GLenum*/;
	__readonly__ var CLAMP_TO_EDGE : int/*GLenum*/;
	static const     MIRRORED_REPEAT : int/*GLenum*/;
	__readonly__ var MIRRORED_REPEAT : int/*GLenum*/;
	/* Uniform Types */
	static const     FLOAT_VEC2 : int/*GLenum*/;
	__readonly__ var FLOAT_VEC2 : int/*GLenum*/;
	static const     FLOAT_VEC3 : int/*GLenum*/;
	__readonly__ var FLOAT_VEC3 : int/*GLenum*/;
	static const     FLOAT_VEC4 : int/*GLenum*/;
	__readonly__ var FLOAT_VEC4 : int/*GLenum*/;
	static const     INT_VEC2 : int/*GLenum*/;
	__readonly__ var INT_VEC2 : int/*GLenum*/;
	static const     INT_VEC3 : int/*GLenum*/;
	__readonly__ var INT_VEC3 : int/*GLenum*/;
	static const     INT_VEC4 : int/*GLenum*/;
	__readonly__ var INT_VEC4 : int/*GLenum*/;
	static const     BOOL : int/*GLenum*/;
	__readonly__ var BOOL : int/*GLenum*/;
	static const     BOOL_VEC2 : int/*GLenum*/;
	__readonly__ var BOOL_VEC2 : int/*GLenum*/;
	static const     BOOL_VEC3 : int/*GLenum*/;
	__readonly__ var BOOL_VEC3 : int/*GLenum*/;
	static const     BOOL_VEC4 : int/*GLenum*/;
	__readonly__ var BOOL_VEC4 : int/*GLenum*/;
	static const     FLOAT_MAT2 : int/*GLenum*/;
	__readonly__ var FLOAT_MAT2 : int/*GLenum*/;
	static const     FLOAT_MAT3 : int/*GLenum*/;
	__readonly__ var FLOAT_MAT3 : int/*GLenum*/;
	static const     FLOAT_MAT4 : int/*GLenum*/;
	__readonly__ var FLOAT_MAT4 : int/*GLenum*/;
	static const     SAMPLER_2D : int/*GLenum*/;
	__readonly__ var SAMPLER_2D : int/*GLenum*/;
	static const     SAMPLER_CUBE : int/*GLenum*/;
	__readonly__ var SAMPLER_CUBE : int/*GLenum*/;
	/* Vertex Arrays */
	static const     VERTEX_ATTRIB_ARRAY_ENABLED : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_ENABLED : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_SIZE : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_SIZE : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_STRIDE : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_STRIDE : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_TYPE : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_TYPE : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_NORMALIZED : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_NORMALIZED : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_POINTER : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_POINTER : int/*GLenum*/;
	static const     VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : int/*GLenum*/;
	__readonly__ var VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : int/*GLenum*/;
	/* Shader Source */
	static const     COMPILE_STATUS : int/*GLenum*/;
	__readonly__ var COMPILE_STATUS : int/*GLenum*/;
	/* Shader Precision-Specified Types */
	static const     LOW_FLOAT : int/*GLenum*/;
	__readonly__ var LOW_FLOAT : int/*GLenum*/;
	static const     MEDIUM_FLOAT : int/*GLenum*/;
	__readonly__ var MEDIUM_FLOAT : int/*GLenum*/;
	static const     HIGH_FLOAT : int/*GLenum*/;
	__readonly__ var HIGH_FLOAT : int/*GLenum*/;
	static const     LOW_INT : int/*GLenum*/;
	__readonly__ var LOW_INT : int/*GLenum*/;
	static const     MEDIUM_INT : int/*GLenum*/;
	__readonly__ var MEDIUM_INT : int/*GLenum*/;
	static const     HIGH_INT : int/*GLenum*/;
	__readonly__ var HIGH_INT : int/*GLenum*/;
	/* Framebuffer Object. */
	static const     FRAMEBUFFER : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER : int/*GLenum*/;
	static const     RENDERBUFFER : int/*GLenum*/;
	__readonly__ var RENDERBUFFER : int/*GLenum*/;
	static const     RGBA4 : int/*GLenum*/;
	__readonly__ var RGBA4 : int/*GLenum*/;
	static const     RGB5_A1 : int/*GLenum*/;
	__readonly__ var RGB5_A1 : int/*GLenum*/;
	static const     RGB565 : int/*GLenum*/;
	__readonly__ var RGB565 : int/*GLenum*/;
	static const     DEPTH_COMPONENT16 : int/*GLenum*/;
	__readonly__ var DEPTH_COMPONENT16 : int/*GLenum*/;
	static const     STENCIL_INDEX : int/*GLenum*/;
	__readonly__ var STENCIL_INDEX : int/*GLenum*/;
	static const     STENCIL_INDEX8 : int/*GLenum*/;
	__readonly__ var STENCIL_INDEX8 : int/*GLenum*/;
	static const     DEPTH_STENCIL : int/*GLenum*/;
	__readonly__ var DEPTH_STENCIL : int/*GLenum*/;
	static const     RENDERBUFFER_WIDTH : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_WIDTH : int/*GLenum*/;
	static const     RENDERBUFFER_HEIGHT : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_HEIGHT : int/*GLenum*/;
	static const     RENDERBUFFER_INTERNAL_FORMAT : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_INTERNAL_FORMAT : int/*GLenum*/;
	static const     RENDERBUFFER_RED_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_RED_SIZE : int/*GLenum*/;
	static const     RENDERBUFFER_GREEN_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_GREEN_SIZE : int/*GLenum*/;
	static const     RENDERBUFFER_BLUE_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_BLUE_SIZE : int/*GLenum*/;
	static const     RENDERBUFFER_ALPHA_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_ALPHA_SIZE : int/*GLenum*/;
	static const     RENDERBUFFER_DEPTH_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_DEPTH_SIZE : int/*GLenum*/;
	static const     RENDERBUFFER_STENCIL_SIZE : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_STENCIL_SIZE : int/*GLenum*/;
	static const     FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : int/*GLenum*/;
	static const     FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : int/*GLenum*/;
	static const     FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : int/*GLenum*/;
	static const     FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : int/*GLenum*/;
	static const     COLOR_ATTACHMENT0 : int/*GLenum*/;
	__readonly__ var COLOR_ATTACHMENT0 : int/*GLenum*/;
	static const     DEPTH_ATTACHMENT : int/*GLenum*/;
	__readonly__ var DEPTH_ATTACHMENT : int/*GLenum*/;
	static const     STENCIL_ATTACHMENT : int/*GLenum*/;
	__readonly__ var STENCIL_ATTACHMENT : int/*GLenum*/;
	static const     DEPTH_STENCIL_ATTACHMENT : int/*GLenum*/;
	__readonly__ var DEPTH_STENCIL_ATTACHMENT : int/*GLenum*/;
	static const     NONE : int/*GLenum*/;
	__readonly__ var NONE : int/*GLenum*/;
	static const     FRAMEBUFFER_COMPLETE : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_COMPLETE : int/*GLenum*/;
	static const     FRAMEBUFFER_INCOMPLETE_ATTACHMENT : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_ATTACHMENT : int/*GLenum*/;
	static const     FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : int/*GLenum*/;
	static const     FRAMEBUFFER_INCOMPLETE_DIMENSIONS : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_INCOMPLETE_DIMENSIONS : int/*GLenum*/;
	static const     FRAMEBUFFER_UNSUPPORTED : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_UNSUPPORTED : int/*GLenum*/;
	static const     FRAMEBUFFER_BINDING : int/*GLenum*/;
	__readonly__ var FRAMEBUFFER_BINDING : int/*GLenum*/;
	static const     RENDERBUFFER_BINDING : int/*GLenum*/;
	__readonly__ var RENDERBUFFER_BINDING : int/*GLenum*/;
	static const     MAX_RENDERBUFFER_SIZE : int/*GLenum*/;
	__readonly__ var MAX_RENDERBUFFER_SIZE : int/*GLenum*/;
	static const     INVALID_FRAMEBUFFER_OPERATION : int/*GLenum*/;
	__readonly__ var INVALID_FRAMEBUFFER_OPERATION : int/*GLenum*/;
	/* WebGL-specific enums */
	static const     UNPACK_FLIP_Y_WEBGL : int/*GLenum*/;
	__readonly__ var UNPACK_FLIP_Y_WEBGL : int/*GLenum*/;
	static const     UNPACK_PREMULTIPLY_ALPHA_WEBGL : int/*GLenum*/;
	__readonly__ var UNPACK_PREMULTIPLY_ALPHA_WEBGL : int/*GLenum*/;
	static const     CONTEXT_LOST_WEBGL : int/*GLenum*/;
	__readonly__ var CONTEXT_LOST_WEBGL : int/*GLenum*/;
	static const     UNPACK_COLORSPACE_CONVERSION_WEBGL : int/*GLenum*/;
	__readonly__ var UNPACK_COLORSPACE_CONVERSION_WEBGL : int/*GLenum*/;
	static const     BROWSER_DEFAULT_WEBGL : int/*GLenum*/;
	__readonly__ var BROWSER_DEFAULT_WEBGL : int/*GLenum*/;
	__readonly__ var canvas : HTMLCanvasElement;
	__readonly__ var drawingBufferWidth : int/*GLsizei*/;
	__readonly__ var drawingBufferHeight : int/*GLsizei*/;
	function getContextAttributes() : WebGLContextAttributes;
	function isContextLost() : boolean;
	function getSupportedExtensions() : string[ ]/*DOMString[ ]*/;
	function getExtension(name : string/*DOMString*/) : Object/*object*/;
	function activeTexture(texture : int/*GLenum*/) : void;
	function attachShader(
		program : WebGLProgram,
		shader : WebGLShader
	) : void;
	function bindAttribLocation(
		program : WebGLProgram,
		index : int/*GLuint*/,
		name : string/*DOMString*/
	) : void;
	function bindBuffer(
		target : int/*GLenum*/,
		buffer : WebGLBuffer
	) : void;
	function bindFramebuffer(
		target : int/*GLenum*/,
		framebuffer : WebGLFramebuffer
	) : void;
	function bindRenderbuffer(
		target : int/*GLenum*/,
		renderbuffer : WebGLRenderbuffer
	) : void;
	function bindTexture(
		target : int/*GLenum*/,
		texture : WebGLTexture
	) : void;
	function blendColor(
		red : number/*GLclampf*/,
		green : number/*GLclampf*/,
		blue : number/*GLclampf*/,
		alpha : number/*GLclampf*/
	) : void;
	function blendEquation(mode : int/*GLenum*/) : void;
	function blendEquationSeparate(
		modeRGB : int/*GLenum*/,
		modeAlpha : int/*GLenum*/
	) : void;
	function blendFunc(
		sfactor : int/*GLenum*/,
		dfactor : int/*GLenum*/
	) : void;
	function blendFuncSeparate(
		srcRGB : int/*GLenum*/,
		dstRGB : int/*GLenum*/,
		srcAlpha : int/*GLenum*/,
		dstAlpha : int/*GLenum*/
	) : void;
	function bufferData(
		target : int/*GLenum*/,
		size : number/*GLsizeiptr*/,
		usage : int/*GLenum*/
	) : void;
	function bufferData(
		target : int/*GLenum*/,
		data : ArrayBufferView,
		usage : int/*GLenum*/
	) : void;
	function bufferData(
		target : int/*GLenum*/,
		data : ArrayBuffer,
		usage : int/*GLenum*/
	) : void;
	function bufferSubData(
		target : int/*GLenum*/,
		offset : number/*GLintptr*/,
		data : ArrayBufferView
	) : void;
	function bufferSubData(
		target : int/*GLenum*/,
		offset : number/*GLintptr*/,
		data : ArrayBuffer
	) : void;
	function checkFramebufferStatus(
		target : int/*GLenum*/
	) : int/*GLenum*/;
	function clear(mask : int/*GLbitfield*/) : void;
	function clearColor(
		red : number/*GLclampf*/,
		green : number/*GLclampf*/,
		blue : number/*GLclampf*/,
		alpha : number/*GLclampf*/
	) : void;
	function clearDepth(depth : number/*GLclampf*/) : void;
	function clearStencil(s : int/*GLint*/) : void;
	function colorMask(
		red : boolean/*GLboolean*/,
		green : boolean/*GLboolean*/,
		blue : boolean/*GLboolean*/,
		alpha : boolean/*GLboolean*/
	) : void;
	function compileShader(shader : WebGLShader) : void;
	function copyTexImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		x : int/*GLint*/,
		y : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/,
		border : int/*GLint*/
	) : void;
	function copyTexSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		x : int/*GLint*/,
		y : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/
	) : void;
	function createBuffer() : WebGLBuffer;
	function createFramebuffer() : WebGLFramebuffer;
	function createProgram() : WebGLProgram;
	function createRenderbuffer() : WebGLRenderbuffer;
	function createShader(type : int/*GLenum*/) : WebGLShader;
	function createTexture() : WebGLTexture;
	function cullFace(mode : int/*GLenum*/) : void;
	function deleteBuffer(buffer : WebGLBuffer) : void;
	function deleteFramebuffer(framebuffer : WebGLFramebuffer) : void;
	function deleteProgram(program : WebGLProgram) : void;
	function deleteRenderbuffer(renderbuffer : WebGLRenderbuffer) : void;
	function deleteShader(shader : WebGLShader) : void;
	function deleteTexture(texture : WebGLTexture) : void;
	function depthFunc(func : int/*GLenum*/) : void;
	function depthMask(flag : boolean/*GLboolean*/) : void;
	function depthRange(
		zNear : number/*GLclampf*/,
		zFar : number/*GLclampf*/
	) : void;
	function detachShader(
		program : WebGLProgram,
		shader : WebGLShader
	) : void;
	function disable(cap : int/*GLenum*/) : void;
	function disableVertexAttribArray(index : int/*GLuint*/) : void;
	function drawArrays(
		mode : int/*GLenum*/,
		first : int/*GLint*/,
		count : int/*GLsizei*/
	) : void;
	function drawElements(
		mode : int/*GLenum*/,
		count : int/*GLsizei*/,
		type : int/*GLenum*/,
		offset : number/*GLintptr*/
	) : void;
	function enable(cap : int/*GLenum*/) : void;
	function enableVertexAttribArray(index : int/*GLuint*/) : void;
	function finish() : void;
	function flush() : void;
	function framebufferRenderbuffer(
		target : int/*GLenum*/,
		attachment : int/*GLenum*/,
		renderbuffertarget : int/*GLenum*/,
		renderbuffer : WebGLRenderbuffer
	) : void;
	function framebufferTexture2D(
		target : int/*GLenum*/,
		attachment : int/*GLenum*/,
		textarget : int/*GLenum*/,
		texture : WebGLTexture,
		level : int/*GLint*/
	) : void;
	function frontFace(mode : int/*GLenum*/) : void;
	function generateMipmap(target : int/*GLenum*/) : void;
	function getActiveAttrib(
		program : WebGLProgram,
		index : int/*GLuint*/
	) : WebGLActiveInfo;
	function getActiveUniform(
		program : WebGLProgram,
		index : int/*GLuint*/
	) : WebGLActiveInfo;
	function getAttachedShaders(program : WebGLProgram) : WebGLShader[ ];
	function getAttribLocation(
		program : WebGLProgram,
		name : string/*DOMString*/
	) : int/*GLint*/;
	function getParameter(pname : int/*GLenum*/) : variant/*any*/;
	function getBufferParameter(
		target : int/*GLenum*/,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getError() : int/*GLenum*/;
	function getFramebufferAttachmentParameter(
		target : int/*GLenum*/,
		attachment : int/*GLenum*/,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getProgramParameter(
		program : WebGLProgram,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getProgramInfoLog(
		program : WebGLProgram
	) : string/*DOMString*/;
	function getRenderbufferParameter(
		target : int/*GLenum*/,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getShaderParameter(
		shader : WebGLShader,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getShaderInfoLog(
		shader : WebGLShader
	) : string/*DOMString*/;
	function getShaderSource(shader : WebGLShader) : string/*DOMString*/;
	function getTexParameter(
		target : int/*GLenum*/,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getUniform(
		program : WebGLProgram,
		location : WebGLUniformLocation
	) : variant/*any*/;
	function getUniformLocation(
		program : WebGLProgram,
		name : string/*DOMString*/
	) : WebGLUniformLocation;
	function getVertexAttrib(
		index : int/*GLuint*/,
		pname : int/*GLenum*/
	) : variant/*any*/;
	function getVertexAttribOffset(
		index : int/*GLuint*/,
		pname : int/*GLenum*/
	) : number/*GLsizeiptr*/;
	function hint(target : int/*GLenum*/, mode : int/*GLenum*/) : void;
	function isBuffer(buffer : WebGLBuffer) : boolean/*GLboolean*/;
	function isEnabled(cap : int/*GLenum*/) : boolean/*GLboolean*/;
	function isFramebuffer(
		framebuffer : WebGLFramebuffer
	) : boolean/*GLboolean*/;
	function isProgram(program : WebGLProgram) : boolean/*GLboolean*/;
	function isRenderbuffer(
		renderbuffer : WebGLRenderbuffer
	) : boolean/*GLboolean*/;
	function isShader(shader : WebGLShader) : boolean/*GLboolean*/;
	function isTexture(texture : WebGLTexture) : boolean/*GLboolean*/;
	function lineWidth(width : number/*GLfloat*/) : void;
	function linkProgram(program : WebGLProgram) : void;
	function pixelStorei(
		pname : int/*GLenum*/,
		param : int/*GLint*/
	) : void;
	function polygonOffset(
		factor : number/*GLfloat*/,
		units : number/*GLfloat*/
	) : void;
	function readPixels(
		x : int/*GLint*/,
		y : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		pixels : ArrayBufferView
	) : void;
	function renderbufferStorage(
		target : int/*GLenum*/,
		internalformat : int/*GLenum*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/
	) : void;
	function sampleCoverage(
		value : number/*GLclampf*/,
		invert : boolean/*GLboolean*/
	) : void;
	function scissor(
		x : int/*GLint*/,
		y : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/
	) : void;
	function shaderSource(
		shader : WebGLShader,
		source : string/*DOMString*/
	) : void;
	function stencilFunc(
		func : int/*GLenum*/,
		ref : int/*GLint*/,
		mask : int/*GLuint*/
	) : void;
	function stencilFuncSeparate(
		face : int/*GLenum*/,
		func : int/*GLenum*/,
		ref : int/*GLint*/,
		mask : int/*GLuint*/
	) : void;
	function stencilMask(mask : int/*GLuint*/) : void;
	function stencilMaskSeparate(
		face : int/*GLenum*/,
		mask : int/*GLuint*/
	) : void;
	function stencilOp(
		fail : int/*GLenum*/,
		zfail : int/*GLenum*/,
		zpass : int/*GLenum*/
	) : void;
	function stencilOpSeparate(
		face : int/*GLenum*/,
		fail : int/*GLenum*/,
		zfail : int/*GLenum*/,
		zpass : int/*GLenum*/
	) : void;
	function texImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/,
		border : int/*GLint*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		pixels : ArrayBufferView
	) : void;
	function texImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		pixels : ImageData
	) : void;
	function texImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		image : HTMLImageElement
	) : void;
	function texImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		canvas : HTMLCanvasElement
	) : void;
	function texImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		internalformat : int/*GLenum*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		video : HTMLVideoElement
	) : void;
	function texParameterf(
		target : int/*GLenum*/,
		pname : int/*GLenum*/,
		param : number/*GLfloat*/
	) : void;
	function texParameteri(
		target : int/*GLenum*/,
		pname : int/*GLenum*/,
		param : int/*GLint*/
	) : void;
	function texSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		pixels : ArrayBufferView
	) : void;
	function texSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		pixels : ImageData
	) : void;
	function texSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		image : HTMLImageElement
	) : void;
	function texSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		canvas : HTMLCanvasElement
	) : void;
	function texSubImage2D(
		target : int/*GLenum*/,
		level : int/*GLint*/,
		xoffset : int/*GLint*/,
		yoffset : int/*GLint*/,
		format : int/*GLenum*/,
		type : int/*GLenum*/,
		video : HTMLVideoElement
	) : void;
	function uniform1f(
		location : WebGLUniformLocation,
		x : number/*GLfloat*/
	) : void;
	function uniform1fv(
		location : WebGLUniformLocation,
		v : Float32Array
	) : void;
	function uniform1fv(
		location : WebGLUniformLocation,
		v : number[]/*float[]*/
	) : void;
	function uniform1i(
		location : WebGLUniformLocation,
		x : int/*GLint*/
	) : void;
	function uniform1iv(
		location : WebGLUniformLocation,
		v : Int32Array
	) : void;
	function uniform1iv(
		location : WebGLUniformLocation,
		v : int[]/*long[]*/
	) : void;
	function uniform2f(
		location : WebGLUniformLocation,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/
	) : void;
	function uniform2fv(
		location : WebGLUniformLocation,
		v : Float32Array
	) : void;
	function uniform2fv(
		location : WebGLUniformLocation,
		v : number[]/*float[]*/
	) : void;
	function uniform2i(
		location : WebGLUniformLocation,
		x : int/*GLint*/,
		y : int/*GLint*/
	) : void;
	function uniform2iv(
		location : WebGLUniformLocation,
		v : Int32Array
	) : void;
	function uniform2iv(
		location : WebGLUniformLocation,
		v : int[]/*long[]*/
	) : void;
	function uniform3f(
		location : WebGLUniformLocation,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/,
		z : number/*GLfloat*/
	) : void;
	function uniform3fv(
		location : WebGLUniformLocation,
		v : Float32Array
	) : void;
	function uniform3fv(
		location : WebGLUniformLocation,
		v : number[]/*float[]*/
	) : void;
	function uniform3i(
		location : WebGLUniformLocation,
		x : int/*GLint*/,
		y : int/*GLint*/,
		z : int/*GLint*/
	) : void;
	function uniform3iv(
		location : WebGLUniformLocation,
		v : Int32Array
	) : void;
	function uniform3iv(
		location : WebGLUniformLocation,
		v : int[]/*long[]*/
	) : void;
	function uniform4f(
		location : WebGLUniformLocation,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/,
		z : number/*GLfloat*/,
		w : number/*GLfloat*/
	) : void;
	function uniform4fv(
		location : WebGLUniformLocation,
		v : Float32Array
	) : void;
	function uniform4fv(
		location : WebGLUniformLocation,
		v : number[]/*float[]*/
	) : void;
	function uniform4i(
		location : WebGLUniformLocation,
		x : int/*GLint*/,
		y : int/*GLint*/,
		z : int/*GLint*/,
		w : int/*GLint*/
	) : void;
	function uniform4iv(
		location : WebGLUniformLocation,
		v : Int32Array
	) : void;
	function uniform4iv(
		location : WebGLUniformLocation,
		v : int[]/*long[]*/
	) : void;
	function uniformMatrix2fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : Float32Array
	) : void;
	function uniformMatrix2fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : number[]/*float[]*/
	) : void;
	function uniformMatrix3fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : Float32Array
	) : void;
	function uniformMatrix3fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : number[]/*float[]*/
	) : void;
	function uniformMatrix4fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : Float32Array
	) : void;
	function uniformMatrix4fv(
		location : WebGLUniformLocation,
		transpose : boolean/*GLboolean*/,
		value : number[]/*float[]*/
	) : void;
	function useProgram(program : WebGLProgram) : void;
	function validateProgram(program : WebGLProgram) : void;
	function vertexAttrib1f(
		indx : int/*GLuint*/,
		x : number/*GLfloat*/
	) : void;
	function vertexAttrib1fv(
		indx : int/*GLuint*/,
		values : Float32Array
	) : void;
	function vertexAttrib1fv(
		indx : int/*GLuint*/,
		values : number[]/*float[]*/
	) : void;
	function vertexAttrib2f(
		indx : int/*GLuint*/,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/
	) : void;
	function vertexAttrib2fv(
		indx : int/*GLuint*/,
		values : Float32Array
	) : void;
	function vertexAttrib2fv(
		indx : int/*GLuint*/,
		values : number[]/*float[]*/
	) : void;
	function vertexAttrib3f(
		indx : int/*GLuint*/,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/,
		z : number/*GLfloat*/
	) : void;
	function vertexAttrib3fv(
		indx : int/*GLuint*/,
		values : Float32Array
	) : void;
	function vertexAttrib3fv(
		indx : int/*GLuint*/,
		values : number[]/*float[]*/
	) : void;
	function vertexAttrib4f(
		indx : int/*GLuint*/,
		x : number/*GLfloat*/,
		y : number/*GLfloat*/,
		z : number/*GLfloat*/,
		w : number/*GLfloat*/
	) : void;
	function vertexAttrib4fv(
		indx : int/*GLuint*/,
		values : Float32Array
	) : void;
	function vertexAttrib4fv(
		indx : int/*GLuint*/,
		values : number[]/*float[]*/
	) : void;
	function vertexAttribPointer(
		indx : int/*GLuint*/,
		size : int/*GLint*/,
		type : int/*GLenum*/,
		normalized : boolean/*GLboolean*/,
		stride : int/*GLsizei*/,
		offset : number/*GLintptr*/
	) : void;
	function viewport(
		x : int/*GLint*/,
		y : int/*GLint*/,
		width : int/*GLsizei*/,
		height : int/*GLsizei*/
	) : void;
}

native class WebGLContextEvent extends Event {
	// FIXME: delete function constructor();
	__readonly__ var statusMessage : string/*DOMString*/;
	function initWebGLContextEvent(
		typeArg : string/*DOMString*/,
		canBubbleArg : boolean,
		cancelableArg : boolean,
		statusMessageArg : string/*DOMString*/
	) : void;
}

