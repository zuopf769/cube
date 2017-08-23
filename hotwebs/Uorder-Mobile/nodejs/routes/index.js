var url = require("url");
var path = require('path');
var fs = require("fs");
var http = require("http");
var bufferhelper = require('bufferhelper');
var cb = require("./config");
var querystring = require('qs');

var express = require('express');
var router = express.Router();

var rootPath = path.dirname(path.dirname( __dirname));

router.all(/\photo\//, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\ma\//, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\mc/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\mlogin/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\BaseData/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\Enums/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});
router.all(/\Security/, function (req, res) {
    Application.doService(req, res, req.method.toLocaleLowerCase() === "get" ? undefined : req.body);
});

router.get("/", function (req, res, next) {
    var pathName = path.join(rootPath, "index.html");
    Application.render(res, pathName);
});
router.get("/reg", function (req, res, next) {
    var pathName = path.join(rootPath, "register.html");
    Application.render(res, pathName);
});
router.get("/demo", function (req, res, next) {
    var pathName = path.join(rootPath, "demo.html");
    Application.render(res, pathName);
});

router.all(/\//, function (req, res, next) {
    var uri = url.parse(req.url);
    var urlPath = uri && uri.path && uri.pathname;
    if (!urlPath) return;
    var isMatch = urlPath && urlPath.match(new RegExp("/"));
    if (isMatch) {
        var pathName = rootPath + urlPath;
        Application.render(res, pathName);
    }
});

var Application = {
    render: function (response, pathname) {
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
    doService: function (request, response, bodyData, callback) {
        var urlPath = url.parse(request.url).path;
        var uapServiceUrl = /(\w+):\/\/([^/:]+)(:\d*)/.exec(cb.webserver.UapServiceBaseUrl)[0] + urlPath;

        ServiceProxy.init({ url: uapServiceUrl, request: request, response: response, bodyData: bodyData, callback: callback });
        ServiceProxy.doRequest(request.method);
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
    doRequest: function (method) {
        var context = this._context;
        var options = url.parse(context.url);
        options.method = method || "GET";
        options.timeout = 3000;
        if (context.bodyData)
            options.method = "POST";
        options.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        };
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
            var data = querystring.stringify(context.bodyData);
            proxyRequest.write(data);
        }
        proxyRequest.end();
    }
};


module.exports = router;
