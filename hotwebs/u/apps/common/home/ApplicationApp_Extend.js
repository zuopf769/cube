var ApplicationViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
		this.initMenu(viewModel);
		
		viewModel.on("commonFunctionAdd",function(args){
	  		var listMenu = viewModel.getmenuTiles();
	  		listMenu.setDataSource([args]);
  		})
    },
    tabMenuBeforeClose: function (viewModel, args) {
        return cb.route.notifyMessage(args, "beforeTabMenuClose");
    },
    tabMenuClick: function (viewModel, args) {
        //alert("ddwwd")
		viewModel.execute("afterTabMenuClick",args)
    },
    addmenulistClick:function (viewModel, args) {
        var $ele = $(".funcslist");
        if ($ele.css("display") == "block") {
            $ele.css("display", "none");
        } else {
            $ele.css("display", "block");
        }
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.PanoramicMenu, cb.route.ViewPartType.PanoramicMenu, { "from": "button", "refreshData": false });
    },
    operatormenulistClick:function(viewModel, args){
    	var	listArray = viewModel.getmenuTiles();
			listArray.set("Operators","operator");
    },
    goBackmenulistClick:function(viewModel, args){
    		var	listArray1 = viewModel.getmenuTiles();
			listArray1.set("Operators","goback");
    },
       menuItemClick: function (viewModel, args) {
       	
       	var menucount = args.data.menuCode;
       	var funCount = args.data.funcCode;
       	var options = { "menuCode": menucount, "funcCode": funCount };
        //调用服务，向数据库中添加点击次数
        viewModel.getProxy().UpdateMenuStats(options, function(sucess,fail){
        	console.log("OK");
		});
	
        if (!args || !args.type || !args.data || !args.data.url) return;
        var appParams = cb.route.getAppParamsFromMenu(args.data);
        if (!appParams.appId) {
            //location.href = cb.route.getPageUrl(args.data.url);
            //return;
            appParams.appId = args.data.url;
            appParams.params.appIdType = "special";
        }
        // appParams.params.isOpenNew = true;

        cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
        
    },
    menuEditClick: function (viewModel, args) {
    	cb.route.loadPageViewPart(viewModel,"common.home.OperatorHomeApp",{height:'200px',width:'300px',data:args,callBack:function(data){
    		
    		var listMenu = viewModel.getmenuTiles();
    		
    		args.data.displayName = data;
    		listMenu.set("DataItem",cb.clone(args.data));
    		//添加服务，更新到数据库
    		viewModel.getProxy().UpdateFrequentlyFunction(args.data, function(sucess,fail){
				
			});
    	}});
    },
    menuDeleteClick: function (viewModel, args) {

    	var listMenu = viewModel.getmenuTiles();
    	var data = {"listMenu":listMenu,"args":args};
    	listMenu.set("deleteData",data);
    	//添加服务，更新到数据库

    	viewModel.getProxy().DeleteFrequentlyFunction(data.args.data, function(sucess,fail){
				
			});
    },
//  menuItemClick:function(viewModel,args){
//  	if (!args || !args.type || !args.data || !args.data.url) return;
//      var appParams = cb.route.getAppParamsFromMenu(args.data);
//      if (!appParams.appId) {
//          //location.href = cb.route.getPageUrl(args.data.url);
//          //return;
//          appParams.appId = args.data.url;
//          appParams.params.appIdType = "special";
//      }
//      // appParams.params.isOpenNew = true;
//
//      cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
//
//  },
    initMenu: function (viewModel) {
        var listMenu = viewModel.getmenuTiles();
        viewModel.getProxy().GetMenu(function (success, fail) {
            if (fail) {
                //alert("获取菜单数据失败");
                return;
            }
//          success=success.slice(0,6);
            listMenu.setDataSource(success);
            var listArray = [];
	        	listArray = listMenu._data.dataSource;
	        	viewModel.fireEvent("getList",listArray);
        });
    }, 
};