app.controller('navbarController', function ($rootScope, $scope, analytics, $location, $window) {
    $scope.back = function () {
        history.back();
    }
});

app.controller('productListController', function ($rootScope,$templateCache, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {    
    var code=$routeParams.code || 0;
	$scope.isSearchPage=false;
	$scope.showSearch=function(){
		//$scope.isSearchPage=true;
		//$("#searchPage").addClass("current");
		$location.path("/productsSearch");
	};
	
	$scope.$on("CtrlSearchPanel", function (event, isSearchPage) {
		if(!isSearchPage){
			$("#searchPage").removeClass("current");
		}
        $scope.isSearchPage = isSearchPage;
		
    });
	
	
    $rootScope.categoryId=code;
    $scope.code=code;
    $scope.user=getToken();
    var loadObj = new loadControl('#myLoadCanvas', function () {
        $(".pull-loading").html("加载中...");
        $scope.pageNum++;
        appendGoods($scope.pageNum);
    });
    
    var getCategories = function(callback){
        var cat=$rootScope.categories; 
        if(cat && cat.length){
            
            $scope.categories=cat;
            $rootScope.initNav(cat);
            
        }else{
            httpRequest.APIPOST('/goods/category_v1.3', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    var cat=result.result;   
                    //cat.slice(1);
                    
                    $scope.categories=cat;
                    $rootScope.initNav(cat);
                                
                }else{ 
                    alertWarning(result.msg);
                }
            });
        }
    };

    var appendGoods = function(pageNum) {        
        var now=new Date().format("yyyy-mm-dd HH:MM:ss");
        $scope.isloading = true;
		var paramCategory=code?"&category="+code : "";
		var ldToken=$scope.user?"&token="+$scope.user.token : '';		
        httpRequest.APIPOST('/goods/listByCategoryLd', dataStringify("platform=all"+ldToken+paramCategory+"&pageNo="+pageNum+"&pageSize=20&now="+now), { "content-type": "application/x-www-form-urlencoded" },(pageNum==1?true:false)).then(function (result) {
            if (result && result.code == statusCode.Success) {
                if(pageNum>1){
                    $scope.products=$scope.products.concat(result.result);
                    $scope.pageCount = result.page.totalPage;
                    $scope.pageNum = pageNum;
                }else{
                    $scope.products=result.result;
                    $scope.pageCount = result.page.totalPage;
                    $scope.pageNum = result.page.pageNo;
                }
                $scope.isloading = false;
            }else{
                $scope.isloading = false;
                alertWarning(result.msg);
            }
        });
    };
   
    getCategories();
    appendGoods(1);

    $(".scrollable-content").scroll(function () {
        if ($("#divProducts").length > 0) {
            if ($scope.isloading == false && $scope.pageCount) {
                advanceLoad("#divProductList", loadObj, $scope.pageNum < $scope.pageCount);
            }
        }
    });

    $scope.inquiry = function () {
        $location.path("/myProfile");
    }
	
	$scope.goProduct=function(id){
        if(!id){
            alertWarning("该商品已经下架，请选择其他商品购买^_^");
            return;
        }
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=1&goodId="+id;
        }else{
            $location.path("/product/"+id+"/1");
        }
        
    };
	$scope.drawProductsPanel=function(){
		$("#divProducts .list-products-item .products-item-image").css("height",$("#divProducts .list-products-item").width()+"px");
		$("#divProducts .list-products-item .products-item-title").css("height",$("#divProducts .list-products-item").width()/1.67+"px");

		$("#divProducts .list-products-item .products-item-title .products-item-name").css("height",$("#divProducts .list-products-item").width()/4+"px");

	};
	//$scope.drawProductsPanel();
	$(window).resize(function(){
		$scope.drawProductsPanel();
	});
	
	
	$scope.cart = function () {
        $location.path("/cart");
    }

    $scope.cartNum = function () {
        httpRequest.APIPOST('/cart/list_v1.4', dataStringify("platform=all&token="+$rootScope.tokenInfo.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			var num=0;
			if (result && result.code == statusCode.Success) {
				$scope.cartProducts=result.result.normal;
				num=$scope.cartProducts.length;
			}else{
				alertWarning(result.msg);
				num=0;
			}
			$scope.cartQuantity=num;
		});  
    }
	
	$scope.cartNum();
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.cartNum();
    });

});

