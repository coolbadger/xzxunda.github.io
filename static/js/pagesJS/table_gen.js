/**
 * Created by Badger on 16/7/27.
 */

function TableGen() {
}

TableGen.prototype.setTable = function (inTable) {

}
TableGen.prototype.tableID = 'table';
TableGen.prototype.modalName = 'myModal';
TableGen.prototype.editFields = new Array('id','orgCode','orgName','orgContact');

//
TableGen.prototype.bind = function () {
    window.onload = this.init();
}

//初始化Table的主函数
TableGen.prototype.init = function () {
    var $table = $('#' + this.tableID);
    var $remove = $('#remove');
    var selections = [];

    this.setTable($table);

    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        // save your data, here just save the current page
        selections = getIdSelections();
        // push or splice the selections if you want to save all data selections
    });

    //'删除已选'按钮操作
    $remove.click(function () {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });

    //'添加'按钮操作，清除模态框内的数据
    $("#add").click(function () {
        //清除form表单中原来的数据
        $(':input', '#myForm')
            .not(':button, :submit')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    });

    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
};

//预设初始化编辑列方法
TableGen.prototype.operateFormatter = function (value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="修改">',
        '<i class="glyphicon glyphicon-edit"></i>',
        '</a>&nbsp;&nbsp;&nbsp;',
        '<a class="remove" href="javascript:void(0)" title="删除">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
};

//预设编辑事件方法
// TableGen.prototype.operationEvent = function () {
//     'click .edit': function(e, value, row, index) {
//         for(var item in this.editFields){
//             $('#'+item).val(row.[item]);
//         }
//         $('#'+this.modalName).modal('show');
//     },
//     'click .remove': function (e, value, row, index) {
//         alert('你选择了删除第' + index + '条记录,' + value + '是: ' + JSON.stringify(row));
//         $('#table').bootstrapTable('remove', {
//             field: 'id',
//             values: [row.id]
//         });
//     }
// };

//
// var tableGen = new TableGen();
// var tID = tableGen.tableID;
// tableGen.setTable = function (inTable) {
//     table.bootstrapTable({
//         height: $(window).height(),
//         columns: [{
//             field: 'state',
//             checkbox: true,
//             align: 'center',
//             valign: 'middle'
//         }, {
//             title: 'ID',
//             field: 'id',
//             align: 'center',
//             sortable: true,
//         }, {
//             title: '组织代码',
//             field: 'orgCode',
//             align: 'center',
//         }, {
//             title: '组织名称',
//             field: 'orgName',
//             align: 'center',
//         }, {
//             title: '联系人',
//             field: 'orgContact',
//             align: 'center',
//         }, {
//             title: '地址',
//             field: 'orgAddress',
//             align: 'center',
//         }, {
//             title: '电话',
//             field: 'orgTell',
//             align: 'center',
//         }, {
//             title: '传真',
//             field: 'orgFax',
//             align: 'center',
//         }, {
//             title: '邮箱',
//             field: 'orgEmail',
//             align: 'center',
//         }, {
//             title: '操作',
//             field: 'operate',
//             align: 'center',
//             valign: 'middle',
//             formatter: operateFormatter,
//             events: operateEvents
//         }]
//     });
// }
// tableGen.bind();