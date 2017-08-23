
cb.formula.parseFormular=function(formula) {
    var rwtab = new Array("if", "else", "do", "while", "for", "switch", "case","true", "false");

    var prog = formula;

    //ָ��
    var p = 0;

    var symbol = {
        // ����ʶ�ķ���,δ֪����
        un: -1, 
        // ">"  ����greater than 
        gt: 1,  
        // ">=" ���ڵ��� be equal or greater than 
        ge: 2,  
        // "<"  С��less than
        lt: 3,  
        // "<=" С�ڵ��� be equal or less than 
        le: 4,  
        // "!=" ������
        ne: 5,  
        // "!"  �񶨺�
        neg: 6, 
        // "="  ��ֵ��  Definition Operator
        dop: 7,
        // "=="  ���ں�
        eq: 8, 
        // "+" �Ӻ�
        add: 9, 
        // "-" ����
        sub: 10, 
        // "*" �˺�
        mul: 11, 
        //  "/" ����
        div: 12, 
        // "(" ������
        lb: 13,  
        // ")" ������
        rb: 14,  
        // "{" ��ʽ������Open brace
        ob: 15,  
        // "}" �ҹ�ʽ������Close brace
        cb: 16,  
        // ";" �ֺ�semi-colon
        sc: 17,  
        // "," ����comma
        cm: 18,  
        // ":" ð��
        co: 19,  
        // ������
        vn: 20,  
        // ����
        num: 21, 
        //������
        kw:  22, 
		
		//�ַ�������
		cs: 23,
	}

    function Node() {
        this.symid = symbol.un;
        this.token = "";
        this.flag = ReplaceFlagEnum.init;
        this.toString = function () {
            return this.token;
        };
        this.clone = function () {
            var node = new Node();
            node.symid = this.symid;
            node.token = this.token;
            node.flag = this.flag;

            return node;
        }
    }


    /*
       flag ���
       flag = -1,��ʼ״̬��������  
       flag = 1, �滻�� vm.setValue("");
       flag = 2, �滻�� vm.get("").getValue();
       flag = 3, �滻�� cb.formula.;
    */
    var ReplaceFlagEnum = {
        init: -1,        
        vmset: 1,
        vmget: 2,
        cbfun: 3
    }

    function parse() {
        var len = prog.length;
        var nodes = new Array();

        do {
            var node = new Node();
            nodes.push(node);
            scaner(node);
        }
        while (p < len);

        return nodes;
    }


    function scaner(node) {
        var sym = 0;
        var token = new Array();
        var ch = prog[p++];

        //���Կո�
        while (ch == '') { ch = prog[p]; p++; }

        //�����Ǳ�ʾ�����߱����� 
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
            while ((ch >= '0' && ch <= '9')
				|| (ch >= 'a' && ch <= 'z') 
				|| (ch >= 'A' && ch <= 'Z')
				|| (ch =="_")
				) {
                token.push(ch);
                ch = prog[p++];
            }

            p--;
            sym = symbol.vn;
            for (var i = 0; i < rwtab.length; i++) {  //��ʶ��������ַ����Ѷ���ı�ʾ�����Ƚϣ� 
                if (token.join("") == rwtab[i]) {
                    sym = i + 1 + symbol.kw;
                    break;
                }
            }            
        }
        else if ((ch >= '0' && ch <= '9'))  //���� 
        {
            while ((ch >= '0' && ch <= '9') || ch==".") {
                token.push(ch);
                ch = prog[p++];
            }
            p--;
            sym = symbol.num;
        }
        else switch (ch)   //�����ַ� 
        {
            case '!':
                token.push(ch);
                ch = prog[p++];
                if (ch == '=') {
                    sym = symbol.ne;
                    token.push(ch);
                }
                else {
                    sym = symbol.neg;
                    p--;
                }
                break;
            case '<':
                token.push(ch);
                ch = prog[p++];
                if (ch == '=') {
                    sym = symbol.le;
                    token.push(ch);
                }
                else {
                    sym = symbol.lt;
                    p--;
                }
                break;
            case '>':
                token.push(ch);
                ch = prog[p++];
                if (ch == '=') {
                    sym = symbol.ge;
                    token.push(ch);
                }
                else {
                    sym = symbol.gt;
                    p--;
                }
                break;          
            case '=':
                token.push(ch);
                ch = prog[p++];
                if (ch == '=') {
                    sym = symbol.eq;
                    token.push(ch);
                }
                else {
                    sym = symbol.dop;
                    p--;
                }
                break;
			case '"':
				token.push(ch);
				do{
					ch = prog[p++];
					token.push(ch);
				}
				while(ch!='"');
				sym = symbol.cs;				
				break;
            case '*': sym = symbol.mul; token.push(ch); break;
            case '/': sym = symbol.div; token.push(ch); break;
            case '+': sym = symbol.add; token.push(ch); break;
            case '-': sym = symbol.sub; token.push(ch); break;
            case ';': sym = symbol.sc; token.push(ch); break;
            case ':': sym = symbol.co; token.push(ch); break;
            case '(': sym = symbol.lb; token.push(ch); break;
            case ')': sym = symbol.rb; token.push(ch); break;
            case '{': sym = symbol.ob; token.push(ch); break;
            case '}': sym = symbol.cb; token.push(ch); break;
            case ',': sym = symbol.cm; token.push(ch); break;
            default: sym = symbol.un; break;
        }

        node.symid = sym;
        node.token = token.join("");
    }

    function setReplaceFlag(nodes) {
        var len = nodes.length;
        var p = 0;
        while (p < len) {
            var node = nodes[p];
            if (node.symid == symbol.vn) {
                if (p + 1 < len){
					if(nodes[p+1].symid == symbol.dop ) {						
						//�����һ���ڵ��Ǹ�ֵ�ţ����node��Ҫ�滻Ϊset
						node.flag = ReplaceFlagEnum.vmset;
					} 
					else if (nodes[p + 1].symid == symbol.lb) {
						// �����һ���ڵ���������
						node.flag = ReplaceFlagEnum.cbfun;
					} else {
						node.flag = ReplaceFlagEnum.vmget;
					}
                }//if (p+1<len)
            }//if(node.symid == symbol.vn)            
            p++;
        }//while
    }
   
    /*
    function setFlag(nodes) {
        var len = nodes.length;
        var p = 0;

        do {
            //����if()����еı���                           
            var temp = nodes[p].token;

            if (temp == "if") {
                var brackLeft = new Array();

                //������һ��"("
                var start = ++p;

                do {
                    temp = nodes[++p].token;
                    if (temp == "(") {
                        brackLeft.push(temp);
                    }
                    else if (temp == ")") {
                        if (brackLeft.length != 0) {
                            brackLeft.pop();
                        }
                        else {
                            break;
                        }
                    }
                } while (true && p < len);


                //���ųɶԳ�����
                var end = p;

                for (var i = start + 1; i < end + 1; i++) {
                    if (nodes[i].flag == 0) {
                        if (nodes[i + 1].token != "(") {
                            nodes[i].flag = ReplaceFlagEnum.vmget;
                        }
                        else {
                            nodes[i].flag = ReplaceFlagEnum.cbfun;
                        }
                    }
                }
            }

            else if (temp == "=") {
                // ����ֵ����еı���
                var token = nodes[p++].token;
                while (token != "=" && p < len) {
                    token = nodes[p++].token;
                }
                if (p < len) {
                    p--;
                    nodes[p - 1].flag = ReplaceFlagEnum.vmset;
                    var pold = p++;

                    token = nodes[p++].token;

                    while (token != ";" && p < len) {
                        token = nodes[p++].token;
                    }
                    if (p <= len) {
                        for (var i = pold; i < p; i++) {
                            if (nodes[i].flag == 0) {
                                if (nodes[i + 1].token != "(") {
                                    nodes[i].flag = ReplaceFlagEnum.vmget;
                                }
                                else {
                                    nodes[i].flag = ReplaceFlagEnum.cbfun;
                                }
                            }
                        }
                    }
                }

            }
            else {
                p++;
            }

        } while (p < len);

        return nodes;
    }
    */



    var RIGHT_BRACKET = ")";

	function execReplace(nodes){
		var p = 0, len = nodes.length;

        do {
            var flag = nodes[p].flag;
            switch (flag) {
                case ReplaceFlagEnum.vmset:
                    nodes[p].token = cb.formula.setReplace(nodes[p].token);
					//��Ϊcube�������ԣ�����value��ʹ�÷�������Ҫ��������
					//����set�ģ�����Ҫ�ҵ�;���滻Ϊ ������+��;",������ֵ����Ϊ"";
					var i = p+1;
					while(i<len){
						var tnode = nodes[i];
						if (tnode.symid == symbol.dop) {
							tnode.token = "";
						}
						else if (tnode.symid == symbol.sc) {
							tnode.token = RIGHT_BRACKET + tnode.token;
							break;
						}
						i++;
					}
                    break;
                case ReplaceFlagEnum.vmget:
                   // nodes[p].token = "parseFloat("+cb.formula.getReplace(nodes[p].token)+")";
					nodes[p].token = cb.formula.getValue_str(nodes[p].token);
				
                    break;
                case ReplaceFlagEnum.cbfun:
                    nodes[p].token = cb.formula.funReplace(nodes[p].token);
                    break;
            }
            p++;
        }
        while (p < len);
	}

	function getNewNode(token){
		var node = new Node();
		node.token = token;
//		node.flag = ReplaceFlagEnum.undo;
		return node;
	}

	function specialParse(nodes){
		var resultNodes = new Array();
		var len = nodes.length;
		var i=0;
		do{
			var node = nodes[i];
			if(node.symid== symbol.dop){
				//�ҵ���ֵ�ţ�����ǰ���м�������ʽ��
				var count=0; //�м�������
				var j= i-2; //ֱ�Ӷ�λ�����ܵĶ���
				while(j>0){
					var tnode = nodes[j];
					if(tnode.symid==symbol.cm){						
						count++;
					}
					else{
						break;
					}
					j--;
				}

				//�ҵ�������߶���
				if(j!=i-2){
					//����ҵ� ��ֵ���ʽ�Ľ�����";"
					var index = i+1;
					var tnode = nodes[index];
					while(tnode.symid!=symbol.sc || index< nodes.len){
						index++;
						tnode = nodes[index];
					}
					//�ҵ�";"
					//��̬����node �ڵ�
					//��һ�����ȵ���ѹջ�Ľڵ�
					for(var k=0;k< count *2 +1;k++){
						resultNodes.pop();
					}
					//�ڶ����������µ�Node
					var nnode = getNewNode("var temp =");
					resultNodes.push(nnode);
					for(var k= i+1;k<=index;k++){
						resultNodes.push(nodes[k]);
					}
					
					var arrayNode = getNewNode("temp=temp.split(',');");
					resultNodes.push(arrayNode);

					for(var k=j;k< i;k+=2){
						var knode = nodes[k].clone();
						resultNodes.push(knode);
						var dopNode = getNewNode("=");
						dopNode.symid = symbol.dop;
						resultNodes.push(dopNode);
						var t = (k-j)/2;
						var rnode = getNewNode("temp[" + t +"]");
						resultNodes.push(rnode);
						var scNode = getNewNode(";");
						scNode.symid =symbol.sc;
						resultNodes.push(scNode);
					}

					i= index;
				}
				else{
					resultNodes.push(node.clone());					
				}
			}
			else{
				resultNodes.push(node.clone());
			}
			i++;
		}
		while(i<len)

		return resultNodes;
	}
    function parsetToRealProg() {
        var nodes = parse();

		//������ʽ�滻��fieldname1,fieldname2->getColsValue("tablename","fieldname1","fieldname2","pkfield",pkvalue);
		nodes = specialParse(nodes);


		//�����滻��־
		setReplaceFlag(nodes);

		var checkAcc_str = getCheckAccessibility(nodes);

		//����У��
        nodes = addCheck(nodes);

		//ִ���滻
        execReplace(nodes);

        var temp = nodes.join("");

        return functionFormat(temp,checkAcc_str);


        //return nodes.join("");

    }

    function functionFormat(programSlice,checkAcc_str){
        var p = new Array();
        p.push("function temp(){");
		p.push(" var result = cb.formula.hasPropertys(vm,"+ checkAcc_str + ");");
		p.push(" if (result!=null) return result; ");
        p.push(programSlice);
        p.push(" ;");
		p.push(" result= cb.formula.returnFormat('',0,'sucess');");
        p.push(" return result;} ");
        p.push(" temp();");

        return p.join("");
    }

	function getCheckAccessibility(nodes){
		var attrs = new Array();
		for(var i=0;i<nodes.length;i++){
			var flag = nodes[i].flag;
			if(flag == ReplaceFlagEnum.vmset || flag == ReplaceFlagEnum.vmget)
			{
				attrs.push(nodes[i].token);
			}
		}
		return '"'+ attrs.join(",") + '"';
	}
    function addCheck(nodes) {
        var len = nodes.length;
        var p = 0;
        var targetNodes = new Array();
        while (p < len) {
            var node = nodes[p];
            var newNode = node.clone();
            targetNodes.push(newNode);
            if (node.symid == symbol.dop) {
                //�ҵ���ֵ�ţ��ȵ���
                targetNodes.pop(); //����=
                targetNodes.pop(); //��������ֵ����

                var start = p - 1;
                do {
                    node = nodes[++p];
                } while (p < len && node.symid != symbol.sc )

                if (p < len) {
                    for (var i = start + 2; i < p; i++) {
                        if (nodes[i].symid == symbol.vn) {
                            if (nodes[i + 1].symid != symbol.lb) {
                                var n2 = new Node();
                                n2.token = cb.formula.getCheckValid(nodes[i].token);
                                targetNodes.push(n2);
                            }
                        }
                    }
					var node = getDivideByZero(start,p,nodes);
					if(node!=null) { targetNodes.push(node); }
					
					//������ֱ�Ӵ���
                    for (var j = start ; j < p; j++) {
                        targetNodes.push(nodes[j].clone());
                    }
                }
            } //if
            else {
                p++;
            }
        }

        return targetNodes;
    }
    function getDivideByZero(start,p,nodes){
	//����dividebyzero
	var temp = null;
	var index = start + 2;
	do{
		temp = nodes[++index];
	}while(index<p && temp.symid != symbol.div)
	
	var result = new Array();

	if(index < p){
		var i =0;
		if( nodes[index+1].symid== symbol.lb)
		{
			i = index + 1;
		}
		else if(nodes[index+1].symid==symbol.vn && nodes[index+2].symid== symbol.lb){		
			i = index + 2;
		}
		else if(nodes[index+1].symid==symbol.vn){
			var node = new Node();
			node.token = cb.formula.getCheckZero(nodes[index+1].token);
			return node;
		}

		if(i!=0){
			var brackLeft = new Array();			
			var temp =null;
			do {
				temp = nodes[++i].token;
				if (temp == "(") {
					brackLeft.push(temp);
				}
				else if (temp == ")") {
					if (brackLeft.length != 0) {
						brackLeft.pop();
					}
					else {
						break;
					}
				}
			} while (true && i < p);
            //���ųɶԳ�����
             var end = i;
			 var slice = new Array();	
			 for(var j=index+1;j<=end;j++){
				 slice.push(nodes[j].clone());
			 }
				
   		     setReplaceFlag(slice);
			 execReplace(slice);

			 var node = new Node();
			 node.token = cb.formula.getCheckZero2(slice.join(""));

			 return node;
		}
	}
	return null;
}
    return parsetToRealProg();

}

