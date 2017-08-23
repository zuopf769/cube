/*���� ����*/
cb.formula.fun = {}

/*abs,acos,acosh(z),add,angle,asin,asinh,atan,atanh,cos,cosh,div,exp,getresult,int,Ln,log,
max,min,mod,mul,rand,round,sgn,sin,sinh,sqrt*/

/*����num�ľ���ֵ*/
cb.formula.fun.abs = function(x){
	return Math.abs(x)
};

/*����һ������x�ķ�����,����ֵ��0��Pi֮��*/
cb.formula.fun.acos = function(x){
	return Math.acos(x)
};

/*acosh(z)=log(z + sqrt(z*z - 1))*/
cb.formula.fun.acosh = function(x){
	return Math.log(x + Math.sqrt(x*x - 1))
};

/*���ڸ߾��ȼӷ�����*/
cb.formula.fun.add = function(x,y){
	return x + y;
};

/*Math.atan2(x.doubleValue(), y.doubleValue())*/
cb.formula.fun.angle = function(x,y){
	return Math.atan2(parseFloat(x), parseFloat(y));
};

/*����һ������x�ķ�����,����ֵ��-Pi/2��Pi/2֮��*/
cb.formula.fun.asin = function(x){
	return Math.asin(x);
};

/*asinh(z)  =  log(z + sqrt(z*z + 1))*/
cb.formula.fun.asinh = function(z){
	return Math.log(z + Math.sqrt(z*z + 1))
};

/*����һ������x�ķ�����ֵ,����ֵ��-Pi/2��Pi/2֮��*/
cb.formula.fun.atan = function(x){
	return Math.atan(x);
};

/*atanh(z)  =  1/2 * log( (1+z)/(1-z) )*/
cb.formula.fun.atanh = function(z){
	return  1/2 * Math.log( (1+z)/(1-z) );
};

/*���ظ����Ƕ�x������ֵ*/
cb.formula.fun.cos = function(x){
	return  Math.cos(x);
};

/*cosh(z)  =  ( exp(z) + exp(-z) ) / 2*/
cb.formula.fun.cosh = function(z){
	return  ( Math.exp(z) + Math.exp(-z) ) / 2
};

/*���ڸ߾��ȳ�������*/
cb.formula.fun.div = function(x,y){
	return  parseFloat(x)/parseFloat(y);
};
/*e��x�η�*/
cb.formula.fun.exp = function(x){
	return  Math.exp(x);
};

/*�����������ĺ�*/
cb.formula.fun.getresult = function(x,y){
	return  x + y;
};

/*int(���ֻ����ַ���) ������ת��Ϊint����*/
cb.formula.fun.int = function(x){
	return  parseInt(x);
};

/*���ظ�����ֵx����Ȼ����*/
cb.formula.fun.ln = function(x){
	return  Math.log(x);
};

/*���ظ�����ֵx����Ȼ����, ��֧��*/
cb.formula.fun.log = function(x){
	return  Math.log(x);
};


/*���� x �� y �е����ֵ*/
cb.formula.fun.max = function(x,y){
	return  Math.max(x,y);
};


/*���� x �� y �е����ֵ*/
cb.formula.fun.min = function(x,y){
	return  Math.min(x,y);
};

/*��ģ����*/
cb.formula.fun.mod = function(x,y){
	x = parseInt(x);
	y = parseInt(y);
	return  x/y;
};

/*���ڸ߾��ȳ˷�����*/
cb.formula.fun.mul = function(x){	
	return  x*y;
};

/*���ڸ߾��ȳ˷�����*/
cb.formula.fun.rand = function(x){	
	return Math.random(x);
};

/*���ڸ߾��ȳ˷�����, ��֧��*/
cb.formula.fun.round = function(num,index){	
	return Math.round(num);
};

/*����num����0ʱ,����1,����0ʱ,����0,С��0ʱ����-1*/
cb.formula.fun.sgn = function(num){	
	if(num>0) return 1;
	else if(num==0) return 0;
	else return -1;
};

/*���ظ����Ƕ�x������ֵ*/
cb.formula.fun.sin = function(x){	
	return Math.sin(x);
};


