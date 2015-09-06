app.controller('myIncomeController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    $scope.step=1;
	
	$scope.withDraw=function(t){
		if(t===0){
			$scope.step=2;
			return;
		}

		var account=$scope.account || '';
		var name=$scope.name || '';
		var mobile=$scope.mobile || '';
		
		if (!account) {
            alertWarning("请输入支付宝账号");
            return;
        }

        if (!name) {
            alertWarning("请输入支付宝姓名");
            return;
        }

		if (!mobile || (mobile && mobile.length<1)) {
            alertWarning("请输入手机号");
            return;
        }

        if (mobile.length!=11) {
            alertWarning("请输入11位的手机号码");
            return;
        }

		var data="platform=all&token="
					+$rootScope.tokenInfo.token
					+"&account="+account
					+"&name="+name
					+"&mobile="+mobile;

		httpRequest.APIPOST('/ldIncome/apply', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				alertWarning("申请成功，请等待审核");
				$scope.step=1;
				$scope.getIncomeList(1);
				$scope.getIncomeList(2);
				
			}else{
				alertWarning(result.msg);
			}
		});

	};
	$scope.back = function () {
		if($scope.step>1){
			$scope.step=1;
			return;
		}
        $location.path("/myProfile");
    }

	$scope.incomeList1=[];//未返现
	$scope.incomeList2=[];//申请中
	$scope.incomeList3=[];//已提现
    $scope.getIncomeList=function(s){
		httpRequest.APIPOST('/ldIncome/listByStatus', dataStringify("platform=all&token="+$rootScope.tokenInfo.token+"&status="+s), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				if(s==1)
					$scope.incomeList1=result.result;
				if(s==2)
					$scope.incomeList2=result.result;
				if(s==3)
					$scope.incomeList3=result.result;
				
			}else{
				alertWarning(result.msg);
			}
		});
	}
	
	$scope.getIncomeList(1);
	$scope.getIncomeList(2);
	$scope.getIncomeList(3);
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getIncomeList(1);
		$scope.getIncomeList(2);
		$scope.getIncomeList(3);
    });
	
});

app.controller('myWishController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    $scope.step=1;


	$scope.saveWish=function(wish){
		if(!wish){
			alertWarning("请输入心愿产品名称");
			return;
		}
		if(!wish.name){
			alertWarning("请输入心愿产品名称");
			return;
			//我的新肌面膜
		}
		if(!wish.feature){
			alertWarning("请输入500位以内的产品特点");
			return;
		}

		if(wish.name.length<5 || wish.name.length>100){
			alertWarning("请输入5-100位以内的心愿产品名称");
			return;
		}
		if(!wish.feature){
			alertWarning("请输入500位以内的产品特点");
			return;
		}
		if(wish.feature.length>500){
			alertWarning("请输入500位以内的产品特点");
			return;
		}

		wish.link=wish.link?wish.link:"";
		var data="platform=all&token="+$rootScope.tokenInfo.token+"&name="+wish.name+"&link="+wish.link+"&feature="+wish.feature;
		var apiUrl='/ldWish/add';
		if(wish.id){
			apiUrl='/ldWish/edit';
			data="platform=all&token="+$rootScope.tokenInfo.token+"&name="+wish.name+"&link="+wish.link+"&feature="+wish.feature+"&id="+wish.id;
		}
		
		httpRequest.APIPOST(apiUrl, dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				alertWarning("提交成功！");
				$scope.getWishList();
				$scope.step=2;
			}else{
				alertWarning(result.msg);
			}
		});

		
	};
	$scope.wishNow=function(){
		$scope.step=2;
	};

	$scope.editWish=function(id,index){
		$scope.wish=$scope.wishList[index];
		$scope.step=2;
	};

	

	$scope.back = function () {
		if($scope.step>1){
			$scope.step=1;
			return;
		}
        $location.path("/myProfile");
    }

    $scope.getWishList=function(){
		httpRequest.APIPOST('/ldWish/list', dataStringify("platform=all&token="+$rootScope.tokenInfo.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.wishList=result.result;
				
			}else{
				alertWarning(result.msg);
			}
		});

    };
    $scope.getWishList();
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getWishList();
    });
});

/** added in 1.6**/
app.controller('myController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    $rootScope.$on("CtrlUserModule", function (event, isLogin) {
        $scope.isLogin = isLogin;
    });
	
	 if (getToken()) {
        var tmptoken = getToken().token;
        if (tmptoken) {
            var tmpdata2 = "platform=all&token=" + tmptoken;
            httpRequest.APIPOST("/mine/index", dataStringify(tmpdata2), {
                "content-type": "application/x-www-form-urlencoded"
            }).then(function(result) {
                if (result && result.code == statusCode.Success) {
                    var userInfo = result.result;
                    if ($scope.isLogin = !0, $scope.user = {},
                    $scope.user.token = tmptoken, $scope.user.openId = "0", $scope.user.source = 4, $scope.user.nickname = userInfo.nickname, $scope.user.headimgurl = userInfo.avatar, $scope.user.mobile = userInfo.mobible, $scope.user.category = userInfo.category, $scope.user.realName = userInfo.realname, $scope.user.incomeAmount = userInfo.incomeAmount, $scope.incomeAmount = userInfo.incomeAmount, $scope.user.bind = 0, $scope.isNeedBind = !1, setToken($scope.user), $rootScope.tokenInfo = $scope.user, "/myProfile" != $location.path()) {
                        return $rootScope.isRootLogin = !0,
                        void $rootScope.$emit("CtrlLoginModule", $rootScope.tokenInfo)
                    }
                } else {
                    alertWarning(result.msg)
                }
            })
        }
    };

	
	
	var from=$routeParams.from || "";
    $scope.isNeedBind=true;
    $scope.from=from;
    var loginFrom=1;
    $scope.isLogin=true;
    $scope.isShowLogoutBtn=!easybuy.isWechat;
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
	
	$scope.forgot=function(){
		$location.path("/forgot");
		
	};

	$scope.incomeAmount=$rootScope.tokenInfo?$rootScope.tokenInfo.incomeAmount || 0.00 : 0.00;
	
	$scope.myInfo=function(){
		$location.path("/myInfo");
	};
	
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
        httpRequest.APIPOST('/ldUser/login', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
						$scope.user.category=userInfo.category;
						$scope.user.realName=userInfo.realname;
						$scope.user.incomeAmount=userInfo.incomeAmount;
						$scope.incomeAmount=userInfo.incomeAmount;
                        $scope.user.bind=0;
                        $scope.isNeedBind=false;
                        setToken($scope.user);
						
						$rootScope.tokenInfo=$scope.user;
						
						if($location.path()!="/myProfile"){							
							$rootScope.isRootLogin=true;
							$rootScope.$emit("CtrlLoginModule", $rootScope.tokenInfo);
							return;
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

    $scope.back = function () {
        $location.path("/products");
    }

    $scope.validNum = function () {
        $scope.username = validInteger($scope.username);
    }
	
	$scope.drawProfie=function(){
		$(".my-profile").css("height",$(window).width()*(640/242)+"px");
	};
	$scope.drawProfie();
	$(window).resize(function(){
		$scope.drawProfie();
	});
});

