/**
 * Created by Badger on 16/8/3.
 */

var MAX_SELECTION_COUNT = 4;
var SELECTION_COLORS = {};

function SimpleTableGen() {
}


SimpleTableGen.prototype.tableID = 'table';
SimpleTableGen.prototype.table = $('#' + this.tableID);
SimpleTableGen.prototype.settings = new Object();
SimpleTableGen.prototype.editFields = new Array();

SimpleTableGen.prototype.apiName = '';

SimpleTableGen.prototype.bind = function () {
    window.onload = this.init();
    // this.loadData();
}

//初始化Table的主函数
SimpleTableGen.prototype.init = function () {
    this.table = $('#' + this.tableID);
    var selections = [];
    this.table.bootstrapTable(this.settings)

}

SimpleTableGen.prototype.loadData = function () {

    $.ajax({
        url: API_URL + "/api/" + this.apiName+ "?startTime=2016-09-18 00:00:00&endTime=2016-12-28 00:00:00",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));

        },
        success: function (data) {
            simpleTableGen.table.bootstrapTable('load', data);
        },
        error: function (err) {
        }
    });

};

SimpleTableGen.prototype.shortDateFormatter = function (value, row, index) {
    return value.substring(8, 19);
}


