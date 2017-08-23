var cb = {};
cb.rest = {};
//cb.rest.appContext = { serviceUrl: location.protocol + "//" + location.host };
//cb.rest.appContext = { serviceUrl: "http://10.1.40.51:9999" };
cb.rest.appContext = { serviceUrl: "http://m.udh.yonyouup.com:8521" };
//cb.rest.appContext = { serviceUrl: "http://m.udh.yonyouup.com" };
//cb.rest.appContext = { serviceUrl: "http://udh.yonyouup.com:99" }; //Demo

//扩展JS类型原型对象
(function () {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
})();

var upTool = {
    numMulti: function (num1, num2) {//去误差乘
        if (!num1) {
            num1 = 1;
        }

        if (!num2) {
            num2 = 1;
        }

        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    },
    numAdd: function (arg1, arg2) {//去误差加
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    },
    numDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    numSub: function (arg1, arg2) {
        return commonLogic.numAdd(arg1, -arg2);
    },
    numMO: function (num) {//千分符
        if (num && num.toString().indexOf(',') > 0) {
            return num;
        }
        num = parseFloat(num);
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
};
cb.confirm = function (msg, title, callbackOk, callbackCancel) {
    if (arguments.length === 2) {
        if (typeof msg === 'function') {
            callbackOk = msg;
            callbackCancel = callbackOk;
            msg = null;
        }
    }
    if (arguments.length === 1) {
        if (typeof msg === 'function') {
            callbackOk = msg;
            msg = '确定要删除么？';
        }
    }
    myApp.modal({
        title: '<div class="common-tips-title warning-tips">' +
                             '<i class="icon icon-warning"></i><span  class="font-23">' + title + '</span>' +
                           '</div>',
        text: '<div class="common-tips-content">' +
                 '<div class="tips-info">' + msg + '</div>' +
               '</div>',
        buttons: [{
            text: '确定',
            onClick: function () {
                if (callbackOk)
                    callbackOk();
            }
        }, {
            text: '取消',
            onClick: function () {
                if (callbackCancel)
                    callbackCancel();
            }
        }]
    });
};

//键盘打开时,重新加载文本框位置
var checkKeyBoardTimeMark = null;
cb.windowHeight = document.body.clientHeight;
cb.minHeight = cb.windowHeight / 3 * 2;
cb.reKeyboard = function (obj, content) {
    obj.focus(function () {
        var $$this = $$(this);
        setTimeout(function () {
            var bottom = document.body.clientHeight - ($$this.offset().top - content.scrollTop());
            if (bottom < 80) {
                var theVal = 0;
                if (bottom > 0) {
                    theVal = 80 - bottom + 30;
                } else {
                    bottom = -bottom;
                    theVal = bottom + 50 + 30;
                }
                content.css("margin-top", -theVal + "px");
            }
        }, 800);
        checkKeyBoardTimeMark = setInterval(function () {
            if (document.body.clientHeight > cb.minHeight) {
                content.css("margin-top", "0px");;
                window.clearInterval(checkKeyBoardTimeMark);
                checkKeyBoardTimeMark = null;
            }
        }, 1000);
    });
};

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
    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
        url = serviceUrl + "/" + url;
    }

    if (cb.rest.appContext.token) {
        url = url + (url.indexOf('?') >= 0 ? "&" : "?") + 'token=' + cb.rest.appContext.token;
    }

    var udid;
    if (window.plus && plus.device)
        udid = plus.device.imei;
    else if (cb.rest.appContext.code)
        udid = cb.rest.appContext.code;
    else {
        if (window.localStorage) {
            if (localStorage.upudid) {
                udid = localStorage.upudid;
            }
            else {
                udid = (new Date()).valueOf() + '|' + Math.random();
                localStorage.upudid = udid;
            }
            cb.rest.appContext.code = udid;
        } else {
            alert('手机系统版本太低了,无法使用本软件!');
        }
    }

    url = url + (url.indexOf('?') >= 0 ? "&" : "?") + 'deviceId=' + udid;
    if (!params) return url;
    var queryStr = [];
    for (var name in params)
        queryStr.push(name + "=" + params[name]);
    if (queryStr.length === 0) return url;
    return url.indexOf("?") >= 0 ? (url + "&" + queryStr.join("&")) : (url + "?" + queryStr.join("&"));
};

//错误码处理机制
cb.resultFactory = function (data, callback) {
    var myResultData = (typeof data == 'string') ? JSON.parse(data) : data;

    if (myResultData.code == 900) {//登录失效
        localStorage.removeItem("uptoken");
        cb.rest.appContext.token = null;
        myApp.hidePreloader();
        myApp.loginScreen();
        return;
    }
    callback(data);
};

cb.getJsonTimeMark = null;
cb.rest.getJSON = function (url, params, callback, isList) {
    if (!url) return;
    if (typeof params === 'function') {
        callback = params;
        params = null;
    }
    var url = this.getUrl(url, params);

    if (cb.getajaxCount == 0 && !cb.getJsonTimeMark) {
        cb.getJsonTimeMark = setTimeout(function () {
            if (isList) {
                myApp.showIndicator();
            }
            else {
                myApp.showPreloader();
            }
        }, 600);
    }
    cb.getajaxCount++;

    var complete = function () {
        cb.getajaxCount--;
        if (cb.getajaxCount == 0) {
            if (cb.getJsonTimeMark) {
                clearTimeout(cb.getJsonTimeMark);
                cb.getJsonTimeMark = null;
            }
            if (isList) {
                myApp.hideIndicator();
            }
            else {
                myApp.hidePreloader();
            }
        }
    };
    $$.ajax({
        url: url,
        method: "GET",
        success: function (data) {
            try {
                data = JSON.parse(data);
                cb.resultFactory(data, callback);
            } catch (e) {
                myApp.toast('系统错误,请重试！', 'error').show(true);
                console.error(e.message);
                complete();
            }
        },
        error: function (xhr, status) {
            console.error(url + "发生http错误!");
            complete();
        },
        complete: complete
    });
};

cb.getajaxCount = 0;
cb.postajaxCount = 0;
cb.rest.postData = function (url, params, callback) {
    var upoverflow = document.getElementById("upoverflow");
    if (cb.postajaxCount == 0) {
        if (!upoverflow) {
            upoverflow = document.createElement("div");
            upoverflow.className = "upoverflow";
            upoverflow.id = "upoverflow";
            upoverflow.style.zIndex = 9999999999999;
            document.body.appendChild(upoverflow);
        }
        else {
            upoverflow.style.display = "block";
        }
    }
    cb.postajaxCount++;

    if (!url) return;
    if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
        params = null;
    }
    var url = this.getUrl(url);
    var complete = function () {
        cb.postajaxCount--;
        if (cb.postajaxCount == 0) {
            upoverflow.style.display = "none";
        }
    };
    $$.ajax({
        url: url,
        method: 'POST',
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function (data) {
            try {
                data = JSON.parse(data);
                cb.resultFactory(data, callback);
            } catch (e) {
                myApp.toast('系统错误,请重试！', 'error').show(true);
                console.error(e.message);
                complete();
            }
        },
        error: function (xhr, status) {
            console.error(url + "发生http错误!");
            complete();
        },
        complete: complete
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