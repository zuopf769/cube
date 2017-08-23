/// <reference path="../../common/js/Cube.js" />
/// <reference path="CustomerDetailApp_M.js" />

var CustomerDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    tabMenuClick: function (viewModel, args) {

    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
        if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
        viewModel.setReadOnly(false);
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
        var msg = "您真的确定要删除吗？\n\n请确认！";
        if (!confirm(msg)) return;
        if (!this.symbol) return;
        var data = cb.biz.getInputData(viewModel);
        cb.data.CommonProxy(this.symbol).Delete(data, function (success, fail) {
            if (fail) {
                alert("删除失败");
                return;
            }
            alert("删除成功");
        });
    },
    relatedAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
        var $part = $(".related-part");
        if (!$part.length) return;
        var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
        $part.loadView(pageUrl, function () {
            $part.directRight2();
        });
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>

    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>

    },
    cancelAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>

    },
    saveAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
        debugger;
        if (!viewModel.validate() || !this.symbol || !this.mode) return;
        var params = viewModel.collectData();
        var callback = function (success, fail) {
            if (fail) {
                alert("保存失败");
                return;
            }
            alert("保存成功");
        };
        // UPDATED = 1;//更新
        // NEW = 2;//新增
        if (this.mode === "add") params.state = 2
        else if (this.mode === "view") params.state = 1;
        cb.data.CommonProxy(this.symbol).Save(params, callback);
    },
    addAttachmentAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>

    },
    downloadAttachmentAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>

    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
        var images = [
            { displayName: "软件园风光1.png", owner: "李珊珊", uploadType: "上传", uploadTime: "2015-01-18", url: "./pc/images/ImageSlide/u156.jpg", selected: true },
            { displayName: "软件园风光2.png", owner: "李珊珊", uploadType: "上传", uploadTime: "2015-01-18", url: "./pc/images/ImageSlide/u158.jpg" },
            { displayName: "软件园风光3.png", owner: "李珊珊", uploadType: "上传", uploadTime: "2015-01-18", url: "./pc/images/ImageSlide/u156.jpg" },
            { displayName: "软件园风光4.png", owner: "李珊珊", uploadType: "上传", uploadTime: "2015-01-18", url: "./pc/images/ImageSlide/u158.jpg" },
        ];
        viewModel.getimages().setDataSource(images);

        var attachments = [
            { sourceType: "pdf", sourceName: '产品使用手册1.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "excel", sourceName: '产品使用手册2.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "doc", sourceName: '产品使用手册3.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "pdf", sourceName: '产品使用手册4.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "doc", sourceName: '产品使用手册5.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "doc", sourceName: '产品使用手册6.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" },
            { sourceType: "doc", sourceName: '产品使用手册7.pdf', sourceSize: "12.5M", downLoadNum: 5, sourceOwner: "张国栋", upLoadTime: "2015-01-12" }
        ];
        viewModel.getattachments().setDataSource(attachments);

        var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.symbol = viewModel.getSymbol();
        if (!this.symbol) return;
        this.mode = params.mode;
        if (!this.mode) return;

        cb.model.PropertyChange.delayPropertyChange(true);
        viewModel.clear();
        if (this.mode === "add") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
            viewModel.setReadOnly(false);

            cb.model.PropertyChange.doPropertyChange();
        }
        else if (this.mode === "view") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(true);
            cb.data.CommonProxy(this.symbol).QueryByPK(params.id, function (success, fail) {
                if (fail) {
                    alert("读取数据失败");
                    return;
                }
                viewModel.loadData(success);
                viewModel.setReadOnly(true);

                cb.model.PropertyChange.doPropertyChange();
            });
        }
    }
};
