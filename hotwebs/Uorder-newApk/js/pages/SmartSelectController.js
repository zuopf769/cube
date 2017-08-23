UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.SmartSelectController = function () {
    this.smartSelectTplFunc = Template7.compile($$('#smartSelectItemTpl').html());
};
UOrderApp.pages.SmartSelectController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.SmartSelectController.prototype.pageInit = function (page) {
    var self = this, indexCount = 0, value = new Array(), name = new Array();

    if (page.query) {
        var fieldValue = page.query.fieldValue;
        var fieldName = page.query.fieldName;
        var phoneImg = page.query.phoneImg;
        //设置navbar title
        $$('div[data-page="SmartSelectListPage"]').children('.navbar').find('.center.nav-title-container').html(page.query.pageTitle);

        var loadData = function (url, param) {
            cb.rest.getJSON(url, param, function (data) {
                if (data.code != 200) {
                    myApp.toast('获取数据失败', 'error').show(true);
                    return;
                }
                var arrayList = new Array();
                for (var index = 0; index < data.data.length; index++) {
                    var item = data.data[index];
                    var o = {
                        value: item[fieldValue],
                        name: item[fieldName]
                    };
                    if (phoneImg)
                        o.cPhoneImage = data.data[index].cPhoneImage ? (cb.rest.appContext.serviceUrl + data.data[index].cPhoneImage) : 'img/icon/default-bank.png';

                    if (page.query.selectValue && page.query.selectValue == item.id)
                        o.checked = true;

                    arrayList.push(o);
                }
                //渲染模板
                $$('div[data-page="SmartSelectListPage"] .smartSelect-Container').html(self.smartSelectTplFunc({ data: arrayList }));
                //注册事件
                $$('div[data-page="SmartSelectListPage"] .smartSelect-Container').find('li').on('click', function () {
                    if (page.query.backOnSelect) {
                        var backData = {
                            container: page.query.container,
                            value: $$(this).attr('data-value'),
                            name: $$(this).attr('data-name')
                        };

                        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
                        $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = backData;
                        myApp.mainView.router.back({
                            query: backData
                        });
                    }
                    else {
                        value.push($$(this).attr('data-value'));
                        name.push($$(this).attr('data-name'));

                        if (indexCount == page.query.serverUrl.length - 1) {
                            var backData = {
                                container: page.query.container,
                                value: value,
                                name: '中国 ' + name.join().replace(/,/g, ' ')
                            };

                            var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
                            $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = backData;
                            myApp.mainView.router.back({
                                query: backData
                            });
                        }
                        else {
                            indexCount++;
                            loadData(page.query.serverUrl[indexCount], { parentId: $$(this).attr('data-value') });
                        }
                    }
                });
            });
        };
        if (!$$.isArray(page.query.serverUrl))
            loadData(page.query.serverUrl);
        else
            loadData(page.query.serverUrl[indexCount]);
    }
};