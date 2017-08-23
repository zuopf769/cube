var AddSmartModelKindViewModel_Extend = {
	init_Extend: function(viewModel) {
		//初始化数据
		var data=this.getParams(viewModel);
		var type=this.getType(viewModel);
		if(type=="add"){
			//新增
			viewModel.getupperLevel().setValue(this.getNode(viewModel).dirname);
		}else{
			//修改
			var name=this.getNode(viewModel).parent.dirname;
			if(name=="--"){
				name="ROOT";
			}
			viewModel.getupperLevel().setValue(name);
			viewModel.getname().setValue(this.getNode(viewModel).dirname);
			
		}
	},
	
	getType:function(viewModel){
		return this.getParams(viewModel).type;
	},
	
	getNode:function(viewModel){
		return this.getParams(viewModel).node;
	},
	
	getParams:function(viewModel){
		return cb.route.getViewPartParams(viewModel);
	},
	
	save:function(viewModel){
		var data=this.getParams(viewModel);
		if(data.type=="add"){
			//增加方法
			var para={
				dirname:viewModel.getname().getValue(),
				pk_parent:this.getNode(viewModel).pk_dir
			};
			cb.data.CommonProxy("UAP").AddQueryEngineDir(para,function(success,fail){
				
			});
		}else{
			//修改方法
			var para={
				pk_dir:this.getNode(viewModel).pk_dir,
				dirname:viewModel.getname().getValue(),
				pk_parent:this.getNode(viewModel).parent.pk_dir
			};
			cb.data.CommonProxy("UAP").UpdateQueryEngineDir(para,function(success,fail){
				
			});
		}

	},
	
	closeAction:function(viewModel){
		cb.route.hidePageViewPart(viewModel);
	},
	
	doAction: function(name, viewModel) {
		if (this[name]) this[name](viewModel);
	},
};