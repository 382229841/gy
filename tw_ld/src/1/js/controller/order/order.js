app.controller('addressController', function ($rootScope, $scope, dataStringify, httpRequest, analytics, $location, $window, $routeParams) {
    $scope.buyType=parseInt($routeParams.buyType) || 1;
    
    if($location.$$search.token){
        showLoading();
        httpRequest.APIPOST('/address/default', dataStringify("platform=all&token="+$location.$$search.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                $scope.addressInfo=result.result;
                if($scope.addressInfo && $scope.addressInfo.returnDate){
                    $scope.time=$scope.addressInfo.returnDate+" "+$scope.addressInfo.returnTime;
                }                
                if($scope.addressInfo){
                    if($scope.addressInfo.province){
                        $scope.addressInfo.region=$scope.addressInfo.province+" "+$scope.addressInfo.city+" "+$scope.addressInfo.district;
                        $scope.addressInfo.regionIds=$scope.addressInfo.provinceId+","+$scope.addressInfo.cityId+","+$scope.addressInfo.districtId;  
                    }                    
                }else{
                    $scope.addressInfo={};
                }
                                
                if($scope.buyType==2){
                    initArea();
                }else{
                    /*var temp=getAddressTemp();
                    if(temp){
                        $scope.addressInfo=temp;
                        $scope.addressInfo.returnAirportId=temp.flight_id;
                        $scope.addressInfo.returnAirport=temp.terminal;
                    }else{
                        setAddressTemp($scope.addressInfo);
                    }*/
                    setAddressTemp($scope.addressInfo);
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

                    opt.datetime = {dateOrder:'yymmdd',dateFormat:'yyyy-mm-dd', preset: 'datetime', minDate: startdate, maxDate: enddate, stepMinute: 5, onSelect: function (valueText, inst) {
                        $scope.saveTemp();
                        $scope.time=$("#appDateTime").val();
                        //$scope.search();
                        event.stopPropagation();
                    }
                    };
                    var optDateTime = $.extend(opt['datetime'], opt['Default']);
                    var optTime = $.extend(opt['time'], opt['Default']);
                    $("#appDateTime").mobiscroll(optDateTime).date(optDateTime);
                }
            }else {
                alertWarning(result.msg);
            }
        });
    }else{
        if($scope.buyType==2){
            initArea();
        }else{
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

            opt.datetime = {dateOrder:'yymmdd',dateFormat:'yyyy-mm-dd', preset: 'datetime', minDate: startdate, maxDate: enddate, stepMinute: 5, onSelect: function (valueText, inst) {
                $scope.saveTemp();
                $scope.time=$("#appDateTime").val();
                $scope.search();
                event.stopPropagation();
            }
            };
            var optDateTime = $.extend(opt['datetime'], opt['Default']);
            var optTime = $.extend(opt['time'], opt['Default']);
            $("#appDateTime").mobiscroll(optDateTime).date(optDateTime);            
        }
    }

    function initArea(){        
        $('#agentRegion').val($scope.addressInfo.region).attr("data",$scope.addressInfo.regionIds);
        $('#pAddress').mobiscroll().treelist({
            theme: 'android-ics light',//ios
            display: 'modal',
            mode: 'scroller',
            labels: ['省份', '城市'],
            setText: "确认", //确认按钮名称
            cancelText: "取消", //取消按钮名籍
            width: "90",
            insertTo: "#agentRegion",
            action:"fillParentCity"
        });            
        $('#pAddress_dummy').css('display','none');
        $("#agentRegion").click(function () {
            $('#pAddress_dummy').click();
            return false;
        });        
    }       

    $scope.back = function () {
        clearAddressTemp();
        history.back();
    }

    $scope.date = function () {
        $('#appDateTime').mobiscroll('show');
    }

    $scope.validNum = function () {
        $scope.addressInfo.mobile = validInteger($scope.addressInfo.mobile);
    }
    

    $scope.saveTemp=function(){
        if(!$scope.addressInfo){
            $scope.addressInfo={}; 
        }          
        if($scope.buyType==2){
            $scope.addressInfo.region=$("#agentRegion").val();
            $scope.addressInfo.regionIds=$("#agentRegion").attr("data");
        }else{
            $scope.addressInfo.returnTime=$("#appDateTime").val();
        }
        setAddressTemp($scope.addressInfo);
    }
    
    $scope.search = function (callback) {
       // $scope.saveTemp();
        var flightNo=$scope.addressInfo.returnFlightno;
        if(flightNo==undefined)
            flightNo="";
        if(flightNo.length>=2 && $scope.time){
            var data="platform=all&backFlightno="+flightNo+"&backDate="+$scope.time;
            httpRequest.APIPOST('/flight/back', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.addressInfo.returnAirportId=result.result.returnAirportId;
                    $scope.addressInfo.returnAirport=result.result.returnAirport;
                    $scope.addressInfo.returnTime=result.result.returnTime;
                    if(!$scope.time){
                        $scope.time="";
                    }
                    $("#appDateTime").val($scope.time.split(' ')[0]+" "+result.result.returnTime);
                    $scope.time=$scope.time.split(' ')[0]+" "+result.result.returnTime;
                    $scope.saveTemp();
                    callback();
                }else{
                    $scope.addressInfo.returnAirportId=-1;
                    $scope.addressInfo.returnAirport="";
                    alertWarning(result.msg);
                }
            });
        }
    };

    $scope.save = function () {
        if($scope.buyType==1){
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
            if ($scope.addressInfo.mobile.toString().length < 9 || $scope.addressInfo.mobile.toString().length > 13) {
                alertWarning("请输入9~13位的手机号码");
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

            //if (!$scope.addressInfo.returnAirport || $scope.addressInfo.returnAirport == '') {
            //    alertWarning("请输入正确的航班号和选择合理的回程日期");
             //   return;
            //}
        }else{
            if (!$scope.addressInfo.contact || $scope.addressInfo.contact.toString().trim() == '') {
                alertWarning("请填写收货人姓名");
                return;
            }
            if ($scope.addressInfo.contact.toString().length < 2 || $scope.addressInfo.contact.toString().length > 20) {
                alertWarning("请输入2~20位的收货人姓名");
                return;
            }

            if (!$scope.addressInfo.mobile || $scope.addressInfo.mobile == '') {
                alertWarning("请填写手机号码");
                return;
            }
            if ($scope.addressInfo.mobile.toString().length < 9 || $scope.addressInfo.mobile.toString().length > 13) {
                alertWarning("请输入9~13位的手机号码");
                return;
            }
            if ($("#agentRegion").val().trim().length==0) {
                alertWarning("请选择所在地");
                return;
            }else{
                $scope.addressInfo.region=$("#agentRegion").val();
            }
            if (!$scope.addressInfo.detailAddress || $scope.addressInfo.detailAddress.toString().trim() == '') {
                alertWarning("请填写详细地址");
                return;
            }
            if ($scope.addressInfo.detailAddress.toString().length < 5 || $scope.addressInfo.detailAddress.toString().length > 60) {
                alertWarning("请输入5~60位的收货地址");
                return;
            }
        }
        
        

        $scope.search(function(){
            var data="";
            if($scope.buyType==2){
              var arrRegion=$('#agentRegion').attr("data").split(',');
              data="platform=all&token="+$location.$$search.token
                      +"&contact="+$scope.addressInfo.contact
                      +"&cityId="+arrRegion[1]
                      +"&detailAddress="+$scope.addressInfo.detailAddress
                      +"&provinceId="+arrRegion[0]
                      +"&districtId="+arrRegion[2]
                      +"&mobile="+$scope.addressInfo.mobile;  
            }else{
                data="platform=all&token="+$location.$$search.token
                      +"&returnTime="+$scope.addressInfo.returnTime
                      +"&contact="+$scope.addressInfo.contact
                      +"&returnAirportId="+$scope.addressInfo.returnAirportId
                      +"&mobile="+$scope.addressInfo.mobile
                      +"&returnFlightno="+$scope.addressInfo.returnFlightno; 
            }
            httpRequest.APIPOST('/address/add', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if(result.msg==="success"){
                    clearAddressTemp();
                    history.back();
                }else {
                    alertWarning(result.msg);
                }
            });
        });


        
    }
});

