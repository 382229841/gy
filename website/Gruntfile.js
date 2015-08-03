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
				'src/<%= pkg.version%>/js/controller/index.js': [
					'src/<%= pkg.version%>/js/service/dataServices.js',
					'src/<%= pkg.version%>/js/controller/controller.js'
				]
			}
		},
		css: {
			files: {
			  "src/<%= pkg.version%>/temp/index.css": ["src/<%= pkg.version%>/css/uikit.min.css","src/<%= pkg.version%>/css/font-awesome.min.css","src/<%= pkg.version%>/css/layout.css"]
			}
		}
	},
	uglify: {		
		builda: {
			options: {
				mangle: false, 
			},
			files: {
				'dest/<%= pkg.version%>/js/index.min.js': ['src/<%= pkg.version%>/js/controller/index.js'],
				'dest/<%= pkg.version%>/js/app.min.js': ['src/<%= pkg.version%>/js/app.js'],
			}
		},
		buildb:{
			files: {
			    'dest/<%= pkg.version%>/js/libs.min.js': [
				'src/<%= pkg.version%>/js/lib/jquery/jquery.min.js',
				'src/<%= pkg.version%>/js/lib/jquery/jquery.scrollTo.js',
				'src/<%= pkg.version%>/js/lib/uikit.min.js',
				'src/<%= pkg.version%>/js/lib/angular.min.js',
				'src/<%= pkg.version%>/js/lib/angular-route.min.js'
				],
			    'dest/<%= pkg.version%>/js/mains.min.js': ['src/<%= pkg.version%>/js/common.js']
			}
		}
	},
	copy: {
	  main: {
		files:[
			{expand: true,flatten: false, cwd:'src/<%= pkg.version%>/images',  src: '**', dest: 'dest/<%= pkg.version%>/images/'},
			{expand: true,flatten: false, cwd:'src/<%= pkg.version%>/views',  src: '**', dest: 'dest/<%= pkg.version%>/views/'},
			{expand: true,flatten: true, cwd:'src/<%= pkg.version%>/fonts', src: '**', dest: 'dest/<%= pkg.version%>/fonts/'},
			{expand: true,flatten: true, cwd: 'src/<%= pkg.version%>/login/p', src: '**', dest: 'dest/<%= pkg.version%>/login'},
			{expand: true,flatten: true, src: ['src/<%= pkg.version%>/p/index.html'], dest: 'dest/<%= pkg.version%>/p'}
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
          port: 3000,
          base: ['.', 'dest/1.7.0'],
          keepalive: true
        }
      }
    },
	
  });
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-contrib-concat");  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  
  grunt.registerTask('build', [ 'concat:combinea','concat:css','uglify:builda', 'uglify:buildb', 'cssmin','copy']);
  grunt.registerTask('demo', ['concurrent:devel']);
  // 默认任务
  grunt.registerTask('default', ['concat:combinea','concat:css','uglify:builda', 'uglify:buildb', 'cssmin','copy','concurrent:devel']);
}
//http://www.cnblogs.com/artwl/p/3449303.html