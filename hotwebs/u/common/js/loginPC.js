//登陆
document.onkeydown=function(){keyEnter()}
function keyEnter() {
   var loginDom = document.getElementById('loginPage');
	if(loginDom.style.display=='block'){
		if(event.keyCode==13)
		 {
		  $('#login').trigger('click');
		 }
	}
}

var baseUrl = location.protocol + "//" + location.host;
var proxyConfig = {
    "login": { url: baseUrl + "/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/login", method: "POST" },
    "logout": { url: baseUrl + "/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/logout", method: "GET" },
    "serverPubKey": { url: baseUrl + "/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/getRsaPublicKey", method: "GET" }
};

function getLoginData() {
    var account = document.getElementById("account").value.split(",");
    if (!account[0]) account[0] = "";
    if (!account[1]) account[1] = "";
    if (!account[2]) account[2] = "";
    var data = {
        "userCode": document.getElementById("userName").value.trim(),
        "password": document.getElementById("password").value,
        "accountCode": account[0],
        "dataSourceName": account[1],
        "accountName": account[2],
        "lang": document.getElementById('language').options[document.getElementById('language').selectedIndex].value
    };
    return data;
};

function logout() {
    var token = this.token;
    if (!token) return;
    var data = { token: token };
    cb.loadXMLDoc(proxyConfig.logout.url, proxyConfig.logout.method, { data: data });
};

var $dialog;
var dialog;

function confirmModifyPassword() {
    var data = getLoginData();
    var newPwd = $dialog.find(".newpwd").val();
    var newPwdConfirm = $dialog.find(".newpwdconfirm").val();
    data.newPassWord1 = newPwd;
    data.newPassWord2 = newPwdConfirm;
    data.token = this.token;
    data.step = this.step;
    data.isEditPassWord = true;
    innerLogin(data, function (msg) {
        if (msg) {
            $dialog.find(".error").html(msg);
        } else {
            dialog.hideModal();
        }
    });
};

function cancelModifyPassword() {
    logout.call(this);
    dialog.hideModal();
};

function showWindow(context) {
    if (!dialog) {
        $dialog = $("#modifyPasswordDialog");
        $dialog.find(".message").children().last().html(context.title);
        dialog = new cb.controls.Modal($dialog, { title: "修改密码", width: 500, height: 300 });
    }
    var $btnOk = $dialog.find(".ok");
    $btnOk.unbind("click");
    $btnOk.click(context, function (e, args) {
        confirmModifyPassword.call(e.data);
    });
    var $btnCancel = $dialog.find(".cancel");
    $btnCancel.unbind("click");
    $btnCancel.click(context, function (e, args) {
        cancelModifyPassword.call(e.data);
    });
    dialog.showModal();
};

function redirectHomepage() {
    var userData = this.data.success;
    var token = userData.token;
    var size = cb.broswerJudge.getBroswerSize().size;
    userData.size = size;
    userData.remenberMe = document.getElementById('remenberMe').checked;
    userData.accountName = document.getElementById('account').value.split(',')[2];
    localStorage.setItem("userData", cb.data.JsonSerializer.serialize(userData));
    cb.route.redirectHomepage({ token: token, size: size });
};

function innerLogin(data, callback) {
    cb.loadXMLDoc(proxyConfig.login.url, proxyConfig.login.method, {
        data: data, callback: function (result) {
            if (!result || !result.data) return;
            if (result.code == 520) {
                if (!result.data.fail) return;
                switch (result.data.fail.msgType) {
                    case "W":
                        {
                            new cb.controls.MessageBox({
                                "displayMode": "confirm",
                                "msg": result.data.fail.msgContent,
                                "okCallback": forceLogin
                            });
                        }
                        break;
                    case "E":
                        {
                            if (callback) {
                                callback.call(this, result.data.fail.msgContent);
                            } else {
                                var context = {};
                                if (result.data.success && result.data.success.token)
                                    context.token = result.data.success.token;
                                new cb.controls.MessageBox({
                                    "displayMode": "warning",
                                    "msg": result.data.fail.msgContent,
                                    "okCallback": logout,
                                    "context": context
                                });
                            }
                        }
                        break;
                    case "I":
                        {
                            var context = {};
                            if (result.data.success && result.data.success.token)
                                context.token = result.data.success.token;
                            new cb.controls.MessageBox({
                                "displayMode": "warning",
                                "msg": result.data.fail.msgContent,
                                "okCallback": redirectHomepage,
                                "context": result
                            });
                        }
                        break;
                    case "P":
                        {
                            var context = {};
                            if (result.data.success && result.data.success.token)
                                context.token = result.data.success.token;
                            if (result.data.fail.msgID)
                                context.step = result.data.fail.msgID;
                            if (result.data.fail.msgContent)
                                context.title = result.data.fail.msgContent;
                            showWindow(context);
                        }
                        break;
                }
            } else if (result.code == 200) {
                if (!result.data.success) {
                    new cb.controls.MessageBox({
                        "displayMode": "tip",
                        "msg": result.data.fail.MessageDetail
                    });
                    return;
                }
                if (callback) callback.call(this);
                redirectHomepage.call(result);
            }
        }
    });


};

