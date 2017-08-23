var DividedLineViewModel_Extend = {

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var data = cb.route.getViewPartParams(viewModel);
        var divideCol = data.detailInfo.divideCol;
        var dataSource = new Array();
        for (var i = 0; i < divideCol.length; i++) {
            var obj = {};
            obj.text = divideCol[i].text;
            obj.value = divideCol[i].columnName;
            obj.name = divideCol[i].columnName;
            dataSource.push(obj);
        }
        //[{ "name": "obsolete", "value": 0, "text": "数量" }]
        viewModel.getdivideCol().setDataSource(dataSource);
        viewModel.clear();
    },
    numberDivdieType: function (viewModel, args) {
        var numberDivideType = viewModel.getnumberDivdieType();
        numberDivideType.getDataSource().list[0].checked = true;
        numberDivideType.setValue("0");
        viewModel.getnumberDivide().set("Data", { readOnly: false, isfocus: true });
        viewModel.getlineDivide().set("Data", { readOnly: true, isfocus: false,value:"" });
        var lineDivideType = viewModel.getlineDivdieType();
        var data = lineDivideType.getDataSource().list[0];
        if (data.checked) {
            data.checked = false;
            lineDivideType.setValue("1");
        }
    },
    lineDivdieType: function (viewModel, args) {
        var lineDivideType = viewModel.getlineDivdieType();
        lineDivideType.getDataSource().list[0].checked = true;
        lineDivideType.setValue("0");
        viewModel.getnumberDivide().set("Data", { readOnly: true, isfocus: false,value:"" });
        viewModel.getlineDivide().set("Data", { readOnly: false, isfocus: true });
        var numberDivideType = viewModel.getnumberDivdieType();

        var data = numberDivideType.getDataSource().list[0];
        if (data.checked) {
            data.checked = false;
            numberDivideType.setValue("1");
        }
    },

    cancelAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }
    },

    closeAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }
    },
    submitAction: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var columnName = viewModel.getdivideCol().getValue();
        var numberIsCheck = viewModel.getnumberDivdieType().getDataSource().list[0].checked;
        var parentModel3d = params["model3d"];
        var focusedRow = parentModel3d.getFocusedRow();
        var returnData = {};
        returnData.divideCol = columnName;
        if (!columnName) {
            cb.util.tipMessage("请选择要拆分的列");
            return;
        }
        if (numberIsCheck)
        {
            returnData.divideType = "numberType";
            var numberDivide = viewModel.getnumberDivide().getValue();
            if (isNaN(numberDivide)) {
                cb.util.tipMessage("拆分数值应为数字");
                return;
            }//if
            if (isNaN(focusedRow[columnName]))
            {
                focusedRow[columnName] = 0;
            }
            if (parseFloat(focusedRow[columnName]) < parseFloat(numberDivide)) {
                cb.util.tipMessage("拆分数值大于当前列的值");
                return;
            }else{
                returnData.data = parseFloat(numberDivide);
            }//if
        } else {
            returnData.divideType = "lineType";
            var regex = /^[-]{0,1}[0-9]{1,}$/;
            var lineDivide = viewModel.getlineDivide().getValue();
            if (!isNaN(lineDivide)&&regex.test(lineDivide))
            {
                returnData.data = parseInt(lineDivide);
            } else {
                cb.util.tipMessage("行数应为整数");
                return;
            }
        }//if
        this.closeAction(viewModel);
        if (params["callBack"]) {
            params.callBack(true, {returnData:returnData});
        }//if
    },
};