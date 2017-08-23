UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BankNewController = function () { };
UOrderApp.pages.BankNewController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    this.bankId = context.id;
    var self = this;
    cb.rest.getJSON('BaseData/getBanks', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
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
        next(content);
    });
};

UOrderApp.pages.BankNewController.prototype.pageInit = function (page) {
    var self = this;
    //选择银行
    var myBankPicker = myApp.picker({
        input: '#picker-bm-bankName',
        rotateEffect: true,
        toolbarCloseText: '关闭',
        formatValue: function (picker, values) {
            return values[1];
        },
        cols: [
            {
                textAlign: 'left',
                values: self.loacldata.flagTitle,
                onChange: function (picker, country) {
                    if (picker.cols[1].replaceValues) {
                        picker.cols[1].replaceValues(self.loacldata.banks[country]);
                    }
                }
            },
            {
                textAlign: 'left',
                values: self.loacldata.banks['常用银行'],
                width: 250
            }
        ]
    });

    $$('#form-bankInfoManage input[name="cRegion"]').parent('.item-input').on('click', function () {
        var carVendors = cb.loacldata.RegionList;
        var cityArray = [];
        var objCity;
        var pickerDependent = myApp.picker({
            input: '#picker-bm-cRegion',
            rotateEffect: true,
            toolbarCloseText: '关闭',
            formatValue: function (picker, values) {
                return "中国 " + values[0] + " " + values[1] + " " + values[2];
            },
            cols: [
                {
                    textAlign: 'left',
                    values: ["北京", "上海", "广东省", "安徽省", "重庆", "福建省", "甘肃省", "广西区", "贵州省", "海南省", "河北省", "河南省", "黑龙江省", "湖北省", "湖南省", "吉林省", "江苏省", "江西省", "辽宁省", "内蒙古区", "宁夏区", "青海省", "山东省", "山西省", "山东省", "陕西省", "四川省", "天津", "西藏区", "新疆区", "云南省", "浙江省"],
                    onChange: function (picker, country) {
                        cityArray = [];
                        objCity = carVendors[country];
                        for (var cityItem in objCity) {
                            cityArray.push(cityItem);
                        }
                        if (picker.cols[1].replaceValues) {
                            picker.cols[1].replaceValues(cityArray);
                        }
                        if (picker.cols[2].replaceValues) {
                            picker.cols[2].replaceValues(objCity[cityArray[0]]);
                        }

                    }
                },
                {
                    values: ["北京辖区", "北京辖县"],
                    onChange: function (picker, city) {
                        if (picker.cols[2].replaceValues) {
                            picker.cols[2].replaceValues(objCity[city]);
                        }
                    },
                    width: 160,
                },
                {
                    values: ["昌平区", "朝阳区", "崇文区", "大兴区", "东城区", "房山区", "丰台区", "海淀区", "怀柔区", "门头沟区", "平谷区", "石景山区", "顺义区", "通州区", "西城区", "宣武区"],
                    width: 160,
                },
            ]
        });
        pickerDependent.open();
    });

    if (this.bankId) {
        cb.rest.getJSON('ma/Agents/getAgentFinancialsById', { id: this.bankId }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('加载银行信息失败', 'error').show(true);
                return;
            }
            var bankData = data.data;
            bankData.bankName = bankData.oBank.cName;
            if (bankData.bDefault)
                bankData.bDefault = ['yes'];
            myApp.formFromJSON('#form-bankInfoManage', bankData);
            myBankPicker.value(myBankPicker.cols[0].value[0], myBankPicker.cols[1].value[myBankPicker.cols[1].values.indexOf(bankData.bankName)]);
        });

        //启用删除按钮
        $$('div[data-page="bandInfoManagePage"] .bankManage-btn-del').parents('.list-block.m-t-10').show();
        //删除按钮事件
        $$('div[data-page="bandInfoManagePage"] .bankManage-btn-del').on('click', function () {
            var params = {
                ids: [self.bankId]
            };
            myApp.confirm('确定要删除此条银行信息吗？', '提示信息', function () {
                cb.rest.postData('mc/Agents/deleteAgentFinancial', params, function (data) {
                    if (typeof data == 'string')
                        data = JSON.parse(data);
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

    $$('.page[data-page="bandInfoManagePage"] .button.bankManage-btn-submit').on('click', function () {
        if (!self.formValidate()) return;
        var formData = myApp.formToJSON('#form-bankInfoManage');
        for (var i = 0; i < self.allBanks.length; i++) {
            var currBank = self.allBanks[i];
            if (currBank.cName == formData.bankName) {
                formData.iBankId = currBank.id;
                break;
            }
        }
        formData.oBank = {
            cName: formData.bankName
        };
        if (formData.bDefault[0] == 'yes')
            formData.bDefault = true;
        var param = { agentbank: formData };
        cb.rest.postData('mc/Agents/saveAgentFinancial', param, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
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
            myApp.confirm('检测到输入的银行卡号无法识别，是否重新输入？', '提示信息', function () {
                $$(selfInput).val('');
            });
        }
        else if (formData.bankName != bankName) {
            myApp.confirm('检测到输入的银行卡号与所属银行不符，是否自动修正？', '提示信息', function () {
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