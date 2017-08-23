/// <reference path="Cube.js" />
cb.model.DataState = {
    Add: 2,
    Delete: 3,
    Update: 1,
    Unchanged: 0,
	Missing:undefined//数据不在本地,
};
//实例化时，要构建出模型的结构
cb.model.Model3D = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);
    this._listeners = [];
	var defaults={
		columns:{},
		dataSource:[],
		//editable:false,
		editMode:'CellEditor',	//编辑模式:行编辑，单元格编辑
		readOnly:true,	//作用等价于editable属性
		autoWrap:true,	//自动换行设置
		mergeState: false,	//合并显示设置

		showAggregates:false,//是否显示小计
		//resizable: true,
		//filterable: true,
        //sortable:true,
        //visible:true,//默认显示
		multiSort:true,
		sortFields:[],
		showCheckBox:true,	//是否显示checkbox列
		showRowNo:true,		//是否显示行号
		//frozenField:undefined,
		dsMode:'Remote',//默认数据源来自于远程 'Remote'/'Local'
		//pageServer: '',//远程数据须指定对应的数据服务
		pageSize:50,//-1表示不分页
		supportPagination: true,//等价于pageSize为-1，对外接口
		pageIndex: 0,
		checks: {
		    //editable: function (rowIndex, field) {
		    //    if (rowIndex == 1) return false;
		    //}
		    //customEditor: function (rowIndex, field) {
		    //    if (field === 'crowno') return {
		    //        ctrlType: 'Refer',
		    //        refCode: "code",
		    //        refId: "600015",
		    //        refKey: "pk_org",
		    //        refName: "name"
		    //    }
		    //}
		}
		//pager:'pager'//默认分页条视图为viewmodel下的 .pager元素,
		
	};
	this._data=$.extend(defaults,this._data);
    //兼容老版本Model3D,(老版本Columns表示列的信息）
	if (this._data.Columns) {
	    this._data.columns = this._data.Columns;
	    delete this._data.Columns;
	}
	//字段的显示顺序
	this._data.fieldNames=this._data.fieldNames||this._getFieldNames();
	/*Rows数据标识当前视图中展示的数据行；模型中有一个表示按序存储的行数据结构dataSource，代表所有数据，这些数据不一定都已在本地。
	Rows和dataSource交互，从中获取数据，Rows保留dataSource中行数据的引用，使修改同步；dataSource内部和服务端交互，负责从服务端请求页数据和提交本地修改。
	dataSource提供分页配置管理。
	*/
	this._dataSource = this._data.dataSource || [];
	if (this._dataSource.length) { this._setIds(this._dataSource); }

	delete this._data.dataSource;
	//当前页面展示的数据
	this._data.rows=[];
	//初始化行数据状态
	this._initRowState();

	//当前获取焦点的行在Rows索引位置，只有Rows中的行才能设置为聚焦行
    this._focusedRowIndex =-1;
    this._editRowModel = null;
	
	
	//数据记录总数量（如果分页信息返回的总数量和当前值不一致，说明远程数据源有修改，提示保存刷新后再操作）
	this._currentTotalCount=undefined;//设置数据源后返回的totalCount值，表示远程数据的记录数量
	
	//分页请求返回后回调,context指定为this
	this._pageServerCallBack=$.proxy(function(success,fail,ignorePreCallback){
		if(success){
			var data=success;
			if (!ignorePreCallback && typeof this._preCallback==='function') {
			    data=this._preCallback(data);
			}
			if(this._currentTotalCount&&this._currentTotalCount!==data.totalCount){alert('grid中数据已过期，保存刷新后再处理');return;}
			if(data._pageStart==undefined){
				var pageInfo=this._getRemotePageInfo(this.getPageSize(),this.getPageIndex());
				data._pageStart=pageInfo.pageStart;
				data._dsStart=pageInfo.dsStart;
			}
			this._updateDataSource(data.currentPageData||[],data._dsStart,data._pageStart);
			this._setPageRows(this._getCurrentPageRows());
			
			//通知分页条更新
			this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "pageInfo", this.getPageInfo()));
		}else{
			//alert(fail.error);
		}
	},this);
	
    //适配 supportPagination属性
	if (!this._data.supportPagination) {
	    this._data.pageSize = -1;
	}

    //计算参照更新优先级
	this._updatePriority=this._computeUpdatePriority();

};
cb.model.Model3D.prototype = new cb.model.BaseModel();
cb.model.Model3D.prototype.getPkName = function () {
	 var columns = this._getColumns()
	 for (var field in columns) {
		var col = columns[field];
		if (col && typeof col=='object' &&(col["key"]||col["isKey"])) return field
	 }
	 return "id";
};
cb.model.Model3D.prototype.getTsName = function(){
	return "ts";
};
//支持数据对象，考虑跟set合并成一个方法 支持setData(Rows),支持setData({}),支持setData(propertyName,value)
cb.model.Model3D.prototype.setData = function (data) {
    cb.console.log("Model3D.setData", this);
    if (arguments.length == 0)
        return;
    if (!arguments[0] || !data)
        return;
    if (arguments.length == 1 && !typeof data == "object") //if (data.constructor != Object || data.constructor != Array)
        return;
    if (arguments.length == 2) {
        var tempData = {};
        tempData[arguments[0]] = arguments[1];
        data = tempData;
    }
    if (cb.isArray(data)) {
        data = { dataSource: data };
    }
    //var _data = { readOnly: true, columns: { ID: {}, Code: {} }, dataSource: [{ ID: 1, Code: 111 }, { ID: 222, Code: { value: 12, readOnly: 1}}],  focusedIndex: 1 };

    if (data.dataSource) {
        this.setDataSource(data.dataSource);
        delete data.dataSource;
    }
    if (data.columns) {
        this.setColumns(data.columns, cb.isArray(data.fieldNames) ? data.fieldNames : null);
        delete data.columns;
        delete data.fieldNames;
    }
    for (var attr in data) {
        value = data[attr];
        if (typeof value == "function") {
            this.on(attr, value);
        } else if (this._data.hasOwnProperty(attr) || !cb.isEmpty(value)) {
            //适配分页属性
            if (attr === 'supportPagination' && value) {
                delete data.pageSize,
                this.set('pageSize', -1);
                continue;
        }
            this.set(attr, value); //需要考虑批量操作
            
        }
    }
    //this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue));//后期改成批量操作，操作传递到前台用批量方式
    cb.console.log("Model3D.setData", this);
};
//获取脏数据及状态信息
cb.model.Model3D.prototype.getDirtyData = function () {
    var pkName = this.getPkName();
    var tsName = this.getTsName();
    var datas = [];

    var rows = this._dataSource.clone();

    var rowDataState = this._rowsDataState,
        Delete = cb.model.DataState.Delete,
        Update = cb.model.DataState.Update,
        Add = cb.model.DataState.Add,
        dataState,

        pk = this.getPkName(),
        ts = this.getTsName();

    for (var i = 0; i < rows.length; i++) {
        dataState = rowDataState[i];
        
        if (dataState === Update || dataState === Add) {
            delete rows[i].readOnly;
            delete rows[i].disabled;

            for (var attr in rows[i]) {
                var cell = rows[i][attr];
                rows[i][attr] = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.value;
            }
            rows[i].state = dataState;
            datas.push(rows[i]);
        } else if (dataState === Delete) {//删除行的处理,删除行只收集id、ts、state
            delete rows[i].readOnly;
            delete rows[i].disabled;

            var row = {};
            row[pk] = rows[i][pk];
            row[ts] = rows[i][ts];
            row.state = Delete

            datas.push(row);
        }
        
    }
    return datas.length ? datas : null;
};
cb.model.Model3D.prototype.getData = function () {
    var datas = [];

    var rows = this._dataSource.clone();

    if (this._data.rows.length == 0) { rows.length = 0; return []; }
    var rowDataState = this._rowsDataState,
        Delete = cb.model.DataState.Delete,
        Update = cb.model.DataState.Update,
        Add = cb.model.DataState.Add,
        Missing = cb.model.DataState.Missing,
        dataState,

        pk = this.getPkName(),
        ts = this.getTsName();

    for (var i = 0; i < rows.length; i++) {
        dataState = rowDataState[i];
        if (dataState !== Delete && dataState !== Missing) {
            delete rows[i].readOnly;
            delete rows[i].disabled;
            rows[i].state = dataState;

            for (var attr in rows[i]) {
                var cell = rows[i][attr];
                rows[i][attr] = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.value;
            }
            datas.push(rows[i]);
        }
    }
    return datas.length ? datas : null;
}

// fangqg: 根据接口字段获取列的实际字段，如行号，接口字段为rowno。
cb.model.Model3D.prototype.getFieldNameFromInterfaceField = function (interfaceField) {
    var interfaces = this.get("interfaces");
    if (!interfaces) return null;
    var fieldMap = cb.model.InterfaceFieldMap[interfaceField];
    if (!fieldMap) return null;
    var fieldName = interfaces[fieldMap];
    if (!fieldName || !this.hasColumn(fieldName)) return null;
    return fieldName;
};