/*���ظ����Ƕ�x������ֵ*/
cb.formula.fun.sinh = function(z){	
	return ( Math.exp(z) - Math.exp(-z) ) / 2
};

/*���ظ����Ƕ�x������ֵ*/
cb.formula.fun.sqrt = function(x){	
	return Math.sqrt(x);
};


/*���� ����*/

/*�������ڱȽ�,������������ָ��ʱ����Ĳ�ֵ 
	�ɱȽϵ�ʱ�������"Y"-�Ƚ���;"M"-�Ƚ���;"D"-�Ƚ���;
	"H"-�Ƚ�Сʱ;"m"-�ȽϷ���;"S"-�Ƚ���.
	����:compareDate("2005-12-27 23:12:10", toDateTime("2005-12-27 23:12:08"), "S")
	����������������������*/
cb.formula.fun.comparedate = function(date1, date2, field){	
	var result = null;
	var startTime = date1;
	var endTime = date2;
	//��Ϊ����������
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

/*���ص�ǰ����*/
cb.formula.fun.date = function(){
	return new Date();
}

/*������ָ�����ڵ��ꡢ�»�����������ĳ��ֵnum,�����ӵ�ʱ����fieldchar
	����"Y"-������;"M"-������;"D"-������;"H"-����Сʱ;"m"-���ӷ���;"S"-������.
	����dateAdd("23:13:23", 1, "H")��ʾ��ǰ���ʱ������һСʱ.*/
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

/*���ڽ�ʱ���ʽ��Ϊ�������ַ���,����date������ʱ���ַ���,
	Ҳ������Date����,patternΪ��ʽ������,yyyy��ʾ��,MM��ʾ��,dd��ʾ����,
	HH��ʾСʱ,mm��ʾ����,ss��ʾ��.
	����dateFormat("2006-07-04 12:12:12", "����:yyyy-MM-dd HH:mm:ss") 
	������"����:2006-07-04 12:12:12".*/
cb.formula.fun.dateformat =function(date, format){
	 if (arguments.length < 2 && !date.getTime) {
            format = date;
            date = new Date();
        }
        typeof format != 'string' && (format = 'YYYY��MM��DD�� HHʱmm��SS��');
        var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '��', 'һ', '��', '��', '��', '��', '��'];
        return format.replace(/YYYY|YY|MM|DD|HH|mm|SS|����|��|www|week/g, function(a) {
            switch (a) {
            case "YYYY": return date.getFullYear();
            case "YY": return (date.getFullYear()+"").slice(2);
            case "MM": return check(date.getMonth() + 1);
            case "DD": return check(date.getDate());
            case "HH": return check(date.getHours());
            case "mm": return check(date.getMinutes());
            case "SS": return check(date.getSeconds());
            case "����": return "����" + week[date.getDay() + 7];
            case "��": return "��" +  week[date.getDay() + 7];
            case "week": return week[date.getDay()];
            case "www": return week[date.getDay()].slice(0,3);
            }
        });

		function check(num){
			if(num<10) return "0" + num;
			return num;
		}
}

/*���ص�ǰ���ں�ʱ��*/
cb.formula.fun.datetime = function(){
	return new Date();
}

/*������date������*/
cb.formula.fun.dayof = function(date){
	return date.getDate();
};

/*��ʽ����ַ�����ݵ�ַ��id����ַ��ʽ�������Ը�ʽ�����õ���ʽ*/
cb.formula.fun.formataddress = function(id){
	return "";
};

/*�õ���ǰ��¼ҵ��ʱ�䣬ǰ��̨�����ã�����Ǻ�̨ʹ�ã����ܻ�ò���*/
cb.formula.fun.loginbusidate = function(){
	return "";
};

/*��ǰ��*/
cb.formula.fun.mon = function(){
	return (new Date()).getMonth();
};

/*�õ�ָ�������ڵ��·�*/
cb.formula.fun.monof = function(date){
	return date.getMonth();
};