cb.formula.result = function(){
	this.field = "";
	this.code = "";
	this.info ="";
}

cb.formula.getValue_str = function(attr){
	return "cb.formula.getValue(vm,'" + attr + "')";
}

cb.formula.getValue = function (vm, attr) {

    var value = vm.get(attr).getValue();
    return isNaN(value) ? value : parseFloat(value);
	//return parseFloat(vm.get(attr).getValue());
}
cb.formula.getReplace = function (attr) {
        return "vm.get(\"" + attr + "\").getValue()";
    };

cb.formula.setReplace = function (attr) {
        return "vm.get(\"" + attr + "\").setValue(";
    };

cb.formula.funReplace = function (fun) {
        return "cb.formula.fun." + fun;
    };
cb.formula.returnFormat = function(attr,code, info) {
        var temp = new cb.formula.result();
		temp.field=attr;
		temp.code = code;
		temp.info =info;
		return temp;
    };

cb.formula.getCheckValid = function(attr) {
        return "result = cb.formula.checkValid(vm,'" + attr + "'); if(result!=null) return result;";
    };

cb.formula.getCheckZero = function(attr){
	return "result = cb.formula.checkZero(vm,'" + attr +"'); if(result!=null) return result;";
}

cb.formula.getCheckZero2 =function(exp){
	return  "result = cb.formula.checkZeor2(vm," + exp + "); if(result!=null)return result;";
},

