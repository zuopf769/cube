/*数字 函数*/
cb.formula.fun = {}

/*abs,acos,acosh(z),add,angle,asin,asinh,atan,atanh,cos,cosh,div,exp,getresult,int,Ln,log,
max,min,mod,mul,rand,round,sgn,sin,sinh,sqrt*/

/*求数num的绝对值*/
cb.formula.fun.abs = function(x){
	return Math.abs(x)
};

/*返回一个弧度x的反余弦,弧度值在0到Pi之间*/
cb.formula.fun.acos = function(x){
	return Math.acos(x)
};

/*acosh(z)=log(z + sqrt(z*z - 1))*/
cb.formula.fun.acosh = function(x){
	return Math.log(x + Math.sqrt(x*x - 1))
};

/*用于高精度加法运算*/
cb.formula.fun.add = function(x,y){
	return x + y;
};

/*Math.atan2(x.doubleValue(), y.doubleValue())*/
cb.formula.fun.angle = function(x,y){
	return Math.atan2(parseFloat(x), parseFloat(y));
};

/*返回一个弧度x的反正弦,弧度值在-Pi/2到Pi/2之间*/
cb.formula.fun.asin = function(x){
	return Math.asin(x);
};

/*asinh(z)  =  log(z + sqrt(z*z + 1))*/
cb.formula.fun.asinh = function(z){
	return Math.log(z + Math.sqrt(z*z + 1))
};

/*返回一个弧度x的反正切值,弧度值在-Pi/2到Pi/2之间*/
cb.formula.fun.atan = function(x){
	return Math.atan(x);
};

/*atanh(z)  =  1/2 * log( (1+z)/(1-z) )*/
cb.formula.fun.atanh = function(z){
	return  1/2 * Math.log( (1+z)/(1-z) );
};

/*返回给定角度x的余弦值*/
cb.formula.fun.cos = function(x){
	return  Math.cos(x);
};

/*cosh(z)  =  ( exp(z) + exp(-z) ) / 2*/
cb.formula.fun.cosh = function(z){
	return  ( Math.exp(z) + Math.exp(-z) ) / 2
};

/*用于高精度除法运算*/
cb.formula.fun.div = function(x,y){
	return  parseFloat(x)/parseFloat(y);
};
/*e的x次方*/
cb.formula.fun.exp = function(x){
	return  Math.exp(x);
};

/*计算两个数的和*/
cb.formula.fun.getresult = function(x,y){
	return  x + y;
};

/*int(数字或者字符串) 将变量转换为int类型*/
cb.formula.fun.int = function(x){
	return  parseInt(x);
};

/*返回给定数值x的自然对数*/
cb.formula.fun.ln = function(x){
	return  Math.log(x);
};

/*返回给定数值x的自然对数, 不支持*/
cb.formula.fun.log = function(x){
	return  Math.log(x);
};


/*返回 x 和 y 中的最高值*/
cb.formula.fun.max = function(x,y){
	return  Math.max(x,y);
};


/*返回 x 和 y 中的最低值*/
cb.formula.fun.min = function(x,y){
	return  Math.min(x,y);
};

/*求模运算*/
cb.formula.fun.mod = function(x,y){
	x = parseInt(x);
	y = parseInt(y);
	return  x/y;
};

/*用于高精度乘法运算*/
cb.formula.fun.mul = function(x){	
	return  x*y;
};

/*用于高精度乘法运算*/
cb.formula.fun.rand = function(x){	
	return Math.random(x);
};

/*用于高精度乘法运算, 不支持*/
cb.formula.fun.round = function(num,index){	
	return Math.round(num);
};

/*当数num大于0时,返回1,等于0时,返回0,小于0时返回-1*/
cb.formula.fun.sgn = function(num){	
	if(num>0) return 1;
	else if(num==0) return 0;
	else return -1;
};

/*返回给定角度x的正弦值*/
cb.formula.fun.sin = function(x){	
	return Math.sin(x);
};


