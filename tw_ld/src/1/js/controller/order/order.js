app.controller('orderListController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.orders=[];
    $scope.go = function () {
        $location.path("/products");
    };
    $scope.getOrderStatus=function(status){
        if(status==1){
            return "等待付款";
        }
        if(status==2){
            return "等待确认收货";
        }
        if(status==3){
            return "交易成功";
        }
        if(status==4){
            return "已取消";
        }
        if(status==5){
            return "退款中";
        }
        if(status==6){
            return "已退款";
        }
        if(status==7){
            return "已失效";
        }
    };
	
    var pageNo=1;
    var pageSize=100; 
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getOrders();
    });
	$scope.getOrders=function(){
		showLoading();
		httpRequest.APIPOST('/orderLd/list', dataStringify("platform=all&token=" + $rootScope.tokenInfo.token + "&category=1&pageNo="+pageNo+"&pageSize="+pageSize), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if(result.msg==="success"){
				$scope.orders=result.result;
				hideLoading();
				if($scope.orders && $scope.orders.length<1){
					$scope.orders=null;
				}
			}else {
				hideLoading();
				alert(result.msg);
			}
		});
	};
    $scope.getOrders();


    $scope.pay = function (orderNum,totalPrice,quantity,id) {
        httpRequest.APIPOST('/orderLd/validate', dataStringify("platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                $location.path("/pay/confirm/"
					+orderNum+"/"
					+totalPrice+"/"
					+quantity+"");
            }else {
                alertWarning(result.msg);
            }
        });
    }

    $scope.takeOverOrder=function(id,index){
        showLoading();
        httpRequest.APIPOST('/orderLd/operate', dataStringify("action=confirm&platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                alertSuccess("收货成功！");
                $scope.orders[index].status=3;
				hideLoading();
            }else {
                hideLoading();
                alert(result.msg);
            }
        });
    }

    $scope.back=function(){
        $location.path("/myProfile");
    }
        

});

app.controller('orderDetailController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.orderId = $routeParams.id;
    $scope.totalNum = 0;
    $scope.totalAmount = 0;
    var token=$scope.token; 
	
    $scope.getOrderStatus=function(status,category){
        if(status==1){
            return "等待付款";
        }
        if(status==2){
            return "等待确认收货";
        }
        if(status==3){
            return "交易成功";
        }
        if(status==4){
            return "已取消";
        }
        if(status==5){
            return "退款中";
        }
        if(status==6){
            return "已退款";
        }
        if(status==7){
            return "已失效";
        }
    };

    $scope.deleteOrder=function(id){
        var arrButton = ["取消", "确定"];
		openDialog("确认删除当前订单？", "", arrButton, null,
			function (r,pWay) {
				if (r) {
					showLoading();
					httpRequest.APIPOST('/orderLd/operate', dataStringify("action=delete&platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
						if(result.msg==="success"){
							alertSuccess("删除成功！");
							$location.path("/orderList");
						}else {
							hideLoading();
							alert(result.msg);
						}
					});
				}
			});
    }

    $scope.drawbackOrder=function(id){
        var arrButton = ["取消", "确定"];
		openDialog("确认退款？", "", arrButton, null,
			function (r) {
				if (r) {
					showLoading();
					httpRequest.APIPOST('/orderLd/operate', dataStringify("action=refund&platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
						if(result.msg==="success"){
							alertSuccess("退款成功！");
							$scope.order.status=5;
							hideLoading();
						}else {
							hideLoading();
							alert(result.msg);
						}
					});
				}
			});
    };

    $scope.cancelOrder=function(id){
        var arrButton = ["取消", "确定"];
		openDialog("确认取消当前订单？", "", arrButton, null,
			function (r) {
				if (r) {
					showLoading();
					httpRequest.APIPOST('/orderLd/operate', dataStringify("action=cancel&platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
						if(result.msg==="success"){
							alertSuccess("取消成功！");
							$scope.order.status=4;
							hideLoading();
						}else {
							hideLoading();
							alert(result.msg);
						}
					});
				}
			});
    }

    $scope.takeOverOrder=function(id){
        showLoading();
        httpRequest.APIPOST('/orderLd/operate', dataStringify("action=confirm&platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                alertSuccess("收货成功！");
                $scope.order.status=3;
				hideLoading();
            }else {
                hideLoading();
                alert(result.msg);
            }
        });
    }
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getOrderDetail($scope.orderId);
    });
	
	$scope.getOrderDetail=function(orderId){
		if (orderId) {
			httpRequest.APIPOST('/orderLd/detail', dataStringify("platform=all&&orderId="+$scope.orderId+"&token="+$scope.tokenInfo.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
				if(result.msg==="success"){                            
					$scope.order=result.result;
					if ($scope.order && $scope.order.goodsList && $scope.order.goodsList.length > 0) {
						for (var i = 0; i < $scope.order.goodsList.length; i++) {
							$scope.order.goodsList[i].quantity = parseInt($scope.order.goodsList[i].quantity);
							$scope.totalNum += $scope.order.goodsList[i].quantity;
							$scope.totalAmount += $scope.order.goodsList[i].quantity * $scope.order.goodsList[i].buyPrice;
						}
						if($scope.order.comments=="''"){
							$scope.order.comments="";
						}
					}
				}else {
					alert(result.msg);
				}
			});

		}
		else {
			$scope.order = false;
		}
	};
	
	$scope.getOrderDetail($scope.orderId);
    

    $scope.showLarge = function (imgUrl) {
        showLargeImage(imgUrl);
    }

    $scope.go = function () {
        $location.path("/products");
    }
	
	$scope.pay = function (orderNum,totalPrice,quantity,id) {
        httpRequest.APIPOST('/orderLd/validate', dataStringify("platform=all&token=" + $rootScope.tokenInfo.token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                $location.path("/pay/confirm/"
					+orderNum+"/"
					+totalPrice+"/"
					+quantity+"");
            }else {
                alertWarning(result.msg);
            }
        });
    }


    $scope.back=function(){
        $location.path("/orderList");        
    }
});
