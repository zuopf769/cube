var url = require("url");
var path = require('path');
var fs = require("fs");
var http = require("http");
var bufferhelper = require('bufferhelper');
var zlib = require("zlib");

var cb = require("./config");

var express = require('express');
var router = express.Router();

var rootPath = path.dirname(path.dirname(__dirname));
console.log("__dirname:" + __dirname);
console.log("rootPath:" + rootPath);

var runner = require("../tplengine/TemplateEngineRunner.js");
runner.initTemplateEngine(rootPath);

var mockData = require("../mockdata/MockData.js");

//用户数据缓存
var userCache = {};

// 取账套信息
router.get("/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/getAccount2", function (req, res) {
    var isSys = new cb.queryString(url.parse(req.url).path).get("isSys");
    Application.doService(req, res, null, function (resData) {
        if (resData.error) {
            if (cb.webserver.UseMockData) {
                Application.renderJson(res, mockData.getAccountData(isSys));
            } else {
                Application.renderJson(res, { "error": resData.error });
            }
        } else {
            res.end(resData);
        }
    });
});

// 登录服务
router.post("/upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/login", function (req, res) {
    var isSys = new cb.queryString(url.parse(req.url).path).get("isSys");
    Application.doService(req, res, req.body, function (resData, contentEncoding) {
        if (resData.error) {
            if (cb.webserver.UseMockData) {
                Application.renderJson(res, userInfo);
                var userInfo = mockData.getLoginData(isSys);
                userInfoCache(userInfo);
            } else {
                Application.renderJson(res, { "error": resData.error });
            }
        } else {
            res.end(resData);
            if (contentEncoding === "gzip") {
                zlib.unzip(resData, function () {
                    var userInfo = JSON.parse(arguments[1]);
                    userInfoCache(userInfo);
                });
            } else {
                var userInfo = JSON.parse(resData);
                userInfoCache(userInfo);
            }
        }
    });
});

var userInfoCache = function (userInfo) {
    if (userInfo && userInfo.data && userInfo.data.success && userInfo.data.success.token) {
        userCache[userInfo.data.success.token] = userInfo.data.success;
        console.log("缓存用户信息成功");
    }
};

// 菜单服务
router.get("/u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService", function (req, res) {
    var isSys = new cb.queryString(url.parse(req.url).path).get("isSys");
    Application.doService(req, res, null, function (resData) {
        if (resData.error) {
            if (cb.webserver.UseMockData) {
                Application.renderJson(res, mockData.getMenuData(isSys));
            } else {
                Application.renderJson(res, { "error": resData.error });
            }
        } else {
            res.end(resData);
        }
    });
});

router.all(/apps\/reinit/, function (req, res) {
    runner.initTemplateEngine(rootPath);
    runner.clearTemplateEngine();
    var info = "重新初始化成功";
    var currentDateTimeStr = new Date().toLocaleString();
    Application.renderText(res, { "日志": info, "时间": currentDateTimeStr });
    console.log(info + " " + currentDateTimeStr);
});

router.all(/apps\/renew/, function (req, res) {
    runner.clearTemplateEngine();
    var uri = url.parse(req.url);
    var queryString = new cb.queryString(uri.path);
    var token = queryString.get("token");
    var info = "缓存清除成功";
    var currentDateTimeStr = new Date().toLocaleString();
    if (!token) {
        Application.renderText(res, { "日志": info, "时间": currentDateTimeStr });
    } else {
        Application.renderJson(res, { "success": true });
    }
    console.log(info + " " + currentDateTimeStr);
});

