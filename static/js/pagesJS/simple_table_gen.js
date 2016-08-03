/**
 * Created by Badger on 16/8/3.
 */

function SimpleTableGen() {
}


SimpleTableGen.prototype.tableID = 'table';
SimpleTableGen.prototype.modalName = 'myModal';
SimpleTableGen.prototype.settings = new Object();
SimpleTableGen.prototype.editFields = new Array();

SimpleTableGen.prototype.bind = function () {
    window.onload = this.init();
}

//初始化Table的主函数
SimpleTableGen.prototype.init = function () {
    var $table = $('#' + this.tableID);
    var selections = [];

    $table.bootstrapTable(this.settings);
}
