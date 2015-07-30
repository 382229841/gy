<!DOCTYPE html>
<html ng-app="EasyBuy" ng-controller="mainController">
<head>
    <meta charset="utf8" />
    <title>购轻松</title>
    <meta name="keywords" content="购轻松,购轻松台湾,购轻松手机,旅游,台湾">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
    <meta name="apple-mobile-web-app-status-bar-style" content="yes" />
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />	
	<link type="image/x-icon" rel="shortcut icon" href="image/favicon.png">
    <!-- CSS================================================== -->
	<?php
		$preventCache=201505271528;
	?>
    <link href="css/easybuy.min.css?<?php echo $preventCache;?>" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="css/landscape.css" media="all and (orientation:landscape)" type="text/css">	
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>	
	<script src="lib/angular.min.js?<?php echo $preventCache;?>" type="text/javascript"></script>
	<script src="lib/libs.min.js?<?php echo $preventCache;?>" type="text/javascript"></script>
    <script src="js/config.js?<?php echo $preventCache;?>" type="text/javascript"></script>
    <script src="js/app.min.js?<?php echo $preventCache;?>" type="text/javascript"></script>
    <script src="js/mains.min.js?<?php echo $preventCache;?>" type="text/javascript"></script>
    <script src="js/controller/shoppingController.min.js?<?php echo $preventCache;?>" type="text/javascript"></script>
	<script>
		var _hmt = _hmt || [];
		(function() {
		    var hm = document.createElement("script");
		    hm.src = "//hm.baidu.com/hm.js?a247baefc371d26011204710b1a6342d";
		    var s = document.getElementsByTagName("script")[0]; 
		    s.parentNode.insertBefore(hm, s);
		})();
	</script>
</head>
<body>
    <div class="app">
        <div class="app-body" ng-class="{loading: loading}">
            <div ng-show="loading" class="app-content-loading"><img src="image/favicon.png" class="loading-spinner-logo"/><i class="loading-spinner fa fa-circle-o-notch fa-spin"></i></div>
            <ng-view class="app-content" ng-hide="loading"></ng-view>
        </div>
        <div class="loadingDiv">     
            <div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>
        </div>                
    </div>
</body>
</html>