function login() {
    var data = getLoginData();
    cb.RSA.getServerPubKey(proxyConfig.serverPubKey.url, proxyConfig.serverPubKey.method, {
        data: null, callback: function (data1) {
            if (data1.data.success) {
                var serverPubKey = data1.data.success;
                var rsaData = cb.RSA.CreateRSAdata(serverPubKey, { userCode: data.userCode, password: data.password });
                var sendData = $.extend({}, data, rsaData);
                innerLogin(sendData);
            }
        }
    })

};

function forceLogin() {
    var data = getLoginData();
    data.isForceLogin = true;
    cb.RSA.getServerPubKey(proxyConfig.serverPubKey.url, proxyConfig.serverPubKey.method, {
        data: null, callback: function (data1) {
            if (data1.data.success) {
                var serverPubKey = data1.data.success;
                var rsaData = cb.RSA.CreateRSAdata(serverPubKey, { userCode: data.userCode, password: data.password });
                var sendData = $.extend({}, data, rsaData);
                innerLogin(sendData);
            }
        }
    })
};
function forgetPwd() {
    window.location.href = "getPassword.html";
}
//账套
function getAccounts(queryString) {
    cb.loadXMLDoc("/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/getAccount2", "GET", { data: queryString, callback: callback });
    function callback(result) {
        var accountlist = "";
        var accountEle = document.getElementById("account");
        $(accountEle).empty();
        for (var i = 0; i < result.data.success.length; i++) {
            var option = document.createElement("option");
            var textNode = document.createTextNode(result.data.success[i].name);
            option.value = result.data.success[i].code + ',' + result.data.success[i].dataSourceName + ',' + result.data.success[i].name;
            option.appendChild(textNode)
            accountEle.appendChild(option);
        }
        if (localStorage.getItem('userData')) {
            var userData = JSON.parse(localStorage.getItem('userData'))
            //accountEle.value = "webOrg,autotest6315new";
            accountEle.value = userData.accountCode + ',' + userData.dataSourceName + ',' + userData.accountName;

        }
    }
}
//语言加载
function getLanguages() {
    //http://localhost:8888/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/getAllLanguages 
    //cb.loadXMLDoc("/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/getAllLanguages", "GET", { callback: callback });
    var languages = [{ ncmark: "zh-CN", displayName: "简体中文" }, { ncmark: "en-US", displayName: "English"}];
    var result = {};
    result.data = { success: languages };
    callback(result);

    function callback(result) {
        if (result.data.success) {
            var accountlist = "";
            var languageEle = document.getElementById("language");
            $(languageEle).empty();
            languageEle.onchange = function (e) {
                initLanguage(this.value);
            }
            for (var i = 0; i < result.data.success.length; i++) {
                var option = document.createElement("option");
                var textNode = document.createTextNode(result.data.success[i].displayName);
                option.value = result.data.success[i].ncmark;
                option.appendChild(textNode);
                languageEle.appendChild(option);
            }
            //localStorage.getItem('userData')
            if (localStorage.getItem('userData')) {
                var userData = JSON.parse(localStorage.getItem('userData'))
                languageEle.value = userData.lang;
            }
        }
    }
}
function initLanguage(language) {
    //var pageItem = {};
    //pageItem. = cb.languageArray[language];
    for (var item in cb.languageArray[language]) {
        if (item == "userName" || item == "password") {
            document.getElementById(item).setAttribute('placeholder', cb.languageArray[language][item]);
            continue;
        }
        document.getElementById(item).innerHTML = cb.languageArray[language][item];
    }
}
cb.languageArray = {
    'zh-CN': {
        'help': '帮助',
        'complaySay': '全球第一中型企业应用平台',
        'userName': '用户名',
        'password': '密码',
        'login': '登录',
        'remenberUserName': "记住用户名",
        'changeAccount': "切换账号",
        'forgetPassword': "忘记密码？"
    },
    'en-US': {
        'help': 'Help',
        'complaySay': 'Global first medium enterprise application platform',
        'userName': 'username',
        'password': 'password',
        'login': 'login',
        'remenberUserName': "Remenber Me",
        'changeAccount': "Change Account",
        'forgetPassword': "Forget Password？"
    }
};

