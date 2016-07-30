/**
 * Created by Badger on 16/7/25.
 */

// 定义全局变量map
var map;

// 显示点击位置的坐标
function clickMapShowLocation() {
    map.addEventListener("click", function (e) {
        alert(e.point.lng + "," + e.point.lat);
    });
}

// 根据地图容器的ID,初始化地图
function initMap(containerID) {
    map = new BMap.Map("map_container");            // 创建地图实例
    var point = new BMap.Point(117.606257, 34.042178);  // 创建点坐标(目前为双沟镇政府)
    map.centerAndZoom(point, 15);                       // 初始化地图，设置中心点坐标和地图级别

    var mk = new BMap.Marker(point);//添加标记点
    mk.setIcon(null);
    map.addOverlay(mk);
    map.panTo(point);

    map.enableScrollWheelZoom(true);                //鼠标滑动轮子可以滚动
    map.enableKeyboard(true);                       //启用键盘操作
    map.setMapType(BMAP_HYBRID_MAP);                //设置为卫星图

    map.addControl(new BMap.MapTypeControl());      //添加地图类型控件
    map.addControl(new BMap.NavigationControl());   // 添加平移缩放控件
    map.addControl(new BMap.ScaleControl());        // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());  //添加缩略地图控件
    return map;
}

//跳转到徐州双沟镇
function goShuangGou() {
    var sgPoint = new BMap.Point(117.606257, 34.042178);
    var mk = new BMap.Marker(sgPoint);//添加标记点
    map.addOverlay(mk);
    map.panTo(sgPoint);
    map.setCenter(sgPoint);
}

// 跳转到当前位置,并添加标记点
function goCurrentPosition() {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (position) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(position.point);//添加标记点
            map.addOverlay(mk);
            map.panTo(position.point);
            map.setCenter(position.point);
        }
        else {
            alert('无法定位到当前位置:' + this.getStatus());
        }
    });
    //关于状态码
    //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
    //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
    //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
    //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
    //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
    //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
    //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
    //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
    //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
}

//清除覆盖物
function clearAll() {
    map.clearOverlays();
}

