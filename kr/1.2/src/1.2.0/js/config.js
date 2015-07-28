//var serviceUrl = "http://ops.yhiker.com/api";
var serviceUrl = "http://ops.yhiker.com/api";
var imageServiceUrl = "http://ops.yhiker.com";
var javaServiceUrl = "http://buy.yhiker.com/api_kr";
var paymentUrl="http://buy.yhiker.com/pay_kr/alipayapi.jsp?";
var appDownloadUrl = {
    android: "http://app.yhiker.com/kr/goeasy_kr.apk",
    ios: "https://itunes.apple.com/cn/app/gou-qing-song-han-guo/id990483128?ls=1&mt=8",
    webchat: "http://a.app.qq.com/o/simple.jsp?pkgname=com.yhiker.gou.korea",
	allPlatform:"http://www.yhiker.com/download/app/scan.php",
	weixinIos:"http://mp.weixin.qq.com/mp/redirect?url=https%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Fgou-qing-song-tai-wan%2Fid916120583%3Fmt%3D8"
};
var webchatOauth=function(state,type){
    if(type=="userinfo"){
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9379aa3ae5ab5c6&redirect_uri=http://ops.yhiker.com/api/wx/oauth2kr.php&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect";
    }else{
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9379aa3ae5ab5c6&redirect_uri=http://ops.yhiker.com/api/wx/oauth2kr.php&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect";
    }
};