/*返回给定角度x的正弦值*/
cb.formula.fun.sinh = function(z){	
	return ( Math.exp(z) - Math.exp(-z) ) / 2
};

/*返回给定角度x的正弦值*/
cb.formula.fun.sqrt = function(x){	
	return Math.sqrt(x);
};


/*日期 函数*/

/*用于日期比较,返回两个日期指定时间域的差值 
	可比较的时间域包括"Y"-比较年;"M"-比较月;"D"-比较日;
	"H"-比较小时;"m"-比较分钟;"S"-比较秒.
	比如:compareDate("2005-12-27 23:12:10", toDateTime("2005-12-27 23:12:08"), "S")
	将返回两个日期相差的秒数*/
cb.formula.fun.comparedate = function(date1, date2, field){	
	var result = null;
	var startTime = date1;
	var endTime = date2;
	//作为除数的数字
	var divNum = 1;
	switch (field) {
		case "S":
			divNum = 1000;
			break;
		case "m":
			divNum = 1000 * 60;
			break;
		case "H":
			divNum = 1000 * 3600;
			break;
		case "D":
			divNum = 1000 * 3600 * 24;
			break;
		default:
			break;
	}
	if(field=="Y"){
		result = endTime.getFullYear() - startTime.getFullYear();
	}
	else if(field=="M"){
		var year = endTime.getFullYear() - startTime.getFullYear();
		var month = endTime.getMonth() - startTime.getMonth();
		result = year * 12 + month;
	}
	else{
		result = parseInt((endTime.getTime() - startTime.getTime()) / parseInt(divNum));
	}
	return result ;
};

/*返回当前日期*/
cb.formula.fun.date = function(){
	return new Date();
}

/*返回在指定日期的年、月或者日上增加某个值num,可增加的时间域fieldchar
	包括"Y"-增加年;"M"-增加月;"D"-增加日;"H"-增加小时;"m"-增加分钟;"S"-增加秒.
	比如dateAdd("23:13:23", 1, "H")表示对前面的时间增加一小时.*/
cb.formula.fun.dateAdd = function(date1, num, fieldchar){
	var delta = parseInt(num);
	switch(fieldchar){
		case "Y":
			date1.setFullYear(date1.getFullYear()+delta);
			break;
		case "M":
			date1.setMonth(date1.getMonth()+delta);
			break;
		case "D":
			date1.setDate(date1.getDate()+delta);
			break;
		case "H":
			date1.setHours(date1.getHours()+delta);
			break;
		case "m":
			date1.setMinute(date1.getMinute()+delta);
			break;
		case "S":
			date1.setSeconds(date1.getSecnods()+delta);
			break;
	}

	return date1;
}

/*用于将时间格式化为期望的字符串,其中date可以是时间字符串,
	也可以是Date对象,pattern为格式化参数,yyyy表示年,MM表示月,dd表示天数,
	HH表示小时,mm表示分钟,ss表示秒.
	比如dateFormat("2006-07-04 12:12:12", "日期:yyyy-MM-dd HH:mm:ss") 
	将返回"日期:2006-07-04 12:12:12".*/
cb.formula.fun.dateformat =function(date, format){
	 if (arguments.length < 2 && !date.getTime) {
            format = date;
            date = new Date();
        }
        typeof format != 'string' && (format = 'YYYY年MM月DD日 HH时mm分SS秒');
        var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
        return format.replace(/YYYY|YY|MM|DD|HH|mm|SS|星期|周|www|week/g, function(a) {
            switch (a) {
            case "YYYY": return date.getFullYear();
            case "YY": return (date.getFullYear()+"").slice(2);
            case "MM": return check(date.getMonth() + 1);
            case "DD": return check(date.getDate());
            case "HH": return check(date.getHours());
            case "mm": return check(date.getMinutes());
            case "SS": return check(date.getSeconds());
            case "星期": return "星期" + week[date.getDay() + 7];
            case "周": return "周" +  week[date.getDay() + 7];
            case "week": return week[date.getDay()];
            case "www": return week[date.getDay()].slice(0,3);
            }
        });

		function check(num){
			if(num<10) return "0" + num;
			return num;
		}
}

