app.controller('myPhoneWXController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
      $scope.token=getToken().token;
      
      if($scope.token){
           httpRequest.APIPOST('/mine/index', dataStringify("platform=all&token="+$scope.token), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                    var userInfo=result.result;
                    $scope.mobile=userInfo.mobile;
                }else{
                    alertWarning(result.msg);
                }
            });
      }

      $scope.setPhone=function(){
            if (!$scope.mobile || $scope.mobile.toString().length < 9 || $scope.mobile.toString().length > 13) {
                alertWarning("请输入9~13位的手机号码");
                return;
            }
            var data="platform=all&token="+$scope.token+"&mobile="+$scope.mobile;

            showLoading();
            httpRequest.APIPOST('/user/bind', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                     alertWarning(result.msg);
                     var temp=getToken();
                     if(temp){
                        temp.mobile=$scope.mobile;
                        setToken(temp);
                     }
                     $location.path("/wechat/myAirportInfo");
                     $scope.$apply($location);
                }else{
                    alertWarning(result.msg);
                }
            });
      };
      if($scope.token){

      }
      $scope.back=function(){
          history.back();
      };
});
app.controller('myAirportWXController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
      $scope.token=getToken()?getToken().token:"";      
      if($scope.token){
            var data="platform=all&token="+$scope.token;
            showLoading();
            httpRequest.APIPOST('/wifi/getUserFlight', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                     hideLoading();
                     $scope.airportInfo=result.result;
                     if($scope.airportInfo==null){
                         $scope.airportInfo=false;
                         $scope.isShow=true;
                     } 
                     if($scope.airportInfo){
                         $scope.isShow=false;
                     }                
                }else{
                    hideLoading();
                    alertWarning(result.msg);
                }
            });
      }else{
          $scope.isShow=true;
      }
      $scope.back=function(){
          history.back();
      };
      $scope.goWifi=function(){
          $location.path("/wechat/myWiFi");
      };
});
app.controller('myWiFiWXController', function ($rootScope, $scope, httpRequest, dataStringify, analytics, $location, $window) {
      var platform="all";
      if($location.search() && $location.search().platform){
          var p=$location.search().platform;
          if(p=="android" || p=="ios"){
               $scope.token=$location.search().token
               if(!$scope.token){
                   $scope.token=getToken()?getToken().token:"";
               }else{
                   platform=p;
               }
          }else{
              $scope.token=getToken()?getToken().token:"";
          }
      }else{
          $scope.token=getToken()?getToken().token:"";
      }    
      //$scope.token="366a387b3a8575f1c4af953c30660986e4cfdc3581f32508484d5e194e9560fb8f6545f90c0a93b0449ec56cb955c12cdd21b3b99d954eb049082430653955f8b6aecd29e1fe7b0d";  
      if($scope.token){
            var data="platform="+platform+"&token="+$scope.token;
            showLoading();
            httpRequest.APIPOST('/wifi/getServiceDetail', dataStringify(data), { "content-type": "application/x-www-form-urlencoded" }).then(function (result) {
                if (result && result.code == statusCode.Success) {
                     hideLoading();
                     $scope.wifiInfo=result.result;
                     //alert(angular.toJson($scope.wifiInfo));
                     $scope.wifiInfo.backInfo.time=$scope.wifiInfo.backInfo.time.replace("01:00","24:00");
                     $scope.wifiInfo.getInfo.time=$scope.wifiInfo.getInfo.time.replace("01:00","24:00");
                    /* $scope.T2=$scope.wifiInfo.getInfo.address.indexOf("桃园机场T2")>-1?true:false;
                     $scope.T1=$scope.wifiInfo.getInfo.address.indexOf("桃园机场T1")>-1?true:false;

                     $scope.GX=$scope.wifiInfo.getInfo.address.indexOf("高雄")>-1?true:false;
                     $scope.SS=$scope.wifiInfo.getInfo.address.indexOf("松山")>-1?true:false;
                     */
                }else{
                    hideLoading();
                    alertWarning(result.msg);
                }
            });
      }else{
          
      }
      $scope.swipe=function(){
          $scope.swipeFlag=$scope.swipeFlag ? false : true;
          $scope.$apply($scope.swipeFlag);
      };

      var offset=0;
      $scope.swipeFlag=true;
      $(".scrollable-content000").scroll(function () {
          offset=$(".scrollable-content").scrollTop();
         // alert(offset);
          if(offset>142){
                $scope.swipeFlag=$scope.swipeFlag ? false : true;
                $scope.$apply($scope.swipeFlag);
                $(".scrollable-content").scrollTop(0);
          }
      });
});