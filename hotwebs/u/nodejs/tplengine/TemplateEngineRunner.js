var path = require("path");
var fs = require("fs");
var connect = require("./ServerConnect.js");
var tplengine = require("./TemplateEngine.js");
var mockData = require("../mockdata/MockData.js");

var _rootPath;
var _routeCache = {};

var initTemplateEngine = function (rootPath) {
    tplengine(rootPath);
    _rootPath = rootPath;
};

var execTemplateEngine = function (uriPathName, token, userInfo, inputQueryString, callback, displayMode, size, useMockData, judgeByPath) {
    var pathItems = uriPathName.split("/");
    if (pathItems.length < 4) return;
    var moduleItems = [];
    for (var i = 2; i < pathItems.length - 1; i++) {
        moduleItems.push(pathItems[i]);
    }
    var moduleName = moduleItems.join("\\");
    var accountCode = userInfo["accountCode"];
    var userCode = userInfo["userCode"];
    var appName = pathItems[pathItems.length - 1] + "App";
    displayMode = displayMode || "card";
    size = size || "L";
    if (inputQueryString && inputQueryString.tplName && inputQueryString.name) {
        executeInner(moduleName, accountCode, userCode, appName, inputQueryString.tplName, inputQueryString.name, size, judgeByPath, token, callback);
    } else {
        connect.getTemplate({ moduleName: moduleName, appName: appName, modeName: displayMode, token: token }, function (result, stackTrace) {
            if (!result || !result.data || !result.data.success) {
                if (!useMockData) {
                    callback.call(this, { "error": result.error, "stackTrace": stackTrace });
                    return;
                }
                result = mockData.getTemplateData(displayMode);
            }
            if (!result.data.success.length) {
                if (!useMockData) {
                    callback.call(this, { "error": "下面服务未正确返回模板信息", "stackTrace": stackTrace });
                    return;
                }
                result = mockData.getTemplateData(displayMode);
            }
            var defaultTpl = result.data.success[0];
            if (!defaultTpl.tplName || !defaultTpl.name) return;
            executeInner(moduleName, accountCode, userCode, appName, defaultTpl.tplName, defaultTpl.name, size, judgeByPath, token, callback);
        });
    }
};

var executeInner = function (moduleName, accountCode, userCode, appName, tplName, name, size, judgeByPath, token, callback) {
    var viewSuffix = "." + tplName + "." + name;
    var vmSuffix = "." + tplName + ".VM";
    var viewPath = path.join("apps", moduleName, accountCode, userCode, appName + viewSuffix + "_" + size + ".html");
    var pathName = path.join(_rootPath, viewPath);
    console.log(pathName);
    fs.exists(pathName, function (exists) {
        if (exists && (_routeCache[viewPath] || judgeByPath)) {
            fs.readFile(pathName, "utf-8", function (err, data) {
                callback.call(this, data);
            });
        }
        else {
            var baseData = {
                token: token,
                rootPath: _rootPath,
                metaDataViewPath: path.join("model", moduleName, appName + viewSuffix + "_" + size + ".xml"),
                metaDataVMPath: path.join("model", moduleName, appName + vmSuffix + ".xml"),
                outputViewPath: viewPath,
                outputVMPath: path.join("apps", moduleName, accountCode, userCode, appName + viewSuffix + "_" + size + ".js"),
                outputVMExtendPath: path.join("apps", moduleName, appName + vmSuffix + "_Extend.js")
            };
            tplengine(baseData, function (data) {
                callback.call(this, data);
                _routeCache[viewPath] = true;
            });
        }
    });
};

var execTemplateEngine1 = function (uriPathName, token, inputQueryString, callback, displayMode, size) {
    var pathItems = uriPathName.split("/");
    if (pathItems.length < 5) return;
    readFileDirectly(pathItems, callback, displayMode, size);
    //    if (pathItems.length == 5 && pathItems[4] == "Refer") {
    //        connect.getReferType({ token: token, refCode: inputQueryString && inputQueryString.refCode }, function (result) {
    //            if (result && result.data && result.data.success && result.data.success.refType == 2) {
    //                pathItems[4] = "Refer";
    //            } else {
    //                pathItems[4] = "ReferTable";
    //            }
    //            readFileDirectly(pathItems, callback, displayMode, size);
    //        });
    //    } else {
    //        readFileDirectly(pathItems, callback, displayMode, size);
    //    }
};

var readFileDirectly = function (pathItems, callback, displayMode, size) {
    var moduleItems = [];
    for (var i = 2; i < pathItems.length - 1; i++) {
        moduleItems.push(pathItems[i]);
    }
    var moduleName = moduleItems.join("\\");
    var appName = pathItems[pathItems.length - 1];
    displayMode = displayMode || "card";
    var outputSuffix;
    switch (displayMode) {
        case "list":
            outputSuffix = "ListApp";
            break;
        case "card":
            outputSuffix = "App";
            break;
    }
    size = size || "L";
    var viewPath = path.join("apps", moduleName, appName + outputSuffix + "_" + size + ".html");
    var pathName = path.join(_rootPath, viewPath);
    console.log(pathName);
    fs.exists(pathName, function (exists) {
        if (exists) {
            fs.readFile(pathName, "utf-8", function (err, data) {
                callback.call(this, data);
            });
        } else {
            var metaDataViewPath = path.join("model", moduleName, appName + outputSuffix + "View_" + size + ".xml");
            fs.exists(path.join(_rootPath, metaDataViewPath), function (metaExists) {
                if (metaExists) {
                    var baseData = {
                        rootPath: _rootPath,
                        metaDataViewPath: metaDataViewPath,
                        metaDataVMPath: path.join("model", moduleName, appName + outputSuffix + "VM.xml"),
                        outputViewPath: viewPath,
                        outputVMPath: path.join("apps", moduleName, appName + outputSuffix + "_" + size + ".js"),
                        outputVMExtendPath: path.join("apps", moduleName, appName + outputSuffix + "_Extend.js")
                    };
                    tplengine(baseData, function (data) {
                        callback.call(this, data);
                    });
                } else {
                    callback.call(this, { "error": "读取文件失败", "stackTrace": pathName });
                }
            });
        }
    });
};

var clearTemplateEngine = function () {
    _routeCache = {};
};

if (typeof exports !== "undefined") {
    module.exports = {
        initTemplateEngine: initTemplateEngine,
        execTemplateEngine: execTemplateEngine,
        execTemplateEngine1: execTemplateEngine1,
        clearTemplateEngine: clearTemplateEngine
    };
};