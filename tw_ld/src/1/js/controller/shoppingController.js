app.controller('navbarController', function ($rootScope, $scope, analytics, $location, $window) {
    $scope.back = function () {
        history.back();
    }
});

app.controller('productListController', function ($rootScope, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {    
    var code=$routeParams.code || 0;
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
            var rate=(cat.length / 4)*100+25+"%";
            if(cat.length<4){
                $scope.width="25%";
                //$(".nav-menu ul li").css("width","20%");
            }else{
                //$(".nav-menu ul li").css("width","15%");
                $scope.width="17.5%";
            }
            $(".nav-menu #wrapper ul").css("width",rate);
            $scope.categories=cat;
            $rootScope.initNav(cat);
            if(cat.length>=4){
                for(var i=0;i<cat.length;i++){
                    if(cat[i].code==code){
                        var rateLi=i-1;
                        if(rateLi>0){
                            if(i==cat.length-1){
                                rateLi=-(rateLi*25-40)+"%"
                                $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                            }else{
                               if(i<cat.length-2){
                                    rateLi=-rateLi*25+"%"
                                    $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                                }else{
                                    rateLi=-(rateLi*25-17.5)+"%"
                                    $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                                }
                            }
                        }
                    }
                }
            }else{
                $(".nav-menu #wrapper ul").css("margin-left","0");
            }
        }else{
            httpRequest.APIPOST('/goods/category', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    var cat=result.result;   
                    cat.slice(1);
                    var rate=(cat.length / 4)*100+25+"%";
                    if(cat.length<4){
                        $scope.width="25%";
                        //$(".nav-menu ul li").css("width","20%");
                    }else{
                        //$(".nav-menu ul li").css("width","15%");
                        $scope.width="17.5%";
                    }
                    $(".nav-menu #wrapper ul").css("width",rate);
                    $scope.categories=cat;
                    $rootScope.initNav(cat);
                    if(cat.length>=4){
                        for(var i=0;i<cat.length;i++){
                            if(cat[i].code==code){
                                var rateLi=i-1;
                                if(rateLi>0){
                                    if(i==cat.length-1){
                                        rateLi=-(rateLi*25-40)+"%"
                                        $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                                    }else{
                                       if(i<cat.length-2){
                                            rateLi=-rateLi*25+"%"
                                            $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                                        }else{
                                            rateLi=-(rateLi*25-17.5)+"%"
                                            $(".nav-menu #wrapper ul").css("margin-left",rateLi);
                                        }
                                    }                            
                                }
                            }
                        }
                    }else{
                        $(".nav-menu #wrapper ul").css("margin-left","0");
                    }                  
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
        httpRequest.APIPOST('/goods/listByCategory', dataStringify("platform=all"+ldToken+paramCategory+"&pageNo="+pageNum+"&pageSize=10&now="+now), { "content-type": "application/x-www-form-urlencoded" },true).then(function (result) {
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
                advanceLoad("#divProductComments", loadObj, $scope.pageNum < $scope.page.totalPage);
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
                        $.each($(".product-item-comment:eq(" + index + ")").nextAll().andSelf(), function (i, item) {
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

app.controller('myPhoneController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    $scope.mobile=$routeParams.mobile || "";
    $scope.token=$routeParams.token || getToken().token;
    $scope.isSetMobile=$routeParams.mobile?true:false;
    if($routeParams.mobile=="0"){
        $scope.isSetMobile=false;
        $scope.mobile="";
    }
    if(easybuy.isWechat && !$routeParams.token){
        if(getToken() && getToken().token){
            httpRequest.APIPOST('/mine/index', dataStringify("platform=all&token="+getToken().token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    var userInfo=result.result;
                    $scope.mobile=userInfo.mobile;
                    if($scope.mobile){
                        $scope.isSetMobile=true;
                    }
                }else{
                    alertWarning(result.msg);
                }
            });
        }
    }
    $scope.focus=function(){
        $("#myPhoneNumber").focus();
    };
    $scope.back=function(){
        $location.path("/myProfile");
    };
    $scope.setPhone=function(){
        if (!$scope.mobile || $scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }
        if (!$scope.code || $scope.code.toString().length < 4 || $scope.code.toString().length > 8) {
            alertWarning("请输入验证码");
            return;
        }
        var data="platform=all&token="+$scope.token+"&mobile="+$scope.mobile+"&code="+$scope.code;
        $scope.wait=0;
        showLoading();
        httpRequest.APIPOST('/user/bindMobile', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 alertWarning("手机号设置成功");
                 var temp=getToken();
                 if(temp){
                    temp.mobile=$scope.mobile;
                    setToken(temp);
                 }
                 if($location.$$search && $location.$$search.user && $location.$$search.user.openId){
                      var arr=$location.$$search.state.split('-');
                      if(arr[0]=="orderDetail"){
                          $location.path("/orderDetail/"+arr[1]+"/"+$scope.token).search(user);
                          return;
                      }
                      if(arr.length<2){
                          $location.path("/"+$location.$$search.state).search($location.$$search.user);
                          return;
                      }
                      if(arr.length==2){
                          $location.path("/"+arr[0]+'/'+arr[1]).search($location.$$search.user);
                          return;
                      }
                      if(arr.length==3){
                          $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search($location.$$search.user);
                          return;
                      }
                 }else{
                     $location.path("/myProfile");
                 }
            }else{
                alertWarning(result.msg);
            }
        });

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
    }  
    $scope.getCheckCode=function(){
        if ($scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
            alertWarning("请输入9~13位的手机号码");
            return;
        }
        $("#codeClock").css("display","inline-block");
        time();
        var data="platform=all&type=3&mobile="+$scope.mobile;
        httpRequest.APIPOST('/sms/getVerifyCode', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 
            }else{
                alertWarning(result.msg);
            }
        });
    };
});

app.controller('myCouponController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window,$routeParams) {
    if($routeParams.token){
        $scope.token=$routeParams.token;
    }else{
        $scope.token=getToken()?getToken().token:"";
    }
    var from=($location.search() && $location.search().from)?$location.search().from:"";
    if(easybuy.isWechat && !$routeParams.token && from=="activity"){
        var t=getToken();        
        $scope.token=t.token;
        if(!t.mobile || (t.mobile && t.mobile.length<6)){
            $location.path("/wechatOauth/myCoupon").search({from:from});
            return
        }		
    }
    if($scope.token){
        var data="platform=all&token="+$scope.token;
        showLoading();
        httpRequest.APIPOST('/coupons/mine', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            if (result && result.code == statusCode.Success) {
                 hideLoading();
                 $scope.coupons=result.result;


                 /*$scope.coupons.usedList.push({"id": 13,
                    "startTime": "2015-01-01",
                    "amount": "20.00",
                    "full": 199,
                    "typeDesc": "全场适用",
                    "couponId": 1,
                    "endTime": "2015-03-31",
                    "type": 1});
                    */
                 //$scope.coupons=[{id:1,remainNum:5}];//for test
                 /*for(var i=0;i<$scope.coupons.length;i++){
                     var repeatCount=[];
                     for(var j=0;j<$scope.coupons[i].remainNum;j++){
                         repeatCount.push(j);
                         $scope.coupons[i].repeatCount=repeatCount;
                     }
                 }
                 if($scope.coupons.length<1){
                     $("#emptyStatus").css("display","block");
                 }else{
                     $("#emptyStatus").css("display","");
                 }*/
            }else{
                hideLoading();
                alert(result.msg);
            }
        });
    }else{
        $location.path("/myProfile");
    }
    $scope.back=function(){
        if($location.search() && $location.search().from){
            history.back();
        }else{
            $location.path("/myProfile");
        }        
    }
});



