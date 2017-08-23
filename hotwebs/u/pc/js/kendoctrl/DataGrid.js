/// <reference path="../../jquery/jquery-1.11.1.js" />
/// <reference path="Cube.js" />
/// <reference path="Cube.bindings.js" />
/// <reference path="Control.js" />
/// <reference path="../../kendoui/kendo.all.js" />
/// <reference path="../../kendoui/kendo.grid.js" />

cb.controls.widget('DataGrid', function (controltype) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id);
        //this._id = id;
        this.$Grid = this.getElement();
        
        this._initEvents();
        this._init(options);
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;

    control.prototype.setData = function (data) {
        this._init(data);
    };
    //初始化控件的结构
    control.prototype._init = function (opts) {
        if (!opts || typeof opts !== 'object' || opts.hasOwnProperty('propertyName')) return;
        opts = cb.clone(opts);
        //是否显示小计行
        this.showAggregates = !!opts.showAggregates;
        //适配editable
        opts.editable = opts.editable!=null?opts.editable:!opts.readOnly;//如果指定了editable属性就使用editable属性，否则根据readOnly判断。
        delete opts.readOnly;

        opts.resizable = opts.resizable == null ? true : !!opts.resizable;//默认true
        opts.filterable = opts.filterable == null ? {extra:false,multi:true,messages:{filter:'过滤',clear:'清空',checkAll:'全选'}} : !!opts.filterable;
        opts.sortable = opts.sortable == null ? true : !!opts.sortable;
        opts.scrollable = opts.scrollable == null ? true : !!opts.scrollable;
        opts.navigatable = opts.navigatable == null ? true : !!opts.navigatable;
        opts.visible = opts.visible == null ? true : !!opts.visible;
        //opts.selectable = opts.selectable == null ? true : "multiple, row";//支持多选

        opts.height = opts.height || '100%';

        opts.pageable = false;

        this._hasSelCol = !!opts.showCheckBox;

        var cols = opts.columns;
        if (!cols || $.isEmptyObject(cols)) {
            if (this.kendoGrid) {//隐藏
                this.$Grid.css('visibility','hidden');
            }
            return;//延迟实例化
            
        } 

        var colsAndModel = this._adaptCols(cols);
        var columns = colsAndModel.columns;
        var model = colsAndModel.model;
        var aggregates = colsAndModel.aggregates;
        colsAndModel = null;

        //处理命令列
        var that = this;
        if (opts.commands &&opts.commands.cmds&& opts.commands.cmds.length) {
            //name,text,click;预置几种操作（添加，删除，复杂，追加等）
            var cmds = opts.commands.cmds;
            var cmd;
            for (var i = 0, len = cmds.length; i < len; i++) {
                cmd = cmds[i];
                if (cb.model.Model3D.commands[cmd.name]) {//如果是内置的命令，这默认使用默认的配置
                    cmds[i]=cmd = $.extend({}, cb.model.Model3D.commands[cmd.name], cmd);
                }

                if (cmd['className']) {//如果定义了样式类，则添加cs-grid-cmd把默认样式清空
                    cmd['className'] += ' cs-kgrid-cmd';
                }

                cmd.click = function (cmdName) {
                    return function (e) {
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        var data = this.dataItem(tr);
                        var rowIndex = that._dataSource.data().indexOf(data);
                        that.execute('command', cmdName, rowIndex);
                        e.preventDefault();
                    };
                }(cmd.name);
                cmd.name = '__' + cmd.name;//避免和kendoGrid内置的命令重名
                cmd.text = cmd.text || cmd.name;
            }

            var pos = opts.commands.pos || 'tail';//尾部，header为首部
            delete opts.commands.pos;
            //columns = columns.slice(0, 5);
            opts.commands.hidden = opts.commands.isVisible === false;
            delete opts.commands.isVisible;

            opts.commands.command = opts.commands.cmds;
            
            typeof opts.commands.width!=='number'?opts.commands.width = 120:null;//命令列必需指定固定宽度，否则列较多时，不会显示列。
            delete opts.cmds;

            columns[pos == 'tail' ? 'push' : 'unshift'](opts.commands);
            delete opts.commands;
        }

        if (this._hasSelCol) {
            columns.unshift({
                'field': cb.controls['DataGrid'].SELCOLFIELD,
                //locked: true,
                lockable:false,
                'filterable': false,
                'sortable': false,
                'title': '',
                'headerAttributes':{ "class": "table-header-cell textAlignCenter",style:'padding-left:0;padding-right:0;width:30px;'},
                'attributes': { 'class': ' textAlignCenter', style: 'padding-left:0;padding-right:0;width:30px;' },
                'template': '<span class="cs-k-check" check-state="off" onselectstart="return false"></span>',
                'width': 30,
                'headerTemplate': '<span class="cs-k-check  cs-k-checkAll" check-state="off" onselectstart="return false"></span>'
            });
            model.fields[cb.controls['DataGrid'].SELCOLFIELD] = {
                editable: false
            };
        }

        //处理detailInit
        if (opts.detailInit && opts.detailInit.columns && opts.detailInit.query) {
            var detailOpts = opts.detailInit||{};
            delete opts.detailInit;
            var query = detailOpts.query;
            delete detailOpts.query;
            detailOpts.scrollable = false;
            opts.detailTemplate = '';
            opts.detailInit = function (e) {
                //e的属性
                //_defaultPrevented:
                //data:
                //detailCell:
                //isDefaultPrevented:
                //masterRow:
                //preventDefault:
                //sender:
                var data = e.data;
                

                //test用
                //var query = function (rowData, callback) {
                //    var ds = that.kendoGrid.dataSource.data();
                //    callback(ds);
                //};
                //detailOpts.columns = cb.util.convertToColumns(detailOpts.columns);
                
                query(data, function (ds) {
                    //var id = cb.getNewId('DataGrid');
                    detailOpts.rows = ds;
                    $(e.detailCell).html('');//清空之前的数据
                    var el = $("<div/>").appendTo(e.detailCell);
                    detailOpts.editable = false;//只读
                    var detailGrid = new cb.controls['DataGrid'](el, detailOpts);
                    //detailGrid.kendoGrid.setOptions('dataSource',ds);
                });
            };
            //由于详细行和固定列不能兼容，有详细行时，不支持固定列
            $.each(columns, function (i,col) {
                col.locked = false;
                col.lockable = false;
            });

        }

        
        
        var dataSource = {
            schema: {
                model: model
            }
        };
        if (this.showAggregates && aggregates && aggregates.length) { dataSource.aggregate = aggregates;}
        //提供了初始化数据
        if (opts.rows) {
            this._rows=opts.rows;
            delete opts.rows;
        }
        //this._rows存储dataSource中的数据行
        if (this._rows) {
            dataSource.data =this._rows;
        }

        this._dataSource = new kendo.data.DataSource(dataSource);
        $.extend(opts, {
            columns: columns,

            columnResizeHandleWidth: 6,

            dataSource: this._dataSource,

            change: function (e) {
                that.selectRow(e);
            },
            columnResize: function(e) {
                console.log(e.column.field, e.newWidth, e.oldWidth);
                if (e.column.field === cb.controls['DataGrid'].SELCOLFIELD) { return false; }
                that.execute('resizeColumn', {
                    field: e.column.field,
                    oldValue: e.oldWidth,
                    value: e.newWidth
                });
            },
            edit: function (e) {
                that.beforeEdit(e);
            },
            save: function (e) {
                //if (that._ignoreNextSave) {
                //    delete that._ignoreNextSave;
                //    return;
                //}
                var rowIndex = e.sender.dataSource.indexOf(e.model);
                //that.execute('rowChange', { rowIndex: rowIndex, rowData: e.values });
            }
        });
        var that = this;
        if (!this.kendoGrid) {
            this.$Grid.kendoGrid(opts);
            this.kendoGrid = this.$Grid.data('kendoGrid');

            this.kendoGrid.bind('beforeedit', function (e) {
                var field = e.column.field;
                if (field === cb.controls['DataGrid'].SELCOLFIELD) return;//点击选择列不触发事件
                var index = that.kendoGrid.dataSource.data().indexOf(e.model);

                var result = that.execute('beforeEditCell', {index:index,field:field});
                if (result === false) {
                    e._defaultPrevented = !0;//阻止默认行为（进入编辑态）
                }
            });
        } else {
            this.kendoGrid.setOptions(opts);
        }
        //有列时才可见
        this.$Grid.css('visibility', 'visible');
        //处理fontSize和autoWrap
        this.setAutoWrap(opts.autoWrap);
        if (opts.fontSize) {
            this.setAutoWrap(opts.fontSize);
        }
        
        if (opts.checks && typeof opts.checks.customEditor === 'function') {
            this._customEditor = opts.checks.customEditor;
        }
        this.setVisible(opts.visible);
    };
    control.prototype._initEvents = function () {
        var that = this;
        this.$Grid.on("dblclick", "tbody > tr[role=row]", null, function (e) {
            if ($(e.target).closest('.k-detail-row,.k-hierarchy-cell').length) return;//双击层级展开按钮/或详细行不触发双击。
            var index = that.kendoGrid.dataSource.indexOf(that.kendoGrid.dataItem(this));

            that.execute('dblclickrow', index);
        });
        this.$Grid.on("click", "tbody td[role=gridcell]", null, function (e) {
            var rowModel = that.kendoGrid.dataItem(this.parentNode);
            var index = that.kendoGrid.dataSource.indexOf(rowModel);
            var data = {};
            var cols = that.kendoGrid.getOptions().columns;
            var cellIndex = $(this).prevAll('td[role=gridcell]').length;

            data.index = index;
            data.field = cols[cellIndex].field;
            var col = cols[cellIndex];
            data.linkappid = col.linkappid;
            data.value = rowModel[col.field];
            data.linkpkvalue = col.linkpkname ? rowModel[col.linkpkname] : undefined;
            console.log('data:',data);
            that.execute('clickcell', data);
        });
        this.$Grid.on("click", ".cs-k-check", function (e) {
            var target = $(e.target);

            var checked = target.attr('check-state') === 'on';

            if (!target.is('.cs-k-checkAll')) {
                var tr = $(e.target).closest("tr");
                tr.toggleClass("k-state-selected");
                var grid = that.kendoGrid;
                var modelItem = grid.dataItem(tr);
                var index = grid.dataSource.indexOf(modelItem);

                target.attr('check-state', checked ? 'off' : 'on');

                //处理全选checkbox
                var rows = that.$Grid.find('.cs-k-check').not('.cs-k-checkAll').closest('tr');

                that.$Grid.find('.cs-k-checkAll').attr('check-state', rows.filter('.k-state-selected').length === rows.length ? 'on' : 'off');

                that.execute(checked ? 'unselect' : 'select', index);

            } else {//点击全选checkbox
                if (checked) {//全部不选
                    //target.attr('check-state', 'off');
                    that.$Grid.find('.cs-k-check').attr('check-state', 'off').not(e.target).closest('tr').removeClass('k-state-selected');
                    that.execute('unselectAll');
                } else {
                    //target.attr('check-state', 'on');
                    that.$Grid.find('.cs-k-check').attr('check-state', 'on').not(e.target).closest('tr').addClass('k-state-selected');
                    that.execute('selectAll');
                }
            }
        });

        //处理checkbox列的点击;(由于模型知道可编辑性信息，交给模型处理，由模型驱动视图刷新）
        this.$Grid.on("click", ".checkbox-cell", function (e) {
            var tr = $(e.target).closest("tr");
            var index = that.kendoGrid.dataSource.indexOf(that.kendoGrid.dataItem(tr));
            var data = {};
            var cols = that.kendoGrid.getOptions().columns;
            var cellIndex = $(this).closest('td[role=gridcell]').first().prevAll('td[role=gridcell]').length;

            data.index = index;
            data.field = cols[cellIndex].field;
            data.value = $(this).attr('check-state') === 'on' ? false : true;
            that.execute('editCheckboxCell',data);
        });
    };

    control.prototype.selectRow = function (e) {
        this.getElement().trigger('select', e);
    }
    //control.prototype.setRowSelected = function (rowIndex) {

    //}
    control.prototype.beforeEdit = function (e) {
        //编辑前事件
    }

    //control.prototype.setHeight = function (height) {
    //    ///<param name='height' type='String'></param>
    //    var type = Object.prototype.toString.call(height);
    //    if (type === "[object Number]")
    //        this._height = height;
    //    else if (type === "[object String]") {
    //        if (height.indexOf('px') > 0) {
    //            height = height.substring(0, height.length - 2);
    //        }
    //        this._height = parseInt(height);
    //    }
    //}
    control.prototype.setVisible = function (visible) {
        this.$Grid[!!visible ? 'show' : 'hide']();
    }
    control.prototype.setRefresh = function (refresh) {
        if (this.kendoGrid)
            this.kendoGrid.refresh();
    }
    //control.prototype.setSelCol = function (hasSelCol) {
    //    this._hasSelCol = hasSelCol;
    //}
    //control.prototype.setPageSize = function (pageSize) {
    //    this._pageSize = pageSize;
    //}
    //control.prototype.setPageable = function (pageable) {
    //    this._pageable = pageable;
    //}
    //control.prototype.setReadOnly = function (readOnly) {
    //    this._readOnly = readOnly;
    //}
    //control.prototype.changePage = function (args) {
    //    ///to be continued...
    //}
    //列信息适配为KendoGrid中列定义格式(把model中的Columns信息转换为KendoGrid中使用的model和columns信息)
    control.prototype._adaptCols = function (colDefs) {
        var that = this;
        var defaultEditors=cb.controls.DataGrid.defaultEditors;
        colDefs = cb.clone(colDefs);
        var cols = [];
        //model结构
        var model = {
            //id:'id',
            //fields:{}	
        };
        //支持的聚合
        var aggregatesSupported = { //值为对应的显示模板
            'sum': '合计：#:typeof sum!=="undefined" && sum!=null?sum:""#',
            'count': '数量：#:typeof count!=="undefined" && count!=null?count:""#',
            'min': '最小值：#:typeof min!=="undefined" && min!=null?min:""#',
            'max': '最大值：#:typeof max!=="undefined" && max!=null?max:""#',
            'average': '平均值：#:typeof average!=="undefined" && average!=null?average:""#'
        };
        var aggregates = [];//收集聚合信息
        var fieldDefs = {}, fieldDef;

        //控件类型和数值类型适配
        var ctrlValTypeMap = {
            'CheckBox': 'boolean',
            'TextBox': 'string',
            'DateTimeBox': 'date',
            'NumberBox': 'number',
            'ComboBox': 'string',
            'Refer': 'string'
        };
        //适配chenjinming提供的数据
        //dataType为int decimal使，实际dataType为number类型，ctrlType为CheckBox、	DateTimeBox的列的数据类型分别为boolean和date
        
        var dataTypeMap = {
            int: 'number',
            decimal: 'number',
            varchar: 'string',
            char: 'string',
            image: 'string',
            text:'string'
        };
        //格式化信息
        for (var field in colDefs) {

            var col = colDefs[field];
            //列样式控制默认设置放前面，避免重复的判断对象是否定义逻辑。
            //表头标题居中
            col.headerAttributes = {
                "class": "table-header-cell textAlignCenter",
                style: ''
            };
            col.attributes = { 'class': '', style: '' };

            //fieldDef的结构
            fieldDef = {
                name: field,
                type: col.dataType ||'string'//default string   (boolean number date string )
                //validation:{require:true,,max:	,min: },
                //nullable:false,
                //editable:false,
                //defaultValue:1,

            };
            fieldDef.type = dataTypeMap[fieldDef.type] || fieldDef.type;//如果为int或decimal则适配为number
            delete col.dataType;

            

            if (col.isNullable === false) {
                fieldDef['validation'] = fieldDef['validation'] || {};
                fieldDef['validation']['required'] = true;
                col.headerAttributes.class += ' required';
                delete col['isNullable'];
            }
            
            col['field'] = field;
            

            //隐藏属性
            col.hidden = col.isVisible === false;
            delete col.isVisible;

            col.width = col.width || col.iWidth || 120;//兼容早期生成的宽度设置
            
            //自定义模板
            var customTemplate = col.template;
            //默认显示复选列表
            if (col.filterable == null) {//优先使用用户指定的配置项
                col.filterable = { multi: true };
            } 
            //格式化
            switch (col.ctrlType || 'TextBox') {
                case 'TextBox':
                    //col.editor = $.proxy(defaultEditors['TextBox']);
                    break;
                case 'NumberBox':
                    //col.attributes.class = 'textAlignRight';
                    fieldDef['validation'] = fieldDef['validation'] || {};
                    if (col.min!=null) fieldDef['validation']['min'] = col.min;
                    if (col.max != null) fieldDef['validation']['max'] = col.max;
                    
                    var decimals = col.iScale;
                    if (typeof decimals==='number') {//小数位数
           
                        var format = '0000000000000000000000000000000000';
                        format = '0.' + format.slice(0, decimals);
                        col.template = "#=typeof "+field+"!=='undefined'&&"+field+"!=null? kendo.toString("+field+"-0,'"+format+"'):''#";
                
                    }
                    //col.aggregates = 'sum,min';
                    //col.editor = $.proxy(defaultEditors['NumberBox']);
                    //处理聚合信息
                    if (this.showAggregates && col.aggregates && (col.aggregates = col.aggregates.trim())) {
                        var spliter = '<br/>';//分割多个合计信息的字符串
                        var aggs = col.aggregates.split(/\s*,\s*/);
                        var footerTemplate = [];
                        $.each(aggs, function (i, item) {
                            if (aggregatesSupported[item]) {
                                aggregates.push({ field: col.field, aggregate: item });
                                footerTemplate.push(aggregatesSupported[item]);
                            }
                        });

                        if (footerTemplate.length) {//有时候可能出现一个逗号
                            col.footerTemplate = footerTemplate.join(spliter);
                        }   
                    }
                    
                    break;
                case 'Refer':
                    //col.editor = $.proxy(defaultEditors['Refer']);
                    /*
                    col.refkey = obj['refKey'];
                    col.refId = obj['refId'];
                    col.refName = obj['refName'];
                    col.refCode = obj['refCode'];
                    col.refShowMode = obj['refShowMode'];
                    col.refRelation = obj['refRelation'];
                    */
                    col.refShowMode = col.refShowMode || 'Name';
                    if (col.refShowMode == 'Name') {
                        col.template = "#if(typeof " + field + "_" + col.refName + "!=='undefined'){##=" + field + "_" + col.refName + "##}#"; //如果model中没有对应code字段，会出现变量未定义错误
                    } else if (col.refShowMode === 'Code') {
                        col.template = "#if(typeof " + field + "_" + col.refCode + "!=='undefined'){##=" + field + "_" + col.refCode + "##}#";

                    } else {
                        col.template = "#if(typeof " + field + "_" + col.refName + "!=='undefined'&&typeof " + field + "_" + col.refCode + "!=='undefined'){##=" + field + "_" + col.refCode + "#-#=" + field + "_" + col.refName + "##}#";
                    }

                    col.filterable.itemTemplate=function(colDef){
                        var refCode=field+'_'+(col.refCode||'code');
                        var refName=field+'_'+(col.refName||'name');
                        var refShowMode=colDef.refShowMode||'Name';
                        var exp=refShowMode==='Name'?'data["'+refName+'"]||""':refShowMode==='Code'?'data["'+refCode+'"]||""':('data["'+refCode+'"]&&data["'+refCode+'"]+"-"+data["'+refName+'"]||""');
                        return function(e) {
                            return '<div><input type="checkbox" name="' + e.field + '"  value="#= data[\'' + e.field + '\']#"/><label>#=data.all||(' + exp + ')#</label></div>';
                        };
                    }(col);
                    break;
                case 'CheckBox':
                    fieldDef.type = 'boolean';
                    //col.attributes.class = 'textAlignCenter'; //居中显示
                    //col.template = "<input disabled type='checkbox' #=(typeof " + field + "!=='undefined'&&" + field + "?'checked':'')# data-field='" + field + "'/>";
                    col.template = '<span class="checkbox-cell" check-state="#=typeof ' + field + '!=="undefined"&&' + field + '?"on":"off"#" onselectstart="return false"></span>';
                    col.filterable = col.filterable || {multi:true };
                    //col.editor = $.proxy(defaultEditors['CheckBox']);
                    break;
                case 'ComboBox':
                    if (col.dataSource) {
                        col.template = "#if(typeof " + field + "!=='undefined'){var _ds=" + JSON.stringify(col.dataSource).replace(/#/g,'\\\\#') + ";for(var i=0;i<_ds.length;i++){if(_ds[i]['value']==" + field + "){##=_ds[i]['text']##;break;}}}#";
                        //col.values = col.dataSource;
                        var textDs=[];
                        $.each(col.dataSource, function (i, pair) {
                            var item={};
                            item[field]=pair.text;
                            textDs.push(item);
                        });
                        col.filterable ={ multi: true, dataSource: textDs };
                        //delete col.dataSource;
                        //col.filterable.itemTemplate=function(e) {
                        //    return '<div><input type="checkbox" name="' + e.field + '"  value="#= data[\''+field+'\']#"/><label>#=data.all||data[\''+field+'\']#</label></div>';
                        //};
                    }

                    //col.editor = $.proxy(defaultEditors['ComboBox']);
                    
                    break;

                case 'DateTimeBox'://带时间
                    fieldDef.type='string';//服务器返回的日期数据为字符串格式

                    //col.attributes.class = 'textAlignCenter';
                    col.format = '{0: yyyy-MM-dd hh:mm}';
                    col.template = "#=typeof " + field + "!=='undefined'?kendo.toString(new Date(" + field + "),'yyyy-MM-dd  hh:mm'):''#";
                    //col.editor = $.proxy(defaultEditors['DateTimeBox']);
                    break;
                case 'DateBox':
                    fieldDef.type = 'string';//服务器返回的日期数据为字符串格式

                    //col.attributes.class = 'textAlignCenter';
                    col.format = '{0: yyyy-MM-dd}';
                    col.template = "#=typeof " + field + "!=='undefined'?kendo.toString(new Date(" + field + "),'yyyy-MM-dd'):''#";
                    //col.editor = $.proxy(defaultEditors['DateBox']);
                    break;
                case 'Password':
                    fieldDef.type = 'string';
                    col.template = '#=typeof '+field+'!=="undefined"&&'+field+'.length?"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022":""#';
                    //col.editor = $.proxy(defaultEditors['Password']);
                    col.filterable = false;
                    break;
                default:
                    break;
            }
            if (this.showAggregates) {
                col.footerTemplate = col.footerTemplate || '<span style="display:none;">无合计设置</span>';
            }
            //优先使用自定义模板
            col.template = customTemplate || col.template;
            //设置编辑器
            var customEdtior=that._customEditor;
            col.editor = function (container, options) {//提供在运行时选择编辑器类型能力
                var field = options.field;
                var rowIndex = that.kendoGrid.dataSource.data().indexOf(options.model);

                var editor, editorConfig;
                var customEditor = that._customEditor;

                if (typeof customEditor === 'function') {
                    editorConfig = customEditor.call(that,rowIndex, field);//返回的编辑器中包含ctrlType，和可选的控件配置信息
                }
                editorConfig=editorConfig||that._getColumn(field);
                //使用内置的编辑器
                cb.controls.DataGrid.defaultEditors[editorConfig['ctrlType'] || 'TextBox'].call(that, container, options, rowIndex, field, editorConfig);

            };
            //link列样式控制
            if (col.linkflag) {
                col.attributes.class = col.attributes.class + ' cs-kgrid-link';
                col.headerAttributes.class = col.headerAttributes.class + ' cs-kgrid-linkHeader';
            }

            //用户定义的配置项覆盖默认配置
            //对齐处理
            if (col.align) {
                col.attributes.class = this._handleTextAlign(col.attributes.class, col.align);
                col.align;
            }
            //editable控制是否可编辑（默认可编辑），readOnly控制是否可重新设置数据值
            //可编辑性控制在model中处理
            // fangqg: nodejs生成vm时统一为alwaysReadOnly，所以这里先做一下适配。
            //if (col.alwaysReadOnly === true || col.readOnly === true) {
            //    fieldDef.editable = false;
            //}
            fieldDefs[field] = fieldDef;
            cols.push(col);
        }
        model['fields'] = fieldDefs;
        //todo: model.id=?
        return { 'columns': cols, 'model': model, 'aggregates': aggregates };

    };

    control.prototype._getColumn = function (field) {
        var cols = this.kendoGrid.columns;
        var colDef = cols.find(function (col, colIndex, cols) {
            return col.field === field
        });
        return cb.clone(colDef);
    };
    control.prototype.setDataSource = function (data) {
        ///<param name='data' type='Array'>data is array</param>
        //var that = this;
        //data.forEach(function (data, dataIndex, datas) {
        //    this.kendoGrid.dataSource.insert(0, data);
        //    //this.kendoGrid.dataSource.add(data);
        //}, that);
        if (this.kendoGrid) {
            this.kendoGrid.dataSource.data(data);
            if (this._hasSelCol) {
                this.$Grid.find('.cs-k-checkAll').attr('check-state', 'off');
            }
        } else {//如果还没实例化kendoGrid，则暂存
            this._rows = data;
        }
        
        //this.execute('dataSourceSeted', datas);
    }
    control.prototype.setEditable = function (editable) {
        this.kendoGrid.setOptions({ editable: !!editable });
    };
    control.prototype.getSelectedRows = function () {
        var indexs = [];
        var rows = this._getRows();
        rows.each(function (i, tr) {
            if ($(tr).is('.k-state-selected')) {
                indexs.push(i);
            }
        });
        return indexs;
    };
    //控件的选择行控制
    control.prototype.select = function (indexs) {
        if (!indexs || !indexs.length) return;

        var that = this;
        indexs = indexs || [];
        indexs.sort(function (a, b) { return a - b; });
        var rows = this._getRows();
        var preIndex = -1;
        var count = 0;
        $.each(indexs, function (i, rowIndex) {
            if (indexs[i] > preIndex) {//去重
                preIndex = indexs[i];
                rows.eq(rowIndex).addClass('k-state-selected');
                if (that._hasSelCol) {
                    $('.cs-k-check', rows[rowIndex]).attr('check-state', 'on');
                }
            }
        });

        //判断是否全部选中
        if (that._hasSelCol) {
            var allChecked = rows.filter('.k-state-selected').length === rows.length;
            this.$Grid.find('.cs-k-checkAll').attr('check-state', allChecked ? 'on' : 'off');
        }

    };
    control.prototype.unselect = function (indexs) {
        if (!indexs || !indexs.length) return;

        var that = this;
        indexs = indexs || [];
        indexs.sort(function (a, b) { return a - b; });
        var rows = this._getRows();
        var preIndex = -1;

        $.each(indexs, function (i, rowIndex) {
            if (indexs[i] > preIndex) {//去重
                preIndex = indexs[i];
                rows.eq(rowIndex).removeClass('k-state-selected');
                if (that._hasSelCol) {
                    $('.cs-k-check', rows[rowIndex]).attr('check-state', 'off');
                }
            }
        });
        if (that._hasSelCol) {
            this.$Grid.find('.cs-k-checkAll').attr('check-state', 'off');
        }
    };
    control.prototype.selectAll = function () {
        var rows = this._getRows();
        var indexs = [];
        $.each(rows, function (i) {
            indexs.each(i);
        });

        this.select(indexs);

    };
    control.prototype.unselectAll = function () {
        var rows = this._getRows();
        var indexs = [];
        $.each(rows, function (i) {
            indexs.each(i);
        });

        this.unselect(indexs);

    };
    //todo:固定列时会出问题
    control.prototype._getRows = function () {
        var showDetail=typeof this.kendoGrid.getOptions().detailInit === 'function';
        var selector = showDetail ? 'tr[role=row].k-master-row' : 'tr[role=row]';
        var rows = this.$Grid.find(selector);
        //去掉表头行
        return rows.slice(showDetail?0:1);
    };

    control.prototype.updateCell = function (rowIndex, field, value, rowData) {
        var model = this.kendoGrid.dataSource.data()[rowIndex];
        var cellIndex = this.kendoGrid.getOptions().columns.findIndex(function (item, i) { return item.field == field });
        if (cellIndex == -1) {
            model._set(field, value);//只改变值，不触发事件
            return;
        }
        var cell = this.$Grid.find('[role=row][data-uid="' + model.uid+'"]>[role=gridcell]').eq(cellIndex),
            column = this._getColumn(field);
        model._set(field, value);//只改变值，不触发事件
        
        this.kendoGrid._displayCell(cell, column, model);
        //model.set(field, value, rowIndex);
    };
    control.prototype.updateRow = function (rowIndex, rowData) {

    };
    control.prototype._setColVisible = function (field, visible) {
        if (field !== '$commands') {
            this.kendoGrid[!!visible ? 'showColumn' : 'hideColumn'](field);
        } else {
            
            var cols = this.kendoGrid.getOptions()['columns'];
            var index=cols.findIndex(function (col, i) {
                return col.command && typeof col.command === 'object';
            });
            this.kendoGrid[!!visible ? 'showColumn' : 'hideColumn'](index);
        }
        
    };
    control.prototype.showColumn = function (field) {
        this._setColVisible(field,true);
    };
    control.prototype.hideColumn = function (field) {
        this._setColVisible(field, false);
    };

    control.prototype.setAutoWrap = function (autoWrap) {   
        if (!!autoWrap) {
            this.$Grid.removeClass('cs-kgrid-noWrap').addClass('cs-kgrid-autoWrap');
        } else {
            this.$Grid.removeClass('cs-kgrid-autoWrap').addClass('cs-kgrid-noWrap');
        }
    };
    control.prototype.setFontSize = function (fontSize) {
        this.$Grid.css('font-size', typeof fontSize!=='number'?fontSize:fontSize+'px');
    };
    control.prototype.setTextAlign = function (field,value) {
        
        var col = this._getColumn(field);
        col['attributes'] = col['attributes'] || {};
        col['attributes'].class = col['attributes'].class || '';
        col['attributes'].class = this._handleTextAlign(col['attributes'].class,value);

        this._setColumnState(field, 'attributes', col['attributes']);
    };
    var alignClsMap = {
        'left': 'textAlignLeft',
        'right': 'textAlignRight',
        'center': 'textAlignCenter'
    };
    control.prototype._handleTextAlign = function (original, textAlign) {//textAlign="0"/"1"/"2"
        var options = ['left', 'right', 'center'];
        var map = {
            '0': 'left',
            '1': 'center',
            '2':'right'
        };
        
        textAlign = (map[textAlign]||'').toLowerCase();
        if (options.indexOf(textAlign) === -1) throw('invalid textAlign');

        var str;
        str = original.replace(/(?:^|\s+)textAlign(Left|Right|Center)(?:\s+|$)/g, ' ');
        str += ' ' + alignClsMap[textAlign];
        return str;
    };
    control.prototype._setColumnState = function (field,prop,value) {
        var index = this._getColumnIndex(field);
        var cols = this.kendoGrid.getOptions().columns;
        var col=cols[index];
        //修改
        col[prop] = value;
        this.kendoGrid.setOptions({ columns: cols });
    };
    control.prototype._getColumnIndex = function (field) {
        var cols = this.kendoGrid.getOptions().columns;
        var index = cols.findIndex(function (col, i) {
            return col.field === field;
        });

        return index;//返回引用而不是副本
    };
    control.prototype._getColumn = function (field) {
        var index = this._getColumnIndex(field);
        var cols = this.kendoGrid.getOptions().columns;
        var col = cols[index];
        return cb.clone(col);
    };
    control.prototype._handlerValidators = function (field, $input, container, useTempField) {//useTempField说明是否使用临时field名作为name的值
        var colDef=this._getColumn(field);
        var fieldDef=this.kendoGrid.getOptions().dataSource.schema.model.fields[field];
        var validation=fieldDef.validation;
        //必填项
        var name = !useTempField ? field : this._tempFieldName;
        if(validation&&validation.required){
            $input.attr('required', '');
            //$input.attr('data-required-msg', (colDef.title || colDef.field) + '不能为空');
            $input.attr('data-required-msg', '不能为空');
            $input.attr("name", name);//随便用个无意义的字段名

            $('<span class="k-invalid-msg" data-for="' + name + '"></span>').appendTo(container);
            container.kendoValidator();
        }
    };
    control.prototype.setColWidth = function (field,value) {
        if (value === this.getColWidth(field)) return;
        this._setColumnState(field,'width',value);
    };
    control.prototype.getColWidth = function (field) {
        var col = this._getColumn(field);
        return col.width||'auto';
    };
    control.prototype._tempFieldName = '__tempField';
    control.SELCOLFIELD = '__selcol';
    control.defaultEditors = {//编辑器内方法的this为DataGrid控件实例
        'TextBox': function (container, options, rowIndex, field, editorOpts) {//
            var that=this;
            var $input = $('<input type="text" style="height:2.2em;padding-top:0;padding-bottom:0;"/>');
            $input.appendTo(container);
            //var field = options.field;
            //$input.attr("name", field);
            //editorOpts = editorOpts || that._getColumn(field);

            var ctrl = new cb.controls['TextBox']($input, editorOpts);
            ctrl.setValue(options.model[field]);

            ctrl.on('change', function (args) {

                var values = {};
                values[field] = this.getValue();

                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });
            that._handlerValidators(field, $input, container);
        },
        'NumberBox': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            //var field = options.field;

            var $input = $('<input type="text" />');
            $input.appendTo(container);

            var ctrl = new cb.controls['NumberBox']($input, editorOpts);
            ctrl.setValue(options.model[field]);
 
            ctrl.on('change', function (args) {

                var values = {};
                values[field] = this.getValue();

                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            }); 
            that._handlerValidators(field, $input, container);
        },
        'CheckBox': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            var $input = $('<input type="checkbox"/>');
            $input.appendTo(container);
            var field = options.field;
            //$input.attr("name", field);

            //var ctrl = new cb.controls['Radio']($input, options);
            //ctrl.setValue(options.model[field]);
            //$input.val(options.model[field]);
            $input[0].checked = options.model[field];
            $input.on('change', function (args) {

                var values = {};
                //values[field] = this.getValue();
                values[field] = this.checked;
                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });

        },
        'ComboBox': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            var $input = $('<input type="text" data-controltype="ComboBox"/>');
            $input.appendTo(container);

            delete editorOpts.template;
                        
            var ctrl = new cb.controls['ComboBox']($input, editorOpts);
            ctrl.setValue(options.model[field]);

                        
            ctrl.on('change', function (args) {

                var values = {};
                values[field] = this.getValue();

                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });
            that._handlerValidators(field, $input, container);
        },
        'Refer': function (container, options, rowIndex, field, editorOpts) {
            var afterRefer = editorOpts.afterRefer;
            var that = this;
            //var id = Math.random().toString().replace('.', '_');
            //$("<DIV id = '" + id + "' class='Refer editor-refer' style='position:relative;padding-right:32px;'><input "//data-bind='value:"
            //    //+ options.field + "'" //+ "name='" + options.field
            //    + "' type='text' style='display:block;width:100%;height:100%;padding:0;margin:0;border:0 none;'/><div><img src='pc/images/Ref-close.png'/><img  src='pc/images/Ref.png'/></div></div>")
            //.appendTo(container);

            var $div=$("<div class='editor-refer' data-controltype='Refer' style='position:relative;padding-top:4px;padding-bottom:4px;'>"
                + "<input  type='text' style='display:block;width:100%;height:1.8em;padding:0;margin:0;border:0 none;'/><div><img src='pc/images/Ref-close.png'/><img  src='pc/images/Ref.png'/></div></div>")
            .appendTo(container);
        
            var $input = $('input', $div);

            var refShowMode = editorOpts.refShowMode || 'Name',
			    refCode = editorOpts.refCode,
			    refName = editorOpts.refName,
			    refKey = editorOpts.refKey,
			    refRelation = editorOpts.refRelation || '';

            var _ref = new cb.controls['Refer']($div, editorOpts);
            //var _ref = cb.controls.create('Refer', id, editorOpts);
            //_ref.setData(editorOpts);
            //初始化
            //var field = options.field;

            //当input指定name属性时，实例化editor后，kendo会把input的值设置为model中name指定的字段的值，所以先要更新这个值
            options.model[this._tempFieldName] = _ref.transferData2Text(options.model[field + '_' + refCode], options.model[field + '_' + refName]);
            if (options.model[field]) {
                _ref.setValue({ value: options.model[field], code: options.model[field + '_' + refCode], name: options.model[field + '_' + refName] });
            }
            _ref.on('beforeRefer', function () {
                that.execute('beforeRefer', { rowIndex: rowIndex, field: field });
            });
            _ref.on('change', function (args) {
                var datas = args;
                //提供处理其它相关数据的机会
                if (typeof afterRefer === 'function') {
                    afterRefer.call(this, datas);
                }
                that.execute('afterRefer', { rowIndex: rowIndex, field: field, data: datas });
                //暂时只处理一条数据
                if (!datas) {
                    datas = [{}];
                }
                var rowModel = options.model;
                //var field = options.field;
                //data = data || {};//清空时，data为空
                
                //var text = _ref.transferData2Text(refCodeValue, refNameValue);
                //rowModel[field]
                //rowModel[field] = data[colDef['ref' + colDef['refShowMode']]];
                //var rowIndex = grid.data('kendoGrid').dataSource.indexOf(options.model);
                //var dataItem = grid.data('kendoGrid').dataSource.at(rowIndex);
                //dataItem.set(options.field, options.model[options.field]);
                //var refInput = $(container).find("input");
                //if (refInput.length > 0) {
                //    $(refInput[0]).val(text);
                //}
                var valuesArr = [];
                $.each(datas, function (i, data) {
                    var refValue = data['key'],
				        refCodeValue = data['code'],
				        refNameValue = data['name'];
                    var values = {};
                    values[field + '_' + refName] = refNameValue;
                    values[field + '_' + refCode] = refCodeValue;

                    if (i == 0) {//界面用第一条数据更新，其它的添加
                        rowModel[field + '_' + refName] = refNameValue;
                        rowModel[field + '_' + refCode] = refCodeValue;
                    }

                    if (data['key']) {
                        var targets=data.targets||{};
                        for (var targetFld in targets) {
                            values[targetFld] = targets[targetFld];
                        }
                    }
                    values[field] = data['key'];

                    valuesArr.push(values);
                })
               
                //rowModel[field] = refValue;
                //更新关联信息

                //值为空时不处理携带，即不清空之前的携带信息。
                
                //values[options.field] = options.model[options.field];
                //grid.data('kendoGrid').saveChanges();

                //grid.data('kendoGrid').trigger('save', {
                //    values: values,
                //    container: container,
                //    model: options.model
                //});
                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: valuesArr });

            });
            
            that._handlerValidators(field, $input, container,true);
        },
        'DateBox': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            var $input= $('<input type="text"/>');
            //var fieldView = inputs.eq(0);
            //var ui = inputs.eq(1);
            //fieldView.attr("name", options.field);
            $input.appendTo(container);

            //var field = options.field;
            //var editorOpts = that._getColumn(field);
            var ctrl = new cb.controls['DateBox']($input, editorOpts);
            ctrl.setValue(new Date(options.model[field]));//直接用字符串有问题。

            ctrl.on('change', function (args) {

                var values = {};
                values[field] = this.getValue();
                //that.$Grid.data('kendoGrid').saveChanges();
                //that.$Grid.data('kendoGrid').trigger('save', {
                //    values: values,
                //    container: container,
                //    model: options.model
                //});
                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });
            that._handlerValidators(field, $input, container);
        },
        'DateTimeBox': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            var $input = $('<input type="text"/>');
            //var fieldView = inputs.eq(0);
            //var ui = inputs.eq(1);
            //fieldView.attr("name", options.field);
            $input.appendTo(container);

            //var field = options.field;
            //var editorOpts = that._getColumn(field);
            var ctrl = new cb.controls['DateTimeBox']($input, editorOpts);
            ctrl.setValue(options.model[field]);
                        
            ctrl.on('change', function (args) {
                            
                var values = {};
                values[field] = this.getValue();
                //that.$Grid.data('kendoGrid').saveChanges();
                //that.$Grid.data('kendoGrid').trigger('save', {
                //    values: values,
                //    container: container,
                //    model: options.model
                //});
                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });
            that._handlerValidators(field, $input, container);
        },
        'Password': function (container, options, rowIndex, field, editorOpts) {
            var that = this;
            var $input = $('<input type="password" class="k-textbox"/>');
            //input.attr("name", options.field);
            //var field = options.field;
            $input.val(options.model[field])
            $input.appendTo(container);
            $input.on('change', function (args) {

                var values = {};
                values[field] = this.value;
                //that.$Grid.data('kendoGrid').saveChanges();
                //that.$Grid.data('kendoGrid').trigger('save', {
                //    values: values,
                //    container: container,
                //    model: options.model
                //});
                //var rowIndex = that.$Grid.data('kendoGrid').dataSource.indexOf(options.model);
                that.execute('rowChange', { rowIndex: rowIndex, rowData: values });
            });
            that._handlerValidators(field, $input, container);
        }
    };
    return control;
});
