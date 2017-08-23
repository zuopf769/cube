/// <reference path="../../jquery/jquery.js" />
/// <reference path="json.js" />
/*
File: Cube.js
Author:fjf
Company:yonyou
Version:1.0
*/

var Cube = cb = {};

//#region global base api
cb.onReady = cb.ready = function (callback) {

    if (!callback) return;
    cb.events.on.call(cb, "ready", callback);

    if (!cb.readyBind) {
        bindReady();
    }

    function bindReady() {
        cb.readyBind = true;

        if (document.addEventListener) {
            // Mozilla, Opera and webkit 
            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false); // 使用事件回调函数
            window.addEventListener("load", cb.ready, false); // 绑定回调到load,使之能一定执行
        }
        else if (document.attachEvent) {
            // IE
            document.attachEvent("onreadystatechange", DOMContentLoaded);
            // 绑定回调到一定执行能load事件
            window.attachEvent("onload", cb.ready);
        }

        function DOMContentLoaded() {

            cb.console.log("ready", document.readyState);

            cb.events.execute.call(cb, "ready");
            cb.events.un.call(cb, "ready");

            if (document.removeEventListener)
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            if (document.detachEvent)
                document.detachEvent("onreadystatechange", DOMContentLoaded);

            cb.console.log("ready", document.readyState);
        }
    }
}

//扩展(支持数组项内的扩展)
cb.extend = function (target, src) {
    if (!src || typeof src != 'object') return target;

    target = target || {};
    var s, t;
    //处理数组的扩展
    if (src instanceof Array) {
        target = target instanceof Array ? target : [];
    }
    for (var i in src) {
        s = src[i];
        t = target[i];
        if (s && typeof s == 'object') {
            if (typeof t != 'object') t = {};
            target[i] = cb.extend(t, s);
        } else if (s != null) {
            target[i] = s;
        }
    }
    return target;
};

//定义新的类型，该方法待完善
cb.define = function (newClass, base, init, methods) {
    if (!newClass)
        return;
    if (typeof newClass == "string")
        window[newClass] = cb.namespace(newClass, true);
    window[newClass] = function (options) {
        if (base)
            base.call(this, options);
        this._executeInits(options);
    };

    if (base) {
        window[newClass].prototype = new base();
        window[newClass].prototype.constructor = window[newClass];
    }
    //初始化逻辑
    window[newClass].prototype._inits = [];
    window[newClass].addInit = function (func) {
        newClass.prototype._inits.push(func);
    }
    window[newClass].prototype._executeInits = function (options) {
        for (var i = 0; i < this._inits.length; i++) {
            this._inits[i].call(this, options);
        }
    }
    if (init)
        window[newClass].addInit(init);

    cb.extend(newClass, methods);
};

//定义命名空间
cb.namespace = function (ns, isFunction) {
    if (!ns || typeof ns != "string") return;

    var strs = ns.split(".");
    var parent = window;
    for (var i = 0, length = strs.length; i < length; i++) {
        var name = strs[i];
        if (name && !parent[name]) {
            if (isFunction && i == length - 1)
                parent[name] = function () { };
            else
                parent[name] = {};
        }
        parent = parent[name];
    }
    return parent;
};
//判断两个量是否值相等
cb.isEqual = function (obj1, obj2) {
    var isEqual = cb.isEqual;
    //相等直接返回
    if (obj1 == obj2) { return true; }
    //不等且有一个为普通类型时，返回
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    //如果两个都是对象，分数组和普通对象分别处理
    var type1 = Object.prototype.toString.apply(obj1),
        type2 = Object.prototype.toString.apply(obj2);
    //有一个为数组时	
    if (type1 === '[object Array]' || type2 === '[object Array]') {
        if (type1 === type2) {//都为数组
            if (obj1.length !== obj2.length) return false;
            for (var i = obj1.length - 1; i >= 0; i--) {
                if (!isEqual(obj1[i], obj2[i])) return false;
            }
            return true;
        } else {
            return false;
        }
    } else {//都为对象
        var equalProps = {};
        for (var p in obj1) {
            if (!isEqual(obj1[p], obj2[p])) {
                return false;
            } else {
                //记录这个属性，避免重复比较
                equalProps[p] = true;
            }
        }
        for (var p in obj2) {
            if (!equalProps[p] && !isEqual(obj1[p], obj2[p])) {
                return false;
            }
        }
        return true;
    }

};
/**
*这个方法目前还不支持urls中的脚步按序执行
cb.require = function (urls, callback) {
var jsLoaderCache = cb.cache.jsLoaderCache = (cb.cache.jsLoaderCache || {});
for (var i = 0; i < urls.length; i++) {
if (!jsLoaderCache[urls[i]])
cb.getScript(urls[i], callback);
}
};
*/
//#endregion

//值转换
cb.convert = {}; //

//#region 事件管理
cb.events = {};
cb.events.on = cb.events.bind = function (name, callback, context) {
    if (!name || !callback)
        return;
    name = name.toLowerCase(); //一律使用小写
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({ callback: callback, context: context });
}
cb.events.un = function (name, callback) {
    if (!name || !this._events)
        return;
    name = name.toLowerCase(); //一律使用小写

    if (!this._events[name])
        return;

    if (!callback)
        delete this._events[name]; //this._events[name] = null;
    else {
        var index = this._events[name].findIndex(function (value, i, list) {
            if (value.callback === callback)
                return true;
        });
        if (index !== -1) {
            this._events[name].removeData(this._events[name][index]);
        }
    }
}

cb.events.hasEvent = function (name) {
    if (!name) return;
    name = name.toLowerCase(); //一律使用小写
    return (name && this._events && this._events[name] && this._events[name].length > 0);
}
cb.events.execute = function (name) {
    if (!name) return;
    name = name.toLowerCase(); //一律使用小写
    var events = this._events ? this._events[name] : null;
    if (!events)
        return true;
    var result = true;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < events.length; i++) {
        result = events[i].callback.apply(events[i].context || this, args) === false ? false : result;
    }

    return result;
}

//#endregion 

//#region 属性处理
cb.property = {};
cb.property._getterPrefix = "get";
cb.property._setterPrefix = "set";

cb.property.init = function (propertyName) {
    if (!propertyName)
        return;
    var upperPropertyName = propertyName;
    //var upperPropertyName = propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1, propertyName.length);

    this[cb.property._getterPrefix + propertyName] = this[cb.property._getterPrefix + upperPropertyName] = function (attrName) {
        var property = this.get(propertyName);
        return (attrName && property && property.get) ? property.get(attrName) : property;
    };

    //支持setXXX(value),setXXX(object),setXXX(cb.model.BaseModel),setXXX(attrName,value)
    this[cb.property._setterPrefix + propertyName] = this[cb.property._setterPrefix + upperPropertyName] = function (data) {
        var property = this.get(propertyName);
        if (!property) return;
        if (arguments.length == 1)
            (property.setData && !(data instanceof cb.model.BaseModel)) ? property.setData(data) : this.set(propertyName, data);
        else if (arguments.length == 2 && arguments[0] && property.setData)
            property.setData(arguments[0], arguments[1]);
    };

    return;

    this[property] = function (attrName, value) {
        if (arguments.length == 0) {
            return this.get(property);
        }
        else if (arguments.length == 1) {
            var prop = this.get(property);
            if (!prop || !attrName) {
                return prop;
            }
            if (prop.get) {
                if (typeof attrName == "string")
                    return prop.get(attrName); // && typeof attrName == "string"
            }
            else {
                value = attrName;
                this.set(property, value);
                return prop;
            }
            value = attrName;
            if (value.constructor == Object && prop.set) {
                for (var attr in value) {
                    if (typeof value[attr] == "function")
                        prop.on(attr, value[attr]);
                    else
                        prop.set(attr, value[attr]);
                }
            }
            else {
                this.set(property, value);
            }
            return prop;
        }
        else if (attrName) {
            var prop = this.get(property);
            if (!prop)
                return;
            if (prop.on && prop.set) {
                if (typeof value == "function")
                    prop.on(attrName, value);
                else
                    prop.set(attrName, value);
            }
        }
        else if (value) {
            this.set(property, value);
        }
    }
}
cb.property.remove = function (property) {
    delete this[cb.property._getterPrefix + property];
    delete this[cb.property._setterPrefix + property];
    //delete this[property];
    if (this._data)
        delete this._data[property];
}

//#endregion

//#region cache

cb.cache = {
    get: function (cacheName) { return this[cacheName]; },
    set: function (cacheName, value) { this[cacheName] = value; },
    clear: function () {
        for (var attr in this)
            if (attr != "get" && attr != "set" && attr != "clear")
                delete this[attr];
    }
};
cb.cache.viewmodels = { get: cb.cache.get, set: cb.cache.set, clear: cb.cache.clear };
cb.cache.controls = { get: cb.cache.get, set: cb.cache.set, clear: cb.cache.clear };
cb.cache.newIds = { get: cb.cache.get, set: cb.cache.set, clear: cb.cache.clear };
cb.cache.bindings = { get: cb.cache.get, set: cb.cache.set, clear: cb.cache.clear };
cb.cache.mappings = { get: cb.cache.get, set: cb.cache.set, clear: cb.cache.clear };

//#endregion

//#region model

cb.model = {};
cb.model.create = function (options) {
    var model = new cb.model.BaseModel();
}
cb.model.PropertyChangeArgs = function (modelName, propertyName, value, oldValue) {
    this.ModelName = modelName;
    this.PropertyName = propertyName;
    this.OldValue = oldValue;
    this.PropertyValue = this.Value = value;
};
cb.model.PropertyChangeArgs.prototype.toString = function () {
    return "###ModelName:" + this.ModelName + ",PropertyName:" + this.PropertyName + ",PropertyValue:" + this.PropertyValue + ",OldValue:" + this.OldValue;
}
cb.model.PropertyChange = function (scope, propertyChangeArgs) {

    //cb.console.log("Start cb.model.PropertyChange");

    if (!scope || !propertyChangeArgs)
        return;

    cb.console.log("ModelName:\"" + scope.getModelName() + "\"(cb.model.PropertyChange)---propertyChangeArgs: ");
    cb.console.log(propertyChangeArgs)

    if (scope._listeners) {
        for (var i = 0; i < scope._listeners.length; i++)
            scope._listeners[i].PropertyChangeEvent(propertyChangeArgs);
    }
    var _parent = scope.getParent();
    if (_parent && _parent.PropertyChange) {
        cb.model.PropertyChange(_parent, propertyChangeArgs); //_parent.PropertyChange(propertyChangeArgs);
    }
    if (scope.afterPropertyChange)
        scope.afterPropertyChange(propertyChangeArgs);

    //cb.console.log("End cb.model.PropertyChange");
}
//延迟更新到界面的方式（Auto：自动延迟，Manual：手动延迟，None：不延迟；默认不延迟）
cb.model.PropertyChange.DelayMode = { Auto: "Auto", Manual: "Manual", None: "None" };
cb.model.PropertyChange.delayPropertyChange = function (delay) {
    if (cb.model.PropertyChange._delayPropertyChange)
        return;
    cb.model.PropertyChange._delayPropertyChange = delay;
    cb.model.PropertyChange._delayPropertyChangeContexts = {};
}
cb.model.PropertyChange.isDelayPropertyChange = function () {
    return cb.model.PropertyChange._delayPropertyChange;
}

cb.model.PropertyChange.add = function (context) {
    if (!this.isDelayPropertyChange()) {
        this(context.Scope, context.PropertyChangeArgs);
        return;
    }
    var args = context.PropertyChangeArgs;
    var key = args.ModelName + "_" + args.PropertyName;
    //合并同一种改变，以最后一次改变为准(优化触发界面改变的次数)
    for (var attr in this._delayPropertyChangeContexts) {
        if (attr == key && this._delayPropertyChangeContexts[attr].Scope == context.Scope) {
            this._delayPropertyChangeContexts[attr] = context;
            return;
        }
    }
    this._delayPropertyChangeContexts[key] = context;
}
cb.model.PropertyChange.doPropertyChange = function () {
    cb.monitor.start();
    //console.profile("Start doPropertyChange");
    cb.console.log("Start doPropertyChange");
    cb.model.PropertyChange._delayPropertyChange = false;
    for (var attr in this._delayPropertyChangeContexts)
        if (this._delayPropertyChangeContexts[attr])
            this(this._delayPropertyChangeContexts[attr].Scope, this._delayPropertyChangeContexts[attr].PropertyChangeArgs);
    this._delayPropertyChangeContexts = {};

    cb.monitor.stop();
    cb.console.log("end doPropertyChange");
    //console.profileEnd();
    cb.console.log("doPropertyChange:: " + cb.monitor.timeSpan());
}

// UNCHANGED = 0;//不变化
// UPDATED = 1;//更新
// NEW = 2;//新增
// DELETED = 3;//删除
cb.model.DataState = {
    Add: 2,
    Delete: 3,
    Update: 1,
    Unchanged: 0
};

// #region BaseModel

cb.model.BaseModel = function (parent, name, data) {

    if (typeof arguments[0] == "object" && !name && !data) {
        //如果值传递一个参数_data对象,后续优化成一个options参数
        data = parent;
        parent = null;
        name = null;
    }
    this._parent = parent;
    this._name = name;
    this._data = data || {};
    this._cache = {};
    if (!data)
        return;

    //事件处理
    for (var attr in this._data) {
        if (typeof this._data[attr] == "function") {
            this.on(attr, this._data[attr]);
            delete this._data[attr];
        }
    }
    //大小写适应, 后续需要考虑其他方案
    //this._data.value = this._data.value || this._data.Value || null;
    if (!this._data.value) {
        //delete this._data.value;
        //delete this._data.Value;
    }
    if (!(this instanceof cb.model.Model3D)) {//Model3D默认readOnly:true，初始化data中设置了readOnly为false不应该处理掉。
        this._data.readOnly = this._data.readOnly || this._data.ReadOnly || this._data.readonly || false;
        if (!this._data.readOnly) {
            delete this._data.ReadOnly;
            delete this._data.readOnly;
            delete this._data.readonly;
        }
    }

    this._data.disabled = this._data.disabled || this._data.Disabled || false;
    if (!this._data.disabled) {
        delete this._data.disabled;
        delete this._data.Disabled;
    }
}
cb.extend(cb.model.BaseModel.prototype, cb.events); //事件扩展
cb.model.BaseModel.prototype.addListener = function (listener) {
    if (!this._listeners)
        this._listeners = [];
    if (this._listeners.indexOf(listener) < 0)
        this._listeners.push(listener);
}
cb.model.BaseModel.prototype.removeListener = function (listener) {
    if (this._listeners)
        this._listeners.removeData(listener);
}
cb.model.BaseModel.prototype.PropertyChange = function (propertyChangeArgs) {
    cb.model.PropertyChange.add({ Scope: this, PropertyChangeArgs: propertyChangeArgs });
}
//支持数据对象，考虑跟set合并成一个方法
cb.model.BaseModel.prototype.setData = function (data) {
    cb.console.log("BaseModel.setData", this);
    if (arguments.length == 0)
        return;

    //如果只传递一个参数，且值为空或者值不为object类型，则默认是给value赋值。
    if (arguments.length == 1 && (cb.isEmpty(data) || typeof data != "object")) {
        //data = { "value": data };
        this.setValue(data, true); //只有参照对应的model才会识别第二个参数
        return;
    }

    //如果传递两个参数，则传递的是属性名 + 值
    if (arguments.length == 2 && arguments[0]) {
        //var tempData = {};
        //tempData[arguments[0]] = arguments[1];
        //data = tempData;
        this.set(arguments[0], arguments[1]);
        return;
    }

    //this._data = this._data || {};
    //传递对象object，则需要挨个属性赋值
    for (var attr in data) {
        (typeof data[attr] == "function") ? this.on(attr, data[attr]) : this.set(attr, data[attr]);

        //value=data[attr];
        //if (typeof value == "function") {
        //    this.on(attr, value);
        //}
        //else if (this._data.hasOwnProperty(attr)) {
        //    var oldValue = this._data[attr];
        //    if (oldValue === value)
        //        continue;
        //    this._data[attr] = value;
        //}
        //else if (!cb.isEmpty(value)) {
        //    this._data[attr] = value;
        //}
    }

    //this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue)); //后期改成批量操作，操作传递到前台用批量方式
    cb.console.log("BaseModel.setData", this);
}
cb.model.BaseModel.prototype.getData = function (propertyName) {
    return (this._data && this._data.isNeedCollect !== false) ? (propertyName ? this._data[propertyName] : this._data) : null;
}
cb.model.BaseModel.prototype.reset = function () {
    this.setData(this._originalData);
};
cb.model.BaseModel.prototype.restore = function () {

};
cb.model.BaseModel.prototype.backUp = function () {
    if (!this._backUp)
        this._backUp = [];
    this._backUp.push();
};
cb.model.BaseModel.prototype.isDirty = function () { };
cb.model.BaseModel.prototype.set = function (propertyName, value) {
    cb.console.log("BaseModel.set Start", this);
    var oldValue;
    if (propertyName === "readOnly" && this.get("alwaysReadOnly") === true) {
        if (!value)
            cb.console.warn("由于alwaysReadOnly=true，所以永远只读不可改！", this); //增加判断及提示，如果是alwaysReadOnly=true，则永远只读
        value = true;
        oldValue = this._data[propertyName];
    }
    else
        oldValue = this.get(propertyName);
    if (oldValue === value)
        return;
    this._data[propertyName] = value; //if(value==undifined)delete this._data[propertyName];
    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue));
    cb.console.log("BaseModel.set End");
}
cb.model.BaseModel.prototype.get = function (propertyName) {
    if (!this._data)
        return null;
    if (propertyName === "readOnly")
        return this._data["alwaysReadOnly"] || this._data[propertyName];
    return propertyName ? this._data[propertyName] : this._data;
}
cb.model.BaseModel.prototype.setReadOnly = function (value) {
    if (this.getReadOnly() === value)
        return;
    this.set("readOnly", value);
}
cb.model.BaseModel.prototype.getReadOnly = function () {
    return this.get("readOnly");
}
cb.model.BaseModel.prototype.setDisabled = function (value) {
    if (this.getDisabled() === value)
        return;
    this.set("disabled", value);
}
cb.model.BaseModel.prototype.getDisabled = function () {
    return this.get("disabled");
}
cb.model.BaseModel.prototype.setParent = function (parent) {
    this._parent = parent;
}
cb.model.BaseModel.prototype.getParent = function () {
    return this._parent;
}
cb.model.BaseModel.prototype.getModelName = function () {
    return this._name;
}
cb.model.BaseModel.prototype._$getId = function (obj) {
    return (obj || this)._$id;
};
cb.model.BaseModel.prototype._$setId = function (obj) {
    obj._$id = Math.random();
};
cb.model.BaseModel.prototype.checkPropCtrlType = function (prop) {
    return prop.get("controlType") === cb.ControlType.Button
        || prop.get("ctrlType") === cb.ControlType.Button
        || prop.get("controlType") === cb.ControlType.ImageButton
        || prop.get("ctrlType") === cb.ControlType.ImageButton
        || prop.get("controlType") === cb.ControlType.DropDownButton
        || prop.get("ctrlType") === cb.ControlType.DropDownButton
        || prop.get("controlType") === cb.ControlType.Label
        || prop.get("ctrlType") === cb.ControlType.Label
        || prop.get("controlType") === cb.ControlType.SearchButton
        || prop.get("ctrlType") === cb.ControlType.SearchButton
        || prop.get("controlType") === cb.ControlType.Pagination
        || prop.get("ctrlType") === cb.ControlType.Pagination
};

cb.model.BaseModel.prototype.fireEvent = function (eventName, args) {
    if (this.beforeExecute(eventName, args)) {
        this.execute(eventName, args);
        this.afterExecute(eventName, args);
        return true;
    }
};
cb.model.BaseModel.prototype.beforeExecute = function (eventName, args) {
    return this.execute("before" + eventName, args);
};
cb.model.BaseModel.prototype.afterExecute = function (eventName, args) {
    return this.execute("after" + eventName, args);
};
cb.model.BaseModel.prototype.cache = function (key, value) {
    if (!key) return;
    if (value == null) {
        return this._cache[key];
    } else {
        this._cache[key] = value;
    }
};

// #endregion

// #region SimpleModel

cb.model.SimpleModel = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);

    this.setDataSource = function (ds) {
        if (this.beforeExecute("dataSourceChange", ds)) {
            this.set("dataSource", ds);
            this.afterExecute("dataSourceChange", ds);
            return true;
        }
    };
    this.getDataSource = function () {
        return this.get("dataSource");
    };

    this._dataSourceModel = null;

    this.setDataSourceModel = function () {
        if (!this._dataSourceModel) {
            this._dataSourceModel = cb.viewmodel.create({
                DataSource: new cb.model.Model3D()
            });
            this._dataSourceModel._parent = this;
        }
        this._dataSourceModel.initListeners();
    };
    this.getDataSourceModel = function () {
        return this._dataSourceModel;
    };

    //编码名称
    this.setValue = function (value, nameValue) {
        if (value === this.getValue())
            return false;
        this.valueChange(value);   //this.set("value", value);
    }
    this.getValue = function () {
        return this.get("value");
    }
    this.setState = function (propertyName, value) {
        this.set(propertyName, value);
    }
    this.getState = function (propertyName) {
        return this.get(propertyName);
    }
    this.valueChange = function (value) {
        var args = { Value: value, OldValue: this.getValue() };
        if (this.beforeExecute("valueChange", args)) {
            this.set("value", value);
            this.afterExecute("valueChange", args);
            return true;
        }
        return false;
    };
    this.change = function (newValue) {
        var oldValue = this.getValue();
        if (newValue === oldValue)
            return false;
        var args = { Value: newValue, OldValue: oldValue };
        if (this.beforeExecute("change", args)) {
            if (this.execute("change", args))
                this.valueChange(newValue);
            this.afterExecute("change", args);
            return true;
        }
        return false;
    };
    this.click = function (args) {
        this.fireEvent("click", args);
    }

    //修正refer使用的model的setValue方法
    var ctrlType = this.get("ctrlType");
    if (ctrlType === "Refer") {
        cb.hacks.setReferValue(this);
    } else if (ctrlType === "DateBox" || ctrlType === "DateTimeBox") {
        cb.hacks.setDateValue(this);
    }
}
cb.model.SimpleModel.prototype = new cb.model.BaseModel();

/****************校验数据有效性***************
* 规则如下：
*  1.button,buttongroup 不校验
*  2.主键不校验，即 isKey == true,因为保存时还没有主键
*  3.isNullable==true的不校验，即设置可以为空的属性
*  4.不可见但是必输的，不做校验，因为用户不能在界面中数据数据
* 返回定义如下：
*  { isValid:true|false,info:"字符串" }
***********************************************/
cb.model.SimpleModel.prototype.validate = function () {
    var prop = this;
    var result = { isValid: true };
    if (!this.get || this.checkPropCtrlType(this) ||
        (this.get("isKey") == true || this.get("isKey") == "true"))
        return result;
    if (prop.get("isNullable") === false || prop.get("isNullable") === "false") {
        if (prop.get("isVisible") === false || prop.get("isVisible") === "false") return result;
        var value = prop.getValue();
        // 对于组合控件如CheckTextBox加一下isValid判断
        var isValid = prop.get("isValid");
        if ((value !== 0 && value !== false && !value) || (isValid != null && isValid !== true)) {
            var message = (prop.get("title") || prop.getModelName());
            cb.console.error((prop.get("title") || prop.getModelName()) + "不能为空！");
            prop.set("noinput", true);
            result = { isValid: false, info: message };
        }
        else {
            prop.set("noinput", false);
        }
    }
    return result;
};
cb.model.SimpleModel.prototype.cancelValidate = function () {
    if (this.get("isNullable") === false && this.get("noinput") === true) {
        this.set("noinput", false);
    }
};

// #endregion

// #region Model2D

