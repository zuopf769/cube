UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.SearchPageController = function () { };
UOrderApp.pages.SearchPageController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.SearchPageController.prototype.pageInit = function (page) {
    $$("div[data-page=searchPage] .search-product").on("keypress", function ($event) {
        if ($event.which == 13) {
            var keyword = $$("#searchPage_keyword").val();
            keyword = keyword.replace(/(^\s*)|(\s*$)/g, "")
            if (keyword) {
                myApp.mainView.router.loadPage({
                    url: 'pages/products.html?keyword=' + keyword + "&dataType=searchProduct"
                });
            }
        }
    });

    var points = ["。", "，", "？", "！"];
    $$("div[data-page=searchPage] .icon-voice-gray").on("click", function () {
        var options = {
            engine: "iFly"
        };
        var txtSearch = document.querySelector("#searchPage_keyword");
        plus.speech.startRecognize(options, function (s) {
            var result = "";
            if (s) {
                for (var i = 0; i < s.length; i++) {
                    var curr = s[i];
                    if (curr) {
                        var lastChart = curr.substr(curr.length - 1);
                        var firstChart = curr.substr(0, 1);
                        if (points.indexOf(lastChart) > -1) {
                            result += curr.substr(0, curr.length - 1);
                        }
                        else if (points.indexOf(firstChart) > -1) {
                            result += curr.substr(1);
                        }
                        else {
                            result += curr;
                        }
                    }
                }
            }

            txtSearch.value += result;
            txtSearch.focus()
        }, function (e) {
            plus.nativeUI.toast("语言识别失败了！", {
                duration: "long"
            });
        });
    });
};