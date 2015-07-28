app.register.controller('tourDetailController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.noInApp=function(){
        var arrButton = ["取消","去下载"];
        openDialog("仅支持在购轻松韩国App内预订", "", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/downloadApp");
                   $scope.$apply($location);
                }
            });
    }
    var loadObj = null;
    $scope.isApp=isApp($location);
    var appendComments=function(pageNum,p) {
        if($scope.page && pageNum>$scope.page.totalPage){
            //$(".pull-loading").html("上拉加载");
            return;
        }
        $scope.isloading = true;
        httpRequest.APIPOST('/comment/listComment', dataStringify("category="+p.category+"&platform=all&objectId="+p.id+"&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
            if(loadObj){
                loadObj.clear();
                $(".pull-loading").html("上拉加载");
            }
        });
    };
    $scope.pageNum=1;
    var isLoading=false;
    $scope.changeTap=function(type){
       if(type==3){
            isLoading=true;
            if(!loadObj){
                loadObj = new loadControl('#myLoadCanvas', function () {
                    $(".pull-loading").html("加载中...");
                    $scope.pageNum++;
                    appendComments($scope.pageNum,$scope.product);
                });
            }
       }else{
           isLoading=false;
       }
    };

    $scope.share=function(){
        var p=$scope.product;
        //shareTitle={{}}&shareText={{}}&shareUrl={{}}&shareImageUrl={{}}
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            //$scope.noInApp();
        }
    };

    $scope.go = function () {
       var p=$scope.product;
       if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=2003&price="+p.defaultPrice+"&promotePrice="+p.promotePrice+"&name="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            $scope.noInApp();
        }
    }

    httpRequest.APIPOST('/tour/detailProduct', dataStringify("platform=all&id=" + $routeParams.id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.product = result.result;
            if ($scope.product) {
                $scope.product.num = 1;
                appendComments(1,$scope.product);
                if ($scope.product.detailImg && $scope.product.detailImg.length > 0) {

                    $(".pager_control").removeClass("hide");
                    if ($scope.product.favorite == 1) {
                        $(".div-favorite img").attr("src", "image/icon_favorite_hover.png");
                    }

                    $("#aheadOrderTime").text($scope.product.aheadOrderTime);
                    $("#serviceTime").text($scope.product.serviceTime);

                    $("#introduct").html($scope.product.description);
                    $("#notice").html($scope.product.attention);

                    
                    var control = navigator.control || {};
                    if (control.gesture) {
                        control.gesture(false);
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

    var clientH=$(document).height();
    if($scope.isApp==2 && !easybuy.isWechat){
        clientH=clientH;
    }
    

    $(".tab-content .tab-pane").css("overflow-y","auto");
    $(".tab-content .tab-pane").css("padding-bottom","50px");
    
    //$(".tab-content .tab-pane").height(clientH-175);

    $(".scrollable-content").scroll(function (e) {
        if(isLoading){
            var sTop=$(".scrollable-content").scrollTop();
            var sHeight=$(".scrollable-content").height();
            var dHeight=$("#detail-content").height();
            
            //console.log(sTop+sHeight+":"+dHeight);
            if((sTop+sHeight+100)>=dHeight){
                loadObj.action(loadObj.GetStepCount());
            }

        }
    });
    var commentsFlash=$("#comments").parent();
    $(commentsFlash).scroll(function(){
        var sH=$(commentsFlash)[0].scrollHeight;
        var cH=$(commentsFlash).height();
        var tH=$(commentsFlash)[0].scrollTop;
        var mH=sH-(tH+cH);
        if(mH<=100){
            //loadObj.action(loadObj.GetStepCount());
        }
        //console.log(mH);

    });

    function closeLargeImage() {
        $(".mask").remove();
        $("#viewport").removeClass("larger");
        $(".slider_box").removeClass("larger");
        $(".list-group").removeClass("margin");
    }

    $scope.back = function () {
        $location.path("/products");
    }
    
    $scope.initScroll=function () {
        for(var i=0;i<$scope.product.detailImg.length;i++){
            var img=$scope.product.detailImg[i];
            var p=$scope.product;
            var $img = $('<img />');
            $img.attr("src", img);
            $img.attr("title", p.title);
                   
            var $slide = $('<div class="slide"></div>').append($img);
            $('#scroller').append($slide);
            $('#indicator').css("width",(15*$scope.product.detailImg.length-5)+"px");
            $('.slide').css("width",100/$scope.product.detailImg.length+"%");
            $('#scroller').css("width",100*$scope.product.detailImg.length+"%")
        }
        $("#spanCurrPage").html(1);
        $("#spanTotalsCount").html($scope.product.detailImg.length);

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
        var handler=function (e) { /*e.preventDefault();*/ };
        $scope.myScroll.on('scrollStart', function(){
            $("#viewport")[0].addEventListener('touchmove', handler, false);
        });
        $scope.myScroll.on('scrollEnd', function(){
            $("#spanCurrPage").html($scope.myScroll.currentPage.pageX+1);
             $("#viewport")[0].removeEventListener('touchmove',handler,false);            
        });
        
    };
});
app.register.controller('aboutController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.ProgramTypes = easybuy.ProgramTypes;
    $scope.isApp=isApp($location);
    $scope.mobileType = getMobileType();
    $scope.back=function(){
        $location.path("/products");
    };
    $scope.mobileType=$location.search().platform || getMobileType();
    if($scope.mobileType=="android"){
        $scope.mobileType="Android";
    }
    if($scope.mobileType=="ios"){
        $scope.mobileType="iOS";
    }
    $scope.version=$location.search().version || 'v1.0';
    $scope.build=$location.search().build || '140318';
});

app.register.controller('articleController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type
    $scope.ProgramTypes = easybuy.ProgramTypes;
    $scope.$on("CtrlDownloadShow", function (event, show) {
        $scope.showDownload = show;
    });
    httpRequest.APIPOST('/article/detail', dataStringify("platform=all&id=" + $routeParams.id + "&pageSize=2"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.article = result.result;
            if ($scope.article) {
                $(".article-content").html($scope.article.content);
                $scope.pageNum = 1;
                appendComments($scope.pageNum);
                $.each($(".article-content img"), function (i, img) {
                    var $img = $('<img />');
                    $img.attr("src", $(img).attr("src"));
                    var $item = $('<div class="item"></div>').append($img);
                    $('#slider .pic_group').append($item);

                    $(img).unbind("click").bind("click", function () {
                        var mask = $("<div class='mask deeper'></div>");
                        mask.appendTo($("#divArticleView"));
                        $(".slider_box").removeClass("hide");
                        mask.unbind().bind("click", function () {
                            closeLargeImage();
                        });

                        $('#slider').cycle({
                            fx: 'scrollHorz',
                            pager: '#pagination',
                            speed: 200,
                            timeout: 6000,
                            stopAutoPlay: true,
                            slideExpr: '.item',
                            pagerAnchorBuilder: null,
                            prev: '.arrow_l',
                            next: '.arrow_r',
                            clearCycleTimeOutBefore: true,
                            startingSlide: i,
                            slideSelector: '#slider',
                            pageTurnEvent: function (i) {
                                $("#spanCurPage").html(i + 1);
                            }
                        });
                    });
                });

                $(".pager_control").removeClass("hide");
                $('#spanTotalPage').html($("#slider .pic_group .item").length);

                $('#slider .item').unbind("click").bind("click", function () {
                    closeLargeImage();
                });

                var control = navigator.control || {};
                if (control.gesture) {
                    control.gesture(false);
                }
            }
        }
    });
    

    var loadObj = new loadControl('#myLoadCanvas', function () {
        $(".pull-loading").html("加载中...");
        $scope.pageNum++;
        appendComments($scope.pageNum);
    });

    $(".scrollable-content").scroll(function () {
        if ($("#divArticle").length > 0) {
            if ($scope.isloading == false && $scope.page) {
                advanceLoad("#divArticle", loadObj, $scope.pageNum < $scope.page.totalPage);
            }
        }
    });

    function closeLargeImage() {
        $(".mask").remove();
        $(".slider_box").addClass("hide");
    }

    function appendComments(pageNum) {
        $scope.isloading = true;
        httpRequest.APIPOST('/article/listComment', dataStringify("platform=all&id=" + $routeParams.id + "&pageNo=" + pageNum + "&pageSize=10" + (pageNum > 1 ? "&now=" + $scope.page.now : "")), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
            $scope.isloading = false;
            if (result && result.code == statusCode.Success) {
                var comments = result.result.comments;
                if (comments) {
                    if ($scope.comments) {
                        $scope.comments = $scope.comments.concat(comments);
                    }
                    else {
                        $scope.comments = comments;

                    }
                }
                $scope.page = result.page;
                $scope.pageNum = $scope.page.pageNo;
            }
            loadObj.clear();
            $(".pull-loading").html("上拉加载");
        });
    }

    $scope.back = function () {
        if ($routeParams.type) {
            history.back();
        }
        else {
            $location.path("/");
        }
    }

    $scope.toProduct = function (goodsId) {
        if ($routeParams.type == $scope.ProgramTypes.APP) {
            window.location.href = easybuy.appProducrUrl + "?id=" + goodsId;
        }
        else {
            $location.path("/product/" + goodsId + "/1");
        }
    }

    $scope.addFavorite = function () {
        if ($(".img-favorite").attr("src").indexOf("image/icon_like_pressed.png") < 0) {
            httpRequest.APIPOST('/article/love', dataStringify("platform=all&type=1&id=" + $routeParams.id), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    $scope.article.loveNum = result.result;
                    $(".img-favorite").attr("src", "image/icon_like_pressed.png");
                }
            });
        }
    }
});

