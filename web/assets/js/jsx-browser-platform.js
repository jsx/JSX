var BrowserPlatform = jsx.Platform.extend({
	constructor: function(root) {
		this._root = root;
		this._errors = [];
		this._content = {};
	},

	setContent: function (name, content) {
		this._content[name] = content;
	},

	load: function (name) {
		if(this._content[name] != null) {
			return this._content[name];
		}
		// synchronous XHR
		var xhr = new XMLHttpRequest();
		xhr.open("GET", name, false);
		xhr.send(null);
		if(xhr.status === 200) {
			return xhr.responseText;
		}
		else {
			throw new Error(xhr.status + " " + xhr.statusText + ": " + name);
		}
	},

	getRoot: function () {
		return this._root;
	},

	error: function (s) {
		console.error(s);
		this._errors.push(s);
	},

	getErrors: function () {
		return this._errors;
	}
});
