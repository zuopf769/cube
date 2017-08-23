/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactApp_M.js" />

var ContactViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    contactClick: function (viewModel, args) {
        /// <param name="viewModel" type="ContactViewModel">viewModel类型为ContactViewModel</param>
        if (!args || !args.type || !args.data) return;
        switch (args.type) {
            case "tel":
                alert("电话");
                break;
            case "addr":
                alert("地址");
                break;
            case "msg":
                alert("邮件");
                break;
            case "uu":
                alert("UU");
                break;
            case "weixin":
                alert("微信");
                break;
            case "weibo":
                alert("微博");
                break;
            default:
                if (this.parentViewModel)
                    cb.route.loadPageViewPart(this.parentViewModel, cb.route.CommonAppEnum.ContactDetail);
                else
                    cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.ContactDetail);
                break;
        }
    },
    contactsChangePage: function (viewModel, args) {
        /// <param name="viewModel" type="ContactViewModel">viewModel类型为ContactViewModel</param>
        debugger;
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="ContactViewModel">viewModel类型为ContactViewModel</param>
        var params = cb.route.getViewPartParams(viewModel);
        if (params) this.parentViewModel = params.parentViewModel;
        var contacts = viewModel.getcontacts();
        contacts.setData({
            "mode": "contacts",
            "fields": {
                "leftTopField": "person",
                "leftBottomField": "position",
                "rightTopField": { "code": "telephone", "name": "电话" },
                "rightBottomField": { "code": "address", "name": "地址" },
                "statusField": "major"
            }
        });
        contacts.setPageSize(15);
        var dataSource = [
            {
                person: "张三",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            },
            {
                person: "李四",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号"
            },
            {
                person: "王五",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号北京市海淀区先锋路68号"
            },
            {
                person: "丁六七",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            },
            {
                person: "张三",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            },
            {
                person: "李四",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号"
            },
            {
                person: "王五",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号北京市海淀区先锋路68号"
            },
            {
                person: "丁六七",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            },
            {
                person: "张三",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            },
            {
                person: "李四",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号"
            },
            {
                person: "王五",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号北京市海淀区先锋路68号"
            },
            {
                person: "丁六七",
                position: "亚洲区销售主管",
                telephone: "13523232314",
                address: "北京市海淀区先锋路68号",
                major: true
            }
        ];
        contacts.setRows(dataSource);
    }
};