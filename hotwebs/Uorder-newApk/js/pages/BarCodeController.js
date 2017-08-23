UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.barCodeController = function () { };
UOrderApp.pages.barCodeController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.barCodeController.prototype.pageInit = function (page) {
    $$("#scan_cancel").on("click", function () {
        scan.cancel();
        window.close();
        myApp.mainView.router.back()
    });
    // 从相册中选择二维码图片
    $$("#scan_album").on("click", function () {
        plus.gallery.pick(function (path) {
            plus.barcode.scan(path, onmarked, function (error) {
                myApp.toast("无法识别此图片", 'error').show(true);
            });
        }, function (err) {
            myApp.toast("获取失败: " + err.message, 'error').show(true);
        });
    });

    var scanWin = clicked("pages/barCode.html");
};