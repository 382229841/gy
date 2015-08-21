var easybuy = {};
easybuy.parameter = {};
easybuy.isWechat = isWeixin();
easybuy.version = "1.6";

var forApp={};
forApp.shareSuccess=function(token,category,id,channel){
	//category:0-活动,1-商品,2-发现,3-wifi,4-机场存送,5-接送机,6-一日游,7-门票,8-其他
	debugModel("token:"+token+"category:"+category+"id:"+id+"channel:"+channel);
};
forApp.shareFailed=function(token,category,id,channel){
	debugModel("token:"+token+"category:"+category+"id:"+id+"channel:"+channel);
};
forApp.loginSuccess=function(token){
	debugModel("token:"+token);
};

window.showLoading = function () {
    $(".loadingDiv").css("display", "block");
};

window.hideLoading = function () {
    $(".loadingDiv").css("display", "none");
};

function refixNavBottom() {
    //when open with webchat in iphone, the height maybe wrong, so change the bottom to make it fixed
    if ($(".nav-bottom").length > 0) {
        if (window.screen.availHeight < $('body').height()) {
            $(".nav-bottom-background").addClass("m-bottom");
            $(".nav-bottom").addClass("m-bottom");
        }
        else {
            $(".nav-bottom-background").removeClass("m-bottom");
            $(".nav-bottom").removeClass("m-bottom");
        }
    }
}

var currYear = (new Date()).getFullYear();	
			var opt={};
			opt.date = {preset : 'date'};
			//opt.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};
			opt.Default = {
				theme: 'android-ics light', //皮肤样式
		        display: 'modal', //显示方式 
		        mode: 'scroller', //日期选择模式
				lang:'zh',
		        startYear:currYear - 10, //开始年份
		        endYear:currYear + 10 //结束年份
			};

