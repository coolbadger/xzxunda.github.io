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
GpsRecordLine.prototype.workingLins;

GpsRecordLine.prototype.addRecords = function (records) {
    this.records = records;
    this.workingLins = new Array();
    this.points = new Array();
    // 现根据预定义规则进行排序
    records.sort(Sorts);
    for (var i = 0; i < records.length; i++) {
        var item = records[i];
        var point = new BMap.Point(item.lngFixed, item.latFixed);
        console.log(point);
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
    return this.line;
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
    var gpsRecordLine = new GpsRecordLine(row);
    var ref_id = row.reMachTerminalId;
    var startTime = row.gpsStartTime;
    var endTime = row.gpsEndTime;
    var colorStr = "";

    switch (cssClass) {
        case 'success':
            colorStr = '#d4e9cc';
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

    $.ajax({
        type: "get",
        url: apiUrl,
        data: "startTime=" + startTime + "&endTime=" + endTime,
        async: false,//取消异步
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (result) {
            gpsRecordLine.addRecords(result);
        }
    });
    this.gpsRecordLines.set(ref_id, gpsRecordLine);
    gpsRecordLine.line.setStrokeColor(colorStr);
    this.map.addOverlay(gpsRecordLine.line)
    return gpsRecordLine;
}
// 移除一条记录线
MachMap.prototype.removeGpsRecords = function (row) {
    var ref_id = row.reMachTerminalId;
    var line = this.gpsRecordLines.get(ref_id).line;
    this.gpsRecordLines.delete(ref_id);
    this.map.removeOverlay(line);
}
// 清楚所有记录线
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


