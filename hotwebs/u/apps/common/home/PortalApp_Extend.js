var PortalViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    tabMenuClick: function (viewModel, args) {
        //alert("ddwwd")

    },
    organizationsChange: function (viewModel) {
        var org = viewModel.getorganizations().getValue();
        var data = viewModel.getorganizations().getData();
        for (var i = 0; i < data.dataSource.length; i++) {
            if (org == data.dataSource[i].value) {
                cb.rest.ApplicationContext.orgId = data.dataSource[i].id;
                cb.rest.ApplicationContext.orgCode = data.dataSource[i].value;
                cb.rest.ApplicationContext.orgName = data.dataSource[i].text;
            }
        }
    },
    funcsListClick: function (viewModel, args) {
        var $ele = $(".funcslist");
        if ($ele.css("display") == "block") {
            $ele.css("display", "none");
        } else {
            $ele.css("display", "block");
        }
        cb.route.loadViewPart(cb.cache.get('ApplicationViewModel'), cb.route.CommonAppEnum.PanoramicMenu, cb.route.ViewPartType.PanoramicMenu, { "refreshData": false });
    },
    tabTopClick: function (viewModel, args) {

    },
    exitActionClick: function (viewModel, args) {
        cb.util.confirmMessage("确定要退出登录吗？", function () {
            viewModel.getProxy().logout(function () {
                cb.route.redirectLoginPage();
            });
        });
    },
    init_Extend: function (viewModel) {
        this.initorg(viewModel);
        //cb.util.loadingControl.startControl()
        var ApplicationContext = cb.rest.ApplicationContext;
        var tabTopData = {
            'zh-CN': {
                dataSource: [
		                { textField: "动态", dataContent: 'common.home.Dynamic' },
		                { textField: '应用', dataContent: 'common.home.Application', isSelected: true },
		                { textField: "审批", dataContent: 'common.home.Approvement' },
		                { textField: "日程", dataContent: 'common.home.Schedule', number: 4 }
		            ],
                searchBoxPlaceHolder: '请输入关键字'
            },
            'en-US': {
                dataSource: [
		                { textField: "Dynamic", dataContent: 'common.home.Dynamic' },
		                { textField: 'Application', dataContent: 'common.home.Application', isSelected: true },
		                { textField: "Approvement", dataContent: 'common.home.Approvement' },
		                { textField: "Schedule", dataContent: 'common.home.Schedule', number: 4 }
		            ],
                searchBoxPlaceHolder: 'Please enter keywords'
            }

        };
        viewModel.gettabTop().setDataSource(tabTopData[ApplicationContext.lang].dataSource);
        $('.header div[data-controltype="SearchBox"]').children('input').attr('placeholder', tabTopData[ApplicationContext.lang].searchBoxPlaceHolder);
        var queryStringParent = new cb.util.queryString(location.search);
        var appId = 'common.home.CommonHomeApp';
        //if (true) {
        if (queryStringParent.get('isSuper') == "true") {
            appId = 'common.home.SuperHomeApp';
        } else if (queryStringParent.get('isSys') == "true") {
            appId = 'common.home.SysHomeApp';
        }
        // cb.route.loadViewPart(viewModel, appId, '[data-related]> [data-content="baseinfo"]');
    },
    initorg: function (viewModel) {
        viewModel.getProxy().GetOrgs(function (success, fail) {
            if (success && cb.isArray(success) && success.length) {
                var organizationModel = viewModel.getorganizations();
                organizationModel.setDataSource(success);
                organizationModel.setValue(success[0].code);
                cb.rest.ApplicationContext.orgId = success[0].id;
                cb.rest.ApplicationContext.orgCode = success[0].code;
                cb.rest.ApplicationContext.orgName = success[0].name;
            }
        });
    }

};