cb.model.Model2D = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);

    //数据格式：    
    this._data = this._data || {};
    this._data.Rows = this._data.Rows || [];  //[{ ID: 1, Code: "0001", Name: "123455", Parent: null, Children: []}];
    this._data.Columns = this._data.Columns || {};  //{ ID: {}, Code: {}, Name: {} };
    this._data.DisplayColumn = this._data.DisplayColumn || ""; // "Name[ID]"; //可以是表达式，具体根据实际需要改造,表达式如"exp({ID}/{Name}/{Parent})"等等
    this._data.KeyColumn = this._data.KeyColumn || "";  // "ID"
    this._data.RefColumn = this._data.RelColumn || "";  // "Parent"
    this._data.focusedRow = -1;
    this._data.PageInfo = this._data.PageInfo || { pageSize: 0, pageIndex: 1, pageCount: 1, totalCount: 0 };

    this.getDisplayContent = function (row) {
        return row && row[this._data.DisplayColumn]; //处理非表达式情况
    };

    //在某个已知节点前增加新节点
    this.addBefore = function (row, row_exist) {
        row_exist = this.find(row_exist[this._data.KeyColumn]);
        if (row_exist != null) {
            var index = this._getChildIndex(row_exist.parent, row_exist);
            this._addChildAtPosition(row_exist.parent, index, row);

            this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "addBefore", { row: row, row_exist: row_exist }));
        }
    }

    //在某个已知节点前增加新节点
    this.addAfter = function (row, row_exist) {
        row_exist = this.find(row_exist[this._data.KeyColumn]);
        if (row_exist != null) {
            var index = this._getChildIndex(row_exist.parent, row_exist);
            this._addChildAtPosition(row_exist.parent, index + 1, row);

            this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "addAfter", { row: row, row_exist: row_exist }));
        }
    }

    //#region "私有方法"
    this._setParent = function (parentRow, row) {
        row.parent = parentRow;
        return parentRow;
    }

    this._addChildAtPosition = function (parentRow, index, row) {
        parentRow.children.splice(index, 0, row);
        return this._setParent(parentRow, row);
    };

    this._getChildIndex = function (parentRow, row) {
        return $.inArray(row, parentRow.children);
    };

    //#endregion

    this.add = function (row, parentValue) {
        var parent = parentValue ? this.find(parentValue) : this._data.Rows;
        if (!parent)
            return;
        if (!parent.children)
            parent.children = [];
        parent.children.push(row);
        row.parent = parent;
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "add", { row: row, parent: parent }));
    };

    this.remove = function (row) {
        var parent = row.parent != null ? row.parent : this._data.Rows;
        if (row.parent != null) {
            row.parent.children.splice(this._getChildIndex(row.parent, row), 1);
        }
        else {
            this._data.Rows.splice($.inArray(row, this._data.Rows), 1);
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "remove", row));
        if (row == this.getFocusedRow()) {
            this.setFocusedRow(null);
        }
    };

    //keyValue: 唯一标记
    this.find = function (keyValue) {
        return this._findData(this._data.KeyColumn, keyValue, this._data.Rows);
    };
    this._findData = function (property, propertyValue, datas) {
        if (!property || !propertyValue || !datas || datas.length == 0)
            return null;
        var d = null;
        for (var i = 0; i < datas.length; i++) {
            d = datas[i][property] == propertyValue ? datas[i] : this._findData(property, propertyValue, datas[i].children);
            if (d != null && d != undefined) return d;
        }
        return null;
    }

    this.setFocusedRow = function (row) {
        this.set("focusedRow", row);
    };
    this.getFocusedRow = function () {
        return this.get("focusedRow");
    };

    this.setRows = function (rows) {
        if (!this.beforeExecute("setRows", rows))
            return;
        //rows = cb.isArray(rows) ? rows : [rows];
        this.set("Rows", rows);
        this.afterExecute("setRows", rows);
    };
    this.getRows = function () {
        return this.get("Rows");
    };

    this.select = function (keyValue) {
        var row = this.find(keyValue);
        this.setFocusedRow(row);
    };

    this.unSelect = function (keyValue) {
        this.setFocusedRow(null);
    }

    this.expand = function (row, isExpended) {
        if (this.beforeExecute("expand", this)) {
            row.Expanded = isExpended;  //是否展开 
            row.IsLoaded = row.IsLoaded || true; //
            this.afterExecute("expand", this);
            this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "expand", row));
        }
    };

    this.setProperty = function (keyValue, property, value) {
        if (!keyValue || !property)
            return;
        var row = this.find(keyValue);
        if (!row)
            return;
        var oldValue = row[property];
        if (oldValue === value)
            return;
        row[property] = value;
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "setProperty", { OldValue: oldValue, Value: value, Property: property, KeyValue: keyValue }));
    };
    this.setValue = function (keyValue, column, value) {
        this.setProperty(keyValue, column, value);
    };
    this.getProperty = function (keyValue, property) {
        if (!keyValue || !property)
            return;
        var row = this.find(keyValue);
        if (!row)
            return;
        return row[property];
    };
    this.getValue = function (keyValue, column, value) {
        this.getProperty(keyValue, column);
    };
    this.setReadOnly = function (keyValue, value) {
        this.setProperty(keyValue, "readOnly", value);
    };
    this.setDisabled = function (keyValue, value) {
        this.setProperty(keyValue, "disabled", value);
    };
    this.getValue = this.getProperty

    this.click = function (row) {

        if (!row) return;
        this.fireEvent("click", row);

        return;
        //        if (this._before("click", this)) {
        //            //this.setFocusedRow(row);
        //            this.execute("click", row);
        //            this._after("click", this);
        //            this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "click", row));
        //        }
    };

    this.doubleClick = function (row) {
        if (!row) return;
        if (this.beforeExecute("doubleClick", this)) {
            // this.setFocusedRow(row);            
            this.expand(row, !row.Expanded);
            //this.execute("doubleClick", row);
            this.afterExecute("doubleClick", this);
            this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "doubleClick", row));

        }
    };

    this.sort = function (field, direction) {
        if (!this.beforeExecute("sort")) {
            return;
        }
        var rows = [];
        for (var i = 0; i < this._data.Rows.length; i++) {
            rows.push(this._data.Rows[i]);
        }
        if (direction == "down") {
            rows.sort(function (itemA, itemB) {
                return itemA[field] <= itemB[field] ? 1 : -1;
            });
        }
        else if (direction == "up") {
            rows.sort(function (itemA, itemB) {
                return itemA[field] >= itemB[field] ? 1 : -1;
            });
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "sort", rows));
        this.afterExecute("sort");
    };

    this.setPageSize = function (pageSize) {
        if (pageSize == null) return;
        this._data.PageInfo.pageSize = pageSize;
    };

    this.getPageSize = function () {
        return this._data.PageInfo.pageSize;
    };

    this.setPageInfo = function (data, innerCall) {
        if (!data) return;
        if (data.pageSize != null) this._data.PageInfo.pageSize = data.pageSize;
        if (data.pageIndex != null) this._data.PageInfo.pageIndex = data.pageIndex;
        if (data.pageCount != null) this._data.PageInfo.pageCount = data.pageCount;
        if (data.totalCount != null) this._data.PageInfo.totalCount = data.totalCount;
        if (innerCall === true) return;
        this.onChangePage(this._data.PageInfo.pageSize, this._data.PageInfo.pageIndex);
    };

    this.getPageInfo = function () {
        return this._data.PageInfo;
    };

    this.setPageRows = function (data, cacheNeed) {
        if (!this.beforeExecute("setPageRows", data)) return;
        this.setPageInfo(data, true);
        this._data.Rows = data.currentPageData || [];
        for (var i = 0; i < this._data.Rows.length; i++) {
            this._$setId(this._data.Rows[i]);
        }
        data.currentPageData = this._data.Rows;
        if (cacheNeed || cacheNeed == null) {
            this._data.Cache = this._data.Cache || {};
            var cache = this._data.Cache;
            var start = data.pageIndex * data.pageSize - data.pageSize;
            var rows = data.currentPageData || [];
            for (var i = 0; i < rows.length; i++) {
                cache[start + i] = rows[i];
            }
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "PageRows", data));
        this.afterExecute("setPageRows", data);
    };

    this.onChangePage = function (pageSize, pageIndex) {
        var cache = this._data.Cache;
        if (cache) {
            var pageCount = this._data.PageInfo.pageCount;
            var totalCount = this._data.PageInfo.totalCount;
            var tempPageCount = totalCount / pageSize;
            if (tempPageCount !== parseInt(tempPageCount)) tempPageCount = parseInt(tempPageCount) + 1;
            if (pageCount !== tempPageCount) this._data.PageInfo.pageCount = pageCount = tempPageCount;
            if (pageSize == this._data.PageInfo.pageSize) {
                var start = pageIndex * pageSize - pageSize;
                var end = pageIndex * pageSize;
                var rows = [];
                for (var i = start; i < end; i++) {
                    if (cache[i]) rows.push(cache[i]);
                }
                if (rows.length == pageSize) {
                    this.setPageRows({ pageSize: pageSize, pageIndex: pageIndex, pageCount: pageCount, totalCount: totalCount, currentPageData: rows }, false);
                    return;
                }
            }
            else this._data.Cache = {};
        }
        this.fireEvent("changePage", { pageSize: pageSize, pageIndex: pageIndex });
    };
};
cb.model.Model2D.prototype = new cb.model.BaseModel();
//支持数据对象，考虑跟set合并成一个方法
cb.model.Model2D.prototype.setData = function (data) {
    cb.console.log("Model2D.setData", this);
    if (arguments.length == 0)
        return;
    if (!arguments[0] || !data)
        return;
    if (arguments.length == 1 && !typeof data == "object") //if (data.constructor != Object || data.constructor != Array)
        return;
    if (data.constructor == Array)
        data = { Rows: data };
    if (arguments.length == 2) {
        var tempData = {};
        tempData[arguments[0]] = arguments[1];
        data = tempData;
    }
    if (data.Rows) {
        //this.add(data.Rows, true);
        this.setRows(data.Rows);
        delete data.Rows;
    }
    for (var attr in data) {
        value = data[attr];
        if (typeof value == "function") {
            this.on(attr, value);
        }
        else if (this._data.hasOwnProperty(attr) || !cb.isEmpty(value)) {
            this.set(attr, value); //需要考虑批量操作
        }
    }
    cb.console.log("Model2D.setData", this);
}
cb.model.Model2D.prototype.getData = function (propertyName, onlyCollectDirtyData) {
    return this._data.Rows;
}

cb.model.Model2D = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);

    this._data = this._data || {};
    this._data.selectedValues = {};
    this._data.selectedNode = {};

    this.setDataSource = function (dataSource) {
        this._data.dataSource = dataSource;
        // 清空selectedValues  
        this._data.selectedValues = {};
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "dataSource", dataSource));
    };

    this.getDataSource = function () {
        return this._data.dataSource;
    };

    this.setSelectedValues = function (selectedValues) {
        cb.each(selectedValues, function (item) {
            this._data.selectedValues[item] = true;
        }, this);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "selectedValues", selectedValues));
    };

    this.setUnSelectedValues = function (unSelectedValues) {
        cb.each(unSelectedValues, function (item) {
            delete this._data.selectedValues[item];
        }, this);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "unselectedValues", unSelectedValues));
    };


    this.getSelectedValues = function () {
        var selected = [];
        var totalValues = this._data.selectedValues;
        cb.eachIn(totalValues, function (index, attr, value) {
            if (value == true)
                selected.push(attr);
        }, this);
        return selected;
    };

    this.setSelectedNode = function (selectedNode) {
        this._data.selectedNode = selectedNode;
    };

    this.getSelectedNode = function () {
        return this._data.selectedNode;
    };

    this.appendNodes = function (dataSource) {
        var val = this.getDataSource();
        var str = Object.prototype.toString.call(val);
        var parentCode = dataSource.parentCode;
        var children = dataSource.data;
        if(parentCode){
	        function insert2Parent(nodes) {
	            cb.each(nodes, function (attr) {
	                if (attr.code == parentCode) {
	                	if(cb.isArray(children)){
	                    	attr.children = children;
	                	} else {
	                		if(attr.children == null) attr.children = [];
	                		attr.children.push(children);
	                	}
	                }
	                else if (attr.children && attr.children.length > 0) {
	                    insert2Parent(attr.children);
	                }
	            }, this);
	        }
	        if (str === "[object Object]") {
	            //处理datasource是对象的情况
	            insert2Parent(val.children);
	        } else {
	            insert2Parent(val);
	        }
        }
        else{//不指定parentcode插入到根节点下
	    	function insert2Root(nodes) {
	        	nodes.push(children);
	        }
	    	if (str === "[object Object]") {
	            //处理datasource是对象的情况
	            insert2Root(val.children);
	        } else {
	            insert2Root(val);
	        }
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "appendNodes", dataSource));
    };
    
    this.setAllNodesEnable = function (val) {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "AllNodesEnable", val));
    };
    
    this.expandByID = function (id) {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "expandByID", id));
    };
    
    this.removeNode = function (node) {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "removeNode", node));
    };
    
    this.getParentNode = function (node) {
    	var dataSource = this.getDataSource();
    	var str = Object.prototype.toString.call(dataSource);
    	var parentNode = null;
    	function getParent(nodes) {
            cb.each(nodes, function (attr) {
                if (attr.code == node.parentCode || attr.code == node.parentcode) {
                   parentNode =  attr;
                }
                else if (attr.children && attr.children.length > 0) {
                    getParent(attr.children);
                }
            }, this);
        }
        if (str === "[object Object]") {
            //处理datasource是对象的情况
            getParent(dataSource.children);
        } else {
            getParent(dataSource);
        }
        return parentNode;
    };
    
    this.setSelectNode = function (node) {
    	this._data.selectedNode = node;
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "setSelectNode", node));
    };
    
    this.updateNode = function (oldNode, newNode) {
    	var dataSource = this.getDataSource();
    	var str = Object.prototype.toString.call(dataSource);
    	function updateData(nodes) {
            cb.each(nodes, function (attr) {
                if (attr.code == oldNode.code) {
                	attr = newNode;
                }
                else if (attr.children && attr.children.length > 0) {
                    updateData(attr.children);
                }
            }, this);
        }
        if (str === "[object Object]") {
            //处理datasource是对象的情况
            updateData(dataSource.children);
        } else {
            updateData(dataSource);
        }
        
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "updateNode", {"oldNode": oldNode,"newNode":newNode}));
    };
    
    this.reloadChildNode = function (node) {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "reloadChildNode", node));
    };
};
cb.model.Model2D.prototype = new cb.model.BaseModel();
cb.model.Model2D.prototype.clear = function () {

};
cb.model.Model2D.prototype.setData = function (data) {

};

// #endregion

// #region Model3D

