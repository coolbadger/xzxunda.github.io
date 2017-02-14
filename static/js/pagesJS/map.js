/**
 * Created by Badger on 16/7/25.
 */

function GpsRecordLine(mach_terminal) {
    this.mach_terminal_info = mach_terminal;

}
GpsRecordLine.prototype.mach_terminal_info;
GpsRecordLine.prototype.records;
GpsRecordLine.prototype.points;
GpsRecordLine.prototype.line;
GpsRecordLine.prototype.lines;
GpsRecordLine.prototype.workingLins;

GpsRecordLine.prototype.addRecords = function (records) {
    this.records = records;
    this.workingLins = new Array();
    this.points = new Array();
    this.lines= new Array();
    // 现根据预定义规则进行排序
    records.sort(Sorts);
    for (var i = 0; i < records.length; i++) {
        var item = records[i];
        /**
         * 利用prototype共用数据
         * @type {BMap.Point}
         */
        var point = new BMap.Point(item.lngFixed, item.latFixed);
        this.points.push(point);

        // 记录工作点
        var workingPoints = new Array();
        if (i > 0 && records[i].sensor1 == '1') {
            var lastTime = new Date(Date.parse(records[i - 1].gpsTime.replace(/-/g, "/")));
            var thisTime = new Date(Date.parse(item.gpsTime.replace(/-/g, "/")));

            var spanTime = thisTime - lastTime;
            // GPS间隔在5分钟以内,作为同一批次作业
            if (spanTime <= 5 * 1000 * 60) {
                workingPoints.push(point);
            }
        }
        else if(records[i].sensor1 == '1'){
            workingPoints.push(point);
        }
    }

    this.line = new BMap.Polyline(this.points);
    this.lines.push(new BMap.Polyline(this.points));

    return this.line;
}
GpsRecordLine.prototype.setLineColor = function (linecolor) {

}


// 排序规则
function Sorts(a, b) {
    // GPS时间类型忽略毫秒
    var aDate = new Date(Date.parse(a.gpsTime.replace(/-/g, "/")));
    var bDate = new Date(Date.parse(b.gpsTime.replace(/-/g, "/")));
    return aDate - bDate;
}

function MachMap() {
    this.map = this.initMap(this.containerId);
}
MachMap.prototype.containerId = "map_container";
MachMap.prototype.map;
MachMap.prototype.gpsRecordLines = new Map();

// 根据地图容器的ID,初始化地图
MachMap.prototype.initMap = function (containerID) {
    var map = new BMap.Map("map_container");            // 创建地图实例
    var point = new BMap.Point(117.606257, 34.042178);  // 创建点坐标(目前为双沟镇政府)
    map.centerAndZoom(point, 15);                       // 初始化地图，设置中心点坐标和地图级别

    map.enableScrollWheelZoom(true);                //鼠标滑动轮子可以滚动
    map.enableKeyboard(true);                       //启用键盘操作
    map.setMapType(BMAP_HYBRID_MAP);                //设置为卫星图

    map.addControl(new BMap.MapTypeControl());      //添加地图类型控件
    map.addControl(new BMap.NavigationControl());   // 添加平移缩放控件
    map.addControl(new BMap.ScaleControl());        // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());  //添加缩略地图控件
    return map;
}

function mapClick(e) {
    alert(e.point.lng + ", " + e.point.lat);
}
// 自定义地图点击事件
MachMap.prototype.enableMapClick = function (enableClick) {
    if (enableClick == true) {
        this.map.addEventListener("click", mapClick);
    } else {
        this.map.removeEventListener("click", mapClick);
    }
}

// 清楚所有图层
MachMap.prototype.clearAll = function () {
    this.gpsRecordLines.clear();
    this.map.clearOverlays();
}


