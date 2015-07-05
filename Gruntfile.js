module.exports = function(grunt) 
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files:[{
					'public/js/build/name.js': ['public/js/src/name.js']
				}]
			}
		},
		sass: {
			dist: {
				options: { 
					style: 'expanded'
				},
				files: {
					'public/css/dataUriConverter.css': 'public/css/dataUriConverter.scss',
					'public/css/collection.css': 'public/css/collection.scss',
					'public/css/common.css': 'public/css/common.scss',
					'public/css/name.css': 'public/css/name.scss',
					'public/css/crawler.css': 'public/css/crawler.scss',
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			files: {
				expand: true,
				flatten: true,
				src: 'public/css/*.css',
				dest: 'public/css/'
			}
		},
		watch: {
			scripts: {
				files: ['public/js/src/*.js'],
				tasks: ['uglify']
			},
			scss: {
				files: ['public/css/*.scss'],
				tasks: ['sass','autoprefixer']
			}
		},
		copy:{
			main:{
				files:[
					{expand: true, cwd: 'node_modules/jquery/dist/', src: 'jquery*' , dest: 'public/vendor/'},
					{expand: true, cwd: 'node_modules/handlebars/dist/', src: 'handlebars*' , dest: 'public/vendor/'},
					{expand: true, cwd: 'node_modules/underscore/', src: 'underscore*' , dest: 'public/vendor/'},
					{expand: true, cwd: 'node_modules/backbone/', src: 'backbone*' , dest: 'public/vendor/'},
					{expand: true, cwd: 'node_modules/requirejs/', src: 'require*' , dest: 'public/vendor/'},
					{expand: true, cwd: 'node_modules/bootstrap/dist/css/', src: 'bootstrap*.css' , dest: 'public/vendor/'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['uglify']);
};