/*ȡ�õ�ǰʱ��,��ʽ��HH:mm:SS*/
cb.formula.fun.time = function(date){
	var h = date.getHours();
	if(h<10) { h = "0" + h.toString(); }
	var m = date.getMinutes();
	if(m<10) { m = "0" + m.toString(); }
	var s = date.getSeconds();
	if(s<10) { s = "0" + s.toString(); }
	return h +":" + m +":"+ s;
};

/*���ַ�����ʽ��ʱ��strת����UFDate����*/
cb.formula.fun.todate = function(str){
	return  new Date(str);
};

/*���ַ�����ʽ��ʱ��strת����UFDateTime����,����toDateTime("2006-10-15 21:01:01").*/
cb.formula.fun.todatetime = function(str){
	return new Date(str);
};

/*���ַ�����ʽ��ʱ��strת����UFTime����*/
cb.formula.fun.totime = function(str){
	return new Date(str);
};

/*��ǰ��*/
cb.formula.fun.year = function(){
	return (new Date()).getYear();
};

/*������date����*/
cb.formula.fun.yearof = function(date){
	return date.getYear();
};


/*���� ����*/

/*getChineseCurrency(Object)��������ַ���������ת��Ϊ��д���*/
cb.formula.fun.getchinesecurrency = function(numberValue){
	var numberValue=new String(Math.round(numberValue*100)); // ���ֽ��
	var chineseValue=""; // ת����ĺ��ֽ��
	var String1 = "��Ҽ��������½��ƾ�"; // ��������
	var String2 = "��Ǫ��ʰ��Ǫ��ʰ��Ǫ��ʰԪ�Ƿ�"; // ��Ӧ��λ
	var len=numberValue.length; // numberValue ���ַ�������
	var Ch1; // ���ֵĺ������
	var Ch2; // ����λ�ĺ��ֶ���
	var nZero=0; // ����������������ֵ�ĸ���
	var String3; // ָ��λ�õ���ֵ
	if(len>15){
		alert("�������㷶Χ");
		return "";
	}
	if (numberValue==0){
		chineseValue = "��Ԫ��";
		return chineseValue;
	} 
	String2 = String2.substr(String2.length-len, len); // ȡ����Ӧλ����STRING2��ֵ
	for(var i=0; i<len; i++){
		String3 = parseInt(numberValue.substr(i, 1),10); // ȡ����ת����ĳһλ��ֵ
		if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
			if ( String3 == 0 ){
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			}
			else if ( String3 != 0 && nZero != 0 ){
				Ch1 = "��" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
			else{
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		}
		else{ // ��λ�����ڣ��ڣ���Ԫλ�ȹؼ�λ
			if( String3 != 0 && nZero != 0 ){
				Ch1 = "��" + String1.substr(String3, 1);
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
			if( i == (len - 11) || i == (len - 3)){ // �����λ����λ��Ԫλ�������д��
				Ch2 = String2.substr(i, 1);
			}	
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	} 
	if ( String3 == 0 ){ // ���һλ���֣�Ϊ0ʱ�����ϡ�����
		chineseValue = chineseValue + "��";
	} 
	return chineseValue;
}


/*getEnglishCurrency(mark,number)�����ֽ��תΪӢ���ı�����*/
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

/*setThMark(String)��������ַ���������תΪ�������ǧ��λ��־*/
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




/*�ַ��� ����*/
/**charat,endswith,equalsignorcase,indexof,isempty,lastindexof,left,leftstr,length,
mid,right,rightstr,startswith,tolowercase,tostring,touppercase,trimzero*/

/*charat(str,index)�õ��ַ���str�е�index���ַ�*/
cb.formula.fun.charat = function(str,index){
	return str.charAt(index);
};

/*endswith(str, end)�ж��ַ���str�Ƿ����ַ���end��β*/
cb.formula.fun.endswith = function(str,end){
	var index = str.lastIndexOf(end);
	if(index==-1) return false;
	var len = end.length;

	if(str.length-index ==  end.length){
		return true;
    }
	return false;
};

/*equalsIgnoreCase(str1, str2)�жϺ��Դ�Сд�ַ���st1�Ƿ����ַ���st2���*/
cb.formula.fun.equalsignorcase = function(str1,str2){
	if(str1.length==str2.length) {
		if(str1.toLowerCase()== str2.toLowerCase()){
			return true;
		}		
	}

	return false;
};

/*indexOf(str1, str2) �ж��ַ���st1�е�һ���ַ���st2���ڵ�λ��,
����lastIndexOf("HI,UAP2006,UAP","UAP")����3.
*/
cb.formula.fun.indexof = function(str1,str2){
	return str1.indexOf(str2);
};

/*isEmpty(����)�����жϱ����Ƿ�Ϊ��,�����մ�("")����ֵ(null)
*/
cb.formula.fun.isempty = function(str){
	if(str.length==0 || str=="" || str == null) {
		return true;
	}
	return false;
};

/*lastIndexOf(str1, str2) �ж��ַ���st1�����һ���ַ���st2���ڵ�λ��,
  ����lastIndexOf("HI,UAP2006,UAP","UAP")����11.
*/
cb.formula.fun.lastindexof = function(str1,str2){
	return str1.lastIndexOf(str2);
};

/*left(st, index) ���ַ���st���ǰindex���ַ���ɵ��ַ���
*/
cb.formula.fun.left = function(st1,str2){
	
};
/*
leftStr(st,len,defaultStr) ���ַ���st���ǰlen���ַ���ɵ��ַ�����
����ַ�������С��len������defaultStr����,
����leftStr("abc",6,"@")������abc@@@.
*/
cb.formula.fun.leftstr = function(st,len,defaultStr){
	if(st.length<=len){
		return st+defaultStr;
	}
	else{
 		return st.subString(0,len-1);
	}
};
/*length(st) ���ַ���st�ĳ���*/
cb.formula.fun.length = function (str) {
    if (str) {
        return str.toString().length;
    }
	return 0;
};
/*mid(String st, int start, int end) ���ַ���st���ǰ��start���ַ���
��end���ַ�֮����ַ���*/
cb.formula.fun.mid = function(st,start,end){
	if(start>=end || st.length<end) alert("��������");
	return st.subString(start,end);
};

/*right(String st, int index) ���ַ���st�ұ�ǰindex���ַ���ɵ��ַ���*/
cb.formula.fun.right = function(st,index){
	if(st.length<index)  alert("��������");
	var start = st.length - index;
	return st.subString(start,st.length-1);
};
/*rightStr(st,len,defaultStr) ���ַ���st�ұߺ�len���ַ���ɵ��ַ�����
����ַ�������С��len������defaultStr����,
����rightStr("abc",6,"@")������abc@@@.*/
cb.formula.fun.rightstr = function(st,len,defaultStr){
	if(st.length<=len){
		return st+defaultStr;
	}
	else{
		var start = st.length - index;
 		return st.subString(start,st.length-1);
	}
};
/*startsWith(String st, String start) �ж��ַ���st�Ƿ����ַ���start��ͷ*/
cb.formula.fun.startsWith = function(st, start){
	var index = st.indexOf(start);
	if(index==0) return true;
	return false;
};
/*toLowerCase(String st) ���ַ���st��Сд��ʽ,����toLowerCase("Abc")����"abc".*/
cb.formula.fun.tolowercase = function(st){
 	return st.toLowerCase();
};
/*toString(obj) ������objת��Ϊ����������ʶ����ַ�����ʽ*/
cb.formula.fun.tostring = function(obj){
	return obj.toString();
};
/*toUpperCase(String st) ���ַ���st�Ĵ�д��ʽ*/
cb.formula.fun.touppercase = function(st){
	return st.toUpperCase();
};

/*trimzero()�����ַ���������str��ĩβ0ֵ*/
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

/*���� ����*/
cb.formula.fun.iif = function(condition, result1, result2){
	if(condition){
		return result1;
	}else{
		return result2;
	}
};


/*���� �Զ���*/

/*debug(����)���ڴ�ӡ��������ֵ,�Ա���е���*/
cb.formula.fun.debug = function(info){
	console.debug(info);
};

/*����ȡ�õ������Ͷ���������
  �������������ݿ��ѯ�ض��ֶε�ֵ,�书������SQL���:
  select fieldname from tablename where pkfield = pkvalue 
  ������SQL�����Կ������������ĺ���.
*/
cb.formula.fun.getColValueRes = function(tablename,fieldname,pkfield,pkvalue){
	//��ȡ����

};

/*���� ����ģ��������ԴID��,ȡ����Ӧ�Ķ�������Դ*/
cb.formula.fun.getlangres = function(modelname,resID){
	//��ȡ����
};

/*���� ������stת��ΪUFBoolean����*/
cb.formula.fun.tobeoolean = function(obj){
	return obj.toString();
};


/*���� ���ݿ⺯��*/

/* ���������÷���˺��� */
cb.formula.fun.callServer = function(funName,paras){
	var proxy = cb.rest.DynamicProxy.create({fun:{async:false, url: "u8services/classes/UAP/com.yonyou.u8.framework.server.function.FunctionService?method=GetFunResult&dataType=com.yonyou.u8.framework.server.function.FunctionData2", method: "POST"}});
	var opts = {"methordName":funName,"paras":paras};

    var result="default";
	proxy.fun(opts,function(data){
		result =data.result;
	})
	return result;
};

/*�ǹ��ڻ��ƽ̨�и�������ĺ���,��gl_freevalue���и���freevalueID��checktype����checkvalue*/
cb.formula.fun.ass = function(freevalueID,checktype){
	return cb.formula.fun.callServer("ass",cb.formula.fun.combine(arguments));
};


/*cvn(tablename,fieldname,pkfield,pkvalue)
�������������ݿ��ѯ�ض��ֶε�ֵ,�䷵�ص�ֵ��ֱ����Ϊ����ʹ��
*/
cb.formula.fun.cvn = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("cvn",cb.formula.fun.combine(arguments));
};

/*cvs(tablename,fieldname,pkfield,pkvalue)
�������������ݿ��ѯ�ض��ֶε�ֵ,�䷵�ص�ֵ��ֱ����Ϊ�ַ���ʹ��
*/
cb.formula.fun.cvs = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("cvs",cb.formula.fun.combine(arguments));
};

/*getColNmv(tablename,fieldname,pkfield,pkvalue)
�������������ݿ��ѯ�ض��ֶε�ֵ,�䷵�ص�ֵ��ֱ����Ϊ����ʹ��
�书������SQL���:select fieldname from tablename where pkfield = pkvalue
������SQL�����Կ������������ĺ���.
*/
cb.formula.fun.getColNmv = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColNmv",cb.formula.fun.combine(arguments));
};


