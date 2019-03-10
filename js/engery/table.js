///Create by Hiden Wu
///Date 2013-09-10
///Version: 1.0


JClient.Inherits = function (childCtrl, parentCtrl) {
    /** @constructor */
    function tempCtrl() {
    };
    tempCtrl.prototype = parentCtrl.prototype;
    childCtrl.superClass = parentCtrl.prototype;
    childCtrl.prototype = new tempCtrl();
    childCtrl.prototype.constructor = childCtrl;
};

JClient.UI.Sheet = function (divId) {
    this.Id = divId;
    this.Panel = $("#" + divId);
    this.Handler = this.Panel.attr("handler");
    this.pAsync = this.Panel.attr("isAsync") == "false" ? false : true;
    JClient.Object[this.Panel.attr("id")] = this;
    this.AllowSelect = this.Panel.attr("allowselect");
    this.AllowPaging = this.Panel.attr("allowpaging");
    this.AllowIndex = this.Panel.attr("allowindex");
    this.PK = this.Panel.attr("pk");
    this.css = this.Panel.attr("css");

    if (this.css == undefined || this.css == "")
        this.css = "taskShow_title";
    if (this.PK == undefined || this.PK == "")
        this.PK = "id";

    this.Cols = this.Panel.find("div[type='Cols']");
    this.SheetCols = [];
    //alert(this.Cols.children().length);
    var self = this;
    this.Cols.find("div[type^='Col']").each(function (i) {
        var c = $(this);
        var col = new JClient.UI.SheetCol(c, self);
        //是否需要合并单元格
        if (col.Merge == "true")
            self.DoSheetMerge = true;

        self.SheetCols.push(col);
    });

    this.ColumnsCount = this.SheetCols.length;
    if (this.AllowSelect == "true") {
        this.ColumnsCount = this.SheetCols.length + 1;
    }
    if (this.AllowIndex == "true") {
        this.ColumnsCount = this.ColumnsCount + 1;
    }

    //是否产生Tr的双击事件，以便快速进入到详情页面
    if(Util.ZjlNotIsNullOrEmpty(this.Panel.attr("isTrdblclick")))
    {
        this.isTrdblclick = this.Panel.attr("isTrdblclick");
    }
    else
    {
        this.isTrdblclick = "true";//默认触发此事件
    }

    //列表中的详情链接所处的Td位置，下标从0开始
    if(Util.ZjlNotIsNullOrEmpty(this.Panel.attr("dblTdIndex")))
    {
        this.dblTdIndex = this.Panel.attr("dblTdIndex");
    }
    else
    {
        this.dblTdIndex = "";
    }

    //列表中的详情链接所处列中的第几个链接位置，下标从0开始
    if(Util.ZjlNotIsNullOrEmpty(this.Panel.attr("dblAIndex")))
    {
        this.dblAIndex = this.Panel.attr("dblAIndex");
    }
    else
    {
        this.dblAIndex = "0";
    }

    this.DataEmptyRow = null;
    this.DataAddNewRow = null;
    this.SelectCbx = null;
    this.DataTable = this.defaultMyTable();
    this.DataTable.appendTo(this.Panel);
    this.SheetPage = new JClient.UI.SheetPage(self);
    if (this.Panel.attr("pageSize") != undefined && this.Panel.attr("pageSize") != "")
        this.SheetPage.PageSize = this.Panel.attr("pageSize");


    this.Page = $("<tfoot><tr class='table-page-row'><td class='foottd' colspan='" + this.ColumnsCount + "'></td></tr></tfoot>").appendTo(this.DataTable);
    this.SheetPage.init(this.Page.find("td:first"));
}

JClient.UI.Sheet.prototype.hide = function () {
    this.Panel.hide();
}

JClient.UI.Sheet.prototype.show = function () {
    this.Panel.show();
}


JClient.UI.Sheet.prototype.Search = function (params) {

    if (params != null && params != undefined) {
        this.SheetPage.SearchCloumns = {}; //清空原來的參數
        this.SheetPage.PageIndex = 1;
        for (var key in params) {
            this.SheetPage.SearchCloumns[key] = params[key];
        }
    }

    this.loadMySheetData();
}


///得數據
JClient.UI.Sheet.prototype.loadMySheetData = function () {
    var self = this;
    var data = this.SheetPage.getSearchPrams();

    var callbackPara = "callback" + ZjlRandom(9999);//jsonp异步回调用
    var callBackParam = null;
    var pageUrl = Addzjl_platform_domain(self.Handler);//补全url参数
    pageUrl = AddRandomParam(pageUrl);//给url参数增加一个随机变量
    pageUrl = encodeURI(pageUrl);

    $.ajax({
        type: "get",
        async: self.pAsync,//默认为true异步，如果async有传值，则以传递过来的值为准
        data: data,
        url: pageUrl,
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback:(callBackParam == null || callBackParam == undefined) ? callbackPara : callBackParam,//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        //headers:{"token":token},
        beforeSend: function(XMLHTTP) {
            XMLHTTP.setRequestHeader("Content-Type","application/x-www-form-urlencoded charset=utf-8");
            XMLHTTP.setRequestHeader("token", data.token);
            //显示loading加载
            var tdLength=$(self.DataTable).find("thead tr td").length;
            $(self.DataTable).find("tbody").html('<tr style="display: table-row;"><td colspan="'+tdLength+'"><div class="loadingWrap"><img src="/images/loading.gif?v=201901260000" alt="" class="w100"></div></td></tr>');
            //分页要隐藏
            self.Page.hide();
        },//这里设置header
        success: function(_RMeta){
            //console.log(_RMeta);
            if(_RMeta != null && _RMeta.code && _RMeta.code == 10045){
                //说明token到期了，则自动本地自动退出，并清除cookie
                UserLocal.loginout(true);
                return;
            }else {
                if(_RMeta.data){
                    _RMeta.data = self.FirstDataDeal(_RMeta.data);
                    _RMeta.data = self.JSONDataDeal(_RMeta.data);
                    _RMeta.data = self.DataDeal(_RMeta.data);
                    var rmetaObj = {};
                    if(_RMeta.data.elements == undefined || _RMeta.data.elements == null)
                    {
                        rmetaObj.elements = _RMeta.data;
                        rmetaObj.elementCount = eval(_RMeta.data).length;
                    }
                    else
                    {
                        rmetaObj = _RMeta.data;
                    }

                    //Tr双击事件跳转至详情页面
                    if(Util.ZjlNotIsNullOrEmpty(self.isTrdblclick) && self.isTrdblclick == "true")
                    {
                        JClient.UI.sheetTrDblclick(self.Panel,self.dblTdIndex,self.dblAIndex);
                    }

                    self.structMySheetData(rmetaObj);
                    self.BeforeLoadDataFinished();
                    self.LoadDataFinished(rmetaObj);
                    self.EndLoadDataFinished();
                }
            }
        },
        error: function(){
            alert("获取数据失败，程序猿正在被狂揍中……");
            return;
        }
    });
}
// 引号、换行符添加转义斜杠
JClient.UI.Sheet.prototype.StrReplaceQuote = function (str){
    str = str.replace(/\'/g, "\\'");
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\r/g, '\\r');
    str = str.replace(/\n/g, '\\n');
    str = str.replace(/\u0085/g, '\\u0085');
    str = str.replace(/\u2028/g, '\\u2028');
    str = str.replace(/\u2029/g, '\\u2029');
    //str = str.replace(/(\r\n)|\n|\r|(\u0085)|(\u2028)|(\u2029)/g, "<br>");
    return str
}
// 在数据显示到页面之前的数据处理方法，传入服务器返回的data数据，返回处理后的数据
JClient.UI.Sheet.prototype.JSONDataDeal = function (data) {
    var self = this;
    var lastData = data;
    // if (data instanceof Array && data.length) {
    //     for (var i in data) {
    //         var item = data[i];
    //         for (var key in item) {
    //             if (typeof item[key] == "string") {
    //                 lastData[i][key] = self.StrReplaceQuote(item[key]);
    //             }
    //         }
    //     }
    // }else
    if (data.elements  && data.elements instanceof Array && data.elements.length) {
        for (var i in data.elements) {
            var item = data.elements[i];
            for (var key in item) {
                if (typeof item[key] == "string") {
                    lastData.elements[i][key] = self.StrReplaceQuote(item[key]);
                }
            }
        }
    }
    return lastData;
}

// 在数据显示到页面之前的数据处理方法，传入服务器返回的data数据，返回处理后的数据(在符号转义JSONDataDeal之前执行)
JClient.UI.Sheet.prototype.FirstDataDeal = function(data) {
    return data;
}
// 在数据显示到页面之前的数据处理方法，传入服务器返回的data数据，返回处理后的数据
JClient.UI.Sheet.prototype.DataDeal = function (data) {
    return data;
}

JClient.UI.Sheet.prototype.hide = function () {
    this.Panel.hide();
}

JClient.UI.Sheet.prototype.BeforeLoadDataFinished = function () {

}
JClient.UI.Sheet.prototype.EndLoadDataFinished = function () {

}
JClient.UI.Sheet.prototype.LoadDataFinished = function (data) {
    if(typeof IM_Loading_Online == "function")
        IM_Loading_Online(this.Panel);
}

JClient.UI.Sheet.prototype.NoData = function () {

}

JClient.UI.Sheet.prototype.CheckColumns = function () {
    return false;
}

///展示數據
JClient.UI.Sheet.prototype.structMySheetData = function (_RMeta) {
    var tbody = this.DataTable.find(">tbody");
    if (this.SelectCbx != null) {
        this.SelectCbx.attr("checked", false);
    }

    tbody.find(">tr").remove();
    var rows = _RMeta.elements;
    this.rowsData = rows;
    this.SheetPage.MaxCount = _RMeta.elementCount;
    if(this.SheetPage.MaxCount == null || this.SheetPage.MaxCount == "null")
    {
        this.SheetPage.MaxCount = 0;
    }
    if (rows != null) {

        //分組功能用
        if (this.DoSheetGroup) {
            this.groupTitle = "";
        }

        for (var i = 0; i < rows.length; i++) {
            var d = rows[i];
            //分組功能用
            if (this.DoSheetGroup) {
                this.loadGroupBy(d);
            }

            var tr = $("<tr>").addClass("tb");

            var id = "";
            if (d[this.PK] != undefined)
                id = d[this.PK];

            tr.attr("id", id);
            if (this.AllowSelect == "true") {
                $("<td style='text-align:center;width:20px;' class='ui-checkbox-td'><label class='ui-checkbox'><input type='checkbox' selectId='" + id + "' class='check' /><span>&nbsp;</span></label></td>").appendTo(tr);
            }
            if (this.AllowIndex == "true") {
                var x = this.SheetPage.PageSize * (this.SheetPage.PageIndex - 1);
                $("<td style='text-align:center;width:20px;' class=\"noTd\">" + (x + i + 1).toString() + "</td>").appendTo(tr);
            }

            for (var j = 0; j < this.SheetCols.length; j++) {
                var c = this.SheetCols[j];
                try {
                    var text = c.getText(d);
                    var error = false;
                    //是否需要验证数据(默认下不是进行验证)
                    if (this.CheckColumns() == true) {
                        if (c.Edit == "true" && c.EditControl == "select") {
                            var controlName = c.EditControl;
                            var ctrl = c.Panel.find(controlName);
                            if (ctrl.length == 1) {
                                var len = ctrl.find("option[title='" + text + "']");
                                if (len.length == 0) {
                                    error = true;
                                }
                            }
                        }
                    }

                    var tdname = '';
                    if (c.TdName != undefined) {
                        tdname = " name='" + d[c.TdName] + "'";
                    }
                    if(text=="结案"){
                        $(tr).find('td[colname="agentName"]').html(text)
                    }
                    var new_td = $("<td class='" + c.Class + "' colName='" + c.Key + "' " + tdname + ">").html(text).appendTo(tr);

                    if (error) {
                        new_td.addClass("col-td-dataerror");
                    }
                    //合并单元格
                    if (this.DoSheetMerge && c.Merge == "true") {
                        var mergeData = c.MergeRegex;
                        for (var key in d) {
                            var reg = new RegExp("({" + key + "})|(%7B" + key + "%7D)", "gi");
                            var value = d[key];
                            mergeData = mergeData.replace(reg, value);
                        }
                        if(mergeData){
                            new_td.attr("mergedata", j + "_" + mergeData);
                        }

                    }

                } catch (e) {
                    $("<td class='" + c.Class + "' colName='" + c.Key + "' " + tdname + ">").html("").appendTo(tr);
                }
            }

            tr.appendTo(tbody);
        }
    }
    if (rows == undefined || rows.length == 0) {
        this.DataEmptyRow.show();
        tbody.append(this.DataEmptyRow);
        this.NoData();
    }
    else {
        this.DataEmptyRow.hide();

        //合并单元格
        if (this.DoSheetMerge)
            this.MergeTable();
    }

    if (this.AllowPaging != "false") {
        this.SheetPage.pageRender();
        //tbody.append(this.Page);
        this.Page.insertAfter(tbody);
    }

    //表格匯總
    var tableTotal = _RMeta.TableTotal;
    if (tableTotal != null && tableTotal != undefined) {
        this.tableTotal(tableTotal);
    }
}
//TableTotal(匯總)
JClient.UI.Sheet.prototype.tableTotal = function (tableTotal) {
    this.Page.find("tr.table-total-row").remove();
    var tr = $("<tr class='table-total-row'></tr>");
    if (this.AllowSelect == "true") {
        $("<td></td>").appendTo(tr);
    }
    if (this.AllowIndex == "true") {
        $("<td></td>").appendTo(tr);
    }

    var has = false;

    for (var i = 0; i < this.SheetCols.length; i++) {
        var td = $("<td class='" + this.SheetCols[i].Class + "'></td>").appendTo(tr);
        var key = this.SheetCols[i].Key;

        if (tableTotal[key] != undefined && tableTotal[key] != "") {
            td.html(tableTotal[key]);
            has = true;
        }
    }
    if (has)
        tr.prependTo(this.Page);
}