app.controller('oauth2Controller', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
      var nickname=$location.$$search.nickname;
      var headimgurl=$location.$$search.headimgurl;
      var openId=$routeParams.openId;
      var state=$routeParams.state;
      var source=$location.$$search.source?$location.$$search.source:1;
      $rootScope.isOauth2=true;
      if(source==4){
          var usertokenInfo=getToken();
          var arr=state.split('-');
          if(arr[0]=="orderDetail"){
              $location.path("/orderDetail/"+arr[1]+"/"+usertokenInfo.token).search(usertokenInfo);
              return;
          }
          if(arr.length<2){
              $location.path("/"+state).search(usertokenInfo);
              return;
          }
          if(arr.length==2){
              $location.path("/"+arr[0]+'/'+arr[1]).search(usertokenInfo);
              return;
          }
          if(arr.length==3){
              $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search(usertokenInfo);
              return;
          }
      }
      var user={openId:openId,nickname:nickname,headimgurl:headimgurl,source:source};
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
              
              if(($scope.currentUser.mobile==null || !$scope.currentUser.mobile || ($scope.currentUser.mobile && $scope.currentUser.mobile.length<6)) &&  isNotBindPhone[state]!=true && ($scope.currentUser.source && $scope.currentUser.source!=4)){
                  if($scope.currentUser.bind!=0 || $scope.currentUser.bind!="0")
                    $location.path("/myPhone/0/"+$scope.currentUser.token).search({user:user,state:state});
              }else{
                  setToken($scope.currentUser);
                  var arr=state.split('-');
                  if(arr[0]=="orderDetail"){
                      $location.path("/orderDetail/"+arr[1]+"/"+$scope.currentUser.token).search(user);
                      return;
                  }
                  if(arr.length<2){                      
                      $location.path("/"+state).search(user);
                      return;
                  }
                  if(arr.length==2){
                      if(arr[0]=="activity" && arr[1]=="activityDetail"){
                          $location.path("/"+arr[0]+'/'+arr[1]);
                      }else{
                          $location.path("/"+arr[0]+'/'+arr[1]).search(user);
                      }                      
                      return;
                  }
                  if(arr.length==3){
                      $location.path("/"+arr[0]+'/'+arr[1]+'/'+arr[2]).search(user);
                      return;
                  }
                  
              }
          }else{
              alert(result.msg);
          }
      });      
});
app.controller('wechatOauthController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
     var state=$routeParams.state;
     var from=($location.search() && $location.search().from)?$location.search().from:"";
     if(baseOauth[state]===true && from!=="activity"){
         $rootScope.oauth2(state,null);
     }else{
         $rootScope.oauth2(state,"userinfo");
     }     
});