function advanceLoad(contentSelector, loadObj, noEnd) {
    if (noEnd) {
        if ($(contentSelector).height() - $(".product-list>.scrollable-content").scrollTop() - $('#myLoadCanvas').height() > $(".product-list>.scrollable-content").height()) {
            loadObj.clear();
            $(".pull-loading").html("上拉加载");
        }
        else {
            if ($(contentSelector).height() - $(".product-list>.scrollable-content").scrollTop() - $('#myLoadCanvas').height() * 7 / 8 <= $(".product-list>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 6);
            }
            if ($(contentSelector).height() - $(".product-list>.scrollable-content").scrollTop() - $('#myLoadCanvas').height() / 2 <= $(".product-list>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 2);
            }
            if ($(contentSelector).height() - $(".product-list>.scrollable-content").scrollTop() - $('#myLoadCanvas').height() * 3 / 8 <= $(".product-list>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() * 3 / 4);
            }
            if ($(contentSelector).height() - $(".product-list>.scrollable-content").scrollTop() - 5 <= $(".product-list>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount());
            }
        }
    }
}

function advanceQueryLoad(contentSelector, loadObj, noEnd) {
    if (noEnd) {
        if ($(contentSelector).height() - $(".product-list-query>.scrollable-content").scrollTop() - $('#queryLoadCanvas').height() > $(".product-list-query>.scrollable-content").height()) {
            loadObj.clear();
            $(".query.pull-loading").html("上拉加载");
        }
        else {
            if ($(contentSelector).height() - $(".product-list-query>.scrollable-content").scrollTop() - $('#queryLoadCanvas').height() * 7 / 8 <= $(".product-list-query>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 6);
            }
            if ($(contentSelector).height() - $(".product-list-query>.scrollable-content").scrollTop() - $('#queryLoadCanvas').height() / 2 <= $(".product-list-query>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 2);
            }
            if ($(contentSelector).height() - $(".product-list-query>.scrollable-content").scrollTop() - $('#queryLoadCanvas').height() * 3 / 8 <= $(".product-list-query>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() * 3 / 4);
            }
            if ($(contentSelector).height() - $(".product-list-query>.scrollable-content").scrollTop() - 5 <= $(".product-list-query>.scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount());
            }
        }
    }
}

function advanceLoadCommon(contentSelector, loadObj, noEnd) {
    if (noEnd) {
        if ($(contentSelector).height() - $(".scrollable-content").scrollTop() - $('#myLoadCanvas').height() > $(".scrollable-content").height()) {
            loadObj.clear();
            $(".pull-loading").html("上拉加载");
        }
        else {
            if ($(contentSelector).height() - $(".scrollable-content").scrollTop() - $('#myLoadCanvas').height() * 7 / 8 <= $(".scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 6);
            }
            if ($(contentSelector).height() - $(".scrollable-content").scrollTop() - $('#myLoadCanvas').height() / 2 <= $(".scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() / 2);
            }
            if ($(contentSelector).height() - $(".scrollable-content").scrollTop() - $('#myLoadCanvas').height() * 3 / 8 <= $(".scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount() * 3 / 4);
            }
            if ($(contentSelector).height() - $(".scrollable-content").scrollTop() - 5 <= $(".scrollable-content").height()) {
                loadObj.action(loadObj.GetStepCount());
            }
        }
    }
}


function addComment(nickName, avatar, content, date) {
    var objDiv = document.createElement("div");
    objDiv.setAttribute("class", "list-group-item media ng-scope");

    var objDivAvatar = document.createElement("div");
    objDivAvatar.setAttribute("class", "pull-left avatar");
    objDivAvatar.setAttribute("style", "background-image: url('" + (avatar == null || avatar.toString().trim() == "" ? "image/icon_avatar.png" : avatar)  + "');");
    objDiv.appendChild(objDivAvatar);

    var objCommentBody = document.createElement("div");
    objCommentBody.setAttribute("class", "media-body");
    objDiv.appendChild(objCommentBody);

    var objName = document.createElement("span");
    objName.setAttribute("class", "dark-red avatar-name ng-binding");
    objName.innerText = nickName;
    objCommentBody.appendChild(objName);

    var objDate = document.createElement("span");
    objDate.setAttribute("class", "comment-date ng-binding");
    objDate.innerText = date;
    objCommentBody.appendChild(objDate);

    var objComment = document.createElement("div");
    objComment.setAttribute("class", "comment-content ng-binding");
    objComment.innerText = content;
    objCommentBody.appendChild(objComment);

    if (document.getElementById("divArticleComment").childNodes.length > 0) {
        document.getElementById("divArticleComment").insertBefore(objDiv, document.getElementById("divArticleComment").firstChild);
    }
    else {
        document.getElementById("divArticleComment").appendChild(objDiv);
    }

    var count = 0;
    if (document.getElementById("spanTotalCount").innerText != '') {
        var value = parseInt(document.getElementById("spanTotalCount").innerText);
        if (!isNaN(value)) {
            count = value;
        }
    }
    document.getElementById("spanTotalCount").innerText = count + 1;
}

function advanceComplete(contentSelector) {
    if (!$(".complete-bar").hasClass("ng-hide")) {
        if ($(contentSelector).height() - $(".scrollable-content").scrollTop() <= $(".scrollable-content").height()) {
            $(".complete-bar").addClass("once");
        }
        if ($(contentSelector).height() - $(".scrollable-content").scrollTop() > $(".scrollable-content").height()) {
            $(".complete-bar").removeClass("once");
            $(".complete-bar").removeClass("complete-to-bottom");
        }
    }
}

function bindAlreadyComplete(contentSelector) {
    $(".scrollable-content").unbind("swipeup").bind("swipeup", function () {
        if ($(contentSelector).height() - $(".scrollable-content").scrollTop() <= $(".scrollable-content").height()) {
            if ($(".complete-bar").hasClass("once")) {
                $(".complete-bar").addClass("complete-to-bottom");
            }
        }
    });
}

function setProductHeight(selector) {
    $(selector).css("max-height", $(selector).width() / 640 * 450);
}

function clearProductHeight(selector) {
    $(selector).css("max-height", "100%");
}

function fillParentCity() {
	fillSelectedCity('#pAddress_dummy', '#agentRegion');
}

function fillSelectedCity(addressDummy, toCity) {
	var address = $(addressDummy).val().trim();
	var addInfos = address.split(' ') || [];
	var addNames="";
	var ids="";
	for(var i=0;i<addInfos.length;i++){
		var temp=addInfos[i].split('|');
		if(i<addInfos.length-1){
			addNames=addNames+temp[0]+" ";
			ids=ids+temp[1]+",";
		}else{
			addNames=addNames+temp[0];
			ids=ids+temp[1];
		}
		
	}
	$(toCity).val(addNames);
	$(toCity).attr("data", ids);
	var addressInfo=getAddressTemp();
	addressInfo.agentRegion=addNames;
	addressInfo.agentRegionIds=ids;
	setAddressTemp(addressInfo);
}

function fillCitySelector(selector,data) {
    $(selector).empty();
    var provinces=data.province || [];
    var cities=data.city || [];
    var states=data.district || [];
    if(provinces && provinces.length>1){
    	for(var i=0;i<provinces.length;i++){
			var liProvince = $('<li></li>');			
            var cityArr = getCity(provinces[i].id,cities);
            var ulCities = $('<ul></ul>');
			if (cityArr.length > 0) {
                liProvince.attr("data-val", provinces[i].name + '|' + provinces[i].id);
           		liProvince.html(provinces[i].name);
                for (var j = 0; j < cityArr.length; j++) {
                    var cityCode = cityArr[j].id;
                    var cityName = cityArr[j].name;
                    var liCity = $('<li data-val="' + cityName + '|' + cityCode + '">' + cityName + '</li>');
                    
					var stateArr=getState(cityCode,provinces[i].id,states);
					var ulStates = $('<ul></ul>');
					if(stateArr.length>0){
						for(var k=0;k<stateArr.length;k++){
							var stateCode = stateArr[k].id;
							var stateName = stateArr[k].name;
							var liState = $('<li data-val="' + stateName + '|' + stateCode + '">' + stateName + '</li>');
							ulStates.append(liState);
						}
					}
					liCity.append(ulStates);
					ulCities.append(liCity);
                }
            }
            else {
                liProvince.attr("data-val", provinces[i].name);
                liProvince.html(provinces[i].name);
                var liCity = $('<li data-val="' + provinces[i].name + '|' + provinces[i].id + '">' + provinces[i].name + '</li>');
                ulCities.append(liCity);
            }
			liProvince.append(ulCities);
            $(selector).append(liProvince);

    	}
    }    
}

// get city data base on province
function getCity(pid,cities) {
    var cityArr = new Array();
    for (var i = 0; i < cities.length; i++) {
        if (cities[i].pid==pid) {
            cityArr.push(cities[i]);
        }
    }
    return cityArr;
}
// get city data base on province
function getState(cid,pid,states) {
    var stateArr = new Array();
    for (var i = 0; i < states.length; i++) {
        if (states[i].cid==cid && states[i].pid==pid) {
            stateArr.push(states[i]);
        }
    }
    return stateArr;
}


function initActivitCarousel(acts,isLoaded){
	/*var isHave=true;
	if(acts==null || !acts.length || acts.length<1){
		acts=[{},{},{}];
		isHave=false;
	}
	$('#index-slider .pic_group').empty();
	$("#index-serial-number").empty();
	for(var i=0;i<acts.length;i++){
		var act=acts[i];				
		var $img = $('<img />');
		var $div = $('<div class="item-block"></div>');
		var $a=$('<a />');
		var $item = $('<div class="item"></div>');
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');
		if(isLoaded && isHave){
			$img.attr("src", "/image/activity/2-"+(i+1)+".png");				
			$a.attr("href","#/product/"+act.goodsId);
			//$a.attr("target","_blank");
			$a.attr("title",act.name);
			$a.append($img);
			$item.append($a);
		}else{
			$img.attr("src","/image/activity/2-"+(i+1)+".png");
			$a.append($img);
			$item.append($a);
		}

		$('#index-slider .pic_group').append($item);

		var $span=$("<span />");
		$span.addClass("point");
		$("#index-serial-number").append($span);
	}
	if(acts.length<2){
		$("#index-serial-number").addClass("hide");
	}*/
	$('#index-slider').cycle({
		fx: 'scrollHorz',
		pager: '#pagination',
		speed: 300,
		timeout: 3000,
		stopAutoPlay: false,
		slideExpr: '.item',
		pagerAnchorBuilder: null,
		prev: '.arrow_l',
		next: '.arrow_r',
		clearCycleTimeOutBefore: true,
		startingSlide: 0,
		pageTurnEvent: function (i) {
			$("#index-serial-number span").removeClass("selected");
			$($("#index-serial-number span")[i]).addClass("selected");
		}                    
	});
}
function initActivitDescription(act,isLoaded){
	//$("#activity-navigator-1").empty();
	if(!isLoaded){
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');		
		$("#activity-navigator-1").css("min-height","9em");
		var $img = $('<img />');
		$img.attr("src", "/image/activity/1.png");
		$("#activity-navigator-1").append($img);
	}else{
		var $img = $('<img />');
		$img.attr("src", act.img);
		$("#activity-navigator-1").append($img);
	}
}
function initActivitProducts(ps,isLoaded){
	//$("#activity-navigator-3").empty();
	if(!isLoaded){
		//////////////////////////////////////////////////////	1		
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-1.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3").append($div);
		//////////////////////////////////////////////////////	2		
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-3.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title2.png");
		$imgTitle.addClass("title-img2");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3").append($div);
		//////////////////////////////////////////////////////	3		
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-5.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3").append($div);
		//////////////////////////////////////////////////////	4		
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-2.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);
		
		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-4.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title2.png");
		$imgTitle.addClass("title-img2");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-6.png");
		$a.append($img);
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);
							
		$("#activity-navigator-3").append($div);


		var $divClear=$('<div class="clear"></div>');
		$("#activity-navigator-3").append($divClear);

	}else{
		if(ps && ps.length){
			if(ps.length==1){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);
			}else if(ps.length==2){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[3]).text(ps[1].goodsName);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);
			}else if(ps.length==3){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3 .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				
				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);
			}else if(ps.length==4){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3 .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3 .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);
				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[4]).text(ps[3].goodsName);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[2]).text("."+ps[4].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[2]).text(ps[4].price1.split('.')[0]).append(a);
			}else if(ps.length==5){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3 .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3 .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);
				$($("#activity-navigator-3 .activity-product a")[2]).attr("href","#/product/"+ps[4].goodsId);
				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[4]).text(ps[3].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[2]).text(ps[4].goodsName);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[2]).text("."+ps[4].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[2]).text(ps[4].price1.split('.')[0]).append(a);
			}else if(ps.length==6){
				$($("#activity-navigator-3 .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3 .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3 .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3 .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);
				$($("#activity-navigator-3 .activity-product a")[2]).attr("href","#/product/"+ps[4].goodsId);
				$($("#activity-navigator-3 .activity-product a")[5]).attr("href","#/product/"+ps[5].goodsId);

				$($("#activity-navigator-3 .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span3")[4]).text(ps[3].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[2]).text(ps[4].goodsName);
				$($("#activity-navigator-3 .activity-product a .title-span1")[5]).text(ps[5].goodsName);
				
				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[2]).text("."+ps[4].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[2]).text(ps[4].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3 .activity-product a .title-span2 .title-span2-1")[5]).text("."+ps[5].price1.split('.')[1]);
				$($("#activity-navigator-3 .activity-product a .title-span2")[5]).text(ps[0].price1.split('.')[5]).append(a);

			}
		}
	}
}

function initActivitCarouselPage(acts,isLoaded){
	var isHave=true;
	if(acts==null || !acts.length || acts.length<1){
		acts=[{},{},{}];
		isHave=false;
	}
	$('#index-slider-page .pic_group').empty();
	$("#index-serial-number-page").empty();
	for(var i=0;i<acts.length;i++){
		var act=acts[i];				
		var $img = $('<img />');
		var $div = $('<div class="item-block"></div>');
		var $a=$('<a />');
		var $item = $('<div class="item"></div>');
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');
		if(isLoaded && isHave){
			$img.attr("src", "/image/activity/2-"+(i+1)+".png");				
			$a.attr("href","#/product/"+act.goodsId);
			//$a.attr("target","_blank");
			$a.attr("title",act.name);
			$a.append($img);
			$item.append($a);
		}else{
			$img.attr("src","/image/activity/2-"+(i+1)+".png");
			$a.append($img);
			$item.append($a);
		}

		$('#index-slider-page .pic_group').append($item);

		var $span=$("<span />");
		$span.addClass("point");
		$("#index-serial-number-page").append($span);
	}
	if(acts.length<2){
		$("#index-serial-number-page").addClass("hide");
	}
	$('#index-slider-page').cycle({
		fx: 'scrollHorz',
		pager: '#pagination',
		speed: 300,
		timeout: 3000,
		stopAutoPlay: false,
		slideExpr: '.item',
		pagerAnchorBuilder: null,
		prev: '.arrow_l',
		next: '.arrow_r',
		clearCycleTimeOutBefore: true,
		startingSlide: 0,
		pageTurnEvent: function (i) {
			$("#index-serial-number-page span").removeClass("selected");
			$($("#index-serial-number-page span")[i]).addClass("selected");
		}                    
	});
}
function initActivitDescriptionPage(act,isLoaded){
	//$("#activity-navigator-1").empty();
	if(!isLoaded){
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');		
		$("#activity-navigator-1-page").css("min-height","9em");
		var $img = $('<img />');
		$img.attr("src", "/image/activity/1.png");
		$("#activity-navigator-1-page").append($img);
	}else{
		var $img = $('<img />');
		$img.attr("src", act.img);
		$("#activity-navigator-1-page").append($img);
	}
}
function initActivitProductsPage(ps,isLoaded){
	//$("#activity-navigator-3").empty();
	if(!isLoaded){
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-1.png");
		$a.append($img);

		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);
		
		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);		

		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-3.png");
		$a.append($img);

		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title2.png");
		$imgTitle.addClass("title-img2");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-5.png");
		$a.append($img);
		
		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-2.png");
		$a.append($img);

		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);
		
		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-4.png");
		$a.append($img);

		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title2.png");
		$imgTitle.addClass("title-img2");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-6.png");
		$a.append($img);

		var $imgTitle = $('<img />');
		$imgTitle.attr("src", "/image/activity/3-1-title1.png");
		$imgTitle.addClass("title-img1");
		$a.append($imgTitle);

		var $span=$('<span class="title-span1"></span>');
		$a.append($span);				
		var $span=$('<span class="title-span2"></span>');
		$span.append($('<span class="title-span2-1"></span>'));
		$a.append($span);
		var $span=$('<span class="title-span3"></span>');
		$a.append($span);

		$div.append($a);
							
		$("#activity-navigator-3-page").append($div);


		var $divClear=$('<div class="clear"></div>');
		$("#activity-navigator-3-page").append($divClear);

	}else{
		if(ps && ps.length){
			if(ps.length==1){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);				
				
				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);
				
			}else if(ps.length==2){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);

				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[3]).text(ps[1].goodsName);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);
			
			}else if(ps.length==3){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);

				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[1]).text(ps[2].goodsName);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

			}else if(ps.length==4){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);

				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[4]).text(ps[3].goodsName);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				
			}else if(ps.length==5){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[2]).attr("href","#/product/"+ps[4].goodsId);

				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[4]).text(ps[3].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[2]).text(ps[4].goodsName);


				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[2]).text("."+ps[4].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[2]).text(ps[4].price1.split('.')[0]).append(a);
			}else if(ps.length==6){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","#/product/"+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","#/product/"+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","#/product/"+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","#/product/"+ps[3].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[2]).attr("href","#/product/"+ps[4].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[5]).attr("href","#/product/"+ps[5].goodsId);

				$($("#activity-navigator-3-page .activity-product a .title-span1")[0]).text(ps[0].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[3]).text(ps[1].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[1]).text(ps[2].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span3")[4]).text(ps[3].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[2]).text(ps[4].goodsName);
				$($("#activity-navigator-3-page .activity-product a .title-span1")[5]).text(ps[5].goodsName);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[0]).text("."+ps[0].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[0]).text(ps[0].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[3]).text("."+ps[1].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[3]).text(ps[1].price1.split('.')[0]).append(a);

				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[2]).text("."+ps[4].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[2]).text(ps[4].price1.split('.')[0]).append(a);
				
				var a=$($("#activity-navigator-3-page .activity-product a .title-span2 .title-span2-1")[5]).text("."+ps[5].price1.split('.')[1]);
				$($("#activity-navigator-3-page .activity-product a .title-span2")[5]).text(ps[0].price1.split('.')[5]).append(a);

			}
		}
	}
}



