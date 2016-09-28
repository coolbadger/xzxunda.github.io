/**
 * Created by Badger on 16/7/28.
 */

function checkLogin() {
    if (!$.cookie('islogin')) {
        if (window.location.pathname != '/pages/login.html') {
            top.location.href = '/pages/login.html';
        }
    }
    else if (window.location.pathname == '/') {
        top.location.href = '/pages/home.html';
    }
}

// 获取当前时间
function getCurrentDate(addDays, enableTime) {
    var date = new Date();
    if (addDays != null) {
        date = new Date(new Date().getTime() + addDays * 24 * 60 * 60 * 1000);
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = "00";
    var minutes = "00";
    var seconds = "00";
    if (enableTime == true) {
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
}