app.controller('airportController', function ($rootScope, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {
    httpRequest.APIPOST('/dic/listFlight', dataStringify("platform=all&type=2"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if(result.msg==="success"){
            var flights = result.result;
            $scope.flights=[];
            for(var i=0;i<flights.length;i++){
                $scope.flights.push({id:flights[i].id,terminal:flights[i].name});
            }

            if ($scope.flights && $routeParams.id != null) {
                for (var i = 0; i < $scope.flights.length; i++) {
                    if ($scope.flights[i].id == $routeParams.id) {
                        $scope.flights[i].selected = true;
                        break;
                    }
                }
            }

        }else {
            alertWarning(result.msg);
        }
    });

    $scope.select = function (flight) {
        if ($scope.flights && $scope.flights.length > 0) {
            for (var i = 0; i < $scope.flights.length; i++) {
                $scope.flights[i].selected = false;
            }
        }
        flight.selected = true;


        var addressInfo = getAddressTemp();
        if (addressInfo == null) {
            addressInfo = new Object();
        }
        addressInfo.flight_id = flight.id;
        addressInfo.terminal = flight.terminal;
        setAddressTemp(addressInfo);
        history.back();
    }

    $scope.isSelected = function () {
        if ($scope.flights && $scope.flights.length > 0) {
            for (var i = 0; i < $scope.flights.length; i++) {
                if ($scope.flights[i].selected) {
                    return true;
                }
            }
        }
        return false;
    }
});

app.controller('orderInquiryController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    if (easybuy.parameter.mobileInquiry) {
        $scope.mobile = easybuy.parameter.mobileInquiry;
    }
    if (!$scope.mobile) {
        var userInfo = getUserInfo();
        if (userInfo) {
            $scope.mobile = userInfo.mobile;
        }
    }

    $scope.validNum = function () {
        $scope.mobile = validInteger($scope.mobile);
    }

    $scope.inquiry = function () {
        if (!$scope.mobile || $scope.mobile == '') {
            alertWarning("请填写手机号");
            return;
        }
        if ($scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号");
            return;
        }

        easybuy.parameter.mobileInquiry = $scope.mobile;

        $location.path("/orderList/" + $scope.mobile);

        

        /*httpRequest.APIPOST('/user/h5Login', dataStringify("platform=all&account=" + $scope.mobile + "&password=" + $scope.mobile), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                var a=1;
            }
        });

        httpRequest.POST('/order/index', JSON.stringify({ "mobile": $scope.mobile }), { "Content-Type": "application/json" }).then(function (result) {
            if (result.status == 1) {
                $location.path("/orderDetail/" + $scope.mobile);
            } else {
                alertWarning("当前没有订单，请重新输入手机号");
            }
        });*/
    }
});

