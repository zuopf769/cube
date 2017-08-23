

var getFackData2 = function () {
    var data = {
        "code": "SU03",
        "name": "销售管理",
        "children": [            
            { "code": "SU0301", "name": "设置" , "childrenCount":6, "children": []  },
            { "code": "SU0302", "name": "价格管理", "childrenCount": 10, "children": [] },
            { "code": "SU0303", "name": "销售管理", "childrenCount": 5, "children": [] },
            { "code": "SU0304", "name": "活动管理", "childrenCount": 6, "children": [] },
            { "code": "SU0305", "name": "销售计划", "childrenCount": 4, "children": [] },
            { "code": "SU0306", "name": "销售报价", "childrenCount": 2, "children": [] },
            { "code": "SU0307", "name": "销售订货", "childrenCount": 8, "children": [] },
            { "code": "SU0308", "name": "预留", "childrenCount": 4, "children": [] },
            { "code": "SU0309", "name": "跟踪统计", "childrenCount": 10, "children": [] },
            { "code": "SU0310", "name": "销售发货", "childrenCount": 8, "children": [] },
            { "code": "SU0311", "name": "销售开票", "childrenCount": 5, "children": [] },
        ],
    }

    var number = 0;

    var nameString = ["选项", "期初发货单", "客户价值模型设置", 
                    "信用审批人", "期初委托代销发货单","允显效设置", 
                    "活动计划", "活动", "活动统计", 
                    "活动计划列表", "业务员掉价单", "业务员调价历史记录"];

    function getChildren(data,count) {
        for (var i = 0; i < count; i++) {
            var child = {};
            child.code = number ++;
            var index = parseInt(Math.random()*12);
            if (index < 0 || index >= 12) { index = 6 };
            child.name = nameString[index];
            child.childrenCount = 3;
            child.children = [];

            data.children.push(child);
        }

        return data;
    }

    function createData(data){
        for (var i = 0; i < data.children.length; i++) {
            var child = data.children[i];
            getChildren(child, child.childrenCount);
            for (var j = 0; j < child.children.length; j++) {
                getChildren(child.children[j], child.childrenCount);
            }
        }
        return data;
    }

    return createData(data);
}