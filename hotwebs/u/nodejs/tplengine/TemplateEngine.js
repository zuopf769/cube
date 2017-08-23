var fs = require("fs");
var xmlreader = require("xmlreader");
var path = require("path");
var mkdirp = require("mkdirp");
var serverhandle = require("./ServerConnect.js");

var template = function (content, callback) {
    if (typeof content == 'string') {
        var basedata = {
            ctrltpl: content + "/template/kendoctrl/",
            pagetpl: content + "/template/newfile/view/",
            vmtpl: content + "/template/newfile/model/"
        };
        template.cache({ key: "_workpath", value: content });
        template.Init(basedata);
        return;
    }
    return template[typeof content === 'object' ? 'render' : 'compile'].apply(template, arguments);
};

(function (exports) {
    exports.openTag = '<%';     // 设置逻辑语法开始标签
    exports.closeTag = '%>';    // 设置逻辑语法结束标签
    exports.isEscape = true;    // HTML字符编码输出开关
    exports.isCompress = false; // 剔除渲染后HTML多余的空白和换行
    exports.isDebug = true;
    //全局缓存
    var _dict = new Object();  //存储模板以及相关缓存信息
    var _basedata;
    var _rootPath;
    exports.tplcount = 0;
    exports.loadtplcount = 0;

    /*********************************    模板引擎初始化部分 Start         *****************************/
    /*初始化缓存数据（主要用于缓存模板信息）
    */
    exports.cache = function (val) {
        if (val && typeof val == 'object') {
            _dict[val.key] = val;
        }
    };
    /*
    *函数名：Init  引擎初始化（主要用于加载模板到缓存中）
    *@param  相关引擎模板存储路径
    *@return 全局模板缓存
    */
    exports.Init = function (base) {
        //输出日志
        exports.message({
            type: 'log',
            source: "exports.Init",
            message: "初始化：开始加载模板文件......"
        });
        exports.tplcount = 0;
        exports.loadtplcount = 0;
        _dict ? _dict : new Object();
        for (var attr in base) {
            var attrValue = base[attr];
            _dict[attr] = new Object();
            _readdir(attrValue);
        }
    };
    /*********************************    模板引擎初始化部分 End          *****************************/

    /*********************************    引擎生成文件部分 Start       *******************************/
    exports.render = function (content, callback) {

        _basedata = content;
        _rootPath = content.rootPath;
        //用于判断模板是否加载完成  
        if (exports.loadtplcount != exports.tplcount || exports.tplcount == 0) {
            exports.message({
                type: 'log',
                source: "exports.loadtplcount",
                message: "初始化：努力加载模板中......"
            });
            setTimeout(exports.render, 100, content, callback);
            return;
        }
        if (_basedata) {
            var viewmodel = path.join(_rootPath, _basedata.metaDataVMPath);
            var view = path.join(_rootPath, _basedata.metaDataViewPath);

            //生成JS文件回调函数
            var vmcallback = function (resdata, options) {
                var fileContain = {};
                var data;

                var tplName = resdata.applications.application.viewmodel.attributes().tplName;

                var vmtplData = _dict && _dict[tplName];
                if (!vmtplData) {
                    var message = tplName + "文件不存在!";
                    exports.message({
                        message: message,
                        source: "exports.render",
                        type: "error"
                    });
                    if (callback) {
                        callback.call(this, { "error": message });
                    }
                    return;
                }

                var vmdata = vmtplData.value;
                var vmextendata = _dict && _dict[tplName.split('.')[0] + "_ex.js.tpl"].value;
                //
                var formatparams = { vmxml: resdata };
                if (options && options.hasOwnProperty('colums'))
                    formatparams.colums = options.colums;

                resdata = _dataFormat(formatparams);

                var vmFunc = exports.compile(vmdata);
                fileContain.viewModel = { path: path.join(_rootPath, _basedata.outputVMPath), value: vmFunc(resdata) };
                var vmextendFunc = exports.compile(vmextendata);
                fileContain.viewModelExtend = { path: path.join(_rootPath, _basedata.outputVMExtendPath), value: vmextendFunc(resdata) };
                for (var attr in fileContain) {
                    var attrValue = fileContain[attr];
                    if (attrValue.path.indexOf('_Extend.js') > 0) {
                        fs.exists(attrValue.path, function (exists) {
                            if (exists) {
                                exports.message({
                                    type: 'log',
                                    source: "fs.exists",
                                    message: path.basename(attrValue.path) + "文件存在，已跳过生成",
                                    pathname: attrValue.path
                                });
                            }
                            else
                                _writeFile(attrValue.path, attrValue.value);
                        });
                    }
                    else
                        _writeFile(attrValue.path, attrValue.value);
                }
            };
            //生成html回调函数
            var htmlcallback = function (resdata) {
                if (resdata.error) {
                    if (callback)
                        callback.call(this, resdata);
                    return;
                }

                var params = {
                    token: content.token,
                    moduleName: resdata.application.attributes().moduleName,
                    appName: resdata.application.attributes().name,
                    viewModelName: resdata.application.view.attributes().viewModelId
                };

                var viewtplname = resdata.application.view.attributes().tplName;
                var size = resdata.application.view.attributes().screenSize;
                var viewtplData = _dict && _dict[viewtplname];
                if (!viewtplData) {
                    var message = viewtplname + "文件不存在";
                    exports.message({
                        message: message,
                        source: "exports.render",
                        type: "error"
                    });
                    if (callback) {
                        callback.call(this, { "error": message });
                    }
                    return;
                }
                var htmlFunc = exports.compile(viewtplData.value);

                var filepath = path.join(_rootPath, _basedata.outputViewPath);

                //callback 获取权限字段服务回调方法
                var servercallback = function (serverdata, stackTrace) {
                    var viewData;
                    exports.cache({ key: "entityPerm", value: exports.fieldPermHandle() });
                    // 501: token异常 550: 一般异常 520: 业务异常
                    if (serverdata.code == 501 || serverdata.code == 550 || serverdata.code == 520 || serverdata.error != null) {
                        viewData = _dataFormat({ resdata: resdata, filterdata: exports.fieldPermHandle() }, "view");

                        exports.message({
                            type: "error",
                            message: "字段权限服务获取数据失败,已跳过权限生成",
                            err: serverdata.error
                        });
                    }
                    else {
                        if (serverdata) {
                            if (serverdata.error != null || serverdata.data.fail != null) {
                                exports.message({
                                    type: 'error',
                                    source: "serverhandle.getServerData",
                                    message: "获取权限数据失败,已跳过权限生成！"
                                });
                            }
                        }

                        var entityPerm = serverdata.data.success.entityPerm;
                        var defaultControlMode = serverdata.data.success.defaultControlMode;

                        var filterdata = exports.fieldPermHandle();
                        if (entityPerm) {
                            filterdata = exports.fieldPermHandle(defaultControlMode, entityPerm);
                        }
                        else
                            exports.message({
                                type: 'log',
                                source: "serverhandle.getServerData",
                                message: "未设置相关字段权限！"
                            });
                        //缓存字段权限数据
                        exports.cache({ key: "entityPerm", value: filterdata });
                        viewData = _dataFormat({ resdata: resdata, filterdata: filterdata }, "view");
                    }

                    if (viewData.view.isneedLoadColums) {
                        var columsCallback = function (columsData, stackTrace) {
                            var Columns = null;
                            // 501: token异常 550: 一般异常 520: 业务异常
                            if (columsData.code == 501 || columsData.code == 550 || columsData.code == 520 || columsData.error != null) {
                                exports.message({
                                    type: "error",
                                    message: "获取栏目数据失败,已跳过栏目加载",
                                    err: columsData.error
                                });
                                Columns = null;
                                if (callback)
                                    callback.call(this, { "error": "获取栏目数据失败: " + columsData.error, "stackTrace": stackTrace });
                                return;
                            }
                            if (columsData) {
                                if (columsData.error != null || columsData.data.fail != null) {
                                    exports.message({
                                        type: 'error',
                                        source: "serverhandle.GetColums",
                                        message: "获取栏目数据失败，已跳过栏目生成！"
                                    });
                                    if (callback)
                                        callback.call(this, { "error": "获取栏目数据失败: " + columsData.data.fail, "stackTrace": stackTrace });
                                    return;
                                }
                            }
                            Columns = columsData.hasOwnProperty('data') && columsData.data != null && columsData.data.hasOwnProperty('success') && (columsData.data.success.length ? columsData.data.success : null);
                            Columns = Columns ? Columns : null;

                            if (!Columns) {
                                if (callback)
                                    callback.call(this, { "error": "获取栏目数据失败", "stackTrace": stackTrace });
                                return;
                            }

                            var viewDataJson = _object2Json({ xmldata: resdata, Columns: { ColumnInfo: viewData.view.isneedLoadColums, array: Columns } });
                            viewDataJson.view.linkbuilder = viewData.view.linkbuilder;
                            viewDataJson.view.scriptbuilder = viewData.view.scriptbuilder;

                            //创建JS
                            _readFile(viewmodel, true, vmcallback, { colums: { ColumnInfo: viewData.view.isneedLoadColums, array: Columns } });

                            var app = { application: viewDataJson };
                            //通过渲染函数渲染html
                            var html = htmlFunc(app, callback);
                            if (!html) return;
                            html = html.replace(/\n[\s| | ]*\r/g, '\n');
                            exports.cache({ key: "viewDataCache", value: app.application.viewDataCache });
                            //页面静态化保存
                            _writeFile(filepath, html, callback);//--通知服务 解析引擎已处理完成
                        };
                        var columnsParam = { token: content.token, value: new Array() };
                        for (var index = 0; index < viewData.view.isneedLoadColums.length; index++)
                            columnsParam.value.push(viewData.view.isneedLoadColums[index].listId);
                        serverhandle.getBatchColums(columnsParam, columsCallback);
                        return;
                    }
                    else {
                        var viewDataJson = _object2Json({ xmldata: resdata, Columns: null });
                        viewDataJson.view.linkbuilder = viewData.view.linkbuilder;
                        viewDataJson.view.scriptbuilder = viewData.view.scriptbuilder;

                        _readFile(viewmodel, true, vmcallback);

                        var app = { application: viewDataJson };
                        //通过渲染函数渲染html
                        var html = htmlFunc(app, callback);
                        if (!html) return;
                        html = html.replace(/\n[\s| | ]*\r/g, '\n');
                        exports.cache({ key: "viewDataCache", value: app.application.viewDataCache });
                        //服务回调  页面静态化保存
                        _writeFile(filepath, html, callback);//写文件  并通知web服务生成成功
                    }
                };
                //获取字段权限  按权限生成相关页面
                serverhandle.getServerData(params, servercallback);
            };
            //创建html
            _readFile(view, true, htmlcallback);
        }
    };

    /*
    *函数名：_dataFormat  格式化数据
    *@param resdata 要格式话的数据（原始数据格式参照XML）
    *@param datatype 目的数据类型（view为HTML所需数据，默认为js所需数据）
    *@return 返回格式化后复合模板的数据
    */
    var _dataFormat = function (resdata, datatype) {
        var viewModel = new Object();
        //HTML页面复合数据

        this.viewdataFormat = function (containdata) {
            var resdata = containdata.resdata;
            var controlList = new Object();  //用于记录view中的control信息   用于ViewModel生成所用

            viewModel.linkbuilder = "";
            viewModel.scriptbuilder = "";
            var fieldfilter = containdata.filterdata;

            var controlFormat = function (arr) {
                var linkbuilder={};
                var scriptbuilder={};
                var listidArr = new Array();
                if (arr && arr.length > 0) {
                    for (var i = 0; i <= arr.length - 1; i++) {
                        var controlStr = "|" + arr[i].attributes().entity + ":" + arr[i].attributes().field + "|";

                        //字段权限：若defaultControlMode为0（默认无权） 过滤不在可读写 和 只读中的字段信息 
                        if (fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(controlStr) < 0 || fieldfilter.readWrite.indexOf(controlStr) < 0))
                            continue;
                        //字段权限：若defaultControlMode为1（默认有权） 过滤 不可见的字段信息
                        if (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf(controlStr) >= 0)
                            continue;

                        if (arr[i].hasOwnProperty('column')) {
                            var arraycol = new Array();
                            for (var k = 0; k < arr[i].column.array.length; k++) {
                                arraycol.push(arr[i].column.array[k].attributes());
                            }
                            arr[i].attributes().columns = arraycol;
                        }
                        if (!controlList[arr[i].attributes().field])
                            controlList[arr[i].attributes().field] = exports.clone(arr[i].attributes());
                        else {
                            for (var attr in arr[i].attributes()) {
                                var attrValue = arr[i].attributes()[attr];
                                controlList[arr[i].attributes().field][attr] = attrValue;
                            }
                        }

                        var controlObj = _controlHandle(viewModel.screensize + "_" + arr[i].attributes().ctrlType);
                        if (!controlObj) continue;
                        /*for (var j = 0; j < controlObj.linkbuilder.length; j++) {
                            viewModel.linkbuilder += _checkrepeat(viewModel, controlObj.linkbuilder[j], 'css') ? "" : controlObj.linkbuilder[j] + "\r\n";
                        }
                        for (var j = 0; j < controlObj.scriptbuilder.length; j++) {
                            viewModel.scriptbuilder += _checkrepeat(viewModel, controlObj.scriptbuilder[j], "js") ? "" : controlObj.scriptbuilder[j] + "\r\n";
                        }*/

                        // fangqg: 修改去重逻辑
                        for (var j = 0; j < controlObj.linkbuilder.length; j++) {
                            _checkrepeat1(controlObj.linkbuilder[j], "css", linkbuilder);
                        }
                        for (var j = 0; j < controlObj.scriptbuilder.length; j++) {
                            _checkrepeat1(controlObj.scriptbuilder[j], "js", scriptbuilder);
                        }

                        if (arr[i].attributes().hasOwnProperty('listId') && arr[i].attributes().listId != '') {
                            listidArr.push({ listId: arr[i].attributes().listId, field: arr[i].attributes().field, entity: arr[i].attributes().entity });
                        }
                    }

                    // fangqg: 修改去重逻辑
                    for (var attr in linkbuilder) {
                        viewModel.linkbuilder += linkbuilder[attr] + "\r\n";
                    }
                    for (var attr in scriptbuilder) {
                        viewModel.scriptbuilder += scriptbuilder[attr] + "\r\n";
                    }

                    //批量返回加载栏目信息（服务完成后，放开注释）
                    viewModel.isneedLoadColums = listidArr.length ? listidArr : null;
                }
            };
            var controlArr = new Array();
            for (var attr in resdata.application.view.attributes()) {
                viewModel[attr.toLowerCase()] = resdata.application.view.attributes()[attr];
            }
            resdata.application.view.container.each(function (index, val) {
                var getControlItem = function (item) {
                    if (item.hasOwnProperty('container')) {
                        if (item.container.count() == 1) {
                            getControlItem(item.container);
                        }
                        else {
                            for (var i = 0; i < item.container.array.length; i++)
                                getControlItem(item.container.array[i]);
                        }
                    }
                    if (item.hasOwnProperty('control')) {
                        if (item.control.count() == 1) {
                            controlArr.push(item.control);
                        }
                        else {
                            for (var i = 0; i < item.control.array.length; i++)
                                controlArr.push(item.control.array[i]);
                        }
                    }
                };
                getControlItem(val);
            });
            if (controlArr.length > 0)
                controlFormat(controlArr);

            exports.cache({ key: "controlList", value: controlList });//存储缓存中

            viewModel.scriptbuilder += "<script src=\"" + _basedata.outputVMPath + "\" type=\"text/javascript\"></script>\r\n<script src=\"" + _basedata.outputVMExtendPath + "\" type=\"text/javascript\"></script>";
        };
        //js文件页面复合数据
        this.vmdataFormat = function (resdata) {

            var vmxml = resdata.vmxml;
            var serviceColums = resdata.hasOwnProperty('colums') ? resdata.colums : null;  //有listid

            var controlList = _dict && _dict['controlList'].value;

            var delpropertyStr = "|id|entityid|ilength|dr|vmfield|refEntityId|uapDataType|";  //去除对象中部分无用属性
            var noMergeStr = "|name|";
            var fieldfilter = _dict.entityPerm.value;

            if (serviceColums) {
                for (var i = 0; i < serviceColums.ColumnInfo.length; i++) {
                    var field = serviceColums.ColumnInfo[i].field;
                    var entityName = serviceColums.ColumnInfo[i].entity;
                    var listId = serviceColums.ColumnInfo[i].listId;

                    for (var j = 0; j < serviceColums.array.length; j++) {
                        if (listId == serviceColums.array[j].columncode)
                            serviceColums['|' + entityName + ':' + field + '|'] = serviceColums.array[j].pk_entitycolumn_b;
                    }
                }
            }
            var objattributeFormat = function (val) {
                for (var attr in val) {
                    var attrValue = val[attr];
                    if (attrValue === 'true')
                        val[attr] = true;
                    if (attrValue === 'false')
                        val[attr] = false;
                    if (delpropertyStr.indexOf('|' + attr + '|') >= 0) {
                        delete val[attr];
                    }
                }
                return val;
            };

            var childline = function (itemObj) {
                var name = itemObj.refEntity;
                var viewxmlcolumns = itemObj.columns;
                var fieldName = itemObj.name;

                var child = new Array();
                vmxml.applications.application.viewmodel.entity.each(function (index, val) {
                    if (val.attributes().name == name) {
                        val.field.each(function (i, item) {
                            //增加公式
                            if (item.attributes().hasOwnProperty('editFormula')) {
                                formulas.push({ trigger: fieldName + "." + item.attributes().name, code: item.attributes().editFormula });
                            }

                            var itemname = "|" + name + ":" + item.attributes().name + "|";

                            if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(itemname) >= 0 || fieldfilter.readWrite.indexOf(itemname) >= 0))
                                || (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf(itemname) < 0)) {
                                var vmxmlitem = objattributeFormat(item.attributes());
                                var viewxmlitem = (function (v1, v2) {
                                    var re = null;
                                    for (var k = 0; k < v2.length; k++) {
                                        if (v2[k].field == v1)
                                            re = v2[k];
                                    }
                                    return objattributeFormat(re);
                                })(vmxmlitem.name, viewxmlcolumns, this);

                                if (viewxmlitem) {
                                    for (var attr in viewxmlitem) {
                                        var attrValue = viewxmlitem[attr];
                                        if (attr == "dataSource")
                                            vmxmlitem[attr] = JSON.parse(attrValue);
                                        else
                                            vmxmlitem[attr] = attrValue;
                                    }
                                }
                                else
                                    vmxmlitem.isVisible = false;
                                //viewModel中设置字段只读
                                if ((fieldfilter.readOnly.indexOf(itemname) >= 0) || (vmxmlitem.isReadOnly && vmxmlitem.isReadOnly == true)) {
                                    vmxmlitem.alwaysReadOnly = true;
                                    if (vmxmlitem.hasOwnProperty('isReadOnly'))
                                        delete vmxmlitem.isReadOnly;
                                }
                                for (var attr in vmxmlitem) {
                                    if (delpropertyStr.indexOf('|' + attr + '|') >= 0) {
                                        delete vmxmlitem[attr];
                                    }
                                }
                                child.push(vmxmlitem);
                            }
                        });
                        if (val.interfaces && val.interfaces.hasOwnProperty('interface')) {
                            var interfaceObj = { name: "interfaces", value: {} };
                            val.interfaces.interface.each(function (i, item) {
                                var itemObj = item.attributes();
                                interfaceObj.value[itemObj.key] = itemObj.value;
                            });
                            itemObj[interfaceObj.name] = interfaceObj.value;
                        }
                        return false;
                    }
                });
                itemObj.Columns = child;
                return itemObj;
            };

            viewModel = vmxml.applications.application.viewmodel.attributes();

            var fields = new Array();
            var formulas = new Array();
            var childEntityName = "|";

            vmxml.applications.application.viewmodel.entity.each(function (index, val) {
                if (val && val.attributes().isMain && val.attributes().isMain == "true" && val.field) {
                    val.field.each(function (i, item) {
                        var itemObj = item.attributes();
                        //构建权限判断字符串
                        var entityField = "|" + val.attributes().name + ":" + itemObj.name + "|";
                        if ((fieldfilter.mode == 0 && ((fieldfilter.readOnly.indexOf(entityField) >= 0 || fieldfilter.readWrite.indexOf(entityField) >= 0)))
                            || fieldfilter.mode == 1) {
                            //先执行属性合并（view vm control属性合并）
                            if (controlList.hasOwnProperty(itemObj.name) && controlList[itemObj.name].entity == itemObj.entity) {
                                for (var attr in controlList[itemObj.name]) {
                                    if (noMergeStr.indexOf('|' + attr + '|') >= 0) continue;
                                    var attrValue = controlList[itemObj.name][attr];
                                    if (attr == "dataSource")
                                        itemObj[attr] = JSON.parse(attrValue);
                                    else
                                        itemObj[attr] = attrValue;
                                }
                            } else {
                                itemObj.isVisible = false;
                            }
                            //若XML文件中出现isReadOnly属性，则对应ViewModel中生成的字段永为alwaysReadOnly=true
                            if (itemObj.hasOwnProperty('isReadOnly') && itemObj.isReadOnly == 'true') {
                                itemObj.alwaysReadOnly = true;
                                delete itemObj.isReadOnly;
                            }
                            //增加公式
                            if (itemObj.hasOwnProperty('editFormula')) {
                                formulas.push({ trigger: itemObj.name, code: itemObj.editFormula });
                                delete itemObj.editFormula;
                            }
                            //是否需要服务加载栏目信息
                            if (!serviceColums || !serviceColums.hasOwnProperty('|' + itemObj.entity + ':' + itemObj.name + '|')) {
                                //是否加载其他子field到当前的control中
                                if (itemObj.refEntity) {
                                    if (!itemObj.hasOwnProperty('columns')) {
                                        exports.message({
                                            message: "View.XML中栏目信息不存在",
                                            source: "vmdataFormat",
                                            type: "error"
                                        });
                                    }
                                    childEntityName += itemObj.refEntity + "|";
                                    itemObj = itemObj.hasOwnProperty('columns') ? childline(itemObj) : itemObj;
                                    delete itemObj.refEntity;
                                    delete itemObj.columns;
                                }
                            }
                            else {
                                if (serviceColums.hasOwnProperty('|' + itemObj.entity + ':' + itemObj.name + '|')) {
                                    itemObj.Columns = serviceColums['|' + itemObj.entity + ':' + itemObj.name + '|'] != null ? serviceColums['|' + itemObj.entity + ':' + itemObj.name + '|'] : [];
                                    for (var index = 0; index < itemObj.Columns.length; index++) {
                                        if (itemObj.Columns[index].hasOwnProperty('editFormula')) {
                                            formulas.push({ trigger: itemObj.Columns[index].name, code: itemObj.Columns[index].editFormula });
                                        }
                                    }
                                }
                            }
                            if (fieldfilter.readOnly.indexOf(entityField) >= 0)
                                itemObj.alwaysReadOnly = true;
                            //如果隐藏字段不生成model，注释此if
                            if (fieldfilter.visibility.indexOf(entityField) >= 0)
                                itemObj.inVisible = true;
                            fields.push(objattributeFormat(itemObj));
                        }
                    });
                    if (val.interfaces && val.interfaces.hasOwnProperty('interface')) {
                        var interfaceObj = { name: "interfaces", modeltype: "Object", value: {} };
                        val.interfaces.interface.each(function (i, item) {
                            var itemObj = item.attributes();
                            interfaceObj.value[itemObj.key] = itemObj.value;
                        });
                        fields.push(interfaceObj);
                    }
                }
            });

            vmxml.applications.application.viewmodel.entity.each(function (index, val) {
                if (val && (!val.attributes().isMain || val.attributes().isMain != "true") && childEntityName.indexOf('|' + val.attributes().name + '|') < 0) {
                    if (!val.field) return;
                    val.field.each(function (i, item) {
                        var itemObj = item.attributes();
                        var entityField = "|" + val.attributes().name + ":" + item.attributes().name + "|";
                        if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(entityField) >= 0 || fieldfilter.readWrite.indexOf(entityField) >= 0))
                                || (fieldfilter.mode == 1)) {  //&& fieldfilter.visibility.indexOf(itemname) < 0
                            if (controlList.hasOwnProperty(itemObj.name) && controlList[itemObj.name].entity == itemObj.entity) {
                                for (var attr in controlList[itemObj.name]) {
                                    if (noMergeStr.indexOf('|' + attr + '|') >= 0) continue;
                                    var attrValue = controlList[itemObj.name][attr];
                                    if (attr == "dataSource")
                                        itemObj[attr] = JSON.parse(attrValue);
                                    else
                                        itemObj[attr] = attrValue;
                                }
                            } else {
                                itemObj.isVisible = false;
                            }
                            if ((fieldfilter.readOnly.indexOf(entityField) >= 0) || (itemObj.isReadOnly && itemObj.isReadOnly == 'true')) {
                                itemObj.alwaysReadOnly = true;
                                if (itemObj.isReadOnly)
                                    delete itemObj.isReadOnly;
                            }
                            //如果隐藏字段不生成model，注释此if
                            if (fieldfilter.visibility.indexOf(entityField) >= 0)
                                itemObj.inVisible = true;
                            fields.push(objattributeFormat(itemObj));
                        }
                    });
                }
            });
            // fangqg: xmlreader值为一项时，.array为空？
            var action = new Array();
            if (vmxml.applications.application.viewmodel.actions && vmxml.applications.application.viewmodel.actions.hasOwnProperty('action'))
                vmxml.applications.application.viewmodel.actions.action.each(function (index, val) {
                    if (val)
                        action.push(objattributeFormat(val.attributes()));
                });
            // fangqg: xmlreader值为一项时，.array为空？
            var proxies = new Array();
            if (vmxml.applications.application.viewmodel.proxies && vmxml.applications.application.viewmodel.proxies.hasOwnProperty('proxy'))
                vmxml.applications.application.viewmodel.proxies.proxy.each(function (index, val) {
                    if (val)
                        proxies.push(objattributeFormat(val.attributes()));
                });

            //格式化按钮状态数据
            if (vmxml.applications.application.viewmodel.hasOwnProperty('states')) {
                var newfield = { name: "States", modelType: "array", value: null };
                var valueArray = new Array();
                var statesObj = vmxml.applications.application.viewmodel.states;
                if (statesObj.hasOwnProperty('state')) {
                    if (statesObj.state.count() > 1) {
                        for (var i = 0; i < statesObj.state.array.length; i++) {
                            var o = new Object();
                            var arr = new Array();
                            o.state = statesObj.state.array[i].attributes().name;
                            if (!statesObj.state.array[i].hasOwnProperty('buttons'))
                                continue;
                            if (!statesObj.state.array[i].buttons.hasOwnProperty('button'))
                                continue;
                            var btnItem = statesObj.state.array[i].buttons.button;
                            if (btnItem.count() > 1) {
                                for (var j = 0; j < btnItem.array.length; j++) {
                                    arr.push({
                                        field: btnItem.array[j].attributes().field,
                                        disable: btnItem.array[j].attributes().disable
                                    });
                                }
                            }
                            if (btnItem.count() == 1) {
                                arr.push({
                                    field: btnItem.attributes().field,
                                    disable: btnItem.attributes().disable
                                });
                            }
                            o.actions = arr;
                            valueArray.push(o);
                        }
                    }
                    if (statesObj.state.count() == 1) {
                        if (statesObj.state.hasOwnProperty('buttons')) {
                            if (statesObj.state.buttons.hasOwnProperty('button')) {
                                var arr = new Array();
                                var o = new Object();
                                var btnItem = statesObj.state.buttons.button;
                                o.state = statesObj.state.attributes().name;
                                if (btnItem.count() > 1) {
                                    for (var j = 0; j < btnItem.array.length; j++) {
                                        arr.push({
                                            field: btnItem.array[j].attributes().field,
                                            disable: btnItem.array[j].attributes().disable
                                        });
                                    }
                                }
                                if (btnItem.count() == 1) {
                                    arr.push({
                                        field: btnItem.attributes().field,
                                        disable: btnItem.attributes().disable
                                    });
                                }
                                o.actions = arr;
                                valueArray.push(o);
                            }
                        }
                    }
                    newfield.value = valueArray;
                }
                fields.push(newfield);
            }

            ///转换枚举类型数据源
            //source:"0:左对齐,1:居中,2:审批进行中,2:右对齐"
            //target: [{ text: "左对齐", value: "0" }, { text: "居中", value: "1" }, { text: "右对齐", value: "2" }]    
            var convertoDataSource = function (source) {
                var result = [];
                var dataSource = source.split(",");
                if (dataSource.length) {
                    for (var i = 0, j = dataSource.length; i < j; i++) {
                        var temp = dataSource[i].split(":");
                        if (temp && temp.length == 2) {
                            result.push({ text: temp[1], value: temp[0] });
                        }
                    }
                }

                return result;
            };

            //转化参照
            var convertToReferInfo = function (column, refcodename) {
                var obj = {};
                var info = refcodename.split(",");
                if (info && info.length == 3) {
                    for (var i = 0; i < info.length; i++) {
                        var temp = info[i].split(":");
                        if (temp && temp.length == 2) {
                            obj[temp[0]] = temp[1];
                        }
                    }
                    if (obj["id"] && obj["code"] && obj["name"]) {
                        column["refKey"] = obj["id"];
                        column["refCode"] = obj["code"];
                        column["refName"] = obj["name"];
                    }
                }
            };

            var convertToColumns = function (data) {
                //showflag: { title: "是否显示", editable:true, columnType: "CheckBox", visible: true, width: 100, priority: 0, align: 1 },
                var columns = {};
                if (data && data.length) {
                    for (var i = 0, j = data.length; i < j; i++) {
                        var itemname = "|" + data[i]["fieldentityname"] + ":" + data[i]["fieldcode"] + "|";
                        if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(itemname) >= 0 || fieldfilter.readWrite.indexOf(itemname) >= 0))
                                || (fieldfilter.mode == 1)) {
                            var column = data[i];
                            column.title = data[i]["fieldshowname"] || data[i]["fieldname"];
                            delete data[i]["fieldshowname"] && delete data[i]["fieldname"];
                            column.editable = data[i]["editflag"];
                            delete data[i]["editflag"];
                            column.ctrlType = data[i]["fieldmdtype"];
                            delete data[i]["fieldmdtype"];
                            column.isVisible = data[i]["showflag"];
                            delete data[i]["showflag"];
                            column.width = data[i]["fieldwidth"];
                            delete data[i]["fieldwidth"];
                            column.priority = data[i]["priority"];
                            delete data[i]["priority"];
                            column.align = data[i]["fieldalign"];
                            delete data[i]["fieldalign"];
                            column.dataType = data[i]["fieldtype"];
                            delete data[i]["fieldtype"];
                            if (data[i]["totalflag"]) {  // 是否合计
                                column.aggregates = "sum";
                            }

                            if (fieldfilter.readOnly.indexOf(itemname) >= 0)
                                column.alwaysReadOnly = true;
                            if (fieldfilter.visibility.indexOf(itemname) >= 0)
                                column.inVisible = true;

                            //参照特殊处理
                            if (data[i]["refcodename"]) {
                                convertToReferInfo(column, data[i]["refcodename"]);
                                delete data[i]["refcodename"];
                            };
                            if (data[i]["reffield"]) {
                                column.refRelation = data[i]["reffield"];
                                delete data[i]["reffield"];
                            };
                            if (data[i]["refshowmode"]) {
                                column.refShowMode = data[i]["refshowmode"];
                                delete data[i]["refshowmode"];
                            };
                            if (column.ctrlType && column.ctrlType.toLocaleLowerCase() === "refer") {
                                column.refId = data[i]["fieldmdvalue"];
                                delete data[i]["fieldmdvalue"];
                            }

                            if (column.ctrlType && column.ctrlType.toLocaleLowerCase() == "combobox") {
                                column.dataSource = convertoDataSource(data[i]["fieldmdvalue"]);
                                delete data[i]["fieldmdvalue"];
                            }
                            column.isKey = data[i]["primarykeyflag"];
                            delete data[i]["primarykeyflag"];

                            columns[data[i]["fieldcode"]] = column;
                        }
                    }
                }
                return columns;
            };

            //格式化Model3D 多维数据模型处理
            var modelFormat = function (arrfields) {
                var columnObj = {};
                if (arrfields.Columns && arrfields.Columns.length > 0) {
                    for (var i = 0; i < arrfields.Columns.length; i++) {
                        var item = arrfields.Columns[i];
                        var name = item.name;
                        delete item.name;
                        delete item.modeltype;
                        columnObj[name] = item;
                    }
                    return columnObj;
                }
                else
                    return null;
            };

            //VM.xml 进一步格式化   简化模板的编写方式
            viewModel.fields = new Array();
            var viewDataCache = _dict && _dict["viewDataCache"] && _dict["viewDataCache"].value;
            var newFields = viewDataCache && viewDataCache.newFields;
            var existFields = viewDataCache && viewDataCache.existFields;
            if (newFields) {
                for (var attr in newFields) {
                    var attrVal = newFields[attr];
                    if (attrVal) {
                        viewModel.fields.push({ name: attr, value: "new cb.model.SimpleModel(" + JSON.stringify(attrVal) + ")," });
                    } else {
                        viewModel.fields.push({ name: attr, value: "new cb.model.SimpleModel()," });
                    }
                }
            }
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                delete fields[i].name;
                var field = existFields && existFields[name];
                if (field) {
                    for (var attr in field) {
                        fields[i][attr] = fields[i][attr] || field[attr];
                    }
                }
                var val;
                switch (fields[i].modelType) {
                    case "SimpleModel":
                        delete fields[i].modeltype;
                        val = "new cb.model.SimpleModel(" + JSON.stringify(fields[i]) + "),";
                        break;
                    case "Model2D":
                        delete fields[i].modeltype;
                        fields[i].Columns = modelFormat(fields[i]);
                        if (fields[i].Columns == null)
                            delete fields[i].Columns;
                        val = "new cb.model.Model2D(" + JSON.stringify(fields[i]) + "),";
                        break;
                    case "Model3D":
                        delete fields[i].modeltype;
                        if (serviceColums && serviceColums.ColumnInfo) {
                            for (var len = 0; len < serviceColums.ColumnInfo.length; len++) {
                                var colInfoItem=serviceColums.ColumnInfo[len];
                                if(colInfoItem.entity==fields[i].entity && colInfoItem.field==fields[i].field)
                                    fields[i].columnCode = colInfoItem.listId;
                            }
                        }
                        fields[i].Columns = (serviceColums && serviceColums['|' + fields[i].entity + ':' + fields[i].field + '|']) ? convertToColumns(fields[i].Columns) : modelFormat(fields[i]);
                        if (fields[i].Columns == null)
                            delete fields[i].Columns;
                        val = "new cb.model.Model3D(" + JSON.stringify(fields[i]) + "),";
                        break;
                    default:
                        val = JSON.stringify(fields[i].value) + ",";
                        break;
                }
                viewModel.fields.push({ name: name, value: val });
            }
            viewModel.actions = action;
            if (formulas.length > 0)
                viewModel.formulas = JSON.stringify(formulas);
            viewModel.proxies = proxies;
            var application = vmxml.applications.application.attributes();
            application.viewmodel = viewModel;
            viewModel = application;
        };
        datatype ? (datatype == 'view' ? viewdataFormat(resdata) : vmdataFormat(resdata)) : vmdataFormat(resdata);
        var data = datatype == 'view' ? { view: viewModel } : { application: viewModel };
        return data;
    };
    /*
    *函数名：_linkFormat 资源文件链接统一格式化（资源文件路径匹配正确）
    *@param  文件路径
    *@param  资源文件路径集合
    *@return 返回处理好的路径字符串
    */
    var _linkFormat = function (filepath, data) {
        var link = data.view.linkbuilder;
        var script = data.view.scriptbuilder;
        var pagepath = path.dirname(filepath);

        var linkhandle = function (fpath, linkstr) {
            var newlink = "";
            var linkArr = linkstr.split('href=');
            for (var i = 1; i < linkArr.length; i++) {
                if (linkArr[i].indexOf('.css') > 0) {
                    var csspath = _dict._workpath.value + "/" + (linkArr[i].split('.css')[0] + ".css").split('./')[1];
                    var newpath = path.relative(fpath, path.dirname(csspath)) + "/" + path.basename(csspath);

                    newlink += '<link href="' + newpath + '" rel="stylesheet" type="text/css" />';
                }
            }
            return newlink;
        };
        var scripthandle = function (fpath, scriptstr) {
            var newscript = "";
            var scriptArr = scriptstr.split('src=');
            for (var i = 1; i < scriptArr.length; i++) {
                if (scriptArr[i].indexOf('.js') > 0) {
                    var jspath = _dict._workpath.value + "/" + (scriptArr[i].split('.js')[0] + ".js").split('./')[1];
                    var newpath = path.relative(fpath, path.dirname(jspath)) + "/" + path.basename(jspath);

                    newscript += '<script src="' + newpath + '" type="text/javascript"></script>';
                }
            }
            return newscript;
        };
        return { linkbuilder: linkhandle(pagepath, link), scriptbuilder: scripthandle(pagepath, script) };
    };
    /*
    *函数名：_object2Json XML文件数据转换成对应的JSON格式（主要用于生成HTML页面所需数据源）
    *@param  XML数据
    *@return 返回JSON格式的数据
    */
    var _object2Json = function (data) {
        
        var fieldfilter = _dict.entityPerm.value;  //权限数据
        var columsData = data.Columns;
        var xmldata = data.xmldata;

        var application = xmldata.application.attributes();

        //将多个子行信息进行数据重组
        if (columsData) {
            for (var i = 0; i < columsData.ColumnInfo.length; i++) {
                var listId = columsData.ColumnInfo[i].listId;
                var field = columsData.ColumnInfo[i].field;
                var entityName = columsData.ColumnInfo[i].entity;

                for (var j = 0; j < columsData.array.length; j++) {
                    if (columsData.array[j].columncode == listId) {
                        columsData['|' + entityName + ':' + field + '|'] = columsData.array[j].pk_entitycolumn_b;
                    }
                }
            }
        }
        if (xmldata.application.view.count() == 1) {
            var view = xmldata.application.view.attributes();

            if (view.hasOwnProperty('viewModel'))
                view.viewModel = view.viewModel.substr(view.viewModel.lastIndexOf('.') + 1);

            var containerArr = new Array();

            xmldata.application.view.container.each(function (index, val) {
                var container = val.attributes();

                var getcontainerItem = function (obj, item) {

                    if (item.hasOwnProperty('container')) {
                        var containersArr = new Array();
                        if (item.container.count() == 1) {
                            var newItem = item.container.attributes();
                            containersArr.push(getcontainerItem(newItem, item.container));
                        }
                        else {
                            for (var i = 0; i < item.container.array.length; i++) {
                                var newItem = item.container.array[i].attributes();
                                containersArr.push(getcontainerItem(newItem, item.container.array[i]));
                            }
                        }
                        obj.containers = containersArr;
                    }

                    var addColums = function (colitem, colArr) {
                        var colArray = new Array();
                        if (!colArr) {
                            var itemEntityField = '|' + colitem.entity + ':' + colitem.field + '|';
                            if (columsData != null && columsData[itemEntityField] && columsData[itemEntityField].length > 0) {
                                for (var k = 0; k < columsData[itemEntityField].length; k++) {
                                    if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf('|' + columsData[itemEntityField][k].fieldentityname + ':' + columsData[itemEntityField][k].fieldcode + '|') >= 0 || fieldfilter.readWrite.indexOf('|' + columsData[itemEntityField][k].fieldentityname + ':' + columsData[itemEntityField][k].fieldcode + '|') >= 0))
                                     || (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf('|' + columsData[itemEntityField][k].fieldentityname + ':' + columsData[itemEntityField][k].fieldcode + '|') < 0)) {
                                        var o = new Object();
                                        o.name = columsData[itemEntityField][k].fieldcode;
                                        o.title = columsData[itemEntityField][k].fieldname;
                                        o.field = columsData[itemEntityField][k].fieldcode;
                                        o.ctrlType = columsData[itemEntityField][k].fieldmdtype;
                                        colArray.push(o);
                                    }
                                }
                            }
                        }
                        else {
                            for (var k = 0; k < colArr.length; k++) {
                                var o = colArr[k].attributes();
                                if (o.isVisible=='false') continue;
                                if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf('|' + o.entity + ':' + o.field + '|') >= 0 || fieldfilter.readWrite.indexOf('|' + o.entity + ':' + o.field + '|') >= 0))
                                || (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf('|' + o.entity + ':' + o.field + '|') < 0))
                                    colArray.push(o);
                            }
                        }
                        colitem.colums = colArray;
                        return colitem;
                    };

                    if (item.hasOwnProperty('control')) {
                        var controlsArr = new Array();
                        if (item.control.count() == 1 && item.control.attributes().isVisible=='true') {
                            var itemname = '|' + item.control.attributes().entity + ':' + item.control.attributes().field + '|';
                            if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(itemname) >= 0 || fieldfilter.readWrite.indexOf(itemname) >= 0))
                                || (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf(itemname) < 0)) {
                                if (!item.control.attributes().hasOwnProperty('listId')) {
                                    if (item.control.hasOwnProperty('columns')) {
                                        if (item.control.columns.column.count() <= 1)
                                            controlsArr.push(addColums(item.control.attributes()));
                                        else
                                            controlsArr.push(addColums(item.control.attributes(), item.control.columns.column.array));
                                    }
                                    else
                                        controlsArr.push(item.control.attributes());
                                }
                                else
                                    controlsArr.push(addColums(item.control.attributes()));
                            }
                        }
                        else {
                            for (var i = 0; i < item.control.array.length; i++) {
                                if (item.control.array[i].attributes().isVisible=='false') continue;
                                var itemname = '|' + item.control.array[i].attributes().entity + ':' + item.control.array[i].attributes().field + '|';
                                if ((fieldfilter.mode == 0 && (fieldfilter.readOnly.indexOf(itemname) >= 0 || fieldfilter.readWrite.indexOf(itemname) >= 0))
                                 || (fieldfilter.mode == 1 && fieldfilter.visibility.indexOf(itemname) < 0)) {
                                    if (!item.control.array[i].attributes().hasOwnProperty('listId')) {
                                        if (item.control.array[i].hasOwnProperty('columns')) {
                                            var itemArr = item.control.array[i].columns.column.array;
                                            controlsArr.push(addColums(item.control.array[i].attributes(), itemArr));
                                        }
                                        else
                                            controlsArr.push(item.control.array[i].attributes());
                                    }
                                    else
                                        controlsArr.push(addColums(item.control.array[i].attributes()));
                                }
                            }
                        }
                        obj.controls = controlsArr;
                    }
                    return obj;
                };
                container = getcontainerItem(container, val);
                containerArr.push(container);
            });
            view.containers = containerArr;
            application.view = view;
        }
        else {
            //同一个XML文件中存放多个View  （属预留方法  暂不开发）
        }
        return application;
    };
    /*********************************    引擎生成文件部分 End         *******************************/

    /*********************************    引擎辅助方法部分 Start       *******************************/
    exports.fieldPermHandle = function (mode, entityPerm) {
        var o = {
            mode: mode ? mode : 1,
            visibility: "|",
            readOnly: "|",
            readWrite: "|"
        };
        if (entityPerm) {
            for (var attr in entityPerm) {
                var attrValue = entityPerm[attr];
                for (var cattr in attrValue) {
                    var cattrValue = attrValue[cattr];
                    if (cattrValue.authStat == 0)
                        o.visibility += attr + ":" + cattr + "|";
                    else if (cattrValue.authStat == 1)
                        o.readOnly += attr + ":" + cattr + "|";
                    else if (cattrValue.authStat == 2)
                        o.readWrite += attr + ":" + cattr + "|";
                }
            }
        }
        return o;
    };
    /*
    *函数名：_checkrepeat  资源文件是否重复加载检验函数
    *@param 资源文件记录对象
    *@param 加载资源文件引入标记
    *@param 加载资源文件类型
    *@return false:未加载   true：已加载
    */
    var _checkrepeat = function (viewModel, val, type) {
        var linkarr = val.split('/');
        var re = false;
        if (type && type == 'js') {
            for (var i = 0; i < linkarr.length; i++) {
                if (linkarr[i].indexOf('.js') > 0) {
                    if (viewModel.scriptbuilder && viewModel.scriptbuilder.length > 0) {
                        if (viewModel.scriptbuilder.indexOf("/" + linkarr[i].split('.js')[0] + ".js") > 0)
                            re = true;
                    }
                    else
                        break;
                }
            }
        }
        else {
            for (var i = 0; i < linkarr.length; i++) {
                if (linkarr[i].indexOf('.css') > 0) {
                    if (viewModel.linkbuilder && viewModel.linkbuilder.length > 0) {
                        if (viewModel.linkbuilder.indexOf("/" + linkarr[i].split('.css')[0] + ".css") > 0)
                            re = true;
                    }
                    else
                        break;
                }
            }
        }
        return re;
    };

    // fangqg: 修改去重逻辑
    var _checkrepeat1 = function (val, type, builder) {
        if (!val) return;
        xmlreader.read(val, function (err, resdata) {
            if (err) {
                exports.message({
                    type: 'error',
                    source: "_checkrepeat1",
                    message: "val转换失败"
                });
                return;
            }
            if (type === "js") {
                var attrs = resdata && resdata.script && resdata.script.attributes();
                if (!attrs) return;
                var builderIndex;
                if (attrs["src"])
                    builderIndex = path.join(_rootPath, attrs["src"]);
                else if (attrs["data-config"])
                    builderIndex = attrs["data-config"];
                if (builderIndex && !builder[builderIndex])
                    builder[builderIndex] = val;
            } else if (type === "css") {
                var attrs = resdata && resdata.link && resdata.link.attributes();
                if (!attrs) return;
                var builderIndex;
                if (attrs["href"])
                    builderIndex = path.join(_rootPath, attrs["href"]);
                else if (attrs["data-config"])
                    builderIndex = attrs["data-config"];
                if (builderIndex && !builder[builderIndex])
                    builder[builderIndex] = val;
            }
        });
    };

    /*
    *函数名：_controlHandle  控件模板处理函数
    *@param 控件的模板信息
    *@return 返回格式化后控件模板对象
    */
    var _controlHandle = function (val) {
        if (val && typeof val == 'string') {
            var control = {
                linkbuilder: new Array(),
                scriptbuilder: new Array(),
                controlhtml: ""
            };
            var controltpl = _dict && _dict[val];
            if (controltpl && controltpl.value.length > 0) {
                var headcontent = controltpl.value.split('<head>')[1].split('</head>')[0].split(/\n/);
                var bodycontent = controltpl.value.split("<body>")[1].split('</body>')[0];
                control.controlhtml = bodycontent;
                if (headcontent.length > 0) {
                    for (var i = 0; i < headcontent.length; i++) {
                        if (headcontent[i].indexOf('<script') >= 0) {
                            control.scriptbuilder.push(headcontent[i]);
                        }
                        else if (headcontent[i].indexOf('<link') >= 0) {
                            control.linkbuilder.push(headcontent[i]);
                        }
                    }
                }
                return control;
            }
            else {
                exports.message({
                    message: val + "控件模板不存在",
                    source: "_controlHandle",
                    type: "error"
                });
                return null;
            }
        }
    };
    /**
     * 添加模板辅助方法
     * @name    template.helper
     * @param   {String}    名称
     * @param   {Function}  方法
     */
    exports.helper = function (name, helper) {
        exports.prototype[name] = helper;
    };
    /*
    *方法名：message  消息中心
    *@param: e 消息对象
    *@return 用于输出系统消息（调试日志和错误信息）
    */
    exports.message = function (e) {
        var TimeFormat = function (objD) {
            var str;
            var yy = objD.getYear();
            if (yy < 1900) yy = yy + 1900;
            var MM = objD.getMonth() + 1;
            if (MM < 10) MM = '0' + MM;
            var dd = objD.getDate();
            if (dd < 10) dd = '0' + dd;
            var hh = objD.getHours();
            if (hh < 10) hh = '0' + hh;
            var mm = objD.getMinutes();
            if (mm < 10) mm = '0' + mm;
            var ss = objD.getSeconds();
            if (ss < 10) ss = '0' + ss;
            var mss = objD.getMilliseconds();
            str = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + " " + mss;
            return str;
        };
        if (exports.isDebug) {
            var msg = '';
            var ts = TimeFormat(new Date());
            if (e.message)
                msg += "log：" + e.message + "\n";
            if (e.source)
                msg += "source：" + e.source + "\n";
            if (e.err)
                msg += "err:" + e.err;
            if (e.pathname)
                msg += "path：" + e.pathname;
            msg += "时间：" + ts + "\n";
            if (e.type == 'error')
                console.error("error:" + msg);
            else
                console.log(msg);
            if (e.isoutput) {
                var errorlog = _rootPath + "\\nodejs\\log\\ErrorLog--" + ts + ".txt";
                _writeFile(errorlog, e.code);
                console.log("请参见错误日志：" + errorlog);
            }
        }
    };
    /*
    *方法名：clone 克隆复制
    */
    exports.clone = function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = exports.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = exports.clone(obj[attr]);
            }
            return copy;
        }
    };
    /*********************************    引擎辅助方法部分 End         *******************************/

    /*********************************    模板编译器部分 Start         *******************************/
    /*
    *函数名：compile
    *@param 
    *@return 返回页面渲染值
    */
    exports.compile = function (content) {
        var params = arguments;
        if (typeof content !== 'string') {
            isDebug = params[1];
            content = params[0];
            id = anonymous;
        }
        try {
            var Render = _compile(content);
        }
        catch (e) {
            exports.message({
                source: "exports.compile",
                type: "error",
                err: "语句出错：",
                code: e.temp,
                isoutput: true
            });
            return;
        }
        function render(data, callback) {
            try {
                return new Render(data) + '';
            }
            catch (e) {
                exports.message({
                    type: 'error',
                    source: 'render(data)',
                    err: e
                });
                if (callback)
                    callback.call(this, { "error": e.toString(), "stackTrace": "function render(data, callback)" });
            }
        }

        render.prototype = Render.prototype;
        render.toString = function () {
            return Render.toString();
        };

        return render;
    }
    /*函数名：exports.childrender
    *@param 页面size标记，用于区分加载
    *@return 返回格式化后控件模板对象
    *@return 返回格式化后控件模板对象
    */
    exports.childrender = function (screenSize, val) {
        var childcontent = '';
        if (val && typeof val == 'object') {
            var ctrlTpl = _dict && _dict[screenSize + "_" + val.ctrlType];
            if (!ctrlTpl) {
                exports.message({
                    message: screenSize + "_" + val.ctrlType + "控件模板不存在",
                    source: "exports.childrender",
                    type: "error"
                });
                return null;
            }
            var _childFunc = _dict && _dict[screenSize + "_" + val.ctrlType].func;
            if (_childFunc && typeof _childFunc == 'function') {
                childcontent = _childFunc(val);
            }
        }
        return childcontent;
    };
    //模板编译器
    var _compile = (function () {
        // 辅助方法集合
        exports.prototype = {
            $render: exports.childrender,
            $escape: function (content) {
                return typeof content === 'string'
                ? content.replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                    return {
                        "<": "&#60;",
                        ">": "&#62;",
                        '"': "&#34;",
                        "'": "&#39;",
                        "&": "&#38;"
                    }[s];
                })
                : content;
            },
            $string: function (value) {
                if (typeof value === 'string' || typeof value === 'number') {
                    return value;
                } else if (typeof value === 'function') {
                    return value();
                } else {
                    return '';
                }
            }
        };

        var arrayforEach = Array.prototype.forEach || function (block, thisObject) {
            var len = this.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in this) {
                    block.call(thisObject, this[i], i, this);
                }
            }
        };
        // 数组迭代
        var forEach = function (array, callback) {
            arrayforEach.call(array, callback);
        };

        // 静态分析模板变量
        var KEYWORDS =
            // 关键字
            'break,case,catch,continue,debugger,default,delete,do,else,false'
            + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
            + ',throw,true,try,typeof,var,void,while,with'
            // 保留字
            + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
            + ',final,float,goto,implements,import,int,interface,long,native'
            + ',package,private,protected,public,short,static,super,synchronized'
            + ',throws,transient,volatile'
            // ECMA 5 - use strict
            + ',arguments,let,yield'
            + ',undefined';
        var REMOVE_RE = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g;
        var SPLIT_RE = /[^\w$]+/g;
        var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
        var NUMBER_RE = /\b\d[^,]*/g;
        var BOUNDARY_RE = /^,+|,+$/g;
        var getVariable = function (code) {
            code = code
            .replace(REMOVE_RE, '')
            .replace(SPLIT_RE, ',')
            .replace(KEYWORDS_RE, '')
            .replace(NUMBER_RE, '')
            .replace(BOUNDARY_RE, '');
            code = code ? code.split(/,+/) : [];
            return code;
        };
        return function (source, filetype) {
            var openTag = exports.openTag;
            var closeTag = exports.closeTag;
            var parser = exports.parser;

            var code = source;
            var tempCode = '';
            var line = 1;
            var uniq = { $data: true, $helpers: true, $out: true, $line: true };
            var helpers = exports.prototype;
            var prototype = {};

            var variables = filetype == 'ctrl' ? "var " : "var $helpers=this,";

            var isNewEngine = ''.trim;// '__proto__' in {}
            var replaces = isNewEngine
            ? ["$out='';", "$out+=", ";", "$out"]
            : ["$out=[];", "$out.push(", ");", "$out.join('')"];

            var concat = isNewEngine
                ? "if(content!==undefined){$out+=content;return content}"
                : "$out.push(content);";

            var print = "function(content){" + concat + "}";

            var include = "function(key,data){"
            + "var content=$helpers.$render(key,data);"
            + concat
            + "}";

            // html与逻辑语法分离
            forEach(code.split(openTag), function (code, i) {
                code = code.split(closeTag);

                var $0 = code[0];
                var $1 = code[1];

                // code: [html]
                if (code.length === 1) {
                    tempCode += html($0);
                } else {
                    tempCode += logic($0);
                    if ($1) {
                        tempCode += html($1);
                    }
                }
            });
            code = tempCode;

            code = "'use strict';"
            + variables + replaces[0] + code
            + 'return new String(' + replaces[3] + ')';

            try {
                var Render = new Function('$data', code);
                Render.prototype = prototype;

                return Render;
            }
            catch (e) {
                e.temp = 'function anonymous($data) {' + code + '}';
                throw e;
            }
            // 处理 HTML 语句
            function html(code) {
                // 记录行号
                line += code.split(/\n/).length - 1;

                if (exports.isCompress) {//exports.isCompress
                    code = code.replace(/[\n\r\t\s]+/g, ' ');
                }

                code = code
                // 单引号与反斜杠转义(因为编译后的函数默认使用单引号，因此双引号无需转义)
                .replace(/('|\\)/g, '\\$1')
                // 换行符转义(windows + linux)
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n');
                code = replaces[1] + "'" + code + "'" + replaces[2];
                return code + '\n';
            }

            // 处理逻辑语句
            function logic(code) {
                var thisLine = line;
                if (parser) {
                    // 语法转换插件钩子
                    code = parser(code);
                }
                // 输出语句. 转义: <%=value%> 不转义:<%==value%>
                if (code.indexOf('=') === 0) {
                    var isEscape = code.indexOf('==') !== 0;
                    code = code.replace(/^=*|[\s;]*$/g, '');
                    if (isEscape && exports.isEscape) {
                        // 转义处理，但排除辅助方法
                        var name = code.replace(/\s*\([^\)]+\)/, '');
                        if (
                            !helpers.hasOwnProperty(name)
                            && !/^(include|print)$/.test(name)
                        ) {
                            if (filetype && filetype == 'HTML')
                                code = '$escape($string(' + code + '))';
                            else if (filetype && filetype == 'ctrl')
                                code = code;
                            else
                                code = '$string(' + code + ')';
                        }

                    } else {
                        if (filetype != 'ctrl')
                            code = '$string(' + code + ')';
                    }
                    code = replaces[1] + code + replaces[2];
                }
                getKey(code);
                return code + '\n';
            }
            // 提取模板中的变量名
            function getKey(code) {
                code = getVariable(code);
                // 分词
                forEach(code, function (name) {
                    // 除重
                    if (!uniq.hasOwnProperty(name)) {
                        setValue(name);
                        uniq[name] = true;
                    }
                });
            }
            // 声明模板变量
            // 赋值优先级:
            // 内置特权方法(include, print) > 私有模板辅助方法 > 数据 > 公用模板辅助方法
            function setValue(name) {
                var value;
                if (name === 'print') {
                    value = print;
                } else if (name === 'include') {
                    prototype['$render'] = helpers['$render'];
                    value = include;
                } else {
                    value = '$data.' + name;
                    if (helpers.hasOwnProperty(name)) {
                        prototype[name] = helpers[name];
                        if (name.indexOf('$') === 0) {
                            value = '$helpers.' + name;
                        } else {
                            value = value
                            + '===undefined?$helpers.' + name + ':' + value;
                        }
                    }
                }
                variables += name + '=' + value + ',';
            }
        };
    })();
    /*********************************    模板编译器部分 End         *********************************/

    /*********************************    文件操作部分 Start         *********************************/
    /*
    *方法名：_readdir  内部方法  读取文件夹中内容
    *@param: pathname 文件夹路径
    *@param: callback 回调函数
    *@return 用于输出系统消息（调试日志和错误信息）
    */
    var _readdir = function (pathname) {
        var self = this;
        fs.readdir(pathname, function (err, files) {
            if (err) {
                exports.message({
                    type: 'error',
                    source: "fs_readdir",
                    message: "读取文件目录失败",
                    pathname: pathname
                });
                return;
            }
            if (files.length == 0) {
                exports.message({
                    type: 'error',
                    source: "fs_readdir",
                    message: "目标目录为空",
                    pathname: pathname
                });
                return;
            }
            files.forEach(function (file) {
                var childpath = pathname.substr(pathname.length - 1, 1) == '/' ? pathname + file : pathname + '/' + file;
                if (file.indexOf('.') < 0) {

                    fs.stat(childpath, function (err, stat) {
                        if (err) {
                            exports.message({
                                type: 'error',
                                source: "fs_readdir",
                                message: "读取文件目录失败",
                                pathname: childpath
                            });
                            return;
                        }
                        if (stat && stat.isDirectory()) {
                            _readdir(childpath);
                        }
                    });
                }
                else {
                    exports.tplcount += 1;
                    _readFile(childpath, false, function (content) {
                        exports.loadtplcount += 1;
                        var tplinfo = {};
                        if (childpath.indexOf('ctrl') > 0) {
                            var pa = childpath.split('ctrl');
                            if (pa[pa.length - 1].indexOf('.html') > 0)
                                tplinfo.key = path.basename(pa[pa.length - 1].split('/').join('_'), '.html');
                            if (pa[pa.length - 1].indexOf('.htm') > 0)
                                tplinfo.key = path.basename(pa[pa.length - 1].split('/').join('_'), '.htm');
                            tplinfo.key = tplinfo.key.substr(1, tplinfo.key.length);
                            tplinfo.value = content;
                            var ctrlStr = content.split('<body>')[1].split('</body>')[0];
                            tplinfo.func = _compile(ctrlStr, 'ctrl');
                        }
                        else {
                            tplinfo.key = path.basename(childpath);
                            tplinfo.value = content;
                            try {
                                tplinfo.func = _compile(content);
                            }
                            catch (e) {
                                tplinfo.func = null;
                                exports.message({
                                    type: 'error',
                                    source: "fs_readdir",
                                    message: "模板错误：[" + tplinfo.key + "]模板初始化渲染函数出错",
                                    pathname: childpath
                                });
                            }
                        }
                        exports.cache(tplinfo);
                        //监测模板是否加载完成
                        if (exports.loadtplcount == exports.tplcount && exports.tplcount != 0)
                            exports.message({
                                type: 'log',
                                source: "exports.Init",
                                message: "初始化：全部模板已加载完成(模板数：" + exports.loadtplcount + ")..."
                            });
                    });
                }
            });
        });
    };
    /*
    *方法名：_readFile  内部方法  读取文件
    *@param: pathname 文件路径
    *@param: isserialize 是否序列化（是否将XML转换成Object）
    *@param: callback 回调函数
    *@return 用于输出系统消息（调试日志和错误信息）
    */
    var _readFile = function (pathname, isserialize, callback, options) {
        fs.readFile(pathname, "utf-8", function (err, data) {
            if (err) {
                exports.message({
                    type: 'error',
                    source: "fs_readFile",
                    message: "读取文件失败",
                    pathname: pathname
                });
                callback.call(this, { "error": "读取文件失败", "stackTrace": pathname });
                return;
            }
            if (isserialize) {
                xmlreader.read(data, function (err, resdata) {
                    if (err) {
                        exports.message({
                            type: 'error',
                            source: "xmlreader",
                            message: "xml文件转换失败",
                            pathname: pathname
                        });
                        return;
                    }
                    if (!options)
                        callback.call(this, resdata);
                    else
                        callback.call(this, resdata, options);
                });
            }
            else {
                if (!options)
                    callback.call(this, data);
                else
                    callback.call(this, data, options);
            }
        });
    };
    /*
    *方法名：_writeFile  内部方法  写入文件
    *@param: pathname 文件路径
    *@param: data 输出的数据（类型可能为html或者js）
    *@return 用于输出系统消息（调试日志和错误信息）
    */
    var _writeFile = function (pathname, data, callback) {
        mkdirp(path.dirname(pathname), function (error) {
            if (error) {
                console.error(error);
            } else {
                fs.open(pathname, "w", function (err, fd) {
                    if (err) {
                        exports.message({
                            type: 'error',
                            source: "fs_openFile",
                            message: "读取创建失败",
                            pathname: pathname,
                            err: err
                        });
                        return;
                    }
                    fs.writeFile(pathname, data, 'utf-8', function (err) {
                        if (err) {
                            exports.message({
                                type: 'error',
                                source: "fs_openFile",
                                message: "文件写入失败",
                                pathname: pathname,
                                err: err
                            });
                            return;
                        }
                        if (callback)
                            callback.call(this, data);
                        exports.message({
                            type: 'success',
                            source: "fs_writeFile",
                            message: "页面已经创建完成！",
                            pathname: pathname
                        });
                    });
                });
            }
        });
    };
    /*********************************    文件操作部分    End      *********************************/
})(template, this);

if (typeof exports !== 'undefined') {
    module.exports = template;
};