//异步请求数据  url链接，type:"POST" || "GET" params:{callback:callback,data:data}
//loadXMLDoc("/classes/Login/UAP/GetAccount", "GET", {callback:callback});

cb.loadXMLDoc = function (url, type, params) {
    var myUrl = url ? url : "";
    var myType = type ? type : "GET";
    var myParams = params.data ? params.data : "";
    var myData = '';
    if (myType == "GET") {
        myData = '?';
        for (var item in myParams) {
            if (myData.length > 1) {
                myData += "&"
            }
            myData += item + "=" + myParams[item];
        }
        //myParams = myParams
        myUrl += myData;
    } else {
        if (typeof myParams == "object" && window.JSON && window.JSON.stringify)
            myData = window.JSON.stringify(myParams);
        else
            myData = myParams;
    }
    var xmlhttp;
    if (window.XMLHttpRequest) {        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //alert(xmlhttp.responseText);
            var result = xmlhttp.responseText;
            var data = JSON.parse(result);
            if (params && params.callback) params.callback.call(this, data);
        }
    }
    xmlhttp.open(myType, myUrl, true);
    xmlhttp.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader("dataType", "json");
    //xmlhttp.setRequestHeader("data", myParams);
    //xmlhttp.send(myData);
    xmlhttp.send(myData);
}

cb.broswerJudge = {};
cb.broswerJudge.getBroswerSize = function () {
    var size = new cb.util.queryString(location.search).get("size");
    if (size) return size;
    var result = {};
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsTP = sUserAgent.match(/tablet pc/i) == "tablet pc";

    result = cb.broswerJudge.userAgentInfo();
    //console.log(result)
    if (result.isPC) {
        //lvar cScreemWidth = cb.broswerJudge.getWindowInnerWidth();
        //if(cScreemWidth<=result.mapp.S_maxWidth)
        //	result.size="S";
        //else if(cScreemWidth<=result.mapp.M_maxWidth)
        //	result.size="M";
        //else
        //    result.size="L";

        result.size = "L";
    }
    else if (bIsIpad || bIsTP) {
        result.size = "M";
    }
    else {
        //只适应设备的宽度，不对浏览器的大小进行适应。
        //var availWidth = window.screen.availWidth;
        //var availHeight = window.screen.availHeight;
        //var cScreemWidth = availWidth > availHeight?availWidth:availHeight;
        var cScreemWidth = cb.broswerJudge.getWindowInnerWidth();
        if (cScreemWidth <= result.mapp.S_maxWidth)
            result.size = "S";
        else
            result.size = "M";
    }
    //result.size = "M";
    return result;
};

//函数：访问设备信息
//window.userAgentInfo = cb.broswerJudge.userAgentInfo();

cb.broswerJudge.userAgentInfo = function () {
    var result = {};
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    var bIsTP = sUserAgent.match(/tablet pc/i) == "tablet pc";

    result.deviceType = bIsIpad ? "ipad" : bIsIphoneOs ? "iphone os" : bIsMidp ? "midp" : bIsUc7 ? "rv:1.2.3.4" : bIsUc ? "ucweb" : bIsAndroid ? "android" : bIsCE ? "windows ce" : bIsWM ? "windows mobile" : bIsTP ? "tablet pc" : "PC";
    result.isPC = !(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsTP);
    result.mapp = { S_maxWidth: 480, M_maxWidth: 768, L_minWidth: 1024 };
    result.userSystem = sUserAgent.indexOf('android') > -1 || sUserAgent.indexOf('ainux') > -1 ? 'android' : sUserAgent.indexOf('iphone') > -1 ? "ios" : sUserAgent.indexOf('windows phone') > -1 ? "windows phone" : '';
    return result;
};

