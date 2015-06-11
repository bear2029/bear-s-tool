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
					'public/css/name.css': 'public/css/name.scss',
				}
			}
		},
		watch: {
			scripts: {
				files: ['public/js/src/*.js'],
				tasks: ['uglify']
			},
			scss: {
				files: ['public/css/*.scss'],
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify']);
};
