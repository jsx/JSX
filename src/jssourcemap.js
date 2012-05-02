
var sourceMap = require("source-map");

var Class = require("../src/Class");

"use strict";

// XXX: monkey-patch to avoid source-map (0.1.0)'s bug
sourceMap.SourceMapGenerator.prototype._validateMapping = function () {};

var SourceMapGenerator = exports.SourceMapGenerator = Class.extend({

	constructor: function (outputFile, sourceRoot) {
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

