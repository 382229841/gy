//var serviceUrl = "http://ops.yhiker.com/api";
var serviceUrl = "http://opstest.yhiker.com/api";
var imageServiceUrl = "http://opstest.yhiker.com";
var javaServiceUrl = "http://test.yhiker.com/api";
var paymentUrl="http://test.yhiker.com/pay_kr/alipayapi.jsp?";
var appDownloadUrl = {
    android: "http://www.yhiker.com/download/app/goeasy_tw.apk",
    ios: "https://itunes.apple.com/cn/app/gou-qing-song-tai-wan/id916120583?mt=8",//"https://itunes.apple.com/cn/app/hai-you/id651283761?mt=8",
    webchat: "http://a.app.qq.com/o/simple.jsp?pkgname=com.yhiker.gou.taiwan",
	allPlatform:"http://www.yhiker.com/download/app/scan.php",
	weixinIos:"http://mp.weixin.qq.com/mp/redirect?url=https%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Fgou-qing-song-tai-wan%2Fid916120583%3Fmt%3D8"
};
var appDownloadKrUrl = {
    android: "http://app.yhiker.com/goeasy_kr.apk",
    ios: "https://itunes.apple.com/cn/app/gou-qing-song-han-guo/id990483128?ls=1&mt=8",
    webchat: "http://a.app.qq.com/o/simple.jsp?pkgname=com.yhiker.gou.korea",
	allPlatform:"http://www.yhiker.com/download/app/scan.php",
	weixinIos:"http://mp.weixin.qq.com/mp/redirect?url=https%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Fgou-qing-song-tai-wan%2Fid916120583%3Fmt%3D8"
};
var webchatOauth=function(state,type){
    if(type=="userinfo"){
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9379aa3ae5ab5c6&redirect_uri=http://ops.yhiker.com/api/wx/oauth4kr.php&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect";
    }else{
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9379aa3ae5ab5c6&redirect_uri=http://ops.yhiker.com/api/wx/oauth4kr.php&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect";
    }
};
//?environment=test