function initActivitCarouselApp(acts,isLoaded){
	var isHave=true;
	if(acts==null || !acts.length || acts.length<1){
		acts=[{}];
		isHave=false;
	}
	$('#index-slider-page .pic_group').empty();
	$("#index-serial-number-page").empty();
	for(var i=0;i<acts.length;i++){
		var act=acts[i];				
		var $img = $('<img />');
		var $div = $('<div class="item-block"></div>');
		var $a=$('<a />');
		var $item = $('<div class="item"></div>');
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');
		if(isLoaded && isHave){
			$img.attr("src", "/image/activity/2-"+(i+1)+".png");				
			$a.attr("href","gouactivity://?action=1&goodId="+act.goodsId);
			//$a.attr("target","_blank");
			$a.attr("title",act.name);
			$a.append($img);
			$item.append($a);
		}else{
			$img.attr("src","/image/activity/2-1.png");
			$a.append($img);
			$item.append($a);
		}

		$('#index-slider-page .pic_group').append($item);

		var $span=$("<span />");
		$span.addClass("point");
		$("#index-serial-number-page").append($span);
	}
	if(acts.length<2){
		$("#index-serial-number-page").addClass("hide");
	}
	$('#index-slider').cycle({
		fx: 'scrollHorz',
		pager: '#pagination',
		speed: 300,
		timeout: 3000,
		stopAutoPlay: false,
		slideExpr: '.item',
		pagerAnchorBuilder: null,
		prev: '.arrow_l',
		next: '.arrow_r',
		clearCycleTimeOutBefore: true,
		startingSlide: 0,
		pageTurnEvent: function (i) {
			$("#index-serial-number-page span").removeClass("selected");
			$($("#index-serial-number-page span")[i]).addClass("selected");
		}                    
	});
}
function initActivitDescriptionApp(act,isLoaded){
	//$("#activity-navigator-1").empty();
	if(!isLoaded){
		var $i=$('<i class="fa fa-spinner fa-spin"></i>');		
		$("#activity-navigator-1-page").css("min-height","9em");
		var $img = $('<img />');
		$img.attr("src", "/image/activity/1.png");
		$("#activity-navigator-1-page").append($img);
	}else{
		var $img = $('<img />');
		$img.attr("src", act.img);
		$("#activity-navigator-1-page").append($img);
	}
}
function initActivitProductsApp(ps,isLoaded){
	//$("#activity-navigator-3").empty();
	if(!isLoaded){
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-1.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-3.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-5.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-2.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-4.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);
		//////////////////////////////////////////////////////			
		var $div=$('<div class="activity-product"></div>');
		$div.css("min-height","3em");
		var $a=$('<a />');				
		var $img = $('<img />');
		$img.attr("src", "/image/activity/3-6.png");
		$a.append($img);
		$div.append($a);					
		$("#activity-navigator-3-page").append($div);


		var $divClear=$('<div class="clear"></div>');
		$("#activity-navigator-3-page").append($divClear);

	}else{
		if(ps && ps.length){
			if(ps.length==1){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
			}else if(ps.length==2){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","gouactivity://?action=1&goodId="+ps[1].goodsId);
			}else if(ps.length==3){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","gouactivity://?action=1&goodId="+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","gouactivity://?action=1&goodId="+ps[2].goodsId);
			}else if(ps.length==4){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","gouactivity://?action=1&goodId="+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","gouactivity://?action=1&goodId="+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","gouactivity://?action=1&goodId="+ps[3].goodsId);
			}else if(ps.length==5){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","gouactivity://?action=1&goodId="+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","gouactivity://?action=1&goodId="+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","gouactivity://?action=1&goodId="+ps[3].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[2]).attr("href","gouactivity://?action=1&goodId="+ps[4].goodsId);
			}else if(ps.length==6){
				$($("#activity-navigator-3-page .activity-product a")[0]).attr("href","gouactivity://?action=1&goodId="+ps[0].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[3]).attr("href","gouactivity://?action=1&goodId="+ps[1].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[1]).attr("href","gouactivity://?action=1&goodId="+ps[2].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[4]).attr("href","gouactivity://?action=1&goodId="+ps[3].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[2]).attr("href","gouactivity://?action=1&goodId="+ps[4].goodsId);
				$($("#activity-navigator-3-page .activity-product a")[5]).attr("href","gouactivity://?action=1&goodId="+ps[5].goodsId);
			}
		}
	}
}