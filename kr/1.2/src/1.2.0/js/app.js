var app = angular.module('EasyBuy', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);
var onlyWechatOauth=[];
var isNotBindPhone=[];
onlyWechatOauth["views/wechat/myOrder.html"]="myOrder";
onlyWechatOauth["views/wechat/myFreeOrder.html"]="myFreeOrder";
onlyWechatOauth["views/wechat/myInfo.html"]="myInfo";
onlyWechatOauth["views/wechat/car.html"]="car";
onlyWechatOauth["views/wechat/buyFree.html"]="buyFree";
onlyWechatOauth["views/wechat/easyHandsInfo.html"]="easyHandsInfo";
onlyWechatOauth["views/wechat/easyHandsInfoSuccess.html"]="easyHandsInfoSuccess";
onlyWechatOauth["views/wechat/easyHandsAgent.html"]="easyHandsAgent";
onlyWechatOauth["views/wechat/easyHandsDown.html"]="easyHandsDown";
onlyWechatOauth["views/wechat/activity.html"]="activity";
onlyWechatOauth["views/wechat/refinedProducts.html"]="refinedProducts";

onlyWechatOauth["views/user/my.html"]="myProfile";
onlyWechatOauth["views/order/airportServiceOrder.html"]="airportServiceOrder";
onlyWechatOauth["views/activity/activity201501.html"]="activity-activityDetail";
onlyWechatOauth["views/activity/down.html"]="activity-activityDown";
onlyWechatOauth["views/user/myCoupon.html"]="myCoupon";
onlyWechatOauth["views/user/myPhone.html"]="myPhone";
onlyWechatOauth["views/wechat/myAirportInfo.html"]="wechat-myAirportInfo";
onlyWechatOauth["views/wechat/myWiFi.html"]="wechat-myWiFi";
//onlyWechatOauth["views/activity/activity201501.html"]="activity-activityDetail";

isNotBindPhone["activity-activityDetail"]=true;
isNotBindPhone["activity-activityDown"]=true;
//isNotBindPhone["myCoupon"]=true;
isNotBindPhone["myPhone"]=true;

