/// <reference path="../Control.js" />
cb.controls.widget("ScheduleBox", function (controlType) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };


    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;


    // 设置数据
    control.prototype.setData = function (data) {
        cb.loader.initLanguage();

        var defaultOptions = {
            cubeControl: this,
            allDaySlot: false,
            showWorkHours: true,
            messages: {
                showWorkDay: "显示工作时间",
                showFullDay: "显示全部时间"
            },
            views: ["day", "week", "month"],
            		    eventTemplate:'<div>Title: #: title #</div><div>Atendees:# for (var i = 0; i < resources.length; i++) { ##: resources[i].text ## } #</div>',
//          schema: {
//		       model: {
//		         id: "ID",
//		         fields: {
//		           ID: { type: "string" },
//		           title: { field: "Title", defaultValue: "No title", validation: { required: true } },
//		           start: { type: "date", field: "Start" },
//		           end: { type: "date", field: "End" },
//		           description: { field: "Description" },
//		           recurrenceId: { from: "RecurrenceID" },
//		           recurrenceRule: { from: "RecurrenceRule" },
//		           recurrenceException: { from: "RecurrenceException" },
//		           ownerId: { field: "OwnerID", defaultValue: 1 },
//		           isAllDay: { type: "boolean", field: "IsAllDay" },
//		           atendees:{ field: "atendees" },
//		         }
//		      }
//		    },

        	resources: [
			    {
			      field: "atendees",
			      dataSource: [
			       { value: 1, text: "Alex" },
			       { value: 2, text: "Bob" }
			      ],
			      multiple: true
			    }
			  ]
        };

        var myOptions = $.extend(defaultOptions, data);
        this.getElement().kendoScheduler(myOptions);
        var scheduler = this.getElement().data("kendoScheduler");
        scheduler.bind("save", function (e, args) {
            if (e.event == null)
                e.event(null);
            this.options.cubeControl.execute("save", e);
            scheduler.refresh();
        });
        scheduler.bind("moveEnd", function (e, args) {
            if (e.event == null)
                e.event(null);
            this.options.cubeControl.execute("save", e);
        });
        scheduler.bind("remove", function (e, args) {
            if (e.event == null)
                e.event(null);
            this.options.cubeControl.execute("delete", e);
            //scheduler.removeEvent(e.event);
        });
        scheduler.bind("dataBinding", function (e, args) {
            if (e == null)
                e.event(null);
            this.options.cubeControl.execute("change", { beginDate: this.view()._startDate.format("yyyy-MM-dd"), endDate: this.view()._endDate.format("yyyy-MM-dd") });
        });


        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };
    control.prototype.setDataSource = function (dataSource) {
        if (dataSource) {
            var data = [];
            for (var i = 0, len = dataSource.length; i < len; i++) {
                var item = {};
				item.id = dataSource[i].numberid;
                item.uid = dataSource[i].scheduleuid ;
                item.start = new Date(dataSource[i].starttime);
                item.end = new Date(dataSource[i].endtime);
                item.isAllDay = dataSource[i].allday;
                item.description = dataSource[i].description;
                item.title = dataSource[i].title;
                item.ts = dataSource[i].ts;
                item.test = dataSource[i].id;
                item.endTimezone = dataSource[i].endTimezone;
                item.startTimezone = dataSource[i].startTimezone;
                item.recurrenceId = dataSource[i].recurrenceid;
                item.ownerid = dataSource[i].ownerid;
                item.recurrenceException = dataSource[i].recurrenceexception;
                item.recurrenceRule = dataSource[i].recurrencerule;
                item.atendees = dataSource[i].participants?dataSource[i].participants.split(","):[1,2];
                data.push(item);
            }
            var scheduler = this.getElement().data("kendoScheduler");
            //scheduler.dataSource(data);	
            //new kendo.data.SchedulerDataSource({data:data});
            scheduler.setDataSource(new kendo.data.SchedulerDataSource({ data: data }));
        }
        //  	var dataSource = new kendo.data.SchedulerDataSource({
        //			  data: [
        //			    {
        //			      id: 1,
        //			      start: new Date("2013/6/6 08:00 AM"),
        //			      end: new Date("2013/6/6 09:00 AM"),
        //			      title: "Interview"
        //			    }
        //			  ]
        //			});
        //		scheduler.setDataSource(dataSource);
        //  	   
    }

    /*
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var scheduler = this.getElement().data("kendoScheduler");
        return scheduler.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var scheduler = this.getElement().data("kendoScheduler"); 
        return scheduler.setOptions(val);
    }


    return control;
});