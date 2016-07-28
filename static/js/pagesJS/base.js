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

