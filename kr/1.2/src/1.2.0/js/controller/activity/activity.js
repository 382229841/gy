app.register.controller('activityXrhlController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/xrhl?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/xrhl/ad.png";
    var title="购轻松韩国";
    var desc="新人尊享，豪华大礼免费领";
    
    var createNonceStr = function () {
         return Math.random().toString(36).substr(2, 15);
    };

    var createTimestamp = function () {
         return parseInt(new Date().getTime() / 1000) + '';
    };
    var raw = function (args) {
          var keys = Object.keys(args);
          keys = keys.sort()
          var newArgs = {};
          keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = args[key];
          });

          var string = '';
          for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
          }
          string = string.substr(1);
          return string;
    };
    var nonceStr=createNonceStr();
    var timestamp=createTimestamp();
    var weixinSdkConfig=function(){
		$scope.ticket=getWxSdkToken().ticket;
        var ret = {
            jsapi_ticket: getWxSdkToken().ticket,
            nonceStr: nonceStr,
            timestamp: timestamp,
            url: $location.absUrl().split('#')[0]
        };
        var string=raw(ret);
        var signature=signSha1(string);
        
        var config=
        {     
            //debug:true,    
            appId: easybuy.weixinAppId, 
            timestamp: timestamp,
            nonceStr: nonceStr,
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
            signature:signature
        }

        $(document).ready(function(){
            wx.config(config);
            wx.ready(function(){

                wx.onMenuShareTimeline({
                    title: desc,
                    link: link+'1',
                    imgUrl: imgUrl,
                    success: function () { 
                        // 用户确认分享后执行的回调函数 
                        $scope.fadeOutShare();
                        var tokenInfo=getToken();
                        var data="platform=all&token="+tokenInfo.token;
                        /*httpRequest.APIPOST('/coupons/give', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                              if (result && result.code == statusCode.Success) {
                                  if(result.result==1){
                                      $scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          }); */                       
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        $scope.fadeOutShare();
                    }
                });


                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link+'2', // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () { 
                        // 用户确认分享后执行的回调函数
                        $scope.fadeOutShare();
                        alertWarning("发送成功！");
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                    }
                });


            });

            wx.error(function(res){
                alertWarning(JSON.stringify(res));
            });
        });
    };
    if(easybuy.isWechat){
       if(!getWxSdkToken() || (getWxSdkToken() && !getWxSdkToken().ticket)){
            //var getTokenUrl="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+easybuy.weixinAppId+"&secret="+easybuy.weixinAppKey;
            //var getTicketUrl="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+data.access_token+"&type=jsapi 
            var data="platform=all";
            httpRequest.APIPOST('/wx/data?platform=all', null, { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                  if (result && result.code == statusCode.Success) {
                        var data=result.result;                         
                        setWxSdkToken({accessToken:data.access_token,ticket:data.ticket});						
                        weixinSdkConfig();                                                
                  }else{
                      alert(result.msg);
                  }
              });
        }else{
            weixinSdkConfig();
        } 
    }
    
    $scope.goTo=function(type,action){
        var tokenInfo=getToken();
        var isLogin=false;
        if(tokenInfo && tokenInfo.token){
            isLogin=true;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            if(type==1){
                if(!isLogin){
                    redirectLogin($location,"activity-xrhl");
                    return;
                }
                $scope.getCoupons(tokenInfo.token);
            }else if(type=='myCoupon'){
                if(!isLogin){
                    openDialog("您还没登录呢！", null, ["确定"]);
                    return;
                }
                $scope.getCashCoupons(tokenInfo.token,type);
            }else{
                $location.path("/"+type);
            }
            
        }

    };

    $scope.getCoupons=function(token){
        var data="platform=all&token="+token;
        httpRequest.APIPOST('/user/getCoupons', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {
                    var msg=result.msg;
                    //openDialog(msg, null, ["确定"]);
                    alertWarning("恭喜您领取成功！");
              }else{
                    var msg=result.msg;
                    openDialog(msg, null, ["确定"]);
              }
          });
    };

    $scope.getCashCoupons=function(token,path){
        var data="platform=all&token="+token;
        httpRequest.APIPOST('/user/checkCoupons', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {
                    var msg=result.msg;
                    //openDialog(msg, null, ["确定"]);
                    //alertWarning("恭喜您领取成功！");
                    $location.path("/"+path).search({from:'activity'});
              }else{
                    var msg=result.msg;
                    openDialog(msg, null, ["确定"]);
              }
          });
    };

    if($location.search() && $location.search().nickname && $location.search().timestamp && $location.search().version){
        $scope.getCoupons($location.search().token);
    }
    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl
            +"&title=【糖村】新年好礼！";
            return;
        }
        if(!easybuy.isWechat){
            var arrButton = ["确定"];
            openDialog("请在微信内打开并分享到朋友圈", "", arrButton, null,
                function (r) {
                    if (r) {
                       
                    }
                });
        }else{
            var tokenInfo=getToken();
            if(tokenInfo && tokenInfo.token && tokenInfo.openId){
                $scope.fadeInShare();
            }else{
                $location.path("/wechatOauth/activity-activityDetail");
            }            
        }
        
    }

    $scope.shareSuccess=function(){
        var arrButton = ["我知道了","前往查券"];
        /*openDialog("恭喜客官！您的100元现金券已成功到账！", "领券成功通知", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/myCoupon").search({from:"activity"});
                   $scope.$apply($location);
                }
            });*/
        
    }
    

    $scope.back=function(){
        $location.path("/products");
    }
    $scope.fadeOutShare=function(){
        $("#shareHint").fadeOut();
    }
    $scope.fadeInShare=function(){
        $("#shareHint").fadeIn();        
    }
    
    if($location.search() && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId;
          }
          var data="platform=all&activityId="+actId;
          httpRequest.APIPOST('/activity/detail', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {
                  $scope.activityInfo=result.result;
                  if(result.result==null){
                  	  alertExt("该活动已结束，更多精彩活动尽在首页！",function(){
						 $location.path("/");
						 $scope.$apply($location);
					  });
					  return;
                  }
                  var act=$scope.activityInfo.activity;
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
              }else{
                  alert(result.msg);
              }
          });
      }
      
      if($location.search() && $location.search().sharedTo && $location.search().source){
          var search=$location.search();
          var actId="";
          var channel=$location.search().sharedTo || 1;
          if(channel instanceof Array){
              channel=1;
          }
          var platform=$location.search().source || 'all';
          var pageType=$location.search().pageType || '';
          if(platform==1){
              platform="android";
          }else if(platform==2){
              platform="ios";
          }else{
              platform="all";
          }          
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId;
          }
          var token="";
          if(getToken()){
              token="&token="+getToken().token;
          }
          var data="activityId="+actId+"&channel="+channel+"&platform="+platform+token;
          httpRequest.APIPOST('/activity/clickLog', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {                  
                  
              }else{
                  
              }
          });
      }else{
		  var platform=$location.search().platform || 'all';
		  var token=$location.search().token || '';
		  
		  var actId="";
		  if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId;
          }
		  if(token){
			  token="&token="+token;
		  }else if(getToken()){
              token="&token="+getToken().token;
          }
          var data="activityId="+actId+"&type=2&platform="+platform+token;
          httpRequest.APIPOST('/activity/clickLog', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {                  
                  
              }else{
                  
              }
          });
		  
	  }


});