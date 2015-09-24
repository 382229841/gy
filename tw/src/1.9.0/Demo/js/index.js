angular.module('eBay', [])
    .controller('loginController', ['$scope', function ($scope) {

    }])

    .controller('regController', ['$scope', function ($scope) {

    }])

    .service('productData', function () {
        return [
            {
                name:'雪花秀'
            },
            {
                name:'雪花秀雪花秀'
            },
            {
                name:'雪花秀'
            },
            {
                name:'雪花秀雪花秀'
            },
            {
                name:'雪花秀'
            },
            {
                name:'雪花秀'
            },{
                name:'秀'
            },
            {
                name:'仲秋'
            }
        ];
    })
    .controller('productController', function ($scope,productData) {
        $scope.productData = productData;
    })