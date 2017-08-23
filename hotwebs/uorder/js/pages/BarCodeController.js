UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.barCodeController = function () { };
UOrderApp.pages.barCodeController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.barCodeController.prototype.pageInit = function (page) {
    var ws = null, wo = null;
    var scan = null;

    function plusReady() {
        if (ws || !window.plus) {
            return;
        }
        // 获取窗口对象
        ws = plus.webview.currentWebview();
        wo = ws.opener();
        // 开始扫描
        ws.addEventListener('show', function () {
            scan = new plus.barcode.Barcode('bc_scan');
            scan.onmarked = onmarked;
            scan.start();
        });
        // 显示页面并关闭等待框
        ws.show("pop-in");
    };
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener("plusready", plusReady, false);
    }
    // 二维码扫描成功
    function onmarked(type, result, file) {
        switch (type) {
            case plus.barcode.QR:
                type = "QR";
                break;
            case plus.barcode.EAN13:
                type = "EAN13";
                break;
            case plus.barcode.EAN8:
                type = "EAN8";
                break;
            default:
                type = "其它";
                break;
        }
        result = result.replace(/\n/g, '');
        alert(result);
    }
    // 从相册中选择二维码图片
    function scanPicture() {
        plus.gallery.pick(function (path) {
            plus.barcode.scan(path, onmarked, function (error) {
                plus.nativeUI.alert("无法识别此图片");
            });
        }, function (err) {
            plus.nativeUI.alert("获取失败: " + err.message);
        });
    }
};