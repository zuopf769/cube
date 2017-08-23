//公式编辑器待赋值组件
var supper_Component;
//公式编辑器组件
var supper_edit_Component;
//公式编辑器实体请求信息
var supper_fullClassName="uap.wap.dbl.vo.WfmFormTemplateVO";
var supper_beanId;
var supper_nameSpace;
var supper_entityName;


$(document).ready(function(){
	$("#testButton").kendoButton({
		click: function(e) {
			//ifream调用
			supper_Component = $("#testBox").data("kendoMaskedTextBox");
			supper_edit_Component = $("#testwindow").data("kendoWindow");
			debugger;
			if (null==supper_edit_Component) {
				$("#testwindow").kendoWindow({

					title: "公式编辑器",
					content: "supper_EditWindow_ifream.html"
					
				});
				supper_edit_Component = $("#testwindow").data("kendoWindow");
			}else{
				supper_edit_Component.refresh("supper_EditWindow_ifream.html");
				supper_edit_Component.open();
			}
			//框架内调用
			//supper_Component = $("#testBox").data("kendoMaskedTextBox");
			//supper_edit_Component = $("#testwindow").data("kendoWindow");
			//debugger;
			//if (null==supper_edit_Component) {
			//	$("#testwindow").kendoWindow({
			//		title: "公式编辑器",
			//		content: ".apps/common/smart/supperEdit/supper_EditWindow.html"	
			//	});
			//	supper_edit_Component = $("#testwindow").data("kendoWindow");
			//}else{
			//	supper_edit_Component.refresh(".apps/common/smart/supperEdit/supper_EditWindow.html");
			//	supper_edit_Component.open();
			//}
		}
	});
	$("#testBox").kendoMaskedTextBox({
		mask: ""
	})
	
});
