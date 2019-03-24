/**
 * Created by JieMingWan on 2019/2/21.
 */
var roomControl={
    init:function(){
        this.loadPage();
        this.addEvent();
    },
    loadPage:function(){
        this.getOutTemperature();
        this.getAllExpectTemperature();
    },
    addEvent:function(){
        var _this=this;
        //智能模式开关
        $("#intelligentStatus").change(function () {
            _this.setIntelligent();
        })
    },
    /**得到总期望温度**/
    getAllExpectTemperature: function() {
        AjaxEngine.ajax('',zjl_platform_domain+'/get_expect',{},function(data){
            if(data.code==200){
                var dataObj=data.data;
                $("#allExpectModel").text(DictionaryMoudle.getAirModel(dataObj.model));
//                    期望温度值
                if(dataObj.model=="hot"){
                    $("#allExpectTemperature").text(dataObj.hotTemperature+"℃");
                }else{
                    $("#allExpectTemperature").text(dataObj.coldTemperature+"℃");
                }
            }
        })
    },
    //外界气温
    getOutTemperature:function(){
        AjaxEngine.ajax('',zjl_platform_domain+'/temperature',{},function(data){
            if(data.code==200){
                if(data.data=="FF"){
                    $("#outTemperature").text("未得到温度")
                }else{
                    $("#outTemperature").text(data.data+"℃")
                }

            }else{
                _alert(data.msg)
            }
        })
    },
    //开户智能模式
    setIntelligent:function() {
        var param={};
        param.status=$("#intelligentStatus").prop("checked")?"open":"close"
        AjaxEngine.ajax('',zjl_platform_domain+'/intelligent',param,function(data){
            if(data.code==200){
              _alert("设置成功")
            }
        },false,"post")
    }
};
$(document).ready(function() {
    roomControl.init();
});