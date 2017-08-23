/// <reference path="../jquery/jquery.js" />
/// <reference path="Cube.js" />
/// <reference path="Cube.js" />
/// <reference path="Schedule.js" />

//cb.controls.TimeLineControl = function (parent, id, controltype, datas) {
//    ///<param name="id" type="String"></param>
//    ///<param name="datas" type="Array"></param>
//    ///<param name="controltype" type="String">['im','schedule','msgtask']</param>
//    ///<param name="parent" type="jQuery"></param>

//    //controltype ='im,schedule,msgtask'
//    var controlid = id || 'timeline_123';
//    var parent = $(parent) || $(document.body);
//    var controltype = controltype || "msgtask";
//    //this.initControl(parent, controlid, controltype, datas);
//}

cb.controls.TimeLineControl = function (ele, options) {

    this._id = ele || 'timeline_123';
    this._el = $("#" + ele);
}

cb.controls.TimeLineControl.prototype.controlType = "TimeLineControl";
cb.controls.TimeLineControl.prototype.controlTypeTag = "data-controlType";
cb.controls.TimeLineControl.prototype.propertyNameTag = "data-propertyname";

cb.controls.TimeLineControl.prototype.setMsg = function (datas) {
    ///<param name="datas" type="Object">datas</param>
    //this.initMsgTask(this._el, datas);
    this.initControl(this._el, this._id + 'ul', 'msgtask', datas);
}

cb.controls.TimeLineControl.prototype.setIm = function (datas) {
    //continued to do...
    debugger;
}

cb.controls.TimeLineControl.prototype.setSchedule = function (datas) {
    ///<param name='datas' type='Object'>datas</param>
    this.initControl(this._el, this._id + 'ul', 'schedule', datas);
    
}

cb.controls.TimeLineControl.prototype.initControl = function (parent, controlid, type, datas) {
    ///<param name="datas" type="Array"></param>
    ///<param name="parent" type="jQuery"></param>
    ///<param name="type" type="String"></param>

    var timelineUl = $('<ul>');
    timelineUl.attr('id', controlid);
    timelineUl.addClass('timeline');
    timelineUl.addClass('animated');

    switch (type) {

        case "im":
            this.initIm(timelineUl, datas);
            parent.append(timelineUl);
            break;
        case "schedule":
            var $schedule = $('<div>');
            $schedule.css('width', '560px');
            parent.append($schedule);
            this.initSchedule($schedule, timelineUl, datas);
            break;
        case "msgtask":
            this.initMsgTask(timelineUl, datas);
            parent.append(timelineUl);
            break;
        default:
            this.initMsgTask(parent, datas);
            break;
    }
}

cb.controls.TimeLineControl.prototype.initIm = function (parent, datas) {
    ///<param name="parent" type="jQuery"></param>
    ///<param name="datas" type="Array"></param>

    var imtype = ['wb', 'wechat', 'uu'];

    imtype.forEach(function (im, imindex, ims) {

        var $timelineLi = $('<li>');
        $timelineLi.addClass('active');
        $timelineLi.attr('id', 'timeline' + im);

        var $timelineicondiv = $('<div>');
        $timelineicondiv.addClass('timeline-icon');

        var $timelinecontentdiv = $('<div>');
        $timelinecontentdiv.addClass('timeline-content');
        $timelinecontentdiv.attr('id', 'timeline-content' + im);

        $timelineLi.append($timelineicondiv);
        $timelineLi.append($timelinecontentdiv);


        var filterdatas = datas.filter(function (data, dataindex, datas) {
            if (data['imtype'] == im) {
                return true;
            }
        }, []);

        var senders = [];//sender count
        var senderstrs = [];
        filterdatas.forEach(function (data, dataindex, datas) {
            if (senderstrs.indexOf(data['sender']) < 0) {
                //senders.push(data['sender']);
                senders.push({ 'sender': data['sender'], 'count': 1, 'msg': data['msg'], 'time': data['sendtime'] });
                senderstrs.push(data['sender']);
            }
            else {
                senders.filter(function (sender, senderindex, senders) {
                    if (sender['sender'] == data['sender']) { return true; }
                })[0]['count']++;
            }
        }, []);

        senders.forEach(function (sender, senderindex, senders) {

            var $imtitle = $('<h2>');
            $imtitle.css('float', 'left');
            $imtitle.css('clear', 'both');
            $imtitle.text(sender['sender'] + '(' + sender['count'] + ')');

            var $imtime = $('<h5>')
            $imtime.css('float', 'right');
            $imtime.css('color', 'lightgray');
            $imtime.text(sender['time']);

            var $immsg = $('<p>');
            $immsg.css('clear', 'both');
            $immsg.text(sender['msg']);

            var $imimg = $('<img>');
            $imimg.addClass('backimg');
            $imimg.attr('src', '../images/back.png');

            $timelinecontentdiv.append($imtitle);
            $timelinecontentdiv.append($imtime);
            $timelinecontentdiv.append($immsg);
            $timelinecontentdiv.append($imimg);

            if (senderindex == senders.length - 1) {
                var $cleardiv = $('<div>');
                $cleardiv.addClass('cleardiv');
                $timelinecontentdiv.append($cleardiv);
            }

        }, []);

        var cleardiv = $('<div>');
        cleardiv.css('clear', 'both');
        $timelineLi.append(cleardiv);
        parent.append($timelineLi);

    }, []);
}

