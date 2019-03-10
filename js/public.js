var JClient = {};
JClient.UI = {};
JClient.Object = {};

// 解决console在ie8下报错问题
if(!window.console){
    window.console={
        assert:function(){
        },
        clear:function(){
        },
        count:function(){
        },
        debug:function(){
        },
        dir:function(){
        },
        dirxml:function(){
        },
        error:function(){
        },
        exception:function(){
        },
        group:function(name){
        },
        groupCollapsed:function(){
        },
        groupEnd:function(){
        },
        info:function(){
        },
        log:function(){
        },
        memoryProfile:function(){
        },
        memoryProfileEnd:function(){
        },
        profile:function(){
        },
        profileEnd:function(){
        },
        table:function(){
        },
        time:function(){
        },
        timeEnd:function(){
        },
        timeStamp:function(){
        },
        trace:function(){
        },
        warn:function(){
        }
    };
}

/**
*删除数组指定下标或指定对象
*/
ArrayRemove = function(array,obj) {
    for (var i = 0; i < array.length; i++) {
        var temp = array[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < array.length; j++) {
                array[j] = array[j + 1];
            }
            array.length = array.length - 1;
        }
    }
}


//日期时间相关的Js
var DateMoudle = {
    // 日期格式化
    FormatShowDate:function (time,num) {
        var num = num?num:10;
        var result = "";
        if(!time||time=="null"){
            return result;
        }else{
            time = String(time);
        }
        if(time.indexOf("-")!=-1||time.indexOf("/")!=-1){
            time = time.replace(/-/g,"/");
            var timestr = new Date(time).getTime();
            result = DateMoudle.unix_to_datetime(timestr,num);
        }else{
            result = DateMoudle.unix_to_datetime(time,num);
        }
        return result;
    },
    // 日期格式化
    DateFormat:function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }, //DateFormat

    //返回當前的年月日，格式為：2015-06-13
    GetNowDate:function()
    {
        //日期初始化
        var myDate = new Date();
        $('#txtYear').val(myDate.getFullYear());

        var preMonth = myDate.getMonth(); //上個月
        if (preMonth < 10) {
            preMonth = "0" + preMonth;
        }

        var myMonth = myDate.getMonth() + 1; //當月
        if (myMonth < 10) {
            myMonth = "0" + myMonth;
        }

        var myDay = myDate.getDate();
        if (myDay < 10) {
            myDay = "0" + myDay;
        }

        return myDate.getFullYear() + "-" + myMonth + "-" + myDay

    }, //GetNowDate 返回當前的年月日

    //返回當前的年月日时分秒，格式為：2015-06-13 11:11:11
    GetNowDateTime:function()
    {
        var backTime = "";

        //日期初始化
        var myDate = new Date();
        $('#txtYear').val(myDate.getFullYear());

        var preMonth = myDate.getMonth(); //上個月
        if (preMonth < 10) {
            preMonth = "0" + preMonth;
        }

        var myMonth = myDate.getMonth() + 1; //當月
        if (myMonth < 10) {
            myMonth = "0" + myMonth;
        }

        var myDay = myDate.getDate();
        if (myDay < 10) {
            myDay = "0" + myDay;
        }

        var myHour = myDate.getHours();
        if (myHour < 10) {
            myHour = "0" + myHour;
        }

        var myMinutes = myDate.getMinutes();
        if (myMinutes < 10) {
            myMinutes = "0" + myMinutes;
        }

        var mySeconds = myDate.getSeconds();
        if (mySeconds < 10) {
            mySeconds = "0" + mySeconds;
        }

        backTime = myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + myHour + ":" + myMinutes + ":" + mySeconds;
        return backTime;

    }, //返回當前的年月日时分秒，格式為：2015-06-13 11:11:11

    //對返回的日期進行格式化處理
    GetStandardDateTime:function(myDate) {

        //日期初始化
        var myMonth = myDate.getMonth() + 1; //當月
        if (myMonth < 10) {
            myMonth = "0" + myMonth;
        }

        var myDay = myDate.getDate();
        if (myDay < 10) {
            myDay = "0" + myDay;
        }

        var hh = myDate.getHours(); //小时
        if (hh < 10) {
            hh = "0" + hh;
        }

        var mm = myDate.getMinutes(); //分钟
        if (mm < 10) {
            mm = "0" + mm;
        }

        var ss = myDate.getSeconds(); //秒钟
        if (ss < 10) {
            ss = "0" + ss;
        }

        return myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + hh + ":" + mm + ":" + ss;
    }, //GetStandardDateTime结束

    //将时间戳日期转化为标准的日期格式
    unix_to_datetime:function(unix,num) {
        //var now = new Date(parseInt(unix) * 1000);
        if(Util.ZjlNotIsNullOrEmpty(unix)&&unix!="null")
        {
            var now = new Date(parseInt(unix));
            var pLocaltime = DateMoudle.GetStandardDateTime(now);
            if(Util.ZjlNotIsNullOrEmpty(num))
            {
                pLocaltime = pLocaltime.substr(0,num);
            }
            return pLocaltime;
        }
        else
        {
            return "";
        }
    }, //unix_to_datetime

    //将标准时间转化为时间戳
    datetime_to_unix:function(datetime){
        var tmp_datetime = datetime.replace(/:/g,'-');
        tmp_datetime = tmp_datetime.replace(/ /g,'-');
        var arr = tmp_datetime.split("-");
        var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
        return parseInt(now.getTime()/1000);
    }, //datetime_to_unix结束

    //将标准时间转化为时间戳
    datetime_to_unix_format:function(datetime){
        var str = datetime;
        str = str.replace(/-/g,"/");
        var etablishFormat = new Date(str);
        return etablishFormat.getTime();
    }, //datetime_to_unix_format

    // 获取最近日期
    getBeforeDate:function(type,num){
        var type = type?type:"date";
        var num = parseInt(num)?parseInt(num):7;
        var now = new Date();
        if(type=="date"){
            now.setDate(now.getDate()-num+1);
            return DateMoudle.unix_to_datetime(now.getTime(),10);
        }else if(type=="month"){
            now.setDate(now.getDate()+1);
            now.setMonth(now.getMonth()-num);
            return DateMoudle.unix_to_datetime(now.getTime(),10);
        }else if(type=="year"){
            now.setDate(now.getDate()+1);
            now.setFullYear(now.getFullYear()-num);
            return DateMoudle.unix_to_datetime(now.getTime(),10);
        }
    },//getBeforeDate 获取最近日期

    //字符串型的日期转化为真实日期格式
    StrToDatetime : function(datetimeStr)
    {
        var date = eval('new Date(' + datetimeStr.replace(/\d+(?=-[^-]+$)/,
                function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        return date;
    }, //StrToDatetime 字符串型的日期转化为真实日期格式

    //给某个日期自动加上多少天
    DataTimeAddDays : function(datetimeStr,adddays,fmt)
    {
        var newDate = DateMoudle.StrToDatetime(datetimeStr);
        newDate.setDate(newDate.getDate()+adddays);
        var newDateStr =  DateMoudle.GetStandardDateTime(newDate,fmt);
        return newDateStr;
    },//DataTimeAddDays 给某个日期自动加上多少天

    //二个日期相减，得到天数差，不考虑时分秒
    DateSubtractDays:function(sDate,eDate)
    {
        sDate = this.FormatShowDate(sDate,10);
        eDate = this.FormatShowDate(eDate,10);
        var sArr = sDate.split("-");
        var eArr = eDate.split("-");
        var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
        var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
        var days = (eRDate-sRDate)/(24*60*60*1000);
        return days;
    },//DateSubtractDays 二个日期相减，得到天数差

}



/*获取地址栏变更的值，会区分大小写*/
function GetUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/*获取地址栏变更的值，会进行URI解码，用于获取中文参数值*/
function GetDecodeUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURIComponent(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

 /*获取地址栏Hash值，会区分变量名的大小写*/
function  GetUrlParamByHash(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var url = window.location.href;
    var r= null;
    if(url.indexOf("#")){
        url = url.substring(url.lastIndexOf("#")+1,url.length);
        r = url.match(reg);
    }
    if (r != null) return unescape(r[2]);
    return null;
 };

//手机号码的正则表达式验证，正确则返回0，否则返回1
function checkMobileRegular(str) {
    // var re = /^1\d{10}$/;
    var re = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
    var backNum = 1;
    if (re.test(str)) {
        backNum = 0;
    }
    return backNum;
}

//电话号码 的正则表达式验证 ，正确则返回0，否则返回1
function checkPhoneRegular(str) {
    var re =/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/g;
    var backNum = 1;
    if (re.test(str)) {
        backNum = 0;
    }
    return backNum;
}

//Email 的正则表达式验证 ，正确则返回0，否则返回1
function checkEmailRegular(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    var backNum = 1;
    if (re.test(str)) {
        backNum = 0;
    }
    return backNum;
}

//正整数 的正则表达式验证 ，正确则返回true，否则返回false
function checkPositiveIntRegular(password) {
    // var idPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    var idPassword = /^\+?[1-9][0-9]*$/;
    return idPassword.test(password);
}

//密码 的正则表达式验证 ，正确则返回true，否则返回false （密码只能为6~20位的任意非空字符）
function checkPasswordRegular(password) {
    // var idPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    var idPassword = /^[\S]{6,20}$/;
    return idPassword.test(password);
}

//身份证号码 的简单正则验证 ，正确则返回true，否则返回false （15位或18位数字，18位时最后一位可以为字母）
function checkIDCardRegular(card) {
    var idCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return idCard.test(card);
}
// 身份证号码特殊字符验证 ，正确则返回true，否则返回false
function checkIdValidStr(card){
    var idCard = /^[a-zA-Z0-9\_\-\(\)]+$/;
    return idCard.test(card);
}
// 一、二代身份证验证 (15和18位) ，正确则返回true，否则返回false
function validateFirIdCard(g) {
    var f = 0;
    var a;
    var e = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙",
        21: "辽宁",
        22: "吉林",
        23: "黑龙",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    if (g.length == 15) {
        a = idCardUpdate(g)
    } else {
        a = g
    }
    if (!/^\d{17}(\d|x)$/i.test(a)) {
        return false
    }
    a = a.replace(/x$/i, "a");
    if (e[parseInt(a.substr(0, 2))] == null) {
        return false
    }
    var c = a.substr(6, 4) + "-" + Number(a.substr(10, 2)) + "-" + Number(a.substr(12, 2));
    var h = new Date(c.replace(/-/g, "/"));
    if (c != (h.getFullYear() + "-" + (h.getMonth() + 1) + "-" + h.getDate())) {
        return false
    }
    for (var b = 17; b >= 0; b--) {
        f += (Math.pow(2, b) % 11) * parseInt(a.charAt(17 - b), 11)
    }
    if (f % 11 != 1) {
        return false
    }
    return true
}
// 15位身份证号码转为18位
function idCardUpdate(g) {
    var b;
    var f = /^(\d){15}$/;
    if (f.test(g)) {
        var e = 0;
        var a = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var d = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
        g = g.substr(0, 6) + "19" + g.substr(6, g.length - 6);
        for (var c = 0; c < g.length; c++) {
            e += parseInt(g.substr(c, 1)) * a[c]
        }
        g += d[e % 11];
        b = g
    } else {
        b = "#"
    }
    return b
}
// 二代身份证验证 (18位) ，正确则返回true，否则返回false
function validateSecIdCard(g) {
    var f = 0;
    var a = g;
    var e = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙",
        21: "辽宁",
        22: "吉林",
        23: "黑龙",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    if (!/^\d{17}(\d|x)$/i.test(a)) {
        return false
    }
    a = a.replace(/x$/i, "a");
    if (e[parseInt(a.substr(0, 2))] == null) {
        return false
    }
    var c = a.substr(6, 4) + "-" + Number(a.substr(10, 2)) + "-" + Number(a.substr(12, 2));
    var h = new Date(c.replace(/-/g, "/"));
    if (c != (h.getFullYear() + "-" + (h.getMonth() + 1) + "-" + h.getDate())) {
        return false
    }
    for (var b = 17; b >= 0; b--) {
        f += (Math.pow(2, b) % 11) * parseInt(a.charAt(17 - b), 11)
    }
    if (f % 11 != 1) {
        return false
    }
    return true
}
// 根据身份证号码获取性别 返回：0-女 1-男 false-无效的身份证号码
function getSexByCardId(i){
    var g = null;
    if (i.length == 15) {
        g = i.substring(14, 15)
    } else {
        if (i.length == 18) {
            g = i.substring(16, 17)
        } else {
            return false
        }
    }
    if (g == "x" || g == "X") {
        g = "10"
    }
    var f = parseInt(g);
    var j = f % 2;
    return j;
}
// 根据身份证号码验证性别 0-女 1-男，正确返回true，错误false
function checkSexByCardId(c, d) {
    function b(h, i) {
        var g = null;
        if (i.length == 15) {
            g = i.substring(14, 15)
        } else {
            if (i.length == 18) {
                g = i.substring(16, 17)
            } else {
                return true
            }
        }
        if (g == "x" || g == "X") {
            g = "10"
        }
        var f = parseInt(g);
        var j = f % 2;
        if (j === 0 && h === "0") {
            return true
        } else {
            if (j === 1 && h === "1") {
                return true
            } else {
                return false
            }
        }
    }
    if (validateFirIdCard(d)) {
        if (d !== "") {
            return b(c, d)
        } else {
            return true
        }
    } else {
        return true
    }

}
// 根据身份证号码获取出生日期，type存在时返回带格式的日期，如：1970-01-01，否则返回：19700101
function GetBirdDateByCardId(d,type) {
    if (d.length == 15) {
        a = "19" + d.substring(6, 12)
    } else if (d.length == 18) {
        a = d.substring(6, 14)
    }else{
        return false;
    }
    if(type){
        var c = a;
        a = c.substring(0,4)+"-";
        a += c.substring(4,6)+"-";
        a += c.substring(6,8);
    }
    return a;
}
// 根据身份证号码验证出生日期，正确返回true，错误false
function checkBirdDateByCardId(c, d) {
    var a = null;
    if (d !== "" && validateFirIdCard(d)) {
        if (d.length == 15) {
            a = "19" + d.substring(6, 12)
        } else {
            if (d.length == 18) {
                a = d.substring(6, 14)
            }
        }
    } else {
        return false
    }
    if (c !== "") {
        c = c.replace(/-/g, "");
        c = c.replace(/\//g, "");
        if (c != a) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}


//组织机构代码 的正则表达式验证 ，正确则返回true，否则返回false
function checkOrganizationCodeRegular(card) {
    var organizationCode  = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]/;
    var isTrue = organizationCode.test(card);
    if(isTrue == false)
    {
        var organizationCode2  = /^[a-zA-Z0-9]{18}/;
        isTrue = organizationCode2.test(card);
    }
    return isTrue;
}

/** 判断浏览器是否支持placeholder */
function isPlaceholer() {
    var input = document.createElement('input');
    return "placeholder" in input;
}

//Js的Hashtable
function HashTable() {

    this.ObjArr = {};

    this.Count = 0;

    //添加
    this.Add = function (key, value) {
        if (this.ObjArr.hasOwnProperty(key)) {
            return false; //如果键已经存在，不添加
        }
        else {
            this.ObjArr[key] = value;
            this.Count++;
            return true;
        }
    }

    //是否包含某项
    this.Contains = function (key) {
        return this.ObjArr.hasOwnProperty(key);
    }

    //取某一项 其实等价于this.ObjArr[key]
    this.GetValue = function (key) {
        if (this.Contains(key)) {
            return this.ObjArr[key];
        }
        else {
            return "";
        }
    }

    //移除
    this.Remove = function (key) {
        if (this.Contains(key)) {
            delete this.ObjArr[key];
            this.Count--;
        }
    }

    //清空
    this.Clear = function () {
        this.ObjArr = {};
        this.Count = 0;
    }
}

//不为Null并且不为空
function ZjlNotIsNullOrEmpty(str) {
    var returnStr = false;
    if (str != undefined && str != "undefined" && str != null && str != "null" && str != "") {
        returnStr = true;
    }
    return returnStr;
}

//给url增加一个域名地址
function Addzjl_platform_domain(urlStr) {
    if (urlStr != null && urlStr != "" && (urlStr.indexOf("http://") < 0 && urlStr.indexOf("https://") < 0)) {
        urlStr = zjl_platform_domain + urlStr;
    }
    return urlStr;
}


//给url增加一个随机变量参数
function AddRandomParam(urlStr) {
    if (urlStr != null && urlStr != "") {
        if (urlStr.indexOf("?") > 0) {
            urlStr += "&random=" + Math.random();
        }
        else {
            urlStr += "?random=" + Math.random();
        }
    }
    return urlStr;
}

//单纯的用户的cookie退出，不含与服务端的交互
function UserQuitNoEachOther() {
    if(!window.isUserExit){
        var urlStr = window.location.toString();
        urlStr = encodeURIComponent(urlStr);
        $.removeCookie(zjl_platform_site_cookie, {path: "/"});
        $.removeCookie("zjlpersonalcounselor", {path: "/"});
        window.isUserExit = true;
        alertAndRedirect("对不起，您的登录状态已过期，请重新登录！","/user/login.html?returnurl=" + urlStr);
        //window.location.href = "/user/login.html";
    }
}

//生成随机数
function ZjlRandom(n) {
    return Math.floor(Math.random() * n + 1);
}

//點擊彈開的新窗會浮在頁面上，並且居于當前屏幕的中間，其中divName為要彈出的div的ID
function ShellWindowCenter(divName) {
    var top = ($(window).height() - $(divName).height()) / 2;
    var left = ($(window).width() - $(divName).width()) / 2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $(divName).css({position: 'absolute', 'top': top + scrollTop, left: left + scrollLeft}).show();
}

//調用方法，傳遞彈窗最外面的div的Id名稱和標題Div的Id名稱即可，如：onmousemove="dragWin('SetUserRights','SetUserRightsWinTitle')"
function dragWin(openWinId, titleId) {
    var IsMousedown, LeftX, TopY, OpenWinXY;

    document.getElementById(titleId).onmousedown = function (e) {
        OpenWinXY = document.getElementById(openWinId);
        IsMousedown = true;
        e = e || event;
        LeftX = e.clientX - parseInt(OpenWinXY.style.left);
        TopY = e.clientY - parseInt(OpenWinXY.style.top);

        document.onmousemove = function (e) {
            e = e || event;
            if (IsMousedown) {
                OpenWinXY.style.left = e.clientX - LeftX + "px";
                OpenWinXY.style.top = e.clientY - TopY + "px";
            }
        }

        document.onmouseup = function () {
            IsMousedown = false;
        }
    }
}

//點擊關閉彈窗
function closeWHWin(obj) {
    $(obj).hide();
}


//获取区域内的所有控件的值，组成Json，valid属性用来判断（以后可以扩展到填写的内容是否符合格式）参数是否通过验证。
JClient.Object.getAreaParms = function getAreaParms(panel) {
    var valid = true; //是否通过验证
    var jsonresult = "{";
    var radiolist = panel.find('input[type="radio"]:checked')
    var inputlist = panel.find('input[type="text"]');
    var selectlist = panel.find('select');
    var textarealist = panel.find('textarea');
    $.each(radiolist, function (i, item) {
        jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim(item.value) + "\"" + ',';
    });
    $.each(inputlist, function (i, item) {
        if (item.required == 'required' && $(item).val() == '') {
            valid = false;
            alert(item.label + '必填！');
            return false;
        } else {
            jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim($(item).val()) + "\"" + ',';
        }
    });
    $.each(selectlist, function (i, item) {
        if (item.required == 'required' && $(item).val() == '') {
            valid = false;
            alert(item.label + '必填！');
            return false;
        } else {
            jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim($(item).val()) + "\"" + ',';
        }
    });
    $.each(textarealist, function (i, item) {
        if (item.required == 'required' && $(item).val() == '') {
            valid = false;
            alert(item.label + '必填！');
            return false;
        } else {
            jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim(item.value) + "\"" + ',';
        }
    });
    jsonresult += "\"valid\":" + valid + '}';
    return JsonStrToObject(jsonresult);
}

//格式化金额 ，money是金额，dotlength是小数点后保留的位数（会四舍五入）
JClient.Object.formatMoney=function(money,dotlength) {
    dotlength = dotlength > 0 && dotlength <= 20 ? dotlength : 2;
    money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(dotlength) + "";
    var s='';
    if(money.indexOf('-')==0){
        money=money.substr(1);
        s='-';
    }
    var l = money.split(".")[0].split("").reverse(),
        r = money.split(".")[1];
    t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return s+t.split("").reverse().join("") + "." + r;
};

//金额格式化，默认是读来的数据是分为单位的
function AmountCentFormat(centMoney,dotlength)
{
    var backMoney = 0;
    if(ZjlNotIsNullOrEmpty(centMoney))
    {
        centMoney = centMoney / 100;
        if(!ZjlNotIsNullOrEmpty(dotlength))
        {
            dotlength = 2;
        }
        backMoney = JClient.Object.formatMoney(centMoney,dotlength);
    }
    return backMoney;
}

//金额格式化，默认是读来的数据是分为单位的，默认带上货币符号
function AmountCentFormatWithSign(centMoney,dotlength)
{
    var backMoney = 0;
    backMoney = "¥ " + this.AmountCentFormat(centMoney,dotlength);
    return backMoney;
}

//金额格式化，默认是读来的数据是元为单位的，并且默认加上货币符号
function AmountYuanFormat(yuanMoney,dotlength)
{
    var backMoney = 0;
    if(ZjlNotIsNullOrEmpty(yuanMoney))
    {
        if(yuanMoney > 0)
        {
            if(!ZjlNotIsNullOrEmpty(dotlength))
            {
                dotlength = 2;
            }
            backMoney = JClient.Object.formatMoney(yuanMoney,dotlength);
        }
    }
    backMoney = "¥ " + backMoney;
    return backMoney;
}




/**参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
JClient.Object.cutString=function(str, len) {
    //length属性读出来的汉字长度为1
    if(str.length*2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
}


// 日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//Date.prototype.Format = function (fmt){
//    var o = {
//        "M+": this.getMonth() + 1, //月份
//        "d+": this.getDate(), //日
//        "h+": this.getHours(), //小时
//        "m+": this.getMinutes(), //分
//        "s+": this.getSeconds(), //秒
//        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//        "S": this.getMilliseconds() //毫秒
//    };
//    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//    for (var k in o)
//        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//    return fmt;
//}

//對返回的日期進行格式化處理
function GetStandardDateTime(myDate,fmt) {

    //日期初始化

    var myMonth = myDate.getMonth() + 1; //當月
    if (myMonth < 10) {
        myMonth = "0" + myMonth;
    }

    var myDay = myDate.getDate();
    if (myDay < 10) {
        myDay = "0" + myDay;
    }

    var hh = myDate.getHours(); //小时
    if (hh < 10) {
        hh = "0" + hh;
    }

    var mm = myDate.getMinutes(); //分钟
    if (mm < 10) {
        mm = "0" + mm;
    }

    var ss = myDate.getSeconds(); //秒钟
    if (ss < 10) {
        ss = "0" + ss;
    }

    var backDateStr = myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + hh + ":" + mm + ":" + ss;
    if(ZjlNotIsNullOrEmpty(fmt))
    {
        switch(fmt)
        {
            case "yyyy":
                backDateStr=myDate.getFullYear();
                break;

            case "yyyy-MM":
                backDateStr=myDate.getFullYear() + "-" + myMonth;
                break;

            case "yyyy-MM-dd":
                backDateStr=myDate.getFullYear() + "-" + myMonth + "-" + myDay;
                break;

            case "yyyy-MM-dd HH":
                backDateStr=myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + hh;
                break;

            case "yyyy-MM-dd HH:mm":
                backDateStr=myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + hh + ":" + mm;
                break;

            case "yyyy-MM-dd HH:mm:ss":
                backDateStr=myDate.getFullYear() + "-" + myMonth + "-" + myDay + " " + hh + ":" + mm + ":" + ss;
                break;

            default:break;
        }
    }
    return backDateStr;
}

//字符串型的日期转化为真实日期格式
function StrToDatetime(datetimeStr)
{
    var date = eval('new Date(' + datetimeStr.replace(/\d+(?=-[^-]+$)/,
            function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

//给某个日期自动加上多少天
function DataTimeAddDays(datetimeStr,adddays,fmt)
{
    var newDate = StrToDatetime(datetimeStr);
    newDate.setDate(newDate.getDate()+adddays);
    var newDateStr =  GetStandardDateTime(newDate,fmt);
    return newDateStr;
}

//将时间戳日期转化为标准的日期格式,可以传入标准日期格式
function FormatShowDate(time,num) {
        var num = num?num:10;
        var result = "";
        if(!time||time=="null"){
            return result;
        }else{
            time = String(time);
        }
        if(time.indexOf("-")!=-1||time.indexOf("/")!=-1){
            time = time.replace(/-/g,"/");
            var timestr = new Date(time).getTime();
            result = unix_to_datetime(timestr,num);
        }else{
            result = unix_to_datetime(time,num);
        }
        return result;
    }

//将时间戳日期转化为标准的日期格式
function unix_to_datetime(unix,num) {
    //var now = new Date(parseInt(unix) * 1000);
    if(ZjlNotIsNullOrEmpty(unix)&&unix!="null")
    {
        var now = new Date(parseInt(unix));
        var pLocaltime = GetStandardDateTime(now);
        if(ZjlNotIsNullOrEmpty(num))
        {
            pLocaltime = pLocaltime.substr(0,num);
        }
        return pLocaltime;
    }
    else
    {
        return "";
    }
}


//将标准时间转化为时间戳
function datetime_to_unix(datetime){
    var tmp_datetime = datetime.replace(/:/g,'-');
    tmp_datetime = tmp_datetime.replace(/ /g,'-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return parseInt(now.getTime()/1000);
}

//将标准时间转化为时间戳
function datetime_to_unix_format(datetime){
    var str = datetime;
    str = str.replace(/-/g,"/");
    var etablishFormat = new Date(str);
    return etablishFormat.getTime();
}


// 页面滚动到指定元素，入参为元素对象
function mScroll(obj,top){
    var top = top?top:0;
    // alert($(obj).offset().top+top);
    window.scroll(0,$(obj).offset().top+top);
    // $("html,body").stop(true).animate({scrollTop: $(obj).offset().top}, 300);
}

//将某块区域内的所有表单置为disabled
function ChangeFormControlReadonly(formObj,boolParam)
{
    var inputlist = formObj.find("input")
    var selectlist = formObj.find("select");
    var textarealist = formObj.find("textarea");

    $.each(inputlist, function () {
        if(boolParam == true)
        {
            $(this).prop("disabled","disabled");
            $(this).addClass("disabled");
        }
        else
        {
            $(this).removeProp("disabled");
            $(this).removeClass("disabled");
        }
    });

    $.each(selectlist, function () {
        if(boolParam == true)
        {
            $(this).prop("disabled","disabled");
            $(this).addClass("disabled");
        }
        else
        {
            $(this).removeProp("disabled");
            $(this).removeClass("disabled");
        }
    });

    $.each(textarealist, function () {
        if(boolParam == true)
        {
            $(this).prop("disabled","disabled");
            $(this).addClass("disabled");
        }
        else
        {
            $(this).removeProp("disabled");
            $(this).removeClass("disabled");
        }
    });
}
//清除某一区域的输入内容
function clearnForm(formObj) {
    var inputlist = formObj.find('input[type="text"]');
    var selectlist = formObj.find("select");
    $.each(inputlist, function() {
        if (!$(this).attr('disabled'))
            $(this).val('')
    });
    $.each(selectlist, function() {
        $(this).val('')
    });
}

// 获取验证码按钮倒计时
function countdownSendCode(obj,time,txt){
    var obj = $(obj);
    if(!obj){
        return false;
    }
    var time = time?time:60;
    var txt = txt?txt:"重新获取";
    obj.addClass("disabled").text(time+"s后"+txt);
    function change(){
        time--;
        obj.text(time+"s后"+txt);
        if(time==0){
            obj.removeClass("disabled").text(txt);
            clearInterval(siv);
        }
    }
    var siv = setInterval(change,1000);
    return siv;
};

// 一段时间后自动关闭指定元素
function timeOutClose(obj,time){
    var obj = $(obj);
    if(!obj){
        return false;
    }
    var time = time?time:2;
    function change(){
        time--;
        if(time==0){
            clearInterval(siv);
            obj.fadeOut();
        }
    }
    var siv = setInterval(change,1000)
};

// 指定容器属性autoFocus=true的元素自动获取焦点
function autoFocus(obj){
    var obj = $(obj);
    if(!obj){
        obj = $("body");
    }
   obj.find("[autofocus='true']").focus();
};

var wAlert = window.alert;
//重写alert弹窗
var alert = function(msg,titleStr,alertType,callback)
{
    //alertType,1为alert,2为confirm,3为dialog，如果未传值，默认为1
    var alertType = alertType?alertType:1;
    var ansyc = (typeof callback === "function");
    var param = {title: "温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};

    param.content = msg+" ";
    if(alertType==1){
        param.time = 2;
        if(ansyc){
            param.close = callback;
        }
    }else if(alertType==2||alertType==3){
        param.lock = true;
        param.padding = '40px 30px 45px 30px';
        if(ansyc){
            param.ok = callback;
        }
        param.cancel = true;
    }

    if(titleStr){
        param.title = titleStr;
    }
    if(!param.title){
        param.content += '<style>.ui_header{display:none!important}</style>';
    }
    if(param.time){
        param.time = param.time>=1000?param.time/1000:param.time;
        var proId = Math.ceil(Math.random()*1000);
        param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后自动关闭</span>';
        param.init=function(){
            var time = param.time;
            var obj = $('#absolutePro-'+proId);
            function change(){
                time--;
                obj.html(time+"s后自动关闭");
                if(time==0){
                    clearInterval(siv);
                }
            }
            var siv = setInterval(change,1000)
        }
    }
    $.dialog(param);
}

// 提示确认后或一定时间后刷新页面
function reloadPage(intoparam,callback,time){
    var param = {title:"温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};
    param.content = intoparam+" ";
    param.time = time?time:2;
    if((typeof callback === "function")){
        param.close = callback;
    }else{
        param.time = Number(callback)?Number(callback):2;
        param.close = function(){
            location.reload();
        };
    }
    if(!param.title){
        param.content += '<style>.ui_header{display:none!important}</style>';
    }
    if(param.time){
        param.time = param.time>=1000?param.time/1000:param.time;
        param.time = param.time>=1000?param.time/1000:param.time;
        var proId = Math.ceil(Math.random()*1000);
        var countTxt = param.countTxt?param.countTxt:"自动刷新";
        param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
        param.init=function(){
            var time = param.time;
            var obj = $('#absolutePro-'+proId);
            function change(){
                time--;
                obj.html(time+'s后'+countTxt);
                if(time==0){
                    clearInterval(siv);
                }
            }
            var siv = setInterval(change,1000)
        }
    }
    $.dialog(param);
}

// 自定义info弹窗
var _info = function(intoparam,time,callback){
    var param = {};
    if(typeof(intoparam) === "object"){
        param.content = intoparam.msg+" ";
    }else{
        param.content = intoparam+" ";;
    }
    if(typeof callback === "function"){
        param.callback = callback;
    }
    if(typeof time === "function"){
        param.callback = time;
    }else if(parseInt(time)||time==0){
        param.time = time>1000?time/1000:time;
    }
    $.info(param);
};

// 自定义alert弹窗
var _alert = function(intoparam,callback,time){
    var param = {title:"温馨提示",fixed:true,min:false,max:false,top:"30%",skin:"default-min",padding:'40px 30px 60px 30px'};
    if((typeof callback === "function")){
        param.close = callback;
        param.time = Number(time)?Number(time):2;
    }else{
        param.time = Number(callback)?Number(callback):2;
    }
    if(typeof(intoparam) === "object"){
        param.content = intoparam.msg+" ";
        if(Number(intoparam.time)){
            param.time = intoparam.time;
        }
        if(intoparam.type=="success"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/success.png" class="ui_icon_bg">'+param.content;
        }else if(intoparam.type=="error"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/error.png" class="ui_icon_bg">'+param.content;
        }else if(intoparam.type=="warning"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/warning.png" class="ui_icon_bg">'+param.content;
        }
        param = $.extend(param, intoparam);
    }else{
        param.content = intoparam+" ";;
    }
    if(!param.title){
        param.content += '<style>.ui_header{display:none!important}</style>';
    }
    if(param.time){
        param.time = param.time>=1000?param.time/1000:param.time;
        var proId = Math.ceil(Math.random()*1000);
        var countTxt = param.countTxt?param.countTxt:"自动关闭";
        param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
        param.init=function(){
            var time = param.time;
            var obj = $('#absolutePro-'+proId);
            function change(){
                time--;
                obj.html(time+"s后"+countTxt);
                if(time==0){
                    clearInterval(siv);
                }
            }
            var siv = setInterval(change,1000)
        }
    }
    $.dialog(param);
};
// 自定义confirm弹窗
var _confirm = function(intoparam,callback,cancelcallback){
    var param = {title: "温馨提示",lock:true,background:'#000',opacity: 0.3,fixed:true,esc:false,min:false,max:false,skin:"default-min",padding:'40px 30px 45px 30px'};
    if((typeof callback === "function")){
        param.ok = callback;
    }
    if((typeof cancelcallback === "function")){
        param.cancel = cancelcallback;
    }else{
        param.cancel = function(){}
    }
    if(typeof(intoparam) === "object"){
        param.content = intoparam.msg+" ";;
        if(intoparam.type=="success"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/success.png" class="ui_icon_bg">'+param.content;
        }else if(intoparam.type=="error"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/error.png" class="ui_icon_bg">'+param.content;
        }else if(intoparam.type=="warning"){
            param.content = '<img src="/plugin/lhgdialog/skins/icons/warning.png" class="ui_icon_bg">'+param.content;
        }
        param = $.extend(param, intoparam);
    }else{
        param.content = intoparam+" ";;
    }
    $.dialog(param);
};

//弹窗并跳转到指定页面
function alertAndRedirect(msg,urlStr,titleStr,times)
{
    // if(!ZjlNotIsNullOrEmpty(titleStr))
    // {
    //     titleStr = "温馨提示";
    // }
    // $.dialog({
    //     lock:true,
    //     title: titleStr,
    //     content: msg,
    //     time:2,
    //     content: msg + "<br><span class='closetime'>2s后会跳转到指定的页面</span>",
    //     time: 2,
    //     close: function(){window.location.href = urlStr;}
    // });
    var param = {title: "温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};
    param.content = msg+" ";;
    param.time = times?times:2;
    if(Number(titleStr)){
        param.time = Number(titleStr);
    }else if(titleStr){
        param.title = titleStr;
    }
    if(!param.title){
        param.content += '<style>.ui_header{display:none!important}</style>';
    }
    if(urlStr){
        param.close = function(){window.location.href = urlStr;}
    }
    if(param.time){
        param.time = param.time>=1000?param.time/1000:param.time;
        var proId = Math.ceil(Math.random()*1000);
        var countTxt = param.countTxt?param.countTxt:"自动跳转";
        param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
        param.init=function(){
            var time = param.time;
            var obj = $('#absolutePro-'+proId);
            function change(){
                time--;
                obj.html(time+"s后"+countTxt);
                if(time==0){
                    clearInterval(siv);
                }
            }
            var siv = setInterval(change,1000)
        }
    }
    $.dialog(param);
}

//弹窗提示并自动关闭
function alertAndClose(msg,times,titleStr)
{
    var param = {title: "温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};

    param.content = msg+" ";;
    param.time = times?times:2;
    if(titleStr){
        param.title = titleStr;
    }
    if(!param.title){
        param.content += '<style>.ui_header{display:none!important}</style>';
    }
    if(param.time){
        param.time = param.time>=1000?param.time/1000:param.time;
        var proId = Math.ceil(Math.random()*1000);
        var countTxt = param.countTxt?param.countTxt:"自动关闭";
        param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
        param.init=function(){
            var time = param.time;
            var obj = $('#absolutePro-'+proId);
            function change(){
                time--;
                obj.html(time+"s后"+countTxt);
                if(time==0){
                    clearInterval(siv);
                }
            }
            var siv = setInterval(change,1000)
        }
    }
    $.dialog(param);

    // if(!ZjlNotIsNullOrEmpty(titleStr))
    // {
    //     titleStr = "温馨提示";
    // }
    // if(!ZjlNotIsNullOrEmpty(times))
    // {
    //     times = 2;
    // }
    // if(times >= 1000)
    // {
    //     times = times/1000;
    // }

    // $.dialog({
    //     lock:true,
    //     title: titleStr,
    //     content: msg + "<br><span class='closetime'>" + times + "s后会自动关闭</span>",
    //     time: times,
    // });
}

// 自动跳转到其他页面
function  toOtherPage(url,obj,time){
    var stepEndObj = $(obj);
    var time = time?time:5;
    function change(){
        time--;
        stepEndObj.find(".time-txt span").text(time);
        if(time==0){
            clearInterval(siv);
            location.href = url;
        }
    }
    time++;
    change();
    var siv = setInterval(change,1000)
}

// 判断数组中是否存在某值
function array_index_of(arr,val){
    for(var i=0;i<arr.length;i++) {
        if(arr[i] == val){
            return parseInt(i);
        }
    }
    return -1;
}
// 对数组插入值，存在该值则不插入
function array_insert(arr, val){
    var index = array_index_of(arr, val);
    if(index == -1){
        arr.push(val);
        return arr;
    }
    return arr;
}
// 删除数组中某值,返回数组
function array_del(arr,val){
    var index = array_index_of(arr, val);
    if(index != -1){
        var a1 = arr.slice(0, index);
        var a2 = arr.slice(index + 1);
        return a1.concat(a2);
    }
    return arr;
}
//字符串转Acsii码，卖家注册链接加密使用
var StrToAcsii = function(str,type) {
    var changeStr = "";
    if(str){
        for(var i=0;i<str.length;i++){
            var step = 20;
            if(i%2==0){
                step = 60;
            }
            var code = (str.charAt(i)).charCodeAt();
            var str2 = String.fromCharCode(code);
            var str3 = "";
            if(type){
                str3 = String.fromCharCode(code-step);
            }else{
                str3 = String.fromCharCode(code+step);
            }
            changeStr += str3;
        }
    }
    return changeStr;
};
//Acsii码转字符串，卖家注册链接解密使用
var AcsiiToStr = function(str) {
    var changeStr = "";
    if(str){
        for(var i=0;i<str.length;i++){
            var step = 20;
            if(i%2==0){
                step = 60;
            }
            var code = (str.charAt(i)).charCodeAt();
            var str2 = String.fromCharCode(code);
            var str3 = String.fromCharCode(code-step);
            changeStr += str3;
        }
    }
    return changeStr;
};
//是否是数组对象
function isArray(arr){
    return arr ? Object.prototype.toString.call(arr) === '[object Array]' : false
    //return arr instanceof Array
}
// 二进制字符串转int
var binStrToInt = function(str){
    return parseInt(str, 2);
};
// int转二进制字符串
var intToBinStr = function(num){
    return num.toString(2);
};
// 字符串添加到指定长度，长度不够在前面加0
var toLengthChar = function(str,num){
    var num = num?num:10;
    for (var i = str.length ; i<num; i++) {
        str = "0"+str;
    };
    return str;
};
// 整数数字添加到指定长度，长度不够在前面加0,length不能小于数字位数
function prefixInteger(num, length) {
    var num = Number(num);
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
}
// 字符串反转
var translateStr = function(str){
    var result = "";
    for (var i = str.length - 1; i >= 0; i--) {
        result += str.charAt(i);
    };
    // result = str.split("").reverse().join("");
    return result;
};
//判断文件是否为图片jpg、jpeg、gif、png、bmp
var checkPicType = function(picname){
    var photoEx=picname.substring(picname.lastIndexOf("."));
    photoEx = photoEx.toLocaleLowerCase();
    if(photoEx==".jpg"||photoEx==".png" || photoEx==".jpeg"||photoEx==".gif"||photoEx==".bmp"){
        return true;
    }else{
        return false;
    }
};

//判断文件是否为PDF文档
var checkPDFType = function(filename){
    var fileEx=filename.substring(filename.lastIndexOf("."));
    fileEx = fileEx.toLocaleLowerCase();
    if(fileEx==".pdf"){
        return true;
    }else{
        return false;
    }
};

//将某块区域内的所有表单的值置为空
function ClearFormControlValue(formObj)
{
    var inputlist = formObj.find("input:text");
    var radiolist = formObj.find("input:radio");
    var checkboxlist = formObj.find("input:checkbox");
    var selectlist = formObj.find("select");
    var textarealist = formObj.find("textarea");

    $.each(inputlist, function () {
        $(this).val(""); //清空文本框
    });

    $.each(selectlist, function () {
        $(this).val(""); //清空下拉框
    });

    $.each(textarealist, function () {
        $(this).val(""); //清空多行文本框
    });

    $.each(radiolist, function () {
        $(this).removeProp("checked");
    });

    $.each(checkboxlist, function () {
        $(this).removeProp("checked");
    });
}

//js新窗口打开一个页面
function OpenWinRedirect(url) {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//头部专利搜索按钮
function InputClickMainTop() {
    var pInputText = $.trim($("#keyTextTop").val());
    var mobileText = $.trim($("#mobileTextTop").val());
    var submitB = true;
    var mobileB = false;
    var proTxt = '';
    var $boxObj = $('.patentCSearchBox');
    if($boxObj.hasClass('noLogin')){ // 未登录搜索需要校验手机号码
        if (pInputText == "") {
            proTxt = '请输入搜索关键词'
            submitB = false;
        }else if (mobileText == "") {
            proTxt = '请输入手机号码'
            submitB = false;
        }else if (checkMobileRegular(mobileText) == 1) {
            proTxt = '手机号码格式不正确'
            submitB = false;
        }
        mobileB = true;
    }else{
        if (pInputText == "") {
            proTxt = '请输入搜索关键词'
            submitB = false;
        }
    }
    if (!submitB) {
        alert(proTxt);
        return;
    }
    else {
        //var usrStr = "/patentcloud/search.jsp?q=" + pInputText;
        if(pInputText.length > 3)
        {
            var preTwo = pInputText.substr(0,2);//前二个字符
            if(preTwo == "ZL" || preTwo == "zl")
            {
                var threeWord = pInputText.substr(2,1);//第三个字符
                if(!isNaN(threeWord))
                {
                    //如果第三个字符是数字
                    pInputText = pInputText.substr(2,pInputText.length-2); //直接将首二字母ZL过滤掉
                }
            }

            var lastOne = pInputText.substr(pInputText.length-1,1);//最后一个字符
            if(lastOne == "Y" || lastOne == "y" || lastOne == "A" || lastOne == "a" || lastOne == "B" || lastOne == "b")
            {
                var lastSecond = pInputText.substr(pInputText.length-2,1);//倒数第二个字符
                if(!isNaN(lastSecond))
                {
                    //如果倒数第二个字符字符是数字
                    pInputText = pInputText.substr(0,pInputText.length-1); //直接将首二字母ZL过滤掉
                }
            }
        }
        var jsonParam = {};
        var jsonDataParam = {};
        //var urlStr = "https://www.patentcloud.com.cn/search.jsp?q=" + pInputText;
        //var urlStr = "https://www.airpatent.com.cn/search/result?mode=quick&texts=" + pInputText;
        var urlStr = "https://www.airpatent.com.cn/search/result?mode=expression&query=%20SQR:(" + pInputText + ")%20or%20SQH:(" + pInputText + ")%20or%20SMS:(" + pInputText + ")";
        var token = UserLocal.token();
        var pageUrl = zjl_platform_domain+"/platform/patent/record/add?keywords=" + encodeURIComponent(pInputText);
        jsonDataParam.keywords = pInputText;
        if(mobileB){
            pageUrl += "&searchMobile=" + mobileText;
            jsonDataParam.searchMobile = mobileText;
        }
        if(token){
            pageUrl += "&token=" + token;
            jsonDataParam.token = token;
        }
        pageUrl = AddRandomParam(pageUrl);//给url参数增加一个随机变量

        jsonParam.data = jsonDataParam;
        jsonParam.url = "/platform/patent/record/add";
        jsonParam.token = token;
        ZjlAjaxJson.GetJsonData(jsonParam,function(){
            //提交检索需求记录至数据库中
        });
        //$.ajax({
        //    type: "GET",
        //    async: true, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
        //    cache:false, //缓存，置为false，不缓存
        //    url: pageUrl,
        //    dataType: "json",
        //    timeout: 60000,
        //    success: function(jsonData){
        //    },
        //    error: function(){
        //    }
        //});
        OpenWinRedirect(urlStr);
    }
}

//头部商标搜索按钮
function InputClickBrandMainTop() {
    var searchStr = $.trim($("#keyTextTopBrand").val());
    if(Util.ZjlNotIsNullOrEmpty(searchStr))
    {
        var token = UserLocal.token();
        if(Util.ZjlNotIsNullOrEmpty(token))
        {
            location.href = "/shangbiao/search/index.html?search=" + searchStr;
        }
        else
        {
            LoginDialog.show(); // 未登录打开登录弹窗
            return false;
        }
    }
    else
    {
        AlertMoudle.ZjlInfo("请输入要搜索的内容！");
        return;
    }
}

//头部专利商标搜索菜单栏切换
function indexSearchMenuMain(className)
{
    $(".indexSearchMenuBox").find(".soMenu").each(function(i,elem){
        if($(elem).hasClass(className))
        {
            $(elem).addClass("active");
        }
        else
        {
            $(elem).removeClass("active");
        }
    });

    $(".indexSearchBox").find(".soForm").each(function(i,elem){
        if($(elem).attr("value") == className)
        {
            $(elem).show();
        }
        else
        {
            $(elem).hide();
        }
    });

}

//头部著作权查询登记
function InputClickCopyrightTop(){
    var param={};
    param.customerName='游客';
    param.title=$('#keyTextTop').val();
    param.type='COPYRIGHT_MESSAGE';
    param.customerMobile=$('#mobileTop').val();
    if(!param.title){
        _alert('请填写标题');
        return;
    }
    if(!param.customerMobile){
        _alert('请填写联系电话');
        return;
    }else{
        var valid=/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test( param.customerMobile );
        if(!valid){
            _alert('请填写正确的手机号码');
            return;
        }


    }
    PcAjaxJson.GetJsonpJsonTokenPostData('/platform/consult/add',thisPage.token,param,function(data){
        if(data.code==0){
            _alert('著作权申请成功，自己来专家会尽快联系您，请您耐心等待。');
        }
        else{
            _alert(data.msg);
        }
    })
}

//头部专利搜索回车提交
function KeyTextTopClick() {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        InputClickMainTop();
    }
}

//头部商标搜索回车提交
function KeyTextTopBrandClick() {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        InputClickBrandMainTop();
    }
}

//头部著作权搜索回车提交
function KeyTextTopCopyrightClick() {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        InputClickCopyrightTop();
    }
}

// 自动替换@#@#"为"
function StrReplaceQuotes(str){
    if(str && typeof str == "string"){
        return str.replace(/@#@#/g, "\"");
    }else{
        return str;
    }
}

// 自动替换换行符为<br>
function StrReplaceTab(str,double){
    if(str && typeof str == "string"){
        if(double){
            return str.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "<br><p class=line><\/p>");
        }else{
            return str.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "<br>");
            // return str.replace(/(\r\n)|\n|\r|(\\\r\\\n)|\\\n|\\\r\(\u0085)|(\u2028)|(\u2029)/g, "<br>");
        }

    }else{
        return str;
    }
}
// 自动替换换行符为''
function StrMoveTab(str,double){
    if(str && typeof str == "string"){
        return str.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "");

    }else{
        return str;
    }
}

// 将多行文本框中的换行符替换为空
function StrReplaceTabToSpace(str){
    var backStr = str.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "");
    return backStr;
}

// 自动替换' "为\' \"
function StrReplaceQuote(str){
    str = str.replace(/\'/g, "\\'");
    // str = str.replace(/\"/g, '\\"');
    return str
}
// 自动替换,为，并去除空格
function StrReplaceAngleComma(str){
    str = str.replace(/,/g, "，");
    str = str.replace(/ /g, "");
    return str
}
// 自动替换<br>为换行符\r\n
function StrReplaceBr(str){
    return str.replace(/<br>/g, "\r\n");
}
// 把contentEditable编辑区的换行替换为<br>
function cleanContentEditableDiv(htmlString) {
    htmlString  = htmlString.replace(/>\[/gim,">");
    htmlString  = htmlString.replace(/\]</gim,"<");//去除中括号
    htmlString  = htmlString.replace(/<div><br>/gim,"<div>");
    htmlString  = htmlString.replace(/<p><br>|<p>&nbsp;/gim,"<p>");
    htmlString  = htmlString.replace(/<\/div>/gim,"");
    htmlString  = htmlString.replace(/<div>/gim,"<br>");
    htmlString  = htmlString.replace(/<\/p>/gim,"");
    htmlString  = htmlString.replace(/<p>/gim,"<br>");
    return htmlString;
}
// 去除html标签
function ClearHtmlTag(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str.value = str.replace(/[ | ]* /g,' '); //去除行尾空白
    str = str.replace(/ [\s| | ]* /g,' '); //去除多余空行
    return str;
}

function getBrowserInfo()
{
    var agent = navigator.userAgent.toLowerCase() ;

    var regStr_ie = /msie [\d.]+;/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;

    //IE，只适合IE10及以下版本
    if(agent.indexOf("msie") > 0)
    {
        var ieVersion = agent.match(regStr_ie).toString();
        ieVersion=ieVersion.replace(";","");
        return ieVersion;
    }

    //firefox
    if(agent.indexOf("firefox") > 0)
    {
        return agent.match(regStr_ff) ;
    }

    //Chrome
    if(agent.indexOf("chrome") > 0)
    {
        var ieVersionStr = agent.match(regStr_chrome).toString();
        return ieVersionStr;
    }

    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
    {
        return agent.match(regStr_saf) ;
    }

    //IE11及以上
    if(agent.indexOf(".net clr") > 0)
    {
        //在IE中，navigator.userAgent 不再包含msie字样了
        return "ie11";
    }

}

//判断是否安装了AdobeReader插件，判断效果不佳，好像没啥用
function isAcrobatPluginInstall() {
    var flag = false;
// 如果是firefox浏览器
    if (navigator.plugins && navigator.plugins.length) {
        for (x = 0; x < navigator.plugins.length; x++) {
            if (navigator.plugins[x].name == 'Adobe Acrobat')
                flag = true;
        }
    }
// 下面代码都是处理IE浏览器的情况
    else if (window.ActiveXObject) {
        for (x = 2; x < 10; x++) {
            try {
                oAcro = eval("new ActiveXObject('PDF.PdfCtrl." + x + "');");
                if (oAcro) {
                    flag = true;
                }
            } catch (e) {
                flag = false;
            }
        }
        try {
            oAcro4 = new ActiveXObject('PDF.PdfCtrl.1');
            if (oAcro4)
                flag = true;
        } catch (e) {
            flag = false;
        }
        try {
            oAcro7 = new ActiveXObject('AcroPDF.PDF.1');
            if (oAcro7)
                flag = true;
        } catch (e) {
            flag = false;
        }
    }
    //if (flag) {
    //    return true;
    //} else {
    //    alert("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
    //    location = 'http://ardownload.adobe.com/pub/adobe/reader/win/9.x/9.3/chs/AdbeRdr930_zh_CN.exe';
    //}
    return flag;
}

//表单相关的Js，如表单的验证，表单的重置，表单的统一非空判定等操作方法，start……
var FormMoudle =
{

    //手机号码 的正则表达式验证，正确则返回true，否则返回false
    isMobile:function(value){
        return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test( value );
    },

    //电话号码 的正则表达式验证，正确则返回true，否则返回false
    isTelphone:function(value){
        return /^0\d{2,3}-?\d{7,8}$/.test( value );
    },

    //Email 的正则表达式验证，正确则返回true，否则返回false
    isEmail:function(value){
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test( value );
    },

    //邮政编码 的正则表达式验证，正确则返回true，否则返回false
    isZipCode:function(value){
        return /^[1-9][0-9]{5}$/.test( value );
    },

    //密码 的正则表达式验证，正确则返回true，否则返回false （密码必须为包含字母和数字的组合，长度为8~12位）
    isPassword:function(value){
        return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test( value );
    },

    //获取区域内的所有控件的值，组成Json，valid属性用来判断（以后可以扩展到填写的内容是否符合格式）参数是否通过验证。
    getAreaParms:function getAreaParms(panel) {
        var valid = true; //是否通过验证
        var jsonresult = "{";
        var radiolist = panel.find('input[type="radio"]:checked')
        var inputlist = panel.find('input[type="text"]');
        var selectlist = panel.find('select');
        var textarealist = panel.find('textarea');
        $.each(radiolist, function (i, item) {
            jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim(item.value) + "\"" + ',';
        });
        $.each(inputlist, function (i, item) {
            if (item.required == 'required' && $(item).val() == '') {
                valid = false;
                alert(item.label + '必填！');
                return false;
            } else {
                jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim($(item).val()) + "\"" + ',';
            }
        });
        $.each(selectlist, function (i, item) {
            if (item.required == 'required' && $(item).val() == '') {
                valid = false;
                alert(item.label + '必填！');
                return false;
            } else {
                jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim($(item).val()) + "\"" + ',';
            }
        });
        $.each(textarealist, function (i, item) {
            if (item.required == 'required' && $(item).val() == '') {
                valid = false;
                alert(item.label + '必填！');
                return false;
            } else {
                jsonresult += "\"" + item.name + "\"" + ':' + "\"" + $.trim(item.value) + "\"" + ',';
            }
        });
        jsonresult += "\"valid\":" + valid + '}';
        return $.parseJSON(jsonresult);
    }, //getAreaParms结束

    //将某块区域内的所有表单置为disabled，
    //boolParam=true置为disabled，boolParam=false移除disabled，
    ChangeFormControlReadonly:function(formObj,boolParam)
    {
        var inputlist = formObj.find("input")
        var selectlist = formObj.find("select");
        var textarealist = formObj.find("textarea");

        $.each(inputlist, function () {
            if(boolParam == true)
            {
                $(this).prop("disabled","disabled");
                $(this).addClass("disabled");
            }
            else
            {
                $(this).removeProp("disabled");
                $(this).removeClass("disabled");
            }
        });

        $.each(selectlist, function () {
            if(boolParam == true)
            {
                $(this).prop("disabled","disabled");
                $(this).addClass("disabled");
            }
            else
            {
                $(this).removeProp("disabled");
                $(this).removeClass("disabled");
            }
        });

        $.each(textarealist, function () {
            if(boolParam == true)
            {
                $(this).prop("disabled","disabled");
                $(this).addClass("disabled");
            }
            else
            {
                $(this).removeProp("disabled");
                $(this).removeClass("disabled");
            }
        });
    }, //ChangeFormControlReadonly结束

    //获取验证码按钮倒计时
    countdownSendCode:function(obj,time,txt){
        var obj = $(obj);
        if(!obj){
            return false;
        }
        var time = time?time:60;
        var txt = txt?txt:"重新获取";
        obj.addClass("disabled").text(time+"s后重新获取");
        function change(){
            time--;
            obj.text(time+"s后重新获取");
            if(time==0){
                obj.removeClass("disabled").text(txt);
                clearInterval(siv);
            }
        }
        var siv = setInterval(change,1000)
    }, //countdownSendCode结束

    //指定容器属性autoFocus=true的元素自动获取焦点
    autoFocus:function(obj){
        var obj = $(obj);
        if(!obj){
            obj = $("body");
        }
        obj.find("[autofocus='true']").focus();
    }, //autoFocus

    //将某块区域内的所有表单的值置为空
    ClearFormControlValue:function(formObj)
    {
        var inputlist = formObj.find("input:text");
        var radiolist = formObj.find("input:radio");
        var checkboxlist = formObj.find("input:checkbox");
        var selectlist = formObj.find("select");
        var textarealist = formObj.find("textarea");

        $.each(inputlist, function () {
            $(this).val(""); //清空文本框
        });

        $.each(selectlist, function () {
            $(this).val(""); //清空下拉框
        });

        $.each(textarealist, function () {
            $(this).val(""); //清空多行文本框
        });

        $.each(radiolist, function () {
            $(this).removeProp("checked");
        });

        $.each(checkboxlist, function () {
            $(this).removeProp("checked");
        });
    }, //ClearFormControlValue结束

    // 获取某块区域内的所有表单值
    getFormParams:function(obj,nonull){
        var param = {};
        $(obj).find('input[type!=radio][type!=checkbox][type!=button][type!=submit][type!=reset],select,textarea').each(function(){
            $this = $(this);
            key = $this.attr('name');
            value = $.trim($this.val());
            key && (!nonull || value) && (param[key] = value);
            if($this.attr('submit-text')=='true'){
                param[key+'Text'] = $this.find("option:selected").text();
            }
        });
        $(obj).find('input[type=radio],input[type=checkbox]').each(function(){
            $this = $(this);
            if($this.prop('checked')){
                key = $this.attr('name');
                value = $.trim($this.val());
                key && (!nonull || value) && (param[key] = value);
            }
        });
        return param;
    },

    //字段长度判定，如果超出返回false，否则返回true
    isStrFieldLenOver:function(str,bigLen)
    {
        var backBool = true;
        var curLen = Util.getStrLength(str);
        if(curLen > bigLen)
        {
            backBool = false;
        }
        return backBool;
    },

    //枚举类的字段下拉数据自动生成
    GetEnumOptionList:function(enumArray,selectObj,spaceOption)
    {
        var optionlist = "";
        for(var index in enumArray)
        {
            var optionItem = "<option value='" + index + "'>" + enumArray[index] + "</option>";
            optionlist += optionItem;
        }

        if(Util.ZjlNotIsNullOrEmpty(spaceOption))
        {
            optionlist = "<option value=''>" + spaceOption + "</option>" + optionlist;
        }

        if(Util.ZjlNotIsNullOrEmpty(selectObj))
        {
            $(selectObj).html(optionlist);
        }
        else
        {
            return optionlist;
        }

    },//枚举类的字段下拉数据自动生成



}
//表单相关的Js，如表单的验证，表单的重置，表单的统一非空判定等操作方法，end……

// 弹窗相关Js start……
var AlertMoudle = {

    //提示弹窗，弹完后自动关闭
    ZjlInfo:function(intoparam,callback,time){
        var param = {title:"温馨提示",fixed:true,min:false,max:false,top:"30%",skin:"default-min",padding:'40px 30px 60px 30px'};
        if((typeof callback === "function")){
            param.close = callback;
            param.time = Number(time)?Number(time):3;
        }else{
            param.time = Number(callback)?Number(callback):3;
        }
        if(typeof(intoparam) === "object"){
            param.content = intoparam.msg+" ";
            if(Number(intoparam.time)){
                param.time = intoparam.time;
            }
            if(intoparam.type=="success"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/success.png" class="ui_icon_bg">'+param.content;
            }else if(intoparam.type=="error"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/error.png" class="ui_icon_bg">'+param.content;
            }else if(intoparam.type=="warning"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/warning.png" class="ui_icon_bg">'+param.content;
            }
            param = $.extend(param, intoparam);
        }else{
            param.content = intoparam+" ";
        }
        if(!param.title){
            param.content += '<style>.ui_header{display:none!important}</style>';
        }
        if(param.time){
            param.time = param.time>=1000?param.time/1000:param.time;
            var proId = Math.ceil(Math.random()*1000);
            var countTxt = param.countTxt?param.countTxt:"自动关闭";
            param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
            param.init=function(){
                var time = param.time;
                var obj = $('#absolutePro-'+proId);
                function change(){
                    time--;
                    obj.html(time+"s后"+countTxt);
                    if(time==0){
                        clearInterval(siv);
                    }
                }
                var siv = setInterval(change,1000)
            }
        }
        $.dialog(param);
    }, //ZjlInfo结束

    //提示确认弹窗
    ZjlConfirm:function(intoparam,callback,cancelcallback){
        // var async = (typeof callback === "function");
        var param = {title: "温馨提示",lock:true,fixed:true,esc:false,min:false,max:false,skin:"default-min",padding:'40px 30px 45px 30px'};
        if((typeof callback === "function")){
            param.ok = callback;
        }
        if((typeof cancelcallback === "function")){
            param.cancel = cancelcallback;
        }else{
            param.cancel = function(){};
        }
        if(typeof(intoparam) === "object"){
            param.content = intoparam.msg+" ";
            // if(intoparam.type=="success"){
            //     param.icon="success.png";
            // }else if(intoparam.type=="error"){
            //     param.icon="error.png";
            // }else if(intoparam.type=="warning"){
            //     param.icon="warning.png";
            // }
            if(intoparam.type=="success"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/success.png" class="ui_icon_bg">'+param.content;
            }else if(intoparam.type=="error"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/error.png" class="ui_icon_bg">'+param.content;
            }else if(intoparam.type=="warning"){
                param.content = '<img src="/plugin/lhgdialog/skins/icons/warning.png" class="ui_icon_bg">'+param.content;
            }
            param = $.extend(param, intoparam);
        }else{
            param.content = intoparam+" ";
        }
        $.dialog(param);
    }, //ZjlConfirm结束

    // 提示后一定时间刷新页面
    reloadPage:function(intoparam,callback,time){
        var param = {title:"温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};
        param.content = intoparam+" ";
        param.time = time?time:3;
        if((typeof callback === "function")){
            param.close = callback;
        }else{
            param.time = Number(callback)?Number(callback):2;
            param.close = function(){
                location.reload();
            };
        }
        if(!param.title){
            param.content += '<style>.ui_header{display:none!important}</style>';
        }
        if(param.time){
            param.time = param.time>=1000?param.time/1000:param.time;
            param.time = param.time>=1000?param.time/1000:param.time;
            var proId = Math.ceil(Math.random()*1000);
            var countTxt = param.countTxt?param.countTxt:"自动刷新";
            param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
            param.init=function(){
                var time = param.time;
                var obj = $('#absolutePro-'+proId);
                function change(){
                    time--;
                    obj.html(time+'s后'+countTxt);
                    if(time==0){
                        clearInterval(siv);
                    }
                }
                var siv = setInterval(change,1000)
            }
        }
        $.dialog(param);
    }, //reloadPage结束

    //弹窗并跳转到指定页面
    alertAndRedirect:function(msg,urlStr,titleStr,times){
        var param = {title: "温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};
        param.content = msg+" ";
        param.time = times?times:3;
        if(Number(titleStr)){
            param.time = Number(titleStr);
        }else if(titleStr){
            param.title = titleStr;
        }
        if(!param.title){
            param.content += '<style>.ui_header{display:none!important}</style>';
        }
        if(urlStr){
            param.close = function(){window.location.href = urlStr;}
        }
        if(param.time){
            param.time = param.time>=1000?param.time/1000:param.time;
            var proId = Math.ceil(Math.random()*1000);
            var countTxt = param.countTxt?param.countTxt:"自动跳转";
            param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
            param.init=function(){
                var time = param.time;
                var obj = $('#absolutePro-'+proId);
                function change(){
                    time--;
                    obj.html(time+"s后"+countTxt);
                    if(time==0){
                        clearInterval(siv);
                    }
                }
                var siv = setInterval(change,1000)
            }
        }
        $.dialog(param);
    }, //alertAndRedirect结束

    //弹窗提示并自动关闭
    alertAndClose:function(msg,times,titleStr){
        var param = {title: "温馨提示",lock:false,fixed:true,min:false,max:false,skin:"default-min",padding:'40px 30px 60px 30px'};
        param.content = msg+" ";
        param.time = times?times:3;
        if(titleStr){
            param.title = titleStr;
        }
        if(!param.title){
            param.content += '<style>.ui_header{display:none!important}</style>';
        }
        if(param.time){
            param.time = param.time>=1000?param.time/1000:param.time;
            var proId = Math.ceil(Math.random()*1000);
            var countTxt = param.countTxt?param.countTxt:"自动关闭";
            param.content += '<span class="absolutePro" id="absolutePro-'+proId+'">'+param.time+'s后'+countTxt+'</span>';
            param.init=function(){
                var time = param.time;
                var obj = $('#absolutePro-'+proId);
                function change(){
                    time--;
                    obj.html(time+"s后"+countTxt);
                    if(time==0){
                        clearInterval(siv);
                    }
                }
                var siv = setInterval(change,1000)
            }
        }
        $.dialog(param);
    }, //alertAndClose

}// 弹窗相关Js end

    //上传附件相关的公共方法
var UploadMoudle = {

    //上传按钮的初使化——单个文件上传，不含hostId
    uploadFileBtnInit : function(fileType,uploadBtnObj,viewFileLstObj,callback)
    {
        var that = this;
        var _token = UserLocal.token();
        var uploadFileBtn = new UploadFile({
            url : zjl_platform_domain_location +"/platform/attachment/upload",//文件上传url，必须
            data : {token:_token,type:fileType},//上传参数
            autoSubmit:true,//是否选择文件后自动上传，true是，false否，false的话可以用submit()方法手动提交。默认true
            dataType:"json",   //返回数据类型，默认json
            type:"post", //提交方式，默认post
            outTime:1800, //超时时间，默认60s
            //fileType:["pdf","doc","docx","xls","xlsx","jpg","jpeg","png","gif","bmp","xps","wps","dps","et"], //上传文件后缀限制
            //fileTypeErrorTxt:"文件格式不对",

            //上传成功后的回调函数，返回对应数据
            success: function(data) {
                if(data&&data.code==0){
                    var param = data.data;
                    if(typeof callback === "function"){
                        callback.call(null,param);
                    }
                    else
                    {
                        UploadMoudle.viewAttachmentFile(param,$(viewFileLstObj),true);
                    }
                }
            },
            //上传失败后的回调函数
            error: function() {

            },
            //文件按钮点击事件，返回true表示执行选择文件，false不执行
            click:function(){
                return true;
            },
            //上传前的事件，返回true表示执行上传，false不执行。返回文件名、文件预览路径(低版本浏览器暂不支持)
            beforeSend: function(data,src) {
                var result = true; //Util.checkPicType(data);
                if (result) {
                    return true;
                    //if (Util.ZjlNotIsNullOrEmpty($("#payFileList").html())) {
                    //    //如果不为空，说明里面已经有数据了，那么应该先删除的
                    //    AlertMoudle.ZjlInfo("只可上传一个文档，请先删除先前上传的");
                    //    return false;
                    //} else {
                    //    return true;
                    //}
                } else {
                    //AlertMoudle.ZjlInfo("请上传图片文档");
                    //return false;
                }
            },
            obj:$(uploadBtnObj)//绑定对象，不支持多个同时绑定
        });
    }, //UploadFileBtnInit 上传按钮的初使化

    //上传按钮的初使化——多个文件上传，含hostId
    uploadMultiFileBtnInit : function(fileType,hostId,uploadBtnObj,viewFileLstObj,callback,url,isMustLogin)
    {
        var that = this;
        var _token = UserLocal.token();

        if(!Util.ZjlNotIsNullOrEmpty(url))
        {
            url = "/platform/attachment/uploadFiles/with/hostid";
        }
        var uploadFileBtn = new UploadFile({
            url : zjl_platform_domain_location + url,//文件上传url，必须
            data : {token:_token,type:fileType,hostId:hostId},//上传参数
            autoSubmit:true,//是否选择文件后自动上传，true是，false否，false的话可以用submit()方法手动提交。默认true
            dataType:"json",   //返回数据类型，默认json
            type:"post", //提交方式，默认post
            outTime:1800, //超时时间，默认60s
            //fileType:["pdf","doc","docx","xls","xlsx","jpg","jpeg","png","gif","bmp","xps","wps","dps","et"], //上传文件后缀限制
            //fileTypeErrorTxt:"文件格式不对",

            //上传成功后的回调函数，返回对应数据
            success: function(data) {
                if(data&&data.code==0){
                    var param = data.data;
                    if(typeof callback === "function"){
                        callback.call(null,param);
                    }
                    else
                    {
                        for(var paramItem in param)
                        {
                            UploadMoudle.viewAttachmentFile(param[paramItem],$(viewFileLstObj),true);
                        }
                    }
                }
            },
            //上传失败后的回调函数
            error: function() {

            },
            //文件按钮点击事件，返回true表示执行选择文件，false不执行
            click:function(){
                var clickGo = true;
                //if(isMustLogin == true)
                //{
                //    //如果一定要先登录的话
                //    if(!Util.ZjlNotIsNullOrEmpty(_token))
                //    {
                //        clickGo = false;
                //    }
                //}
                return clickGo;
            },
            //上传前的事件，返回true表示执行上传，false不执行。返回文件名、文件预览路径(低版本浏览器暂不支持)
            beforeSend: function(data,src) {
                var result = true; //Util.checkPicType(data);
                if (result) {
                    _token = UserLocal.token();
                    uploadFileBtn.setParam({token:_token,type:fileType,hostId:hostId});
                    return true;
                    //if (Util.ZjlNotIsNullOrEmpty($("#payFileList").html())) {
                    //    //如果不为空，说明里面已经有数据了，那么应该先删除的
                    //    AlertMoudle.ZjlInfo("只可上传一个文档，请先删除先前上传的");
                    //    return false;
                    //} else {
                    //    return true;
                    //}
                } else {
                    //AlertMoudle.ZjlInfo("请上传图片文档");
                    //return false;
                }
            },
            obj:$(uploadBtnObj)//绑定对象，不支持多个同时绑定
        });
    }, //uploadMultiFileBtnInit 上传按钮的初使化——多个文件上传，含hostId

    //新增单个显示附件加入到附件列表
    viewAttachmentFile : function(param,obj,isCanDel,isShiftDel){
        var id = param.id;
        var url = zjl_file_location + param.path;
        var name = param.showName;

        var dom = '<li class="file-item"><span class="fileIcon"></span>'+
            '<a href="'+url+'" class="fileName" data-id="'+id+'" target="_blank">'+name+'</a>';
        if(isCanDel == true)
        {
            if(Util.ZjlNotIsNullOrEmpty(isShiftDel) && isShiftDel == true)
            {
                dom += '<span class="closeBtn" onclick="javascript:UploadMoudle.closeAndDelAttachment(this,' + id + ');"></span>';
            }
            else
            {
                dom += '<span class="closeBtn" onclick="javascript:UploadMoudle.closeAttachmentBtn(this);"></span>';
            }
        }
        dom += '</li>';
        obj.append(dom);
    },//新增单个显示附件加入到附件列表

    //批理显示附件列表
    viewAttachmentFileList : function(dataObj,isCanDel,isShiftDel){
        var dom = "";
        for(var index in dataObj)
        {
            var param = dataObj[index];
            var id = param.id;
            var url = zjl_file_location + param.path;
            var name = param.showName;

            dom += '<li class="file-item"><span class="fileIcon"></span>'+
                '<a href="'+url+'" class="fileName" data-id="'+id+'" target="_blank">'+name+'</a>';
            if(isCanDel == true)
            {
                if(Util.ZjlNotIsNullOrEmpty(isShiftDel) && isShiftDel == true)
                {
                    dom += '<span class="closeBtn" onclick="javascript:UploadMoudle.closeAndDelAttachment(this,' + id + ');"></span>';
                }
                else
                {
                    dom += '<span class="closeBtn" onclick="javascript:UploadMoudle.closeAttachmentBtn(this);"></span>';
                }
            }
            dom += '</li>';
        }
        return dom;
    },//批理显示附件列表

    //移出附件
    closeAttachmentBtn : function(obj,callback)
    {
        var hostId = ""; //附件所属的某个对像的Id
        var patentId = ""; //某个附件的所属的patentId
        var aObj = $(obj).parent().find("a");
        id = $(aObj).attr("data-id");
        if(Util.ZjlNotIsNullOrEmpty($(aObj).attr("data-patentId"))){
            patentId = $(aObj).attr("data-patentId");
        }
        if(Util.ZjlNotIsNullOrEmpty($(aObj).attr("data-hostId"))){
            hostId = $(aObj).attr("data-hostId");
        }
        $(obj).parent().remove();
        if(typeof callback === "function"){
            callback.call(null,obj);
        }

    },//CloseAttachmentBtn 结束

    //物理删除附件
    deleteAttachment:function(id,callback)
    {
        if(Util.ZjlNotIsNullOrEmpty(id))
        {
            AlertMoudle.ZjlConfirm("确定要删除这个文件么，删除后将不可恢复？",function(){
                UploadMoudle.deleteAttmItem(id,callback);
            });
        }
    },//移除附件并且物理删除文件

    //物理删除附件的具体方法，此方法不另确认提示
    deleteAttmItem:function(id,callback)
    {
        if(Util.ZjlNotIsNullOrEmpty(id))
        {
            var pageUrl = zjl_platform_domain + "/platform/attachment/delete"; //接口地址，可含参数
            pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
            pageUrl = encodeURI(pageUrl);
            var param = {};
            var token = UserLocal.token();
            param.id = id;
            param.token = token;
            var dataStr = JSON.stringify(param);
            $.ajax({
                type: "GET",
                async: true, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
                data: param,
                url: pageUrl,
                dataType: "json",
                timeout: 180000,
                beforeSend: function(XMLHTTP) {
                    XMLHTTP.setRequestHeader("Content-Type", "application/json");
                    XMLHTTP.setRequestHeader("token", token);
                }, //这里设置header
                success: function(jsonData) {
                    if(jsonData.code == 0)
                    {
                        if(typeof callback === "function"){
                            callback.call(null,jsonData);
                        }
                    }
                    else
                    {
                        AlertMoudle.ZjlInfo(jsonData.msg);
                    }
                },
                error: function(jsonData) {
                    AlertMoudle.ZjlInfo(jsonData.msg);
                }
            });
        }
    },//移除附件并且物理删除文件

    //移除并物理删除附件
    closeAndDelAttachment : function(obj,attmId,callback)
    {
        if(Util.ZjlNotIsNullOrEmpty(attmId))
        {
            AlertMoudle.ZjlConfirm("确定要删除这个文件么，删除后将不可恢复？",function(){
                UploadMoudle.closeAttachmentBtn(obj);
                UploadMoudle.deleteAttmItem(attmId,callback);
            });
        }
    }


}//UploadMoudle

    //公共js中无法归类的一些常用方法的集合，start……
    var Util = {

        //不为Null并且不为空
        ZjlNotIsNullOrEmpty : function(str) {
            var returnStr = false;
            if (str != undefined && str != "undefined" && str != null && str != "null" && str != "") {
                returnStr = true;
            }
            return returnStr;
        }, //ZjlNotIsNullOrEmpty 不为Null并且不为空

        //去掉所有的html标记
        delHtmlTag:function(str)
        {
            return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
        }, //delHtmlTag 结束

        //去掉\n，\r\n等
        delLiftRN:function(str)
        {
            if(ZjlNotIsNullOrEmpty(str))
            {
                //str = str.replace("\r\n","");
                //str = str.replace("\n","");
                //str = str.replace("<br>","");
                str = str.replace(/(\r\n)|\n|\r|(<br>)|(\u0085)|(\u2028)|(\u2029)/g, "");
            }
            return str;
        }, //delLiftRN 结束


        //根据一个小数，返回一个百分比的数值
        GetPercentNum:function(num)
        {
            num = Util.SetNumDataNullToZero(num); //如果为null，则置为0
            num = JClient.Object.formatMoney(num,4);
            num = num*100;
            var backStr = num + "";
            if(num > 0 && num < 100)
            {
                backStr = backStr.substr(0,5);
            }
            backStr = backStr + "%";
            return backStr;
        },//根据一个小数，返回一个百分比的数值，结束

        //获取地址栏上的文件夹目录，不含host，不含文件名，如：/user/buyer/
        GetUrlFolder:function()
        {
            var urlStr = window.location.pathname.toString();
            urlStr = urlStr.substr(0,urlStr.lastIndexOf("/")+1);
            return urlStr;
        },//获取地址栏上的文件夹目录，不含host，不含文件名，如：/user/buyer/，结束

        //将某个对像显示还是隐藏，传obj和true or false
        SetObjViewOrHidden:function(obj,boolParam)
        {
            if(boolParam == true)
            {
                $(obj).show();
            }
            else
            {
                $(obj).hide();
            }
        },//将某个对像显示还是隐藏，传obj和true or false，结束

        //设置某个对像自动隐藏或显示，传obj即可
        SetObjAutoVH:function(obj,speed)
        {
            if(ZjlNotIsNullOrEmpty(speed))
            {
                $(obj).toggle(speed);
            }
            else
            {
                $(obj).toggle();
            }

        },//将某个对像显示还是隐藏，传obj和true or false，结束

        //将后端返回来的为Null或为undefined的Num格式的数据设为0，以便于统一计算
        SetNumDataNullToZero:function(num)
        {
            if (num == undefined || num == "undefined" || num == null || num == "") {
                num = 0;
            }else{
                num = parseInt(num,10);
            }
            return num;
        },//将后端返回来的为Null或为undefined的Num格式的数据设为0，以便于统一计算，结束……

        //将字符串中的空格去除，并将英文逗号转换为中文逗号
        CommaChangeDelSpace:function(str)
        {
            if(ZjlNotIsNullOrEmpty(str))
            {
                str = str.replace(/ /g,"，");
                str = str.replace(/,/g,'，');
            }
            return str;
        }, //CommaChangeDelSpace 将字符串中的空格去除，并将英文逗号转换为中文逗号

        //用户名的替换问题
        ReplaceNameToStar:function(name)
        {
            if(name.length > 8)
            {
                var name1 = name.substring(0,2);
                var name2 = name1 + "****";
                var name3 = name.substring(6,name.length);
                name = name2 + name3;
                //name = name.substring(0,name.length-2) + "**";
            }
            return name;
        },//用户名的替换问题

        //http跳转至https
        GoHttpsUrl : function ()
        {
            var hostStr = window.location.host;
            //只有测试地址和公网才执行此跳转操作，本地url不管
            if(hostStr == "www.zijilai.com.cn" || hostStr == "zijilai.com.cn" || hostStr == "120.25.73.148")
            {
                var loc = window.location.href;
                var httpStr = window.location.protocol;
                if(httpStr == 'http:')
                {
                    var locNew =  loc.replace("http:","https:");
                    if(hostStr == "10.180.134.114:9000")
                    {
                        locNew =  locNew.replace("10.180.134.114:9000","10.180.134.114");
                    }
                    location.href = locNew;
                }
            }
        },

        //由https返回至http
        BackHttpUrl : function ()
        {
            var loc = window.location.href;
            if(loc.indexOf("/login.html") < 0 && loc.indexOf("/register.html") < 0 && loc.indexOf("/regperson.html") < 0 && loc.indexOf("/regcompany.html") < 0)
            {
                var httpStr = window.location.protocol;
                var hostStr = window.location.host;
                if (httpStr == 'https:') {
                    var hostPortal = hostStr;
                    if (hostStr == "10.180.134.114") {
                        hostPortal += ":9000";
                    }
                    var locNew = loc.replace("https://" + hostStr, "http://" + hostPortal);
                    location.href = locNew;
                }
            }
        },

        //https转http端口问题
        GetHttpHostFromHttps : function(hostStr)
        {
            if(hostStr == "10.180.134.114")
            {
                hostStr += ":9000";
            }
            hostStr = "http://" + hostStr;
            return hostStr;
        },

        //专利名称炫彩显示，默认为上面为案号，换行再显示专利名称
        GetPatentNameShine : function(subject,type,productType,caseId,separator){
            var icon = "";//专利的类型
            if(Util.isZZQNameTrue(subject))
            {
                //如果是著作权的案子
                icon = "<span class='COPYRIGHT'>&nbsp;</span>";
            }
            else if(subject.indexOf("-商标") >= 0)
            {
                icon = "<span class='BRAND'>&nbsp;</span>";
            }
            else {
                if (type == "DESIGN") {
                    icon = "<span class='DESIGN'>&nbsp;</span>";
                }
                else if (type == "INVETION") {
                    icon = "<span class='INVETION'>&nbsp;</span>";
                }
                else if (type == "UTILITY_MODEL") {
                    icon = "<span class='UTILITY_MODEL'>&nbsp;</span>";
                }
                //是否是同时申请
                if (Util.ZjlNotIsNullOrEmpty(productType) && productType == "MIX") {
                    icon += "<span class='Tong'>&nbsp;</span>";
                }
            }
            subject = icon + subject;
            if(Util.ZjlNotIsNullOrEmpty(caseId))
            {
                if(!Util.ZjlNotIsNullOrEmpty(separator))
                {
                    separator = "<br>";
                }
                subject = caseId + separator + subject;
            }
            return subject;
        },

        // 专利列表名称格式化，name指专利名称或案号和专利名称的拼接，本方法再加上炫彩效果
        GetPatentNameOneLine: function(name, type, productType) {
            var icon = ""; //专利的类型
            if(Util.isZZQNameTrue(name))
            {
                //如果是著作权的案子
                icon = "<span class='COPYRIGHT'>&nbsp;</span>";
            }
            else if(name.indexOf("-商标") >= 0)
            {
                icon = "<span class='BRAND'>&nbsp;</span>";
            }
            else {
                if (type == "DESIGN") {
                    icon = "<span class='DESIGN'>&nbsp;</span>";
                } else if (type == "INVETION") {
                    icon = "<span class='INVETION'>&nbsp;</span>";
                } else if (type == "UTILITY_MODEL") {
                    icon = "<span class='UTILITY_MODEL'>&nbsp;</span>";
                }
                //是否是同时申请
                if (productType == "MIX") {
                    icon += "<span class='Tong'>&nbsp;</span>";
                }
            }
            return icon + name;
        }, //GetPatentNameOneLine 专利列表名称格式化，name指专利名称或案号和专利名称的拼接，本方法再加上炫彩效果

        //根据名称判定是否是著作权，如果是，则返回true
        isZZQNameTrue:function(name)
        {
            var backTrue = false;
            if(name.indexOf("-案件详情") > 0)
            {
                name = name.replace("-案件详情","");
            }

            if(Util.ZjlNotIsNullOrEmpty(name) && name.length > 3)
            {
                var subName = name.substr(name.length-3,3);
                if(subName == "著作权")
                {
                    backTrue = true;
                }
            }
            return backTrue;
        },//isZZQNameTrue 根据名称判定是否是著作权，如果是，则返回true

        //订单时间和订单号合并为一列
        CreateTimeSerialNumber:function(createTime,serialNumber)
        {
            var backStr = DateMoudle.unix_to_datetime(createTime);
            backStr += "<br>" + serialNumber;
            return backStr;
        }, //CreateTimeSerialNumber 订单时间和订单号合并为一列

        //业务类型格式化，为以后业务类型前面加小图标做准备
        getPatentBizType:function(bizType)
        {
            var backStr = DictionaryMoudle.getProductBizType(bizType);
            return backStr;
        },

        //商标案号的格式化处理
        getTrademarkCaseId:function(trademarkId,caseId,serviceType)
        {
            //后面可能会有别的想法，所以先写这个方法便于后期维护
            var backStr = caseId;
            var serviceTypeStr = "";
            if(Util.ZjlNotIsNullOrEmpty(backStr))
            {
                if(serviceType == "NORMAL")
                {
                    //serviceTypeStr = "<span class='tmNormal'>标</span>"
                }
                else if(serviceType == "GUARANTEE")
                {
                    serviceTypeStr = "<span class='tmGuarantee'>保</span>"
                }
                else if(serviceType == "EMERGENCY")
                {
                    serviceTypeStr = "<span class='tmEmergency'>急</span>"
                }
            }
            backStr += serviceTypeStr;
            return backStr;
        },//getTrademarkCaseId 商标案号的格式化处理

        //商标名称的格式化处理
        getTrademarkSubject:function(trademarkId,subject,serviceType,type,productType)
        {
            //后面可能会有别的想法，所以先写这个方法便于后期维护
            var backStr = subject;
            return backStr;
        },//getTrademarkCaseId 商标案号的格式化处理

        //商标名称的炫彩处理
        getTrademarkSubjectColorful:function(subject,serviceType,type,productType)
        {
            //后面可能会有别的想法，所以先写这个方法便于后期维护
            var backStr = subject;
            var serviceTypeStr = "";
            if(Util.ZjlNotIsNullOrEmpty(backStr) && Util.ZjlNotIsNullOrEmpty(serviceType))
            {
                if(serviceType == "NORMAL")
                {
                    //serviceTypeStr = "<span class='tmNormal'>标</span>"
                }
                else if(serviceType == "GUARANTEE")
                {
                    serviceTypeStr = "<span class='tmGuarantee'>保</span>"
                }
                else if(serviceType == "EMERGENCY")
                {
                    serviceTypeStr = "<span class='tmEmergency'>急</span>"
                }
            }
            backStr = serviceTypeStr + backStr;
            return backStr;
        },//getTrademarkCaseId 商标案号的格式化处理

        //委托人的商标管理列表页面，联系专家那列的字段格式化处理
        getTrademarkAgentPhone:function(name,userId,trademarkId,caseId,bizType,productType)
        {
            var linkPatentDetail = "";
            if(userId == "null"&&productType!='HELP_SELF'){
                linkPatentDetail = "<div class='redCenter'>专家匹配中</div>";
                //if(bizType=='APPLY')
                //    return "<div style='text-align: center;'><a href='/zhuanli/professormatch.html?patentId="+patentId+"' class='btn btn-green'>立即匹配</a></div>";
                //else
                //    return "<div style='text-align: center;'><a href='javascript:void(0);'  patentId="+patentId+"  class='btn btn-green patent-match'>立即匹配</a></div>";
            }
            else if(productType=='HELP_SELF'){
                linkPatentDetail = "<div class='redCenter'>不需要专家</div>";
            }
            else{
                name = Util.ReplaceNameToStar(name);
                linkPatentDetail = '<a href="javascript:void(0)" data-type="Chat" chatid="'+userId+'"  chatname="'+name+'" class="btnContact messageContact">&nbsp;</a><a href="javascript:void(0)" data-type="Phone" phoneid="'+userId+'" caseid="'+caseId+'"  class="btnContact phoneContact">&nbsp;</a><span title="' + name + '">'+name + '</span>';

           }
            return linkPatentDetail;
        },//getTrademarkAgentPhone 委托人的商标管理列表页面，联系专家那列的字段格式化处理

        //承办人的商标管理列表，联系委托人的字段格式化处理
        getTrademarkUserPhone:function(name,userId,trademarkId,caseId)
        {
            if(name=="" || userId=="null"){
                return "";
            }
            else{
                name = Util.ReplaceNameToStar(name);
                var linkPatentDetail = '<a href="javascript:void(0)" data-type="Chat" chatid="'+userId+'" chatname="'+name+'" class="btnContact messageContact">&nbsp;</a><a href="javascript:void(0)" data-type="Phone" phoneid="'+userId+'" caseId="'+caseId+'"  class="btnContact phoneContact">&nbsp;</a><span title="' + name + '">'+name + '</span>';
                return linkPatentDetail;
            }
        },//getTrademarkUserPhone 承办人的商标管理列表，联系委托人的字段格式化处理

        /**获取地址栏变更的值，会区分大小写*/
        GetUrlParam:function(name)
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },

        /**截取字符串，并且在字符串身上附加title显示全字符*/
        getCutOutStrAndTitleAll:function(str,len)
        {
            var backStr = str;
            var cutStr = JClient.Object.cutString(str, len);
            backStr = "<span title='" + str + "'>" + cutStr + "</span>";
            return backStr;

        },//getCutOutStrAndTitleAll 截取字符串，并且在字符串身上附加title显示全字符

        /**计算字符串长度，一个汉字算二个字符*/
        getStrLength:function(str)
        {
            var strlen = 0;
            for(var i = 0;i < str.length; i++) {
                if (str.charCodeAt(i) > 128) {
                    strlen += 2;
                } else {
                    strlen += 1;
                }
            }
            return strlen;
        },//getStrLength 计算字符串长度，一个汉字算二个字符

        /**判断当前页面是专利/商标/著作权*/
        getThisPageType:function()
        {
            var backStr = "patent";//patent专利，trademark商标，copyright著作权
            var urlStr = window.location.pathname.toString(); //浏览器页面地址，不包含参数和hash值
            if(urlStr.indexOf("/shangbiao/") >= 0)
            {
                backStr = "trademark";
            }
            else if(urlStr.indexOf("/banquan/") >= 0)
            {
                backStr = "copyright";
            }
            else if(urlStr.indexOf("/zhuanli/") >= 0)
            {
                backStr = "patent";
            }
            return backStr;

        },//getThisPageType 判断当前页面是专利/商标/著作权

        /**著作权案号的格式化处理*/
        getCopyRightCaseId:function(copyRightId,caseId,serviceType)
        {
            var backStr = caseId;
            var serviceTypeStr = "";
            if(Util.ZjlNotIsNullOrEmpty(backStr))
            {
                if(serviceType.indexOf("EMERGENCY") >= 0)
                {
                    serviceTypeStr = "<span class='tmEmergency'>急</span>";
                }
            }
            backStr += serviceTypeStr;
            return backStr;
        },//getCopyRightCaseId 著作权案号的格式化处理

        /**著作权名称的格式化处理*/
        getCopyRightSubject:function(copyRightId,subject,type,serviceType)
        {
            var backStr = StrReplaceTabToSpace(subject);
            var subjectType = "";
            if(type == "SOFTWARE")
            {
                subjectType = "<span class='crSubjectTypeSoft'>软</span>";
            }
            else
            {
                subjectType = "<span class='crSubjectTypeNormal'>作</span>";
            }
            backStr = subjectType + backStr;
            return backStr;
        },//getTrademarkCaseId 商标案号的格式化处理

        /**把文件全路径改变为为文件名称*/
        changeFilePathToname:function(path){
            if(typeof path === "string" && path.indexOf("\\")!=0 || path.indexOf("/")!=0){
                if(path.indexOf("\\")!=0){
                    return path.substring(path.lastIndexOf("\\")+1);
                }else if(path.indexOf("/")!=0){
                    return path.substring(path.lastIndexOf("/")+1);
                }
            }else{
                return path;
            }
        },

        /**判断是否是专利的附加业务，1表示是附加业务，0或其它表示不是附加业务*/
        isPatentSubjoin:function(bizType){
            if(!Util.ZjlNotIsNullOrEmpty(bizType))
            {
                return 0;
            }

            if(bizType =="APPLY" || bizType.indexOf("DELIVER")!=-1){
                return 0;
            }
            else if(bizType =="TRUST"){
                return 2;//说明是托管业务
            }
            else{
                return 1;//说明是附加业务
            }
        },

        /**固定菜单栏通用JS方法*/
        fixBarScroll:function(obj,fixClassName,wrapobj)
        {
            var scrollBarTop;//滚动条的高度
            var objTop;//对像的高度
            $(window).on('scroll',function(){
                objTop = $(wrapobj).offset().top;//对像的高度
                scrollBarTop = $(document).scrollTop();//滚动条的高度
                var diffHeight = objTop - scrollBarTop;
                if(diffHeight <= 0){
                    if(!$(obj).hasClass(fixClassName))
                    {
                        $(obj).addClass(fixClassName);
                    }
                }
                if(scrollBarTop <= objTop){
                    $(obj).removeClass(fixClassName);
                }
            });
        },//fixBarScroll 固定菜单栏通用JS方法

        /**计算对像的高度*/
        countObjHeight:function(obj)
        {
            var objHeight = $(obj).offset().top;
            return objHeight;
        },//countObjHeight 计算对像的高度




}; //Util 公共js中无法归类的一些常用方法的集合，end……


// JSON字符串转JOSN对象，可以包含换行符
function JsonStrToObject(jsonStr){
    jsonStr = jsonStr.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "<mybr>");
    var json = $.parseJSON(jsonStr);
    for(var key in json){
        if(typeof(json[key])=='string')
          json[key] = json[key].replace(/<mybr>/g, "\r\n");
    }
    return json;
}

