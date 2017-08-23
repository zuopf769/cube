UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AccountSafetyController = function () { };
UOrderApp.pages.AccountSafetyController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
        if (data.code != 200) {
            myApp.toast('获取用户信息失败！', 'error').show(true);
            return;
        }
        context.userInfo = data.data;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);
    });
};
UOrderApp.pages.AccountSafetyController.prototype.pageInit = function (page) {
    //退出登录
    $$("#btnLoginOut").on("click", function () {
        cb.rest.getJSON('mlogout', function (data) {
            var dataObj = data;
            if (dataObj.code == 200) {
                $$('#view-1').trigger('show');
                localStorage.removeItem("uptoken");
                cb.rest.appContext.token = null;
                cb.cache.clear();
                myApp.loginScreen();
            }
            else {
                myApp.alert(dataObj.message, "提示信息");
            }
        });
    });
};