cb.model.Model3D = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);
    this._listeners = [];
    //this._data = data || { Rows: [], Columns: {} }; 基类中赋值,//存储自身的信息，readOnly，disabled等
    this._data.Mode = this._data.Mode || "Local";
    this._data.Rows = this._data.Rows || []; //this._data.Rows = [{ ID: { readOnly: true, Value: 111 }, Name: 22, readOnly: true}]
    this._data.Columns = this._data.Columns || {}; //this._data.Columns = { ID: { readOnly: true, disabled: true }, Name: {} };
    //var 基本的值包涵 = { readOnly: true, disabled: true, Value: 2 }; //原子数据
    this._focusedRow = this._data.Rows[0] || null;
    this._focusedRowIndex = 0;

    this._editRowModel = null;

    this._data.PageInfo = this._data.PageInfo || { pageSize: 0, pageIndex: 1, pageCount: 1, totalCount: 0 };

    //每一行需要一个唯一能定位的内部标志
    for (var i = 0; i < this._data.Rows.length; i++) {
        this._$setId(this._data.Rows[i]);
    }

    this.get = function (rowIndex, cellName, propertyName) {
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
            var row = rowIndex >= 0 ? this._data.Rows[rowIndex] : null;
            if (!row || !cellName)
                return row; //如果列名称cellName为空，则返回行
            var cell = row[cellName];
            return (cell && typeof cell === "object") ? cell.Value : cell;
        }
        else {
            //如果状态属性propertyName != 空，则表示要获取状态值
            if (rowIndex < 0) {
                //如果传入rowIndex==null and 列名cellName==null，则返回整体状态。
                //如果传入rowIndex==null and 列名cellName!=null，则列状态。
                return cellName ? this._data.Columns[cellName][propertyName] : this._data[propertyName];
            }
            else {
                //如果传入rowIndex!=null and 列名cellName!=null，则返回单元格状态。
                //如果传入rowIndex==null and 列名cellName==null，则行状态。
                if (!cellName)
                    return this._data.Rows[rowIndex][propertyName];
                var cell = this._data.Rows[rowIndex][cellName];
                return cell && cell[propertyName];
            }
        }
        return this;
    };
    this.set = function (rowIndex, cellName, propertyName, value) {
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
            var row = this._data.Rows[rowIndex]; // this.get(rowIndex);
            var cell = row[cellName];
            var cellIsObject = (cell && typeof cell == "object");
            var oldValue = this.get(rowIndex, cellName);
            if (oldValue === value)
                return;

            var context = { Row: rowIndex, CellName: cellName, Value: value, OldValue: oldValue };
            if (!this.beforeExecute("CellValueChange", context))
                return false;
            if (cellIsObject)
                cell.Value = value;
            else
                row[cellName] = value;
            if (row.state != cb.model.DataState.Add)
                row.state = cb.model.DataState.Update;

            var args = new cb.model.PropertyChangeArgs(this._name, "CellValueChange", context);
            this.PropertyChange(args);

            this.afterExecute("CellValueChange", context); //值变化出发,无焦点要求
        }
        else {
            //获取整个控件状态
            if (rowIndex < 0 && !cellName) {
                var oldValue = this._data[propertyName];
                if (oldValue === value)
                    return;

                var context = { PropertyName: propertyName, Value: value, OldValue: oldValue };
                if (!this.beforeExecute("StateChange", context))
                    return false;

                this._data[propertyName] = value;

                /*遍历性能不好,不需要遍历
                //是否需要增加遍历每个单元格的propertyName属性
                for (var i = 0; i < this._data.Rows.length; i++) {
                this.set(i, null, propertyName, value);
                }
                */

                var args = new cb.model.PropertyChangeArgs(this._name, "StateChange", context);
                this.PropertyChange(args);

                this.afterExecute("StateChange", context);

            }
            //获取列状态
            else if (rowIndex < 0 && cellName) {
                var oldValue = this._data.Columns[cellName][propertyName];
                if (oldValue === value)
                    return;

                var context = { Row: rowIndex, CellName: cellName, PropertyName: propertyName, Value: value, OldValue: oldValue, Columns: this._data.Columns };
                if (!this.beforeExecute("ColumnStateChange", context))
                    return false;

                this._data.Columns[cellName] = this._data.Columns[cellName] || {};
                this._data.Columns[cellName][propertyName] = value;

                /*遍历性能不好,不需要遍历
                //是否需要增加遍历每个单元格的propertyName属性???
                for (var i = 0; i < this._data.Rows.length; i++) {
                this.set(i, cellName, propertyName, value);
                }
                */
                var args = new cb.model.PropertyChangeArgs(this._name, "ColumnStateChange", context);
                this.PropertyChange(args);

                this.afterExecute("ColumnStateChange", context);
            }
            //获取行状态
            else if (rowIndex >= 0 && !cellName) {
                var oldValue = this._data.Rows[rowIndex][propertyName];
                if (oldValue === value)
                    return;

                var context = { Row: rowIndex, PropertyName: propertyName, Value: value, OldValue: oldValue };
                if (!this.beforeExecute("StateChange", context))
                    return false;

                if (!value && (propertyName == "readOnly" || propertyName == "disabled")) {
                    //如果值==false,
                    delete this._data.Rows[rowIndex][propertyName];
                }
                else {
                    this._data.Rows[rowIndex][propertyName] = value;
                }
                /*遍历性能不好,不需要遍历
                //是否需要增加遍历每个单元格的propertyName属性???
                var columns = this._data.Columns;
                for (var column in columns) {
                this.set(rowIndex, column, propertyName, value);
                }
                */
                var args = new cb.model.PropertyChangeArgs(this._name, "RowStateChange", context);
                this.PropertyChange(args);

                this.afterExecute("RowStateChange", context);
            }
            //获取单元格状态
            else if (rowIndex >= 0 && cellName) {
                var cell = this._data.Rows[rowIndex][cellName];
                var isObject = (cell && typeof cell == "object");
                var oldValue = isObject ? cell[propertyName] : undefined;
                if (oldValue === value)
                    return;

                var context = { Row: rowIndex, CellName: cellName, PropertyName: propertyName, Value: value, OldValue: oldValue };
                if (!this.beforeExecute("CellStateChange", context))
                    return false;

                if (cb.isEmpty(value)) {
                    //如果置空，则列只存值
                    if (isObject)
                        delete cell[propertyName];
                    //this._data.Rows[rowIndex][cellName] = isObject ? cell.Value : cell; //不止一个属性
                }
                else if (!value && (propertyName == "readOnly" || propertyName == "disabled")) {
                    //如果值==false,
                    //this._data.Rows[rowIndex][cellName] = isObject ? cell.Value : cell;
                    if (isObject) {
                        delete cell[propertyName];
                        var hasProperty = false;
                        cb.eachIn(cell, function (attr) { if (attr != "Value" || attr != "value") { hasProperty = true; return; } });
                        if (!hasProperty)
                            this._data.Rows[rowIndex][cellName] = cell.Value;
                    }
                }
                else {
                    if (!isObject)
                        cell = this._data.Rows[rowIndex][cellName] = { Value: cell };
                    cell[propertyName] = value;
                }
                var args = new cb.model.PropertyChangeArgs(this._name, "CellStateChange", context);
                this.PropertyChange(args);

                this.afterExecute("CellStateChange", context);
            }
        }

        this.syncEditRowModel(rowIndex, cellName, propertyName, value); //需要优化一下，看放在哪里效率高
    };

    //#region getState
    this.setRowState = function (rowIndex, propertyName, value) {
        this.setState(rowIndex, null, propertyName, value);
    };
    this.getRowState = function (rowIndex, propertyName) {
        return this.getState(rowIndex, null, propertyName);
    };
    this.setColumnState = function (cellName, propertyName, value) {
        this.setState(null, cellName, propertyName, value);
    };
    this.getColumnState = function (cellName, propertyName) {
        return this.getState(null, cellName, propertyName);
    };
    this.setCellState = function (rowIndex, cellName, propertyName, value) {
        this.set(rowIndex, cellName, propertyName, value);
    };
    this.getCellState = function (rowIndex, cellName, propertyName) {
        return this.get(rowIndex, cellName, propertyName);
    };
    this.getReadOnly = function (rowIndex, cellName) {
        return this.get(rowIndex, cellName, "readOnly");
    };
    this.setReadOnly = function (rowIndex, cellName, value) {
        if (arguments.length == 0)
            return;
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
    };
    this.getDisabled = function (rowIndex, cellName) {
        return this.get(rowIndex, cellName, "disabled");
    };
    this.setDisabled = function (rowIndex, cellName, value) {
        this.set(rowIndex, cellName, "disabled", value);
    };
    this.getState = function (rowIndex, cellName, propertyName) {
        return propertyName ? this.get(rowIndex, cellName, propertyName) : null;
    };
    this.setState = function (rowIndex, cellName, propertyName, value) {
        if (!propertyName)
            return;
        this.set(rowIndex, cellName, propertyName, value);
    };
    //#endregion state

    this.getCellValue = function (rowIndex, cellName) {
        return this.get(rowIndex, cellName);
    };
    this.setCellValue = function (rowIndex, cellName, value) {
        this.set(rowIndex, cellName, null, value);
    };
    //界面录入值变化出发
    this.cellChange = function (rowIndex, cellName, value) {
        var oldValue = this.getCellValue(rowIndex, cellName);
        if (oldValue === value)
            return false;
        var context = { Row: rowIndex, CellName: cellName, Value: value, OldValue: oldValue };
        if (this.beforeExecute("CellChange", context)) {
            this.setCellValue(rowIndex, cellName, value);
            this.afterExecute("CellChange", context)
            return true;
        }
    };
    this.setFocusedRow = function (row) {
        if (!row) {
            this._focusedRow = null;
            this._focusedRowIndex = -1;
            this.getEditRowModel().clear();
            return;
        }
        if (this._focusedRow == row)
            return;

        if (!this.beforeExecute("setFocusedRow", row))
            return;

        var oldValue = this._focusedRow;
        this._focusedRow = row;
        this._focusedRowIndex = this._data.Rows.indexOf(row);

        this.setEditRowModel(this._focusedRow);

        var args = new cb.model.PropertyChangeArgs(this._name, "FocusedRow", row, oldValue);
        this.PropertyChange(args);

        this.afterExecute("setFocusedRow", row);
    };
    this.getFocusedRow = function () {
        return this._focusedRow;
    };

    this.setColumns = function (columns) {
        if (!this.beforeExecute("setColumns", columns))
            return;
        //columns = cb.isArray(columns) ? columns : [columns];
        this._data.Columns = columns;
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "Columns", columns));
        this.afterExecute("setColumns", columns);
    };
    this.resetColumns = function () {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "resetColumns", this._data.Columns));
    };
    this.getColumns = function () {
        return this._data.Columns;
    }

    this.getRows = function () {
        return this._data.Rows;
    };
    this.setRows = function (rows) {
        if (!this.beforeExecute("setRows", rows))
            return;
        this._data.Rows = cb.isArray(rows) ? rows : [rows];
        for (var i = 0; i < this._data.Rows.length; i++) {
            this._$setId(this._data.Rows[i]);
            this._processRow(this._data.Rows[i]);
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "Rows", this._data.Rows));
        this.afterExecute("setRows", rows);
    };

    this._processRow = function (row) {
        var columns = this._data.Columns;
        for (var index in columns) {
            //row[index] = row[index] || columns[index]["defaultValue"];
            if (row[index] == null) row[index] = columns[index]["defaultValue"];
        }
    }

    this.setQueryScheme = function (data) {
        if (!data || data.length == null) {
            return;
        }
        this._data.QueryScheme = {};
        for (var i = 0; i < data.length; i++) {
            this._data.QueryScheme[data[i].pk_queryscheme] = data[i];
            if (data[i].isdefault.value) {
                this.selectQueryScheme(data[i].pk_queryscheme);
            }
        }
    };

    this.selectQueryScheme = function (querySchemeID) {
        if (!querySchemeID) {
            return;
        }
        var args = {
            querySchemeID: querySchemeID,
            pageSize: this._data.PageInfo.pageSize
        }
        this.fireEvent("onQuerySchemeChanged", args);
        var statusData = this.getStatusData();
        statusData["QueryScheme"] = this._data.QueryScheme[querySchemeID].name;
        this.setStatusData();
    };

    this.getQueryScheme = function () {
        return this._data.QueryScheme;
    };

    this.setStatusData = function () {
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "StatusData", this.getStatusData()));
    };

    this.getStatusData = function () {
        if (!this._data.StatusData) {
            this._data.StatusData = {};
        }
        return this._data.StatusData;
    };

    this.setPageSize = function (pageSize) {
        if (pageSize == null) {
            return;
        }
        this._data.PageInfo.pageSize = pageSize;
        this._data.SupportPagination = true;
        cb.cache.set("model3d", this);
    };

    this.getPageSize = function () {
        return this._data.PageInfo.pageSize;
    };

    this.setPageInfo = function (data, innerCall) {
        if (!data) {
            return;
        }
        if (data.pageSize != null) {
            this._data.PageInfo.pageSize = data.pageSize;
        }
        if (data.pageIndex != null) {
            this._data.PageInfo.pageIndex = data.pageIndex;
        }
        if (data.pageCount != null) {
            this._data.PageInfo.pageCount = data.pageCount;
        }
        if (data.totalCount != null) {
            this._data.PageInfo.totalCount = data.totalCount;
        }
        if (innerCall === true) {
            var statusData = this.getStatusData();
            if (this._data.PageInfo.pageSize == 0) {
                statusData["PageInfo"] = "显示全部 " + this._data.PageInfo.totalCount + " 行";
            }
            else {
                statusData["PageInfo"] = "当前页大小 " + this._data.PageInfo.pageSize
                                            + " 显示页 " + this._data.PageInfo.pageIndex
                                            + " / " + this._data.PageInfo.pageCount
                                            + " 全部 " + this._data.PageInfo.totalCount
                                            + " 行";
            }
            this.setStatusData();
            return;
        }
        this.onChangePage(this._data.PageInfo.pageSize, this._data.PageInfo.pageIndex);
    }

    this.getPageInfo = function () {
        return this._data.PageInfo;
    }

    this.setPageRows = function (data, cacheNeed) {
        if (!this.beforeExecute("setPageRows", data))
            return;
        this.setPageInfo(data, true);
        this._data.Rows = [];
        var rows = data.currentPageData || [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!row) continue;
            this._$setId(row);
            this._processRow(row);
            this._data.Rows.push(row);
        }
        data.currentPageData = this._data.Rows;

        if (cacheNeed || cacheNeed == null) {
            this._data.Cache = this._data.Cache || {};
            var cache = this._data.Cache;
            var start = data.pageIndex * data.pageSize - data.pageSize;
            var rows = data.currentPageData || [];

            for (var i = 0; i < rows.length; i++) {
                cache[start + i] = rows[i];
            }
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "PageRows", data));
        this.afterExecute("setPageRows", data);
    };

    this.commitRows = function (rows) {
        if (!this.beforeExecute("commitRows", rows))
            return;
        rows = cb.isArray(rows) ? rows : [rows];
        var rowIndexes = [];
        cb.each(rows, function (row) {
            var rowIndex = (typeof row == "number") ? row : this._data.Rows.indexOf(row);
            rowIndexes.push(rowIndex);
        }, this);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "commitRows", rowIndexes));
        this.afterExecute("commitRows", rowIndexes);
    };

    this.getRow = function (rowIndex) {
        return this._data.Rows[rowIndex];
    };
    this.getRowIndex = function (row) {
        return this._data.Rows.indexOf(row);
    };
    this.getSelectedRows = function () {
        var selectedRows = [];
        var rows = this._data.Rows;
        for (var i = 0, length = rows.length; i < length; i++) {
            if (rows[i].isSelected) {
                selectedRows.push(rows[i]);
            }
        }
        return selectedRows;
    };

    //#region 选择、全选支持
    this.onSelect = function (rows) {
        this.beforeExecute("Select", this);
        if (!cb.isArray(rows)) rows = [rows];
        this.unSelectAll();
        this.select(rows);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "Select", rows));
        this.afterExecute("Select", this);
    };
    this.onUnSelect = function (rows) {
        this.beforeExecute("UnSelect", this);
        this.selectAll();
        this.unSelect(rows);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "UnSelect", rows));
        this.afterExecute("UnSelect", this);
    };
    this.select = function (rows) {
        if (!cb.isArray(rows)) rows = [rows];
        cb.each(rows, function (index) {
            if (index == this._data.Rows.length) return;
            this._data.Rows[index].isSelected = true;
        }, this);
        rows.length >= 1 ? this.setFocusedRow(this._data.Rows[rows[0]]) : this.setFocusedRow(null);
    };
    this.unSelect = function (rows) {
        if (!cb.isArray(rows)) rows = [rows];
        cb.each(rows, function (index) { this._data.Rows[index].isSelected = false; }, this);
    };
    this.onSelectAll = function () {
        this.beforeExecute("SelectAll", this);
        this.selectAll();
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "SelectAll", this._data.Rows));
        this.afterExecute("SelectAll", this);
    };
    this.onUnSelectAll = function () {
        this.beforeExecute("UnSelectAll", this);
        this.unSelectAll();
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "UnSelectAll", this._data.Rows));
        this.afterExecute("UnSelectAll", this);
    };
    this.selectAll = function () {
        //if(this.isMultiMode)
        cb.each(this._data.Rows, function (row) { row.isSelected = true; }, this);
    };
    this.unSelectAll = function () {
        cb.each(this._data.Rows, function (row) { row.isSelected = false; }, this);
    };
    //#endregion

    //新增空行
    this.addNewRow = function () {
        if (!this.beforeExecute("addNewRow"))//beforeadd
            return;
        var newRow = { state: cb.model.DataState.Add }; //新增行
        this._data.Rows.push(newRow);
        this._$setId(newRow);
        this.setFocusedRow(newRow);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "addNewRow", newRow));
        this.afterExecute("addNewRow");
    };
    this.add = function (rows, isRemoveAll) {
        if (isRemoveAll) {
            this._data.Rows.removeAll();
            this.setFocusedRow(null);
        }
        if (!this.beforeExecute("add", rows))//beforeadd
            return;
        rows = cb.isArray(rows) ? rows : [rows];
        for (var i = 0; i < rows.length; i++) {
            this._data.Rows.push(rows[i]); //rows可以为多行,[]
            if (!rows[i].state)
                rows[i].state == cb.model.DataState.Add; //新增行
            this._$setId(rows[i]);
        }
        if (!this._focusedRow) {
            this.setFocusedRow(this._data.Rows[0]);
        }
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "add", rows));
        this.afterExecute("add");
    };
    this.insert = function (rowIndex, row) {
        if (!this.beforeExecute("insert", { RowIndex: rowIndex, Value: row }))
            return;
        var willSetFocusedRow;
        if (row) willSetFocusedRow = true;
        row = row || {};
        if (!row.state)
            row.state = cb.model.DataState.Add; //新增行

        this._data.Rows.insert(rowIndex, row);

        this._$setId(row);
        this._processRow(row);

        if (willSetFocusedRow == true) {
            this.setFocusedRow(this._data.Rows[rowIndex]);
        }

        //this.setDirty(rowIndex, true);
        //this.set(rowIndex, null, "State", "Add");

        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "insert", { Row: rowIndex, Value: row }));

        this.afterExecute("insert");
    };
    this.remove = function (rows) {
        if (!this.beforeExecute("remove", rows))
            return;
        var deleteRows = [];
        if (cb.isArray(rows)) {
            for (var j = 0; j < rows.length; j++) {
                var index = (typeof rows[j] == "number") ? rows[j] : this._data.Rows.indexOf(rows[j]);
                deleteRows.push(index);
            }
            deleteRows.sort(function (a, b) { return a < b ? 1 : -1; });
            cb.each(deleteRows, function (k) {
                this._backupDeleteRows(this._data.Rows[k]);
                this._data.Rows.remove(k);
            }, this);
        }
        else {
            var index2 = (typeof rows == "number") ? rows : this._data.Rows.indexOf(rows);
            deleteRows.push(index2);
            this._backupDeleteRows(this._data.Rows[index2]);
            this._data.Rows.remove(index2);
        }

        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "remove", deleteRows));

        this.afterExecute("remove");
    };
    this.updateRow = function (row, modifyData) {
        if (!row || !modifyData)
            return;
        var rowIndex = this.getRowIndex(row);
        if (rowIndex < 0)
            return;
        for (var attr in modifyData) {
            this.set(rowIndex, attr, null, value);
        }
    };
    this._backupDeleteRows = function (row) {
        if (row && row.state != cb.model.DataState.Add) {
            this._data.DeleteRows = this._data.DeleteRows || [];
            row.state = cb.model.DataState.Delete;
            this._data.DeleteRows.push(row);                //删除数据,脏数据处理逻辑，删除？？
        }
    }
    this.removeAll = function () {
        if (!this.beforeExecute("removeAll"))
            return;

        this._data.Rows.removeAll();
        this.setFocusedRow(null);

        //this.setDirty(true);
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "removeAll", this));

        this.afterExecute("removeAll");
    };
    /*this.sort = function (column, desc) {
    if (!this._before("sort"))
    return;
    this._data.Rows.sort(function (itemA, itemB) {
    return desc ? (itemA[column] >= itemB[column] ? 1 : -1) : (itemA[column] <= itemB[column] ? 1 : -1);
    });
    this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "sort", this));

    this._after("sort");
    };*/

    this.sort = function (field, direction) {
        if (!this.beforeExecute("sort")) {
            return;
        }
        var rows = [];
        var cache = this._data.Cache;
        if (cache) {
            var pageSize = this._data.PageInfo.pageSize;
            var pageIndex = this._data.PageInfo.pageIndex;
            var start = pageIndex * pageSize - pageSize;
            var end = pageIndex * pageSize;
            for (var i = start; i < end; i++) {
                if (cache[i]) {
                    rows.push(cache[i]);
                }
            }
        }
        else {
            rows = this._data.Rows;
        }
        if (direction == "down") {
            rows.sort(function (itemA, itemB) {
                return itemA[field] <= itemB[field] ? 1 : -1;
            });
        }
        else if (direction == "up") {
            rows.sort(function (itemA, itemB) {
                return itemA[field] >= itemB[field] ? 1 : -1;
            });
        }
        this._data.Rows = rows;
        /*var args = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageCount: this._data.PageInfo.pageCount,
        totalCount: this._data.PageInfo.totalCount,
        currentPageData: rows
        };*/
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, "sort", this._data.Rows));
        var statusData = this.getStatusData();
        if (direction === "") {
            statusData["SortInfo"] = "";
        }
        else if (direction === "down") {
            statusData["SortInfo"] = this._data.Columns[field].name + " 降序";
        }
        else if (direction === "up") {
            statusData["SortInfo"] = this._data.Columns[field].name + " 升序";
        }
        this.setStatusData();
        this.afterExecute("sort");
    };

    this.setDirty = function (rowIndex, value) {
        //this.set(rowIndex, null, "IsDirty", value);
    };
    this.getDirty = function (rowIndex) {
        if (!rowIndex)
            return this._data["IsDirty"];
        //return this.get(rowIndex, null, "IsDirty");
        var rowState = this.get(rowIndex, null, "State");
        return rowState != null || rowState != cb.model.DataState.Unchanged;
    };

    this.onChangePage = function (pageSize, pageIndex) {

        var cache = this._data.Cache;
        if (cache) {
            var pageCount = this._data.PageInfo.pageCount;
            var totalCount = this._data.PageInfo.totalCount;
            var tempPageCount = totalCount / pageSize;
            if (tempPageCount !== parseInt(tempPageCount)) tempPageCount = parseInt(tempPageCount) + 1;
            if (pageCount !== tempPageCount) this._data.PageInfo.pageCount = pageCount = tempPageCount;
            if (pageSize == this._data.PageInfo.pageSize) {

                var start = pageIndex * pageSize - pageSize;
                var end = pageIndex * pageSize;
                var rows = [];
                for (var i = start; i < end; i++) {
                    if (cache[i])
                        rows.push(cache[i]);
                }
                if (rows.length == pageSize) {
                    this.setPageRows({ pageSize: pageSize, pageIndex: pageIndex, pageCount: pageCount, totalCount: totalCount, currentPageData: rows }, false);
                    return;
                }
            }
            else {
                this._data.Cache = {};
            }
        }

        this.fireEvent("changePage", { pageSize: pageSize, pageIndex: pageIndex });
    };

    this.setGridDataMode = function (mode) {
        this._data.Mode = mode;
    }

    this.getGridDataMode = function () {
        return this._data.Mode;
    }

    this.syncEditRowModel = function (rowIndex, cellName, propertyName, value) {
        if (rowIndex != this._focusedRowIndex || !cellName) {
            if (propertyName == "readOnly" || propertyName == "disabled")
                this.getEditRowModel().set(propertyName, value);    //readOnly、disabled
            return;
        }
        var property = this.getEditRowModel().get(cellName);
        if (!property)
            return;
        propertyName = propertyName || "value";
        var oldValue = property.get(propertyName);
        if (oldValue === value)
            return;
        property.set(propertyName, value);
    };
    this.setEditRowModel = function (data) {
        if (!this._editRowModel) {
            this._editRowModel = cb.viewmodel.create(this.toAtomicData(data));
            this._editRowModel._parent = this;
            var rowModel = this._editRowModel;
            //            cb.each(this._data.Columns, function (column) {
            //                var setMethod = rowModel["set" + column["data"]];
            //                if (!setMethod) {
            //                    rowModel.add(column["data"], new cb.model.SimpleModel(this, column["data"], Object.clone("")));
            //                }
            //            }, this);
            for (var column in this._data.Columns) {
                var setMethod = rowModel["set" + column];
                if (!setMethod) {
                    //rowModel.add(column, new cb.model.SimpleModel(this, column, Object.clone( )));
                    rowModel.add(column, new cb.model.SimpleModel(this, column, Object.clone(this._data.Columns[column])));
                }
            }
        }
        else {
            if (data == null) {
                this._editRowModel.clear();
                return;
            }

            var atomicData = this.toAtomicData(data);
            cb.eachIn(atomicData, function (attr, attrValue) {
                if (typeof attrValue != "object")
                    return;
                var setMethod = this._editRowModel["set" + attr];
                if (setMethod)
                    setMethod.call(this._editRowModel, attrValue);
                else
                    this._editRowModel.add(attr, new cb.model.SimpleModel(this, attr, Object.clone(attrValue)));
            }, this);

            this._editRowModel.initListeners(); //cb.each(this._editRowModel._listeners, function (listener) { listener.init(); }, this);
        }
    }
    this.getEditRowModel = function () {
        if (!this._editRowModel)
            this.setEditRowModel(this._focusedRow);
        return this._editRowModel;
    };

    //原子数据类型 { value: null,readOnly:false,disabled:false }
    this.toAtomicData = function (data) {
        if (!data)
            return {};
        var dataCopy = { hasData: false };
        cb.eachIn(data, function (attr, attrValue) {
            this.hasData = true;
            if (cb.meta.AtomicData.hasOwnProperty(attr))
                this[attr] = attrValue;
            else if (typeof attrValue != "object")
                this[attr] = { value: attrValue };
            else
                cb.eachIn(attrValue, function (propertyName, propertyValue) { this[propertyName] = propertyValue; }, this[attr] = {});
        }, dataCopy);

        if (!dataCopy.hasData) {
            cb.eachIn(this._data.Columns, function (column, columnValue) {
                cb.eachIn(columnValue, function (propertyName, propertyValue) { this[propertyName] = propertyValue; }, this[column] = {});
            }, dataCopy);
        }
        delete dataCopy.hasData;
        return dataCopy;
    };
};
cb.model.Model3D.prototype = new cb.model.BaseModel();
cb.model.Model3D.prototype.getPkName = function () {
    var columns = this._data.Columns || {};
    for (var col in columns) {
        colData = columns[col];
        if (!colData || !colData.constructor == Object)
            continue;
        if (colData["key"] == true || colData["isKey"] == true)
            return col
    }
    return "id";
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
    if (data.constructor == Array)
        data = { Rows: data };
    if (arguments.length == 2) {
        var tempData = {};
        tempData[arguments[0]] = arguments[1];
        data = tempData;
    }
    //var _data = { readOnly: true, Columns: { ID: {}, Code: {} }, Rows: [{ ID: 1, Code: 111 }, { ID: 222, Code: { value: 12, readOnly: 1}}], FocusedRow: null, FocusedIndex: 1 };
    if (data.Rows) {
        //this.add(data.Rows, true);
        this.setRows(data.Rows);
        delete data.Rows;
    }
    if (data.Columns) {
        for (var column in data.Columns) {
            columnData = data.Columns[column];
            if (!columnData || !columnData.constructor == Object)
                continue;
            for (var propertyName in columnData) {
                this.setColumnState(column, propertyName, columnData[propertyName]); //需要考虑批量操作
            }
        }
        delete data.Columns;
    }
    for (var attr in data) {
        value = data[attr];
        if (typeof value == "function") {
            this.on(attr, value);
        }
        else if (this._data.hasOwnProperty(attr) || !cb.isEmpty(value)) {
            this.set(attr, value); //需要考虑批量操作
        }
    }
    //this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue));//后期改成批量操作，操作传递到前台用批量方式
    cb.console.log("Model3D.setData", this);
}
cb.model.Model3D.prototype.getData = function (propertyName, onlyCollectDirtyData) {
    var pkName = this.getPkName();
    var tsName = this.getTsName();
    if (onlyCollectDirtyData && propertyName == "value") {
        var datas = [];
        var rows = this._data.Rows; ////this._data.Cache;???//多页数据怎么处理
        var length = rows.length;
        for (var i = 0; i < length; i++) {
            var tempData = {};
            if (rows[i].state != cb.model.DataState.Unchanged && this._parent.isDirty(this, i)) { // this._parent.isDirty(this, i),需要修改
                for (var attr in rows[i]) {
                    if (attr != "readOnly" && attr != "disabled" && typeof rows[i][attr] != "function") {
                        if (attr == pkName || attr == tsName || this._parent.isDirty(this, i, attr)) {
                            tempData[attr] = (cb.isEmpty(rows[i][attr]) || typeof rows[i][attr] != "object") ? rows[i][attr] : rows[i][attr].Value;
                        }
                    }
                }
                tempData.state = rows[i].state;
            }
            else { //下面数据可以不传递
                var pkColVal = rows[i][pkName];
                var tsColVal = rows[i][tsName];
                tempData[pkName] = (cb.isEmpty(pkColVal) || typeof pkColVal != "object") ? pkColVal : pkColVal.Value;
                tempData[tsName] = (cb.isEmpty(tsColVal) || typeof tsColVal != "object") ? tsColVal : tsColVal.Value;
                tempData.state = cb.model.DataState.Unchanged;
            }
            datas.push(tempData);
        }

        var deleteRows = this._data.DeleteRows || [];   //删除行的处理,删除行只收集id、ts、state
        for (var i = 0; i < deleteRows.length; i++) {
            var cell = deleteRows[i]["ts"];
            var tsValue = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.Value;
            cell = deleteRows[i]["id"];
            var idValue = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.Value;
            var data = {
                state: cb.model.DataState.Delete,
                ts: tsValue,
                ts: idValue
            };
            datas.push(data);
        }

        return datas;
    }
    else {
        if (propertyName == "value") {
            var rows = this._data.Rows.clone(); //this._data.Cache;???//多页数据怎么处理
            if (this._data.Rows.length == 0) rows.length = 0;
            for (var i = 0; i < rows.length; i++) {
                delete rows[i].readOnly;
                delete rows[i].disabled;
                for (var attr in rows[i]) {
                    var cell = rows[i][attr];
                    rows[i][attr] = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.Value;
                }
                rows[i].state = rows[i].state == null ? cb.model.DataState.Unchanged : rows[i].state;
            }
            //删除行的处理,删除行只收集id、ts、state
            var deleteRows = this._data.DeleteRows || [];
            for (var i = 0; i < deleteRows.length; i++) {
                delete deleteRows[i].readOnly;
                delete deleteRows[i].disabled;
                for (var attr in deleteRows[i]) {
                    var cell = deleteRows[i][attr];
                    deleteRows[i][attr] = (cb.isEmpty(cell) || typeof cell != "object") ? cell : cell.Value;
                }
                deleteRows[i].state = cb.model.DataState.Delete;
                rows.push(deleteRows[i]);
            }
            return rows;
        }
        else {
            return this._data.Rows;
        }
    }
}

/****************校验数据有效性***************
* 规则如下：
*  
* 返回定义如下：
*  { isValid:true|false,info:"字符串" }
***********************************************/
cb.model.Model3D.prototype.validate = function () {
    return { isValid: true, info: "字符串" };
}

// #endregion

// #region ContainerModel

cb.model.ContainerModel = function (parent, name, data) {
    cb.model.BaseModel.call(this, parent, name, data);
    this._listeners = [];
    //先绑定，后动态增加viewmodel中的属性时，需要init
    this.initListeners = function () {
        this._listeners.each(function (listener) { listener.init(); }, this);
    };
    this.remove = function (propertyName) {
        cb.property.remove.call(this, propertyName);
    }
    //小数据量增加使用data数据类型单行row，或者多行rows(批量更新使用setRows或其它方式)
    this.add = function (data) {
        if (!data) return;

        if (arguments.length == 2)
            (arguments[0] == "CommandManager") ? this.setCommandManager(arguments[1]) : this.addProperty(arguments[0], arguments[1]);

        else if (arguments.length == 1 && typeof data == "object") {
            for (var attr in data)
                this.addProperty(attr, data[attr]);
            this.setCommandManager(data.CommandManager)
        }
        return this;
    };
    this.addProperty = function (attr, value) {
        if (!attr || attr == "CommandManager")
            return;
        if (this.get(attr)) {
            cb.console.log("已经存在名称为：" + attr + "的属性！", attr);
        }
        else if (cb.isEmpty(value) || value instanceof cb.model.BaseModel) {
            this.set(attr, value);
        }
        else if (typeof value == "function") {
            this.on(attr, value);
        }
        else if (value.constructor == Object) {
            this.set(attr, new cb.model.SimpleModel(this, attr, value));
        }
        else if (value.constructor == Array) {
            //this.set(attr, new cb.model.Model2D(this, attr, {}).setRows(value));
            this.set(attr, new cb.model.SimpleModel(this, attr, value));
        }
        else if (typeof value != "object") {
            this.set(attr, value);
        }
        else {
            cb.console.log(attr, "传递的数据不符合要求: constructor=" + value.constructor + ",value:" + value);
        }
    };
    this.getCommandManager = function () {
        return this.CommandManager;
    };
    this.setCommandManager = function (commandManager, data) {

        if (!commandManager || typeof commandManager != "object")
            return;

        this.CommandManager = commandManager;

        var data = data || this._data;

        var eventNames = ["beforeclick", "click", "afterclick", "change", "beforechange", "afterchange"];
        for (var attr in data) {
            if (!data[attr] || !data[attr].on)
                continue;
            for (var i = 0; i < eventNames.length; i++) {
                var callback = commandManager["on" + attr + "_" + eventNames[i]];
                if (!callback)
                    continue;
                data[attr].on(eventNames[i], callback);
                //data[attr].on(eventNames[i], (function (commandManager, eventName) {
                //    return function () { commandManager[eventName](); };
                //})(commandManager, "on" + attr + "_" + eventNames[i]));
            }
        }
    };
    this.on = function (property, name, callback) {
        if (arguments.length <= 1)
            return;
        var target;
        if (arguments.length == 2) {
            target = this;
            callback = name;
            name = property;
        }
        else if (arguments.length == 3)
            target = property ? ((typeof property == "string") ? this.get(property) : property) : this;

        if (!name || !callback || (!typeof callback == "function"))
            return;
        //name = name.toLowerCase(); //一律使用小写
        target.bind(name, callback); //用on会死循环 
    }

    //清空
    this.clear = function (isNewRecord) {
        for (var attr in this._data) {
            var prop = this.get(attr);
            if (!prop) continue;

            // fangqg: 有些字符串如ViewModelName & 布尔值如readOnly，不应该执行下面逻辑。
            if (typeof prop != "object") continue;

            if (prop.get && (cb.model.BaseModel.prototype.checkPropCtrlType(prop)
                             || prop.get("bindingMode") == cb.binding.BindingMode.OneTime
                             || prop.get("isNeedCollect") == false))//???
                continue;
            if (prop.setValue)
                prop.setValue(isNewRecord ? (prop.get("defaultValue")) : null);
            else if (prop.clear)//Model3D
                prop.clear();
            else
                this.set(attr, "");
        }
    };

    //持久化，暂时写在ViewModel里
    this.setProxy = function (config) {
        if (config instanceof cb.rest.DynamicProxy)
            this._proxy = config;
        else
            this._proxy = cb.rest.DynamicProxy.create(config);
    };
    this.getProxy = function () {
        return this._proxy;
    }


    //脏数据管理，待丰富整理
    //this.dirtyDataManager = {};

    this._originalData = {};

    this.getDataValues = function () {
        var dataValues = [];
        for (var attr in this._data) {
            dataValues[attr] = this.getDataValue();
        }
    };
    this.getDataValue = function (attr) {
        if (cb.isEmpty(this._data[attr]))
            return this._data[attr];
        else if (this._data[attr] instanceof cb.model.SimpleModel)
            return this._data[attr].getValue();
        else if (this._data[attr] instanceof cb.model.Model3D)
            return this._data[attr].getRows().clone();
        else if (this._data[attr] instanceof cb.model.Model2D)
            return this._data[attr].getDataSource().clone();
        else
            return this._data[attr];
    };
    this.setDirty = function (dirty) {
        if (dirty === true) {
            this._isDirty = true;
            return;
        }
        delete this._isDirty;
        this._originalData = this.getData();
    };
    this.isDirty = this.getDirty = function (propertyName) {
        if (!propertyName) {
            if (this._isDirty)
                return true;
            for (var attr in this._data) {
                if (this.getDirty(attr)) {
                    this._isDirty = true;
                    return true;
                }
            }
        } else {
            //代表获取每个属性，是否脏数据
            var property, unchange;
            if (typeof propertyName == "string" && (property = this.get(propertyName))) {
                if (property instanceof cb.model.BaseModel) {
                    unchange = cb.isEqual(property.getData('value'), this._originalData[propertyName]);
                    return !unchange;
                }
            }
        }

        return false;
    };
}
cb.model.ContainerModel.create = function (data, name, parent) {
    var obj = new cb.model.ContainerModel(parent, name);
    obj.setData(data);
    obj.setDirty(false);
    return obj;
}
cb.model.ContainerModel.prototype = new cb.model.BaseModel();
cb.model.ContainerModel.prototype.set = function (propertyName, value) {
    var alreadyHave = this._data.hasOwnProperty(propertyName);
    if (!alreadyHave) {
        cb.property.init.call(this, propertyName);
    }
    var oldValue = this.get(propertyName);
    this._data[propertyName] = value;

    if (!cb.isEmpty(value)) {
        if (value instanceof cb.model.BaseModel) {
            var prop = this._data[propertyName];
            prop._name = propertyName;
            prop._parent = this;
            prop.setReadOnly(this.getReadOnly() || prop.getReadOnly());
            prop.setDisabled(this.getDisabled() || prop.getDisabled());
        } else {
            if (!(propertyName == "readOnly" || propertyName == "disabled"))
                return;
            //以下逻辑可能会照成遍历所有的行及单元格，Model3D的数据set方法需要优化（设置readOnly等属性时，不需要遍历到每个单元格，行）
            //10000行以上数据绑定慢的原因：由于存在一些额外的数据，导致行、单元格全遍历了。。。
            for (var attr in this._data) {
                if (this._data[attr] instanceof cb.model.BaseModel) {
                    this._data[attr].set(propertyName, value);
                }
            }
        }
    }
    else {
        if (oldValue === value)
            return;
        this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue));
    }
}
cb.model.ContainerModel.prototype.get = function (propertyName, attrName) {
    var property = this._data ? (propertyName ? this._data[propertyName] : this._data) : null;
    return (attrName && property && property.get) ? property.get(attrName) : property;
};
//支持数据对象，考虑跟set合并成一个方法
cb.model.ContainerModel.prototype.setData = function (data) {
    cb.console.log("ContainerModel.setData", this);
    if (arguments.length == 0)
        return;
    if (!arguments[0] || !data)
        return;
    if (arguments.length == 1 && !(data.constructor == Object || typeof data == "object"))
        return;
    if (arguments.length == 2) {
        var tempData = {};
        tempData[arguments[0]] = arguments[1];
        data = tempData;
    }
    var commandManager = data.CommandManager;
    delete data.CommandManager;

    for (var properyName in data) {
        var value = data[properyName];
        var propery = this.get(properyName);
        propery ? (propery.setData ? propery.setData(value) : this.set(properyName, value)) : this.addProperty(properyName, value);
    }
    this.setCommandManager(commandManager);

    //this.PropertyChange(new cb.model.PropertyChangeArgs(this._name, propertyName, value, oldValue));//后期改成批量操作，操作传递到前台用批量方式
    cb.console.log("ContainerModel.setData", this);
}
//仅仅收集viewModel中的数据
cb.model.ContainerModel.prototype.getData = function () {

    var data = this._data;
    var rawData = {};
    var property;
    for (var propertyName in data) {
        property = this.get(propertyName);
        if (property == null)
            continue;
        if (property.getData) {
            if (this.checkPropCtrlType(property)) {
                //按钮类型不收集数据
                cb.console.log("按钮：" + property.getModelName() + "不会收集数据");
                continue;
            }
            var propertyValue = property.getData('value');
            if (propertyValue != null) {
                rawData[propertyName] = propertyValue;
            }
        } else if (propertyName != "readOnly" && propertyName != "disabled" && typeof property != "object") { //收集放在model中的普通数据
            rawData[propertyName] = property;
        }

    }
    return rawData;
};
//获取viewModel中的脏数据以及申明收集数据时必须获取的数据
cb.model.ContainerModel.prototype.getDirtyData = function () {
    var data = this._data;
    var dirtyData = {};
    var property = null;
    var pkName = this.getPkName();
    var tsName = this.getTsName();
    for (var propertyName in data) {
        property = this.get(propertyName);
        if (property && property.get && property.get("controlType") === cb.ControlType.Button) {
            //按钮类型不收集数据
            cb.console.log("按钮：" + property.getModelName() + "不会收集数据");
            continue;
        }
        if (property && property instanceof cb.model.SimpleModel) {//SimpleModel的值即使没改变也获取到，后续支持差异提交时，去掉这个if分支
            dirtyData[propertyName] = property.getData("value");
        } else if (this.isDirty(propertyName)) {
            if (property && property.constructor == cb.model.BaseModel) {
                dirtyData[propertyName] = property.getDirtyData ? property.getDirtyData() : property.getData("value"); //Model3D提供getDirtyData方法。
            } else if (propertyName != "readOnly" && propertyName != "disabled" && typeof property != "object") {
                dirtyData[propertyName] = property;
            }
        } else {
            //SimpleModel
            //必要字段,需要强制收集的字段
            if (property && property.get && property.get("isNeedCollect") == "always") {
                dirtyData[propertyName] = property.getData('value');
            }
            if (property && (String.equalsIgnoreCase(propertyName, tsName) || String.equalsIgnoreCase(propertyName, pkName))) {
                dirtyData[propertyName] = (property.getData ? property.getData("value") : property);
            }
        }
    }
    return dirtyData;
};