app.register.controller('serviceTermsController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.ProgramTypes = easybuy.ProgramTypes;
});

app.register.controller('agentController', function ($rootScope, $scope, httpRequest,dataStringify, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.ProgramTypes = easybuy.ProgramTypes;
    
    httpRequest.APIPOST('/dic/listFlight', dataStringify("platform=all&type=2"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if(result.msg==="success"){
            var flights = result.result;
            $scope.flights=[];
            for(var i=0;i<flights.length;i++){
                $scope.flights.push({id:flights[i].id,terminal:flights[i].name,airport_map:flights[i].map});
            }
        }else {
            alertWarning(result.msg);
        }
    });

    $scope.showLarge = function (flight) {
        showLargeImage(flight.airport_map);
    }

    $scope.showFlightFilter = function (name) {
        return function (item) {
            if (name == null || name.length == 0) {
                return true;
            }
            if (item != null && item.terminal != null && item.terminal.toString().indexOf(name) >= 0) {
                return true;
            }
            return false;
        };
    };
});

app.register.controller('carBillingController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.ProgramTypes = easybuy.ProgramTypes;
});

app.register.controller('mifiController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.type = $routeParams.type
    $scope.ProgramTypes = easybuy.ProgramTypes;
    httpRequest.APIPOST('/mifi/list', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.mifi = result.result[0];
        }
    });

    $scope.go = function () {
        if ($scope.mifi) {
            if ($routeParams.type == $scope.ProgramTypes.APP) {
                window.location.href = easybuy.appMifiBuyUrl + "?id=" + $scope.mifi.id + "&name=" + encodeURI($scope.mifi.name) + "&promotePrice=" + $scope.mifi.promotePrice + "&img=" + $scope.mifi.img;
            }
        }
    }
});