app.controller('myInfoController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.step=1;
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $rootScope.tokenInfo = tokenInfo;
    });
	
	$scope.updatePassword=function(){
		$scope.step=3;
		
	};
	
	$scope.updateName=function(){
		$scope.username=$rootScope.tokenInfo.realName;
		$scope.step=2;
	};
	
	
	var loginFrom=1;
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
					$rootScope.isRootLogin=false;
                    $scope.$apply($scope.isLogin);  
                    $scope.$apply($scope.user);
					$rootScope.$apply($rootScope.isRootLogin);
					$location.path("/myProfile");
					
					$scope.$apply($location);  

                    
                }
        });
         
    }
	
	$scope.username=$rootScope.tokenInfo.realName;
	$scope.saveName=function(){
		var name=$scope.username;
		
        if (!name || (name && name.length<1)) {
            alertWarning("请输入您的真实姓名");
            return;
        }
		
        var data="platform=all&token="+$rootScope.tokenInfo.token+"&realname="+name;
        httpRequest.APIPOST('/user/updateRealname', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                $rootScope.tokenInfo.realName=name;
				var tokenInfo=getToken();
				tokenInfo.realName=name;
				setToken(tokenInfo);   
				alertWarning("姓名修改成功。");
				$scope.step=1;
            }else{
                alertWarning(result.msg);
            }
        });
		
	};
	$scope.savePassword=function(){
		var password=$scope.password;
		var newPassword=$scope.newpassword;
		var newPassword2=$scope.newpassword2;
		
		if (!password || password.length<6 || password.length>20) {
            alertWarning("请输入正确的旧密码");
            return;
        }
		
        if (!newPassword || newPassword.length<6 || newPassword.length>20) {
            alertWarning("请输入6~20位的密码");
            return;
        }
		if (!newPassword2 || newPassword2.length<6 || newPassword2.length>20) {
            alertWarning("请输入6~20位的密码");
            return;
        }
		if(newPassword!=newPassword2){
			alertWarning("新密码和确认密码不一致");
            return;			
		}
		
        var data="platform=all&token="+$rootScope.tokenInfo.token+"&oldPassword="+password+"&newPassword="+newPassword;
        httpRequest.APIPOST('/user/updatePassword', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {                  
				alertWarning("密码修改成功。");
				$scope.step=1;
            }else{
                alertWarning(result.msg);
            }
        });
		
	};
	
	$scope.save=function(){
		if($scope.step==2){
			$scope.saveName();
		}
		if($scope.step==3){
			$scope.savePassword();
		}
	};
	
	
    $scope.back = function () {
		if($scope.step>1){
			$scope.step=1;
			return;
		}
        $location.path("/myProfile");
    }
});

app.controller('registerController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
	$scope.register=function(){
        var u=$scope.username;
        var c=$scope.code;
        var p=$scope.password;
        var ic=$scope.inviteCode;
		var name=$scope.name;
		
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
        if (!p || p.length<6 || p.length>20) {
            alertWarning("请输入6~20位的密码");
            return;
        }
		
		if (!ic || ic.length<7 || ic.length>20) {
            alertWarning("请输入7位的邀请码");
            return;
        }
		
		if (!name || name.length<2 || name.length>30) {
            alertWarning("请输入2-30位真实姓名");
            return;
        }
        $scope.wait=0;
        var data="platform=all&mobile="+u+"&password="+p+"&code="+c+"&inviteCode="+ic+"&realname="+name;
        httpRequest.APIPOST('/ldUser/register', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
						$scope.user.category=userInfo.category;
						$scope.user.realName=userInfo.realname;
						$scope.user.incomeAmount=userInfo.incomeAmount;
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


app.controller('forgotController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
	$scope.register=function(){
        var u=$scope.username;
        var c=$scope.code;
        var p=$scope.password;
		
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
		
        $scope.wait=0;
        var data="platform=all&mobile="+u+"&password="+p+"&code="+c;
        httpRequest.APIPOST('/user/password', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                alertWarning("新密码设置成功！");
				$location.path("/products");
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
        var data="platform=all&type=2&mobile="+$scope.username;
        httpRequest.APIPOST('/sms/getVerifyCode', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 
            }else{
                alertWarning(result.msg);
            }
        });
    };
});