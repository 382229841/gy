var dialogTimeOutId = null;
var zoom = 1;
var DialogType = { Default: 0, Image: 1, Success: 2, Prompt: 3,Pay:4,Load:5 };
function openDialog(content, title, buttonArray, type, fn) {
    zoom = 1;
    var dialog = $("<div class='dialog'></div>");
    var mask = $("<div class='mask'></div>");
    var close = $('<img style="display:none;" class="btn-close" src="image/close.png" />');
    mask.appendTo("body");
    dialog.appendTo("body");
    close.appendTo("body");
    close.unbind("click").bind("click", function () {
        closeDialog();
    });
    if (content) {
        if (type == DialogType.Image) {
            mask.addClass("deeper");
            var img = $('<div class="img-large"><img src="' + content + '" /></div>');
            img.appendTo(dialog);
            mask.unbind().bind("click", function () {
                closeDialog();
            });

            img.unbind().bind("pinchopen", function () {
                zoom++;
                zoomImage(mask, img);
            });

            img.bind("pinchclose", function () {
                zoom--;
                zoomImage(mask, img);
            });

            img.bind("click", function () {
                if (zoom == 3) {
                    closeDialog();
                }
                else {
                    zoom = 3;
                    zoomImage(mask, img);
                }
            });
        }
        else if (type == DialogType.Success) {
            var dialogWrap = $("<div class='dialog-success'></div>");
            dialogWrap.appendTo(dialog);
            dialogWrap.append($('<div class="cart-success"></div>'));
            dialogWrap.append($('<span>' + content + '</span>'));
        }
        else if(type == DialogType.Prompt){
            var dialogWrap = $("<div class='dialog-body-bottom'></div>");
            dialogWrap.appendTo(dialog);            
            dialogWrap.append($('#orderNumber').html());
            if(content==="go"){
                $(".dialog .btn-add-to-cart").css("background-color","#f75757");
                $(".dialog .btn-add-to-cart").css("border","1px solid #f75757");   
                $(".dialog .btn-add-to-cart").text("立即购买");    
            }
            if ($(".dialog .btn-add-to-cart").length > 0) {
                $(".dialog .btn-add-to-cart").click(function () {
                    var num=parseInt($(".dialog .dialog-body-bottom .list-group-item .input-num").val());
                    if(fn)
                        fn(num);
                });
            }
            
        }
        else if(type == DialogType.Pay){
            var dialogWrap = $("<div class='dialog-body'></div>");
            var payWay=easybuy.PaymentMethods.AlipayWeb;
            dialogWrap.appendTo(dialog);

            if (title && title != '') {
                var dialogName = $("<h5></h5>");
                dialogName.appendTo(dialogWrap);
                dialogName.text(title);
            }

            dialogWrap.append($('#pay-area').html());
            if (buttonArray && buttonArray.length > 0) {
                dialogWrap.addClass("dialog-confirm");
                var dialogFooter = $("<div class='dialog_footer justified'></div>");
                dialogFooter.appendTo(dialogWrap);
                for (var i = 0; i < buttonArray.length; i++) {
                    var dialogButton = $("<div class='btn' promo='button" + i + "'></div>");
                    dialogButton.append(buttonArray[i]);
                    dialogButton.appendTo(dialogFooter);
                }
            }

            $(".dialog-body .list-group .list-group-item .check-area .radio").bind("click",function(){
                $(".dialog-body .list-group .list-group-item .check-area .radio").removeClass("checked");
                $(this).addClass("checked");
                payWay=parseInt($(this).attr("value"));
            });

            if ($(".dialog .btn").length > 0) {
                $(".dialog .btn").click(function () {
                    $(".mask,.dialog").remove();
                    var flag = $(this).attr("promo").replace("button", "");
                    if (fn) {
                        fn(flag == '1',payWay);
                    }
                });
            }
        }
        else if(type == DialogType.Load){
            var dialogWrap = $("<div class='dialog-body'></div>");
            dialogWrap.appendTo(dialog);

            var matchWord = /html/i;
            if (arguments.length == 1 && matchWord.test(arguments[0])) {
                $(".dialog").addClass("html_text");
                $(".dialog").load('views/' + title);

            } else {
                if (title && title != '') {
                    var dialogName = $("<h5></h5>");
                    dialogName.appendTo(dialogWrap);
                    dialogName.text(title);
                }
                var dialogText = $("<p style='height:3em'></p>");
                dialogText.appendTo(dialogWrap);
                //dialogText.text(content);
                dialogText.html("<i class=\"fa fa-spinner fa-spin loading-spinner\"></i>");                

                if (buttonArray && buttonArray.length > 0) {
                    dialogWrap.addClass("dialog-confirm");
                    var dialogFooter = $("<div class='dialog_footer justified'></div>");
                    dialogFooter.appendTo(dialogWrap);
                    for (var i = 0; i < buttonArray.length; i++) {
                        var dialogButton = $("<div class='btn' promo='button" + i + "'></div>");
                        dialogButton.append(buttonArray[i]);
                        dialogButton.appendTo(dialogFooter);
                    }
                }
            }
            if ($(".dialog .btn").length > 0) {
                $(".dialog .btn").click(function () {
                    $(".mask,.dialog").remove();
                    var flag = $(this).attr("promo").replace("button", "");
                    if (fn) {
                        fn(flag == '1');
                    }
                });
            }
        }
        else {
            var dialogWrap = $("<div class='dialog-body'></div>");
            dialogWrap.appendTo(dialog);

            var matchWord = /html/i;
            if (arguments.length == 1 && matchWord.test(arguments[0])) {
                $(".dialog").addClass("html_text");
                $(".dialog").load('views/' + title);

            } else {
                if (title && title != '') {
                    var dialogName = $("<h5></h5>");
                    dialogName.appendTo(dialogWrap);
                    dialogName.text(title);
                }
                var dialogText = $("<p></p>");
                dialogText.appendTo(dialogWrap);
                dialogText.text(content);

                if (buttonArray && buttonArray.length > 0) {
                    dialogWrap.addClass("dialog-confirm");
                    var dialogFooter = $("<div class='dialog_footer justified'></div>");
                    dialogFooter.appendTo(dialogWrap);
                    for (var i = 0; i < buttonArray.length; i++) {
                        var dialogButton = $("<div class='btn' promo='button" + i + "'></div>");
                        dialogButton.append(buttonArray[i]);
                        dialogButton.appendTo(dialogFooter);
                    }
                }
            }
            if ($(".dialog .btn").length > 0) {
                $(".dialog .btn").click(function () {
                    $(".mask,.dialog").remove();
                    var flag = $(this).attr("promo").replace("button", "");
                    if (fn) {
                        fn(flag == '1');
                    }
                });
            }
        }
    }
}

