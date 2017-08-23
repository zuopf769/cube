/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CustomerDetailApp_L.js" />
var CustomerDetailViewModel_Extend = {

    doAction: function (name, viewModel) {

        if (this[name]) this[name](viewModel);
    },

    init_Extend: function (viewModel) {

   
    },

    closeAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },

    // 选项卡查询
    customerSwitch: function (viewModel, args) {
       
        debugger;
        if (args == "" || args == null) {

            return;
        }
        if (args == "basicInformation") {  // 基本信息
            
            var symbol = viewModel.getSymbol();
            if (!symbol)
                return;
            var params = { "customerPk": "1001T1100000000000RX" };
            
            cb.data.CommonProxy(symbol).QueryByPK(params.customerPk, function (success, fail) {
                if (fail) {
                    
                    return;
                }

            });
          

        } else if (args == "dynamic") {    // 动态

            

        } else if (args == "saleOpp") {    // 销售机会
                        
            var model3D = viewModel.getsaleOppDataGrid();
            viewModel.getsaleOppDataGrid().setColumns(viewModel.getColumns());
            var data = {
                "fieldname": "1213",
                "fieldshowname": "test",
                "showorder": "1",
                "pk_entitycolumn_b": "1231235346",
                "fieldtype": "String",
                "fielddigit": "Number",
                "totalflag": true
            };
            var list = [];
            list.push(data);
            //viewModel.getsaleOppDataGrid().appendRow(data[0]);
            model3D.insertRow(0, data);
        } else if (args == "order") {     // 销售订单

            

        } else if (args == "sendOrder") {   // 发货单

            

        } else {

        }
        
       
    },
  
};