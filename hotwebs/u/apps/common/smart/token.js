//var token="646efd1c932c4fb4812e0c5503b1a067";
var token=getUrlVar("token");
function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function getUrlVar(name){
	return getUrlVars()[name];
}

var _params;
function initParams(params) {
    _params = params;
}
function hideDialog() {
    if (parent && parent.cb && _params) {
        parent.cb.route.hidePageViewPart(_params.viewModelName, _params.appId);
    }
}