app.register.controller('downloadAppController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.mobileType = getMobileType();    
    var isXiaoMiBrowser = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/miuibrowser/i) == "miuibrowser") {
            return true;
        } else {
            return false;
        }
    }
    $scope.download = function () {
        var currentLocation=window.location.href;
        var arr=currentLocation.split("?");
        var platform="";
        if ($scope.mobileType == MobileTypes.Android) {
            platform="android";                
        }
        else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
            platform="ios";
        }        
        if(arr.length==2 && platform.length>0){
            var arr2=arr[1].split("&");
            for(var i=0;i<arr2.length;i++){
                var arr3=arr2[i].split("=");
                if(arr3[0]=="channelID"){
                    var channel=arr3[1];
                    httpRequest.APIPOST('/download/log', dataStringify("platform="+platform+"&channel=" + channel), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        /*alert(result.msg);
                        if (result && result.code == statusCode.Success) {
                            var a=result.result;                            
                        }else{
                            
                        }*/
                    });                    
                    break;
                }
            }
        }
		if (!isWeibo()) {
            //window.location.href = easybuy.appOpenUrl;
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
                       // window.location.href = appDownloadUrl.weixinIos;
                    }
                    /*var arrButton = ["取消", "确定"];
                    openDialog("请点击右上角在浏览器中打开下载", "", arrButton, null,
                        function (r) {
                            if (r) {
                            }
                        });
                     */
                     window.location.href = appDownloadUrl.webchat;
                }
            }
            else {
                if ($scope.mobileType == MobileTypes.Android) {
                    window.location.href = appDownloadUrl.android;//webchat;
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
});