cb.controls.TimeLineControl.prototype.initSchedule = function (schedulediv, timelineUl, datas) {
    ///<param name="parent" type="jQuery"></param>
    ///<param name="datas" type="Array"></param>
    
    timelineUl.addClass('timelineschedule');
    _initScheduleHeader(schedulediv);
    datas.forEach(function (data, dataindex, datas) {

        var $timelineli = $('<li>');
        $timelineli.addClass('active');

        var $timelineicon = $('<div>');
        $timelineicon.addClass('timelineschedule-icon');

        var $timelinecontent = $('<div>');
        $timelinecontent.addClass('timeline-content');
        $timelinecontent.addClass('schedulecontentdiv');

        $timelineli.append($timelineicon);
        $timelineli.append($timelinecontent);

        var $leftdiv = $('<div>');
        $leftdiv.addClass('schedulecontentleftdiv');

        var $starttime = $('<b>');
        $starttime.text(data['starttime']);
        $starttime.css('color', 'lightblue');
        $leftdiv.append($starttime);

        $leftdiv.append($('<br>'));

        var $endtime = $('<b>');
        $endtime.text(data['endtime']);
        $endtime.css('color', 'lightblue');
        $leftdiv.append($endtime);

        var $rigthdiv = $('<div>');
        $rigthdiv.addClass('schedulecontentrightdiv');

        if (data['time'] && data['time'] != '') {
            var $timep = $('<p>');
            $timep.css('margin-top', '5px');
            $timep.css('margin-bottom', '5px');
            $timep.text(data['time']);
            $rigthdiv.append($timep);
        }

        var $summaryp = $('<p>');
        $summaryp.css('margin-top', '5px');
        $summaryp.css('margin-bottom', '5px');
        $summaryp.text(data['title']);
        $rigthdiv.append($summaryp);

        var $addressp = $('<p>');
        $addressp.css('margin-top', '5px');
        $addressp.css('margin-bottom', '5px');
        $addressp.text(data['content']);
        $rigthdiv.append($addressp);

        $timelinecontent.append($leftdiv);
        $timelinecontent.append($rigthdiv);

        timelineUl.append($timelineli);

    });
    schedulediv.append(timelineUl);
}

var _initScheduleHeader = function (parent) {

    var scheduleHeader = new cb.controls.Schedule(parent, '', new Array());


}

cb.controls.TimeLineControl.prototype.initMsgTask = function (parent, datas) {
    ///<param name="parent" type="jQuery"></param>
    ///<param name="datas" type="Array"></param>
    if (datas && datas.args.length > 0) {

        datas.args.forEach(function (data, dataindex, datas) {
            if (data[1] && data[1].length > 0) {
                var $taskli = $('<li>');
                $taskli.addClass('active');
                var $taskicon = $('<div>');
                $taskicon.addClass('timeline-icon');
                $taskli.append($taskicon);
                var $taskcontent = $('<div>');
                $taskcontent.addClass('timeline-content');

                var $tasktitle = $('<h2>');
                $tasktitle.css('float', 'left');
                $tasktitle.text(data[0]['typename'] + "(" + data[1].length + ")");
                $taskcontent.append($tasktitle);
                $taskli.append($taskcontent);

                data[1].forEach(function (task, taskindex, tasks) {

                    var $taskmsg = $('<p>');
                    $taskmsg.text(task['subject']);
                    $taskmsg.css('float', 'left');
                    $taskmsg.css('clear', 'both');

                    var $tasktime = $('<p>');
                    $tasktime.text(task['sendtime']['utcTime']);
                    $tasktime.css('float', 'right');
                    //$tasktime.css('clear', 'both');

                    $taskcontent.append($taskmsg);
                    $taskcontent.append($tasktime);

                    if (taskindex == tasks.length - 1) {
                        var $cleardiv = $('<div>');
                        $cleardiv.addClass('cleardiv');
                        $taskcontent.append($cleardiv);
                    }
                }, []);
                parent.append($taskli);
            }

        }, []);

        //var tasks = [];
        //var tasktypes = [];
        //datas.forEach(function (data, dataindex, datas) {
        //    var type = data['tasktype'];
        //    var tasktitle = data['tasktitle'];
        //    if (tasktypes.indexOf(type) < 0) {
        //        var $taskli = $('<li>');
        //        $taskli.addClass('active');
        //        var $taskicon = $('<div>');
        //        $taskicon.addClass('timeline-icon');
        //        $taskli.append($taskicon);
        //        var $taskcontent = $('<div>');
        //        $taskcontent.addClass('timeline-content');
        //        $taskli.append($taskcontent);
        //        tasks.push({ 'tasktype': type, 'taskli': $taskli, 'taskcontent': $taskcontent, 'tasktitle': data['tasktitle'] });
        //        tasktypes.push(type);
        //        parent.append($taskli);
        //    }
        //}, []);
        //tasks.forEach(function (task, taskindex, tasks) {
        //    var filterdatas = datas.filter(function (data, dataindex, datas) {
        //        if (task['tasktype'] == data['tasktype']) return true;
        //    });
        //    var $tasktitle = $('<h2>');
        //    $tasktitle.css('float', 'left');
        //    $tasktitle.text(task['tasktitle'] + "(" + filterdatas.length + ")");
        //    task['taskcontent'].append($tasktitle);
        //    filterdatas.forEach(function (filterdata, filterdatainexe, filterdatas) {
        //        var $taskmsg = $('<p>');
        //        $taskmsg.text(filterdata['msg']);
        //        $taskmsg.css('float', 'left');
        //        $taskmsg.css('clear', 'both');
        //        var $tasktime = $('<p>');
        //        $tasktime.text(filterdata['sendtime']);
        //        $tasktime.css('float', 'right');
        //        //$tasktime.css('clear', 'both');
        //        task['taskcontent'].append($taskmsg);
        //        task['taskcontent'].append($tasktime);
        //        if (filterdatainexe <= filterdatas.length - 1) {
        //            var $cleardiv = $('<div>');
        //            $cleardiv.addClass('cleardiv');
        //            task['taskcontent'].append($cleardiv);
        //        }
        //    });
        //});
    }
}

