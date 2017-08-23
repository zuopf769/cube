var funTreeDataSource = new kendo.data.HierarchicalDataSource({
	data: [
		{ categoryName: "语义函数", subCategories: [
			{ subCategoryName: "meta" ,funVal:""},
			{ subCategoryName: "parameter" ,funVal:""},
			{ subCategoryName: "macro" ,funVal:""},
			{ subCategoryName: "multicolumn" ,funVal:"multicolumn()"}
		] },
		{ categoryName: "字符函数", subCategories: [
			{ subCategoryName: "substr" ,funVal:"substr(,,)"},
			{ subCategoryName: "length" ,funVal:"length()"},
			{ subCategoryName: "tostring" ,funVal:"tostring()"},
			{ subCategoryName: "nvl" ,funVal:"nvl(,)"},
			{ subCategoryName: "concate" ,funVal:"concat(,)"},
			{ subCategoryName: "indexof" ,funVal:"indexof(,,)"}
		] },
		{ categoryName: "日期函数", subCategories: [
			{ subCategoryName: "date" ,funVal:"date()"},
			{ subCategoryName: "datefmt" ,funVal:"datefmt(,)"},
			{ subCategoryName: "todate" ,funVal:"todate()"},
			{ subCategoryName: "datediff" ,funVal:"datediff(,,)"},
			{ subCategoryName: "dateadd" ,funVal:"dateadd(,,)"},
			{ subCategoryName: "timeoffset" ,funVal:"timeoffset()"}
		] },
		{ categoryName: "数学函数", subCategories: [
			{ subCategoryName: "avg" ,funVal:"avg()"},
			{ subCategoryName: "ceil" ,funVal:"ceil()"},
			{ subCategoryName: "max" ,funVal:"max()"},
			{ subCategoryName: "min" ,funVal:"min()"},
			{ subCategoryName: "round" ,funVal:"round(,)"},
			{ subCategoryName: "sum" ,funVal:"sum()"},
			{ subCategoryName: "count" ,funVal:"count()"},
			{ subCategoryName: "mod" ,funVal:"mod(,)"},
			{ subCategoryName: "int" ,funVal:"int()"},
		] },
		{ categoryName: "PUB-APP扩展语义模型", subCategories: [
			{ subCategoryName: "freedefname" ,funVal:"freedefname(,)"}
		] }
	],
	schema: {
		model: {
			children: "subCategories"
		}
	}
});
