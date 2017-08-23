UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AddressListPageController = function () {
    this.addressTplFunc = Template7.compile($$('#AddressListTemplate').html());
};
UOrderApp.pages.AddressListPageController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (context.source)
        this.dataType = context.source;
    next(content);
};
UOrderApp.pages.AddressListPageController.prototype.pageInit = function (page) {
    var self = this;

    $$(document).on('pageAfterBack', '.page[data-page="addrNewPage"]', function (e) {
        self.loadData();
    });

    //编辑状态切换
    $$('div[data-page="addrListPage"] .btn-addressManage').on('click', function (e) {
        if ($$(this).attr('data-Type') == 'edit') {
            $$('#addressContainer .addr-content li').children('.addr-operate').show();
            $$('#addressContainer .addr-content li').find('.item-media.addr-edit').hide();
            $$(this).find('a').html('完成');
            $$(this).attr('data-Type', 'sumit');
        }
        else {
            $$('#addressContainer .addr-content li').children('.addr-operate').hide();
            $$('#addressContainer .addr-content li').find('.item-media.addr-edit').show();
            $$(this).find('a').html('管理');
            $$(this).attr('data-Type', 'edit');
        }
    });
    self.loadData();
};

UOrderApp.pages.AddressListPageController.prototype.loadData = function () {
    var self = this;

    //加载地址列表
    cb.rest.getJSON('ma/Agents/getAgentShipToAddresses', function (data) {
        if (data.code != 200) {
            myApp.toast('获取地址信息列表失败', 'error').show(true);
            return;
        }
        var context = {
            addressLists: data.data,
            selectModel: self.dataType ? true : false
        };
        $$('#addressContainer').html(self.addressTplFunc(context));

        //逻辑操作按钮功能组
        $$('#addressContainer .addr-content .addr-operate').find('.operate-btn-row').on('click', function () {
            var aid = $$(this).attr('data-addid');
            var type = $$(this).attr('data-type');
            var addressDetail = {};
            for (var i = 0; i < context.addressLists.length; i++) {
                if (context.addressLists[i].id == aid)
                    addressDetail = context.addressLists[i];
            }
            switch (type) {
                case "setDefault":
                    addressDetail.bDefault = true;
                    cb.rest.postData('mc/Agents/modifyShipToAddress', { address: addressDetail }, function (data) {
                        var dataObj = JSON.parse(data);
                        if (dataObj.code == 200 && dataObj.data) {
                            myApp.toast('修改成功', 'success').show(true); //✕✕✓
                            // 返回地址页面
                            myApp.mainView.router.refreshPage();
                            $$('div[data-page="addrListPage"] .btn-addressManage').trigger('click');
                        }
                        else {
                            myApp.toast(dataObj.message, 'error').show(true); //✕✓
                        }
                    });
                    break;
                case "edit":
                    myApp.mainView.router.loadPage({
                        url: 'pages/addr-new.html?newAddress=false', query: addressDetail
                    });
                    break;
                case "del":
                    myApp.confirm('确定要删除此条地址信息吗？', '提示信息', function () {
                        cb.rest.postData('mc/Agents/deleteShipToAddress', { id: aid }, function (data) {
                            if (typeof data == 'string')
                                data = JSON.parse(data);
                            if (data.code != 200) {
                                myApp.toast(data.message, 'error').show(true);
                                return;
                            }
                            myApp.toast('删除地址信息成功！', 'success').show(true);
                            myApp.mainView.router.refreshPage();
                            $$('div[data-page="addrListPage"] .btn-addressManage').trigger('click');
                        });
                    });
                    break;
            }
        });
        if (context.selectModel) {
            $$('#addressContainer').find('li').on('click', function () {
                if ($$('div[data-page="addrListPage"] .btn-addressManage').attr('data-Type') == 'edit') {
                    var addId = $$(this).find('label').attr('data-addid');
                    var backData = context.addressLists.filter(function (item) {
                        return item.id == addId;
                    });
                    var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
                    $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = backData[0];
                    myApp.mainView.router.back({
                        query: backData[0]
                    });
                }
            });
        }
    });
};
