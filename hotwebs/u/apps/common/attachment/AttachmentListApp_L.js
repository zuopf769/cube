/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryDetailApp_Extend.js" />
var AttachDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "AttachDetailViewModel");
    this.init();
};
AttachDetailViewModel.prototype = new cb.model.ContainerModel();
AttachDetailViewModel.prototype.constructor = AttachDetailViewModel;

AttachDetailViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "AttachDetailViewModel",
        //Symbol: "common.attachment.testAttachment",
        Symbol: "sa.Delivery",
        attachmentList: new cb.model.SimpleModel({ ctrlType: "AttachmentList" })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
   
   
    this.getattachmentList().on("click", function (args) {
        var newArgs = { reqData: args };
        newArgs.cancel = false;
        var viewModel = this.getParent();
        newArgs.commonCRUD = new cb.data.commonCRUD(viewModel);
        if (AttachDetailViewModel_Extend.attachClick)
            AttachDetailViewModel_Extend.attachClick(viewModel, newArgs);
        if (newArgs.cancel) return;
        newArgs.commonCRUD.AttachClick(args);
    });
   
    var proxyConfig = {
        //附件上传
        "upload": { "url": "classes/General/UAP/AttachUpload", "method": "POST" },
        //"download": { "url": "classes/General/UAP/AttachDownload", "method": "get" },
        //&appID=sa.Delivery&attachPathID=0001ZZ10000000026WAC
        "queryAttachList": { "url": "classes/General/UAP/AttachQUery", "method": "POST" },
        "deleteAttach": { "url": "classes/General/UAP/AttachDelete", "method": "POST" }
    };
    this.setProxy(proxyConfig);

    this.initData();
};

AttachDetailViewModel.prototype.initData = function () {
    AttachDetailViewModel_Extend.doAction("init_Extend", this);
};
