/**
 * 
 */

/**
 * 查询模板信息
 */
function queryVm(baseUrl){
	var urls = baseUrl+'/vmList';
	var datas = [];
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		//contentType: "application/json; charset=utf-8",
	   	data : {opt:"queryVM",app:app},
	   	success: function(response) {
	   		//alert(response);
	   		if(response!=null&&response!=''){
	   			datas = eval("("+response+")");
	   		}
	   	},
	   	error: function(e){
			alert(e);
		}
	});
	var vm = datas.vm;
	var vmView = datas.vmView;
	var vmList = datas.vmList;
	var vmListView = datas.vmListView;
	return datas;
}

/**
 * 显示卡片
 * @param obj
 */
function showTab(obj){
	var item = jQuery(obj).attr("item");
	jQuery('[showType="areaIframe"]').attr("class","templateHide");
	var showName = item+'Area';
	var showAreaObj = jQuery('[name="'+showName+'"]');
	showAreaObj.attr("class","vmAreacss");
	jQuery('[name="Tab"]').removeClass("selectTab")
	jQuery(obj).parent().addClass("selectTab");
}

/**
 * 初始化功能
 * @param datas
 */
function initActions(datas){
	if(datas==null){
		return ;
	}
	var tableObj =jQuery("#vmListActions");
	var templateTr = jQuery("tr[name='tmplate']",tableObj);
	var trs = jQuery("tr[name*='tr']",tableObj);
	var num = trs.length+1;
	
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		var flag = 0;
		for(var k =0 ; k< trs.length ; k++){
			var pk = jQuery('[name="pk"]',trs[k]).val();
			if(data['@name']==pk){
				flag = 1;break;
			}
		}
		if(flag==1){continue;}
		var trObj = templateTr.clone();
		templateTr.before(trObj);
		trObj.attr("name","tr"+num);
		jQuery('[name="no"]',trObj).html(num);
		jQuery('[name="checkboxvm"]',trObj)[0].checked = data.checked;
		jQuery('[name="pk"]',trObj).val(data['@name']);
		
		loadTr(data,trObj);
		trObj.attr("class","vmTrcss");
		num++;
	}
	
}

function loadTr(data,trObj){
	for( i in data){
		jQuery('[name="'+i+'"]',trObj).val(data[i]);
	}
}

function loadApp(data,AppObj){
	for( i in data){
		if(i.indexOf('@')>-1){
			jQuery('[name="'+i+'"]',AppObj).val(data[i]);
		}
	}
}

function initApps(vmList){
	var applications = vmList;
	var application = applications[0];
	var application0 = jQuery('#application0');
	loadApp(application,application0);
	
	var viewmodel = application.viewmodel;
	var actions = viewmodel.actions;
	initActions(actions);
}

function initView(vmListView,vmList,app){
	var datas = getFields (vmList);
	var application0 = jQuery('#application1');
	jQuery('[name="@title"]',application0).val(vmListView['@title']);
	jQuery('[name="@appId"]',application0).val(app);
	jQuery('[name="@domainName"]',application0).val(vmListView['@domainName']==null?'scm':vmListView['@domainName']);
	
	var columns1 = jQuery('#columns1');
	var statusObj = jQuery('[name="position"]',columns1);
	var selectObj = loadSelect(statusObj,datas);
	var selectObj1 = jQuery(selectObj).clone();
	selectObj1.attr('position','leftTop');
	jQuery('#leftTopid').append(selectObj1);
	
	selectObj1 = jQuery(selectObj).clone();
	selectObj1.attr('position','rightTop');
	jQuery('#rightTopid').append(selectObj1);
	
	selectObj1 = jQuery(selectObj).clone();
	selectObj1.attr('position','leftBottom');
	jQuery('#leftBottomid').append(selectObj1);
	
	selectObj1 = jQuery(selectObj).clone();
	selectObj1.attr('position','rightBottom');
	jQuery('#rightBottomid').append(selectObj1);
	
	var control = vmListView.view.container[0].controls[0];
	var columns = control.columns;
	setSelectValue(columns,columns1);
}

function setSelectValue(columns,columns1){
	for(var i = 0 ; i <columns.length ; i++ ){
		var column = columns[i];
		var pos = column['@position'];
		var name = column['@name'];
		var statusObj = jQuery('[position="'+pos+'"]',columns1);
		var opt = jQuery(' option[value="'+name+'"]',statusObj);
		opt.attr("selected",true);
	}
}

function getField(vmList,key){
	var datas = getFields (vmList);
	for(var i = 0 ; i <datas.length ; i++ ){
		var data = datas[i];
		if(data['@name']==key){
			return data;
		}
	}
	return null;
}
function getFields(vmList){
	var entitys = vmList[0].viewmodel.entity;
	var refEntity = '';
	var fields = null;
	for(var i = 0 ; i <entitys.length ; i++ ){
		var entity = entitys[i];
		if('true'==entity['@isMain']){
			refEntity = entity.fields[0]['@refEntity'];
			break;
		}
	}
	
	for(var i = 0 ; i <entitys.length ; i++ ){
		var entity = entitys[i];
		if(refEntity==entity['@name']){
			fields = entity.fields;
			break;
		}
	}
	return fields;
}

