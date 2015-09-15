app.controller('paymentLDController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
	$scope.step=1;
	
	$scope.toggleOn=false;
	$scope.takeoverMethod=1;
	$scope.toggleTakeover=function(){
		$scope.toggleOn=$scope.toggleOn?false:true;
		
	};
	var goodsId=$location.search().goodsId;
	var quantity=$location.search().quantity;
	$scope.selectTakeover=function(t){
		$scope.toggleOn=false;
		$scope.takeoverMethod=t;
		
	};
	
	$scope.enterAddress=function(s){
		$scope.step=s;
		//alert(s);
		$scope.addressInfo=$.extend(true, {}, $scope.defaultAddress);
		if(s==1){
			$("#appDateTime").val("");
			$scope.step=$scope.takeoverMethod==1?2:3;
		}else{
			$("#appDateTime").val($scope.addressInfo.returnDate);
		}
	};
	
	$scope.goodsItems=function(){
		$scope.step=4;
	};
	
	$scope.back = function () {
		if($scope.step>1){
			$scope.step=1;
			return;
		}
		history.back();
    }

	$scope.getOrderPrice=function(){
		var data="platform=all&token="+$rootScope.tokenInfo.token+"&goodsId="+$location.search().goodsId+"&quantity="+$location.search().quantity;
		httpRequest.APIPOST('/orderLd/price', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.orderPrice=result.result || {};
				
			}else{
				alertWarning(result.msg);
			}
		});
	}

	$scope.getDefaultAddress=function(){
		var data="platform=all&token="+$rootScope.tokenInfo.token;
		httpRequest.APIPOST('/address/default', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.defaultAddress=result.result;
				if($scope.defaultAddress!=null){
					//$scope.$apply($scope.defaultAddress);
				}				
			}else{
				alertWarning(result.msg);
			}
		});
	}

	$scope.saveDefaultAddress=function(){
		
		if($scope.takeoverMethod==1){
            if (!$scope.addressInfo.contact || $scope.addressInfo.contact.toString().trim() == '') {
                alertWarning("请填写联系人姓名");
                return;
            }
            if ($scope.addressInfo.contact.toString().length < 2 || $scope.addressInfo.contact.toString().length > 20) {
                alertWarning("请输入2~20位的联系人姓名");
                return;
            }

            if (!$scope.addressInfo.mobile || $scope.addressInfo.mobile == '') {
                alertWarning("请填写手机号码");
                return;
            }
            if ($scope.addressInfo.mobile.toString().length != 11) {
                alertWarning("请输入11位的手机号码");
                return;
            }

            var flightTime = $("#appDateTime").val();
            if (!flightTime || flightTime == '') {
                alertWarning("请选择回程日期");
                return;
            }else{
                $scope.addressInfo.returnTime=flightTime;
            }
            if (!$scope.addressInfo.returnFlightno || $scope.addressInfo.returnFlightno == '') {
                alertWarning("请输入回程航班号");
                return;
            }
            if (new Date(flightTime.replace(/-/g, "/")) < $scope.minDateTime) {
                alertWarning("起飞时间请选择1小时后");
                return;
            }            

        }else{
            if (!$scope.addressInfo.contact || $scope.addressInfo.contact.toString().trim() == '') {
                alertWarning("请填写联系人姓名");
                return;
            }
            if ($scope.addressInfo.contact.toString().length < 2 || $scope.addressInfo.contact.toString().length > 20) {
                alertWarning("请输入2~20位的联系人姓名");
                return;
            }

            if (!$scope.addressInfo.mobile || $scope.addressInfo.mobile == '') {
                alertWarning("请填写手机号码");
                return;
            }
            if ($scope.addressInfo.mobile.toString().length !==11) {
                alertWarning("请输入11位的手机号码");
                return;
            }
			
            if (!$scope.addressInfo.hotelName || $scope.addressInfo.hotelName == '') {
                alertWarning("请输入酒店名称");
                return;
            }
			
			if ($scope.addressInfo.hotelName.length<5 || $scope.addressInfo.hotelName.length>50) {
                 alertWarning("请输入5-50位的酒店名称");
                return;
            }
			
			if (!$scope.addressInfo.hotelPickupDate || $scope.addressInfo.hotelPickupDate == '') {
                alertWarning("请输入取货日期");
                return;
            }
			
			if (!$scope.addressInfo.hotelPhone || $scope.addressInfo.hotelPhone == '') {
                alertWarning("请输入酒店电话");
                return;
            }
            if ($scope.addressInfo.hotelPhone.length<9 || $scope.addressInfo.hotelPhone.length >13) {
                alertWarning("请输入9-13位酒店电话");
                return;
            }
			
            if (!$scope.addressInfo.hotelAddress || $scope.addressInfo.hotelAddress.toString().trim() == '') {
                alertWarning("请填写酒店地址");
                return;
            }
            if ($scope.addressInfo.hotelAddress.toString().length < 5 || $scope.addressInfo.hotelAddress.toString().length > 100) {
                alertWarning("请输入5~100位的酒店地址");
                return;
            }
        }
        //$scope.$apply($scope.defaultAddress);
        

        $scope.search(function(){
            var data="";
            if($scope.takeoverMethod==2){
              data="platform=all&token="+$rootScope.tokenInfo.token
                      +"&contact="+$scope.addressInfo.contact
                      +"&hotelName="+$scope.addressInfo.hotelName
                      +"&hotelPickupDate="+$scope.addressInfo.hotelPickupDate
                      +"&hotelPhone="+$scope.addressInfo.hotelPhone
                      +"&hotelAddress="+$scope.addressInfo.hotelAddress
                      +"&mobile="+$scope.addressInfo.mobile;  
            }else{
                data="platform=all&token="+$rootScope.tokenInfo.token
                      +"&returnTime="+$("#appDateTime").val()
                      +"&contact="+$scope.addressInfo.contact
                      +"&returnAirportId="+$scope.addressInfo.returnAirportId
                      +"&mobile="+$scope.addressInfo.mobile
                      +"&returnFlightno="+$scope.addressInfo.returnFlightno; 
            }
            httpRequest.APIPOST('/address/add', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if(result.msg==="success"){
                    $scope.step=1;
                    $scope.$apply($scope.step);
                    $scope.getDefaultAddress();
                    $scope.$apply($scope.defaultAddress);
                }else {
                    alertWarning(result.msg);
                }
            });
        });

		

	};
	
	$scope.getDefaultAddress();
	$scope.getOrderPrice();
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getDefaultAddress();
		$scope.getOrderPrice();
    });

	var startdate = new Date();
	startdate.setHours(startdate.getHours() + 1);
	var m = startdate.getMinutes() % 5;
	if (m != 0) {
		startdate.setMinutes(startdate.getMinutes() + (5 - m));
	}
	startdate.setSeconds(0);
	startdate.setMilliseconds(0);
	$scope.minDateTime = startdate;

	var enddate = new Date();
	enddate.setMonth(enddate.getMonth() + 6);
	enddate.setHours(23);
	enddate.setMinutes(59);
	enddate.setSeconds(59);
	enddate.setMilliseconds(999);
	$scope.maxDateTime = enddate;

	opt.datetime = {dateOrder:'yymmdd',dateFormat:'yyyy-mm-dd', preset: 'datetime', minDate: startdate, maxDate: enddate, stepMinute: 5, 
		onSelect: function (valueText, inst) {
			//$scope.saveTemp();
			$scope.time=$("#appDateTime").val();
			//$scope.search();
			event.stopPropagation();
		}
	};
	var optDateTime = $.extend(opt['datetime'], opt['Default']);
	var optTime = $.extend(opt['time'], opt['Default']);
	$("#appDateTime").mobiscroll(optDateTime).date(optDateTime);
	
	$("#appDateTime2").mobiscroll(optDateTime).date(optDateTime);
	$scope.search = function (callback) {
		if($scope.takeoverMethod==2){
			callback();
			return;
		}
       // $scope.saveTemp();
        var flightNo=$scope.addressInfo.returnFlightno;
        if(flightNo==undefined)
            flightNo="";
        if(flightNo.length>=2 && $("#appDateTime").val()){
            var data="platform=all&backFlightno="+flightNo+"&backDate="+$("#appDateTime").val();
            httpRequest.APIPOST('/flight/back', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.addressInfo.returnAirportId=result.result.returnAirportId;
                    $scope.addressInfo.returnAirport=result.result.returnAirport;
                    $scope.addressInfo.returnTime=result.result.returnTime;
                    if(!$scope.time){
                        $scope.time="";
                    }
                    $("#appDateTime").val($("#appDateTime").val().split(' ')[0]+" "+result.result.returnTime);
                    callback();
                }else{
                    $scope.addressInfo.returnAirportId=-1;
                    $scope.addressInfo.returnAirport="";
                    alertWarning(result.msg);
                }
            });
        }
    };
	$scope.isGoPay=false;
    $scope.generateOrder=function(){
    	if($scope.isGoPay){
    		return;
    	}
    	
		var comment=$scope.comments?"&comments="+$scope.comments:"&comments=''";
    	var data="";
    	if($scope.defaultAddress==null){
			alertWarning("请填写联系人信息");
    		return;
    	}
		if($scope.takeoverMethod==2){
		  data="platform=all&token="+$rootScope.tokenInfo.token
				  +"&contact="+$scope.defaultAddress.contact
				  +"&pickupWay=2"
				  
				  +"&hotelName="+$scope.defaultAddress.hotelName
				  +"&hotelPhone="+$scope.defaultAddress.hotelPhone
				  +"&hotelAddress="+$scope.defaultAddress.hotelAddress
				  +"&pickupDate="+$scope.defaultAddress.hotelPickupDate
				  
				  +"&mobile="+$scope.defaultAddress.mobile
				  +"&goodsId="+goodsId
				  +"&quantity="+quantity
				  +comment; 
		}else{
			if($scope.defaultAddress.returnDate==null){
				alertWarning("请填写完整回程信息");
				return;
			}

			if($scope.defaultAddress.returnTime==null){
				alertWarning("请填写完整回程信息");
				return;
			}
			

			data="platform=all&token="+$rootScope.tokenInfo.token
				  +"&pickupWay=1"
				  +"&contact="+$scope.defaultAddress.contact
				  +"&mobile="+$scope.defaultAddress.mobile
				  +"&returnTime="+$scope.defaultAddress.returnDate+" "+$scope.defaultAddress.returnTime
				  +"&returnAirportId="+$scope.defaultAddress.returnAirportId					
				  +"&returnFlightno="+$scope.defaultAddress.returnFlightno
				  +"&goodsId="+goodsId
				  +"&quantity="+quantity+comment;
		}
		httpRequest.APIPOST('/orderLd/add', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if(result.msg==="success"){
				$scope.isGoPay=true;
				$("#btnOrder").text("正在下单...");
				$location.path("/pay/confirm/"
					+result.result.orderNum+"/"
					+$scope.orderPrice.total+"/"
					+$scope.orderPrice.totalNum+"");
			}else {
				alertWarning(result.msg);
			}
		});
    };
});

