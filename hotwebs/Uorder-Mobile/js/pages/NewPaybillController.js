UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.NewPaybillController = function () { };
UOrderApp.pages.NewPaybillController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    next(content);
};

UOrderApp.pages.NewPaybillController.prototype.pageInit = function (page) {
    var self = this;
    var queryId = page.query.id;
    if (queryId) {
        $$('div[data-page="NewPaybill"] .navbar .center').html('编辑支付单');

    }

    //控制输入框
    $$('div[data-page="NewPaybill"] .input-money').focus(function () {
        $$(this).val($$(this).val().replace('￥', ''));
    }).blur(function () {
        if ($$(this).val())
            $$(this).val('￥' + $$(this).val());
        else
            $$(this).val('￥0');
    }).keyup(function () {
        $$(this).val($$(this).val().replace(/[^\d]/g, ''));
    });

    //获取结算方式
    cb.rest.getJSON('ma/Payments/getFinalSettlementWay', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('加载结算方式失败', 'error').show(true);
            return;
        }
        var controlHtml = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            controlHtml += '<div class="pay-style">' +
                                '<input type="radio" name="SettlementWay" value="' + item.id + '" ' + (i == 0 ? 'checked' : '') + '>' +
                                '<span>' + item.cName + '</span>' +
                            '</div>';
        }
        $$('div[data-page="NewPaybill"] .SettlementWaysContainer').html(controlHtml);
        self.InitData(queryId);
    });

    //支付方式切换
    $$('div[data-page="NewPaybill"] .payTypeContainer').find('input').on('change', function (e) {
        var val = $$(this).val();
        if (val == '1') {
            $$('div[data-page="NewPaybill"] .pay-bill.offline').find('li').each(function () {
                if (!$$(this).hasClass('alwaysShow'))
                    $$(this).addClass('hide');
            });
        }
        else
            $$('div[data-page="NewPaybill"] .pay-bill.offline').find('li').removeClass('hide');
    });
    $$('div[data-page="NewPaybill"] .payTypeContainer').find('input:checked').trigger('change');

    //汇款账户点击事件
    $$('div[data-page="NewPaybill"] .popup-AgentFinancials').on('click', function (e) {
        var id = $$(this).attr('data-id');
        //获取汇款账户信息
        cb.rest.getJSON('ma/Agents/getAgentFinancials', function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('加载汇款账户信息失败', 'error').show(true);
                return;
            }
            var html = self.InitBankHTML(data.data, 'AgentFinancials', id);
            $$('.popup.popup-select-bank').html(html);
            self.RegeistEvent(data.data, 'Agen');
            myApp.popup('.popup.popup-select-bank');
        });
    });
    //收款账户点击事件
    $$('div[data-page="NewPaybill"] .popup-CorprationFinancials').on('click', function (e) {
        //获取收款账户信息
        var id = $$(this).attr('data-id');
        cb.rest.getJSON('ma/Corprations/getCorprationFinancials', function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('加载收款账户信息失败', 'error').show(true);
                return;
            }
            var html = self.InitBankHTML(data.data, 'CorprationFinancials', id);
            $$('.popup.popup-select-bank').html(html);
            self.RegeistEvent(data.data, 'Corp');
            myApp.popup('.popup.popup-select-bank');
        });
    });

    //点击按钮保存
    $$('.button.btn-paySubmit').on('click', function () {
        var param = self.CollectData();
        if (queryId)
            param.id = queryId;

        cb.rest.postData('mc/Payments/paysave', { paymentJson: JSON.stringify(param) }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            myApp.toast('保存成功', 'success').show(true);
            myApp.mainView.router.back();
        });
    });
};

UOrderApp.pages.NewPaybillController.prototype.InitData = function (val) {
    var bankHtml = function (data) {
        var container = data.type == 'Corp' ? $$('.item-content.popup-CorprationFinancials') : $$('.item-content.popup-AgentFinancials');
        var singleBank = '<div class="item-title label">' + (data.type == 'Corp' ? '收款' : '汇款') + '</div>' +
                                    '<div class="item-media"><img src="' + data.cImage + '" style="width:30px;height:30px;"/></div>' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">' + data.cName + ' ' + data.cBankName + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">' + data.cBankAccount + ' </div>' +
                                    '</div>';
        container.attr('data-id', data.id);
        container.html(singleBank);
    };
    cb.rest.getJSON('ma/Payments/getPayment?id=' + val, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取支付单信息失败', 'error').show(true);
            return;
        }
        var data = data.data;
        $$('div[data-page="NewPaybill"] .input-money').val('￥' + data.iAmount);
        $$('div[data-page="NewPaybill"] .payTypeContainer').find('input[value="' + data.iPayType + '"]').prop('checked', 'checked');
        $$('div[data-page="NewPaybill"] .payTypeContainer').find('input:checked').trigger('change');
        if (data.iPayType == 2) {
            $$('div[data-page="NewPaybill"] .SettlementWaysContainer').find('input[value="' + data.iSettlementId + '"]').prop('checked', 'checked');

            bankHtml({
                type: 'Corp',
                id: data.iCorpFinanId ? data.iCorpFinanId : 0,
                cImage: '',
                cName: data.cCorpBank ? data.cCorpBank : '无卡',
                cBankName: data.cCorpBankBranch ? data.cCorpBankBranch : '',
                cBankAccount: data.cCorpBankCartNo ? data.cCorpBankCartNo : ''
            });
            bankHtml({
                type: 'Agen',
                id: data.iAgentFinanId ? data.iAgentFinanId : 0,
                cImage: '',
                cName: data.cAgentBank ? data.cAgentBank : '无卡',
                cBankName: data.cAgentBankBranch ? data.cAgentBankBranch : '',
                cBankAccount: data.cAgentBankCartNo ? data.cAgentBankCartNo : ''
            });
        }

        $$('div[data-page="NewPaybill"] .input-payRemork').val(data.remark);  //备注
    });
};

