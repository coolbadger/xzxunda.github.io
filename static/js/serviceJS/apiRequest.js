/**
 * Created by badger on 2016/10/27.
 */

//用于统一的ajax请求（适用于客户端已经取得授权）
function ApiRequest() {
    this.type = "get";
    this.params = "";
    this.url = "";
}
ApiRequest.prototype.type;
ApiRequest.prototype.params;
ApiRequest.prototype.url;
ApiRequest.prototype.send = function () {
    var defer = $.Deferred();

    var aType = this.type;
    var aParams = this.params;
    var aUrl = this.url;
    $.ajax({
        type: aType,
        url: aUrl,
        data: aParams,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (result) {
            defer.resolve(result);
        }
    });

    return defer.promise();
}
