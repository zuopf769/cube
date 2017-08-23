// 业务系统账套
var accountData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": [
      {
          "code": "develop",
          "name": "开发帐套",
          "effectDate": "2015-03-18 00:00:00",
          "expireDate": "2016-03-17 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "develop",
          "name": "开发帐套",
          "effectDate": "2015-03-18 00:00:00",
          "expireDate": "2016-03-17 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "develop",
          "name": "开发帐套",
          "effectDate": "2015-03-17 00:00:00",
          "expireDate": "2016-03-16 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "u8",
          "name": "u8",
          "effectDate": "2014-10-15 00:00:00",
          "expireDate": "2016-10-15 00:00:00",
          "isLocked": false,
          "dataSourceName": "local"
      },
      {
          "code": "nc63",
          "name": "nc63",
          "effectDate": "2014-10-15 00:00:00",
          "expireDate": "2016-10-15 00:00:00",
          "isLocked": false,
          "dataSourceName": "uap"
      },
      {
          "code": "test",
          "name": "test",
          "effectDate": "2015-03-18 00:00:00",
          "expireDate": "2016-03-19 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "33",
          "name": "33",
          "effectDate": "2015-03-18 00:00:00",
          "expireDate": "2015-03-31 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "design11",
          "name": "测试1",
          "effectDate": "2015-03-13 00:00:00",
          "expireDate": "2015-11-11 00:00:00",
          "isLocked": false,
          "dataSourceName": "design"
      },
      {
          "code": "develop101",
          "name": "测试2",
          "effectDate": "2015-03-18 00:00:00",
          "expireDate": "2015-12-10 00:00:00",
          "isLocked": false,
          "dataSourceName": "local"
      }
    ],
        "fail": null
    },
    "tempResultData": null
};

// 系统管理账套
var accountDataSys = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": [
      {
          "code": "0000",
          "name": "系统管理",
          "effectDate": "1900-01-01 00:00:00",
          "expireDate": "9999-01-01 00:00:00",
          "isLocked": false,
          "dataSourceName": ""
      }
    ],
        "fail": null
    },
    "tempResultData": null
};

var getAccountData = function (isSys) {
    var data = isSys == "true" ? accountDataSys : accountData;
    return data;
};

var loginData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": {
            "token": "50d2cb9e66b843a0ba3265f68f962cc9",
            "loginDate": "2015-03-19",
            "userID": "1001A410000000000005",
            "userCode": "u1",
            "lang": "",
            "accountCode": "develop",
            "dataSourceName": "design"
        },
        "fail": null
    },
    "tempResultData": null
};

var loginDataSys = {};

var getLoginData = function (isSys) {
    var data = isSys == "true" ? loginDataSys : loginData;
    return data;
};