//Table合并单元格
JClient.UI.Sheet.prototype.MergeTable = function () {
    var tbody = this.DataTable.find(">tbody");
    var cells = this.DataTable.find("thead tr").children();

    for (var i = (cells.length - 1); i >= 0; i--) {
        var cell = cells.eq(i);
        if (cell.attr("merge") == 'true') {
            var defaultRow = tbody.find("tr:first");
            this.doMerge(tbody, i, defaultRow);
        }
    }
}
//Table合并内部方法
JClient.UI.Sheet.prototype.doMerge = function (tbody, colIndex, defaultRow) {
    var defaultCells = defaultRow.find("td");
    var cell = defaultCells.eq(colIndex);
    var index = tbody.find("tr").index(defaultRow[0]);

    var dataid = cell.attr("mergedata");
    var result = tbody.find("td[mergedata='" + dataid + "']");
    if (result.length > 1) {
        var start = index;
        var len = 0;
        var td = null;
        var next = true;
        result.each(function (i) {
            if (next == false)
                return;

            if (i == 0) {
                td = $(this);
            }

            var x = tbody.find("tr").index($(this).parent()[0]);
            if (x != start + i) {
                next = false;
                len = i;
                //alert(len);
            }
            else if (i != 0) {
                $(this).remove();
                len = i + 1;
            }
        });

        td.attr("rowspan", len).removeAttr("mergedata");


        var p = tbody.find("tr:nth-child(" + (start + len + 1) + ")");
        if (p.length == 1)
            this.doMerge(tbody, colIndex, p);
    }
    else if (result.length == 1) {
        result.eq(0).removeAttr("mergedata");
        var _default = tbody.find("tr").get(index + result.length);
        _default = $(_default);
        if (_default.length == 1)
            this.doMerge(tbody, colIndex, _default);
    }
}

JClient.UI.Sheet.prototype.loadGroupBy = function (row) {
    var tbody = this.DataTable.find(">tbody");
    var _groupTitle = "";
    var _groupText = "";

    for (var i = 0; i < this.GroupByCols.length; i++) {
        var c = this.GroupByCols[i];
        _groupTitle += row[c.Key] + ",";
        _groupText += c.Title + "：<span class='grouptitle'>" + c.getText(row) + "</span>";
    }

    if (this.groupTitle != _groupTitle) {
        var gText = _groupText;
        var gTr = $("<tr class='grouptr' group='" + _groupTitle + "'></tr>").appendTo(tbody);
        $("<td colspan='" + this.ColumnsCount + "' class='grouptd'></td>").appendTo(gTr);
        gTr.find(">td").html("<span class='Expand'>-</span><span style='display:inline-block;margin-left:5px;'>" + gText + "</span>");
        if (this.AllowSelect == "true") {
            var groupCbx = $("<label class='ui-checkbox'><input type='checkbox'  class='groupcheck'/><span>&nbsp;</span></label>").prependTo(gTr.find(">td"));
            groupCbx.click(function () {
                var $cbx = $(this);
                var _tr = $(this).parents("tr:first");
                var next_tr = _tr.nextAll("tr.grouptr:first");
                _tr.nextUntil(next_tr).each(function (i) {
                    if ($cbx.attr("checked") == "checked")
                        $(this).find("input.check").attr("checked", "checked");
                    else
                        $(this).find("input.check").removeAttr("checked");
                });
            });
        }

        gTr.find(".Expand").click(function () {
            var _tr = $(this).parents("tr:first");
            var next_tr = _tr.nextAll("tr.grouptr:first");
            if ($(this).html() == "-") {
                _tr.nextUntil(next_tr).hide();
                $(this).html("+");
            }
            else {
                _tr.nextUntil(next_tr).show();
                $(this).html("-");
            }
        });
        gTr.click(function () {
            if ($(event.srcElement).attr("class") == "Expand")
                return;
            if ($(event.srcElement).attr("class") == "groupcheck")
                return;
            var _tr = $(this);
            var next_tr = _tr.nextAll("tr.grouptr:first");
            if ($(this).find(".Expand").html() == "-") {
                _tr.nextUntil(next_tr).hide();
                $(this).find(".Expand").html("+");
            }
            else {
                _tr.nextUntil(next_tr).show();
                $(this).find(".Expand").html("-");
            }
        });

        this.groupTitle = _groupTitle;
    }
}

//初使化Table
JClient.UI.Sheet.prototype.defaultMyTable = function () {
    var table = $("<table id='table_" + this.Id + "' class='" + this.css + "' border='0' cellspacing='0' cellpadding='0'></table>");
    var th = $("<thead></thead>").appendTo(table);
    var tr = $("<tr></tr>");
    var self = this;
    var c_td;
    this.DataTable = table;
    if (this.AllowSelect == "true") {
        c_td = $("<td><label class='ui-checkbox'><input type='checkbox'/><span>&nbsp;</span></label></td>").appendTo(tr);
        c_td.find('input[type=checkbox]').on('change',function(){
            self.SelectCbx = $(this);
            self.selectAll();
        });
        //pbox.find('tbody').on('click',"input[type='checkbox']",function () {
        //    console.log(1)
        //    self.SelectCbx = $(this);
        //    self.selectAll();
        //});
    }
    if (this.AllowIndex == "true") {
        $("<td style='width:40px;' class=\"noTd\">" + '序号' + "</td>").appendTo(tr);
    }

    for (var i = 0; i < this.SheetCols.length; i++) {
        var td = $("<td class='" + this.SheetCols[i].Class + "' colName='" + this.SheetCols[i].Key + "'></td>");
        var divPanel = $("<div style='display:inline-block;vertical-align:bottom;'></div>").appendTo(td);
        $("<div style='float:left;'></div>").appendTo(divPanel).html(this.SheetCols[i].Title);
        td.appendTo(tr);
        //增加排序
        if (this.SheetCols[i].Order == "true") {
            var up = $("<div class='up-normal' index='" + i + "'></div>").appendTo(divPanel);
            up.click(function () {
                if (self.SheetCols[$(this).attr("index")].Group == "true")
                    self.GroupBy($(this));
                else
                    self.OrderBy($(this));
            });
            var down = $("<div class='down-normal' index='" + i + "'></div>").appendTo(divPanel);
            down.click(function () {
                if (self.SheetCols[$(this).attr("index")].Group == "true")
                    self.GroupBy($(this));
                else
                    self.OrderBy($(this));
            });
        }
        //单元格合并
        if (this.DoSheetMerge && this.SheetCols[i].Merge == "true") {
            td.attr("merge", "true");
        }
    }
    tr.appendTo(th);

    var tb = $("<tbody></tbody>");
    tr = $("<tr></tr>").appendTo(tb);
    var empty_td = $("<td colspan='" + this.ColumnsCount + "'></td>");
    empty_td.html("暂无数据").appendTo(tr);
    tb.appendTo(table);
    if(this.AllowSelect==='true'){
        tb.on('change','input[type="checkbox"].check',function(e){
            var flag=false;
            tb.find('input[type="checkbox"].check').each(function(i,obj){
                if(!$(obj).prop('checked')){
                    flag=true;
                }
            })
            if(flag){
                c_td.find('input[type=checkbox]').prop('checked',false);
            }
            else{
                c_td.find('input[type=checkbox]').prop('checked',true);
            }
        });
        tb.on('click','.ui-checkbox',function(e){
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        });
        tb.on('click','tr',function(){
            $(this).find('input[type="checkbox"]').trigger('click');
        });
    }
    this.DataEmptyRow = tr;
    return table;
}

JClient.UI.Sheet.prototype.OrderBy = function (obj) {
    var self = this;
    this.DoSheetGroup = false;
    var td = obj.parents("td:first");
    var _td = self.DataTable.find(">thead td[colName='" + td.attr("colName") + "']");
    var tr = _td.parent();
    self.SheetPage.OrderColumn = td.attr("colName");
    self.SheetPage.OrderDesc = obj.attr("class").indexOf("down") > -1 ? true : false;
    switch (self.SheetPage.OrderDesc) {
        case true:
            tr.find(".down-on").attr("class", "down-normal");
            tr.find(".up-on").attr("class", "up-normal");
            obj.attr("class", "down-on");
            _td.find(".down-normal").attr("class", "down-on");
            break;
        case false:
            tr.find(".up-on").attr("class", "up-normal");
            tr.find(".down-on").attr("class", "down-normal");
            obj.attr("class", "up-on");
            _td.find(".up-normal").attr("class", "up-on");
            break;
    }

    self.loadMySheetData();
}

JClient.UI.Sheet.prototype.GroupBy = function (obj) {
    var self = this;
    var td = obj.parents("td:first");
    var _td = self.DataTable.find(">thead td[colName='" + td.attr("colName") + "']");
    self.SheetPage.OrderColumn = td.attr("colName");
    self.SheetPage.OrderDesc = obj.attr("class").indexOf("down") > -1 ? true : false;
    this.DoSheetGroup = true;
    this.GroupByCols = [];

    for (var i = 0; i < this.SheetCols.length; i++) {
        if (this.SheetCols[i].Key == td.attr("colName")) {
            this.GroupByCols.push(this.SheetCols[i]);
            break;
        }
    }
    var tr = _td.parent();
    switch (self.SheetPage.OrderDesc) {
        case true:
            tr.find(".down-on").attr("class", "down-normal");
            tr.find(".up-on").attr("class", "up-normal");
            obj.attr("class", "down-on");
            _td.find(".down-normal").attr("class", "down-on");
            break;
        case false:
            tr.find(".up-on").attr("class", "up-normal");
            tr.find(".down-on").attr("class", "down-normal");
            obj.attr("class", "up-on");
            _td.find(".up-normal").attr("class", "up-on");
            break;
    }

    self.loadMySheetData();
}

JClient.UI.Sheet.prototype.selectAll = function () {
    var tbody = this.DataTable.find(">tbody");
    var check = this.SelectCbx.prop("checked");

    tbody.find("input.check,input.groupcheck").each(function () {
        if (check)
            $(this).prop("checked",true);
        else
            $(this).prop("checked", false);
    });
}

JClient.UI.Sheet.prototype.selectAllSec = function (check) {
    var tbody = this.DataTable.find(">tbody");
    tbody.find("input.check").each(function () {
        $(this).prop("checked", check);
    });
}

JClient.UI.Sheet.prototype.getSelectedIds = function () {
    var tbody = this.DataTable.find(">tbody");
    var ids = "";
    tbody.find("input.check").each(function () {
        if ($(this).is(":checked") == true)
            ids += $(this).attr("selectId") + ',';
    });

    if (ids.length > 0)
        ids = ids.substring(0, ids.length - 1);

    return ids;
}
//获取单条选中行的对象
JClient.UI.Sheet.prototype.getSelectedObj = function () {
    var self = this;
    var rowData = this.rowsData;
    var obj = {};
    var id = self.getSelectedIds();
    $.each(rowData, function (i, item) {
        if (id == item[self.PK].toString())
            obj = item;
    });
    return obj;
}
//获取指定ID单条选中行的对象
JClient.UI.Sheet.prototype.getSelectedObjById = function (pk) {
    var self = this;
    var rowData = this.rowsData;
    var obj = {};
    var id =pk;
    $.each(rowData, function (i, item) {
        if (id == item[self.PK].toString())
            obj = item;
    });
    return obj;
}

JClient.UI.Sheet.prototype.getSelectedCounts = function () {
    var tbody = this.DataTable.find(">tbody");
    var counts = 0;
    tbody.find("input.check").each(function () {
        if ($(this).is(":checked") == true)
            counts += 1;

    });
    return counts;
}

//Add Start...
JClient.UI.Sheet.prototype.NeedToAddNewRow = function ($tr) {
    var DataNewRow = this.DataAddNewRow;

    if (this.DataEmptyRow != null)
        this.DataEmptyRow.hide();

    if (DataNewRow == null) {
        var tr = null;
        if ($tr != null)
            tr = $tr;
        else
            tr = $("<tr data='addrow'></tr>").insertBefore(this.Page);
        tr.attr("id", "-1");

        if (this.AllowSelect == "true")
            $("<td></td>").appendTo(tr);

        if (this.AllowIndex == "true")
            $("<td></td>").appendTo(tr);

        for (var j = 0; j < this.SheetCols.length; j++) {
            var c = this.SheetCols[j];
            var td = $("<td></td>").appendTo(tr);

            c.AddFor(td);
        }

        this.DataAddNewRow = tr;
    }
    else {
        var tbody = this.DataTable.find("tbody");
        if (tbody.find("tr[data='addrow']").length == 0)
            DataNewRow.insertBefore(this.Page);
        DataNewRow.show().find("input").val("");
    }

    return this.DataAddNewRow;
}

JClient.UI.Sheet.prototype.CancelAddRowFinish = function () {
    if (this.DataAddNewRow != null)
        this.DataAddNewRow.hide();
}

//重载ApproveAddRowFinish 方法

