/// <reference path="../Control.js" />

cb.controls.widget("Refer", function (controlType) {

    var _readOnly = function () { return false; }

    var _proxy = cb.rest.DynamicProxy.create({ getReferType: { url: "classes/Ref/UAP/getReferType", method: "POST"} });

    var control = function (id, options) {

        cb.controls.Control.call(this, id); //配置项自己处理
        this._init(options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;
    control.prototype._init = function (options) {
        if (!options || typeof options !== 'object' || options.hasOwnProperty('propertyName')) return;
        //options=cb.clone(options);

        var self = this;
        this._readOnly = false;
        //初始化控件内部结构
        var $child = self.getElement();
        var $input = $child.children().first();
        var $icon = $child.find("img").last();
        var $close = $child.find("img").first();

        this._set_data("$child", $child);
        this._set_data("$input", $input);
        this._set_data("$icon", $icon);
        this._set_data("$close", $close);

        var ignoreNextBlur = false;
        this._timer = null; //用于延迟处理焦点状态的定时器
        var doAfterBlur = function () {
            //self.clearTimeout(timer);
            if (ignoreNextBlur) { ignoreNextBlur = false; $input[0].focus(); return; }
            console.log('event:','doAfterBlur');
            $child.removeClass("Refer-focus");
            //$close.css({ visibility: "hidden" });
            $close.hide();
            
            //失去焦点时不触发change的情况：input值不变，参照值变化或不变化
            if(self._oldShowText===$input.val()){
                if(self._oldValue!==self.getValue()){
                    $input.trigger('change');
                }else{
                    $input.val(self._getDisplayText());//此时控件input还处于焦点状态,须把文本设置为非焦点状态下的文本
                }
            }else{//此时文本有变化，会触发change事件，所以无需更新文本值，如果更新为旧的文本值，文本框的值会设置两次
            
            }

            delete self._oldValue;
            delete self._oldShowText;
            
        };
        this._setFocus = function () { $input[0].focus(); };
        if ($input.is("input")) {
            //避免重复监听事件
            $input.off('.refer');
            $icon.off('.refer');
            $close.off('.refer');


            $input.on("focus.refer", function () {
                console.log('event:', 'focus');
                if (self.getReadOnly()) return;
                //console.log('focus');
                //console.log('document.activeElement:\n', document.activeElement);
                clearTimeout(self._timer);
                $child.addClass("Refer-focus");
                if ($input.val().length) {
                    //$close.css({ visibility: "visible" });
                    $close.show();
                    self.getElement().removeClass('valueNull');
                } else {
                    //$close.css({ visibility: "hidden" });
                    $close.hide();
                    self.getElement().addClass('valueNull');
                }
                $input.val(self._oldShowText=self._getDisplayText(true));
                self._oldValue = self.getValue();//记录编辑前的值和显示的文本，失去焦点时要比较值是否有变化
            });
            //清空参照后，相关的信息不处理，注：清空时并不会触发input的change事件，因为input并为活动焦点
            //$input.on("focusout.refer", function (e) {
            //    e.stopPropagation();
            //    return false;
            //});
            $input.on("blur.refer", function () {//blur可能是由于在控件的其他部分点击触发的
                console.log('event:', 'blur');
                clearTimeout(self._timer);
                self._timer = setTimeout(doAfterBlur, 10);
            });

            //change事件在以下三种情况下触发:
            //input触发change；清空input内容时脚本触发；失去焦点时input值没变，但中间有清空操作
            $input.bind("change.refer", function (e, args) {
                console.log('event:', 'change');
                if (!this.value) {//如果值为空字符串,直接通知更新
                    //var data = {};
                    //var opts = self._opts;
                    //var refKey = opts['refKey'];
                    //data[refKey] = '';
                    self.execute('change', null);
                } else {
                    self._loadRefer();
                }

            });

            $icon.on('mousedown.refer', function () {
                console.log('icon.click');

                ignoreNextBlur = true;
                self._onclick();
            });


            $close.on('mousedown.refer', function () {//点击图标时，mousedown比input的blur先触发
                console.log('mousedown.click');
                $input.val("");
                //$close.css({ visibility: "hidden" });
                $close.hide();
                ignoreNextBlur = true;
                $input.trigger('change');

            });

        }

        $(this.getElement()).off('.refer').bind("keydown.refer", function (e, args) {
            var key = e.which || e.charCode || e.keyCode;
            if (key == null||self._opts['refPath']) {
                return false;
            }
            
            if (key == 13) {
                e.preventDefault();

                if (self.getText().length == 0) {
                    //如果没有任何输入，直接回车，则弹出参照界面
                    self._onclick();
                } else {
                    self._loadRefer();
                }
            }
        }).on('keyup.refer', function () {
            //$input.val().length > 0 ? $close.css({ visibility: "visible" }) : $close.css({ visibility: "hidden" });
            //$close[$input.val().length ? 'show' : 'hide']();

            if ($input.val().length) {
                //$close.css({ visibility: "visible" });
                $close.show();
                self.getElement().removeClass('valueNull');
            } else {
                //$close.css({ visibility: "hidden" });
                $close.hide();
                self.getElement().addClass('valueNull');
                $input.trigger('change');
            }
        }).on('click', function (e) {
            //如果点击只读状态下的参照链接，触发clicklink事件
            var opts = self._opts;
            if (self.getReadOnly() && opts['linkflag']) {
                var data = {};
                data.linkpkname = opts['linkpkname'];
                data.linkappid = opts['linkappid'];
                data.value = self.getValue();
                self.execute('clicklink', data);
            }

        });
        //处理参照前面的标签的点击事件（主要在链接参照中有效）
        $child.prev('label').last().off('.refer').on('click.refer', function () {
            var opts = self._opts;
            if (opts['linkflag']) {
                var data = {};
                data.linkpkname = opts['linkpkname'];
                data.linkappid = opts['linkappid'];
                data.value = self.getValue();
                console.log('clicklink:',data);
                self.execute('clicklink', data);
            }
        });
        //处理参照链接
        if (!!options.linkflag) {
            $child.attr('linkflag', true);
            $child.prev('label').last().attr('linkflag',true);
        }

        //处理配置项
        var refData = {};
        var props = ['refId', 'refKey', 'refCode', 'refName', 'refRelation', 'refPath', 'refShowMode','refFocused', 'filters', 'linkflag', 'linkappid', 'linkpkname'];
        props.forEach(function (p, i) {
            if (options[p] != null) {
                refData[p] = options[p];
            }
            var methodName='set'+p.charAt(0).toUpperCase()+p.slice(1);
            if (!this[methodName]) {//如果不存在对应的方法，就定义相关的set方法
                this[methodName] = function (value) {
                    this._opts[p] = value;
                };
            }
            delete options[p];
        });
        var refShowMode = this.getElement().get(0).dataset["showmode"];
        if (refShowMode) {
            refData["refShowMode"] = refShowMode;
        }
        this._set_data("refData", refData);
        //可选的查询参数
        this._queryData = options.queryData && typeof options.queryData === 'object' ? options.queryData : {};
        delete options.queryData;
        //可选的弹出窗口大小
        this._popSize = options.popSize && typeof options.popSize === 'object' ? options.popSize : {};
        delete options.popSize;
        //设置别名,兼容以前的代码
        this._opts = refData;
        //处理readOnly nullable noinput value属性
        this.setReadOnly(!!options.readOnly);
        if (options.isNullable != null) {
            this.setNullable(options.isNullable);
        }
        delete options.isNullable;


        if (options.value != null) {
            if (options.text) { this.setValue(options.value, options.text); }
            this.setValue({ value: options.value, code: options.code, name: options.name }); //
        }
        delete options.value;
        delete options.code;
        delete options.name;
        delete options.text;

        var that = this;
        //监听change事件
        this.on('change', function (data) {

            data = data&&data[0];
            var opts = that._opts;
            var refKey = opts['refKey'],
                refCode = opts['refCode'],
                refName = opts['refName'];
            if (!data || data['key']==null) {
                that.setValue('', '');
                return;
            }
            
            that.setValue({
                value: data['key'],
                code: data['code'],
                name: data['name']
            });
            //this._get_data("$input").trigger('focus');
            ///this._get_data("$input")[0].focus();
            //在点击其他元素的事件处理过程中，通过focus方法使input获得焦点时存在一些问题；需要设置延迟执行。(上面两种方法不能获取到焦点)
            //setTimeout(this._setFocus, 0);
        });


    };



    //支持两种参数形式：
    /*
    value,text;
    {
    value:'qwerqwerqw'
    code:'123',
    name:'asfasd'
    }
    */
    control.prototype.setValue = function (data) {//data包含value、code、name属性
        var text = this.transferData2Text(data.code, data.name);

        this._set_data("value", data.value);
        this._set_data("text", text);//text表示非编辑态下显示的文本
        this._set_data("code", data.code);
        this._set_data("name", data.name);

        this._get_data("$input").is("input") ? this._get_data("$input").val(text) : this._get_data("$input").html(text);
    };
    control.prototype.getValue = function () {
        return this._get_data("value");
    };
    //获取当前值对应的显示文本,与焦点状态相关
    control.prototype._getDisplayText = function (focused) {
        var code = this._get_data('code');
        var name = this._get_data('name');
        //焦点状态下默认显示code，非焦点状态下默认显示name；
        var showMode = focused ? (this._opts.refFocused || 'Code') : (this._opts.refShowMode || 'Name');
        var text = this.transferData2Text(code, name, showMode);
        return text;

    };
    control.prototype.getText = function () {
        return this._get_data("$input").is("input") ? this._get_data("$input").val() : "";
    };
    control.prototype.transferData2Text = function (code, name,showMode) {
        //var refShowMode=this._get_data();
        if (!code && !name) return '';

        var refData = this._get_data('refData');
        var refShowMode = showMode||refData.refShowMode || 'Name';
        code = code || '';
        name = name || '';
        return refShowMode === 'Name' ? name : (refShowMode === 'Code' ? code : code + '-' + name);

    };
    control.prototype.select = function () {
        if (this._get_data("$input").is("input")) {
            this._get_data("$input").select();
        }
    }

    control.prototype.setReadOnly = function (val) {
        if (this._get_data("$input").is("input")) {
            if (val) {
                this._get_data("$input").attr("readOnly", "readonly");
                this.getElement().attr("readOnly", "readonly");
            }
            else {
                this._get_data("$input").removeAttr("readOnly");
                this.getElement().removeAttr("readOnly");
            }
        }
        else {
            val ? this.getElement().bind("click", _readOnly) : this.getElement().unbind("click", _readOnly);
        }
        this._readOnly = !!val;
    };

    control.prototype.getReadOnly = function () {
        return !!this._readOnly;
    };
    control.prototype.getVisible = function () {
        return this.getElement().css("display") === "none";
    };
    control.prototype.setVisible = function (visible) {
        this.getElement()[!!visible ? 'show' : 'hide']();
    };
    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent();
        visible === false ? $parent.hide() : $parent.show();
    };
    control.prototype.setNullable = function (val) {
        var $label = this.getElement().prev();
        if (!$label.length) return;
        $label.toggleClass("mustinput", !val);
    };
    control.prototype.setNoinput = function (val) {
        var $label = this.getElement().prev();
        var $parent;
        if (this._get_data("$input").is("input")) $parent = this.getElement();
        else $parent = this._get_data("$input");
        $label.toggleClass("mustinput-noinput", val);
        $parent.toggleClass("parentdiv-noinput", val);
    };


    $.extend(control.prototype, cb.events);

    $.extend(control.prototype, {
        _onclick: function () {
        	debugger;
            if (this.getReadOnly()) return;
            
            this.execute('beforeRefer');
            var refCode = this._opts["refId"];
            var refPath = this._opts["refPath"];
            if (!refCode) return;

            var filterValue = this._getSearchText();
            //var externalFilters = this._getExternalFilters();
            var parentViewModelName = this.getElement().closest('[data-viewmodel]').data('viewmodel');

            var parentViewModel = cb.cache.get(parentViewModelName);
            if (!parentViewModel) return;

            var queryData = this._getQueryData();
            var popSize = this._getPopSize();
            //zhangxub
            if (refPath && refPath.length > 0) {
                cb.route.loadPageViewPart(parentViewModel, refPath, { queryData: queryData, width: popSize && popSize.width,height:popSize && popSize.height, callBack: $.proxy(this._callBack, this) });
                return;
            }


            // fangqg：获取要打开的参照类型，2为树表参照，目前其他为表参照。
            var callback = $.proxy(this._callBack, this);
            _proxy.getReferType($.extend(true, { refCode: refCode }, queryData), function (success, fail) {
                cb.route.loadPageViewPart(parentViewModel, cb.route.CommonAppEnum[success && success.refType == 2 ? 'Refer' : 'ReferTable'], { queryData: queryData, queryString: { refCode: refCode }, "refCode": refCode, "filters": filterValue, callBack: callback });
            });
        },
        _getQueryData: function () {
            var queryData = $.extend(true, {}, this._queryData);
            return this._queryData;
        },
        _getPopSize: function () {
            var popSize = $.extend(true, {}, this._popSize);
            return popSize;
        },
        _callBack: function (args) {//args为一条或多条记录

            //setTimeout(this._setFocus, 0);

            var keyField = this._opts["refKey"] || "pk_org";
            var codeField = this._opts["refCode"] || "code";
            var nameField = this._opts["refName"] || "name";

            var data = cb.clone(args && args.data && args.data);
            //var refReturnData = { keyField: keyField, codeField: codeField, nameField: nameField, data: data };
            //if (cb.isEqual(refReturnData, this._opts['refReturnData']) return;

            //断言：data为一个普通的数据对象或一个长度至少为1的对象数组，否则输入参数有问题
            var multiple =false;; //是否选择多条记录
            if (cb.isArray(data)) {
                if (data.length == 1) {
                    data = data[0];
                } else {
                    multiple = true;
                }
            }
            //目前只处理选择一条数据
            //if (multiple) {
            //    multiple = false;
            //    data = data[0];
            //}
            //参照值改变后，准备携带数据

            /*第一步直接从返回结果中取数据，取不到的，再发请求到服务器取数据*/
            var refRelation = this._opts["refRelation"] || '';
            //var refData = this._opts['refReturnData'].data.data;
            var noExists = new Array();

            var relations = refRelation.split(",");
            for (var i = 0; i < relations.length; i++) {
                var st = relations[i].split("=");
                if (st.length != 2) continue;
                var target = st[0];
                var source = st[1];
                /*
                //var targetModel = model.getParent().get(source);
                if (targetModel) {
                if (targetModel.get("ctrlType") && targetModel.get("ctrlType").toLocaleLowerCase() === "refer") {
                noExists.push(relations[i]);
                } else {
                var fieldValue = refData.data.data[target];
                if (fieldValue) {
                targetModel.setValue(fieldValue);
                }
                else {
                noExists.push(relations[i]);
                }
                }
                }
                */
                //如果返回的值中没有要携带的字段值
                if (!multiple && !data.hasOwnProperty(source) || multiple && !data[0].hasOwnProperty(source)) {
                    noExists.push(relations[i]);
                }
            }
            //判断参照是否有变化
            if (!multiple && data[keyField] == this.getValue()) {
                this._get_data("$input").val(this._get_data('text'));
                return;
            }

            //处理参照携带
            if (!noExists.length) {
                //this._opts.selected = data;
                data = this._filterData(data);
                this.execute('change', data);
            } else {
                var keys;
                if (multiple) {
                    keys=[];
                    $.each(data, function (i,item) {
                        keys.push(item[keyField]);
                    });
                    keys = keys.join(',');
                } else {
                    keys = data[keyField]
                }
                this._getReferCarrier(noExists, keys, data);
            }


        },
        _getReferCarrier: function (noExists, primaryKeys, datas) {
            var refCode = this._opts["refId"];
            if (!refCode) return;

            var that = this;

            if (noExists.length > 0) {
                var rela = noExists.join(",");
                ReferLoader.loadCarrier(refCode, primaryKeys, rela, function (success, fail) {
                    if (fail) {
                        var $input = that._get_data("$input");
                        $input.val('');
                        $input.trigger('change');
                        alert(fail.error);
                        return;
                    }

                    //that._setReferCarrier(success);
                    //处理携带的信息
                    var map = that._parseRefRelation(rela);

                    if (cb.isArray(success)) {//兼容以前的只传一个key的情况，以前值返回一个关于指定key的参照携带的数组
                        success = ({})[primaryKeys] = success;
                        if (!cb.isArray(datas)) {
                            datas = [datas];
                        }
                    }
                    var data,targets;
                    var keyField=that._opts['refKey'];
                    for(var i=0;i<datas.length;i++){
                        data=datas[i];
                        targets=success[data[keyField]];
                        if (cb.isArray(targets)) {//每个数组项表示一个字段的信息
                            //[{targetFld:'department',targetFldType:'1',targetData:{keyField:'id',codeField:'code',nameField:'name',data:[{id:'资金科',code:'1111',name:'1001ZZ10000000002J23'}]}},
                            //{targetFld:'persondate',targetFldType:'0',targetData:'2014-04-29 20:40:28']
                            for (var i = 0; i < targets.length; i++) {
                                var target = targets[i];
                                //if (target.targetData) {
                                data[map[target.targetFld]] = target.targetData || '';
                                //}
                            }
                        } 
                    }
                    //that._opts.selected = data;
                    datas = that._filterData(datas);
                    that.execute('change', datas);
                });
            }
        },
        _parseRefRelation: function (refRelation) {
            var pairs = refRelation.split(',');
            var r = /\s*=\s*/;
            var map = {};
            for (var i = 0, len = pairs.length; i < len; i++) {
                var match = pairs[i].split(r);
                if (match && match.length == 2) {
                    var target = match[0];
                    var source = match[1];
                    map[target] = source;
                }
            }
            return map;
        },
        //过滤多余的信息，只获取pk，code，name和其他指定要携带的字段值
        //被携带的值可能是一个简单的值，也可能是一个表示参照信息的对象，格式为{keyField:'id',codeField:'code',nameField:'name',data:[{id:'1001ZZ10000000002J23',code:'1111',name:'资金科'}]}
        _filterData: function (selected) {
            if (selected == null) return null;
            if (!cb.isArray(selected)) {
                selected = [selected];
            }
            var arr = [];
            var opts = this._opts;
            var refKey = opts['refKey'],
                refCode = opts['refCode'] || 'code',
                refName = opts['refName'] || 'name',
                refRelation = opts['refRelation'] || '',

                targetFlds = refRelation ? refRelation.match(/\w+(?=\s*=\s*[\w\.]+)/g) : [],
                sourceFlds = [];
            refRelation.replace(/\w+\s*=\s*([\w\.]+)/g, function ($0, $1) {
                sourceFlds.push($1);
                return '';
            });
            var data, result;
            for (var j = 0, length = selected.length; j < length; j++) {
                data = selected[j];
                if (!data) continue;
                result = {};
                result['key'] = data[refKey];
                result['code'] = data[refCode];
                result['name'] = data[refName];
                var targets = {};
                for (var i = 0, len = targetFlds.length; i < len; i++) {
                    targets[targetFlds[i]] = data[sourceFlds[i]];
                }
                result['targets'] = targets;
                result['data'] = cb.clone(data); //存选中参照的所有的数据

                arr.push(result);
            }
            
            return arr;
        },
        _loadRefer: function () {
            cb.console.log("_loadRefer start: ", this);
            this.execute('beforeRefer');
            var refCode = this._opts["refId"];
            if (!refCode) return;

            var that = this;

            //var filters = this._getExternalFilters();
            //filters.unshift({ 'value': this._getSearchText() });
            var filters = [{ 'value': this._getSearchText() }];
            
            var queryData = that._getQueryData();

            ReferLoader.loadRefer(refCode, filters, function (success, fail) {
                if (fail) {
                    var $input = that._get_data("$input");
                    $input.val('');
                    $input.trigger('change');
                    alert(fail.error);
                    return;
                }
                //取得数据后，相当于在参照界面中选择某条数据，按确定
                if (success.table && success.table.currentPageData) {
                    var cData = success.table.currentPageData;
                    if ($.isArray(cData) && cData.length > 0) {
                        var data = { "data": success.table.currentPageData[0] }
                        that._callBack(data);
                    } else {
                        //that.select();
                        var $input = that._get_data("$input");
                        $input.val('');
                        $input.trigger('change');
                        //$input[0].focus();
                    }
                }
            }, queryData);
        },
        _getExternalFilters: function () {
            var tempFilters = [];
            if (this._opts.filters) {
                if (cb.isArray(this._opts.filters)) {
                    tempFilters.push.apply(tempFilters, this._opts.filters);
                } else if (typeof this._opts.filters.getter === 'function') {
                    tempFilters.push.apply(tempFilters, this._opts.filters.getter.call(this._opts.filters.context));
                }
            }
            var filters = [];
            $.each(tempFilters, function (i, filter) {
                if (filter != null && filter != '') {
                    filters.push({ value: filter });
                }
            });
            return filters;
        },

        _onchange: function (refReturnData) {
            /*
            var model = this.getModel();
            if (!model) return;
            if (typeof refReturnData !== "object") {
            if (refReturnData === "") {
            model.setValue("");
            }
            else {
            this._loadRefer();
            }
            //model.setValue(refReturnData);
            return;
            }
            var refColumn = model.get("refColumn");
            if (!refColumn) return;
            var keyValue = refReturnData.data[refReturnData.keyField];
            model.set("refReturnData", refReturnData);
            model.setValue(keyValue);
            */
        },

        setData: function (opts) {
            this._init(opts);
        },
        setQueryData: function (queryData) {//queryData为对象
            this._queryData = cb.clone(queryData);
        },
        setFilters: function (data) {
            this._opts.filters = data;
        },
        //获取搜索文本（对getText的封装一次包装，以适应refShowMode为CodeName的情况）
        _getSearchText: function () {
            var refShowMode = this._opts["refShowMode"];
            var input = this.getText(); //输入的信息
            if (refShowMode === 'CodeName') {
                if (this._get_data('text') === input) {//如果文本框的值为当前参照对应的显示文本，则以参照的name值作为查询关键字
                    input = this._get_data('name') || this._get_data('code');
                }
            }

            return input;
        },
        setRefShowMode: function (mode) {
            this._opts['refShowMode'] = mode;
        },
        setLinkflag: function (linkflag) {
            this._opts['linkflag'] = !!linkflag;

            this.getElement().attr('linkflag', !!linkflag);
        },
        setLinkappid: function (linkappid) {
            this._opts['linkappid'] = linkappid;
        },
        setLinkpkname: function (linkpkname) {
            this._opts['linkpkname'] = linkpkname;
        },
        __end: ''

    });

    return control;
});