/**
 * [名称] AjaxEngine 引擎
 * [描述]
 *  基于jquery的ajax二次封装，实现了基本的用户与服务器的数据交互。
 * [主要方法]
 *
 * [使用说明]
 * AjaxEngine.ajax();
 *
 * [依赖文件]: jquery
 * [创建日期]: 2016-03-02
 * [作者]: luobw
 * [版本]: v1.0
 */
;(function(){
var AjaxEngine = {
    GetJsonpData: function(jsonParam, success, error, callBackParam) {
        var _this = this;
        var pageUrl = jsonParam.url; //接口地址，可含参数
        var callbackPara = "callback" + ZjlRandom(9999); //这个参数名要随机一下才比较好，因为多个异步同时读取时，会发生冲突
        pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
        jsonParam.token && (pageUrl += "&token=" + jsonParam.token);
        pageUrl = encodeURI(pageUrl);
        var pAsync = jsonParam.async == false ? false : true; //同异步，默认为true
        var param = jsonParam.data ? jsonParam.data : jsonParam; //实际传递参数
        if (!jsonParam.data && param.url != null) {
            param.url = "";
        }
        $.ajax({
            type: jsonParam.type ? jsonParam.type : "GET",
            async: pAsync, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
            cache: false, //缓存，置为false，不缓存
            data: param,
            url: pageUrl,
            dataType: "jsonp",
            timeout: 180000,
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: (callBackParam) ? callBackParam : callbackPara, //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(jsonData) {
                success.call(null, jsonData);
            },
            error: function() {
                _this.ajaxError();
            }
        });
    },
    //通过ajax，获取后端接口提供的json数据，直接返回原装的json数据，不进行任何加工处理
    //jsonParam为json格式的数据，必有变量为：url,token,data，token在为空时(如登录时)，请直接传个空值
    //jsonParam中的url为接口地址，看各人爱好，也可将参数直接拼接在此url中
    //jsonParam中的data，请直接传递后端所需要的格式，当前后端默认接受的data数据格式类似于a=1&b=2这种格式，一般不接受json格式数据
    //data格式具体情况，请直接与后端同仁沟通，故请传递后端所需要的格式，本方法中不进行任何转换
    //success为回调方法
    //error为一些特殊情况下的处理，默认可不传递参数
    GetJsonData: function(jsonParam, success, error) {
        var _this = this;
        var pageUrl = jsonParam.url; //接口地址，可含参数
        // pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
        // pageUrl += "&token=" + jsonParam.token;
        pageUrl = encodeURI(pageUrl);
        var pAsync = jsonParam.async == false ? false : true; //同异步，默认为true
        var param = jsonParam.data ? jsonParam.data : jsonParam; //实际传递参数
        if (!jsonParam.data && param.url != null) {
            param.url = "";
        }
        $.ajax({
            type: jsonParam.type ? jsonParam.type : "GET",
            async: pAsync, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
            data: param,
            url: pageUrl,
            dataType: "json",
            timeout: 180000,
            //headers:{"token":jsonParam.token},
            // jsonpCallback:"callback" + Util.ZjlRandom(9999),
            beforeSend: function(XMLHTTP) {
                //XMLHTTP.setRequestHeader("Content-Type","application/x-www-form-urlencoded charset=utf-8");
                //XMLHTTP.setRequestHeader("enctype","multipart/form-data");
                // XMLHTTP.setRequestHeader("Content-Type", "application/json");
                // XMLHTTP.setRequestHeader("token", jsonParam.token);
            }, //这里设置header
            success: function(jsonData) {
                success.call(null, jsonData);
            },
            error: function() {
                _this.ajaxError();
            }
        });
    },
    GetJsonStrData: function(jsonParam, success, error) {
        var _this = this;
        var pageUrl = jsonParam.url; //接口地址，可含参数
        pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
        // pageUrl += "&token=" + jsonParam.token;
        pageUrl = encodeURI(pageUrl);
        var pAsync = jsonParam.async == false ? false : true; //同异步，默认为true
        var param = jsonParam.data ? jsonParam.data : jsonParam; //实际传递参数
        if (!jsonParam.data && param.url != null) {
            param.url = "";
        }
        $.ajax({
            type: jsonParam.type ? jsonParam.type : "GET",
            async: pAsync, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
            data: JSON.stringify(param),
            url: pageUrl,
            dataType: "json",
            timeout: 180000,
            //headers:{"token":jsonParam.token},
            // jsonpCallback:"callback" + Util.ZjlRandom(9999),
            beforeSend: function(XMLHTTP) {
                //XMLHTTP.setRequestHeader("Content-Type","application/x-www-form-urlencoded charset=utf-8");
                //XMLHTTP.setRequestHeader("enctype","multipart/form-data");
                XMLHTTP.setRequestHeader("Content-Type", "application/json");
                XMLHTTP.setRequestHeader("token", jsonParam.token);
            }, //这里设置header
            success: function(jsonData) {
                success.call(null, jsonData);
            },
            error: function() {
                _this.ajaxError();
            }
        });
    },
    PostJsonData: function(jsonParam, success, error) {
        var _this = this;
        var pageUrl = jsonParam.url; //接口地址，可含参数
        // pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
        // pageUrl += "&token=" + jsonParam.token;
        pageUrl = encodeURI(pageUrl);
        var pAsync = jsonParam.async == false ? false : true; //同异步，默认为true
        var param = jsonParam.data ? jsonParam.data : jsonParam; //实际传递参数
        if (!jsonParam.data && param.url != null) {
            param.url = "";
        }
        $.ajax({
            type: jsonParam.type ? jsonParam.type : "POST",
            async: pAsync, //默认为true异步，如果jsonParam.async有传值，则以传递过来的值为准
            data: param,
            url: pageUrl,
            dataType: "json",
            timeout: 180000,
            //headers:{"token":jsonParam.token},
            // jsonpCallback:"callback" + Util.ZjlRandom(9999),
            beforeSend: function(XMLHTTP) {
                //XMLHTTP.setRequestHeader("Content-Type","application/x-www-form-urlencoded charset=utf-8");
                //XMLHTTP.setRequestHeader("enctype","multipart/form-data");
                // XMLHTTP.setRequestHeader("Content-Type", "application/json");
                // XMLHTTP.setRequestHeader("token", jsonParam.token);
            }, //这里设置header
            success: function(jsonData) {
                success.call(null, jsonData);
            },
            error: function() {
                _this.ajaxError();
            }
        });
    },
    /**
     * AjaxEngine 引擎开放方法
     * @param param:{
                esbUrl:"接口前缀",
                token:"token值",
                interfaceUrl:"接口全路径",
                param:{"传递数据"},
                callback:function(){"回调函数，有则异步调用，无则同步"},
                tokenBool:"是否需要在header中添加token true-是 false-否 默认为true，可不传",
                type:"调用类型，默认get，调用对应接口。可不传，需要传值时必须传tokenBool值，Post请求时请传‘post’,jsonp调用传jsonp"
            }
     * @return {code:"状态码", data:{}, msg:"成功返回‘success’，失败返回原因"}
     */
    ajax: function(token, interfaceUrl, param, callback, tokenBool, type) {
        var _this = this;
        var result = null;
        var async = (typeof callback === "function");
        var intoParam = {};
        intoParam.url = interfaceUrl;
        intoParam.async = async;
        (typeof param === "object") && (intoParam.data = param);
        tokenBool != false && (intoParam.token = token);
        type && (type = type.toLowerCase()); //所有请求type都转为小写字母 toUpperCase：转大写字母
        if (type == "post") {
            AjaxEngine.PostJsonData(intoParam, function(data) {
                if (_this.ajaxPreload(data)) {
                    async && callback.call(null, data);
                    result = data;
                }
            });
        } else if (type == "jsonp") {
            AjaxEngine.GetJsonpData(intoParam, function(data) {
                if (_this.ajaxPreload(data)) {
                    async && callback.call(null, data);
                    result = data;
                }
            });
        } else if (type == "jsonstr") {
            AjaxEngine.GetJsonStrData(intoParam, function(data) {
                if (_this.ajaxPreload(data)) {
                    async && callback.call(null, data);
                    result = data;
                }
            });
        } else if (type == "url") {
            var pageUrl = interfaceUrl; //接口地址，可含参数
            pageUrl = AddRandomParam(pageUrl); //给url参数增加一个随机变量
            token && (pageUrl += "&token=" + token);
            for (key in param) {
                pageUrl += '&' + key + '=' + param[key];
            }
            OpenWinRedirect(pageUrl);
            return;
            window.open(pageUrl);
            async && callback.call(null, {
                code: 99999
            });
        } else {
            AjaxEngine.GetJsonData(intoParam, function(data) {
                if (_this.ajaxPreload(data)) {
                    async && callback.call(null, data);
                    result = data;
                }
            });
        }
        return result;
    },
    // 返回结果数据预处理
    ajaxPreload: function(data) {
        if (data && data.code == 10045) {
            //说明token到期了，则自动本地自动退出，并清除cookie
            UserLocal.loginout(true);
            return false
        } else {
            return true
        }
    },
    ajaxError: function() {
        _alert("获取数据失败，请与我们的客服联系！Tel：400-968-6766");
    }
}

//生成随机数
function ZjlRandom(n) {
    return Math.floor(Math.random() * n + 1);
}

//给url增加一个随机变量参数
function AddRandomParam(urlStr) {
    // if(window.randomTime){
    //     if(parseInt((new Date()).getTime()/1000)-window.randomTime>=2){
    //         window.randomTime = parseInt((new Date()).getTime()/1000);
    //     }
    // }else{
    //     window.randomTime = parseInt((new Date()).getTime()/1000);
    // }
    // return urlStr + (urlStr.indexOf("?")!=-1?"&":"?") + "random=" + randomTime;

    urlStr += (urlStr.indexOf("?") != -1 ? "&" : "?") + "random=" + Math.random();
    return urlStr;
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
window.AjaxEngine = AjaxEngine;
})();