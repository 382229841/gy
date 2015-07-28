module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	concat:{
		combinea: {
			options: {
				mangle: false, 
			},
			files: {
				'src/<%= pkg.version%>/js/controller/shoppingController.js': 
							[
								'src/<%= pkg.version%>/js/controller/nav/nav.js',
								'src/<%= pkg.version%>/js/controller/goods/goods.js',
								'src/<%= pkg.version%>/js/controller/cart/cart.js',								
								'src/<%= pkg.version%>/js/controller/order/order.js',
								'src/<%= pkg.version%>/js/controller/pay/pay.js',
								'src/<%= pkg.version%>/js/controller/user/user.js',
								'src/<%= pkg.version%>/js/controller/wechat/wechat.js'
							]
			}
		},
		combineb:{
			files: {
			    'src/<%= pkg.version%>/js/module/shoppingModule.js': 
							[
								'src/<%= pkg.version%>/js/module/nav/nav.js',
								'src/<%= pkg.version%>/js/module/goods/goods.js',
								'src/<%= pkg.version%>/js/module/cart/cart.js',
								'src/<%= pkg.version%>/js/module/activity/activity.js',
								'src/<%= pkg.version%>/js/module/app/apppages.js',
								'src/<%= pkg.version%>/js/module/order/order.js',
								'src/<%= pkg.version%>/js/module/pay/pay.js',
								'src/<%= pkg.version%>/js/module/user/user.js',
								'src/<%= pkg.version%>/js/module/wechat/wechat.js'
							]
			}
		},
		css: {
			files: {
			  "src/<%= pkg.version%>/temp/easybuy.css": 
							[
								"src/<%= pkg.version%>/css/normalize.css",
								"src/<%= pkg.version%>/css/mobile-angular-ui-base.css",
								"src/<%= pkg.version%>/css/mobiscroll.custom-2.6.2.min.css",
								"src/<%= pkg.version%>/css/layout.css",
								"src/<%= pkg.version%>/css/layout2.css",
								"src/<%= pkg.version%>/css/load.css"
							]
			}
		}
	},
	uglify: {		
		builda: {
			options: {
				mangle: false, 
			},
			files: {
				'dest/<%= pkg.version%>/js/controller/shoppingController.min.js': 
							[
								'src/<%= pkg.version%>/js/controller/shoppingController.js'
							],
				'dest/<%= pkg.version%>/js/app.min.js': 
							[
								'src/<%= pkg.version%>/js/app.js'
							],
				'dest/<%= pkg.version%>/js/controller/activity/activity.js': 
							[
								'src/<%= pkg.version%>/js/controller/activity/activity.js',
							],
				'dest/<%= pkg.version%>/js/controller/activity/activityDown.js': 
							[
								'src/<%= pkg.version%>/js/controller/activity/activityDown.js',
							],
				'dest/<%= pkg.version%>/js/controller/activity/fullGive.js': 
							[
								'src/<%= pkg.version%>/js/controller/activity/fullGive.js',
							],
				'dest/<%= pkg.version%>/js/controller/app/apppages.js': 
							[
								'src/<%= pkg.version%>/js/controller/app/apppages.js',
							]
			}
		},
		//类库
		buildb:{
			files: {
				'dest/<%= pkg.version%>/lib/iscroll.js': 
							[
								'src/<%= pkg.version%>/lib/iscroll.js'
							],
				'dest/<%= pkg.version%>/lib/angular.min.js': 
							[
								'src/<%= pkg.version%>/lib/angular.min.js'
							],
				'dest/<%= pkg.version%>/lib/mobiscroll.custom-2.6.2.js': 
							[
								'src/<%= pkg.version%>/lib/mobiscroll.custom-2.6.2.js',
							],
			    'dest/<%= pkg.version%>/lib/libs.min.js': 
							[								
							   'src/<%= pkg.version%>/lib/script.min.js',
							   'src/<%= pkg.version%>/lib/angular-route.min.js',
							   'src/<%= pkg.version%>/lib/angular-touch.min.js',
							   'src/<%= pkg.version%>/lib/mobile-angular-ui.js',
							   'src/<%= pkg.version%>/lib/jquery/jquery-2.1.1.min.js',
							   //'src/<%= pkg.version%>/lib/jquery/jquery.alerts.js', 
							   //'src/<%= pkg.version%>/lib/jquery/jquery.cookie.js', 
							   'src/<%= pkg.version%>/lib/jquery/jquery.md5.js',
							   'src/<%= pkg.version%>/lib/jquery/jquery.sha1.js', 
							   'src/<%= pkg.version%>/lib/jquery/jquery.raty.min.js', 
							   'src/<%= pkg.version%>/lib/date.format.js',
							   //'src/<%= pkg.version%>/lib/mobiscroll.custom-2.6.2.js', 
							   'src/<%= pkg.version%>/lib/jgestures.min.js'
						   ],
			    //'dest/<%= pkg.version%>/lib/libs.min.js': ['src/<%= pkg.version%>/lib/angular-route.min.js', 'src/<%= pkg.version%>/lib/angular-touch.min.js', 'src/<%= pkg.version%>/lib/mobile-angular-ui.js', 'src/<%= pkg.version%>/lib/jquery/jquery-2.1.1.min.js', 'src/<%= pkg.version%>/lib/jquery/jquery-ui-1.10.4.custom.min.js', 'src/<%= pkg.version%>/lib/jquery/jquery.alerts.js', 'src/<%= pkg.version%>/lib/jquery/jquery.cookie.js', 'src/<%= pkg.version%>/lib/jquery/jquery.md5.js','src/<%= pkg.version%>/lib/jquery/jquery.sha1.js', 'src/<%= pkg.version%>/lib/jquery/jquery.raty.min.js', 'src/<%= pkg.version%>/lib/date.format.js','src/<%= pkg.version%>/lib/mobiscroll.custom-2.6.2.js', 'src/<%= pkg.version%>/lib/jgestures.min.js', 'src/<%= pkg.version%>/lib/jquery/jquery.mobile.touch.js', 'src/<%= pkg.version%>/lib/jquery/jquery.cycle.min.js'],
				'dest/<%= pkg.version%>/js/mains.min.js': 
							[
								'src/<%= pkg.version%>/js/extensions.js', 
								'src/<%= pkg.version%>/js/common.js', 
								'src/<%= pkg.version%>/js/main.js', 
								'src/<%= pkg.version%>/js/const.js', 
								'src/<%= pkg.version%>/js/service/dataServices.js',
								'src/<%= pkg.version%>/js/service/dataSignService.js',
								'src/<%= pkg.version%>/js/service/dataSignWeixin.js',
								'src/<%= pkg.version%>/js/module/shoppingModule.js',
								'src/<%= pkg.version%>/js/load.js'
							]
			}
		}
	},
	copy: {
	  main: {
		files:[
			{expand: true,flatten: false, cwd:'src/<%= pkg.version%>/image',  src: '**', dest: 'dest/<%= pkg.version%>/image/'},
			{expand: true,flatten: false, cwd:'src/<%= pkg.version%>/views',  src: '**', dest: 'dest/<%= pkg.version%>/views/'},
			{expand: true,flatten: false, cwd:'src/<%= pkg.version%>/pages',  src: '**', dest: 'dest/<%= pkg.version%>/pages/'},
			{expand: true,flatten: true, cwd:'src/<%= pkg.version%>/fonts', src: '**', dest: 'dest/<%= pkg.version%>/fonts/'},
			{expand: true,flatten: true, src: ['src/<%= pkg.version%>/js/config.js'], dest: 'dest/<%= pkg.version%>/js/'},
			{expand: true,flatten: true, src: ['src/<%= pkg.version%>/css/*.png','src/<%= pkg.version%>/css/*.jpg'], dest: 'dest/<%= pkg.version%>/css/'},
			{expand: true,flatten: true, src: ['src/<%= pkg.version%>/css/landscape.css'], dest: 'dest/<%= pkg.version%>/css/'}			
		],
	  },
	},
	//压缩css
	cssmin: {
		//文件头部输出信息
		options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			//美化代码
			beautify: {
				//中文ascii化，非常有用！防止中文乱码的神配置
				ascii_only: true
			},
			report: 'min'
		},
		my_target: {
			files: [
				{
					expand: true,
					//相对路径
					cwd: 'src/<%= pkg.version%>/temp/',
					src: ['*.css', '!*.min.css'],
					dest: 'dest/<%= pkg.version%>/css',
					ext: '.min.css'
				}
			]
		}
	}
  });
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 默认任务
  grunt.registerTask('default', ['concat:combinea','concat:combineb','concat:css','uglify:builda', 'uglify:buildb', 'cssmin','copy']);
}
//http://www.cnblogs.com/artwl/p/3449303.html