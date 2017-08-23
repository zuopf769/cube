<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.io.File"%>
<%@ page import="java.io.ByteArrayOutputStream"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="u8.ui.engine.UIEngine"%>
<%@ page import="u8.ui.util.FilePath"%>
<%@ page import="u8.md.tt.common.TransferArgs"%>
<%@ page import="u8.md.tt.transfer.TempletLoader"%>
<%@ page import="u8.md.tt.transfer.TransferFacade"%>
<%@ page import="u8.ui.config.UIEngineConfig"%>
<%
		//设置编码
        request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		//清空界面空行
		out.clear();
		//参数处理
		String appFullname = request.getParameter("app");
		if(appFullname==null || appFullname.length()==0){
			out.println("请确定访问哪个应用");
			return;
		}
		String cache = request.getParameter("cache");
		String type = request.getParameter("type");
		String size = request.getParameter("size");
		String transfer = request.getParameter("transfer");
		boolean isCache = (cache!=null && cache.toLowerCase().equals("false"))?false:true;
		String renderType = (type==null || type.length()==0)?"html":type;
		String screenSize = (size==null || size.length()==0)?"M":size;
		boolean isTransfer = (transfer!=null && transfer.toLowerCase().equals("true"))?true:false;
		
		try {
			//代码引擎
			if(!UIEngine.getInstance().isInited()) {
				//获取配置文件
				String dir = getServletContext().getRealPath("/");
				FilePath.setCurrentDirectory(dir);
				String configFileName = FilePath.combine(dir, "config/app.config");
				UIEngine.getInstance().init(configFileName);
			}
			UIEngine engine = UIEngine.getInstance();
			if(isTransfer){
				//模板转换
				UIEngineConfig engineConfig = engine.config();
				boolean b = transfer(engineConfig,appFullname,screenSize);
				if(!b){
					out.print("转换失败，未找到模板");
					return;
				}
			}
			//设置引擎参数
			HashMap<String, Object> params = new HashMap<String, Object>();
			params.put("isCache", isCache);
			params.put("type", renderType);
			params.put("screenSize", screenSize);
			//引擎执行
			if(appFullname.startsWith("common")){
				if(appFullname.startsWith("common.refer.Refer")){
					String refCode = request.getParameter("refCode");
					if(refCode==null || refCode.length()==0){
						throw new Exception("common.refer.Refer:refCode needed.");
						//out.print("common.refer.Refer:refCode needed.");
						//return;
					}
					u8.pubitf.uap.ref.common.QueryReferType refService = new u8.pubitf.uap.ref.common.QueryReferType();
					int refType = refService.getReferType(refCode);
					//int refType = 1;
					appFullname = appFullname.substring(0,appFullname.length()-3);
					if(refType==0){
						appFullname = appFullname + "Tree";
					}else if(refType==1){
						appFullname = appFullname + "Table";
					}else if(refType==2){
						//default name
					}else{
						//throw new Exception("common.refer.Refer:refCode not found.");
						out.print("common.refer.Refer:refCode not found.");
						out.print(refCode);
						out.print(refType);
						out.print("common.refer.Refer:refCode not found.");
						return;
					}
					appFullname = appFullname + "App";
				}
				StringBuffer buffer = engine.renderCache(appFullname, params);
				out.print(buffer);
			}else{
				StringBuffer buffer = engine.render(appFullname, params);
				out.print(buffer);
			}
		} catch (Exception e) {
			//错误处理，输出错误堆栈
			ByteArrayOutputStream buf = new ByteArrayOutputStream();
			try {
				e.printStackTrace(new PrintWriter(buf, true));
				StringBuffer buffer = new StringBuffer(buf.toString());
				out.println(buffer.toString());
			} finally {
				if (buf != null) {
					try {
						buf.close();
					} catch (IOException localIOException1) {
					}
				}
			}
		}
%>
<%!
	/*
	 * 模板转换方式二，根据app转换单据和查询模板。
	 */
	private boolean transfer(UIEngineConfig engineConfig,String app,String screenSize)
			throws Exception {
		TransferArgs args = new TransferArgs();
		args.config(engineConfig);
		args.appFullname(app);
		args.screenSize(screenSize);

		TransferFacade facade = new TransferFacade();
		boolean b = facade.transfer2(args);
		return b;
	}
%>