cb.model.ContainerModel.prototype.getModel2D = function (field) {
    if (field) {
        var model = this.get(field);
        return (model instanceof cb.model.Model2D) ? model : null;
    } else {
        var treeModelName = this.get("treeModelName");
        if (treeModelName) return this.get(treeModelName);
        var fields = this.get();
        for (var fieldName in fields) {
            var fieldValue = fields[fieldName];
            if (fieldValue instanceof cb.model.Model2D) {
                this.set("treeModelName", fieldName);
                return fieldValue;
            }
        }
        return null;
    }
};

cb.model.ContainerModel.prototype.getModel3D = function (field) {
    if (field) {
        var model = this.get(field);
        return (model instanceof cb.model.Model3D) ? model : null;
    }
    else {
        var gridModelName = this.get("gridModelName");
        if (gridModelName) return this.get(gridModelName);
        var fields = this.get();
        for (var fieldName in fields) {
            var fieldValue = fields[fieldName];
            if (fieldValue instanceof cb.model.Model3D) {
                this.set("gridModelName", fieldName);
                return fieldValue;
            }
        }
        return null;
    }
};

//cb.model.ContainerModel.prototype.getName = function () {
//    return this.get("ViewModelName");
//};
cb.model.ContainerModel.prototype.getSymbol = function () {
    return this.get("Symbol");
};
cb.model.ContainerModel.prototype.getPkName = function () {
    if (this._primaryKey)
        return this._primaryKey;

    this._primaryKey = "id"; //默认为id
    for (var attr in this._data) {
        var prop = this.get(attr);
        if (prop && prop.get && (prop.get("key") == true || prop.get("isKey") == true || prop.get("isKey") == "true")) {
            this._primaryKey = attr;
            break;
        }
    }
    return this._primaryKey;
};
cb.model.ContainerModel.prototype.getPkValue = function () {
    var pkName = this.getPkName();
    var prop = pkName && this.get(pkName);
    return prop ? (prop.get ? prop.get("value") : prop) : prop;
};
cb.model.ContainerModel.prototype.getTsValue = function () {
    var tsName = this.getTsName();
    var prop = tsName && this.get(tsName);
    return prop ? (prop.get ? prop.get("value") : prop) : prop;
};
cb.model.ContainerModel.prototype.getTsName = cb.model.Model3D.prototype.getTsName = function () {
    return "ts";
};
//需要丰富
cb.model.ContainerModel.prototype.loadData = function (data) {
    this._hasLoadData = true;
    cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
    this.clear();
    this.setData(data);
    this.setDirty(false);
    cb.model.PropertyChange.doPropertyChange(); //恢复值变化(PropertyChange)等
};
cb.model.ContainerModel.prototype.newRecord = function () {
    cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
    this.clear(true);
    cb.model.PropertyChange.doPropertyChange(); //恢复值变化(PropertyChange)等
};
cb.model.ContainerModel.prototype.restore = function () {
    cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
    this.clear();
    this.setData(this._originalData);
    this.setDirty(false);
    cb.model.PropertyChange.doPropertyChange(); //恢复值变化(PropertyChange)等
};
cb.model.ContainerModel.prototype.hasLoadData = function () {
    return this._hasLoadData;
};
cb.model.ContainerModel.prototype.getOriginalData = function () {
    return this._originalData;
};
cb.model.InterfaceFieldMap = {
    "id": "IBDObject{####}id",
    "pk_group": "IBDObject{####}pk_group",
    "pk_org": "IBDObject{####}pk_org",
    "creator": "IAuditInfo{####}creator",
    "creationtime": "IAuditInfo{####}creationtime",
    "modifier": "IAuditInfo{####}modifier",
    "modifiedtime": "IAuditInfo{####}modifiedtime",
    "billtype": "IFlowBizItf{####}billtype",
    "billno": "IFlowBizItf{####}billno",
    "rowno": "IRowNo{####}rowno"
};
cb.model.ContainerModel.prototype.getFieldModelFromInterfaceField = function (interfaceField) {
    var interfaces = this.get("interfaces");
    if (!interfaces) return null;
    var fieldMap = cb.model.InterfaceFieldMap[interfaceField];
    if (!fieldMap) return null;
    var propertyName = interfaces.get(fieldMap);
    if (!propertyName) return null;
    var fieldModel = this.get(propertyName);
    if (!fieldModel || !(fieldModel instanceof cb.model.BaseModel)) return null;
    return fieldModel;
};

cb.model.ContainerModel.prototype.setState = function (state) {
    var newState = state.toLowerCase();
    var model = this.get("States");
    if (model && model.getData()) {
        var states = model.getData();

        var actions = null;
        if (states && cb.isArray(states)) {
            for (var i = 0, j = states.length; i < j; i++) {
                if (states[i].state.toLowerCase() == newState) {
                    actions = states[i].actions;
                    break;
                }
            }
        }

        if (actions && cb.isArray(actions)) {
            for (var i = 0, j = actions.length; i < j; i++) {
                var item = actions[i];
                var disable = item.disable === "1" ? true : false;
                try {
                    if (this.get(item.field).setDisabled) {
                        this.get(item.field).setDisabled(disable);
                    }
                } catch (e) {
                }
            }
        }
    }
}

/* 批量设置按钮状态）
* 参数[{"field":"addAction","disable":1}]
*/
cb.model.ContainerModel.prototype.setActionState = function (actions) {
    if (actions && cb.isArray(actions)) {
        for (var i = 0, j = actions.length; i < j; i++) {
            var item = actions[i];
            var disable = item.disable === "1" ? true : false;
            try {
                if (this.get(item.field).setDisabled) {
                    this.get(item.field).setDisabled(disable);
                }
            } catch (e) {
            }
        }
    }
}

cb.model.ContainerModel.prototype.validate = function () {
    cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
    var result = true;
    var message = [];
    for (var attr in this._data) {
        if (attr.toLowerCase() === "id") continue;        //id不做校验
        var prop = this.get(attr);
        if (prop && prop.validate && cb.util.isFunction(prop.validate)) {
            var isvalid = prop.validate();
            if (!isvalid.isValid) {
                result = false;
                message.push(isvalid.info);
            }
        }
    }
    if (message.length > 0) {
        cb.util.tipMessage("以下信息不能为空：\r\n" + message.toString());
    }
    cb.model.PropertyChange.doPropertyChange(); //恢复值变化(PropertyChange)等
    return result;
};
cb.model.ContainerModel.prototype.cancelValidate = function () {
    cb.model.PropertyChange.delayPropertyChange(true);
    for (var attr in this._data) {
        var prop = this.get(attr);
        if (prop && prop.cancelValidate && cb.util.isFunction(prop.cancelValidate)) {
            prop.cancelValidate();
        }
    }
    cb.model.PropertyChange.doPropertyChange();
};
cb.model.ContainerModel.prototype.collectData = function (onlyCollectDirtyData) {
    /// <summary>数据收集： 默认this._controlType !== cb.ControlType.Button的数据不收集</summary>
    /// <param name="onlyCollectDirtyData" type="Boolean">onlyCollectDirtyData: 是否只收集脏数据</param>
    /// <returns type="Object">收集到的数据对象, JSON格式</returns>

    return onlyCollectDirtyData ? this.getDirtyData() : this.getData();
    //return this.getData();
};

/*
*  整单拷贝后，将表体数据状态设置为新增状态；
*  设置数据状态，主要是将
*/
cb.model.ContainerModel.prototype.setDataState = function (state) {
    var data = this._data;
    var rawData = {};
    var property;
    for (var propertyName in data) {
        property = this.get(propertyName);
        if (property == null)
            continue;
        if (property.setDataState) {
            property.setDataState(state);
        }

    }
    return this;
};

// #endregion

/*
* 树节点数据模型
*/
cb.model.TreeNode = (function () {
    function TreeNode(o, is_root, TreeNode_class) {
        if (is_root == null) {
            is_root = false;
        }
        if (TreeNode_class == null) {
            TreeNode_class = TreeNode;
        }
        this.setData(o);
        this.children = [];
        this.parent = null;
        if (is_root) {
            this.id_mapping = {};
            this.tree = this;
            this.TreeNode_class = TreeNode_class;
        }
    }

    TreeNode.prototype.setData = function (o) {
        var key, value, _results;
        if (typeof o !== 'object') {
            return this.name = o;
        } else {
            _results = [];
            for (key in o) {
                value = o[key];
                if (key === 'label') {
                    _results.push(this.name = value);
                } else if (key === 'code') {
                    _results.push(this.code = value);
                } else {
                    _results.push(this[key] = value);
                }
            }
            return _results;
        }
    };

    TreeNode.prototype.initFromData = function (data) {
        var addChildren, addTreeNode,
    _this = this;
        addTreeNode = function (TreeNode_data) {
            _this.setData(TreeNode_data);
            if (TreeNode_data.children) {
                return addChildren(TreeNode_data.children);
            }
        };
        addChildren = function (children_data) {
            var child, TreeNode, _i, _len;
            for (_i = 0, _len = children_data.length; _i < _len; _i++) {
                child = children_data[_i];
                TreeNode = new _this.tree.TreeNode_class('');
                TreeNode.initFromData(child);
                _this.addChild(TreeNode);
            }
            return null;
        };
        addTreeNode(data);
        return null;
    };

    /*
    Create tree from data.

    Structure of data is:
    [
    {
    label: 'TreeNode1',
    children: [
    { label: 'child1' },
    { label: 'child2' }
    ]
    },
    {
    label: 'TreeNode2'
    }
    ]
    */


    TreeNode.prototype.loadFromData = function (data) {
        var TreeNode, o, _i, _len;
        this.removeChildren();
        for (_i = 0, _len = data.length; _i < _len; _i++) {
            o = data[_i];
            TreeNode = new this.tree.TreeNode_class(o);
            this.addChild(TreeNode);
            if (typeof o === 'object' && o.children) {
                TreeNode.loadFromData(o.children);
            }
        }
        return null;
    };

    /*
    Add child.

    tree.addChild(
    new TreeNode('child1')
    );
    */


    TreeNode.prototype.addChild = function (TreeNode) {
        this.children.push(TreeNode);
        return TreeNode._setParent(this);
    };

    /*
    Add child at position. Index starts at 0.

    tree.addChildAtPosition(
    new TreeNode('abc'),
    1
    );
    */


    TreeNode.prototype.addChildAtPosition = function (TreeNode, index) {
        this.children.splice(index, 0, TreeNode);
        return TreeNode._setParent(this);
    };

    TreeNode.prototype._setParent = function (parent) {
        this.parent = parent;
        this.tree = parent.tree;
        return this.tree.addTreeNodeToIndex(this);
    };

    /*
    Remove child. This also removes the children of the TreeNode.

    tree.removeChild(tree.children[0]);
    */


    TreeNode.prototype.removeChild = function (TreeNode) {
        TreeNode.removeChildren();
        return this._removeChild(TreeNode);
    };

    TreeNode.prototype._removeChild = function (TreeNode) {
        this.children.splice(this.getChildIndex(TreeNode), 1);
        return this.tree.removeTreeNodeFromIndex(TreeNode);
    };

    /*
    Get child index.

    var index = getChildIndex(TreeNode);
    */


    TreeNode.prototype.getChildIndex = function (TreeNode) {
        return $.inArray(TreeNode, this.children);
    };

    /*
    Does the tree have children?

    if (tree.hasChildren()) {
    //
    }
    */


    TreeNode.prototype.hasChildren = function () {
        return this.children.length !== 0;
    };

    TreeNode.prototype.isFolder = function () {
        return this.hasChildren() || this.load_on_demand;
    };

    /*
    Iterate over all the TreeNodes in the tree.

    Calls callback with (TreeNode, level).

    The callback must return true to continue the iteration on current TreeNode.

    tree.iterate(
    function(TreeNode, level) {
    console.log(TreeNode.name);

    // stop iteration after level 2
    return (level <= 2);
    }
    );
    */


    TreeNode.prototype.iterate = function (callback) {
        var _iterate,
    _this = this;
        _iterate = function (TreeNode, level) {
            var child, result, _i, _len, _ref1;
            if (TreeNode.children) {
                _ref1 = TreeNode.children;
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                    child = _ref1[_i];
                    result = callback(child, level);
                    if (_this.hasChildren() && result) {
                        _iterate(child, level + 1);
                    }
                }
                return null;
            }
        };
        _iterate(this, 0);
        return null;
    };

    /*
    Move TreeNode relative to another TreeNode.

    Argument position: Position.BEFORE, Position.AFTER or Position.Inside

    // move TreeNode1 after TreeNode2
    tree.moveTreeNode(TreeNode1, TreeNode2, Position.AFTER);
    */


    TreeNode.prototype.moveTreeNode = function (moved_TreeNode, target_TreeNode, position) {
        if (moved_TreeNode.isParentOf(target_TreeNode)) {
            return;
        }
        moved_TreeNode.parent._removeChild(moved_TreeNode);
        if (position === Position.AFTER) {
            return target_TreeNode.parent.addChildAtPosition(moved_TreeNode, target_TreeNode.parent.getChildIndex(target_TreeNode) + 1);
        } else if (position === Position.BEFORE) {
            return target_TreeNode.parent.addChildAtPosition(moved_TreeNode, target_TreeNode.parent.getChildIndex(target_TreeNode));
        } else if (position === Position.INSIDE) {
            return target_TreeNode.addChildAtPosition(moved_TreeNode, 0);
        }
    };

    /*
    Get the tree as data.
    */


    TreeNode.prototype.getData = function () {
        var getDataFromTreeNodes,
    _this = this;
        getDataFromTreeNodes = function (TreeNodes) {
            var data, k, TreeNode, tmp_TreeNode, v, _i, _len;
            data = [];
            for (_i = 0, _len = TreeNodes.length; _i < _len; _i++) {
                TreeNode = TreeNodes[_i];
                tmp_TreeNode = {};
                for (k in TreeNode) {
                    v = TreeNode[k];
                    if ((k !== 'parent' && k !== 'children' && k !== 'element' && k !== 'tree') && Object.prototype.hasOwnProperty.call(TreeNode, k)) {
                        tmp_TreeNode[k] = v;
                    }
                }
                if (TreeNode.hasChildren()) {
                    tmp_TreeNode.children = getDataFromTreeNodes(TreeNode.children);
                }
                data.push(tmp_TreeNode);
            }
            return data;
        };
        return getDataFromTreeNodes(this.children);
    };

    TreeNode.prototype.getTreeNodeByName = function (name) {
        var result;
        result = null;
        this.iterate(function (TreeNode) {
            if (TreeNode.name === name) {
                result = TreeNode;
                return false;
            } else {
                return true;
            }
        });
        return result;
    };

    TreeNode.prototype.addAfter = function (TreeNode_info) {
        var child_index, TreeNode;
        if (!this.parent) {
            return null;
        } else {
            TreeNode = new this.tree.TreeNode_class(TreeNode_info);
            child_index = this.parent.getChildIndex(this);
            this.parent.addChildAtPosition(TreeNode, child_index + 1);
            return TreeNode;
        }
    };

    TreeNode.prototype.addBefore = function (TreeNode_info) {
        var child_index, TreeNode;
        if (!this.parent) {
            return null;
        } else {
            TreeNode = new this.tree.TreeNode_class(TreeNode_info);
            child_index = this.parent.getChildIndex(this);
            this.parent.addChildAtPosition(TreeNode, child_index);
            return TreeNode;
        }
    };

    TreeNode.prototype.addParent = function (TreeNode_info) {
        var child, new_parent, original_parent, _i, _len, _ref1;
        if (!this.parent) {
            return null;
        } else {
            new_parent = new this.tree.TreeNode_class(TreeNode_info);
            new_parent._setParent(this.tree);
            original_parent = this.parent;
            _ref1 = original_parent.children;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                child = _ref1[_i];
                new_parent.addChild(child);
            }
            original_parent.children = [];
            original_parent.addChild(new_parent);
            return new_parent;
        }
    };

    TreeNode.prototype.remove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
            return this.parent = null;
        }
    };

    TreeNode.prototype.append = function (TreeNode_info) {
        var TreeNode;
        TreeNode = new this.tree.TreeNode_class(TreeNode_info);
        this.addChild(TreeNode);
        return TreeNode;
    };

    TreeNode.prototype.prepend = function (TreeNode_info) {
        var TreeNode;
        TreeNode = new this.tree.TreeNode_class(TreeNode_info);
        this.addChildAtPosition(TreeNode, 0);
        return TreeNode;
    };

    TreeNode.prototype.isParentOf = function (TreeNode) {
        var parent;
        parent = TreeNode.parent;
        while (parent) {
            if (parent === this) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    };

    TreeNode.prototype.getLevel = function () {
        var level, TreeNode;
        level = 0;
        TreeNode = this;
        while (TreeNode.parent) {
            level += 1;
            TreeNode = TreeNode.parent;
        }
        return level;
    };

    TreeNode.prototype.getTreeNodeById = function (TreeNode_id) {
        return this.id_mapping[TreeNode_id];
    };

    TreeNode.prototype.addTreeNodeToIndex = function (TreeNode) {
        if (TreeNode.id != null) {
            return this.id_mapping[TreeNode.id] = TreeNode;
        }
    };

    TreeNode.prototype.removeTreeNodeFromIndex = function (TreeNode) {
        if (TreeNode.id != null) {
            return delete this.id_mapping[TreeNode.id];
        }
    };

    TreeNode.prototype.removeChildren = function () {
        var _this = this;
        this.iterate(function (child) {
            _this.tree.removeTreeNodeFromIndex(child);
            return true;
        });
        return this.children = [];
    };

    TreeNode.prototype.getPreviousSibling = function () {
        var previous_index;
        if (!this.parent) {
            return null;
        } else {
            previous_index = this.parent.getChildIndex(this) - 1;
            if (previous_index >= 0) {
                return this.parent.children[previous_index];
            } else {
                return null;
            }
        }
    };

    TreeNode.prototype.getNextSibling = function () {
        var next_index;
        if (!this.parent) {
            return null;
        } else {
            next_index = this.parent.getChildIndex(this) + 1;
            if (next_index < this.parent.children.length) {
                return this.parent.children[next_index];
            } else {
                return null;
            }
        }
    };

    return TreeNode;

})();

//#endregion model

//#region binding

cb.binding = {};
cb.binding.create = function (mapping, parent) {
    if (!mapping)
        return null;
    var binding = cb.binding[mapping.controlType + "Binding"];
    if (!binding || typeof (binding) != 'function')
        return null;
    var bind = new binding(mapping, parent);
    return bind;
}
cb.binding.Mapping = function (controlId, propertyName, controlType, childMappings) {
    this.propertyName = propertyName;
    this.controlId = controlId;
    this.controlType = controlType;
    this.childMappings = childMappings;
};

//绑定方式：OneWay:单向绑定（ModelToUI）；TwoWay：双向绑定；None：不绑定到界面；OneTime：只绑定一次(目前暂不支持)
cb.binding.BindingMode = { OneWay: "OneWay", TwoWay: "TwoWay", None: "None", OneTime: "OneTime" };

cb.binding.BaseBinding = function (mapping, parent) {
    this._parent = parent;
    this._mapping = mapping;
    this._childBindings = null;
    this._onchange = function (event) {
        cb.console.log("_onchange", this);

        var model = this.getModel();
        if (!model) return;
        var oldValue = model.getValue();
        //var newValue = this.getControl().get("value");
        var newValue = this.getProperty(this.getControl(), "value");
        if (newValue === oldValue)
            return;
        if (model.change) {
            var isChange = model.change(newValue, oldValue);

            //以下逻辑是否需要，需要再讨论
            if (isChange === false) {
                //还原
                this.getControl().set("value", oldValue);
            }
        }
        if (this.getControl().setNoinput && model.get("nullable") === false)
            this.getControl().setNoinput(!newValue);

        cb.console.log("_onchange", "###newValue:" + newValue + ",oldValue:" + oldValue + "###");
    };
    this._onclick = function (event) {
        cb.console.log("_onclick", this);
        var model = this.getModel();
        if (!model) return;
        var control = this.getControl();
        if (control) cb.cache.set("clickElement", control._get_data("id"));
        if (model.click)
            model.click(event);
        cb.console.log("_onclick", this);
    };
}
cb.binding.BaseBinding.prototype.init = function (mapping, parent) {
    this._mapping = mapping || this._mapping;
    this._parent = parent || this._parent;
    if (this._parent) {
        this.initData();
    }
    this.applyBindings();

    if (!this._mapping)
        return;
    var childMappings = this._mapping.childMappings;
    if (!childMappings || childMappings.length <= 0)
        return;

    //if (this._childBindings == null)
    //    this._childBindings = [];

    //初始化之前先清空旧的绑定器??? 需要断链
    if (this._childBindings) {
        for (var i = 0; i < this._childBindings.length; i++) {
            var binding = this._childBindings[i];
            var model = binding.getModel();
            if (model)
                model.removeListener(binding);
            binding._parent = null;
        }
    }

    this._childBindings = [];
    for (var i = 0; i < childMappings.length; i++) {
        if (!childMappings[i].bindingMode)
            childMappings[i].bindingMode = childMappings[i].controlType === cb.ControlType.Button ? cb.binding.BindingMode.OneTime : cb.binding.BindingMode.TwoWay;
        if (childMappings[i].bindingMode == cb.binding.BindingMode.None)//为None,不绑定
            continue;
        var binding = cb.binding.create(childMappings[i], this);
        if (binding == null) {
            cb.console.error("以下mapping的绑定器为初始化为空！");
            cb.console.error(childMappings[i]);
            continue;
        }
        var model = binding.getModel();
        if (model) {
            model._data.controlType = childMappings[i].controlType;
            //model._data.bindingMode = childMappings[i].bindingMode;
            //model._bindingMode = childMappings[i].bindingMode; //不一定准确(只是作为记录)，因为一个属性可以绑到多个控件上，而控件本身的绑定方式不一样
        }
        binding.init();
        this._childBindings.push(binding);
    }
};
cb.binding.BaseBinding.prototype.applyBindings = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;

    //从控件到model
    if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay || this._mapping.bindingMode == cb.binding.BindingMode.OneTime) {
        if (this._onchange && (model.change || model.hasEvent("beforechange") || model.hasEvent("afterchange"))) {
            if (control.un) control.un("change", this._onchange);
            if (control.on) control.on("change", this._onchange, this);
        }
        if (this._onchange && (model.change || model.hasEvent("beforechange") || model.hasEvent("afterchange"))) {
            if (control.un) control.un("enter", this._onchange);
            if (control.on) control.on("enter", this._onchange, this);
        }
        if (this._onclick && (model.click || model.hasEvent("beforeclick") || model.hasEvent("afterclick"))) {
            if (control.un) control.un("click", this._onclick);
            if (control.on) control.on("click", this._onclick, this);
        }
    }
    model.addListener(this);
}
cb.binding.BaseBinding.prototype.toString = function () {
    return "###controlId:" + this._mapping.controlId + ",propertyName:" + this._mapping.propertyName;
}
cb.binding.BaseBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    var data = model._data;

    if (data["alwaysReadOnly"] && data["readOnly"] == null)
        data["readOnly"] = data["alwaysReadOnly"];
    //如果绑定器中明确定义了处理data改变的方法，则交个绑定器处理，否则看控件是否有定义处理过程（setData），默认通过绑定器逐个同步数据到视图
    if (this._set_data) {
        this._set_data(cb.clone(data));
        return;
    }

    if (control.setData) {
        control.setData(data);
        return;
    }
    data.bindingMode = this._mapping.bindingMode;
    data.controlType = this._mapping.controlType;
    for (var attr in data) {
        this.setProperty(control, attr, data[attr]);
    }
}

cb.binding.BaseBinding.prototype.getModel = function (propertyName) {
    if (this._parent)
        return this._parent.getModel(this._mapping.propertyName);
}
cb.binding.BaseBinding.prototype.getControl = function (controlId) {
    if (this._parent)
        return this._parent.getControl(this._mapping.controlId, this._mapping.controlType);
}
cb.binding.BaseBinding.prototype.Model2UI = cb.binding.BaseBinding.prototype.PropertyChangeEvent = function (evt) {
    cb.console.log("PropertyChangeEvent", evt);
    if (!evt) return;
    var control = this.getControl();
    if (!control) return;
    if (this.getProperty(control, evt.PropertyName) === evt.PropertyValue)//如果属性值相等，则不触发刷新
        return;
    this.setProperty(control, evt.PropertyName, evt.PropertyValue);

    cb.console.log("PropertyChangeEvent", evt);
}

cb.binding.BaseBinding.prototype.getProperty = function (control, propertyName) {
    var getMethod = this.get_method("get", control, propertyName);
    if (getMethod)
        return getMethod.call(this, control);
};

cb.binding.BaseBinding.prototype.setProperty = function (control, propertyName, propertyValue) {
    var setMethod = this.get_method("set", control, propertyName);
    if (setMethod)
        setMethod.call(this, control, propertyValue);
};

//需要优化(prefix: "get" or "set")
cb.binding.BaseBinding.prototype.get_method = function (prefix, control, propertyName) {
    if (!control || !propertyName || !prefix) return;
    var propertyNameLower = propertyName.toLowerCase();

    if (propertyNameLower.indexOf(prefix) == 0)
        propertyNameLower = propertyNameLower.substring(3);
    var method = this["_" + prefix + "_" + propertyNameLower];
    if (method) return method;

    var controlMethodName = prefix + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1, propertyName.length);
    if (!control[controlMethodName]) return;

    //动态创建方法
    method = this["_" + prefix + "_" + propertyNameLower] = function (ctrl, propertyValue) {
        if (ctrl[controlMethodName])
            ctrl[controlMethodName].call(ctrl, propertyValue);
    };
    return method;
};

cb.binding.BaseBinding.prototype._set_value = function (control, propertyValue) {
    if (control.setValue) {
        control.setValue(propertyValue);
    }
};

cb.binding.BaseBinding.prototype._get_value = function (control) {
    if (control.getValue) {
        return control.getValue();
    }
};

cb.binding.BaseBinding.prototype._set_readonly = function (control, propertyValue) {
    if (control.setReadOnly) {
        control.setReadOnly(propertyValue);
    }
};

