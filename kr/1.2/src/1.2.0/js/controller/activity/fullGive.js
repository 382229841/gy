app.register.controller('activityFull1Controller', function ($rootScope, $scope, httpRequest, dataStringify, signSha1, analytics, $location, $window, $routeParams) {
    $scope.isShowNavbar=false;
    $scope.isApp=isApp($location);
    $scope.isShowNavbar=$scope.isApp?false:true;

    var link="http://goeasy.yhiker.com/kr/#/activity/full1?source=3&sharedTo=";
    var imgUrl="http://goeasy.yhiker.com/kr/image/activity/full1/1.jpg";
    var title="购轻松韩国";
    var desc="满就赠";
    
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
	var appToken="";
	forApp.loginSuccess=function(data){
		//alert("data:"+data);
		appToken=data;
	};

    $scope.buyNow=function(){
       //alert(token);
       if($scope.isApp){
             var actId="";
			  if($location.search().activityId instanceof Array){
				  actId=$location.search().activityId[0];
			  }else{
				  actId=$location.search().activityId;
			  }
			  if(!appToken){
			  	  appToken=$location.search().token;
			  }
			  if(!appToken){
			  	
			  	window.location.href = easybuy.appActivity 
						+ "?action=4"
						+"&mustLogin=1&goodId="+$scope.products[0].goodsId
						+"&name="+$scope.products[0].goodsName
						+"&smallImg="+$scope.products[0].goodsImg
						+"&promotePrice="+$scope.products[0].price;
				return;
			  }
			  var data="platform=all&activityId="+actId
						  +"&token="+appToken
						  +"&goodsId="+$scope.products[0].goodsId;
			  //alert(data);
			  httpRequest.APIPOST('/activity/validate', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
				  
				  if (result && result.code == statusCode.Success) {
					  
					  window.location.href = easybuy.appActivity 
						+ "?action=4"
						+"&mustLogin=1&goodId="+$scope.products[0].goodsId
						+"&name="+$scope.products[0].goodsName
						+"&smallImg="+$scope.products[0].goodsImg
						+"&promotePrice="+$scope.products[0].price;


				  }else{
					  alertWarning(result.msg);
					  return;
				  }
			  });

        }else{
            var arrButton = ["取消","去下载"];
			openDialog("该活动商品仅支持在购轻松韩国App内预订", "", arrButton, null,
				function (r) {
					if (r) {
					   $location.path("/downloadApp");
					   $scope.$apply($location);
					}
				});
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