var menuData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": [
      {
          "appId": "u8.upquotation",
          "funcCode": "U8100120",
          "menuCode": "U81098",
          "displayName": "报价单",
          "url": "page.jsp?app=u8.upquotationListApp",
          "image": "u8report.png",
          "bgcolor": "EB998C",
          "isSwing": false
      },
      {
          "appId": "u8.somain",
          "funcCode": "U8100116",
          "menuCode": "U81016",
          "displayName": "订单",
          "url": "page.jsp?app=u8.somainListApp",
          "image": "u8report.png",
          "bgcolor": "6AC0C5",
          "isSwing": false
      },
      {
          "appId": "u8.Dispatchlist",
          "funcCode": "U8100117",
          "menuCode": "U81017",
          "displayName": "发货单",
          "url": "page.jsp?app=u8.DispatchlistListApp",
          "image": "u8report.png",
          "bgcolor": "F09091",
          "isSwing": false
      },
      {
          "appId": "u8.saleout",
          "funcCode": "U8100118",
          "menuCode": "U81018",
          "displayName": "出库单",
          "url": "page.jsp?app=u8.saleoutListApp",
          "image": "u8report.png",
          "bgcolor": "EB997C",
          "isSwing": false
      },
      {
          "appId": "u8.invoice",
          "funcCode": "U8100119",
          "menuCode": "U81019",
          "displayName": "发票",
          "url": "page.jsp?app=u8.invoiceListApp",
          "image": "u8report.png",
          "bgcolor": "EB993C",
          "isSwing": false
      },
      {
          "appId": "u8column",
          "funcCode": "UP0101L",
          "menuCode": "UP010101",
          "displayName": "列表栏目设置",
          "url": null,
          "image": "UAP.png",
          "bgcolor": "6AC0C5",
          "isSwing": false
      },
      {
          "appId": "pushbill",
          "funcCode": "U8100201",
          "menuCode": "U82001",
          "displayName": "发货单出库",
          "url": "page.jsp?app=common.pull.CommonPullListSingleApp&srcBillType=U817&targetBillType=U818&columnCode=u8_dispatchlistheadbody&mainColumnCode=u8_dispatchlists&subColumnCode=u8_dispatchlistdetails&symbol=u8.Dispatchlist&bd=0",
          "image": "u8report.png",
          "bgcolor": "EB193C",
          "isSwing": false
      },
      {
          "appId": "u8.saletype",
          "funcCode": "U8100102",
          "menuCode": "U81099",
          "displayName": "销售类型",
          "url": "page.jsp?app=u8.saletypeListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB197C",
          "isSwing": false
      },
      {
          "appId": "u8.customer",
          "funcCode": "U8100109",
          "menuCode": "U81009",
          "displayName": "客户",
          "url": "page.jsp?app=u8.customerListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.customerclass",
          "funcCode": "U8100108",
          "menuCode": "U81008",
          "displayName": "客户分类",
          "url": "page.jsp?app=u8.customerclassListApp",
          "image": "u8report.png",
          "bgcolor": "EB447C",
          "isSwing": false
      },
      {
          "appId": "tt.Schedule",
          "funcCode": "TT0101",
          "menuCode": "TT0101",
          "displayName": "日历日程",
          "url": "page.jsp?app=tt.Schedule",
          "image": "tt-Schedule.png",
          "bgcolor": "6AC0C5",
          "isSwing": false
      },
      {
          "appId": "u8.purchaseorder",
          "funcCode": "U8100121",
          "menuCode": "U81021",
          "displayName": "采购订单",
          "url": "page.jsp?app=u8.purchaseorderListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB197C",
          "isSwing": false
      },
      {
          "appId": "u8.closebill",
          "funcCode": "U8100122",
          "menuCode": "U81022",
          "displayName": "收款单据",
          "url": "page.jsp?app=u8.closebillListApp",
          "image": "u8report.png",
          "bgcolor": "6AC0C5",
          "isSwing": false
      },
      {
          "appId": "u8.tssaleout",
          "funcCode": "U8100123",
          "menuCode": "U81023",
          "displayName": "采购入库单",
          "url": "page.jsp?app=u8.tssaleoutListApp",
          "image": "u8report.png",
          "bgcolor": "CB92BD",
          "isSwing": false
      },
      {
          "appId": "u8.rdstyle",
          "funcCode": "U8100101",
          "menuCode": "U81001",
          "displayName": "出库类别",
          "url": "page.jsp?app=u8.rdstyleListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB197C",
          "isSwing": false
      },
      {
          "appId": "u8.inventoryclass",
          "funcCode": "U8100113",
          "menuCode": "U81013",
          "displayName": "存货大类",
          "url": "page.jsp?app=u8.inventoryclassListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB197C",
          "isSwing": false
      },
      {
          "appId": "u8.inventory",
          "funcCode": "U8100114",
          "menuCode": "U81014",
          "displayName": "存货",
          "url": "page.jsp?app=u8.inventoryListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB197C",
          "isSwing": false
      },
      {
          "appId": "u8.person",
          "funcCode": "U8100106",
          "menuCode": "U81006",
          "displayName": "业务员",
          "url": "page.jsp?app=u8.personListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.accinformationgroup",
          "funcCode": "U8100115",
          "menuCode": "U81015",
          "displayName": "选项参数",
          "url": "page.jsp?app=u8.accinformationgroupListApp",
          "image": "tt-Schedule.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.warehouse",
          "funcCode": "U8100107",
          "menuCode": "U81007",
          "displayName": "仓库",
          "url": "page.jsp?app=u8.warehouseListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.foreigncurrency",
          "funcCode": "U8100110",
          "menuCode": "U81010",
          "displayName": "币种",
          "url": "page.jsp?app=u8.foreigncurrencyListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.ComputationGroup",
          "funcCode": "U8100111",
          "menuCode": "U81011",
          "displayName": "计量单位组",
          "url": "page.jsp?app=u8.ComputationGroupListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "u8.Computation",
          "funcCode": "U8100112",
          "menuCode": "U81012",
          "displayName": "计量单位",
          "url": "page.jsp?app=u8.ComputationListApp",
          "image": "u8report.png",
          "bgcolor": "EB497C",
          "isSwing": false
      },
      {
          "appId": "settlement",
          "funcCode": "U8100130",
          "menuCode": "U81030",
          "displayName": "结算",
          "url": "apps/u8/settlementListApp_L.html",
          "image": "u8report.png",
          "bgcolor": "68C7ED",
          "isSwing": false
      },
      {
          "appId": "InterfaceTest",
          "funcCode": "UP0104A",
          "menuCode": "UP010401",
          "displayName": "接口测试",
          "url": "interfaceList.html",
          "image": "InterfaceTest.png",
          "bgcolor": "68C5ED",
          "isSwing": false
      },
      {
          "appId": "u8report",
          "funcCode": "UP0105A",
          "menuCode": "UP010501",
          "displayName": "报表测试",
          "url": "report/reportList.jsp",
          "image": "u8report.png",
          "bgcolor": "68C5ED",
          "isSwing": false
      },
      {
          "appId": "interfaces",
          "funcCode": "RP100103",
          "menuCode": "RP0103",
          "displayName": "接口测试",
          "url": "interfaceList.html",
          "image": "u8report.png",
          "bgcolor": "68C5ED",
          "isSwing": false
      },
      {
          "appId": "webvm",
          "funcCode": "RP100104",
          "menuCode": "RP0104",
          "displayName": "生成模板",
          "url": "vm/templetList.jsp",
          "image": "u8report.png",
          "bgcolor": "68C5ED",
          "isSwing": false
      },
      {
          "appId": "u8report",
          "funcCode": "RP100101",
          "menuCode": "RP0101",
          "displayName": "报表",
          "url": "report/reportList.jsp",
          "image": "u8report.png",
          "bgcolor": "CB92BD",
          "isSwing": false
      },
      {
          "appId": "vercancel",
          "funcCode": "U8100124",
          "menuCode": "U81024",
          "displayName": "核销",
          "url": "apps/u8/varcancelListApp_L.html",
          "image": "u8report.png",
          "bgcolor": "68C7ED",
          "isSwing": false
      }
    ],
        "fail": null
    },
    "tempResultData": null
};

