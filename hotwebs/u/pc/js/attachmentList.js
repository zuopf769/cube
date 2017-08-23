/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("AttachmentList", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var fileList = [];
        var streamList = [];
        var dataSource = [];
        this._set_data("dataSource", dataSource);
        //this.execute("collect", dataSource);
        this._set_data("fileList", fileList);
        this._set_data("streamList", streamList);
        var parent = this;
        // 添加附件
        var $input = this.getElement().find("input");
        $input.on("change", { control: this, callback: this.handleAfterLoaded }, function (e, args) {
            debugger;
            var files = e.target.files;
            var paramList = [];
            var dataSource = e.data.control._get_data("dataSource");
            for (var i = 0; i < files.length; i++) {
                var o = new Object();
                var file = files[i];
                o.attachName = file.name;
                o.attachID = null;
                o.attachPathID = parseInt(Math.random() * 10000000000);
                o.status = false;
                o.isNotUpLoad = false;
                var type = new String(file.type);
                o.attachType = "";
                if (type.indexOf("image") != -1) {
                    o.attachType = "1";
                } else {
                    o.attachType = "0";
                }
                o.attachSize = file.size;
                paramList.push(o);
            }
            e.data.control.addDataSource(paramList);  //页面展现
            //上传
            var fileList = e.data.control._get_data("fileList");
           
            for (var i = 0; i < files.length; i++) {
                var item = files[i];
                var reader = new FileReader(); //html5
                var loaded = 0;
                var total = item.size;
                var attachPathID = paramList[i].attachPathID;
                fileList.push(item);
                if (total > 30 * 1024 * 1024)  //单个附件50M大小限制
                {
                    var $infoDiv = $("#" + attachPathID + " > div:last");
                    $infoDiv.children().last().remove();
                    $("<span style='color:red;font-size:12px;'>附件超过30兆，不能上传</span>").appendTo($infoDiv);
                    paramList[i].isNotUpLoad = true;
                   
                } else {
                    var fileReader = new FileReader(item);
                    fileReader.elmentID = attachPathID;
                    fileReader.loaded = 0;
                    fileReader.file = paramList[i];
                    fileReader.onloadstart = function (e) {
                        //读取开始添加滚动条
                        var $infoDiv = $("#" + e.target.elmentID + " > div:last");
                        $infoDiv.children().last().remove();
                        var $processDiv = $("<div class='process process-striped active' style='width:180px;margin-right:30px;border:1px solid #cccccc'></div>");
                        var $processBarDiv = $("<div class='progress-bar progress-bar-info' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: 0%;'><span>0%</span></div>");
                        $processDiv.append($processBarDiv);
                        $infoDiv.append($processDiv)
                    }
                    fileReader.onprogress = function (e) {
                        var $infoDiv = $("#" + e.target.elmentID + " > div:last");
                        var $processBarDiv = $infoDiv.children().last().children();
                        var $span = $processBarDiv.children();
                        var loaded = e.target.loaded;
                        loaded += e.loaded;
                        var result = (loaded / e.total) * 100;
                        $processBarDiv.css({ width: parseInt(result) + "%" });  //计算进度条长度
                        $span.text(parseInt(result) + "%");
                    }
                    fileReader.onload = function (f) {
                        var file = f.target.file;
                        file.attachStream = this.result;
                        var $infoDiv = $("#" + e.target.elmentID + " > div:last");
                        var $processBarDiv = $infoDiv.children().last().children();
                        var $span = $processBarDiv.children();
                        var process = 100 - parseInt(Math.random() * 10);
                        $processBarDiv.css({ width: process + "%" });  //计算进度条长度
                        $span.text(process + "%");
                        e.data.callback.call(e.data.control, { count: files.length, file: file, content: this.result });//加载完数据就上传服务器
                    }
                    fileReader.readAsDataURL(item);
                }
                
            }
        });
        // 上传附件
        this.getElement().children("div").children().first().click(function (e, args) {
            $input.trigger("click");
        });
        // 打包下载
        this.getElement().children("div").children().last().click(function (e, args) {
            parent.downloadBatchAttach();
        });
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;
    control.prototype.handleAfterLoaded = function (args) {
        debugger;
        var fileList = this._get_data("fileList");
        var streamList = this._get_data("streamList");
        var dataSource = this._get_data("dataSource");
        dataSource.push(args.file);
        var that = this;
        var callback = that.updateDataSource;
        this.execute("click", { type: "upload", data: cb.clone(args.file), control: this, callback: callback });
        streamList.push(args.content);
        if (fileList.length == args.count && fileList.length == streamList.length) {
            this._set_data("fileList", []); //清空fileList缓存数据
            this._set_data("streamList",[]);
            this.execute("collect", dataSource);
            
        }
    };
    control.prototype.updateDataSource = function(args)   //上传后更新附件
    {
        var oldAttachPathID = args.oldAttachPathID;
        var retData = args.data;
        if (args.refresh) {
            var optionType = args.optionType;
            var control = args.control;
            var dataSource = control._get_data("dataSource");  //更新附件控件数据内容
            for (var i = 0, j = dataSource.length; i < j; i++) {
                var data = dataSource[i];
                if (data.attachPathID == oldAttachPathID) {
                    switch(optionType)
                    {
                        case "upload":
                            var index = $.inArray(data, dataSource);
                            dataSource.splice(index, 1);
                            dataSource.push(retData);
                            break;
                        case "delete":
                            var index = $.inArray(data, dataSource);
                            dataSource.splice(index, 1);
                            if (dataSource.length == 0) {
                                control.setDataSource([]);
                            }
                            break;
                    }
                    break;
                }
            }
            if (optionType == "delete") {
                $("#" + oldAttachPathID).remove();
            } else {
                var fileFullName = retData.attachName;   //文件全称
                var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));  //目前仅支持如下四种图片格式
                var fileType = fileFullName.substring(fileFullName.lastIndexOf('.') + 1, fileFullName.length);
                var $li = $("#" + oldAttachPathID); //重绘HTML
                var $funcDiv = $("#" + oldAttachPathID + " >div:first").children().last();
                $funcDiv.empty();
                var $downloadSpan = $("<span attachPathID='" + retData.attachPathID + "'>下载</span>").appendTo($funcDiv);
                $downloadSpan.bind("click", function (e) {
                    var attachPathID = $(this).attr("attachPathID");
                    control.downloadAttach(attachPathID);
                });
                var type = "0";
                switch (fileType) { //目前仅支持如下四种图片格式
                    case "jpeg": type = "1"; break;
                    case "jpg": type = "1"; break;
                    case "gif": type = "1"; break;
                    case "png": type = "1"; break;
                }
                var $deleteSpan = $("<span attachType='" + type + "' attachPathID='" + retData.attachPathID + "' status='" + retData.status + "'>删除</span>").appendTo($funcDiv);
                $deleteSpan.bind("click", function (e) {
                    var obj = {};
                    obj.attachPathID = $(this).attr("attachPathID");
                    obj.fileType = $(this).attr("attachType");
                    obj.status = true;
                    if ($(this).attr("status") == 'false') {
                        obj.status = false;
                    }
                    control.deleteAttach(obj);
                });
                var $infoDiv = $("#" + oldAttachPathID + " >div:last");
                $infoDiv.children("div").remove();
                var $downTimeSpan = $("<span>" + retData.downLoadCount + "次下载</span>").appendTo($infoDiv); //下载次数
                var $authorSpan = $("<span>" + retData.creatorName + "</span>").appendTo($infoDiv);//上传人
                var date = retData.createtime.split(' ');
                var $upLoadDateSpan = $("<span>" + date[0] + "</span>").appendTo($infoDiv);//上传时间
                $li.attr("id", retData.attachPathID);
            }
        } else {
            var $infoDiv = $("#" + oldAttachPathID + " > div:last");
            $infoDiv.children().last().remove();
            $("<span style='color:red;font-size:12px;'>上传失败</span>").appendTo($infoDiv);
        }
    }
    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                this["set" + attrUpper](data[attr]);
            }
        }
    };
    control.prototype.setValue = function (val) {
        this.getElement().kendotext({ value: val });
    };
    control.prototype.getValue = function () {
        return this._get_data("dataSource");
    };
    //定义内部函数：删除附件
    control.prototype.deleteAttach = function (args) {
        var status = args.status;
        if (!status) {
            //如果非已上传附件  直接在内存中进行删除
            var dataSource = this._get_data("dataSource");
            $("#" + args.attachPathID).remove();//删除界面元素
            for (var i = 0, j = dataSource.length; i < j; i++) {
                var data = dataSource[i];
                if(data.attachPathID == args.attachPathID)
                {
                    var index = $.inArray(data, dataSource);
                    dataSource.splice(index, 1);
                    if (dataSource.length == 0)
                    {
                        this.setDataSource([]);
                    }
                    break;
                }
            }
        } else {
            var data = {};
            var reqData = {};
            reqData.type = "delete";
            data.attachType = args.fileType;
            data.attachPathID = args.attachPathID;
            reqData.data = data;
            reqData.control = this;
            reqData.callback = this.updateDataSource
            this.execute("click", reqData);
        }
    };
     //定义内部函数：下载附件
    control.prototype.downloadAttach = function (attachPathID) {
        var data = {};
        data.type = "download";
        data.attachPathID = attachPathID;
        this.execute("click", data);
    };
    //批量下载前需要检查当前单据是否存在已上传的附件
    control.prototype.downloadBatchAttach = function () {
        var data = {};
        var dataSource = this._get_data("dataSource");
        var flag = false;
        for (var i = 0, j = dataSource.length; i < j; i++) {
            var status = dataSource[i].status;
            if(status)
            {
                flag = true;
                break;
            }
        }
        if (flag)
        {
            data.type = "batchDownload";
            this.execute("click", data);
        } else {
            cb.util.tipMessage("该单据暂无附件可供下载");
        }
    };
    control.prototype.getDataSource = function () {
        return this._get_data("dataSource");
    };
    
    control.prototype.addDataSource = function (dataSource) {  //上传时调用
        var $ul = this.getElement().find("ul");
        $("#noAttach").remove();
        var control = this;
        for (var i = 0, j = dataSource.length; i < j; i++) {
            var fileFullName = dataSource[i].attachName;   //文件全称
            /**解析文件类型**/
            var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
            var fileType = fileFullName.substring(fileFullName.lastIndexOf('.') + 1, fileFullName.length);
            var attachPathID = dataSource[i].attachPathID;
            var $li = $("<li id='" + attachPathID + "' title='" + fileFullName + "'></li>");
            this.getElement().children("");
            var $img = $("<img src='./pc/images/AttachmentList/" + fileType + ".png'></img>");
            $li.append($img);
            var $titleDiv = $("<div></div>");
            var $nameDiv = $("<div>" + fileName.substring(0, 11) + "</div>");
            $titleDiv.append($nameDiv);
            var $funcDiv = $("<div></div>")
            var $downloadSpan = $("<span></span>");
            var type = "0";
            //目前仅支持如下四种图片格式
            switch (fileType) {
                case "jpeg": type = "1"; break;
                case "jpg": type = "1"; break;
                case "gif": type = "1"; break;
                case "png": type = "1"; break;
            }
            var $deleteSpan = $("<span attachType='" + type + "' attachPathID='" + attachPathID + "' status='" + dataSource[i].status + "'>删除</span>");
            $deleteSpan.bind("click", function (e) {
                var obj = {};
                obj.attachPathID = $(this).attr("attachPathID");
                obj.fileType = $(this).attr("attachType");
                obj.status = true;
                if ($(this).attr("status") == 'false') {
                    obj.status = false;
                }
                control.deleteAttach(obj);
            });
            $funcDiv.append($downloadSpan);
            $funcDiv.append($deleteSpan);
            $titleDiv.append($funcDiv);
            $li.append($titleDiv);
            var $infoDive = $("<div></div>");
            var $sizeSpan = $("<span></span>"); //附件大小
            var size = dataSource[i].attachSize / 1048576;
            if (size >= 1) {
                $sizeSpan.text(size.toFixed(2) + "M");
            } else {
                size = dataSource[i].attachSize / 1024;
                $sizeSpan.text(size.toFixed(2) + "K");
            }
            $infoDive.append($sizeSpan);
            var $authorSpan = $("<span style='color:#B0B0B0;font-size:12px;'>待上传，请稍等……</span>");//上传人
            $infoDive.append($authorSpan);
            $li.append($infoDive);
            $ul.append($li);
        }
    };
    control.prototype.setDataSource = function (dataSource) {   //该方法仅在查询时调用
        var $ul = this.getElement().find("ul");
        $ul.empty();
        var that = this;
        var data = this._get_data("dataSource");  //清空缓存数据
        data.splice(0, data.length);
        if (!cb.isArray(dataSource) || dataSource.length < 1)
        {
            $("<p id='noAttach' style='text-align:center;'>暂无附件信息</p>").appendTo($ul);
        } else {
            for (var i = 0, len = dataSource.length; i < len; i++) {
                dataSource[i].status = true;
                data.push(dataSource[i]);
                var fileFullName = dataSource[i].attachName;   //文件全称
                /**解析文件类型**/
                var fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'));
                var fileType = fileFullName.substring(fileFullName.lastIndexOf('.') + 1, fileFullName.length);
                var attachPathID = dataSource[i].attachPathID;
                var $li = $("<li id='" + attachPathID + "' title='" + fileFullName + "'></li>");  //给每一个附件框加上id
                //单条下载
                this.getElement().children("");
                //设置附件显示图片
                var $img = $("<img src='./pc/images/AttachmentList/" + fileType + ".png'></img>");
                $li.append($img);
                var $titleDiv = $("<div></div>");
                var $nameDiv = $("<div>" + fileName.substring(0, 11) + "</div>");
                $titleDiv.append($nameDiv);
                var $funcDiv = $("<div></div>");
                var $downloadSpan = $("<span attachPathID='" + attachPathID + "'>下载</span>");
                $downloadSpan.bind("click", function (e) {
                    var attachPathID = $(this).attr("attachPathID");
                    that.downloadAttach(attachPathID);
                });
                var type = "0";
                //目前仅支持如下四种图片格式
                switch (fileType) {
                    case "jpeg": type = "1"; break;
                    case "jpg": type = "1"; break;
                    case "gif": type = "1"; break;
                    case "png": type = "1"; break;
                };
                var $deleteSpan = $("<span attachType='" + type + "' attachPathID='" + attachPathID + "' status='" + dataSource[i].status + "'>删除</span>");
                $deleteSpan.bind("click", function (e) {
                    var obj = {};
                    obj.attachPathID = $(this).attr("attachPathID");
                    obj.fileType = $(this).attr("attachType");
                    obj.status = $(this).attr("status");
                    that.deleteAttach(obj);
                });
                $funcDiv.append($downloadSpan);
                $funcDiv.append($deleteSpan);
                $titleDiv.append($funcDiv);
                $li.append($titleDiv);
                var $infoDive = $("<div></div>");
                var $sizeSpan = $("<span></span>"); //附件大小
                var size = dataSource[i].attachSize / 1048576;
                if (size >= 1) {
                    $sizeSpan.text(size.toFixed(2) + "M");
                } else {
                    size = dataSource[i].attachSize / 1024;
                    $sizeSpan.text(size.toFixed(2) + "K");
                }
                $infoDive.append($sizeSpan);
                var $downTimeSpan = $("<span>" + dataSource[i].downLoadCount + "次下载</span>"); //下载次数
                $infoDive.append($downTimeSpan);
                var $authorSpan = $("<span>" + dataSource[i].creatorName + "</span>");//上传人
                $infoDive.append($authorSpan);
                var date = dataSource[i].createtime.split(' ');
                var $upLoadDateSpan = $("<span>" + date[0] + "</span>");//上传时间
                $infoDive.append($upLoadDateSpan);
                $li.append($infoDive);
                $ul.append($li);
            }
        }
    };
    return control;
});