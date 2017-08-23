var funTreeDataSource = new kendo.data.HierarchicalDataSource({
	data: [
		{ categoryName: "数学函数", subCategories: [
			{ subCategoryName: "abs" ,funVal:"abs( )",tipStr:"abs(num)求数num的绝对值"},
			{ subCategoryName: "acos" ,funVal:"acos( )",tipStr:"acos(x)返回一个弧度x的反余弦,弧度值在0到Pi之间"},
			{ subCategoryName: "acosh" ,funVal:"acosh( )",tipStr:"acosh(z)  =  log(z + sqrt(z*z - 1))"},
			{ subCategoryName: "add" ,funVal:"add( , )",tipStr:"add(num1,num2)用于高精度加法运算"},
			{ subCategoryName: "angle" ,funVal:"angle( , )",tipStr:"Math.atan2(x.doubleValue(), y.doubleValue())"},
			{ subCategoryName: "asin" ,funVal:"asin( )",tipStr:"asin(x)返回一个弧度x的反正弦,弧度值在-Pi/2到Pi/2之间"},
			{ subCategoryName: "asinh" ,funVal:"asinh( )",tipStr:"asinh(z)  =  log(z + sqrt(z*z + 1))"},
			{ subCategoryName: "atan" ,funVal:"atan( )",tipStr:"atan(x)返回一个弧度x的反正切值,弧度值在-Pi/2到Pi/2之间"},
			{ subCategoryName: "atanh" ,funVal:"atanh( )",tipStr:"atanh(z)  =  1/2 * log( (1+z)/(1-z) )"},
			{ subCategoryName: "cos" ,funVal:"cos( )",tipStr:"cos(x)返回给定角度x的余弦值"},
			{ subCategoryName: "cosh" ,funVal:"cosh( )",tipStr:"cosh(z)  =  ( exp(z) + exp(-z) ) / 2"},
			{ subCategoryName: "div" ,funVal:"div( , )",tipStr:"div(num1,num2)用于高精度除法运算"},
			{ subCategoryName: "exp" ,funVal:"exp( )",tipStr:"exp(x)e的x次方"},
			{ subCategoryName: "getresult" ,funVal:"getresult()",tipStr:"计算两个数的和"},
			{ subCategoryName: "int" ,funVal:"int( )",tipStr:"int(数字或者字符串) 将变量转换为int类型"},
			{ subCategoryName: "ln" ,funVal:"ln( )",tipStr:"ln(x)返回给定数值x的自然对数"},
			{ subCategoryName: "log" ,funVal:"log( )",tipStr:"log(x)返回给定数n的以十为底的对数"},
			{ subCategoryName: "max" ,funVal:"max( , )",tipStr:"max(x, y) 求数字x,y两者中的最大值"},
			{ subCategoryName: "min" ,funVal:"min( , )",tipStr:"min(x, y) 求x,y两者中的最小值"},
			{ subCategoryName: "min" ,funVal:"min( , )",tipStr:"min(x, y) 求x,y两者中的最小值"},
			{ subCategoryName: "mod" ,funVal:"mod( , )",tipStr:"求模运算"},
			{ subCategoryName: "mul" ,funVal:"mul( , )",tipStr:"mul(num1,num2)用于高精度乘法运算"},
			{ subCategoryName: "rand" ,funVal:"rand()",tipStr:"生成随机数"},
			{ subCategoryName: "round" ,funVal:"round( , )",tipStr:"round(double num, int index) 对num保留index位小数(四舍五入)"},
			{ subCategoryName: "sgn" ,funVal:"sgn( )",tipStr:"sgn(num) 当数num大于0时,返回1,等于0时,返回0,小于0时返回-1"},
			{ subCategoryName: "sin" ,funVal:"sin( )",tipStr:"sin(x)返回给定角度x的正弦值"},
			{ subCategoryName: "sinh" ,funVal:"sinh( )",tipStr:"sinh(z)  =  ( exp(z) - exp(-z) ) / 2"},
			{ subCategoryName: "sqrt" ,funVal:"sqrt( )",tipStr:"sqrt(x)返回数值x的平方根"},
			{ subCategoryName: "sub" ,funVal:"sub( , )",tipStr:"sub(num1,num2)用于高精度减法运算"},
			{ subCategoryName: "sum" ,funVal:"sum()",tipStr:"计算两个数的和"},
			{ subCategoryName: "tan" ,funVal:"tan( )",tipStr:"tan(x)返回给定角度x的正切值"},
			{ subCategoryName: "tanh" ,funVal:"tanh( )",tipStr:"sinh(z) / cosh(z)"},
			{ subCategoryName: "tonumber" ,funVal:"tonumber( )",tipStr:"toNumber(String st) 将字符串st转换为本解析器可识别的数字"},
			{ subCategoryName: "zeroifnull" ,funVal:"zeroifnull( )",tipStr:"zeroifnull(var)表示如果var为空将返回0"}	
		] },
		{ categoryName: "日期函数", subCategories: [
			{ subCategoryName: "comparedate" ,funVal:"comparedate( , , )",tipStr:"compareDate(date1, date2, field)用于日期比较,返回两个日期指定时间域的差值,可比较的时间域包括Y-比较年;M-比较月;D-比较日;H-比较小时;m-比较分钟;S-比较秒."},
			{ subCategoryName: "date" ,funVal:"date()",tipStr:"date()返回当前日期"},
			{ subCategoryName: "dateadd" ,funVal:"dateadd( , , )",tipStr:"dateAdd(date1, num, fieldchar)返回在指定日期的年、月或者日上增加某个值num,可增加的时间域fieldchar包括Y-增加年;M-增加月;D-增加日;H-增加小时;m-增加分钟;S-增加秒."},
			{ subCategoryName: "dateformat" ,funVal:"dateformat()",tipStr:"dateFormat(date, pattern[,language])用于将时间格式化为期望的字符串,其中date可以是时间字符串,也可以是Date对象,pattern为格式化参数,yyyy表示年,MM表示月,dd表示天数,HH表示小时,mm表示分钟,ss表示秒."},
			{ subCategoryName: "datetime" ,funVal:"datetime()",tipStr:"datetime()返回当前日期和时间"},
			{ subCategoryName: "dayof" ,funVal:"dayof( )",tipStr:"dayOf(date)求日期date的天数"},
			{ subCategoryName: "formataddress" ,funVal:"formataddress( )",tipStr:"格式化地址，根据地址簿id将地址格式化成语言格式中设置的样式"},
			{ subCategoryName: "loginbusidate" ,funVal:"loginbusidate()",tipStr:"得到当前登录业务时间，前后台均可用，如果是后台使用，可能会得不到"},
			{ subCategoryName: "mon" ,funVal:"mon()",tipStr:"month()求当前月"},
			{ subCategoryName: "monof" ,funVal:"monof( )",tipStr:"month(date)得到指定日期内的月份"},
			{ subCategoryName: "time" ,funVal:"time()",tipStr:"time()取得当前时间,格式是HH:mm:SS"},
			{ subCategoryName: "todate" ,funVal:"todate( )",tipStr:"toDate(str)将字符串格式的时间str转换成UFDate对象"},
			{ subCategoryName: "todatetime" ,funVal:"todatetime( )",tipStr:"toDateTime(str)将字符串格式的时间str转换成UFDateTime对象"},
			{ subCategoryName: "totime" ,funVal:"totime( )",tipStr:"toTime(str)将字符串格式的时间str转换成UFTime对象"},
			{ subCategoryName: "year" ,funVal:"year()",tipStr:"year()求当前年"},
			{ subCategoryName: "yearof" ,funVal:"yearof( )",tipStr:"yearof(date)求日期date的年"}
		] },
		{ categoryName: "数据库函数", subCategories: [
			{ subCategoryName: "ass" ,funVal:"ass( , )",tipStr:"ass(freevalueID,checktype)是关于会计平台中辅助核算的函数,从gl_freevalue表中根据freevalueID及checktype返回checkvalue"},
			{ subCategoryName: "cvn" ,funVal:"cvn( , , , )",tipStr:"cvn(tablename,fieldname,pkfield,pkvalue)根据主键从数据库查询特定字段的值,其返回的值将直接作为数字使用"},
			{ subCategoryName: "cvs" ,funVal:"cvs( , , , )",tipStr:"cvs(tablename,fieldname,pkfield,pkvalue)根据主键从数据库查询特定字段的值,其返回的值将直接作为字符串使用"},
			{ subCategoryName: "getcolnmv" ,funVal:"getcolnmv( , , , )",tipStr:"getColNmv(tablename,fieldname,pkfield,pkvalue)根据主键从数据库查询特定字段的值,其返回的值将直接作为数字使用,其功能类似SQL语句:select fieldname from tablename where pkfield = pkvalue 从这条SQL语句可以看出各个参数的含义."},
			{ subCategoryName: "getcolnmv2" ,funVal:"getcolnmv2( , , , , , )",tipStr:"getColNmv2(tablename,fieldname,pkfield1,pkvalue1,pkfield2,pkvalue2)根据主键从数据库查询特定字段的值,其返回的值将直接作为数字使用,其功能类似SQL语句:select fieldname from tablename where pkfield1 = pkvalue1 and pkfield2 = pkvalue2. 从这条SQL语句可以看出各个参数的含义."},
			{ subCategoryName: "getcolsvalue" ,funVal:"getcolsvalue()",tipStr:"根据主键从数据库查询多个字段的值,左边待赋值的字段要用逗号分割,注意里面的字段，表名要用双引号扩起来。"},
			{ subCategoryName: "getcolvalue" ,funVal:"getcolvalue( , , , )",tipStr:"getColValue(tablename,fieldname,pkfield,pkvalue)根据主键从数据库查询特定字段的值,其功能类似SQL语句:select fieldname from tablename where pkfield = pkvalue 从这条SQL语句可以看出各个参数的含义."},
			{ subCategoryName: "getcolvalue2" ,funVal:"getcolvalue2( , , , , , )",tipStr:"getColValue2(tablename,fieldname,pkfield1,pkvalue1,pkfield2,pkvalue2)根据主键从数据库查询特定字段的值,其功能类似SQL语句:select fieldname from tablename where pkfield1 = pkvalue1 and pkfield2 = pkvalue2. 从这条SQL语句可以看出各个参数的含义."},
			{ subCategoryName: "getcolvaluemore" ,funVal:"getcolvaluemore()",tipStr:""},
			{ subCategoryName: "getcolvaluemorewithcond" ,funVal:"getcolvaluemorewithcond()",tipStr:""},
			{ subCategoryName: "getmlcvalue" ,funVal:"getmlcvalue()",tipStr:""},
			{ subCategoryName: "getmlcvaluemorewithcond" ,funVal:"getmlcvaluemorewithcond()",tipStr:""}
			
		] },
		{ categoryName: "字符串函数", subCategories: [
			{ subCategoryName: "charat" ,funVal:"charat( , )",tipStr:"charat(st,index)得到字符串st中第index个字符"},
			{ subCategoryName: "endswith" ,funVal:"endswith( , )",tipStr:"endswith(st, end)判断字符串st是否以字符串end结尾"},
			{ subCategoryName: "equalsignorecase" ,funVal:"equalsignorecase( , )",tipStr:"equalsIgnoreCase(st1, st2)判断忽略大小写字符串st1是否与字符串st2相等"},
			{ subCategoryName: "indexof" ,funVal:"indexof( , )",tipStr:""},
			{ subCategoryName: "isempty" ,funVal:"isempty( )",tipStr:""},
			{ subCategoryName: "lastindexof" ,funVal:"lastindexof( , )",tipStr:""},
			{ subCategoryName: "left" ,funVal:"left( , )",tipStr:"left(st, index) 求字符串st左边前index个字符组成的字符串"},
			{ subCategoryName: "leftstr" ,funVal:"leftstr( , , )",tipStr:""},
			{ subCategoryName: "length" ,funVal:"length( )",tipStr:""},
			{ subCategoryName: "mid" ,funVal:"mid( , , )",tipStr:""},
			{ subCategoryName: "right" ,funVal:"right( , )",tipStr:""},
			{ subCategoryName: "rightstr" ,funVal:"rightstr( , , )",tipStr:"rightStr(st,len,defaultStr) 求字符串st右边后len个字符组成的字符串，如果字符串长度小于len，则用defaultStr补齐"},
			{ subCategoryName: "startswith" ,funVal:"startswith( , )",tipStr:"startsWith(String st, String start) 判断字符串st是否以字符串start开头"},
			{ subCategoryName: "tolowercase" ,funVal:"tolowercase( )",tipStr:""},
			{ subCategoryName: "tostring" ,funVal:"tostring( )",tipStr:"toString(obj) 将对象obj转换为本解析器可识别的字符串形式"},
			{ subCategoryName: "touppercase" ,funVal:"touppercase( )",tipStr:"toUpperCase(String st) 求字符串st的大写形式"},
			{ subCategoryName: "trimzero" ,funVal:"trimzero()",tipStr:"trimzero()剪除字符串或数字str的末尾0值"}
		] },
		{ categoryName: "财务函数", subCategories: [
			{ subCategoryName: "getchinesecurrency" ,funVal:"getchinesecurrency( )",tipStr:"getChineseCurrency(Object)将传入的字符串或数字转换为大写金额"},
			{ subCategoryName: "getenglishcurrency" ,funVal:"getenglishcurrency( , )",tipStr:"getEnglishCurrency(mark,number)将数字金额转为英文文本描述"},
			{ subCategoryName: "setthmark" ,funVal:"setthmark( )",tipStr:"setThMark(String)将传入的字符串或数字转为金额后加入千分位标志,如果希望保留数字后面的0,则需要先将数字转为字符串,然后再用setThMark()函数,比如setThMark(toString(56510.000))."},
			{ subCategoryName: "tochinese" ,funVal:"tochinese( , , )",tipStr:"toChinese(Object number,int flag1,int flag2)将传入的字符串或数字转换为中文"}
		] },
		{ categoryName: "自定义函数", subCategories: [
			{ subCategoryName: "debug" ,funVal:"debug( )",tipStr:"debug(变量)用于打印出变量的值,以便进行调试"},
			{ subCategoryName: "getcolvalueres" ,funVal:"getcolvalueres()",tipStr:"函数用于取得单据类型多语言名称"},
			{ subCategoryName: "getlangres" ,funVal:"getlangres( , )",tipStr:"getlangres(modelname,resID)根据模块名及资源ID号,取得相应的多语言资源"},
			{ subCategoryName: "toboolean" ,funVal:"toboolean( )",tipStr:"toBoolean(Object st) 将对象st转换为UFBoolean类型"}
		] },
		{ categoryName: "常用函数", subCategories: [
			{ subCategoryName: "getcolvalue" ,funVal:"getcolvalue( , , , ) ",tipStr:"getColValue(tablename,fieldname,pkfield,pkvalue)根据主键从数据库查询特定字段的值,其功能类似SQL语句:select fieldname from tablename where pkfield = pkvalue 从这条SQL语句可以看出各个参数的含义."},
			{ subCategoryName: "iif" ,funVal:"iif()",tipStr:"iif(condition, result1, result2)"}
		] }
	],
	schema: {
		model: {
			children: "subCategories"
		}
	}
});
