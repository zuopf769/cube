cb.controls.widget("ProcessBar", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrValue = data[attr];
            if (attr == "dataSource") {
                this.setDataSource(attrValue);
            }
        }
    };

    control.prototype.setDataSource = function (data) {
        this.getElement().empty();
        if (!cb.isArray(data) || data.length == 0)
        {
            var $noProcessInfoDiv = $("<div style='display:block;text-align:center;'>暂无审批历史信息！</div>");
            this.getElement().append($noProcessInfoDiv);
        } else {
            this.getElement().css({ "overflow": "scroll" });
            for (var i = 0; i < data.length; i++) {
                var attr = data[i];
                //var appObj = this.getApproval(attr.approveresult);
                var appObj = this.getApproval(attr.approvestatusname);
                if (i == 0) {
                    var $submitItem = $("<div class=\"part-item\"></div>").append("<div class=\"part-left submit\"><div class=\"ui-text\">提交</div><div></div></div>");
                    $("<div style='border-bottom: 1px solid #cccccc;' class=\"part-right\"><img src=\"pc/images/person1.png\" /><div class=\"ui-text\">" + attr.senddate + "</div><div class=\"ui-text\"><span>" + attr.sendername + "</span><span>：" + attr.messagenote + "</span></div></div>").appendTo($submitItem);
                    var $submitLi = $("<li></li>").data("approvalno", attr.senderman).append($submitItem);
                    this.getElement().append($submitLi);
                }

                var $approveItem = $("<div class=\"part-item\"></div>").append("<div class=\"part-left " + appObj.class + "\"><div class=\"ui-text\">" + appObj.name + "</div><div></div></div>");
                if (appObj.class == "wait") {
                    attr.approveresult = "待审批";
                } else if (appObj.class == "cancell") {
                    attr.approveresult = "已作废";
                }
                attr.approvetime = attr.approvetime == null ? "" : attr.approvetime;
                attr.checknote = attr.checknote == null ? "" : attr.checknote;  //如果没有审批批语（checknote）则显示为空
                var $info = $("<div class=\"part-right\"></div>").appendTo($approveItem);
                if (i > 0)
                {
                    if(data[i].sendername != data[i-1].sendername)
                    {
                        $info.attr("style","border-top:1px solid #cccccc;" );
                    }
                }
                $("<img src=\"pc/images/person1.png\" /><div class=\"ui-text\">" + attr.approvetime + "</div><div class=\"ui-text\"><span>" + attr.checkname + "</span><span>：审批状态：" + attr.approveresult+"  ,审批批语："+attr.checknote + "</span></div>").appendTo($info);
                var $approveLi = $("<li></li>").data("approvalno", attr.checkman).append($approveItem);
                this.getElement().append($approveLi);
            }
        }
        
    },

    control.prototype.getApproval = function (val) {
        var approval = new Object();
        switch (val) {
            case "不批准":
                approval.class = "refuse";
                approval.name = "不批准";
                break;
            case "驳回":
                approval.class = "refuse";
                approval.name = "驳回";
                break;
            case "已审批":
                approval.class = "agree";
                approval.name = "批准";
                break;
            case "未审批":
                approval.class = "wait";
                approval.name = "等待";
                break;
            case "作废":
                approval.class = "cancell";
                approval.name = "作废";
                break;
        }
        return approval;
    };

    control.prototype.on = function (eventName, func, context) {
        var me = this;
        if (eventName.indexOf("on") == 0)
            eventName = eventName.substr(2);
        this.getElement().find(".part-right").on(eventName, function (e, args) {
            var $li = $(e.target).closest("li");
            var $container = me.getElement().children("div");
            var e = e || window.event;
            $container.css("top", e.pageY - 40);
            $container.toggle();
            func.call(context, { "container": $container, "data": $li.data("approvalno") });
        });
    };

    return control;
});