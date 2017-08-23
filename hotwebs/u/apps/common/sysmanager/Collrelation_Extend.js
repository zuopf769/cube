/// <reference path="../../../common/js/Cube.js" />
/// <reference path="Collrelation_L.js" />
var CollrelationViewModel_Extend ={

    doAction: function (name,viewModel) {
        if (this[name]) {
            this[name](viewModel);
        }
    },
    init_Extend: function (viewModel) {
        ///<param name="viewModel" type="CollrelationViewModel"></param>
        var Data = [{ text: "销售组织", value: "sale1" }]
        var Data1 = [
            { text: "山东文登曲轴总厂", value:"001"},
            { text: "山东文登曲轴总厂", value: "002" },
            { text: "山东文登曲轴总厂", value: "002" },
            { text: "山东文登曲轴总厂", value: "002" },
        ];
        viewModel.getsaleOrganization().setValue(Data[0].text);
        viewModel.getorganizationList().setDataSource(Data1);
        
},
    addAction:function(viewModel,args){
        cb.route.loadPageViewPart(viewModel,'common.sysmanager.NewDeliveryOrganization',{width:"610px",height:"70%"})
    },
    CollCustomListAction:function(viewModel,args){
        cb.route.loadPageViewPart(viewModel,'common.sysmanager.ParameterSettingApp',{width:"610px",height:"70%"})
    }

};
$("body").css("width", $(window).width());
