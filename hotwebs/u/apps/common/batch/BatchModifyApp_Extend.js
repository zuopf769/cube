var BatchModifyViewModel_Extend = {

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.clear();
    },
    

    cancelAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }
    },

    closeAction: function (viewModel) {
        try {cb.route.hidePageViewPart(viewModel);}
        catch (e) { }
    },
    submitAction: function (viewModel) {
        var reqData = cb.route.getViewPartParams(viewModel);
        var fields =  viewModel.get();
        var returnData = {};
        for (var property in fields)
        {
            if (property == 'AppId' || property == 'ViewModelName' || property == 'cancelAction'
                || property == 'closeAction' || property == 'isCondition' || property == 'submitAction')
            {
                continue;
            }
            var field = viewModel.get(property);
            var value;
            if(typeof field == "object")
            {
                value = field.getValue();
            }
            if (value)
            {
                returnData[property] = value;
            } else {
                returnData[property] = 'unchanged';  //约定，如果批改界面没有对该字段进行修改则返回给主页面时该字段的value设置成unchanged
            }
        }
        this.closeAction(viewModel);
        if (reqData['callback'])
        {
            reqData.callback(true,returnData);
        }
    },
};