/*fieldname1,fieldname2->getColsValue("tablename","fieldname1","fieldname2","pkfield",pkvalue)
�������������ݿ��ѯ����ֶε�ֵ,��ߴ���ֵ���ֶ�Ҫ�ö��ŷָ�,ע��������ֶΣ�����Ҫ��˫������������
*/
cb.formula.fun.getColsValue = function(tablename,fieldname1,fieldname2,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColsValue",cb.formula.fun.combine(arguments));
};

/*getColValue(tablename,fieldname,pkfield,pkvalue)
�������������ݿ��ѯ�ض��ֶε�ֵ,�书������SQL���:
select fieldname from tablename where pkfield = pkvalue 
������SQL�����Կ������������ĺ���.
*/
cb.formula.fun.getColValue = function(tablename,fieldname,pkfield,pkvalue){
	return cb.formula.fun.callServer("getColValue",cb.formula.fun.combine(arguments));
};

/*getColValue2(tablename,fieldname,pkfield1,pkvalue1,pkfield2,pkvalue2)
�������������ݿ��ѯ�ض��ֶε�ֵ,�书������SQL���:
select fieldname from tablename where pkfield1 = pkvalue1 and pkfield2 = pkvalue2.
������SQL�����Կ������������ĺ���.

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
getMLCValue("tablename","fieldname","pkfield",pkvalue)�������������ݿ��ѯ�ض���ǰ��¼���ֶ�Ӧ�����ֶε�ֵ
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
