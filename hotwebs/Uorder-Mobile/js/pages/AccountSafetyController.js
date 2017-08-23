UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AccountSafetyController = function () { };
UOrderApp.pages.AccountSafetyController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
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
