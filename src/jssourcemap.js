/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var Class = require("./Class");

"use strict";

var SourceMapGenerator = exports.SourceMapGenerator = Class.extend({

	constructor: function (outputFile, sourceRoot) {
		var sourceMap = require("source-map"); // lazy load for web
		// XXX: monkey-patch to avoid source-map (0.1.0)'s bug
		sourceMap.SourceMapGenerator.prototype._validateMapping = function () {};

		this._outputFile = outputFile;
		this._impl = new sourceMap.SourceMapGenerator({
			file: outputFile,
			sourceRoot: sourceRoot // optional
		});
	},

	add: function (generatedPos, originalPos, sourceFile, tokenName) {
		this._impl.addMapping({
			generated: generatedPos,
			original:  originalPos,
			source: sourceFile, // optional
			name: tokenName // optional
		});
	},

	getSourceMappingFile: function () {
		return this._outputFile + ".mapping";
	},

	generate: function () {
		return this._impl.toString();
	},

	magicToken: function () {
		return "\n" + "//@ sourceMappingURL=" +
			this.getSourceMappingFile() + "\n";
	}
});

