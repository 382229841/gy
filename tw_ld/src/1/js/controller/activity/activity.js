app.register.controller('activityBeautyLifeController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/beautyLife?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/beautyLife/1.jpg";
    var title="购轻松台湾";
    var desc="美丽人生";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.buyNow=function(path,action){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            $location.path("/"+path);
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl;
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
      
    if($location.search()){// && $location.search().activityId){
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
app.register.controller('activityTangcunController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/tangcun?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/tangcun/1.jpg";
    var title="购轻松台湾";
    var desc="塘村伴手礼";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.buyNow=function(path,action){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            $location.path("/"+path);
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl;
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
      
    if($location.search()){// && $location.search().activityId){
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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


app.register.controller('activityTourController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/tour?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/tour/1.jpg";
    var title="购轻松台湾";
    var desc="轻松畅游台北101";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.buyNow=function(path,action){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            $location.path("/"+path);
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl;
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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 0;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.downPriceGoodsList){
                      $scope.products=$scope.activityInfo.downPriceGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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

app.register.controller('activityGroupBuyController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/groupBuy?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/groupBuy/1.jpg";
    var title="购轻松台湾";
    var desc="姐姐妹妹来拼团";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.buyNow=function(path,action){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            $location.path("/"+path);
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl;
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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 20;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.restrictReduceGoodsList){
                      $scope.products=$scope.activityInfo.restrictReduceGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
	  $scope.goBuy=function(){
	  	window.location.href=easybuy.appActivity + "?action=4&mustLogin=1&goodId=122&name=test&smallImg=test&promotePrice=10";
	  };
});



app.register.controller('activityXblnewController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/beautySummer?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/beautySummer/banner.jpg";
    var title="购轻松台湾";
    var desc="小背篓";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.buyNow=function(path,action){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action="+action;
        }else{
            $location.path("/"+path);
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 20;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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

app.register.controller('activityMayController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/beautySummer?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/beautySummer/banner.jpg";
    var title="购轻松台湾";
    var desc="美丽一夏";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 20;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
      }
});
app.register.controller('activitybeautySummerController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/beautySummer?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/beautySummer/banner.jpg";
    var title="购轻松台湾";
    var desc="美丽一夏";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 19;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
      }
});

app.register.controller('activityMothersDayController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/mothersDay?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/mothersDay/banner.jpg";
    var title="购轻松台湾";
    var desc="母亲节 送妈妈的好礼物";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 20;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.downPriceGoodsList){
                      $scope.products=$scope.activityInfo.downPriceGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
      }
});

app.register.controller('activityXblPriceController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/xbl?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/xbl/ad.jpg";
    var title="购轻松台湾";
    var desc="台湾小背篓";

    forApp.shareSuccess=function(token,category,id,channel){
        //category:0-活动,1-商品,2-发现,3-wifi,4-机场存送,5-接送机,6-一日游,7-门票,8-其他
        debugModel("activity-token:"+token+"category:"+category+"id:"+id+"channel:"+channel);
    };
    forApp.shareFailed=function(token,category,id,channel){
        debugModel("activity-token:"+token+"category:"+category+"id:"+id+"channel:"+channel);
    };
    forApp.loginSuccess=function(token){
        debugModel("activity-token:"+token);
    };
    $scope.share=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&mustLogin=1&shareTitle=testTitle&shareText=testText&shareUrl="+$location.absUrl()+"&shareImageUrl=image";
        }else{
            //$scope.noInApp();
        }
    };

    $scope.prize=0;
    $scope.choosePrize=function(type){
        $scope.prize=type;
    };
    
    $scope.option1=0;
    $scope.option2=0;
    $scope.option3=0;
    $scope.option4=0;
    $scope.chooseOption1=function(){
        if($scope.option1){
            $scope.option1=0;
        }else{
            $scope.option1=1;
        }
    };
    $scope.chooseOption2=function(){
        if($scope.option2){
            $scope.option2=0;
        }else{
            $scope.option2=2;
        }
    };
    $scope.chooseOption3=function(){
        if($scope.option3){
            $scope.option3=0;
        }else{
            $scope.option3=3;
        }
    };
    $scope.chooseOption4=function(){
        if($scope.option4){
            $scope.option4=0;
        }else{
            $scope.option4=4;
        }
    };
    
    $scope.status=0;
    $scope.submit=function(){

        if($scope.status==1){
            return;
        }
        if(!$scope.prize){
            alertWarning("请选择奖品");
            return;
        }
        if(!$scope.name){
            alertWarning("请输入您的姓名");
            return;
        }
        if(!$scope.mobile){
            alertWarning("请输入您的号码");
            return;
        }
        if($scope.mobile.length<8 || $scope.mobile.length>13){
            alertWarning("请输入8-13位的号码");
            return;
        }
        var goodsType="";
        if(!$scope.option1 && !$scope.option2 && !$scope.option3 && !$scope.option4){
            alertWarning("请选择背货类型");
            return;
        }else{
            if($scope.option1){
                goodsType=goodsType+$scope.option1+',';
            }
            if($scope.option2){
                goodsType=goodsType+$scope.option2+',';
            }
            if($scope.option3){
                goodsType=goodsType+$scope.option3+',';
            }
            if($scope.option4){
                goodsType=goodsType+$scope.option4+',';
            }
            goodsType=goodsType.substr(0,goodsType.length-1);
        }
        var param="platform=all&name="+$scope.name+"&mobile="+$scope.mobile+"&prize="+$scope.prize+"&goodsType="+goodsType;

        httpRequest.APIPOST('/activity/packBasketer', dataStringify(param), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                $scope.status=1;
                alertWarning("恭喜您报名成功！");
            }else{
                alertWarning(result.msg);
            }
        });
    };

    $scope.initUI=function(){
         var clientWidth=$(document).width();

        if(clientWidth<640){
            var rate=clientWidth/640;
            //抽奖产品
            var pW=$(".products").width();
            var pH=$(".products").height();

            var pWD=$(".products div").width();
            var pHD=$(".products div").height();

            var pT=parseInt($(".products").css('top').substr(0,$(".products").css('top').length-2));
            var pL=parseInt($(".products").css('left').substr(0,$(".products").css('left').length-2));

            var pDIL=parseInt($(".products div img").css('left').substr(0,$(".products div img").css('left').length-2));
            var pDIB=parseInt($(".products div img").css('bottom').substr(0,$(".products div img").css('bottom').length-2));
            var pDIW=38;//$(".products div img").width();


            $(".products").width(pW*rate);
            $(".products").height(pH*rate);

            $(".products div").width(pWD*rate);
            $(".products div").height(pHD*rate);

            $(".products").css('top',pT*rate+'px');
            $(".products").css('left',pL*rate+'px');
            $(".products div img").css('bottom',pDIB*rate+'px');
            $(".products div img").css('left',pDIL*rate+'px');

            $(".products div img").width(pDIW*rate);

            //背货类型
            var oW=$(".option").width();
            var oH=$(".option").height();

            var oWD=$(".option div").width();
            var oHD=$(".option div").height();

            var oB=parseInt($(".option").css('bottom').substr(0,$(".option").css('bottom').length-2));
            var oL=parseInt($(".option").css('left').substr(0,$(".option").css('left').length-2));

            var oDIW=38;//$(".option div img").width();


            $(".option").width(oW*rate);
            $(".option").height(oH*rate);

            $(".option div").width(oWD*rate);
            $(".option div").height(oHD*rate);

            $(".option").css('bottom',oB*rate+'px');
            $(".option").css('left',oL*rate+'px');

            $(".option div img").width(oDIW*rate);

            //button
            var iconW=$(".icon_button").width();
            var iconB=parseInt($(".icon_button").css('bottom').substr(0,$(".icon_button").css('bottom').length-2));
            var iconL=parseInt($(".icon_button").css('left').substr(0,$(".icon_button").css('left').length-2));
            $(".icon_button").width(iconW*rate);
            $(".icon_button").css('bottom',iconB*rate+'px');
            $(".icon_button").css('left',iconL*rate+'px')

            //输入区
            var iW=$(".input_name").width();
            var iH=$(".input_name").height();

            var iWD=$(".input_name div input").width();
            var iHD=$(".input_name div input").height();

            var iT=parseInt($(".input_name").css('top').substr(0,$(".input_name").css('top').length-2));
            var iL=parseInt($(".input_name").css('left').substr(0,$(".input_name").css('left').length-2));

            var iDIL=parseInt($(".input_name div input").css('margin-bottom').substr(0,$(".input_name div input").css('margin-bottom').length-2));       


            $(".input_name").width(iW*rate);
            $(".input_name").height(iH*rate);

            $(".input_name div input").width(iWD*rate);
            $(".input_name div input").height(iHD*rate);

            $(".input_name").css('top',iT*rate+'px');
            $(".input_name").css('left',iL*rate+'px');

            $(".input_name div input").css('margin-bottom',iDIL*rate+'px');

        }
    };
    $scope.initUI();
    $(window).resize(function() {
        setTimeout(function(){
           // $scope.initUI();
        },100);
        
    });
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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

    $scope.back=function(){
        $location.path("/products");
    }

    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 18;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.halfPriceGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
              }
          });
      }
});


