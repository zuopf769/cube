UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ClientInforController = function () { };
UOrderApp.pages.ClientInforController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Agents/getAgent', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
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
    $$('div[data-page="clientInfoPage"] .button.clientInfo-btn-submit').on('click', function () {
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
        if (formData.oSettlementWay.indexOf(']') > 0)
            saveData.iSettlementWayId = formData.oSettlementWay.split(']')[0].substr(1);

        if (formData.oShippingChoice.indexOf(']') > 0)
            saveData.iShippingChoiceId = formData.oShippingChoice.split(']')[0].substr(1);

        if (formData.oAddress) {
            var address = formData.oAddress.split(' ');
            saveData.oAddress.cCountry = address[0];
            saveData.oAddress.cProvince = address[1];
            saveData.oAddress.cCity = address[2];
            saveData.oAddress.cArea = address[3];
        }
        //delete saveData.
        cb.rest.postData('mc/Agents/saveAgent', {oAgent:saveData}, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('保存客户信息失败', 'error').show(true);
                return;
            }
            myApp.toast('保存客户信息成功', 'success').show(true);
            myApp.mainView.router.back();
        });       
    });

    //加载结算方式
    cb.rest.getJSON('ma/SettlementWays/getSettlementWays', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取结算方式失败', 'error').show(true);
            return;
        }
        var arrayList = new Array();
        for (var index = 0; index < data.data.length; index++){
            var item=data.data[index];
            arrayList.push('[' + item.id+ ']'+item.cName);
        }

        var pickerOption = {
            input: '#picker-clientInfo-oSettlementWay',
            toolbarCloseText: '关闭',
            cols: [
                {
                    textAlign: 'center',
                    values: arrayList
                }
            ]
        };
        if (self.StorageData.oSettlementWay) {
            pickerOption.value = ['[' + self.StorageData.oSettlementWay.id + ']' + self.StorageData.oSettlementWay.cName];
        }
        myApp.picker(pickerOption);
    });

    //加载发货方式
    cb.rest.getJSON('ma/ShippingChoices/getShippingChoices', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取发货方式失败', 'error').show(true);
            return;
        }
        var arrayList = new Array();
        for (var index = 0; index < data.data.length; index++) {
            var item = data.data[index];
            arrayList.push('[' + item.id + ']' + item.cName);
        }

        var pickerOption = {
            input: '#picker-clientInfo-oShippingChoice',
            toolbarCloseText: '关闭',
            cols: [
                {
                    textAlign: 'center',
                    values: arrayList
                }
            ]
        };
        if (self.StorageData.oShippingChoice) {
            pickerOption.value = ['[' + self.StorageData.oShippingChoice.id + ']' + self.StorageData.oShippingChoice.cName];
        }
        myApp.picker(pickerOption);
    });

    //加载地址信息
    $$('#picker-clientInfo-oAddress').parent().on('click', function (e) {
        var carVendors = cb.loacldata.RegionList;
        var cityArray = [];
        var objCity;
        var pickerDependent = myApp.picker({
            input: '#picker-clientInfo-oAddress',
            rotateEffect: true,
            toolbarCloseText: '关闭',
            //value: [self.StorageData.oAddress.cCountry, self.StorageData.oAddress.cCity, self.StorageData.oAddress.cArea],
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