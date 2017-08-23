//扩展JS类型原型对象
(function () {
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month 
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
            "S": this.getMilliseconds() //millisecond 
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
})();

var cb = {};
cb.rest = {};
cb.rest.appContext = { serviceUrl: location.protocol + "//" + location.host };
//cb.rest.appContext = { serviceUrl: "http://10.1.40.24:9999" };
//cb.rest.appContext = { serviceUrl: "http://m.udh.yonyouup.com" };
//cb.rest.appContext = { serviceUrl: "http://udh.yonyouup.com:99" }; //Demo
cb.getUDID = function () {
    var code;
    if (window.plus && plus.device)
        code = plus.device.imei;
    else if (cb.rest.appContext.code)
        code = cb.rest.appContext.code;
    else {
        code = (new Date()).valueOf() + '|' + Math.random();
        cb.rest.appContext.code = code;
    }
    return code;
};
cb.rest.getUrl = function (url, params) {
    if (!url) return url;
    var serviceUrl = this.appContext.serviceUrl;
    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0)
        url = serviceUrl + "/" + url;
    if (cb.rest.appContext.token) {
        url = url.indexOf('?') >= 0 ? (url + '&token=' + cb.rest.appContext.token) : (url + '?token=' + cb.rest.appContext.token);
    }

    if (!params) return url;
    var queryStr = [];
    for (var name in params)
        queryStr.push(name + "=" + params[name]);
    if (queryStr.length === 0) return url;
    return url.indexOf("?") >= 0 ? (url + "&" + queryStr.join("&")) : (url + "?" + queryStr.join("&"));
};
cb.rest.getJSON = function (url, params, callback) {
    if (!url) return;
    if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
        params = null;
    }
    var url = this.getUrl(url, params);
    $$.getJSON(url, callback);
};

cb.rest.postData = function (url, params, callback) {
    var upoverflow = document.getElementById("upoverflow");
    if (!upoverflow) {
        upoverflow = document.createElement("div");
        upoverflow.className = "upoverflow";
        upoverflow.id = "upoverflow";
        upoverflow.style.zIndex = 9999999999999;
        var loadingAnimiate = document.createElement("div");
        loadingAnimiate.className = "preloader"
        upoverflow.appendChild(loadingAnimiate);
        document.body.appendChild(upoverflow);
    }
    else {
        upoverflow.style.display = "block";
    }
    if (!url) return;
    if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
        params = null;
    }
    var url = this.getUrl(url);
    //var newParams = angular.toJson(params);
    //$http.post(url, params).success(function(resData){});
    //$$.post(url, params, callback);

    $$.ajax({
        url: url,
        method: 'POST',
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function (data) {
            callback(data);
        },
        error: function (xhr, status) { },
        complete: function () {
            upoverflow.style.display = "none";
        }
    });
};

cb.cache = {
    get: function (cacheName) { return this[cacheName]; },
    set: function (cacheName, value) { this[cacheName] = value; },
    clear: function () {
        for (var attr in this)
            if (attr != "get" && attr != "set" && attr != "clear")
                delete this[attr];
    }
};



