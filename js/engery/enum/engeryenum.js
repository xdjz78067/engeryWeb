/**
 * Created by JieMingWan on 2019/2/11.
 */
// 数据字典DictionaryMoudle  Start……
var DictionaryMoudle = {
    // 工作模式
    getWorkModel:function(key){
        var statusJson = {};
        statusJson.setting = "指定温度";
        statusJson.expect = "期望温度";
        if(key){
            return statusJson[key] ? statusJson[key] : '';
        }else{
            return statusJson;
        }
    },
    // 空调工作模式
    getAirModel:function(key){
        var statusJson = {};
        statusJson.hot = "制热";
        statusJson.cold = "制冷";
        if(key){
            return statusJson[key] ? statusJson[key] : '';
        }else{
            return statusJson;
        }
    },
    // 空调工作状态
    getAirStatus:function(key){
        var statusJson = {};
        statusJson[00] = "空调关机";
        statusJson[01] = "空调开机";
        statusJson[02] = "智能温控";
        if(key){
            return statusJson[key] ? statusJson[key] : '';
        }else{
            return statusJson;
        }
    },
}; //数据字典 DictionaryMoudle  end……