app.register.controller('downloadAllController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.mobileType = getMobileType();    
    var isXiaoMiBrowser = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/miuibrowser/i) == "miuibrowser") {
            return true;
        } else {
            return false;
        }
    }
    $scope.download = function () {
        var currentLocation=window.location.href;
        var arr=currentLocation.split("?");
        var platform="";
        if ($scope.mobileType == MobileTypes.Android) {
            platform="android";                
        }
        else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
            platform="ios";
        }        
        if(arr.length==2 && platform.length>0){
            var arr2=arr[1].split("&");
            for(var i=0;i<arr2.length;i++){
                var arr3=arr2[i].split("=");
                if(arr3[0]=="channelID"){
                    var channel=arr3[1];
                    httpRequest.APIPOST('/download/log', dataStringify("platform="+platform+"&channel=" + channel), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        /*alert(result.msg);
                        if (result && result.code == statusCode.Success) {
                            var a=result.result;                            
                        }else{
                            
                        }*/
                    });                    
                    break;
                }
            }
        }
		if (!isWeibo()) {
            //window.location.href = easybuy.appOpenUrl;
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
                       // window.location.href = appDownloadUrl.weixinIos;
                    }
                    /*var arrButton = ["取消", "确定"];
                    openDialog("请点击右上角在浏览器中打开下载", "", arrButton, null,
                        function (r) {
                            if (r) {
                            }
                        });
                     */
                     window.location.href = appDownloadUrl.webchat;
                }
            }
            else {
                if ($scope.mobileType == MobileTypes.Android) {
                    window.location.href = appDownloadUrl.android;//webchat;
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
    $scope.downloadKr = function () {
        var currentLocation=window.location.href;
        var arr=currentLocation.split("?");
        var platform="";
        if ($scope.mobileType == MobileTypes.Android) {
            platform="android";                
        }
        else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
            platform="ios";
        }        
        if(arr.length==2 && platform.length>0){
            var arr2=arr[1].split("&");
            for(var i=0;i<arr2.length;i++){
                var arr3=arr2[i].split("=");
                if(arr3[0]=="channelID"){
                    var channel=arr3[1];
                    httpRequest.APIPOST('/download/log', dataStringify("platform="+platform+"&channel=" + channel), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                        /*alert(result.msg);
                        if (result && result.code == statusCode.Success) {
                            var a=result.result;                            
                        }else{
                            
                        }*/
                    });                    
                    break;
                }
            }
        }
		if (!isWeibo()) {
            //window.location.href = easybuy.appOpenUrl;
        }
        if($scope.mobileType == MobileTypes.Android && isXiaoMiBrowser()){
            window.location.href = appDownloadKrUrl.webchat;
        }
        window.setTimeout(function () {
            if (isWeixin()) {
                if ($scope.mobileType == MobileTypes.Android) {
                    window.location.href = appDownloadKrUrl.webchat;
                }else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
                    if ($scope.mobileType == MobileTypes.iPad) {
                       // window.open(appDownloadKrUrl.weixinIos);
                    }
                    else {
                       // window.location.href = appDownloadKrUrl.weixinIos;
                    }
                    /*var arrButton = ["取消", "确定"];
                    openDialog("请点击右上角在浏览器中打开下载", "", arrButton, null,
                        function (r) {
                            if (r) {
                            }
                        });
                     */
                     window.location.href = appDownloadKrUrl.webchat;
                }
            }
            else {
                if ($scope.mobileType == MobileTypes.Android) {
                    window.location.href = appDownloadKrUrl.android;//webchat;
                }
                else if ($scope.mobileType == MobileTypes.iPhone || $scope.mobileType == MobileTypes.iPad) {
                    if ($scope.mobileType == MobileTypes.iPad) {
                        window.open(appDownloadKrUrl.ios);
                    }
                    else {
                        window.location.href = appDownloadKrUrl.ios;
                    }
                }
            }
        }, 500)
    }
});


app.register.controller('appWiFiDetailController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
      $scope.token=$location.search().token;
      //$scope.token="366a387b3a8575f1c4af953c30660986e4cfdc3581f32508484d5e194e9560fb8f6545f90c0a93b0449ec56cb955c12cdd21b3b99d954eb049082430653955f8b6aecd29e1fe7b0d";
      if($scope.token){
            var data="platform=all&token="+$scope.token;
            showLoading();
            httpRequest.APIPOST('/wifi/getServiceDetail', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                     hideLoading();
                     $scope.wifiInfo=result.result;
                     $scope.wifiInfo.backInfo.time=$scope.wifiInfo.backInfo.time.replace("01:00","24:00");
                     $scope.wifiInfo.getInfo.time=$scope.wifiInfo.getInfo.time.replace("01:00","24:00");
                }else{
                    hideLoading();
                    alertWarning(result.msg);
                }
            });
      }else{
          
      }
});

