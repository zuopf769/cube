var path = require("path");
var cb = require("../routes/config.js");

var rootPath = path.dirname(path.dirname(__dirname));
console.log("__dirname:" + __dirname);
console.log("rootPath:" + rootPath);

var runner = require("./TemplateEngineRunner.js");
runner.initTemplateEngine(rootPath);

var loginData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": {
            "token": "c3be179b08ca4bdba43083fe6500d778",
            "loginDate": "2015-02-15",
            "userID": "1001A410000000000005",
            "userCode": "u3",
            "lang": "",
            "accountCode": "develop",
            "dataSourceName": "design"
        },
        "fail": null
    },
    "tempResultData": null
};
var uriPathName = "/apps/u8/Dispatchlist";
var token = loginData.data.success.token;
var userInfo = loginData.data.success;

runner.execTemplateEngine(uriPathName, token, userInfo, null,function (data) {
    if (data.error) {
        console.log("error: " + data.error);
        console.log("stackTrace: " + data.stackTrace);
    } else {
        console.log("------uriPathName------" + uriPathName + "生成成功");
    }
}, "list", "L", cb.webserver.UseMockData, cb.webserver.JudgeByPath);