app.controller('orderListController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.token=$routeParams.token;
    if(easybuy.isWechat && !$scope.token){
        if(getToken() && getToken().token){
            $scope.token=getToken().token;
        }else{
            $location.path("/wechatOauth/orderList");
            return;
        }
    }
    $scope.orders=[];
    $scope.go = function () {
        $location.path("/products");
    };
    $scope.getOrderStatus=function(status,category){
        if(status==1)
            return "等待付款";
        if(status==2 && category && category==3){
            return "进行中";
        }

        if(status==2 && category!=3){
            return "等待确认收货";
        }
            
        if(status==3 && category && category==3){
            return "交易成功";
        }

        if(status==3 && category!=3){
            return "交易成功";
        }
            
        if(status==4)
            return "订单已取消";
        if(status==5 && category!=3)
            return "退款中";
        if(status==6 && category!=3)
            return "退款成功";
        if(status==7)
            return "已失效";
    };
    var tokenInfo=getToken();
    if(tokenInfo && tokenInfo.token){
        
    }else{
        tokenInfo={};
        tokenInfo.token="";
    }
    var pageNo=1;
    var pageSize=100;   
    var token=$scope.token? $scope.token : tokenInfo.token;
    showLoading();
    httpRequest.APIPOST('/order/list', dataStringify("platform=all&token=" + token + "&category=1&pageNo="+pageNo+"&pageSize="+pageSize), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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

    $scope.pay = function (orderNum,totalPrice,address,returnTime,id) {
        httpRequest.APIPOST('/order/checkDate', dataStringify("platform=all&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                if(!address)
                    address=1;
                if(!returnTime)
                    returnTime=2;       
                var arrButton = ["取消", "确定"];
                openDialog("确认从购物袋中删除所有选中的商品？", "支付方式", arrButton, 4,
                    function (r,pWay) {
                        if (r) {
                            if(pWay==easybuy.PaymentMethods.WechatPay){
                                window.location.href = serviceUrl + "/order/pay/orderid/" + orderNum+"/amount/"+totalPrice+"/address/"+address+"/time/"+returnTime;
                            }else{
                                if(easybuy.isWechat){
                                    var url=$location.absUrl().split('#')[0]+"#/dividedPay/"+orderNum+"/"+totalPrice;
                                    //$location.path("/dividedPay/"+orderNum+"/"+totalPrice);
                                    //$scope.$apply($location);
                                    //alert(url);
                                    window.location.href=url;
                                }else{
                                    window.location.href = paymentUrl+ "callback=1&out_trade_no=" + orderNum + "&total_fee=" + totalPrice;
                                }   
                                
                            } 
                        }
                    });
            }else {
                alertWarning(result.msg);
            }
        });
    }

    $scope.deleteOrder=function(id,index){
        var arrButton = ["取消", "确定"];
        openDialog("确认删除当前订单？", "", arrButton, null,
            function (r,pWay) {
                if (r) {
                    showLoading();
                    httpRequest.APIPOST('/order/delete', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        if(result.msg==="success"){
                            alertSuccess("删除成功！");
                            httpRequest.APIPOST('/order/list', dataStringify("platform=all&token=" + token + "&category=1&pageNo="+pageNo+"&pageSize="+pageSize), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
                        }else {
                            hideLoading();
                            alert(result.msg);
                        }
                    });
                }
            });
    }

    $scope.cancelOrder=function(id,index){
        var arrButton = ["取消", "确定"];
        openDialog("确认取消当前订单？", "", arrButton, null,
            function (r,pWay) {
                if (r) {
                    showLoading();
                    httpRequest.APIPOST('/order/cancel', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        if(result.msg==="success"){
                            alertSuccess("取消成功！");
                            $scope.orders[index].status=4;
                        }else {
                            hideLoading();
                            alert(result.msg);
                        }
                    });
                }
            });
    }

    $scope.takeOverOrder=function(id,index){
        showLoading();
        httpRequest.APIPOST('/order/confirm', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                alertSuccess("收货成功！");
                $scope.orders[index].status=3;
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
    $scope.token = $routeParams.token;
    $scope.totalNum = 0;
    $scope.totalAmount = 0;
    var token=$scope.token;   
    $scope.getOrderStatus=function(status,category){
        if(status==1)
            return "等待付款";
        if(status==2 && category && category==3){
            return "进行中";
        }

        if(status==2 && category!=3){
            return "等待确认收货";
        }
            
        if(status==3 && category && category==3){
            return "交易成功";
        }

        if(status==3 && category!=3){
            return "交易成功";
        }
            
        if(status==4)
            return "订单已取消";
        if(status==5 && category!=3)
            return "退款中";
        if(status==6 && category!=3)
            return "退款成功";
        if(status==7)
            return "已失效";
    };

    $scope.deleteOrder=function(id){
        if(!checkToken()){
            var tokenInfo=getToken();
            if(tokenInfo && tokenInfo.token){
                token=tokenInfo.token;
                var arrButton = ["取消", "确定"];
                openDialog("确认删除当前订单？", "", arrButton, null,
                    function (r,pWay) {
                        if (r) {
                            showLoading();
                            httpRequest.APIPOST('/order/delete', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                                if(result.msg==="success"){
                                    alertSuccess("删除成功！");
                                    $location.path("/orderList/"+token);
                                }else {
                                    hideLoading();
                                    alert(result.msg);
                                }
                            });
                        }
                    });
            }else{
                if(easybuy.isWechat){
                    $location.path("/wechatOauth/orderDetail-"+$routeParams.id);
                }else{
                    $location.path("/myProfile/orderDetail-"+$routeParams.id);
                }
            }
        }else{
            var arrButton = ["取消", "确定"];
            openDialog("确认删除当前订单？", "", arrButton, null,
                function (r,pWay) {
                    if (r) {
                        showLoading();
                        httpRequest.APIPOST('/order/delete', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                            if(result.msg==="success"){
                                alertSuccess("删除成功！");
                                $location.path("/orderList/"+token);
                            }else {
                                hideLoading();
                                alert(result.msg);
                            }
                        });
                    }
                });
        }
    }

    $scope.drawbackOrder=function(id){
        if(!checkToken()){
            var tokenInfo=getToken();
            if(tokenInfo && tokenInfo.token){
                token=tokenInfo.token;
                var arrButton = ["取消", "确定"];
                openDialog("确认退款？", "", arrButton, null,
                    function (r) {
                        if (r) {
                            showLoading();
                            httpRequest.APIPOST('/order/refund', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                                if(result.msg==="success"){
                                    alertSuccess("退款成功！");
                                    $scope.order.status=5;
                                }else {
                                    hideLoading();
                                    alert(result.msg);
                                }
                            });
                        }
                    });
            }else{
                if(easybuy.isWechat){
                    $location.path("/wechatOauth/orderDetail-"+$routeParams.id);
                }else{
                    $location.path("/myProfile/orderDetail-"+$routeParams.id);
                }
            }
        }else{
            var arrButton = ["取消", "确定"];
            openDialog("确认退款？", "", arrButton, null,
                function (r) {
                    if (r) {
                        showLoading();
                        httpRequest.APIPOST('/order/refund', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                            if(result.msg==="success"){
                                alertSuccess("退款成功！");
                                $scope.order.status=5;
                            }else {
                                hideLoading();
                                alert(result.msg);
                            }
                        });
                    }
                });
        }
    };

    $scope.cancelOrder=function(id){
        if(!checkToken()){
            var tokenInfo=getToken();
            if(tokenInfo && tokenInfo.token){
                token=tokenInfo.token;
                var arrButton = ["取消", "确定"];
                openDialog("确认取消当前订单？", "", arrButton, null,
                    function (r) {
                        if (r) {
                            showLoading();
                            httpRequest.APIPOST('/order/cancel', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                                if(result.msg==="success"){
                                    alertSuccess("取消成功！");
                                    $scope.order.status=4;
                                }else {
                                    hideLoading();
                                    alert(result.msg);
                                }
                            });
                        }
                    });
            }else{
                if(easybuy.isWechat){
                    $location.path("/wechatOauth/orderDetail-"+$routeParams.id);
                }else{
                    $location.path("/myProfile/orderDetail-"+$routeParams.id);
                }
            }
        }else{
            var arrButton = ["取消", "确定"];
            openDialog("确认取消当前订单？", "", arrButton, null,
                function (r) {
                    if (r) {
                        showLoading();
                        httpRequest.APIPOST('/order/cancel', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                            if(result.msg==="success"){
                                alertSuccess("取消成功！");
                                $scope.order.status=4;
                            }else {
                                hideLoading();
                                alert(result.msg);
                            }
                        });
                    }
                });
        }
    }

    $scope.takeOverOrder=function(id){
        if(!checkToken()){
            var tokenInfo=getToken();
            if(tokenInfo && tokenInfo.token){
                token=tokenInfo.token;
                showLoading();
                httpRequest.APIPOST('/order/confirm', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                    if(result.msg==="success"){
                        alertSuccess("收货成功！");
                        $scope.order.status=3;
                    }else {
                        hideLoading();
                        alert(result.msg);
                    }
                });
            }else{
                if(easybuy.isWechat){
                    $location.path("/wechatOauth/orderDetail-"+$routeParams.id);
                }else{
                    $location.path("/myProfile/orderDetail-"+$routeParams.id);
                }
            }
        }else{
            showLoading();
            httpRequest.APIPOST('/order/confirm', dataStringify("platform=all&token=" + token + "&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if(result.msg==="success"){
                    alertSuccess("收货成功！");
                    $scope.order.status=3;
                }else {
                    hideLoading();
                    alert(result.msg);
                }
            });
        }            
    }

    
    if (!$scope.orderId && getUserInfo()) {
        $scope.addressInfo = getUserInfo();
        $scope.mobile = $scope.addressInfo.mobile;
    }
    if ($scope.orderId) {        
        //var tokenInfo=getToken();
        //var token=$scope.token?$scope.token:tokenInfo.token;
        httpRequest.APIPOST('/order/detail', dataStringify("platform=all&category=1&orderId="+$scope.orderId), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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

    $scope.showLarge = function (imgUrl) {
        showLargeImage(imgUrl);
    }

    $scope.go = function () {
        $location.path("/products");
    }


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
    
    $scope.pay = function (orderNum,totalPrice,address,returnTime,id) {   
        httpRequest.APIPOST('/order/checkDate', dataStringify("platform=all&orderId="+id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                var arrButton = ["取消", "确定"];
                if(!address)
                    address=1;
                if(!returnTime)
                    returnTime=2;
                openDialog("确认从购物袋中删除所有选中的商品？", "支付方式", arrButton, 4,
                    function (r,pWay) {
                        if (r) {
                            if(pWay==easybuy.PaymentMethods.WechatPay){
                                window.location.href = serviceUrl + "/order/pay/orderid/" + orderNum+"/amount/"+totalPrice+"/address/"+address+"/time/"+returnTime;
                            }else{
                                if(easybuy.isWechat){
                                    var url=$location.absUrl().split('#')[0]+"#/dividedPay/"+orderNum+"/"+totalPrice;
                                    //$location.path("/dividedPay/"+orderNum+"/"+totalPrice);
                                    //$scope.$apply($location);
                                    //alert(url);
                                    window.location.href=url;
                                }else{
                                    window.location.href = paymentUrl+ "callback=1&out_trade_no=" + orderNum + "&total_fee=" + totalPrice;
                                } 
                            } 
                        }
                    });
            }else {
                alertWarning(result.msg);
            }
        });
    }
    function checkToken(){
        if((!token || (token && token.length<12))){            
            return false;
        }
        return true;
    }
    $scope.back=function(){
        var data=getToken();
        if(data  && data.token){
            $location.path("/orderList/"+data.token);
        }else{
            $location.path("/orderList");
        }
        
    }
});

