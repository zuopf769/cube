/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CodeLevel_L.js" />
var flag = true;
var CodeLevelViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    level: null,
    codeLength: null,
    code: null,
    init_Extend: function (viewModel) {
        var param = {};
        viewModel.getsaveAction().setState('disabled', true);
        viewModel.getcancelAction().setState('disabled', true);
        viewModel.getProxy().QueryAllCodeLevel(param, function (success, fail) {
            if (success) {
                success.forEach(function (item, index) {
                    item.isenabled = '' + item.isenabled;
                });
                viewModel.getcodeGrid().setDataSource(success)
            }
        });
        //var data =  { "success": [{ "pk_codelevel": "0001ZZ10000000002AOT", "maxlength": 44, "maxlevel": 13, "coderule": "3/2/4/0/3", "isenabled": true, "displayname": "会计科目基本信息编码级次", "fullclassname": null }, { "pk_codelevel": "0001ZZ10000000002AOU", "maxlength": 23, "maxlevel": 9, "coderule": "4/3/5/7", "isenabled": true, "displayname": "经济行业编码级次", "fullclassname": null }, { "pk_codelevel": "0001ZZ10000000002AOV", "maxlength": 15, "maxlevel": 8, "coderule": "2/2/5/2", "isenabled": true, "displayname": "地区分类编码级次", "fullclassname": null }, { "pk_codelevel": "0001ZZ10000000002AOW", "maxlength": 33, "maxlevel": 6, "coderule": "7/6/3/2", "isenabled": false, "displayname": "客户分类编码级次", "fullclassname": null }, { "pk_codelevel": "0001ZZ10000000002AOX", "maxlength": 16, "maxlevel": 10, "coderule": "2/8/3", "isenabled": false, "displayname": "存货大类编码级次", "fullclassname": null }, { "pk_codelevel": "0001ZZ10000000002AOY", "maxlength": 24, "maxlevel": 13, "coderule": "3/2/7", "isenabled": false, "displayname": "供应商基本分类编码级次", "fullclassname": null }], "fail": null };
        //viewModel.getcodeGrid().setDataSource(data.success);
    },
    codeGridAction: function (viewModel, args) {
        if (args.field && args.field == 'coderule') {
            var codeArray = [];
            var reg = /^[0-9]*[1-9][0-9]*$/;
            if (!args.value) return;
            codeArray.push(args.value.split("/"));
            var array = 0;
            var codeIndex = 0;
            var codeerror = "";
            codeArray[0].forEach(function (item, index) {
                if (reg.test(item) == false) {
                    codeerror += (index + 1) + '级'
                }
                array += parseInt(item);
                codeIndex = index + 1;
            });
            if (codeerror != "") {
                cb.util.warningMessage('第' + codeerror + '输入错误,请输入正整数,用/分隔')
            }
            level = viewModel.getcodeGrid().getRow(args.index).maxlevel;
            codeLength = viewModel.getcodeGrid().getRow(args.index).maxlength;
            if (array > codeLength) {
                cb.util.warningMessage('级别长度的总和不能超过' + codeLength)
            }
            if (codeIndex > level) {
                cb.util.warningMessage('级别数的总和不能超过' + level)
            }
        }
       
    },
    editAction: function (viewModel, args) {
        viewModel.getcodeGrid().setState('readOnly', false);
        viewModel.getsaveAction().setState('disabled', false);
        viewModel.geteditAction().setState('disabled', true);
        viewModel.getcancelAction().setState('disabled', false);
        var gridRow = viewModel.getcodeGrid().getRows();
        gridRow.forEach(function (item, index, grid) {
        });
    },
    cancelAction:function(viewModel, args){
    	debugger;
    	var param = {};
            viewModel.getProxy().QueryAllCodeLevel(param, function (success, fail) {
                if (success) {
                    success.forEach(function (item, index) {
                        item.isenabled = '' + item.isenabled;
                    });
                    viewModel.getcodeGrid().setDataSource(success)
                }
            });
         viewModel.geteditAction().setState('disabled', false);
         viewModel.getsaveAction().setState('disabled', true);
         viewModel.getcancelAction().setState('disabled', true);   
        //this.buttonStateManager(viewModel);
    },
    saveAction: function (viewModel, args) {
       
        /// <param name='viewModel' type='CodeLevelViewModel'></param>
        var param = viewModel.collectData().codeGrid;
        viewModel.getProxy().UpdateCodeLevel(param, function (success, fail) {
            if (success) {
                viewModel.getcodeGrid().setDataSource(success);
                cb.util.tipMessage('保存成功');
                viewModel.geteditAction().setState('disabled', false);
                viewModel.getsaveAction().setState('disabled', true);
                viewModel.getcancelAction().setState('disabled', true);
                viewModel.setReadOnly(true);
            }
            else {
                cb.util.warningMessage(fail);
                viewModel.geteditAction().setState('disabled', true);
                viewModel.getsaveAction().setState('disabled', false);
                viewModel.getcancelAction().setState('disabled', false);
                viewModel.setReadOnly(false);
            }
            
            var param = {};
            viewModel.getProxy().QueryAllCodeLevel(param, function (success, fail) {
                if (success) {
                    success.forEach(function (item, index) {
                        item.isenabled = '' + item.isenabled;
                    });
                    viewModel.getcodeGrid().setDataSource(success)
                }
            });
        })
    }
};
$("body").css("width", $(window).width());