cb.formula.checkZeor2 =function(vm,exp){
	if(exp ==0){
		return this.returnFormat("", "3", "dividebyzero");
	}
},

cb.formula.checkZero = function (vm, attr) {
	var temp = vm.get(attr).getValue();
	if(temp==0){
		return this.returnFormat(attr, "3", "dividebyzero");
	}
	return null;
},

cb.formula.checkValid = function(vm,attr) {
	var temp = vm.get(attr).getValue();
	if (temp == undefined || temp == null || temp === "") {
		 return  this.returnFormat(attr, "2", "invalid");            
	}
	return null;
 } ,

cb.formula.hasPropertys = function(vm,attrs_str){
	var attrs= attrs_str.split(",");
	for(var i=0;i<attrs.length;i++){
		if(!this.hasProperty(vm,attrs[i]))
		    return this.returnFormat(attrs[i], "1", "noAccessibility");
	}
	return null;
}
cb.formula.hasProperty = function(vm,attr){
	var property = vm && vm.get(attr);
	return property!=null;
}

/*
cb.formula.getValue = function(vm,attr){
	var property = vm && vm.get(attr);
	if(property==null || isNaN(property))
		return this.returnFormat(attr, "1", "noAccessibility")
	else
		return property.getValue?property.getValue():property;
}
*/
