app.controller('myPhoneController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    $scope.mobile=$routeParams.mobile || "";
    $scope.token=$routeParams.token || getToken().token;
    $scope.isSetMobile=$routeParams.mobile?true:false;
    if($routeParams.mobile=="0"){
        $scope.isSetMobile=false;
        $scope.mobile="";
    }
    if(easybuy.isWechat && !$routeParams.token){
        if(getToken() && getToken().token){
            httpRequest.APIPOST('/mine/index', dataStringify("platform=all&token="+getToken().token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    var userInfo=result.result;
                    $scope.mobile=userInfo.mobile;
                    if($scope.mobile){
                        $scope.isSetMobile=true;
                    }
                }else{
                    alertWarning(result.msg);
                }
            });
        }
    }
    $scope.focus=function(){
        $("#myPhoneNumber").focus();
    };
    $scope.back=function(){
        $location.path("/myProfile");
    };
    $scope.setPhone=function(){
        if (!$scope.mobile || $scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }
        if (!$scope.code || $scope.code.toString().length < 4 || $scope.code.toString().length > 8) {
            alertWarning("请输入验证码");
            return;
        }
        var data="platform=all&token="+$scope.token+"&mobile="+$scope.mobile+"&code="+$scope.code;
        $scope.wait=0;
        showLoading();
        httpRequest.APIPOST('/user/bindMobile', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 alertWarning("手机号设置成功");
                 var temp=getToken();
                 if(temp){
                    temp.mobile=$scope.mobile;
                    setToken(temp);
                 }
                 if($location.$$search && $location.$$search.user && $location.$$search.user.openId){
                      var arr=$location.$$search.state.split('-');
                      if(arr[0]=="orderDetail"){
                          $location.path("/orderDetail/"+arr[1]+"/"+$scope.token).search(user);
                          return;
                      }
                      if(arr.length<2){
                          $location.path("/"+$location.$$search.state).search($location.$$search.user);
                          return;
                      }
                      if(arr.length==2){
                          $location.path("/"+arr[0]+'/'+arr[1]).search($location.$$search.user);
                          return;
                      }
                      if(arr.length==3){
                          $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search($location.$$search.user);
                          return;
                      }
                 }else{
                     $location.path("/myProfile");
                 }
            }else{
                alertWarning(result.msg);
            }
        });

    }
    $scope.wait=60;  
    var time=function() {  
        if ($scope.wait == 0) {  
            $scope.wait=60; 
            $("#codeClock").css("display","none");
        } else {
             $scope.wait--;
             $scope.$apply($scope.wait);
            setTimeout(function() {  
                time();
            },  
            1000)  
        }  
    }  
    $scope.getCheckCode=function(){
        if ($scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }
        $("#codeClock").css("display","inline-block");
        time();
        var data="platform=all&type=3&mobile="+$scope.mobile;
        httpRequest.APIPOST('/sms/getVerifyCode', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 
            }else{
                alertWarning(result.msg);
            }
        });
    };
});

app.controller('myCouponController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    if($routeParams.token){
        $scope.token=$routeParams.token;
    }else{
        $scope.token=getToken()?getToken().token:"";
    }
    var from=($location.search() && $location.search().from)?$location.search().from:"";
    if(easybuy.isWechat && !$routeParams.token && from=="activity"){
        var t=getToken();        
        $scope.token=t.token;
        if(!t.mobile || (t.mobile && t.mobile.length<6)){
            $location.path("/wechatOauth/myCoupon").search({from:from});
            return
        }		
    }
    if($scope.token){
        var data="platform=all&token="+$scope.token;
        showLoading();
        httpRequest.APIPOST('/coupons/mine', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 hideLoading();
                 $scope.coupons=result.result;


                 /*$scope.coupons.usedList.push({"id": 13,
                    "startTime": "2015-01-01",
                    "amount": "20.00",
                    "full": 199,
                    "typeDesc": "全场适用",
                    "couponId": 1,
                    "endTime": "2015-03-31",
                    "type": 1});
                    */
                 //$scope.coupons=[{id:1,remainNum:5}];//for test
                 /*for(var i=0;i<$scope.coupons.length;i++){
                     var repeatCount=[];
                     for(var j=0;j<$scope.coupons[i].remainNum;j++){
                         repeatCount.push(j);
                         $scope.coupons[i].repeatCount=repeatCount;
                     }
                 }
                 if($scope.coupons.length<1){
                     $("#emptyStatus").css("display","block");
                 }else{
                     $("#emptyStatus").css("display","");
                 }*/
            }else{
                hideLoading();
                alert(result.msg);
            }
        });
    }else{
        $location.path("/myProfile");
    }
    $scope.back=function(){
        if($location.search() && $location.search().from){
            history.back();
        }else{
            $location.path("/myProfile");
        }        
    }
});