JClient.UI.Sheet.prototype.ApproveAddRowFinish = function (param) {
    var row = this.DataAddNewRow;
    var id = row.attr("id");
    var self = this;
    var data = {};
    if (param != null && param != undefined) {
        data = param;
    }
    data[this.PK] = id;
    data["_PK"] = this.PK;
    data["call"] = "addrow";
    var start = 0;
    if (this.AllowSelect == "true")
        start = 1;

    if (this.AllowIndex == "true")
        start += 1;

    var colTds = [];

    row.children().each(function (i) {
        if (i < start)
            return;
        var td = $(this);
        var c = self.SheetCols[i - start];

        if (c.Type == "Col") {
            var value = c.getValue(td);

            if (c.EditControl == "select") {
                data[c.Key + "_value"] = td.find("option:selected").val();
            }

            var _key = "$u_" + c.Key;
            data[_key] = value;
            data[c.Key] = value;
        }
    });

    if (this.CheckValidates(data) == false)
        return;

    var returnValue = false;

    $.ajax({
        url: self.Handler,
        data: data,
        type: 'POST',
        dataType: 'json',
        async: self.pAsync,//默认为true异步，如果async有传值，则以传递过来的值为准
        success: function (_RMeta) {
            if (_RMeta.ClientInfo.Status) {
                returnValue = true;
                self.CancelAddRowFinish();
                self.loadMySheetData();
            }
            else {
                returnValue = false;
            }
        },
        fail: function () {
            returnValue = false;
        }
    });

    return returnValue;
}
//Add End...

JClient.UI.Sheet.prototype.NeedToEditRow = function (obj) {
    var row = $(obj).parents("td:first").parent();
    var id = row.attr("id");
    var self = this;
    var start = 0;
    if (this.AllowSelect == "true")
        start = 1;
    if (this.AllowIndex == "true")
        start += 1;

    row.children().each(function (i) {
        if (i < start)
            return;
        var td = $(this);
        var c = self.SheetCols[i - start];

        if (c.Edit == "true") {//c.Type == "Col" &&
            c.EditFor(td);
        }
    });
}

JClient.UI.Sheet.prototype.CheckValidates = function (data) {
    return true;
}

