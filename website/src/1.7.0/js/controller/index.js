app.factory('httpRequest', ['$http', '$q', '$log', function ($http, $q, $log) {
    return {
        Request: function (requestType, api, requestData,isShowLoading, header) {
            var d = $q.defer();
			var isCache=false;
            var url;
            url = serviceUrl + api;
            if(isShowLoading){
                showLoading();
            }                
            if (header) {
                $http.defaults.headers.common = header;
            }else{
                //$http.defaults.headers.common = { "content-type": "application/x-www-form-urlencoded" };
                $http.defaults.headers.common = { "content-type": "application/json" };
            }
            $http({ method: requestType, url: url, data: angular.toJson(requestData), cache :isCache }).
				success(
				function (data, status, headers, config) {
					hideLoading();
					if(data.status==1){
						d.resolve(data.data);
					}else{
						d.resolve(data.msg);
					}
					
				}).
				error(function (data, status, headers, config) {
					hideLoading();
					$log.error("Error: ", headers);
					d.reject(data);
			});
           
            return d.promise;
        },
        Get: function (api,requestData, isShowLoading, header) {
            return this.Request("GET", api, requestData, isShowLoading,header);
        },
        POST: function (api, requestData, isShowLoading,header) {
            return this.Request("POST", api, requestData, isShowLoading,header);
        },
        PUT: function (api, requestData, isShowLoading,header) {
            return this.Request("PUT", api, requestData, isShowLoading,header);
        },
        DELETE: function (api, requestData, isShowLoading,header) {
            return this.Request("DELETE", api, requestData, isShowLoading,header);
        }
    };
} ]);
app.controller('homeController', function($rootScope, $scope, $location, $routeParams, httpRequest){
		
		
		
		//$('.half').smoove({offset:'40%'});
		//httpRequest.Get(dataStringify('/user/cleanerLBS',data),{}).then(function (result) {
			  
		//});
	//}
});