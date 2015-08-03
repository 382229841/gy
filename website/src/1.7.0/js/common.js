var easybuy={};
easybuy.version="6.29.1340";
easybuy.Storage = { OrderProducts: "Order.OrderProducts", Address: "Global.Address", AddressTemp: "Address.Temp", MobileInquiry: "Inquiry.Mobile", UserInfo: "Global.UserInfo",UserInfoService:"Global.UserInfoService", Car: "Global.Car",Cart: "Global.Cart", DownloadAppClose: "Global.DownloadAppClose", oAuth: "Global.oAuth", Order:"Global.Order", Token:"Global.Token", WxSdkToken:"Global.WxSdkToken", Find:"Global.Find", RechargeRoute:"Global.RechargeRoute", Cleaner:"Global.Cleaner"};
var statusCode = {
    Success: 0,
    error: -1
}
var statusMsg = {
    Success: 'OK',
    error: 'failed'
}
var isDebug=false;
function debugAlert(msg){
	if(isDebug){
		alert(msg);
	}
}
var defindeBackBtn=[];
defindeBackBtn['/car']="/myCars";
defindeBackBtn['/myCars']="/order";
defindeBackBtn['/order']="/teacher";
defindeBackBtn['/teacher']="/teachers";
/**
 * Created by Tiffany.Zhou on 6/9/14.
 */
// validate the email is valid
function isEmail(aEmail) {
    var bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
}
// at least one number and at least one letter
function isPassword(aPassword) {
    var bValidate = RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/).test(aPassword);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
}

function isContainStr(aPassword,str) {
    if ("" != str && undefined != str) {
        if (aPassword.toLowerCase().indexOf(str.toLowerCase()) > -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

// validate the phone is valid
function isPhone(aPhone) {
//    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(aPhone);
//    if (bValidate) {
//        return true;
//    } else {
//        return false;
//    }
    return aPhone.match("^[0-9]{2}-[0-9]{8}$");
}


function isInvalidMPhone(MPhone) {
    return MPhone.match("^[0-9]{2}-[0-9]{9}$");
}

// validate the string is integer
function isInteger(s) {
    var isInteger = RegExp(/^[0-9]+$/);
    return (isInteger.test(s));
}


// press the enter key,focus the next control
function handleEnter(field, event) {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (keyCode == 13) {
        var i;
        for (i = 0; i < field.form.elements.length; i++)
            if (field == field.form.elements[i])
                break;
        i = (i + 1) % field.form.elements.length;
        field.form.elements[i].focus();
        return false;
    }
    else {
        return true;
    }
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getWeekDay(date) {
    var milliseconds = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
    var weekDate = (date.getTime()) - ((date.getDay()) * 86400000) - milliseconds;
    return weekDate;
}

function getWeeHoursDay(date){
    var milliseconds = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
    return (date.getTime() - milliseconds);
}

function getWindowHeight() {
    var winHeight = 0;
    //get window's height
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    }
    else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    //get the window size deep through document on the body
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
    }
    return winHeight;
}

function getObjAttributeNames(obj) {
    var methods = new Array();
    for (key in obj) {
        methods.push(key);
    }
    return methods;
}

function getObjAttributeNameByValue(obj, value) {
    for (key in obj) {
        if (eval('obj.' + key) == value) {
            return key;
        }
    }
    return null;
}

function getEnumAttributes(obj) {
    var methods = new Array();
    for (key in obj) {
        var element = new Object();
        element.name = key;
        element.value = eval('obj.' + key);
        methods.push(element);
    }
    return methods;
}

function getDay(val) {
    var day = "";
    switch (val) {
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
        case 1:
            day = "Monday";
            break;
    }
    return day;
}

function validInteger(value) {
    if (value != null) {
        value = value.toString();
        value = value.replace(/[^\d]/g, ""); //clear except number
    }
    return value;
}

function validDecimal(value) {
    if (value != null) {
        value = value.toString();
        value = value.replace(/[^\d.]/g, ""); //clear except number and point
        value = value.replace(/^\./g, ""); //first letter must be number
        value = value.replace(/\.{2,}/g, "."); //only keep one point
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        value = value.replace(/^(-?\\d+)(\\.\\d+)?$/, '');
    }
    return value;
}

function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function isWeibo() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroBlog/i) == "microblog") {
        return true;
    } else {
        return false;
    }
}

