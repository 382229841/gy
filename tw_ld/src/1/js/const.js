(function () {
    //var _const = {};
    //easybuy.Const = _const;
    //_const.xx = xx;
    easybuy.version="1.8.8";
    
    easybuy.Storage = { 
		OrderProducts: "Order.OrderProducts", 
		Address: "Global.Address", 
		AddressTemp: "Address.Temp", 
		MobileInquiry: "Inquiry.Mobile", 
		UserInfo: "Global.UserInfo",
		UserInfoService:"Global.UserInfoService", 
		Cart: "Global.Cart", 
		DownloadAppClose: "Global.DownloadAppClose", 
		oAuth: "Global.oAuth", 
		Order:"Global.Order", 
		Token:"Global.TokenLD",
		AppToken:"Global.AppToken", 
		WxSdkToken:"Global.WxSdkToken", 
		Find:"Global.Find",
		SearchLocalItems:"Index.SearchLocalItems"
	};

    easybuy.PaymentMethods = { AlipayWallet: 0, AlipayWeb: 1, WechatPay: 2 };

    easybuy.Payments = [{ id: easybuy.PaymentMethods.AlipayWeb, name: "支付宝", instruction: "推荐未安装支付宝钱包用户使用", img: "Payment_Method_02.png" },
        { id: easybuy.PaymentMethods.WechatPay, name: "微信支付", instruction: "推荐微信支付用户使用", img: "Payment_Method_03.png"}];

    easybuy.ProgramTypes = { Default: 0, Web: 1, APP: 2 };

    easybuy.appProducrUrl = "gougoodsdetail://";
    easybuy.appMifiBuyUrl = "goumifi://";
    easybuy.appOpenUrl = "goutaiwan://";
    easybuy.appActivity= "gouactivity://";

    /*easybuy.sinaAppId="3562669955";
    easybuy.sinaAppKey="243aff0e59f6d1c662d3e0a94086b4c9";
    easybuy.qqAppId="101184564";
    easybuy.qqAppKey="0a07beb4014e2a6f6192a756ac98c902";
    */
    easybuy.sinaAppId="3578711925";
    easybuy.sinaAppKey="0d82b843936b9e38a33a832d43396374";
    easybuy.qqAppId="101183575";
    easybuy.qqAppKey="ccc9129f99cdf8888a6f3225bd579aaa";
    easybuy.weixinAppId="wxb9379aa3ae5ab5c6";
    easybuy.weixinAppKey="8536b43cdb4f6db5a082d79b65de6b15";
} ());