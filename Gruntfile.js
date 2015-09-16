module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			files: [{
				expand: true, // Enable dynamic expansion.
				cwd: './browserjs',
				src: ['*.app.js','*.app.jsx'], // Actual pattern(s) to match.
				dest: 'public/js/build/',
				ext: '.js', // Dest filepaths will have this extension.
				extDot: 'first'
			}],
			dist: {
				files: '<%= browserify.files %>',
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					transform: [require('grunt-react').browserify]
				}
			},
			watch: {
				files: '<%= browserify.files %>',
				options: {
					watch: true,
					keepAlive: true,
					transform: [require('grunt-react').browserify]
				}
			},
		},
		uglify: {
			buildFolder: {
				files: [{
					expand: true,
					cwd: 'public/js/build',
					src: '**/*.js',
					dest: 'public/js/min'
				}]
			}
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/css/file.css': 'public/css/file.scss',
					'public/css/dataUriConverter.css': 'public/css/dataUriConverter.scss',
					'public/css/collection.css': 'public/css/collection.scss',
					'public/css/common.css': 'public/css/common.scss',
					'public/css/name.css': 'public/css/name.scss',
					'public/css/crawler.css': 'public/css/crawler.scss',
					'public/css/prefixer.css': 'public/css/prefixer.scss',
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
			scss: {
				files: ['public/css/*.scss'],
				tasks: ['sass', 'autoprefixer']
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'lib/*.js', 'public/js/*.js', 'public/js/src/*.js', 'public/js/lib/*.js', 'public/lib/*/*.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		copy: {
			bootstrap: {
				expand: true,
				cwd: 'node_modules/bootstrap/dist/',
				src: '**',
				dest: 'public/vendor/bootstrap/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('build', [
		'jshint',
		'uglify',
		'copy'
	]);
	grunt.registerTask('default', [
		'jshint',
		'browserify:dist',
		'uglify',
		'sass',
		'autoprefixer'
	]);
	grunt.registerTask('devjs', [
		'browserify:watch'
	]);
	grunt.registerTask('devcss', [
		'watch'
	]);
};
