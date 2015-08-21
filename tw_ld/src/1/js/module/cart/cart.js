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