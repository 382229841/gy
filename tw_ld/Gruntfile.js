var lodash = require('lodash');

module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	concurrent: {
      devel: {
        tasks: ['connect:demo', 'watch'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      }
    },
	
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
								'src/<%= pkg.version%>/js/controller/user/user.js'
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
								'src/<%= pkg.version%>/js/module/order/order.js',
								'src/<%= pkg.version%>/js/module/pay/pay.js',
								'src/<%= pkg.version%>/js/module/user/user.js'
							]
			}
		},
		css: {
			files: {
			  "src/<%= pkg.version%>/temp/goeasy.css": 
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
				'dest/<%= pkg.version%>/lib/mobiscroll.zepto.js': 
							[
								'src/<%= pkg.version%>/lib/mobiscroll.zepto.js',
							],
			    'dest/<%= pkg.version%>/lib/libs.min.js': 
							[								
							   'src/<%= pkg.version%>/lib/script.min.js',
							   'src/<%= pkg.version%>/lib/angular-route.min.js',
							   'src/<%= pkg.version%>/lib/angular-touch.min.js',
							   'src/<%= pkg.version%>/lib/mobile-angular-ui.js',
							   'src/<%= pkg.version%>/lib/jquery/zepto.min.js',
							   'src/<%= pkg.version%>/lib/jquery/jquery.md5.js',
							   'src/<%= pkg.version%>/lib/jquery/jquery.sha1.js', 
							   'src/<%= pkg.version%>/lib/jquery/jquery.raty.js', 
							   'src/<%= pkg.version%>/lib/date.format.js'//,
							   //'src/<%= pkg.version%>/lib/jgestures.min.js'
						   ],
					'dest/<%= pkg.version%>/js/mains.min.js': 
							[
								'src/<%= pkg.version%>/js/extensions.js', 
								'src/<%= pkg.version%>/js/common.js', 
								'src/<%= pkg.version%>/js/main.js', 
								'src/<%= pkg.version%>/js/const.js', 
								'src/<%= pkg.version%>/js/service/dataServices.js',
								'src/<%= pkg.version%>/js/service/dataSignService.js',
								'src/<%= pkg.version%>/js/module/shoppingModule.js',
								'src/<%= pkg.version%>/js/service/dataSignWeixin.js',
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
	},
	
	watch: {
      all: {
        files: 'src/**/*',
        tasks: ['build']
      }
    },
	
	connect: {
      demo: {
        options: {
          hostname: '0.0.0.0',
          port: 3002,
          base: ['.', 'src/1'],
          keepalive: true
        }
      }
    }
	
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-contrib-concat");  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  
  grunt.registerTask('build', [ 'concat:combinea','concat:combineb','concat:css','uglify:builda', 'uglify:buildb', 'cssmin','copy']);
  grunt.registerTask('demo', ['concurrent:devel']);

  // 默认任务
  grunt.registerTask('default', ['concat:combinea','concat:combineb','concat:css','uglify:builda', 'uglify:buildb', 'cssmin','copy','concurrent:devel']);
}
//http://www.cnblogs.com/artwl/p/3449303.html