cb.binding.BaseBinding.prototype._set_disabled = function (control, propertyValue) {
    if (control.setDisabled) {
        control.setDisabled(propertyValue);
    }
};

cb.binding.ContainerBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    if (!this._mapping.childMappings)
        this._mapping.childMappings = [];
    if (!this._childBindings)
        this._childBindings = [];

    this.remove = function (mapping) {
        if (!mapping)
            return;
        if (typeof mapping == "object") {
            if (cb.isArray(mapping))
                this.removeMappings(mapping);
            else
                this.removeMapping(mapping);
        }
        else if (typeof mapping == "string") {
            var controlId = mapping;
            var childMappings = this._mapping.childMappings;
            var index = childMappings.findIndex(function (childMapping) { return (childMapping.controlId == controlId); });
            childMappings.remove(index);
            var index = this._childBindings.findIndex(function (childMapping) { return (childMapping._mapping.controlId == controlId); });
            this._childBindings.remove(index);
        }
    }
    this.removeMappings = function (mapping) {
        for (var i = 0; i < mapping.length; i++) {
            this.removeMapping(mapping[i]);
        }
    }
    this.removeMapping = function (mapping) {
        if (this._mapping.childMappings)
            this._mapping.childMappings.removeData(mapping);
        var index = this._childBindings.findIndex(function (childBinding) { return (childBinding._mapping.controlId == mapping.controlId && childBinding._mapping.propertyName == mapping.propertyName); });
        this._childBindings.remove(index);
    }
    this.add = function (mapping) {
        if (arguments.length == 0)
            return;
        else if (arguments.length == 1) {
            if (!mapping)
                return;
            if (cb.isArray(mapping))
                this.addMappings(mapping);
            else
                this.addMapping(mapping);
        }
        else if (arguments.length == 3 && typeof arguments[0] == "string" && typeof arguments[1] == "string") {
            var _mapping = new cb.binding.Mapping(arguments[0], arguments[1], arguments[2]);
            this.addMapping(_mapping);
        }
    }
    this.addMappings = function (mapping) {
        for (var i = 0; i < mapping.length; i++) {
            this.addMapping(mapping[i]);
        }
    }
    this.addMapping = function (mapping) {
        var binding = cb.binding.create(mapping, this);
        binding.init();
        this._mapping.childMappings.push(mapping);
        this._childBindings.push(binding);
    }
    this.setMapping = function (mapping) {
        this.set(mapping, this._viewModel);
    }
    this.setModel = function (model) {
        if (typeof model == "string")
            this._viewModel = cb.cache.get(model) || cb.cache.get(this._mapping.propertyName);
        else
            this._viewModel = model;
        this._viewModel.addListener(this);  //后面会有
        this.set(this._mapping, this._viewModel);
    }
    this.set = function (mapping, model) {
        this._mapping = mapping || this._mapping;
        this._viewModel = model || this._viewModel;
        this._mapping.propertyName = model.getModelName();
        this.init();
    }
    this.getChildMapping = function (propertyName) {

    }
}
cb.binding.ContainerBinding.create = function (viewId, viewModel, childMappings) {
    //if (viewModel) {
    var mapping = new cb.binding.Mapping(viewId, viewModel && viewModel.getModelName(), "view", childMappings);
    var containerBinding = new cb.binding.ContainerBinding(mapping);
    containerBinding.init();
    cb.cache.bindings.set(viewId, containerBinding);
    return containerBinding;
    // }
}
cb.binding.ContainerBinding.prototype = new cb.binding.BaseBinding();
cb.binding.ContainerBinding.prototype.getModel = function (propertyName) {
    if (this._viewModel == null)
        this._viewModel = cb.cache.get(this._mapping.propertyName); //先获取自己的Model,缓存
    return (this._viewModel && this._viewModel._data) ? this._viewModel._data[propertyName] : null;
}
cb.binding.ContainerBinding.prototype.getControl = function (controlId, controlType) {
    //if (!this._view)
    //    this._view = cb.getControl(this._mapping.controlId, this._mapping.controlType); //缓存
    //return this._view && cb.getControl(controlId, controlType);
    return cb.getControl(controlId, controlType);
};
cb.binding.ContainerBinding.prototype.applyBindings = function () {
    this._viewModel = this._viewModel || cb.cache.get(this._mapping.propertyName);
    if (this._viewModel)
        this._viewModel.addListener(this);
}
//cb.binding.ContainerBinding.prototype.initData = function () {
////    for (var i = 0; i < this._childBindings.length; i++) {
////        this._childBindings[i].initData();
////    }
//}

//这个方法需要根据实际调试丰富
cb.binding.ContainerBinding.prototype.Model2UI = cb.binding.ContainerBinding.prototype.PropertyChangeEvent = function (args) {
    if (!args) return;
    if (!this._viewModel)
        return;

    //当三维模型中的一行（可编辑行）作为其他View的ViewModel时，需要同步数据。
    var editRowModel = this._viewModel;
    var m3d = editRowModel.getParent(); //Model3D
    if (!m3d || editRowModel != m3d._editRowModel)
        return;
    if (m3d.getFocusedRow() == null)
        return;
    var rowIndex = m3d.getRowIndex(m3d.getFocusedRow());
    if (rowIndex < 0)
        return;

    var cellName = editRowModel._data.hasOwnProperty(args.ModelName) ? args.ModelName : null;    // 如果是ViewModel，特殊处理,需要往行上写数据
    var propertyName = args.PropertyName == "value" ? null : args.PropertyName;
    var oldValue = m3d.get(rowIndex, cellName, propertyName);
    if (oldValue === args.Value)
        return;
    if (propertyName === null)
        m3d.cellChange(rowIndex, cellName, args.Value); //需要触发行上的aftercellchange\beforecellchange事件
    else
        m3d.set(rowIndex, cellName, propertyName, args.Value);
}

//#endregion binding

//#region global utils viewmodel viewbinding
cb.util = {};

cb.util.loadingControl = {
    handler: document.getElementsByClassName("loadingController"),
    startControl: function () {
        if (!this.handler.length && this.handler.tagName !== "DIV") {
            this.handler = document.createElement("div");
            this.handler.setAttribute("class", "loadingController");
            document.body.appendChild(this.handler);
        }
        if (this.handler.style.display === "none") {
            this.handler.style.display = "block";
            return;
        }
        this.handler.style.position = "fixed";
        this.handler.style.top = 0;
        this.handler.style.right = 0;
        this.handler.style.left = 0;
        this.handler.style.bottom = 0;
        this.handler.style.opacity = 1;
        this.handler.style.zIndex = 20000;
        this.handler.style.background = 'url("./pc/images/operationsController/load.gif") no-repeat 50% 50%';
    },
    endControl: function () {
        if (!this.handler) return;
        this.handler.style.display = "none";
    }
},


cb.util.formatDate = function (strDate) {
    var dateString = strDate && strDate.replace && strDate.replace(/-/g, "/");
    var date = new Date(dateString || strDate);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var currentDate = year + "-";
    if (month >= 10) {
        currentDate += month + "-";
    }
    else {
        currentDate += "0" + month + "-";
    }
    if (day >= 10) {
        currentDate += day;
    }
    else {
        currentDate += "0" + day;
    }
    return currentDate;
};
cb.util.formatTime = function (strDate) {
    var dateString = strDate && strDate.replace && strDate.replace(/-/g, "/");
    var date = new Date(dateString || strDate);
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var currentDate = "";

    if (hour >= 10) {
        currentDate += hour + ":";
    }
    else {
        currentDate += "0" + hour + ":";
    }
    if (minute >= 10) {
        currentDate += minute + ":";
    }
    else {
        currentDate += "0" + minute + ":";
    }
    if (second >= 10) {
        currentDate += second;
    }
    else {
        currentDate += "0" + second;
    }
    return currentDate;
};

cb.util.formatDateTime = function (strDate) {
    var dateString = strDate && strDate.replace && strDate.replace(/-/g, "/");
    var date = new Date(dateString || strDate);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var currentDate = year + "-";
    if (month >= 10) {
        currentDate += month + "-";
    }
    else {
        currentDate += "0" + month + "-";
    }
    if (day >= 10) {
        currentDate += day;
    }
    else {
        currentDate += "0" + day;
    }
    if (hour >= 10) {
        currentDate += " " + hour + ":";
    }
    else {
        currentDate += " 0" + hour + ":";
    }
    if (minute >= 10) {
        currentDate += minute + ":";
    }
    else {
        currentDate += "0" + minute + ":";
    }
    if (second >= 10) {
        currentDate += second;
    }
    else {
        currentDate += "0" + second;
    }
    return currentDate;
};
cb.util.getPopupZIndex = function () {
    if (cb.cache.get("popupZIndex")) cb.cache.set("popupZIndex", cb.cache.get("popupZIndex") + 1);
    else cb.cache.set("popupZIndex", 9999);
    return cb.cache.get("popupZIndex");
};

cb.util.queryString = function (qs) {
    //对href做特殊处理、对于单页面应用有些浏览器获取不到id、mode，暂时处理，后续通过页面参数传递方案改进
    if (qs && qs.indexOf("#") >= 0) {
        var urls = qs.split("#");
        if (urls.length >= 2 && (urls[1].indexOf("id=") >= 0 || urls[1].indexOf("mode=") >= 0))
            qs = urls[1];
    }
    this.p = {};
    if (!qs)
        qs = location.search;
    if (qs) {
        var b = qs.indexOf('?');
        var e = qs.indexOf('#');
        if (b >= 0) {
            qs = e < 0 ? qs.substr(b + 1) : qs.substring(b + 1, e);
            if (qs.length > 0) {
                qs = qs.replace(/\+/g, ' ');
                var a = qs.split('&');
                for (var i = 0; i < a.length; i++) {
                    var t = a[i].split('=');
                    var n = decodeURIComponent(t[0]);
                    var v = (t.length == 2) ? decodeURIComponent(t[1]) : n;
                    this.p[n] = v;
                }
            }
        }
    }
    this.set = function (name, value) {
        this.p[name] = value;
        return this;
    };
    this.get = function (name, def) {
        var v = this.p[name];
        return (v != null) ? v : def;
    };
    this.has = function (name) {
        return this.p[name] != null;
    };
    this.toStr = function () {
        var r = '?';
        for (var k in this.p) {
            r += encodeURIComponent(k) + '=' + encodeURIComponent(this.p[k]) + '&';
        }
        return r;
    };
};

cb.util.confirmMessage = function (msg, okCallback, cancelCallback, context) {
    new cb.controls.MessageBox({
        "displayMode": "confirm",
        "msg": msg,
        "okCallback": okCallback,
        "cancelCallback": cancelCallback,
        "context": context
    });
};
cb.util.warningMessage = function (title, msg, okCallback, context) {
    new cb.controls.MessageBox({
        "displayMode": "warning",
        "title": title,
        "msg": msg,
        "okCallback": okCallback,
        "context": context
    });
};
cb.util.tipMessage = function (msg, okCallback, context) {
    new cb.controls.MessageBox({
        "displayMode": "tip",
        "msg": msg,
        "okCallback": okCallback,
        "context": context
    });
};
cb.util.isFunction = function (args) {
    return typeof args == "function";
};
//转化参照
cb.util._convertToReferInfo = function (column, refcodename) {
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
//转换栏目信息格式
cb.util.convertToColumns = function (data) {

    var convertToReferInfo = cb.util._convertToReferInfo;

    //showflag: { title: "是否显示", editable:true, columnType: "CheckBox", visible: true, width: 100, priority: 0, align: 1 },
    var columns = {};
    if ($.isArray(data)) {
        for (var i = 0, j = data.length; i < j; i++) {
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
            column.locked = data[i]["fixedflag"]; // 是否冻结列固定列
            delete data[i]["fixedflag"];
            column.isNullable = data[i]["nullflag"]; // 是否为空
            delete data[i]["mustselflag"];
            if (data[i]["totalflag"]) {  // 是否合计
                column.aggregates = "sum";
            }
            column.statistics = data[i]["totalflag"];
            delete data[i]["totalflag"];
            



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
                //column.dataSource = convertoDataSource(data[i]["fieldmdvalue"]);
                delete data[i]["fieldmdvalue"];
            }
            column.isKey = data[i]["primarykeyflag"];
            delete data[i]["primarykeyflag"];
            columns[data[i]["fieldcode"]] = column;
        }
    }
    return columns;
};

/* 划线 元素之间都可以 传jquery的筛选器
 [
 	{
 		id:"id",
 		preList:["pre1","pre2"]
 	},
 	{}
 ]
 * */
cb.util.connectByLine = function(data){
	if(!data)return;
	//if(!typeof data.preList =='array')return;
	//if(!typeof data.preList =='array')return;
	//var preList = data.preList;
	for(var item in data){
		var $item = $('#'+item.id)[0];
		for(var i=0,len=item.preList.length;i<len;i++){
			var $pre = $('#'+item.preList[i]);
			cb.util.createLine($pre,item);
		}
	}
};
cb.util.createLine=function(pre,current,container){
	for(var i=0;i<current.length;i++){
		for(var j=0;j<pre.length;j++){
		    CreateLine(pre[j], current[i], container[0]);
		};
	};
	
	function CreateLine(preDom, currentDom, containerDom) {
		var preEle = {pageX:pageX(preDom),pageY:pageY(preDom),Ele:preDom,height:preDom.offsetHeight,width:preDom.offsetWidth};
		var currentEle = { pageX: pageX(currentDom), pageY: pageY(currentDom), Ele: currentDom, height: currentDom.offsetHeight, width: currentDom.offsetWidth };
		var containerDom = { pageX: pageX(containerDom), pageY: pageY(containerDom), Ele: containerDom, height: containerDom.offsetHeight, width: containerDom.offsetWidth };
		var line = {x:Math.abs((preEle.pageX-currentEle.pageX)>0?(preEle.pageX-currentEle.pageX-currentEle.width):(preEle.pageX-currentEle.pageX+preEle.width)),y:Math.abs((preEle.pageY-currentEle.pageY)>0?(preEle.pageY-currentEle.pageY+preEle.height/2-currentEle.height/2):(preEle.pageY-currentEle.pageY-currentEle.height/2+preEle.height/2))}; 
		
		line.width = Math.sqrt(line.x*line.x +line.y*line.y);
		line.pageX = (preEle.pageX-currentEle.pageX)>0?(currentEle.pageX+currentEle.width):(preEle.pageX+preEle.width);
		line.pageY = (preEle.pageY - currentEle.pageY) > 0 ? (preEle.pageY + preEle.height / 2) : (preEle.pageY + preEle.height / 2);
		if (containerDom) {
		    line.pageX = line.pageX- containerDom.pageX;
		    line.pageY = line.pageY-containerDom.pageY;
		}
		line.angle = 360*Math.atan(line.y/line.x)/(2*Math.PI);
		line.angle =  (preEle.pageX-currentEle.pageX)>0||(preEle.pageY-currentEle.pageY)>0?line.angle:-line.angle;
		//line.angle = 45;
		//line.angle = line.angle*Math.PI/180;
		var style='';//,angle:360*Math.atan(this.y/this.x)/(2*Math.PI)
		var params ={a:Math.cos(line.angle),b:Math.sin(line.angle),c:-Math.sin(line.angle),d:Math.cos(line.angle)}//,e:line.pageX,f:line.pageY
		params.e = line.pageX*(1-params.a)-params.c*line.pageY;
		params.f = Math.abs(line.pageY*(1-params.a)-params.b*line.pageX);
		//var $line = $('<div style="width:'+line.width+'px;-webkit-transform:rotate('+line.angle+'deg);-webkit-transform:translate('+line.pageX+'px,'+line.pageY+'px);border-bottom:1px solid #666666;"></div>')
		var $line = $('<div style="position:absolute;top:'+line.pageY+'px;left:'+line.pageX+'px;-webkit-transform:rotate('+-line.angle+'deg);width:'+line.width+'px;border-bottom:1px solid #666;"></div>')
		
		//var $line = $('<div style="-webkit-transform:matrix('+params.a+','+params.b+','+params.c+','+params.d+','+params.e+','+params.f+');width:'+line.width+'px;border-bottom:1px solid #666666;"></div>')
		//var $line = $('<div style="-webkit-transform:matrix('+Math.cos(line.angle)+','+Math.sin(line.angle)+','+Math.sin(line.angle)+','+Math.cos(line.angle)+',0,0);width:'+line.width+'px;border-bottom:1px solid #666666;"></div>')
		$line.css({'-moz-transform-origin':'top left','-webkit-transform-origin': 'top left','-o-transform-origin': 'top left','transform-origin': 'top left'});
		$(currentDom.parentNode).append($line);
	};
	function pageX(elem) {
		//检查我们是否已经到了根元素
		return elem.offsetParent ?
	    //如果我们还能往上，则将当前偏移与向上递归的值相加
	    elem.offsetLeft + pageX( elem.offsetParent ) :
	    //否则，取当前偏移
	    elem.offsetLeft;
	};
	//计算元素的Y(垂直，顶)位置
	function pageY(elem) {
		//检查我们是否已经到了根元素
		return elem.offsetParent ?
	    //如果我们还能往上，则将当前偏移与向上递归的值相加
	    elem.offsetTop + pageY( elem.offsetParent ) :
	    //否则，取当前偏移
	    elem.offsetTop;
	}
}

cb.viewmodel = {};
cb.viewbinding = {};
cb.viewmodel.create = function (options) {
    var modelName = (options && options.ViewModelName) || cb.getNewId("newViewModel");
    var model = cb.model.ContainerModel.create(options, modelName);
    cb.cache.set(modelName, model);
    return model;
};
cb.viewbinding.init = cb.viewbinding.create = function (viewId, viewModel, childMappings) {
    if (!viewId) return;
    if (!viewModel) {
        var view = document.getElementById(viewId); // cb.getControl(viewId);
        viewId = cb.getNewId("cb_view_" + viewId);
        view.setAttribute("id", viewId);
        var viewModelName = view && (view.getAttribute("data-viewmodel"));

        //----------数据加载会保持上次的，以后再优化从缓存取ViewModel的情况-----------------
        //if (viewModelName)
        //    viewModel = cb.cache.get(viewModelName);
        //------------------------------------------------------------
        if (!viewModel) {
            //自动创建ViewModel，如果没有创建ViewModel，考虑自动创建
            var newViewModelName = cb.route.getViewModelName ? cb.route.getViewModelName(viewModelName) : viewModelName;
            var viewModelConstructor = window[newViewModelName] || cb.viewmodel[newViewModelName] || cb.model[newViewModelName];
            if (typeof viewModelConstructor === "function") {
                viewModel = new viewModelConstructor(viewModelName);
                //var modelName = viewModel.getModelName() || cb.getNewId("newViewModel_" + viewModelName);
                cb.cache.set(viewModelName, viewModel);
            }
        }
    }
    else {
        var modelName = viewModel.getModelName() || cb.getNewId("newViewModel");
        var vmCache = cb.cache.get(modelName);

        if (vmCache && vmCache !== viewModel) {
            cb.console.error("重复创建ViewModel：Name= " + modelName);
            cb.tempData = { vmCache: vmCache, viewModel: viewModel };
            cb.console.log(cb.tempData);
        }
        else
            cb.cache.set(modelName, viewModel);
    }
    if (!childMappings) {
        childMappings = cb.getChildMappingsByView(viewId, viewModel);
    }

    cb.controls.createControls(childMappings);  //创建控件

    return cb.binding.ContainerBinding.create(viewId, viewModel, childMappings);
};
cb.viewbinding.update = function (viewId) {
    if (!viewId) return;
    var containerBinding = cb.cache.bindings.get(viewId);
    if (!containerBinding) return;
    var childMappings = cb.getChildMappingsByView(viewId, containerBinding._viewModel);
    cb.controls.createControls(childMappings);
    containerBinding.add(childMappings);
    cb.cache.mappings.set(viewId, childMappings);
};
cb.viewbinding.remove = function (viewId) {
    if (!viewId) return;
    var containerBinding = cb.cache.bindings.get(viewId);
    if (!containerBinding) return;
    var childMappings = cb.cache.mappings.get(viewId);
    if (!childMappings) return;
    containerBinding.remove(childMappings);
};

cb.getChildMappingsByView = function (viewId, viewModel) {
    var view = document.getElementById(viewId); // cb.getControl(viewId);
    if (!view) return;
    //获取View的childMapping
    var mappings = [];
    var idTag = "id";
    var propertyNameTag = "data-propertyname";
    var controlTypeTag = "data-controltype";
    var elements = document.querySelectorAll("#" + viewId + " [" + propertyNameTag + "][" + controlTypeTag + "]"); //document.querySelectorAll("#id [data-propertyname]");
    for (var i = 0; i < elements.length; i++) {
        var id = elements[i].getAttribute(idTag);
        var controlType = elements[i].getAttribute(controlTypeTag);
        var propertyName = elements[i].getAttribute(propertyNameTag);
        if (!propertyName) {
            cb.console.error("以下元素" + propertyNameTag + "为空！为空则不绑定,不创建控件.");
            cb.console.error(elements[i]);
            continue;
        }
        else if (!viewModel.get(propertyName)) continue;
        if (!controlType) {
            cb.console.error("以下元素" + controlTypeTag + "为空！为空则不绑定,不创建控件.");
            cb.console.error(elements[i]);
            continue;
        }
        if (id == null) {
            id = cb.getNewId("cb_control_" + propertyName);
            elements[i].setAttribute(idTag, id);
            cb.console.log("cb.controls.createControlId(), id= " + id);
        }
        if (cb.cache.controls.get(id)) continue;
        var bindingMode = controlType === cb.ControlType.Button ? cb.binding.BindingMode.OneTime : cb.binding.BindingMode.TwoWay;
        mappings.push({ controlId: id, controlType: controlType, propertyName: propertyName, bindingMode: bindingMode });
    }

    cb.viewbinding.bindEnterEvent(viewId);
    //cb.viewbinding.bindLabelClickEvent(viewId, viewModel);

    return mappings;
}


/*
绑定Label单击事件，用于查看详细信息，比如点客户则打开相应的客户  
*/
cb.viewbinding.bindLabelClickEvent = function (viewId, viewModel) {
    var $view = $("#" + viewId);
    var $labels = $view.find("label[data-content]");
    $labels.each(function (index, element) {
        var $el = $(element);
        $el.click(function (e) {
            var content = $el.attr("data-content");
            if (content && content.length > 0) {
                cb.route.loadPageViewPart(viewModel, content, { width: "700px", height: "560px" });
            }
        });
    });
};



/**
第一种方式，直接控制输入输入控件
第二种方式，通过model的绑定器
**/
cb.viewbinding.bindEnterEvent = function (viewId) {
    var $view = $("#" + viewId);
    var $inputs = $view.find("input");

    $view.bind("keydown", function (e) {
        var key = e.which;
        if (key == 13) {

            var target = e.target;
            //如果是搜索框按下回车，则退出
            if ($(target).attr("data-type") == "search") return;
            //            e.preventDefault();
            e.stopPropagation();


            var index = $inputs.index(target) + 1;
            var $next = $view.find("input:eq(" + index + ")");
            while ($next.attr("readOnly") || $next.attr("disabled")) {
                index++;
                $next = $view.find("input:eq(" + index + ")");
            }

            if ($next) {
                $next.focus();
            }
        }
    });
}

//cb.getControl = function (ctrl, view) {
//    var _container = document;
//    if (!view)
//        _container = view;
//    if (!ctrl) return null;
//    return cb.control.adapter.create(ctrl, view);
//};
cb.getControl = function (ctrl, ctrlType) {
    if (!ctrl) return null;
    //return cb.control.adapter.create(ctrl, ctrlType);
    return cb.controls.findControlById(ctrl);
};
cb.getNewId = function (prefix) {
    prefix = prefix || "newId";
    var number = (cb.cache.newIds.get(prefix) || 0) + 1;
    cb.cache.newIds.set(prefix, number);
    return prefix + "_" + number; //return (prefix || "newId") + "_" + new Date().getTime();
};
cb.getViewModel = function (viewModelName) {
    return cb.cache.get(viewModelName);
};

cb.isEmpty = function (data) {
    return (data === null || data === undefined);
}
cb.isArray = function (data) {
    return data && Array.isArray(data);
}
cb.emptyFun = function () {

}
cb.forEach = cb.eachIn = function (data, callback, scope) {
    if (!data || !callback)
        return;
    var index = 0;
    for (var attr in data) {
        callback.call(scope || data, index++, attr, data[attr]);
    }
};
cb.each = function (data, callback, scope) {
    if (!data || !callback)
        return;
    for (var i = 0; i < data.length; i++) {
        callback.call(scope || data, data[i], i);
    }
};
cb.clone = function clone(obj) {
    if (!obj) return obj;

    return cb.extend({}, obj);
};
cb.ControlType = {
    TextBox: "TextBox",
    CheckBox: "CheckBox",
    DropDownList: "DropDownList",
    RadioBox: "RadioBox",
    Button: "Button",
    ImageButton: "ImageButton",
    DataGrid: "DataGrid",
    DropDownButton: "DropDownButton",
    Label: "Label",
    SearchButton: "SearchButton",
    Pagination: "Pagination"
};

//元数据：原子数据类型
cb.meta = {};
cb.meta.AtomicData = { _$id: "", ViewModelName: "", value: "", readOnly: false, disabled: false };

