function loadControl(selector, callback) {
    var _this = this;

    var canvas = $(selector), ctx = canvas[0].getContext('2d');
    var step, startAngle, endAngle;
    ctx.shadowOffsetX = 0; // 设置水平位移
    ctx.shadowOffsetY = 0; // 设置垂直位移
    ctx.shadowBlur = 10; // 设置模糊度
    ctx.lineWidth = 3.0;
    counterClockwise = false;
    var x;
    var y;
    var radius;
    var animation_interval = 40, n = 10, add = Math.PI * 2 / n;
    var varName;
    var stepPause;
    var isWorking = false;
    var iRotate = 1;

    //圆心位置
    x = canvas.width() / 2;
    y = canvas.height() / 2;
    radius = (canvas.width() < canvas.height() ? canvas.width() : canvas.height()) / 2 - 5;

    drawBackground();

    var animation = function () {
        if ($(selector).length == 0) {
            clearInterval(varName);
            varName = null;
            return;
        }

        if (step <= n) {
            if (stepPause && stepPause > 0 && step > stepPause) {
                return;
            }
            endAngle = startAngle + add;
            drawArc(step <= 1 ? startAngle : startAngle - Math.PI / 200, endAngle);
            startAngle = endAngle;
            step++;
        } else {
            //            clearInterval(varName);
            //            varName = null;
            if (step == n + 1) {
                step++;
                iRotate = 1;
            }

            var angle = 4 * Math.PI / 180;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle * iRotate);
            ctx.translate(-x, -y);

            var startStroke = 1.5 * Math.PI;
            if (iRotate > 1) {
                ctx.clearRect(0, 0, canvas.width(), canvas.height());

                ctx.strokeStyle = '#404A58';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, counterClockwise);
                ctx.stroke();
            }
            ctx.strokeStyle = '#E6E6E6';
            ctx.beginPath();
            ctx.arc(x, y, radius, startStroke, startStroke + Math.PI / 30, counterClockwise);
            ctx.stroke();
            ctx.restore();
            iRotate++;
            if (iRotate >= 360) { iRotate -= 360; }
        }
    };

    function drawArc(s, e) {
        ctx.beginPath();
        ctx.arc(x, y, radius, s, e, counterClockwise);
        ctx.stroke();
    };

    function drawBackground() {
        ctx.strokeStyle = '#E6E6E6';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, counterClockwise);
        ctx.stroke();
    }

    function _clear() {
        if (varName) {
            clearInterval(varName);
            varName = null;
        }
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
        step = 1;
        startAngle = 1.5 * Math.PI;

        drawBackground();
    }

    this.actionDo = function () {
        isWorking = true;
        _clear();

        ctx.strokeStyle = '#404A58'; //'#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6); //圆圈颜色                
        //ctx.shadowColor = '#C7C7C7'; //'#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6); // 设置阴影颜色
        varName = setInterval(animation, animation_interval);
    }

    this.GetStepCount = function () {
        return n;
    }

    this.action = function (step) {
        var needCallback = false;
        if (step != null && step >= n && (stepPause == null || stepPause < n)) {
            needCallback = true;
        }
        stepPause = stepPause == null || stepPause <= step ? step : stepPause;
        if (!isWorking) {
            _this.actionDo();
        }
        if (needCallback) {
            if (callback) {
                callback();
            }
        }
    }

    this.clear = function () {
        if (isWorking) {
            _clear();
            stepPause = null;
            isWorking = false;
        }
    }
}