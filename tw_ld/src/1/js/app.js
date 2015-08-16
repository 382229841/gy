var app = angular.module('EasyBuy', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);

var preventCache=Math.random().toString(36);
app.config(function ($routeProvider, $locationProvider,$controllerProvider,$compileProvider,$filterProvider,$provide) {
	app.register = {
		controller: $controllerProvider.register,
		directive: $compileProvider.directive,
		filter: $filterProvider.register,
		factory: $provide.factory,
		service: $provide.service
	};
	app.asyncjs = function (js) {
		return ["$q", "$route", "$rootScope", function ($q, $route, $rootScope) {
			var deferred = $q.defer();
			var dependencies = js;
			if (Array.isArray(dependencies)) {
				for (var i = 0; i < dependencies.length; i++) {
					dependencies[i] += "?v=" + preventCache;
				}
			} else {
				dependencies += "?v=" + preventCache;//v是版本号
			}
			$script(dependencies, function () {
				$rootScope.$apply(function () {
					deferred.resolve();
				});
			});
			return deferred.promise;
		}];
	}

    $routeProvider
        .when('/products', { templateUrl: "views/goods/products.html?"+preventCache })
        .when('/products/:code', { templateUrl: "views/goods/products.html?"+preventCache })
        .when('/pay/:id', { templateUrl: "views/pay/payment.html?"+preventCache })
        .when('/pay/:id/:from', { templateUrl: "views/pay/payment.html?"+preventCache })
        .when('/dividedPay/:orderNum/:fee', { templateUrl: "views/pay/dividedPay.html?"+preventCache })
        .when('/dividedPay/success', { templateUrl: "views/pay/success2.html?"+preventCache })
        .when('/address/:payid', { templateUrl: "views/order/address.html?"+preventCache
			,resolve: {
				load: app.asyncjs(['lib/mobiscroll.zepto.js','lib/mobiscroll.custom-2.6.2.js'])
			}
        })
        /* .when('/address/:payid/:buyType', { templateUrl: "views/order/address2.html?"+preventCache
			,resolve: {
				load: app.asyncjs('lib/mobiscroll.custom-2.6.2.js')
			}
        }) */
        .when('/success/:ordersn/:mobile/:address/:time', { templateUrl: "views/pay/success.html?"+preventCache })
        .when('/success/:ordersn/:token', { templateUrl: "views/pay/success.html?"+preventCache })
        .when('/success/:ordersn', { templateUrl: "views/pay/success.html?"+preventCache })
        .when('/success', { templateUrl: "views/pay/success.html?"+preventCache })
        .when('/error', { templateUrl: "views/pay/error.html?"+preventCache })
        .when('/error/:orderId/:mobile', { templateUrl: "views/pay/error.html?"+preventCache })
        .when('/orderDetail', { templateUrl: "views/order/orderDetail.html?"+preventCache })
        .when('/orderDetail/:id', { templateUrl: "views/order/orderDetail.html?"+preventCache })
        .when('/orderDetail/:id/:token', { templateUrl: "views/order/orderDetail.html?"+preventCache })

        .when('/orderList', { templateUrl: "views/order/orderList.html?"+preventCache })
        .when('/orderList/:token', { templateUrl: "views/order/orderList.html?"+preventCache })
        
        /* .when('/orderInquiry', { templateUrl: "views/order/orderInquiry.html?"+preventCache }) */
        .when('/product/:id', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        .when('/product/:id/:from', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        .when('/product/:id/:from/:type', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        
        /* .when('/productDetail/:id', { templateUrl: "views/goods/productDetail.html?"+preventCache }) */
        .when('/cart', { templateUrl: "views/cart/cart.html?"+preventCache })
       /*  .when('/airport', { templateUrl: "views/order/airportSelect.html?"+preventCache })
        .when('/airport/:id', { templateUrl: "views/order/airportSelect.html?"+preventCache }) */
        
        
        .when('/comment/:id', { templateUrl: "views/app/comment.html?"+preventCache })
        
        .when('/oauth2/:openId/:state', { templateUrl: "views/wechat/oauth2.html?"+preventCache })   
        .when('/wechatOauth/:state', { templateUrl: "views/wechat/wechatOauth.html?"+preventCache })
        
		

		/** add in 1.6 **/
		.when('/register', { templateUrl: "views/user/register.html?"+preventCache })
		.when('/myProfile', { templateUrl: "views/user/my.html?"+preventCache })
		.when('/myProfile/:from', { templateUrl: "views/user/my.html?"+preventCache })
		.when('/myCoupon', { templateUrl: "views/user/myCoupon.html?"+preventCache })
		.when('/myCoupon/:token', { templateUrl: "views/user/myCoupon.html?"+preventCache })
		
		.when('/myPhone', { templateUrl: "views/user/myPhone.html?"+preventCache })
		.when('/myPhone/:mobile', { templateUrl: "views/user/myPhone.html?"+preventCache })
		.when('/myPhone/:mobile/:token', { templateUrl: "views/user/myPhone.html?"+preventCache })
		.when('/activity201501', { templateUrl: "views/activity/activity201501.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activity.js')
			  }
		})

		/* .when('/wechat/myPhone', { templateUrl: "views/wechat/myPhone.html?"+preventCache })
		.when('/wechat/myWiFi', { templateUrl: "views/wechat/myWiFi.html?"+preventCache })
		.when('/wechat/myAirportInfo', { templateUrl: "views/wechat/myAirportInfo.html?"+preventCache }) */
		
		/* .when('/airportService', { templateUrl: "views/order/airportService.html?"+preventCache })
		.when('/airportServiceNew', { templateUrl: "views/order/airportServiceNew.html?"+preventCache })
		.when('/airportServiceOrder', { templateUrl: "views/order/airportServiceOrder.html?"+preventCache
			,resolve: {
				load: app.asyncjs('lib/mobiscroll.custom-2.6.2.js')
			}
		}) */
		.otherwise({
            redirectTo: '/products'
        });
});

app.service('analytics', [
    '$rootScope', '$window', '$location', function ($rootScope, $window, $location) {
        var send = function (evt, data) {
            ga('send', evt, data);
        }
    }
]);

app.run( function($rootScope, $location) {    
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
    	$rootScope.winWidth=$(window).width();
    	$rootScope.winHeight=$(window).height();
    	var tokenInfo=getToken();
    	$rootScope.isRootLogin=true;
		if(!tokenInfo){
			if($location.path()!=='/register'){
				$rootScope.isRootLogin=false;
				$rootScope.$emit("CtrlUserModule", $rootScope.isRootLogin);
			}
			
		}
        hideLoading();                          
    });
});