var imtestdatas = [

    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '张国荣',
        'msg': '当年情',
        'sendtime': '20141012'

    },
    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '张国荣',
        'msg': 'aaaaaaaaaaaaaa',
        'sendtime': '20141012'
    },
    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '张国荣',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    },
    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': '当年情',
        'sendtime': '20141012'
    },
    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'aaaaaaaaaaaaaa',
        'sendtime': '20141012'
    },
    {
        'imtype': 'uu',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    },
     {
         'imtype': 'wechat',//uu,wechat,wb
         'sender': '张国荣',
         'msg': 'aaaaaaaaaaaaaa',
         'sendtime': '20141012'
     },
    {
        'imtype': 'wechat',//uu,wechat,wb
        'sender': '张国荣',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wechat',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': '当年情',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wechat',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'aaaaaaaaaaaaaa',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wechat',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wb',//uu,wechat,wb
        'sender': '张国荣',
        'msg': 'aaaaaaaaaaaaaa',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wb',//uu,wechat,wb
        'sender': '张国荣',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wb',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': '当年情',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wb',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'aaaaaaaaaaaaaa',
        'sendtime': '20141012'
    },
    {
        'imtype': 'wb',//uu,wechat,wb
        'sender': '陈楚生',
        'msg': 'bbbbbbbbbbbbbb',
        'sendtime': '20141012'
    }
];

var msgtasktestdatas = [
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'approve',
        'sendtime': '2014/10/12',
        'msg': '销售订单进入审批流,等待您的审批',
        'tasktitle': '我的审批任务'
    },
    {
        'tasktype': 'backvoucher',
        'sendtime': '2014/10/12',
        'msg': '销售订单已退回',
        'tasktitle': '被退回的单据'
    },
    {
        'tasktype': 'backvoucher',
        'sendtime': '2014/10/12',
        'msg': '销售订单已退回',
        'tasktitle': '被退回的单据'
    },
    {
        'tasktype': 'backvoucher',
        'sendtime': '2014/10/12',
        'msg': '销售订单已退回',
        'tasktitle': '被退回的单据'
    },
    {
        'tasktype': 'backvoucher',
        'sendtime': '2014/10/12',
        'msg': '销售订单已退回',
        'tasktitle': '被退回的单据'
    },
    {
        'tasktype': 'mymsg',
        'sendtime': '2014/10/12',
        'msg': '销售订单已审批',
        'tasktitle': '我的消息'
    },
    {
        'tasktype': 'mymsg',
        'sendtime': '2014/10/12',
        'msg': '销售订单已审批',
        'tasktitle': '我的消息'
    },
    {
        'tasktype': 'mymsg',
        'sendtime': '2014/10/12',
        'msg': '销售订单已审批',
        'tasktitle': '我的消息'
    },
    {
        'tasktype': 'mymsg',
        'sendtime': '2014/10/12',
        'msg': '销售订单已审批',
        'tasktitle': '我的消息'
    },
];

var scheduletestdatas = [

    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    },
    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    },
    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    },
    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    },
    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    },
    {
        'time': '大前天 ',
        'address': '第一会议室',
        'summary': '需求定义',
        'starttime': '11:00',
        'endtime': '13:00'
    }
];