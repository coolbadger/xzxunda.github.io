/**
 * Created by sw on 2017-5-30 20:16:37
 * 判断pc还是移动端访问
 * true为pc；false为移动端
 */
function pc_phone() {
    $(document).ready(function () {
        var ua = navigator.userAgent.toLocaleLowerCase();
        var pf = navigator.platform.toLocaleLowerCase();
        var isAndroid = (/android/i).test(ua)||((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf))
            || (/ucweb.*linux/i.test(ua));
        var isIOS =(/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
        var isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);

        var mobileType = {
            pc:!isAndroid && !isIOS && !isWinPhone,
            ios:isIOS,
            android:isAndroid,
            winPhone:isWinPhone
        };
        return mobileType.pc;
    });
}