app.controller('oauth2Controller', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
      var nickname=$location.$$search.nickname;
      var headimgurl=$location.$$search.headimgurl;
      var openId=$routeParams.openId;
      var state=$routeParams.state;
      var source=$location.$$search.source?$location.$$search.source:1;
      $rootScope.isOauth2=true;
      if(source==4){
          var usertokenInfo=getToken();
          var arr=state.split('-');
          if(arr[0]=="orderDetail"){
              $location.path("/orderDetail/"+arr[1]+"/"+usertokenInfo.token).search(usertokenInfo);
              return;
          }
          if(arr.length<2){
              $location.path("/"+state).search(usertokenInfo);
              return;
          }
          if(arr.length==2){
              $location.path("/"+arr[0]+'/'+arr[1]).search(usertokenInfo);
              return;
          }
          if(arr.length==3){
              $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search(usertokenInfo);
              return;
          }
      }
      var user={openId:openId,nickname:nickname,headimgurl:headimgurl,source:source};
      var source=user.source;//用户来源，1：微信， 2：QQ， 3：微博
      var data="platform=all&openid="+user.openId+"&nickname="+user.nickname
             +"&gender=0&avatar="+user.headimgurl+"&source="+source+"&channel=H5"
             +"&appVersion="+easybuy.version;
      httpRequest.APIPOST('/user/thirdLogin', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
          if (result && result.code == statusCode.Success) {
              $scope.currentUser=result.result;
              $scope.currentUser.openId=user.openId;
              $scope.currentUser.source=user.source;
              $scope.currentUser.nickname=user.nickname;
              $scope.currentUser.headimgurl=user.headimgurl;
              
              if(($scope.currentUser.mobile==null || !$scope.currentUser.mobile || ($scope.currentUser.mobile && $scope.currentUser.mobile.length<6)) &&  isNotBindPhone[state]!=true && ($scope.currentUser.source && $scope.currentUser.source!=4)){
                  if($scope.currentUser.bind!=0 || $scope.currentUser.bind!="0")
                    $location.path("/myPhone/0/"+$scope.currentUser.token).search({user:user,state:state});
              }else{
                  setToken($scope.currentUser);
                  var arr=state.split('-');
                  if(arr[0]=="orderDetail"){
                      $location.path("/orderDetail/"+arr[1]+"/"+$scope.currentUser.token).search(user);
                      return;
                  }
                  if(arr.length<2){                      
                      $location.path("/"+state).search(user);
                      return;
                  }
                  if(arr.length==2){
                      if(arr[0]=="activity" && arr[1]=="activityDetail"){
                          $location.path("/"+arr[0]+'/'+arr[1]);
                      }else{
                          $location.path("/"+arr[0]+'/'+arr[1]).search(user);
                      }                      
                      return;
                  }
                  if(arr.length==3){
                      $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search(user);
                      return;
                  }
                  
              }
          }else{
              alert(result.msg);
          }
      });      
});
app.controller('wechatOauthController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
     var state=$routeParams.state;
     var from=($location.search() && $location.search().from)?$location.search().from:"";
     if(baseOauth[state]===true && from!=="activity"){
         $rootScope.oauth2(state,null);
     }else{
         $rootScope.oauth2(state,"userinfo");
     }     
});