cb.data = {};
cb.data.isCompress = function (val) {
    if (arguments.length == 0)
        return this._compress;
    else {
        this._compress = (val || false);
    }
}
cb.data.JsonSerializer = {
    serialize: function (data) {
        if (!data) return null;
        var serializeData = null;
        if (window.JSON && window.JSON.stringify) {
            try {
                serializeData = JSON.stringify(data);
            } catch (err) {
                cb.console.error("window.JSON.stringify(\"" + data + "\")");
                cb.console.error(err.message);
            }
        } else {
            var type = typeof data;
            if (type == "string" || type == "number" || type == "boolean")
                serializeData = data;
            else if (data.constructor == Array)
                serializeData = cb.data.JsonSerializer._innerSerialize_Type(data);
            else
                serializeData = this._innerSerialize(data);
        }
        return this.compress(serializeData); //压缩成比Json更轻量级的data
    },
    _innerSerialize: function (data) {
        var stringBuilder = [];
        for (var attr in data) {
            if (typeof data[attr] === "function") continue;
            stringBuilder.push("\"" + attr + "\":" + cb.data.JsonSerializer._innerSerialize_Type(data[attr]));
        }
        return "{" + stringBuilder.join(",") + "}";
    },
    //需要重新梳理
    _innerSerialize_Type: function (attrValue) {
        var type = typeof attrValue;
        if (cb.isEmpty(attrValue))
            return "null";
        else if (type === "string")
            return "\"" + attrValue + "\"";
        else if (type === "number" || type === "boolean")
            return attrValue;
        else if (attrValue.constructor == Array) {
            var stringBuilder2 = [];
            for (var i = 0, length = attrValue.length; i < length; i++)
                stringBuilder2.push(cb.data.JsonSerializer._innerSerialize_Type(attrValue[i]));
            return "[" + stringBuilder2.join(",") + "]";
        }
        else if (attrValue instanceof Date)
            return "\"" + attrValue + "\"";
        else if (type === "object")
            return cb.data.JsonSerializer._innerSerialize(attrValue);

        return "\"" + attrValue + "\"";
    },
    deserialize: function (data) {
        if (!data) return null;
        data = this.uncompress(data); //解压成Json格式
        if (!data) return null;
        if (window.JSON && window.JSON.parse) {
            try {
                return window.JSON.parse(data);
            }
            catch (err) {
                cb.console.error("window.JSON.parse(\"" + data + "\")");
                cb.console.error(err.message);
            }
        }
        return eval("(" + data.replace(/\r\n/g, "") + ")"); //return eval("(" + data + ")");
    },
    encode: function () { },
    decode: function (data) {

        data = data.replace(/\/\/\//g, "\/\/");
        data = data.replace(/\/\*((\n|\r|.)*?)\*\//mg, "");  //去掉多行注释/*..*/
        data = data.replace(/(\s+)\/\/(.*)\n/g, "");  //去掉单行注释//(前面有空格的注释)
        data = data.replace(/(\s+)\/\/\/(.*)\n/g, "");  //去掉单行注释//(前面有空格的注释)
        data = data.replace(/;\/\/(.*)\n/g, ";");  //去掉单行注释//(前面是分号的注释)	
        data = data.replace(/\/\/[^"][^']\n/g, ""); //去掉单行注释//(//后面只有一个'或一个"的不替换)	
        data = data.replace(/[\r]/g, "");  //替换换行
        data = data.replace(/[\n]/g, "");  //替换回车
        return data;
    },

    //压缩
    compress: function (jsonStr) {
        /// <param name="jsonStr" type="String">传入的jsonStr参数类型未压缩的Json字符串</param>
        return jsonStr;
    },
    //解压
    uncompress: function (compressData) {
        /// <param name="compressData" type="String">传入的compressData参数类型为压缩过的Json字符串</param>
        if (!cb.data.isCompress()) {
            //cb.console.warn("前端未启用压缩设置，如要压缩请设置cb.data.isCompress(true)");
            return compressData;
        }
        if (typeof JSONH == "undefined" || !JSONH.unpack) {
            cb.console.warn("JSONH.unpack不存在，是否引用了jsonh.js???");
            return compressData;
        }
        cb.monitor.start();
        cb.console.warn("JSONH.unpack解压开始");
        var result = JSONH.unpack(compressData);
        cb.monitor.stop();
        cb.console.warn("JSONH.unpack解压结束，时间：" + cb.monitor.timeSpan());
        return result;
    },
    //压缩
    encode: function (s) {
        /// <param name="s" type="String"></param>
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    },
    //解压
    decode: function (s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }
};

cb.serialize = function (model) {

};
cb.serialize.toJson = function (model) {
    var obj = {};
    var detla = {};
    for (var attr in model) {
        if (!model[attr]) {
            obj[attr] = null;
        }
        else if (model[attr] instanceof cb.model.SimpleModel) {
            obj[attr] = model[attr].getValue();
        }
        else if (model[attr] instanceof cb.model.Model2D) {
            obj[attr] = model[attr].getRawData();
        }
        else if (model[attr] instanceof cb.model.Model3D) {
            if (model[attr].isDirty()) {
                return
            }
            obj[attr] = model[attr].getRawData();
        }
    }
}
cb.serialize.fromJson = function (json) {
    if (!json)
        return;
    cb.serialize();
}

//#endregion

//#region rest
cb.rest = {};
cb.rest.temp = {};
//cb.rest.ApplicationContext = {
//    ServiceUrl: "http://127.0.0.1:8888",
//    Size: "L",
//    Token: "94fa8826471c4123969d3daa6530c6c0",
//    accountCode: "test",
//    dataSourceName: "autotest6315up",
//    groupCode: "001",
//    groupID: "0001AA100000000000YJ",
//    groupName: "用友集团",
//    lang: "zh-CN",
//    loginDate: "2015-05-20",
//    orgCode: "001",
//    orgId: "0001AA100000000000YJ",
//    orgName: "用友集团",
//    password: null,
//    userCode: "u1",
//    userID: "1001AA1000000000008W",
//    userName: "u1"
//};
cb.rest.ContextBuilder = {};
cb.rest.ContextBuilder.construct = function (userData) {
    var applicationContext = { "ServiceUrl": location.protocol + "//" + location.host };
    var queryString = new cb.util.queryString(location.search);
    applicationContext["Token"] = queryString.get("token");
    applicationContext["Size"] = queryString.get("size");
    if (!userData) return;
    for (var attr in userData) {
        if (attr === "token")
            applicationContext["Token"] = applicationContext["Token"] || userData[attr];
        else if (attr === "size")
            applicationContext["Size"] = applicationContext["Size"] || userData[attr];
        else
            applicationContext[attr] = userData[attr];
    }
    cb.rest.ApplicationContext = applicationContext;
};
cb.rest.ContextBuilder.destroy = function () {
    delete cb.rest.ApplicationContext;
};

//cb.ajax = function () { };
//cb.ajax.RequestManager = {};
//cb.http = {};
//cb.http.ajax = {};
//cb.http.getJson = {};
//cb.http.ajaxManager = {};
//cb.utils = {};
//cb.http.rest
//cb.http.DynamicProxy
//cb.http.DynamicProxy = function (url) { 
//};
//cb.http.RestProxy = function (url) {
//    return new cb.http.DynamicProxy(url);
//};
//cb.http.HttpManager
//cb.http.Ajax
//cb.http.JsonP
cb.rest.getToken = function (info) {
    if (typeof (ua) != "undefined") {
        if (ua == "iosApp") {

            if (cb.rest.ApplicationContext.Token && cb.rest.ApplicationContext.Token != '') {
                document.location = "http:\\\getscanresult\\" + info + "◎◎◎" + cb.rest.ApplicationContext.Token;
            } else {
                document.location = "http:\\\getscanresult\\" + info
            }
        }
        if (ua == "andriodApp") {
            if (cb.rest.ApplicationContext.Token && cb.rest.ApplicationContext.Token != '') {
                window.main.getscanresult(info, cb.rest.ApplicationContext.Token);
            } else {
                window.main.getscanresult(info, "");
            }
        }
    }
}

cb.rest.reLogin = function login(userCode, password, account) {
    var account = account.split(",");
    if (!(account[0] && account[1])) {
        account[0] = '';
        account[1] = '';
    }
    url = location.protocol + "//" + location.hostname + ":" + location.port + "/classes/Login/UAP/Login";
    //alert("post");
    var data3 = '{"userCode":"' + userCode + '","password":"' + password + '","accountCode":"' + account[0] + '","dataSourceName":"' + account[1] + '","lang":""}';

    cb.rest.loadXMLDoc(url, "POST", { callback: callback, data: data3 });
    function callback(result) {
        if (result && result.isSecuess)
            cb.rest.ApplicationContext.Token = result.token;
        else if (result && result.data && result.data.success)
            cb.rest.ApplicationContext.Token = result.data.success.token;
    }
}

cb.rest.loadXMLDoc = function (url, type, params) {
    var myUrl = url ? url : "";
    var myType = type ? type : "GET";
    var myParams = params.data ? params.data : "";
    var myData = '';
    if (myType == "GET") {
        for (var item in myParams) {
            if (myData.length > 0) {
                myData += "&"
            }
            myData += item + "='" + myParams[item] + "'";
        }
        //myParams = myParams
    } else {
        myData = myParams;
    }
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //alert(xmlhttp.responseText);
            var result = xmlhttp.responseText;
            var data = JSON.parse(result);
            if (params && params.callback) params.callback.call(this, data);
        }
    }
    xmlhttp.open(myType, myUrl, true);
    xmlhttp.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader("dataType", "json");
    //xmlhttp.setRequestHeader("data", myParams);
    //xmlhttp.send(myData);
    xmlhttp.send(myData);
}

// cb.rest.userAgentInfoFunction = function () {
//     var result = {};
//     var sUserAgent = navigator.userAgent.toLowerCase();
//     var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
//     var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
//     var bIsMidp = sUserAgent.match(/midp/i) == "midp";
//     var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
//     var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
//     var bIsAndroid = sUserAgent.match(/android/i) == "android";
//     var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
//     var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
//     var bIsTP = sUserAgent.match(/tablet pc/i) == "tablet pc";

//     result.deviceType = bIsIpad ? "ipad" : bIsIphoneOs ? "iphone os" : bIsMidp ? "midp" : bIsUc7 ? "rv:1.2.3.4" : bIsUc ? "ucweb" : bIsAndroid ? "android" : bIsCE ? "windows ce" : bIsWM ? "windows mobile" : bIsTP ? "tablet pc" : "PC";
//     result.isPC = !(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsTP);
//     result.mapp = { S_maxWidth: 480, M_maxWidth: 768, L_minWidth: 1024 };
//     result.userSystem = sUserAgent.indexOf('android') > -1 || sUserAgent.indexOf('ainux') > -1 ? 'android' : sUserAgent.indexOf('ipad') > -1 || sUserAgent.indexOf('iphone') > -1 ? "ios" : sUserAgent.indexOf('windows phone') > -1 ? "windows phone" : '';
//     return result;
// };

//cb.rest.userAgentInfo = cb.rest.userAgentInfoFunction();

cb.rest.userAgent = "";

cb.rest.setUserAgent = function (agent) {
    cb.rest.userAgent = agent;
}


cb.rest.LocalCacheFunction = function () {
    var size = 0;
    var entry = new Object();

    this.add = function (key, value) {
        //alert("开始添加");
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;

    }

    this.getValue = function (key) {
        return this.containsKey(key) ? entry[key] : null;
    }

    this.remove = function (key) {
        if (this.containsKey(key) && (delete entry[key])) {
            size--;
        }
    }

    this.containsKey = function (key) {
        return (key in entry);
    }

    this.containsValue = function (value) {
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    this.getValues = function () {
        var values = new Array();
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }

    this.getKeys = function () {
        var keys = new Array();
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }

    this.getSize = function () {
        return size;
    }

    this.clear = function () {
        size = 0;
        entry = new Object();
    }
}

cb.rest.LocalCache = new cb.rest.LocalCacheFunction()

//移动端当网络不稳定，返回数据不成功时调用次方法，显示本地数据                                  
cb.rest.setLocalCache = function (ckey, localCacheData) {
    //cb.rest.LocalCache.add(ckey,cvalue);
    if (cb.rest.LocalCache.containsKey(ckey)) {
        //alert("查找到相应opation");
        var options = cb.rest.LocalCache.getValue(ckey);
        if (localCacheData && localCacheData.length > 0) {
            var ajaxResult = cb.data.JsonSerializer.deserialize(localCacheData.substring(14));
            if (ajaxResult.code >= 200 && ajaxResult.code <= 299) {
                if (ajaxResult.data) {
                    var isAlert = true;
                    if (options.callback)
                        isAlert = options.callback(ajaxResult.data.success, ajaxResult.data.fail);
                    //如果成功并且有警告提示，则提示出来？这个是不是交给开发人员自己写代码提示？
                    var fail = ajaxResult.data.fail;
                    if (isAlert !== false && fail && fail.msgContent) {
                        alert(fail.msgContent);
                    }
                }
            }
        }
        cb.rest.LocalCache.remove(ckey);
    }
}

cb.rest.LocalCacheKey = 10000;

cb.rest.ajax = function (url, options) {
    options.url = url;
    return cb.rest.AjaxRequestManager.doRequest(options); //cb.rest.AjaxRequestManager.push(options);  //排队 队列处理，后续丰富
};
cb.rest.AjaxRequestManager = cb.rest.ajax.XMLHttpRequestManager = {
    _xmlHttps: [],
    _requests: [],
    _setTimeoutId: null,
    push: function (options) {
        this._requests.push(options);
        if (!this._setTimeoutId) {
            this._setTimeoutId = window.setTimeout(this.execute, 10);
        }
    },
    execute: function () {
        var requestManager = cb.rest.AjaxRequestManager;
        for (var i = 0; i < requestManager._requests.length; i++) {
            requestManager.doRequest(requestManager._requests[i])
        }
        this._setTimeoutId = null;
    },
    doRequest: function (options) {
        var xmlHttp = this.getXmlHttp();
        if (xmlHttp == null)
            return;
        var method = options.method || "get";
        var queryStr = "";
        var queryJson = null;
        var url = cb.rest._getUrl(options.url);

        if (String.equalsIgnoreCase("get", method) || String.equalsIgnoreCase("delete", method))
            url = cb.rest._appendUrl(url, options.params);
        else if (String.equalsIgnoreCase("post", method) || String.equalsIgnoreCase("put", method))
            queryJson = cb.data.JsonSerializer.serialize(options.params);

        xmlHttp._url = url; //记住URL;
        xmlHttp.open(method, url, options.async === false ? false : true);
        if (queryJson) {
            //xmlHttp.setRequestHeader("content-length", queryJson.length);
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            //xmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;application/json"); //post提交设置项
        }
        //从服务器中读取数据
        xmlHttp.send(queryJson);

        if (options.async !== false)
            xmlHttp.onreadystatechange = function () { cb.rest.ajax.XMLHttpRequestManager.onreadystatechange(this, options); };
        if (options.async === false)
            return this.onreadystatechange(xmlHttp, options);
        if (options.mask === true)
            cb.util.loadingControl.startControl();
    },
    onreadystatechange: function (xmlHttp, options) {


        //alert(xmlHttp._url +"\n"+ xmlHttp.readyState+"\n"+xmlHttp.status+"\n"+ options.method);
        if (xmlHttp.readyState != 4) //4 = "loaded"
            return;
        if (options.mask === true)
            cb.util.loadingControl.endControl();
        // 200 = OK
        //alert(xmlHttp._url +"\n"+ xmlHttp.readyState+"\n"+xmlHttp.status+"\n"+ xmlHttp.responseText+"\n"+cb.rest.userAgent);
        if (xmlHttp.status != 200 && xmlHttp._url && !xmlHttp.responseText) {
            //若访问不成功
            //alert("获取不成功，开始调用本地资源");
            //if(cb.rest.userAgentInfo.userSystem=="ios"){
            //alert(cb.rest.userAgent);
            if (cb.rest.userAgent && cb.rest.userAgent != "") {
                cb.rest.LocalCacheKey = cb.rest.LocalCacheKey + 1;
                cb.rest.LocalCache.add(cb.rest.LocalCacheKey, options);
                //alert("添加成功");
                var method = options.method || "get";

                // if (String.equalsIgnoreCase("get", method)){
                //    document.location = "http:\\\\getlocalcache\\"+xmlHttp._url + "◎◎◎"+ cb.rest.LocalCacheKey;
                // } 

                if (String.equalsIgnoreCase("post", method) || String.equalsIgnoreCase("put", method)) {
                    if (cb.rest.userAgent == "iosApp") {
                        document.location = "http:\\\getlocalcache\\" + xmlHttp._url + "◎◎◎" + cb.data.JsonSerializer.serialize(options.params) + "◎◎◎" + cb.rest.LocalCacheKey;
                    }
                    if (cb.rest.userAgent == "androidApp") {
                        window.main.dealocalcache("http://getlocalcache/" + xmlHttp._url + "◎◎◎" + cb.data.JsonSerializer.serialize(options.params) + "◎◎◎" + cb.rest.LocalCacheKey);
                        //document.location = "http:\\\\getlocalcache\\"+xmlHttp._url +"◎◎◎"+ cb.data.JsonSerializer.serialize(options.params)+"◎◎◎"+ cb.rest.LocalCacheKey;
                    }
                }
            }

        }
        if (xmlHttp.status == 200 || (xmlHttp.responseText && xmlHttp.responseText.length > 15 && xmlHttp.responseText.substring(0, 14) == "<U8LocalCache>")) {
            cb.console.log("xmlHttp.responseText:", xmlHttp.responseText);
            //alert(xmlHttp._url+"\n" + options.method + "\n" +cb.data.JsonSerializer.serialize(options.params)+"\n"+ xmlHttp.responseText);
            var ajaxResult = null;
            if (xmlHttp.responseText.substring(0, 14) != "<U8LocalCache>") {
                ajaxResult = cb.data.JsonSerializer.deserialize(xmlHttp.responseText);
            } else {
                ajaxResult = cb.data.JsonSerializer.deserialize(xmlHttp.responseText.substring(14));
            }
            /*   新的前后端数据通信,根据后台定义的接口   */
            if (ajaxResult && ajaxResult.code != null) {
                //pad原地返回资源Code不可设置，用资源开头是否为<U8LocalCache>判断
                //cb.console.warn("------按新的数据通信格式进行数据传输---------is ok！", ajaxResult);
                if (ajaxResult.code >= 400) {
                    if (ajaxResult.code == 520) {
                        if (options.callback) {
                            options.callback.call(options.context, null, { error: ajaxResult.error });
                        }
                    }
                    else if (ajaxResult.code == 501) {
                        cb.util.warningMessage(ajaxResult.error, ajaxResult.stack || ajaxResult.error, cb.route.redirectLoginPage);
                        return;
                    }
                    else {
                        cb.console.error("Service error:" + xmlHttp.responseURL, ajaxResult);
                        cb.util.tipMessage(ajaxResult.error);
                        return;
                    }
                }
                else if (ajaxResult.code >= 200 && ajaxResult.code <= 299) {
                    if (xmlHttp.responseText && xmlHttp.responseText.substring(0, 14) != "<U8LocalCache>") {
                        var method = options.method || "get";
                        //alert(cb.rest.userAgent + "," + method+","+xmlHttp._url);
                        if (cb.rest.userAgent && cb.rest.userAgent == "iosApp") {
                            if (String.equalsIgnoreCase("get", method))
                                document.location = "http:\\\savelocalcache\\" + xmlHttp.responseText + "◎◎◎" + xmlHttp._url;
                            else if (String.equalsIgnoreCase("post", method) || String.equalsIgnoreCase("put", method))
                                document.location = "http:\\\savelocalcache\\" + xmlHttp.responseText + "◎◎◎" + xmlHttp._url + "◎◎◎" + cb.data.JsonSerializer.serialize(options.params);
                        }
                        if (cb.rest.userAgent && cb.rest.userAgent == "androidApp") {
                            if (String.equalsIgnoreCase("get", method))
                                window.main.dealocalcache("http://savelocalcache/" + xmlHttp.responseText + "◎◎◎" + xmlHttp._url);
                            else if (String.equalsIgnoreCase("post", method) || String.equalsIgnoreCase("put", method))
                                window.main.dealocalcache("http://savelocalcache/" + xmlHttp.responseText + "◎◎◎" + xmlHttp._url + "◎◎◎" + cb.data.JsonSerializer.serialize(options.params));
                        }
                    }
                    if (ajaxResult.data) {
                        var isAlert = true;
                        if (options.callback)
                            isAlert = options.callback.call(options.context, ajaxResult.data.success, ajaxResult.data.fail);

                        //如果成功并且有警告提示，则提示出来？这个是不是交给开发人员自己写代码提示？
                        var fail = ajaxResult.data.fail;
                        if (isAlert !== false && fail && fail.msgContent) {
                            cb.util.tipMessage(fail.msgContent);
                        }

                    }
                    else {
                        cb.console.warn("------返回数据data为空---------！");
                    }
                }
                else {
                    if (ajaxResult.error) {
                        //alert(ajaxResult.error);
                        cb.console.error(ajaxResult.stack);
                        return;
                    }
                    else if (options.callback && ajaxResult.success)
                        options.callback.call(options.context, ajaxResult.success, ajaxResult.fail);
                }
            }
            else {  //兼容以前的格式，调试用
                //            if (!ajaxResult || !ajaxResult.Success) {
                //                alert(ajaxResult && ajaxResult.Message);
                //                return;
                //            }
                //            options.callback(ajaxResult.Data);
                cb.console.warn("------按旧的数据通信格式进行数据传输---------后台需要改成新的数据通信格式！", ajaxResult);
                if (options.callback)
                    options.callback(ajaxResult);
            }
            if (options.async === false)
                return ajaxResult;
        }
        else if (xmlHttp.status == 0) {
            cb.console.error("请求异常终止，请确认操作是否正确: " + xmlHttp.status + "," + xmlHttp.responseText);
            cb.util.tipMessage("请求异常终止，将返回登录页", cb.route.redirectLoginPage);
        }
        else {
            cb.console.error("请求错误信息: ", xmlHttp.responseText || xmlHttp.statusText);
            cb.util.tipMessage("请求错误代码: " + xmlHttp._url + "," + xmlHttp.status + "," + xmlHttp.responseText);
        }
        xmlHttp.isBusy = false;
    },
    getXmlHttp: function () {
        var xmlHttp;
        for (var i = 0, length = this._xmlHttps.length; i < length; i++) {
            if (!this._xmlHttps[i].isBusy) {
                xmlHttp = this._xmlHttps[i];
                break;
            }
        }
        if (!xmlHttp) {
            var xmlHttp = this.createXMLHttpRequest();
            this._xmlHttps.push(xmlHttp);
        }
        xmlHttp.isBusy = true;
        return xmlHttp;
    },
    createXMLHttpRequest: function () {
        var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : (window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null);
        xmlHttp.onabort = function (args) {
            cb.console.warn("XMLHttpRequest onabort!\n  ajax请求被终止！", xmlHttp._url);
        };
        xmlHttp.onerror = function (args) {
            cb.console.warn("XMLHttpRequest onerror!\n  ajax请求出错！", xmlHttp._url);
        };
        xmlHttp.ontimeout = function (args) {
            cb.console.warn("XMLHttpRequest ontimeout!\n  ajax请求超时！", xmlHttp._url);
        };
        return xmlHttp;
        //        var xmlHttp;
        //        if (window.XMLHttpRequest)          // code for IE7, Firefox, Opera, etc.
        //            xmlHttp = new XMLHttpRequest();
        //        else if (window.ActiveXObject)      // code for IE6, IE5
        //            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        //        return xmlHttp;
    }
};
cb.rest.getJson = function (url, options) {
    if (!url)
        return;
    var globalCallbackId;
    var queryStr = "";
    if (options && options.callback) {
        globalCallbackId = "globalCallback_" + Math.random();
        globalCallbackId = globalCallbackId.replace(".", "_");
        window[globalCallbackId] = function (data) {
            options.callback(data);
            window[globalCallbackId] = undefined;
        };
        options.params = options.params || {};
        options.params["callback"] = globalCallbackId;
    }

    url = cb.rest._getUrl(url);
    url = cb.rest._appendUrl(url, options.params);

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    if (script.scriptCharset)
        script.charset = script.scriptCharset || "utf-8";
    script.async = true;
    script.src = url;
    script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /complete|loaded/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            if (script.parentNode)
                script.parentNode.removeChild(this);
            script = undefined;
        }
    }
    head.insertBefore(script, head.firstChild);
};
cb.rest.loadStyle = function (url) {
    var style = document.createElement("link");
    style.href = url;
    style.rel = "Stylesheet";
    style.type = "text/css";
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(style);
};
cb.rest.loadScript = function (url, callback) {
    var script = document.createElement("script");
    if (script.scriptCharset)
        script.charset = script.scriptCharset || "utf-8";
    script.async = false;
    script.src = url;
    script.type = "text/javascript";

    script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /complete|loaded/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;

            if (callback) callback();
            script = undefined;
        }
    }
    script.onabort = function () {
        if (script) {
            cb.console.error("Script abort loading: GET   " + script.src + +"  onabort!");
            if (callback) callback();
            script = undefined;
        }
    }
    script.onerror = function () {
        if (script) {
            cb.console.error("Script error loading: GET   " + script.src + "  onerror!");
            if (callback) callback();
            script = undefined;
        }
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(script);
};
cb.rest.getHtml = function (url, callback, params, context) {
    if (!url)
        return;
    if (params && typeof params == "object")
        url = cb.rest._appendUrl(url, params);
    context = context || this;
    var xmlHttp = cb.rest.AjaxRequestManager.createXMLHttpRequest();
    xmlHttp._url = url;
    xmlHttp.open("get", url, true);
    xmlHttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState != 4) //4 = "loaded"
            return;
        if (xmlHttp.status == 200) {
            if (xmlHttp.getResponseHeader("content-type") == "application/json;charset=UTF-8") {
                var ajaxResult = cb.data.JsonSerializer.deserialize(xmlHttp.responseText);
                if (!ajaxResult) return;
                if (ajaxResult.code == 501) {
                    cb.util.warningMessage(ajaxResult.error, ajaxResult.stack || ajaxResult.error, cb.route.redirectLoginPage);
                    return;
                }
            }
            else if (callback)
                callback.call(context, xmlHttp.responseText);
        }
        else if (xmlHttp.responseText && xmlHttp.responseText.length > 15) {
            if (xmlHttp.responseText.substring(0, 14) == "<U8LocalCache>") {
                if (callback)
                    callback.call(context, xmlHttp.responseText.substring(14));
            }
        }
        else if (xmlHttp.status == 0) {
            cb.console.error("请求异常终止，请确认操作是否正确: " + xmlHttp.status + "," + xmlHttp.responseText);
        }
        else {
            cb.console.error("请求错误信息: ", xmlHttp.responseText || xmlHttp.statusText);
            cb.util.tipMessage("请求错误代码: " + xmlHttp.status + "," + xmlHttp.responseText);
        }
    };
};
cb.rest._getUrl = function (restUrl, params) {
    var _context = cb.rest.ApplicationContext;
    var _token = _context.Token || "noToken";
    var _size = _context.Size;
    if (_token && _token != "noToken") {
        if (restUrl.indexOf("?") < 0)
            restUrl = restUrl + "?token=" + _token + "&size=" + _size;
        else
            restUrl = restUrl + "&token=" + _token + "&size=" + _size;
    }
    //restUrl = (restUrl && restUrl.indexOf("?method=") < 0) ? (restUrl + "?token=" + _token) : (restUrl + "&token=" + _token);
    if (cb.data.isCompress())
        restUrl += "&compress=true"; //是否启用压缩
    if (_context.ServiceUrl && (restUrl.indexOf("http://") < 0 && restUrl.indexOf("https://") < 0))
        restUrl = _context.ServiceUrl + "/" + restUrl;
    return restUrl;
};
cb.rest._appendUrl = function (url, params) {
    if (!params)
        return url;
    var queryStr = [];
    for (var name in params)
        queryStr.push(name + "=" + params[name]);
    if (queryStr.length == 0)
        return url;
    return url.indexOf("?") >= 0 ? (url + "&" + queryStr.join("&")) : (url + "?" + queryStr.join("&"));
};