/** added in 1.6**/
app.controller('myController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    var from=$routeParams.from || "";
    $scope.isNeedBind=true;
    $scope.from=from;
    var loginFrom=1;
    $scope.isLogin=true;
    $scope.isShowLogoutBtn=!easybuy.isWechat;
    if(!easybuy.isWechat){
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
    }

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
        httpRequest.APIPOST('/user/login', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
                        $scope.user.bind=0;
                        $scope.isNeedBind=false;
                        setToken($scope.user);
                        if(from){
                            //alertSuccess("登录成功");
                            $location.path('/oauth2/'+$scope.user.openId+'/'+from).search({openId:$scope.user.openId,nickname:userInfo.nickname,headimgurl:userInfo.avatar,source:4,bind:$scope.user.bind}); 
                            $scope.$apply($location);
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
                    $scope.$apply($scope.isLogin);  
                    $scope.$apply($scope.user);

                    
                }
        });
         
    }
    $scope.back = function () {
        $location.path("/products");
    }
    if(easybuy.isWechat){
        callback();
    } 
    function callback(u){
        //console.log("callback");
        var user=u?u:$location.$$search;
        $scope.user=user;
        if(user && user.openId){                    
            var source=user.source;//用户来源，1：微信， 2：QQ， 3：微博
            var data="platform=all&openid="+user.openId+"&nickname="+user.nickname
                     +"&gender=0&avatar="+user.headimgurl+"&source="+source+"&channel=H5"
                     +"&appVersion="+easybuy.version;
            httpRequest.APIPOST('/user/thirdLogin', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.isLogin=true;
                    $scope.user=result.result;
                    $scope.user.openId=user.openId;
                    $scope.user.source=user.source;
                    $scope.user.nickname=user.nickname;
                    $scope.user.headimgurl=user.headimgurl;
                    $scope.user.bind=1;
                    if($scope.user.mobile==null){
                        $scope.user.mobile="0";
                    }
                    if(!$scope.user.mobile || $scope.user.mobile=="0"){
                        $location.path("/myPhone/0/"+$scope.user.token).search({user:$scope.user,state:"myProfile"});
                    }                    
                    setToken($scope.user);
                    $scope.isNeedBind=true;
                    $scope.$apply($scope.isNeedBind);
                    $scope.$apply($scope.user);
                    //alert(user.openId);
                    //location.reload(true);
                }else{
                    alert(result.msg);
                }
            });
        }else{
            $scope.user=getToken();
            if($scope.user){
                $scope.isLogin=true;
                if(!$scope.user.mobile ||($scope.user.mobile && $scope.user.mobile.length<6)){
					$scope.user.mobile=0;
				}
            }else{
                $scope.isLogin=false;
                $scope.user={};
            }
            $scope.$apply($scope.user);
            $scope.$apply($scope.isLogin);
        } 
    } 
    $scope.validNum = function () {
        $scope.username = validInteger($scope.username);
    }
});
app.controller('registerController', function ($rootScope, $scope, httpRequest, $http, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.register=function(){
        var u=$scope.username;
        var c=$scope.code;
        var p=$scope.password;
        var ic=$scope.inviteCode;
		
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
		
		if (!ic || ic.length<4 || ic.length>20) {
            alertWarning("请输入4~20位的密码");
            return;
        }
        $scope.wait=0;
        var data="platform=all&mobile="+u+"&password="+p+"&code="+c+"&inviteCode="+ic;
        httpRequest.APIPOST('/user/register', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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