app.controller('dividedPayController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.order={};
    $scope.order.orderNum=$routeParams.orderNum;
    $scope.order.totalPrice=$routeParams.totalPrice;
	$scope.order.quantity=$routeParams.quantity;
	
	$scope.isWechat=easybuy.isWechat;
	$scope.isShowTips=false;
	$scope.payWay=1;
	
    $scope.pay=function(){
		if($scope.isWechat && $scope.payWay==1){
			$scope.isShowTips=true;
			return;
		}
		if($scope.payWay==1){
			if($scope.payWay==1 && $scope.isWechat){
				window.location.href = paymentUrl+ "callback=2&out_trade_no=" + $scope.order.orderNum + "&total_fee=" + $scope.order.totalPrice;
			}else{
				window.location.href = paymentUrl+ "callback=4&out_trade_no=" + $scope.order.orderNum + "&total_fee=" + $scope.order.totalPrice;
			}
			
		}else{
			window.location.href = serviceUrl + "/order/pay/orderid/" + $scope.order.orderNum+"/amount/"+$scope.order.totalPrice+"/address/hiker/time/201508221140";
		}
    };
    
	
	$scope.Payments = easybuy.Payments;
    var isChecked = false;
    for (var i = $scope.Payments.length - 1; i >= 0; i--) {
        if ($scope.Payments[i].id == easybuy.PaymentMethods.WechatPay && !easybuy.isWechat) {
            $scope.Payments.splice(i, 1);
            continue;
        }
        if ($scope.Payments[i].checked) {
            isChecked = true;
        }
    }
    if (!isChecked) {
        $.each($scope.Payments, function (i, item) {
            if (item.id == easybuy.PaymentMethods.AlipayWeb) { item.checked = true; return false; }
        });
    }

    $scope.checked = function (payment) {
        $.each($scope.Payments, function (i, item) { item.checked = false; });
        payment.checked = true;
		$scope.payWay=payment.id;
    }
	$scope.back=function(){
		history.back();
	};
	var t=getToken() || {};
	if(!t.isFresh){
		location.reload();
		t.isFresh=1;
		setToken(t);
	}
	
});

