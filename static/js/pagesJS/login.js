/**
 * Created by JLee on 16/7/20.
 */

var secondCtrl = angular.module('login', ['ngRoute', 'httpService']);





secondCtrl.controller('loginCtrl', function ($scope, $location, httpService) {
    $scope.login = function () {
        var userName = $scope.username;
        var password = $scope.password;
        var params = {
            "username": userName,
            "password": password
        };
        var author_code = "Basic " + btoa(userName + ":" + password);

        $.ajax({
            url: API_URL + "/api/orgUsers",
            data: params,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", author_code);
            },
            success: function (data) {

                for(var i=0;i<data.length;i++){
                    if(data[i].password==password&&data[i].userName==userName){
                        $.cookie('id',data[i].id)

                    }
                }
                $.cookie('userName',userName);
                $.cookie('passWord',password);
                $.cookie('islogin', 'true', {path: '/'});
                $.cookie('author_code', author_code, {path: '/'});
                /*alert($.cookie('id'))*/
                window.location.href = "/pages/home.html";
            },
            error: function (err) {
                console.log(err.status);
            }
        });
        //
        // httpService.postUrl("api/system/login", params, function (data) {
        //     //alert(data);
        //     if (data.code == '200') {
        //         //alert("success")
        //         //$location.path('/home');
        //         $.cookie('islogin', 'true', {path: '/'});
        //         window.location.href = "/pages/home.html";
        //     } else {
        //         alert("error")
        //         $location.path('/');
        //     }
        // });

        console.log("登录");

    }
});