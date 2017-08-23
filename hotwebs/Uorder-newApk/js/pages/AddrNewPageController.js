UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AddrNewPageControoller = function () { };
UOrderApp.pages.AddrNewPageControoller.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.AddrNewPageControoller.prototype.pageInit = function (page) {
    // 修改进来的进行地址初始化
    if (page.query) {
        // 初始化信息
        if (page.query.bDefault)
            $$('#AddressDetail li.isDefault').addClass('checked');
        myApp.formFromJSON('#AddressDetail', page.query);
    }
    var isNewAddress = $$.parseUrlQuery(page.url);
    if (isNewAddress.newAddress == "true") {
        $$('div[data-page="addrNewPage"] .center').text("新建地址");
        $$("#btnDeleAddr").hide();
    } else {
        $$('div[data-page="addrNewPage"] .center').text("修改地址");
        $$("#btnDeleAddr").show();
    }
    $$('#AddressDetail li.isDefault').on('click', function () {
        $$(this).toggleClass('checked');
    });

    //获取地址信息
    $$('#picker-dependent').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: false,
                pageTitle: "选择地址",
                fieldValue: 'id',
                fieldName: 'shortName',
                serverUrl: ['ma/BaseData/getProvincesWithWordGroup', 'ma/BaseData/getCitysFromProvince', 'ma/BaseData/getDistrictFromCity'],
                container: $$('#picker-dependent')
            }
        });
    });

    //监听基础信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="SmartSelectListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query) {
            page.query.container.data('value', page.query.value).val(page.query.name);
        }
    });

    // 保存和修改地址
    $$('.addrNewPage-address-submit a').on('click', function (e) {
        // 获得地址信息
        var param = myApp.formToJSON('#AddressDetail');
        // 修改地址
        if (isNewAddress.newAddress == "false") {
            // 组装地址参数
            var updateAddressParam = {};
            var address = {};
            address.id = param.id;
            address.cReceiver = param.cReceiver;
            address.cAddress = param.cAddress;
            address.cMobile = param.cMobile;
            address.cTelePhone = param.cTelePhone;
            address.cZipCode = param.cZipCode;
            address.cRegion = param.cRegion;
            address.bDefault = $$('#AddressDetail li.isDefault').hasClass('checked');
            // 将cDistrct字符串分割成省、市、区字段，分别对应cProvince、cCity、cArea字段
            var cDistrctArray = param.cDistrct.split(" ");
            // 字段如 中国 河北省 秦皇岛市 海港区，其中中国是写死的字段，暂时不考虑，为后期扩展用
            address.cProvince = cDistrctArray[1];// 省
            address.cCity = cDistrctArray[2]; // 市
            address.cArea = cDistrctArray[3]; // 区
            updateAddressParam.address = address;
            cb.rest.postData('mc/Agents/modifyShipToAddress', updateAddressParam, function (data) {
                var dataObj = data;
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('修改成功', 'success').show(true); //✕✕✓
                    // 返回地址页面
                    myApp.mainView.router.back();
                }
                else {
                    myApp.toast(dataObj.message, 'error').show(true); //✕✓
                }
            });
        } else {
            // 增加地址
            // 组装地址参数
            var addAddressParam = {};
            var newAddress = {};
            newAddress.cReceiver = param.cReceiver;
            newAddress.cAddress = param.cAddress;
            newAddress.cMobile = param.cMobile;
            newAddress.cTelePhone = param.cTelePhone;
            newAddress.cZipCode = param.cZipCode;
            newAddress.cRegion = param.cRegion;
            // 将cDistrct字符串分割成省、市、区字段，分别对应cProvince、cCity、cArea字段
            var cDistrctArray = param.cDistrct.split(" ");
            // 字段如 中国 河北省 秦皇岛市 海港区，其中中国是写死的字段，暂时不考虑，为后期扩展用
            newAddress.cProvince = cDistrctArray[1];
            newAddress.cCity = cDistrctArray[2];
            newAddress.cArea = cDistrctArray[3];
            newAddress.bDefault = $$('#AddressDetail li.isDefault').hasClass('checked');
            addAddressParam.newAddress = newAddress;
            cb.rest.postData('mc/Agents/saveShipToAddress', addAddressParam, function (data) {
                var dataObj = data;
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('保存成功', 'success').show(true); //✕✕✓
                    // 返回地址页面
                    myApp.mainView.router.back();
                }
                else {
                    myApp.toast(dataObj.message, 'error').show(true); //✕✓
                }
            });
        }

    });

    $$('div[data-page="addrNewPage"] .addressManage-btn-del').on('click', function () {
        var id = page.query.id;
        if (!id) return;
        cb.confirm('确定要删除该项吗？', '提示信息', function () {
            cb.rest.postData('mc/Agents/deleteShipToAddress', { id: id }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                myApp.toast('删除地址信息成功！', 'success').show(true);
                myApp.mainView.router.back({ url: 'pages/addrList.html', force: true });
            });
        });
    });
};