app.controller('successController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams) {
    
    /*httpRequest.POST('/order/getpayok', JSON.stringify({ "order_sn": $routeParams.ordersn }), { "Content-Type": "application/json" }).then(function (result) {
        if (result.status == 1) {
            $scope.order = result.data;            
        } else {
            alert("获取订单信息失败!");
        }
    })*/
    var isApp=$location.search().payType=="app"?true:false;
    $scope.isApp=isApp;
    if($routeParams.ordersn){
        removeOrder();
        $scope.time=$routeParams.time;
        $scope.address=$routeParams.address;
    }

    $scope.goHome = function () {
        if(isApp){
            window.location.href = easybuy.appActivity + "?action=17";
            return;
        }
        $location.path("/products");
    }

    $scope.view = function () {
        if(isApp){
            window.location.href = easybuy.appActivity + "?action=16&orderId="+$routeParams.ordersn;
            return;
        }
        $location.path("/orderDetail/" + $routeParams.ordersn);
    }

    $scope.back = function () {
        $location.path("/products");
    }
});

app.controller('errorController', function ($rootScope, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {
    var isApp=$location.search().payType=="app"?true:false;
    $scope.isApp=isApp;
    $scope.goHome = function () {
        if(isApp){
            window.location.href = easybuy.appActivity + "?action=17";
            return;
        }
        $location.path("/products");
    }

    $scope.again = function () {
        if(isApp){
            window.location.href = easybuy.appActivity + "?action=18";
            return;
        }
        if ($routeParams.orderId) {
			$location.path("/products");
			return;
            var orderId=$routeParams.orderId;
            var mobile=$routeParams.mobile
            httpRequest.APIPOST('/user/h5Login', dataStringify("platform=all&account=" + mobile + "&password=" + mobile), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if(result.msg==="success"){
                    var token=result.result;
                    setToken({token:token,mobile:mobile});                
                     httpRequest.APIPOST('/order/detail', dataStringify("platform=all&token=" + token + "&category=1&orderId="+orderId), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        if(result.msg==="success"){                            
                            var order=result.result;                            
                            $location.path("/pay/" + orderId+"/2").search({area:order.area,goods:JSON.stringify(order.goodsList)});
                        }else {
                            alert(result.msg);
                        }
                    });
                }
            });            
        }
        else {
            $location.path("/products");
        }
    }

    $scope.back = function () {
        $location.path("/products");
    }
});
