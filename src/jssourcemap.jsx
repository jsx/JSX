/***
 * JavaScript source-map generator
 * @see Source Map Revision 3 Proposal - https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
 */

/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

import "./util.jsx";
import "js/nodejs.jsx"; // for base64 encode

native class SourceMapGenerator {
	function constructor(options : Map.<string>);
	function addMapping(mapping : Map.<variant>) : void;
	function setSourceContent(sourceFile : string, sourceContent : string) : void;
} = "require('source-map').SourceMapGenerator";

native class SourceMapConsumer {
	function constructor(mapping : variant);
	function originalPositionFor(generatedPos : variant) : variant;
} = "require('source-map').SourceMapConsumer";


class SourceMapper {

	static const NODE_SOURCE_MAP_HEADER = "require('source-map-support').install();\n\n";
	static const WEB_SOURCE_MAP_HEADER = "";

	var _rootDir : string;
	var _outputFile : Nullable.<string>;
	var _impl : SourceMapGenerator;
	var _header : string;

	var _sourceFiles = new Map.<boolean>();

	var _outputLength = 0;
	var _outputLineNumber = 1;

	function constructor (rootDir : string, outputFile : Nullable.<string>, runenv : string) {
		this._rootDir = rootDir;
		this._outputFile = outputFile != null ? Util.resolvePath(outputFile) : null;
		this._impl = new SourceMapGenerator({
			file       : outputFile != null ? Util.basename(this._outputFile) : null
		});

		switch (runenv) {
		case "node":
			this._header = SourceMapper.NODE_SOURCE_MAP_HEADER;
			break;
		case "web":
			this._header = SourceMapper.WEB_SOURCE_MAP_HEADER;
			break;
		default:
			this._header = "";
		}
		this._outputLength += this._header.length;
		this._outputLineNumber += this._header.split('\n').length - 1;
	}

	function getSourceMapHeader () : string {
		return this._header;
	}

	function makeGeneratedPos(output : string) : Map.<number>{
		var pos  = this._outputLength;
		var line = this._outputLineNumber;
		while ( (pos = output.indexOf("\n", pos)) != -1 ) {
			++pos;
			++line;
		}

		this._outputLength = output.length;
		this._outputLineNumber = line;

		var lastNewLinePos = output.lastIndexOf("\n") + 1;
		var column = (output.length - lastNewLinePos);
		return {
			line:   line,
			column: column
		};
	}

	function add(output : string, tokenLineNumber : number, tokenColumnNumber : number, tokenValue : Nullable.<string>, tokenFilename : Nullable.<string>) : void {

		var genPos = this.makeGeneratedPos(output);

		var origPos : Map.<number>;
		var sourceFile : Nullable.<string>;

		// see SourceMapGenerator#_validateMapping
		if (Number.isNaN(tokenLineNumber) || tokenFilename == null) {
			origPos    = null;
			sourceFile = null;
			tokenValue = null;
		}
		else {
			origPos = {
				line:   tokenLineNumber,
				column: tokenColumnNumber
			};

			sourceFile = tokenFilename;
			this._sourceFiles[sourceFile] = true;
			if (sourceFile.indexOf(this._rootDir + "/") == 0) {
				sourceFile = sourceFile.substring(this._rootDir.length + 1);
			}
		}

		this._impl.addMapping({
			generated: genPos,
			original:  origPos,
			source:    sourceFile,
			name:      tokenValue
		});
	}

	function setSourceContent(sourceFile : string, sourceContent : string) : void {
		this._impl.setSourceContent(sourceFile, sourceContent);
	}

	function getSourceMappingFile () : string {
		return this._outputFile + ".mapping";
	}

	function getSourceFiles() : string[] {
		return this._sourceFiles.keys();
	}

	function generate () : string {
		return this._impl.toString();
	}

	function getSourceMapFooter() : string {
		var sourceMappingURL;
		if (this._outputFile != null) {
			sourceMappingURL = Util.basename(this.getSourceMappingFile());
		}
		else {
			// uses Data URI scheme
			sourceMappingURL = "data:application/json;base64," + (new Buffer(this.generate(), "utf8").toString("base64"));
		}
		return "\n" + "//# sourceMappingURL=" + sourceMappingURL + "\n";
	}
}
