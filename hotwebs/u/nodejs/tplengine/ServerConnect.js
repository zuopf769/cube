var http = require('http');
var url = require('url');
var bufferhelper = require('bufferhelper');
var zlib = require("zlib");
var cb = require("../routes/config.js");

module.exports = {
    getTemplate: function (params, callback) {
        GetTemplate(params, callback);
    },
    getServerData: function (params, callback) {
        Getpermissionfield(params, callback);
    },
    getColums: function (params, callback) {
        GetColums(params, callback);
    },
    getBatchColums: function (params, callback) {
        GetBatchColumns(params, callback);
    },
    getReferType: function (params, callback) {
        GetReferType(params, callback);
    }
};
var proxyConfig = {
    GetTemplate: { url: "/upservices/template.MetaFacadeSrv_Template/Meta/getTemplateViewList", method: "GET" },
    GetField: { url: "/classes/Login/UAP/GetFieldPerm", method: "GET" },
    GetColums: { url: "/classes/General/u8column/QueryColumnByCode", method: "GET" },
    GetBatchColums: { url: "/classes/General/u8column/QueryBatchColumnByCode", method: "POST" },
    GetReferType: { url: "/classes/Ref/UAP/getReferType", method: "POST" }
};

var ServiceProxy = {
    init: function (context) {
        this._context = context;
    },
    doRequest: function (method) {
        var context = this._context;
        var options = url.parse(context.url);
        options.method = method || "GET";
        options.timeout = 3000;
        if (context.bodyData) {
            options.method = "POST";
        }
        console.log("===================== Redirect to UPService URL begin =====================");
        var stackTrace = options.method + " " + context.url;
        console.log(stackTrace);
        var proxyRequest = http.request(options, function (proxyResponse) {
            var bufferHelper = new bufferhelper();
            var contentEncoding = proxyResponse.headers["content-encoding"];
            proxyResponse.on("data", function (chunk) {
                bufferHelper.concat(chunk);
            });
            proxyResponse.on("end", function () {
                var resData = bufferHelper.toBuffer();
                if (resData.length === 0) {
                    if (context.callback)
                        context.callback.call(this, { code: 501, error: "statusCode为" + proxyResponse.statusCode }, stackTrace);
                    console.log("===================== Redirect to UPService URL error =====================");
                } else {
                    if (context.callback) {
                        if (contentEncoding === "gzip") {
                            zlib.unzip(resData, function () {
                                resData = JSON.parse(arguments[1]);
                                context.callback.call(this, resData, stackTrace);
                            });
                        } else {
                            resData = JSON.parse(resData);
                            context.callback.call(this, resData, stackTrace);
                        }
                    }
                    console.log("===================== Redirect to UPService URL end =====================");
                }
            });
        });
        proxyRequest.on('error', function (e) {
            if (context.callback)
                context.callback.call(this, { code: 501, error: e.message }, stackTrace);
            console.log("===================== Redirect to UPService URL error =====================");
        });
        if (this._context.bodyData) {
            var data = JSON.stringify(this._context.bodyData);
            proxyRequest.write(data);
        }
        proxyRequest.end();
    }
};

var doService = function (method, urlPath, bodyData, callback) {
    var uapServiceUrl = /(\w+):\/\/([^/:]+)(:\d*)/.exec(cb.webserver.UapServiceBaseUrl)[0] + urlPath;
    ServiceProxy.init({ url: uapServiceUrl, bodyData: bodyData, callback: callback });
    ServiceProxy.doRequest(method);
};

var GetTemplate = function (params, callback) {
    var urlPath = proxyConfig.GetTemplate.url + "?token="+params.token+"&moduleName=" + params.moduleName + "&appName=" + params.appName + "&modeName=" + params.modeName;
    doService(proxyConfig.GetTemplate.method, urlPath, null, callback);
};

var Getpermissionfield = function (params, callback) {
    var urlPath = proxyConfig.GetField.url + "?token=" + params.token + "&moduleName=" + params.moduleName + "&appName=" + params.appName + "&viewModelName=" + params.viewModelName;
    doService(proxyConfig.GetField.method, urlPath, null, callback);
};

var GetColums = function (params, callback) {
    var urlPath = proxyConfig.GetColums.url + "?token=" + params.token + "&columncode=" + params.listId;
    doService(proxyConfig.GetColums.method, urlPath, null, callback);
};

var GetBatchColumns = function (params,callback) {
    var urlPath = proxyConfig.GetBatchColums.url + "?token=" + params.token;
    doService(proxyConfig.GetBatchColums.method, urlPath, params.value, callback);
};

var GetReferType = function (params, callback) {
    var urlPath = proxyConfig.GetReferType.url + "?token=" + params.token;
    delete params.token;
    doService(proxyConfig.GetReferType.method, urlPath, params, callback);
};