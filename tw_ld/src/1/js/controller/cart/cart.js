app.controller('cartController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.products=[];
    $scope.empty=false;
    var cartProducts = [];
    $scope.totalAmountValue=0;
	
	$scope.back=function(){
		
		//$scope.synCart();
		history.back();
	};
	
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
	$scope.getCart=function(){
		httpRequest.APIPOST('/cart/list_v1.4', dataStringify("platform=all&token="+$rootScope.tokenInfo.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.products=result.result.normal;
				$scope.cartInfo=result.result;

				if($scope.products){
					if($scope.products.length<1){
						$scope.empty = true;
					}else{
						$scope.empty = false;
					}                 
				}else{
					$scope.empty = true;
				}
				/* if($scope.products && $scope.products.length>0){
					$scope.isAllChecked();
					$scope.totalAmount();
				} */
			}else{
				alertWarning(result.msg);
			}
		});
	}
	$scope.getCart();

    if (getMobileType() == MobileTypes.iPhone || getMobileType() == MobileTypes.iPad) {
        window.onresize = function () {
            refixNavBottom();
        }
        window.onresize();
    }

    $scope.reduceNum = function (index) {
        $scope.products[index].quantity--;        
		$scope.synCart
    }

    $scope.addNum = function (index) {
		$scope.products[index].quantity++;
        $scope.totalAmount();
    }

    $scope.validNum = function (index) {
        $scope.products[index].quantity=validInteger($scope.products[index].quantity)==""?0:parseInt(validInteger($scope.products[index].quantity));
		$scope.totalAmount();
    }

    $scope.checked = function (product,parentIndex,index) {
        if (product.checked) {
            product.checked = 0;
        }
        else {
            product.checked = 1;
        }
        $scope.updateStatus();
        $scope.totalAmount(parentIndex,index);
    }

    $scope.totalNum = function () {
        var totalNum = 0;
        if ($scope.products) {
            for (var i = 0; i < $scope.products.length; i++) {
               if ($scope.products[i].checked) {
					totalNum += parseInt($scope.products[i].quantity)?parseInt($scope.products[i].quantity):0;
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
            if ($scope.products[i].checked == null || !$scope.products[i].checked) {
				return false;
			}
        }
        return true;
    }

    $scope.checkAll = function () {
        if ($scope.products && $scope.products.length > 0) {  
            var isAllChecked = $scope.isAllChecked();          
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].checked = !isAllChecked;              
            }
        }
        $scope.updateStatus();
		$scope.totalAmount();
    }

    $scope.go = function () {        
        if ($scope.totalNum() == 0) {
            alertWarning("您还没有选择商品哦");
            return;
        }
		$scope.synCart();
		
		return;
        
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
                       
						var goodsIds=[];
						for(var i=0;i<$scope.products.length;i++){
							if($scope.products[i].checked)
								goodsIds.push($scope.products[i].id);
						}

						var data="platform=all&token=" + $rootScope.tokenInfo.token+"&goodsId="+goodsIds.join(',');
						httpRequest.APIPOST('/cart/delete', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
							if (result && result.code == statusCode.Success) {
								$scope.getCart();
							}
						});
						

                    }
                });
    }   
    
    $scope.totalAmount=function(parentIndex,index){
        $scope.totalAmountValue=0;
        var cartProducts = $scope.products;
		var goodsIds=[];
		var goodsQuantity=[];
		for(var i=0;i<$scope.products.length;i++){
		    if($scope.products[i].checked){
				goodsIds.push($scope.products[i].id);
				goodsQuantity.push($scope.products[i].quantity);
			}			
		}
		if(goodsIds.length==0){
			$scope.cartInfo.total=0.00;
			$scope.cartInfo.oldTotal=0.00;
			$scope.cartInfo.js=0.00;
			return;
		}
		
        httpRequest.APIPOST('/cart/price_v1.4', dataStringify("platform=all&token="+$rootScope.tokenInfo.token+"&goodsId=" + goodsIds.join(',') + "&quantity=" + goodsQuantity.join(',')), { "content-type": "application/x-www-form-urlencoded" },true).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.totalAmountValue=0;
				$scope.cartInfo=result.result;					
				
			}else{
				alert(result.msg);
			}
		});
    };
	
	$scope.synCart=function(){
		var goodsIds=[];
		var goodsQuantity=[];
		var checkeds=[];
		for(var i=0;i<$scope.products.length;i++){
			checkeds.push($scope.products[i].checked?1:0);
			goodsIds.push($scope.products[i].id);
		    goodsQuantity.push($scope.products[i].quantity);			
		}
		
		var data="platform=all&token=" + $rootScope.tokenInfo.token+"&goodsId="+goodsIds.join(',')+"&quantity="+goodsQuantity.join(',');//+"&checked="+checkeds.join(',');
		httpRequest.APIPOST('/cart/update', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
								
			}
		});
	};



	$scope.updateStatus=function(){
		var goodsIds=[];
		var checkeds=[];
		for(var i=0;i<$scope.products.length;i++){
			checkeds.push($scope.products[i].checked?1:0);
			goodsIds.push($scope.products[i].id);
		}
		
		var data="platform=all&token=" + $rootScope.tokenInfo.token+"&goodsId="+goodsIds.join(',')+"&checked="+checkeds.join(',');
		httpRequest.APIPOST('/cart/status', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
								
			}
		});
	};

});