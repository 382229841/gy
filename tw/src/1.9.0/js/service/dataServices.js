app.factory('httpRequest', ['$http', '$q', '$log', function ($http, $q, $log) {
    return {
        Request: function (requestType, api, requestData, header, service, isShowLoading) {
            var d = $q.defer();
            //requestType 'GET'
            var url;
            if (service) {
                url = service + api;
            }
            else {
                url = serviceUrl + api;
            }
            if(isShowLoading){
                showLoading();
            }                
            if (header) {
                $http.defaults.headers.common = header;
            }
            $http({ method: requestType, url: url, data: requestData}).
                success(
                function (data, status, headers, config) {
                    window.setTimeout(function () {
                        hideLoading();
                    }, 400);           
                    d.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    window.setTimeout(function () {
                        hideLoading();
                    }, 400);
                    $log.error("Error: ", headers);
                    d.reject(data);
                });
            return d.promise;
        },
        Get: function (api, header) {
            return this.Request("GET", api, "", header);
        },
        POST: function (api, requestData, header, isShowLoading) {
            return this.Request("POST", api, requestData, header, false, isShowLoading);
        },
        PUT: function (api, requestData, header) {
            return this.Request("PUT", api, requestData, header);
        },
        DELETE: function (api, header) {
            return this.Request("DELETE", api, "", header);
        },
        APIPOST: function (api, requestData, header, isShowLoading) {
            return this.Request("POST", api, requestData, header, javaServiceUrl, isShowLoading);
        }
    };
} ]);