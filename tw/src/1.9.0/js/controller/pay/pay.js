app.controller('paymentAppController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.isInCoupons=false;
    $scope.id = $routeParams.id;
    $scope.area=parseInt($location.$$search.area) || 1;
    $scope.user=$.parseJSON($location.$$search.user);
    var from=parseInt($routeParams.from) || 0;
    $scope.products = $.parseJSON($location.$$search.goods);//getOrder();
    $scope.totalAmount=0;
    $scope.totalJs=0;
    $scope.payAmount=0;
    var couponsIds=[];
    var couponsNums=[];
    clearAddressTemp();
    $scope.addressURL=$scope.area==2?"#/address/"+$scope.id+"/2?token="+$scope.user.token:"#/address/"+$scope.id+"?token="+$scope.user.token;
    var isPaying=false;
    var goods=[];
    if(from==1){//购物袋
        if($scope.products && $scope.products.length>0){
            for (var i = 0; i < $scope.products.length; i++) {
                for(var j=0;j<$scope.products[i].goodsList.length;j++){
                    if($scope.products[i].goodsList[j].checked){
                        var good=$scope.products[i].goodsList[j];
                        goods.push(good);
                    }                    
                }
            }        
        }
    }else if(from==2){//付款失败
        if($scope.products && $scope.products.length>0){
            for (var i = 0; i < $scope.products.length; i++) {
                var good=$scope.products[i];
                good.price=good.promotePrice;
                good.id=good.goodsId;
                good.price=good.buyPrice;
                goods.push(good);
            }        
        }
    }else{
        if($scope.products && $scope.products.length>0){
            for (var i = 0; i < $scope.products.length; i++) {
                var good=$scope.products[i];
                good.quantity=good.num;
                good.img=good.smallImg;
                good.price=good.promotePrice;
                goods.push(good);
            }        
        }
    }
    var goodsIdStr="";
    var quantityStr="";
    for(var i=0;i<goods.length;i++){
        if(i<goods.length-1){
            goodsIdStr=goodsIdStr+goods[i].id+",";
            quantityStr=quantityStr+goods[i].quantity+",";
        }else{
            goodsIdStr=goodsIdStr+goods[i].id;
            quantityStr=quantityStr+goods[i].quantity+",";
        }
    }
    $scope.products=goods;
    if($scope.user && $scope.user.token){
        httpRequest.APIPOST('/address/default', dataStringify("platform=all&token="+$scope.user.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if(result.msg==="success"){
                $scope.addressInfo=result.result;
            }else {
                alertWarning(result.msg);
            }
        });
    }
    if (getUserInfo()) { 
        var userInfo = getUserInfo();
        $scope.comments=userInfo.comments;        
    }
    var provinceId="";
    if($scope.area==2 && ($scope.addressInfo && $scope.addressInfo.agentRegionIds)){
        provinceId="&provinceId="+$scope.addressInfo.agentRegionIds.split(',')[0];
    }
    //alert(goodsIdStr+"||"+quantityStr+"||"+provinceId);
    var token="";
    if(easybuy.isWechat){
        var tokenInfo=getToken();
        token="&token="+tokenInfo.token;
    }
    httpRequest.APIPOST('/order/price', dataStringify("platform=all&category=1&goodsId=" + goodsIdStr + "&quantity=" + quantityStr+provinceId+token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.totalAmount=result.result;
            $scope.totalJs=$scope.totalAmount.js
            $scope.payAmount=$scope.totalAmount.total;
        }else{
            alert(result.msg);
        }
    });
    
    if (getMobileType() == MobileTypes.iPhone || getMobileType() == MobileTypes.iPad) {
        window.onresize = function () {
            refixNavBottom();
        }
        window.onresize();
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
    }

    $scope.pay = function () {
        if(isPaying){
            return;
        }
        if (!$scope.addressInfo) {
            alertWarning("请填写联系人信息");
            return;
        }
        if($scope.comments && $scope.comments.length>100){
            alertWarning("请输入100位以内的备注");
            return;
        }
        if ($scope.area==1 && new Date($scope.addressInfo.returnDate+" "+$scope.addressInfo.returnTime) < new Date()) {
            alertWarning("起飞时间已过，请重新填写");
            return;
        }
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
        //alert(payWay)
        var goodsId="";
        var quantity="";
        $.each($scope.products, function (i, product) {                        
            goodsId= (i==($scope.products.length-1))?goodsId+product.id:goodsId+product.id+",";
            quantity=(i==($scope.products.length-1))?quantity+product.quantity:quantity+product.quantity+",";
        });
        //支付        
        var contact=$scope.addressInfo.contact;
        var mobile=$scope.addressInfo.mobile;
        var returnTime="&returnTime="+$scope.addressInfo.returnDate+" "+$scope.addressInfo.returnTime;
        if($scope.addressInfo.returnTime==undefined){
            returnTime="";
        }
        var returnAirportId=parseInt($scope.addressInfo.returnAirportId);
        var returnFlightno=$scope.addressInfo.returnFlightno;
        var address="";
        if($scope.area==1){
            address=$scope.addressInfo.returnAirport;
        }else{
            address=$scope.addressInfo.detailAddress;
        }
        
        var comment=$scope.comments?"&comments="+$scope.comments:"&comments=''";

        if(!$scope.user || ($scope.user && !$scope.user.token)){
            $scope.user=getToken();
        }
        if($scope.user && $scope.user.token){
            var token=$scope.user.token;
            var couponsIdsStr="";
            var couponsNumsStr="";
            if(couponsIds.length>0 && couponsNums.length>0){
                couponsIdsStr="&couponsId="+couponsIds.join(',');
                couponsNumsStr="&couponsNum="+couponsNums.join(',');
            }
            var url="platform=all&token="+ token 
                    + "&contact="+contact
                    +"&mobile="+mobile+returnTime
                    +"&returnAirportId="+returnAirportId
                    +"&returnFlightno="+returnFlightno
                    +comment+"&goodsId="+goodsId
                    +"&quantity="+quantity+couponsIdsStr+couponsNumsStr;
            isPaying=true;
            $("#btnPay").text("下单中...");
            httpRequest.APIPOST('/order/addGoodsOrder', dataStringify(url), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if(result.msg==="success"){
                    if(from==1){
                        var cartProducts = getCart();
                        var tempCart=[];
                        for(var i=0;i<cartProducts.length;i++){
                            var isHav=false;
                            for(var j=0;j<$scope.products.length;j++){
                                if(cartProducts[i].id==$scope.products[j].id){
                                    isHav=true;
                                }
                            }
                            if(!isHav){
                                tempCart.push(cartProducts[i]);
                            }
                        }
                        setCart(tempCart);
                    }
                    setUserInfo(null);
                    $("#btnPay").text("正跳转...");
                    if(payWay==easybuy.PaymentMethods.WechatPay){
                        window.location.href = serviceUrl + "/order/pay/orderid/" + result.result.orderNum+"/amount/"+result.result.totalPrice+"/address/"+address+"/time/"+returnTime;
                    }else{
                        if(easybuy.isWechat){
                            var t=getToken() || {};
                            t.isReload=0;
                            setToken(t);
                            window.location.hash="#/dividedPay/"+result.result.orderNum+"/"+result.result.totalPrice;
                            //$location.path("/dividedPay/"+result.result.orderNum+"/"+result.result.totalPrice);
                        }else{
                            window.location.href = paymentUrl+ "callback=1&out_trade_no=" + result.result.orderNum + "&total_fee=" + result.result.totalPrice;
                        }                        
                    }
                }else {
                    alertWarning(result.msg);
                }
            });
        }else{            
            $location.path("/myProfile");
        }
        //支付 **//
    }
    $scope.saveUserInfo=function(){
        var info={};
        info=$scope.addressInfo;
        info.comments=$scope.comments;
        setUserInfo(info);
    }
    
    $scope.choseCoupon=function(){
        var tokenInfo=getToken();
        var tk="";
        if($scope.user && $scope.user.token){
            tk=$scope.user.token;
        }else{
            if(tokenInfo && tokenInfo.token){
                tk=tokenInfo.token;
            }
        }
        if(!$scope.coupons){
            var data="platform=all&token="+tk+"&goodsId=" + goodsIdStr + "&quantity=" + quantityStr;
            showLoading();
            httpRequest.APIPOST('/order/coupons', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                     hideLoading();
                     $scope.coupons=result.result;
                }else{
                    hideLoading();
                    alertWarning(result.msg);
                }
            });
        }
        $scope.isInCoupons=true;
    };
    $scope.back=function(){
        if($scope.isInCoupons){
            $scope.isInCoupons=false;
            for(var i=0;i<$scope.coupons.canUseList.length;i++){
                var isShow=$scope.coupons.canUseList[i].checked;
                if(isShow){
                    $("#i_coupon_"+i).css("display","block");
                }else{
                    $("#i_coupon_"+i).css("display","none");
                }
            }
        }else{
            history.back();
        }
    };
    $scope.couponsNumOrigin=0;
    $scope.couponsJsOrigin=0;

    $scope.confirmCoupon=function(){
        var js=0;
        var num=0;
        couponsIds=[];
        couponsNums=[];
        for(var i=0;i<$scope.coupons.canUseList.length;i++){
            var isShow=($("#i_coupon_"+i).css("display")=='block');
            if(isShow){
                $scope.coupons.canUseList[i].checked=true;
                js=js+parseFloat($scope.coupons.canUseList[i].amount);
                num++;
                couponsIds.push($scope.coupons.canUseList[i].couponId);
                couponsNums.push(1);
            }else{
                $scope.coupons.canUseList[i].checked=false;
            }
        }        
        $scope.couponsNumOrigin=num;
        $scope.couponsJsOrigin=js;
        $scope.totalJs=$scope.totalAmount.js+js;
        $scope.payAmount=$scope.totalAmount.total-js;
        $scope.isInCoupons=false;
    };
    

    $scope.tapCoupon=function(amount,index,id){
        var isShow=($("#i_coupon_"+index).css("display")=='block');//$scope.coupons.canUseList[index].checked?true:false;
        if(isShow){
            $("#i_coupon_"+index).css("display","none");
            //$scope.coupons.canUseList[index].checked=false;
        }else{
            $("#i_coupon_"+index).css("display","block");
            //$scope.coupons.canUseList[index].checked=true;
        }
    };
});

app.controller('dividedPayController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.order={};
    $scope.order.orderNum=$routeParams.orderNum;
    $scope.order.fee=$routeParams.fee;
    $scope.pay=function(){
        window.location.href = paymentUrl+ "callback=2&out_trade_no=" + $scope.order.orderNum + "&total_fee=" + $scope.order.fee;        
    };
    $scope.isWechat=easybuy.isWechat;
    $scope.isReload=0;
    var t=getToken() || {};
    if(!t.isReload && $scope.isWechat){
        location.reload();
        t.isReload=1;
        setToken(t);
    }else{
        $scope.isReload=1;
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
        $location.path("/orderDetail/" + $routeParams.ordersn+"/"+$routeParams.token);
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
