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
        return JSON.parse(localStorage.getItem(easybuy.Storage.SearchLocalItems));
    }

    return null;
}

function setSearchLocalItems(items) {
    if (localStorage) {
        try {
            if (items) {
				var newItems=[];
				for(var i=0;i<items.length;i++){
					var isContain=false;
					for(var j=0;j<newItems.length;j++){
						if(newItems[j].value==items[i].value){
							isContain=true;
							continue;
						}
					}
					if(!isContain){
						newItems.push(items[i]);
					}
				}
                localStorage.setItem(easybuy.Storage.SearchLocalItems, JSON.stringify(newItems));
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