router.all(/page.jsp/, function (req, res) {
    var uri = url.parse(req.url);
    var queryString = new cb.queryString(uri.path);
    var token = queryString.get("token");
    if (!token) {
        Application.renderText(res, "token为空");
        return;
    }
    //var userInfo = userCache[token] || (cb.webserver.UseMockData == true && mockData.getLoginData().data.success);
    var userInfo = userCache[token];
    if (!userInfo) {
        //Application.renderText(res, "token失效");
        Application.renderJson(res, mockData.getInvalidTokenJson());
        return;
    }
    var app = queryString.get("app");
    var isCommon = app.substr(0, 6) == "common" ? true : false;
    var index = app.lastIndexOf("ListApp");
    var mode;
    if (index > 0) {
        app = app.substr(0, index);
        mode = "list";
    }
    else {
        index = app.lastIndexOf("App");
        if (index > 0) {
            app = app.substr(0, index);
            mode = "card";
        }
        else {
            Application.renderText(res, "路由问题");
            return;
        }
    }
    var items = app.split(".");
    if (items.length < 2) {
        Application.renderText(res, "app问题");
        return;
    }
    var inputQueryString = {};
    for (var attr in queryString.p) {
        if (attr === "app" || attr === "token" || attr === "size") continue;
        inputQueryString[attr] = queryString.p[attr];
    }
    var uriPathName = "/apps/" + items.join("/");
    if (isCommon) {
        runner.execTemplateEngine1(uriPathName, token, inputQueryString, function (data) {
            if (data.error) {
                Application.renderText(res, data);
            } else {
                //res.writeHead(200, cb.webserver.headerConfig[".html"]);
                res.end(data);
            }
        }, mode, queryString.get("size"));
    } else {
        runner.execTemplateEngine(uriPathName, token, userInfo, inputQueryString, function (data) {
            if (data.error) {
                Application.renderText(res, data);
            } else {
                //res.writeHead(200, cb.webserver.headerConfig[".html"]);
                res.end(data);
            }
        }, mode, queryString.get("size"), cb.webserver.UseMockData, cb.webserver.JudgeByPath);
    }
});

// 第三方系统接入
router.all(/login.jsp/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});

router.all(/upservices/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});

router.all(/u8services/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});

router.all(/classes/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});

/* GET home page. */
router.get("/", function (req, res, next) {
    var pathName = path.join(rootPath, "index.html");
    Application.render(res, pathName);
});

router.get("/home", function (req, res, next) {
    var pathName = path.join(rootPath, "index.html");
    Application.render(res, pathName);
});

router.get("*.html", function (req, res, next) {
    Application.renderPage(req, res);
});

var _refererList = [];

router.get("*.jsp", function (req, res, next) {
    _refererList.push(req.url);
    Application.doService1(req, res);
});

router.all(/\//, function (req, res, next) {
    var referer = req.headers.referer;
    if (!referer || referer.indexOf("login.jsp") != -1) {
        Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
        return;
    }
    for (var i = 0, len = _refererList.length; i < len; i++) {
        var item = _refererList[i];
        if (referer.indexOf(item) != -1) {
            Application.doService(req, res);
            return;
        }
    }
    var uri = url.parse(req.url);
    var urlPath = uri && uri.path && uri.pathname.toLocaleLowerCase();
    if (!urlPath) return;
    var isMatch = urlPath && urlPath.match(new RegExp("/"));
    if (isMatch) {
        var pathName = rootPath + urlPath;
        Application.render(res, pathName);
    }
});

