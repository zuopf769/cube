cb.data.CommonProxy = function (symbol) {
    var proxy;
    var cache = cb.cache.get("CommonProxy");
    if (cache && cache[symbol]) proxy = cache[symbol];
    if (!proxy) {
        var baseUrl = "classes/General/" + symbol + "/";

        var config = {
            // 新增/修改的保存
            Save: { url: baseUrl + "Save", method: "Post", mask: true },
            // 查询单张
            QueryByPK: { url: baseUrl + "QueryByPK", method: "Get" },
            QueryByCode: { url: baseUrl + "QueryByCode", method: "Get" },
            //通过单据类型查询appid
            QueryAppIDByBillType:{url:baseUrl+"QueryAppIDByBillType",method:"Get"},
            // 删除
            Delete: { url: baseUrl + "Delete", method: "Post", mask: true },
            // 提交
            Submit: { url: baseUrl + "Submit", method: "Post", mask: true },
            CheckApprove: { url: baseUrl + "CheckApprove", method: "Get" },
            OverRule: { url: baseUrl + "OverRule", method: "Get" },
            // 审核/驳回（在审批界面中自己处理，同意、不同意、驳回）
            Approve: { url: baseUrl + "Approve", method: "Post", mask: true },
            // 收回
            WithDraw: { url: baseUrl + "WithDraw", method: "Post", mask: true },
            // 弃审
            UnApprove: { url: baseUrl + "UnApprove", method: "Post", mask: true },
            // 查审
            LinkApproveInfo: { url: baseUrl + "LinkApproveInfo", method: "Get" },
            // 列表查询
            Query: { url: baseUrl + "Query", method: "Post" },
            QueryTree: { url: baseUrl + "QueryTree", method: "Post" },
            QueryTreeData: { url: baseUrl + "QueryTreeData", method: "Post" },
            // 联查
            LinkQueryBillList : {url:baseUrl +"LinkQueryBillList",method:"Post"},

            QueryBill: { url: baseUrl + "queryBill", method: "Post" },
            Pull: { url: baseUrl + "Pull", method: "Post", mask: true },
            LoadSchemeList: { url: baseUrl + "LoadSchemeList", method: "Get" },
            LoadSchemeDataCount: { url: baseUrl + "LoadSchemeDataCount", method: "Post" },
            LoadScheme: { url: baseUrl + "LoadScheme", method: "Get" },

            BatchQueryById: { url: baseUrl + "BatchQueryById", method: "Post" },
            BatchSave: { url: baseUrl + "BatchSave", method: "Post" },
            BatchDelete: { url: baseUrl + "BatchDelete", method: "Post", mask: true },
            BatchSubmit: { url: baseUrl + "BatchSubmit", method: "Post", mask: true },
            BatchApprove: { url: baseUrl + "BatchApprove", method: "Post", mask: true },
            BatchWithDraw: { url: baseUrl + "BatchWithDraw", method: "Post", mask: true },
            BatchUnApprove: { url: baseUrl + "BatchUnApprove", method: "Post", mask: true },

            //推拉单
            pullOrder: { url: baseUrl + "Pull", method: "Post", mask: true },
            //推拉单
            pushOrder: { url: baseUrl + "Push", method: "Post", mask: true },
            //获取栏目
            GetColumnByColCode: { url: baseUrl + "QueryColumnByCode", method: "Get" },
            //单据上一条
            QueryPrevious: { url: baseUrl + "QueryPrevious", method: "Post" },
            //单据下一条
            QueryNext: { url: baseUrl + "QueryNext", method: "Post" },
            //单据界面翻页查询
            QueryNextPreBill: { url: baseUrl + "QueryNextPreBill", method: "Post" },

            //保存之后，返回当前单据是第几条和总共几条
            QueryBillPagination: { url: baseUrl + "QueryBillPagination", method: "Get" },

            //按单据号搜索，返回当前单据信息，及是第几条和总共几条
            QueryBillPaginationByBillNo: { url: baseUrl + "QueryBillPaginationByBillNo", method: "Get" },

            //管理查询方案
            QuerySchemeDelete: { url: baseUrl + "QuerySchemeDelete", method: "Get" },
            //加载查询方案模板信息
            LoadQueryTemplate: { url: baseUrl + "LoadQueryTemplate", method: "Get" },
            //加载查询方案条件明细
            LoadSchemeDetail: { url: baseUrl + "LoadSchemeDetail", method: "Get" },
            //保存查询方案
            QuerySchemeSave: { url: baseUrl + "QuerySchemeSave", method: "Post" },
            SetQuerySchemePubOrPrivate: { url: baseUrl + "SetQuerySchemePubOrPrivate", method: "Get" },
            //查询编码规则
            GetCodeRuleByAppID: {url:baseUrl +"GetCodeRuleByAppID", method: "Get"},
            //加载参照设计器树控件
            AllSimpleRefRecord: {url:baseUrl +"AllSimpleRefRecord", method: "Post"},
            //查询参照计记录
            QueryRefRecord: {url:baseUrl +"QueryRefRecord", method: "Post"},
            //新增或修改参照设计记录
            UpdateRefRecord: {url:baseUrl +"UpdateRefRecord", method: "Post"},
            //删除参照设计记录
            DelRefRecord: {url:baseUrl +"DelRefRecord", method: "Post"},
            //得到参照语义模型PK
            SmartRecordPK: {url:baseUrl +"SmartRecordPK", method: "Post"},
            //得到参照语义模型信息
            SmartRecordInfo: { url:baseUrl + "SmartRecordInfo", method :"Post"},
            //得到参照语义模型信息
            ShowDesignerPage: { url:baseUrl + "ShowDesignerPage", method :"Post"},
            //定位参照记录
            QueryRefPosition: { url:baseUrl + "QueryRefPosition", method :"Post"}
        };
        proxy = cb.rest.DynamicProxy.create(config);
        if (!cache) cache = {};
        cache[symbol] = proxy;
        cb.cache.set("CommonProxy", cache);

        //this.config = config; //请求合并时使用，后续调整代码，
    }

    return proxy;
};