/*返回当前日期和时间*/
cb.formula.fun.datetime = function(){
	return new Date();
}

/*求日期date的天数*/
cb.formula.fun.dayof = function(date){
	return date.getDate();
};

/*格式化地址，根据地址簿id将地址格式化成语言格式中设置的样式*/
cb.formula.fun.formataddress = function(id){
	return "";
};

/*得到当前登录业务时间，前后台均可用，如果是后台使用，可能会得不到*/
cb.formula.fun.loginbusidate = function(){
	return "";
};

/*求当前月*/
cb.formula.fun.mon = function(){
	return (new Date()).getMonth();
};

/*得到指定日期内的月份*/
cb.formula.fun.monof = function(date){
	return date.getMonth();
};



/*取得当前时间,格式是HH:mm:SS*/
cb.formula.fun.time = function(date){
	var h = date.getHours();
	if(h<10) { h = "0" + h.toString(); }
	var m = date.getMinutes();
	if(m<10) { m = "0" + m.toString(); }
	var s = date.getSeconds();
	if(s<10) { s = "0" + s.toString(); }
	return h +":" + m +":"+ s;
};

/*将字符串格式的时间str转换成UFDate对象*/
cb.formula.fun.todate = function(str){
	return  new Date(str);
};

/*将字符串格式的时间str转换成UFDateTime对象,比如toDateTime("2006-10-15 21:01:01").*/
cb.formula.fun.todatetime = function(str){
	return new Date(str);
};

/*将字符串格式的时间str转换成UFTime对象*/
cb.formula.fun.totime = function(str){
	return new Date(str);
};

/*求当前年*/
cb.formula.fun.year = function(){
	return (new Date()).getYear();
};

/*求日期date的年*/
cb.formula.fun.yearof = function(date){
	return date.getYear();
};


/*财务 函数*/

