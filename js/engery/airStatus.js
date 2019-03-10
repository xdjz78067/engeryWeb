/**
 * Created by JieMingWan on 2019/2/21.
 */
var airStatusPage={
    init:function(){
        this.loadPage();
        this.addEvent();
    },
    loadPage:function(){
        this.getRoomList();
        this.getAllExpectTemperature();
    },
    addEvent:function(){
    },
    getRoomList:function () {
        AjaxEngine.ajax('',zjl_platform_domain+'/room_status',{},function(data){
            if(data.code==200&&data.data.length>0){

                $.each(data.data,function(i,elem){
                    elem.roomNum=elem.room.roomNum;
                })
                var sheet = JClient.Object.roomListContext; //使用sheet的div的Id
                var _Remta = {};
                _Remta.elements = data.data;
                _Remta.elementCount = data.data.length;
                sheet.structMySheetData(_Remta); //其实就是调用JClient.UI.Sheet.prototype.structMySheetData（）
            }else{
                _alert(data.msg)
            }
        })
    },
    /**操作列**/
    operation: function(id, copyrightId) {
        var backStr = "";
        backStr += "<a data-toggle=\"modal\" data-target=\"#editRoomModal\" onclick=\"javascript:energyexpenPage.editRoom(" + id + ");\">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;";
        backStr += "<a onclick=\"javascript:CopyRightControl.copyRightOwnerPSDel(" + copyrightId + "," + id + ");\">删除</a>";
        return backStr;
    },
    /**得到总期望温度**/
    getAllExpectTemperature: function() {
        AjaxEngine.ajax('',zjl_platform_domain+'/room/expect',{},function(data){
            if(data.code==200){
                var dataObj=data.data;
                $("#allExpectModel").text(DictionaryMoudle.getWorkModel(dataObj.model));
//                    期望温度值
                if(dataObj.model=="hot"){
                    $("#allExpectTemperature").text(dataObj.hotTemperature+"℃");
                }else{
                    $("#allExpectTemperature").text(dataObj.coldTemperature+"℃");
                }
            }
        })
    },
    airStatus:function (status) {
        var backStr = "";
        if(status=="00"){
            backStr+='<span class="badge" title="'+DictionaryMoudle.getAirStatus(status)+'"> </span>';
        }else if(status=="01"){
            backStr+='<span class="badge badge-important" title="'+DictionaryMoudle.getAirStatus(status)+'"> </span>';
        }else{
            backStr+='<span class="badge badge-success" title="'+DictionaryMoudle.getAirStatus(status)+'"> </span>';
        }
        return backStr;
    }
};
$(document).ready(function() {
//        EditableTable.init();

    JClient.UI.CreateSheets();
    airStatusPage.init();
});