app.register.controller('airportBusController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.noInApp=function(){
        var arrButton = ["取消","去下载"];
        openDialog("仅支持在购轻松韩国App内预订", "", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/downloadApp");
                   $scope.$apply($location);
                }
            });
    }
    var loadObj = null;
    $scope.isApp=isApp($location);
    var appendComments=function(pageNum,p) {
        if($scope.page && pageNum>$scope.page.totalPage){
            //$(".pull-loading").html("上拉加载");
            return;
        }
        $scope.isloading = true;
        httpRequest.APIPOST('/comment/listComment', dataStringify("category="+p.category+"&platform=all&objectId="+p.id+"&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
            if(loadObj){
                loadObj.clear();
                $(".pull-loading").html("上拉加载");
            }
        });
    };
    $scope.pageNum=1;
    var isLoading=false;
    $scope.changeTap=function(type){
       if(type==3){
            isLoading=true;
            if(!loadObj){
                loadObj = new loadControl('#myLoadCanvas', function () {
                    $(".pull-loading").html("加载中...");
                    $scope.pageNum++;
                    appendComments($scope.pageNum,$scope.product);
                });
            }
       }else{
           isLoading=false;
       }
    };
    $scope.share=function(){
        var p=$scope.product;
        //shareTitle={{}}&shareText={{}}&shareUrl={{}}&shareImageUrl={{}}
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            //$scope.noInApp();
        }
    };

    $scope.go = function () {
       var p=$scope.product;
       if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=2004&price="+p.defaultPrice+"&promotePrice="+p.promotePrice+"&name="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            $scope.noInApp();
        }
    }

    httpRequest.APIPOST('/tour/getAirportbusDetail', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.product = result.result;

            if ($scope.product) {
                $scope.product.num = 1;
                appendComments(1,$scope.product);
                if ($scope.product.detailImg && $scope.product.detailImg.length > 0) {

                    $(".pager_control").removeClass("hide");
                    if ($scope.product.favorite == 1) {
                        $(".div-favorite img").attr("src", "image/icon_favorite_hover.png");
                    }

                   
                    $("#aheadOrderTime").text($scope.product.aheadOrderTime);
                    $("#serviceTime").text($scope.product.serviceTime);

                    $("#notice").html($scope.product.attention);
                     $("#introduct").html($scope.product.description);
                    var control = navigator.control || {};
                    if (control.gesture) {
                        control.gesture(false);
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

    var clientH=$(document).height();
    if($scope.isApp==2 && !easybuy.isWechat){
        clientH=clientH;
    }

    $(".tab-content .tab-pane").css("overflow-y","auto");
    $(".tab-content .tab-pane").css("padding-bottom","50px");
    //$(".tab-content .tab-pane").height(clientH-175);

    $(".scrollable-content").scroll(function (e) {
        if(isLoading){
            var sTop=$(".scrollable-content").scrollTop();
            var sHeight=$(".scrollable-content").height();
            var dHeight=$("#detail-content").height();
            
            //console.log(sTop+sHeight+":"+dHeight);
            if((sTop+sHeight+100)>=dHeight){
                loadObj.action(loadObj.GetStepCount());
            }

        }
    });
    var commentsFlash=$("#comments").parent();
    $(commentsFlash).scroll(function(){
        var sH=$(commentsFlash)[0].scrollHeight;
        var cH=$(commentsFlash).height();
        var tH=$(commentsFlash)[0].scrollTop;
        var mH=sH-(tH+cH);
        if(mH<=100){
            //loadObj.action(loadObj.GetStepCount());
        }
        //console.log(mH);

    });

    function closeLargeImage() {
        $(".mask").remove();
        $("#viewport").removeClass("larger");
        $(".slider_box").removeClass("larger");
        $(".list-group").removeClass("margin");
    }

    $scope.back = function () {
        $location.path("/products");
    }
    
    $scope.initScroll=function () {
        for(var i=0;i<$scope.product.detailImg.length;i++){
            var img=$scope.product.detailImg[i];
            var p=$scope.product;
            var $img = $('<img />');
            $img.attr("src", img);
            $img.attr("title", p.title);
                   
            var $slide = $('<div class="slide"></div>').append($img);
            $('#scroller').append($slide);
            $('#indicator').css("width",(15*$scope.product.detailImg.length-5)+"px");
            $('.slide').css("width",100/$scope.product.detailImg.length+"%");
            $('#scroller').css("width",100*$scope.product.detailImg.length+"%")
        }
        $("#spanCurrPage").html(1);
        $("#spanTotalsCount").html($scope.product.detailImg.length);

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
        var handler=function (e) { /*e.preventDefault();*/ };
        $scope.myScroll.on('scrollStart', function(){
            $("#viewport")[0].addEventListener('touchmove', handler, false);
        });
        $scope.myScroll.on('scrollEnd', function(){
            $("#spanCurrPage").html($scope.myScroll.currentPage.pageX+1);
             $("#viewport")[0].removeEventListener('touchmove',handler,false);            
        });
        
    };
});

app.register.controller('wifiServiceController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.noInApp=function(){
        var arrButton = ["取消","去下载"];
        openDialog("仅支持在购轻松韩国App内预订", "", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/downloadApp");
                   $scope.$apply($location);
                }
            });
    }
    var loadObj = null;
    $scope.isApp=isApp($location);
    var appendComments=function(pageNum,p) {
        if($scope.page && pageNum>$scope.page.totalPage){
            //$(".pull-loading").html("上拉加载");
            return;
        }
        $scope.isloading = true;
        httpRequest.APIPOST('/comment/listComment', dataStringify("category="+p.category+"&platform=all&objectId="+p.id+"&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
            if(loadObj){
                loadObj.clear();
                $(".pull-loading").html("上拉加载");
            }
        });
    };
    $scope.pageNum=1;
    var isLoading=false;
    $scope.changeTap=function(type){
       if(type==3){
            isLoading=true;
            if(!loadObj){
                loadObj = new loadControl('#myLoadCanvas', function () {
                    $(".pull-loading").html("加载中...");
                    $scope.pageNum++;
                    appendComments($scope.pageNum,$scope.product);
                });
            }
       }else{
           isLoading=false;
       }
    };
    $scope.share=function(){
        var p=$scope.product;
        //shareTitle={{}}&shareText={{}}&shareUrl={{}}&shareImageUrl={{}}
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            //$scope.noInApp();
        }
    };

    $scope.go = function () {
       var p=$scope.product;
       if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=2002&price="+p.defaultPrice+"&promotePrice="+p.promotePrice+"&name="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            $scope.noInApp();
        }
    }

    httpRequest.APIPOST('/tour/getWifiDetail', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.product = result.result;
            if ($scope.product) {
                $scope.product.num = 1;
                appendComments(1,$scope.product);
                if ($scope.product.detailImg && $scope.product.detailImg.length > 0) {

                    $(".pager_control").removeClass("hide");
                    if ($scope.product.favorite == 1) {
                        $(".div-favorite img").attr("src", "image/icon_favorite_hover.png");
                    }

                    $("#aheadOrderTime").text($scope.product.aheadOrderTime);
                    $("#serviceTime").text($scope.product.serviceTime);

                    $("#introduct").html($scope.product.description);
                    $("#notice").html($scope.product.attention);
                    var control = navigator.control || {};
                    if (control.gesture) {
                        control.gesture(false);
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

    var clientH=$(document).height();
    if($scope.isApp==2 && !easybuy.isWechat){
        clientH=clientH;
    }

    $(".tab-content .tab-pane").css("overflow-y","auto");
    //$(".tab-content .tab-pane").css("padding-bottom","50px");
    $(".tab-content .tab-pane").height(clientH-175);

    $(".scrollable-content").scroll(function (e) {
        if(isLoading){
            var sTop=$(".scrollable-content").scrollTop();
            var sHeight=$(".scrollable-content").height();
            var dHeight=$("#detail-content").height();
            
            //console.log(sTop+sHeight+":"+dHeight);
            if((sTop+sHeight+100)>=dHeight){
                loadObj.action(loadObj.GetStepCount());
            }

        }
    });
    var commentsFlash=$("#comments").parent();
    $(commentsFlash).scroll(function(){
        var sH=$(commentsFlash)[0].scrollHeight;
        var cH=$(commentsFlash).height();
        var tH=$(commentsFlash)[0].scrollTop;
        var mH=sH-(tH+cH);
        if(mH<=100){
            //loadObj.action(loadObj.GetStepCount());
        }
        //console.log(mH);

    });

    function closeLargeImage() {
        $(".mask").remove();
        $("#viewport").removeClass("larger");
        $(".slider_box").removeClass("larger");
        $(".list-group").removeClass("margin");
    }

    $scope.back = function () {
        $location.path("/products");
    }
    
    $scope.initScroll=function () {
        for(var i=0;i<$scope.product.detailImg.length;i++){
            var img=$scope.product.detailImg[i];
            var p=$scope.product;
            var $img = $('<img />');
            $img.attr("src", img);
            $img.attr("title", p.title);
                   
            var $slide = $('<div class="slide"></div>').append($img);
            $('#scroller').append($slide);
            $('#indicator').css("width",(15*$scope.product.detailImg.length-5)+"px");
            $('.slide').css("width",100/$scope.product.detailImg.length+"%");
            $('#scroller').css("width",100*$scope.product.detailImg.length+"%")
        }
        $("#spanCurrPage").html(1);
        $("#spanTotalsCount").html($scope.product.detailImg.length);

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
        var handler=function (e) { /*e.preventDefault();*/ };
        $scope.myScroll.on('scrollStart', function(){
            $("#viewport")[0].addEventListener('touchmove', handler, false);
        });
        $scope.myScroll.on('scrollEnd', function(){
            $("#spanCurrPage").html($scope.myScroll.currentPage.pageX+1);
             $("#viewport")[0].removeEventListener('touchmove',handler,false);            
        });
        
    };
});


app.register.controller('shuttleServiceController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window, $routeParams) {
    $scope.noInApp=function(){
        var arrButton = ["取消","去下载"];
        openDialog("仅支持在购轻松韩国App内预订", "", arrButton, null,
            function (r) {
                if (r) {
                   $location.path("/downloadApp");
                   $scope.$apply($location);
                }
            });
    }
    var loadObj = null;
    $scope.isApp=isApp($location);
    var appendComments=function(pageNum,p) {
        if($scope.page && pageNum>$scope.page.totalPage){
            //$(".pull-loading").html("上拉加载");
            return;
        }
        $scope.isloading = true;
        httpRequest.APIPOST('/comment/listComment', dataStringify("category="+p.category+"&platform=all&objectId="+p.id+"&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
            if(loadObj){
                loadObj.clear();
                $(".pull-loading").html("上拉加载");
            }
        });
    };
    $scope.pageNum=1;
    var isLoading=false;
    $scope.changeTap=function(type){
       if(type==3){
            isLoading=true;
            if(!loadObj){
                loadObj = new loadControl('#myLoadCanvas', function () {
                    $(".pull-loading").html("加载中...");
                    $scope.pageNum++;
                    appendComments($scope.pageNum,$scope.product);
                });
            }
       }else{
           isLoading=false;
       }
    };
    $scope.share=function(){
        var p=$scope.product;
        //shareTitle={{}}&shareText={{}}&shareUrl={{}}&shareImageUrl={{}}
        if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=3&shareTitle="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            //$scope.noInApp();
        }
    };

    $scope.go = function () {
       var p=$scope.product;
       if($scope.isApp){
            window.location.href = easybuy.appActivity + "?action=2001&price="+p.defaultPrice+"&promotePrice="+p.promotePrice+"&name="
            +p.name+"&shareText="+p.brief
            +"&shareUrl="+$location.absUrl()+"&shareImageUrl="+p.detailImg[0];
        }else{
            $scope.noInApp();
        }
    }

    httpRequest.APIPOST('/tour/getAirportsaveDetail', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        if (result && result.code == statusCode.Success) {
            $scope.product = result.result;

            if ($scope.product) {
                $scope.product.num = 1;
                appendComments(1,$scope.product);
                if ($scope.product.detailImg && $scope.product.detailImg.length > 0) {

                    $(".pager_control").removeClass("hide");
                    if ($scope.product.favorite == 1) {
                        $(".div-favorite img").attr("src", "image/icon_favorite_hover.png");
                    }

                   
                    $("#aheadOrderTime").text($scope.product.aheadOrderTime);
                    $("#serviceTime").text($scope.product.serviceTime);

                    $("#notice").html($scope.product.attention);
                     $("#introduct").html($scope.product.description);
                    var control = navigator.control || {};
                    if (control.gesture) {
                        control.gesture(false);
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

    var clientH=$(document).height();
    if($scope.isApp==2 && !easybuy.isWechat){
        clientH=clientH;
    }

    $(".tab-content .tab-pane").css("overflow-y","auto");
    $(".tab-content .tab-pane").css("padding-bottom","50px");
    //$(".tab-content .tab-pane").height(clientH-175);

    $(".scrollable-content").scroll(function (e) {
        if(isLoading){
            var sTop=$(".scrollable-content").scrollTop();
            var sHeight=$(".scrollable-content").height();
            var dHeight=$("#detail-content").height();
            
            //console.log(sTop+sHeight+":"+dHeight);
            if((sTop+sHeight+100)>=dHeight){
                loadObj.action(loadObj.GetStepCount());
            }

        }
    });
    var commentsFlash=$("#comments").parent();
    $(commentsFlash).scroll(function(){
        var sH=$(commentsFlash)[0].scrollHeight;
        var cH=$(commentsFlash).height();
        var tH=$(commentsFlash)[0].scrollTop;
        var mH=sH-(tH+cH);
        if(mH<=100){
            //loadObj.action(loadObj.GetStepCount());
        }
        //console.log(mH);

    });

    function closeLargeImage() {
        $(".mask").remove();
        $("#viewport").removeClass("larger");
        $(".slider_box").removeClass("larger");
        $(".list-group").removeClass("margin");
    }

    $scope.back = function () {
        $location.path("/products");
    }
    
    $scope.initScroll=function () {
        for(var i=0;i<$scope.product.detailImg.length;i++){
            var img=$scope.product.detailImg[i];
            var p=$scope.product;
            var $img = $('<img />');
            $img.attr("src", img);
            $img.attr("title", p.title);
                   
            var $slide = $('<div class="slide"></div>').append($img);
            $('#scroller').append($slide);
            $('#indicator').css("width",(15*$scope.product.detailImg.length-5)+"px");
            $('.slide').css("width",100/$scope.product.detailImg.length+"%");
            $('#scroller').css("width",100*$scope.product.detailImg.length+"%")
        }
        $("#spanCurrPage").html(1);
        $("#spanTotalsCount").html($scope.product.detailImg.length);

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
        var handler=function (e) { /*e.preventDefault();*/ };
        $scope.myScroll.on('scrollStart', function(){
            $("#viewport")[0].addEventListener('touchmove', handler, false);
        });
        $scope.myScroll.on('scrollEnd', function(){
            $("#spanCurrPage").html($scope.myScroll.currentPage.pageX+1);
             $("#viewport")[0].removeEventListener('touchmove',handler,false);            
        });
        
    };
});

app.register.controller('wifiServiceController0', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
    var isInApp=isApp($location);

    $scope.price="38.00";
    $scope.promotePrice="19.00";

    $scope.isloading = true;
    httpRequest.APIPOST('/wifi/list', dataStringify("platform=all"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
        $scope.isloading = false;
        if (result && result.code == statusCode.Success) {
            $scope.price=result.result[0].defaultPrice;
            $scope.promotePrice=result.result[0].promotePrice;
            $scope.wifiImg=result.result[0].img;
        }
    });

    $scope.isInApp=isInApp?true:false;
    $scope.needService=function(){
        if(isInApp){
            window.location.href = easybuy.appActivity + "?action=2002&price="+$scope.price+"&promotePrice="+$scope.promotePrice;
            return;            
        }else{
            var arrButton = ["取消", "去下载"];
            openDialog("WiFi租赁当前仅支持App内下单", "", arrButton, null,
                function (r) {
                    if (r) {
                        $location.path("/downloadApp");
                        $scope.$apply($location);
                    }
                });
        }
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

        var loadObj = new loadControl('#myLoadCanvas', function () {
            $(".pull-loading").html("加载中...");
            $scope.pageNum++;
            appendComments($scope.pageNum);
        });

        $(".scrollable-content").scroll(function () {
            if ($("#divAirportSave").length > 0 && $("#collapseFive").css("display")=="block") {
                if ($scope.isloading == false && $scope.page) {
                    advanceLoadCommon("#divAirportSave", loadObj, $scope.pageNum < $scope.page.totalPage);
                }
            }
        });

        function appendComments(pageNum) {
            $scope.isloading = true;
            httpRequest.APIPOST('/wifi/listComment', dataStringify("platform=all&objectId=1&pageNo="+pageNum+"&pageSize=10"), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
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
