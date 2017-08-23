cb.controls.widget("LinkQueryList", function (controlType) {
    var control = function (id, options) {
        cb.controls.ListControl.call(this, id, options);
    };
    control.prototype = new cb.controls.ListControl();
    control.prototype.controlType = "ListControl";
    control.prototype.setValue = function (value) {

    };
    control.prototype.getValue = function () {

    };
    control.prototype.setData = function (data) {
        this.setDataSource(data.dataSource);
    };
    control.prototype.setDataSource = function (dataSource) {
        $list = this.getElement();
        $list.empty();
        if (!cb.isArray(dataSource)) {
            $("<div>暂无联查数据！</div>");
            return;
        }
        for (var i = 0, j = dataSource.length; i < j; i++) {
            var data = dataSource[i];
            $dl = $("<dl class='saleForm' id=" + data.billType + "><dt>" + data.billTypeName + "<span class='icon_a'></span></dt></dl>").appendTo($list);
            if (data.isCurrentBill) {
                $dl.addClass("active");
            }
            var bodyData = data.data;
            if (!cb.isArray(bodyData)) {
                $("<dd ><div class='clearfix'>暂无数据</div></dd>").appendTo($dl);
                continue;
            };
            for (var b = 0, t = bodyData.length; b < t; b++) {
                $dd = $("<dd></dd>").appendTo($dl);
                $dd.attr("id", bodyData[b].id);//id
                $dd.data("preId", bodyData[b].srcBillId);//暂时未用到
                $dd.data("preBillType", bodyData[b].srcBillType);//暂时未用到
                $billInfo = $("<div class='clearfix'><span class='pull-left blueCol link'>" + bodyData[b].billno + "</span><span class='pull-right greenCol'>" + this.getApproveStatus(bodyData[b].approvestatus) + "</span></div>");
                $billInfo.attr("id", bodyData[b].id);
                bodyData[b].billType = data.billType;
                $billInfo.data("billinfo", bodyData[b]);
                $billInfo.on("click", this, this.clickEventHandler);
                $createInfo = $("<div class='clearfix'><span class='pull-left'>" + bodyData[b].creator + "</span><span class='pull-right grayCol2'>" + this.formatDate(bodyData[b].approvetime) + "</span></div>");
                $dd.append($billInfo);
                $dd.append($createInfo);
            }
        };
        for (var i = 0, j = dataSource.length; i < j; i++) {
            var data = dataSource[i];
            if (data.srcBillType == null) {
                continue;
            }
            var bodyData = data.data;
            if (bodyData == null || bodyData.length < 1) continue;  //如果没有数据则不划线
            for (var b = 0, t = bodyData.length; b < t; b++) {
                var body = bodyData[b];
                var srcBillId = body.srcBillId;
                var id = body.id;
                if (srcBillId) {
                    cb.util.createLine($("#"+srcBillId),$("#"+id),this.getElement());
                }
            }
        }
    };
    control.prototype.clickEventHandler = function (e, args) {
        $target = $(e.target);
        var classtyle = $target.attr("class");
        if (classtyle && classtyle.indexOf("link")) {
            $parent = $target.parent();
            var data = {};
            data.billType = $parent.data("billinfo").billType;
            data.id = $parent.data("billinfo").id;
            debugger;
            e.data.handleItemClick(data);//当前$list 是由于方法调用的闭包
        }
        debugger;
    }
    control.prototype.formatDate = function (args) {
        var formatdate = "";
        if (args) {
            var date = new Date(args);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            formatdate = year + "-" + month + "-" + day;
        }
      return formatdate;
    };
    control.prototype.getApproveStatus = function(status){
        var approvestatus;  //单据状态转换
        switch (status) {
            case -1:
                approvestatus = "自由";
                break;
            case 0:
                approvestatus = "审批未通过";
                break;
            case 1:
                approvestatus = "审批通过";
                break;
            case 2:
                approvestatus = "审批进行中";
                break;
            case 3:
                approvestatus = "提交";
                break;
            default:
                approvestatus = "未知";
        }
        return approvestatus;
    };
    control.prototype.getDataSource = function () {

    };
    control.prototype.updateDataSource = function (dataSource) {

    };
    return control;
});