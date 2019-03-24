/**
 * Created by JieMingWan on 2019/2/21.
 */
var energyexpenPage={
    init:function(){
        this.loadPage();
        this.addEvent();
    },
    loadPage:function(){
        this.getRoomList();
    },
    addEvent:function(){
        $("#addRoomModal").on('show.bs.modal', function(event) {
            ClearFormControlValue($("#addRoomModal")); //要清除下表单
        });
        $("#editRoomModal").on('hide.bs.modal', function(event) {
//                ClearFormControlValue($("#editRoomModal")); //要清除下表单
        });
//            添加房间
        $("#addRoomBtn").click(function () {
            var params={};
            params.building=$("#inputBuilding").val();
            params.roomNum=$("#inputRoomNum").val();
            AjaxEngine.ajax('',zjl_platform_domain+'/room/add',params,function(data){
                if(data.code==200){
                    $("#addRoomModal").modal("hide");
                    alert("创建成功")
                }else{
                    alert(data.msg)
                }
            },false,'post')
        })
//            设置房间温度
        $("#editRoomBtn").click(function () {
            var params={};
            params.room_id=$("#editRoomId").val();
            if($("#expectTemperature").hasClass("active")){
                params.expect_model=$("#roomExpectModel").val();
                params.expect_temperature=$("#roomExpectTemperature").val();
                AjaxEngine.ajax('',zjl_platform_domain+'/room/expect',params,function(data){
                    if(data.code==200){
                        $("#editRoomModal").modal("hide");
                        alert("设置成功")
                    }else{
                        alert(data.msg)
                    }
                },false,'post')
            }else{
                params.setting_model=$("#roomSettingModel").val();
                params.setting_temperature=$("#roomSettingTemperature").val();
                AjaxEngine.ajax('',zjl_platform_domain+'/room/setting',params,function(data){
                    if(data.code==200){
                        $("#editRoomModal").modal("hide");
                        alert("设置成功")
                    }else{
                        alert(data.msg)
                    }
                },false,'post')
            }
        })
        //            设置总温度
        $("#saveAllTempBtn").click(function () {
            var params={};
            params.model=$("#allRoomExpectModel").val();
            params.temperature=$("#AllRoomExpectTemperature").val();
            AjaxEngine.ajax('',zjl_platform_domain+'/set_expect',params,function(data){
                if(data.code==200){
                    $("#setAllTempModal").modal("hide");
                    alert("设置成功")
                }else{
                    alert(data.msg)
                }
            },false,'post')
        })
    },
    getRoomList:function () {
        AjaxEngine.ajax('',zjl_platform_domain+'/room',{},function(data){
            if(data.code==200&&data.data.length>0){
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
        backStr += "<a onclick=\"javascript:energyexpenPage.delRoom(" + id + ");\">删除</a>";
        return backStr;
    },
    /**编辑预处理**/
    editRoom: function(id) {
        $("#editRoomId").val(id);
        var dataObj=JClient.Object.roomListContext.getSelectedObjById(id);
        //                    期望温度值
        $("#roomExpectModel").val(dataObj.expectModel);
        $("#roomExpectTemperature").val(dataObj.expectTemperature);
//                    指定温度值
        $("#roomSettingModel").val(dataObj.settingModel);
        $("#roomSettingTemperature").val(dataObj.settingTemperature);
        return
        var param={};
        param.id=id;
        AjaxEngine.ajax('',zjl_platform_domain+'/room/id',param,function(data){
            if(data.code==200){
                var dataObj=data.data;
//                    期望温度值
                $("#roomExpectModel").val(dataObj.expectModel);
                $("#roomExpectTemperature").val(dataObj.expectTemperature);
//                    指定温度值
                $("#roomSettingModel").val(dataObj.settingModel);
                $("#roomSettingTemperature").val(dataObj.settingTemperature);
            }
        })
    },
    getAirModel:function (workModel,expectModel,settingModel) {
        var backStr = "";
        if(workModel=="expect"){
            backStr+=DictionaryMoudle.getAirModel(expectModel);
        }else{
            backStr+=DictionaryMoudle.getAirModel(settingModel);
        }
        return backStr;
    },

    delRoom:function (id) {
        AjaxEngine.ajax('',zjl_platform_domain+'/room/delete',{id:id},function(data){
            if(data.code==200){
               _alert("删除成功")
            }else{
                _alert(data.msg)
            }
        })
    },
};
$(document).ready(function() {
//        EditableTable.init();

    JClient.UI.CreateSheets();
    energyexpenPage.init();
});