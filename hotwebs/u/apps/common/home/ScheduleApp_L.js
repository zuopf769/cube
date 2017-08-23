var ScheduleViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ScheduleViewModel");
    this.init();
};
ScheduleViewModel.prototype = new cb.model.ContainerModel();
ScheduleViewModel.prototype.constructor = ScheduleViewModel;

ScheduleViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "IndividualCenterViewModel",
		tabMenu: new cb.model.SimpleModel(),
        CenterInformation:new cb.model.SimpleModel({dataSource:{userName:"lugza",integrate:"888",imgUrl:"/pc/images/menu/u32.png",CenterUrl:"common.home.IndividualCenterApp",MySettingUrl:'common.home.MySettingApp'}}),
		kendoSchedule: new cb.model.SimpleModel(),
		savePwd: new cb.model.SimpleModel(),
		createSchedule: new cb.model.SimpleModel(),
		prevPage: new cb.model.SimpleModel(),
		nextPage: new cb.model.SimpleModel(),
		scheduleYear: new cb.model.SimpleModel(),
		scheduleDate: new cb.model.SimpleModel(),
		backToday: new cb.model.SimpleModel(),
		ScheduleType: new cb.model.SimpleModel({   fieldType: 'text', 
												dataSource: [
												{ text: "按日查询", value: "day", isSelected: true }, 
												{ text: "按周查询", value: "week" }, 
												{ text: "按月查询", value: "month" }
												] 
											}),
		
	};

    this.setData(fields);
    this.setDirty(false);//deleteSchedule
    //this.getlistMenu().on("click", function (args) { IndividualCenterViewModel_Extend.menuItemClick(this.getParent(), args); });
	this.getsavePwd().on("click", function (args) { ScheduleViewModel_Extend.savePwd(this.getParent(), args); });
	this.getprevPage().on("click", function (args) { ScheduleViewModel_Extend.prevPage(this.getParent(), args); });
	this.getnextPage().on("click", function (args) { ScheduleViewModel_Extend.nextPage(this.getParent(), args); });
	this.getbackToday().on("click", function (args) { ScheduleViewModel_Extend.backToday(this.getParent(), args); });
	this.getcreateSchedule().on("click", function (args) { ScheduleViewModel_Extend.createSchedule(this.getParent(), args); });
	this.getScheduleType().on("afterchange", function (args) { ScheduleViewModel_Extend.ScheduleType(this.getParent(), args); });
	this.getkendoSchedule().on('save',function(args){ScheduleViewModel_Extend.saveSchedule(this.getParent(), args); });
	this.getkendoSchedule().on('deleteSchedule',function(args){ScheduleViewModel_Extend.deleteSchedule(this.getParent(), args); });
	this.getkendoSchedule().on('change',function(args){ScheduleViewModel_Extend.changeSchedule(this.getParent(), args); });

    var proxyConfig = {
        PostChangePwd:     { url: "/u8services/classes/UAP/com.yonyou.u8.framework.server.core.U8UAPServiceFacade?method=updatePassWord", method: "Post"},
        GetScheduleList: { url: "classes/General/Schedule/QueryScheduleByDate", method: "Post" },
        PostSchedule: { url: "classes/General/Schedule/Save", method: "Post" },
        PostScheduleDelete: { url: "classes/General/Schedule/Delete", method: "Post" }
       
       ///classes/General/Schedule/QueryScheduleByDate
       // GetMessages: { url: "classes/Message/UAP/QueryOverView?method=GetMenu", method: "Get" }
    };
  


    this.setProxy(proxyConfig);

    ScheduleViewModel_Extend.doAction("init_Extend", this);
};