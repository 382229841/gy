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