module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		//Read the package.json (optional)
		//pkg: grunt.file.readJSON('package.json'),

		//Metadata
		meta: {
			sassPath:'cass',
			cssPath: 'static/css'
		},

		//Task configration
		sass: {
			dist: {
				files: {
		    		'public/css/login.css': 'src/sass/login.scss',
		    		'public/css/chat.css': 'src/sass/chat.scss'
    			}
			}
		}

	});
	grunt.registerTask('default', ['sass']);
}