var MobileTypes = {
    Android: "Android",
    iPhone: "iPhone",
    iPad: "iPad",
    None: ""
}

function getMobileType() {
    var u = navigator.userAgent;
    //android
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //android终端或者uc浏览器
        return MobileTypes.Android;
    }
    //iPhone
    if (u.indexOf('iPhone') > -1) { //是否为iPhone
        return MobileTypes.iPhone;
    }
    //iPad
    if (u.indexOf('iPad') > -1) { //是否iPad
        return MobileTypes.iPad;
    }
    //iPhone
    if (u.indexOf('Mac') > -1) { //是否为iPhone或者QQHD浏览器
        return MobileTypes.iPhone;
    }
    return MobileTypes.None;
}

function encodeUTF8(str) {
    var temp = "", rs = "";
    for (var i = 0, len = str.length; i < len; i++) {
        temp = str.charCodeAt(i).toString(16);
        rs += "\\u" + new Array(5 - temp.length).join("0") + temp;
    }
    return rs;
}
function decodeUTF8(str) {
    return str.replace(/(\\u)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
        return String.fromCharCode(parseInt($2, 16));
    });
}
function checkNumber(obj, havePoint) {
	if (havePoint) {
		var flag = false;
		if (obj.value.indexOf(".") > -1 && obj.value.split(".").length > 1) flag = true;		
		if ((event.keyCode < 48) && flag || event.keyCode > 57) event.returnValue = false;
		if (event.keyCode >=35 && event.keyCode<=37)event.returnValue = false;
		if (event.keyCode >=38 && event.keyCode<=43)event.returnValue = false;
		if (event.keyCode ==45) event.returnValue = false;
		if (event.keyCode ==44) event.returnValue = false;
		if (event.keyCode ==47) event.returnValue = false;
		if(obj.value.split(".").length > 1 && obj.value.split(".")[1].length>2) event.returnValue = false;
	}
	else{
        if ((event.keyCode!==46) && (event.keyCode!==8) && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) event.returnValue = false;
    }
}
function checkNumberTwo(obj, havePoint) {
	if (havePoint) {
		var flag = false;
		if (obj.value.indexOf(".") > -1 && obj.value.split(".").length > 1) flag = true;		
		if ((event.keyCode < 48) && flag || event.keyCode > 57) event.returnValue = false;
		if (event.keyCode >=35 && event.keyCode<=37)event.returnValue = false;
		if (event.keyCode >=38 && event.keyCode<=43)event.returnValue = false;
		if (event.keyCode ==45) event.returnValue = false;
		if (event.keyCode ==44) event.returnValue = false;
		if (event.keyCode ==47) event.returnValue = false;
		if(obj.value.split(".").length > 1 && obj.value.split(".")[1].length>2) event.returnValue = false;
	}
	else{
        if(obj.value.length==0 || parseInt(obj.value)<=1){
            obj.value=1;
        }
        countTotal(obj);
    }
}
function reduceNum(obj){
    var n=parseInt($(obj).next().val());
    if(n<=1){
        $(obj).next().val(1);
    }else{
        $(obj).next().val(n-1);
    }
    countTotal($(obj).next()[0]);
}
function addNum(obj){
    var n=parseInt($(obj).prev().val());
    $(obj).prev().val(n+1);
    countTotal($(obj).prev()[0]);
}
function countTotal(obj){
    var newVal=parseFloat(obj.value)*parseFloat($(obj).prev().prev().val());
    $(".promotePriceNewTotal").html("￥"+newVal.toFixed(2));
}

Date.prototype.diff = function(date){
  return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
}

function setDocumentTitle(title){
	var title=title || $(".navbar-absolute-top>.navbar-brand span").text();
	
	$(document).attr("title",title);
}

function getToken() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Token)) {
        var token=JSON.parse(localStorage.getItem(easybuy.Storage.Token));
        var currentTimestamp=(new Date()).getTime();

        if(token && token.timestamp && token.version){
            var temp=currentTimestamp-token.timestamp;
            var expire=7*24*60*60*1000;
            if(temp>0 && temp<expire && easybuy.version==token.version){
                token=token;
            }else{
                localStorage.removeItem(easybuy.Storage.Token);
                token=null;
            }
        }else{
            localStorage.removeItem(easybuy.Storage.Token);
            token=null;
        }
        return token;
    }

    return null;
}
function setToken(token,wxuser) {
    if (localStorage) {
        try {
            if (token) {
                token.timestamp=(new Date()).getTime();
                token.version=easybuy.version;
                if(wxuser && wxuser.openid){
                	token.openid=wxuser.openid;
                	token.headimgurl=wxuser.headimgurl;
                }
                localStorage.setItem(easybuy.Storage.Token, JSON.stringify(token));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Token);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Token);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}
function removeToken() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Token);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Token);
        }
    }
}