var Application = {
    renderPage: function (request, response, bodyData) {

        var pathname = rootPath + url.parse(request.url).pathname;

        if (path.extname(pathname) == "")
            pathname += "/";
        if (pathname.charAt(pathname.length - 1) == "/")
            pathname += "login.html";

        console.log("renderPage:" + pathname);


        Application.render(response, pathname);
    },
    doService: function (request, response, bodyData, callback) {
        var urlPath = url.parse(request.url).path;
        var uapServiceUrl = /(\w+):\/\/([^/:]+)(:\d*)/.exec(cb.webserver.UapServiceBaseUrl)[0] + urlPath;
        //uapServiceUrl = "http://127.0.0.1:8080/mobile/test.json";

        ServiceProxy.init({ url: uapServiceUrl, request: request, response: response, bodyData: bodyData, callback: callback });
        ServiceProxy.doRequest(request.method);
    },
    doService1: function (request, response, bodyData, callback) {
        var urlPath = url.parse(request.url).path;
        var uapServiceUrl = /(\w+):\/\/([^/:]+)(:\d*)/.exec(cb.webserver.UapServiceBaseUrl)[0] + "/u" + urlPath;
        ServiceProxy.init({ url: uapServiceUrl, request: request, response: response, bodyData: bodyData, callback: callback });
        ServiceProxy.doRequest(request.method);
    },
    render: function (response, pathname) {

        console.log("pathname:" + pathname);

        fs.exists(pathname, function (exists) {
            if (exists) {
                var extName = path.extname(pathname);
                response.writeHead(200, (cb.webserver.headerConfig[extName] || cb.webserver.headerConfig["default"]));
                fs.readFile(pathname, function (err, data) {
                    response.end(data);
                });
            }
            else
                Application.errorPage(response, pathname);
        });
    },
    renderText: function (response, text, statusCode) {
        console.log("response text:" + text);
        //statusCode = statusCode || 200;
        //response.writeHead(statusCode, cb.webserver.headerConfig[".html"]);
        var html = "<!doctype html><html><head><meta charset='utf-8'/></head><body>"
        if (typeof text == "object") {
            for (var attr in text) {
                html += "<h1>" + attr + "</h1><h4>" + text[attr] + "</h4>";
            }
        }
        else {
            html += "<h1>" + text + "</h1>";
        }
        html += "</body></html>";
        response.end(html);
    },
    renderJson: function (response, obj) {
        response.setHeader("content-type", "application/json;charset=UTF-8");
        response.end(JSON.stringify(obj));
    },
    errorPage: function (response, pathname) {
        console.log("response pathname:" + pathname);
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end("<h1>404 Not Found</h1>");
    }
};


var DynamicPage = {
    //    getRemotePage: function (request, response) {
    //        var uri = url.parse(request.url);
    //        var urlPath = uri.path;
    //        //var query = uri.query;

    //        ServiceProxy.init({ url: cb.webserver.WebServerUrl + urlPath, request: request, response: response });
    //        ServiceProxy.doRequest(request.method);
    //    },
    getPage: function (request, response) {
        var uri = url.parse(request.url);
        var urlPath = uri.path;
        var queryStr = new cb.queryString(urlPath);
        if (queryStr) {
            var app = queryStr.get("app");
            var size = queryStr.get("size") || "M";
            if (app) {
                var strs = app.split(".");
                if (strs && strs.length >= 2) {
                    //var module = strs[0];
                    //var application = strs[1];
                    //var pathname = rootPath + uri.pathname.replace("/page.jsp", "/apps/" + module + "/" + application + "_" + size + ".html");
                    var appPath = strs.join("/"); //֧�ֶ��·�� 
                    var pathname = rootPath + uri.pathname.replace("/page.jsp", "/apps/" + appPath + "_" + size + ".html");
                    console.log(pathname);
                    Application.render(response, pathname);
                }
            }
        }
    },
    getPageJson: function (request, response) {
        response.writeHead(200, cb.webserver.headerConfig["json"]);
        //response.end("json");
        var uri = url.parse(request.url);
        var urlPath = uri.path;

        ServiceProxy.init({ url: urlPath, request: request, response: response });
        ServiceProxy.doRequest(request.method);
    }
    //    getPageJs: function (request, response) {
    //        var urlPath = url.parse(request.url).path;
    //        ServiceProxy.init({ url: cb.webserver.WebServerUrl + urlPath, request: request, response: response });
    //        ServiceProxy.doRequest(request.method);
    //    },
    //    getRemoteJs: function (request, response) {
    //        var urlPath = url.parse(request.url).path;
    //        ServiceProxy.init({ url: cb.webserver.WebServerUrl + urlPath, request: request, response: response });
    //        ServiceProxy.doRequest(request.method);
    //    }
};