cb.rest.DynamicProxy = function (config) {
    if (this.init)
        this.init(config);
};
cb.rest.DynamicProxy.create = function (config) {
    return new cb.rest.DynamicProxy(config);
};
cb.rest.DynamicProxy.prototype.init = function (config) {
    if (!config) return;
    if (typeof config == "string") {
        var url = config;
        this.config = {};
        this.config.Save = { method: "put", url: url };
        this.config.Update = { method: "post", url: url };
        this.config.Find = { method: "get", url: url };
        this.config.Delete = { method: "delete", url: url };
    }
    else {
        this.config = config;
        for (var attr in this.config) {
            var data = this.config[attr];
            if (typeof data == "string")
                this.config[attr] = { method: "get", url: data };
        }
    }
    for (var attr in this.config) {
        if (typeof this.config[attr] == "object") {
            this[attr] = (function (attr) {
                return function (data, callback, context) {
                    /// <param name="data" type="Object">data为传输到服务端的数据</param>
                    /// <param name="callback" type="Function">callback:服务端操作完成后回调</param>
                    return this.Do(attr, data, callback, null, context);
                }
            })(attr);
            this[attr + "Sync"] = (function (attr) {
                return function (data) {
                    /// <param name="data" type="Object">data为传输到服务端的数据</param>
                    /// <param name="callback" type="Function">callback:服务端操作完成后回调</param>
                    /// <param name="callback" type="Function">callback:服务端操作完成后回调</param>
                    return this.Do(attr, data, null, false);
                }
            })(attr);
        }
    }
};
cb.rest.DynamicProxy.prototype.ajax = function (url, options) {
    return cb.rest.ajax(url, options);
};
cb.rest.DynamicProxy.prototype.getJson = function (url, options) {
    cb.rest.getJson(url, options);
};

cb.rest.DynamicProxy.prototype.Do = function (op, data, callback, async, context) {
    /// <param name="op" type="String">string为传输到服务端的数据</param>
    /// <param name="data" type="Object">data为传输到服务端的数据</param>
    /// <param name="callback" type="Function">callback:服务端操作完成后回调</param>
    /// <param name="async" type="Boolean">async:是否异步传输: 默认true</param>

    if (!this.config || !this.config[op])
        return;

    var options = {};
    if (arguments.length === 2 && data) {
        if (data.params)
            options.params = data.params;
        else if (typeof data === "function")
            options.callback = data;
        else
            options.params = data;  //typeof data==="object"
    }
    else if (arguments.length === 3 && data) {
        if (data.params || data.callback)
            options = data;
        else {
            if (typeof data === "function")
                options.callback = data;
            else
                options.params = data;  //typeof data==="object"
        }
        if (callback)
            options.callback = callback;
    }
    else if (arguments.length === 4 && data) {
        if (data.params)
            options = data;
        else
            options.params = data; //typeof data==="object"
    }
    else if (arguments.length === 5 && data) {
        if (data.params || data.callback) {
            options = data;
            if (options.callback)
                options.context = options.context || this.config[op].context || this;
        }
        else {
            if (typeof data === "function") {
                options.callback = data;
                options.context = callback || this.config[op].context || this;
            } else {
                options.params = data;
                if (callback) {
                    options.callback = callback;
                    options.context = context || this.config[op].context || this;
                }
            }
        }
    }
    var restUrl = this.config[op].url;
    if (!restUrl)
        return;
    options.async = async === false ? false : this.config[op].async;
    options.mask = this.config[op].mask;
    var _type = this.config[op].type || options.type;
    if (_type == "json") {
        this.getJson(restUrl, options);
    }
    else {
        options.method = options.method || this.config[op].method || "Get";
        return this.ajax(restUrl, options);
    }
};

//只包含CRUD四个方法的
cb.rest.SimpleProxy = function (url) {
    return new cb.rest.DynamicProxy(url);
};

//暂时使用简单方案，后续考虑自动合并请求
cb.rest.MergeRequestProxy = function () {
    var _request = { datas: [], callbacks: [] };

    this.getConfig = function (proxy, action) {
        if (!proxy || !action)
            return;
        if (typeof action === "string")
            return proxy.config[action];
        for (var attr in proxy.config) {
            if (proxy[attr] === action)
                return proxy.config[attr];
        }
    };

    this.merge = function (proxy, action, data, callback) {
        if (!proxy || !action)
            return this;

        var config = this.getConfig(proxy, action);
        if (config) {
            var url = cb.rest._getUrl(config.url);
            //if (String.equalsIgnoreCase("get", method) || String.equalsIgnoreCase("delete", method))
            //    url = cb.rest._appendUrl(url, data);
            _request.datas.push({ postData: data, requestURL: url, requestMethod: config.method || "GET", requestHeaders: { "Content-Type": "application/json"} });
            _request.callbacks.push(callback);
        }
        return this;
    };

    this.Do = function (async) {
        var proxy = new cb.rest.DynamicProxy({ Submit: { url: "batch/UPUAP", method: "Post"} });
        proxy.Do("Submit", _request.datas, function (sucess, fail) {
            if (fail) return alert("请求合并提交失败!");

            var length = (sucess && sucess.length) || 0;
            for (var i = 0; i < length; i++) {
                if (_request.callbacks[i])
                    _request.callbacks[i](sucess[i]);
            }
        }, async);
    };
};



cb.loader = {};
cb.loader.styleConfigs = {
    "MessageBox": [
        "./pc/css/MessageBox.css"
    ],
    "DataGrid": [
        "./common/css/KendoGrid.css",
        "./pc/css/GridPager.css"
    ]
};
cb.loader.scriptConfigs = {
    "MessageBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.userevents.js",
        "./kendoui/commercial/src/js/kendo.draganddrop.js",
        "./kendoui/commercial/src/js/kendo.window.js",
        "./common/js/Control.js",
        "./pc/js/kendoctrl/Modal.js",
        "./pc/js/MessageBox.js"
    ],
    "Router": [
        "./kendoui/commercial/src/js/kendo.router.js",
    ],
    "TextBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.maskedtextbox.js",
        "./pc/js/kendoctrl/TextBox.js"
    ],
    "NumberBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.numerictextbox.js",
        "./pc/js/kendoctrl/NumberBox.js"
    ],
    "DateBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.popup.js",
        "./kendoui/commercial/src/js/kendo.calendar.js",
        "./kendoui/commercial/src/js/kendo.datepicker.js",
        "./pc/js/kendoctrl/DateBox.js"
    ],
    "DateTimeBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.popup.js",
        "./kendoui/commercial/src/js/kendo.calendar.js",
        "./kendoui/commercial/src/js/kendo.datepicker.js",
        "./kendoui/commercial/src/js/kendo.timepicker.js",
        "./kendoui/commercial/src/js/kendo.datetimepicker.js",
        "./pc/js/kendoctrl/DateTimeBox.js"
    ],
    "ComboBox": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.data.js",
        "./kendoui/commercial/src/js/kendo.popup.js",
        "./kendoui/commercial/src/js/kendo.list.js",
        "./kendoui/commercial/src/js/kendo.combobox.js",
        "./pc/js/kendoctrl/ComboBox.js"
    ],
    "CheckBox": [
        "./pc/js/kendoctrl/CheckBox.js"
    ],
    "RadioBox": [
        "./pc/js/kendoctrl/RadioBox.js"
    ],
    "Refer": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.userevents.js",
        "./kendoui/commercial/src/js/kendo.draganddrop.js",
        "./kendoui/commercial/src/js/kendo.window.js",
        "./pc/js/kendoctrl/Modal.js",
        "./common/js/Refer.js"
    ],
    "Tree": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.data.js",
        "./kendoui/commercial/src/js/kendo.treeview.js",
        "./pc/js/kendoctrl/TreeView.js"
    ],
    "DataGrid": [
        "./kendoui/commercial/src/js/kendo.core.js",
        "./kendoui/commercial/src/js/kendo.data.js",
        "./kendoui/commercial/src/js/kendo.maskedtextbox.js",
        "./pc/js/kendoctrl/TextBox.js",
        "./kendoui/commercial/src/js/kendo.numerictextbox.js",
        "./pc/js/kendoctrl/NumberBox.js",
        "./kendoui/commercial/src/js/kendo.popup.js",
        "./kendoui/commercial/src/js/kendo.calendar.js",
        "./kendoui/commercial/src/js/kendo.datepicker.js",
        "./pc/js/kendoctrl/DateBox.js",
        "./kendoui/commercial/src/js/kendo.timepicker.js",
        "./kendoui/commercial/src/js/kendo.datetimepicker.js",
        "./pc/js/kendoctrl/DateTimeBox.js",
        "./kendoui/commercial/src/js/kendo.list.js",
        "./kendoui/commercial/src/js/kendo.combobox.js",
        "./pc/js/kendoctrl/ComboBox.js",
        "./common/js/CheckBox.js",
        "./kendoui/commercial/src/js/kendo.userevents.js",
        "./kendoui/commercial/src/js/kendo.draganddrop.js",
        "./kendoui/commercial/src/js/kendo.window.js",
        "./pc/js/kendoctrl/Modal.js",
        "./common/js/Refer.js",
        "./pc/js/grid/GridVM.js",
        "./pc/js/grid/DataGrid.binding.js",
        "./kendoui/commercial/src/js/kendo.resizable.js",
        "./kendoui/commercial/src/js/kendo.filtermenu.js",
        "./kendoui/commercial/src/js/kendo.columnsorter.js",
        "./kendoui/commercial/src/js/kendo.validator.js",
        "./kendoui/commercial/src/js/kendo.binder.js",
        "./kendoui/commercial/src/js/kendo.editable.js",
        "./kendoui/commercial/src/js/kendo.grid.js",
        "./pc/js/kendoctrl/DataGrid.js",
        "./pc/js/grid/Pager.js"
    ],
    "Scheduler": [
        "./kendoui/commercial/src/js/kendo.numerictextbox.js",
        "./kendoui/commercial/src/js/kendo.calendar.js",
        "./kendoui/commercial/src/js/kendo.datepicker.js",
        "./kendoui/commercial/src/js/kendo.timepicker.js",
        "./kendoui/commercial/src/js/kendo.datetimepicker.js",
        "./kendoui/commercial/src/js/kendo.dropdownlist.js",
        "./kendoui/commercial/src/js/kendo.multiselect.js",
        "./kendoui/commercial/src/js/kendo.validator.js",
        "./kendoui/commercial/src/js/kendo.binder.js",
        "./kendoui/commercial/src/js/kendo.editable.js",
        "./kendoui/commercial/src/js/kendo.scheduler.recurrence.js",
        "./kendoui/commercial/src/js/kendo.scheduler.view.js",
        "./kendoui/commercial/src/js/kendo.scheduler.dayview.js",
        "./kendoui/commercial/src/js/kendo.scheduler.monthview.js",
        "./kendoui/commercial/src/js/kendo.scheduler.js",
        "./pc/js/kendoctrl/ScheduleBox.js"
    ]
};
cb.loader.initLanguage = function () {
    var baseUrl = "./kendoui/commercial/src/js/";
    var language = cb.rest.ApplicationContext.lang || "zh-CN";
    var scriptUrl = baseUrl + "cultures/kendo.culture." + language + ".js";
    var scriptNode = document.createElement("script");
    scriptNode.src = scriptUrl;
    if (!this.hasScript(scriptNode.src)) {
        this.loadScript(scriptUrl, function () {
            cb.executeScript("kendo.culture(\"" + language + "\");");
        });
    }
    scriptUrl = baseUrl + "messages/kendo.messages." + language + ".js";
    scriptNode.src = scriptUrl;
    if (!this.hasScript(scriptNode.src)) {
        this.loadScript(scriptUrl);
        cb.rest.getHtml(scriptUrl, function (responseText) {
            this.kendoMsgLangRes = responseText;
        }, undefined, this);
    } else if (this.kendoMsgLangRes) {
        cb.executeScript(this.kendoMsgLangRes);
    }
};
cb.loader.loadView = function (el, url, params, callback) {
    //目前只支持get获取view、page
    if (!el || typeof url !== "string")
        return;
    if (typeof params === "function") {
        callback = params;
        params = undefined;
    }
    cb.rest.getHtml(url, function (responseText) {
        this.loadViewCallback(responseText, el, callback);
    }, params, this);
};
cb.loader.loadViewCallback = function (responseText, el, callback) {
    var emptyNode = document.createElement("div");
    emptyNode.innerHTML = responseText;
    var scripts = emptyNode.getElementsByTagName("script"); //emptyNode.querySelectorAll("script");
    var scriptLength = scripts.length;
    var node = null;
    var scriptText = [];
    var scriptUrls = [];

    for (var i = 0; i < scripts.length; i++) {
        node = scripts[i];
        if (node.type == "text/html") continue;
        if (node.dataset["config"]) {
            var config = node.dataset["config"];
            var srcs = cb.loader.scriptConfigs[config];
            if (srcs && srcs.length) {
                cb.each(srcs, function (src) {
                    var scriptNode = document.createElement("script");
                    scriptNode.src = src;
                    if (!this.hasScript(scriptNode.src)) {
                        var repeatSrc = false;
                        for (var j = 0; j < scriptUrls.length; j++) {
                            if (scriptUrls[j] == scriptNode.src) {
                                repeatSrc = true;
                                break;
                            }
                        }
                        if (!repeatSrc)
                            scriptUrls.push(scriptNode.src);
                    }
                }, this);
            }
            continue;
        }
        if (node.src && !this.hasScript(node.src)) {
            var repeatSrc = false;
            for (var j = 0; j < scriptUrls.length; j++) {
                if (scriptUrls[j] == node.src)
                    repeatSrc = true;
            }
            if (!repeatSrc)
                scriptUrls.push(node.src);
        }
        else if (node.text)
            scriptText.push(node.text);
    }
    for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].type == "text/html") continue;
        scripts[i].parentNode.removeChild(scripts[i]);   //emptyNode.removeChild(scripts[i]);//移除节点
    }

    var links = emptyNode.getElementsByTagName("link"); //emptyNode.querySelectorAll("script");
    var linkStr = "";
    var head = document.head || document.getElementsByTagName("head")[0];
    for (var i = 0; i < links.length; i++) {
        if (links[i].dataset["config"]) {
            var config = links[i].dataset["config"];
            var hrefs = cb.loader.styleConfigs[config];
            if (hrefs && hrefs.length) {
                cb.each(hrefs, function (href) {
                    var linkNode = document.createElement("link");
                    linkNode.href = href;
                    linkNode.rel = "stylesheet";
                    if (!this.hasStyle(linkNode.href))
                        head.appendChild(linkNode);
                }, this);
            }
            continue;
        }
        if (!this.hasStyle(links[i].href))
            head.appendChild(links[i].cloneNode()); //head.insertBefore(script, head.firstChild);
    }
    for (var i = links.length - 1; i >= 0; i--) {
        links[i].parentNode.removeChild(links[i]);
    }

    var titleNodes = emptyNode.getElementsByTagName("title");
    var titleNode = titleNodes && titleNodes[0];
    var title = "";
    if (titleNode) {
        var title = titleNode.text;
        titleNode.parentNode.removeChild(titleNode);
    }
    var metas = emptyNode.getElementsByTagName("meta");
    for (var i = metas.length - 1; i >= 0; i--) {
        metas[i].parentNode.removeChild(metas[i]);
    }
    //document.title = title;
    var application = emptyNode.getElementsByClassName("application")[0] || emptyNode;

    if (typeof el == "string")
        el = document.getElementById(el);
    if (el) {
        if (el.html)
            el.html(linkStr + application.innerHTML);
        else
            el.innerHTML = linkStr + application.innerHTML;
        //history.pushState({},title,url);
        //cb.cache.controls.clear();
        if (callback) {
            callback.call(el, responseText);
        }
        this.executeScript(scriptUrls, scriptText);
    }
};
cb.loader.executeScript = function (scriptUrls, scriptText) {
    var cacheId = "ScriptsLoaded_none";
    if (scriptUrls && scriptUrls.length > 0)
        cacheId = this.loadScripts(scriptUrls);
    if (scriptText && scriptText.length > 0)
        this.executeInlineScriptText(scriptText.join("\r\n"), cacheId);
};
cb.loader.loadScripts = function (scripts) {
    var cacheId = "ScriptsLoaded_" + Math.random();
    cb.cache.set(cacheId, new Array(scripts.length));
    for (var i = 0; i < scripts.length; i++) {
        this.loadScript(scripts[i], (function (i, cacheId) {
            return function () {
                cb.cache.get(cacheId)[i] = true;
            }
        })(i, cacheId), "script");
    }
    return cacheId;
};
cb.loader.loadScript = function (url, callback) {
    cb.rest.loadScript(url, callback);
};
cb.loader.executeInlineScriptText = function (text, cacheId) {
    cb.console.debug("executeInlineScriptText start");
    var isAllScriptLoadCompleted = true;
    var scriptsLoad = cb.cache.get(cacheId) || [];
    var length = scriptsLoad.length;
    for (var i = 0; i < length; i++)
        isAllScriptLoadCompleted = isAllScriptLoadCompleted && scriptsLoad[i];
    if (isAllScriptLoadCompleted) {
        cb.cache.set(cacheId, null);
        cb.console.debug("executeScript:" + text);
        cb.executeScript(text);
        cb.console.debug("executeScript end!");
    }
    else {
        cb.console.debug("executeInlineScriptText delay ——外部js没有下载完");
        setTimeout(cb.loader.executeInlineScriptText, 100, text, cacheId);
    }
    cb.console.debug("executeInlineScriptText" + (isAllScriptLoadCompleted ? "内部js代码执行完成！" : "由于外部js没有下载完，所以延迟执行！"));
};
cb.loader.hasScript = function (src) {
    if (!src || !src.trim())
        return true;
    var scriptNode = document.createElement("script");
    scriptNode.src = src;
    var loadedScripts = document.getElementsByTagName("script");
    for (var i = 0; i < loadedScripts.length; i++) {
        if (loadedScripts[i].src.trim().toLocaleLowerCase() == scriptNode.src.trim().toLocaleLowerCase())
            return true;
    }
};
cb.loader.hasStyle = function (href) {
    if (!href || !href.trim())
        return true;
    var linkNode = document.createElement("link");
    linkNode.href = href;
    linkNode.rel = "stylesheet";
    var loadedStyles = document.getElementsByTagName("link");
    for (var i = 0; i < loadedStyles.length; i++) {
        if (loadedStyles[i].href.trim().toLocaleLowerCase() == linkNode.href.trim().toLocaleLowerCase())
            return true;
    }
};

cb.globalEval = function (data) {
    if (data && $.trim(data)) {
        // We use execScript on Internet Explorer 
        // We use an anonymous function so that context is window
        // rather than jQuery in Firefox
        (window.execScript || function (data) {
            window["eval"].call(window, data);
        })(data);
    }
};
cb.executeScript = function (text) {
    try {
        cb.globalEval(text);
    } catch (ex) {
        cb.console.error("动态执行脚本出错！" + "错误类型：", ex.name + ",错误描述：" + ex.message + ",错误堆栈：" + ex.stack);
        cb.console.error("脚本代码：", text);
        cb.console.error(ex);
    }
};
cb.emptyNode = function (html) {
    return document.createElement("div");
};
cb.getScript = cb.rest.loadScript;

//导航
//参数传递

//单页面应用

//shell


//title
//script
//link
//meta
//<base target="_blank" />
//createSafeFragment
//document.title="title"

//#endregion

//#region 分块传输

cb.rest.httpPipeProxy = function () {
    //  this.queue = {};
    // this.httpPipeProxy
};
cb.rest.ajaxPipeProxy = function () {
    //this.temp.
}

//#endregion


//#region Type extend
Array.isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};
Array.prototype.remove = function (index) {
    if (index >= 0)
        return this.splice(index, 1);
}
Array.prototype.removeData = function (data) {
    var i = this.indexOf(data);
    if (i >= 0)
        this.splice(i, 1);
};
Array.prototype.indexOf = Array.prototype.indexOf || function (data) {
    var i = 0;
    var len = this.length;
    for (; i < len; i++) {
        if (this[i] === data) {
            return i;
        }
    }
    return -1;
}
Array.prototype.removeAll = function () {
    this.splice(0, this.length);
}
Array.prototype.insert = function (index, data) {
    if (index >= 0 && !this.isEmpty(data))
        return this.splice(index, 0, data);
}
Array.prototype.isEmpty = function (data) {
    return (data === null || data === undefined);
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
Array.prototype.clone = function () {
    return Object.clone(this);
};
Array.prototype.toJson = function () {

};
Array.prototype.fromJson = function () {

};
Array.prototype.each = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        callback.call(scope || this, this[i]);
    }
};
String.prototype.compareIngoreCase = function (b) {
    var a = this.toLowerCase();
    var b = b.toLowerCase();
    if (a == b)
        return 0;
    if (a > b)
        return 1;
    return -1;
}
String.prototype.equalsIgnoreCase = function (b) {
    if (b === undefined || b === null)
        return false;
    return (this.toLowerCase() == b.toLowerCase());
}
String.equalsIgnoreCase = function (a, b) {
    if (a == b)
        return true;
    else if (!a || !b)
        return false;
    return (a.toLowerCase() == b.toLowerCase());
}

String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^\s+|\s+$/g, '');
};

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//Object
Object.clone = function (obj) {
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
            copy[i] = Object.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = Object.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};
//#endregion

//#region 日志 监控 性能分析能
(function () {
    var logger = {};
    logger._debug = false;
    //兼容早期游览器
    window.console = window.console || { log: function () { }, debug: function () { }, error: function () { } };

    //if (window.console) {
    for (var p in window.console) {
        logger[p] = function (fn) {
            return function () {
                if (this._debug) console[fn].apply(console, arguments);
            };
        } (p);
    }
    /*}
    else {
    logger._messages = [];
    logger._intervalId = null;
    logger.log = function (message, optionalParams) {
    /// <summary></summary>
    /// <param name="message" type="Object">[String message]</param>
    /// <param name="optionalParams" type="Object">optionalParams</param>
    /// <returns type="">void</returns>

    if (!this._debug)
    return;
    if (cb.isEmpty(this._intervalId))
    this._init();

    if (!cb.isEmpty(message)) {
    var date = new Date();
    str = date.getHours() + "点" + date.getMinutes() + "分" + date.getSeconds() + "秒" + date.getMilliseconds() + "毫秒";
    this._messages.push(str + ":" + message + ",params:" + (optionalParams || ""));
    }
    this._output = true;
    };
    logger.debug = logger.log;
    logger.info = logger.log;
    logger.error = logger.log;
    logger.warn = logger.log;
    logger.trace = logger.log;
    logger.assert = logger.log;
    logger.dir = logger.log;
    logger.profile = logger.log;
    logger.profileEnd = logger.log;

    logger._init = function () {
    if (!this._debug && !cb.isEmpty(this._intervalId)) {
    window.clearInterval(this._intervalId);
    this._intervalId = null;
    this._show(false);
    this.clear();
    return;
    }
    else {
    cb.console._show();
    this._intervalId = window.setInterval(function () {
    if (cb.console._output) {
    cb.console._show();
    cb.console._output = false;
    cb.console._messages.removeAll();
    }
    }, 300);
    }
    };
    logger._show = function (display) {
    var pop = document.getElementById("console");
    if (display === false && pop) {
    pop.style.display = "none";
    return;
    }
    if (!pop) {
    pop = document.createElement("textarea");
    pop.id = "console";
    pop.setAttribute("rows", 15);
    pop.setAttribute("cols", 80);
    pop.style.cssText = "position:fixed;right:0px;top:0px;z-index:10000";
    pop.appendChild(document.createTextNode("---"));
    document.body.appendChild(pop);
    }
    pop.style.display = "block";
    pop.value = this._messages.length > 0 ? this._messages.join("\r\n") : "开始日志";
    };
    logger.clear = function () {
    var pop = document.getElementById("console");
    pop.value = "clear";
    this._messages.removeAll();
    };
    }*/
    logger.isDebug = function (debug) {
        if (arguments.length == 0)
            return this._debug; //返回值
        this._debug = debug;
        if (this._init)
            this._init();
    }
    cb.console = cb.logger = logger;
})();
cb.console.isDebug(true);


cb.monitor = {
    formatTime: function (date) {
        return date ? (date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds()) : null;
    },
    start: function () {
        this._startTime = new Date();
    },
    stop: function () {
        this._stoptTime = new Date();
        var str = "\r\n用时（毫秒）: " + this.timeSpan();
        str += "（\r\nstart: " + this.formatTime(this._startTime) + "\r\n stop:" + this.formatTime(this._stoptTime) + " )";
        this.log(str);
        return str;
    },
    timeSpan: function () {
        return this._stoptTime - this._startTime;
    },
    log: function (str) {
        cb.console.log(str);
    }
};

cb.profile = {
    start: function () { },
    stop: function () { }
}

//#endregion

//给谁使用
//Model（Collection）,二维加上
//View---demo                   
//View 支持模板(基本模板标识符) 1
//数据绑定 ok  丰富API（穷举，加限制）
//值转换---------- no（给谁使用，内部），绑定机制的值转换，特殊转换器
//事件（Events）--- 丰富API，上下文
//脏数据              10
//前端CRUD接口（序列化、toJson、fromJson） 9      
//表单验证            8
//路由(Router)        1
//深度链接            
//组件重用        
//依赖注入。             1（不对开发人员开放）
//模块化(SeaJS，require) 使用第三方库        
//日志、调试、性能监测   
//闭包，自执行函数       后续优化
//viewModel.collect();
//viewModel.load();
//viewModel.loadData();
//viewModel.save();
//viewModel.isDirty();
//viewModel.toJson();

cb.route = {};
cb.route.base = "http://" + location.host + "/Portal/";
cb.route.showPage = cb.route.ShowPage = cb.route.NavigatePage = function (pageRoute, queryString) {
    ///<param name="pageRoute" type="String">pageRoute: 路由，举例：pu.PurchaseOrder</param> 
    ///<param name="queryString" type="Object">queryString: 参数:{id:123}</param> 
    var pageUrl = cb.route.getPageUrl(pageRoute, queryString);
    this.setParams(pageRoute, queryString);

    if (history.pushState) {
        history.pushState({}, "", pageUrl);
        //$(".application").loadView(pageUrl);
        if ($(".page").length) $(".page").loadView(pageUrl);
    }
    else {
        location.href = pageUrl
        //location.hash = pageUrl;
        //$(".application").loadView(pageUrl);
    }
    //location.href = pageUrl;
};

window.onpopstate = function (e) {
    //$(".application").loadView(location.href);
    if ($(".page").length) $(".page").loadView(location.href);
    //return false;
};

// 浏览器关闭、刷新、回退、前进事件
window.onbeforeunload = function () {
    var tip = "该操作将会导致“打开的页签关闭”或“操作的数据丢失”，您是否确认？";
    var evt = window.event || arguments[0];
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("MSIE") > 0) {
        var n = window.event.screenX - window.screenLeft;
        var b = n > document.documentElement.scrollWidth - 20;
        if (b && window.event.clientY < 0 || window.event.altKey) {
            window.event.returnValue = tip;
        } else {
            return tip;
        }
    } else if (userAgent.indexOf("Chrome") > 0) {
        return tip;
    }
};