app.controller('searchPanelController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
	$scope.back=function(){
		$location.path("/products");
	};
    $scope.goProduct = function(id) {
        return id ? void($scope.isApp ? window.location.href = easybuy.appActivity + "?action=1&goodId=" + id: $location.path("/product/" + id + "/1")) : void alertWarning("该商品已经下架，请选择其他商品购买^_^")
    }

	
	
	$scope.isQuery=false;
	$scope.searchKeyword="";
	$scope.isFocus=false;
	
	$scope.cancelSearch=function(){
		if($scope.isFocus){
			$(".search-result").removeClass("focus");
			$scope.isFocus=false;
			return;
		}
		$scope.$emit("CtrlSearchPanel", false);
		$scope.searchKeyword="";
		$scope.isLocalKey=true;
		$scope.isQuery=false;
		$scope.queryProducts=[];
	};
	
	
	//setSearchLocalItems([{value:"凤梨酥"},{value:"郭元益凤梨酥"},{value:"凤梨酥350g"},{value:"凤梨酥350g"}]);
	
	$scope.searchLocalItems=getSearchLocalItems() || [];

	/*var maxLength=$scope.searchLocalItemsT.length>6?6:$scope.searchLocalItemsT.length;
	var tempArr=[];
	for(var i=(maxLength-1);i>=0;i--){
		tempArr.push($scope.searchLocalItemsT[i]);
	}
	$scope.searchLocalItems=$.extend(true,{},tempArr);

	$scope.searchItems=[];//["凤梨酥","郭元益凤梨酥","凤梨酥350g0"];
	*/
	$scope.isLocalKey=true;//显示搜索历史记录
	$scope.searchKeyup=function(e){
		if(e && e.keyCode==13){
			if($scope.searchKeyword.length>0){
				$scope.queryGoods($scope.searchKeyword,1);
				return;
			}
		}
		if($scope.searchKeyword.length>0){
			$scope.isLocalKey=false;
			$scope.getSuggestKeywords($scope.searchKeyword);
		}else{
			$scope.isLocalKey=true;
			$(".search-result").addClass("focus");
		}
		
	};
	
	$("#searchInput").bind("input",function(){
		$scope.searchKeyup();
	});
	
	$scope.searchFocus=function(){
		$("#searchInput").focus();
		$scope.searchLocalItems=getSearchLocalItems() || [];
		$scope.isFocus=true;
		if($scope.searchKeyword.length>0){
			$scope.isLocalKey=false;
			$scope.getSuggestKeywords($scope.searchKeyword);
			$scope.isFocus=false;
		}else{
			if($scope.searchLocalItems.length>0)
				$(".search-result").addClass("focus");				
		}
		
	};
	
	$scope.searchBlur=function(){
		//$(".search-result").removeClass("focus");
	};
	
	$scope.hideSearchDropdown=function(){
		$(".search-result").removeClass("focus");
	}
	
	$scope.saveSearchKeyword=function(value){
		//$scope.searchLocalItems.push({"value":value});
		setSearchLocalItems(value);
		
		$scope.searchKeyword=value;
		
		$scope.queryGoods(value,1);
	}
	
	$scope.removeSearchKeyword=function(){
		setSearchLocalItems(null);
		$scope.searchLocalItems=[];
		$(".search-result").removeClass("focus");
	};
	$(".search-input").bind("keyup",function(e){
		if(e.keyCode==13 && $scope.searchKeyword.length>0){
			//$scope.searchLocalItems.push({"value":$scope.searchKeyword});
			setSearchLocalItems($scope.searchKeyword);
		}
	})

	$scope.getShowKeywords=function(){
		httpRequest.APIPOST('/keywords/getShow', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.hotKeywords=result.result;
			}else{
				alertWarning(result.msg);
			}
		});
	}
	$scope.getShowKeywords();
	
	$scope.getSuggestKeywords=function(q){
		httpRequest.APIPOST('/solr/keywords/suggest', dataStringify("platform=all&area=kr&q="+q), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.searchItems=result.result;
				if($scope.searchItems.length>0){
					$(".search-result").addClass("focus");
				}else{
					$(".search-result").removeClass("focus");
				}
			}else{
				alertWarning(result.msg);
			}
		});
	}
	
	$scope.queryGoods=function(q,pageNo){
		$(".search-result").removeClass("focus");
		$scope.isFocus=false;
		$scope.searchKeyword=q;
		httpRequest.APIPOST('/solr/goods/query', dataStringify("platform=all&q="+q+"&pageNo="+pageNo+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.isQuery=true;
				if(pageNo>1){
                    $scope.queryProducts=$scope.queryProducts.concat(result.result);
                    $scope.queryPageCount = result.page.totalPage;
                    $scope.queryPageNum = pageNo;
                }else{
                    $scope.queryProducts=result.result;
                    $scope.queryPageCount = result.page.totalPage;
                    $scope.queryPageNum = result.page.pageNo;
                }
			}else{
				alertWarning(result.msg);
			}
		});
	}

	var loadObj = new loadControl('#queryLoadCanvas', function () {
        $(".pull-loading").html("加载中...");
        $scope.queryPageNum++;
        $scope.queryGoods($scope.searchKeyword, $scope.queryPageNum);
    });


    $(".scrollable-content").scroll(function () {
        if ($("#queryProducts").length > 0) {
            if ($scope.queryPageCount) {
                advanceQueryLoad("#queryProductList", loadObj, $scope.queryPageNum < $scope.queryPageCount);
            }
        }
    });

	
	$scope.drawQueryPanel=function(){
		$("#queryProducts .list-products-item .products-item-image").css("height",$("#queryProducts .list-products-item").width()+"px");
		$("#queryProducts .list-products-item .products-item-title").css("height",$("#queryProducts .list-products-item").width()/1.67+"px");
		
		$("#queryProducts .list-products-item .products-item-title .products-item-name").css("height",$("#queryProducts .list-products-item").width()/4+"px");
	
	};
	$(window).resize(function(){
		$scope.drawQueryPanel();
	});
	
	
	
});