var baseOauth=[];
baseOauth["activity-activityDetail"]=true;
baseOauth["activity-activityDown"]=true;
baseOauth["myPhone"]=true;
baseOauth["myCoupon"]=true;
baseOauth["orderList"]=true;
baseOauth["wechat-myAirportInfo"]=true;
baseOauth["wechat-myWiFi"]=true;
var isContainFind=[];
isContainFind["activity-activityDown"]=true;
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
        .when('/products', { templateUrl: "views/goods/productList.html?"+preventCache,controller:'productsController'})
        .when('/products/:code', { templateUrl: "views/goods/products.html?"+preventCache })
        .when('/pay/:id', { templateUrl: "views/pay/payment.html?"+preventCache })
        .when('/pay/:id/:from', { templateUrl: "views/pay/payment.html?"+preventCache })
        .when('/dividedPay/:orderNum/:fee', { templateUrl: "views/pay/dividedPay.html?"+preventCache })
        .when('/dividedPay/success', { templateUrl: "views/pay/success2.html?"+preventCache })
        .when('/address/:payid', { templateUrl: "views/order/address.html?"+preventCache
			,resolve: {
				load: app.asyncjs('lib/mobiscroll.custom-2.6.2.js')
			}
        })
        .when('/address/:payid/:buyType', { templateUrl: "views/order/address2.html?"+preventCache
			,resolve: {
				load: app.asyncjs('lib/mobiscroll.custom-2.6.2.js')
			}
        })
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
        
        .when('/orderInquiry', { templateUrl: "views/order/orderInquiry.html?"+preventCache })
        .when('/product/:id', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        .when('/product/:id/:from', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        .when('/product/:id/:from/:type', { templateUrl: "views/goods/productApp.html?"+preventCache,controller:'productAppController'})
        
        .when('/productDetail/:id', { templateUrl: "views/goods/productDetail.html?"+preventCache })
        .when('/cart', { templateUrl: "views/cart/cart.html?"+preventCache })
        .when('/airport', { templateUrl: "views/order/airportSelect.html?"+preventCache })
        .when('/airport/:id', { templateUrl: "views/order/airportSelect.html?"+preventCache })
        
        
        .when('/comment/:id', { templateUrl: "views/app/comment.html?"+preventCache })

        .when('/myOrder', { templateUrl: "views/wechat/myOrder.html?"+preventCache })
        .when('/myFreeOrder', { templateUrl: "views/wechat/myFreeOrder.html?"+preventCache })
        .when('/myInfo', { templateUrl: "views/wechat/myInfo.html?"+preventCache })
        .when('/car', { templateUrl: "views/wechat/car.html?"+preventCache })
        .when('/buyFree', { templateUrl: "views/wechat/buyFree.html?"+preventCache })
        .when('/easyHandsInfo', { templateUrl: "views/wechat/easyHandsInfo.html?"+preventCache })
        .when('/easyHandsInfoSuccess', { templateUrl: "views/wechat/easyHandsInfoSuccess.html?"+preventCache })
        .when('/easyHandsDown', { templateUrl: "views/wechat/easyHandsDown.html?"+preventCache })
        .when('/easyHandsAgent', { templateUrl: "views/wechat/easyHandsAgent.html?"+preventCache })
        .when('/activity', { templateUrl: "views/wechat/activity.html?"+preventCache })
        .when('/refinedProducts', { templateUrl: "views/wechat/refinedProducts.html?"+preventCache }) 
        
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

		.when('/wechat/myPhone', { templateUrl: "views/wechat/myPhone.html?"+preventCache })
		.when('/wechat/myWiFi', { templateUrl: "views/wechat/myWiFi.html?"+preventCache })
		.when('/wechat/myAirportInfo', { templateUrl: "views/wechat/myAirportInfo.html?"+preventCache })
		
		.when('/airportService', { templateUrl: "views/order/airportService.html?"+preventCache })
		.when('/airportServiceNew', { templateUrl: "views/order/airportServiceNew.html?"+preventCache })
		.when('/airportServiceOrder', { templateUrl: "views/order/airportServiceOrder.html?"+preventCache
			,resolve: {
				load: app.asyncjs('lib/mobiscroll.custom-2.6.2.js')
			}
		})

		/*for app**/
		.when('/about', { templateUrl: "views/app/about.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		 })
        .when('/about/:type', { templateUrl: "views/app/about.html?"+preventCache 
        	,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
        .when('/article/:id', { templateUrl: "views/app/article.html?"+preventCache
        	,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
        .when('/article/:id/:type', { templateUrl: "views/app/article.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
		.when('/app/wifiDetail', { templateUrl: "views/app/wifiDetail.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		 })
		.when('/service', { templateUrl: "views/app/serviceTerms.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
        .when('/service/:type', { templateUrl: "views/app/serviceTerms.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })

        .when('/agent', { templateUrl: "views/app/agent.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
        .when('/agent/:type', { templateUrl: "views/app/agent.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })

        .when('/carBilling', { templateUrl: "views/app/carBilling.html?"+preventCache 
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
        .when('/carBilling/:type', { templateUrl: "views/app/carBilling.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })

        .when('/mifi', { templateUrl: "views/app/mifi.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
        .when('/mifi/:type', { templateUrl: "views/app/mifi.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
        })
		
		.when('/downloadApp', { templateUrl: "views/wechat/downloadApp.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		}) 

		.when('/download', { templateUrl: "views/wechat/download.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		}) 

		.when('/app/wifiAgent', { templateUrl: "views/app/wifiAgent.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
		.when('/app/wifiAgent_1_2', { templateUrl: "views/app/wifiAgent_1_2.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
		.when('/app/airportBus', { templateUrl: "views/app/airportBus.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})

		.when('/app/shuttleService', { templateUrl: "views/app/shuttleService.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
		.when('/app/tourDetail/:id', { templateUrl: "views/app/tourDetail.html?"+preventCache
			,resolve: {
				load: app.asyncjs('js/controller/app/apppages.js')
			}
		})
		/** for app*/


		.when('/update', { templateUrl: "views/update.html?"+preventCache })
		.when('/erroinfo', { templateUrl: "views/erroinfo.html?"+preventCache })
		
		/*活动 **/
		.when('/activity/xrhl', { templateUrl: "views/activity/xrhl.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activity.js')
			  }
		})
		.when('/activity/card', { templateUrl: "views/activity/card.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activityDown.js')
			  }
		})

		.when('/activity/card', { templateUrl: "views/activity/card.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activityDown.js')
			  }
		})

		.when('/activity/full1', { templateUrl: "views/activity/full1.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/fullGive.js')
			  }
		})
		
		.when('/activity/half', { templateUrl: "views/activity/half.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/halfPrice.js')
			  }
		})
		
		.when('/activity/dutyFree', { templateUrl: "views/activity/dutyFree.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activityDown.js')
			  }
		})
		.when('/activity/dutyFreeNew', { templateUrl: "views/activity/dutyFreeNew.html?"+preventCache 
			  ,resolve: {
				load: app.asyncjs('js/controller/activity/activityDown.js')
			  }
		})
		/* 活动 ***/
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
    	if(tokenInfo){
    		if(!tokenInfo.openId){
    			removeToken();
    		}
    	}
        if(next.templateUrl && onlyWechatOauth[next.templateUrl.split('?')[0]]){
            if(!$rootScope.isOauth2 && next.templateUrl!="views/wechat/oauth2.html" && easybuy.isWechat && !(getToken() && getToken().token && getToken().mobile && getToken().mobile.length>6)){
                var state=onlyWechatOauth[next.templateUrl.split('?')[0]];
                if(isNotBindPhone[state]==true &&(getToken() && getToken().token)){

                }else{
                	if(isContainFind[state]){
                		setFind($location.search());
                	}
                	$location.path("/wechatOauth/"+state);
                }                
            }
        } 
        if(next.templateUrl){
            if(next.templateUrl=="views/activity/activity-01.html"){
                $rootScope.goeasy="韩国直购，正品低价，万元红包等你来抢！！";                
            }else{
                $rootScope.goeasy="购轻松";                
            }
        }
        if(current && current.loadedTemplateUrl && current.loadedTemplateUrl=="views/activity/activity-01.html"){
            location.reload(); 
        }
        $(document).attr("title",$rootScope.goeasy); 
        hideLoading();                          
    });
});
app.controller('erroinfoController',function($rootScope, $window, $scope, httpRequest,dataStringify, analytics){
	setTimeout(function(){
		window.location.href="#/products"
	},1000);
});
app.controller('mainController', function ($rootScope, $window, $scope, httpRequest,dataStringify, analytics) {
    $rootScope.goeasy="购轻松";
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if(next.templateUrl && (next.templateUrl!="views/wechat/wechatOauth.html" || next.templateUrl!="views/wechat/oauth2.html")){
            $rootScope.loading = true;
        }else{
            $rootScope.loading = true;
        }


        if(location.hash.indexOf('activityDown')>-1 || location.hash.indexOf('activityDetail')>-1){
			window.location.href="#/erroinfo";
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
			$rootScope.categories=cat.slice(1);
		}else{ 
			alertWarning(result.msg);
		}
	});
});