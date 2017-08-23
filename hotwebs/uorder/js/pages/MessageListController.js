UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.MessageListController = function () { };
UOrderApp.pages.MessageListController.prototype.preprocess = function (content, url, next) {
    cb.rest.getJSON('ma/Bulletins/getBulletinsForCommon', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取最新消息失败！', 'error').show(true);
            return;
        }
        var message = {
            orderMsg: new Object(),
            paymentMsg: new Object()
        };
        if (data.data.bulletins.length) {
            var arrayMsg = data.data.bulletins;
            for (var i = 0; i < arrayMsg.length; i++) {
                if (arrayMsg[i].cVoucherType == "ORDER")
                    message.orderMsg = arrayMsg[i];
                else if (arrayMsg[i].cVoucherType == "PAYMENT")
                    message.paymentMsg = arrayMsg[i];
            }
        }
        var template = Template7.compile(content);
        var resultContent = template(message);
        next(resultContent);
    });
};