app.controller('productAppController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.$on("CtrlDownloadShow", function (event, show) {
        $scope.showDownload = show;
    });
    $scope.isGo=function(){
        //return $routeParams.openId?true:false;
        return false;
    }
    httpRequest.APIPOST('/goods/detailLd', dataStringify("platform=all&id=" + $routeParams.id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.product = result.result;
            if ($scope.product) {
                $scope.product.num = 1;
                if ($scope.product.imgs && $scope.product.imgs.length > 0) {

                    $(".pager_control").removeClass("hide");
                    if ($scope.product.favorite == 1) {
                        $(".div-favorite img").attr("src", "image/icon_favorite_hover.png");
                    }

                    $(".product-content").html($scope.product.description);
                    $(".product-content").find("img").unbind("click").bind("click", function () {
                        showImageLarger(this);
                    });

                    var control = navigator.control || {};
                    if (control.gesture) {
                        control.gesture(false);
                    }

                    $scope.product.avgStar = $scope.product.avgStar ? $scope.product.avgStar : 0;
                    if ($scope.product.commentNum > 0) {
                        $(".rateTotal").raty({ path: "image/raty", size: 15, score: $scope.product.avgStar, readOnly: true });
                        $(".itemRate").raty({ path: "image/raty", size: 15, score: $scope.product.comment.star, readOnly: true });
                    }
                }
                if(typeof(IScroll)=="undefined"){
                    $.ajax({
                        url: '/lib/iscroll.js',
                        dataType: "script",
                        cache:true,
                        success: function(data){
                            $scope.initScroll();
                        }
                    });
                }else{
                    $scope.initScroll();
                }
            }
        }
    });

    function closeLargeImage() {
        $(".mask").remove();
        $("#viewport").removeClass("larger");
        $(".slider_box").removeClass("larger");
        $(".list-group").removeClass("margin");
    }

    $scope.back = function () {
        if(history.length==1 || $location.search().version){
            $location.path("/products");
        }else{
            history.back();
        }
    }
    
    $scope.addToCart = function (goodsNum) {
        if(goodsNum<=0){
            alertWarning("库存已不足，请稍后购买");
            return;
        }
        $(".promotePriceNewTotal").html("￥"+$scope.product.promotePrice);
        openPrompt("addToCart",function(num){
            var product=$.extend(true,{},$scope.product);
            product.num=num;
			var data="platform=all&token=" + $rootScope.tokenInfo.token+"&goodsId="+product.id+"&quantity="+num;
			httpRequest.APIPOST('/cart/add', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
				if (result && result.code == statusCode.Success) {
					setCart(null);
					setCart(result.result.normal);
					//addToCart(product);
					//$scope.$apply($scope.$$childHead);
					closeDialog();
					$scope.cartNum();
					alertSuccess("加入成功");					
				}
			});
        });        
    }
    
    $scope.reduceNum = function (goods) {
        if (goods.num > 1) {
            goods.num--;
        }
    }

    $scope.addNum = function (goods) {
        goods.num++;
    }

    $scope.validNum = function (goods, allowEmpty) {
        goods.num = validInteger(goods.num);
        if (!allowEmpty || goods.num != '') {
            var num = parseInt(goods.num);
            if (isNaN(num) || num < 1) {
                goods.num = 1;
            }
            else {
                goods.num = num;
            }
        }
    }

    $scope.go = function (goodsNum) {
        if(goodsNum<=0){
            alertWarning("库存已不足，请稍后购买");
            return;
        }
		
		openPrompt("go",function(num){
			var product=$.extend(true,{},$scope.product);
			product.num=num;          
			if ($scope.product) {
				closeDialog();
				$location.path("/pay/999").search({goodsId:product.id,quantity:num});
				$scope.$apply($location);
			}
		});
    }
    $scope.viewComments = function () {
        if ($scope.product && $scope.product.commentNum > 0) {
            $location.path("/comment/" + $routeParams.id);
        }
    };

    $scope.initScroll=function () {
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        for(var i=0;i<$scope.product.imgs.length;i++){
            var img=$scope.product.imgs[i];
            var p=$scope.product;
            var $img = $('<img />');
            $img.attr("src", img);
            $img.attr("title", p.title);
                   
            var $slide = $('<div class="slide"></div>').append($img);
            $('#scroller').append($slide);
            $('#indicator').css("width",(15*$scope.product.imgs.length-5)+"px");
            $('.slide').css("width",100/$scope.product.imgs.length+"%");
            $('#scroller').css("width",100*$scope.product.imgs.length+"%")
        }
        $("#spanCurrPage").html(1);
        $("#spanTotalsCount").html($scope.product.imgs.length);

        $scope.myScroll=null;
        $scope.myScroll = new IScroll('#wrapper', {
            scrollX: true,
            scrollY: false,
            momentum: false,
            preventDefault:false,
            snap: true,
            snapSpeed: 100,
            keyBindings: true,
            indicators: {
                el: document.getElementById('indicator'),
                resize: false
            }
        });
        var handler=function (e) { e.preventDefault(); };
        $scope.myScroll.on('scrollStart', function(){
            $("#viewport")[0].addEventListener('touchmove', handler, false);
        });
        $scope.myScroll.on('scrollEnd', function(){
            $("#spanCurrPage").html($scope.myScroll.currentPage.pageX+1);
             $("#viewport")[0].removeEventListener('touchmove',handler,false);            
        });
        
    };

    $scope.cart = function () {
        $location.path("/cart");
    }

    $scope.cartNum = function () {
        httpRequest.APIPOST('/cart/list_v1.4', dataStringify("platform=all&token="+$rootScope.tokenInfo.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			var num=0;
			if (result && result.code == statusCode.Success) {
				$scope.cartProducts=result.result.normal;
				num=$scope.cartProducts.length;
			}else{
				alertWarning(result.msg);
				num=0;
			}
			$scope.cartQuantity=num;
		});  
    }
	
	$scope.cartNum();
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.cartNum();
    });


});