var ServiceProxy = {
    //contest:{url:"",request:null,response:null,method:"GET"}
    init: function (context) {
        this._context = context;
        return this;
    },
    get: function () {
        //http.get(context.url, function (proxyResponse) {});
        this.doRequest("GET");
    },

    post: function () {
        this.doRequest("POST");
    },
    doRequest1: function (method) {
        var context = this._context;
        var options = url.parse(context.url);
        options.method = method || "GET";
        options.timeout = 3000;
        if (context.bodyData) {
            options.method = "POST";
            //   options.header= context.request.header;
            //    options.data =context.bodyData;
        }

        console.log("===================== Redirect to U8Service URL begin =====================");
        console.log(options.method + " " + context.url);

        var proxyRequest = http.request(options, function (proxyResponse) {
            proxyResponse.setEncoding('utf8');
            var resData = "";
            proxyResponse.on('data', function (chunk) {
                resData += chunk; //context.response.write(chunk);
            });
            proxyResponse.on('end', function () {
                if (context.callback) {
                    context.callback.call(this, resData);
                } else {
                    context.response.end(resData);
                }
                console.log("U8Service URL return data length:" + resData.length);
                //console.log("U8Service URL return data:" + resData);
                console.log("===================== Redirect to U8Service URL end =====================");
            });
            //context.response.setEncoding('utf8');
            context.response.setHeader("Redirect To U8Service URL ", context.url);
            //context.response.writeHead(proxyResponse.statusCode, proxyResponse.headers);

            console.log("response statusCode: " + proxyResponse.statusCode);
            console.log("response headers: " + JSON.stringify(proxyResponse.headers));
        });
        proxyRequest.on('error', function (e) {
            if (context.callback) {
                context.callback.call(this, { "error": e.message });
            } else {
                context.response.end(e.message);
            }
            console.log("U8Service URL Error:" + e.message);
            //console.log("Redirect to U8Service URL " + options.method + " " + context.url + " Error!");
            console.log("===================== Redirect to U8Service URL error =====================");

        });
        if (this._context.bodyData) {
            var data = JSON.stringify(this._context.bodyData);
            proxyRequest.write(data);
        }

        proxyRequest.end();
    },
    doRequest: function (method) {
        var context = this._context;
        var options = url.parse(context.url);
        options.method = method || "GET";
        options.timeout = 3000;
        if (context.bodyData)
            options.method = "POST";
        console.log("===================== Redirect to UPService URL begin =====================");
        console.log(options.method + " " + context.url);
        var proxyRequest = http.request(options, function (proxyResponse) {
            var bufferHelper = new bufferhelper();
            var contentEncoding = proxyResponse.headers["content-encoding"];
            proxyResponse.on("data", function (chunk) {
                bufferHelper.concat(chunk);
            });
            proxyResponse.on("end", function () {
                var resData = bufferHelper.toBuffer();
                if (context.callback) {
                    context.callback.call(this, resData, contentEncoding);
                } else {
                    context.response.end(resData);
                }
                console.log("UPService URL return data length:" + resData.length);
                console.log("===================== Redirect to UPService URL end =====================");
            });
            var contentType = proxyResponse.headers["content-type"] || "application/json;charset=UTF-8";
            context.response.setHeader("Content-Type", contentType);
            var contentDisposition = proxyResponse.headers["content-disposition"];
            if (contentDisposition)
                context.response.setHeader("Content-Disposition", contentDisposition);
            if (contentEncoding)
                context.response.setHeader("Content-Encoding", contentEncoding);
            context.response.setHeader("Redirect To UPService URL", context.url);
            console.log("response statusCode: " + proxyResponse.statusCode);
            console.log("response headers: " + JSON.stringify(proxyResponse.headers));
        });
        proxyRequest.on("error", function (e) {
            if (context.callback) {
                context.callback.call(this, { "error": e.message });
            } else {
                context.response.end(e.message);
            }
            console.log("UPService URL Error:" + e.message);
            console.log("===================== Redirect to UPService URL error =====================");
        });
        if (context.bodyData) {
            var data = JSON.stringify(context.bodyData);
            proxyRequest.write(data);
        }
        proxyRequest.end();
    }
};

module.exports = router;
