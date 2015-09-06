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