// 全屏显示
function ToggleFullScreenPage(obj,callback){
    if(!obj){
        return
    }
    var obj = $(obj),
        objId = obj.attr("data-href"),
        pageObj = $("#"+objId);

    if(obj.attr("data-screen")=="true"){
        pageObj.removeClass("fullScreenPage");
        obj.attr({
            "title":"全屏模式",
            "data-screen":"false"
        });
        obj.removeClass("icon-exit-full-screen").addClass("icon-enter-full-screen");
        $("body").removeClass("fullScreenPage");
        if(typeof callback === "function"){
            callback.call(null,false);
        }
    }else{
        pageObj.addClass("fullScreenPage");
        obj.attr({
            "title":"退出全屏模式",
            "data-screen":"true"
        });
        obj.removeClass("icon-enter-full-screen").addClass("icon-exit-full-screen");
        $("body").addClass("fullScreenPage");
        if(typeof callback === "function"){
            callback.call(null,true);
        }
    }
}

// 判断是否支持css3的指定属性
function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
    i,
    humpString = [],
    htmlStyle = document.documentElement.style,
    _toHumb = function (string) {
    return string.replace(/-(\w)/g, function ($0, $1) {
    return $1.toUpperCase();
    });
    };
    for(var i=0;i<prefix.length;i++)
    humpString.push(_toHumb(prefix[i] + '-' + style));

    humpString.push(_toHumb(style));

    for(var i=0;i<humpString.length;i++)
    if (humpString[i] in htmlStyle) return true;

    return false;
}
/**
 * [TemplateEngine 模板注入引擎]
 * @param {[type]} html    [模板文本]
 * @param {[type]} options [注入参数]
 */
