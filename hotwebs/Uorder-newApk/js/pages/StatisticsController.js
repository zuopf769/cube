UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.StatisticsController = function () {
    //this.orderItemFunc = Template7.compile($$('#orderItemTpl').html());
};
UOrderApp.pages.StatisticsController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.StatisticsController.prototype.pageInit = function (page) {

    var self = this;

    //点击切换单据类型
    $$('.link.popover-orders-links').on('click', function (e) {
        var clickedLink = this;
        var popoverHTML = '<div class="popover dy-popover-orders-links">' +
                            '<div class="popover-inner">' +
                              '<div class="list-block">' +
                                '<ul>' +
                                '<li><a href="pages/statisticsList.html" class="item-link list-button" data-orderType="list">订货分析</li>' +
                                '</ul>' +
                              '</div>' +
                            '</div>' +
                          '</div>';
        myApp.popover(popoverHTML, clickedLink);

        //动态关闭popover
        $$('.popover.dy-popover-orders-links a').on('click', function (e) {
            myApp.closeModal('.dy-popover-orders-links');
            //$$(clickedLink).html($$(this).html());
            myApp.mainView.router.loadPage({ url: $$(this).attr("href") })
        });
    });
    var years = [new Date().getFullYear().toString() + "年"];
    var quarters = [{ "index": 1, "name": "第一季度", "firstMonth": 1 }, { "index": 2, "name": "第二季度", "firstMonth": 4 },
	                 { "index": 3, "name": "第三季度", "firstMonth": 7 }, { "index": 4, "name": "第四季度", "firstMonth": 10 }];
    var months = [{ "index": 1, "name": "一月", "quarter": 1 }, { "index": 2, "name": "二月", "quarter": 1 }, { "index": 3, "name": "三月", "quarter": 1 },
	               { "index": 4, "name": "四月", "quarter": 2 }, { "index": 5, "name": "五月", "quarter": 2 }, { "index": 6, "name": "六月", "quarter": 2 },
	               { "index": 7, "name": "七月", "quarter": 3 }, { "index": 8, "name": "八月", "quarter": 3 }, { "index": 9, "name": "九月", "quarter": 3 },
	               { "index": 10, "name": "十月", "quarter": 4 }, { "index": 11, "name": "十一月", "quarter": 4 }, { "index": 12, "name": "十二月", "quarter": 4 }];

    //设置筛选项初始值
    document.querySelector("#staYear").value = years[0];
    document.querySelector("#staQuarter").value = quarters[months[new Date().getMonth()].quarter - 1].name;
    document.querySelector("#staMonth").value = months[new Date().getMonth()].name;
    var yMark = null, qMark = null, mMark = null;
    var pickerOption = {
        input: '#staYear',
        toolbarCloseText: '关闭',
        cols: [
            {
                textAlign: 'center',
                values: years,
                onChange: function (picker, year) {
                    if (yMark) {
                        clearTimeout(yMark);
                    }
                    yMark = setTimeout(function () {
                        search.init();
                        yMark = null;
                    }, 500);
                }
            }
        ]
    };
    myApp.picker(pickerOption);

    var pickerOption2 = {
        input: '#staQuarter',
        toolbarCloseText: '关闭',
        cols: [
            {
                textAlign: 'center',
                values: ["第一季度", "第二季度", "第三季度", "第四季度"],
                onChange: function (picker, newVal) {
                    if (qMark) {
                        clearTimeout(qMark);
                    }
                    qMark = setTimeout(function () {
                        var quarterText = document.querySelector("#staQuarter").value;
                        for (var i = 0; i < quarters.length; i++) {
                            var curr = quarters[i];
                            if (curr.name == quarterText) {
                                quarterText = curr;
                                break;
                            }
                        }

                        document.querySelector("#staMonth").value = months[quarterText.firstMonth - 1].name;
                        search.init();
                        qMark = null;
                    }, 500);
                }
            }
        ]
    };
    myApp.picker(pickerOption2);

    var pickerOption3 = {
        input: '#staMonth',
        toolbarCloseText: '关闭',
        cols: [
            {
                textAlign: 'center',
                values: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                onChange: function (picker, newVal) {
                    if (mMark) {
                        clearTimeout(mMark);
                    }
                    mMark = setTimeout(function () {
                        var monthText = document.querySelector("#staMonth").value;
                        for (var i = 0; i < months.length; i++) {
                            var curr = months[i];
                            if (curr.name == monthText) {
                                monthText = curr;
                                break;
                            }
                        }

                        document.querySelector("#staQuarter").value = quarters[monthText.quarter - 1].name;
                        search.init();
                        mMark = null;
                    }, 500);
                }
            }
        ]
    };
    myApp.picker(pickerOption3);

    var search = {
        yearSearch: function () {
            var yearText = document.querySelector("#staYear").value;
            yearText = yearText.substr(0, yearText.length - 1);

            cb.rest.getJSON("ma/OrderStatistics/orderPriceForYear?year=" + yearText, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }

                document.querySelector("#yearPrice").textContent = data.data;
            });
        },
        quarterSearch: function () {
            var yearText = document.querySelector("#staYear").value;
            yearText = yearText.substr(0, yearText.length - 1);

            var quarterText = document.querySelector("#staQuarter").value;
            for (var i = 0; i < quarters.length; i++) {
                var curr = quarters[i];
                if (curr.name == quarterText) {
                    quarterText = curr.index;
                    break;
                }
            }
            cb.rest.getJSON("ma/OrderStatistics/orderPriceForQuarter?year=" + yearText + "&quarter=" + quarterText, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }

                document.querySelector("#quarterPrice").textContent = data.data;
            });
        },
        monthSearch: function () {
            var yearText = document.querySelector("#staYear").value;
            yearText = yearText.substr(0, yearText.length - 1);

            var monthText = document.querySelector("#staMonth").value;
            for (var i = 0; i < months.length; i++) {
                var curr = months[i];
                if (curr.name == monthText) {
                    monthText = curr.index;
                    break;
                }
            }

            cb.rest.getJSON("ma/OrderStatistics/orderPriceForMonth?year=" + yearText + "&month=" + monthText, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }

                document.querySelector("#monthPrice").textContent = data.data;
            });
        },
        init: function () {
            search.yearSearch();
            search.quarterSearch();
            search.monthSearch();
        }
    }
    search.init();

    //插件路径配置
    require.config({
        paths: {
            echarts: cb.rest.appContext.serviceUrl + '/js/pages/echarts'
        }
    });

    //柱状图
    cb.rest.getJSON("ma/OrderStatistics/getOrderPriceByMonth", function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }

        var option = {
            title: {
                text: '月订货金额',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333',
                    fontFamily: "微软雅黑"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['订货金额']
            },
            xAxis: [{
                type: 'category',
                data: data.data.months
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '订货金额',
                type: 'bar',
                data: data.data.prices
            }]
        };
        require([
                  'echarts',
                  'echarts/theme/blue', //主题设置
                  'echarts/chart/bar' // 使用柱状图就加载bar模块
        ], function (ec, theme) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('bars'), theme);
            // 为echarts对象加载数据
            myChart.setOption(option);
        });
    });

    //饼图
    cb.rest.getJSON("ma/OrderStatistics/getOrderPriceByQuarter", function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        var json = data.data;
        if (json.prices != null) {
            var option = {
                title: {
                    text: '季度订货金额',
                    x: 'center',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: '#333',
                        fontFamily: "微软雅黑"
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#333',
                        fontFamily: "微软雅黑"
                    },
                    data: json.quarters
                },
                series: [{
                    name: '订货金额',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: json.prices
                }]
            };
            require([
                      'echarts',
                      'echarts/chart/pie' // 使用柱状图就加载bar模块
            ], function (ec) {
                // 基于准备好的dom，初始化echarts图表
                setTimeout(function () {
                    var myChart = ec.init(document.getElementById('pies'));
                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }, 50);
            });
        }
    });
};