cb.loader = {};
cb.loader.hasScript = function (src) {
    if (!src || !src.trim())
        return true;
    var scriptNode = document.createElement("script");
    scriptNode.src = src;
    var loadedScripts = document.getElementsByTagName("script");
    for (var i = 0; i < loadedScripts.length; i++) {
        if (loadedScripts[i].src.trim().toLocaleLowerCase() == scriptNode.src.trim().toLocaleLowerCase())
            return true;
    }
};
cb.loader.hasStyle = function (href) {
    if (!href || !href.trim())
        return true;
    var linkNode = document.createElement("link");
    linkNode.href = href;
    linkNode.rel = "stylesheet";
    var loadedStyles = document.getElementsByTagName("link");
    for (var i = 0; i < loadedStyles.length; i++) {
        if (loadedStyles[i].href.trim().toLocaleLowerCase() == linkNode.href.trim().toLocaleLowerCase())
            return true;
    }
};
cb.loader.getNode = function (content) {
    if (!content) return;
    var node = document.createElement("div");
    node.innerHTML = content;
    return node;
}
cb.loader.processNode = function (node, callback) {
    if (!node) return;
    var head = document.head || document.getElementsByTagName("head")[0];
    var scripts = node.getElementsByTagName("script");
    var scriptUrls = [];
    var scriptText = [];
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.type === "text/html" || script.type === "text/template7") {
            var scriptNode = script.cloneNode();
            scriptNode.innerHTML = script.innerHTML;
            head.appendChild(scriptNode);
            continue;
        }
        if (script.src && !this.hasScript(script.src)) {
            var repeatSrc = false;

            script.src = cb.loader.changeSrc(script.src);

            for (var j = 0; j < scriptUrls.length; j++) {
                if (scriptUrls[j] == script.src)
                    repeatSrc = true;
            }
            if (!repeatSrc)
                scriptUrls.push(script.src);
        }
        else if (script.text)
            scriptText.push(script.text);
    }
    for (var i = scripts.length - 1; i >= 0; i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    var links = node.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        if (!this.hasStyle(links[i].href))
            head.appendChild(links[i].cloneNode()); //head.insertBefore(script, head.firstChild);
    }
    for (var i = links.length - 1; i >= 0; i--) {
        links[i].parentNode.removeChild(links[i]);
    }
    this.executeScript(scriptUrls, scriptText, callback);
};
cb.loader.executeScript = function (scriptUrls, scriptText, callback) {
    var cacheId = "ScriptsLoaded_none";
    if (scriptUrls && scriptUrls.length) {
        cacheId = this.loadScripts(scriptUrls);
    }
    this.executeScriptText(scriptText, cacheId, callback);
};
cb.loader.loadScripts = function (scripts) {
    var cacheId = "ScriptsLoaded_" + Math.random();
    cb.cache.set(cacheId, new Array(scripts.length));
    for (var i = 0; i < scripts.length; i++) {
        this.loadScript(scripts[i], (function (i, cacheId) {
            return function () {
                cb.cache.get(cacheId)[i] = true;
            }
        })(i, cacheId), "script");
    }
    return cacheId;
};
cb.loader.loadScript = function (url, callback) {
    var script = document.createElement("script");
    if (script.scriptCharset)
        script.charset = script.scriptCharset || "utf-8";
    script.async = false;
    script.src = url;
    script.type = "text/javascript";

    script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /complete|loaded/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;

            if (callback) callback();
            script = undefined;
        }
    }
    script.onabort = function () {
        if (script) {
            if (callback) callback();
            script = undefined;
        }
    }
    script.onerror = function () {
        if (script) {
            if (callback) callback();
            script = undefined;
        }
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(script);
};
cb.loader.loadPageContent = function (url, callback) {
    var script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";

    $$.ajax({
        async: false,
        url: script.src,
        method: 'GET',
        dataType: 'text',
        success: function (data) {
            if (callback) callback(data);
        },
        error: function (xhr, status) { }
    });
};
cb.loader.loadScript_bk = function (url, callback) {
    var script = document.createElement("script");
    if (script.scriptCharset)
        script.charset = script.scriptCharset || "utf-8";
    script.type = "text/javascript";
    $$.ajax({
        async: false,
        url: url,
        method: 'GET',
        dataType: 'text',
        success: function (data) {
            script.text = data;
            var head = document.head || document.getElementsByTagName("head")[0];
            head.appendChild(script);
            if (callback) callback();
        },
        error: function (xhr, status) { }
    });
};
cb.loader.executeScriptText = function (scriptText, cacheId, callback) {
    var isAllScriptLoadCompleted = true;
    var scriptsLoad = cb.cache.get(cacheId) || [];
    var length = scriptsLoad.length;
    for (var i = 0; i < length; i++)
        isAllScriptLoadCompleted = isAllScriptLoadCompleted && scriptsLoad[i];
    if (isAllScriptLoadCompleted) {
        cb.cache.set(cacheId, null);
        if (scriptText && scriptText.length) {
            var text = scriptText.join("\r\n");
            cb.executeScript();
        }
        if (callback)
            callback();
    }
    else {
        setTimeout(cb.loader.executeScriptText, 100, scriptText, cacheId, callback);
    }
};
cb.loader.changeSrc = function (val) {
    if (val.indexOf('file:///') >= 0 && val.indexOf('/js/pages/') > 0) {
        var index = val.indexOf('/js/pages/');
        if (index > 0) {
            val = cb.rest.appContext.serviceUrl + val.substr(index);
        }
    }
    else if (val.indexOf('file:///storage/') >= 0) {
        //debug model
        var IsDebugStr = 'Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder';
        //Release model
        var IsReleaseStr = 'Android/data/com.yonyou.Uorder/apps/H594977B5';

        var index = -1;
        if (val.indexOf(IsDebugStr) > 0) {
            index = val.indexOf(IsDebugStr);
            val = cb.rest.appContext.serviceUrl + val.substr(index + IsDebugStr.length);
        }
        if (val.indexOf(IsReleaseStr) > 0) {
            index = val.indexOf(IsReleaseStr);
            val = cb.rest.appContext.serviceUrl + val.substr(index + IsReleaseStr.length);
        }
    }
    return val;
};