function TemplateEngine(html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0;
    var add = function(line, js) {
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + (line.indexOf('this.') != -1 ? line : 'this.' + line) + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        //html = html.replace(/[\r\t\n]/g, '')
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
// 文本域高度适应内容
function textareaResize(obj) {
    var $obj = $(obj);
    var pH = parseInt($obj.css('padding-top'), 10) + parseInt($obj.css('padding-bottom'), 10);
    if (obj.scrollHeight > 10) {
        obj.style.height = 'auto';
        obj.style.height = obj.scrollHeight + pH + 5 + 'px';
    }
}
// js执行队列池 add：添加队列 stick：在队列最前面插入一项 run：执行队列 that：设置执行回调方法的this对象
var queuePool = (function() {
    var pools = [],
        isRunning = false,
        _that = null;

    function walk() {
        var runner = pools.shift();
        if (runner) {
            runner.call(_that, walk);
        } else {
            isRunning = false;
        }
    }
    return {
        add: function(fn) {
            pools.push(fn);
        },
        stick: function(fn) {
            pools.unshift(fn);
        },
        run: function() {
            if (!isRunning) {
                isRunning = true;
                walk();
            }
        },
        that: function(that) {
            _that = that;
        }
    };
})();

/*
    Lflow是一个迷你的异步流工具
    基于信号量机制，可以用when/now两个操作来等待/释放信号量
    从而达到复杂的（非周期）异步流控制
*/
;(function(){
var uid = 1;
var Lflow = function(){
    this.map = {};
    this.rmap = {};
};
var indexOf = Array.prototype.indexOf || function(obj){
    for (var i=0, len=this.length; i<len; ++i){
        if (this[i] === obj) return i;
    }
    return -1;
};
var fire = function(callback, thisObj){
    setTimeout(function(){
        callback.call(thisObj);
    }, 0);
};
Lflow.prototype = {
    when: function(resources, callback, thisObj){
        var map = this.map, rmap = this.rmap;
        if (typeof resources === 'string') resources = [resources];
        var id = (uid++).toString(16); // using hex
        map[id] = {
            waiting: resources.slice(0), // clone Array
            callback: callback,
            thisObj: thisObj || window
        };

        for (var i=0, len=resources.length; i<len; ++i){
            var res = resources[i];
            rmap[res] = rmap[res] || id;
        }
        return this;
    },
    trigger: function(resources){
        if (!resources) return this;
        var map = this.map, rmap = this.rmap;
        if (typeof resources === 'string') resources = [resources];
        for (var i=0, len=resources.length; i<len; ++i){
            var res = resources[i];
            if (typeof rmap[res] === 'undefined') continue;
            this._release(res, rmap[res]); // notify each callback waiting for this resource
            delete rmap[res]; // release this resource
        }
        return this;
    },
    _release: function(res, uid){
        var map = this.map,
            //rmap = this.rmap,
            mapItem = map[uid],
            waiting = mapItem.waiting,
            pos = indexOf.call(waiting, res);
        waiting.splice(pos, 1); // remove
        if (waiting.length === 0){ // no more depends
            fire(mapItem.callback, mapItem.thisObj); // fire the callback asynchronously
            delete map[uid];
        }
    }
};
window.Lflow = Lflow; // Lflow is JavaScript Asynchronous (callings) Synchronizer
})();

/*

var flow = new Lflow();
flow.when(['A', 'B'], function(){
    // both A and B are done!!
});

$.getJSON(url1, function(data){
    // An ajax request
    flow.trigger('A');
});
$.getJSON(url2', function(data){
    // Another ajax request
    flow.trigger('B');
});

*/

 /**
  * 解决IE下不支持placeholder属性
  * 可以根据自己的需要去扩展
  * 还是暂时不用吧，这样会导致默认情况下，将placeholder的值当做文本值传递给了搜索条件
  */
 //(function($) {
 //    $.fn.placeholder = function(options) {
 //        var opts = $.extend({}, $.fn.placeholder.defaults, options);
 //        // var isIE = document.all ? true : false;
 //        var input = document.createElement('input');
 //        var isIE = !("placeholder" in input);
 //        return this.each(function() {
 //            var _this = this,
 //                placeholderValue = _this.getAttribute("placeholder"); //缓存默认的placeholder值
 //            if (isIE&&placeholderValue) {
 //                _this.setAttribute("value", placeholderValue);
 //                _this.onfocus = function() {
 //                    $.trim(_this.value) == placeholderValue ? _this.value = "" : '';
 //                };
 //                _this.onblur = function() {
 //                    $.trim(_this.value) == "" ? _this.value = placeholderValue : '';
 //                };
 //            }
 //        });
 //    };
 //})(jQuery);
 //$(function(){
 //   $("input[type!=password]").placeholder();
 //});

function loadingLinePress(press){
    var press = press ? press+"%" : "100%";
    $(".loading-line-wrap .loading-line").css("width",press);
}
(function(){
    Util.BackHttpUrl();
    function setDisableClick(){
        $(document).on('mousedown','[event-click="disabled"]',function(e){
            var $this = $(this);
            if($this.hasClass('no-click')){
                if(e.preventDefault){
                    e.preventDefault();
                    // var time = new Date().getTime();
                    // try{
                    //     for (i = time; i <= time+3000; i = new Date().getTime()) {

                    //     };
                    // }catch (e) {

                    // }
                    return false ;
                }
            }else{
                console.log('mousedown');
                $this.addClass('no-click');
                setTimeout(function(){
                    $this.removeClass('no-click');
                },2000)
            }

        });
    }
    setDisableClick()
})();

//window.onload = Util.BackHttpUrl();//如果是https，则自动跳转到http

// (function(){
//     // 禁止提交按钮多次重复提交，3s后自动释放，也可去通过移除'disabled'类自动去释放
//     $('[event-click="disabled"]').on('mousedown touchstart',function(e){
//         var $this = $(this);
//         var e = e || window.event;
//         if($this.hasClass('not-allowed')){
//             e.preventDefault();
//             return false;
//         }else{
//             var classstr = 'not-allowed'+($this.attr('event-loading')=='true'?' loading':'')
//             $this.addClass(classstr);
//             setTimeout(function(){
//                 $this.removeClass(classstr);
//             }, 3000)
//         }
//     });
// })();

(function(){
    // HR = "          _____                    _____                    _____                    _____          \n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \n        /::\\____\\                /::\\    \\                /::\\    \\                /::\\    \\        \n       /:::/    /                \\:::\\    \\              /::::\\    \\              /::::\\    \\       \n      /:::/    /                  \\:::\\    \\            /::::::\\    \\            /::::::\\    \\      \n     /:::/    /                    \\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\     \n    /:::/____/                      \\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\    \n   /::::\\    \\                      /::::\\    \\      /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\   \n  /::::::\\    \\   _____    ____    /::::::\\    \\    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\  \n /:::/\\:::\\    \\ /\\    \\  /\\   \\  /:::/\\:::\\    \\  /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\    \\ \n/:::/  \\:::\\    /::\\____\\/::\\   \\/:::/  \\:::\\____\\/:::/  \\:::\\   \\:::|    |/:::/__\\:::\\   \\:::\\____\\\n\\::/    \\:::\\  /:::/    /\\:::\\  /:::/    \\::/    /\\::/   |::::\\  /:::|____|\\:::\\   \\:::\\   \\::/    /\n \\/____/ \\:::\\/:::/    /  \\:::\\/:::/    / \\/____/  \\/____|:::::\\/:::/    /  \\:::\\   \\:::\\   \\/____/ \n          \\::::::/    /    \\::::::/    /                 |:::::::::/    /    \\:::\\   \\:::\\    \\     \n           \\::::/    /      \\::::/____/                  |::|\\::::/    /      \\:::\\   \\:::\\____\\    \n           /:::/    /        \\:::\\    \\                  |::| \\::/____/        \\:::\\   \\::/    /    \n          /:::/    /          \\:::\\    \\                 |::|  ~|               \\:::\\   \\/____/     \n         /:::/    /            \\:::\\    \\                |::|   |                \\:::\\    \\         \n        /:::/    /              \\:::\\____\\               \\::|   |                 \\:::\\____\\        \n        \\::/    /                \\::/    /                \\:|   |                  \\::/    /        \n         \\/____/                  \\/____/                  \\|___|                   \\/____/         \n";
    // window.console && console.log(HR);

    //HR = '          _____                    _____          \n         /\\    \\                  /\\    \\         \n        /::\\    \\                /::\\    \\        \n        \\:::\\    \\              /::::\\    \\       \n         \\:::\\    \\            /::::::\\    \\      \n          \\:::\\    \\          /:::/\\:::\\    \\     \n           \\:::\\    \\        /:::/__\\:::\\    \\    \n           /::::\\    \\      /::::\\   \\:::\\    \\   \n  ____    /::::::\\    \\    /::::::\\   \\:::\\    \\  \n /\\   \\  /:::/\\:::\\    \\  /:::/\\:::\\   \\:::\\____\\ \n/::\\   \\/:::/  \\:::\\____\\/:::/  \\:::\\   \\:::|    |\n\\:::\\  /:::/    \\::/    /\\::/   |::::\\  /:::|____|\n \\:::\\/:::/    / \\/____/  \\/____|:::::\\/:::/    / \n  \\::::::/    /                 |:::::::::/    /  \n   \\::::/____/                  |::|\\::::/    /   \n    \\:::\\    \\                  |::| \\::/____/    \n     \\:::\\    \\                 |::|  ~|          \n      \\:::\\    \\                |::|   |          \n       \\:::\\____\\               \\::|   |          \n        \\::/    /                \\:|   |          \n         \\/____/                  \\|___|          \n'
    var HR ="+-,--==)([]-W-W-W][)(^%#$      (){}[6_-[]12_5&^(69       ---|}{\n" +
            "+-,--==)([]-Z-I-J-I][)(^*      (L-A-I_-[]12_5&^(69       C-O-M-\n" +
            "                  +_)(*4              _+_*&^_            0+++++\n" +
            "                +_)(*0                _+_*&^_            +7++++\n" +
            "               +_)(*0                 _+_*&^_            ++5+++\n" +
            "              +_)(*9                  _+_*&^_            +++5++\n" +
            "             +_)(*6                   _+_*&^_            ++++6+\n" +
            "            +_)(*8                    _+_*&^_            +++++1\n" +
            "           +_)(*6                     _+_*&^_            ++++8+\n" +
            "          +_)(*7                      _+_*&^_            +++9++\n" +
            "         +_)(*6                       _+_*&^_            ++7+++\n" +
            "        +_)(*6                        _+_*&^_            +1++++\n" +
            "       +_)(*&                         _+_*&^_            6+++++\n" +
            "      +_)(*&                          _+_*&^_            +8++++\n" +
            "     +_)(*&                           _+_*&^_            S+++++\n" +
            "    +_)(*&                            _+_*&^_            +Z++++\n" +
            "   +_)(*&                             _+_*&^_            ++N+++\n" +
            "  +_)(*&                              _+_*&^_            +++S++\n" +
            " +_)(*&+_)(*&+_)(*&+_)    +_*&^_(){}[6_+_*&^_            +=[]P(L@A&^T^F$O&R!M>>!@#$*\n" +
            "+_)(*&+_)(*&+_)(*&+_)|    +_*&^_(){}[6_+_*&^_            +=[]P(L@A&^T^F$O&R!M>>!@#$*\n"
        ;
    //window.console && console.info(HR);

}())