app.register.controller('activityHalfPriceController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    //window.ontouchstart = function(e) { e.preventDefault(); };
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/half?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/half/ad.jpg";
    var title="购轻松台湾";
    var desc="森田药妆第二件半价";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
      
    if($location.search()){// && $location.search().activityId){
          var actId="";
          if($location.search().activityId instanceof Array){
              actId=$location.search().activityId[0];
          }else{
              actId=$location.search().activityId || 14;
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.halfPriceGoodsList){
                      $scope.products=$scope.activityInfo.halfPriceGoodsList;
                  }
                  
              }else{
                  alert(result.msg+":ctivity-detail");
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
          //alertWarning(data);
          httpRequest.APIPOST('/activity/clickLog', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
              if (result && result.code == statusCode.Success) {                  
                  
              }else{
                  
              }
          });
		  
	  }
});


app.register.controller('activityXrhlController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/xrhl?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/xrhl/ad.png";
    var title="购轻松台湾";
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

app.register.controller('activityFullController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/full?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/full/ad.jpg";
    var title="购轻松台湾";
    var desc="台湾第一伴手礼—【糖村】甜蜜来袭，分享就送100元";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
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
      }
});

app.register.controller('activityGuideController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/#/activity/guide?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/image/activity/guide/ad.jpg";
    var title="购轻松台湾";
    var desc="购轻松台湾";
    
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
                                      //$scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });*/                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        //$scope.fadeOutShare();
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
                        //$scope.fadeOutShare();
                        //alertWarning("发送成功！");
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
    
    $scope.goTo=function(index){
        var g=[];
        for(var i=0;i<$scope.products.length;i++){
            g.push($scope.products[i].goodsId);
        }
        if(index<=g.length){
            if($scope.isApp){
                window.location.href = easybuy.appActivity + "?action=1&goodId="+g[index-1];
            }else{            
                $location.path("/product/"+g[index-1]+"/1");
            }
        }
    };

    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
        }else{            
            $location.path("/products");
        }
    };


    $scope.shareToFriends=function(){
        if($scope.isApp){            
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl
            +"&title=购轻松台湾！";
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
                  if(!act.url){
                      act.url="";
                  }
                  if(act.url.indexOf('?')>0){
                      link=act.url+"&activityId="+act.id+"&source=3&sharedTo=";
                  }else{
                      link=act.url+"?activityId="+act.id+"&source=3&sharedTo=";
                  }                  
                  imgUrl=act.img;
                  title=act.name;
                  desc=act.desc;
                  $scope.products=[];
                  if($scope.activityInfo && $scope.activityInfo.fullGiveGoodsList){
                      $scope.products=$scope.activityInfo.fullGiveGoodsList;
                  }
                  
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
      }
});