function loadSelect(selectObj,datas){
	var selector = selectObj[0];
	//selector.remove(0);
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		selector.options.add(new Option(data['@title'],data['@name']));
	}
	return selector;
}
function getVmListFormTab(datas){
	if(datas==null){return null;}
	var vmList = datas.vmList;
	var application = vmList[0];
	var application0 = jQuery('#application0');
	setApps(application,application0);
	var vmListActions = jQuery('#vmListActions');
	var actions = getActions(vmListActions);
	application.viewmodel.actions = actions;
	return vmList;
}

function getVmListViewFormTab(datas,className){
	if(datas==null){return null;}
	var vmListView = datas.vmListView;
	
	var application0 = jQuery('#application1');
	vmListView['@title']=jQuery('[name="@title"]',application0).val();
	vmListView['@appId']=jQuery('[name="@appId"]',application0).val();
	vmListView['@domainName']=jQuery('[name="@domainName"]',application0).val();
	vmListView['@uiType']='vouchers';
		
	vmListView.view['@title']=jQuery('[name="@title"]',application0).val();
	vmListView.view.container['@type']='Grid';
	var control = vmListView.view.container[0].controls[0];
	control['@name']=className+'List_iPad';
	control['@title']=vmListView['@title'];
	control['@ctrlType']='DataGrid';
	control['@field']=className+'s';
	control['@entity']=className+'List';
	control.columns = [];
	var columns = control.columns;
	var columns1 = jQuery('#columns1');
	var selects = jQuery('[name="position"]',columns1);
	for(var i = 0 ; i < selects.length; i++){
		var select = selects[i];
		var obj = select;
		var column = {};
		var key = obj.value;
		var field = getField(datas.vmList,key);
		if(field!=null){
			column['@name']=obj.value;
			column['@title']=field['@title'];
			column['@field']=obj.value;
			column['@ctrlType']=field['@ctrlType'];
			column['@position']=jQuery(obj).attr('position');
			columns.push(column);
		}else{
			alert("Error");
			return null;
		}
	}
		
	return vmListView;
}

function setApps(apps,obj){
	var inputs = jQuery('input[name*="@"]',obj);
	for(var i = 0 ; i < inputs.length; i++){
		var input = inputs[i];
		var name = input.name;
		var value = input.value;
		apps[name] = value;
	}
	return apps;
}

function getActions(vmListActions){
	var checkboxs = jQuery('input[name=checkboxvm]:checked',vmListActions);
	var actions = [];
	checkboxs.each(function(){
		var obj = this;
		var trObj = jQuery(obj).parents("tr")[0];
		var action = {};
		setApps(action,trObj);
		actions.push(action);
	});
	return actions;
}

function saveVM(str,type,urls,app,vmListStr){
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		//contentType: "application/json; charset=utf-8",
	   	data : {opt:"saveVM",app:app,type:type,xml:str,view:vmListStr},
	   	success: function(response) {
	   		alert(response);
	   	},
	   	error: function(e){
			alert(e);
		}
	});
}




/**
 * json 转 String
 */
function JsonToString(o) {
    var arr=[];
    var fmt = function(s) { 
            if (typeof s == 'object' && s != null ) return JsonToString(s); 
            return /^(string|number)$/.test(typeof s) ? "\"" + s + "\"" : s; 
    };
    
    if(o instanceof Array){
        for (var i in o){
                arr.push(fmt(o[i]));
        }
        return '[' + arr.join(',') + ']';
            
    }
    else{
        for (var i in o){
                arr.push("\"" + i + "\":" + fmt(o[i]));
        }
        return '{' + arr.join(',') + '}'; 
    }
}; 

/**
 * 初始化卡片页面
 * @param vm
 */
function initVmApp(vm){
	var applications = vm;
	var application = applications[0];
	var application2 = jQuery('#application2');
	loadApp(application,application2);
	
}

