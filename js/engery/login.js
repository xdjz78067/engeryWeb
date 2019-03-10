/**
 * Created by JieMingWan on 2019/2/21.
 */
var loginPage={
    init:function(){
        this.loadPage();
        this.addEvent();
    },
    loadPage:function(){
    },
    addEvent:function(){
        var _this=this;
        $(".btn-login").click(function () {
            _this.LoginVerity();
        })
        $("#username,#userpassword").keydown(function () {
            var e = window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                _this.LoginVerity();
            }
        })
    },
    LoginVerity:function () {
        var pUsername = $.trim($("#username").val());
        var pUserpassword = $.trim($("#userpassword").val());

        var warnStr = ""; //提示变量
        var isWarnUserName = 0; //如果为1，则表示用户名输入有问题
        var isWarnUserPassword = 0; //如果为1，则表示密码输入有问题

        //为空判定
        if (pUsername == "" && pUserpassword == "") {
            warnStr = "请输入账户名和密码";
            isWarnUserName = 1;
            isWarnUserPassword = 1;
        } else if (pUsername == "") {
            warnStr = "请输入账户名";
            isWarnUserName = 1;
        }else if (pUserpassword == "") {
            warnStr = "请输入密码";
            isWarnUserPassword = 1;
        }else if(pUsername!="admin"){
            warnStr = "账户输入错误";
            isWarnUserName = 1;
        }else if(pUserpassword!="admin"){
            warnStr = "密码输入错误";
            isWarnUserPassword = 1;
        }


        if (isWarnUserName == 0 && isWarnUserPassword == 0) {
            location.href="index.html";
        }else{
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: '错误提示!',
                // (string | mandatory) the text inside the notification
                text:warnStr,
                position:"alertCenter",
            });

            return false;
        }
    }
};
$(document).ready(function() {
    loginPage.init();
});