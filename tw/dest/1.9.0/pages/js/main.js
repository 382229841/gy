var serviceUrl="http://test.yhiker.com/api";
var statusCode = {
    Success: 0,
    error: -1
}
function getQueryStringByName(name){
	 var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
	 if(result == null || result.length < 1){
		 return "";
	 }
	 return result[1];

}
function ajaxRequest(api,requestData,callback){
	var rdata='';

	if (requestData) {
		requestData=requestData+"&platform=all";
		var datas = requestData.split('&');
		datas.sort();
		rdata= requestData + '&sign=' + $.md5(datas.join('&') + '&hikergou%@#');
	}
	 
	 $.ajax({
        url: serviceUrl+api,
        type: "post",
		data:rdata,
		async: true,
		dataType:'json',
        success: function(result) {
			if(callback){
			   callback(result);
		   }
		},
        cache: true,
        timeout: 5000,
        error: function(result) {
            alert(result.msg);
        }
    });
}
function FAQTemplate(items){
	var html="";
	for(var i=0;i<items.length;i++){
		html=html+
		"<div class=\"question\">"+
				"<span class=\"qfa-title\">Q：</span>"+
				"<span class=\"qfa-content\">"+items[i].question+"</span>"+
			"</div>"+

			"<div class=\"answer\">"+
				"<span class=\"qfa-title\">A：</span>"+
				"<span class=\"qfa-content\">"+items[i].answer+"</span>"+

			"</div>";
		

	}
	return html;
}