app.register.controller('taxFreeStoreController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;
    
    $scope.back=function(){
        history.back();
    }
    

});

/*
app.register.controller('activityDownController', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=false;
    if($location.search() && $location.search().platform){
        if($location.search().platform=="android" || $location.search().platform=="ios"){
            $scope.isShowNavbar=false;
            $scope.isApp=true;
        }else{
            $scope.isShowNavbar=true;
        }
    }else{
        $scope.isShowNavbar=true;
    }
    var id=$location.search().find;
    id=parseInt(id);
    if(isNaN(id)){
        var findInfo=getFind();
        if(findInfo && findInfo.find){
            id=parseInt(findInfo.find);
        }else {
            id=10;
        }       
        if(isNaN(id)){
           id=10;
        }
    }
    var link="http://goeasy.yhiker.com/#/activity/activityDown?find="+id;
    var imgUrl="http://goeasy.yhiker.com/image/activity/share-down.jpg";
    var title="购轻松台湾";
    var desc="全球NO.1医美品牌【宠爱之名】浪漫来袭，分享就送100元！";
    
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
                    link: link,
                    imgUrl: imgUrl,
                    success: function () { 
                        // 用户确认分享后执行的回调函数 
                        $scope.fadeOutShare();
                        var tokenInfo=getToken();
                        var data="platform=all&token="+tokenInfo.token;
                        httpRequest.APIPOST('/coupons/give', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                              if (result && result.code == statusCode.Success) {
                                  if(result.result==1){
                                      $scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        $scope.fadeOutShare();
                    }
                });


                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接
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
    
    $scope.goToGoodDetail=function(id){
        window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
    };
    
    $scope.shareToFriends=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="+title+"&shareText="+desc+"&shareUrl="+link+"&shareImageUrl="+imgUrl
            +"&title=【宠爱之名】浪漫送惊喜！";
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
                $location.path("/wechatOauth/activity-activityDown");
            }            
        }
        
    }

    $scope.shareSuccess=function(){
        var arrButton = ["我知道了","前往查券"];
        openDialog("恭喜客官！您的100元现金券已成功到账！", "领券成功通知", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/myCoupon").search({from:"activity"});
                   $scope.$apply($location);
                }
            });
        
    }
    
    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
            return;
        }
        $location.path("/products");
    }
    $scope.back=function(){
        $location.path("/products");
    }
    $scope.fadeOutShare=function(){
        $("#shareHint").fadeOut();
        //$("#TangCunTitle").show();
        //$("#TangCunContent").show();
    }
    $scope.fadeInShare=function(){
        //$("#TangCunTitle").hide();
        //$("#TangCunContent").hide();
        $("#shareHint").fadeIn();        
    }
    
    var data="platform=all&activityId="+id;
    httpRequest.APIPOST('/activity/detail', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
          if (result && result.code == statusCode.Success) {
              $scope.tangcunproducts=result.result.downPriceGoodsList;
              for(var i=0;i<$scope.tangcunproducts.length;i++){
                  $scope.tangcunproducts[i].id=$scope.tangcunproducts[i].goodsId;
                  $scope.tangcunproducts[i].name=$scope.tangcunproducts[i].goodsName;
                  $scope.tangcunproducts[i].img=$scope.tangcunproducts[i].goodsImg;
              }
          }else{
              alertWarning(result.msg);
          }
      });



});



app.register.controller('activity201501Controller', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=false;
    if($location.search() && $location.search().platform){
        if($location.search().platform=="android" || $location.search().platform=="ios"){
            $scope.isShowNavbar=false;
            $scope.isApp=true;
        }else{
            $scope.isShowNavbar=true;
        }
    }else{
        $scope.isShowNavbar=true;
    }
    var link="http://goeasy.yhiker.com/#/activity/activityDetail";
    var imgUrl="http://goeasy.yhiker.com/image/activity/share.jpg";
    var title="购轻松台湾";
    var desc="台湾第一伴手礼—【糖村】甜蜜来袭，分享就送100元";
    
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
                    link: link,
                    imgUrl: imgUrl,
                    success: function () { 
                        // 用户确认分享后执行的回调函数 
                        $scope.fadeOutShare();
                        var tokenInfo=getToken();
                        var data="platform=all&token="+tokenInfo.token;
                        httpRequest.APIPOST('/coupons/give', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                              if (result && result.code == statusCode.Success) {
                                  if(result.result==1){
                                      $scope.shareSuccess();
                                  }                                  
                              }else{
                                  alert(result.msg);
                              }
                          });                        
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        $scope.fadeOutShare();
                    }
                });


                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接
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
    
    $scope.goToGoodDetail=function(id){
        window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
    };
    
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
        openDialog("恭喜客官！您的100元现金券已成功到账！", "领券成功通知", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/myCoupon").search({from:"activity"});
                   $scope.$apply($location);
                }
            });
        
    }
    
    $scope.more=function(){
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=5";
            return;
        }
        $location.path("/products");
    }
    $scope.back=function(){
        $location.path("/products");
    }
    $scope.fadeOutShare=function(){
        $("#shareHint").fadeOut();
        //$("#TangCunTitle").show();
        //$("#TangCunContent").show();
    }
    $scope.fadeInShare=function(){
        //$("#TangCunTitle").hide();
        //$("#TangCunContent").hide();
        $("#shareHint").fadeIn();        
    }
    
    var data="platform=all";
    httpRequest.APIPOST('/activity/tangcun', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
          if (result && result.code == statusCode.Success) {
              $scope.tangcunproducts=result.result;                                     
          }else{
              alert(result.msg);
          }
    });
});
*/

