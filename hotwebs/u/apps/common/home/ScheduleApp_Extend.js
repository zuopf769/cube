var ScheduleViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    createSchedule: function (viewModel) {
        cb.route.loadPageViewPart(viewModel, 'common.home.CRUDSchedule', { "width": '500px' });
    },

    saveSchedule: function (viewModel) {
    	var that = this;
        var data = viewModel.getkendoSchedule().getValue().event;
        debugger;
        var subparam = {};
        subparam.address = "用友软件园";
        // subparam.address = "用友软件园";
        subparam.state = '2'; //2015-05-28 14:43:34
        if (data.test) {
            subparam.id = data.test;
            subparam.state = "1"; //2015-05-28 14:43:34
        }
        if(!data.dirty){
        	return;
        }
        subparam.numberid = data.id;
        subparam.isAllDay = data.isAllDay || false;
        subparam.attachrelateid = data.attachrelateid;
        subparam.billdate = data.billdate || "2015-05-15 12:58:54";
        subparam.businessinfo = "businessinfo";
        subparam.description = data.description || "备注";
        subparam.ownerid = cb.rest.ApplicationContext.userCode;
        subparam.endtime = data.end.format('yyyy-MM-dd HH:mm:ss') || "2015-05-15 16:58:54";
        subparam.dr = "0";
        subparam.pk_group = cb.rest.ApplicationContext.groupID || "0001AA100000000000YJ";
        subparam.pk_org = cb.rest.ApplicationContext.orgId || "GLOBLE00000000000000";
        subparam.relatedbusinesstype = "1";
        subparam.remindertime = "2015-05-15 12:30:54";
        subparam.repeat = "Y";
        subparam.recurrenceexception = data.recurrenceException;
        subparam.recurrenceid = data.recurrenceId;
        subparam.recurrencerule = data.recurrenceRule ;
       //recurrenceRule: "FREQ=DAILY;COUNT=2"
        subparam.starttime = data.start.format('yyyy-MM-dd HH:mm:ss') || "2015-05-15 12:59:54";
        subparam.timedreminder = "1";
        subparam.title = data.title;
        var atendees ='';
        if(data.atendees){
        	for(var i=0,len=data.atendees;i<len;i++){
        		atendees[0]=data.atendees[i];
        	}
        }
        subparam.participants = atendees?atendees.toString():'';

        if (data.ts) {
            subparam.ts = data.ts;
        }

        viewModel.getProxy().PostSchedule(subparam, function (success, fail) {
            if (fail) {
                cb.util.tipMessage("保存失败");
            } else {
                cb.util.tipMessage("保存成功");
                //var currentDate = '1979-01-01';
        		//viewModel.getkendoSchedule().set("dateRange", { beginDate: currentDate, endDate: currentDate ,isOpen:true});
                that.changeSchedule(viewModel); 
            }
        });

    },
    deleteSchedule: function (viewModel) {
        var data = viewModel.getkendoSchedule().getValue().event;
        var subparam = {};
        var that = this;
        subparam.id = data.test;
        subparam.ts = data.ts;
        viewModel.getProxy().PostScheduleDelete(subparam, function (success, fail) {
            if (fail) {
                cb.util.tipMessage("删除失败");
            } else {
                cb.util.tipMessage("删除成功");
                 that.changeSchedule(viewModel); 
            }
        });
    },
    changeSchedule: function (viewModel) {
        var dateRange = viewModel.getkendoSchedule().get("dateRange");
        if (!dateRange || !dateRange.beginDate || !dateRange.endDate) return;
        viewModel.getProxy().GetScheduleList(dateRange, function (success, fail) {
            if (success) {
                var data = [];
                for (var i = 0; i < success.length; i++) {
                    if (success[i]) {
                        for (var j = 0; j < success[i].length; j++) {
                            data.push(success[i][j]);
                        }
                    }
                }
                viewModel.getkendoSchedule().setDataSource(data);
            }
        });
    },
    init_Extend: function (viewModel) {
        var currentDate = new Date().format("yyyy-MM-dd");
        viewModel.getkendoSchedule().set("dateRange", { beginDate: currentDate, endDate: currentDate });
        this.changeSchedule(viewModel);
    }
};