app.controller('mainController', function ($rootScope, $window, $scope, httpRequest,dataStringify, analytics) {
    $rootScope.goeasy="购轻松";
	
	$rootScope.categoryId=0;
	$rootScope.categoryIndex=1;
	$rootScope.categoryCount=1;
	$rootScope.initNav=function(cat){
		
        $("#scroller2ul").html("");
        var actived="border-bottom: 3px solid #F14F57;color:#F14F57;";
        var lis=$rootScope.categoryId==0?"<li style=\""+actived+"\">" : "<li style=\"\">";
        lis=lis+"<a href=\"#/products\">全部</a></li>";
        var liCount=1;
        $rootScope.categoryIndex=1;
        for(var i=0;i<cat.length;i++){
            if(cat[i].name.indexOf('台湾必买')==-1){
            	if($rootScope.categoryId==cat[i].code){
					lis=lis+"<li style=\""+actived+"\"><a href=\"#/products/"+cat[i].code+"\">"+cat[i].name+" </a></li>";
            		$rootScope.categoryIndex=i+2;
            	}else{
            		lis=lis+"<li><a href=\"#/products/"+cat[i].code+"\">"+cat[i].name+" </a></li>";
            	}
                liCount++;
            }
        }
        $rootScope.categoryCount=liCount;
        $("#scroller2ul").html(lis);
        $("#scroller2").css("width",liCount*25+"%");
        $("#scroller2ul").css("width",liCount*25+"%");
        $("#scroller2ul li").css("width",100/liCount+"%");
        var generateScroll=function(){
        	var myScroll = new IScroll('#wrapper2', 
			 { 
				eventPassthrough: true, 
				scrollX: true, 
				scrollY: false,
				 preventDefault: false
			 });
			 var mod=parseInt($rootScope.categoryIndex/4);
			 var offset=$("#scroller2ul li").width()*mod;
			 if(cat.length>3){
				myScroll.scrollTo(-offset, 0);
			 }
			 
        };
        if(typeof(IScroll)=="undefined"){
            $.ajax({
                url: '/lib/iscroll.js',
                dataType: "script",
                cache:true,
                success: function(data){
                    generateScroll();
                }
            });
        }else{
            generateScroll();
        }

    };

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if(next.templateUrl && (next.templateUrl!="views/wechat/wechatOauth.html" || next.templateUrl!="views/wechat/oauth2.html")){
            $rootScope.loading = true;
        }else{
            $rootScope.loading = true;
        }


        if(location.hash.indexOf('activityDown')>-1 || location.hash.indexOf('activityDetail')>-1){
			//window.location.href="#/erroinfo";
		}
        	       
		
	});
	
    $rootScope.$on("$routeChangeSuccess", function (a,b) {
        $rootScope.loading = false;
    });	 
    $scope.audioControls=$("#audioControls")[0];    
    $rootScope.hideOverlay=function(){
    	$rootScope.loading = false;    	
    };
    $scope.initPlay=function(){
    	if(location.hash=="" || location.hash=="#/products"){
    		var ctr=$scope.audioControls;
    		ctr.play();
    	}    	
    };
    $scope.play=function(){
    	var ctr=$scope.audioControls;
    	//alert(ctr.paused);
    	if(ctr.paused){
    		ctr.play();
    		$("#div-nav-music-controls").removeClass("div-nav-music-pause");
    		$("#div-nav-music-controls").addClass("div-nav-music");
    	}else{
    		ctr.pause();
    		$("#div-nav-music-controls").removeClass("div-nav-music");
    		$("#div-nav-music-controls").addClass("div-nav-music-pause");
    	}    	
    };

    $scope.imageServiceUrl = imageServiceUrl;
    $rootScope.isOauth2=false;
    $rootScope.oauth2=function(state,type){  
        $window.location=webchatOauth(state,type);

        return;
    };

    httpRequest.APIPOST('/goods/category_v1.3', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
		if (result && result.code == statusCode.Success) {
			var cat=result.result;			
			$rootScope.categories=cat;//.slice(1);
		}else{ 
			alertWarning(result.msg);
		}
	});
});