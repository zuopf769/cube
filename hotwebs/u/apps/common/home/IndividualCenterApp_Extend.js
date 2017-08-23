var IndividualCenterViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
		
    },
	savePwd: function (viewModel){
		var  data = this.getChangePwdData();
		 viewModel.getProxy().PostChangePwd(function (success, fail) {
            if (fail) {
                
                return;
            }
            if (success) {
               debugger;
            }
            //listMenu.setDataSource(success);
        });
	},
	getChangePwdData:function (){
		var data ={
				"userCode":"",
				"password":document.getElementById("currentPwd").value,
				"accountCode":"" ,
				"dataSourceName":"",
				"lang":"",
				"newPassWord1":document.getElementById("newPwd").value,
				"newPassWord2":document.getElementById("confirmPwd").value,
				"token":"",
				"step":2
			};
		var userdata = JSON.parse(localStorage.getItem("userData"));
		debugger;
		for(var i in data){
			if(userData[i]){
				data[i] = userData[i];
			}
		}
		return data;
	}

  

};