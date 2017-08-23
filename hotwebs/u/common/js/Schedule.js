/// <reference path="../jquery/jquery.js" />
/// <reference path="Cube.js" />

cb.controls.Schedule = function (parent, id, datas) {
    ///<param name="parent" type="jQuery"></param>
    ///<param name='id' type='String'></param>
    ///<param name='datas' type='Array'></param>

    var _id = id || 'schedule_header';
    var parentcontrol = parent || $(document.body);

    var date = new Date();
    var dates = date.toDateString().split(' ');
    var _year = '';
    var _month = '';

    var _inittime = function (dates) {
        ///<param name='dates' type='Array'></param>
        var todayIndex = _gettodayindex(dates[0]);
        var todayWeek = dates[0];
        var todayMonth = dates[1];
        var todayDate = dates[2];
        var todayYear = dates[3];
        _year = todayYear;
        _month = _getMonth(todayMonth);

        var bigMonth = ['Jan', 'Mar', 'May', 'Jul', 'Aug', 'Oct', 'Dec'];
        var smallMonth = ['Apr', 'Jun', 'Sep', 'Nov'];
        var specialMonth = ['Feb'];

        var newDates = [];
        var tempDates = [];
        var endCount = 20 - todayIndex;
        var startCount = 14 + todayIndex;


        var markDate = todayDate;
        for (var endStart = 1; endStart <= startCount; endStart++) {
            var frontDate = markDate - 1;
            if (frontDate <= 0) {
                if (todayMonth == "Jan" || todayMonth == "Feb" || todayMonth == "Apr" || todayMonth == "Jun" || todayMonth == "Aug" || todayMonth == "Sep" || todayMonth == "Nov") {
                    frontDate = 31;
                    markDate = 31;
                }
                else if (todayMonth == "Mar") { markDate = 29; }
                else {
                    frontDate = 30;
                    markDate = 30;
                }

                tempDates.push(frontDate);
                markDate = frontDate;
            }
            else {
                tempDates.push(frontDate);
                markDate = frontDate;
            }
        }

        for (var i = tempDates.length - 1; i >= 0; i--) {
            newDates.push(tempDates[i]);
        }

        newDates.push(todayDate);
        var markEndDate = parseInt(todayDate);
        for (var i = 1; i <= endCount; i++) {
            var endDate = markEndDate + 1;
            if (todayMonth == "Jan" || todayMonth == "Mar" || todayMonth == "May" || todayMonth == "Jul" || todayMonth == "Aug" || todayMonth == "Oct" || todayMonth == "Dec") {
                if (endDate > 31)
                    endDate = 1;
            }
            else if (todayMonth == "Feb") {
                if (endDate > 28) {
                    endDate = 1;
                }
            }
            else {
                if (endDate > 30)
                    endDate = 1;
            }
            markEndDate = endDate;
            newDates.push(endDate);
        }

        var retobj = {
            'weeks': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            'dates': newDates,
            'todayIndex': todayIndex,
            'todaydate': todayDate,
        }
        return retobj;
    }

    var _gettodayindex = function (week) {
        ///<param name='week' type='String'></param>
        switch (week) {
            case "Mon":
                return 1;
            case "Tue":
                return 2;
            case "Wed":
                return 3;
            case "Thu":
                return 4;
            case "Fri":
                return 5;
            case "Sat":
                return 6;
            case "Sun":
                return 0;
            default:
                return 1;
        }
    }
    var _getMonth = function (month) {
        switch (month) {
            case "Jan":
                return '1月';
            case "Feb":
                return '2月';
            case "Mar":
                return '3月';
            case "Apr":
                return '4月';
            case "May":
                return '5月';
            case "Jun":
                return '6月';
            case "Jul":
                return '7月';
            case "Aug":
                return '8月';
            case "Sep":
                return '9月';
            case "Oct":
                return '10月';
            case "Nov":
                return '11月';
            case "Dec":
                return '12月';
            default:
                return '1月';
                break;
        }
    }

    var _initcontrol = function () {

        var dateobj = _inittime(dates);

        var $schedulediv = $('<div>');
        $schedulediv.addClass('schedulediv');
        var $datep = $('<a>');
        $datep.text(_year + "年" + _month);
        $datep.css('margin-top', '3px');
        $datep.css('color', 'lightblue');
        $datep.css('float', 'left');
        $datep.css('font-size', '16px');
        $datep.css('font-family', 'Microsoft YaHei UI');
        $schedulediv.append($datep);

        var $todayb = $('<b>');
        $todayb.text('今天');
        $todayb.css('float', 'left');
        $todayb.css('cursor', 'pointer');
        $todayb.css('font-size', '20px');
        $todayb.css('font-family', 'Microsoft YaHei UI');
        $todayb.css('color', 'lightblue');
        $schedulediv.append($todayb);

        var $addimg = $('<img>');
        $addimg.css('float', 'right');
        $addimg.css('cursor', 'pointer');
        $addimg.attr('src', 'common/images/add.png');

        $schedulediv.append($addimg);

        var $weekul = $('<ul>');
        $weekul.addClass('weekul');

        for (var i = 0; i < dateobj.weeks.length; i++) {

            var $weekli = $('<li>');
            $weekli.addClass('weekli');
            $weekli.text(dateobj.weeks[i]);

            if (i == 0 || i == 6)
                $weekli.addClass('weekrest');
            if (i == dateobj.todayIndex)
                $weekli.addClass('weektoday');

            $weekul.append($weekli);
            $schedulediv.append($weekul);
        }

        var $wrapperdiv = $('<div>');
        $wrapperdiv.addClass('schedulewrapper');
        $wrapperdiv.attr('id', 'schedulewrapper');
        var $iscroll = $('<div>');
        $iscroll.addClass('scheduleiscroll');

        var $dateul = $('<ul>');
        $dateul.addClass('dateul');
        for (var i = 0; i < dateobj.dates.length; i++) {
            var $dateli = $('<li>');
            $dateli.addClass('dateli');

            var $datea = $('<a>');
            $datea.text(dateobj.dates[i]);
            $dateli.append($datea);
            if (dateobj.todaydate == dateobj.dates[i])
                $datea.addClass('datetoday');
            $dateul.append($dateli);
        }
        $iscroll.append($dateul);
        $wrapperdiv.append($iscroll);
        $schedulediv.append($wrapperdiv);

        var $cleardiv = $('<div>');
        $cleardiv.css('clear', 'both');
        $schedulediv.append($cleardiv);
        parentcontrol.append($schedulediv);
    }
    _initcontrol();

    var myScroll1 = new IScroll('#schedulewrapper', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
    });
}

