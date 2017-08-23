/// <reference path="Cube.js" />
/// <reference path="Control.js" />

cb.controls.widget('SimpleList', function (controlType) {

    var _id;
    var $ul;
    var _dataType;
    var control = function (id, options) {

        _id = id;
        $ul = $("#" + id);
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;
    control.prototype.getValue = function () {
        return "SimpleListValue";
    }
    control.prototype.setData = function (data) {
        ///<param name='data' type='Object'>data</param>
        debugger;
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    }
    control.prototype.setDataSource = function (datas) {
        ///<param name="datas" type="Array">datas</param>
        $ul.empty();
        if (datas && datas.length > 0) {
            datas.forEach(function (data, dataindex, datas) {

                switch (_dataType) {

                    case 'schedule':
                        var $li = $('<li>');
                        var $timebox = $('<div>');
                        $timebox.text('11:00');
                        var $contentBox = $('<div>');
                        $contentBox.text('content');
                        $li.append($timebox);
                        $li.append($contentBox);
                        if ($ul)
                            $ul.append($li);
                        break;
                    case 'task':
                        var $li = $('<li>')
                        var $checkbox = $('<checkbox>');
                        $checkbox.text('test');
                        $checkbox.val('testValue');
                        $li.append($checkbox);
                        if ($ul)
                            $ul.append($li);
                        break;
                    default:
                        break;
                }


            });
        }
    }
    control.prototype.setDataType = function (type) {
        if (type)
            _dataType = type;
    }
    control.prototype.on = function (eventName, func, context) {
        ///<param name="eventName" type="String">eventName</param>
        var me = this;
        if (eventName.indexOf("on") == 0)
            eventName = eventName.substr(2);
        this.getElement().on(eventName, function (e, args) {
            func.call(context, me.getValue());
        });
    }
    return control;
});