app.controller('downloadController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.ProgramTypes = easybuy.ProgramTypes;
    $scope.mobileType = getMobileType();
    if ($scope.type != $scope.ProgramTypes.APP && !getCloseDownloadApp()) {
        if ($scope.mobileType == MobileTypes.Android && appDownloadUrl.android && appDownloadUrl.android != "") {
            if (!isWeixin() || (appDownloadUrl.webchat && appDownloadUrl.webchat != "")) {
                $scope.show = true;
            }
        }
        else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
            if (appDownloadUrl.ios && appDownloadUrl.ios != "") {
                if (!isWeixin() || (appDownloadUrl.webchat && appDownloadUrl.webchat != "")) {
                    $scope.show = true;
                }
            }
        }
    }
    $scope.$emit("CtrlDownloadShow", $scope.show);
    var isXiaoMiBrowser = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/miuibrowser/i) == "miuibrowser") {
            return true;
        } else {
            return false;
        }
    }
    $scope.download = function () {  
		if (!isWeibo()) {
            window.location.href = easybuy.appOpenUrl;
        }
        if($scope.mobileType == MobileTypes.Android && isXiaoMiBrowser()){
            window.location.href = appDownloadUrl.webchat;
        }
        window.setTimeout(function () {
            if (isWeixin()) {
                if ($scope.mobileType == MobileTypes.Android) {
                    window.location.href = appDownloadUrl.webchat;
                }else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
                    if ($scope.mobileType == MobileTypes.iPad) {
                       // window.open(appDownloadUrl.weixinIos);
                    }
                    else {
                        //window.location.href = appDownloadUrl.weixinIos;
                    }
                    var arrButton = ["取消", "确定"];
                    openDialog("请点击右上角在浏览器中打开下载", "", arrButton, null,
                        function (r) {
                            if (r) {
                            }
                        });
                }
            }
            else {                
                if ($scope.mobileType == MobileTypes.Android) {
                    if(isXiaoMiBrowser()){
                        window.location.href = appDownloadUrl.android;
                    }else{
                        window.location.href = appDownloadUrl.webchat;
                    }                    
                }
                else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
                    if ($scope.mobileType == MobileTypes.iPad) {
                        window.open(appDownloadUrl.ios);
                    }
                    else {
                        window.location.href = appDownloadUrl.ios;
                    }
                }
            }
        }, 500)
    }

    $scope.close = function () {
        $scope.show = false;
        setCloseDownloadApp();
        $scope.$emit("CtrlDownloadShow", $scope.show);
    }
});
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
	
	$rootScope.$on("CtrlLoginModule", function (event, tokenInfo) {
        $scope.getCart();
    });

    if (getMobileType() == MobileTypes.iPhone || getMobileType() == MobileTypes.iPad) {
        window.onresize = function () {
            refixNavBottom();
        }
        window.onresize();
    }

    $scope.reduceNum = function (index) {
        $scope.products[index].quantity--;        
		$scope.synCart();
    }

    $scope.addNum = function (index) {
		$scope.products[index].quantity++;
		$scope.synCart();
        $scope.totalAmount();
    }

    $scope.validNum = function (index) {
        $scope.products[index].quantity=validInteger($scope.products[index].quantity)==""?0:parseInt(validInteger($scope.products[index].quantity));
		$scope.synCart();
		$scope.totalAmount();
    }

    $scope.checked = function (product,parentIndex,index) {		
        if (product.checked) {
            product.checked = 0;
        }
        else {
            product.checked = 1;
        }
		if($scope.products[index].error=="库存不足"){
			product.checked = 0;
			return;
		}
        $scope.updateStatus();
        $scope.totalAmount(parentIndex,index);
    }
	
	$scope.deleteItem=function(product,parentIndex,index){
		var data="platform=all&token=" + $rootScope.tokenInfo.token+"&goodsId="+product.id;
		httpRequest.APIPOST('/cart/delete', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
			if (result && result.code == statusCode.Success) {
				$scope.getCart();
			}
		});
	};

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
		var ids=[];
		var nums=[];
		
		for(var i=0;i<$scope.products.length;i++){
			if($scope.products[i].checked==1){
				ids.push($scope.products[i].id);
				nums.push($scope.products[i].quantity);
			}
		}
		$location.path("/pay/999/1").search({goodsId:ids.join(','),quantity:nums.join(',')});
		$scope.$apply($location);
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