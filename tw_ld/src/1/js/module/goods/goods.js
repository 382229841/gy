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
