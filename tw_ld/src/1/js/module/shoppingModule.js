
function setCloseDownloadApp() {
    if (localStorage) {
        try {
            localStorage.setItem(easybuy.Storage.DownloadAppClose, "1");
            return;
        }
        catch (e) {
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
    easybuy.parameter.DownloadAppClose = "1";
}

function getCloseDownloadApp() {
    if (localStorage && localStorage.getItem(easybuy.Storage.DownloadAppClose) == "1") {
        return true;
    }

    if (easybuy.parameter.DownloadAppClose == "1")
        return true;

    return false;
}


function getSearchLocalItems() {
    if (localStorage && localStorage.getItem(easybuy.Storage.SearchLocalItems)) {
		var items=JSON.parse(localStorage.getItem(easybuy.Storage.SearchLocalItems));
		return items;
    }

    return null;
}

function setSearchLocalItems(item) {
    if (localStorage) {
        try {
            if (item) {
				var items=JSON.parse(localStorage.getItem(easybuy.Storage.SearchLocalItems));
				var newItems=[];
				
				var isContain=false;
				if(!items){
					newItems.push({"value":item});
					localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems));
					return;
				}
				if(items && items.length<1){
					newItems.push({"value":item});
					localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems));
					return;
				}
				var index=0;
				for(var i=0;i<items.length;i++){
					if(items[i].value==item){
						isContain=true;
						index=i;
						break;
					}
				}
				if(!isContain){
					newItems.push({"value":item});
					for(var i=0;i<items.length;i++){
						newItems.push(items[i]);
					}
					if(newItems.length>6){
						newItems.slice(0,6);
						localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems.slice(0,6)));
					}else{
						localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems));
					}
				}else{
					newItems.push(items[index]);
					for(var i=0;i<items.length;i++){
						if(i!=index){
							newItems.push(items[i]);
						}
					}
					localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems));
				}
            }
            else {
                localStorage.removeItem(easybuy.Storage.SearchLocalItems);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.SearchLocalItems);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function getCart() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Cart)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.Cart));
    }

    if (easybuy.parameter.Cart)
        return easybuy.parameter.Cart;

    return null;
}

function addToCart(product) {
    if (product) {
        var cartProducts = getCart();
        if (!cartProducts) {
            cartProducts = new Array();
        }
        addProductToCart(cartProducts, product);

        setCart(cartProducts);
    }
}

function setCart(cartProducts) {
    if (localStorage) {
        try {
            if (cartProducts) {
                localStorage.setItem(easybuy.Storage.Cart, JSON.stringify(cartProducts));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Cart);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Cart);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
    easybuy.parameter.Cart = null;
    easybuy.parameter.Cart = cartProducts;
}

function addProductToCart(cartProducts, product) {
    if (!product.num) {
        product.num = 1;
    }
    var isContain = false;
    for (var i = 0; i < cartProducts.length; i++) {
        if (cartProducts[i].id == product.id) {
            cartProducts[i].num += product.num;
            isContain = true;
            break;
        }
    }
    if (!isContain) {
        var cartProduct = $.extend(true,{},product);
        var cartGood={};
        cartGood.id=cartProduct.id;
        cartGood.num=cartProduct.num;
        cartGood.checked=true;
        cartProducts.push(cartGood);
    }
}

function setProductsNumInCart(products) {
    if (products && products.length > 0) {
        var cartProducts = getCart();
        if (cartProducts) {
            for (var i = cartProducts.length - 1; i >= 0; i--) {
                for (var j = 0; j < products.length; j++) {
                    for(var k=0; k< products[j].goodsList.length; k++){ 
                        if (cartProducts[i].id == products[j].goodsList[k].id) {
                            cartProducts[i].num = products[j].goodsList[k].quantity;
                            cartProducts[i].checked = products[j].goodsList[k].checked;
                            break;
                        }
                    }
                }
            }
            setCart(cartProducts);
        }
    }
}

function removeCartProducts(products) {
    if (products && products.length > 0) {
        var cartProducts = getCart();
        if (cartProducts) {
            for (var i = cartProducts.length - 1; i >= 0; i--) {
                for (var j = 0; j < products.length; j++) {
                    if (cartProducts[i].id == products[j].id) {
                        cartProducts.splice(i, 1);
                        break;
                    }
                }
            }
            setCart(cartProducts);
        }
    }
}

function getCartNum() {
    var cartProducts = getCart();
    var num = 0;
    if (cartProducts && cartProducts.length > 0) {
        for (var i = 0; i < cartProducts.length; i++) {
            num += cartProducts[i].quantity;
        }
    }
    return num;
}
function viewOrderDetail($location) {
    var addressInfo = getUserInfo();
    if (addressInfo && addressInfo.mobile) {
        $location.path("/orderDetail");
        return;
    }
    $location.path("/orderInquiry");
}

function getOrder() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Order)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.Order));
    }

    return null;
}

function setOrder(orderProducts) {
    if (localStorage) {
        try {
            if (orderProducts) {
                localStorage.setItem(easybuy.Storage.Order, JSON.stringify(orderProducts));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Order);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Order);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function getFind() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Find)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.Find));
    }

    return null;
}

function setFind(find) {
    if (localStorage) {
        try {
            if (find) {
                localStorage.setItem(easybuy.Storage.Find, JSON.stringify(find));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Find);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Find);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function removeOrder() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Order);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Order);
        }
    }
}