function getRechargeRoute() {
    if (localStorage && localStorage.getItem(easybuy.Storage.RechargeRoute)) {
        var route=JSON.parse(localStorage.getItem(easybuy.Storage.RechargeRoute));
        var currentTimestamp=(new Date()).getTime();

        if(route && route.timestamp){
            var temp=currentTimestamp-route.timestamp;
            var expire=60*60*1000;
            if(temp>0 && temp<expire){
                route=route;
            }else{
                localStorage.removeItem(easybuy.Storage.RechargeRoute);
                route=null;
            }
        }else{
            localStorage.removeItem(easybuy.Storage.RechargeRoute);
            route=null;
        }
        return route;
    }

    return null;
}
function setRechargeRoute(route) {
    if (localStorage) {
        try {
            if (route) {
                route.timestamp=(new Date()).getTime();
                
                localStorage.setItem(easybuy.Storage.RechargeRoute, JSON.stringify(route));
            }
            else {
                localStorage.removeItem(easybuy.Storage.RechargeRoute);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.RechargeRoute);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}



function getOrder() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Order)) {
        var Order=JSON.parse(localStorage.getItem(easybuy.Storage.Order));
        return Order;
    }

    return null;
}
function setOrder(order) {
    if (localStorage) {
        try {
            if (order) {
                localStorage.setItem(easybuy.Storage.Order, JSON.stringify(order));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Order);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Order);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}
function removeOrder() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Order);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Order);
        }
    }
}

function getCleaner() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Cleaner)) {
        var Cleaner=JSON.parse(localStorage.getItem(easybuy.Storage.Cleaner));
        return Cleaner;
    }

    return null;
}
function setCleaner(cleaner) {
    if (localStorage) {
        try {
            if (cleaner) {
                localStorage.setItem(easybuy.Storage.Cleaner, JSON.stringify(cleaner));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Cleaner);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Cleaner);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}
function removeCleaner() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Cleaner);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Cleaner);
        }
    }
}

function getCar() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Car)) {
        var car=JSON.parse(localStorage.getItem(easybuy.Storage.Car));
        return car;
    }

    return null;
}
function setCar(car) {
    if (localStorage) {
        try {
            if (car) {
                localStorage.setItem(easybuy.Storage.Car, JSON.stringify(car));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Car);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Car);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}
function removeCar() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Car);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Car);
        }
    }
}

function getLocation(callback)
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(
		function(p){
			callback(p,true);
		},function(e){
			callback(e,false);
		});
	}
	else{
		alert("Geolocation is not supported by this browser.");
	}
}

//获取QueryString的数组

function getQueryString(){

     var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g")); 

     if(result == null){

         return "";

     }

     for(var i = 0; i < result.length; i++){

         result[i] = result[i].substring(1);

     }

     return result;

}

//根据QueryString参数名称获取值

function getQueryStringByName(name){

     var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

     if(result == null || result.length < 1){

         return "";

     }

     return result[1];

}

//根据QueryString参数索引获取值

function getQueryStringByIndex(index){

     if(index == null){

         return "";

     }

     var queryStringList = getQueryString();

     if (index >= queryStringList.length){

         return "";

     }

     var result = queryStringList[index];

     var startIndex = result.indexOf("=") + 1;

     result = result.substring(startIndex);

     return result;

}

function getUserInfo(rdata,callback){
	var requestData={};
	requestData.user_id=rdata.id;
	requestData.mobile=rdata.mobile;
	requestData.isNewUser=rdata.isNewUser;
	var url="http://m.xiaoniubang.com/api/index.php?s=home/index/login";
    /*$.post(url, requestData,
	   function(data){
		   if(callback){
			   callback(data);
		   }
	   },
	 "json");*/
	 
	 $.ajax({
        url: url,
        type: "post",
		data:requestData,
		async: false,
        success: function(data) {
			if(callback){
			   callback(data);
		   }
		},
        cache: false,
        timeout: 5000,
        error: function() {
            alert("获取用户信息超时");
        }
    });
}