app.controller('airportServiceController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
    var isInApp=isApp($location);
    $scope.price="10.00";
    $scope.promotePrice="0";

    $scope.isloading = true;
    httpRequest.APIPOST('/airportSave/info', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        $scope.isloading = false;
        if (result && result.code == statusCode.Success) {
            $scope.price=result.result.price;
            $scope.promotePrice=result.result.promotePrice;
            $scope.airportSaveInfo=result.result;
            $("#description").html(result.result.description);
            $("#contact").html(result.result.contact);
            $("#serviceScope").html(result.result.serviceScope);
            $("#express").html(result.result.courier);
        }
    });

    
    $scope.isInApp=isInApp?true:false;
    $scope.needService=function(){
        if(isInApp){
            window.location.href = easybuy.appActivity + "?action=2001&price="+$scope.price+"&promotePrice="+$scope.promotePrice;
            return;            
        }
        $location.path("/airportServiceOrder").search({price:$scope.price,promotePrice:$scope.promotePrice});
    }
    $scope.back=function(){
        $location.path("/products");
    };
    if(isInApp || 1==1){
        $scope.isCollapse=false;
        $scope.collapseComments=function(){
            $scope.isCollapse=$scope.isCollapse?false:true;
        };
        $scope.pageNum = 1;
        appendComments($scope.pageNum);

        /*var loadObj = new loadControl('#myLoadCanvas', function () {
            $(".pull-loading").html("加载中...");
            $scope.pageNum++;
            appendComments($scope.pageNum);
        });*/
        var clientH=$(window).height();
        var maxHeight=0;
        $(".tab-content .tab-pane").each(function(i,e){
            var t=$(e).height();
            if(t>maxHeight){
                maxHeight=t;
            }
        });
        $(".tab-content .tab-pane").css("overflow-y","auto");
        $(".tab-content .tab-pane").css("padding-bottom","50px");
        $(".tab-content .tab-pane").height(clientH-145);
        $scope.changeTab=function(type){

        }

        
        $(".scrollable-content").scroll(50,function (e) {

        });

        function appendComments(pageNum) {
            $scope.isloading = true;
            httpRequest.APIPOST('/airportSave/listComment', dataStringify("platform=all&objectId=1&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                $scope.isloading = false;
                if (result && result.code == statusCode.Success) {
                    $scope.commentInfo = result.result;
                    $scope.page = result.page;
                    if ($scope.commentInfo) {
                        $(".rateTotal").raty({ path: "image/raty", size: 15, score: $scope.commentInfo.commentScore, readOnly: true });
                    }
                    var comments = $scope.commentInfo.comments;
                    if (comments) {
                        var index = 0;
                        if ($scope.comments) {
                            index = $scope.comments.length;
                            $scope.comments = $scope.comments.concat(comments);
                        }
                        else {
                            $scope.comments = comments;
                        }
                        setTimeout(function () {
                            $scope.$apply($scope.comments);
                            $.each($(".product-item-comment:eq(" + index + ")").nextAll().andSelf(), function (i, item) {
                                $(item).find(".itemRate").raty({ path: "image/raty", size: 15, score: parseInt($(item).find(".itemRate").attr("score")), readOnly: true });
                                $(item).find(".itemRate").css("width","100%");
                            });
                        }, 0);
                    }
                }
                loadObj.clear();
                $(".pull-loading").html("上拉加载");
            });
        }
    }
});
app.controller('airportServiceOrderController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
    var user=$location.$$search;    
    var countDays=function(enddate){
        var now=new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        enddate.setHours(0);
        enddate.setMinutes(0);
        enddate.setSeconds(0);
        enddate.setMilliseconds(0);

        return enddate.diff(now);
    };
    var param=$location.search();
    
    if(!param ||(param && (!param.price|| !param.promotePrice))){
        httpRequest.APIPOST('/airportSave/info', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            $scope.isloading = false;
            if (result && result.code == statusCode.Success) {
                $scope.price=parseFloat(result.result.price)-parseFloat(result.result.promotePrice);
                $scope.promotePrice=parseFloat(result.result.promotePrice);
            }
        });
    }else{
        $scope.promotePrice=param.promotePrice;
        $scope.price=param.price-param.promotePrice;
    }
    
        

    if(user.openId && user.source!=4){
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
                setToken($scope.currentUser);
                if($scope.currentUser.mobile==null || !$scope.currentUser.mobile){
                    if($scope.currentUser.bind==undefined || ($scope.currentUser.bind && $scope.currentUser.bind==1)){                        
                            $location.path("/myPhone/0/"+$scope.currentUser.token).search({user:user,state:"airportServiceOrder"});
                    }                        
                }
                oauthCallback($scope.currentUser.token);
            }else{
                alert(result.msg);
            }
        });
    }else{
        $scope.currentUser=getToken();
        if($scope.currentUser && $scope.currentUser.token){
            if($scope.currentUser.mobile==null || !$scope.currentUser.mobile){
                if($scope.currentUser.bind==undefined || ($scope.currentUser.bind && $scope.currentUser.bind==1))
                    $location.path("/myPhone/0/"+$scope.currentUser.token).search({user:$scope.currentUser,state:"airportServiceOrder"});
            }
            oauthCallback($scope.currentUser.token);
        }else{
            if(easybuy.isWechat){
                $location.path("/wechatOauth/airportServiceOrder");
            }else{
                $location.path("/myProfile/airportServiceOrder");
            }            
        }
    }    

    function oauthCallback(token){
        showLoading();
        httpRequest.APIPOST('/address/default', dataStringify("platform=all&token="+token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                $scope.addressInfo=result.result;
                var addressInfo={};

                var addressInfo2 = getAddressTemp();
                if (addressInfo2 == null) {
                    addressInfo2 = getUserInfoService();        
                }
                addressInfo=$scope.addressInfo;
                if(addressInfo2){
                    if(addressInfo2.shopName){
                        addressInfo.shopName=addressInfo2.shopName;
                    }
                    if(addressInfo2.shopPhone){
                        addressInfo.shopPhone=addressInfo2.shopPhone;
                    }
                }
                    
                $scope.days=0;
                

                var startdate = new Date();
                startdate.setHours(startdate.getHours() + 48);
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
                        $scope.saveTemp();
                        $scope.time=$("#appDateTime").val();
                        //$scope.search();
                        event.stopPropagation();
                    }
                };
                var optDateTime = $.extend(opt['datetime'], opt['Default']);
                var optTime = $.extend(opt['time'], opt['Default']);
                $("#appDateTime").mobiscroll(optDateTime).date(optDateTime);

                if (addressInfo) {
                    fillAddressInputs(addressInfo);
                    setAddressTemp(generateAddressTemp($scope, "#appDateTime","#agentRegion"));
                }





            }else {
                alertWarning(result.msg);
            }
        });
        
    }

    $scope.date = function () {
        $('#appDateTime').mobiscroll('show');
    }


    $scope.validNum = function () {
        $scope.mobile = validInteger($scope.mobile);
    }

    $scope.search = function () {
       // $scope.saveTemp();
        var flightNo=$scope.returnFlightno;
        if(flightNo==undefined)
            flightNo="";
        if(flightNo.length>=2 && $scope.time){
            var data="platform=all&backFlightno="+$scope.returnFlightno+"&backDate="+$scope.time;
            httpRequest.APIPOST('/flight/back', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.returnAirportId=result.result.returnAirportId;
                    $scope.returnAirport=result.result.returnAirport;
                    $scope.returnTime=result.result.returnTime;
                    if(!$scope.time){
                        $scope.time="";
                    }
                    $("#appDateTime").val($scope.time.split(' ')[0]+" "+result.result.returnTime);
                    $scope.time=$scope.time.split(' ')[0]+" "+result.result.returnTime;
                    $scope.saveTemp();
                }else{
                    $scope.returnAirportId=-1;
                    $scope.returnAirport="";
                    alertWarning(result.msg);
                }
            });
        }
    }
    

    function fillAddressInputs(addressInfo,type) {
        if (addressInfo) {                
            if (addressInfo.nick_name) {
                $scope.name = addressInfo.nick_name;
            }
            
            if (addressInfo.take_off_time) {
                $scope.time = addressInfo.take_off_time;
                $("#appDateTime").val(addressInfo.take_off_time);

                var enddate =new Date(addressInfo.take_off_time.replace(/-/g, "/"));

                $scope.days=countDays(enddate);
                $scope.days=$scope.days<0?0:$scope.days;
                $scope.$apply($scope.days);

                $scope.returnDate=addressInfo.take_off_time.split(' ')[0];
                $scope.returnTime=addressInfo.take_off_time.split(' ')[1];
            }

            if (addressInfo.returnTime) {
                $scope.time = addressInfo.returnDate+" "+addressInfo.returnTime;
                $("#appDateTime").val($scope.time);

                var enddate =new Date($scope.time.replace(/-/g, "/"));

                $scope.days=countDays(enddate);
                $scope.days=$scope.days<0?0:$scope.days;
                $scope.$apply($scope.days);

                $scope.returnDate=addressInfo.returnDate;
                $scope.returnTime=addressInfo.returnTime;
            }

            if (addressInfo.contact) {
                $scope.name = addressInfo.contact;
            }
            if (addressInfo.mobile) {
                $scope.mobile = addressInfo.mobile;
            }
            if (addressInfo.agentComment) {
                $scope.agentComment = addressInfo.agentComment;
            }
            if (addressInfo.returnAirportId) {
                $scope.returnAirportId = addressInfo.returnAirportId;
                $scope.returnAirport = addressInfo.returnAirport;
            } 
            if (addressInfo.returnFlightno) {
                $scope.returnFlightno = addressInfo.returnFlightno;
            } 
            if (addressInfo.shopName) {
                $scope.shopName = addressInfo.shopName;
            }
            if (addressInfo.shopPhone) {
                $scope.shopPhone = addressInfo.shopPhone;
            }               
        }
    }

    $scope.saveTemp = function () {
        setAddressTemp(generateAddressTemp($scope, "#appDateTime", "#agentRegion"));
        var enddate=new Date($("#appDateTime").val().replace(/-/g, "/"));
        $scope.days=countDays(enddate);
        $scope.days=!$scope.days?0:$scope.days;
        $scope.$apply($scope.days);
    }
    
    $scope.getFlightTime=function(callback){
       var flightNo=$scope.returnFlightno;
        if(flightNo==undefined)
            flightNo="";
        if(flightNo.length>=2 && $scope.time){
            var data="platform=all&backFlightno="+$scope.returnFlightno+"&backDate="+$scope.time;
            httpRequest.APIPOST('/flight/back', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.returnAirportId=result.result.returnAirportId;
                    $scope.returnAirport=result.result.returnAirport;
                    $scope.returnTime=result.result.returnTime;
                    if(!$scope.time){
                        $scope.time="";
                    }
                    $("#appDateTime").val($scope.time.split(' ')[0]+" "+result.result.returnTime);
                    $scope.time=$scope.time.split(' ')[0]+" "+result.result.returnTime;
                    $scope.saveTemp();
                    callback();
                }else{
                    $scope.returnAirportId=-1;
                    $scope.returnAirport="";
                    alertWarning(result.msg);
                }
            });
        }
    };

    $scope.confirmOrder=function(){
        if (!$scope.name || $scope.name.toString().trim() == '') {
            alertWarning("请填写联系人姓名");
            return;
        }
        if ($scope.name.toString().length < 2 || $scope.name.toString().length > 20) {
            alertWarning("请输入2~20位的联系人姓名");
            return;
        }

        if (!$scope.mobile || $scope.mobile == '') {
            alertWarning("请填写手机号码");
            return;
        }
        if ($scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }

        var flightTime = $("#appDateTime").val();
        if (!flightTime || flightTime == '') {
            alertWarning("请选择回程起飞时间");
            return;
        }
        if (new Date(flightTime.replace(/-/g, "/")) < $scope.minDateTime) {
            alertWarning("回程起飞时间请选择48小时后");
            return;
        }

        //if (!$scope.flight || $scope.flight == '') {
        //    alertWarning("请选择回程乘机机场");
        //    return;
        //}

        if (!$scope.returnFlightno || $scope.returnFlightno == '') {
            alertWarning("请输入回程航班号");
            return;
        }

        if (!$scope.shopName || $scope.shopName == '') {
            alertWarning("请输入商家名称");
            return;
        }

        if (!$scope.shopPhone || $scope.shopPhone == '') {
            alertWarning("请输入商家联系电话");
            return;
        }

        if($scope.agentComment==undefined){
            $scope.agentComment="";
        }else{
            if($scope.agentComment.length>100){
                alertWarning("请输入100位以内的备注");
                return;
            }
        }


        $scope.getFlightTime(function(d){

            if(!$scope.returnAirportId){
                alertWarning("请输入正确的航班号和选择合理的回程日期");
                return;
            }
            var name="";
            var flightId=1;
            var mobile="";
            var agentAddress="";
            var time="";
            var returnFlightno="";

            name=$scope.name;
            mobile=$scope.mobile;
            flightId=$scope.returnAirportId;
            returnFlightno=$scope.returnFlightno;

            $scope.isNextStep=true;

            setUserInfoService({"returnAirport":$scope.returnAirport,"returnAirportId":flightId,"returnFlightno":returnFlightno,"shopName":$scope.shopName,"shopPhone":$scope.shopPhone,"nick_name": name, "mobile": mobile, "flight_id": flightId, "terminal": $scope.returnAirport, "take_off_time": $scope.time, "agentComment":$scope.agentComment });
            clearAddressTemp();

            $scope.returnDate=flightTime.split(' ')[0];
            $scope.returnTime=flightTime.split(' ').length>1?flightTime.split(' ')[1]:'';

            var comments=$scope.agentComment?"&comments="+$scope.agentComment:"";
            //$location.path("/airportServiceOrder").search({step:2});

        });

        
    }
    
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
        //alert(angular.toJson($scope.Payments));
    }    

    $scope.needService=function(){
        if (!$scope.name || $scope.name.toString().trim() == '') {
            alertWarning("请填写联系人姓名");
            return;
        }
        if ($scope.name.toString().length < 2 || $scope.name.toString().length > 20) {
            alertWarning("请输入2~20位的联系人姓名");
            return;
        }

        if (!$scope.mobile || $scope.mobile == '') {
            alertWarning("请填写手机号码");
            return;
        }
        if ($scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }

        var flightTime = $("#appDateTime").val();
        if (!flightTime || flightTime == '') {
            alertWarning("请选择回程起飞时间");
            return;
        }
        if (new Date(flightTime.replace(/-/g, "/")) < $scope.minDateTime) {
            alertWarning("回程起飞时间请选择48小时后");
            return;
        }

        //if (!$scope.flight || $scope.flight == '') {
        //    alertWarning("请选择回程乘机机场");
        //    return;
        //}

        if (!$scope.returnFlightno || $scope.returnFlightno == '') {
            alertWarning("请输入回程航班号");
            return;
        }

        if (!$scope.shopName || $scope.shopName == '') {
            alertWarning("请输入商家名称");
            return;
        }

        if (!$scope.shopPhone || $scope.shopPhone == '') {
            alertWarning("请输入商家联系电话");
            return;
        }

        if($scope.agentComment==undefined){
            $scope.agentComment="";
        }else{
            if($scope.agentComment.length>100){
                alertWarning("请输入100位以内的备注");
                return;
            }
        }

        if(!$scope.returnAirportId){
            alertWarning("请输入正确的航班号和选择合理的回程日期");
            return;
        }
        var name="";
        var flightId=1;
        var mobile="";
        var agentAddress="";
        var time="";
        var returnFlightno="";

        name=$scope.name;
        mobile=$scope.mobile;
        flightId=$scope.returnAirportId;
        returnFlightno=$scope.returnFlightno;
        
        $scope.isNextStep=true;

        setUserInfoService({"returnAirport":$scope.returnAirport,"returnAirportId":flightId,"returnFlightno":returnFlightno,"shopName":$scope.shopName,"shopPhone":$scope.shopPhone,"nick_name": name, "mobile": mobile, "flight_id": flightId, "terminal": $scope.returnAirport, "take_off_time": $scope.time, "agentComment":$scope.agentComment });
        clearAddressTemp();
        
        $scope.returnDate=flightTime.split(' ')[0];
        $scope.returnTime=flightTime.split(' ').length>1?flightTime.split(' ')[1]:'';
        
        var payWay = null;
        $.each($scope.Payments, function (i, item) {
            if (item.checked == true) {
                payWay = item.id;
                return false;
            }
        });
        if (payWay == null) {
            alertWarning("请选择支付方式");
            return;
        }
        if (payWay == easybuy.PaymentMethods.AlipayWallet) {
            alertWarning("无法使用支付宝钱包");
            return;
        }


        var comments=$scope.agentComment?"&comments="+$scope.agentComment:"";
        var data="platform=all&token="+$scope.currentUser.token+"&days="+$scope.days
             +"&contact="+name+"&mobile="+mobile
             +"&returnTime="+flightTime+"&returnAirportId="+flightId
             +"&returnFlightno="+returnFlightno
             +"&shopName="+$scope.shopName+"&shopPhone="+$scope.shopPhone
             +"&source=2"+comments;
        httpRequest.APIPOST('/order/addAirportSaveOrder', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 showLoading();
                 //alert(payWay);
                if(payWay==easybuy.PaymentMethods.WechatPay){
                        window.location.href = serviceUrl + "/order/pay/orderid/" + result.result.orderNum+"/amount/"+result.result.totalPrice+"/address/address/time/returnTime";
                    }else{
                        if(easybuy.isWechat){
                            window.location.hash="#/dividedPay/"+result.result.orderNum+"/"+result.result.totalPrice;
                        }else{
                            window.location.href = paymentUrl+ "callback=1&out_trade_no=" + result.result.orderNum + "&total_fee=" + result.result.totalPrice;
                        }
                    }
                 //$location.path("/success/"+result.result.orderId+"/"+$scope.currentUser.token);
            }else{
                alert(result.msg);
            }
        });
    }

    $scope.back=function(){
        if($scope.isNextStep){
            $scope.isNextStep=false;
        }else{
            $location.path("/airportService");
        }
        
    };

});
