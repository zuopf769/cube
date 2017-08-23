UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.FeedbackController = function () { };
UOrderApp.pages.FeedbackController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.FeedbackController.prototype.pageInit = function (page) {
    $$("#btnSelectFile").on("click", function () {
        if (window.plus) {
            plus.gallery.pick(function (p) {
                appendFile(p);
            });
        }
        else {
            myApp.toast("请在APP中使用该功能!", 'error').show(true);
        }
    });
    var files = [];

    //产生一个随机数
    function getUid() {
        return Math.floor(Math.random() * 100000000 + 10000000).toString();
    }

    // 添加文件
    var index = 1;
    function appendFile(p) {
        var fe = document.getElementById("files");
        var li = document.createElement("li");
        var n = p.substr(p.lastIndexOf('/') + 1);
        li.innerText = n;
        fe.appendChild(li);
        files.push({ name: "uploadkey" + index, path: p });
        index++;

        //outSet("开始上传：")
        var wt = plus.nativeUI.showWaiting();
        var task = plus.uploader.createUpload("FileUpload/Upload",
            { method: "POST" },
            function (t, status) { //上传完成
                wt.close();
                if (status == 200) {
                    //outLine("上传成功：" + t.responseText);
                    //plus.storage.setItem("uploader", t.responseText);
                    //var w = plus.webview.create("uploader_ret.html", "uploader_ret.html", { scrollIndicator: 'none', scalable: false });
                    //w.addEventListener("loaded", function () {
                    //    wt.close();
                    //    w.show("slide-in-right", 300);
                    //}, false);
                } else {
                    //outLine("上传失败：" + status);
                }
            }
        );
        task.addData("folderName", "feedbackFiles+");
        task.addData("uid", getUid());
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            task.addFile(f.path, { key: f.name });
        }
        task.start();
    }
};