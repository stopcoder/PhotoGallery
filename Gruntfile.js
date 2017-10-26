module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{expand: true, cwd: "node_modules/whatwg-fetch/", src: ["fetch.js"], dest: "public/js/"},
					{expand: true, cwd: "node_modules/jquery/dist/", src:["jquery.min.js"], dest: "public/js/"},
					{expand: true, cwd: "node_modules/justifiedGallery/dist/js/", src:["jquery.justifiedGallery.js"], dest: "public/js/"},
					{expand: true, cwd: "node_modules/photoswipe/dist/", src:["photoswipe-ui-default.min.js", "photoswipe.min.js"], dest: "public/js/"},
					{expand: true, cwd: "node_modules/photoswipe/dist/", src:["photoswipe.css"], dest: "public/css/"},
					{expand: true, cwd: "node_modules/photoswipe/dist/", src:["default-skin/**"], dest: "public/css/"},
					{expand: true, cwd: "script/", src:["**"], dest: "public/js/"},
					{expand: true, cwd: "node_modules/justifiedGallery/dist/css/", src:["justifiedGallery.css"], dest: "public/css/"}
				]
			}
		},
		execute: {
			index: {
				src: "index.js"
			}
		}
	});

	// Load the plugin that provides the "copy" task.
	grunt.loadNpmTasks('grunt-contrib-copy');
	// load the execute task for starting the index.js script
	grunt.loadNpmTasks('grunt-execute');

	// Default task(s).
	grunt.registerTask('default', ['copy']);
	// serve task
	grunt.registerTask('serve', ['copy', 'execute:index']);

};
