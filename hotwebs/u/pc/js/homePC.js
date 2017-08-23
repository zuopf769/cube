$(document).ready(function () {
    $("#Add-button>a").bind("click", function () {
        $("#Add-button").children("div>div").toggle();
    });
    $("#Add-button>div>button").bind("click", function () {
        var res = $("#Add-button>div>input").val();
        if (res.length) {
            var append = '<li style="background: url(\'pc/images/menu/u97.png\') no-repeat center 16px"><a>' + res + '</a></li>';
            $("#Add-button").before(append);
            $("#Add-button>div>input").val("");
            $("#Add-button").children("div>div").toggle();
        } else {
            alert("输入不允许为空！");        }
    });
    
});