var menuDataSys = {};

var getMenuData = function (isSys) {
    var data = isSys == "true" ? menuDataSys : menuData;
    return data;
};

var templateListData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": [
      {
          "id": "888061bc-eacb-4a13-8d4a-edcb648fbf5c",
          "iSequence": 0,
          "name": "DispatchlistApp_List",
          "title": "DispatchlistApp_List_1280776172",
          "layoutMode": "Fluid",
          "screenSize": "L",
          "tplName": "vouchers",
          "viewModelId": "7c80263f-de50-44fd-9c8a-30f71bf566b8",
          "isDefault": 1
      }
    ],
        "fail": null
    },
    "tempResultData": null
};

var templateCardData = {
    "code": 200,
    "error": null,
    "stack": null,
    "data": {
        "success": [
      {
          "id": "35ebe610-19e1-44b9-ab5c-b42acbf959c7",
          "iSequence": 0,
          "name": "DispatchlistApp_Card1",
          "title": "DispatchlistApp_Card_787809375",
          "layoutMode": "Fluid",
          "screenSize": "L",
          "tplName": "voucher",
          "viewModelId": "7c80263f-de50-44fd-9c8a-30f71bf566b8",
          "isDefault": 1
      }
    ],
        "fail": null
    },
    "tempResultData": null
};

var getTemplateData = function (displayMode) {
    return displayMode == "list" ? templateListData : templateCardData;
};

var getInvalidTokenJson = function () {
    return {
        "code": 501,
        "error": "请求的token异常",
        "stack": null,
        "data": null,
        "tempResultData": null
    };
};

if (typeof exports !== "undefined") {
    module.exports = {
        getAccountData: getAccountData,
        getLoginData: getLoginData,
        getMenuData: getMenuData,
        getTemplateData: getTemplateData,
        getInvalidTokenJson: getInvalidTokenJson
    };
};