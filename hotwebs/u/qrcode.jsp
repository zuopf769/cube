<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="uap.qrlogin.QRCodeUtil"%>
<%@ page import="java.net.InetAddress"%>
<%@ page import="java.net.UnknownHostException"%>
<%@ page import="java.awt.image.BufferedImage"%>
<%@ page import="javax.imageio.ImageIO"%>

<%
		String uuid = request.getParameter("uuid");
		String content = "http://";
		
		String filepath=request.getRealPath("/")+"qrlogo.jpg";
		
		//String locaHost = InetAddress.getLocalHost().getHostAddress();
		
		String localHost = request.getLocalAddr();
		String localPort = request.getLocalPort()+"";
		
		content +=localHost + ":"+localPort+"/upservices/uap.qrlogin.QrLogin/uap/qrlogin?uuid="+uuid;
		
		out.clearBuffer();  
		
		response.setContentType("application/binary");
		
		QRCodeUtil.encode(content, filepath,response.getOutputStream(), true);
			
			
		//BufferedImage image = QRCodeUtil.createImage(content,  "C:/UAP-STUDIO/UAP/hotwebs/u/logo.jpg",  true);
		//	response.getOutputStream().write(image);
		//ImageIO.write(image, "JPEG", response.getOutputStream());
		
%>