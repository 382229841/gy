var app = angular.module('AngularUiExamples', [
  'ngRoute'
]);
var preventCache='?'+Math.random().toString(36);

app.config(function($routeProvider) {
	
  $routeProvider.when('/', {templateUrl: 'views/home.html'+preventCache, reloadOnSearch: false  });
  $routeProvider.when('/test',           {templateUrl: 'views/home2.html'+preventCache, reloadOnSearch: false});
  $routeProvider.otherwise({
	redirectTo: '/'
  });
  //$locationProvider.html5Mode(true);
});

app.controller('MainController', function($rootScope, httpRequest, $scope, $location,$window){
	$rootScope.winHeight=$(window).height();
	$rootScope.winWidth=$(window).width();
	$rootScope.menuHeight=$rootScope.winHeight-$("#header").height()-$("#footer").height();
	$rootScope.contentHeight=$rootScope.winHeight-$("#header").height()-$("#footer").height();
	$rootScope.contentWidth=$rootScope.winWidth-$("#main-left").width();
	
    $rootScope.$on('$routeChangeStart', function(){
		$rootScope.loading = true;
    });
    //alert(2);
    $rootScope.$on('$routeChangeSuccess', function(a,b,c){
  
	});
	
	$('.banner').unslider({
		dots: true,
		speed: 500,
		delay: 3000
	});

	$(window).resize(function(){
	});
	
	$(".introduce .items .item1").click(function(){
		$.scrollTo('#anchorScroll1',500);
	});
	$(".introduce .items .item2").click(function(){
		$.scrollTo('#anchorScroll2',800);
	});
	
	$(".introduce .items .item3").click(function(){
		$.scrollTo('#anchorScroll3',1000);
	});

});