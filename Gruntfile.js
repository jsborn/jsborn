module.exports = function(grunt) {
	grunt.initConfig({
		// ---
		// Variables
		// ---

		pkg: grunt.file.readJSON('package.json'),

		dirs: {
			src: 'src',
			dist: 'dist',
            test: 'tests'
		},

		banner: [
			'/*!',
			' * JSBorn (<%= pkg.homepage %>)',
			' * <%= pkg.description %>',
			' *',
			' * @version     v<%= pkg.version %>, built on <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>',
			' * @author      tureki <%= pkg.author.url %>',
			' * @copyright   (c) 2013 - <%= grunt.template.today("yyyy") %> Tureki',
			' * @license     Apache-2.0',
			' */\n'
		].join('\n'),

		// ---
		// Tasks
		// ---

		copy: {
            main: {
                files: [
                    { cwd: '<%= dirs.src %>/', src: '**', dest: '<%= dirs.dist %>/', expand: true, flatten: true, filter: 'isFile' },
                ]
            }
        },

		mustache_render: {
			all: {
				options:{
					extension:".html"
				},
				files: [{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/common.html",
					dest: "<%= dirs.test %>/jquery/test-common.html"
				},{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/import.html",
					dest: "<%= dirs.test %>/jquery/test-import.html"
				},{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/extend.html",
					dest: "<%= dirs.test %>/jquery/test-extend.html"
				},{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/plugin.html",
					dest: "<%= dirs.test %>/jquery/test-plugin.html"
				},{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/tpl.html",
					dest: "<%= dirs.test %>/jquery/test-tpl.html"
				},{
					data:"<%= dirs.test %>/jquery/data.json",
					template: "<%= dirs.test %>/templates/css.html",
					dest: "<%= dirs.test %>/jquery/test-css.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/common.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-common.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/import.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-import.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/extend.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-extend.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/plugin.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-plugin.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/tpl.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-tpl.html"
				},{
					data:"<%= dirs.test %>/jquery.1.6/data.json",
					template: "<%= dirs.test %>/templates/css.html",
					dest: "<%= dirs.test %>/jquery.1.6/test-css.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/common.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-common.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/import.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-import.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/extend.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-extend.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/plugin.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-plugin.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/tpl.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-tpl.html"
				},{
					data:"<%= dirs.test %>/jquery.1.7/data.json",
					template: "<%= dirs.test %>/templates/css.html",
					dest: "<%= dirs.test %>/jquery.1.7/test-css.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/common.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-common.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/import.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-import.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/extend.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-extend.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/plugin.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-plugin.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/tpl.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-tpl.html"
				},{
					data:"<%= dirs.test %>/jquery.1.8/data.json",
					template: "<%= dirs.test %>/templates/css.html",
					dest: "<%= dirs.test %>/jquery.1.8/test-css.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/common.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-common.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/import.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-import.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/extend.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-extend.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/plugin.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-plugin.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/tpl.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-tpl.html"
				},{
					data:"<%= dirs.test %>/jquery.1.9/data.json",
					template: "<%= dirs.test %>/templates/css.html",
					dest: "<%= dirs.test %>/jquery.1.9/test-css.html"
				}]
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			build: {
				src: ['<%= dirs.dist %>/jsborn.js'],
				dest: '<%= dirs.dist %>/jsborn.min.js'
			}
		},

		jshint: {
			all: [
				'<%= dirs.src %>/**.js'
			],
			options: {
				browser: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				es3: true,
				expr: true,
				laxbreak: true,
				loopfunc: true,
				newcap: true,
				noarg: true,
				// undef: true,
				sub: true,
				white: true
			}
		},
		
		qunit: {
			options: {
				'--web-security': 'no',
				coverage: {
					disposeCollector: true,
					src: [
						'<%= dirs.src %>/**.js'
					],
					instrumentedFiles: 'temp/',
					htmlReport: 'build/report/coverage',
					lcovReport: "build/report/lcov",
					linesThresholdPct: 95,
					functionsThresholdPct: 95,
					branchesThresholdPct: 90,
					statementsThresholdPct: 95,
				}
			},
			all: [
				'<%= dirs.test %>/jquery/**.html',
				// '<%= dirs.test %>/jquery.1.9/**.html',
				// '<%= dirs.test %>/jquery.1.8/**.html',
				// '<%= dirs.test %>/jquery.1.7/**.html',
				'<%= dirs.test %>/jquery.1.6/**.html'
			]
		},

		coveralls: {
			options: {
				force: true
			},
			main_target: {
				src: "build/report/lcov/lcov.info"
			}
		},

		watch: {
			source: {
				files: ['<%= dirs.src %>/**','<%= dirs.test %>/**'],
				tasks: ['build'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.registerTask('default', 'build');
	// grunt.registerTask('build',   ['copy', 'jshint', 'uglify']);
	// grunt.registerTask('build',   ['copy', 'uglify', 'jshint','mustache_render','qunit','coveralls']);
	grunt.registerTask('build',   ['copy', 'uglify', 'jshint','mustache_render','qunit']);
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-coveralls');
	grunt.loadNpmTasks('grunt-mustache-render');
	grunt.loadNpmTasks('grunt-qunit-istanbul');
};