function zoomImage(mask, img) {
    if (zoom < 1)
        zoom = 1;

    if (zoom > 5)
        zoom = 5;

    if (zoom > 1) {
        img.addClass("larger");
    }
    else {
        img.removeClass("larger");
    }

    mask.css("width", zoom * 100 + "%");
    img.css("width", zoom * 100 + "%");
}

function alertWarning(content) {
    openDialog(content);
    dialogTimeOutId = setTimeout('closeDialog()', 2000);
}

function alertSuccess(content) {
    openDialog(content, null, null, DialogType.Success);
    dialogTimeOutId = setTimeout('closeDialog()', 1500);
}

function alertExt(content,callback) {
    openDialog(content);
    /*dialogTimeOutId = setTimeout(function(){
        if(callback){
            closeDialog();
            callback();
        }
    }, 2000);*/

    var d = setTimeout(function(){
        if(callback){
            callback();
            clearTimeout(d);
            closeDialog()
        }else{
            clearTimeout(d);
            closeDialog()
        }
    }, 3000);
}

function alertLoad() {
    openDialog(true, null, null, DialogType.Load);
}

function openPrompt(content,fn){
    openDialog(content, "", null, DialogType.Prompt,fn);
}

function closeDialog() {
    $(".mask,.dialog,.btn-close").remove();

    if (dialogTimeOutId) {
        clearTimeout(dialogTimeOutId);
    }
    dialogTimeOutId = null;
}

function showLargeImage(imgUrl) {
    openDialog(imgUrl, null, null, DialogType.Image);
}

function showImageLarger(_this) {
    openDialog(_this.src, null, null, DialogType.Image);
}