//收集数据
UOrderApp.pages.NewPaybillController.prototype.CollectData = function () {
    var param = {
        iAmount: $$('div[data-page="NewPaybill"] .input-money').val().replace('￥', ''),
        iPayType: $$('div[data-page="NewPaybill"] .payTypeContainer').find('input:checked').val(),
        remark: $$('div[data-page="NewPaybill"] .input-payRemork').val()
    };
    if (param.iPayType == '2') {
        param.iAgentFinanId = $$('div[data-page="NewPaybill"] .popup-AgentFinancials').attr('data-id');;
        param.iCorpFinanId = $$('div[data-page="NewPaybill"] .popup-CorprationFinancials').attr('data-id');
        param.iSettlementId = $$('div[data-page="NewPaybill"] .SettlementWaysContainer').find('input:checked').val();
    }
    return param;
};
//注册点击事件
UOrderApp.pages.NewPaybillController.prototype.RegeistEvent = function (data, type) {
    var container = type == 'Corp' ? $$('.item-content.popup-CorprationFinancials') : $$('.item-content.popup-AgentFinancials');

    $$('.popup.popup-select-bank').find('li').on('change', function (e) {
        var id = $$(this).parent().find('input:checked').val();
        var bankData = data.filter(function (item) {
            return item.id == id;
        });
        var newHTML = '';
        if (id != '0' && bankData.length > 0) {
            bankData = bankData[0];
            newHTML = '<div class="item-title label">' + (type == 'Corp' ? '收款' : '汇款') + '</div>' +
                                    '<div class="item-media"><img src="' + bankData.oBank.cImage + '" style="width:30px;height:30px;"/></div>' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">' + bankData.oBank.cName + ' ' + bankData.cBankName + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">' + bankData.cBankAccount + ' </div>' +
                                    '</div>';
        }
        else {
            newHTML = '<div class="item-title label">' + (type == 'Corp' ? '收款' : '汇款') + '</div>' +
                                    '<div class="item-media"><img style="width:30px;height:30px;"/></div>' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">无卡</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle"></div>' +
                                    '</div>';

        }
        container.html(newHTML);
        container.attr('data-id', id);
        myApp.closeModal('.popup.popup-select-bank');
    });
};

//构件弹出层HTML
UOrderApp.pages.NewPaybillController.prototype.InitBankHTML = function (data, type, listId) {
    var html = '<div class="content-block">' +
    '<div class="navbar">' +
        '<div class="navbar-inner">' +
            '<div class="left"><a href="#" class="close-popup"><i class="icon icon-colse-popup"></i></a></div>' +
            '<div class="center">选择汇款银行</div>' +
            '<div class="right"><a href="#">设置</a></div>' +
        '</div>' +
    '</div>' +
    '<div class="list-block media-list m-t-0 bankInfoContainer">' +
        '<ul class=" no-border">' +
            '<li>' +
                '<label class="label-radio item-content">' +
                    '<input type="radio" name="my-bank" value="0"' + (listId == '0' ? 'checked' : '') + '>' +
                    '<div class="item-inner">' +
                        '<div class="item-title" style="padding-left: 40px;">无卡</div>' +
                    '</div>' +
                '</label>' +
            '</li>';
    for (var i = 0; i < data.length; i++) {
        var radio = '<input type="radio" name="my-bank" value="' + data[i].id + '">';
        if (data[i].id == listId)
            radio = '<input type="radio" name="my-bank" value="' + data[i].id + '" checked="checked">';
        html += '<li><label class="label-radio item-content">' + radio +
                    '<div class="media-item">' +
                        '<img src="' + data[i].oBank.cImage + '" style="width:30px;height:30px;"/>' +
                    '</div>' +
                    '<div class="item-inner">' +
                        '<div class="item-title">' + data[i].oBank.cName + '  ' + data[i].cBankName + (data[i].bDefault ? '<span class="default-bank">默认</span>' : '') +
                        '</div><div class="item-subtitle">' + data[i].cBankAccount + ' </div>' +
                    '</div>' +
                '</label>' +
            '</li>';
    }
    html += '</ul></div><p><a href="#" class="button button-add-bank btn-' + type + '"><i class="icon icon-add-bank"></i> 使用新卡</a></p></div>';
    return html;
};

