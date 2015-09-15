/**
 *
 * @authors 吴儒林 (49106868@qq.com,http://wurulin.com)
 * @date    2014-07-07 17:58:40
 * @version $Id$
 */


$(document).ready(function() {

    //防止误缩放
    window.onkeydown = function() {

        if (window.event.keyCode == 17) {
            window.event.keyCode = 0;
        }
        if (window.event.keyCode == 91) {
            window.event.keyCode = 0;
        }
    };

    //翻屏插件
    $('#fullpage').fullpage({
        verticalCentered: true,
        resize: false,
        /* sectionsColor: ['#fcaf03', '#75e0b9', '#5aa3e0', '#ff6f4d'],*/
        scrollingSpeed: 800,
        easing: 'easeInOutCirc',
        menu: false,
        navigation: true,
        navigationPosition: 'right',
        slidesNavigation: true,
        slidesNavPosition: 'bottom',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        autoScrolling: true,
        scrollOverflow: false,
        css3: true,
        paddingTop: '0px',
        paddingBottom: '0em',
        normalScrollElementTouchThreshold: 5,
        keyboardScrolling: true,
        touchSensitivity: 15,
        continuousVertical: false,
        animateAnchor: true,
        sectionSelector: '.section',
        slideSelector: '.slide',

        //events
        onLeave: function(index, nextIndex, direction) {
            //alert(nextIndex)
            jianyin(nextIndex);
            changebg(nextIndex);
        },
        afterLoad: function(anchorLink, index) {
            run(index);
            svg(index);
        },
        afterRender: function() {
            //run(1);
        },
        afterResize: function() {},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {},
        onSlideLeave: function(anchorLink, index, slideIndex, direction) {}
    });

    //延迟100毫秒执行第一真
    setTimeout(function() {
        run(1);
    }, 100);
    //翻过去的渐隐
    var section = $('.section');

    function jianyin(nextIndex) {
        //alert(nextIndex)
        switch (nextIndex) {
            case 1:
                $(section[3]).addClass('pagehide').removeClass('pageshow');
                $(section[0]).removeClass('pagehide').addClass('pageshow');
                break;
            case 2:
                $(section[0]).addClass('pagehide').removeClass('pageshow');
                $(section[1]).removeClass('pagehide').addClass('pageshow');
                break;
            case 3:
                $(section[1]).addClass('pagehide').removeClass('pageshow');
                $(section[2]).removeClass('pagehide').addClass('pageshow');
                break;
            case 4:
                $(section[2]).addClass('pagehide').removeClass('pageshow');
                $(section[3]).removeClass('pagehide').addClass('pageshow');
                break;
            default:
                break;
        }
    }
    //执行翻页内容
    function run(index) {
        $('.page1').find('*').css('animationPlayState', 'paused');
        $('.page2').find('*').css('animationPlayState', 'paused');
        $('.page3').find('*').css('animationPlayState', 'paused');
        $('.page4').find('*').css('animationPlayState', 'paused');
        $('.page' + index).find('*').css('animationPlayState', 'running');

    }
    //改变背景
    function changebg(index) {
        // alert(index)
        switch (index) {
            case 1:
                $('body').css('background', '#FCAF03');
                break;
            case 2:
                $('body').css('background', '#75e0b9');
                break;
            case 3:
                $('body').css('background', '#5aa3e0');
                break;
            case 4:
                $('body').css('background', '#ff6f4d');
                break;
            default:
                break;
        }

    }
    //svg的动画执行
    function svg(index) {
        if (index == 2) {
            $('.page2 .line path').css('animationPlayState', 'running');
        }
        if (index == 3) {
            $('.computersvg  path').css('animationPlayState', 'running');
        }

    }


    //resize
    function resize() {
        var clientHeight = document.documentElement.clientHeight;

        if (clientHeight <= 700) {
            $('.page1').css({
                'transform': 'scale(0.8)',
                '-webkit-transform': 'scale(0.8)',
                'margin': '0px 0px 0px -84px'
            });
            $('.page2').css({
                'transform': 'scale(0.8)',
                '-webkit-transform': 'scale(0.8)'
            });
            $('.page3').css({
                'transform': 'scale(0.8)',
                '-webkit-transform': 'scale(0.8)',
                'margin': '0px 0px 0px -84px'
            });
            $('.page4').css({
                'transform': 'scale(0.8)',
                '-webkit-transform': 'scale(0.8)',
                'margin': '0px -91px 0px 0px'
            });
            $('.page3 .huxian1box').css('left', '1px');

            /*$('.nav').css({
                'width': '900px'
            });*/
            $('.page').css({
                'width': '900px'
            });
        } else {
            $('.page1').css({
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)',
                'margin': '0px 0px 0px 0px'
            });
            $('.page2').css({
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)'
            });
            $('.page3').css({
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)',
                'margin': '0px 0px 0px 0px'
            });
            $('.page4').css({
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)',
                'margin': '0px 0px 0px 0px'
            });
            $('.page3 .huxian1box').css('left', '0px');

            /*$('.nav').css({
                'width': '1100px'
            });*/
            $('.page').css({
                'width': '1100px'
            });
        }
    }
    resize();
    $(window).resize(function(event) {

        resize();
    });


});
