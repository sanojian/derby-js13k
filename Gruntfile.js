/**
 * Created by jonas on 2015-08-14.
 */

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({

		watch: {
			scripts: {
				files: [
					'src/*.js',
					'src/lib/*.js',
					'src/server/*.js',
					'dist/index.html'
				],
				tasks: ['build']
			}
		},
		jshint: {
			options: {
				evil: true
			},
			all: ['src/*.js']
		},
		concat: {
			basic_and_extras: {
				files: {
					'dist/derby.js': [
						'src/RigidBody.js',
						'src/Vehicle.js',
						'src/Car.js',
						'src/*.js',
						'src/lib/*.js'
					],
					'../js-game-server/examples/derby/game/derby.js': ['dist/derby.js'],
					'../js-game-server/examples/derby/game/server.js': ['src/server/server.js'],
					'../js-game-server/examples/derby/game/index.html': ['dist/index.html']
				}
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/derby.min.js': ['dist/derby.js'],
					'../js-game-server/examples/derby/game/derby.min.js': ['dist/derby.js']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-ssh');
	grunt.registerTask('monitor', [
		'watch'
	]);

	grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
	grunt.registerTask('default', ['build','monitor']);

};
