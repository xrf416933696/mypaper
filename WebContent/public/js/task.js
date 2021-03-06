/**
 * 
 */
$(document).ready(function(){	
	$.ajax({  
        type: "GET",  
        url: "/mypaper/task/gettasktimeandcost", 
        data: {"wid":staticwid},  
        success: function(data){
        	document.getElementById("total").innerText = "本次救援时间为"+data.time+"分钟，救援成本为"+data.cost+"元";
        },  
        error: function(json){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
	initgoodtable();
	initwhtable();
    initlogtable();
})

function initgoodtable(){
	$('#goodtg').datagrid({
		url:'/mypaper/reqgood/findbyrid',
		title:'出救物资表',
		pageSize: 4,  
        pageList: [4, 8, 12],  
        height: '94%',
		iconCls:'icon-save',
		striped:true,
		rownumbers:true,
		pagination:true,
		singleSelect:false,
		loadMsg:'数据加载中......',
		columns:[[
		{field:'gname',title:'物资名称',width:'17%',align:'center'},
		{field:'code',title:'物资编号',width:'22%',align:'center'},
		{field:'kind',title:'物资类型',width:'25%',align:'center'},
		{field:'amount',title:'数量',width:'16%',align:'center'},
		{field:'detail',title: '出救详情',align: 'center',width:'17%',  
            //添加超级链 
            formatter:function(value,rowData,rowIndex){
                //function里面的三个参数代表当前字段值，当前行数据对象，行号（行号从0开始
                return "<a href='javacript:void(0);' onclick='showgoodinfo(" +rowData.gid+ ");'>表</a>" + "  " + 
                "<a href='javacript:void(0);' onclick='showgoodmap(" +rowData.gid+ ");'>图</a>" ;
           }  
        }
		]],
	});
	
	var p = $('#goodtg').datagrid('getPager');  
    $(p).pagination({  
        displayMsg: '共 {total} 条记录',  
    });
}

function initwhtable(){
	var IsCheckFlag = true; //标示是否是勾选复选框选中行的，true - 是 , false - 否
	$('#warehousetg').datagrid({
		url:'/mypaper/warehouse/selectedwh',
		title:'出救仓储表',
		pageSize: 4,  
        pageList: [4, 8, 12],  
        height: '94%',
		iconCls:'icon-save',
		striped:true,
		rownumbers:true,
		pagination:true,
		singleSelect:false,
		loadMsg:'数据加载中......',
		columns:[[
		{field:'wname',title:'仓储名称',width:'60%',align:'center'},
		{field:'type',title:'类型',width:'20%',align:'center'},
		{field:'detail',title: '出救物资',align: 'center',width:'17%',  
            //添加超级链 
            formatter:function(value,rowData,rowIndex){
                //function里面的三个参数代表当前字段值，当前行数据对象，行号（行号从0开始
                return "<a href='javacript:void(0);' onclick='showwhinfo(" +rowData.wid+ ");'>表</a>" + "  " + 
                "<a href='javacript:void(0);' onclick='showwhmap("+ "\""+rowData.wid+ "\""+", " + "\""+rowData.coordinate+ "\""+");'>图</a>" ;
           }  
        }
		]],
		onLoadSuccess:function(data){
			var rowData = data.rows;  
			for(var i = 0; i < data.all.length; i++){
				var result = data.all[i].coordinate.split(",");
				var point = new BMap.Point(result[0], result[1]);
	            
	            var content = "<div>";  
	            content = content + "名称：" + data.all[i].wname +"</br>";  
	            content = content + "详细地址：" + data.all[i].location + "</br>"; 
	            content = content + "联系人：" + data.all[i].contact + "</br>"; 
	            content = content + "联系方式：" + data.all[i].number + "</br>"; 
	            content = content + "<a href='javacript:void(0);' onclick='showwhinfo(" +data.all[i].wid+");'>查看详情</a>";
	            content += "</div>";
	            
	            createMarker(point,content,"wh");
			}
		}
	});
	
	var p = $('#warehousetg').datagrid('getPager');  
    $(p).pagination({  
        displayMsg: '共 {total} 条记录',  
    });
}

function initlogtable(){
	$('#logistictg').datagrid({
		url:'/mypaper/logpark/selectedpk',
		title:'出救物流园区表',
		pageSize: 3,  
        pageList: [3, 6, 9],  
        height: '100%',
		iconCls:'icon-save',
		striped:true,
		rownumbers:true,
		pagination:true,
		singleSelect:false,
		loadMsg:'数据加载中......',
		columns:[[
		{field:'p_name',title:'园区名称',width:'50%',align:'center'},
		{field:'totaluse',title:'出救运力(kg)',width:'27%',align:'center'},
		{field:'detail',title: '出救工具',align: 'center',width:'20%',  
            //添加超级链 
            formatter:function(value,rowData,rowIndex){
                //function里面的三个参数代表当前字段值，当前行数据对象，行号（行号从0开始
            	return "<a href='javacript:void(0);' onclick='showloginfo(" +rowData.pid+ ");'>表</a>" + "  " + 
                "<a href='javacript:void(0);' onclick='showlogmap("+ "\""+rowData.pid+ "\""+", " + "\""+rowData.p_coordinate+ "\""+");'>图</a>" ;
           }  
        }
		]],
	});
	
	var q = $('#logistictg').datagrid('getPager');  
    $(q).pagination({  
        displayMsg: '共 {total} 条记录',  
    });
}

function createMarker(point,content,type){
	if(type == "wh"){
		var myIcon = new BMap.Icon("/mypaper/img/warehouse_select.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
		title = "仓储详细信息"
	}
	if(type == "lp"){
		var myIcon = new BMap.Icon("/mypaper/img/logpark_select.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
		title = "物流园区详细信息"
	}
	var opts = {
			  width : 400,     // 信息窗口宽度
			  height: 120,     // 信息窗口高度
			  title : title 	// 信息窗口标题
			}
	var pointMarker = new BMap.Marker(point, {icon:myIcon});
	map.addOverlay(pointMarker);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	pointMarker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	});
}

var staticgid;
function showgoodinfo(gid){
	staticgid = gid;
	var url = "goodsinfo.jsp";
	var options = {
			title:"物资出救详情",
			href: url,
			width:800,
			height:400
		};
	$("#goodsinfo").window(options);
}

function showgoodmap(gid){
	freshmap();	//刷新地图
	$.ajax({  
        type: "POST",  
        url: "/mypaper/whgood/findwhbygoods",
        data: {"gid":gid, "page":1, "rows":10},	//page和rows随意赋值，不影响  
        success: function(data){  
        	for(var i = 0 ; i < data.all.length ; i++){
	        	var coordinate = data.all[i].warehouse.coordinate.split(",");
	        	var myIcon = new BMap.Icon("/mypaper/img/jiantou.png",{    //仓库
	        		imageOffset: new BMap.Size(64, 64)    //图片的偏移量。为了是图片底部中心对准坐标点。
	        	  });
	        	var point = new BMap.Point(coordinate[0], coordinate[1]);
	        	var pointMarker = new BMap.Marker(point, {icon:myIcon});
	        	map.addOverlay(pointMarker);
        	}
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
}

function freshmap(){
	map.clearOverlays();
	var point = new BMap.Point(103.048991,30.016365);
	map.centerAndZoom(point, 7);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	initwhtable();
}

var staticwid;
function showwhinfo(wid){
	staticwid = wid;
	var url = "whinfo.jsp";
	var options = {
			title:"仓储出救详情",
			href: url,
			width:800,
			height:400
		};
	$("#whinfo").window(options);
}

function showwhmap(wid, wcoordinate){
	map.clearOverlays();
	var result = wcoordinate.split(",");
	var point = new BMap.Point(result[0], result[1]);
	map.centerAndZoom(point, 14);
	
	var tool;
	
	$.ajax({  
        type: "POST",  
        url: "/mypaper/warehouse/findbywid",
        data: {"wid":wid},	//page和rows随意赋值，不影响  
        success: function(data){  
        	tool = data.warehouse.tool;
        	
        	var content = "<div>";  
            content = content + "名称：" + data.warehouse.wname +"</br>";  
            content = content + "详细地址：" + data.warehouse.location + "</br>"; 
            content = content + "联系人：" + data.warehouse.contact + "</br>"; 
            content = content + "联系方式：" + data.warehouse.number + "</br>"; 
            content = content + "<a href='javacript:void(0);' onclick='showwhinfo("+data.warehouse.wid+");'>查看详细信息</a>";
            content += "</div>";
            
            createMarker(point,content,"wh");
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
	
	$.ajax({  
        type: "POST",  
        url: "/mypaper/whparkvehicle/findlogbywh",
        data: {"wid":wid, "page":1, "rows":1000},	//page和rows随意赋值，不影响  
        success: function(data){  
        	for(var i = 0 ; i < data.all.length ; i++){
	        	var pcoordinate = data.all[i].logpark.p_coordinate.split(",");
	        	
	        	var content = "<div>";  
	            content = content + "名称：" + data.all[i].logpark.p_name +"</br>";  
	            content = content + "详细地址：" + data.all[i].logpark.p_location + "</br>"; 
	            content = content + "联系人：" + data.all[i].logpark.p_master + "</br>"; 
	            content = content + "联系方式：" + data.all[i].logpark.p_contact + "</br>"; 
	            //只能查看该仓储已经确定的运输工具类型
	            content = content + "<a href='javacript:void(0);' onclick='showloginfo("+data.all[i].logpark.pid+");'>查看详细信息</a>";
	            content += "</div>";
	            
	            var wcoor = wcoordinate.split(',');
	            
	            createMarkerandDraw(wid, wcoor, content, pcoordinate, tool, "wh");
        	}
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
}

function createMarkerandDraw(wid, wcoordinate, content, pcoordinate, tool, type){
	var myIcon1;
	var title;
	var point;
	var point2;
	if(type == 'wh'){
		var myIcon1 = new BMap.Icon("/mypaper/img/logpark_select.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
		title = "物流园区详细信息";
		point = new BMap.Point(pcoordinate[0], pcoordinate[1]);
		point2 = new BMap.Point(wcoordinate[0], wcoordinate[1]);	
	}
	if(type == "lp"){
		var myIcon1 = new BMap.Icon("/mypaper/img/warehouse_select.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
		title = "仓储详细信息";
		point = new BMap.Point(wcoordinate[0], wcoordinate[1]);
		point2 = new BMap.Point(pcoordinate[0], pcoordinate[1]);
	}
	
	var opts = {
			  width : 400,     // 信息窗口宽度
			  height: 120,     // 信息窗口高度
			  title : title 	// 信息窗口标题
			}
	
	var pointMarker = new BMap.Marker(point, {icon:myIcon1});
	map.addOverlay(pointMarker);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	pointMarker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	});
	
	//画线和运输工具
	var myIcon2;
	if(tool == "汽车"){
		myIcon2 = new BMap.Icon("/mypaper/img/car.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
	}
	if(tool == "火车"){
		myIcon2 = new BMap.Icon("/mypaper/img/train.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
	}
	if(tool == "飞机"){
		myIcon2 = new BMap.Icon("/mypaper/img/plane.png", new BMap.Size(32, 32), {    //仓库
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		  });
	}
	
	var lon = (Number(wcoordinate[0]) + Number(pcoordinate[0]))/2;
	var lat = (Number(wcoordinate[1]) + Number(pcoordinate[1]))/2;
	var midpoint = new BMap.Point(lon, lat);
	var toolMarker = new BMap.Marker(midpoint, {icon:myIcon2});
	map.addOverlay(toolMarker);
	
	var polyline = new BMap.Polyline([point,point2], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
	map.addOverlay(polyline);
}

var staticpid;
function showloginfo(pid){
	staticpid = pid;
	var url = "loginfo.jsp";
	var options = {
			title:"物流园区出救详情",
			href: url,
			width:800,
			height:400
		};
	$("#loginfo").window(options);
}

function showlogmap(pid, pcoordinate){
	map.clearOverlays();
	var result = pcoordinate.split(",");
	var point = new BMap.Point(result[0], result[1]);
	map.centerAndZoom(point, 14);
	
	$.ajax({  
        type: "POST",  
        url: "/mypaper/logpark/findbypid",
        data: {"pid":pid},	//page和rows随意赋值，不影响  
        success: function(data){  
        	
        	var content = "<div>";  
            content = content + "名称：" + data.logpark.p_name +"</br>";  
            content = content + "详细地址：" + data.logpark.p_location + "</br>"; 
            content = content + "联系人：" + data.logpark.p_master + "</br>"; 
            content = content + "联系方式：" + data.logpark.p_contact + "</br>"; 
            content = content + "<a href='javacript:void(0);' onclick='showloginfo("+data.logpark.pid+");'>查看详细信息</a>";
            content += "</div>";
            
            createMarker(point,content,"lp");
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
	
	$.ajax({  
        type: "POST",  
        url: "/mypaper/whparkvehicle/findwhbypk",
        data: {"pid":pid, "page":1, "rows":1000},	//page和rows随意赋值，不影响  
        success: function(data){  
        	for(var i = 0 ; i < data.all.length ; i++){
	        	var wcoordinate = data.all[i].warehouse.coordinate;
	        	
	        	var content = "<div>";  
	            content = content + "名称：" + data.all[i].warehouse.wname +"</br>";  
	            content = content + "详细地址：" + data.all[i].warehouse.wlocation + "</br>"; 
	            content = content + "联系人：" + data.all[i].warehouse.contact + "</br>"; 
	            content = content + "联系方式：" + data.all[i].warehouse.number + "</br>"; 
	            //只能查看该仓储已经确定的运输工具类型
	            content = content + "<a href='javacript:void(0);' onclick=showwhinfo("+data.all[i].warehouse.wid+");'>查看详细信息</a>";
	            content += "</div>";
	            
	            var wcoor = wcoordinate.split(',');
	            
	            createMarkerandDraw(data.all[i].warehouse.wid, wcoor, content, result, data.all[i].warehouse.tool,"lp");
        	}
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
}

function exportfile(){
	$.ajax({  
        type: "POST",  
        url: "/mypaper/task/download",
        success: function(data){  
        	alert("yes");  
        },  
        error: function(data){  
            alert("系统异常，请刷新后重试...");  
        }  
    });
}

function reset(){
	window.location.href = "selectlog.jsp"
}

function next(){
	if(window.confirm('确定下发任务？')){
		window.location.href = "http://192.168.5.116:8080/preproject/backstage/emergency/live";
	    return true;
    }
	else{
		$('#goodstable').datagrid('reload');
        return false;
    }
}