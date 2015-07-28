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
