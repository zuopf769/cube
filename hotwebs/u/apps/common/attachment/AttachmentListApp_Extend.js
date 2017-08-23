/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryDetailApp_M.js" />

var AttachDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    downloadAttach:function(viewModel,args){
        debugger;
    },
    getItemID:function(viewModel,mode){
        var params = cb.route.getViewPartParams(viewModel);
        var itemID = "";
        var parent = params.parentViewModel;
        if (!parent) {
            cb.util.warningMessage("parent" + parent);
            return;
        }
        if (params.queryData) {//如果queryData存在则说明当前附件操作为表体添加附件
            var queryData = params.queryData;
            var rowIndex = queryData["rowIndex"];
            var fieldname = queryData["fieldname"];
            var model3d = parent.getModel3D();
            itemID = model3d.getCellValue(rowIndex, fieldname);
            if (mode === "upload"&&!itemID) {
                itemID = this.generateGUID();
                model3d.setCellValue(rowIndex,fieldname,itemID);
            }
        } else {
            if (parent.getattachrelateid) {
                itemID = parent.getattachrelateid().getValue();
                if (mode === "upload" && !itemID) {
                    itemID = this.generateGUID();
                    parent.getattachrelateid().setValue(itemID);
                }
            } else {
                cb.util.warningMessage("当前单据不支持附件功能！");
            }
        }
        return itemID;
    },
    queryAttach:function(viewModel,args)
    {
        var that = this;
        var params = cb.route.getViewPartParams(viewModel);
        var parent = params.parentViewModel;
        var options = {};
        var datas = {};
        if (!parent) {
            cb.util.warningMessage("parent" + parent);
            return;
        }
        var itemID = this.getItemID(viewModel,"query");
        if (!itemID || itemID == "") {
            viewModel.getattachmentList().setDataSource([]);
            return;
        }
        datas.appID = parent.getSymbol(); //获取助记符
        datas.itemID = itemID;
        datas.attachType = "-1"; //查询所有
        options.params = datas;
        options.callback = function (data) {
            viewModel.getattachmentList().setDataSource(data);
        }
        var proxy = viewModel.getProxy().queryAttachList(options);
    },
    uploadAttach:function(viewModel,args){
        var proxy = viewModel.getProxy();
        var params = cb.route.getViewPartParams(viewModel);
        var parent = params.parentViewModel;
        var appID = parent.getSymbol(); //获取助记符
        var itemID = this.getItemID(viewModel, "upload");
        var data = args.reqData.data;
        var oldAttachPathID = data.attachPathID;
        var controlCallBack = args.reqData.callback;
        var control = args.reqData.control;
        var options = {};
        options.callback = function (success, fail) {
            var returnData = {};
            if (cb.isArray(success)&&success.length>0)
            {
                success[0].status = true;
                returnData.data = success[0];
                returnData.refresh = true;
            } else {
                var error = "";
                if (fail.error)
                {
                    error = fail.error.replace(/[^\u4e00-\u9fa5]/gi, "");
                } else {
                    error = "上传失败，请查看文件服务器配置！";
                }
                cb.util.tipMessage(error);
                returnData.data = null;
                returnData.refresh = false;
            }
            returnData.optionType = "upload";
            returnData.oldAttachPathID = oldAttachPathID;
            returnData.control = control;
            controlCallBack(returnData);
        }
        var uploadAttachList = [];
        delete data.status;
        data.attachPathID = null;
        data.itemID = itemID;
        data.appID = appID;
        uploadAttachList.push(data);
        options.params = uploadAttachList;
        proxy.upload(options);
    },
    deleteAttach: function (viewModel, args) {
        var proxy = viewModel.getProxy();
        var options = {};
        var callback = args.callback;
        var oldAttachPathID = args.data.attachPathID;
        var controlCallBack = args.callback;
        var control = args.control;
        options.callback = function (success, fail) {
            if (fail)
            {
                cb.util.tipMessage("删除附件失败！");
            } else {
                controlCallBack({ optionType: "delete", control: control, refresh: true, oldAttachPathID: oldAttachPathID });
            }
        }
        options.params = [args.data];
        proxy.deleteAttach(options);
    },
    attachClick: function (viewModel, args) {
        var params = cb.route.getViewPartParams(viewModel);
        var parent = params.parentViewModel;
        var itemID = this.getItemID(viewModel,"query");
        var appID = parent.getSymbol();
        var requestType = args.reqData.type;
        args.cancel = true;
        var token = new cb.util.queryString(location.search).get("token");
       if (requestType == "download")
        {
           var pathID = args.reqData.attachPathID;
            var host = window.location.host;
            var href = 'http://';
            href += host;
            href += '/classes/General/UAP/AttachDownload?token=';
            href += token;
            href += '&appID=';
            href += appID;
            href += '&attachPathID=';
            href += pathID;
            window.open(href);
        } else if (requestType == "delete")
        {
            var data = args.reqData.data;
            data.appID = appID;
            data.itemID = itemID;
            delete data.type;
            this.deleteAttach(viewModel, args.reqData);
        } else if (requestType == "batchDownload")
        {
            if (!itemID || itemID == "") {
                cb.util.tipMessage("暂无附件可供下载");
                return;
            }
            var host = window.location.host;
            var href = 'http://';
            href += host;
            href += '/classes/General/UAP/AttachBatchDownload?token=';
            href += token;
            href += '&appID=';
            href += appID;
            href += '&itemID=';
            href += itemID;
            window.open(href);
        } else if (requestType == "upload")
        {
            this.uploadAttach(viewModel,args);
        }
        debugger;
    },
    addClick:function(viewModel,args)
    {
        attachments.AddAttachments();
        debugger;
    },
    saveAction: function (viewModel, args) {

    },
    generateGUID : function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    },
    init_Extend: function (viewModel) {
        var that = this;
        var params = cb.route.getViewPartParams(viewModel);
        this.queryAttach(viewModel);
    }
};