//函数：获取尺寸
cb.broswerJudge.getWindowInnerWidth = function () {
    // 获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    // 获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;

    // 通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    // 结果输出至两个文本框

    return winWidth;
};



cb.RSA = {};
cb.RSA.getServerPubKey = null;
cb.RSA.CreateRSAdata = function (serverPubKey, data) {
    if (serverPubKey) {
        RSAUtils.setMaxDigits(200);
        var key = new RSAUtils.getKeyPair(serverPubKey.empoent, "", serverPubKey.module);
        var result = {};
        for (var i in data) {
            result[i] = RSAUtils.encryptedString(key, data[i]);
        }
        result['publicKeyVO'] = serverPubKey;
        return result;

    } else {
        return null;
    }
}
cb.RSA.getServerPubKey = function (url, method, callback) {
    cb.loadXMLDoc(url, "GET", callback);
    /*
    function callback(result) {
    if (result && result.data.success){
    callback(result.data.success);
    }
    else
    alert(result.data.fail.MessageDetail);
    }
    */
}

cb.convertImgToBase64 = function (url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

function init(tag) {
    if (isLoaded()) {
        initUnloadState()
    } else {
        initLoadedState()
    }

    //document.getElementById("userName").value = "sa1";
    //document.getElementById("password").value = "yonyou@1";
}
//初始化为已经保存过用户名
function initUnloadState() {
    var loginBox = document.getElementById("loginBox");
    if (loginBox.className != "hasloaded") {
        loginBox.className = "hasloaded"
    };
    //loginBox.childNodes("div").innerHtml()

    var userData = JSON.parse(localStorage.getItem("userData"));
    document.getElementById("userName").value = userData["userName"];
    var userNameSpan = document.getElementById("userName").parentNode.firstChild.nextSibling.children[1];
    var accountSpan = document.getElementById("userName").parentNode.firstChild.nextSibling.children[2];
    userNameSpan.innerHTML = userData["userName"];
    accountSpan.innerHTML = userData.accountName;
    document.getElementById('account').value = userData.accountCode + ',' + userData.dataSourceName;
    document.getElementById('remenberMe').checked = userData.remenberMe;
    document.getElementById('account').parentNode.style.display = "none";
    initLanguage(userData.lang);
    //document.getElementById("userName").parentNode.firstChild.nextElementSibling.childNodes[2].style.backgroundImage = 'url("' + localStorage.photoUrl + '") 0 0 no-repeat';
    document.getElementById("userName").parentNode.firstChild.nextElementSibling.style.display = "block"
    //为了方便不想每次都输入用户密码
    document.getElementById("password").value = "yonyou@1";
}

//isLoaded 判断是否登陆保存过用户名
function isLoaded() {
    if (localStorage.getItem("userData")) {
        //if (localStorage.getItem("myPhoto")) {
        //	var userData = JSON.parse(localStorage.getItem('userData'));
        //	userData.remenberMe?true:false;
        //}
        var userData = JSON.parse(localStorage.getItem('userData'));
        return userData.remenberMe == true ? true : false;
    } else {
        return false;
    }
}

//初始化为没有保存过用户名
function initLoadedState() {
    var loginBox = document.getElementById("loginBox");
    // if (localStorage.username) {
    if (loginBox.className == "hasloaded") {
        loginBox.className = ""
    }
    if (localStorage.getItem("userData")) {
        localStorage.removeItem("userData");
    }
    if (localStorage.getItem("deviceSize")) {
        localStorage.removeItem("deviceSize");
    }
    if (localStorage.getItem("userName")) {
        localStorage.removeItem("userName");
    }
    var span = document.getElementById("userName").parentNode.firstChild.nextSibling.children[1];
    var accountSpan = document.getElementById("userName").parentNode.firstChild.nextSibling.children[2];
    span.innerHTML = '';
    accountSpan.innerHTML = '';
    document.getElementById('account').parentNode.style.display = "block";
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";


    //}
}
//convertImgToBase64(url, callback, outputFormat) url图片链接 callback 生成成功后的回掉函数  outputFormat输出的类型格式
function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

//便捷登陆
function scrum() {
    localStorage.setItem("userName", "u1");
    localStorage.setItem("photoUrl", "pc/images/menu/u32.png");
    convertImgToBase64(localStorage.photoUrl, function (base64) {
        localStorage.setItem("myPhoto", base64);
        //console.log(base64)
    });

}

//scrum()
//initLoadedState()
/*init(true);
getAccounts();
getLanguages();*/
window.onload = function () {
    var images = [
            { src: "common/images/loginPC/pc-bg01.png", isLoaded: false },
            { src: "common/images/loginPC/pc-bg02.jpg", isLoaded: false },
            { src: "common/images/loginPC/pc-bg03.jpg", isLoaded: false },
            { src: "common/images/loginPC/pc-bg04.jpg", isLoaded: false }
        ];
    var loader = new cb.image.imgLoader();
    loader.init("content", images);
};

//二维码登录
cb.qrcode = {};
cb.qrcode.uuid = '';  //记录获取的uuid
cb.qrcode.token = '';  //获取uuid定时器
cb.qrcode.tokentimeline = '';  //定时器线程
cb.qrcode.uuidtimeline = '';  //获取uuid定时器
cb.qrcode.getuuidURL = window.location.origin + '/upservices/uap.qrlogin.QrLogin/uap/getuuid'; //获取uuid的服务接口
cb.qrcode.getTokenURL = window.location.origin + '/upservices/uap.qrlogin.QrLogin/uap/getToken';     //当获取到uuid后获取移动设备已经登录所用的token
//http://127.0.0.1:8081/upservices/uap.qrlogin.QrLogin/uap/getToken?uuid=4vhha3joroxpfqbxx0ehfu63e
cb.qrcode.getuuid = function () {  //获取uuid
    cb.loadXMLDoc(cb.qrcode.getuuidURL, "GET", { callback: function (data) {
        if (data.data.success) {
            if (cb.qrcode.uuid) {

                cb.qrcode.uuid = data.data.success.uuid;
                document.getElementById("dimenSionalImage").src = "qrcode.jsp?uuid=" + data.data.success.uuid;
                if (cb.qrcode.tokentimeline) {
                    clearInterval(cb.qrcode.tokentimeline);
                }

                //cb.qrcode.tokentimeline = setInterval('cb.qrcode.gettoken()',1000);

                if (cb.qrcode.uuidtimeline) {
                    clearTimeout(cb.qrcode.uuidtimeline);
                    cb.qrcode.uuidtimeline = setTimeout('cb.qrcode.getuuid()', 10000);
                }

            } else {
                cb.qrcode.uuid = data.data.success.uuid;
                document.getElementById("dimenSionalImage").src = "qrcode.jsp?uuid=" + data.data.success.uuid;
                cb.qrcode.uuidtimeline = setTimeout('cb.qrcode.getuuid()', 600000);
            }
            cb.qrcode.tokentimeline = setTimeout('cb.qrcode.gettoken()', 1000);
            //cb.qrcode.token = '';
            //cb.qrcode.uuid = data.data.success.uuid;

        } else {
            if (cb.qrcode.uuidtimeline) {
                clearInterval(cb.qrcode.uuidtimeline);
            }
            cb.qrcode.uuidtimeline = setInterval('cb.qrcode.getuuid()', 1000);
        }
    }
    });
};
cb.qrcode.getuuid = function () {  //获取uuid
    cb.loadXMLDoc(cb.qrcode.getuuidURL, "GET", { callback: function (data) {
        if (data.data.success) {
            cb.qrcode.uuid = data.data.success.uuid;
            document.getElementById("dimenSionalImage").src = "qrcode.jsp?uuid=" + data.data.success.uuid;
            cb.qrcode.tokentimeline = setTimeout('cb.qrcode.gettoken()', 1000);

        } else {
            if (cb.qrcode.uuidtimeline) {
                clearInterval(cb.qrcode.uuidtimeline);
            }
            cb.qrcode.uuidtimeline = setInterval('cb.qrcode.getuuid()', 1000);
        }
    }
    });
};
cb.qrcode.gettoken = function () {
    if (cb.qrcode.uuid) {
        cb.loadXMLDoc(cb.qrcode.getTokenURL, "GET", { callback: cb.qrcode.tokenCallback, data: { uuid: cb.qrcode.uuid} });
    }
}
cb.qrcode.tokenCallback = function (data) {
    if (data.data && data.data.success.token && data.data.success.token.length > 25) {
        redirectHomepage.call(data);
        //cb.qrcode.token = data.data.success.token;
        //location.href = cb.route.getHomepageUrl({ token: cb.qrcode.token, size: cb.broswerJudge.getBroswerSize().size });
    } else {
        if (cb.qrcode.tokentimeline) {
            clearTimeout(cb.qrcode.tokentimeline);
            //cb.qrcode.tokentimeline  = setTimeout('cb.qrcode.getuuid()',10000);
        }
        cb.qrcode.tokentimeline = setTimeout('cb.qrcode.gettoken()', 1000);
        //setInterval('cb.qrcode.gettoken('+uuid+')',1000);
    }
}
cb.qrcode.start = function () {
    if (deviceInfo.size == "L") {
        cb.qrcode.getuuid();
    };
    //var timeline = setTimeout('cb.qrcode.getuuid()',2000);
}


//setInterval('getuuid()',6000);
//setTimeout('getuuid()',6000);
var deviceInfo = cb.broswerJudge.getBroswerSize();
//cb.qrcode.uuidtimeline = setTimeout('cb.qrcode.start()',2000); //二维码登录开始


cb.image = {};
cb.image.imgLoader = function (id, images) {
    this._el = id;
    this._images = images;
    this._currentIndex = -1;
    this.init = function (id, images) {
        this._el = this._el || id;
        this._images = this._images || images || [];
        if (!this._el || this._images.length <= 0)
            return;
        this.changeImage(); //先加载第一张
        var self = this;
        setInterval(function () { self.changeImage(); }, 3000);
    };
    //预加载图片
    this.preLoad = function (image) {
        if (!image || !image.src || image.isLoaded)
            return;
        var img = new Image();
        img.src = image.src;
        image.isLoaded = true;
    };
    this.changeImage = function () {
        var el = document.getElementById('content');
        if (!el || this._images.length <= 0)
            return;
        this._currentIndex = (this._currentIndex < this._images.length - 1) ? (this._currentIndex + 1) : 0;
        el.style.backgroundImage = "url(" + this._images[this._currentIndex].src + ")";

        if (this._currentIndex + 1 < this._images.length)
            this.preLoad(this._images[this._currentIndex + 1]);
    };
}


if (window.cb) {
    //window.userAgentInfo = cb.broswerJudge.userAgentInfo();
    window.userAgentInfo = cb.broswerJudge.getBroswerSize();

}
window.onload = function () {
    var dimensionalBarCode = document.getElementById("dimensionalBarCode");
    var dimensionalBarCodeContent = document.getElementById("dimensionalBarCodeContent");
    var addListener = window.addEventListener ?
            function (el, type, fn) { el.addEventListener(type, fn, false); } :
            function (el, type, fn) { el.attachEvent('on' + type, fn); };

    //btn1.onclick = function () {   loginBox handleBar

    //};
    addListener(dimensionalBarCode, 'click', function () {
        var isDisplay = document.getElementById("dimensionalBarCodeContent").style.display;
        if (isDisplay == "block") {
            if (cb.qrcode.tokentimeline)
                clearTimeout(cb.qrcode.tokentimeline);
            document.getElementById("loginBox").style.display = "block";
            document.getElementById("handleBar").style.display = "block";
            document.getElementById("dimensionalBarCodeContent").style.display = "none";
            document.getElementById("dimensionalBarCode").style.background = "url('common/images/loginPC/2-dimensional-bar-code.png')  11px 14px no-repeat"
        } else {
            cb.qrcode.uuidtimeline = setTimeout('cb.qrcode.start()', 500);
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("handleBar").style.display = "none";        //close-2-dimensional-bar-code.png
            document.getElementById("dimensionalBarCodeContent").style.display = "block";
            document.getElementById("dimensionalBarCode").style.background = "url('common/images/loginPC/close-2-dimensional-bar-code.png')  -2px 2px no-repeat"
        }
    });

    if (window.localStorage) {
        window.localStorage.setItem("photoUrl", "pc/images/menu/u32.png");
        convertImgToBase64(window.localStorage.getItem("photoUrl"), function (base64) {
            window.localStorage.setItem("myPhoto", base64);
        });
    }
}