var userModel={
	bind: '',
	category: '',
	headimgurl: '',
	incomeAmount: '',
	nickname: '',
	openId: '',
	realName: '',
	source: '',
	timestamp: '',
	token: '',
	version: ''
};
function getUserInfo() {
    if (localStorage && localStorage.getItem(easybuy.Storage.UserInfo)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.UserInfo));
    }

    if (easybuy.parameter.UserInfo)
        return easybuy.parameter.UserInfo;

    return null;
}

function setUserInfo(userInfo) {
    if (localStorage) {
        try {
            localStorage.setItem(easybuy.Storage.UserInfo, JSON.stringify(userInfo));
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.UserInfo);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
    easybuy.parameter.UserInfo = null;
    easybuy.parameter.UserInfo = userInfo;
}

function getUserInfoService() {
    if (localStorage && localStorage.getItem(easybuy.Storage.UserInfoService)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.UserInfoService));
    }

    return null;
}

function setUserInfoService(userInfo) {
    if (localStorage) {
        try {
            localStorage.setItem(easybuy.Storage.UserInfoService, JSON.stringify(userInfo));
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.UserInfoService);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
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
function setToken(token) {
    if (localStorage) {
        try {
            if (token) {
                token.timestamp=(new Date()).getTime();
                token.version=easybuy.version;
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

function setWxSdkToken(wxSdkToken) {
    if (sessionStorage) {
        try {
            if (wxSdkToken) {
                sessionStorage.setItem(easybuy.Storage.WxSdkToken, JSON.stringify(wxSdkToken));
                wxSdkToken = null;
            }
            return;
        }
        catch (e) {
            sessionStorage.removeItem(easybuy.Storage.WxSdkToken);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function getWxSdkToken() {
    if (sessionStorage && sessionStorage.getItem(easybuy.Storage.WxSdkToken)) {
        return JSON.parse(sessionStorage.getItem(easybuy.Storage.WxSdkToken));
    }
    return null;
}

function redirectLogin($location,path){
    if(easybuy.isWechat){
        $location.path("/wechatOauth/"+path);
    }else{
        $location.path("/myProfile/"+path);
    }
}
