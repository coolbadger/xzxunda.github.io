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

SimpleTableGen.prototype.bind = function () {
    window.onload = this.init();
}

//初始化Table的主函数
SimpleTableGen.prototype.init = function () {
    this.table = $('#' + this.tableID);
    console.log(this.tableID);
    var selections = [];
    this.table.bootstrapTable(this.settings);
}



