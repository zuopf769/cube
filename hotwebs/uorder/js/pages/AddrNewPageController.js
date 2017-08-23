UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.AddrNewPageControoller = function () {
};
UOrderApp.pages.AddrNewPageControoller.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.AddrNewPageControoller.prototype.pageInit = function (page) {
    // 修改进来的进行地址初始化
    if (page.query) {
        // 初始化信息
        myApp.formFromJSON('#AddressDetail', page.query);
    }
    var isNewAddress = $$.parseUrlQuery(page.url);
    if (isNewAddress.newAddress == "true") {
        $$('div[data-page="addrNewPage"] .center').text("新建地址");
    } else {
        $$('div[data-page="addrNewPage"] .center').text("修改地址");
    }
    // 地址选择
    $$('#newAddrInput').on('click', function (e) {
        var carVendors = cb.loacldata.RegionList;
        var cityArray = [];
        var objCity;
        var pickerDependent = myApp.picker({
            input: '#picker-dependent',
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

    });
    // 保存和修改地址
    $$('.button.address-submit').on('click', function (e) {
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
            // 将cDistrct字符串分割成省、市、区字段，分别对应cProvince、cCity、cArea字段
            var cDistrctArray = param.cDistrct.split(" ");
            // 字段如 中国 河北省 秦皇岛市 海港区，其中中国是写死的字段，暂时不考虑，为后期扩展用
            address.cProvince = cDistrctArray[1];// 省
            address.cCity = cDistrctArray[2]; // 市
            address.cArea = cDistrctArray[3]; // 区
            updateAddressParam.address = address;
            cb.rest.postData('mc/Agents/modifyShipToAddress', updateAddressParam, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('修改成功', 'success').show(true); //✕✕✓
                    // 返回地址页面
                    myApp.mainView.router.loadPage({
                        url: 'pages/addrList.html'
                    });
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
            addAddressParam.newAddress = newAddress;
            cb.rest.postData('mc/Agents/saveShipToAddress', addAddressParam, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('保存成功', 'success').show(true); //✕✕✓
                    // 返回地址页面
                    myApp.mainView.router.loadPage({
                        url: 'pages/addrList.html'
                    });
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
        myApp.confirm('确定要删除此条地址信息吗？', '提示信息', function () {
            cb.rest.postData('mc/Agents/deleteShipToAddress', { id: id }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
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