$.extend(cb.model.Model3D.prototype,{
	//初始化行数据状态
	_initRowState:function(){
		var ds=this._getDataSource();
		this._rowsDataState=new Array(ds.length);//记录数据行的状态
		for(var i=0;i<ds.length;i++){
			this._rowsDataState[i]=ds[i]?cb.model.DataState.Unchanged:cb.model.DataState.Missing;
		}
	},
	_getColumns:function(){
		return this._data.columns;
	},
	_getFieldNames:function(){
		var fieldNames=[],
			cols=this._getColumns();
		for(var prop in cols){
			fieldNames.push(prop);
		}
		return fieldNames;
	},
	get:function (rowIndex, cellName, propertyName) {
		if (arguments.length == 1) {
			//增加判断，如果只传递了1个参数，则按propertyName处理
			propertyName = rowIndex;
			rowIndex = -1;
			cellName = null;
		}
		if (rowIndex == null)
			rowIndex = -1; //容错
		if (!propertyName || propertyName.toLowerCase() === "value") {
			//如果状态属性propertyName==空，则表示要获取行或列的值
			var row = rowIndex >= 0 ? this._data.rows[rowIndex] : null;
			if (!row || !cellName)
				return row; //如果列名称cellName为空，则返回行
			var cell = row[cellName];
			return (cell && typeof cell === "object") ? cell.value : cell;
		}
		else {
			//如果状态属性propertyName != 空，则表示要获取状态值
			if (rowIndex < 0) {
				//如果传入rowIndex==null and 列名cellName==null，则返回整体状态。
				//如果传入rowIndex==null and 列名cellName!=null，则列状态。
				return cellName ? this._data.columns[cellName][propertyName] : this._data[propertyName];
			}
			else {
				//如果传入rowIndex!=null and 列名cellName!=null，则返回单元格状态。
				//如果传入rowIndex==null and 列名cellName==null，则行状态。
				if (!cellName)
					return this._data.rows[rowIndex][propertyName];
				var cell = this._data.rows[rowIndex][cellName];
				return cell && cell[propertyName];
			}
		}
		return this;
	},
	set:function (rowIndex, cellName, propertyName, value,quiet) {
		if (arguments.length == 2) {
			//增加判断，如果只传递了2个参数，则按propertyName, value处理
			propertyName = rowIndex;
			value = cellName;
			rowIndex = -1;
			cellName = null;
		}
		if (rowIndex == null)
			rowIndex = -1; //容错

		if (!propertyName) {
			if (rowIndex < 0 || !cellName)
				return;
			var row = this._data.rows[rowIndex]; // this.get(rowIndex);
			var cell = row[cellName];
			var cellIsObject = (cell && typeof cell == "object");
			var oldValue = this.get(rowIndex, cellName);
			if (oldValue === value)
				return;

			var data = { index: rowIndex, field: cellName, value: value, oldValue: oldValue };
			if (!quiet&&!this.beforeExecute("CellChange", data))return false;
			if (cellIsObject) {
			    if (cell instanceof Date) {
			        row[cellName] = cb.util.formatDate(cell);
			    } else {
			        cell.value = value;
			    }
			} else {
			    row[cellName] = value;
			}
				
			//row.state = cb.model.DataState.Update;
			this._updateRowState(rowIndex, cb.model.DataState.Update);

			var args = new cb.model.PropertyChangeArgs(this._name, "cellValue", data);
			this.PropertyChange(args);

			if (!quiet) {
			    this.afterExecute("CellChange", data); //值变化出发,无焦点要求
			}
		}
		else {
			//设置控件状态
			if (rowIndex < 0 && !cellName) {
				var oldValue = this._data[propertyName];
				if (cb.isEqual(oldValue,value))//有时候属性值为对象
					return false;

				var data = { propertyName: propertyName, value: value, oldValue: oldValue };
				if (!this.beforeExecute("stateChange", data))
					return false;

				this._data[propertyName] = value;

				var args = new cb.model.PropertyChangeArgs(this._name, 'state', data);
				this.PropertyChange(args);

				this.afterExecute("stateChange", data);

			}
			//设置列状态
			else if (rowIndex < 0 && cellName) {
				var oldValue = this._data.columns[cellName][propertyName];
				if (oldValue === value)
					return false;

				var data = { field: cellName, propertyName: propertyName, value: value, oldValue: oldValue, columns: cb.clone(this._data.columns) };
				if (!this.beforeExecute("columnStateChange", data))
					return false;
				
				
				this._data.columns[cellName] = this._data.columns[cellName] || {};//这样可能会增加新列
				this._data.columns[cellName][propertyName] = value;

				var args = new cb.model.PropertyChangeArgs(this._name, "columnState", data);
				this.PropertyChange(args);

				this.afterExecute("columnStateChange", data);
			}
			//设置行状态
			else if (rowIndex >= 0 && !cellName) {
				var oldValue = this._data.rows[rowIndex][propertyName];
				if (oldValue === value)
					return;

				var data = { index: rowIndex, propertyName: propertyName, value: value, oldValue: oldValue };
				if (!this.beforeExecute("rowStateChange", data))
					return false;

				if (!value && (propertyName == "readOnly" || propertyName == "disabled")) {
					//如果值==false,
					delete this._data.rows[rowIndex][propertyName];
				}
				else {
					this._data.rows[rowIndex][propertyName] = value;
				}

				var args = new cb.model.PropertyChangeArgs(this._name, "rowState", data);
				this.PropertyChange(args);

				this.afterExecute("rowStateChange", data);
			}
			//设置单元格状态
			else if (rowIndex >= 0 && cellName) {
				var cell = this._data.rows[rowIndex][cellName];
				var isObject = (cell && typeof cell == "object");
				var oldValue = isObject ? cell[propertyName] : undefined;
				if (oldValue === value)
					return;

				var data = { index: rowIndex, field: cellName, propertyName: propertyName, value: value, oldValue: oldValue };
				if (!this.beforeExecute("cellStateChange", data))
					return false;

				if (cb.isEmpty(value)) {
					//如果置空，则列只存值
					if (isObject)
						delete cell[propertyName];
					//this._data.rows[rowIndex][cellName] = isObject ? cell.Value : cell; //不止一个属性
				}
				else if (!value && (propertyName == "readOnly" || propertyName == "disabled")) {
					//如果值==false,
					//this._data.rows[rowIndex][cellName] = isObject ? cell.Value : cell;
					if (isObject) {
						delete cell[propertyName];
						var hasProperty = false;
						$.each(cell, function (attr) { if (attr != "Value" || attr != "value") { hasProperty = true; return; } });
						if (!hasProperty)
							this._data.rows[rowIndex][cellName] = cell.Value;
					}
				}
				else {
					if (!isObject)
						cell = this._data.rows[rowIndex][cellName] = { value: cell };
					cell[propertyName] = value;
				}
				var args = new cb.model.PropertyChangeArgs(this._name, "cellState", data);
				this.PropertyChange(args);

				this.afterExecute("cellStateChange", data);
			}
		}

	},
		
	//自动换行
	setAutoWrap:function(autoWrap){
		if(this.set('autoWrap',!!autoWrap)!==false){//属性变化时才通知视图更新，把和并信息的计算放到绑定器中处理
			var args = new cb.model.PropertyChangeArgs(this._name, "autoWrap",!!autoWrap);
			this.PropertyChange(args);	
		}
	},
	//todo:设置固定列边界
	setFrozenField:function(field){
		var col=this.get(null,field);
	},
	//是否合并单元格控制
	setMergeState:function(merge){
		if(this.set('mergeState',!!merge)!==false){//属性变化时才通知视图更新，把和并信息的计算放到绑定器中处理
			var mergeCells=null;
			if(merge){
				mergeCells=this._getMergeCells();
			}
			var args = new cb.model.PropertyChangeArgs(this._name, "mergeInfo",{rows:this._data.rows,mergeCells:mergeCells});
			this.PropertyChange(args);	
		}
	},
	getMergeState:function(){return this.get('mergeState');},

		//返回当前显示行的可合并信息
		/*只统计rowspan>=2的单元格
		数据结构：{
			field1:[{index:0,rowspan:2},{index:2,rowspan:3}],
			field2:[{index:2,rowspan:2}]
		}
		*/
	_getMergeCells:function(){
		var fields=this._getFieldNames();
		var count=0;//统计一共有多少可合并的单元格
		var mergeCells={};
		var rows=this._data.rows;
		var cellsInPreCol=[{index:0,rowspan:rows.length}];//前列中合并的单元格信息
		var cellsInCurCol;//当前列的合并单元格信息，当前列中合并的单元格信息依赖与前列的合并单元格信息
		var field,//当前字段名
			preMergeCell,preVal,val;//当前处理的列参照的前一列中合并的单元格
		var cols=this._getColumns();
		for(var i=0,len=fields.length;i<len;i++){		
			field=fields[i];
			//if(!cols[field].annexable)break;
			cellsInCurCol=[];
			for(var j=0;j<cellsInPreCol.length;j++){
				preMergeCell=cellsInPreCol[j];
				var k=preMergeCell['index'],end=k+preMergeCell.rowspan;
				var rowspan=0;
				do{
					val=this.get(k,field);
					if(!rowspan){
						rowspan++;
						preVal=val;	
							
					}else{
						if(val!==preVal){//如果和前面的只不相等，则只合并前面扫描过的行单元格
							if(rowspan>1){
								cellsInCurCol.push({index:k-rowspan,rowspan:rowspan});
								count++;
							}
							rowspan=1;//从这个不一样的值开始重新计数,且记录当前值
							preVal=val;
						}else{
							rowspan++;//合并,
							//当最后的几行可以可并时
							if(rowspan>1&&k==end-1){
								cellsInCurCol.push({index:k-rowspan+1,rowspan:rowspan});
								count++;
							}
						}
					}
					k++;
				}while(k<end);
				
			}
			if(cellsInCurCol.length){
				cellsInPreCol=mergeCells[field]=cellsInCurCol;
			}else{//如果某列没有可合并的单元格，则终止搜索
				break;
			}
		}
		//console.log('mergeCells:',JSON.stringify(mergeCells,null,4));
		return count?mergeCells:null;
	},
	//单页排序设置
	setSortFields:function(sortFields,noReflesh){//noReflesh仅内部使用
		sortFields=cb.clone(sortFields);
		if (!this.beforeExecute("sort")) {//执行前动作被阻止时，使视图和model保持一致
			var args = new cb.model.PropertyChangeArgs(this._name, "sortFields",this._data.sortFields);
			this.PropertyChange(args);
			return;
		}
		if(this.set('sortFields',sortFields)!==false && !noReflesh && sortFields.length){//如果指定不刷新这不重排序
			this._data.rows = this._sort(this._data.rows);
			//显示的数据集（包括排序信息）改变后，刷新界面显示
			this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "displayRows", this._data.rows));
			this.afterExecute("sort");
		}
		
	},
	//应该使用副本数据，避免别处的修改印象model内部状态
	getSortFields:function(){return this.get('sortFields');},
		//根据模型设置的排序规则，对数据行排序，返回排序后的行对象数组
	_sort:function(rows){
		var fields=this.getSortFields();
		if (!this.getReadOnly() ||!fields|| !fields.length) return rows;
		var model3d=this,
			Model3D=cb.model.Model3D;
			columns=this._getColumns();
		var fn=function(itemA, itemB){
				var valA,valB;
				for(var i=0,len=fields.length;i<len;i++){
					var field=fields[i][0];//字段名
					var col=columns[field];
					if(!col)continue;
					
					//提取行数据中对应字段的值
					valA=itemA[field]&&typeof itemA[field]=='object'?itemA[field].value:itemA[field];
					valB=itemB[field]&&typeof itemB[field]=='object'?itemB[field].value:itemB[field];
					
					//可在列信息中指定排序规则，指定排序规则时可通过名称引用已有的排序方式，也可以通过比较器定义排序规则
					var comparator=col.comparator;
					//如果未指定comparator，或指定无效的类型数据（既不是字符串，也不是函数）
					if(!comparator||(typeof comparator!=='string'&& Object.prototype.toString.call(comparator)=='[object Function]')){
						comparator=null;
					}
					//如果指定了预定义的比较器名称，则使用名称对应的比较器
					comparator=typeof comparator==='string'?Model3D.comparators[comparator]:comparator;
					//如果还没有确定比较器，则使用类型默认的排序方式,如果类型没有默认的排序方式
					comparator=comparator||Model3D.comparators[col.type||'String'];//未指定字段类型时，默认为字符串类型

					var direction=fields[i][1];
					//如果没有比较器，这保持原有顺序
					var result=comparator?(direction===1?comparator(valA, valB):0-comparator(valA, valB)):0;//direction:1 asc,-1 des;					
					
					if(result)return result;
				}
			};
		
		rows.sort(fn);
		return rows;
	},
	//#region getState
	setRowState:function (rowIndex, propertyName, value) {
		this.set(rowIndex, null, propertyName, value);
	},
	getRowState:function (rowIndex, propertyName) {
		return this.get(rowIndex, null, propertyName);
	},
	setColumnState:function (cellName, propertyName, value) {
		this.set(null, cellName, propertyName, value);
	},
	getColumnState:function (cellName, propertyName) {
		return this.get(null, cellName, propertyName);
	},
	setCellState:function (rowIndex, cellName, propertyName, value) {
		this.set(rowIndex, cellName, propertyName, value);
	},
	getCellState:function (rowIndex, cellName, propertyName) {
		return this.get(rowIndex, cellName, propertyName);
	},
	getReadOnly: function (rowIndex, cellName) {//行字段的可编辑性受model、行和列的可编辑状态影响。
	    var hasColumn = !!cellName && this.hasColumn(cellName);//是否指定了列
	    var hasRow = rowIndex != null && rowIndex >= 0;//是否指定了行
	    var modelReadOnly = false,//模型上的设置
            rowReadOnly = false,//行上的设置
            colReadOnly = false,//列上的设置
            cellReadOnly = false;//单元格上的设置
        
	    modelReadOnly = this.getState('alwaysReadOnly') || this.getState('readOnly');
        
	    if (hasRow) {
	        rowReadOnly = this.get(rowIndex, null, 'readOnly') || this.get(rowIndex, null, 'alwaysReadOnly');
	    }

	    if (hasColumn) {
	        colReadOnly = this.get(null, cellName, 'readOnly') || this.get(null, cellName, 'alwaysReadOnly');
	        
	    }
	    if (hasRow && hasColumn) {
	        cellReadOnly = this.get(rowIndex, cellName, 'readOnly') || this.get(rowIndex, cellName, 'alwaysReadOnly');
	    }
	    return modelReadOnly || rowReadOnly || colReadOnly || cellReadOnly;

	},
	setReadOnly:function (rowIndex, cellName, value) {
		if (arguments.length == 0)
			return;
		//使支持 setReadOnly(value),setReadOnly(rowIndex,value),setReadOnly(cellName,value)
		if (arguments.length == 1) {
			value = arguments[0];
			rowIndex = -1;
			cellName = null;
		}
		else if (arguments.length == 2) {
			value = arguments[1];
			if (typeof arguments[0] == "number") {
				rowIndex = arguments[0];
				cellName = null;
			}
			else if (typeof arguments[0] == "string") {
				cellName = arguments[0];
				rowIndex = -1;
			}
		}

		this.set(rowIndex, cellName, "readOnly", value);
	},
    //没有disabled属性
	getDisabled:function (rowIndex, cellName) {
	    return false;
	},
	setDisabled: function (rowIndex, cellName, value) {

	},
	getState:function (propertyName) {
		return propertyName ? this.get(propertyName) : null;
	},
	setState:function (propertyName, value) {
	    if (!propertyName) return;

		this.set(null, null, propertyName, value);
	},
	//#endregion state
	
	setColumns:function (columns,fieldNames) {
	    if (!this.beforeExecute("setColumns", columns))
			return;
		//columns = cb.isArray(columns) ? columns : [columns];
		this._data.columns = cb.clone(columns);
		this._data.fieldNames=fieldNames||this._getFieldNames();

		this._updatePriority=this._computeUpdatePriority();

		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "columns", cb.clone(this._data)));
		this.afterExecute("setColumns", columns);
	},
	refreshColumns: function () {
	    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "columns", cb.clone(this._data)));
	},
	//根据定义的页数据过滤器，过滤行数据
	_filter:function(rows){
		return rows;
	},
	/*
	模型中设置数据源，数据源有来源属性（标识数据直接来自远程服务器还是来自本地）；
	分页展示的定义：视图中显示的数据只是数据源的特定部分时，确定的展示方式属于分页展示（分页的具体方式可根据需要定制，例如支持普通的分页和滚动时分页，滚动时
	分页为了是视图有缓冲带，会要求分页数据之间有部分重叠）
	分页是数据展示的一种方式，独立与数据来源。
	*/

	//更新显示的数据行
	_refreshDisplay:function(){
		var pageRows=this._getCurrentPageRows();
		if(pageRows){
			this._setPageRows(pageRows);
			//通知分页条更新
			this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "pageInfo", this.getPageInfo()));
		}else{//数据不全在本地
			var pageServer=this._getPageServer();
			if(!pageServer)return;
			var params=$.extend({},this._queryParams);
			var pageInfo=this._getRemotePageInfo(this.getPageSize(),this.getPageIndex());
			
			if (this._paramAdpter) {
			    this._paramAdpter(params, { pageIndex: pageInfo.pageIndex + 1, pageSize: pageInfo.pageSize })
			}else{
			    params.pageSize=pageInfo.pageSize;
			    params.pageIndex = pageInfo.pageIndex + 1;
			}
			pageServer(params,this._pageServerCallBack);
			
		}
	},
	_getPageServer:function(){
		return this._pageServer;
	},

	//数据是否直接来源与服务端，如果不是，不接受设置分页查询代理
	_isRemote:function(){
		return this.get('dsMode').toLowerCase()==='remote';
	},

	//rows为对应的页数据，根据model的设置（页过滤规则，排序规则），得到页面展示的数据
	_setPageRows:function(rows){
		this._data.rows=this._sort(this._filter(rows));
		//刷新视图
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "displayRows", this._data.rows));
	},
	
	//初始化ds（初始化datasource后要更新rowsInView）
	//使用本地数据时，调用setDataSource时传递的参数为一个记录数组；
	//设置远程数据源时，参数为：请求数据的查询方法，查询参数，也可以传递一个可选的单页数据对象{currentPageData:[],pageIndex:pageIndex,pageSize:pageSize,totalCount:pageSize}
    //如果没提供单页数据时，自动请求一页数据
    //preCallback用于使用数据前的处理。（一般涉及到修改数据结构，最终产生一页数据对象，在每次翻页时都会调用，callback只调用一次）
    //paramAdpter:用于适配分页参数。
	setDataSource: function (proxy, method, queryParams, pageData, callback, preCallback,paramAdpter) {
	    delete this._preCallback;//删除之前的预处理方法。
	    delete this._paramAdpter;
		if(this._isRemote()){
		    if (proxy && typeof proxy[method] !== 'function') {
		        //console.error('');
		        return;
		    }
		    var pageServer = $.proxy(proxy[method],proxy);
			queryParams=queryParams||{};
			this._pageServer=pageServer;
			this._queryParams = queryParams;

			if (typeof pageData === 'function') {//没提供页数据参数
			    paramAdpter = preCallback;
			    preCallback = callback;
			    callback = pageData;
			    pageData = null;		    
			}

			if (preCallback) {
			    this._preCallback = preCallback;
			}
			if (paramAdpter) {
			    this._paramAdpter = paramAdpter;
			}
			if (pageData) {//有一页数据了，就不自动请求
				var data=pageData;
				//更新datasource长度和内容
				this._dataSource=new Array(data.totalCount);
				this._rowsDataState=new Array(data.totalCount);
				pageData._pageStart=0;
				pageData._dsStart=0;
				//更新远程数据源后，重置远程数据源记录数
				this._currentTotalCount=data.totalCount;
				
				this._pageServerCallBack(data,null,true);
				if (callback) callback();

			}else{//自动请求第一页数据
				var params=$.extend({},queryParams);
				params.pageSize=this.getPageSize();
				this.setPageIndex(0,true);
				params.pageIndex=1;
				pageServer(params,$.proxy(function(success,fail){
					if(fail){
					    //alert(fail.error);
						return;
					}
                    /*移动setPageRows中处理
					var data = success;
					this._currentTotalCount=data.totalCount;
					//更新datasource长度和内容
					this._dataSource=new Array(data.totalCount);
					this._rowsDataState=new Array(data.totalCount);
					var remotePageInfo=this._getRemotePageInfo(this.getPageSize(),this.getPageIndex());
					data._dsStart=remotePageInfo.dsStart;
					data._pageStart=remotePageInfo.pageStart;
                    
					this._pageServerCallBack(data);
                    */
					if (callback) {
					    callback(success);//约定callback中开始时调用setPageRows，如果没有设置列，还要调用setColumns方法设置grid的列。
					} else {
					    this.setPageRows(success);
					};
				}, this));
			}
			
		}else{//data为datasource结构
			var data=proxy;
			data=cb.isArray(data)?data:[];
			this._dataSource = cb.clone(data);
			this._setIds(this._dataSource);
			var Unchanged=cb.model.DataState.Unchanged;
			//初始化行数据状态
			var rowsDataState=this._rowsDataState=new Array(data.length);
			for (var i = rowsDataState.length - 1; i >= 0; i--) {
			    rowsDataState[i] = Unchanged;
			}
			this._refreshDisplay();
			if (callback) callback();
		}
	},
	_getDataSource:function(){return this._dataSource;},
	setPageRows: function (data) {
	    if (!data) return;
	    this._currentTotalCount = data.totalCount;
	    //更新datasource长度和内容
	    this._dataSource = new Array(data.totalCount);
	    this._rowsDataState = new Array(data.totalCount);
	    var remotePageInfo = this._getRemotePageInfo(this.getPageSize(), this.getPageIndex());
	    data._dsStart = remotePageInfo.dsStart;
	    data._pageStart = remotePageInfo.pageStart;

	    this._pageServerCallBack(data,null,true);
	},
	//数据库查询的数据到后更新数据源
	_updateDataSource:function(rows,dsStart,pageStart){
	    //暂时简单处理，把数据放到指定位置，不考虑客户端的已有修改
	    this._setIds(rows);
		var ds=this._getDataSource();
		var rowsDataState=this._rowsDataState;
		var Unchanged=cb.model.DataState.Unchanged,
			Missing=cb.model.DataState.Missing,
			Add=cb.model.DataState.Add;
		//如果数据之前为加载，则把数据更新到对应位置
		for(var i=pageStart,indexInDs=dsStart,len=rows.length;i<len;){
			var rowState=rowsDataState[indexInDs];
			while(rowState==Add){//跳过用户编辑过程中添加的行
				indexInDs++;
			}
			if(rowState==Missing){
				ds[indexInDs]=rows[i];
				rowsDataState[indexInDs]=Unchanged;
			}
			i++;
			indexInDs++;
		}
	},
	/*
	由于分页在用户视角下是相对于本地数据源的，当grid可以编辑时，在编辑过程的一个时间点，数据源中数据可能既有由于编辑中添加的，也有还为同步到本地的，同步到
	本地的数据可能有被删除的，这时候翻页操作时，可能没有对应的页的完整数据（可能只有部分），这时需要去服务器请求在服务器中的数据，但此时要请求的数据并不一定是
	远程数据源中的同一页数据，需要根据本地数据源和远程数据源的映射关系，计算出应该请求哪一页数据，请求的页大小按当前客户端的页大小时，请求的数据不一定能完全填充
	缺失的数据。这时需要适当的调大pageSize，然后从返回的远程数据中截取需要的部分数据。
	*/
	//@return {pageIndex:pageIndex,pageSize:pageSize,dsStart:dsStart,pageStart:pageStart}
	_getRemotePageInfo:function(pageSize,pageIndex){
		var indexInfo=this._getIndexInDs(pageSize*pageIndex);
		var rowDataState=this._rowsDataState;
		var count=0,needCount;
		var Missing=cb.model.DataState.Missing;
		var Delete=cb.model.DataState.Delete;
		var indexInds=indexInfo.indexInDs;
		var i=indexInfo.indexInDs;
		var len=rowDataState;
		//记录要展示的页中已有几条记录（肯定不会多余一页数据，否则不需要请求远程数据了，也就不好调用这个方法）
		while(i<len&&rowDataState[i]!==Missing){
			if(rowDataState[i]!==Delete)count++;//如果要请求的数据中一部分已经在客户端删除，则要多请求一条记录，因为被删除的不会显示
			i++;
		}
		needCount=Math.max(0,pageSize-count);
		
		var j=needCount;
		//统计实际需要请求多少条数据，因为要请求的数据中可能有些在之前已经在客户端的删除操作删了，这时需要额外多请求一条数据
		while(j&&i<len){
			if(rowDataState[i]!==Delete)needCount++;//如果要请求的数据中一部分已经在客户端删除，则要多请求一条记录，因为被删除的不会显示
			if(rowDataState[i]!==Add&&rowDataState[i]!==Delete)j--;//如果发现一条未被删除的远程数据，则说明以找到一条远程数据
			i++;
		}
		needCount=Math.max(20,needCount);//需要请求的记录数，每次最少请求20条数据，避免多次请求少尺寸的页面数据
		
		var pageIndexInRemote,
			pageSizeInRemote,
			startIndexInRemote=indexInfo.remoteRowCountBefore;

		pageSizeInRemote=this._computePageSize(indexInfo.remoteRowCountBefore+needCount,needCount);
		pageIndexInRemote=Math.ceil((indexInfo.remoteRowCountBefore+1)/pageSizeInRemote)-1;
		indexInResponse=startIndexInRemote%pageSizeInRemote;
		return {
			pageIndex:pageIndexInRemote,
			pageSize:pageSizeInRemote,
			pageStart:indexInResponse,
			dsStart:indexInds
		};
		
	},
	//求一个分页只，使最后的needCount项在一个完整分页中
	_computePageSize:function _computePageSize(count,needCount){
		var start=count-needCount+1;//第一个需要的元素的序数号
		var power=1;
		while(power<count){
			power*=2;
		}
		needCount=needCount+power-count;
		//计算最小的包含需要数量元素的分页大小
		var size=power;
		while(size>=needCount){
			size=size/2;
		}
		return size*2;
	},
	//尝试获取当前页数据，如果当前页数据不全,返回null
	_getCurrentPageRows:function(){
		var rows=[];
		var ds=this._getDataSource();
		var Missing=cb.model.DataState.Missing;
		var Delete=cb.model.DataState.Delete;

		var pageIndex=this._data.pageIndex,
			pageSize=this._data.pageSize;
		
		if(pageSize<0){
			var rows=[],ds=this._dataSource;
			var rowsDataState=this._rowsDataState,
				Delete=cb.model.DataState.Delete;
			for(var i=0,len=ds.length;i<len;i++){
				if(rowsDataState[i]!==Delete){
					rows.push(ds[i]);
				}
			}
			return rows;
		}
		//分页时
		var	i=this._getIndexInDs(pageSize*pageIndex).indexInDs,
			count=pageSize;

		for(var len=ds.length;i<len&&count>0;i++){
			if(this._rowsDataState[i]!==Delete){//如果这条数据被来自于远程的数据在编辑过程中被删除了，则已经不再本地数据源中了
				if(this._rowsDataState[i]!=Missing){
					rows.push(ds[i]);
					count--;
				}else{
					return null;
				}
			}
		}
		return rows;
	},
	//获取用户视角下数据索引对应的数据在本地datasource中的index,顺便统计ds中对应的位置之前有多少远程数据
	_getIndexInDs:function(index){
		var rowDataState=this._rowsDataState;
		var num=index+1;//序数
		var count=0,remoteRowCountBefore=0;
		var Delete=cb.model.DataState.Delete,
			Add=cb.model.DataState.Add;
		for(var i=-1,len=rowDataState.length;i<len&&count<num;){
			i++;
			if(rowDataState[i]!==Delete)count++;
		}
		var indexInDs=i;
		for(var i=0,len=rowDataState.length;i<indexInDs;i++){
			if(rowDataState[i]!==Add)remoteRowCountBefore++;
		}
		return {
				indexInDs:indexInDs,
				remoteRowCountBefore:remoteRowCountBefore//本地ds中index对应位置前的远程数据的数量
			};
	},
	//获取分页信息（分页时返回一个表示分页信息的对象，不分页时返回数据行总数）
	getPageInfo: function () {
	    return this._hasPagination ()? {
	            pageIndex:this.getPageIndex(),
	            pageSize:this.getPageSize(),
	            totalCount:this.getTotalCount()
	        }:this.getTotalCount();
	},
    //是否分页显示（根据pageSize判断）
	_hasPagination: function () {
	    return this.getPageSize() > 0;
	},
	setPageSize:function (pageSize,_inner) {//指定为内部调用时，仅仅更新内部状态，不刷新视图,加'_'前缀的参数只在内部可用
		if (typeof pageSize !== 'number') {return;}
		
		pageSize=Math.max(-1,pageSize);
		this._data.pageSize = pageSize;
		this._data.pageIndex=0;
		if(!_inner){this._refreshDisplay();}
	},
	getPageSize:function () {
		return this._data.pageSize;
	},
	setPageIndex:function(index,_inner,beforeRender,afterRender){
		var pageCount=this.getPageCount();
		if(index>=0&&index<pageCount){
			this._data.pageIndex=index;
			if(!_inner){this._refreshDisplay(beforeRender,afterRender);}
		}
	},
	//获取本地数据源中记录数量
	getTotalCount: function () {
		var rowDataState=this._rowsDataState,
			Delete=cb.model.DataState.Delete;
		for(var count=rowDataState.length,i=rowDataState.length-1;i>=0;i--){
			if(rowDataState[i]===Delete)count--;
		}
		return count;
	},
	gotoPage:this.setPageIndex,
	getPageIndex:function(){
		return this._data.pageIndex;
	},
	getPageCount:function(){
		return this._data.pageSize!=-1?Math.ceil(this._dataSource.length/this._data.pageSize):+!!this._dataSource.length;
	},
	showNextPage:function(){
		var index=this.getPageIndex()+1;
		var pageCount=this.getPageCount();
		if(index<pageCount){
			this.setPageIndex(index);
		}
	},

	showPreviousPage:function(){
		var index=this.getPageIndex()-1;
		if(index>=0){
			this.setPageIndex(index);
		}
	},
	showFirstPage:function(){
		this.setPageIndex(0);
	},
	showLastPage:function(){
		var index=this.getPageCount()-1;
		if(index>=0){
			this.setPageIndex(index);
		}
	},
	/////

	//commitRows:function (rows) {
	//    if (!this.beforeExecute("commitRows", rows))
	//		return;
	//	rows = cb.isArray(rows) ? rows : [rows];
	//	var rowIndexes = [];
	//	cb.each(rows, function (row) {
	//		var rowIndex = (typeof row == "number") ? row : this._data.rows.indexOf(row);
	//		rowIndexes.push(rowIndex);
	//	}, this);
	//	this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "commitRows", rowIndexes));
	//	this.afterExecute("commitRows", rowIndexes);
	//},

	//焦点行，选中行操作、管理(通过索引操作，应用开发人员不能直接操作model总的行数据，只能通过api操作，获取的行数据为数据副本)
	
	getRow:function (rowIndex,keepStates) {
	    var rowData = cb.clone(this._data.rows[rowIndex]);
	    //删除内部辅助属性
	    delete rowData[cb.model.Model3D._innerUsedAttrs.rowId];
	    delete rowData[cb.model.Model3D._innerUsedAttrs.isSelected];

		if(!keepStates){
		    for (var field in rowData) {
				if(rowData[field]&&typeof rowData[field]==='object'){
				    rowData[field] = rowData[field].value || rowData[field].defaultValue;
				}
			}
		}
		return rowData;
	},
	//焦点管理
	setFocusedIndex:function (index) {
		var rows=this._data.rows;
		if(index<0||index>=rows.length){
			this._focusedRowIndex = -1;
			//this.getEditRowModel().clear();
			return;
		}
		if (this._focusedRowIndex == index)
			return;

		if (!this.beforeExecute("setFocusedIndex", index))
			return;

		var oldValue = this._focusedRowIndex;
		this._focusedRowIndex = index;


		var args = new cb.model.PropertyChangeArgs(this._name, "focusedIndex", index, oldValue);
		this.PropertyChange(args);

		this.afterExecute("setFocusedIndex", index);
	},
	//获取焦点行的索引
	getFocusedIndex:function () {
		return this._focusedRowIndex;
	},
	//获取焦点行对应的记录数据
	getFocusedRow:function () {
		return cb.clone(this._data.rows[this._focusedRowIndex]);
	},
	
	//#region 选择、全选支持
	select:function (rowIndexs) {
	    var rows = rowIndexs;

	    var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;
		this.beforeExecute("select", this);
		if (!cb.isArray(rows)) rows = [rows];
		cb.each(rows, function (index) {
			if (index == this._data.rows.length) return;
			this._data.rows[index][selectedFlag] = true;
		}, this);
		//由于下面还有使用rows，所以不能直接把rows作为参数传到外部，对象参数可能被修改
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "select", cb.clone(rows)));
		rows.length >= 1 ? this.setFocusedIndex(rows[0]) : this.setFocusedIndex(-1);//使第一个参数对应的行获取焦点
		this.afterExecute("select", this);
	},
	unselect:function (rowIndexs) {
		var rows=rowIndexs;
		if (this.beforeExecute("unselect", this) === false) return;
		if (!cb.isArray(rows)) rows = [rows];	
		
		var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;
		cb.each(rows, function (index) { this._data.rows[index][selectedFlag] = false; }, this);
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "unselect", rows));
		this.afterExecute("unselect", this);
	},

	selectAll:function () {
	    if (this.beforeExecute("selectAll", this) === false) return; //内部使用事件名时，用驼峰风格，外边监听事件名时用小写

	    var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;
	    cb.each(this._data.rows, function (row) { row[selectedFlag] = true; }, this);
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "selectAll","selectAll"));//changeArgs中当前值不能等于原来的值，所以不能同时为空
		this.afterExecute("selectAll", this);
	},
	unselectAll:function () {
	    if (this.beforeExecute("unselectAll", this) === false) return;

	    var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;
	    cb.each(this._data.rows, function (row) { row[selectedFlag] = false; }, this);
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "unselectAll","unselectAll"));
		this.afterExecute("unselectAll", this);
		
	},
	//支持多页选中
	getSelectedRows:function () {
		var selectedRows = [];
	    var Delete = cb.model.DataState.Delete;
	    var rowDataState = this._rowsDataState;

	    var rows = this._dataSource;
	    var rowData;
	    var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;

		for (var i = 0, length = rows.length; i < length; i++) {
		    if (rows[i] && rowDataState[i] !== Delete && rows[i][selectedFlag]) {//可能还有远程数据,不考虑已删除的
		        rowData = cb.clone(rows[i]);
		        //删除内部辅助属性
		        delete rowData[cb.model.Model3D._innerUsedAttrs.rowId];
		        delete rowData[cb.model.Model3D._innerUsedAttrs.isSelected];
		        selectedRows.push(rowData);
			}
		}
		return selectedRows;
	},
	//获取当前显示的行数据中选中的行的索引,
	getPageSelectedIndexs:function () {
		var selectedRows = [];
		var rows = this._data.rows;
		var selectedFlag = cb.model.Model3D._innerUsedAttrs.isSelected;
		for (var i = 0, length = rows.length; i < length; i++) {
		    if (rows[i][selectedFlag]) {
				selectedRows.push(i);
			}
		}
		return selectedRows;
	},

	

	getCurrentPageRows:function(keepStates){
		var rows=this._data.rows;
		var ret=[];
		for (var i = 0, length = rows.length; i < length; i++) {
			ret.push(this.getRow(i,keepStates));
		}
		return ret;
		
	},
	//获取当前页选中的记录数据
	getPageSelectedRows:function(){
		var selectedIndexs=this.getPageSelectedIndexs();
		var selectedRows=[];
		for(var i=0,len=selectedIndexs.length;i<len;i++){
			selectedRows.push(this.getRow(selectedIndexs[i]));
		}
		return selectedRows;
	},
	//#endregion
	
	registerFieldEditor:function(name,def){
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "registerFieldEditor", {name:def}));
	},
	//编辑相关
	_onBeforeCellEditing:function(data){//data中包含行位置索引和列名
		var index=data.rowIndex,
			field=data.field;
		var readOnly=this.getReadOnly(index,field);
		if(readOnly)return;
		var evtArg={row:this.getRow(index),field:field,index:index}
		if (!this.beforeExecute("CellEditing", evtArg)) return; //提供编辑前预处理机制，可用于编辑前的校验（有时候编辑字段之间存在依赖关系，例如某些值不空时才能编辑对应字段）
		this.setFocusedIndex(index);
		this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "cellEditing", evtArg));	
	
	},
	//值操作
	getCellValue:function (rowIndex, cellName) {
		return this.get(rowIndex, cellName);
	},
	setCellValue: function (rowIndex, cellName, value,quiet) {//更新操作都通过rowModel完成。
	    if (this.getReadOnly()) return;
	    var data = {};
	    data[cellName] = value;
	    this.updateRow(rowIndex, data, quiet);
		//return this.set(rowIndex, cellName, null, value);
	},
	//插入行：只有编辑态下才能执行该操作，编辑态下不支持排序，过滤等操作，
	insertRow: function (rowIndex, rowData, keepSync) {//如果保持同步，处理公式，携带等;涉及到参照公式时keepSync设置为true，先插入空行，然后更新。
	    if (this.getReadOnly()) return;
	    keepSync = true;//暂时统一放开这个控制。
	    rowData = $.extend(true, this._getDefaultRowData(), rowData || {});
	    this._setIds(rowData);
	    var rowsInPage = this._data.rows;
	    rowIndex = Math.min(rowsInPage.length, Math.max(0, rowIndex));//0<=rowIndex<=this._data.rows.length;
        
		//插入新行前提供校验机制
	    if (!this.beforeExecute("insertRow", { index: rowIndex, row: rowData })) return false;
	    //焦点行变化前通知保存焦点行数据
	    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "beforeInsert", {}));
		//计算在ds中的位置
		var ds=this._dataSource,
			indexInDs;
		if(rowsInPage.length==0){
			indexInDs=0;
		}else{
			//如果是在页尾追加，则计算出最后一行的位置，把行添加到最后一行的后面;否则把行插入到页中rowIndex对应的行在ds中的位置
			indexInDs=rowsInPage[rowIndex]?ds.indexOf(rowsInPage[rowIndex]):ds.indexOf(rowsInPage[rowsInPage.length-1])+1;
		}
		this._dataSource.splice(indexInDs, 0, !keepSync? rowData : this._setIds({}));
		//同步行状态
		this._rowsDataState.splice(indexInDs,0,cb.model.DataState.Add);
		//更新要显示的行
		this._focusedRowIndex = rowIndex;//暂时不通知视图更新，下面的刷新显示会获取焦点信息
		
		this._refreshDisplay();
		if (keepSync) {
		    //由于updateRow可能是异步的，这样通过rowIndex去操作并不一定可靠（例如在更新完成前有删除行或增行操作），以后要通过行标识关联视图和模型。
		    this.updateRow(rowIndex, rowData,true);//添加行时的更新不触发外部事件
		}
		//this.afterExecute("insertRow");
	},
	insertRows: function (rowIndex,rows) {
	    if (this.getReadOnly()) return;
	    if (!cb.isArray(rows)) return;
	    var that = this;
	    $.each(rows, function (i, row) {
	        rows[i] = $.extend(true, that._getDefaultRowData(), row || {});
	    });
	    
	    this._setIds(rows);
	    var rowsInPage = this._data.rows;
	    rowIndex = Math.min(rowsInPage.length, Math.max(0, rowIndex));//0<=rowIndex<=this._data.rows.length;

	    //插入新行前提供校验机制
	    if (!this.beforeExecute("insertRows", { index: rowIndex, rows: cb.clone(rows) })) return false;
	    //焦点行变化前通知保存焦点行数据
	    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "beforeInsertRows", {}));
	    //计算在ds中的位置
	    var ds = this._dataSource,
			indexInDs;
	    if (rowsInPage.length == 0) {
	        indexInDs = 0;
	    } else {
	        //如果是在页尾追加，则计算出最后一行的位置，把行添加到最后一行的后面;否则把行插入到页中rowIndex对应的行在ds中的位置
	        indexInDs = rowsInPage[rowIndex] ? ds.indexOf(rowsInPage[rowIndex]) : ds.indexOf(rowsInPage[rowsInPage.length - 1]) + 1;
	    }
	    this._dataSource.splice.apply(this._dataSource, [indexInDs, 0].concat(rows));
	    //同步行状态
	    var stateArr = new Array(rows.length);
	    $.each(stateArr, function (i, state) { state = cb.model.DataState.Add; });
	    this._rowsDataState.splice.apply(this._rowsDataState, [indexInDs, 0].concat(stateArr));
	    //更新要显示的行
	    this._focusedRowIndex = rowIndex;//暂时不通知视图更新，下面的刷新显示会获取焦点信息
	    this._refreshDisplay();
	    //this.afterExecute("insertRows");
	},
    //更新界面中行的数据状态
	_updateRowState: function (index, state) {
        
	    var rowsInPage = this._data.rows,
	        ds = this._dataSource,
			indexInDs = ds.indexOf(rowsInPage[index]);
	    var Delete=cb.model.DataState.Delete,
            Add = cb.model.DataState.Add;
	    var currentRowState = this._rowsDataState[indexInDs];
        //如果当前row为新添加的行或已经被删除，则不能设置为更新行。
	    if (currentRowState !== Add && currentRowState !== Delete) {
	        this._rowsDataState[indexInDs] = state;
	    }
        
	},
    //获取增加行时的默认行数据
	_getDefaultRowData: function () {
	    var rowData = {};
	    var cols=this._getColumns();
	    var col;
	    var dateTypes = ['DateTimeBox','DateBox'];
	    for (var field in cols) {
	        col=cols[field];
	        if (col && col.defaultValue != null) {
	            if (dateTypes.indexOf(col.ctrlType) >= 0) {//日期类型的默认值，
	                rowData[field] = cb.util.formatDate(new Date(+new Date()+(+col.defaultValue) * 24 * 60 * 60 * 1000));
	            } else {
	                rowData[field] = col.defaultValue;
	        }
	            
	    }
	    }
	    return rowData;
	},
	appendRow: function (rowData) {//分页时可能最后一页数据还在远程服务器
	    if (this.getReadOnly()) return;

	    rowData = $.extend(true, this._getDefaultRowData(), rowData || {});
	    //this._setIds(rowData);
	    if (!this.beforeExecute("insertRow", { index: rowIndex, row: rowData })) return false;
	    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "beforeInsert", {}));

		var pageSize=this.getPageSize();
		var rowIndex;
		var emptyRow = this._setIds({});
		
		if (pageSize >0) {//分页
			
		    if (this._isRemote()) {//有远程数据的分页
		        //跳转到最后一页
		        var pageServer = this._getPageServer();
		        //var pageServer=this._getPageServer();
		        var params = $.extend({}, this._queryParams);
		        var pageInfo = this._getRemotePageInfo(this.getPageSize(), this.getPageIndex());
		        params.pageSize = pageInfo.pageSize;
		        params.pageIndex = pageInfo.pageIndex + 1;
		        //pageServer(params,this._pageServerCallBack);
		        //此处重新定义数据返回后的逻辑，以减少页面的多次渲染
		        pageServer(params, $.proxy(function (success, fail) {
		            if (success) {
		                var data = success;
		                if (this._dataSource.length !== data.totalCount) { alert('grid中数据已过期，保存刷新后再处理'); return; }
		                if (data._pageStart == undefined) {
		                    var pageInfo = this._getRemotePageInfo(this.getPageSize(), this.getPageIndex());
		                    data._pageStart = pageInfo.pageStart;
		                    data._dsStart = pageInfo.dsStart;
		                }
		                this._updateDataSource(data.currentPageData, data._dsStart, data._pageStart);

		                this._dataSource.push(emptyRow);
		                this._rowsDataState.push(cb.model.DataState.Add);
		                var totalCount = data.totalCount,
						    pageSize = this.getPageSize();
		                var lastPageSize = totalCount % pageSize;
		                lastPageSize = lastPageSize ? lastPageSize : pageSize;

		                this._focusedRowIndex = lastPageSize - 1;
		                this.setPageIndex(this.getPageCount() - 1, true);

		                this.updateRow(this._focusedRowIndex, rowData,true);
		                //this.afterExecute("insertRow");
		            } else {
		                //alert(fail.error);
		            }
		        }, this));
		    } else {//客户端分页
		        this._dataSource.push(emptyRow);
		        this._rowsDataState.push(cb.model.DataState.Add);
		        var totalCount=this.getTotalCount(),
                    pageCount=Math.ceil(totalCount/pageSize);

		        this.setPageIndex(pageCount, true);
		        this._focusedRowIndex = (!totalCount%pageSize?pageSize:totalCount%pageSize)-1;//暂时不通知视图更新，下面的刷新显示会获取焦点信息
		        this._refreshDisplay();//数据都已在本地了

		        this.updateRow(this._focusedRowIndex, rowData,true);
                
		        //this.afterExecute("insertRow");
		    }
		}else{
		    this._dataSource.push(emptyRow);
			this._rowsDataState.push(cb.model.DataState.Add);
			this._focusedRowIndex = this.getTotalCount()-1;//暂时不通知视图更新，下面的刷新显示会获取焦点信息
			this._refreshDisplay();//数据都已在本地了

			this.updateRow(this._focusedRowIndex, rowData,true);
			//this.afterExecute("insertRow");
		}
		
	},
	updateRow: function (rowIndex, modifyData, quiet) {//quiet 说明是否触发相关事件
	    if (this.getReadOnly()) return;

	    if (rowIndex < 0||rowIndex>=this._data.rows.length || !modifyData)return false;
	    var rowModel=null,modifyCount=0;
	    //先统计要修改的字段数量
	    var rowData = this.getRow(rowIndex);
		for (var attr in modifyData) {
		    //this.set(rowIndex, attr, null, modifyData[attr]);
		    if(rowData[attr]!==modifyData[attr]){
		        modifyCount++;
		    }else{
		        delete modifyData[attr];
		    }
		    
		}
		
		if (modifyCount) {

		    //if (quiet) {//不触发before、after事件
		    //    for (var attr in modifyData) {
		    //        this.set(rowIndex, attr, null, modifyData[attr], quiet);
		    //    }
		    //    return;
		    //}
		    rowModel = this.getEditRowModel(rowData);
		    rowModel._updateQuietly = quiet;
		    rowModel.setData({ '_$count': modifyCount, '_$rowId': this._data.rows[rowIndex][cb.model.Model3D._innerUsedAttrs.rowId] });//设置修改相关的信息
		    //rowModel._initData = rowModel.getData();//备份数据

		    var formulas=this.getState('formulas');
		    if (formulas) { cb.formula.register(rowModel, JSON.parse(formulas), true); }

		    var that = this;
		    rowModel._setWrapper = function () {
		        var propertyName = arguments[0];
		        var oldValue=this.get(propertyName);
		        if (oldValue && oldValue.setValue) {
		            oldValue.setValue(arguments[1]);
		        } else {
		            this.set.apply(this, arguments);
		        }     
		        
		        var count = this.get('_$count') || 0;
		        if (propertyName !== '_$count' && propertyName !== '_$rowId' && !that._isReferOrFormula(propertyName)) {
		            this.set('_$count', --count);
		        }
		        
		        if (!count) {
		            rowModel.execute('save', { rowId: rowModel.get('_$rowId'), update: rowModel.collectData(true) });
		        }
		    };
		    rowModel.getDirtyData = this._getDirtyDataForRowModel;
		    for (var attr in modifyData) {
		        rowModel._setWrapper(attr, modifyData[attr]);//利用vm自带的change同步机制处理参照的修改
		    }
        }

	    return true;
	},
	
	deleteRows: function (rowIndexs) {
	    if (this.getReadOnly()) return;

		if(!cb.isArray(rowIndexs))rowIndexs=Array.prototype.slice.call(arguments,0);
		
		var rows=this._getRowsByIndexs(rowIndexs);
		if (!this.beforeExecute("deleteRows", rows)) return false;
		
		var ds=this._dataSource,
			rowDataState=this._rowsDataState,
			rowsInPage=this._data.rows,
			rowIndexs = rowIndexs.sort(function (i, j) { return i - j; }),//递增排序;(数组的默认排序为按字符串排序)
			Add=cb.model.DataState.Add,
			Delete=cb.model.DataState.Delete,
			rowIndex,
			indexInDs;
		for(var i=rowIndexs.length-1;i>=0;i--){
			rowIndex=rowIndexs[i];
			if (rowIndex >= 0&&rowIndex<rowsInPage.length){
				indexInDs=ds.indexOf(rowsInPage[rowIndex]);
				if(rowDataState[indexInDs]===Add){//如果是新添加的记录，直接删除
					rowDataState.splice(indexInDs,1);
					ds.splice(indexInDs,1);
				}else{
					rowDataState[indexInDs]=Delete;
				}
			}
		}
		//刷新显示
		this._refreshDisplay();//删除后可能导致请求下页数据
		//this._after("deleteRows");
	},
	_getRowsByIndexs:function(rowIndexs){
		var rows=[];
		var rowsInPage=this._data.rows;
		for(var i=0,len=rowIndexs.length;i<len;i++){
			rows.push(this.getRow(rowIndexs[i]));
		}
		return rows;
	},

	isDirty:function (rowIndex) {
	    return !!this.getDirtyData();
	},

	setGridDataMode:function (mode) {
		this._data.Mode = mode;
	},
	getGridDataMode:function () {
		return this._data.Mode;
	},
    //清空数据源
	clear: function () {
	    this._dataSource = [];
	    this._rowsDataState = [];
	    this._currentTotalCount = 0;
	    this.setPageIndex(0, true);
	    this._refreshDisplay();
	},
	getAllColumns: function () {
	    var cols = cb.clone(this._data.columns);
	    return !$.isEmptyObject(cols) ? cols : null;
	},
    //不建议使用getColumns方法
	getColumns: function (fields) {
        //如果没有参数，则返回所有列
	    var ret = [];
	    if (fields == undefined) {
	        for (var attr in this._data.columns) {
	            if (this._data.columns.hasOwnProperty(attr)) {
	                var column = cb.clone(this._data.columns[attr]);
	                if (!column.fieldName) column.fieldName = attr;
	                ret.push(column);
	            }
	        }
	    }
        else{
	        fields = !cb.isArray(fields) ? [fields] : fields;
	        
	        var cols=this._data.columns,col;
	        for (var i = 0, len = fields.length; i < len; i++) {
	            col=cols[fields[i]];
	            if (col) {
	                ret.push(cb.clone(col));
	            }
	        }
	    }
	    return ret;
	},
	getColumn: function (field) {
	    if (!field) return null;
	    return this.getColumns(field)[0] || null;
	},
	hasColumn: function (field) {
	    return this._data.columns.hasOwnProperty(field);
	},
	_exeCommand: function (cmdName, index) {
	    var buildIns = cb.model.Model3D.commands;
	    var commands = this.get('commands');
	    var cmdOpt=commands && commands['cmds'] && commands['cmds'].find(function (item) { return item.name === cmdName });

	    var handler = cmdOpt && cmdOpt.click || buildIns[cmdName] && buildIns[cmdName].click;
	    if (typeof handler === 'function') {
	        handler.call(this, index);
	    } 
	},
	_setVisible:function(fields,visible){
	    if (!fields) return;
	    if (!cb.isArray(fields)) { fields = [fields]; }
	    visible = !!visible;

	    var data=this._data,
	        columns = data.columns;
	    for (var i = 0, len = fields.length; i < len; i++) {
	        var field = fields[i];

	        if (columns[field]) {
	            columns[field].isVisible = visible;
	        } else if (field === '$commands') {
	            data['commands'].isVisible = visible;
	        } else {
	            fields.splice(fields.indexOf(field), 1);
	        }
	    }

	    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "visible", {fields:fields,visible:visible}));
	},
	hideColumns:function(fields){
	    this._setVisible(fields, false);
	},
	showColumns:function(fields){
	    this._setVisible(fields, true);
	},

    ////start editRowModel
    /*
    _setEditRowModel:function (data) {//设置rowModel状态、值等
        if (!this._editRowModel) {
            this._createEditRowModel(this._toAtomicData(data));
        } else {
            if (data == null) {
                this._editRowModel.clear();
                return;
            } else {
                cb.model.PropertyChange.delayPropertyChange(true);
                this._editRowModel.clear();
                this._editRowModel.setData(this._toAtomicData(data));//列状态信息可能已经改变了，必需重新获取完整的行模型信息
                cb.model.PropertyChange.doPropertyChange();
            }
        }
        
    },
    */
    getEditRowModel:function (data) {
        //return this._editRowModel||(this._editRowModel = this._createEditRowModel());
        var rowModel = this._createEditRowModel(data);
        rowModel.setDirty(false);
        return rowModel;
    },
    _createEditRowModel: function (data) {
        //根据当前列信息构造对应的rowViewModel
        var opts = this._toAtomicData(data);
        //设置模型名，用于相关的缓存key的构造
        opts.ViewModelName = opts.ViewModelName || this._parent.getModelName().replace(/_\d+$/, '') + '/' + this.getModelName() + '/rowModel';
        var rowModel = cb.viewmodel.create(opts);//vm
        
        rowModel._parent = this;

        rowModel.on('save', function (data) {
            //data = {
            //    rowId: '',//要提交到的行的标识
            //    count: 5,//用于记录已完成的修改数的计数器，提交时这个值为0；当把数据交给rowModel处理时，会标记要修改的字段数，
            //    //由于参照、公式等可能存在异步延迟,所以等要修改处理的字段都完成了，在一次行更新到Model3D中对应的行。
            //    //此处的count只上流提供的修改数据中涉及到的字段数。
            //    update: {
            //        //更新的字段数据；由于公式、参照的特殊处理方式，最终修改的数据可能比count的多
            //    }
            //}
            //count,rowId信息存直接放在rowModel中当全局变量用。(对应rowModel中的_$count,_$rowId)

            var refers = {};//所有参照字段集合
            
            var quiet = rowModel._updateQuietly;
            var model3d = this._parent;
            var cols = model3d._data.columns;
            $.each(cols, function (field, col) {
                if (col.ctrlType === 'Refer') {
                    refers[field]=true;
                }
            });
            //获取数据行的引用
            var rowData = model3d._getRowById(data.rowId);
            var modify = data.update;
            //去掉辅助值
            delete modify['_$rowId'];
            delete modify['_$count'];

            var rowIdAttr = cb.model.Model3D._innerUsedAttrs.rowId;
            var rowIndex = model3d._data.rows.findIndex(function (row, i) {
                return row[rowIdAttr] === data.rowId;
            });
            if (rowIndex >= 0) {
                for (var p in modify) {
                    if (!refers[p]) {
                        model3d.set(rowIndex, p, null, modify[p], quiet);//这种处理方式不严谨，由于操作的异步性，修改的行的信息可能已经没有在当前显示的页内了。最好通过行数据标识定位行。
                        delete modify[p];
                    }
                }
                //处理参照字段
                var updatePriority=model3d._updatePriority;
                var refs=[];
                for (var p in modify) {
                    refs.push(p);
                }
                refs.sort(function(a,b){
                    return updatePriority.indexOf(a)-updatePriority.indexOf(b);
                });
                for(var i=0;i<refs.length;i++){
                    var p=refs[i];
                    model3d.set(rowIndex, p, null, modify[p], quiet);//这种处理方式不严谨，由于操作的异步性，修改的行的信息可能已经没有在当前显示的页内了。最好通过行数据标识定位行。
                }
               
            } else {
                for (var p in modify) {//数据行没有在显示的页内，则直接修改
                    !rowData[p] || typeof rowData[p] !== 'object' ? (rowData[p] = modify[p]) : (rowData[p].value = modify[p]);
                    throw ('修改的行不再显示页！')
                    //model3d.set(rowIndex, p, null, modify[p]);
                }
            }
            

            //rowModel.off('save') 
            //rowModel = null;//释放变量
            //刷新(判断数据行是否显示，如果显示就刷新)

            //this._parent._refreshDisplay();

        });

        //创建对应的视图
        //var viewId = cb.getNewId('rowModelView');
        //$('<div>').appendTo($('body')).attr('id', viewId);
        //cb.viewbinding.create(viewId, viewModel);
        ////只创建参照列对应的控件
        //var referCols = [];
        //$.each(this.getFields(), function (i, col) {
        //    if (col.ctrlType === 'Refer') {
        //        referCols.push(col);
        //    }
        //});

        return rowModel;
    },
    //根据行数据，获取完整的行模型数据（行状态，列字段属性，字段数据属性，字段值）
    _toAtomicData:function (data) {
        data = data || {}

        var hasData = false;
        var dataCopy = {};
        var atomicData = cb.meta.AtomicData;

        for (var attr in data) {
            var attrValue = data[attr];
            hasData = true;
            //cb.meta.AtomicData={_$id: "", ViewModelName: "", value: "", readOnly: false, disabled: false}
            if (atomicData.hasOwnProperty(attr))
                dataCopy[attr] = attrValue;//行属性
            else if (typeof attrValue != "object")
                dataCopy[attr] = { value: attrValue };//普通的字段值，对应一个SimpleModel
            else
                dataCopy[attr] = cb.clone(attrValue);
        }

        //在列属性的基础上添加行属性和列数据属性
        dataCopy=$.extend(true,cb.clone(this._data.columns),dataCopy);

        return dataCopy;
    },
    //给每个数据行添加标识
    _setIds: function (arr) {
        if (!arr) return;
        if (!arr.length) { arr = [arr]; }

        var rowIdAttr = cb.model.Model3D._innerUsedAttrs.rowId;
        $.each(arr, function (i, row) {
            row[rowIdAttr] = cb.getNewId('rowID');
        });
        return arr.length>1 ? arr : arr[0];
    },
    //根据行标识获取行
    _getRowById:function(id){
        var rows = this._data.rows;
        var row;
        var rowIdAttr = cb.model.Model3D._innerUsedAttrs.rowId;
        row=rows.find(function (row,i) {
            return row[rowIdAttr] == id;
        });
        if(row)return row;

        //从dataSource中找
        var ds=this._dataSource;
        row=rows.find(function (row,i) {
            return row[rowIdAttr] == id;
        });
        return row;
    },
    _isReferOrFormula:function(field){
        var col = this.getColumns(field)[0];

        
        var formula = this.getState('formulas');
        formula=formula?JSON.parse(this.getState('formulas')):[];
 
        if (col && (col.ctrlType === 'Refer' || formula.find(function (item) { return item.trigger === field }))) return true;

        return false;
    },
    _getDirtyDataForRowModel:function () {//this为rowModel
        var data = this.getData();//收集的数据中不包含空值，但空值本身也是数据
        var oldData = this._originalData;
        var dirtyData = {};
        var currentVal;

        for (var propertyName in oldData) {
            currentVal=data[propertyName];
            if (!cb.isEqual(oldData[propertyName], currentVal)) {
                dirtyData[propertyName] = currentVal;
            }
            delete data[propertyName];
        }
        //剩下的都是在旧数据中没有的数据，脏数据等价于有值
        for (var propertyName in data) {
            if (data[propertyName]!=null) {
                dirtyData[propertyName] = data[propertyName];
            }
        }
        return dirtyData;
    },
    //目前只进行非空项检查
    validate: function () {
        var result = {isValid: true, info: ''},
            rows = this.getData(),
            cols = this._data.columns,
            col, row;
        //校验函数，到时候可以独立出来
        var validators={
            required:function(row,field){
                var value=row[field];
                return value!=null&&value!=='';
            }
        };
        var messages = {
            required: '第{rowIndex}行，<{field}>不能为空;<br/>'
        };
        //记录约束信息
        var rules={
            required:[]
        };
        for (var field in cols) {
            col = cols[field];
            if (col.isVisible && col.isNullable === false) { 
                rules.required.push(field);
            }
        }

        var validator;
        var msg='<br/>';
        for (var i = 0, len = rows.length; i < len; i++) {
            row=rows[i];
            for (var rule in rules) {
                validator=validators[rule];
                var colsOfRul=rules[rule];
                for (var j = 0; j < colsOfRul.length; j++) {
                    var field = colsOfRul[j];
                    var title = cols[field]['title'] || field;//提示时显示列名称
                    if (!validator(row, field)) {
                        msg += messages['required'].replace('{rowIndex}', i).replace('{field}', title);
                        result.isValid = false;
                    }
                }
            }
            
        }
        result.info = msg;
        return result;
    },
    //设置数据源中数据的状态
    setDataState: function (state) {
        var states = [0, 1, 2, 3];
        if (states.indexOf(state) == -1) return false;

        var rowDataState = this._rowsDataState;
        for (var i = 0, len = rowDataState.length; i < len; i++) {
            rowDataState[i] = state;
        }
    },
    //计算字段更新时的优先顺序(参照携带参照时，应该先更新被携带的字段)
    _computeUpdatePriority: function () {
        
      
        var cols = this._data.columns;
        var refs = {},
            sorted = [],
            col, targetFlds, target, refRelation;

        //记录所以参照的依赖关系，参照字段名为key，依赖的参照字段的数组作为值；
        for (var field in cols) {
            col = cols[field];
            
            if (col.ctrlType === 'Refer') {
                refs[field] = [];
                if (col.refRelation) {
                    refRelation = col.refRelation;
                    targetFlds = refRelation ? refRelation.match(/\w+(?=\s*=\s*[\w\.]+)/g) : [];
                    //记录携带的参照列
                    for (var j = 0; j < targetFlds.length; j++) {
                        target = targetFlds[j];
                        if (cols[target] && typeof cols[target] && cols[target].ctrlType === 'Refer') {//参照列
                            refs[field].push(target);
                        }
                    }
                } 
            }
        }
        //不断的把没有依赖参照的参照字段放入队列中
        var maxLoop=100;//最多循环次数，循环次数过多，很可能参照之间出现相互依赖，出现死循环
        while (!$.isEmptyObject(refs) && --maxLoop) {
            for (var field in refs) {
                if (!refs[field].length) {
                    sorted.push(field);

                    delete refs[field];
                    //更新其它的字段，删除已处理的依赖参照
                    for (var f in refs) {
                        var index=refs[f].indexOf(field);
                        if (index >=0) {
                            refs[f].splice(index,1);
                        }
                    }
                }
            }
        }
        if(maxLoop){
            return sorted;
        }else{
            throw ('参照之间存在相互依赖!')
        }
    },
    //看行、单元格是否可编辑
    checkBeforeEditCell:function(rowIndex,field){
        var checks = [];
        var innerEditableCheck = cb.model.Model3D.checks.editable;
        var editableCheck = this._data.checks.editable;
        checks.push(innerEditableCheck, editableCheck);

        var result = true;
        //都判定可编辑时，才可编辑
        for (var i = 0, len = checks.length; i < len; i++) {
            if (checks[i]) {
                result = result && !(checks[i].call(this, rowIndex, field) === false);//check方法返回false说明不可编辑
            }
        }
        return result;
        
    },
    ////end editRowModel
	__end:''
});
//alias
cb.model.Model3D.prototype.isReadOnly = cb.model.Model3D.prototype.getReadOnly;
cb.model.Model3D.prototype.getRows = cb.model.Model3D.prototype.getCurrentPageRows;
cb.model.Model3D.prototype.getDirty = cb.model.Model3D.prototype.isDirty;
cb.model.Model3D.prototype.getPageSelectedIndexes = cb.model.Model3D.prototype.getPageSelectedIndexs;

