/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var LanguageExtensionViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var data = {
            busicentercode: cb.route.getViewPartParams(viewModel).appCode
        };
        viewModel.getProxy().getBusiCenterLanguageVOs(data, function (success,fail) {
            if (success) {
                var succ=[];
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json.text=success[i].dislpayname;
                    json.code = success[i].langcode;
                    json.langseq = success[i].langseq;
                    succ.push(json);
                }
                viewModel.getLanguagesList().setDataSource(succ);
            }
        });
        //语言名称，语言编码不可编辑
        var model3d= viewModel.getModel3D();
        model3d.setState('checks', {editable:function (rowIndex, feild){
            if(feild == "text" || feild == "code" ) return false;
            //if(rowIndex<2) return true;
        }})
    },
    cancelAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    confirmAction: function (viewModel) {
        var index = viewModel.getLanguagesList().getPageSelectedIndexs();
        if (index.length == 0) {
            alert("请选择要扩展的语种");
        }
        else {
            var data = viewModel.getLanguagesList().getPageSelectedRows(index);
            var data1 = [];
            for (var i = 0; i < data.length; i++) {
                var json = {};
                json.langcode = data[i].code;
                json.langseq = data[i].langseq;
                data1.push(json);
            }
            var param = {
                busicentercode: cb.route.getViewPartParams(viewModel).appCode,
                langcodes: data1
            };
            viewModel.getProxy().updateDBML(param, function (success,fail) {
                if (success) {
                    alert("语言扩展成功");
                    cb.route.hidePageViewPart(viewModel);
                }
                else {
                    alert(fail.error);
                }
            });
        }
        },
};


