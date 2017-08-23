UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ClientInforController = function () { };
UOrderApp.pages.ClientInforController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Agents/getAgent', function (data) {
        if (data.code != 200) {
            myApp.toast('获取客户信息失败', 'error').show(true);
            return;
        }
        context.agentInfo = data.data;
        self.StorageData = context.agentInfo;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);
    });
};

UOrderApp.pages.ClientInforController.prototype.pageInit = function (page) {
    var self = this;
    //保存按钮点击事件
    $$('div[data-page="clientInfoPage"] .clientInfo-btn-submit').on('click', function () {
        if (!self.validData()) return;

        var formData = myApp.formToJSON('#form-clientInfo');
        var saveData = {
            id: self.StorageData.id,
            cCode: formData.cCode,
            cName: formData.cName,
            cTaxNo: formData.cTaxNo,
            oAddress: {
                cZipCode: formData.cZipCode,
                cAddress: formData.cAddress
            }
        };
        saveData.iSettlementWayId = $$('#picker-clientInfo-oSettlementWay').data('value') ? $$('#picker-clientInfo-oSettlementWay').data('value') : self.StorageData.oSettlementWay.id;
        saveData.iShippingChoiceId = $$('#picker-clientInfo-oShippingChoice').data('value') ? $$('#picker-clientInfo-oShippingChoice').data('value') : self.StorageData.oShippingChoice.id;

        if (formData.oAddress) {
            var address = formData.oAddress.split(' ');
            saveData.oAddress.cCountry = address[0];
            saveData.oAddress.cProvince = address[1];
            saveData.oAddress.cCity = address[2];
            saveData.oAddress.cArea = address[3];
        }
        //delete saveData.
        cb.rest.postData('mc/Agents/saveAgent', { oAgent: saveData }, function (data) {
            if (data.code != 200) {
                myApp.toast('保存客户信息失败', 'error').show(true);
                return;
            }
            myApp.toast('保存客户信息成功', 'success').show(true);
            myApp.mainView.router.back();
        });
    });
    //获取发运方式
    $$('#picker-clientInfo-oShippingChoice').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: true,
                pageTitle: "发运方式",
                fieldValue: 'id',
                fieldName:'cName',
                serverUrl: 'ma/ShippingChoices/getShippingChoices',
                selectValue: $$('#picker-clientInfo-oShippingChoice').data('value') ? $$('#picker-clientInfo-oShippingChoice').data('value'): self.StorageData.oShippingChoice.id,
                container: $$('#picker-clientInfo-oShippingChoice')
            }
        });
    });
    //获取结算方式
    $$('#picker-clientInfo-oSettlementWay').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: true,
                pageTitle: "结算方式",
                fieldValue: 'id',
                fieldName: 'cName',
                serverUrl: 'ma/SettlementWays/getSettlementWays',
                selectValue: $$('#picker-clientInfo-oSettlementWay').data('value') ? $$('#picker-clientInfo-oSettlementWay').data('value') : self.StorageData.oSettlementWay.id,
                container: $$('#picker-clientInfo-oSettlementWay')
            }
        });
    });

    //获取地址信息
    $$('#picker-clientInfo-oAddress').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: false,
                pageTitle: "选择地址",
                fieldValue: 'id',
                fieldName: 'shortName',
                serverUrl: ['ma/BaseData/getProvincesWithWordGroup', 'ma/BaseData/getCitysFromProvince', 'ma/BaseData/getDistrictFromCity'],
                container: $$('#picker-clientInfo-oAddress')
            }
        });
    });

    //监听基础信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="SmartSelectListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query.value && page.query.name) {
            page.query.container.data('value', page.query.value).val(page.query.name);
        }
    });
};

UOrderApp.pages.ClientInforController.prototype.validData = function () {
    var formData = myApp.formToJSON('#form-clientInfo');
    if (!formData.cCode) {
        myApp.toast('客户编码不能为空', 'tips').show(true);
        return false;
    }
    if (!formData.cName) {
        myApp.toast('客户名称不能为空', 'tips').show(true);
        return false;
    }
    if (!formData.cTaxNo) {
        myApp.toast('客户税号不能为空', 'tips').show(true);
        return false;
    }
    return true;
};