//内置的排序方式
cb.model.Model3D.comparators={
	'Number':function(num1,num2){return num1-num2;},
	'String':function(strA,strB){return strA>strB?1:(strA<strB?-1:0);},
	'String.IgnoreCase':function(a,b){
		var strA=a.toLowerCase(),
			strB=b.toLowerCase();
		return strA>strB?1:(strA<strB?-1:0);
	}
};
cb.model.Model3D.comparators['Boolean']=cb.model.Model3D.comparators['Number'];
//内置常用命令
cb.model.Model3D.commands={
    add: {
        text: '添加',
        'className':'cs-grid-cmd-add',
        click: function (index) {
            this.insertRow(index+1);
        }
    },
    'delete': {
        text: '删除',
        'className': 'cs-grid-cmd-delete',
        click: function (index) {
            this.deleteRows(index);
        }
    },
    append:{
        text:'追加',
        click: function () {
            this.appendRow();
        }
    }
};
//内置的相关检查
cb.model.Model3D.checks={
    //判断对应的单元格是否可编辑
    editable: function (rowIndex, field) {
        if (!this.hasColumn(field)) return false;//模型中不存在的列（例如前面的复选列和命令列）不可编辑

        if(this.getReadOnly(rowIndex,field)||(field&&this._data.columns[field]&&this._data.columns[field].editable===false)){
            return false;
        }
        //checkbox列/命令列不能进入编辑态
        if (this._data.columns[field].ctrlType === 'CheckBox') return false;

        return true;
    }
};
//内部使用的属性
cb.model.Model3D._innerUsedAttrs = {
    isSelected: '_$isSelected',//标识行是否选中
    rowId: '_$id'
};
