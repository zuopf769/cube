UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.RebateController = function () {
    this.rebateItemFunc = Template7.compile($$('#rebateItemTpl').html());
    this.rebateItemTplSelect = Template7.compile($$('#rebateItemTplSelect').html());
};
UOrderApp.pages.RebateController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.RebateController.prototype.pageInit = function (page) {
    //var context = $$.parseUrlQuery(url) || {};
    var selectModel = page.query.type == "select";
    this.paramsContent = {
        serverUrl: selectModel ? "ma/Rebates/getUsableRebates" : 'ma/Rebates/getRebateList',
        params: {
            pageIndex: 1,
            pageSize: 10
        }
    };

    if (selectModel) {
        $$('div[data-page="RebateListPage"]').children('.toolbar').show();
        $$('div[data-page="RebateListPage"] .page-content.pull-to-refresh-content .rabate-tip').text('最多可折扣' + page.query.orderUsableMoney + '元, 最多可抵现' + page.query.cashMaxRebateMoney + '元');
        $$('div[data-page="RebateListPage"] .pay-info.rebateSelectContainer').on('selected', function () {
            var count = 0;
            var selectedList = $$('div[data-page="RebateListPage"] .rebate.rebateListPage-container').children('dl.active');
            selectedList.each(function () {
                var val = $$(this).find('input[type="number"]').val();
                if (!isNaN(val) && parseFloat(val) >= 0)
                    count += parseFloat(val);
            });
            var totalHtml = '<p class="font-14">' + selectedList.length + '笔  <em class="totalPriceContainer font-20">￥' + count.toFixed(2) + '</em></p>';

            $$(this).html(totalHtml);
        });
    }
    else
        $$('div[data-page="RebateListPage"]').children('.toolbar').hide();


    //格式化数据源
    var formatData = function (list) {
        if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                var curr = list[i];
                if (curr.dValidEndDate) {
                    var dValidStartDate = new Date(curr.dValidStartDate);
                    var dValidEndDate = new Date(curr.dValidEndDate);
                    curr.dValidStartDate = dValidStartDate.format("yyyy/MM/dd");
                    curr.dValidEndDate = dValidEndDate.format("yyyy/MM/dd");
                }
            }
        }
        return list;
    };

    //选择模式时,绑定事件
    var bindEvent = function () {
        $$('.page[data-page="RebateListPage"] .rebateListPage-container dd').on("click", function () {
            var $$this = $$(this);
            var parent = $$this.parents(".available").eq(0);
            if (parent.is(".active")) {
                parent.removeClass("active").find("input[type=number]").attr("readonly", true);
            }
            else {
                parent.addClass("active").find("input[type=number]").removeAttr("readonly");
            }

            $$('div[data-page="RebateListPage"] .pay-info.rebateSelectContainer').trigger('selected');
        });

        $$(".rebateListPage-container input[type=number]").on("click", function (event) {
            $$('div[data-page="RebateListPage"] .pay-info.rebateSelectContainer').trigger('selected');
            event.stopPropagation();
        }).on("focus", function () {
            if ($$(this).val() == "0") {
                $$(this).val("");
            }
        }).on('keyup', function () {
            var $$this = $$(this);
            if (isNaN(parseFloat($$this.val()))) {
                $$this.val(0);
            }

            var fSurplusMoney = Number($$this.data("fsurplusmoney"));
            if (fSurplusMoney < parseFloat($$this.val())) {
                myApp.toast('超过本返利券可用余额', 'tips').show(true);
                $$this.val(fSurplusMoney);
            }
        });
    };

    var self = this;
    var getRebateList = function (callBack) {
        cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }

            var resultHtml = "";
            if (selectModel) {
                resultHtml = self.rebateItemTplSelect({ rebateList: formatData(data.data.list) });
                $$('.page[data-page="RebateListPage"] .rebateListPage-container').html(resultHtml);
                bindEvent();
            }
            else {
                resultHtml = self.rebateItemFunc({ rebateList: formatData(data.data.list) });
                $$('.page[data-page="RebateListPage"] .rebateListPage-container').html(resultHtml);
            }
            if (callBack) {
                callBack.call(this);
            }
        });
    };

    var rebateRequireFunc = function () {
        var tempObj = {
            TOPRODUCT: page.query.fMaxRebateMoney,
            TOORDER: page.query.orderUsableMoney,
            TOCASH: page.query.cashMaxRebateMoney,
            fPayMoney: page.query.fPayMoney,
            isPass:true
        };

        $$('.page[data-page="RebateListPage"] .rebateListPage-container dl.active').each(function (index, item) {
            var $$this = $$(this);
            var cRebateNo = $$this.data("rebateno");
            var fOrderRebateMoney = $$this.find("input[type=number]").val();
            var cWayCodeName = $$this.attr('data-cusewaycode');

            if (isNaN(fOrderRebateMoney) || Number(fOrderRebateMoney) <= 0) {
                myApp.toast('请输入正确的金额', 'tips').show(true);
                return false;
            }
            if (cWayCodeName == 'TOPRODUCT') {
                tempObj.TOPRODUCT -= parseFloat(fOrderRebateMoney);
                tempObj.fPayMoney -= parseFloat(fOrderRebateMoney);
                if (tempObj.TOPRODUCT < 0) {
                    myApp.toast('分摊返利已超出最大使用上限', 'tips').show(true);
                    tempObj.isPass=false;
                }
            }
            else if (cWayCodeName == 'TOORDER') {
                tempObj.TOORDER -= parseFloat(fOrderRebateMoney);
                tempObj.fPayMoney -= parseFloat(fOrderRebateMoney);
                if (tempObj.TOORDER < 0) {
                    myApp.toast('分摊返利已超出最大使用上限', 'tips').show(true);
                    tempObj.isPass = false;
                }
            }
            else if (cWayCodeName == 'TOCASH') {
                tempObj.TOCASH -= parseFloat(fOrderRebateMoney);
                tempObj.fPayMoney -= parseFloat(fOrderRebateMoney);
                if (tempObj.TOCASH < 0) {
                    myApp.toast('分摊返利已超出最大使用上限', 'tips').show(true);
                    tempObj.isPass = false;
                }
            }
            if (tempObj.fPayMoney < 0) {
                myApp.toast('返利已超出订单金额', 'tips').show(true);
                tempObj.isPass = false;
            }
        });

        return tempObj.isPass;
    };

    $$('div[data-page="RebateListPage"] .rebateSelectedSaveBtn').on("click", function () {
        if (selectModel) {
            var isPass = rebateRequireFunc();
            if (!isPass) return;

            var isSuccess = true;
            var resultArray = [];
            var inputAmount = 0;
            $$('.page[data-page="RebateListPage"] .rebateListPage-container dl.active').each(function (index, item) {
                var $$this = $$(this);
                var cRebateNo = $$this.data("rebateno");
                var fOrderRebateMoney = $$this.find("input[type=number]").val();
                if (isNaN(fOrderRebateMoney) || Number(fOrderRebateMoney) <= 0) {
                    myApp.toast('请输入正确的金额', 'tips').show(true);
                    isSuccess = false;
                    return false;
                }
                inputAmount += Number(fOrderRebateMoney);
                var cUseWayCode = $$(this).attr('data-cusewaycode');
                resultArray.push({ cRebateNo: cRebateNo, fOrderRebateMoney: fOrderRebateMoney, cUseWayCode: cUseWayCode });
            });

            if (isSuccess) {
                var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
                pageVewList[pageVewList.length - 1].f7PageData.query = {
                    rebateData: { rebateAmount: inputAmount, resultArray: resultArray }
                };
                myApp.mainView.router.back();
            }
        }
    });

    getRebateList(function () {
        var lastIndex = $$('.rebateListPage-container dl').length;
        if (lastIndex >= 10) {
            $$('.page-content.infinite-scroll').on('infinite', function () {
                lastIndex = parseInt($$('.rebateListPage-container dl').length / 10) + 1;
                if (self.paramsContent.params.pageIndex < lastIndex) {
                    self.paramsContent.params.pageIndex = lastIndex;
                    cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                        if (data.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        var resultHtml = "";
                        if (selectModel) {
                            resultHtml = self.rebateItemTplSelect({ rebateList: formatData(data.data.list) });
                            $$('.page[data-page="RebateListPage"] .rebateListPage-container').append(resultHtml);
                            bindEvent();
                        }
                        else {
                            resultHtml = self.rebateItemFunc({ rebateList: formatData(data.data.list) });
                            $$('.page[data-page="RebateListPage"] .rebateListPage-container').append(resultHtml);
                        }
                    });
                }
                else {
                    $$('.infinite-scroll-preloader').remove();
                }
            });
        }
        else {
            $$('.infinite-scroll-preloader').remove();
        }
    });

    //下拉刷新
    $$('.page-content.pull-to-refresh-content').on('refresh', function (e) {
        self.paramsContent.params.pageIndex = 1;
        getRebateList(function () {
            myApp.pullToRefreshDone();
        });
    });
}