cb.route.showPopup = function (route, params) {
    this.setParams(route, params);
    cb.controls.Popup.show(route, params);
};
cb.route.showDialog = function (route, params) {
    this.setParams(route, params);
    cb.controls.Dialog.show(route, params);
};
cb.route.showPanel = function (route, params) {
    this.setParams(route, params);
    cb.controls.Panel.show(route, params);
};
cb.route.redirectHomepage = function (queryString) {
    if (!queryString) queryString = {};
    var queryStringParent = new cb.util.queryString(location.search);
    if (queryStringParent) {
        for (var attr in queryStringParent.p) {
            queryString[attr] = queryString[attr] || queryStringParent.get(attr);
        }
    }
    var homepageUrl = "home";
    var firstAttr = false;
    for (var attr in queryString) {
        var attrValue = queryString[attr];
        if (attrValue != null) {
            if (!firstAttr) {
                firstAttr = true;
                homepageUrl += "?" + attr + "=" + attrValue;
            }
            else {
                homepageUrl += "&" + attr + "=" + attrValue;
            }
        }
    }
    cb.route.navigate(homepageUrl);
};
cb.route.redirectLoginPage = function () {
    var queryString = new cb.util.queryString(location.search);
    var loginPageUrl = "/";
    var firstAttr = false;
    cb.forEach(queryString.p, function (index, attr, val) {
        if (attr == "token" || attr == "size") return;
        if (!firstAttr) {
            firstAttr = true;
            loginPageUrl += "?" + attr + "=" + val;
        } else {
            loginPageUrl += "&" + attr + "=" + val;
        }
    });
    cb.route.navigate(loginPageUrl);
};
cb.route.renewApps = function (params) {
    var callback = function (data) {
        if (!data || !data.success) {
            cb.util.warningMessage("缓存清除失败", "缓存清除失败");
        }
    };
    params = cb.extend(params, { "callback": callback });
    cb.rest.ajax("apps/renew", params);
};
cb.route.getPageUrl = function (pageRoute, queryString) {
    if (!queryString)
        queryString = {};
    var queryStringParent = new cb.util.queryString(location.search);
    if (queryStringParent) {
        queryString.remote = queryString.remote || queryStringParent.get("remote");       //调试用,远程加载
        queryString.transfer = queryString.transfer || queryStringParent.get("transfer"); //调试用,重新从模版生成
        queryString.token = queryString.token || queryStringParent.get("token");
        queryString.size = queryString.size || queryStringParent.get("size");
        if (!queryString.size)
            delete queryString.size;
    }
    /**** 直接用数据量存储的url,后续考虑优化路由---需要单独考虑外部直接url的情况 */
    //var pageUrl = pageRoute.indexOf("page.jsp?app=") >= 0 ? pageRoute : ("page.jsp?app=" + pageRoute);
    var pageUrl = "";
    if (pageRoute.indexOf("page.jsp?app=") >= 0) {
        pageUrl = pageRoute;
    }
    else if (pageRoute.indexOf(".html") >= 0 || pageRoute.indexOf(".htm") >= 0 || pageRoute.indexOf(".jsp") >= 0) {
        //特殊处理外部静态url情况
        pageUrl = pageRoute.indexOf("?app=") >= 0 ? pageRoute : (pageRoute + "?app=special");
    }
    else {
        pageUrl = ("page.jsp?app=" + pageRoute);
        //if (pageUrl.lastIndexOf("App") < 0)
        if (pageUrl.substr(pageUrl.length - 3, 3) !== "App")
            pageUrl += "App";  //这里不需要做这个判断，放到数据库里和传递的参数里保证url正确性
    }
    for (var attr in queryString)
        if (queryString[attr] != null)
            pageUrl += "&" + attr + "=" + queryString[attr];
    return pageUrl;
};
cb.route.getAppParamsFromMenu = function (menu) {
    if (!menu || !menu.url) return null;
    var appParams = this.getAppParamsFromUrl(menu.url);
    if (menu["displayName"])
        appParams.params["title"] = menu["displayName"];
    return appParams;
};
cb.route.getAppParamsFromUrl = function (url) {
    if (!url) return null;
    var pageUrl;
    if (url.indexOf("page.jsp?app=") >= 0) {
        pageUrl = url;
    } else if (url.indexOf(".html") >= 0 || url.indexOf(".htm") >= 0 || url.indexOf(".jsp") >= 0) {
        pageUrl = url;
    } else {
        var index = url.indexOf("?");
        var app = index > 0 ? url.substr(0, index) : url;
        if (app.substr(app.length - 3, 3) !== "App")
            app += "App";
        pageUrl = "page.jsp?app=" + app;
        if (index >= 0)
            pageUrl += "&" + url.substr(index + 1);
    }
    var queryString = new cb.util.queryString(pageUrl);
    var appParams = { params: { queryString: {}} };
    for (var attr in queryString.p) {
        if (attr === "app")
            appParams.appId = queryString.p[attr];
        else
            appParams.params.queryString[attr] = queryString.p[attr];
    }
    return appParams;
};
cb.route.ShowPageByJson = function (pageRoute, params, pageType) {
    this.setParams(pageRoute, params);
    cb.route.GetPageJson(pageRoute, function (data) {
        data.innerHTML = data.html;
        data.popup = true;
        delete data.html;
        var view = cb.controls.view("view01", data);
    });
};
cb.route.GetPageJson = function (pageRoute, callback) {
    var pageUrl = cb.route.base + pageRoute + ".json";
    cb.rest.ajax(pageUrl, { callback: callback });
};
cb.route.setParams = function (pageRoute, params) {
    this._params = this._params || {};
    this._params[pageRoute] = params;
};
cb.route.getParams = function (pageRoute) {
    return (this._params && this._params[pageRoute]) || {};
};

cb.controls = {};

cb.controls.create = function (controlType, elementId, options) {
    /// <param name="controlType" type="String">控件类型:</param>
    /// <param name="elementId" type="String">控件ID</param>
    /// <param name="options" type="Object">控件参数</param>
    if (!elementId || !cb.controls[controlType]) {
        cb.console.error("控件创建不成功，原因：elementId为空或者该类型控件不存在！");
        cb.console.error("elementId为：" + elementId);
        cb.console.error("cb.controls[" + controlType + "]：" + cb.controls[controlType]);
        return;
    }
    if (cb.cache.controls.get(elementId))
        cb.console.error("重复创建控件：控件ID为" + elementId + "，请确认为何会重复创建！");
    var control = new cb.controls[controlType](elementId, options);
    cb.cache.controls.set(elementId, control); //cb.controls.caches.push({ id: elementId, control: control });
    return control;
};

cb.controls.createControls = function (mappings) {
    ///<param name="mappings" type="Array">mappings: [cb.binding.Mapping]</param> 
    if (!mappings || !mappings.length)
        return;
    var length = mappings.length;
    var control;
    for (var i = 0; i < length; i++) {
        control = cb.controls.create(mappings[i].controlType, mappings[i].controlId, { propertyName: mappings[i].propertyName });
        if (control && control.controlType && mappings[i].controlType != control.controlType)
            mappings[i].controlType = control.controlType;
    }
};

cb.controls.findControlById = function (id) {
    return cb.cache.controls.get(id);  //return document.getElementById(id); //数据量大时候，document.getElementById很慢
};

//公式运行
cb.formula = {
    register: function (viewModel, formulas, isRowModel) {
        if (!viewModel || !formulas) return;

        var eventName = !isRowModel ? 'afterChange' : 'afterValueChange';
        var model3ds = {};
        var model3dFormulas = {};

        for (var i = 0; i < formulas.length; i++) {
            var trigger = formulas[i].trigger;
            var code = formulas[i].code;
            if (!trigger)
                continue;
            var propertyName;
            var columnName;

            if (trigger.indexOf(".") != -1) {
                var triggerSplits = trigger.split(".");
                propertyName = triggerSplits[0];
                columnName = triggerSplits[1];
                var property = viewModel.get(propertyName);

                model3dFormulas[propertyName] = model3dFormulas[propertyName] || [];
                model3dFormulas[propertyName].push({ "trigger": columnName, "code": code });
                model3ds[propertyName] = property;
            } else {
                propertyName = trigger;
                var property = viewModel.get(trigger);
                if (property && property.on)
                    property.on(eventName, (function (code, propertyName) { return function () { cb.formula.run(this.getParent(), propertyName, code); } })(code, propertyName));
            }
        }

        for (var p in model3dFormulas) {
            model3ds[p].setState('formulas', JSON.stringify(model3dFormulas[p]));
        }
    },

    run: function (viewModel, fieldName, formula) {
        if (!formula || !viewModel)
            return;
        var vm = viewModel;
        try {
            cb.console.log("解析前公式：" + formula);

            var formula = this.parse(formula);

            cb.console.log("解析后公式：" + formula);

            var formatPromt = function (fieldName, field, info) {
                //alert("事件触发源：" + fieldName + ",属性：" + field + ",错误信息：" + info);
            };

            var result = eval(formula);
            if (result != null && result.code != 0) {
                switch (result.code) {
                    case "1":
                        formatPromt(fieldName, result.field, "数据无效");
                        break;
                    case "2":
                    case "3":
                        var field = (result.field != "") ? vm.get(result.field) : null;
                        if (field != null) {
                            formatPromt(fieldName, field.get("title"), result.info);
                        }
                        else {
                            formatPromt(fieldName, "", result.info);
                        }
                        break;
                }
            }

            //Model3D中行修改中的公式执行后，更新已修改计数信息
            var _$count = vm.get('_$count');
            if (_$count) {
                vm.set('_$count', --_$count);
                if (!_$count) {//如果全部修改完了，提交到Model3D
                    vm.execute('save', { rowId: vm.get('_$rowId'), update: vm.collectData(true) });
                }
            }
        } catch (e) {
            alert("公式解析出错！" + formula + e);
            cb.console.error("公式解析出错！" + formula + e);
        }
    },
    parse: function (txt) {
        return typeof cb.formula.parseFormular === "function" ? cb.formula.parseFormular(txt) : txt;
    },

    isnull: function (data, nullValue) {
        return (data === null || data === undefined || (typeof data === "number" && isNaN(data))) ? nullValue : data;
    }
};

cb.plugin = {};
cb.plugin.register = function (controlType, controlBinding) {
    var congtrol = cb.controls[controlType];
    var binding = cb.bindings[bindingType]
    //var congtrolJsPath = BaseJsPath + congtrol + ".js";
    //var bindingJsPath = BaseJsPath + binding + ".js";

    cb.controls[controlType] = function () {

    };
    cb.binding[controlType + "Binding"] = function () {

    };
};

cb.binding.getBindingClass = function (controlType) {
    return this[controlType + "Binding"];
};
cb.controls.getControlClass = function (controlType) {
    return this[controlType];
};
cb.viewmodel.getNewViewModelId = function (viewId) {
    return viewId;
    return cb.getNewId(viewModelName);
}

cb.biz = cb.biz || {};
// 获取基本的差异VO输入参数
cb.biz.getInputData = function (viewModel) {
    var pkName = viewModel.getPkName();
    var pkValue = viewModel.getPkValue();
    if (pkName == null || pkValue == null) {
        cb.console.error("主键" + pkName + "为空！");
        return;
    }
    var tsName = viewModel.getTsName();
    var tsValue = viewModel.getTsValue();
    if (tsName == null || tsValue == null) {
        cb.console.error("ts为空！");
        return;
    }
    var inputData = {};
    inputData[pkName] = pkValue;
    inputData[tsName] = tsValue;
    return inputData;
};
//参照缓存
cb.cache.refer = {};
//修改参照的setValue方法。
cb.hacks = cb.hacks || {};
if (!cb.loader.hasScript("apps/common/refer/ReferLoader.js")) {
    cb.loader.loadScript("apps/common/refer/ReferLoader.js");
}
cb.hacks.setReferValue = function (refModel) {

    //过滤多余的信息，只获取pk，code，name和其他指定要携带的字段值
    var _filterData = function (selected) {
        if (selected == null) return null;
        if (!cb.isArray(selected)) {
            selected = [selected];
        }
        var arr = [];
        var model = this;
        var refKey = model.get('refKey') || '',
			refCode = model.get('refCode') || 'code',
			refName = model.get('refName') || 'name',
			refRelation = model.get('refRelation') || '',

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

        return arr.length<2 ? arr[0]:arr;//有多条数据时返回数组，否则返回数据对象
    };
    //更新参照相关的model（相关的model通过当前参照使用的model的refRelation确定）（调用该方法时，相关的携带数据应该已处理好）
    var _updateRelModel = function (ignoreRelField) {
        var model = this;
        var modelName = model.getModelName(),
			parent = model.getParent();
        var _$count = parent.get('_$count') || 0;//有值认为是行模型内的setValue
			
        if (!ignoreRelField) {
            //更新关联信息
            var refRelation = model.get('refRelation') || '',
               refData = model.get('refData') || {},
               refKey = model.get('refKey'),
               refCode = model.get('refCode') || 'code',
               refName = model.get('refName') || 'name',
               relations = refRelation.split(",");
            var codeFld = modelName + "_" + refCode.toLowerCase(),
			    nameFld = modelName + "_" + refName.toLowerCase();
            parent.set(codeFld, refData['code']);
            parent.set(nameFld, refData['name']);

            
            if (model.getValue()) {//如果值为空，不处理携带

                for (var i = 0; i < relations.length; i++) {
                    var st = relations[i].split("=");
                    if (st.length != 2) continue;
                    var target = st[0];
                    var source = st[1];

                    var targetModel = model.getParent().get(target);
                    if (targetModel) {
                        //if (!refData[source]) throw ('参照携带信息不全');
                        var targetData = refData.targets[target];
                        if (!(targetData && typeof targetData === 'object' && targetData.keyField)) {//携带普通数据
                            targetModel.setValue(targetData);
                        } else {//携带参照
                            var targetValue = targetData.data[targetData['keyField']];
                            if (targetModel.getValue() !== targetValue) {//如果携带的参照值改变了
                                var data = cb.clone(targetData.data);

                                //targetModel.set('refCodeValue', data[targetData['codeField']]);
                                targetModel.setData('refData', data);
                                //如果是行模型的参照携带的参照，当前参照的修改等价于修改两个参照的值，计数加1
                                if (_$count) {
                                    parent.set('_$count', ++_$count);
                                }
                                targetModel.setValue(data[targetData['keyField']]);
                            }
                        }

                    }
                }
            }
        }
        

        //Model3D中行修改中的修改参照字段的值时，处理完携带信息后，更新已修改计数信息
        
        if (_$count) {
            parent.set('_$count', --_$count);
            if (!_$count) {
                parent.execute('save', { rowId: parent.get('_$rowId'), update: parent.collectData(true) });
            }
        }
    };

    //设置值后的相关处理(设置模型的值，设置相关模型的值，触发相关事件)
    var _change = function (refId, value, refData, args, ignoreRelField,fireChangeEvt) {//ignoreRelField说明是否更新相关模型
        var model = this;
        var vmName = model.getParent().getModelName();
        vmName = vmName.replace(/_\d+$/, '');

        var modelName = model.getModelName(),
            refCode = model.get('refCode') || 'code',
            refName = model.get('refName') || 'name';

        var codeValue = '', nameValue = '';

        if (value) {
            var key = vmName + '/' + refId + '/' + value;
            model._data['value'] = value;
            cb.cache.refer[key] = cb.cache.refer[key] || cb.clone(refData);

            codeValue = refData['code'];
            nameValue = refData['name'];
        } else {
            model._data['value'] = value = null;
        }
        model.set('refData', refData);
        _updateRelModel.call(model, ignoreRelField);

        model.PropertyChange(new cb.model.PropertyChangeArgs(model._name, 'value', { value: value, code: codeValue, name: nameValue }));
        model.afterExecute("valuechange", args);
        if (fireChangeEvt) model.afterExecute('change', args);
       
    };
    var getQueryData = function (model) {
        var queryData = model.get("queryData");
        queryData && typeof queryData === 'object' ? null : queryData = {};

        queryData = $.extend(true, { refCode: model.get("refId") }, queryData);
        return queryData;
    };
    var _parseRefRelation=function (refRelation) {
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
    };
    /*
    实现说明：
        模型设置参照值时，模型所在viewModel中的对应codemodel和namemodel的值和当前的参照值同步；
        如果当前参照值不空，则参照值对应的携带信息（code和name也视为携带信息）存储在refData属性中；
        如果为空，则refData为空，且对应的codename和namemodel也为空；
        第一时间判断是否有缓存，有缓存直接使用缓存设置相关字段的值；
        当设置参照值时，有以下几种情况：
        1.refData为空：此时携带信息要么准备好，要么没准备；
            1.1 如果codemodel有值，认为已经准备好携带信息，这时不请求参照相关信息，收集相关模型的值作为refData数据；
            1.2 如果没准备好相关数据，请求相关数据；
        2.refData不为空：判断当前的值和要设置的值的关系,如果值改变了或值未变但数据不全，请求相关数据；

    */
    /*
    参照模型setValue的调用背景有两种情况：
        1.携带信息都已经设置好后调用；
        2.携带信息为设置

        调用setValue后参照模型会设置refData属性存储当前相关信息，刚开始时可认为refData默认为null；
        如果refData和当前相关的model数据不一致，说明相关的信息都已经设置好了
    */
    //修改参照使用的model的setValue方法
    refModel.setValue = function (value, delay, forse,data,fireChangeEvt) {//如果强制执行，则不考虑当前状态;data表示相关数据，如果明确提供相关数据，就使用相关数据更新相关模型
        var model = this;
        if (delay) {//页面loadData时,等相关的字段setValue后在执行参照的setValue
            model._data.value = value;
            setTimeout(function () {
                model.setValue(value, null, true);
            }, 0);
            return;
        }

        var currentVal = this.getValue();
        // zhangxub
        if (!forse && value === currentVal) return false;


        var args = { Value: value, OldValue: currentVal };

        if (!model.beforeExecute("valuechange", args) || (fireChangeEvt && !model.beforeExecute("change", args))) return false;

        //参照值置空时，仅把参照值清空，不处理相关的数据
        if (value === '' || value == null) {
            //model.set('refData',{});
            _change.call(model, refId, '', null, args, null, fireChangeEvt);
            return;
        }
        
        var refId = model.get('refId') || '',
			refKey = model.get('refKey') || '',
			refCode = model.get('refCode') || 'code',
			refName = model.get('refName') || 'name',
			showMode = model.get("refShowMode") || "Name",
			refData = model.get("refData") || {}, // 参照相关数据
			refRelation = model.get('refRelation') || '',
			relations = refRelation.split(",");
        var primaryKey = value;
        var rela = '';

        var codeValue = null, nameValue = null;
        var modelName = model.getModelName(),
			parentModel = model.getParent(),
			codeFld = modelName + "_" + refCode.toLowerCase(),
			nameFld = modelName + "_" + refName.toLowerCase(),
			codeModel = parentModel.get(codeFld),
			nameModel = parentModel.get(nameFld);

        codeValue = (codeModel && codeModel.getValue) ? codeModel.getValue() : codeModel;
        nameValue = (nameModel && nameModel.getValue) ? nameModel.getValue() : nameModel;

        var relFieldsSetted = false;
        //如果设置值时，相关信息和当前refData不一致，说明相关信息已经设置好了
        if (!data && codeValue && (codeValue !== refData['code'] || nameValue !== refData['name'])) {//可见，提供data时，不可能设置好了相关数据
            relFieldsSetted = true;
        } else if (data) {//明确提供相关数据时忽略相关；这个语句必须放在上个语句后面
            refData = cb.clone(data);
        }
        var useCache = false;
        var vmName = model.getParent().getModelName();
        vmName = vmName.replace(/_\d+$/, '');
        var cacheId = vmName + '/' + refId + '/' + value;
        if (!data && cb.cache.refer[cacheId]) {//未明确指定相关数据，且有缓存时，直接使用缓存数据
            refData = cb.cache.refer[cacheId];
            useCache = true;
        }
        

        if (!relFieldsSetted) {//refData存储当前参照的信息，如果为空，说明数据在对应的code，name模型中。

            //有refData,判断是否是当前value相关的data，如果不是，从服务端获取对应的参照数据
            if (value === refData['key']) {
                //判断相关的数据是否都已经获取到（当参照中携带的参照字段时，被携带的参照字段仅返回pk、code、name信息，如果被携带的参照本身需要携带信息，这时需要额外请求参照数据）
                var noExists = [];
                for (var i = 0; i < relations.length; i++) {
                    var st = relations[i].split("=");
                    if (st.length != 2) continue;
                    var target = st[0];
                    var source = st[1];

                    //如果返回的值中没有要携带的字段值
                    if (!refData.targets.hasOwnProperty(target)) {
                        noExists.push(relations[i]);
                    }
                }
                if (!noExists.length) {//无需另外请求携带信息
                    _change.call(model, refId, value, refData, args,null, fireChangeEvt);
                    return;
                }
                rela = noExists.join(',');
            } else {//说明参照数据未知，需要从服务端请求
                rela = refRelation;
            }
            var filters = [{ value: value}];
            //下面的回调中会使用primaryKey, rela信息

            //请求参照信息
            var queryData = getQueryData(model);

            ReferLoader.loadRefer(refId, filters, function (success, fail) {
                if (fail) { alert(fail.error); return; }
                //取得数据后，相当于在参照界面中选择某条数据，按确定
                if (success.table && success.table.currentPageData) {
                    var cData = success.table.currentPageData;
                    if ($.isArray(cData) && cData.length > 0) {
                        var data = success.table.currentPageData[0];
                        //处理携带
                        if (!rela) {
                            data = _filterData.call(model, data);
                            //model.set('refData', data);

                            _change.call(model, refId, value, data, args, null, fireChangeEvt);
                            return;
                        } else {

                            ReferLoader.loadCarrier(refId, primaryKey, rela, function (success, fail) {
                                if (fail) return;
                                var map = _parseRefRelation(rela);
                                //that._setReferCarrier(success);
                                //处理携带的信息
                                if (!cb.isArray(success) && success.hasOwnProperty(primaryKey)) { success = success[primaryKey]; }
                                var targets = success;

                                //[{targetFld:'department',targetFldType:'1',targetData:{keyField:'id',codeField:'code',nameField:'name',data:[{id:'资金科',code:'1111',name:'1001ZZ10000000002J23'}]}},
                                //{targetFld:'persondate',targetFldType:'0',targetData:'2014-04-29 20:40:28']
                                for (var i = 0; i < targets.length; i++) {
                                    var target = targets[i];
                                    data[map[target.targetFld]] = target.targetData || '';
                                }
                                data = _filterData.call(model, data);
                                //model.set('refData', data);

                                _change.call(model, refId, value, data, args, null, fireChangeEvt);

                            });
                        }

                    } else {
                        throw ('无效的参照值');
                    }
                }
            }, queryData);


        } else {          
            if (!useCache) {
                //收集相关数据
                refData = {};
                refData['key'] = value;
                refData['code'] = codeValue;
                refData['name'] = nameValue;
                refData.targets = {};
                //参照携带信息
                var targetSourceMap = _parseRefRelation(refRelation);//target字段名为key
                for (var target in targetSourceMap) {
                    var targetModel = parentModel.get(target);
                    refData.targets[target] = (targetModel && targetModel.getValue) ? targetModel.getValue() : targetModel;
                }
            }

            _change.call(model, refId, value, refData, args, true, fireChangeEvt);
        }
    };
    var _set = refModel.set;
    refModel.set = function (propertyName, value) {
        if (propertyName == 'value') {
            this.setValue(value);
        } else {
            _set.call(this, propertyName, value);
        }
    };
};
cb.hacks.setDateValue = function (dateModel) {
    var _formatString = function (valDate, type) {
        if (!(valDate instanceof Date)) return null;
        if (type === "DateBox") {
            return cb.util.formatDate(valDate);
        } else if (type == "DateTimeBox") {
            return cb.util.formatDateTime(valDate);
        }
    };
    var _formatValue = function (valStr, type) {
        type = type || "DateBox";
        return valStr === "@SYSDATE" ? _formatString(new Date(), type) : valStr;
    };
    dateModel.setValue = function (value, isValueChange) {
        if (value == null) {
            value = null;
        } else {
            value = _formatValue(value, this.get("ctrlType"));
        }
        if (value === this.getValue()) return false;
        if (isValueChange === false)
            this.change(value);
        else
            this.valueChange(value);
    };
};

cb.route.init = function () {
    this.router = new kendo.Router({ pushState: true });
    this.router.bind("back", function (e) {
        var toUrl = e.to;
        var index = toUrl.indexOf("?");
        toUrl = index >= 0 ? toUrl.substr(0, toUrl) : toUrl;
        if (toUrl === "") {
            cb.util.confirmMessage("确定要退出登录吗？", function () {
                var viewModel = cb.cache.get("PortalViewModel");
                if (!viewModel) return;
                viewModel.getProxy().logout(function () {
                    cb.route.redirectLoginPage();
                });
            });
            e.preventDefault();
        }
    });
    this.router.route("/", function (queryString) {
        var loginPage = document.getElementById("loginPage");
        var homePage = document.getElementById("homePage");
        if (!loginPage.childNodes.length)
            cb.loader.loadView("loginPage", "login.html");
        loginPage.style.display = "block";
        homePage.style.display = "none";
        cb.rest.ContextBuilder.destroy();
        cb.route.execute("login", queryString);
    });
    this.router.route("", function (queryString) {
        var loginPage = document.getElementById("loginPage");
        var homePage = document.getElementById("homePage");
        if (!loginPage.childNodes.length)
            cb.loader.loadView("loginPage", "login.html");
        loginPage.style.display = "block";
        homePage.style.display = "none";
        cb.rest.ContextBuilder.destroy();
        cb.route.execute("login", queryString);
    });
    this.router.route("home", function (queryString) {
        var loginPage = document.getElementById("loginPage");
        var homePage = document.getElementById("homePage");
        if (!homePage.childNodes.length) {
            var pageUrl = cb.route.getPageUrl("common.home.PortalApp", queryString);
            cb.loader.loadView("homePage", pageUrl);
        }
        homePage.style.display = "block";
        loginPage.style.display = "none";
        cb.rest.ContextBuilder.construct(cb.data.JsonSerializer.deserialize(localStorage.getItem("userData")));
        cb.route.execute("home");
    });
    this.router.start();
};
cb.route.navigate = function (route) {
    this.router.navigate(route);
};
cb.route.register = function (name, callback, context) {
    if (!name || !callback) return;
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({ callback: callback, context: context });
};
cb.route.execute = function (name) {
    if (!name) return;
    var events = this._events ? this._events[name] : null;
    if (!events) return true;
    var result = true;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < events.length; i++) {
        result = events[i].callback.apply(events[i].context || this, args) === false ? false : result;
    }
    return result;
};
cb.route.start = function () {
    cb.each(cb.loader.styleConfigs.MessageBox, function (item) {
        cb.rest.loadStyle(item);
    });
    var scriptUrls = [];
    cb.each(cb.loader.scriptConfigs.MessageBox, function (item) {
        scriptUrls.push(item);
    });
    cb.each(cb.loader.scriptConfigs.Router, function (item) {
        scriptUrls.push(item);
    });
    var scriptText = [];
    scriptText.push("cb.route.init();");
    cb.loader.executeScript(scriptUrls, scriptText);
};
cb.route.start();