JClient.UI.Sheet.prototype.ApproveEditRowFinish = function (obj, param) {

    var row = $(obj).parents("td:first").parent();
    var id = row.attr("id");
    var self = this;
    var data = {};
    if (undefined != param) {
        data = param;
    }
    data[this.PK] = id;
    data["call"] = "updaterow";
    var content = "";

    var start = 0;
    if (this.AllowSelect == "true")
        start = 1;
    if (this.AllowIndex == "true")
        start += 1;

    var colTds = [];
    var i_c = null;

    row.children().each(function (i) {
        if (i < start)
            return;
        var td = $(this);
        var c = self.SheetCols[i - start];

        if (c.Edit == "true") {//c.Type == "Col" &&
            var value = c.getValue(td);
            if (c.EditControl == "select") {
                data[c.Key + "_value"] = td.find("option:selected").val();
            }

            data[c.Key] = value.replace(/'/g, "‘");
            colTds.push(td);
            i_c = c;
            try {
                if (value != td.attr("title")) {
                    content += c.Title + ": " + td.attr("title") + "->" + value + "; ";
                }
            } catch (e) {
            }
        }

    });

    data["Content"] = content.replace(/'/g, "‘"); //修改單引號問題

    if (this.CheckValidates(data) == false)
        return;

    var returnValue = false;

    $.ajax({
        url: self.Handler,
        data: data,
        type: 'POST',
        dataType: 'json',
        async: self.pAsync,//默认为true异步，如果async有传值，则以传递过来的值为准
        success: function (_RMeta) {

            //alert(_RMeta);
            if (_RMeta.ClientInfo.Status) {
                returnValue = true;
                for (var x = 0; x < colTds.length; x++) {
                    i_c.ApproveEditFinish(colTds[x]);
                }
            }
            else {
                returnValue = false;
            }
        },
        fail: function () {
            returnValue = false;
        }
    });

    return returnValue;
}


JClient.UI.Sheet.prototype.CancelEditRowFinish = function (obj) {
    var row = $(obj).parents("td:first").parent();
    var id = row.attr("id");
    var self = this;

    var start = 0;
    if (this.AllowSelect == "true")
        start = 1;
    if (this.AllowIndex == "true")
        start += 1;

    row.children().each(function (i) {
        if (i < start)
            return;
        var td = $(this);
        var c = self.SheetCols[i - start];

        if (c.Edit == "true") {//c.Type == "Col" &&
            c.CancelEditFor(td);
        }
    });

    return true;
}

JClient.UI.Sheet.prototype.DeleteRow = function (id) {
    var tbody = this.DataTable.find("tbody");
    var row = tbody.find("tr[id='" + id + "']");
    var data = {};
    data["id"] = id;
    data["call"] = "DeleteRow";
    var self = this;

    var rValue = false;

    $.ajax({
        url: self.Handler,
        data: data,
        type: 'POST',
        dataType: 'json',
        async: self.pAsync,//默认为true异步，如果async有传值，则以传递过来的值为准
        success: function (_RMeta) {
            if (_RMeta.ClientInfo.Status) {
                row.remove();
                self.SheetPage.MaxCount = self.SheetPage.MaxCount - 1;
                self.SheetPage.pageRender();
                rValue = true;
            }
            else {
                rValue = false;
            }
        },
        fail: function () {

        }
    });

    return rValue;
}


JClient.UI.SheetCol = function (panel, sheet) {
    this.Panel = panel;
    this.Panel.hide();
    this.Key = this.Panel.attr("key");
    this.Title = this.Panel.attr("title");
    this.Type = this.Panel.attr("type");
    this.Class = this.Panel.attr("class");
    this.Edit = this.Panel.attr("edit");
    this.EditControl = this.Panel.attr("editControl");
    this.Sheet = sheet;
    this.TdName = this.Panel.attr("tdname");
    this.Order = this.Panel.attr("order");
    this.OrderToFirst = this.Panel.attr("orderToFirst"); //排序栏放在第一列,暫時未用到
    this.Group = this.Panel.attr("group"); //數據分組用的
    this.Merge = this.Panel.attr("merge"); //单元格合并
    this.MergeRegex = this.Panel.attr("mergeRegex"); //单元格合并表达式

    if (this.Merge == "true" && (this.MergeRegex == undefined || this.MergeRegex == ""))
        this.MergeRegex = "{" + this.Key + "}";
}

JClient.UI.SheetCol.prototype.getText = function (row) {
    var rValue = "";
    try {
        switch (this.Type) {
            case "Col":
                rValue = row[this.Key];
                break;
            case "ColTemplate":
                var html = this.Panel.html();
                for (var key in row) {
                    var reg = new RegExp("({" + key + "})|(%7B" + key + "%7D)", "gi");
                    var value = row[key];
                    html = html.replace(reg, value);
                }
                try {
                    var method_reg = new RegExp("\\^[^\^]+\\([^\^]*\\)\\$", "gi");
                    var array = html.match(method_reg);

                    if (array != null && array.length) {
                        for (var i = 0; i < array.length; i++) {
                            var method = array[i];
                            var str = eval(method.replace("^", "").replace("$", ""));
                            html = html.replace(method, str);
                        }
                    }
                } catch (e) {
                }

                rValue = "<span>" + html + "</span>";
                break;
            case "ColMethod":
                var html = this.Panel.html();
                for (var key in row) {
                    var reg = new RegExp("({" + key + "})|(%7B" + key + "%7D)", "gi");
                    var value = row[key];
                    html = html.replace(reg, value);
                }
                rValue = eval(html);
                break;
        }
    }
    catch (e) {
    }

    return rValue;
}

JClient.UI.SheetCol.prototype.getValue = function (td) {
    var input = td.find(".col-td-edit");

    if (input.length == 0)
        return "";

    if (input.get(0).tagName == "SELECT") {
        return input.find("option:selected").text();
    }

    return input.val();
}

JClient.UI.SheetCol.prototype.AddFor = function (td) {
    if (this.Type == "Col" && this.Edit == "true")
        this.EditFor(td);
    else {
        var text = this.getText([]);
        td.html(text);
    }
}

JClient.UI.SheetCol.prototype.EditFor = function (td) {
    if (this.EditControl == undefined || this.EditControl == "") {
        var input = td.find("input");
        if (input.length == 0) {
            var html = td.html();
            var _html = td.text();
            var hasControl = $(html).length > 0;
            var title = hasControl ? html : _html;
            td.attr("title", title);
            td.html("");
            input = $("<input class='col-td-edit'  type='text'>").appendTo(td);
            input.val(_html);
        }
    }
    else {
        var controlName = this.EditControl;

        var ctrl = this.Panel.find(controlName);
        if (ctrl.length == 1) {
            var html = td.html();
            var _html = $.trim(td.text());
            var hasControl = $(html).length > 0;
            var title = hasControl ? html : _html;
            td.attr("title", title);
            td.html("");
            var c = ctrl.clone();
            c.appendTo(td);
            c.find("option[title='" + _html + "']").attr("selected", true);
            c.addClass("col-td-edit");
            c.addClass("select");
            this.setControlValue(c, _html);
        }
        else {
            var input = td.find(controlName);
            if (input.length == 0) {
                var html = td.html();
                var _html = td.text();
                var hasControl = $(html).length > 0;
                var title = hasControl ? html : _html;
                td.attr("title", title);
                td.html("");
                input = $("<" + controlName + " class='col-td-edit'>").appendTo(td);
                input.val(html);
            }
        }
    }

}
//對控件進行賦值
JClient.UI.SheetCol.prototype.setControlValue = function (control, value) {
    switch (this.EditControl.toLowerCase()) {
        case "select":
            control.find("option[title='" + value + "']").attr("selected", true);
            control.addClass("select");
            break;
        case "input":
            var type = control.attr("type");
            if (type == "checkbox" || type == "radiobox") {
                if (value == "true" || value == true || value == "checked")
                    control.attr("checked", value);
            }
            else if (type == "text")
                control.val(value);
            else if (type == "file")
                break;
            else
                control.val(value);
            break;
        default:
            control.val(value);
    }
}


JClient.UI.SheetCol.prototype.CancelEditFor = function (td) {
    var input = td.find(".col-td-edit");
    if (input.length == 1) {
        var html = td.attr("title");
        td.html(html);
    }
}

JClient.UI.SheetCol.prototype.ApproveEditFinish = function (td) {
    var input = td.find(".col-td-edit");
    var html = input.val();
    if (input.get(0).tagName == "SELECT") {
        html = $.trim(input.find("option:selected").text());
    }
    td.html(html).attr("title", html).removeClass("col-td-dataerror");
}

var Table_Page_Message = "共 <span >{MaxCount}</span> 条记录，每页 <span >{PageSize}</span> 条，当前第<span > {PageIndex}/{PageCount}</span> 页";
var Table_Page_First = "第一页";
var Table_Page_Prev = "上一页";
var Table_Page_Next = "下一页";
var Table_Page_Last = "最末页";

JClient.UI.SheetPage = function (sheet) {
    this.PageSize = 20; //每頁多少筆
    this.PageIndex = 1; //當前頁
    this.PageCount = 1; //總頁數
    this.MaxCount = 0; //總筆數
    this.OrderColumn = "";
    this.OrderDesc = false;
    this.SearchCloumns = {};
    this.Sheet = sheet;
}

JClient.UI.SheetPage.prototype.getSearchPrams = function () {
    var data = this.SearchCloumns;
    data["pageSize"] = this.PageSize;
    data["pageNum"] = this.PageIndex;
    data["orderColumn"] = this.OrderColumn;
    data["orderDesc"] = this.OrderDesc;
    return data;
}

JClient.UI.SheetPage.prototype.init = function (panel) {
    var self = this;
    this.Panel = panel;
    this.Sheet.Page.hide();
    // this.Title = $("<div class='pageleft'></div>").html(Table_Page_Message).appendTo(this.Panel);
    // this.PageGo = {
    //     PageFirst: $("<a href='javascript:void(0)' class='pagefirst'></a>").html(Table_Page_First),
    //     PagePrev: $("<a  href='javascript:void(0)' class='pageprev'></a>").html(Table_Page_Prev),
    //     PageNext: $("<a  href='javascript:void(0)' class='pagenext'></a>").html(Table_Page_Next),
    //     PageLast: $("<a  href='javascript:void(0)' class='pagelast'></a>").html(Table_Page_Last)
    // };

    // this.PageRight = $("<div class='pageright' ></div>").appendTo(this.Panel);
    // this.PageRight.append(this.PageGo.PageFirst).append(this.PageGo.PagePrev).append(this.PageGo.PageNext).append(this.PageGo.PageLast);
    // this.PageRight = $("<div class='clear'></div>").appendTo(this.Panel);
    var pageDom = self.getDom(1,1,this.PageSize,0);
    this.Panel.html(pageDom);

}

JClient.UI.SheetPage.prototype.getDom = function(PageIndex,PageCount,PageSize,MaxCount) {
    var pageDom = '',
        boxDom = '',
        title = Table_Page_Message;
    title = RegString("MaxCount", title, this.MaxCount);
    title = RegString("PageSize", title, this.PageSize);
    title = RegString("PageIndex", title, this.PageIndex);
    title = RegString("PageCount", title, this.PageCount);
    boxDom += '<div class="paging clearfix"><div class="pageleft">'+title+'</div>';

    // 没有数据，不显示统计和分页
    if(!MaxCount || MaxCount<1){
        return '';
    }
    // 页数小于2时不显示分页
    if(!PageCount || PageCount<2){
        return boxDom;
    }

    var num = PageCount, // 总页数
        pageNum = PageIndex; // 当前页数
    pageDom += '<li class="prev'+(pageNum<=1?" disabled":"")+'"><a href="javascript:void(0)" event-type="prev"><</a></li>';
    if(num>9){
        var beforeDom = '',
            insetDom = '',
            afterDom = '',
            ellipsis = '<li><span class="text">...</span></li>';
        for(var i=1;i<=num;i++){
            if(pageNum<5){
                i<=5 && (beforeDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>');
            }else{
                i==1 && (beforeDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>');
            }
            if(pageNum>num-4){
                i>=num-4 && (afterDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>');
            }else{
                i==num && (afterDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>');
            }
            if(pageNum>=5 && pageNum<=num-4){
                i<=pageNum+2 && i>=pageNum-2 && (insetDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>');
            }
        }
        pageDom += beforeDom + ellipsis + insetDom + (insetDom ? ellipsis : '') + afterDom;
    }else{
        for(var i=1;i<=num;i++){
            pageDom += '<li class="'+(pageNum==i?"active":"")+'"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>';
        }
    }

    pageDom += '<li class="next'+(pageNum>=num?" disabled":"")+'"><a href="javascript:void(0)" event-type="next">></a></li>';

    boxDom += '<ul class="pagination pageright" page-count="'+num+'">'+pageDom+'</ul></div>';
    return boxDom;
}

JClient.UI.SheetPage.prototype.pageRender = function () {
    var self = this;
    this.Sheet.Page.show();
    var i = Math.round(this.MaxCount / this.PageSize);
    var j = this.MaxCount / this.PageSize;

    if (i < j) {
        this.PageCount = i + 1;
    }
    else
        this.PageCount = i;

    if (this.PageCount == 0)
        this.PageCount = 1;

    var pageDom = self.getDom(this.PageIndex,this.PageCount,this.PageSize,this.MaxCount);
    this.Sheet.Page.find('.foottd').html(pageDom);
    // 页码点击事件
    this.Sheet.Page.find('.foottd').off('click').on('click','li a',function(e){
        var $this = $(this);
        var nowPage = self.PageIndex;
        if($this.parent().hasClass('active') || $this.parent().hasClass('disabled')){
            return
        }
        if(!$this.attr("event-type")){
            nowPage = parseInt($this.attr("data-page"));
        }else if($this.attr("event-type")=='prev'){
            if(nowPage<=1){
                return false;
            }else{
                nowPage--;
            }
        }else if($this.attr("event-type")=='next'){
            if(nowPage>=parseInt($('.paging .pagination').attr("page-count"))){
                return false;
            }else{
                nowPage++;
            }
        }
        self.goPageIndex(nowPage);
    });

    // return;
    // var title = Table_Page_Message;

    // title = RegString("MaxCount", title, this.MaxCount);
    // title = RegString("PageSize", title, this.PageSize);
    // title = RegString("PageIndex", title, this.PageIndex);
    // title = RegString("PageCount", title, this.PageCount);
    // this.Title.html(title);
    // var self = this;
    // if (this.PageIndex > 1) {
    //     this.PageGo.PageFirst.removeAttr("disabled");
    //     this.PageGo.PageFirst.unbind("click").click(function () {
    //         self.goPageIndex(1);
    //     });
    // }
    // else {

    //     this.PageGo.PageFirst.unbind("click").attr("disabled", true).attr("disabled", "disabled");
    // }

    // if (this.PageIndex < this.PageCount) {
    //     this.PageGo.PageLast.removeAttr("disabled");
    //     this.PageGo.PageLast.unbind("click").click(function () {
    //         self.goPageIndex(self.PageCount);
    //     });
    // }
    // else {
    //     this.PageGo.PageLast.unbind("click").attr("disabled", true).attr("disabled", "disabled");
    // }

    // if (this.PageIndex > 1) {
    //     this.PageGo.PagePrev.removeAttr("disabled");
    //     this.PageGo.PagePrev.unbind("click").click(function () {
    //         self.goPageIndex(self.PageIndex - 1);
    //     });
    // }
    // else {
    //     this.PageGo.PagePrev.unbind("click").attr("disabled", true).attr("disabled", "disabled");
    // }

    // if (this.PageIndex < this.PageCount) {
    //     this.PageGo.PageNext.removeAttr("disabled");
    //     this.PageGo.PageNext.unbind("click").click(function () {
    //         self.goPageIndex(self.PageIndex + 1);
    //     });
    // }
    // else {
    //     this.PageGo.PageNext.unbind("click").attr("disabled", true).attr("disabled", "disabled");
    // }
}
//去到某一頁
JClient.UI.SheetPage.prototype.goPageIndex = function (index) {
    this.PageIndex = index;
    this.Sheet.loadMySheetData();
}

function RegString(key, _str, value) {
    var reg = new RegExp("({" + key + "})|(%7B" + key + "%7D)", "g");
    return _str.replace(reg, value);
}


///**************************************************************
/// 以下為Sheet的繼承和擴展控件
/// Hiden 2014/10/08

JClient.UI.GroupSheet = function (divId) {
    var self = this;
    this.Panel = $("#" + divId);
    this.GroupSheetCols = [];
    this.Panel.find("div[type='Group']").each(function (i) {
        var g = $(this);
        self.GroupSheetCols.push(new JClient.UI.GroupSheetCol(g, self));
    });

    JClient.UI.Sheet.call(this, divId);
}

JClient.Inherits(JClient.UI.GroupSheet, JClient.UI.Sheet);

//包含分組表頭
JClient.UI.GroupSheet.prototype.defaultMyTable = function () {
    var table = $("<table id='table_" + this.Id + "' class='" + this.css + "' ></table>");
    var th = $("<thead></thead>").appendTo(table);
    var groupTr = $("<tr></tr>");
    var tr = $("<tr></tr>");
    var self = this;
    this.DataTable = table;

    if (this.AllowSelect == "true") {
        var c_td = $("<td rowspan='2'><label class='ui-checkbox'><input type='checkbox'/><span>&nbsp;</span></label></td>").appendTo(groupTr);
        c_td.find("input[type='checkbox']").click(function () {
            self.SelectCbx = $(this);
            self.selectAll();
        });
    }
    if (this.AllowIndex == "true") {
        $("<td style='width:40px;' rowspan='2' class=\"noTd\">" + '序号' + "</td>").appendTo(groupTr);
    }

    for (var i = 0; i < this.GroupSheetCols.length; i++) {
        var g = this.GroupSheetCols[i];
        var td = $("<td group='" + g.Title + "' class='" + g.Class + "' >" + g.Title + "</td>");
        td.attr("colspan", g.SheetCols.length);
        td.appendTo(groupTr);

        for (var j = 0; j < g.SheetCols.length; j++) {
            var _td = $("<td class='" + g.SheetCols[j].Class + "' colName='" + g.SheetCols[j].Key + "' supergroup='" + g.Title + "'></td>");
            var divPanel = $("<div style='display:inline-block;vertical-align:bottom;'></div>").appendTo(_td);
            $("<div style='float:left;'></div>").appendTo(divPanel).html(g.SheetCols[j].Title);
            _td.appendTo(tr);

            if (j == 0 || g.SheetCols[j].ControlNext == "true")
                _td.addClass("first");

            //增加排序
            if (g.SheetCols[j].Order == "true") {
                var up = $("<div class='up-normal'></div>").appendTo(divPanel);
                up.click(function () {
                    self.OrderBy($(this));
                });
                var down = $("<div class='down-normal'></div>").appendTo(divPanel);
                down.click(function () {
                    self.OrderBy($(this));
                });
                //作記憶用,在表重新構造時有用
                if (self.SheetPage != null && g.SheetCols[j].Key == self.SheetPage.OrderColumn) {
                    if (self.SheetPage.OrderDesc) {
                        down.attr("class", "down-on");
                    }
                    else
                        up.attr("class", "up-on");
                }
            }
        }
    }
    groupTr.appendTo(th);
    tr.appendTo(th);

    var tb = $("<tbody></tbody>");
    tr = $("<tr></tr>").appendTo(tb);
    var empty_td = $("<td colspan='" + this.ColumnsCount + "'></td>");
    empty_td.html("沒有数据").appendTo(tr);
    tb.appendTo(table);
    this.DataEmptyRow = tr;
    return table;
}

///展示數據
JClient.UI.GroupSheet.prototype.structMySheetData = function (_RMeta) {
    var tbody = this.DataTable.find(">tbody");
    if (this.SelectCbx != null) {
        this.SelectCbx.attr("checked", false);
    }

    tbody.find(">tr").remove();//TableRowsCount
    var rows = _RMeta.elements;
    this.SheetPage.MaxCount = _RMeta.elementCount;
    if (rows != null) {
        for (var i = 0; i < rows.length; i++) {
            var d = rows[i];

            var tr = $("<tr>").addClass("tb").appendTo(tbody);

            var id = "";
            if (d[this.PK] != undefined)
                id = d[this.PK];

            tr.attr("id", id);

            if (this.AllowSelect == "true") {
                $("<td style='text-align:center;width:20px;' class='ui-checkbox-td'><label class='ui-checkbox'><input type='checkbox' selectId='" + id + "' class='check' /><span>&nbsp;</span></label></td>").appendTo(tr);
            }
            if (this.AllowIndex == "true") {
                var x = this.SheetPage.PageSize * (this.SheetPage.PageIndex - 1);
                $("<td style='text-align:center;width:20px;' class=\"noTd\">" + (x + i + 1).toString() + "</td>").appendTo(tr);
            }

            for (var j = 0; j < this.GroupSheetCols.length; j++) {
                var g = this.GroupSheetCols[j];
                for (var k = 0; k < g.SheetCols.length; k++) {
                    var c = g.SheetCols[k];
                    try {
                        var text = c.getText(d);
                        var error = false;
                        if (this.CheckColumns() == true) {
                            if (c.Edit == "true" && c.EditControl == "select") {
                                var controlName = c.EditControl;
                                var ctrl = c.Panel.find(controlName);
                                if (ctrl.length == 1) {
                                    var len = ctrl.find("option[title='" + text + "']");
                                    if (len.length == 0) {
                                        error = true;
                                    }
                                }
                            }
                        }

                        var tdname = '';
                        if (c.TdName != undefined) {
                            tdname = " name='" + d[c.TdName] + "'";
                        }

                        var new_td = $("<td class='" + c.Class + "' colName='" + c.Key + "' " + tdname + ">").html(text).appendTo(tr);

                        if (error) {
                            new_td.addClass("col-td-dataerror");
                        }
                    } catch (e) {
                        $("<td class='" + c.Class + "' colName='" + c.Key + "' " + tdname + ">").html("").appendTo(tr);
                    }
                }
            }
        }
    }
    if (rows == undefined || rows.length == 0) {
        this.DataEmptyRow.show();
        tbody.append(this.DataEmptyRow);
        this.NoData();
    }
    else
        this.DataEmptyRow.hide();

    if (this.AllowPaging != "false") {
        this.SheetPage.pageRender();
        //tbody.append(this.Page);
        this.Page.insertAfter(tbody);
    }

}

JClient.UI.GroupSheet.prototype.OrderBy = function (obj) {
    var self = this;
    var td = obj.parents("td:first");
    var _td = self.DataTable.find(">thead td[colName='" + td.attr("colName") + "']");
    var tr = _td.parent();
    self.SheetPage.OrderColumn = td.attr("colName");
    self.SheetPage.OrderDesc = obj.attr("class").indexOf("down") > -1 ? true : false;
    switch (self.SheetPage.OrderDesc) {
        case true:
            tr.find(".down-on").attr("class", "down-normal");
            tr.find(".up-on").attr("class", "up-normal");
            obj.attr("class", "down-on");
            _td.find(".down-normal").attr("class", "down-on");
            break;
        case false:
            tr.find(".up-on").attr("class", "up-normal");
            tr.find(".down-on").attr("class", "down-normal");
            obj.attr("class", "up-on");
            _td.find(".up-normal").attr("class", "up-on");
            break;
    }
    //調整順序
    var groupTitle = _td.attr("supergroup");
    var startIndex = 0;
    for (var i = 0; i < self.GroupSheetCols.length; i++) {
        if (self.GroupSheetCols[i].Title == groupTitle && i > 0) {
            var g = self.GroupSheetCols[i];
            self.GroupSheetCols.splice(i, 1);
            self.GroupSheetCols.splice(0, 0, g);
            startIndex = i;
            break;
        }
    }

    //調整表頭
    if (startIndex != 0) {
        var parent = self.DataTable.parent();
        self.DataTable.remove();
        self.DataTable = self.defaultMyTable().appendTo(parent);
        self.DataTable.hide();
    }
    self.loadMySheetData();
}

//組織好數據之后立即執行
JClient.UI.GroupSheet.prototype.BeforeLoadDataFinished = function () {
    var self = this;
    var arrayControlNextHasExpand = [];

    for (var i = 0; i < this.GroupSheetCols.length; i++) {
        var g = this.GroupSheetCols[i];
        if (g.Expanded == false) {
            var hasAutoHide = false;
            for (var j = 0; j < g.SheetCols.length; j++) {
                var c = g.SheetCols[j];
                if (c.AutoHide == "true") {
                    var td = this.DataTable.find(">thead td[supergroup='" + g.Title + "'][colName='" + c.Key + "']");
                    td.hide();
                    this.DataTable.find(">tbody td[colName='" + c.Key + "']").hide();
                    hasAutoHide = true;
                }
                else if (c.ControlNext == "true") {
                    var colTd = this.DataTable.find(">thead td[supergroup='" + g.Title + "'][colName='" + c.Key + "']");
                    var Expand = colTd.find(".Expand");
                    if (Expand.length == 0) {
                        Expand = $("<span class='Expand' index='" + j + "' parentindex='" + i + "'>+</span>").appendTo(colTd);
                        Expand.click(function () {
                            var index = parseInt($(this).attr("index"));
                            var parentindex = parseInt($(this).attr("parentindex"));
                            var _g = self.GroupSheetCols[parentindex];
                            var _g_c = _g.SheetCols[index];
                            var _colTd = self.DataTable.find(">thead td[supergroup='" + _g.Title + "'][colName='" + _g_c.Key + "']");
                            var $expand = _colTd.find(".Expand");
                            var expend = $expand.html() == "+" ? false : true;
                            var add = 0;

                            for (var x = (index + 1); x < _g.SheetCols.length; x++) {
                                var _c = _g.SheetCols[x];
                                if (_c.AutoHide == "true") {
                                    var td = self.DataTable.find(">thead td[supergroup='" + _g.Title + "'][colName='" + _c.Key + "']");
                                    var tds = self.DataTable.find(">tbody td[colName='" + _c.Key + "']");

                                    if (!expend) {
                                        if (td.css("display") == "none")
                                            add++;
                                        td.show();
                                        tds.show();
                                    } else {
                                        if (td.css("display") != "none")
                                            add++;
                                        td.hide();
                                        tds.hide();
                                    }
                                }
                                else
                                    break;
                            }

                            if (!expend)
                                $expand.html("-");
                            else
                                $expand.html("+");
                            var _groupTd = self.DataTable.find(">thead td[group='" + _g.Title + "']");
                            var old_colspan = parseInt(_groupTd.attr("colspan"));
                            if (!expend)
                                _groupTd.attr("colspan", old_colspan + add);
                            else
                                _groupTd.attr("colspan", old_colspan - add);

                            self.OuterExpand(!expend, $expand);
                        });
                    }
                    else {
                        if (Expand.html() == "-") {
                            arrayControlNextHasExpand.push(Expand);
                        }
                    }
                }
            }

            var groupTd = this.DataTable.find(">thead td[group='" + g.Title + "']");
            groupTd.attr("colspan", g.Colspan);
            if (hasAutoHide) {
                var Expand = groupTd.find(".Expand");
                if (Expand.length == 0) {
                    Expand = $("<span class='Expand' index='" + i + "'>+</span>").appendTo(groupTd);
                    Expand.click(function () {
                        var index = $(this).attr("index");
                        self.Expand(index, $(this));
                    });
                }
            }
        }
        else {
            var groupTd = this.DataTable.find(">thead td[group='" + g.Title + "']");

            if (true) {
                var Expand = groupTd.find(".Expand");
                if (Expand.length == 0) {
                    Expand = $("<span class='Expand' index='" + i + "'>-</span>").appendTo(groupTd);
                    Expand.click(function () {
                        var index = $(this).attr("index");
                        self.Expand(index, $(this));
                    });
                }
            }
        }
    }
    //記憶ControlNext己被展開的部分
    for (var ii = 0; ii < arrayControlNextHasExpand.length; ii++) {
        arrayControlNextHasExpand[ii].html("+");
        arrayControlNextHasExpand[ii].click();
    }

    //設置各Group邊框
    this.DataTable.find(">thead td.first").each(function (i) {
        var colName = $(this).attr("colName");
        self.DataTable.find(">tbody td[colName='" + colName + "']").addClass("first");
    });

    this.DataTable.show();
}

JClient.UI.GroupSheet.prototype.Expand = function (groupIndex, expandObj) {
    var self = this;
    var _g = self.GroupSheetCols[groupIndex];

    if (_g.Expanded == false) {
        for (var j = 0; j < _g.SheetCols.length; j++) {
            var c = _g.SheetCols[j];
            if (c.AutoHide == "true") {
                var td = self.DataTable.find(">thead td[supergroup='" + _g.Title + "'][colName='" + c.Key + "']");
                td.show();
                self.DataTable.find(">tbody td[colName='" + c.Key + "']").show();
            }
        }
        _g.Expanded = true;
        var _groupTd = self.DataTable.find(">thead td[group='" + _g.Title + "']");
        _groupTd.attr("colspan", _g.SheetCols.length);
        _groupTd.find(">.Expand").html("-");
        self.DataTable.find(">thead td[supergroup='" + _g.Title + "'] .Expand").html("-");
    }
    else {
        for (var j = 0; j < _g.SheetCols.length; j++) {
            var c = _g.SheetCols[j];
            if (c.AutoHide == "true") {
                var td = self.DataTable.find(">thead td[supergroup='" + _g.Title + "'][colName='" + c.Key + "']");
                td.hide();
                self.DataTable.find(">tbody td[colName='" + c.Key + "']").hide();
            }
        }
        _g.Expanded = false;
        var _groupTd = self.DataTable.find(">thead td[group='" + _g.Title + "']");
        _groupTd.attr("colspan", _g.Colspan);
        _groupTd.find(">.Expand").html("+");
        self.DataTable.find(">thead td[supergroup='" + _g.Title + "'] .Expand").html("+");
    }

    self.OuterExpand(!_g.Expanded, expandObj);
}

JClient.UI.GroupSheet.prototype.OuterExpand = function (expanded, expandObj) {

}

JClient.UI.GroupSheetCol = function (panel, sheet) {
    this.Panel = panel;
    this.Sheet = sheet;
    this.Panel.hide();
    this.Title = panel.attr("title");
    this.Class = panel.attr("class");
    this.SheetCols = [];
    var self = this;
    var x = 0;
    panel.find("div[type^='Col']").each(function (i) {
        var c = $(this);
        var c_obj = new JClient.UI.SheetCol(c, sheet);
        c_obj.AutoHide = c_obj.Panel.attr("autohide"); //關鍵屬性
        c_obj.ControlNext = c_obj.Panel.attr("controlnext"); //關鍵屬性
        self.SheetCols.push(c_obj);

        if (c_obj.AutoHide != "true")
            x++;
    });
    this.Expanded = false;
    this.Colspan = x;
}

/* 以上為List的控件
 ////////////////////////////////////////////////// */
JClient.UI.CreateSheets = function () {
    if($("body").attr("data-sheet")!="true"){
        $("body").find("div[type$='Sheet']").each(function (i) {
            if($(this).attr("data-sheet")!="true"){
                try {
                    var sheet = $(this);
                    var name = sheet.attr("type");
                    var ui = eval("new JClient.UI." + name + "('" + sheet.attr("id") + "');");
                    $(this).attr("data-sheet","true");
                    return ui;
                }
                catch (e) {
                    return null;
                }
            }
        });
    }
}

JClient.UI.Create = function (dom$) {
    try {
        var name = dom$.attr("type");
        var ui = eval("new JClient.UI." + name + "();");
        ui.Init(dom$);
        return ui;
    }
    catch (e) {
        return null;
    }
}


// Control 單個控件基礎類
JClient.UI.Control = function () {

    //初始化
    this.Init = function (panel) {
        this.Panel = panel;
        this.Key = panel.attr("key");
        this.Type = panel.attr("type");
        this.Name = panel.attr("title");
        this.Value = panel.attr("value");
        this.Panel.attr("JClient", "true");

        this.Title = $("<div>").addClass("control-title").html(this.Name + "：").appendTo(this.Panel);
        this.Label = $("<div>").addClass("control-label").html(this.Value).appendTo(this.Panel);
        this.PromptPanel = panel.find("[type='Prompt']").addClass("control-prompt").hide();
        this.Panel.append(this.PromptPanel);
        this.SetUI();

        if (this.Panel.attr("id") != undefined)
            JClient.Object[this.Panel.attr("id")] = this;
    }

    this.SetUI = function () {
        this.Panel.addClass("jclient-ui-input");
        this.Input = this.Panel.find("input").addClass("control-input").appendTo(this.Panel);
    }

    this.SetShowView = function (setvalue) {
        this.SetShowViewToControls();
        if (this.Value != this.GetValue() && (setvalue == undefined || setvalue == true)) {
            this.Label.addClass("control-label-change")
        }
        else {
            this.Label.removeClass("control-label-change")
        }
        if (setvalue == undefined || setvalue == true) {
            this.SetLabelValue();
        }

        this.PromptPanel.hide();
    }

    this.SetShowViewToControls = function () {
        this.Input.hide();
        this.Label.show();
    }

    this.SetLabelValue = function () {
        this.Label.html(this.GetValue());
    }

    this.SetInputValue = function () {
        this.Input.val(this.Value);
    }

    this.SetValue = function () {
        var value = this.GetValue();
        if (value != this.Value) {
            this.Value = value;
        }
    }

    this.GetValue = function () {
        return this.Input.val();
    }
    //test cq
    //    this.SetText = function (text) {
    //        this.Input.val(text);
    //    }
    //test

    this.GetText = function () {
        return this.Input.val();
    }

    this.SetEditView = function () {
        this.SetEditViewToControls();
        this.SetInputValue();
        this.PromptPanel.show();
    }

    this.SetEditViewToControls = function () {
        this.Input.show();
        this.Label.hide();
    }

    this.ClearToEmpty = function () {
        this.Input.val("");
        this.Value = "";
        this.Label.html("");
        this.Text = "";
        this.Panel.attr("text", "").attr("value", "");
        this.Rows = [];
    }
}


//RadioBox
JClient.UI.RadioBox = function () {
    JClient.UI.Control.call(this);

    this.ContentMinWidth = 250;
    this.TabHeight = 27;
    this.Columns = [];
    this.Rows = [];
    this.ValueKey = [];
    var me = this;

    //初始化部分UI
    this.SetUI = function () {

        this.Handler = this.Panel.attr("handler");

        var cWidth = this.Panel.attr("ContentMinWidth");
        if (cWidth != null && cWidth != undefined)
            this.ContentMinWidth = cWidth;

        if (this.Panel.attr("showAll") == "true")
            this.ShowAll = true;

        this.NoDataPrompt = this.Panel.find("[type='NoDataPrompt']");
        if (!this.NoDataPrompt.length) {
            this.NoDataPrompt = $("<span>沒有符合要求的数据</span>");
        }

        this.Text = this.Panel.attr("text");
        this.Text = this.Text == undefined ? "" : $.trim(this.Text);

        if (this.Name == undefined || this.Name == "")
            this.Title.hide();

        this.Label.hide();

        this.Panel.addClass("jclient-ui-textbox");

        this.Panel.find("[type='BoxColumn']").each(function () {
            var title = $(this).attr("title");
            var key = $(this).attr("key");
            var className = ($(this).attr("class") == undefined) ? "" : $(this).attr("class");
            me.Columns.push({key: key, title: title, className: className});
            if ($(this).attr("isValue") == "true")
                me.ValueKey.push(key);
        });

        if (this.ValueKey.length == 0 && this.Columns.length > 0)
            this.ValueKey.push(this.Columns[0].key);


        this.Input = $("<input>").addClass("input-box").addClass("data-search").val(this.Text).appendTo(this.Panel);
        this.Input.attr("readonly", true).css("cursor", "pointer");


        this.Input.click(function () {
            me.ShowPanel();
        });

        this.TabClose.click(function () {
            me.HidePanel();
            //cq add
            me.CloseButtonFinish();
        });

        this.CloseButtonFinish = function () {
        }

        this.SearchText.keyup(function (e) {
            if (e.keyCode == 13) {
                me.SearchButton.click();
            }
        });

        this.SearchText.bind('input propertychange', function () {
            me.Search();
        });

        this.SearchButton.click(function () {
            me.Search();
        });

        this.ContentTable.click(function (e) {
            if (e.target.tagName == "A" && $(e.target).attr("type") == "SelectButton") {
                me.Select($(e.target).attr("id"));
            } else if (e.target.tagName == "TD") {
                me.Select($(e.target).parent().attr("dataid"));
            }
        });

        //表头
        this.TableHeader.empty();
        for (var i = 0; i < me.Columns.length; i++) {
            var c = me.Columns[i];
            $("<td>").html(c.title).addClass(c.className).appendTo(this.TableHeader);
        }
        $("<td>").html("选择").attr("class", "oper").appendTo(this.TableHeader);
        $("<td>").append(this.NoDataPrompt).attr("colspan", me.Columns.length + 1).appendTo(this.TableNoData);

        this.SetPanelTitle();
        this.OtherPanel();
        this.TabPane.appendTo($("body"));
        this.ContentPanel.appendTo($("body"));
    }


    this.TabPane = $("<div>").addClass("jclient-ui-radiobox-tab").hide(); //.appendTo(this.Panel);

    this.TabClose = $("<div>").addClass("jclient-ui-radiobox-tab-close").html("x").attr("title", "关闭").appendTo(this.TabPane);

    this.ContentPanel = $("<div>").addClass("jclient-ui-radiobox-content").hide(); //.appendTo(this.Panel);
    this.ContentTopPanel = $("<div>").addClass("jclient-ui-radiobox-content-top").appendTo(this.ContentPanel);

    this.SearchBar = $("<div>").addClass("searchbar").appendTo(this.ContentPanel);
    this.SearchText = $("<input>").addClass("search_input").appendTo(this.SearchBar);
    this.SearchButton = $("<input>").attr("type", "button").addClass("btn_input_s").val("搜索").appendTo(this.SearchBar);


    this.ContentTableDiv = $("<div>").addClass("jclient-ui-radiobox-content-tablepanel").appendTo(this.ContentPanel);
    this.ContentTable = $("<table>").attr("cellpadding", "0").attr("cellspacing", "0").addClass("second_list").appendTo(this.ContentTableDiv);
    this.TableHeader = $("<tr>").addClass("h").appendTo(this.ContentTable);
    this.TableNoData = $("<tr>").addClass("td").appendTo(this.ContentTable);

    this.Left = -1;
    this.Top = -1;
    this.Width = -1;
    this.Height = -1;

    this.SetPanelTitle = function () {

        var me = this;
        this.TabTitle = $("<div>").addClass("jclient-ui-radiobox-tab-title").appendTo(this.TabPane);
        this.ClearButton = $("<div>").addClass("jclient-ui-radiobox-tab-clear").html("清空").appendTo(this.TabPane);
        this.ClearButton.click(function () {
            me.Select("");
        });
    }

    this.OtherPanel = function () {
    }

    this.SetPanelTitleText = function (text) {
        this.TabTitle.attr('title', text);
        if (text.length > 40)
            text = text.substr(0, 39);
        this.TabTitle.html(text + "...");

        if (this.TabTitle.html() == "")
            this.ClearButton.hide();
        else
            this.ClearButton.show();
    }

    this.BeforeShowPanel = function () {
    }

    this.SetTop = function () {
        var offset = this.Input.offset();

        try {
            if ((offset.top - $(window).scrollTop()) > 450) {
                this.Top = offset.top - this.TabHeight - this.ContentPanel.outerHeight();
            }
            else
                this.Top = offset.top + this.Input.outerHeight();
        }
        catch (e) {
            this.Top = offset.top + this.Input.outerHeight();
        }

        this.TabPane.css("top", this.Top);
        this.ContentPanel.css("top", this.Top + this.Height);
    }
    //显示展示框
    this.ShowPanel = function () {
        this.BeforeShowPanel();
        //确定窗口的位置
        //if (this.Left < 0) {
        var offset = this.Input.offset();
        this.Left = offset.left;
        this.SetTop();
        this.Width = this.Input.outerWidth();
        this.Height = this.TabHeight;
        this.TabPane.css({
            top: this.Top,
            left: this.Left,
            width: this.Width,
            height: this.Height + 2
        });
        this.ContentPanel.css({
            top: this.Top + this.Height,
            left: this.Left,
            width: Math.max(this.Width, this.ContentMinWidth)
        });


        // }

        //将其它同类型的窗口关掉
        if (JClient.UI.RadioBox.ShowedRadioBoxs == undefined)
            JClient.UI.RadioBox.ShowedRadioBoxs = [];
        var array = JClient.UI.RadioBox.ShowedRadioBoxs;
        for (var i = 0; i < array.length; i++) {
            array[i].HidePanel();
        }
        JClient.UI.RadioBox.ShowedRadioBoxs = [];
        JClient.UI.RadioBox.ShowedRadioBoxs.push(this);

        //调整一下位置，方便显示出全部内容
        //$("body").scrollTop(this.Top - 30);

        this.SetPanelTitleText(this.Input.val());


        this.TabPane.show();
        this.ContentPanel.show();
        this.SearchText.focus();
        if (this.Rows.length == 0) {
            this.Search();
        }
    }

    this.HidePanel = function () {
        this.TabPane.hide();
        this.ContentPanel.hide();
        this.Input.blur();
    }

    this.SelectFinished = function () {

    }

    //為联动查询提供扩展方法
    this.InputParams = function (data) {

    }

    //查询
    this.Search = function () {
        var data = {};
        data["key"] = this.SearchText.val();
        me.InputParams(data);
        $.ajax({
            url: this.Handler,
            type: "POST",
            data: data,
            success: function (data) {

                if (typeof data == "string") {
                    try {
                        data = eval("(" + data + ")");
                    }
                    catch (e) {
                        data = false;
                    }
                }
                if (data == null || data == 'null') {
                    me.ContentTable.find("tr.tb").remove();
                    return;
                }
                if (data.length == undefined && data == false) {

                    Box.Alert("系統消息", "查询失败", null, {icon: 'fail.gif', width: '250', height: '60'});
                }
                else {
                    me.SetSearchData(data);
                    me.SetTop();
                }
            },
            fail: function () {

                Box.Alert("系統消息", "查询失败", null, {icon: 'fail.gif', width: '250', height: '60'});
            }
        });
    }

    //设置查询到的数据
    this.SetSearchData = function (rows) {
        if (rows.rows != undefined)
            rows = rows.rows;
        this.Rows = rows;
        this.ContentTable.find("tr.tb").remove();
        if (this.Rows.length == undefined || this.Rows.length <= 0) {
            this.TableNoData.show();
        }
        else {
            this.TableNoData.hide();
            for (var i = 0; i < this.Rows.length; i++) {
                if (i > 50 && this.ShowAll != true)
                    break;
                var d = this.Rows[i];
                var tr = $("<tr>").addClass("tb").appendTo(this.ContentTable);
                tr.attr("dataid", d[me.Key]);
                for (var j = 0; j < me.Columns.length; j++) {
                    var c = me.Columns[j];
                    try {
                        var t = $.trim(d[c.key]);
                        if (t.length > 30)
                            t = t.substr(0, 29) + '...';
                        $("<td>").attr("title", t).html(t).appendTo(tr);
                    } catch (e) {
                        $("<td>").html("").appendTo(tr);
                    }
                }
                $("<td>").appendTo(tr).append(
                    $("<a>").html("选择").attr("type", "SelectButton").attr("id", d[me.Key]).attr("href", "javascript:void(0);"));
            }
        }

    }

    //设置选择到的数据
    this.Select = function (id) {
        for (var i = 0; i < this.Rows.length; i++) {
            var d = this.Rows[i];
            if (d[me.Key] == id) {
                var text = "";
                for (var x = 0; x < this.ValueKey.length; x++) {
                    if (text == "")
                        text = $.trim(d[this.ValueKey[x]]);
                    else
                        text += "/" + $.trim(d[this.ValueKey[x]]);
                }

                this.Text = text;
                this.Value = id;
                this.Input.val(this.Text);
                var v = this.Panel.attr("value");
                if (v != undefined)
                    this.Panel.attr("value", this.Value);
                var t = this.Panel.attr("text");
                if (t != undefined)
                    this.Panel.attr("text", this.Text);

                this.HidePanel();
                if (id != '') {
                    this.SelectFinished(d);
                }
                return;
            }
        }

        this.Text = "";
        this.Value = "";
        this.Input.val("");
        this.Panel.attr("value", this.Value);
        this.Panel.attr("text", this.Text);
        this.HidePanel();
        if (id != '') {
            this.SelectFinished();
        }

    }

    this.GetValue = function () {
        return this.Value;
    }
    this.SetLabelValue = function () {
        this.Label.html(this.Text);
    }

    this.SetEditView = function () {
        this.SetEditViewToControls();
        this.Input.val(this.Text);
    }

    this.SetEditViewWithValue = function (text) {
        this.SetEditViewToControls();
        this.Input.val(text);
        this.Text = text;
    }

    this.SetShowViewToControls = function () {
        this.Input.hide();
        this.Label.show();
        this.HidePanel();
    }

    //控件己經創建，後賦值
    this.SetShowValueAndTextAfterCreated = function (text, value) {

        this.Text = text;
        this.Value = value;
        this.Input.val(this.Text);
        var v = this.Panel.attr("value");
        if (v != undefined)
            this.Panel.attr("value", this.Value);
        var t = this.Panel.attr("text");
        if (t != undefined)
            this.Panel.attr("text", this.Text);
    }

    //清空值
    this.ClearToEmpty = function () {
        this.Input.val("");
        this.Value = "";
        this.Label.html("");
        this.Text = "";
        this.Panel.attr("text", "").attr("value", "");
        this.Rows = [];
    }
}

//-------------------以下為 CheckBox ------------------------
JClient.UI.CheckBox = function () {

    JClient.UI.RadioBox.call(this);

    this.SelectObjs = [];

    this.SetPanelTitle = function () {
        this.TabTitle = $("<div>").addClass("jclient-ui-radiobox-tab-title").appendTo(this.TabPane);
    }

    this.SetPanelTitleText = function (text) {
        if (text.length > 20)
            text = text.substr(0, 19) + "...";
        this.TabTitle.html(text);
    }

    this.OtherPanel = function () {
        this.ContentTableDiv.addClass("jclient-ui-checkbox-content-tablepanel");
        this.SelectTableDiv = $("<div>").addClass("jclient-ui-checkbox-select-tablepanel").insertAfter(this.ContentTableDiv);
        this.SelectTable = $("<table>").attr("cellpadding", "0").attr("cellspacing", "0").addClass("second_list").appendTo(this.SelectTableDiv);
        this.SelectTableHeader = $("<tr>").addClass("h").appendTo(this.SelectTable);
        this.SelectTd = $("<td>").appendTo(this.SelectTableHeader);
        //放置己選擇的數據
        this.SelectTableContent = $("<tr>").addClass("td").appendTo(this.SelectTable);
        this.SelectObjectsTd = $("<td>").appendTo(this.SelectTableContent);

        var title = $("<div>").addClass("jclient-ui-radiobox-tab-title").html("选择的值：").appendTo(this.SelectTd);
        this.ClearButton = $("<div>").addClass("jclient-ui-radiobox-tab-clear").html("清空").appendTo(this.SelectTd);

        this.Bottom = $("<div>").addClass("jclient-ui-checkbox-bottom").appendTo(this.ContentPanel);
        this.OkButton = $("<input>").attr("type", "button").addClass("btn_input_s").val("确定").appendTo(this.Bottom);
        this.CancelButton = $("<input>").attr("type", "button").addClass("btn_input_s").val("取消").appendTo(this.Bottom);

        var me = this;
        this.SelectTable.click(function (e) {
            if (e.target.tagName == "SPAN" && $(e.target).attr("type") == "SelectButton") {
                me.Remove($(e.target).attr("tid"));
                $(e.target).parent().remove();
            }
        });
        this.ClearButton.click(function () {
            me.SelectObjectsTd.find("div").remove();
            me.SelectObjs = [];
        });

        this.CancelButton.click(function () {
            me.HidePanel();
            me.CloseButtonFinish();
        });

        this.OkButton.click(function () {
            me.SetValue();
            me.BeforeClosed();
        });
    }

    this.BeforeClosed = function () {
        this.SelectFinished();
    }

    this.BeforeShowPanel = function () {

        this.SelectObjs = [];
        var ids = this.Value.split(',');
        var texts = this.Text.split(',');
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            if (id != "") {
                var text = texts.length <= i ? "" : texts[i];
                this.SelectObjs.push({
                    id: id,
                    text: text
                });
            }
        }

        this.SelectObjectsTd.find("div").remove();
        for (var i = 0; i < this.SelectObjs.length; i++) {
            var item = this.SelectObjs[i];
            var div = this.BuildShowDiv(item.id, item.text);
            div.appendTo(this.SelectObjectsTd);
        }
    }

    this.Select = function (id) {

        var hasExist = false;
        for (var i = 0; i < this.SelectObjs.length; i++) {
            if (this.SelectObjs[i].id == id) {
                hasExist = true;
                break;
            }
        }
        if (hasExist)
            return;

        for (var i = 0; i < this.Rows.length; i++) {
            var d = this.Rows[i];
            if (d[this.Key] == id) {

                this.SelectObjs.push({
                    id: id,
                    text: d[this.ValueKey[0]]
                });

                var div = this.BuildShowDiv(d[this.Key], d[this.ValueKey[0]]);
                div.appendTo(this.SelectObjectsTd);

                return;
            }
        }
    }

    this.Remove = function (id) {
        for (var i = 0; i < this.SelectObjs.length; i++) {
            if (this.SelectObjs[i].id == id) {
                this.SelectObjs.splice(i, 1);
                return;
            }
        }
    }

    this.BuildShowTR = function (id, text) {
        var tr = $("<tr>").addClass("tb");
        var td = $("<td>").appendTo(tr);

        var span = $("<span>").html(text).appendTo(td);
        var deleteA = $("<a>").attr("tid", id).attr("type", "SelectButton").html("刪除").appendTo(td);
        return tr;
    }

    this.BuildShowDiv = function (id, text) {
        var div = $("<div>").addClass("select-item");
        var span = $("<span>").html(text).appendTo(div);
        var deleteA = $("<span>").attr("tid", id).attr("type", "SelectButton").appendTo(div);
        return div;
    }

    this.SetValue = function () {
        var id = "";
        var text = "";
        for (var i = 0; i < this.SelectObjs.length; i++) {
            if (i > 0) {
                id += ",";
                text += ",";
            }
            id += this.SelectObjs[i].id;
            text += this.SelectObjs[i].text;
        }
        this.Text = text;
        this.Value = id;
        this.Input.val(text);

        var v = this.Panel.attr("value");
        if (v != undefined)
            this.Panel.attr("value", this.Value);
        var t = this.Panel.attr("text");
        if (t != undefined)
            this.Panel.attr("text", this.Text);

        this.HidePanel();
    }

    //清空值
    this.ClearToEmpty = function () {
        this.Input.val("");
        this.Value = "";
        this.Label.html("");
        this.Text = "";
        this.Panel.attr("text", "").attr("value", "");
        this.Rows = [];
        this.SelectObjs = [];
    }

    //控件己經創建，後賦值
    this.SetShowValueAndTextAfterCreated = function (text, value) {

        this.Text = text;
        this.Value = value;
        this.Input.val(this.Text);
        var v = this.Panel.attr("value");
        if (v != undefined)
            this.Panel.attr("value", this.Value);
        var t = this.Panel.attr("text");
        if (t != undefined)
            this.Panel.attr("text", this.Text);

        this.SetPanelTitle();
    }
}

//-------------------以下為固定頁面框架處理類-------------------------
JClient.UI.FixBarStart = function ($keyId, className) {
    if (JClient.Object.FixBar == null || JClient.Object.FixBar == undefined) {
        new JClient.UI.FixBar($keyId, className);
        $(window).scroll(JClient.Object.FixBar.OnScroll);
    }
    else {
        JClient.Object.FixBar.AddFix($keyId, className);
    }
}

JClient.UI.FixBar = function ($keyId, className) {
    JClient.Object.FixBar = this;
    this.FixBarArray = [];
    this.AutoCss = (className == null ? "FixTopBar" : className);

    var ids = $keyId.split(',');
    for (var i = 0; i < ids.length; i++) {
        var $Dom = $("#" + ids[i]);
        var obj = new JClient.UI.FixBarObject($Dom, className, this);
        this.FixBarArray.push(obj);
    }
}

JClient.UI.FixBar.prototype.AddFix = function ($keyId, className) {
    var ids = $keyId.split(',');
    for (var i = 0; i < ids.length; i++) {
        var $Dom = $("#" + ids[i]);
        var obj = new JClient.UI.FixBarObject($Dom, className, this);
        this.FixBarArray.push(obj);
    }
}

JClient.UI.FixBar.prototype.OnScroll = function () {
    var bar = JClient.Object.FixBar;
    var scrolla = parseInt($(window).scrollTop());
    for (var i = 0; i < bar.FixBarArray.length; i++) {
        var obj = bar.FixBarArray[i];
        if (obj.Top <= scrolla) {
            obj.Panel.css("width", obj.Width + "px");
            obj.Panel.addClass(obj.ClassName);
        }
        else {
            obj.Panel.removeClass(obj.ClassName);
            obj.Panel.css("width", "");
            obj.Width = obj.Panel.width();
        }
    }
}


JClient.UI.FixBarBugIE = function () {
    if ($.browser.msie && JClient.Object.FixBar != null && JClient.Object.FixBar != undefined) {
        var bar = JClient.Object.FixBar;
        for (var i = 0; i < bar.FixBarArray.length; i++) {
            var obj = bar.FixBarArray[i];
            if (parseInt(obj.Panel.offset().top) < obj.Top) {
                obj.Panel.removeClass(bar.AutoCss);
                obj.hasCss = false;
            }
        }
    }
}

JClient.UI.FixBarObject = function ($Dom, className, FixBar) {
    this.Panel = $Dom;
    this.FixBar = FixBar;
    this.Top = parseInt($Dom.offset().top);
    this.Width = $Dom.width();
    this.ClassName = className == undefined ? FixBar.AutoCss : className;
}


//-------------------以下為固定表頭  by zmihua------------------------
//需要在頁面加載時進行初始化
//_obj:要固定的表頭div 對象 或者ID 對象
JClient.UI.FixTitle = function (_obj) {

    var loaded = true;
    var top = $("#" + _obj).offset().top;

    function Add_Data() {
        var scrolla = $(window).scrollTop();
        var cha = parseInt(top) - parseInt(scrolla);

        if (loaded && cha <= 0) {
            $("#" + _obj).removeClass("FixedTitleClass2").addClass("FixedTitleClass1");
            loaded = false;
        }
        if (!loaded && cha >= 0) {
            $("#" + _obj).removeClass("FixedTitleClass1").addClass("FixedTitleClass2");
            loaded = true;
        }
    }

    $(window).scroll(Add_Data);

}
//-------------------以上為固定表頭  by zmihua------------------------


//-------------------以下為 TreeControl  by zmihua------------------------
JClient.UI.TreeControl = function () {

    var setting_checkbox = {
        check: {
            enable: true,
            chkboxType: {"Y": "", "N": ""}
        },
        view: {
            dblClickExpand: false,
            fontCss: getFontCss
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            onCheck: onCheck
        }
    };

    var setting_radio = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        view: {
            dblClickExpand: false,
            fontCss: getFontCss
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onCheck: onCheck
        }
    };
    //加載用戶樹
    this.LoadTree_User = function (Treetype) {
        var zNodes = '';
        var _array;
        var _Ajax = new CallAjax();
        _Ajax.Url = '../Services/CommonServ.aspx';
        _Ajax.Data = {Call: 'GetOrganizationTree'};
        _Ajax.OnSuccess = OnSuccess;
        function OnSuccess(_RMeta) {

            if (!_RMeta.ClientInfo.IsLogin || _RMeta.Meta.Organization == null) {
                top.document.location.href = _RMeta.ClientInfo.RedirectURL;
                return;
            }
            _array = '';

            for (var i = 0; i < _RMeta.Meta.Organization.length; i++) {
                var _icon = "../images/user.gif";
                var _nocheck = false;
                if (_RMeta.Meta.Organization[i].TreeType == "Dept") {
                    _icon = "../images/group.gif";
                    _nocheck = true;
                }
                _array = _array + "{ \"id\":\"" + _RMeta.Meta.Organization[i].id + "\",\"pId\":\"" + _RMeta.Meta.Organization[i].pid + "\",\"name\":\"" + _RMeta.Meta.Organization[i].name + "\",\"nocheck\":" + _nocheck + ",\"icon\":\"" + _icon + "\",\"TreeType\":\"" + _RMeta.Meta.Organization[i].TreeType + "\" },";
            }

            _array = _array.substring(0, _array.length - 1);
            zNodes = '[' + _array + ']';
            zNodes = JSON.parse(zNodes);
        }

        _Ajax.Ajax();

        //設定樹的選擇形式 單選 多選
        if (Treetype == "CheckBox" || typeof (Treetype) == 'undefined' || Treetype == "" || Treetype == null) {
            $.fn.zTree.init($("#Tree"), setting_checkbox, zNodes); //多選
        }
        else {
            $.fn.zTree.init($("#Tree"), setting_radio, zNodes); //單選
        }

        var key = $("#txtdeptkey");
        key.bind("propertychange", searchNode)
            .bind("input", searchNode);

    }
    //加載承辦單位樹

    this.LoadTree_BuDept = function (Treetype) {
        var zNodes = '';
        var _array;
        var _Ajax = new CallAjax();
        _Ajax.Url = '../Services/CommonServ.aspx';
        _Ajax.Data = {Call: 'GetOrganizationTree', ShowUser: 0};
        _Ajax.OnSuccess = OnSuccess;
        function OnSuccess(_RMeta) {

            if (!_RMeta.ClientInfo.IsLogin || _RMeta.Meta.Organization == null) {
                top.document.location.href = _RMeta.ClientInfo.RedirectURL;
                return;
            }
            _array = '';

            for (var i = 0; i < _RMeta.Meta.Organization.length; i++) {
                var _icon = "../images/user.gif";
                var _nocheck = true;
                if (_RMeta.Meta.Organization[i].TreeType == "Dept") {
                    _icon = "../images/group.gif";
                }

                if (_RMeta.Meta.Organization[i].Is_Charge) {
                    _nocheck = false;
                }
                _array = _array + "{ \"id\":\"" + _RMeta.Meta.Organization[i].id + "\",\"pId\":\"" + _RMeta.Meta.Organization[i].pid + "\",\"name\":\"" + _RMeta.Meta.Organization[i].name + "\",\"nocheck\":" + _nocheck + ",\"icon\":\"" + _icon + "\",\"TreeType\":\"" + _RMeta.Meta.Organization[i].TreeType + "\" },";
            }

            _array = _array.substring(0, _array.length - 1);
            zNodes = '[' + _array + ']';
            zNodes = JSON.parse(zNodes);
        }

        _Ajax.Ajax();

        //設定樹的選擇形式 單選 多選
        if (Treetype == "CheckBox" || typeof (Treetype) == 'undefined' || Treetype == "" || Treetype == null) {
            $.fn.zTree.init($("#Tree"), setting_checkbox, zNodes); //多選
        }
        else {
            $.fn.zTree.init($("#Tree"), setting_radio, zNodes); //單選
        }

        var key = $("#txtdeptkey");
        key.bind("propertychange", searchNode)
            .bind("input", searchNode);

    }


    this.showMenu = function (TreeType, DataType) {
        if (DataType == "Dept") {
            new JClient.UI.TreeControl().LoadTree_BuDept(TreeType);
        }
        else {
            new JClient.UI.TreeControl().LoadTree_User(TreeType);
        }
        var cityObj = $("#txtnew");
        var cityOffset = $("#txtnew").offset();
        var treewidth = $("#txtnew").width();
        $("#menuContent").css({
            left: cityOffset.left + "px",
            top: cityOffset.top + cityObj.outerHeight() + "px"
        }).slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
        $("#txtdeptkey").attr("style", "width: " + treewidth + "px;height: 16px;")
        $("#Tree").attr("style", "margin-top: 0; width: " + treewidth + "px; height: 300px;");
    }

    function beforeClick(treeId, treeNode) {

        var zTree = $.fn.zTree.getZTreeObj("Tree");
        zTree.checkNode(treeNode, !treeNode.checked, null, true);
        return false;
    }

    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("Tree");
        zTree.checkNode(treeNode, !treeNode.checked, null, true);
        return false;
    }

    function onCheck(e, treeId, treeNode) {

        var zTree = $.fn.zTree.getZTreeObj("Tree"),
            nodes = zTree.getCheckedNodes(true),
            n = "",
            v = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            n += nodes[i].id + ",";
            v += nodes[i].name + ",";
        }
        if (n.length > 0) n = n.substring(0, n.length - 1);
        if (v.length > 0) v = v.substring(0, v.length - 1);
        var cityObj = $("#txtnew");
        cityObj.attr("value", v);
        cityObj.attr("name", n);
    }

    //查询
    var nodeList = [];

    function searchNode(e) {
        var zTree = $.fn.zTree.getZTreeObj("Tree");
        var _Value = $.trim($("#txtdeptkey").val());
        if (_Value === '') {
            return;
        }
        //UpdateNodes(false);

        nodeList = zTree.getNodesByParamFuzzy('name', _Value);
        UpdateNodes(true);
    }

    function UpdateNodes(_highlight) {

        var zTree = $.fn.zTree.getZTreeObj("Tree");
        for (var i = 0, l = nodeList.length; i < l; i++) {
            var _parentNode = nodeList[i].getParentNode();
            if (_parentNode != null && _parentNode.open != _highlight) {
                zTree.expandNode(_parentNode, _highlight, null, null, true);
            }
            nodeList[i].highlight = _highlight;
            zTree.updateNode(nodeList[i]);

        }
        setCursor('txtdeptkey', $.trim($("#txtdeptkey").val()).length); //设置光标位置
    }

    //定位節點
    function FindNode(nodeID) {

        var zTree = $.fn.zTree.getZTreeObj("Tree");
        nodeList = zTree.getNodesByParamFuzzy('id', nodeID);
        for (var i = 0, l = nodeList.length; i < l; i++) {
            var _parentNode = (nodeList[i].getParentNode() != null) ? nodeList[i].getParentNode() : nodeList[i];
            if (_parentNode != null && _parentNode.open != true) {
                zTree.expandNode(_parentNode, true, null, null, true);
                nodeList[i].highlight = true;
                zTree.updateNode(nodeList[i]);
            }

        }

    }


    /**
     * 设置光标位置
     * add by ZMIHUA
     */
    function setCursor(id, position) {

        var txtFocus = document.getElementById(id);
        if ($.browser.msie) {
            var range = txtFocus.createTextRange();
            range.move("character", position);
            range.select();
        } else {
            txtFocus.setSelectionRange(position, position);
            txtFocus.focus();
        }
    }

    function getFontCss(treeId, treeNode) {

        return (!!treeNode.highlight) ? {color: "red", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
    }

    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }

    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "txtnew" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
            hideMenu();
        }
    }

}


//-------------------  TreeControl 結束 ------------------------


//------------查詢條件------//

var JSearch = {}
JSearch.Object = {}
JSearch.Create = function ($dom) {
    try {
        var ui = eval("new JSearch.Search();");
        return ui.Init($dom);
    }
    catch (e) {
        return null;
    }
}
JSearch.Search = function () {
    var me = this;
    var panel = '';
    this.Init = function ($dom) {
        panel = $dom;
        this.Panel = $dom;
        if (panel.attr("id") != undefined)
            JSearch.Object[panel.attr("id")] = this;
        this.DefaultTable = $dom.attr("defaulttable");
        this.IsMore = $dom.attr("more");
        this.SetMore(this.IsMore);

    }

    this.SetMore = function (IsMore) {
        if (IsMore == 'true') {
            this.MorePanel = $('<div class="JSearch-MorePanel"></div>');
            this.More = $('<div class="JSearch-More" isshow="0" ><img src="../images/button_icon/icon_max.png" /> 显示较多查询条件<div style="clear: both;"></div></div>');
            // this.More.addClass("JSearch.More");
            var $more = this.More;
            this.More.click(function () {
                me.ShowCondition($more);
            });
            this.More.appendTo(this.MorePanel);
            this.MorePanel.appendTo(panel)
        }
    }
    this.ShowCondition = function ($More) {
        if ($More.attr('isshow') == '1') {
            $More.attr('isshow', '0');
            $More.html('<img src="../images/button_icon/icon_max.png" /> 显示较多查询条件');
            panel.find('[more=true]').hide();
        }
        else {
            $More.attr('isshow', '1');
            $More.html('<img src="../images/button_icon/icon_mini.png" /> 显示较少查询条件');
            panel.find('[more=true]').show();
        }
    }
}
JSearch.Search.prototype.SearchData = function (params) {
    var key = '';
    var defaulttable = this.DefaultTable;
    this.Panel.find("[data^='TSheet_']").each(function (i) {
        var c = $(this);
        var key = c.attr("data").replace("TSheet_", "");
        var stype = c.attr("searchtype");
        if (stype != '' && stype != null && stype != undefined) {
            var stable = c.attr("searchtable");
            if (stable == '' || stable == null || stable == undefined) {
                stable = defaulttable;
            }
            key = stable + '$' + key + '$' + stype;
        }
        JSearch.Search.PushControlValue(key, c, params);
    });
    return params;
}

JSearch.Search.prototype.ClearSearch = function () {
    this.Panel.find("[data^='TSheet_']").each(function (i) {
        var c = $(this);
        var id = c.attr("id");
        if (c.attr("JClient") != undefined) {
            JClient.Object[id].SetShowValueAndTextAfterCreated('', '');
        }
        else {
            var type = c.get(0).tagName;
            switch (type) {
                case "INPUT":
                    c.val("");
                    break;
                case "SELECT":
                    c.val("");
                    break;
            }
        }
    });
}

JSearch.Search.PushControlValue = function (key, control, data) {
    if (data == '' || data == null || typeof (data) == 'undefined') {
        data = {};
    }
    var type = control.get(0).tagName;
    switch (type) {
        case "INPUT":
            data[key] = control.val();
            break;
        case "SELECT":
            data[key] = control.val();
            var s = control.find("option:selected");
            break;
        case "LABEL":
            data[key] = control.html();
            break;
        case "DIV":
            var v = "";
            var cbxs = control.find("input[type='checkbox']");
            var rbxs = control.find("input[type='radio']");
            if (cbxs.length > 0) {
                cbxs.each(function (i) {
                    if ($(this).attr("checked") == "true" || $(this).attr("checked") == true || $(this).attr("checked") == "checked") {
                        if (v == "")
                            v = $(this).val();
                        else
                            v += "," + $(this).val();
                    }
                });

                data[key] = v;
            }
            else if (rbxs.length > 0) {
                rbxs.each(function (i) {
                    if ($(this).attr("checked") == "true" || $(this).attr("checked") == true || $(this).attr("checked") == "checked") {
                        if (v == "")
                            v = $(this).val();
                        else
                            v += "," + $(this).val();
                    }
                });

                data[key] = v;
            }
            else if (control.attr("JClient") != undefined) {
                data[key] = control.attr("value");
            }
            else
                data[key] = control.html();

            break;
        case "TEXTAREA":
            data[key] = control.val();
            break;
        case "SPAN":
            if (control.attr("JClient") != undefined) {
                data[key] = control.attr("value");
            }
            else
                data[key] = control.html();
    }
}

/**table的Tr双击事件响应跳转至详情页面
 * obj指表格的对像
 * tdIndex指当前行的第几列，为空为null表示默认为最后一列
 * 某列的第几个A标签，为空为Null表示默认为第一个，即下标为0*/
JClient.UI.sheetTrDblclick = function(obj,tdIndex,aIndex){
    setTimeout(function(){
        $(obj).find("table").find("tbody").find("tr").each(function(trIndexNum,trElem){
            $(trElem).dblclick(function(){
                var tdLength = $(trElem).find("td").length;
                if(!Util.ZjlNotIsNullOrEmpty(tdIndex))
                {
                    tdIndex = tdLength - 1;
                }
                var tdObj = $(trElem).find("td").eq(tdIndex);
                if(!Util.ZjlNotIsNullOrEmpty(aIndex))
                {
                    aIndex = 0;
                }
                var linkStr = "";
                if($(tdObj).find("a").length > 0 && $(tdObj).find("a").eq(aIndex).is(":visible"))
                {
                    linkStr = $(tdObj).find("a").eq(aIndex).attr("href");
                }
                if(Util.ZjlNotIsNullOrEmpty(linkStr))
                {
                    window.location.href = linkStr;
                }
            });
        });

    },1000);
}


//-------查詢條件結束-----------------------------//

//**************************************************************
//上传使用UploadSheet ,继承自Sheet

JClient.UI.UploadSheet = function (divId) {
    var self = this;
    this.Panel = $("#" + divId);
    this.OperUploadTitle = this.Panel.find("div[type='OperUpload']").attr("title");
    var OperUploadDemoDiv = this.Panel.find("div[type='OperUploadDemo']");
    this.OperUploadDemoTitle = OperUploadDemoDiv.attr("title");
    //模板链接
    this.OperUploadDemoAhref = OperUploadDemoDiv.find("a").attr("href");
    //上传文件选择控件id
    this.OperUploadInputFileID = divId + "FileUpLoad";
    //上传部分
    var uploadOperDiv = "  <div class=\"div_title\" style=\"text-align: left; height: 30px;\"><div style=\"padding-left: 25px;\"><div style=\"float: left;\">" + this.OperUploadTitle
        + "</div><div style=\"float: right; margin-right: 10px;\"><a type=\"OperDemoButton\" href=\"" + this.OperUploadDemoAhref + "\" target=\"_blank\" >模板下载</a><input type=\"file\" id=\"" + this.OperUploadInputFileID + "\" name=\"FileUpLoad\" style=\"width: 200px;\" />" +
        "<a type=\"OperUploadButton\"  href=\"javascript:void(0);\" class=\"white\" style=\"border: solid 1px #8B8B8C; padding: 2px 8px 2px 8px;\" title=\"test\" >上传</a></div></div></div>";
    //导入DIV
    this.uploadToDBOperDiv = $("<div class =\"div_title\"> </div>");
    this.uploadToDBOperDiv.hide();
    //导入按钮
    this.uploadToDBButton = $(" <a href=\"#\" class=\"button white\"  type=\"OperuploadToDBButton\">导入</a>");
    this.uploadToDBButton.appendTo(this.uploadToDBOperDiv);
    this.uploadOperDiv = $(uploadOperDiv);
    this.uploadOperDiv.appendTo(this.Panel);
    this.uploadOperDiv.after(this.uploadToDBOperDiv);
    this.OperUploadDemoButton = this.uploadOperDiv.find("a[type = 'OperDemoButton']");
    //上传按钮
    this.OperUploadButton = this.uploadOperDiv.find("a[type = 'OperUploadButton']");
    //上传文件选择控件
    this.OperUploadFile = this.uploadOperDiv.find("input[name='FileUpLoad']");
    var sheetslength = 0;
    this.Panel.find("div[type^='Col']").each(function (i) {
        sheetslength++;
    });
    //table默认的第一行
    this.firstDefaultDr = $("<tr><td colspan=\"" + (sheetslength - 1) + "\"></td></tr>");
    this.OperSingleImport = $("<a id=\"" + divId + "SingleImport" + "\">+单个录入</a>");
    this.OperSingleImport.appendTo(this.firstDefaultDr.find(">td:first"));
    JClient.UI.Sheet.call(this, divId);
    var dt = this.DataTable;
    this.DataEmptyRow = $("<tr></tr>");
    var tbody = dt.find(">tbody");
    this.firstDefaultDr.appendTo(tbody);

    //单个上传按钮事件
    this.OperSingleImport.bind("click",
        function () {
            self.firstDefaultDr.empty();
            self.DataAddNewRow = null;
            self.NeedToAddNewRow(self.firstDefaultDr);
            self.firstDefaultDr.find("[data='modefy']").hide();
            self.firstDefaultDr.find("[data='account'],[data='cancel']").show();
            var account = self.firstDefaultDr.find("[data='account']");
            account.attr("onclick", account.attr("onclick").replace("OnAfterEditOK", "OnAfterAddOK"));
            var cancel = self.firstDefaultDr.find("[data='cancel']");
            cancel.attr("onclick", cancel.attr("onclick").replace("OnAfterEditCancel", "OnAfterAddCancel"));
        }
    );

    //上传按钮事件
    //默认call UploadExcel
    this.OperUploadButton.bind("click",
        function () {
            var handler = self.Handler;
            var file = document.getElementById(self.OperUploadInputFileID);
            var _form = document.createElement('form');
            document.body.appendChild(_form);
            _form.encoding = "multipart/form-data";
            _form.method = "post";
            _form.action = handler + "?Call=UploadExcel";
            var hiden_frame = "hidden_frame";
            _form.target = hiden_frame;
            var pos = file.nextSibling; //记住file在旧表单中的的位置
            _form.appendChild(file);
            _form.submit();
            pos.parentNode.insertBefore(file, pos);
            document.body.removeChild(_form);
            if (window.attachEvent) {
                //上传完了，自动显示导入到草稿表中的数据；
                document.getElementById(hiden_frame).attachEvent('onload',
                    function () {
                        self.importDataReady();
                        //把导入按钮显示出来
                    }
                );
            }
        }
    );

    //上传至正式 表中
    this.uploadToDBButton.bind("click",
        function () {
            var _Ajaxc = new CallAjax();
            _Ajaxc.Data = {Call: 'HrConstImportExcel'};
            _Ajaxc.Url = "../Services/PerformanceServ.aspx";
            _Ajaxc.OnSuccess = function (_RMeta) {
                self.importDataReady();
            };
            _Ajaxc.Ajax();
        }
    );

}

//让UploadSheet继承sheet
JClient.Inherits(JClient.UI.UploadSheet, JClient.UI.Sheet);


//点击上传按钮后，数据要刷出来,但智商上传到草稿，还允许修改，改完之后就可以导入了
JClient.UI.UploadSheet.prototype.importDataReady = function () {
}

//初使化Table
JClient.UI.UploadSheet.prototype.defaultMyTable = function () {
    var table = $("<table id='table_" + this.Id + "' class='" + this.css + "' ></table>");
    var th = $("<thead></thead>").appendTo(table);
    var tr = $("<tr></tr>");
    var self = this;
    this.DataTable = table;
    if (this.AllowSelect == "true") {
        var c_td = $("<td><label class='ui-checkbox'><input type='checkbox'/><span>&nbsp;</span></label></td>").appendTo(tr);
        c_td.find("input[type='checkbox']").click(function () {
            self.SelectCbx = $(this);
            self.selectAll();
        });
    }
    if (this.AllowIndex == "true") {
        $("<td style='width:40px;' class=\"noTd\">" + '序号' + "</td>").appendTo(tr);
    }
    for (var i = 0; i < this.SheetCols.length; i++) {
        var td = $("<td class='" + this.SheetCols[i].Class + "' colName='" + this.SheetCols[i].Key + "'></td>");
        var divPanel = $("<div style='display:inline-block;vertical-align:bottom;'></div>").appendTo(td);
        $("<div style='float:left;'></div>").appendTo(divPanel).html(this.SheetCols[i].Title);
        td.appendTo(tr);
        if (this.DoSheetMerge && this.SheetCols[i].Merge == "true") {
            td.attr("merge", "true");
        }
    }
    var tb = $("<tbody></tbody>");
    tb.appendTo(table);
    tr.appendTo(th);
    return table;
}
//UploadSheet 表加载完之后的操作 可以再头部加入单个录入的数据
JClient.UI.UploadSheet.prototype.LoadimportDataFinished = function (data) {
    var dt = this.DataTable;
    var tbody = dt.find(">tbody");
    this.AddControlInit(tbody);
    if (this.SheetPage.MaxCount > 0) {
        this.uploadToDBOperDiv.show();
    }
}

JClient.UI.UploadSheet.prototype.AddControlInit = function (tbody) {
    this.firstDefaultDr.show();
    var self = this;
    this.OperSingleImport.bind("click",
        function () {
            self.firstDefaultDr.empty();
            self.DataAddNewRow = null;
            self.NeedToAddNewRow(self.firstDefaultDr);
            self.firstDefaultDr.find("[data='modefy'],[data='delete']").hide();
            self.firstDefaultDr.find("[data='account'],[data='cancel']").show();
            var account = self.firstDefaultDr.find("[data='account']");
            account.attr("onclick", account.attr("onclick").replace("OnAfterEditOK", "OnAfterAddOK"));
            var cancel = self.firstDefaultDr.find("[data='cancel']");
            cancel.attr("onclick", cancel.attr("onclick").replace("OnAfterEditCancel", "OnAfterAddCancel"));
        }
    );
    this.firstDefaultDr.prependTo(tbody);
}


///得數據
JClient.UI.UploadSheet.prototype.loadMySheetData = function () {
    var self = this;
    var data = this.SheetPage.getSearchPrams();

    $.ajax({
        url: self.Handler,
        data: data,
        type: 'POST',
        dataType: 'json',
        success: function (_RMeta) {
            try {
                if (!_RMeta.ClientInfo.IsLogin) {
                    top.document.location.href = _RMeta.ClientInfo.RedirectURL;
                    return false;
                }

                if (_RMeta.ClientInfo.Status) {
                    self.structMySheetData(_RMeta);
                    self.BeforeLoadDataFinished();
                    self.LoadimportDataFinished(_RMeta);
                    self.EndLoadDataFinished()
                }
                else {
                    Box.Alert("系統消息", "数据获取失败", null, {icon: 'fail.gif', width: '250', height: '60'});
                }
            } catch (e) {
            }
        },
        fail: function () {

        }
    });

}

//
//**************************************************************