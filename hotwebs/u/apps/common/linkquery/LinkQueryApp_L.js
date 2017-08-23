var LinkQueryViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LinkQueryViewModel");
    this.init();
}
LinkQueryViewModel.prototype = new cb.model.ContainerModel();
LinkQueryViewModel.prototype.constructor = LinkQueryViewModel;

LinkQueryViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LinkQueryViewModel",
        AppId: "linkquery.LinkQueryApp",
        Symbol :"linkquery.LinkQueryApp",
        closeAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), //关闭按钮
        linkQueryList: new cb.model.SimpleModel({ title: "联查列表", ctrlType: "LinkQueryList" }),
    };
    this.setData(fields);
    this.setDirty(false);

    this.getcloseAction().on("click", function (args) { LinkQueryViewModel_Extend.closeAction(this.getParent()); });
    this.getlinkQueryList().on("click", function (args) { LinkQueryViewModel_Extend.openLinkAction(this.getParent(),args);});
    var proxyConfig = {

    };
    this.setProxy(proxyConfig);

    this.initData();
};
LinkQueryViewModel.prototype.initData = function () {
    LinkQueryViewModel_Extend.doAction("init_Extend", this);
};