/*getChineseCurrency(Object)将传入的字符串或数字转换为大写金额*/
cb.formula.fun.getchinesecurrency = function(numberValue){
	var numberValue=new String(Math.round(numberValue*100)); // 数字金额
	var chineseValue=""; // 转换后的汉字金额
	var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
	var len=numberValue.length; // numberValue 的字符串长度
	var Ch1; // 数字的汉语读法
	var Ch2; // 数字位的汉字读法
	var nZero=0; // 用来计算连续的零值的个数
	var String3; // 指定位置的数值
	if(len>15){
		alert("超出计算范围");
		return "";
	}
	if (numberValue==0){
		chineseValue = "零元整";
		return chineseValue;
	} 
	String2 = String2.substr(String2.length-len, len); // 取出对应位数的STRING2的值
	for(var i=0; i<len; i++){
		String3 = parseInt(numberValue.substr(i, 1),10); // 取出需转换的某一位的值
		if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
			if ( String3 == 0 ){
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			}
			else if ( String3 != 0 && nZero != 0 ){
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
			else{
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		}
		else{ // 该位是万亿，亿，万，元位等关键位
			if( String3 != 0 && nZero != 0 ){
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
			else if ( String3 != 0 && nZero == 0 ){
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
			else if( String3 == 0 && nZero >= 3 ){
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			}
			else{
				Ch1 = "";
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if( i == (len - 11) || i == (len - 3)){ // 如果该位是亿位或元位，则必须写上
				Ch2 = String2.substr(i, 1);
			}	
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	} 
	if ( String3 == 0 ){ // 最后一位（分）为0时，加上“整”
		chineseValue = chineseValue + "整";
	} 
	return chineseValue;
}


/*getEnglishCurrency(mark,number)将数字金额转为英文文本描述*/
cb.formula.fun.getenglishcurrency =function(num){
	var arr1=new Array(""," thousand"," million"," billion")
	var arr2=new Array("zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety")
	var arr3=new Array("zero","one","two","three","four","five","six","sever","eight","nine");
	var arr4=new Array("ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen");

	function Translate(num){
		var len=num.length,i,j=0,strRet="";
		var cols=Math.ceil(len/3);
		var first=len-cols*3
		var strRet=""
		for(i=first;i<len;i+=3){
			++j;
			if(i>=0)
				num3=num.substring(i,i+3)
			else
				num3=num.substring(0,first+3)
			strEng=English(num3)
			if(strEng!=""){
				if(strRet!="")	strRet+=","	
				strRet+=English(num3)+arr1[cols-j]
			}
		}
		return strRet
	}
	function English(num){
		strRet=""
		if((num.length==3) && (num.substr(0,3)!="000")){
			if((num.substr(0,1)!="0")){
				strRet+=arr3[num.substr(0,1)]+" hundred"
				if(num.substr(1,2)!="00")strRet+=" and "
			}
			num=num.substring(1);
		}
		if((num.length==2)){
			if((num.substr(0,1)=="0")){
				num=num.substring(1)
			}
			else if((num.substr(0,1)=="1")){
				strRet+=arr4[num.substr(1,2)]
			}
			else{
				strRet+=arr2[num.substr(0,1)]
				if(num.substr(1,1)!="0")strRet+="-"
				num=num.substring(1)
			}
		}
		if((num.length==1) && (num.substr(0,1)!="0")){
			strRet+=arr3[num.substr(0,1)]
		}
		return strRet;
	}

	return Translate(num);
}

/*setThMark(String)将传入的字符串或数字转为金额后加入千分位标志*/
cb.formula.fun.setthmark = function(str){

	function SplitCurrency(str) {
		str = String(str);
		var pp = 0;
		if (str.indexOf(",") > 0)
			pp = str.indexOf(",")
		else if (str.indexOf(".") > 0)
			pp = str.indexOf(".")
		else
			pp = str.length;
		pp = pp - 3;
		if (pp <= 0) return str;
		var s = str.substring(0, pp);
		var e = str.substring(pp);
		var str1 = s + "," + e;
        return SplitCurrency(str1);
    }

	return SplitCurrency(str)
}




/*字符串 函数*/
/**charat,endswith,equalsignorcase,indexof,isempty,lastindexof,left,leftstr,length,
mid,right,rightstr,startswith,tolowercase,tostring,touppercase,trimzero*/

/*charat(str,index)得到字符串str中第index个字符*/
cb.formula.fun.charat = function(str,index){
	return str.charAt(index);
};

/*endswith(str, end)判断字符串str是否以字符串end结尾*/
cb.formula.fun.endswith = function(str,end){
	var index = str.lastIndexOf(end);
	if(index==-1) return false;
	var len = end.length;

	if(str.length-index ==  end.length){
		return true;
    }
	return false;
};

/*equalsIgnoreCase(str1, str2)判断忽略大小写字符串st1是否与字符串st2相等*/
cb.formula.fun.equalsignorcase = function(str1,str2){
	if(str1.length==str2.length) {
		if(str1.toLowerCase()== str2.toLowerCase()){
			return true;
		}		
	}

	return false;
};

/*indexOf(str1, str2) 判断字符串st1中第一个字符串st2所在的位置,
比如lastIndexOf("HI,UAP2006,UAP","UAP")返回3.
*/
cb.formula.fun.indexof = function(str1,str2){
	return str1.indexOf(str2);
};

/*isEmpty(变量)用于判断变量是否为空,包括空串("")及空值(null)
*/
cb.formula.fun.isempty = function(str){
	if(str.length==0 || str=="" || str == null) {
		return true;
	}
	return false;
};

/*lastIndexOf(str1, str2) 判断字符串st1中最后一个字符串st2所在的位置,
  比如lastIndexOf("HI,UAP2006,UAP","UAP")返回11.
*/
cb.formula.fun.lastindexof = function(str1,str2){
	return str1.lastIndexOf(str2);
};

/*left(st, index) 求字符串st左边前index个字符组成的字符串
*/
cb.formula.fun.left = function(st1,str2){
	
};
/*
leftStr(st,len,defaultStr) 求字符串st左边前len个字符组成的字符串，
如果字符串长度小于len，则用defaultStr补齐,
比如leftStr("abc",6,"@")将返回abc@@@.
*/
cb.formula.fun.leftstr = function(st,len,defaultStr){
	if(st.length<=len){
		return st+defaultStr;
	}
	else{
 		return st.subString(0,len-1);
	}
};
/*length(st) 求字符串st的长度*/
cb.formula.fun.length = function (str) {
    if (str) {
        return str.toString().length;
    }
	return 0;
};
/*mid(String st, int start, int end) 求字符串st左边前第start个字符至
第end个字符之间的字符串*/
cb.formula.fun.mid = function(st,start,end){
	if(start>=end || st.length<end) alert("参数错误");
	return st.subString(start,end);
};

/*right(String st, int index) 求字符串st右边前index个字符组成的字符串*/
cb.formula.fun.right = function(st,index){
	if(st.length<index)  alert("参数错误");
	var start = st.length - index;
	return st.subString(start,st.length-1);
};
/*rightStr(st,len,defaultStr) 求字符串st右边后len个字符组成的字符串，
如果字符串长度小于len，则用defaultStr补齐,
比如rightStr("abc",6,"@")将返回abc@@@.*/
cb.formula.fun.rightstr = function(st,len,defaultStr){
	if(st.length<=len){
		return st+defaultStr;
	}
	else{
		var start = st.length - index;
 		return st.subString(start,st.length-1);
	}
};
/*startsWith(String st, String start) 判断字符串st是否以字符串start开头*/
cb.formula.fun.startsWith = function(st, start){
	var index = st.indexOf(start);
	if(index==0) return true;
	return false;
};
/*toLowerCase(String st) 求字符串st的小写形式,比如toLowerCase("Abc")返回"abc".*/
cb.formula.fun.tolowercase = function(st){
 	return st.toLowerCase();
};
/*toString(obj) 将对象obj转换为本解析器可识别的字符串形式*/
cb.formula.fun.tostring = function(obj){
	return obj.toString();
};
/*toUpperCase(String st) 求字符串st的大写形式*/
cb.formula.fun.touppercase = function(st){
	return st.toUpperCase();
};

/*trimzero()剪除字符串或数字str的末尾0值*/
cb.formula.fun.trimzero = function(str){
	var temp = str.toString();
	var result = new Array();
	for(var i=0;i<temp.length;i++)
	{
		if(temp[i]!="0")
		{
			result.push(temp[i]);
		}
	}

	return result.join("");
};

/*函数 控制*/
cb.formula.fun.iif = function(condition, result1, result2){
	if(condition){
		return result1;
	}else{
		return result2;
	}
};


/*函数 自定义*/

/*debug(变量)用于打印出变量的值,以便进行调试*/
cb.formula.fun.debug = function(info){
	console.debug(info);
};

/*用于取得单据类型多语言名称
  根据主键从数据库查询特定字段的值,其功能类似SQL语句:
  select fieldname from tablename where pkfield = pkvalue 
  从这条SQL语句可以看出各个参数的含义.
*/
cb.formula.fun.getColValueRes = function(tablename,fieldname,pkfield,pkvalue){
	//获取服务

};

/*函数 根据模块名及资源ID号,取得相应的多语言资源*/
cb.formula.fun.getlangres = function(modelname,resID){
	//获取服务
};

/*函数 将对象st转换为UFBoolean类型*/
cb.formula.fun.tobeoolean = function(obj){
	return obj.toString();
};


/*函数 数据库函数*/

/* 函数，调用服务端函数 */
cb.formula.fun.callServer = function(funName,paras){
	var proxy = cb.rest.DynamicProxy.create({fun:{async:false, url: "u8services/classes/UAP/com.yonyou.u8.framework.server.function.FunctionService?method=GetFunResult&dataType=com.yonyou.u8.framework.server.function.FunctionData2", method: "POST"}});
	var opts = {"methordName":funName,"paras":paras};

    var result="default";
	proxy.fun(opts,function(data){
		result =data.result;
	})
	return result;
};

/*是关于会计平台中辅助核算的函数,从gl_freevalue表中根据freevalueID及checktype返回checkvalue*/
cb.formula.fun.ass = function(freevalueID,checktype){
	return cb.formula.fun.callServer("ass",cb.formula.fun.combine(arguments));
};


/*cvn(tablename,fieldname,pkfield,pkvalue)
根据主键从数据库查询特定字段的值,其返回的值将直接作为数字使用
*/
cb.formula.fun.cvn = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("cvn",cb.formula.fun.combine(arguments));
};

/*cvs(tablename,fieldname,pkfield,pkvalue)
根据主键从数据库查询特定字段的值,其返回的值将直接作为字符串使用
*/
cb.formula.fun.cvs = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("cvs",cb.formula.fun.combine(arguments));
};

/*getColNmv(tablename,fieldname,pkfield,pkvalue)
根据主键从数据库查询特定字段的值,其返回的值将直接作为数字使用
其功能类似SQL语句:select fieldname from tablename where pkfield = pkvalue
从这条SQL语句可以看出各个参数的含义.
*/
cb.formula.fun.getColNmv = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColNmv",cb.formula.fun.combine(arguments));
};


/*fieldname1,fieldname2->getColsValue("tablename","fieldname1","fieldname2","pkfield",pkvalue)
根据主键从数据库查询多个字段的值,左边待赋值的字段要用逗号分割,注意里面的字段，表名要用双引号扩起来。
*/
cb.formula.fun.getColsValue = function(tablename,fieldname1,fieldname2,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColsValue",cb.formula.fun.combine(arguments));
};

/*getColValue(tablename,fieldname,pkfield,pkvalue)
根据主键从数据库查询特定字段的值,其功能类似SQL语句:
select fieldname from tablename where pkfield = pkvalue 
从这条SQL语句可以看出各个参数的含义.
*/
cb.formula.fun.getColValue = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColValue",cb.formula.fun.combine(arguments));
};

/*getColValue2(tablename,fieldname,pkfield1,pkvalue1,pkfield2,pkvalue2)
根据主键从数据库查询特定字段的值,其功能类似SQL语句:
select fieldname from tablename where pkfield1 = pkvalue1 and pkfield2 = pkvalue2.
从这条SQL语句可以看出各个参数的含义.

*/
cb.formula.fun.getColValue2 = function(tablename,fieldname,pkfield1,pkvalue1,pkfield2,pkvalue2){
	return cb.formula.fun.callServer("getColValue",cb.formula.fun.combine(arguments));
};

/*getColValueMore("tablename","selectfield","field1",value1,"field2",value2....)
*/
cb.formula.fun.getColValueMore = function(tablename,fieldname,field1,value1,field2,value2){
	return cb.formula.callServer("getColValueMore",cb.formula.fun.combine(arguments));
};

/*getColValueMoreWithCond("tablename","selectfield","field1",value1,"field2",value2...,"whereCondition")
*/
cb.formula.fun.getColValueMoreWithCond = function(tablename,selectfield,field1,value1,field2,value2,whereCondition){
	return cb.formula.fun.callServer("getColValueMoreWithCond",cb.formula.fun.combine(arguments));
};

/*
getMLCValue("tablename","fieldname","pkfield",pkvalue)根据主键从数据库查询特定当前登录语种对应名称字段的值
*/
cb.formula.fun.getMLCValue = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("getMLCValue",cb.formula.fun.combine(arguments));
};

/*
getMLCValueMoreWithCond(tablename,selectfield,field1,value1,field2,value2...,whereCondition)
*/
cb.formula.fun.getMLCValueMoreWithCond = function(tablename,selectfield,field1,value1,field2,value2,whereCondition){
	return cb.formula.fun.callServer("getMLCValueMoreWithCond",cb.formula.fun.combine(arguments));
};

cb.formula.fun.combine = function(arg) {
	var result = new Array();
	var len = arg.length;
	for(var i=0;i<len;i++){
		result.push(arg[i]);
	}
	return result.join(",");
}