function setAddressTemp(addressInfo) {
    if (sessionStorage) {
        try {
            if (addressInfo) {
                sessionStorage.setItem(easybuy.Storage.AddressTemp, JSON.stringify(addressInfo));
                addressInfo = null;
            }
            return;
        }
        catch (e) {
            sessionStorage.removeItem(easybuy.Storage.AddressTemp);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
    easybuy.parameter.AddressTemp = null;
    easybuy.parameter.AddressTemp = addressInfo;
}

function getAddressTemp() {
    if (sessionStorage && sessionStorage.getItem(easybuy.Storage.AddressTemp)) {
        return JSON.parse(sessionStorage.getItem(easybuy.Storage.AddressTemp));
    }

    if (easybuy.parameter.AddressTemp)
        return easybuy.parameter.AddressTemp;

    return null;
}

function clearAddressTemp() {
    if (sessionStorage) {
        sessionStorage.removeItem(easybuy.Storage.AddressTemp);
    }
    easybuy.parameter.AddressTemp = null;
}

function generateAddressTemp($scope, timeSelector,regionSelector) {
    return {"returnAirport":$scope.returnAirport,"returnAirportId":$scope.returnAirportId,"returnFlightno":$scope.returnFlightno,"shopName":$scope.shopName,"shopPhone":$scope.shopPhone,"nick_name": $scope.name, "mobile": $scope.mobile, "flight_id": $scope.flight != null ? $scope.flight.id : null, "terminal": $scope.flight != null ? $scope.flight.terminal : null, "take_off_time": $(timeSelector).val(),"agentName":$scope.agentName,"agentRegionIds": $scope.agentRegionIds || $(regionSelector).attr("data"),"agentRegion": $scope.agentRegion || $(regionSelector).val(),"agentMobile":$scope.agentMobile,"agentAddress":$scope.agentAddress,"agentComment":$scope.agentComment };
}

var userModel={
	bind: '',
	category: '',
	headimgurl: '',
	incomeAmount: '',
	nickname: '',
	openId: '',
	realName: '',
	source: '',
	timestamp: '',
	token: '',
	version: ''
};
function getUserInfo() {
    if (localStorage && localStorage.getItem(easybuy.Storage.UserInfo)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.UserInfo));
    }

    if (easybuy.parameter.UserInfo)
        return easybuy.parameter.UserInfo;

    return null;
}

function setUserInfo(userInfo) {
    if (localStorage) {
        try {
            localStorage.setItem(easybuy.Storage.UserInfo, JSON.stringify(userInfo));
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.UserInfo);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
    easybuy.parameter.UserInfo = null;
    easybuy.parameter.UserInfo = userInfo;
}

function getUserInfoService() {
    if (localStorage && localStorage.getItem(easybuy.Storage.UserInfoService)) {
        return JSON.parse(localStorage.getItem(easybuy.Storage.UserInfoService));
    }

    return null;
}

function setUserInfoService(userInfo) {
    if (localStorage) {
        try {
            localStorage.setItem(easybuy.Storage.UserInfoService, JSON.stringify(userInfo));
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.UserInfoService);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function getToken() {
    if (localStorage && localStorage.getItem(easybuy.Storage.Token)) {
        var token=JSON.parse(localStorage.getItem(easybuy.Storage.Token));
        var currentTimestamp=(new Date()).getTime();

        if(token && token.timestamp && token.version){
            var temp=currentTimestamp-token.timestamp;
            var expire=7*24*60*60*1000;
            if(temp>0 && temp<expire && easybuy.version==token.version){
                token=token;
            }else{
                localStorage.removeItem(easybuy.Storage.Token);
                token=null;
            }
        }else{
            localStorage.removeItem(easybuy.Storage.Token);
            token=null;
        }
        return token;
    }

    return null;
}
function setToken(token) {
    if (localStorage) {
        try {
            if (token) {
                token.timestamp=(new Date()).getTime();
                token.version=easybuy.version;
                localStorage.setItem(easybuy.Storage.Token, JSON.stringify(token));
            }
            else {
                localStorage.removeItem(easybuy.Storage.Token);
            }
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Token);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}
function removeToken() {
    if (localStorage) {
        try {           
            localStorage.removeItem(easybuy.Storage.Token);
            return;
        }
        catch (e) {
            localStorage.removeItem(easybuy.Storage.Token);
        }
    }
}

function setWxSdkToken(wxSdkToken) {
    if (sessionStorage) {
        try {
            if (wxSdkToken) {
                sessionStorage.setItem(easybuy.Storage.WxSdkToken, JSON.stringify(wxSdkToken));
                wxSdkToken = null;
            }
            return;
        }
        catch (e) {
            sessionStorage.removeItem(easybuy.Storage.WxSdkToken);
            alertWarning("你可能开启了浏览器的无痕浏览模式，请关闭无痕浏览模式");
        }
    }
}

function getWxSdkToken() {
    if (sessionStorage && sessionStorage.getItem(easybuy.Storage.WxSdkToken)) {
        return JSON.parse(sessionStorage.getItem(easybuy.Storage.WxSdkToken));
    }
    return null;
}

function redirectLogin($location,path){
    if(easybuy.isWechat){
        $location.path("/wechatOauth/"+path);
    }else{
        $location.path("/myProfile/"+path);
    }
}
