app.controller('cartController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.products=[];
    $scope.empty=false;
    var cartProducts = getCart();
    $scope.totalAmountValue=0;
    if (cartProducts && cartProducts.length>0) {
        var length=cartProducts.length;
        var goodsId="";
        var quantity="";
        var checkeds="";
        for(var i=0;i<length;i++){
            var chk=cartProducts[i].checked?'1':'0';
            if(i<length-1){               
               goodsId=goodsId+cartProducts[i].id+",";
               quantity=quantity+cartProducts[i].num+","; 
               checkeds=checkeds+chk+",";
            }else{
               goodsId=goodsId+cartProducts[i].id;
               quantity=quantity+cartProducts[i].num;  
               checkeds=checkeds+chk;
            }
            
        }
        httpRequest.APIPOST('/cart/group', dataStringify("platform=all&goodsId=" + goodsId + "&quantity=" + quantity+"&checked="+checkeds), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                $scope.products=result.result.tw.concat(result.result.ch);
                var tempCartProducts=[];
                if ($scope.products) {
                    for (var i = 0; i < $scope.products.length; i++) {
                        for(var j=0;j<$scope.products[i].goodsList.length;j++){
                            $scope.products[i].goodsList[j].checked=$scope.products[i].goodsList[j].checked?true:false;
                            tempCartProducts.push({
                                id:$scope.products[i].goodsList[j].id,
                                num:$scope.products[i].goodsList[j].quantity,
                                checked:$scope.products[i].goodsList[j].checked
                            });
                        }                        
                    }
                }
                if(tempCartProducts.length==0){
                    setCart(null);
                }else{
                    setCart(tempCartProducts);
                }
                if($scope.products){
                    $scope.empty = false;                    
                }else{
                    $scope.empty = true;
                }
                if($scope.products && $scope.products.length>0){
                    $scope.isAllChecked();
                    $scope.totalAmount();
                }
            }else{
                alertWarning(result.msg);
            }
        });        
       
    }
    else {
        $scope.empty = true;
    }

    if (getMobileType() == MobileTypes.iPhone || getMobileType() == MobileTypes.iPad) {
        window.onresize = function () {
            refixNavBottom();
        }
        window.onresize();
    }

    $scope.reduceNum = function (product,p,parentIndex,index) {
        if (product.quantity > 1) {
            product.quantity--;
            product.checked=true;
            setProductsNumInCart($scope.products);            
            $scope.totalAmount(parentIndex,index);
        }
    }

    $scope.addNum = function (product,p,parentIndex,index) {
        product.quantity++;
        product.checked=true;
        setProductsNumInCart($scope.products);
        $scope.totalAmount(parentIndex,index);
    }

    $scope.validNum = function (product, allowEmpty, parentIndex, index) {
        product.quantity = validInteger(product.quantity);
        if (!allowEmpty || product.quantity != '') {
            var num = parseInt(product.quantity);
            if (isNaN(num) || num < 1) {
                product.quantity = 1;
            }
            else {
                product.quantity = num;
            }
            product.checked=true;
            setProductsNumInCart($scope.products);            
            $scope.totalAmount(parentIndex,index);
        }
    }

    $scope.checked = function (product,parentIndex,index) {
        if (product.checked) {
            product.checked = false;
        }
        else {
            product.checked = true;
        }
        setProductsNumInCart($scope.products);
        $scope.totalAmount(parentIndex,index);
    }

    $scope.totalNum = function () {
        var totalNum = 0;
        if ($scope.products) {
            for (var i = 0; i < $scope.products.length; i++) {
               for(var j=0; j< $scope.products[i].goodsList.length; j++){ 
                    if ($scope.products[i].goodsList[j].checked) {
                        totalNum += $scope.products[i].goodsList[j].quantity;
                    }
               }
            }
        }
        return totalNum;
    }

    $scope.isAllChecked = function () {
        if ($scope.products == null || $scope.products.length == 0) {
            return false;
        }

        for (var i = 0; i < $scope.products.length; i++) {
            for(var j=0; j< $scope.products[i].goodsList.length; j++){
                if ($scope.products[i].goodsList[j].checked == null || !$scope.products[i].goodsList[j].checked) {
                    return false;
                }
            }
        }
        return true;
    }

    $scope.checkAll = function () {
        if ($scope.products && $scope.products.length > 0) {  
            var isAllChecked = $scope.isAllChecked();          
            for (var i = 0; i < $scope.products.length; i++) {
                for(var j=0; j< $scope.products[i].goodsList.length; j++){
                    $scope.products[i].goodsList[j].checked = !isAllChecked;
                }                
            }
            setProductsNumInCart($scope.products);
            $scope.getLocalCart();
        }        
    }

    $scope.go = function () {        
        if ($scope.totalNum() == 0) {
            alertWarning("您还没有选择商品哦");
            return;
        }
        
        var user=$location.$$search;
        var currentUser=getToken();
        if((user && user.openId) || (currentUser && currentUser.token)){
            if(!currentUser || (currentUser && !currentUser.token)){
                var source=user.source;//用户来源，1：微信， 2：QQ， 3：微博
                var data="platform=all&openid="+user.openId+"&nickname="+user.nickname
                         +"&gender=0&avatar="+user.headimgurl+"&source="+source+"&channel=H5"
                         +"&appVersion="+easybuy.version;
                httpRequest.APIPOST('/user/thirdLogin', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                    if (result && result.code == statusCode.Success) {
                        $scope.user=result.result;
                        $scope.user.openId=user.openId;
                        $scope.user.source=user.source;
                        $scope.user.nickname=user.nickname;
                        $scope.user.headimgurl=user.headimgurl;
                        if($scope.user.mobile==null){
                            $scope.user.mobile="0";
                        }
                        setToken($scope.user);                        
                        var urlUser=$scope.user;
                        var goodsArr = new Array();
                        $.each(currentProducts, function (i, product) {
                            for(var j=0;j<product.goodsList.length;j++){
                                if (product.goodsList[j].checked) {
                                    var goods = new Object();
                                    goods.id = product.goodsList[j].id;
                                    goods.num = product.goodsList[j].quantity;
                                    goodsArr.push(goods);
                                }
                            }                
                        });      
                        $location.path("/pay/999/1").search({area:1,goods:JSON.stringify($scope.products),user:JSON.stringify(urlUser)});
                        $scope.$apply($location);
                    }else{
                        alert(result.msg);
                    }
                });
            }else{
                var urlUser={};
                if(currentUser && currentUser.token){
                    urlUser=currentUser;
                }else{
                    urlUser=user;
                }
                var goodsArr = new Array();
                $.each($scope.products, function (i, product) {
                    for(var j=0;j<product.goodsList.length;j++){
                        if (product.goodsList[j].checked) {
                            var goods = new Object();
                            goods.id = product.goodsList[j].id;
                            goods.num = product.goodsList[j].quantity;
                            goodsArr.push(goods);
                        }
                    }                
                });      
                $location.path("/pay/999/1").search({area:1,goods:JSON.stringify($scope.products),user:JSON.stringify(urlUser)});
            }
        }else{
            if(easybuy.isWechat){
                $location.path("/wechatOauth/cart");
            }else{
                $location.path("/myProfile/cart");
            }
        }

        
    }

    $scope.edit = function () {
        $scope.editMode = true;
    }

    $scope.done = function () {
        $scope.editMode = false;
        $scope.totalAmount();        
    }

    $scope.remove = function () {
        if ($scope.totalNum() == 0) {
            alertWarning("请选中您要删除的商品");
            return;
        }
        var arrButton = ["取消", "确定"];
        openDialog("确认从购物袋中删除所有选中的商品？", "删除商品", arrButton, null,
                function (r) {
                    if (r) {
                        if ($scope.products) {
                            for (var i = $scope.products.length - 1; i >= 0; i--) {
                               for(var j=$scope.products[i].goodsList.length-1;j>=0;j--){ 
                                    if ($scope.products[i].goodsList[j].checked) {
                                        $scope.products[i].goodsList.splice(j, 1);
                                    }
                               }
                            }
                            $scope.$apply($scope.products);
                            var cartProductsTemp=[];
                            for (var i = 0; i < $scope.products.length; i++) {
                                for(var j=0; j< $scope.products[i].goodsList.length; j++){
                                    var cartProductTemp={};
                                    cartProductTemp.id=$scope.products[i].goodsList[j].id;
                                    cartProductTemp.num=$scope.products[i].goodsList[j].quantity;
                                    cartProductTemp.checked=$scope.products[i].goodsList[j].checked;
                                    cartProductsTemp.push(cartProductTemp);
                                }
                            }                            
                        }

                        if ($scope.products) {
                            for (var i = 0; i < $scope.products.length; i++) {
                                for(var j=0; j< $scope.products[i].goodsList.length; j++){
                                    var cartProductTemp={};
                                    cartProductTemp.id=$scope.products[i].goodsList[j].id;
                                    cartProductTemp.num=$scope.products[i].goodsList[j].quantity;
                                    cartProductTemp.checked=$scope.products[i].goodsList[j].checked;
                                    cartProductsTemp.push(cartProductTemp);
                                }
                            }
                        }

                        setCart(cartProductsTemp);
                        if (cartProductsTemp.length == 0) {
                            $scope.$apply($scope.empty = true);
                        }
                        $scope.$apply($scope.products);
                    }
                });
    }   
    
    $scope.totalAmount=function(parentIndex,index){
        $scope.totalAmountValue=0;
        var cartProducts = $scope.products;
        if (cartProducts && cartProducts.length>0) {
            var length=cartProducts.length;
            var goodsId="";
            var quantity="";
            for(var i=0;i<length;i++){               
                $scope.totalAmountValue=$scope.totalAmountValue+parseFloat(cartProducts[i].total);              

            }

            var isXJZero=true;
            if(parentIndex!=undefined){
                for(var i=0;i<cartProducts[parentIndex].goodsList.length;i++){
                    if(cartProducts[parentIndex].goodsList[i].checked){
                        isXJZero=false;
                        if(i<cartProducts[parentIndex].goodsList.length-1){
                           goodsId=goodsId+cartProducts[parentIndex].goodsList[i].id+",";
                           quantity=quantity+cartProducts[parentIndex].goodsList[i].quantity+","; 
                        }else{
                           goodsId=goodsId+cartProducts[parentIndex].goodsList[i].id;
                           quantity=quantity+cartProducts[parentIndex].goodsList[i].quantity;  
                        }
                    }
                }
            }
            if(!goodsId || goodsId.length<1){
                if(parentIndex!=undefined){
                    $scope.products[parentIndex].js="0.00";
                    $scope.products[parentIndex].total="0.00";
                }                
                return;
            }
            httpRequest.APIPOST('/cart/price', dataStringify("platform=all&goodsId=" + goodsId + "&quantity=" + quantity), { "content-type": "application/x-www-form-urlencoded" },true).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.totalAmountValue=0;
                    if(isXJZero){
                            $scope.products[parentIndex].js="0.00";
                            $scope.products[parentIndex].total="0.00";
                        }else{
                            $scope.products[parentIndex].js=result.result.js;
                            $scope.products[parentIndex].total=result.result.xj;
                        }
                        for(var i=0;i<length;i++){
                            //for(var j=0;j<cartProducts[i].goodsList.length;j++){
                            //    if(cartProducts[i].goodsList[j].checked){
                            //        $scope.totalAmountValue=$scope.totalAmountValue+parseFloat(cartProducts[i].total);
                            //    }
                            //} 
                            $scope.totalAmountValue=$scope.totalAmountValue+parseFloat(cartProducts[i].total);              

                        }

                }else{
                    alert(result.msg);
                }
            });
        }
    }
    $scope.getLocalCart=function(){
        var products = $scope.products;
        var cartProducts=[];
        $scope.totalAmountValue=0;
        if (products && products.length>0) {
            for(var i=0;i<products.length;i++){
                for(var j=0;j<products[i].goodsList.length;j++){
                    cartProducts.push(products[i].goodsList[j]);
                }
            }
            var length=cartProducts.length;
            var goodsId="";
            var quantity="";
            var checkeds="";
            for(var i=0;i<length;i++){
                var chk=cartProducts[i].checked?'1':'0';
                if(i<length-1){                   
                   goodsId=goodsId+cartProducts[i].id+",";
                   quantity=quantity+cartProducts[i].quantity+","; 
                   checkeds=checkeds+chk+",";
                }else{
                   goodsId=goodsId+cartProducts[i].id;
                   quantity=quantity+cartProducts[i].quantity;  
                   checkeds=checkeds+chk;
                }

            }
            httpRequest.APIPOST('/cart/local', dataStringify("platform=all&goodsId=" + goodsId + "&quantity=" + quantity+"&checked="+checkeds), { "content-type": "application/x-www-form-urlencoded" },true).then(function (result) {
                if (result && result.code == statusCode.Success) {                    
                    
                    $scope.products=result.result;               
                    if ($scope.products) {
                        for (var i = 0; i < $scope.products.length; i++) {
                            for(var j=0;j<$scope.products[i].goodsList.length;j++){
                                $scope.products[i].goodsList[j].checked=$scope.products[i].goodsList[j].checked?true:false;
                            }
                        }
                        $scope.isAllChecked();
                        $scope.totalAmount();
                    }else{
                        $scope.empty = true;
                    }
                }else{
                    alert(result.msg);
                }
            });        

        }
        else {
            $scope.empty = true;
        }
    }
});