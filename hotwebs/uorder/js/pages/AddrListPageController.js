UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AddrListPageController = function () {
    this.AddresstplFunc = Template7.compile($$('#AddressListTemplate').html());
};
UOrderApp.pages.AddrListPageController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var defaultAdderssIndex = 0;
    var context = $$.parseUrlQuery(url) || {};

    cb.rest.getJSON('ma/Agents/getAgentShipToAddresses', function (data) {
        if (data.code != 200) {
            myApp.toast('获取地址信息列表失败', 'error').show(true);
            return;
        } else {
            // 初始化数据，绑定地址列表
            next(content);
            var context = {};
            context.addressLists = data.data
            $$('#AddressList').html(self.AddresstplFunc(context));
        }

        // 修改地址信息
        $$('.icon.icon-addr-edit').on('click', function (e) {
            var container = $$(this).find('input');
            // 组装地址信息
            var addressDetail = {};
            addressDetail.cReceiver = container[0].value;
            addressDetail.cDistrct = container[1].value;
            addressDetail.cAddress = container[2].value;
            addressDetail.cMobile = container[3].value;
            addressDetail.cTelePhone = container[4].value;
            addressDetail.cZipCode = container[5].value;
            addressDetail.id = container[6].value;
            addressDetail.cRegion = container[7].value;
            myApp.mainView.router.loadPage({
                url: 'pages/addr-new.html?newAddress=false', query: addressDetail
            });
        });

        // 回传地址信息
        if (context.source && context.source == 'order') {
            $$('.addressList .item-inner').on('click', function (e) {
                // 修改默认地址
                var newAddressDatas = data.data;
                // 获得修改地址的索引
                var selectAddress = $$(this).find('input');
                // 将点击的地址设为默认地址，其它改为不是默认地址
                for (var i = 0; i < newAddressDatas.length; i++) {
                    if (i == selectAddress.val()) {
                        newAddressDatas[i].bDefault = true;
                    } else {
                        newAddressDatas[i].bDefault = false;
                    }
                }
                // 从新生成模板
                context.addressLists = newAddressDatas;
                $$('#AddressList').html(self.AddresstplFunc(context));
                // 保存默认地址
                var idParam = {};
                idParam.id = data.data[selectAddress.val()].id;
                cb.rest.postData('mc/Agents/setDefaultShipToAddress', idParam, function (data) {
                    var dataObj = JSON.parse(data);
                    if (dataObj.code == 200 && dataObj.data) {
                    }
                    else {
                        myApp.toast(dataObj.message, 'error').show(true); //✕✓
                    }
                });
                // 向确认订单页面传回地址信息
                var addressParam = {};
                // 收货人
                addressParam.cReceiver = data.data[selectAddress.val()].cReceiver;
                // 手机
                addressParam.cReceiveMobile = data.data[selectAddress.val()].cMobile;
                // 详细地址
                addressParam.cReceiveAddress = data.data[selectAddress.val()].cDistrct + " " + data.data[selectAddress.val()].cAddress + "(" + data.data[selectAddress.val()].cZipCode + ")";
                addressParam.data_type = 'addr';
                var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
                $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = addressParam;
                myApp.mainView.router.back({
                    url: 'pages/confirm-order.html', query: addressParam, force: true
                });
            });
        }
        else {
            $$('.addressList .item-inner').on('click', function () {
                var container = $$(this).parent('.item-content.addressList').find('.icon.icon-addr-edit').find('input');
                // 组装地址信息
                var addressDetail = {};
                addressDetail.cReceiver = container[0].value;
                addressDetail.cDistrct = container[1].value;
                addressDetail.cAddress = container[2].value;
                addressDetail.cMobile = container[3].value;
                addressDetail.cTelePhone = container[4].value;
                addressDetail.cZipCode = container[5].value;
                addressDetail.id = container[6].value;
                addressDetail.cRegion = container[7].value;
                myApp.mainView.router.loadPage({
                    url: 'pages/addr-new.html?newAddress=false', query: addressDetail
                });
            });
        }
    });
};