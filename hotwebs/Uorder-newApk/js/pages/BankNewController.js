UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BankNewController = function () { };
UOrderApp.pages.BankNewController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    this.bankId = context.id;
    var self = this;
    cb.rest.getJSON('BaseData/getBanks', function (data) {
        if (data.code != 200) {
            myApp.toast('获取银行列表失败', 'error').show(true);
            return;
        }
        var banks = {
            '常用银行': new Array()
        };
        var flagTitle = new Array();
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            if (item.bHot)
                banks['常用银行'].push(item.cName);
            var flagType = item.cFlag.slice(0, 1).toUpperCase();
            if (!banks[flagType]) {
                banks[flagType] = new Array();
                flagTitle.push(flagType);
            }
            banks[flagType].push(item.cName);
        }
        flagTitle.sort();
        flagTitle.unshift('常用银行');
        self.allBanks = data.data;
        self.loacldata = {
            flagTitle: flagTitle,
            banks: banks
        };
    });
    next(content);
};

UOrderApp.pages.BankNewController.prototype.pageInit = function (page) {
    var self = this;

    //获取银行信息
    $$('#picker-bm-bankName').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: true,
                pageTitle: "选择银行",
                fieldValue: 'id',
                fieldName: 'cName',
                phoneImg: 'cPhoneImage',
                serverUrl: 'BaseData/getBanks',
                container: $$('#picker-bm-bankName'),
                selectValue: self.bankId
            }
        });
    });

    //获取地址信息
    $$('#picker-bm-cRegion').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: false,
                pageTitle: "选择地址",
                fieldValue: 'id',
                fieldName: 'shortName',
                serverUrl: ['ma/BaseData/getProvincesWithWordGroup', 'ma/BaseData/getCitysFromProvince', 'ma/BaseData/getDistrictFromCity'],
                container: $$('#picker-bm-cRegion')
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

    $$('div[data-page="bandInfoManagePage"] li.isDefault').on('click', function () {
        $$(this).toggleClass('default');
    })

    if (this.bankId) {
        cb.rest.getJSON('ma/Agents/getAgentFinancialsById', { id: this.bankId }, function (data) {
            if (data.code != 200) {
                myApp.toast('加载银行信息失败', 'error').show(true);
                return;
            }
            var bankData = data.data;
            bankData.bankName = bankData.oBank.cName;
            if (bankData.bDefault)
                $$('div[data-page="bandInfoManagePage"] li.isDefault').addClass('default');
            myApp.formFromJSON('#form-bankInfoManage', bankData);
        });

        //启用删除按钮
        $$('div[data-page="bandInfoManagePage"] .bankManage-btn-del').parents('.list-block.m-t-10').show();
        //删除按钮事件
        $$('div[data-page="bandInfoManagePage"] .bankManage-btn-del').on('click', function () {
            var params = {
                ids: [self.bankId]
            };
            cb.confirm('确定要删除该项吗？', "提示信息", function () {
                cb.rest.postData('mc/Agents/deleteAgentFinancial', params, function (data) {
                    if (data.code != 200) {
                        myApp.toast(data.message, 'error').show(true);
                        return;
                    }
                    myApp.toast('删除银行信息成功！', 'success').show(true);
                    myApp.mainView.router.back();
                });
            });
        });
    }
    else
        $$('div[data-page="bandInfoManagePage"] .bankManage-btn-del').parents('.list-block.m-t-10').hide();

    $$('.page[data-page="bandInfoManagePage"] .bankManage-btn-submit a').on('click', function () {
        if (!self.formValidate()) return;
        var formData = myApp.formToJSON('#form-bankInfoManage');

        formData.iBankId = $$('#picker-bm-bankName').data('value');
        formData.oBank = {
            cName: formData.bankName
        };
        formData.bDefault = $$('div[data-page="bandInfoManagePage"] li.isDefault').hasClass('default');
        var param = { agentbank: formData };
        if (self.bankId) {
            param.agentbank.id = self.bankId;
        }
        cb.rest.postData('mc/Agents/saveAgentFinancial', param, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            myApp.toast('保存银行信息成功', 'success').show(true);
            myApp.mainView.router.back();
        });
    });

    $$('div[data-page="bandInfoManagePage"] form').find('input[name="cBankAccount"]').blur(function () {
        var selfInput = this;
        var formData = myApp.formToJSON('#form-bankInfoManage');
        var bankName = cb.loacldata.bankInfo.find(formData.cBankAccount);
        if (!bankName) {
            cb.confirm('银行卡号无法识别,是否重新输入？', '提示信息', function () {
                $$(selfInput).val('');
            });
        }
        else if (formData.bankName != bankName) {
            cb.confirm('银行卡号与银行不符，是否自动修正？', '提示信息', function () {
                $$('div[data-page="bandInfoManagePage"] form').find('input[name="bankName"]').val(bankName);
            });
        }
    });
};

UOrderApp.pages.BankNewController.prototype.formValidate = function () {
    var formData = myApp.formToJSON('#form-bankInfoManage');
    if (!formData.bankName) {
        myApp.toast('请选择银行', 'tips').show(true);
        return false;
    }
    if (!formData.cBankName) {
        myApp.toast('请输入开户行信息', 'tips').show(true);
        return false;
    }
    if (!formData.cBankAccount) {
        myApp.toast('请输入银行卡号', 'tips').show(true);
        return false;
    }
    else {
        if (formData.cBankAccount.length > 19 || formData.cBankAccount.length < 15) {
            myApp.toast('请输入正确的银行卡号', 'tips').show(true);
            return false;
        }
    }
    return true;
};