function initVmActions(vm){
	var applications = vm;
	var application = applications[0];
	var application2 = jQuery('#application2');
	var viewmodel = application.viewmodel;
	var toolbar = getEntity(viewmodel,'Toolbar');
	var functions = [
	                 {checked: true,'@name':'editAction','@title':'编辑','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'closeAction','@title':'关闭','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'submitAction','@title':'提交','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'withdrawAction','@title':'收回','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'approveAction','@title':'审核','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'unapproveAction','@title':'弃审','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'deleteAction','@title':'删除','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'outboundAction','@title':'出库','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'relatedAction','@title':'相关业务','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'setAction','@title':'设置','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'outputAction','@title':'输出','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'bodyAction','@title':'表体','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'cancelAction','@title':'取消','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: true,'@name':'saveAction','@title':'保存','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''},
	                 {checked: false,'@name':'pullAction','@title':'拉单','@modelType':'SimpleModel','@ctrlType':'Button','@powerAction':''}
	                 
	              ];
	var actions = [
   	{'@name':'editActionclick','@entity':'Toolbar','@field':'editAction','@eventName':'click','@functionName':'editAction'}
   	,{'@name':'closeActionclick','@entity':'Toolbar','@field':'closeAction','@eventName':'click','@functionName':'closeAction'}
   	,{'@name':'submitActionclick','@entity':'Toolbar','@field':'submitAction','@eventName':'click','@functionName':'submitAction'}
   	,{'@name':'withdrawActionclick','@entity':'Toolbar','@field':'withdrawAction','@eventName':'click','@functionName':'withdrawAction'}
   	,{'@name':'approveActionclick','@entity':'Toolbar','@field':'approveAction','@eventName':'click','@functionName':'approveAction'}
   	,{'@name':'unapproveActionclick','@entity':'Toolbar','@field':'unapproveAction','@eventName':'click','@functionName':'unapproveAction'}
   	,{'@name':'deleteActionclick','@entity':'Toolbar','@field':'deleteAction','@eventName':'click','@functionName':'deleteAction'}
   	,{'@name':'outboundActionclick','@entity':'Toolbar','@field':'outboundAction','@eventName':'click','@functionName':'outboundAction'}
   	,{'@name':'relatedActionclick','@entity':'Toolbar','@field':'relatedAction','@eventName':'click','@functionName':'relatedAction'}
   	,{'@name':'setActionclick','@entity':'Toolbar','@field':'setAction','@eventName':'click','@functionName':'setAction'}
   	,{'@name':'outputActionclick','@entity':'Toolbar','@field':'outputAction','@eventName':'click','@functionName':'outputAction'}
   	,{'@name':'bodyActionclick','@entity':'Toolbar','@field':'bodyAction','@eventName':'click','@functionName':'bodyAction'}
   	,{'@name':'cancelActionclick','@entity':'Toolbar','@field':'cancelAction','@eventName':'click','@functionName':'cancelAction'}
   	,{'@name':'saveActionclick','@entity':'Toolbar','@field':'saveAction','@eventName':'click','@functionName':'saveAction'}
   	,{'@name':'pullActionclick','@entity':'Toolbar','@field':'pullAction','@eventName':'click','@functionName':'pullAction'}
   	];
	
	viewmodel.actions = actions;
	
	if(toolbar!=null){
		var fields = toolbar.fields;
		var isChecked = true;
		if(fields.length>0){
			isChecked = false;
		}
		initFunction(functions,isChecked);
		setFunction(fields);
		
	}
}

function setFunction(datas){
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		var name = data['@name'];
		jQuery('[name="checkboxvm"][value="'+name+'"]')[0].checked=true;
	}
}
function initFunction(datas,isChecked){
	var tableObj =jQuery("#vmActions");
	var templateTr = jQuery("tr[name='tmplate']",tableObj);
	var trs = jQuery("tr[name*='tr']",tableObj);
	var num = trs.length+1;
	
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		var flag = 0;
		for(var k =0 ; k< trs.length ; k++){
			var pk = jQuery('[name="pk"]',trs[k]).val();
			if(data['@name']==pk){
				flag = 1;break;
			}
		}
		if(flag==1){continue;}
		var trObj = templateTr.clone();
		templateTr.before(trObj);
		trObj.attr("name","tr"+num);
		jQuery('[name="no"]',trObj).html(num);
		if(isChecked){
			jQuery('[name="checkboxvm"]',trObj)[0].checked = data.checked;
		}
		jQuery('[name="checkboxvm"]',trObj).val(data['@name']);
		jQuery('[name="pk"]',trObj).val(data['@name']);
		
		loadTr(data,trObj);
		trObj.attr("class","vmTrcss");
		num++;
	}
}
function getEntity(viewmodel,name){
	var entitys = viewmodel.entity;
	for(var i = 0 ; i < entitys.length; i++){
		var entity = entitys[i];
		if(entity['@name']==name){
			return entity;
		}
	}
	return null;
}

/**
 * 初始化卡片页面
 * @param vm
 */


function getVmFormTab(datas){
	if(datas==null){return null;}
	var applications = datas.vm;
	var application = applications[0];
	var application2 = jQuery('#application2');
	setApps(application,application2);
	var tableObj =jQuery("#vmActions");
	var functions = getFunctions(tableObj);
	var viewmodel = application.viewmodel;
	var toolbar = getEntity(viewmodel,'Toolbar');
	toolbar.fields = functions;
	return applications;
}

function getFunctions(tableObj){
	var checkboxs = jQuery('input[name=checkboxvm]:checked',tableObj);
	var functions = [];
	checkboxs.each(function(){
		var obj = this;
		var trObj = jQuery(obj).parents("tr")[0];
		var function1 = {};
		setApps(function1,trObj);
		functions.push(function1);
	});
	return functions;
}