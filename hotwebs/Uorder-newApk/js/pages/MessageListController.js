UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.MessageListController = function () { };
UOrderApp.pages.MessageListController.prototype.preprocess = function (content, url, next) {
    cb.rest.getJSON('ma/Bulletins/getBulletinsForCommon', function (data) {
        if (data.code != 200) {
            myApp.toast('获取最新消息失败！', 'error').show(true);
            return;
        }
        var message = {
            orderMsg: new Object(),
            paymentMsg: new Object()
        };

        if (data.data.bulletins) {
            for (var i = 0; i < data.data.bulletins.length; i++) {
                var curr = data.data.bulletins[i];
                if (curr.cVoucherType == "ORDER")
                    message.orderMsg = curr;
                else if (curr.cVoucherType == "PAYMENT")
                    message.paymentMsg = curr;
            }
        }
        var template = Template7.compile(content);
        var resultContent = template(message);
        next(resultContent);
    });
};
