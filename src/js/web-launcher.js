/**
 * call a function on load/DOMContentLoaded
 */
function $__jsx_onload (event) {
	window.removeEventListener("load", $__jsx_onload);
	window.removeEventListener("DOMContentLoaded", $__jsx_onload);
	//--CODE--//
}

window.addEventListener("load", $__jsx_onload);
window.addEventListener("DOMContentLoaded", $__jsx_onload);