//根据选择行,请求GPS记录,并向Map中添加一条记录线
MachMap.prototype.addGpsRecords = function (row, cssClass) {
    //console.log(row)
    var gpsRecordLine = new GpsRecordLine(row);
    var ref_id = row.reMachTerminalId;
    var startTime = row.gpsStartTime;
    var endTime = row.gpsEndTime;
    var colorStr = "";

    switch (cssClass) {
        case 'success':
            colorStr = '#000000';
            break;
        case 'info':
            colorStr = '#d1e8f4';
            break;
        case 'warning':
            colorStr = '#fbf7dc';
            break;
        case 'danger':
            colorStr = '#efd6d6';
            break;
        default:
            colorStr = '#d4e9cc';
            break;
    }

    var apiUrl = API_URL + '/api/gpsRecords/refMachTerminal/' + ref_id;
    var defer = $.Deferred();
    $.ajax({
        type: "get",
        url: apiUrl,
        data: "startTime=" + startTime + "&endTime=" + endTime,
        // async: false,//取消异步
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (result) {
            var markers=gpsRecordLine.addRecords(result);
            gpsRecordLine.setLineColor("#a2aea4");
            defer.resolve(ref_id,gpsRecordLine);
            console.log(result[1])
            var arr=new Array();
            var temp=new Array();
            var area=new Array();
            var blocks = [];
            var blocks_area=new Array();
            var m=0;
            var temp_area=[];//存入的面积
            for(var  i=0;i<result.length;i++){
                var lat=result[i].latFixed;
                var lng=result[i].lngFixed;
                if(result[i].sensor1=='1'){

                    if(arr.length==0){
                        temp_area.push(((m*3*15)/10000).toPrecision(3));//计算面积
                        m=0;
                    }

                    var point1= new BMap.Point(lng, lat);
                    arr.push(point1);
                    area.push(result[i]);
                }else{
                    if(arr.length>0){
                        for(var a=0;a<area.length;a++){
                            if(a=='0'){
                            }else {
                                var pointA = new BMap.Point(area[a].lngFixed, area[a].latFixed);  // 创建点坐标
                                var pointB = new BMap.Point(area[a-1].lngFixed, area[a-1].latFixed);  // 创建点坐标
                                var mm=parseFloat((map.getDistance(pointA,pointB)).toFixed(2));
                                m=mm+m;//累加距离
                            }
                        }
                        blocks_area.push(area);
                        var flightPath= new BMap.Polyline(arr, { strokeColor: "#05ab21", strokeOpacity: 0.5, strokeWeight: 25 });
                        blocks.push(flightPath);
                        temp.push(result[i])
                        map.addOverlay(flightPath);
                        // flightPath.addEventListener("mouseover",overattribute);
                        // function overattribute() {
                        //     flightPath.setStrokeColor("#ffffff");
                        // }
                        // flightPath.addEventListener("mouseout",outattribute);
                        // function outattribute() {
                        //     flightPath.setStrokeColor("#000000");
                        // }
                    }
                    arr.length=0;
                    area.length=0;
                }
            }



            temp_area.push(((m*3*15)/10000).toPrecision(3));//计算面积
/*            console.log("这个数据是什么？")
            console.log(m);
            console.log("blocks="+blocks.length)*/
            for (var i = 0; i < blocks.length; i++) {
                (function(){
                    var point = temp[i];
                    var index = i;
                    blocks[i].addEventListener("click",clickAttribute);
                    function clickAttribute() {
                        var opts = {
                            width : 250,    // 信息窗口宽度
                            height: 100,    // 信息窗口高度
                            title : row.machCode + row.machName + "-" + index// 信息窗口标题
                        };

                        var infoWindow = new BMap.InfoWindow("作业面积："+temp_area[index+1]+"亩",opts);  // 创建信息窗口对象
    /*                    infoWindow.setContent(
                            "<div style='background-color: #001a35;height: 100px;width: 250px;'>"+row.machCode + row.machName+"作业面积："+temp_area[index+1]+"亩"+"</div>"
                        );*/
                        var pts = new BMap.Point(point.lngFixed,point.latFixed);
                        map.openInfoWindow(infoWindow, pts);      // 打开信息窗口
                    }
                })();
            }

        }
    });


    return defer.promise();
}
// 移除一条记录线
MachMap.prototype.removeGpsRecords = function (row) {
    var ref_id = row.reMachTerminalId;
    try {
        var line = this.gpsRecordLines.get(ref_id).line;
        this.gpsRecordLines.delete(ref_id);
        this.map.removeOverlay(line);
    }
    catch(e) {

    }
}
// 清除所有记录线
MachMap.prototype.clearGpsRecords = function () {
    var lines = new Array();
    this.gpsRecordLines.forEach(function (item) {
        lines.push(item.line);
    });
    this.gpsRecordLines.clear();
    return lines;
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
            console.log(position.point)
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


/*
//百度地图获取坐标

function goCurrentPosition() {
    var geolocation = new BMap.Geolocation();
    var pt;
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            alert(r.point.lng + " ， " + r.point.lat);
            pt = r;
            showPosition(pt);
        }

    });

}
//百度地图WebAPI 坐标转地址

function showPosition(r) {
    // ak = appkey 访问次数流量有限制
    var url = 'http://api.map.baidu.com/geocoder/v2/?ak=7b788c5ea45cc4b3ac6331a4b0643d5b&callback=?&location=' + r.point.lat + ',' + r.point.lng + '&output=json&pois=1';
    $.getJSON(url, function (res) {
        $("#msg").html(url);
        alert(res.result.addressComponent.city);
    });
}
//百度地图JS API 坐标转地址，没有加载地图时获取不到rs,总是null

function getLocation(myGeo,pt,rs) {
    // 根据坐标得到地址描述
    myGeo.getLocation(pt, function (rs) {
        if (rs) {
            var addComp = rs.addressComponents;
            window.clearInterval(interval);
            alert(addComp);
        }
        return rs;
    });
}

*/