/** added in 1.6**/
app.controller('myController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    var from=$routeParams.from || "";
    $scope.isNeedBind=true;
    $scope.from=from;
    var loginFrom=1;
    $scope.isLogin=true;
    $scope.isShowLogoutBtn=!easybuy.isWechat;
    if(!easybuy.isWechat){
        if(getToken()){
            $scope.user=getToken();
            $scope.isLogin=true;
            if($scope.user.bind==0 || $scope.user.bind=="0" || ($scope.user.source && $scope.user==4)){
                $scope.isNeedBind=false;
            }else{
                $scope.isNeedBind=true;
            }
            loginFrom=$scope.user.source;       
        }else{
             $scope.isLogin=false;
        }
    }

    $scope.login=function(){
        var u=$scope.username;
        var p=$scope.password;
        
        if (!u || (u && u.length<1) || !p || (p && p.length<1)) {
            alertWarning("请输入手机号/密码");
            return;
        }

        if (u.length!=11 || p.length<4 || p.length>20) {
            alertWarning("请输入正确的手机号或密码");
            return;
        }

        var data="platform=all&account="+u+"&password="+p+"&category=2";
        httpRequest.APIPOST('/user/login', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                var token=result.result.token;
                var data2="platform=all&token="+token;
                httpRequest.APIPOST('/mine/index', dataStringify(data2), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                    if (result && result.code == statusCode.Success) {
                        var userInfo=result.result;
                        $scope.isLogin=true;
                        $scope.user={};
                        $scope.user.token=token;               
                        $scope.user.openId="0";
                        $scope.user.source=4;
                        $scope.user.nickname=userInfo.nickname;
                        $scope.user.headimgurl=userInfo.avatar;
                        $scope.user.mobile=userInfo.mobible;
                        $scope.user.bind=0;
                        $scope.isNeedBind=false;
                        setToken($scope.user);
                        if(from){
                            //alertSuccess("登录成功");
                            $location.path('/oauth2/'+$scope.user.openId+'/'+from).search({openId:$scope.user.openId,nickname:userInfo.nickname,headimgurl:userInfo.avatar,source:4,bind:$scope.user.bind}); 
                            $scope.$apply($location);
                        }
                    }else{
                        alertWarning(result.msg);
                    }
                });



            }else{
                alertWarning(result.msg);
            }
        });
        loginFrom=4;
    }
    
    $scope.register=function(){
        $location.path("/register");
    }

    $scope.logout=function(){
       var arrButton = ["取消", "确定"];
        openDialog("您是否确认退出？", null, arrButton, null,
            function (r) {
                if (r) {                    
                    if(loginFrom==4){
                        var data="platform=all&token="+$scope.user.token;
                        httpRequest.APIPOST('/user/logout', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                            if (result && result.code == statusCode.Success) {
                                $scope.user={};
                                removeToken();
                                $scope.isLogin=false;
                                $scope.$apply($scope.isLogin);
                                $scope.$apply($scope.user);
                                location.href=location.href.split('?')[0];
                            }else{
                                alertWarning(result.msg);
                            }
                        });
                    }

                    $scope.user={};
                    removeToken();
                    $scope.isLogin=false;
                    $scope.$apply($scope.isLogin);  
                    $scope.$apply($scope.user);

                    
                }
        });
         
    }
    $scope.back = function () {
        $location.path("/products");
    }
    if(easybuy.isWechat){
        callback();
    } 
    function callback(u){
        //console.log("callback");
        var user=u?u:$location.$$search;
        $scope.user=user;
        if(user && user.openId){                    
            var source=user.source;//用户来源，1：微信， 2：QQ， 3：微博
            var data="platform=all&openid="+user.openId+"&nickname="+user.nickname
                     +"&gender=0&avatar="+user.headimgurl+"&source="+source+"&channel=H5"
                     +"&appVersion="+easybuy.version;
            httpRequest.APIPOST('/user/thirdLogin', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.isLogin=true;
                    $scope.user=result.result;
                    $scope.user.openId=user.openId;
                    $scope.user.source=user.source;
                    $scope.user.nickname=user.nickname;
                    $scope.user.headimgurl=user.headimgurl;
                    $scope.user.bind=1;
                    if($scope.user.mobile==null){
                        $scope.user.mobile="0";
                    }
                    if(!$scope.user.mobile || $scope.user.mobile=="0"){
                        $location.path("/myPhone/0/"+$scope.user.token).search({user:$scope.user,state:"myProfile"});
                    }                    
                    setToken($scope.user);
                    $scope.isNeedBind=true;
                    $scope.$apply($scope.isNeedBind);
                    $scope.$apply($scope.user);
                    //alert(user.openId);
                    //location.reload(true);
                }else{
                    alert(result.msg);
                }
            });
        }else{
            $scope.user=getToken();
            if($scope.user){
                $scope.isLogin=true;
                if(!$scope.user.mobile ||($scope.user.mobile && $scope.user.mobile.length<6)){
					$scope.user.mobile=0;
				}
            }else{
                $scope.isLogin=false;
                $scope.user={};
            }
            $scope.$apply($scope.user);
            $scope.$apply($scope.isLogin);
        } 
    } 
    $scope.validNum = function () {
        $scope.username = validInteger($scope.username);
    }
});
app.controller('registerController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.register=function(){
        var u=$scope.username;
        var c=$scope.code;
        var p=$scope.password;
        var ic=$scope.inviteCode;
		
        if (!u || (u && u.length<1)) {
            alertWarning("请输入手机号");
            return;
        }

        if (u.length!=11) {
            alertWarning("请输入11位的手机号码");
            return;
        }

        if (!c || c.toString().length < 4 || c.toString().length > 8) {
            alertWarning("请输入验证码");
            return;
        } 
        if (!p || p.length<4 || p.length>20) {
            alertWarning("请输入4~20位的密码");
            return;
        }
		
		if (!ic || ic.length<4 || ic.length>20) {
            alertWarning("请输入4~20位的密码");
            return;
        }
        $scope.wait=0;
        var data="platform=all&mobile="+u+"&password="+p+"&code="+c+"&inviteCode="+ic;
        httpRequest.APIPOST('/user/register', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                var token=result.result.token;
                var data2="platform=all&token="+token;
                httpRequest.APIPOST('/mine/index', dataStringify(data2), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                    if (result && result.code == statusCode.Success) {
                        var userInfo=result.result;
                        $scope.user={};
                        $scope.user.token=token;               
                        $scope.user.openId="0";
                        $scope.user.source=4;
                        $scope.user.nickname=userInfo.nickname;
                        $scope.user.headimgurl=userInfo.avatar;
                        $scope.user.mobile=userInfo.mobible;
                        $scope.user.bind=userInfo.bind || 0;
                        setToken($scope.user);
                        $location.path("/myProfile");
                    }else{
                        alertWarning(result.msg);
                    }
                });
            }else{
                alertWarning(result.msg);
            }
        });
    }
    $scope.back = function () {
        $location.path("/myProfile");
    }
    $scope.validNum = function () {
        $scope.username = validInteger($scope.username);
    }
    $scope.wait=60;
    var time=function() {  
        if ($scope.wait == 0) {  
            $scope.wait=60; 
            $("#codeClock").css("display","none");
        } else {
             $scope.wait--;
             $scope.$apply($scope.wait);
            setTimeout(function() {  
                time();
            },  
            1000)  
        }  
    };
    $scope.getCheckCode=function(){
        if (!$scope.username || $scope.username.toString().length < 9 || $scope.username.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }
        $("#codeClock").css("display","inline-block");
        time();
        var data="platform=all&type=1&mobile="+$scope.username;
        httpRequest.APIPOST('/sms/getVerifyCode', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 
            }else{
                alertWarning(result.msg);
            }
        });
    };
});