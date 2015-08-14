app.controller('productListController', function ($rootScope, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {    
    var code=$routeParams.code || 0;
	$scope.isSearchPage=false;
	
	$scope.showSearch=function(){
		//$("#contentPage").hide();
		$scope.isSearchPage=true;
		$("#searchPage").addClass("current");
	};
	
	
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
        httpRequest.APIPOST('/goods/listByCategory', dataStringify("platform=all"+ldToken+paramCategory+"&pageNo="+pageNum+"&pageSize=10&now="+now), { "content-type": "application/x-www-form-urlencoded" },(pageNum==1?true:false)).then(function (result) {
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
});



app.controller('cartNumController', function ($rootScope, $scope, analytics, $location) {
    $scope.cart = function () {
        $location.path("/cart");
    }

    $scope.cartNum = function () {
        return getCartNum();
    }
});


app.controller('productAppController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.$on("CtrlDownloadShow", function (event, show) {
        $scope.showDownload = show;
    });
    $scope.isGo=function(){
        //return $routeParams.openId?true:false;
        return false;
    }
    httpRequest.APIPOST('/goods/detail', dataStringify("platform=all&id=" + $routeParams.id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
            addToCart(product);
            $scope.$apply($scope.$$childHead);
            closeDialog();
            alertSuccess("加入成功");
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
                        openPrompt("go",function(num){
                            var product=$.extend(true,{},$scope.product);
                            product.num=num;            
                            if ($scope.product) {
                                removeOrder();
                                setOrder([product]);
                                var goodsArr = new Array();
                                var goods = new Object();
                                goods.id = product.id;
                                goods.num = product.num;
                                goodsArr.push(goods);

                                closeDialog();
                                $location.path("/pay/999").search({area:1,goods:JSON.stringify([product]),user:JSON.stringify(urlUser)});
                                $scope.$apply($location);
                            }
                        }); 


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
                openPrompt("go",function(num){
                    var product=$.extend(true,{},$scope.product);
                    product.num=num;            
                    if ($scope.product) {
                        removeOrder();
                        setOrder([product]);
                        var goodsArr = new Array();
                        var goods = new Object();
                        goods.id = product.id;
                        goods.num = product.num;
                        goodsArr.push(goods);

                        closeDialog();
                        $location.path("/pay/999").search({area:1,goods:JSON.stringify([product]),user:JSON.stringify(urlUser)});
                        $scope.$apply($location);
                    }
                });  
            }            
        }else{
            if(easybuy.isWechat){
                $location.path("/wechatOauth/product-"+$routeParams.id);
            }else{
                $location.path("/myProfile/product-"+$routeParams.id);
            }
        }
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


});
app.controller('commentController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.pageNum = 1;
    appendComments($scope.pageNum);

    var loadObj = new loadControl('#myLoadCanvas', function () {
        $(".pull-loading").html("加载中...");
        $scope.pageNum++;
        appendComments($scope.pageNum);
    });

    $(".scrollable-content").scroll(function () {
        if ($("#divProductComments").length > 0) {
            if ($scope.isloading == false && $scope.page) {
                advanceLoadCommon("#divProductComments", loadObj, $scope.pageNum < $scope.page.totalPage);
            }
        }
    });

    function appendComments(pageNum) {
        $scope.isloading = true;
        httpRequest.APIPOST('/goods/listComment', dataStringify("platform=all&goodsId=" + $routeParams.id + "&pageNo=" + pageNum + "&pageSize=15" + (pageNum > 1 ? "&now=" + $scope.pageTime : "")), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            $scope.isloading = false;
            if (result && result.code == statusCode.Success) {
                $scope.commentInfo = result.result;
                $scope.page = result.page;
                if ($scope.commentInfo) {
                    if($(".rateTotal img").length<1)
                        $(".rateTotal").raty({ path: "image/raty", size: 15, score: $scope.commentInfo.avgStar, readOnly: true });
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
                        $.each($(".product-item-comment"), function (i, item) {
                            if($(item).find(".itemRate img").length<1)
                                $(item).find(".itemRate").raty({ path: "image/raty", size: 15, score: parseInt($(item).find(".itemRate").attr("score")), readOnly: true });
                        });
                    }, 0);
                }
            }
            loadObj.clear();
            $(".pull-loading").html("上拉加载");
        });
    }
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