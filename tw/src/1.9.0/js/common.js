var statusCode = {
    Success: 0,
    error: -1
}

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

function isApp(location) {
	//1: android, 2: ios
	if(location.search() && location.search().platform){
        if(location.search().platform=="android"){
			return 1;
        }else if(location.search().platform=="ios"){
			return 2;
        }else{
			return 0;
        }
    }else{
    	return 0;
    }
}
function getTokenFromApp(location){
	var flag=isApp(location);
	if(flag){
		if(location.search() && location.search().token){
			return location.search().token;
		}else{
			return "";
		}
	}
	return "";
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
var isDebug=false;
function debugModel(msg){
	if(isDebug){
		alert(msg);
	}
};

function getQueryStringByName(name){
	 var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
	 if(result == null || result.length < 1){
		 return "";
	 }
	 return result[1];

}